// Realistic IELTS practice content: reading passages, listening transcripts, writing prompts, speaking cue cards

export type Difficulty = "easy" | "medium" | "hard";

export interface ReadingPassage {
  id: string;
  title: string;
  passage: string;
  source: string;
  difficulty: Difficulty;
  questions: PracticeQuestion[];
}

export interface ListeningExercise {
  id: string;
  title: string;
  section: number;
  transcript: string;
  context: string;
  difficulty: Difficulty;
  questions: PracticeQuestion[];
}

export interface WritingTask {
  id: string;
  taskNumber: 1 | 2;
  title: string;
  prompt: string;
  sampleAnswer?: string;
  tips: string[];
  difficulty: Difficulty;
  wordLimit: number;
  timeLimit: number; // minutes
  criteria: { name: string; description: string }[];
}

export interface SpeakingCueCard {
  id: string;
  part: 1 | 2 | 3;
  topic: string;
  prompts: string[];
  followUpQuestions: string[];
  sampleIdeas: string[];
  difficulty: Difficulty;
  timeLimit: number; // seconds
}

export interface PracticeQuestion {
  id: string;
  type: "mcq" | "true-false-ng" | "fill-blank" | "matching" | "short-answer";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

export interface TestAttempt {
  id: string;
  date: string;
  country: string;
  scores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    overall: number;
  };
  totalQuestions: number;
  correctAnswers: number;
}

// ─── UK BRITISH COUNCIL READING PASSAGES ────────────────────────────────────

const UK_READING_PASSAGES: ReadingPassage[] = [
  {
    id: "uk-rp1",
    title: "The Impact of Urbanisation on Wildlife",
    source: "Academic Passage — British Council Sample",
    difficulty: "medium",
    passage: `Urbanisation is one of the most significant environmental changes of the twenty-first century. As cities expand, natural habitats are destroyed or fragmented, forcing wildlife to adapt, relocate, or perish. However, recent research has revealed that some species are not merely surviving in urban environments — they are thriving.

A study conducted by the University of Sheffield found that urban foxes in British cities have undergone measurable behavioural and physiological changes compared to their rural counterparts. Urban foxes have shorter snouts, smaller brain cases, and exhibit bolder behaviour around humans. Dr. Kevin Parsons, who led the research, described these changes as "the beginnings of domestication," though he cautioned against drawing direct comparisons with dogs.

The phenomenon extends beyond mammals. Urban blackbirds in European cities sing at higher frequencies than their forest-dwelling relatives, an adaptation that helps their calls cut through low-frequency traffic noise. Similarly, great tits in cities have been observed using shorter, faster songs to communicate effectively in noisy environments. These vocal adaptations appear to be learned rather than genetic, suggesting a degree of cultural evolution.

Not all species benefit from urbanisation, however. Ground-nesting birds such as skylarks and lapwings have seen dramatic population declines as agricultural land on city fringes is converted to housing. Amphibians are particularly vulnerable, as urban development often destroys the ponds and wetlands essential for their reproduction. The common toad, once ubiquitous across Britain, has experienced a 68% population decline over the past thirty years, with habitat loss cited as the primary driver.

Urban planners are increasingly recognising the importance of incorporating green infrastructure into city designs. Green roofs, wildlife corridors, and sustainable drainage systems (SuDS) can provide vital habitats for urban wildlife. The London Biodiversity Action Plan, for instance, identifies 250 priority species and sets targets for their conservation within the Greater London area. Such initiatives represent a growing acknowledgment that cities need not be biological deserts.

The relationship between urbanisation and wildlife is complex and multifaceted. While some species demonstrate remarkable adaptability, others face existential threats. The challenge for the twenty-first century is to design cities that accommodate both human needs and ecological sustainability — a goal that requires collaboration between urban planners, ecologists, and policymakers.`,
    questions: [
      { id: "uk-rp1-q1", type: "true-false-ng", question: "Urban foxes have larger brain cases than rural foxes.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "The passage states urban foxes have 'smaller brain cases' compared to rural counterparts.", difficulty: "easy" },
      { id: "uk-rp1-q2", type: "true-false-ng", question: "Dr. Kevin Parsons compared urban foxes directly to domesticated dogs.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "The passage says he 'cautioned against drawing direct comparisons with dogs.'", difficulty: "medium" },
      { id: "uk-rp1-q3", type: "true-false-ng", question: "Urban blackbirds sing at lower frequencies than forest blackbirds.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "Urban blackbirds sing at 'higher frequencies' to cut through traffic noise.", difficulty: "easy" },
      { id: "uk-rp1-q4", type: "mcq", question: "The vocal adaptations of urban great tits are described as:", options: ["Genetic mutations", "Learned cultural behaviours", "Random variations", "Instinctive responses"], correctAnswer: "Learned cultural behaviours", explanation: "The passage states these adaptations 'appear to be learned rather than genetic, suggesting a degree of cultural evolution.'", difficulty: "medium" },
      { id: "uk-rp1-q5", type: "fill-blank", question: "The common toad has experienced a ___% population decline over thirty years.", correctAnswer: "68", explanation: "The passage explicitly states 'a 68% population decline over the past thirty years.'", difficulty: "easy" },
      { id: "uk-rp1-q6", type: "mcq", question: "What is cited as the primary driver of the common toad's population decline?", options: ["Climate change", "Pollution", "Habitat loss", "Predation by foxes"], correctAnswer: "Habitat loss", explanation: "The passage states 'habitat loss cited as the primary driver.'", difficulty: "easy" },
      { id: "uk-rp1-q7", type: "true-false-ng", question: "The London Biodiversity Action Plan covers 500 priority species.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "The plan 'identifies 250 priority species', not 500.", difficulty: "medium" },
      { id: "uk-rp1-q8", type: "mcq", question: "Which of the following is NOT mentioned as green infrastructure?", options: ["Green roofs", "Wildlife corridors", "Underground tunnels", "Sustainable drainage systems"], correctAnswer: "Underground tunnels", explanation: "The passage mentions green roofs, wildlife corridors, and SuDS. Underground tunnels are not mentioned.", difficulty: "medium" },
      { id: "uk-rp1-q9", type: "true-false-ng", question: "The University of Sheffield study focused on urban pigeons.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "The University of Sheffield study was about urban foxes, not pigeons.", difficulty: "easy" },
      { id: "uk-rp1-q10", type: "short-answer", question: "What type of birds are skylarks and lapwings classified as?", correctAnswer: "ground-nesting birds", explanation: "The passage identifies them as 'ground-nesting birds.'", difficulty: "medium" },
      { id: "uk-rp1-q11", type: "mcq", question: "The author's overall tone towards urbanisation and wildlife is:", options: ["Entirely pessimistic", "Balanced and nuanced", "Completely optimistic", "Indifferent"], correctAnswer: "Balanced and nuanced", explanation: "The author presents both positive adaptations and negative impacts, concluding with a call for balanced solutions.", difficulty: "hard" },
      { id: "uk-rp1-q12", type: "true-false-ng", question: "Amphibians are more vulnerable to urbanisation than mammals.", options: ["True", "False", "Not Given"], correctAnswer: "Not Given", explanation: "While amphibians are described as 'particularly vulnerable', no direct comparison ranking them above mammals is made.", difficulty: "hard" },
    ],
  },
  {
    id: "uk-rp2",
    title: "The History of the London Underground",
    source: "Academic Passage — British Council Format",
    difficulty: "hard",
    passage: `The London Underground, colloquially known as "the Tube," is the world's oldest underground railway network. Its first section, between Paddington and Farringdon, opened on 10 January 1863. The Metropolitan Railway, as it was then known, carried 38,000 passengers on its opening day — a figure that astonished its Victorian creators.

The original tunnels were built using the "cut and cover" method: streets were excavated, tunnel walls and roofs constructed, and the road surface restored above. This method was disruptive and expensive, limiting expansion to areas where surface disruption was tolerable. The breakthrough came in 1890 with the opening of the City and South London Railway, the world's first deep-level electric underground railway. This line used circular tunnels bored through London's clay — the technique that gave the Tube its distinctive name.

The early twentieth century saw rapid expansion under the influence of several private companies. However, the fragmented ownership led to inefficiencies: competing lines duplicated routes while leaving other areas underserved. The establishment of the London Passenger Transport Board (LPTB) in 1933 brought the network under unified public control for the first time. Under the leadership of Frank Pick, the LPTB commissioned iconic design work that remains central to the Tube's identity, including Harry Beck's revolutionary diagrammatic map (1933) and Charles Holden's modernist station architecture.

During the Second World War, the Underground served an unexpected purpose. Tube stations became air-raid shelters for thousands of Londoners during the Blitz. At the peak of the bombing in September 1940, an estimated 177,000 people sheltered in Underground stations each night. The government initially resisted this use, concerned about a "deep shelter mentality" that might undermine public morale, but public demand proved irresistible.

The post-war period brought both expansion and decline. The Victoria line opened in 1968-69, introducing automatic train operation for the first time. However, decades of underinvestment led to deteriorating infrastructure and a series of safety incidents, culminating in the King's Cross fire of November 1987, which killed 31 people and led to sweeping safety reforms.

Today, the London Underground carries approximately 5 million passenger journeys per day across 11 lines and 272 stations. The Elizabeth line, which opened in 2022, represents the most significant addition to the network in a generation. Despite its age and the engineering challenges of maintaining a Victorian-era system beneath a modern metropolis, the Tube remains an essential part of London's transport infrastructure and cultural identity.`,
    questions: [
      { id: "uk-rp2-q1", type: "fill-blank", question: "The first section of the Underground opened on ___ January 1863.", correctAnswer: "10", explanation: "The passage states it opened on '10 January 1863.'", difficulty: "easy" },
      { id: "uk-rp2-q2", type: "mcq", question: "How many passengers used the Metropolitan Railway on its opening day?", options: ["18,000", "28,000", "38,000", "48,000"], correctAnswer: "38,000", explanation: "The passage states 'carried 38,000 passengers on its opening day.'", difficulty: "easy" },
      { id: "uk-rp2-q3", type: "mcq", question: "What construction method was used for the original tunnels?", options: ["Tunnel boring", "Cut and cover", "Shield tunnelling", "Open excavation"], correctAnswer: "Cut and cover", explanation: "The original tunnels were built using the 'cut and cover' method.", difficulty: "easy" },
      { id: "uk-rp2-q4", type: "fill-blank", question: "The world's first deep-level electric underground railway opened in ___.", correctAnswer: "1890", explanation: "The breakthrough came in 1890 with the City and South London Railway.", difficulty: "easy" },
      { id: "uk-rp2-q5", type: "true-false-ng", question: "Harry Beck's map was a geographical representation of London.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "It is described as a 'revolutionary diagrammatic map', not geographical.", difficulty: "medium" },
      { id: "uk-rp2-q6", type: "mcq", question: "Why did the government initially resist using stations as shelters?", options: ["Cost concerns", "Structural weakness fears", "Fear of 'deep shelter mentality'", "Military use of tunnels"], correctAnswer: "Fear of 'deep shelter mentality'", explanation: "The government was 'concerned about a \"deep shelter mentality\" that might undermine public morale.'", difficulty: "medium" },
      { id: "uk-rp2-q7", type: "fill-blank", question: "At the peak of the Blitz, an estimated ___ people sheltered in stations each night.", correctAnswer: "177,000", explanation: "The passage states 'an estimated 177,000 people.'", difficulty: "medium" },
      { id: "uk-rp2-q8", type: "mcq", question: "The Victoria line was notable for introducing:", options: ["Air conditioning", "Automatic train operation", "Contactless payment", "Wi-Fi connectivity"], correctAnswer: "Automatic train operation", explanation: "The Victoria line introduced 'automatic train operation for the first time.'", difficulty: "medium" },
      { id: "uk-rp2-q9", type: "fill-blank", question: "The King's Cross fire killed ___ people.", correctAnswer: "31", explanation: "The passage states the fire 'killed 31 people.'", difficulty: "easy" },
      { id: "uk-rp2-q10", type: "true-false-ng", question: "The Elizabeth line opened in 2023.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "The Elizabeth line 'opened in 2022', not 2023.", difficulty: "easy" },
      { id: "uk-rp2-q11", type: "mcq", question: "How many stations does the current Underground network have?", options: ["212", "252", "272", "302"], correctAnswer: "272", explanation: "The passage states '272 stations.'", difficulty: "medium" },
      { id: "uk-rp2-q12", type: "true-false-ng", question: "Charles Holden designed the Tube map.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "Harry Beck designed the map. Charles Holden designed 'modernist station architecture.'", difficulty: "hard" },
    ],
  },
];

// ─── UK LISTENING EXERCISES ─────────────────────────────────────────────────

const UK_LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: "uk-le1",
    title: "Section 1: Booking a Hotel Room",
    section: 1,
    context: "You will hear a conversation between a customer and a hotel receptionist. Read the questions first, then read the transcript carefully as if you were listening.",
    difficulty: "easy",
    transcript: `Receptionist: Good morning, the Grand Oak Hotel. How can I help you?

Customer: Hi, I'd like to book a room for next weekend, please. The 15th and 16th of March.

Receptionist: Certainly. Would you prefer a single or double room?

Customer: A double room, please. And could you tell me the rates?

Receptionist: Of course. A standard double is £89 per night, and a superior double with a city view is £125. Both include breakfast.

Customer: I'll go with the superior double, please. And is there parking available?

Receptionist: Yes, we have an underground car park. It's £12 per day, or you could use the public car park on Bridge Street — that's free at weekends.

Customer: Oh, free at weekends? That's handy. I'll use the public one then. Now, could I book dinner for Saturday evening as well?

Receptionist: Absolutely. Our restaurant seats from 6:30 PM. Last orders are at 9:45 PM. Shall I book a table?

Customer: Yes please, for 7:30 PM. There'll be two of us. The name's Richardson — that's R-I-C-H-A-R-D-S-O-N.

Receptionist: Got that. Mr Richardson, double superior, 15th and 16th March, dinner at 7:30 on Saturday. I'll need a credit card to secure the booking. Could I take the long number?

Customer: Sure, it's a Visa. 4539 2817 0463 5521.

Receptionist: Thank you. And the expiry date?

Customer: November 2027.

Receptionist: Perfect. Your booking reference is HG-4821. Is there anything else I can help with?

Customer: Actually, could you recommend somewhere to visit on Sunday morning before we check out?

Receptionist: The cathedral is lovely — it's a ten-minute walk from the hotel. Or if you prefer something outdoors, Riverside Park has a wonderful farmers' market every Sunday from 9 AM.

Customer: The farmers' market sounds great. Thank you very much.

Receptionist: You're welcome. We look forward to seeing you on the 15th. Goodbye!`,
    questions: [
      { id: "uk-le1-q1", type: "fill-blank", question: "What type of room did the customer book?", correctAnswer: "superior double", explanation: "The customer chose the 'superior double with a city view.'", difficulty: "easy" },
      { id: "uk-le1-q2", type: "fill-blank", question: "How much does the superior double room cost per night?", correctAnswer: "£125", explanation: "The receptionist said 'a superior double with a city view is £125.'", difficulty: "easy" },
      { id: "uk-le1-q3", type: "mcq", question: "Where will the customer park?", options: ["Hotel underground car park", "Bridge Street public car park", "On the street", "A private garage"], correctAnswer: "Bridge Street public car park", explanation: "The customer chose the free public car park on Bridge Street.", difficulty: "easy" },
      { id: "uk-le1-q4", type: "fill-blank", question: "What time is the dinner reservation?", correctAnswer: "7:30 PM", explanation: "The customer booked dinner for 7:30 PM.", difficulty: "easy" },
      { id: "uk-le1-q5", type: "fill-blank", question: "How is the customer's surname spelled?", correctAnswer: "RICHARDSON", explanation: "Spelled out as R-I-C-H-A-R-D-S-O-N.", difficulty: "easy" },
      { id: "uk-le1-q6", type: "fill-blank", question: "What is the booking reference number?", correctAnswer: "HG-4821", explanation: "The receptionist gave the reference as HG-4821.", difficulty: "medium" },
      { id: "uk-le1-q7", type: "mcq", question: "What does the receptionist recommend for Sunday morning?", options: ["A museum", "The cathedral or Riverside Park farmers' market", "A boat tour", "Shopping centre"], correctAnswer: "The cathedral or Riverside Park farmers' market", explanation: "Two recommendations: the cathedral and the farmers' market at Riverside Park.", difficulty: "medium" },
      { id: "uk-le1-q8", type: "fill-blank", question: "What time does the farmers' market start on Sundays?", correctAnswer: "9 AM", explanation: "The market starts 'from 9 AM.'", difficulty: "easy" },
      { id: "uk-le1-q9", type: "true-false-ng", question: "The hotel car park costs £12 per day.", options: ["True", "False", "Not Given"], correctAnswer: "True", explanation: "The receptionist said 'It's £12 per day.'", difficulty: "easy" },
      { id: "uk-le1-q10", type: "fill-blank", question: "When do last dinner orders close?", correctAnswer: "9:45 PM", explanation: "Last orders are at 9:45 PM.", difficulty: "medium" },
    ],
  },
  {
    id: "uk-le2",
    title: "Section 2: University Campus Tour",
    section: 2,
    context: "You will hear a monologue by a university guide giving new students a campus tour. Read the questions, then study the transcript.",
    difficulty: "medium",
    transcript: `Welcome, everyone, to Westfield University. I'm Sarah Chen, and I'll be your guide today for the campus orientation tour. We have quite a lot to cover, so let's get started.

We're currently standing outside the Main Library, which is the large glass building to your left. It was designed by the architect Norman Price and opened in 2018. The library is open 24 hours during term time, though during holidays it closes at 10 PM. You'll need your student ID card to access the building after 8 PM.

If you look straight ahead, you'll see the Student Union building — that's the red brick building with the clock tower. Inside you'll find the main cafeteria, which serves hot meals from 7 AM to 8 PM. There's also a Costa Coffee on the ground floor and a Subway sandwich shop in the basement. The Student Union also houses the careers service on the second floor and the counselling service on the third floor.

Now, turning to your right, the modern white building is the Science and Technology Centre, or "STC" as everyone calls it. It contains 14 laboratories, 3 lecture theatres, and the university's computing centre. The computing centre has 200 workstations available for student use — you don't need to book, just turn up. However, if you need specialist software, you should go to Lab 7 on the second floor, which has engineering and design programs installed.

Behind the STC, though you can't see it from here, is the Sports Centre. It has an Olympic-sized swimming pool — that's 50 metres — a gym with over 120 pieces of equipment, four squash courts, and a multi-purpose sports hall. Student membership is £15 per month or £120 for the academic year. I'd recommend the annual membership — it works out significantly cheaper.

One important thing to mention: all first-year students are guaranteed accommodation in university halls. The deadline for accommodation applications is the 31st of August. Don't miss that date — after the deadline, places are allocated on a first-come, first-served basis to remaining applicants.

Any questions? No? Excellent. Let's walk over to the Student Union building now...`,
    questions: [
      { id: "uk-le2-q1", type: "fill-blank", question: "Who designed the Main Library?", correctAnswer: "Norman Price", explanation: "It was designed by 'the architect Norman Price.'", difficulty: "easy" },
      { id: "uk-le2-q2", type: "fill-blank", question: "What year did the Main Library open?", correctAnswer: "2018", explanation: "The library 'opened in 2018.'", difficulty: "easy" },
      { id: "uk-le2-q3", type: "mcq", question: "When does the library close during holidays?", options: ["8 PM", "9 PM", "10 PM", "Midnight"], correctAnswer: "10 PM", explanation: "During holidays it closes at 10 PM.", difficulty: "easy" },
      { id: "uk-le2-q4", type: "fill-blank", question: "The careers service is on which floor of the Student Union?", correctAnswer: "second", explanation: "The careers service is on the second floor.", difficulty: "medium" },
      { id: "uk-le2-q5", type: "fill-blank", question: "How many workstations does the computing centre have?", correctAnswer: "200", explanation: "The computing centre has '200 workstations.'", difficulty: "easy" },
      { id: "uk-le2-q6", type: "mcq", question: "Where should students go for specialist engineering software?", options: ["Main Library", "Lab 7, second floor of STC", "Computing centre ground floor", "Student Union"], correctAnswer: "Lab 7, second floor of STC", explanation: "Lab 7 on the second floor has engineering and design programs.", difficulty: "medium" },
      { id: "uk-le2-q7", type: "fill-blank", question: "How long is the swimming pool?", correctAnswer: "50 metres", explanation: "An Olympic-sized pool — 50 metres.", difficulty: "easy" },
      { id: "uk-le2-q8", type: "fill-blank", question: "How much is annual Sports Centre membership?", correctAnswer: "£120", explanation: "£120 for the academic year.", difficulty: "easy" },
      { id: "uk-le2-q9", type: "fill-blank", question: "What is the deadline for accommodation applications?", correctAnswer: "31st of August", explanation: "The deadline is 'the 31st of August.'", difficulty: "medium" },
      { id: "uk-le2-q10", type: "true-false-ng", question: "Second-year students are guaranteed accommodation.", options: ["True", "False", "Not Given"], correctAnswer: "Not Given", explanation: "Only first-year students are mentioned as guaranteed. Nothing is said about second-years.", difficulty: "hard" },
      { id: "uk-le2-q11", type: "mcq", question: "How many squash courts does the Sports Centre have?", options: ["2", "3", "4", "6"], correctAnswer: "4", explanation: "The Sports Centre has 'four squash courts.'", difficulty: "easy" },
      { id: "uk-le2-q12", type: "fill-blank", question: "The STC contains how many laboratories?", correctAnswer: "14", explanation: "It contains '14 laboratories.'", difficulty: "easy" },
    ],
  },
  {
    id: "uk-le3",
    title: "Section 3: Academic Discussion — Renewable Energy",
    section: 3,
    context: "You will hear a discussion between two university students and their tutor about a group project on renewable energy sources.",
    difficulty: "hard",
    transcript: `Tutor: Right, so Emma and James, let's discuss your progress on the renewable energy project. You were looking at wind and solar, correct?

Emma: Yes, Professor Blake. We've been comparing the efficiency rates of onshore wind turbines versus photovoltaic solar panels in the UK climate. What we found was quite surprising, actually.

James: The data shows that wind turbines in Scotland produce energy at roughly 35% capacity factor, compared to about 11% for solar panels in the south of England. But the installation costs tell a different story.

Tutor: Go on — that's an interesting distinction.

Emma: Well, a single onshore wind turbine capable of generating 2.5 megawatts costs approximately £2.6 million to install. Solar panels for an equivalent output — around 10,000 panels — cost about £1.8 million. So solar is cheaper per megawatt of capacity, but wind generates more consistently.

James: We also looked at the environmental objections. Local opposition to wind farms has blocked 67% of proposed onshore projects in England since 2015. The main complaints are visual impact, noise pollution, and effects on bird migration patterns.

Tutor: Have you considered offshore wind as a comparison point?

Emma: We have. Offshore wind farms achieve capacity factors of around 40 to 45%, which is significantly higher than onshore. The Hornsea Two project in the North Sea, for example, has 165 turbines and can power 1.4 million homes. But installation costs are roughly three times higher than onshore — around £7.8 million per turbine.

Tutor: And what about energy storage? That's often the critical limitation.

James: That's actually the weakest part of our research so far. We know that lithium-ion battery storage costs have fallen by 89% since 2010, from around $1,100 per kilowatt-hour to approximately $120. But we haven't been able to find reliable data on grid-scale storage efficiency in the UK specifically.

Tutor: I'd suggest looking at the Dinorwig pumped storage facility in Wales — it's been operating since 1984 and can generate 1,728 megawatts within 12 seconds of demand. It's an excellent case study for your project.

Emma: That's really helpful. We'll include that in our analysis. Our deadline is the 14th of November, so we still have three weeks.

Tutor: Good. I'd also recommend including a cost-benefit analysis over a 25-year lifecycle. Wind turbines typically have a 20 to 25-year operational lifespan, while solar panels can last 30 years or more with minimal maintenance.

James: That's a good point. We'll restructure the conclusion to include lifecycle comparisons.`,
    questions: [
      { id: "uk-le3-q1", type: "fill-blank", question: "What is the capacity factor for onshore wind turbines in Scotland?", correctAnswer: "35%", explanation: "James states 'wind turbines in Scotland produce energy at roughly 35% capacity factor.'", difficulty: "medium" },
      { id: "uk-le3-q2", type: "fill-blank", question: "How much does a single onshore wind turbine cost to install?", correctAnswer: "£2.6 million", explanation: "Emma says it costs 'approximately £2.6 million.'", difficulty: "medium" },
      { id: "uk-le3-q3", type: "mcq", question: "What percentage of proposed onshore wind projects in England have been blocked since 2015?", options: ["45%", "55%", "67%", "78%"], correctAnswer: "67%", explanation: "James says 'Local opposition has blocked 67% of proposed onshore projects.'", difficulty: "hard" },
      { id: "uk-le3-q4", type: "fill-blank", question: "How many turbines does the Hornsea Two project have?", correctAnswer: "165", explanation: "Emma mentions 'the Hornsea Two project has 165 turbines.'", difficulty: "medium" },
      { id: "uk-le3-q5", type: "fill-blank", question: "By how much have lithium-ion battery storage costs fallen since 2010?", correctAnswer: "89%", explanation: "James states costs 'have fallen by 89% since 2010.'", difficulty: "hard" },
      { id: "uk-le3-q6", type: "fill-blank", question: "The Dinorwig facility can generate power within how many seconds?", correctAnswer: "12", explanation: "The tutor says it 'can generate 1,728 megawatts within 12 seconds.'", difficulty: "hard" },
      { id: "uk-le3-q7", type: "mcq", question: "What is the typical operational lifespan of wind turbines?", options: ["10-15 years", "15-20 years", "20-25 years", "30-35 years"], correctAnswer: "20-25 years", explanation: "The tutor says 'Wind turbines typically have a 20 to 25-year operational lifespan.'", difficulty: "medium" },
      { id: "uk-le3-q8", type: "fill-blank", question: "When is the project deadline?", correctAnswer: "14th of November", explanation: "Emma says 'Our deadline is the 14th of November.'", difficulty: "easy" },
      { id: "uk-le3-q9", type: "true-false-ng", question: "Solar panels require more maintenance than wind turbines.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "The tutor says solar panels can last 30 years 'with minimal maintenance', implying less maintenance.", difficulty: "hard" },
      { id: "uk-le3-q10", type: "fill-blank", question: "Offshore wind installation costs are roughly how many times higher than onshore?", correctAnswer: "three", explanation: "Emma says 'installation costs are roughly three times higher than onshore.'", difficulty: "medium" },
    ],
  },
  {
    id: "uk-le4",
    title: "Section 4: Lecture — The Psychology of Decision Making",
    section: 4,
    context: "You will hear part of a university lecture on cognitive biases and how they affect everyday decision making.",
    difficulty: "hard",
    transcript: `Good morning, everyone. Today's lecture focuses on cognitive biases — systematic errors in thinking that affect the decisions and judgements we make every day. By the end of this session, you should be able to identify at least five major biases and understand their real-world implications.

Let's start with what psychologists call the anchoring effect. This occurs when people rely too heavily on the first piece of information they encounter. A classic demonstration was conducted by Tversky and Kahneman in 1974. They asked participants to estimate the percentage of African countries in the United Nations. Before answering, participants spun a rigged wheel that landed on either 10 or 65. Those who saw the number 10 estimated an average of 25%, while those who saw 65 estimated 45%. The initial number — which was completely random — significantly influenced their answers.

The anchoring effect has profound implications for negotiations. Research shows that in salary negotiations, the first number mentioned typically determines the final outcome. Job candidates who start with a higher initial request receive, on average, 9% more in their final offer than those who allow the employer to name the first figure.

Next, let's discuss confirmation bias — our tendency to search for, interpret, and remember information that confirms our pre-existing beliefs. A 2019 study by Stanford University found that people spend 36% more time reading articles that align with their political views compared to opposing perspectives. Social media algorithms amplify this effect by creating what Eli Pariser famously called "filter bubbles" — personalised information ecosystems that reinforce existing beliefs.

The third bias I want to cover is the sunk cost fallacy. This is the tendency to continue investing in something because of previously invested resources — time, money, or effort — rather than evaluating the current value. The Concorde aircraft is perhaps the most famous example. Despite mounting evidence that the project would never be commercially viable, the British and French governments continued investing because they had already spent over £1.3 billion. This is sometimes called the Concorde fallacy.

In everyday life, the sunk cost fallacy explains why people sit through terrible films they've paid for, or continue eating a meal they don't enjoy simply because they've paid for it. The rational approach would be to evaluate only future costs and benefits, but our brains are wired to consider past investments.

The fourth bias is the availability heuristic. We tend to overestimate the probability of events that are easily recalled — typically because they are recent, dramatic, or emotionally charged. This is why people often overestimate the risk of shark attacks or plane crashes while underestimating the risk of heart disease, which kills approximately 17.9 million people globally each year.

Finally, let's touch on the Dunning-Kruger effect, named after psychologists David Dunning and Justin Kruger, who published their findings in 1999. This bias describes how people with limited competence in a particular area tend to overestimate their own ability, while genuine experts tend to underestimate theirs. In their original study, participants who scored in the bottom quartile on tests of logic, grammar, and humour estimated that they had performed in the 62nd percentile — dramatically overestimating their actual performance.

For next week's tutorial, I'd like you to keep a decision diary. Record at least five decisions you make and identify which, if any, cognitive biases may have influenced them.`,
    questions: [
      { id: "uk-le4-q1", type: "fill-blank", question: "In what year did Tversky and Kahneman conduct their anchoring experiment?", correctAnswer: "1974", explanation: "The lecture states it was 'conducted by Tversky and Kahneman in 1974.'", difficulty: "medium" },
      { id: "uk-le4-q2", type: "fill-blank", question: "Job candidates who name the first salary figure receive on average how much more?", correctAnswer: "9%", explanation: "They 'receive, on average, 9% more in their final offer.'", difficulty: "hard" },
      { id: "uk-le4-q3", type: "fill-blank", question: "People spend what percentage more time reading articles that confirm their views?", correctAnswer: "36%", explanation: "People spend '36% more time reading articles that align with their political views.'", difficulty: "hard" },
      { id: "uk-le4-q4", type: "mcq", question: "Who coined the term 'filter bubbles'?", options: ["Tversky", "Kahneman", "Eli Pariser", "David Dunning"], correctAnswer: "Eli Pariser", explanation: "The lecturer attributes the term to 'Eli Pariser.'", difficulty: "medium" },
      { id: "uk-le4-q5", type: "fill-blank", question: "How much had the British and French governments invested in Concorde?", correctAnswer: "£1.3 billion", explanation: "They had 'already spent over £1.3 billion.'", difficulty: "hard" },
      { id: "uk-le4-q6", type: "fill-blank", question: "Heart disease kills approximately how many people globally each year?", correctAnswer: "17.9 million", explanation: "Heart disease 'kills approximately 17.9 million people globally each year.'", difficulty: "hard" },
      { id: "uk-le4-q7", type: "fill-blank", question: "When did Dunning and Kruger publish their findings?", correctAnswer: "1999", explanation: "They 'published their findings in 1999.'", difficulty: "medium" },
      { id: "uk-le4-q8", type: "mcq", question: "Bottom-quartile participants estimated they performed at which percentile?", options: ["42nd", "52nd", "62nd", "72nd"], correctAnswer: "62nd", explanation: "They 'estimated that they had performed in the 62nd percentile.'", difficulty: "hard" },
      { id: "uk-le4-q9", type: "fill-blank", question: "How many decisions should students record in their decision diary?", correctAnswer: "five", explanation: "The lecturer asks them to 'record at least five decisions.'", difficulty: "easy" },
      { id: "uk-le4-q10", type: "true-false-ng", question: "The Dunning-Kruger effect suggests experts overestimate their ability.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "The lecture says 'genuine experts tend to underestimate theirs.'", difficulty: "hard" },
    ],
  },
];

// ─── UK WRITING TASKS ───────────────────────────────────────────────────────

const UK_WRITING_TASKS: WritingTask[] = [
  {
    id: "uk-wt1",
    taskNumber: 1,
    title: "Task 1: Line Graph — Internet Usage",
    prompt: `The line graph below shows the percentage of households with internet access in four European countries between 2005 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.

DATA (describe this in your response):
• UK: 2005: 55%, 2010: 73%, 2015: 86%, 2020: 94%
• Germany: 2005: 50%, 2010: 72%, 2015: 85%, 2020: 92%  
• Italy: 2005: 32%, 2010: 48%, 2015: 66%, 2020: 80%
• Poland: 2005: 22%, 2010: 45%, 2015: 62%, 2020: 78%`,
    tips: [
      "Start with a paraphrased introduction — don't copy the question",
      "Write an overview identifying the key trend (all countries increased)",
      "Compare countries at specific points in time",
      "Use varied trend language: 'rose steadily', 'increased dramatically', 'saw a slight increase'",
    ],
    difficulty: "medium",
    wordLimit: 150,
    timeLimit: 20,
    criteria: [
      { name: "Task Achievement", description: "Did you describe key features and make comparisons?" },
      { name: "Coherence & Cohesion", description: "Is your response logically organised with clear paragraphing?" },
      { name: "Lexical Resource", description: "Did you use varied vocabulary for describing trends?" },
      { name: "Grammatical Range", description: "Did you use a mix of simple and complex sentences?" },
    ],
  },
  {
    id: "uk-wt2",
    taskNumber: 2,
    title: "Task 2: Opinion Essay — Working from Home",
    prompt: `Some people believe that working from home is beneficial for both employees and employers, while others think that it can lead to decreased productivity and social isolation.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    tips: [
      "Address BOTH views — don't just argue one side",
      "State your opinion clearly in the introduction and conclusion",
      "Use specific examples to support your points",
      "Structure: Introduction → View 1 → View 2 → Your opinion → Conclusion",
    ],
    difficulty: "medium",
    wordLimit: 250,
    timeLimit: 40,
    criteria: [
      { name: "Task Response", description: "Did you address all parts of the question and give your opinion?" },
      { name: "Coherence & Cohesion", description: "Are paragraphs well-organised with clear topic sentences?" },
      { name: "Lexical Resource", description: "Did you use topic-specific vocabulary accurately?" },
      { name: "Grammatical Range", description: "Did you demonstrate variety in sentence structures?" },
    ],
  },
  {
    id: "uk-wt3",
    taskNumber: 2,
    title: "Task 2: Problem-Solution — Environmental Pollution",
    prompt: `In many cities around the world, air pollution has reached dangerous levels. What are the causes of this problem, and what measures can governments and individuals take to address it?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    tips: [
      "Clearly identify 2-3 causes in one body paragraph",
      "Offer both government and individual solutions — the question asks for both",
      "Use cause-effect language: 'This leads to...', 'As a result...', 'Consequently...'",
      "Conclude by summarising the key message",
    ],
    difficulty: "hard",
    wordLimit: 250,
    timeLimit: 40,
    criteria: [
      { name: "Task Response", description: "Did you identify causes AND propose solutions for both groups?" },
      { name: "Coherence & Cohesion", description: "Are causes and solutions clearly separated and linked?" },
      { name: "Lexical Resource", description: "Did you use environment-related vocabulary?" },
      { name: "Grammatical Range", description: "Did you use conditional and passive structures?" },
    ],
  },
];

// ─── UK SPEAKING CUE CARDS ──────────────────────────────────────────────────

const UK_SPEAKING_CARDS: SpeakingCueCard[] = [
  {
    id: "uk-sc1",
    part: 2,
    topic: "Describe a book that had a significant impact on you",
    prompts: [
      "What the book was about",
      "When and why you read it",
      "How it affected your thinking or behaviour",
      "Why you would recommend it to others",
    ],
    followUpQuestions: [
      "Do you think people read less nowadays? Why?",
      "How has technology changed the way people read?",
      "What role do libraries play in modern society?",
    ],
    sampleIdeas: [
      "Mention the title, author, and genre",
      "Explain the context — was it for school, leisure, recommendation?",
      "Describe a specific idea or scene that stayed with you",
      "Connect it to a real change in your life or perspective",
    ],
    difficulty: "medium",
    timeLimit: 120,
  },
  {
    id: "uk-sc2",
    part: 2,
    topic: "Describe a place you visited that exceeded your expectations",
    prompts: [
      "Where the place was",
      "When you visited and who you went with",
      "What you expected before visiting",
      "Why it was better than you anticipated",
    ],
    followUpQuestions: [
      "Do you think social media creates unrealistic expectations about travel destinations?",
      "How important is tourism to a country's economy?",
      "Should governments limit tourist numbers to protect popular sites?",
    ],
    sampleIdeas: [
      "Contrast your expectations with reality",
      "Describe sensory details: what you saw, heard, tasted",
      "Mention the people you met or the culture you experienced",
      "Explain what made it memorable vs other trips",
    ],
    difficulty: "medium",
    timeLimit: 120,
  },
  {
    id: "uk-sc3",
    part: 1,
    topic: "Part 1: Your Hometown & Daily Routine",
    prompts: [
      "Can you tell me about your hometown?",
      "What do you like most about living there?",
      "Describe a typical day for you.",
      "How do you usually spend your weekends?",
    ],
    followUpQuestions: [
      "Has your hometown changed much in recent years?",
      "Would you like to live somewhere else in the future?",
      "Do you prefer routine or spontaneity?",
    ],
    sampleIdeas: [
      "Give 2-3 sentence answers, not one word",
      "Use present tense for habits, past for experiences",
      "Include personal opinions: 'I particularly enjoy...'",
      "Mention specific places or activities",
    ],
    difficulty: "easy",
    timeLimit: 300,
  },
  {
    id: "uk-sc4",
    part: 3,
    topic: "Discussion: Education and Technology",
    prompts: [
      "How has technology changed education in recent years?",
      "Do you think online learning is as effective as classroom learning?",
      "What skills should schools focus on teaching in the 21st century?",
      "How might education change in the next 20 years?",
    ],
    followUpQuestions: [
      "Should children be allowed to use smartphones in school?",
      "Is a university degree still valuable in today's job market?",
      "How can education help reduce inequality?",
    ],
    sampleIdeas: [
      "Compare past and present education methods",
      "Give balanced views with examples",
      "Speculate about the future: 'I think it's likely that...'",
      "Use complex structures: conditionals, comparatives",
    ],
    difficulty: "hard",
    timeLimit: 300,
  },
];

// ─── CANADA PRACTICE CONTENT ────────────────────────────────────────────────

const CANADA_READING_PASSAGES: ReadingPassage[] = [
  {
    id: "ca-rp1",
    title: "Notice Board: Community Services in Toronto",
    source: "General Training Section 1 — IRCC Practice Format",
    difficulty: "easy",
    passage: `SETTLEMENT SERVICES FOR NEWCOMERS TO CANADA

Welcome to the Greater Toronto Area! The following community services are available free of charge to permanent residents and convention refugees.

LANGUAGE ASSESSMENT & TRAINING
• Canadian Language Benchmarks Placement Test (CLBPT): Free assessment at 14 locations across the GTA. Walk-in hours: Monday–Friday, 9:00 AM – 3:30 PM. Appointments recommended for weekend testing. Call 416-555-0142.
• LINC (Language Instruction for Newcomers to Canada): Free English classes at CLB levels 1–8. Full-time (25 hours/week) and part-time (12 hours/week) options. Childcare provided at select locations. Registration requires proof of PR status and a CLB assessment result.

EMPLOYMENT SERVICES
• Job Search Workshops: Every Tuesday and Thursday, 10:00 AM – 12:00 PM at the Newcomer Centre, 350 Bloor Street West. Topics include resume writing, Canadian interview skills, and workplace culture. No registration required.
• Mentorship Program: One-on-one matching with a professional in your field. Program duration: 16 weeks. Apply online at www.settlementservices.ca/mentorship. Next intake: April 15, 2024.

HEALTHCARE & SOCIAL SERVICES  
• OHIP Registration: Ontario Health Insurance Plan covers most medical services after a 3-month waiting period. Apply at any ServiceOntario location. Bring your PR card, proof of address, and a completed registration form.
• Mental Health Support: Free counselling sessions (up to 12 per year) available in 20+ languages. Call the Newcomer Wellness Line: 1-800-555-0199.

HOUSING ASSISTANCE
• Rental Support Program: Help finding affordable housing. Home visits to check lease agreements and tenant rights. Office at 180 Dundas Street West, Suite 401. Hours: Monday–Friday, 8:30 AM – 4:30 PM.

Note: Services are funded by Immigration, Refugees and Citizenship Canada (IRCC). Temporary residents and Canadian citizens are not eligible for these services.`,
    questions: [
      { id: "ca-rp1-q1", type: "fill-blank", question: "What is the phone number for the language assessment centre?", correctAnswer: "416-555-0142", explanation: "Listed under Language Assessment & Training.", difficulty: "easy" },
      { id: "ca-rp1-q2", type: "mcq", question: "How many hours per week are full-time LINC classes?", options: ["12", "20", "25", "30"], correctAnswer: "25", explanation: "Full-time is 25 hours/week.", difficulty: "easy" },
      { id: "ca-rp1-q3", type: "true-false-ng", question: "Canadian citizens can access these settlement services.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "The note states 'Canadian citizens are not eligible for these services.'", difficulty: "easy" },
      { id: "ca-rp1-q4", type: "fill-blank", question: "The mentorship program lasts ___ weeks.", correctAnswer: "16", explanation: "Program duration: 16 weeks.", difficulty: "easy" },
      { id: "ca-rp1-q5", type: "mcq", question: "What is required for LINC registration?", options: ["A job offer", "Proof of PR status and CLB assessment", "A university degree", "A referral letter"], correctAnswer: "Proof of PR status and CLB assessment", explanation: "Registration requires proof of PR status and a CLB assessment result.", difficulty: "medium" },
      { id: "ca-rp1-q6", type: "fill-blank", question: "OHIP coverage begins after a ___-month waiting period.", correctAnswer: "3", explanation: "OHIP 'covers most medical services after a 3-month waiting period.'", difficulty: "easy" },
      { id: "ca-rp1-q7", type: "fill-blank", question: "Free counselling is available in how many languages?", correctAnswer: "20+", explanation: "Available in '20+ languages.'", difficulty: "easy" },
      { id: "ca-rp1-q8", type: "mcq", question: "Where are the job search workshops held?", options: ["180 Dundas Street", "350 Bloor Street West", "ServiceOntario", "Online only"], correctAnswer: "350 Bloor Street West", explanation: "At the Newcomer Centre, 350 Bloor Street West.", difficulty: "easy" },
      { id: "ca-rp1-q9", type: "true-false-ng", question: "Job search workshops require advance registration.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "'No registration required' for job search workshops.", difficulty: "medium" },
      { id: "ca-rp1-q10", type: "fill-blank", question: "How many counselling sessions per year are provided free?", correctAnswer: "12", explanation: "Up to 12 per year.", difficulty: "easy" },
    ],
  },
];

const CANADA_LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: "ca-le1",
    title: "Section 1: Registering at a Canadian Health Clinic",
    section: 1,
    context: "A newcomer to Canada is registering at a community health clinic in Vancouver. Read the questions first, then study the transcript.",
    difficulty: "easy",
    transcript: `Receptionist: Good morning, Maple Community Health Centre. How can I help you?

Patient: Hi, I just moved to Vancouver and I'd like to register as a new patient.

Receptionist: Of course! Welcome to Canada. Are you a permanent resident or on a work visa?

Patient: I'm a permanent resident. I arrived three weeks ago from the Philippines.

Receptionist: Congratulations! Now, do you have your BC Services Card yet?

Patient: Not yet. I applied online last week, but they said it could take 6 to 8 weeks.

Receptionist: That's normal. In the meantime, we can register you using your Confirmation of Permanent Residence document. Could I see that?

Patient: Yes, here it is.

Receptionist: Thank you. I'll need a few details. Your full name?

Patient: Maria Santos Garcia. That's M-A-R-I-A, Santos is S-A-N-T-O-S, and Garcia, G-A-R-C-I-A.

Receptionist: Date of birth?

Patient: April 12th, 1990.

Receptionist: And your current address in Vancouver?

Patient: I'm staying at 2847 East Hastings Street, apartment 6B. The postal code is V5K 1Z8.

Receptionist: Perfect. Do you have any allergies we should know about?

Patient: Yes, I'm allergic to penicillin.

Receptionist: Noted. And do you have a family doctor yet?

Patient: No, that's actually why I'm here. I was told there's a long wait for family doctors.

Receptionist: Unfortunately, yes. The current waitlist is about 14 months. However, we have walk-in clinic hours every weekday from 8 AM to 6 PM, and Saturday from 9 AM to 1 PM. You can see any available doctor during those hours.

Patient: That's helpful, thank you. Is there a fee?

Receptionist: No, once your MSP coverage is active, all visits are covered. Since you just arrived, you're in the 3-month waiting period, but BC has a program that covers newcomers during that period. I'll give you a form to fill out.

Patient: That's wonderful. Thank you so much.

Receptionist: You're welcome, Maria. Here's your registration number: VCH-8834. Please keep that for your records.`,
    questions: [
      { id: "ca-le1-q1", type: "fill-blank", question: "Where did Maria move from?", correctAnswer: "the Philippines", explanation: "She arrived from the Philippines.", difficulty: "easy" },
      { id: "ca-le1-q2", type: "fill-blank", question: "How long does the BC Services Card take to arrive?", correctAnswer: "6 to 8 weeks", explanation: "The receptionist confirmed 6 to 8 weeks.", difficulty: "easy" },
      { id: "ca-le1-q3", type: "fill-blank", question: "What is Maria's postal code?", correctAnswer: "V5K 1Z8", explanation: "Given as V5K 1Z8.", difficulty: "medium" },
      { id: "ca-le1-q4", type: "fill-blank", question: "What is Maria allergic to?", correctAnswer: "penicillin", explanation: "She stated she's allergic to penicillin.", difficulty: "easy" },
      { id: "ca-le1-q5", type: "fill-blank", question: "The current waitlist for a family doctor is about ___ months.", correctAnswer: "14", explanation: "The waitlist is about 14 months.", difficulty: "easy" },
      { id: "ca-le1-q6", type: "mcq", question: "What are the Saturday walk-in clinic hours?", options: ["8 AM – 6 PM", "9 AM – 1 PM", "10 AM – 2 PM", "Closed"], correctAnswer: "9 AM – 1 PM", explanation: "Saturday hours are 9 AM to 1 PM.", difficulty: "easy" },
      { id: "ca-le1-q7", type: "fill-blank", question: "What is Maria's registration number?", correctAnswer: "VCH-8834", explanation: "Registration number: VCH-8834.", difficulty: "medium" },
      { id: "ca-le1-q8", type: "true-false-ng", question: "Maria has to pay for visits during the MSP waiting period.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "BC has a program that covers newcomers during the waiting period.", difficulty: "medium" },
      { id: "ca-le1-q9", type: "fill-blank", question: "Maria's apartment number is ___.", correctAnswer: "6B", explanation: "Apartment 6B.", difficulty: "easy" },
      { id: "ca-le1-q10", type: "fill-blank", question: "Maria's date of birth is ___.", correctAnswer: "April 12th, 1990", explanation: "April 12th, 1990.", difficulty: "easy" },
    ],
  },
  {
    id: "ca-le2",
    title: "Section 2: Renting an Apartment in Toronto",
    section: 2,
    context: "A newcomer is discussing rental options with a property manager. Listen carefully to the conversation.",
    difficulty: "medium",
    transcript: `Property Manager: Hi there, welcome to Lakeview Apartments. You must be James.

Tenant: Yes, that's me. James Okafor. I called yesterday about the two-bedroom unit.

Property Manager: Right, the unit on the 7th floor. It's a great space — 850 square feet, two bedrooms, one bathroom. Let me take you up.

Tenant: Thanks. What's the monthly rent?

Property Manager: It's $1,850 per month, plus utilities. Hydro and water are separate — most tenants pay about $120 a month for those. Internet is up to you.

Tenant: Is parking included?

Property Manager: Unfortunately not. Underground parking is an extra $175 per month, or there's street parking with a city permit — that's about $45 a month.

Tenant: I'll probably go with the street parking. What about laundry?

Property Manager: There's a shared laundry room on the 3rd floor. Washers are $2.50 per load, dryers are $2.00.

Tenant: Okay. And what do I need to apply?

Property Manager: We'll need proof of employment — a letter from your employer or recent pay stubs. Also a credit check, which costs $25. And first and last month's rent as a deposit. That's standard in Ontario.

Tenant: So $3,700 upfront?

Property Manager: Exactly. We don't ask for anything beyond first and last — that's the law in Ontario. The lease is for 12 months initially, then it goes month-to-month.

Tenant: When could I move in?

Property Manager: The unit is available from the 1st of May. We'd need your application by April 15th at the latest.

Tenant: That works for me. I'll submit everything this week.

Property Manager: Great. My email is rentals@lakeviewapts.ca. Send everything there and I'll process it within 48 hours.`,
    questions: [
      { id: "ca-le2-q1", type: "fill-blank", question: "The apartment is on which floor?", correctAnswer: "7th", explanation: "The unit on the 7th floor.", difficulty: "easy" },
      { id: "ca-le2-q2", type: "fill-blank", question: "The apartment is ___ square feet.", correctAnswer: "850", explanation: "850 square feet.", difficulty: "easy" },
      { id: "ca-le2-q3", type: "fill-blank", question: "Monthly rent is $___.", correctAnswer: "1,850", explanation: "$1,850 per month.", difficulty: "easy" },
      { id: "ca-le2-q4", type: "fill-blank", question: "Underground parking costs $___ per month.", correctAnswer: "175", explanation: "$175 per month for underground parking.", difficulty: "easy" },
      { id: "ca-le2-q5", type: "mcq", question: "How much does a washer load cost?", options: ["$1.50", "$2.00", "$2.50", "$3.00"], correctAnswer: "$2.50", explanation: "Washers are $2.50 per load.", difficulty: "easy" },
      { id: "ca-le2-q6", type: "fill-blank", question: "The credit check costs $___.", correctAnswer: "25", explanation: "$25 for a credit check.", difficulty: "easy" },
      { id: "ca-le2-q7", type: "fill-blank", question: "The total upfront deposit is $___.", correctAnswer: "3,700", explanation: "First and last month: $3,700.", difficulty: "medium" },
      { id: "ca-le2-q8", type: "fill-blank", question: "The lease initially runs for ___ months.", correctAnswer: "12", explanation: "12 months initially.", difficulty: "easy" },
      { id: "ca-le2-q9", type: "fill-blank", question: "The application deadline is ___.", correctAnswer: "April 15th", explanation: "By April 15th at the latest.", difficulty: "medium" },
      { id: "ca-le2-q10", type: "true-false-ng", question: "Landlords in Ontario can ask for more than first and last month's rent.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "That's the law in Ontario — only first and last.", difficulty: "medium" },
    ],
  },
  {
    id: "ca-le3",
    title: "Section 3: University Orientation — Canadian Campus",
    section: 3,
    context: "A university advisor is explaining services to international students at a Canadian university.",
    difficulty: "hard",
    transcript: `Advisor: Welcome everyone to the University of British Columbia international student orientation. I'm Dr. Helen Chu, your international student advisor.

Let me start by highlighting some key services. First, the International House — that's the blue building on West Mall — is your one-stop centre. We're open Monday through Friday, 8:30 AM to 4:30 PM. No appointment needed for general enquiries.

Now, health insurance. All international students are automatically enrolled in the university health insurance plan — iMED. The cost is $300 per term, which is charged directly to your student account. This covers most medical services, dental check-ups, and prescription medications up to $500 per year.

For academic support, we have the Writing Centre on the 2nd floor of the library. They offer free one-on-one tutoring sessions — 45 minutes each — which you can book online up to 2 weeks in advance. I strongly recommend this, especially for your first term papers.

Work permits are another common question. As a full-time international student, you can work up to 20 hours per week during the academic term and full-time during scheduled breaks. You don't need a separate work permit — your study permit allows this. However, you must have a valid Social Insurance Number, or SIN, which you can get at any Service Canada office.

One important deadline: if you're applying for co-op or internship programs, the application deadline is November 30th. These programs are competitive — last year we had 450 applicants for 120 positions.

Finally, our Buddy Program pairs new international students with senior Canadian students. It's a fantastic way to practise English and learn about Canadian culture. Sign up at the International House front desk by September 15th.

Any questions? My email is helen.chu@ubc.ca, and my office is Room 218 in International House.`,
    questions: [
      { id: "ca-le3-q1", type: "fill-blank", question: "International House is located on ___.", correctAnswer: "West Mall", explanation: "The blue building on West Mall.", difficulty: "easy" },
      { id: "ca-le3-q2", type: "fill-blank", question: "Health insurance costs $___ per term.", correctAnswer: "300", explanation: "$300 per term.", difficulty: "easy" },
      { id: "ca-le3-q3", type: "fill-blank", question: "Prescription medication coverage is up to $___ per year.", correctAnswer: "500", explanation: "Up to $500 per year.", difficulty: "medium" },
      { id: "ca-le3-q4", type: "fill-blank", question: "Writing Centre tutoring sessions are ___ minutes each.", correctAnswer: "45", explanation: "45 minutes each.", difficulty: "easy" },
      { id: "ca-le3-q5", type: "fill-blank", question: "International students can work up to ___ hours per week during term.", correctAnswer: "20", explanation: "Up to 20 hours per week.", difficulty: "easy" },
      { id: "ca-le3-q6", type: "fill-blank", question: "The co-op application deadline is ___.", correctAnswer: "November 30th", explanation: "November 30th.", difficulty: "medium" },
      { id: "ca-le3-q7", type: "fill-blank", question: "Last year, there were ___ co-op applicants.", correctAnswer: "450", explanation: "450 applicants for 120 positions.", difficulty: "medium" },
      { id: "ca-le3-q8", type: "fill-blank", question: "The Buddy Program signup deadline is ___.", correctAnswer: "September 15th", explanation: "By September 15th.", difficulty: "medium" },
      { id: "ca-le3-q9", type: "fill-blank", question: "Dr. Chu's office is Room ___.", correctAnswer: "218", explanation: "Room 218 in International House.", difficulty: "easy" },
      { id: "ca-le3-q10", type: "true-false-ng", question: "International students need a separate work permit to work on campus.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "Your study permit allows this — no separate work permit needed.", difficulty: "medium" },
    ],
  },
  {
    id: "ca-le4",
    title: "Section 4: Lecture — Climate Change and Arctic Ecosystems",
    section: 4,
    context: "You will hear a university lecture on the effects of climate change on Canada's Arctic ecosystems and Indigenous communities.",
    difficulty: "hard",
    transcript: `Today I'd like to examine the impact of climate change on Canada's Arctic regions, focusing specifically on how rising temperatures are reshaping both ecosystems and the livelihoods of Indigenous communities who have called these lands home for thousands of years.

Canada's Arctic is warming at approximately three times the global average rate. Since 1948, average annual temperatures in the Canadian North have increased by 2.3 degrees Celsius, compared to a global average increase of 0.8 degrees over the same period. This accelerated warming has triggered a cascade of environmental changes that are fundamentally altering the Arctic landscape.

Permafrost — the permanently frozen ground that underlies much of the Canadian North — is thawing at an unprecedented rate. The Geological Survey of Canada estimates that approximately 50% of Canada's landmass is underlain by permafrost, but projections suggest that by 2050, the southern boundary of continuous permafrost could shift northward by up to 200 kilometres. This thawing destabilises infrastructure — roads, buildings, and pipelines — causing an estimated $3.6 billion in damage over the next two decades.

Perhaps more significantly, thawing permafrost releases methane, a greenhouse gas that is 84 times more potent than carbon dioxide over a 20-year period. Scientists at the University of Alberta have measured methane emissions from thawing permafrost bogs that are 78% higher than previous models predicted. This creates what climatologists call a positive feedback loop — warming causes permafrost thaw, which releases methane, which causes further warming.

For the Inuit communities of Nunavut, these changes are not abstract scientific data — they are lived reality. Sea ice, which Inuit hunters have relied upon for millennia as a platform for hunting seals and polar bears, is forming later in autumn and breaking up earlier in spring. The sea ice season has shortened by approximately six weeks over the past 30 years. Elder hunters report that traditional knowledge about ice conditions, passed down through generations, is becoming unreliable as weather patterns shift in unprecedented ways.

The caribou herds that many northern communities depend on for food have also been affected. The Bathurst caribou herd, which numbered approximately 450,000 in the 1990s, has declined to fewer than 8,200 animals — a decrease of over 98%. While overhunting and industrial development have contributed, scientists identify climate-related changes in vegetation and increased insect harassment as significant factors.

However, adaptation efforts are underway. The Government of Canada allocated $56 million in its 2022 Arctic and Northern Policy Framework specifically for Indigenous-led climate monitoring programs. These programs combine traditional ecological knowledge with Western scientific methods — an approach known as "Two-Eyed Seeing" — to develop more comprehensive understanding of environmental changes.

For your assignment next week, I'd like you to evaluate whether current federal adaptation funding is proportionate to the scale of the challenges facing Arctic communities. Your analysis should be between 2,000 and 2,500 words.`,
    questions: [
      { id: "ca-le4-q1", type: "fill-blank", question: "Canada's Arctic is warming at approximately how many times the global average?", correctAnswer: "three", explanation: "The lecture states 'approximately three times the global average rate.'", difficulty: "medium" },
      { id: "ca-le4-q2", type: "fill-blank", question: "Since 1948, Arctic temperatures have risen by how many degrees Celsius?", correctAnswer: "2.3", explanation: "Average annual temperatures have increased by 2.3 degrees Celsius.", difficulty: "medium" },
      { id: "ca-le4-q3", type: "fill-blank", question: "What percentage of Canada's landmass is underlain by permafrost?", correctAnswer: "50%", explanation: "Approximately 50% of Canada's landmass is underlain by permafrost.", difficulty: "medium" },
      { id: "ca-le4-q4", type: "mcq", question: "Methane is how many times more potent than CO2 over a 20-year period?", options: ["28 times", "56 times", "72 times", "84 times"], correctAnswer: "84 times", explanation: "Methane is '84 times more potent than carbon dioxide over a 20-year period.'", difficulty: "hard" },
      { id: "ca-le4-q5", type: "fill-blank", question: "The sea ice season has shortened by approximately how many weeks?", correctAnswer: "six", explanation: "The sea ice season has shortened by approximately six weeks.", difficulty: "medium" },
      { id: "ca-le4-q6", type: "fill-blank", question: "The Bathurst caribou herd has declined to fewer than ___ animals.", correctAnswer: "8,200", explanation: "The herd 'has declined to fewer than 8,200 animals.'", difficulty: "hard" },
      { id: "ca-le4-q7", type: "fill-blank", question: "How much did Canada allocate for Indigenous-led climate monitoring?", correctAnswer: "$56 million", explanation: "The Government allocated '$56 million.'", difficulty: "hard" },
      { id: "ca-le4-q8", type: "mcq", question: "What is the approach combining traditional and Western knowledge called?", options: ["Dual Vision", "Two-Eyed Seeing", "Integrated Knowledge", "Cross-Cultural Science"], correctAnswer: "Two-Eyed Seeing", explanation: "It's called 'Two-Eyed Seeing.'", difficulty: "hard" },
      { id: "ca-le4-q9", type: "true-false-ng", question: "Permafrost methane emissions matched previous scientific predictions.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "Emissions are '78% higher than previous models predicted.'", difficulty: "hard" },
      { id: "ca-le4-q10", type: "fill-blank", question: "The assignment should be between ___ and 2,500 words.", correctAnswer: "2,000", explanation: "The lecturer says 'between 2,000 and 2,500 words.'", difficulty: "easy" },
    ],
  },
];

const CANADA_WRITING_TASKS: WritingTask[] = [
  {
    id: "ca-wt1",
    taskNumber: 1,
    title: "Task 1: Formal Letter — Workplace Issue",
    prompt: `You recently started a new job in Canada. However, there is a problem with your work schedule that is affecting your ability to attend English language classes.

Write a letter to your manager. In your letter:
• Explain the problem with your current schedule
• Describe why the English classes are important to you
• Suggest a possible solution

Write at least 150 words. You do NOT need to write any addresses. Begin your letter as follows: Dear Mr/Mrs ___,`,
    tips: [
      "Use formal register throughout — no contractions",
      "Address all three bullet points clearly",
      "Be polite but assertive when suggesting a solution",
      "End with an appropriate formal closing: 'Yours sincerely' (if you know the name)",
    ],
    difficulty: "medium",
    wordLimit: 150,
    timeLimit: 20,
    criteria: [
      { name: "Task Achievement", description: "Did you cover all three bullet points with appropriate tone?" },
      { name: "Coherence & Cohesion", description: "Is the letter logically structured with clear paragraphs?" },
      { name: "Lexical Resource", description: "Did you use formal workplace vocabulary?" },
      { name: "Grammatical Range", description: "Did you use polite request structures?" },
    ],
  },
];

const CANADA_SPEAKING_CARDS: SpeakingCueCard[] = [
  {
    id: "ca-sc1",
    part: 2,
    topic: "Describe a skill you would like to learn that would help you in Canada",
    prompts: [
      "What skill it is",
      "Why it would be useful in Canada specifically",
      "How you plan to learn it",
      "How you think it will benefit your life in Canada",
    ],
    followUpQuestions: [
      "Do you think skills needed in one country differ from another?",
      "How important is learning the local language for immigrants?",
      "Should governments provide free skill training for newcomers?",
    ],
    sampleIdeas: [
      "Connect the skill to Canadian workplace or social life",
      "Mention specific Canadian contexts: networking, winter activities, professional certifications",
      "Show awareness of Canadian culture and values",
    ],
    difficulty: "medium",
    timeLimit: 120,
  },
];

// ─── AUSTRALIA PRACTICE CONTENT ─────────────────────────────────────────────

const AUSTRALIA_READING_PASSAGES: ReadingPassage[] = [
  {
    id: "au-rp1",
    title: "Superannuation in Australia: A Guide for Migrants",
    source: "General Training Section 2 — DHA/IDP Format",
    difficulty: "medium",
    passage: `UNDERSTANDING SUPERANNUATION (SUPER) IN AUSTRALIA

If you work in Australia, your employer is legally required to pay a percentage of your ordinary earnings into a superannuation (super) fund. As of July 2024, this rate is 11.5% of your salary before tax. This money is invested and grows over time, forming a retirement savings nest egg.

WHO QUALIFIES?
All employees aged 18 or over who earn $450 or more per month are eligible for super contributions from their employer. From 1 July 2024, there is no minimum earnings threshold — all employees receive super regardless of how much they earn. Workers under 18 must work more than 30 hours per week to qualify.

CHOOSING A FUND
When you start a new job, your employer will ask you to nominate a super fund. If you don't choose one, your employer will pay into their "default fund." You can compare funds using the ATO's YourSuper comparison tool at www.ato.gov.au/yoursuper. Key factors to compare include fees, investment returns, insurance options, and the type of investment strategy.

ACCESSING YOUR SUPER
Generally, you cannot access your super until you reach "preservation age" (between 55 and 60, depending on your birth year) and have permanently retired. However, temporary residents who permanently leave Australia can apply for a Departing Australia Superannuation Payment (DASP). A 65% tax rate applies to DASP claims for working holiday maker visa holders; the rate is 35% for other temporary visa holders.

SUPER FOR SELF-EMPLOYED
If you're self-employed in Australia, you are not required to pay super for yourself, but it's strongly recommended. Contributions are tax-deductible up to the concessional contributions cap of $27,500 per financial year.

LOST SUPER
The ATO estimates that Australians have over $16 billion in "lost" super — accounts that have lost contact with their owner. If you've changed jobs, moved address, or changed your name, your super may be classified as lost. You can search for lost super through your myGov account linked to the ATO.

For more information, visit the Australian Taxation Office website or call 13 10 20.`,
    questions: [
      { id: "au-rp1-q1", type: "fill-blank", question: "The current super contribution rate is ___% of salary.", correctAnswer: "11.5", explanation: "As of July 2024, the rate is 11.5%.", difficulty: "easy" },
      { id: "au-rp1-q2", type: "mcq", question: "Workers under 18 must work how many hours per week to qualify for super?", options: ["15", "20", "25", "30"], correctAnswer: "30", explanation: "Under-18 workers must work more than 30 hours per week.", difficulty: "easy" },
      { id: "au-rp1-q3", type: "fill-blank", question: "The DASP tax rate for working holiday visa holders is ___% .", correctAnswer: "65", explanation: "A 65% tax rate applies to DASP for working holiday makers.", difficulty: "medium" },
      { id: "au-rp1-q4", type: "mcq", question: "The concessional contributions cap for self-employed is:", options: ["$15,000", "$20,000", "$25,000", "$27,500"], correctAnswer: "$27,500", explanation: "The cap is $27,500 per financial year.", difficulty: "medium" },
      { id: "au-rp1-q5", type: "fill-blank", question: "Australians have over $___ billion in lost super.", correctAnswer: "16", explanation: "Over $16 billion in lost super.", difficulty: "easy" },
      { id: "au-rp1-q6", type: "true-false-ng", question: "Self-employed people in Australia must pay their own super.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "Self-employed are 'not required to pay super for yourself' but it's recommended.", difficulty: "medium" },
      { id: "au-rp1-q7", type: "mcq", question: "What tool can you use to compare super funds?", options: ["Super Compare app", "ATO YourSuper comparison tool", "MySuper website", "Fair Work calculator"], correctAnswer: "ATO YourSuper comparison tool", explanation: "The ATO's YourSuper comparison tool at ato.gov.au.", difficulty: "easy" },
      { id: "au-rp1-q8", type: "fill-blank", question: "Preservation age is between ___ and 60.", correctAnswer: "55", explanation: "Between 55 and 60 depending on birth year.", difficulty: "easy" },
      { id: "au-rp1-q9", type: "true-false-ng", question: "You can search for lost super through your myGov account.", options: ["True", "False", "Not Given"], correctAnswer: "True", explanation: "You can search through myGov linked to the ATO.", difficulty: "easy" },
      { id: "au-rp1-q10", type: "fill-blank", question: "The ATO phone number is ___.", correctAnswer: "13 10 20", explanation: "Call 13 10 20.", difficulty: "easy" },
    ],
  },
];

const AUSTRALIA_LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: "au-le1",
    title: "Section 1: Opening a Bank Account in Melbourne",
    section: 1,
    context: "A new migrant is opening a bank account at a branch in Melbourne. Study the transcript as if listening to the audio.",
    difficulty: "easy",
    transcript: `Bank Officer: Welcome to National Australia Bank. How can I help you today?

Customer: Hi, I've just moved to Melbourne from India, and I need to open a bank account.

Bank Officer: Sure thing! Are you on a temporary visa or permanent resident?

Customer: I'm on a subclass 189 Skilled Independent visa — so permanent resident.

Bank Officer: Wonderful, congratulations! For a PR, I'd recommend our Smart Access account. There are no monthly fees, you get a debit card, and you can set up internet banking straight away.

Customer: That sounds good. What do I need to open it?

Bank Officer: Just your passport and your visa grant letter — your VEVO confirmation. Do you have those with you?

Customer: Yes, I have both. Here you go.

Bank Officer: Perfect. I'll just need your details. Full name?

Customer: Rajesh Kumar Patel. R-A-J-E-S-H, Kumar K-U-M-A-R, Patel P-A-T-E-L.

Bank Officer: Date of birth?

Customer: 3rd of September, 1988.

Bank Officer: Australian address?

Customer: Unit 12, 45 Chapel Street, South Yarra. Postcode is 3141.

Bank Officer: Right. And a contact number?

Customer: My Australian mobile is 0412 778 993.

Bank Officer: Great. Now, would you like to set up internet banking today?

Customer: Yes please. And I was also wondering about sending money overseas — to my family in India.

Bank Officer: For international transfers, you can use our Global Transfer service. It's $20 per transaction, and the exchange rate includes a small margin. Alternatively, many of our customers use third-party services like Wise — they often have lower fees.

Customer: $20 per transaction... I might look at those alternatives. Thanks for being upfront about that.

Bank Officer: No worries. Now, your account number is 0387 5521 4490. I'll just need you to set a PIN for your card. You can do that at the ATM outside. Your card will arrive by post in 5 to 7 business days.

Customer: Brilliant. Thank you so much for your help.

Bank Officer: My pleasure, Rajesh. Welcome to Australia!`,
    questions: [
      { id: "au-le1-q1", type: "fill-blank", question: "What visa subclass does the customer hold?", correctAnswer: "189", explanation: "Subclass 189 Skilled Independent visa.", difficulty: "easy" },
      { id: "au-le1-q2", type: "fill-blank", question: "What type of account was recommended?", correctAnswer: "Smart Access", explanation: "The Smart Access account was recommended.", difficulty: "easy" },
      { id: "au-le1-q3", type: "fill-blank", question: "The international transfer fee is $___ per transaction.", correctAnswer: "20", explanation: "$20 per transaction.", difficulty: "easy" },
      { id: "au-le1-q4", type: "fill-blank", question: "The customer's postcode is ___.", correctAnswer: "3141", explanation: "Postcode 3141, South Yarra.", difficulty: "easy" },
      { id: "au-le1-q5", type: "fill-blank", question: "The card will arrive in ___ to ___ business days.", correctAnswer: "5 to 7", explanation: "5 to 7 business days.", difficulty: "easy" },
      { id: "au-le1-q6", type: "fill-blank", question: "The customer's account number is ___.", correctAnswer: "0387 5521 4490", explanation: "Account number: 0387 5521 4490.", difficulty: "medium" },
      { id: "au-le1-q7", type: "mcq", question: "What alternative transfer service was mentioned?", options: ["PayPal", "Western Union", "Wise", "Remitly"], correctAnswer: "Wise", explanation: "The officer mentioned 'Wise' as a third-party alternative.", difficulty: "easy" },
      { id: "au-le1-q8", type: "fill-blank", question: "The customer's mobile number is ___.", correctAnswer: "0412 778 993", explanation: "Mobile: 0412 778 993.", difficulty: "medium" },
      { id: "au-le1-q9", type: "true-false-ng", question: "The Smart Access account has monthly fees.", options: ["True", "False", "Not Given"], correctAnswer: "False", explanation: "'There are no monthly fees.'", difficulty: "easy" },
      { id: "au-le1-q10", type: "fill-blank", question: "Where did the customer move from?", correctAnswer: "India", explanation: "From India.", difficulty: "easy" },
    ],
  },
  {
    id: "au-le2",
    title: "Section 2: Orientation at a Melbourne Workplace",
    section: 2,
    context: "A new employee is receiving a workplace induction at an Australian company. Listen carefully.",
    difficulty: "medium",
    transcript: `HR Manager: G'day, welcome to Greenfield Engineering. I'm Karen Walsh, your HR manager. Congratulations on starting your new role as a design engineer.

Before we get you to your team, there are a few housekeeping items. First, your work hours. Standard hours are Monday to Friday, 8 AM to 4:30 PM, with a 30-minute lunch break. We have flexible start times — you can arrive between 7 and 9 AM and finish accordingly, as long as you do your 8 hours.

Your desk is on Level 3, Bay 12. You'll find your laptop, ID badge, and a welcome pack there. The Wi-Fi password for the office is "GreenField2024" — that's one word, capital G and F.

Now, safety. This is an engineering firm, so if you visit the workshop on the ground floor, you must wear steel-cap boots, safety glasses, and a high-vis vest. These are provided free of charge — see Tony in the store room.

Leave entitlements: you get 4 weeks annual leave per year, 10 days personal leave for sick days or carer's leave, and 2 days compassionate leave. After 10 years of continuous service, you'll also be eligible for long service leave — that's 8.67 weeks.

Superannuation is paid at 11.5% to your nominated fund. If you haven't nominated one yet, please do so by the end of your first week — otherwise we'll use our default fund, which is AustralianSuper.

Morning tea is at 10:30 in the kitchen on Level 2. It's a good way to meet the team. On Fridays, we do a team lunch — usually someone brings in a barbecue.

Any questions at all, my door is always open. I'm on Level 4, Room 402.`,
    questions: [
      { id: "au-le2-q1", type: "fill-blank", question: "Standard work hours are ___ AM to ___ PM.", correctAnswer: "8 AM to 4:30 PM", explanation: "8 AM to 4:30 PM.", difficulty: "easy" },
      { id: "au-le2-q2", type: "fill-blank", question: "The new employee's desk is on Level ___, Bay ___.", correctAnswer: "3, Bay 12", explanation: "Level 3, Bay 12.", difficulty: "easy" },
      { id: "au-le2-q3", type: "fill-blank", question: "The Wi-Fi password is ___.", correctAnswer: "GreenField2024", explanation: "GreenField2024.", difficulty: "medium" },
      { id: "au-le2-q4", type: "fill-blank", question: "Annual leave entitlement is ___ weeks per year.", correctAnswer: "4", explanation: "4 weeks annual leave.", difficulty: "easy" },
      { id: "au-le2-q5", type: "fill-blank", question: "Personal leave is ___ days.", correctAnswer: "10", explanation: "10 days personal leave.", difficulty: "easy" },
      { id: "au-le2-q6", type: "fill-blank", question: "Long service leave is ___ weeks after 10 years.", correctAnswer: "8.67", explanation: "8.67 weeks of long service leave.", difficulty: "medium" },
      { id: "au-le2-q7", type: "fill-blank", question: "The default super fund is ___.", correctAnswer: "AustralianSuper", explanation: "Default fund is AustralianSuper.", difficulty: "easy" },
      { id: "au-le2-q8", type: "fill-blank", question: "Morning tea is at ___ on Level ___.", correctAnswer: "10:30, Level 2", explanation: "10:30 in the kitchen on Level 2.", difficulty: "easy" },
      { id: "au-le2-q9", type: "mcq", question: "Who provides safety equipment?", options: ["The employee buys them", "Tony in the store room", "The HR manager", "Online ordering"], correctAnswer: "Tony in the store room", explanation: "See Tony in the store room — provided free.", difficulty: "easy" },
      { id: "au-le2-q10", type: "fill-blank", question: "Karen's office is on Level ___, Room ___.", correctAnswer: "4, Room 402", explanation: "Level 4, Room 402.", difficulty: "easy" },
    ],
  },
  {
    id: "au-le3",
    title: "Section 3: Academic Discussion — Climate Change Research",
    section: 3,
    context: "Two university students in Sydney are discussing their group research project on climate change impacts in Australia.",
    difficulty: "hard",
    transcript: `Student 1: Right, so we need to finalise our research topic for Dr. Patterson's assignment. We agreed on climate change impacts in Australia, but we need to narrow it down.

Student 2: Yeah. I was thinking we could focus on the Great Barrier Reef. There's loads of recent data — the 2024 mass bleaching event was the worst on record. Over 75% of reefs surveyed showed bleaching.

Student 1: That's a strong angle. But I'm worried it might be too popular — half the class will probably do the reef.

Student 2: Fair point. What about bushfire risk? The 2019-20 season — the Black Summer — burned over 18.6 million hectares. That's an area larger than England.

Student 1: Now that's interesting. We could look at how climate change is increasing fire frequency and intensity. Plus there's the human impact — 33 people died, over 3,000 homes destroyed.

Student 2: And the wildlife impact was devastating. An estimated 3 billion animals were killed or displaced. That figure made headlines worldwide.

Student 1: Let's go with bushfires then. For the structure, Dr. Patterson wants four sections: background, causes, impacts, and policy responses.

Student 2: I'll take background and causes. I found a CSIRO report from 2023 that shows Australia has warmed by 1.47 degrees since 1910. And rainfall patterns have shifted — southern Australia gets 10 to 20% less rain in autumn and winter.

Student 1: Perfect. I'll handle impacts and policy. The Royal Commission into National Natural Disaster Arrangements made 80 recommendations. I can analyse which ones have been implemented.

Student 2: We need 3,000 words minimum, right? And at least 15 academic references?

Student 1: Yes, and it's due on the 22nd of October. Let's aim to have our first drafts by the 10th so we can review each other's work.

Student 2: Sounds like a plan. Let's meet again on Thursday at 2 PM in the library.`,
    questions: [
      { id: "au-le3-q1", type: "fill-blank", question: "What percentage of reefs showed bleaching in 2024?", correctAnswer: "75", explanation: "Over 75% of reefs surveyed.", difficulty: "easy" },
      { id: "au-le3-q2", type: "fill-blank", question: "The Black Summer burned over ___ million hectares.", correctAnswer: "18.6", explanation: "18.6 million hectares.", difficulty: "easy" },
      { id: "au-le3-q3", type: "fill-blank", question: "An estimated ___ billion animals were killed or displaced.", correctAnswer: "3", explanation: "3 billion animals.", difficulty: "easy" },
      { id: "au-le3-q4", type: "fill-blank", question: "Australia has warmed by ___ degrees since 1910.", correctAnswer: "1.47", explanation: "1.47 degrees since 1910.", difficulty: "medium" },
      { id: "au-le3-q5", type: "fill-blank", question: "Southern Australia gets ___% less rain in autumn and winter.", correctAnswer: "10 to 20", explanation: "10 to 20% less rain.", difficulty: "medium" },
      { id: "au-le3-q6", type: "fill-blank", question: "The Royal Commission made ___ recommendations.", correctAnswer: "80", explanation: "80 recommendations.", difficulty: "medium" },
      { id: "au-le3-q7", type: "fill-blank", question: "The assignment requires ___ words minimum.", correctAnswer: "3,000", explanation: "3,000 words minimum.", difficulty: "easy" },
      { id: "au-le3-q8", type: "fill-blank", question: "How many academic references are required?", correctAnswer: "15", explanation: "At least 15 academic references.", difficulty: "easy" },
      { id: "au-le3-q9", type: "fill-blank", question: "The assignment is due on ___.", correctAnswer: "22nd of October", explanation: "Due on the 22nd of October.", difficulty: "easy" },
      { id: "au-le3-q10", type: "fill-blank", question: "They plan to meet on Thursday at ___ PM.", correctAnswer: "2", explanation: "Thursday at 2 PM in the library.", difficulty: "easy" },
    ],
  },
];

const AUSTRALIA_WRITING_TASKS: WritingTask[] = [
  {
    id: "au-wt1",
    taskNumber: 2,
    title: "Task 2: Advantages & Disadvantages — Immigration",
    prompt: `Many countries actively encourage skilled workers from other countries to migrate and work there. What are the advantages and disadvantages of this trend for both the host country and the migrants themselves?

Give reasons for your answer and include any relevant examples.

Write at least 250 words.`,
    tips: [
      "Discuss advantages AND disadvantages for BOTH groups",
      "Use Australian examples where possible: SkillSelect, skills shortage lists",
      "Balance your paragraphs — don't over-emphasise one side",
      "Conclude with your overall assessment",
    ],
    difficulty: "medium",
    wordLimit: 250,
    timeLimit: 40,
    criteria: [
      { name: "Task Response", description: "Did you address all parts: advantages + disadvantages for both groups?" },
      { name: "Coherence & Cohesion", description: "Are ideas clearly grouped and linked?" },
      { name: "Lexical Resource", description: "Did you use immigration and workplace vocabulary?" },
      { name: "Grammatical Range", description: "Did you use complex structures accurately?" },
    ],
  },
];

const AUSTRALIA_SPEAKING_CARDS: SpeakingCueCard[] = [
  {
    id: "au-sc1",
    part: 2,
    topic: "Describe an outdoor activity you enjoy",
    prompts: [
      "What the activity is",
      "Where and when you usually do it",
      "Who you do it with",
      "Why you enjoy it",
    ],
    followUpQuestions: [
      "How important is outdoor recreation in Australian culture?",
      "Do you think people spend too much time indoors nowadays?",
      "Should governments invest more in public outdoor spaces?",
    ],
    sampleIdeas: [
      "Australians love outdoor activities — connect to this culture",
      "Mention specific locations if possible",
      "Describe how the activity makes you feel",
      "Talk about health and social benefits",
    ],
    difficulty: "easy",
    timeLimit: 120,
  },
];

// ─── EXPORT PRACTICE DATA BY COUNTRY ────────────────────────────────────────

export interface CountryPracticeData {
  readingPassages: ReadingPassage[];
  listeningExercises: ListeningExercise[];
  writingTasks: WritingTask[];
  speakingCards: SpeakingCueCard[];
}

export const COUNTRY_PRACTICE_DATA: Record<string, CountryPracticeData> = {
  uk: {
    readingPassages: UK_READING_PASSAGES,
    listeningExercises: UK_LISTENING_EXERCISES,
    writingTasks: UK_WRITING_TASKS,
    speakingCards: UK_SPEAKING_CARDS,
  },
  canada: {
    readingPassages: CANADA_READING_PASSAGES,
    listeningExercises: CANADA_LISTENING_EXERCISES,
    writingTasks: CANADA_WRITING_TASKS,
    speakingCards: CANADA_SPEAKING_CARDS,
  },
  australia: {
    readingPassages: AUSTRALIA_READING_PASSAGES,
    listeningExercises: AUSTRALIA_LISTENING_EXERCISES,
    writingTasks: AUSTRALIA_WRITING_TASKS,
    speakingCards: AUSTRALIA_SPEAKING_CARDS,
  },
};

// ─── LOCAL STORAGE HELPERS FOR PROGRESS ─────────────────────────────────────

const PROGRESS_KEY = "ielts_progress";
const ATTEMPTS_KEY = "ielts_attempts";

export function saveTestAttempt(attempt: TestAttempt) {
  const existing = getTestAttempts();
  existing.push(attempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(existing));
}

export function getTestAttempts(): TestAttempt[] {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || "[]");
  } catch { return []; }
}

export function saveModuleProgress(country: string, moduleId: string, completedLessons: string[]) {
  const existing = getModuleProgress();
  existing[`${country}-${moduleId}`] = completedLessons;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(existing));
}

export function getModuleProgress(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch { return {}; }
}

export function getCountryProgress(country: string): { totalCompleted: number; totalLessons: number } {
  const progress = getModuleProgress();
  let totalCompleted = 0;
  Object.entries(progress).forEach(([key, lessons]) => {
    if (key.startsWith(`${country}-`)) {
      totalCompleted += lessons.length;
    }
  });
  return { totalCompleted, totalLessons: 12 }; // 4 modules * 3 lessons each
}

export function estimateCLBLevel(score: number, total: number): { clb: number; label: string; crsPoints: string } {
  const pct = score / total;
  if (pct >= 0.9) return { clb: 10, label: "CLB 10+", crsPoints: "Maximum CRS points (34 per skill)" };
  if (pct >= 0.8) return { clb: 9, label: "CLB 9", crsPoints: "Strong CRS points (31 per skill)" };
  if (pct >= 0.65) return { clb: 8, label: "CLB 8", crsPoints: "Good CRS points (23 per skill)" };
  if (pct >= 0.5) return { clb: 7, label: "CLB 7", crsPoints: "Minimum FSW (17 per skill)" };
  if (pct >= 0.35) return { clb: 6, label: "CLB 6", crsPoints: "Below FSW minimum" };
  return { clb: 5, label: "CLB 5", crsPoints: "Insufficient for PR" };
}

export function estimateDHAPoints(score: number, total: number): { tier: string; points: number; label: string } {
  const pct = score / total;
  if (pct >= 0.85) return { tier: "Superior", points: 20, label: "Superior English (+20 points)" };
  if (pct >= 0.7) return { tier: "Proficient", points: 10, label: "Proficient English (+10 points)" };
  if (pct >= 0.5) return { tier: "Competent", points: 0, label: "Competent English (minimum requirement)" };
  return { tier: "Below", points: 0, label: "Below minimum requirement" };
}
