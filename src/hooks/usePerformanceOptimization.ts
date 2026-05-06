import { useEffect, useState, useCallback, useMemo } from 'react';
import { memoryCache, PerformanceMonitor, networkOptimization } from '@/lib/performance';

// Custom hook for performance optimization
export const usePerformanceOptimization = () => {
  const [metrics, setMetrics] = useState(() => PerformanceMonitor.getMetrics());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(PerformanceMonitor.getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Optimized API call with caching
  const optimizedApiCall = useCallback(async <T>(
    key: string,
    apiCall: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    const endTimer = PerformanceMonitor.startTimer(`api-${key}`);

    try {
      // Check cache first
      const cached = memoryCache.get(key);
      if (cached) {
        endTimer();
        return cached;
      }

      // Make API call
      const result = await apiCall();
      
      // Cache the result
      memoryCache.set(key, result, ttl || 1000 * 60 * 15); // 15 minutes default
      
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    networkOptimization.debounce((searchTerm: string) => {
      console.log('Searching for:', searchTerm);
    }, 300),
    []
  );

  // Throttled scroll handler
  const throttledScroll = useCallback(
    networkOptimization.throttle((event: Event) => {
      console.log('Scroll event:', event);
    }, 100),
    []
  );

  return {
    metrics,
    isOnline,
    optimizedApiCall,
    debouncedSearch,
    throttledScroll,
  };
};

// Hook for lazy loading components
export const useLazyLoad = <T>(
  loadFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await loadFunction();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
};

// Hook for image lazy loading
export const useImageLazyLoad = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const loadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
        resolve();
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }, [loadedImages]);

  return { loadImage, loadedImages };
};

// Hook for viewport detection
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
};

// Hook for intersection observer
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [entries, setEntries] = useState<IntersectionObserverEntry[]>([]);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element) => {
    if (observer) {
      observer.observe(element);
    }
  }, [observer]);

  const unobserve = useCallback((element: Element) => {
    if (observer) {
      observer.unobserve(element);
    }
  }, [observer]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      setEntries(entries);
    }, options);

    setObserver(obs);

    return () => {
      obs.disconnect();
    };
  }, [options]);

  return { entries, observe, unobserve };
};

// Hook for prefetching data
export const usePrefetch = <T>(
  key: string,
  fetchFunction: () => Promise<T>,
  ttl?: number
) => {
  const [isPrefetched, setIsPrefetched] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const prefetch = useCallback(async () => {
    if (isPrefetched || memoryCache.get(key)) {
      return;
    }

    try {
      const result = await fetchFunction();
      memoryCache.set(key, result, ttl || 1000 * 60 * 30); // 30 minutes default
      setIsPrefetched(true);
    } catch (err) {
      setError(err as Error);
    }
  }, [key, fetchFunction, ttl, isPrefetched]);

  return { prefetch, isPrefetched, error };
};

// Hook for performance budget monitoring
export const usePerformanceBudget = () => {
  const [budgetStatus, setBudgetStatus] = useState({
    withinBudget: true,
    metrics: {},
    violations: [],
  });

  useEffect(() => {
    const checkBudget = () => {
      // This would integrate with the performance budget checker
      // For now, we'll use a simple implementation
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const withinBudget = loadTime < 3000; // 3 seconds budget

        setBudgetStatus({
          withinBudget,
          metrics: { loadTime },
          violations: withinBudget ? [] : ['loadTime'],
        });
      }
    };

    // Check budget after page load
    if (document.readyState === 'complete') {
      checkBudget();
    } else {
      window.addEventListener('load', checkBudget);
    }

    return () => {
      window.removeEventListener('load', checkBudget);
    };
  }, []);

  return budgetStatus;
};
