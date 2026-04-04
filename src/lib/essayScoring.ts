// Local IELTS Writing Band Scoring Engine
// Evaluates essays against official IELTS band descriptors

export interface BandScore {
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  overall: number;
  feedback: BandFeedback[];
}

export interface BandFeedback {
  criterion: string;
  band: number;
  strengths: string[];
  improvements: string[];
  descriptor: string;
}

// Cohesion markers for scoring
const COHESION_MARKERS = [
  "however", "moreover", "furthermore", "in addition", "consequently",
  "nevertheless", "on the other hand", "in contrast", "similarly",
  "therefore", "thus", "hence", "as a result", "for example",
  "for instance", "in conclusion", "to summarise", "overall",
  "firstly", "secondly", "thirdly", "finally", "meanwhile",
  "subsequently", "although", "despite", "whereas", "while",
  "not only", "but also", "in particular", "specifically",
  "according to", "with regard to", "in terms of",
];

const ACADEMIC_VOCABULARY = [
  "significant", "considerable", "substantial", "predominant", "prevalent",
  "fundamental", "crucial", "essential", "integral", "inherent",
  "comprehensive", "extensive", "profound", "remarkable", "noteworthy",
  "controversial", "contemporary", "conventional", "innovative", "sustainable",
  "infrastructure", "perspective", "phenomenon", "implication", "correlation",
  "contribute", "demonstrate", "illustrate", "emphasise", "facilitate",
  "implement", "investigate", "maintain", "obtain", "perceive",
  "analyse", "evaluate", "interpret", "justify", "acknowledge",
  "diminish", "fluctuate", "deteriorate", "enhance", "accelerate",
];

const COMPLEX_GRAMMAR_PATTERNS = [
  /\b(if\s+\w+\s+(were|had|would|could|should))\b/gi, // conditionals
  /\b(not only\s+.+\s+but also)\b/gi, // correlative conjunctions
  /\b(having\s+\w+ed)\b/gi, // perfect participle
  /\b(were\s+\w+\s+to)\b/gi, // subjunctive
  /\b(it\s+is\s+(argued|believed|suggested|claimed|evident))\b/gi, // impersonal
  /\b(the\s+\w+er\s+.+,?\s+the\s+\w+er)\b/gi, // comparative correlative
  /\b(in\s+order\s+to)\b/gi, // purpose clause
  /\b(provided\s+that|on\s+condition\s+that)\b/gi, // conditional conjunctions
  /\b(despite\s+the\s+fact\s+that)\b/gi, // complex subordination
  /\b(which|who|whom|whose|where)\s+\w+/gi, // relative clauses
];

function countSentences(text: string): number {
  return (text.match(/[.!?]+/g) || []).length || 1;
}

function countParagraphs(text: string): number {
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

function getUniqueWords(text: string): Set<string> {
  return new Set(
    text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter(w => w.length > 2)
  );
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;
  if (word.endsWith("e") && !word.endsWith("le")) count--;
  return Math.max(1, count);
}

function averageWordLength(text: string): number {
  const words = text.replace(/[^a-z\s]/gi, "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return 0;
  return words.reduce((sum, w) => sum + w.length, 0) / words.length;
}

function averageSentenceLength(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  const sentences = countSentences(text);
  return words / sentences;
}

function scoreBand(raw: number, max: number): number {
  const ratio = Math.min(raw / max, 1);
  // Map 0-1 to band 4-9
  const band = 4 + ratio * 5;
  return Math.round(band * 2) / 2; // Round to nearest 0.5
}

export function scoreEssay(essay: string, taskNumber: 1 | 2, wordLimit: number): BandScore {
  const words = essay.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = countSentences(essay);
  const paragraphs = countParagraphs(essay);
  const uniqueWords = getUniqueWords(essay);
  const lowerText = essay.toLowerCase();

  // ─── TASK ACHIEVEMENT ───
  const wordCountScore = wordCount >= wordLimit ? 3 : wordCount >= wordLimit * 0.8 ? 2 : wordCount >= wordLimit * 0.5 ? 1 : 0;
  const paragraphScore = paragraphs >= 4 ? 3 : paragraphs >= 3 ? 2 : paragraphs >= 2 ? 1 : 0;
  const hasIntro = paragraphs >= 2;
  const hasConclusion = /\b(in conclusion|to conclude|overall|to summarise|in summary)\b/i.test(essay);
  const structureScore = (hasIntro ? 2 : 0) + (hasConclusion ? 2 : 0);
  const taskScore = scoreBand(wordCountScore + paragraphScore + structureScore, 10);

  // ─── COHERENCE & COHESION ───
  const cohesionCount = COHESION_MARKERS.filter(m => lowerText.includes(m)).length;
  const cohesionDiversity = Math.min(cohesionCount / 8, 1) * 4;
  const paragraphOrg = paragraphs >= 4 ? 3 : paragraphs >= 3 ? 2 : 1;
  const sentenceVariety = (() => {
    const lengths = essay.split(/[.!?]+/).map(s => s.trim().split(/\s+/).length).filter(l => l > 0);
    if (lengths.length < 2) return 0;
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, l) => sum + (l - mean) ** 2, 0) / lengths.length;
    return Math.min(Math.sqrt(variance) / 5, 1) * 3;
  })();
  const coherenceScore = scoreBand(cohesionDiversity + paragraphOrg + sentenceVariety, 10);

  // ─── LEXICAL RESOURCE ───
  const ttr = uniqueWords.size / Math.max(wordCount, 1); // type-token ratio
  const ttrScore = Math.min(ttr / 0.6, 1) * 3;
  const academicCount = ACADEMIC_VOCABULARY.filter(w => lowerText.includes(w)).length;
  const academicScore = Math.min(academicCount / 6, 1) * 3;
  const avgWordLen = averageWordLength(essay);
  const sophisticationScore = Math.min((avgWordLen - 3) / 3, 1) * 2;
  const avgSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0) / Math.max(wordCount, 1);
  const syllableScore = Math.min((avgSyllables - 1) / 1.5, 1) * 2;
  const lexicalScore = scoreBand(ttrScore + academicScore + sophisticationScore + syllableScore, 10);

  // ─── GRAMMATICAL RANGE & ACCURACY ───
  const complexPatterns = COMPLEX_GRAMMAR_PATTERNS.filter(p => p.test(essay)).length;
  // Reset lastIndex for global patterns
  COMPLEX_GRAMMAR_PATTERNS.forEach(p => p.lastIndex = 0);
  const complexScore = Math.min(complexPatterns / 4, 1) * 4;
  const avgSentLen = averageSentenceLength(essay);
  const sentLenScore = avgSentLen >= 12 && avgSentLen <= 25 ? 3 : avgSentLen >= 8 ? 2 : 1;
  const punctuationVariety = [",", ";", ":", "—", "(", "'"].filter(p => essay.includes(p)).length;
  const punctScore = Math.min(punctuationVariety / 4, 1) * 3;
  const grammarScore = scoreBand(complexScore + sentLenScore + punctScore, 10);

  // Overall = average rounded to nearest 0.5
  const rawOverall = (taskScore + coherenceScore + lexicalScore + grammarScore) / 4;
  const overall = Math.round(rawOverall * 2) / 2;

  // Generate feedback
  const feedback: BandFeedback[] = [
    {
      criterion: "Task Achievement",
      band: taskScore,
      descriptor: getBandDescriptor("task", taskScore, taskNumber),
      strengths: [
        ...(wordCount >= wordLimit ? [`Met the minimum word count (${wordCount} words)`] : []),
        ...(hasConclusion ? ["Includes a clear conclusion"] : []),
        ...(paragraphs >= 4 ? ["Well-organised paragraph structure"] : []),
      ],
      improvements: [
        ...(wordCount < wordLimit ? [`Write at least ${wordLimit} words (currently ${wordCount})`] : []),
        ...(!hasConclusion ? ["Add a clear conclusion paragraph"] : []),
        ...(paragraphs < 4 ? ["Use at least 4 paragraphs: intro, 2+ body, conclusion"] : []),
      ],
    },
    {
      criterion: "Coherence & Cohesion",
      band: coherenceScore,
      descriptor: getBandDescriptor("coherence", coherenceScore, taskNumber),
      strengths: [
        ...(cohesionCount >= 5 ? [`Good use of linking words (${cohesionCount} different markers)`] : []),
        ...(paragraphs >= 3 ? ["Clear paragraph organisation"] : []),
      ],
      improvements: [
        ...(cohesionCount < 5 ? ["Use more varied linking words (however, moreover, consequently...)"] : []),
        ...(paragraphs < 3 ? ["Organise ideas into clear paragraphs"] : []),
      ],
    },
    {
      criterion: "Lexical Resource",
      band: lexicalScore,
      descriptor: getBandDescriptor("lexical", lexicalScore, taskNumber),
      strengths: [
        ...(academicCount >= 4 ? [`Good use of academic vocabulary (${academicCount} terms)`] : []),
        ...(ttr >= 0.45 ? ["Good vocabulary range"] : []),
      ],
      improvements: [
        ...(academicCount < 4 ? ["Use more academic/formal vocabulary"] : []),
        ...(ttr < 0.45 ? ["Avoid repeating the same words — use synonyms"] : []),
        ...(avgWordLen < 4.5 ? ["Use more sophisticated word choices"] : []),
      ],
    },
    {
      criterion: "Grammatical Range & Accuracy",
      band: grammarScore,
      descriptor: getBandDescriptor("grammar", grammarScore, taskNumber),
      strengths: [
        ...(complexPatterns >= 3 ? ["Good use of complex sentence structures"] : []),
        ...(avgSentLen >= 12 && avgSentLen <= 25 ? ["Good sentence length variety"] : []),
      ],
      improvements: [
        ...(complexPatterns < 3 ? ["Use more complex structures (conditionals, relative clauses, passive voice)"] : []),
        ...(avgSentLen < 12 ? ["Write longer, more developed sentences"] : []),
        ...(avgSentLen > 25 ? ["Break up very long sentences for clarity"] : []),
      ],
    },
  ];

  return { taskAchievement: taskScore, coherenceCohesion: coherenceScore, lexicalResource: lexicalScore, grammaticalRange: grammarScore, overall, feedback };
}

function getBandDescriptor(criterion: string, band: number, taskNumber: 1 | 2): string {
  const b = Math.round(band);
  const descriptors: Record<string, Record<number, string>> = {
    task: {
      9: "Fully satisfies all requirements of the task. All key features covered and appropriately extended.",
      8: "Sufficiently addresses all parts of the task. Well-developed response with relevant, extended ideas.",
      7: "Addresses all parts of the task. Clear position throughout with main ideas well supported.",
      6: "Addresses all parts of the task although some parts may be more fully covered than others. Presents a relevant position.",
      5: "Only partially addresses the task. Position is not always clear. Main ideas are limited or not well developed.",
      4: "Responds to the task only in a minimal way or tangentially. Position is unclear.",
    },
    coherence: {
      9: "Uses cohesion in such a way that it attracts no attention. Skilfully manages paragraphing.",
      8: "Sequences information and ideas logically. Manages all aspects of cohesion well. Uses paragraphing sufficiently and appropriately.",
      7: "Logically organises information and ideas. Clear progression throughout. Uses a range of cohesive devices appropriately.",
      6: "Arranges information coherently. Uses cohesive devices effectively, but cohesion within/between sentences may be faulty.",
      5: "Presents information with some organisation but lacks overall progression. Inadequate or overuse of cohesive devices.",
      4: "Presents information and ideas but not arranged coherently. Uses some basic cohesive devices but may be inaccurate.",
    },
    lexical: {
      9: "Wide range of vocabulary with very natural and sophisticated control. Rare minor 'slips' only.",
      8: "Wide range of vocabulary fluently and flexibly. Skilfully uses uncommon lexical items. Occasional inaccuracies in word choice.",
      7: "Sufficient range of vocabulary for flexible and precise meanings. Uses less common lexical items with some awareness of style.",
      6: "Adequate range for the task. Attempts to use less common vocabulary but with some inaccuracy. Makes some errors in spelling/word formation.",
      5: "Limited range of vocabulary. May make noticeable errors in spelling and/or word formation that may cause some difficulty.",
      4: "Uses only basic vocabulary which may be used repetitively. Has limited control of word formation and/or spelling.",
    },
    grammar: {
      9: "Wide range of structures with full flexibility and accuracy. Rare minor errors only as 'slips.'",
      8: "Wide range of structures. Majority of sentences are error-free. Makes only occasional errors or inappropriacies.",
      7: "Uses a variety of complex structures. Produces frequent error-free sentences. Good control of grammar and punctuation.",
      6: "Uses a mix of simple and complex sentence forms. Makes some errors in grammar and punctuation but these rarely reduce communication.",
      5: "Uses only a limited range of structures. Attempts complex sentences but with limited accuracy. Frequent grammatical errors.",
      4: "Uses only a very limited range of structures. Subordinate clauses are rare. Some structures are accurate but errors predominate.",
    },
  };

  return descriptors[criterion]?.[b] || descriptors[criterion]?.[6] || "Developing competence in this area.";
}
