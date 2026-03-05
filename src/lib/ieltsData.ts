export interface IELTSModule {
  id: string;
  title: string;
  icon: string;
  description: string;
  lessons: IELTSLesson[];
}

export interface IELTSLesson {
  id: string;
  title: string;
  content: string;
  tips: string[];
  duration: string;
}

export interface IELTSQuestion {
  id: string;
  module: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const IELTS_MODULES: IELTSModule[] = [
  {
    id: "reading",
    title: "Reading",
    icon: "📖",
    description: "Master reading comprehension with academic and general training passages",
    lessons: [
      {
        id: "r1", title: "Skimming & Scanning Techniques", duration: "15 min",
        content: "Skimming means quickly reading through a passage to get the main idea without focusing on every word. Scanning is searching for specific information like names, dates, or keywords. Both techniques save time in the IELTS Reading test.",
        tips: ["Read the title and headings first", "Look at the first sentence of each paragraph", "Don't read every word — focus on keywords", "Practice with a timer to build speed"]
      },
      {
        id: "r2", title: "Matching Headings & Paragraphs", duration: "20 min",
        content: "Matching headings requires understanding the main idea of each paragraph. Read the list of headings first, then match each paragraph by identifying its central theme. Eliminate headings as you match them.",
        tips: ["Underline the key idea in each paragraph", "Cross out headings as you use them", "Look for topic sentences", "Don't match based on a single word"]
      },
      {
        id: "r3", title: "True/False/Not Given Strategies", duration: "20 min",
        content: "TRUE means the statement matches the passage. FALSE means the passage directly contradicts it. NOT GIVEN means the information simply isn't mentioned. The key is to avoid using your own knowledge.",
        tips: ["Only use information from the passage", "FALSE requires a clear contradiction", "NOT GIVEN means no evidence either way", "Read the statement carefully before searching"]
      },
    ],
  },
  {
    id: "listening",
    title: "Listening",
    icon: "🎧",
    description: "Improve your listening skills for all four sections of the IELTS test",
    lessons: [
      {
        id: "l1", title: "Predicting Answers", duration: "15 min",
        content: "Before the audio plays, read the questions and predict what type of answer is needed (a name, number, place, etc.). This helps you focus on the right information when listening.",
        tips: ["Read questions before audio starts", "Predict answer types (number, name, place)", "Note word limits for each answer", "Don't panic if you miss one — move on"]
      },
      {
        id: "l2", title: "Note-Taking Methods", duration: "20 min",
        content: "Use abbreviations and symbols to take quick notes while listening. Focus on keywords and main ideas rather than writing everything. Develop your own shorthand system.",
        tips: ["Use abbreviations (govt, info, etc.)", "Write keywords, not full sentences", "Use arrows and symbols for relationships", "Practice taking notes from podcasts"]
      },
      {
        id: "l3", title: "Map & Diagram Labelling", duration: "15 min",
        content: "For map questions, note directions (left, right, opposite, next to). For diagram questions, understand the process flow before listening. Follow the speaker's description carefully.",
        tips: ["Study the map/diagram before audio plays", "Note compass directions and landmarks", "Follow sequential descriptions", "Watch for words like 'opposite', 'adjacent'"]
      },
    ],
  },
  {
    id: "writing",
    title: "Writing",
    icon: "✍️",
    description: "Learn essay structures, task responses, and scoring criteria",
    lessons: [
      {
        id: "w1", title: "Task 1: Data Description", duration: "25 min",
        content: "Task 1 requires describing visual data (charts, graphs, tables, maps, or processes). Focus on identifying trends, comparisons, and key features. Use a clear structure: introduction, overview, and detailed paragraphs.",
        tips: ["Paraphrase the question in your introduction", "Always include an overview paragraph", "Group data logically — don't describe everything", "Use comparison language: 'whereas', 'in contrast'"]
      },
      {
        id: "w2", title: "Task 2: Essay Structure", duration: "25 min",
        content: "Task 2 is a discursive essay. Common types include opinion, discussion, problem-solution, and advantage-disadvantage essays. Use a 4-paragraph structure: introduction, body 1, body 2, conclusion.",
        tips: ["Spend 5 minutes planning before writing", "State your position clearly in the introduction", "Each body paragraph needs one main idea", "Conclusion should summarize, not add new ideas"]
      },
      {
        id: "w3", title: "Vocabulary & Cohesion", duration: "20 min",
        content: "Use a range of vocabulary and linking words to improve your coherence score. Avoid repetition by using synonyms and paraphrasing. Connect sentences and paragraphs with appropriate cohesive devices.",
        tips: ["Learn topic-specific vocabulary", "Use linking words: furthermore, however, consequently", "Avoid overusing 'firstly, secondly, thirdly'", "Paraphrase key terms throughout your essay"]
      },
    ],
  },
  {
    id: "speaking",
    title: "Speaking",
    icon: "🗣️",
    description: "Build confidence for all three parts of the speaking test",
    lessons: [
      {
        id: "s1", title: "Part 1: Introduction & Familiar Topics", duration: "15 min",
        content: "Part 1 lasts 4-5 minutes. The examiner asks questions about familiar topics like home, family, work, studies, and interests. Give extended answers (2-3 sentences) rather than one-word responses.",
        tips: ["Extend your answers with reasons and examples", "Don't memorize answers — sound natural", "Practice common topics: hometown, hobbies, work", "Speak at a natural pace, not too fast"]
      },
      {
        id: "s2", title: "Part 2: The Long Turn (Cue Card)", duration: "20 min",
        content: "You receive a topic card and have 1 minute to prepare, then speak for 1-2 minutes. Structure your talk: introduce the topic, describe details, explain your feelings or opinions.",
        tips: ["Use the 1-minute prep to make brief notes", "Cover ALL bullet points on the cue card", "Use past tenses for experiences, present for habits", "Practice speaking for 2 minutes on random topics"]
      },
      {
        id: "s3", title: "Part 3: Discussion & Abstract Topics", duration: "20 min",
        content: "Part 3 involves deeper discussion related to the Part 2 topic. The examiner asks about society, trends, and abstract ideas. Show your ability to analyze, compare, and speculate.",
        tips: ["Give opinions with clear reasoning", "Use phrases: 'I'd argue that...', 'From my perspective...'", "Compare situations: past vs present, local vs global", "It's OK to pause briefly to think"]
      },
    ],
  },
];

export const IELTS_TEST_QUESTIONS: IELTSQuestion[] = [
  // Reading
  { id: "q1", module: "reading", question: "What does 'skimming' mean in the context of IELTS Reading?", options: ["Reading every word carefully", "Quickly reading for the main idea", "Reading only the conclusion", "Reading questions first"], correctAnswer: 1, explanation: "Skimming means quickly reading through a passage to get the general idea without focusing on every word." },
  { id: "q2", module: "reading", question: "In True/False/Not Given questions, 'NOT GIVEN' means:", options: ["The statement is false", "The passage contradicts the statement", "The information is not in the passage", "You should use your own knowledge"], correctAnswer: 2, explanation: "NOT GIVEN means the passage doesn't contain information to confirm or deny the statement." },
  { id: "q3", module: "reading", question: "When matching headings, you should focus on:", options: ["Individual words", "The main idea of each paragraph", "The last sentence only", "Grammatical structure"], correctAnswer: 1, explanation: "Matching headings requires understanding the central theme or main idea of each paragraph." },
  // Listening
  { id: "q4", module: "listening", question: "Before the audio plays, you should:", options: ["Close your eyes and relax", "Read the questions and predict answer types", "Start writing notes immediately", "Skip to the hardest questions"], correctAnswer: 1, explanation: "Reading questions beforehand helps you predict answer types and focus on relevant information." },
  { id: "q5", module: "listening", question: "If you miss an answer during the listening test, you should:", options: ["Replay the audio", "Stop and think about it", "Move on to the next question", "Guess and leave it blank"], correctAnswer: 2, explanation: "Move on to the next question. Dwelling on a missed answer will cause you to miss more." },
  { id: "q6", module: "listening", question: "For map labelling questions, which words are most important?", options: ["Technical vocabulary", "Directional words like 'opposite' and 'next to'", "Dates and numbers", "Proper nouns only"], correctAnswer: 1, explanation: "Directional and positional words help you locate places on a map during listening." },
  // Writing
  { id: "q7", module: "writing", question: "In Task 1, what is the most important paragraph?", options: ["The introduction", "The overview", "The first detail paragraph", "The conclusion"], correctAnswer: 1, explanation: "The overview paragraph, which summarizes key trends and features, is crucial for a good Task 1 score." },
  { id: "q8", module: "writing", question: "How long should you spend planning a Task 2 essay?", options: ["No time at all", "About 5 minutes", "15 minutes", "Half the time"], correctAnswer: 1, explanation: "Spending about 5 minutes planning ensures a well-structured essay without wasting too much writing time." },
  { id: "q9", module: "writing", question: "Which is the best way to improve coherence?", options: ["Use longer sentences", "Add more vocabulary", "Use linking words and paraphrasing", "Write shorter paragraphs"], correctAnswer: 2, explanation: "Linking words and paraphrasing key terms throughout your essay improve coherence and cohesion." },
  // Speaking
  { id: "q10", module: "speaking", question: "In Part 1, how should you answer questions?", options: ["One-word answers", "Extended answers with reasons", "Memorized scripts", "Academic language only"], correctAnswer: 1, explanation: "Give 2-3 sentence answers with reasons and examples — natural but extended." },
  { id: "q11", module: "speaking", question: "How long do you have to prepare for the Part 2 cue card?", options: ["30 seconds", "1 minute", "2 minutes", "No preparation time"], correctAnswer: 1, explanation: "You get exactly 1 minute to prepare notes before speaking for 1-2 minutes." },
  { id: "q12", module: "speaking", question: "In Part 3, the examiner wants you to:", options: ["Repeat Part 2 answers", "Analyze and discuss abstract ideas", "Only give personal opinions", "Speak as fast as possible"], correctAnswer: 1, explanation: "Part 3 tests your ability to discuss abstract and societal topics with analysis and reasoning." },
];
