// Generate per-word timestamps from transcript text
// Estimates based on average speaking rate and word complexity

export interface TranscriptSegment {
  text: string;
  start: number;
  end: number;
  isWord: boolean;
}

// Average English speech: ~150 wpm at normal rate, ~135 at 0.9 rate
const BASE_WPM = 135;
const BASE_WORD_DURATION = 60 / BASE_WPM; // ~0.44s per word
const PAUSE_AFTER_PERIOD = 0.5;
const PAUSE_AFTER_COMMA = 0.2;
const PAUSE_AFTER_COLON = 0.35;
const PAUSE_AFTER_NEWLINE = 0.6;
const PAUSE_AFTER_QUESTION = 0.45;

function estimateWordDuration(word: string): number {
  // Longer words take slightly more time
  const clean = word.replace(/[^a-zA-Z'-]/g, "");
  if (clean.length === 0) return 0.1;
  const syllables = countSyllables(clean);
  return BASE_WORD_DURATION * (0.6 + syllables * 0.25);
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;
  if (word.endsWith("e") && !word.endsWith("le")) count--;
  return Math.max(1, count);
}

function getPauseAfter(token: string): number {
  if (token.includes("\n\n")) return PAUSE_AFTER_NEWLINE;
  if (token.includes("\n")) return PAUSE_AFTER_NEWLINE * 0.7;
  const lastChar = token.trim().slice(-1);
  switch (lastChar) {
    case ".": case "!": return PAUSE_AFTER_PERIOD;
    case "?": return PAUSE_AFTER_QUESTION;
    case ",": case ";": return PAUSE_AFTER_COMMA;
    case ":": return PAUSE_AFTER_COLON;
    case "—": case "–": return PAUSE_AFTER_COMMA;
    default: return 0;
  }
}

export function generateTimestamps(transcript: string): TranscriptSegment[] {
  const parts = transcript.match(/\S+|\s+/g) ?? [];
  const segments: TranscriptSegment[] = [];
  let cursor = 0;

  for (const part of parts) {
    const isWord = /\S/.test(part);

    if (!isWord) {
      // Whitespace/newline - add pause
      const pause = part.includes("\n") ? PAUSE_AFTER_NEWLINE * 0.5 : 0.02;
      segments.push({ text: part, start: cursor, end: cursor + pause, isWord: false });
      cursor += pause;
    } else {
      const duration = estimateWordDuration(part);
      segments.push({ text: part, start: cursor, end: cursor + duration, isWord: true });
      cursor += duration;
      // Add natural pause after punctuation
      const pause = getPauseAfter(part);
      if (pause > 0) {
        cursor += pause;
      }
    }
  }

  return segments;
}

export function getTotalDuration(segments: TranscriptSegment[]): number {
  if (segments.length === 0) return 0;
  return segments[segments.length - 1].end;
}

export function getActiveSegmentIndex(segments: TranscriptSegment[], currentTime: number): number {
  for (let i = segments.length - 1; i >= 0; i--) {
    if (segments[i].isWord && currentTime >= segments[i].start) {
      return i;
    }
  }
  return -1;
}
