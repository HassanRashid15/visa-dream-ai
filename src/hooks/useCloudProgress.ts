import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/authContext";

/**
 * useCloudProgress
 * A drop-in replacement for a piece of localStorage-backed state.
 * - Signed-out users: reads/writes localStorage under `localKey`.
 * - Signed-in users: hydrates from `public.user_progress` (kind, key) and
 *   debounced-writes changes back. Falls back to localStorage on error.
 *
 * Returns [value, setValue, meta] so callers can keep the same setState API.
 */
export function useCloudProgress<T>(params: {
  kind: string;
  key: string;
  localKey: string;
  defaultValue: T;
  debounceMs?: number;
}) {
  const { kind, key, localKey, defaultValue, debounceMs = 600 } = params;
  const { user } = useAuth();
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const skipNextWriteRef = useRef(true);

  // Hydrate whenever the identity or key changes
  useEffect(() => {
    let cancelled = false;
    skipNextWriteRef.current = true;
    setHydrated(false);

    const hydrateLocal = () => {
      try {
        const raw = localStorage.getItem(localKey);
        if (raw) setValue(JSON.parse(raw));
        else setValue(defaultValue);
      } catch {
        setValue(defaultValue);
      }
    };

    (async () => {
      if (!user) {
        hydrateLocal();
        if (!cancelled) setHydrated(true);
        return;
      }
      const { data, error } = await supabase
        .from("user_progress")
        .select("data")
        .eq("user_id", user.id)
        .eq("kind", kind)
        .eq("key", key)
        .maybeSingle();
      if (cancelled) return;
      if (!error && data?.data !== undefined && data?.data !== null) {
        setValue(data.data as T);
      } else {
        // First cloud read empty — migrate any local copy up
        try {
          const raw = localStorage.getItem(localKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            setValue(parsed);
            skipNextWriteRef.current = false; // trigger upload
          } else {
            setValue(defaultValue);
          }
        } catch {
          setValue(defaultValue);
        }
      }
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, kind, key, localKey]);

  // Debounced writes
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextWriteRef.current) {
      skipNextWriteRef.current = false;
      return;
    }
    // Always mirror to localStorage for offline / signed-out reuse
    try {
      localStorage.setItem(localKey, JSON.stringify(value));
    } catch {
      /* ignore quota */
    }
    if (!user) return;
    setSyncing(true);
    const t = setTimeout(async () => {
      try {
        await supabase
          .from("user_progress")
          .upsert(
            [{ user_id: user.id, kind, key, data: (value ?? null) as unknown as never }],
            { onConflict: "user_id,kind,key" },
          );
      } finally {
        setSyncing(false);
      }
    }, debounceMs);
    return () => {
      clearTimeout(t);
      setSyncing(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, hydrated, user?.id, kind, key, localKey, debounceMs]);

  const reset = useCallback(() => setValue(defaultValue), [defaultValue]);

  return [value, setValue, { hydrated, syncing, isCloud: !!user, reset }] as const;
}