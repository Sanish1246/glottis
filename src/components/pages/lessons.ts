const lesson = {
  language: "italian",
  level: "A1",
  lessonNumber: 1,
  title: "Greetings and Introductions",
  estimatedTime: "45-60 min",

  objectives: [
    "Greet people formally and informally",
    "Introduce yourself",
    "Ask someone's name and origin",
    "Learn verbs: essere (to be) and chiamarsi (to be called)",
    "Understand personal pronouns",
  ],

  introduction: {
    scene: "Marco and Sofia meet for the first time at a café",
    dialogue: [
      {
        speaker: "Marco",
        text: "Ciao! Come ti chiami?",
        audio: "Microsoft Cosimo - Italian (Italy)",
      },
      {
        speaker: "Sofia",
        text: "Mi chiamo Sofia. E tu?",
        audio: "Microsoft Elsa - Italian (Italy)",
      },
      {
        speaker: "Marco",
        text: "Io sono Marco. Piacere!",
        audio: "Microsoft Cosimo - Italian (Italy)",
      },
      {
        speaker: "Sofia",
        text: "Piacere mio! Di dove sei?",
        audio: "Microsoft Elsa - Italian (Italy)",
      },
      {
        speaker: "Marco",
        text: "Sono di Milano. E tu?",
        audio: "Microsoft Cosimo - Italian (Italy)",
      },
      {
        speaker: "Sofia",
        text: "Io sono di Roma.",
        audio: "Microsoft Elsa - Italian (Italy)",
      },
    ],
  },

  vocabulary: [
    {
      category: "Greetings",
      items: [
        {
          word: "Ciao",
          english: "Hi / Bye (informal)",
          audio: "Microsoft Cosimo - Italian (Italy)",
        },
        {
          word: "Buongiorno",
          english: "Good morning",
          audio: "Microsoft Cosimo - Italian (Italy)",
        },
        {
          word: "Arrivederci",
          english: "Goodbye",
          audio: "Microsoft Cosimo - Italian (Italy)",
        },
      ],
    },
    {
      category: "Introductions",
      items: [
        {
          word: "Come ti chiami?",
          english: "What's your name? (informal)",
          audio: "Microsoft Cosimo - Italian (Italy)",
        },
        {
          word: "Mi chiamo...",
          english: "My name is...",
          audio: "Microsoft Cosimo - Italian (Italy)",
        },
        {
          word: "Piacere",
          english: "Nice to meet you",
          audio: "Microsoft Cosimo - Italian (Italy)",
        },
      ],
    },
  ],

  grammar: [
{
  title: "Verb ESSERE (to be)",
  type: "table",
  content: [
    {
      point: "Io sono",
      english: "I am",
      example: "Io sono Marco",
      audio: "Microsoft Cosimo - Italian (Italy)",
    },
    {
      point: "Tu sei",
      english: "You are (informal)",
      example: "Tu sei di Roma",
      audio: "Microsoft Cosimo - Italian (Italy)"
    },
    {
      point: "Lui/Lei è",
      english: "He/She is",
      example: "Lui è italiano / Lei è italiana",
      audio: "Microsoft Cosimo - Italian (Italy)"
    },
    {
      point: "Lei è",
      english: "you are (formal)",
      example: "Lei è il signor Rossi",
      audio: "Microsoft Cosimo - Italian (Italy)"
    },
    {
      point: "Noi siamo",
      english: "We are",
      example: "Noi siamo studenti",
      audio: "Microsoft Cosimo - Italian (Italy)"
    },
    {
      point: "Voi siete",
      english: "You are (plural)",
      example: "Voi siete americani",
      audio: "Microsoft Cosimo - Italian (Italy)"
    },
    {
      point: "Loro sono",
      english: "They are",
      example: "Loro sono insegnanti",
      audio: "Microsoft Cosimo - Italian (Italy)"
    }
  ],
  notes: [
    "Essere is irregular.",
    "Subject pronouns (io, tu, lui, etc.) are often omitted in Italian.",
    "Formal 'you' (Lei) always takes the third person singular form 'è'."
  ]
},
    {
      title: "Verb CHIAMARSI (to be called)",
      type: "table",
      content: [
        { point: "io mi chiamo", english: "I am called",example:"",audio:"Microsoft Cosimo - Italian (Italy)" },
        { point: "tu ti chiami", english: "you are called",example:"",audio:"Microsoft Cosimo - Italian (Italy)" },
        { point: "lui/lei si chiama", english: "he/she is called",example:"",audio:"Microsoft Cosimo - Italian (Italy)" },
      ],
      notes: [
        "Chiamarsi is a reflexive verb.",
        "Common usage: 'Mi chiamo + name', which translates to 'My name is + name'.",
      ],
    },
  ],


      fib: [
        {
          text: "Io ___ Marco.",
          options: ["sono", "sei", "è"],
          answer: "sono",
        },
        {
          text: "Come ti ___?",
          options: ["chiamo", "chiami", "chiama"],
          answer: "chiami",
        },
      ],


      mcq: [
        {
          question: "How do you say 'Hello' informally in Italian?",
          options: ["Buongiorno", "Ciao", "Salve"],
          answer: "Ciao",
        },
        {
          question: "What does 'Di dove sei?' mean?",
          options: ["What's your name?", "Where are you from?", "How are you?"],
          answer: "Where are you from?",
        },
      ],



  final_quiz: {
    totalQuestions: 15,
    passScore: 70,
    sections: ["fill_in_the_blank", "multiple_choice"],
  },

  cultural_note: {
    title: "Italian Greetings",
    content: [
      "Italians use 'Lei' in formal situations and 'tu' with friends and family.",
      "Handshakes are common in formal settings.",
      "'Ciao' is both hello and goodbye - informal only!",
    ],
  },

  summary: {
    grammarPoints: ["Essere", "Chiamarsi", "Pronouns", "Formal vs Informal"],
    skills: [
      "Greet and introduce yourself",
      "Ask and answer about names and origins",
      "Use verbs essere and chiamarsi correctly",
    ],
  },
};

export default lesson;
