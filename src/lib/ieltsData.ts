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

export interface CountryTestConfig {
  councilName: string;
  councilLogo: string;
  testName: string;
  testFullName: string;
  tagline: string;
  accentColor: string;
  modules: IELTSModule[];
  questions: IELTSQuestion[];
  bandDescriptors: { min: number; max: number; band: string; label: string }[];
  testFormat: { section: string; duration: string; tasks: string }[];
}

// ─── BRITISH COUNCIL — UNITED KINGDOM ───────────────────────────────────────

const UK_MODULES: IELTSModule[] = [
  {
    id: "listening",
    title: "Listening",
    icon: "🎧",
    description: "4 recorded sections with 40 questions — British Council IELTS format",
    lessons: [
      {
        id: "uk-l1", title: "Section 1: Everyday Social Context", duration: "20 min",
        content: "Section 1 is a conversation between two people in an everyday social context (e.g. booking accommodation, ordering a service). You need to listen for specific factual information such as names, dates, times, and prices. The British Council recommends reading questions ahead of the audio to predict answer types.",
        tips: ["Listen for spelling of names — they may be spelled out", "Numbers and dates are commonly tested", "Write answers as you hear them — don't rely on memory", "Watch for distractors: the speaker may change their mind"]
      },
      {
        id: "uk-l2", title: "Section 2: Monologue in Social Context", duration: "20 min",
        content: "Section 2 is a monologue set in an everyday social context, such as a speech about local facilities or a guided tour. Map and diagram labelling questions are common here. The British Council advises following directional language carefully.",
        tips: ["Study any maps or diagrams before the audio plays", "Follow directional words: opposite, adjacent, behind", "Note landmarks mentioned as reference points", "Section 2 only plays once — stay focused throughout"]
      },
      {
        id: "uk-l3", title: "Sections 3 & 4: Academic Discussions", duration: "25 min",
        content: "Section 3 is a conversation between up to four people in an educational context (e.g. a university tutorial). Section 4 is an academic monologue (e.g. a university lecture). These require understanding main ideas, attitudes, and following the development of an argument.",
        tips: ["Identify each speaker's opinion — they may differ", "Section 4 has no break — read all questions during the gap before it", "Academic vocabulary is key — familiarise yourself with common terms", "Listen for signpost language: 'however', 'on the other hand', 'the key point is'"]
      },
    ],
  },
  {
    id: "reading",
    title: "Reading",
    icon: "📖",
    description: "3 passages, 40 questions in 60 minutes — Academic or General Training",
    lessons: [
      {
        id: "uk-r1", title: "Passage Types & Reading Strategies", duration: "25 min",
        content: "The IELTS Academic Reading test has three long passages taken from books, journals, magazines, and newspapers. They are written for a non-specialist audience. The British Council emphasises that passages progress in difficulty. General Training uses extracts from notices, advertisements, company handbooks, and other everyday sources.",
        tips: ["Skim each passage in 2-3 minutes for main ideas before answering", "Academic passages are factual, analytical, or discursive", "Don't spend more than 20 minutes on any single passage", "Passage 3 is the hardest — budget your time wisely"]
      },
      {
        id: "uk-r2", title: "Question Types Mastery", duration: "25 min",
        content: "The British Council IELTS uses 11 question types including: multiple choice, identifying information (True/False/Not Given), identifying the writer's views (Yes/No/Not Given), matching information, matching headings, matching features, matching sentence endings, sentence completion, summary completion, note completion, table completion, flow-chart completion, diagram label completion, and short-answer questions.",
        tips: ["True/False/Not Given: TRUE = agrees with passage, FALSE = contradicts, NOT GIVEN = no information", "Yes/No/Not Given tests the WRITER'S VIEWS, not facts", "Matching headings: read the heading list first, then identify paragraph themes", "Answers follow passage order for most question types (except matching)"]
      },
      {
        id: "uk-r3", title: "Time Management & Practice Techniques", duration: "20 min",
        content: "You have exactly 60 minutes for 40 questions with no extra transfer time. The British Council recommends spending approximately 20 minutes per passage but adjusting based on difficulty. Practise under timed conditions regularly to build your reading speed.",
        tips: ["Transfer answers directly to the answer sheet as you go", "If stuck on a question for over 90 seconds, move on and return later", "Use the word limit strictly — 'NO MORE THAN THREE WORDS' means exactly that", "Read the instructions for each question set carefully — they vary"]
      },
    ],
  },
  {
    id: "writing",
    title: "Writing",
    icon: "✍️",
    description: "2 tasks in 60 minutes — assessed on 4 criteria by British Council examiners",
    lessons: [
      {
        id: "uk-w1", title: "Task 1: Visual Data Description (Academic)", duration: "25 min",
        content: "Academic Task 1 requires describing visual information (graph, table, chart, diagram, or map) in at least 150 words. You should spend about 20 minutes on this task. The British Council marking criteria focus on: Task Achievement, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy.",
        tips: ["Always write an overview paragraph — this is essential for a 6+ band", "DO NOT copy the title verbatim — paraphrase it", "Describe key trends and significant data points, not every number", "Use varied data language: 'rose sharply', 'remained stable', 'peaked at', 'reached a low of'"]
      },
      {
        id: "uk-w2", title: "Task 2: Discursive Essay", duration: "30 min",
        content: "Task 2 requires writing a discursive essay of at least 250 words in response to a point of view, argument, or problem. This carries TWICE the marks of Task 1. The British Council identifies five main essay types: opinion (agree/disagree), discussion (discuss both views), problem-solution, advantages-disadvantages, and two-part question essays.",
        tips: ["Spend 40 minutes on Task 2 — it's worth double the marks", "Plan for 5 minutes: identify essay type, brainstorm ideas, outline structure", "Each body paragraph: topic sentence → explanation → example → link back", "Address ALL parts of the question — partial answers cap your score at Band 5"]
      },
      {
        id: "uk-w3", title: "British Council Band Descriptors Deep Dive", duration: "25 min",
        content: "Understanding the four marking criteria is crucial. Task Achievement/Response (25%): Have you fully addressed the task? Coherence & Cohesion (25%): Is your writing logically organised with clear paragraphing? Lexical Resource (25%): Do you use a wide range of vocabulary accurately? Grammatical Range & Accuracy (25%): Do you use complex sentence structures with minimal errors?",
        tips: ["Band 7 requires: clear position throughout, logical paragraphing, less common vocabulary, variety of complex structures", "Avoid memorised phrases — examiners are trained to spot them and will penalise", "One grammatical error doesn't drop your score — consistency matters more", "Write legibly if taking the paper-based test — illegible text isn't marked"]
      },
    ],
  },
  {
    id: "speaking",
    title: "Speaking",
    icon: "🗣️",
    description: "11-14 minute face-to-face interview with a certified British Council examiner",
    lessons: [
      {
        id: "uk-s1", title: "Part 1: Introduction & Interview (4-5 mins)", duration: "20 min",
        content: "The British Council examiner will ask you questions about yourself and familiar topics such as home, family, work, studies, and interests. This section assesses your ability to communicate opinions and information on everyday topics. You should give extended answers (2-3 sentences) but remain natural.",
        tips: ["Don't give one-word answers — extend with 'because', 'for example', 'I'd say that...'", "It's OK to ask the examiner to repeat a question — say 'Could you repeat that, please?'", "Speak at a natural pace — rushing increases errors", "British Council tip: Be yourself — don't try to use overly academic language in Part 1"]
      },
      {
        id: "uk-s2", title: "Part 2: Individual Long Turn (3-4 mins)", duration: "25 min",
        content: "You receive a task card with a topic and prompts. You have 1 minute to prepare and make notes, then must speak for 1-2 minutes. The examiner will then ask one or two follow-up questions. Topics relate to personal experience: describe a person, place, event, or object.",
        tips: ["Use ALL of the 1 minute prep time — make bullet point notes", "Cover EVERY bullet point on the task card", "Structure your talk: introduce → describe → explain feelings/significance", "The examiner will stop you at 2 minutes — practise timing yourself"]
      },
      {
        id: "uk-s3", title: "Part 3: Two-Way Discussion (4-5 mins)", duration: "25 min",
        content: "Part 3 is a deeper discussion linked thematically to Part 2. The examiner asks abstract questions about society, trends, and ideas. This tests your ability to express and justify opinions, analyse, discuss, and speculate. The British Council rates this section highly for demonstrating language proficiency.",
        tips: ["Use discourse markers: 'That's an interesting question...', 'I suppose...', 'It depends on...'", "Give balanced answers: 'On one hand... on the other hand...'", "It's perfectly fine to pause briefly to think — say 'Let me think about that for a moment'", "Speculate about the future: 'I think in the coming years...', 'It's likely that...'"]
      },
    ],
  },
];

const UK_QUESTIONS: IELTSQuestion[] = [
  // Listening
  { id: "uk-q1", module: "listening", question: "In British Council IELTS Listening, how many sections are there?", options: ["2 sections", "3 sections", "4 sections", "5 sections"], correctAnswer: 2, explanation: "The British Council IELTS Listening test has 4 sections with 10 questions each, totalling 40 questions." },
  { id: "uk-q2", module: "listening", question: "In Section 1 of the Listening test, what type of conversation do you hear?", options: ["Academic lecture", "Everyday social conversation", "News broadcast", "Business meeting"], correctAnswer: 1, explanation: "Section 1 is a conversation between two people in an everyday social context, such as booking accommodation." },
  { id: "uk-q3", module: "listening", question: "What should you do if the speaker changes their answer during the recording?", options: ["Write the first answer", "Write the corrected answer", "Write both answers", "Leave it blank"], correctAnswer: 1, explanation: "If a speaker corrects themselves, the corrected answer is the one you should write — this is a common IELTS trap." },
  // Reading
  { id: "uk-q4", module: "reading", question: "In the Academic Reading test, passages are taken from:", options: ["Fiction novels", "Social media posts", "Books, journals, magazines, newspapers", "Government legislation"], correctAnswer: 2, explanation: "British Council Academic Reading uses passages from books, journals, magazines, and newspapers aimed at non-specialist readers." },
  { id: "uk-q5", module: "reading", question: "What is the difference between True/False/Not Given and Yes/No/Not Given?", options: ["They are the same thing", "T/F/NG tests facts; Y/N/NG tests the writer's views", "Y/N/NG is easier", "T/F/NG is only in General Training"], correctAnswer: 1, explanation: "True/False/Not Given tests factual information. Yes/No/Not Given tests whether the statement matches the writer's opinion or claim." },
  { id: "uk-q6", module: "reading", question: "How much time do you get for the Academic Reading test?", options: ["30 minutes", "45 minutes", "60 minutes", "90 minutes"], correctAnswer: 2, explanation: "You have exactly 60 minutes for 40 questions with no additional transfer time in the Reading test." },
  // Writing
  { id: "uk-q7", module: "writing", question: "According to British Council marking criteria, what percentage does each criterion carry?", options: ["50% each for two criteria", "25% each for four criteria", "33% each for three criteria", "Varies by task"], correctAnswer: 1, explanation: "Each of the four criteria — Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy — carries 25%." },
  { id: "uk-q8", module: "writing", question: "Task 2 carries how much weight compared to Task 1?", options: ["Equal weight", "Twice as much", "Three times as much", "Half as much"], correctAnswer: 1, explanation: "Task 2 carries twice the marks of Task 1, which is why the British Council recommends spending 40 minutes on it." },
  { id: "uk-q9", module: "writing", question: "What happens if you write fewer than 150 words in Task 1?", options: ["No penalty", "You lose marks for Task Achievement", "Your test is invalidated", "You get extra time"], correctAnswer: 1, explanation: "Writing under the minimum word count results in a penalty under the Task Achievement criterion." },
  // Speaking
  { id: "uk-q10", module: "speaking", question: "How long is the British Council IELTS Speaking test in total?", options: ["5-7 minutes", "8-10 minutes", "11-14 minutes", "20 minutes"], correctAnswer: 2, explanation: "The Speaking test is 11-14 minutes long, divided into three parts." },
  { id: "uk-q11", module: "speaking", question: "In Part 2, how long do you have to prepare your talk?", options: ["30 seconds", "1 minute", "2 minutes", "No preparation time"], correctAnswer: 1, explanation: "You receive exactly 1 minute to prepare and make notes before speaking for 1-2 minutes on the task card topic." },
  { id: "uk-q12", module: "speaking", question: "Can you ask the examiner to repeat a question?", options: ["No, never", "Only in Part 1", "Yes, in any part", "Only if you say it in a formal way"], correctAnswer: 2, explanation: "You can ask the examiner to repeat a question in any part — it's a natural communication strategy and won't affect your score." },
];

const UK_BAND_DESCRIPTORS = [
  { min: 11, max: 12, band: "8.0–9.0", label: "Expert / Very Good User" },
  { min: 9, max: 10, band: "7.0–7.5", label: "Good User" },
  { min: 7, max: 8, band: "6.0–6.5", label: "Competent User" },
  { min: 5, max: 6, band: "5.0–5.5", label: "Modest User" },
  { min: 0, max: 4, band: "4.0–4.5", label: "Limited User" },
];

const UK_TEST_FORMAT = [
  { section: "Listening", duration: "30 minutes + 10 min transfer", tasks: "4 sections, 40 questions" },
  { section: "Reading", duration: "60 minutes", tasks: "3 passages, 40 questions" },
  { section: "Writing", duration: "60 minutes", tasks: "Task 1 (150 words) + Task 2 (250 words)" },
  { section: "Speaking", duration: "11–14 minutes", tasks: "3 parts: Interview, Long Turn, Discussion" },
];

// ─── IRCC — CANADA ──────────────────────────────────────────────────────────

const CANADA_MODULES: IELTSModule[] = [
  {
    id: "listening",
    title: "Listening",
    icon: "🎧",
    description: "IELTS General Training Listening for Canadian immigration — CLB level mapping",
    lessons: [
      {
        id: "ca-l1", title: "Understanding CLB & IELTS Score Mapping", duration: "20 min",
        content: "Immigration, Refugees and Citizenship Canada (IRCC) uses the Canadian Language Benchmarks (CLB) to assess language ability. Your IELTS General Training Listening score maps directly to CLB levels. For Express Entry, you typically need CLB 7 (IELTS Listening 6.0) minimum. Higher CLB scores earn more Comprehensive Ranking System (CRS) points.",
        tips: ["CLB 7 = IELTS Listening 6.0 (minimum for most Federal Skilled Worker applications)", "CLB 9 = IELTS Listening 8.0 (maximum CRS points for language)", "IRCC only accepts IELTS General Training, not Academic, for immigration", "Your listening score directly affects your CRS score — each 0.5 band matters"]
      },
      {
        id: "ca-l2", title: "Sections 1 & 2: Daily Life in Canada Context", duration: "20 min",
        content: "Sections 1 and 2 cover everyday situations you'd encounter in Canada — renting an apartment, registering for services, community announcements. Section 1 is a conversation; Section 2 is a monologue. Focus on extracting specific details like addresses, phone numbers, and appointment times.",
        tips: ["Canadian English uses both British and American spellings — either is accepted", "Listen for Canadian-specific terms: province, SIN number, postal code format (A1A 1A1)", "Practice with various English accents — IELTS uses British, Australian, American, and Canadian speakers", "Note that phone numbers may be given in different groupings"]
      },
      {
        id: "ca-l3", title: "Sections 3 & 4: Academic & Professional Contexts", duration: "25 min",
        content: "These sections test your ability to follow academic discussions and lectures. For Canadian immigration, strong performance here demonstrates your readiness for the Canadian workplace or educational institutions. Focus on understanding opinions, main ideas, and following arguments.",
        tips: ["Pay attention to opinion language: 'I believe', 'in my view', 'the research suggests'", "Section 4 is continuous — preview all questions during the 30-second gap before it", "Academic vocabulary is essential — study common topics: environment, technology, society", "Don't leave blanks — there's no penalty for guessing"]
      },
    ],
  },
  {
    id: "reading",
    title: "Reading",
    icon: "📖",
    description: "IELTS General Training Reading — practical English for life in Canada",
    lessons: [
      {
        id: "ca-r1", title: "General Training Reading Format", duration: "25 min",
        content: "The IELTS General Training Reading test differs from Academic. It has three sections: Section 1 has 2-3 short factual texts on everyday topics (notices, advertisements, timetables). Section 2 has 2 texts on work-related topics (job descriptions, contracts, training materials). Section 3 has one long text on a general topic. IRCC requires this for immigration applications.",
        tips: ["Section 1 texts are short — scan for specific information quickly", "Section 2 relates to workplace English — critical for Canadian PR applications", "Section 3 is the most challenging — similar difficulty to Academic reading", "General Training scoring is different from Academic — the band score scale is adjusted"]
      },
      {
        id: "ca-r2", title: "Canadian Immigration Document Reading", duration: "20 min",
        content: "Practise reading document types you'll encounter in Canadian immigration: Express Entry profiles, Provincial Nominee Program (PNP) requirements, job postings on the Canadian Job Bank, rental agreements, and healthcare registration forms. This builds both test skills and real-world Canadian literacy.",
        tips: ["Familiarise yourself with Canadian government document styles", "Practice reading job postings — understand NOC codes and requirements", "Learn to extract key dates, deadlines, and eligibility criteria from official texts", "Understanding Canadian workplace vocabulary will help both your test and settlement"]
      },
      {
        id: "ca-r3", title: "Speed Reading & Answer Transfer", duration: "20 min",
        content: "You have 60 minutes for 40 questions with no extra transfer time. General Training passages are generally easier than Academic, but the volume is higher with more short texts. Build your speed by practising with timed exercises and learning to identify question types quickly.",
        tips: ["Budget time: 15 mins for Section 1, 20 mins for Section 2, 25 mins for Section 3", "Write answers directly on the answer sheet — no transfer time is given", "For matching questions, read ALL options before starting to match", "If you can't find an answer in 90 seconds, mark your best guess and move on"]
      },
    ],
  },
  {
    id: "writing",
    title: "Writing",
    icon: "✍️",
    description: "IELTS General Training Writing — letters and essays for Canadian immigration",
    lessons: [
      {
        id: "ca-w1", title: "Task 1: Letter Writing", duration: "25 min",
        content: "Unlike Academic IELTS, General Training Task 1 requires writing a letter of at least 150 words. The letter can be formal, semi-formal, or informal. You must identify the correct tone from the task prompt. Common scenarios include writing to a landlord, employer, local council, or a friend. IRCC expects CLB 7+ for most immigration streams.",
        tips: ["Identify the tone: formal (Dear Sir/Madam), semi-formal (Dear Mr. Smith), informal (Dear John)", "Cover ALL three bullet points in the task — missing one limits your band score", "Formal letters: no contractions (do not vs don't), use passive voice where appropriate", "Spend 20 minutes maximum — Task 2 is worth double the marks"]
      },
      {
        id: "ca-w2", title: "Task 2: Essay Writing for CLB Scoring", duration: "30 min",
        content: "Task 2 asks you to write a discursive essay of at least 250 words. For Canadian immigration, your Writing score maps to CLB levels. CLB 7 requires IELTS Writing 6.0, which means demonstrating clear organisation, relevant ideas, and adequate vocabulary range. Plan your essay carefully.",
        tips: ["Essay types: opinion, discussion, problem-solution, advantages-disadvantages", "CLB 7 (Band 6.0): clear position, logical structure, some less common vocabulary", "CLB 9 (Band 7.0): sustained position, well-organised, good range of structures", "Always write a clear thesis statement in your introduction"]
      },
      {
        id: "ca-w3", title: "Common Canadian Themes in IELTS Essays", duration: "20 min",
        content: "IELTS essays often feature topics relevant to life in Canada: multiculturalism, immigration benefits, environmental policies, work-life balance, technology in education, and healthcare systems. Familiarising yourself with these themes helps you generate ideas faster during the test.",
        tips: ["Read Canadian news sources (CBC, Globe and Mail) to build topic knowledge", "Practice writing about: immigration policy, cultural diversity, climate change, remote work", "Use specific examples — Canadian or international — to support your arguments", "Avoid memorised essays — IELTS examiners are trained to detect them"]
      },
    ],
  },
  {
    id: "speaking",
    title: "Speaking",
    icon: "🗣️",
    description: "Face-to-face speaking test — critical for Canadian Express Entry CRS points",
    lessons: [
      {
        id: "ca-s1", title: "Part 1: Personal Introduction for Canadian Context", duration: "20 min",
        content: "Part 1 lasts 4-5 minutes. The examiner asks about familiar topics. For Canadian immigration context, practise discussing: your hometown, your job and career goals, why you're interested in Canada, your hobbies and daily routine. Natural fluency is more important than complex vocabulary here.",
        tips: ["Extend answers with reasons: 'I work in IT because...' rather than just 'I work in IT'", "Discuss Canada-related topics confidently — you may be asked about future plans", "Don't memorise answers — examiners can tell and it affects your fluency score", "Use natural fillers appropriately: 'Well...', 'Actually...', 'To be honest...'"]
      },
      {
        id: "ca-s2", title: "Part 2: Long Turn with Canadian Topics", duration: "25 min",
        content: "You receive a cue card and have 1 minute to prepare, then speak for 1-2 minutes. Common topics include describing experiences, places, people, or events. Practise with Canadian-relevant topics: a skill you'd use in Canada, a city you'd like to live in, a challenge you've overcome.",
        tips: ["Use the 1-minute prep wisely — jot key points for each bullet", "Structure: introduce the topic → give details → explain significance/feelings", "If you run out of things to say, relate it back to your personal experience", "Time yourself — practise speaking for exactly 2 minutes on random topics"]
      },
      {
        id: "ca-s3", title: "Part 3: Discussion on Society & Immigration", duration: "25 min",
        content: "Part 3 involves abstract discussion linked to your Part 2 topic. The examiner tests your ability to analyse, compare, speculate, and evaluate. Topics often relate to societal issues — perfect preparation for discussing life in a multicultural country like Canada.",
        tips: ["Give balanced views: 'Some people argue... whereas others believe...'", "Use speculation: 'In the future, I think...', 'It's possible that...'", "Compare past and present: 'In my country, this has changed significantly...'", "Don't be afraid to ask for clarification — 'Do you mean... or...?'"]
      },
    ],
  },
];

const CANADA_QUESTIONS: IELTSQuestion[] = [
  { id: "ca-q1", module: "listening", question: "What does CLB stand for in Canadian immigration?", options: ["Canadian Language Benchmark", "Common Language Board", "Canadian Literacy Base", "Certified Language Band"], correctAnswer: 0, explanation: "CLB stands for Canadian Language Benchmarks, the standard used by IRCC to assess language proficiency." },
  { id: "ca-q2", module: "listening", question: "What minimum CLB level is typically required for Express Entry (Federal Skilled Worker)?", options: ["CLB 5", "CLB 6", "CLB 7", "CLB 9"], correctAnswer: 2, explanation: "CLB 7 (IELTS 6.0 in each skill) is the minimum for the Federal Skilled Worker program under Express Entry." },
  { id: "ca-q3", module: "listening", question: "Which version of IELTS does IRCC accept for immigration?", options: ["Academic only", "General Training only", "Both Academic and General Training", "IELTS Life Skills only"], correctAnswer: 1, explanation: "IRCC only accepts IELTS General Training for immigration applications, not Academic." },
  { id: "ca-q4", module: "reading", question: "How is General Training Reading different from Academic Reading?", options: ["Fewer questions", "Includes everyday texts like notices and ads", "Shorter time limit", "No difference"], correctAnswer: 1, explanation: "GT Reading Section 1 includes everyday texts like notices, ads, and timetables, while Academic uses longer academic passages." },
  { id: "ca-q5", module: "reading", question: "What is a NOC code in Canadian job postings?", options: ["A postal code", "National Occupational Classification", "A tax number", "A visa category"], correctAnswer: 1, explanation: "NOC (National Occupational Classification) codes classify occupations and are used by IRCC to assess work experience eligibility." },
  { id: "ca-q6", module: "reading", question: "How much time is given for the General Training Reading test?", options: ["30 minutes", "45 minutes", "60 minutes", "75 minutes"], correctAnswer: 2, explanation: "You have 60 minutes for 40 questions with no additional transfer time." },
  { id: "ca-q7", module: "writing", question: "What type of writing is Task 1 in General Training IELTS?", options: ["Essay", "Report", "Letter", "Summary"], correctAnswer: 2, explanation: "General Training Task 1 is a letter (formal, semi-formal, or informal) of at least 150 words." },
  { id: "ca-q8", module: "writing", question: "For CLB 9 in Writing, what IELTS band score do you need?", options: ["Band 6.0", "Band 6.5", "Band 7.0", "Band 8.0"], correctAnswer: 2, explanation: "CLB 9 requires an IELTS Writing band of 7.0." },
  { id: "ca-q9", module: "writing", question: "How many bullet points must you address in a GT Task 1 letter?", options: ["1", "2", "3", "4"], correctAnswer: 2, explanation: "Every GT Task 1 letter has 3 bullet points that you must address to achieve a good Task Achievement score." },
  { id: "ca-q10", module: "speaking", question: "Does your IELTS Speaking score affect CRS points?", options: ["No, only Writing matters", "Yes, it directly maps to CLB and CRS points", "Only if you score Band 8+", "Only for PNP applications"], correctAnswer: 1, explanation: "Your Speaking score maps to a CLB level which directly contributes to your CRS score for Express Entry." },
  { id: "ca-q11", module: "speaking", question: "How long is the IELTS Speaking test?", options: ["5-7 minutes", "8-10 minutes", "11-14 minutes", "15-20 minutes"], correctAnswer: 2, explanation: "The Speaking test is 11-14 minutes, divided into 3 parts." },
  { id: "ca-q12", module: "speaking", question: "In Part 1, what is the best strategy for answering?", options: ["Give one-word answers", "Use memorised scripts", "Give extended natural answers with reasons", "Use only formal language"], correctAnswer: 2, explanation: "Extended, natural answers with reasons and examples demonstrate fluency without sounding rehearsed." },
];

const CANADA_BAND_DESCRIPTORS = [
  { min: 11, max: 12, band: "8.0–9.0", label: "CLB 10+ (Maximum CRS Points)" },
  { min: 9, max: 10, band: "7.0–7.5", label: "CLB 9 (Strong CRS Points)" },
  { min: 7, max: 8, band: "6.0–6.5", label: "CLB 7–8 (Meets FSW Minimum)" },
  { min: 5, max: 6, band: "5.0–5.5", label: "CLB 5–6 (Below FSW Minimum)" },
  { min: 0, max: 4, band: "4.0–4.5", label: "CLB 4 (Insufficient for PR)" },
];

const CANADA_TEST_FORMAT = [
  { section: "Listening", duration: "30 minutes + 10 min transfer", tasks: "4 sections, 40 questions → CLB mapping" },
  { section: "Reading (General Training)", duration: "60 minutes", tasks: "3 sections: everyday, workplace, general texts" },
  { section: "Writing (General Training)", duration: "60 minutes", tasks: "Task 1: Letter (150 words) + Task 2: Essay (250 words)" },
  { section: "Speaking", duration: "11–14 minutes", tasks: "3 parts → CLB level assessment" },
];

// ─── DHA / IDP AUSTRALIA ────────────────────────────────────────────────────

const AUSTRALIA_MODULES: IELTSModule[] = [
  {
    id: "listening",
    title: "Listening",
    icon: "🎧",
    description: "IELTS Listening for Australian visa applications — DHA score requirements",
    lessons: [
      {
        id: "au-l1", title: "DHA English Requirements & IELTS Scores", duration: "20 min",
        content: "The Department of Home Affairs (DHA) requires different IELTS scores depending on the visa subclass. For Skilled Migration (subclass 189/190/491), you need 'Competent English' (IELTS 6.0 in each band) minimum. 'Proficient English' (IELTS 7.0 each) and 'Superior English' (IELTS 8.0 each) earn additional points on the SkillSelect points test.",
        tips: ["Competent English: IELTS 6.0 in each band (minimum for most skilled visas)", "Proficient English: IELTS 7.0 each → 10 extra points on the points test", "Superior English: IELTS 8.0 each → 20 extra points on the points test", "DHA accepts both Academic and General Training IELTS for most visa subclasses"]
      },
      {
        id: "au-l2", title: "Listening for Australian Accents & Contexts", duration: "20 min",
        content: "While IELTS uses a variety of English accents, Australian English features prominently as IDP Australia co-owns IELTS. Familiarise yourself with Australian pronunciation patterns, colloquialisms, and contexts. Listening sections may include Australian university lectures, community announcements, and social conversations.",
        tips: ["Australian English: 'mate' (friend), 'arvo' (afternoon), 'uni' (university)", "Listen for Australian place names — they may be Aboriginal in origin", "IDP Australia administers IELTS — expect Australian English in recordings", "Practice with Australian podcasts and news (ABC News, SBS)"]
      },
      {
        id: "au-l3", title: "Map, Diagram & Multiple Choice Strategies", duration: "25 min",
        content: "Map and diagram questions are common in Sections 2 and 3. For Australian visa applications, strong listening performance can earn significant extra points. Focus on spatial vocabulary, process descriptions, and multi-speaker discussions. Every 0.5 band increase can mean additional points.",
        tips: ["Study maps/diagrams BEFORE audio starts — identify landmarks and labels", "For multiple choice: eliminate obviously wrong answers first", "In multi-speaker sections, note WHO says WHAT — opinions may differ", "Review your answers during the 10-minute transfer time at the end"]
      },
    ],
  },
  {
    id: "reading",
    title: "Reading",
    icon: "📖",
    description: "IELTS Reading — Academic or General Training accepted by DHA for most visas",
    lessons: [
      {
        id: "au-r1", title: "Academic vs General Training for Australian Visas", duration: "25 min",
        content: "Unlike Canada (which requires General Training for immigration), Australia's DHA accepts both Academic and General Training IELTS for most skilled visa applications. Academic is recommended if you're also planning to study in Australia. The scoring differs between Academic and GT for Reading only.",
        tips: ["Academic Reading: 3 long academic passages — more challenging but same acceptance", "General Training Reading: workplace and everyday texts — potentially easier", "Choose based on your strengths and whether you plan to study in Australia", "Both map to the same points test: Competent (6), Proficient (7), Superior (8)"]
      },
      {
        id: "au-r2", title: "Australian Workplace & Academic Texts", duration: "20 min",
        content: "Practise reading texts relevant to Australian life: job advertisements on Seek.com.au, rental agreements, university course guides, government service information (Centrelink, Medicare), and workplace health and safety documents. This builds both test skills and Australian literacy.",
        tips: ["Understand Australian workplace terminology: ABN, TFN, superannuation, Fair Work", "Government texts: Medicare, Centrelink, myGov — practise extracting key information", "Rental/housing vocabulary: bond, real estate agent, strata, lease agreement", "Australian academic texts often reference environmental, indigenous, and social topics"]
      },
      {
        id: "au-r3", title: "Maximising Your Reading Score for Points", duration: "20 min",
        content: "On Australia's SkillSelect points test, moving from IELTS 6.0 to 7.0 in Reading earns 10 additional points. Moving from 7.0 to 8.0 earns another 10 points. Strategic preparation for Reading can significantly boost your overall points score. Focus on your weakest question types.",
        tips: ["Identify your weakest question types and drill them specifically", "Summary completion and matching features are often the trickiest", "For True/False/Not Given: focus on what the TEXT says, not your knowledge", "Time pressure is the biggest challenge — practise full tests under timed conditions"]
      },
    ],
  },
  {
    id: "writing",
    title: "Writing",
    icon: "✍️",
    description: "IELTS Writing — achieve Proficient or Superior English for maximum DHA points",
    lessons: [
      {
        id: "au-w1", title: "Task 1: Reports & Letters for Australian Contexts", duration: "25 min",
        content: "Academic Task 1: describe charts, graphs, diagrams, or maps (150+ words). General Training Task 1: write a letter. For Australian skilled migration, Writing is often the hardest skill to score highly in. DHA requires a minimum of 6.0, but 7.0+ is ideal for competitive applications.",
        tips: ["Academic: overview paragraph is ESSENTIAL — summarise key trends before details", "General Training: identify tone (formal/semi-formal/informal) from the task", "Both: stick to the word count minimum — under 150 words loses marks", "Writing is the hardest band to improve — start practising early"]
      },
      {
        id: "au-w2", title: "Task 2: Essay Topics Relevant to Australia", duration: "30 min",
        content: "IELTS essay topics often align with Australian societal discussions: environmental conservation, immigration and multiculturalism, education systems, healthcare funding, urbanisation, and work-life balance. Being familiar with these themes helps you generate ideas quickly under exam pressure.",
        tips: ["Common Australian-relevant topics: Great Barrier Reef conservation, immigration policy, Indigenous rights", "Structure: introduction (thesis) → body 1 (main argument) → body 2 (counter/support) → conclusion", "Use specific examples — Australian or international — to support your points", "Band 7 requires: clear position throughout, well-developed ideas, good paragraphing"]
      },
      {
        id: "au-w3", title: "Writing Band Descriptors & DHA Points Impact", duration: "25 min",
        content: "Understanding how each 0.5 band increase affects your DHA points application is crucial. Writing 6.0 = Competent (0 extra points), Writing 7.0 = Proficient (10 points), Writing 8.0 = Superior (20 points). Focus on the four criteria: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.",
        tips: ["Band 6→7 jump requires: wider vocabulary, fewer errors, clearer organisation", "Band 7→8 jump requires: sophisticated vocabulary, rare errors, complex structures throughout", "Get professional feedback on practice essays — self-assessment is unreliable for Writing", "Practice writing by hand if taking the paper-based test — speed and legibility matter"]
      },
    ],
  },
  {
    id: "speaking",
    title: "Speaking",
    icon: "🗣️",
    description: "IELTS Speaking — face-to-face interview for Australian visa points",
    lessons: [
      {
        id: "au-s1", title: "Part 1: Introduction with Australian Contexts", duration: "20 min",
        content: "Part 1 lasts 4-5 minutes and covers familiar topics. For Australian migration, practise discussing: your profession and its relevance to Australia's skills shortage, your interest in Australian cities, outdoor activities (very common in Australian culture), and your plans for settlement.",
        tips: ["Discuss Australian-relevant topics confidently: beaches, outdoor lifestyle, multiculturalism", "Mention specific Australian cities or regions if asked about plans", "Natural fluency matters more than perfect grammar in Part 1", "Practise common topics: work, home, transport, food, leisure, weather"]
      },
      {
        id: "au-s2", title: "Part 2: Individual Long Turn Strategies", duration: "25 min",
        content: "You receive a cue card with a topic and 3-4 prompts. After 1 minute of preparation, you speak for 1-2 minutes. Common topics: describe a skill, a place you'd like to visit, a positive experience, a person who influenced you. IDP Australia examiners look for natural extended speech.",
        tips: ["Cover ALL bullet points on the card — missing one affects coherence", "Use time markers: 'First of all...', 'After that...', 'In the end...'", "If you blank on a point, relate it back to personal experience", "IDP tip: Examiners value natural speech over complex vocabulary"]
      },
      {
        id: "au-s3", title: "Part 3: Abstract Discussion for Maximum Points", duration: "25 min",
        content: "Part 3 tests your ability to discuss abstract topics at length. For DHA points, achieving Speaking 7.0+ (Proficient) or 8.0+ (Superior) is valuable. Demonstrate analytical thinking, use complex structures, and give extended thoughtful answers. Topics often relate to society, technology, education, or environment.",
        tips: ["Develop ideas fully: give reasons, examples, and personal reflections", "Show range: use conditional ('If...'), passive ('It is believed that...'), modal ('It could be argued...')", "Compare and contrast: 'In my country vs Australia...', 'In the past vs now...'", "Don't rush — thoughtful pauses show you're formulating complex ideas"]
      },
    ],
  },
];

const AUSTRALIA_QUESTIONS: IELTSQuestion[] = [
  { id: "au-q1", module: "listening", question: "What IELTS score constitutes 'Competent English' for DHA?", options: ["5.0 in each band", "6.0 in each band", "7.0 in each band", "Overall 6.0"], correctAnswer: 1, explanation: "DHA defines Competent English as IELTS 6.0 in each of the four bands (Listening, Reading, Writing, Speaking)." },
  { id: "au-q2", module: "listening", question: "How many extra SkillSelect points does 'Proficient English' (IELTS 7.0 each) earn?", options: ["0 points", "5 points", "10 points", "20 points"], correctAnswer: 2, explanation: "Proficient English (IELTS 7.0 in each band) earns 10 additional points on the SkillSelect points test." },
  { id: "au-q3", module: "listening", question: "Who co-owns and administers IELTS in Australia?", options: ["British Council only", "Cambridge only", "IDP Australia", "DHA"], correctAnswer: 2, explanation: "IDP Australia is a co-owner of IELTS and administers the test in Australia and many other countries." },
  { id: "au-q4", module: "reading", question: "Does DHA accept both Academic and General Training IELTS?", options: ["Only Academic", "Only General Training", "Both for most visa subclasses", "Neither — they require PTE"], correctAnswer: 2, explanation: "DHA accepts both Academic and General Training IELTS for most skilled visa subclasses." },
  { id: "au-q5", module: "reading", question: "What is a TFN in Australian workplace context?", options: ["Trade Function Number", "Tax File Number", "Technical Field Number", "Temporary File Note"], correctAnswer: 1, explanation: "TFN (Tax File Number) is a unique identifier issued by the Australian Taxation Office for tax purposes." },
  { id: "au-q6", module: "reading", question: "How many passages are in the IELTS Academic Reading test?", options: ["2", "3", "4", "5"], correctAnswer: 1, explanation: "The Academic Reading test has 3 passages with a total of 40 questions to be completed in 60 minutes." },
  { id: "au-q7", module: "writing", question: "What is the minimum word count for IELTS Task 2?", options: ["150 words", "200 words", "250 words", "300 words"], correctAnswer: 2, explanation: "Task 2 requires a minimum of 250 words. Writing fewer results in a penalty under Task Response." },
  { id: "au-q8", module: "writing", question: "How many extra points does 'Superior English' (IELTS 8.0 each) earn on SkillSelect?", options: ["5 points", "10 points", "15 points", "20 points"], correctAnswer: 3, explanation: "Superior English (IELTS 8.0 in each band) earns 20 additional points on the SkillSelect points test." },
  { id: "au-q9", module: "writing", question: "Which IELTS band is most test-takers' lowest score?", options: ["Listening", "Reading", "Writing", "Speaking"], correctAnswer: 2, explanation: "Writing is consistently the lowest-scoring band for most IELTS test-takers worldwide." },
  { id: "au-q10", module: "speaking", question: "How long should your Part 2 talk last?", options: ["30 seconds – 1 minute", "1 – 2 minutes", "2 – 3 minutes", "3 – 4 minutes"], correctAnswer: 1, explanation: "You should speak for 1-2 minutes. The examiner will stop you at 2 minutes." },
  { id: "au-q11", module: "speaking", question: "In Part 3, what skill is the examiner primarily testing?", options: ["Pronunciation only", "Vocabulary range only", "Ability to discuss abstract ideas analytically", "Speed of speech"], correctAnswer: 2, explanation: "Part 3 tests your ability to discuss abstract topics — analysing, comparing, speculating, and evaluating." },
  { id: "au-q12", module: "speaking", question: "What visa subclass is the Skilled Independent visa?", options: ["Subclass 482", "Subclass 189", "Subclass 500", "Subclass 820"], correctAnswer: 1, explanation: "Subclass 189 is the Skilled Independent visa, a permanent residence visa requiring a SkillSelect invitation." },
];

const AUSTRALIA_BAND_DESCRIPTORS = [
  { min: 11, max: 12, band: "8.0–9.0", label: "Superior English (+20 DHA Points)" },
  { min: 9, max: 10, band: "7.0–7.5", label: "Proficient English (+10 DHA Points)" },
  { min: 7, max: 8, band: "6.0–6.5", label: "Competent English (Minimum Requirement)" },
  { min: 5, max: 6, band: "5.0–5.5", label: "Vocational English (Limited Visa Options)" },
  { min: 0, max: 4, band: "4.0–4.5", label: "Below Minimum (Not Eligible)" },
];

const AUSTRALIA_TEST_FORMAT = [
  { section: "Listening", duration: "30 minutes + 10 min transfer", tasks: "4 sections, 40 questions" },
  { section: "Reading", duration: "60 minutes", tasks: "Academic: 3 passages / GT: 3 sections (everyday, work, general)" },
  { section: "Writing", duration: "60 minutes", tasks: "Task 1 (150 words) + Task 2 (250 words)" },
  { section: "Speaking", duration: "11–14 minutes", tasks: "3 parts: Interview, Long Turn, Discussion" },
];

// ─── COUNTRY CONFIG MAP ─────────────────────────────────────────────────────

export const COUNTRY_TEST_CONFIGS: Record<string, CountryTestConfig> = {
  uk: {
    councilName: "British Council",
    councilLogo: "🇬🇧",
    testName: "IELTS",
    testFullName: "International English Language Testing System",
    tagline: "Preparing you for the British Council IELTS examination",
    accentColor: "from-blue-600 to-red-600",
    modules: UK_MODULES,
    questions: UK_QUESTIONS,
    bandDescriptors: UK_BAND_DESCRIPTORS,
    testFormat: UK_TEST_FORMAT,
  },
  canada: {
    councilName: "IRCC (Immigration, Refugees and Citizenship Canada)",
    councilLogo: "🇨🇦",
    testName: "IELTS General Training",
    testFullName: "IELTS for Canadian Immigration — CLB Mapped",
    tagline: "IELTS preparation aligned with Canadian Language Benchmarks (CLB)",
    accentColor: "from-red-600 to-red-400",
    modules: CANADA_MODULES,
    questions: CANADA_QUESTIONS,
    bandDescriptors: CANADA_BAND_DESCRIPTORS,
    testFormat: CANADA_TEST_FORMAT,
  },
  australia: {
    councilName: "DHA & IDP Australia",
    councilLogo: "🇦🇺",
    testName: "IELTS",
    testFullName: "IELTS for Australian Skilled Migration — SkillSelect Points",
    tagline: "IELTS preparation aligned with DHA English proficiency requirements",
    accentColor: "from-yellow-600 to-green-700",
    modules: AUSTRALIA_MODULES,
    questions: AUSTRALIA_QUESTIONS,
    bandDescriptors: AUSTRALIA_BAND_DESCRIPTORS,
    testFormat: AUSTRALIA_TEST_FORMAT,
  },
};

// Fallback exports for backward compatibility
export const IELTS_MODULES = UK_MODULES;
export const IELTS_TEST_QUESTIONS = UK_QUESTIONS;


