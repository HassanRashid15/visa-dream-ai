
Goal: fix the listening experience so the highlight follows the actual spoken word, not an estimated position that runs ahead of the voice.

What I found
- The current listening module in `src/components/IELTSPracticeModule.tsx` still uses browser `SpeechSynthesisUtterance`.
- Word highlighting depends on `onboundary` plus a fallback timer.
- That fallback is exactly why the highlight can move forward before the voice.
- The listening data in `src/lib/ieltsPracticeData.ts` only stores plain `transcript`, not real audio files or per-word timings.

Implementation plan

1. Replace browser TTS with real audio playback
- Stop using `speechSynthesis` for listening tests.
- Use a normal `<audio>` / `HTMLAudioElement` flow instead.
- Each listening exercise will point to a real recorded audio file.

2. Add timestamped transcript data
- Extend `ListeningExercise` to include:
  - `audioSrc`
  - `transcriptSegments` or `wordTimings`
- Store each spoken token with:
  - displayed text
  - start time
  - end time
- This will let the UI highlight based on the audio’s real `currentTime`.

3. Rebuild highlighting logic around audio time
- Remove the current `onboundary` and estimated fallback approach.
- On `timeupdate` (or a short animation loop), compare `audio.currentTime` against token timestamps.
- Highlight only the token whose time window is active.
- This guarantees the highlight matches the actual voice timing.

4. Update the listening UI flow
- Keep the existing IELTS-style phases:
  - Read Questions
  - Listen
  - Review
  - Answer
- Replace the current “playing” state internals so transcript highlighting is driven by real audio.
- Keep auto-scroll, but scroll only to the currently active timed token.

5. Prepare the content structure for multiple countries
- Keep UK / Canada / Australia exercises.
- For each exercise, attach a country-specific real audio file and matching timestamps.
- This preserves the existing country-based council experience while making playback accurate.

6. Improve authoring pattern for changing content
- Since you want content not to feel repetitive, keep the current shuffling behavior.
- Add multiple recorded variants per exercise later if needed, but first make one fully synced version per exercise pattern.
- The key is: every audio file must have its own matching timestamp map.

7. Fallback behavior
- If audio fails to load, show a clear error state instead of falling back to fake synced highlighting.
- Do not use timer-estimated highlighting again, because that recreates the same problem.

Technical details
- Files to update:
  - `src/lib/ieltsPracticeData.ts`
  - `src/components/IELTSPracticeModule.tsx`
- Data shape change example:
```text
ListeningExercise
  id
  title
  section
  context
  difficulty
  audioSrc
  transcriptSegments: [
    { text: "Receptionist:", start: 0.00, end: 0.42 },
    { text: "Good", start: 0.43, end: 0.62 },
    { text: "morning,", start: 0.63, end: 0.98 }
  ]
  questions
```
- Playback sync model:
```text
audio currentTime -> find active segment -> setCurrentWordIndex(activeIndex)
```
- Remove from current implementation:
  - `SpeechSynthesisUtterance`
  - `onboundary`
  - estimated-duration highlight fallback
- Keep:
  - phase flow
  - review countdown
  - transcript panel
  - question answering flow

Important product assessment
- Right now, no: it is not yet strong enough as a serious IELTS listening product because synced listening accuracy is core to trust.
- The rest of the product direction is good:
  - country-based prep
  - dashboards
  - study planner
  - realistic flow
- But for listening quality, real recorded audio + timestamps is the correct fix and the next necessary step.

Recommended rollout
1. Implement the new timestamped audio system in the data model.
2. Convert the first 1-2 listening exercises completely.
3. Verify highlighting matches spoken words exactly.
4. Then migrate the rest of the listening bank to the same format.

If approved, I’ll implement the real-audio timestamp system and remove the fake forward-moving highlight logic.
