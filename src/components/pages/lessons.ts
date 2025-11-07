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
    features: [
      "audio_normal",
      "audio_slow",
      "translation_toggle",
      "roleplay_mode",
    ],
  },

  vocabulary: [
    {
      category: "Greetings",
      items: [
        {
          italian: "Ciao",
          english: "Hi / Bye (informal)",
          audio: "/audio/vocab/ciao.mp3",
        },
        {
          italian: "Buongiorno",
          english: "Good morning",
          audio: "/audio/vocab/buongiorno.mp3",
        },
        {
          italian: "Arrivederci",
          english: "Goodbye",
          audio: "/audio/vocab/arrivederci.mp3",
        },
      ],
    },
    {
      category: "Introductions",
      items: [
        {
          italian: "Come ti chiami?",
          english: "What's your name? (informal)",
          audio: "/audio/vocab/cometichiami.mp3",
        },
        {
          italian: "Mi chiamo...",
          english: "My name is...",
          audio: "/audio/vocab/michiamo.mp3",
        },
        {
          italian: "Piacere",
          english: "Nice to meet you",
          audio: "/audio/vocab/piacere.mp3",
        },
      ],
    },
  ],

  grammar: [
    {
      title: "Verb ESSERE (to be)",
      type: "table",
      content: [
        { italian: "io sono", english: "I am", example: "Io sono Marco" },
        {
          italian: "tu sei",
          english: "you are (informal)",
          example: "Tu sei di Roma",
        },
        {
          italian: "lui/lei è",
          english: "he/she is",
          example: "Lui è italiano",
        },
      ],
      notes: [
        "Essere is irregular.",
        "Subject pronouns are often omitted in Italian.",
      ],
    },
    {
      title: "Verb CHIAMARSI (to be called)",
      type: "table",
      content: [
        { italian: "io mi chiamo", english: "I am called" },
        { italian: "tu ti chiami", english: "you are called" },
        { italian: "lui/lei si chiama", english: "he/she is called" },
      ],
      notes: [
        "Chiamarsi is a reflexive verb.",
        "Common usage: 'Mi chiamo + name'.",
      ],
    },
  ],

  exercises: [
    {
      type: "fill_in_the_blank",
      difficulty: "easy",
      questions: [
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
    },
    {
      type: "multiple_choice",
      difficulty: "medium",
      questions: [
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
      "'Ciao' is both hello and goodbye — informal only!",
    ],
    media: {
      video: "/videos/italian_greetings.mp4",
      images: ["/images/ciao_1.jpg", "/images/handshake.jpg"],
    },
  },

  summary: {
    vocabularyCount: 25,
    grammarPoints: ["Essere", "Chiamarsi", "Pronouns", "Formal vs Informal"],
    skills: [
      "Greet and introduce yourself",
      "Ask and answer about names and origins",
      "Use verbs essere and chiamarsi correctly",
    ],
  },
};

export default lesson;
