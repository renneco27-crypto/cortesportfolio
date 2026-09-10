import type { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "lex-memoria",
    title: "Lex Memoria — The Digital Codal Review App for Philippine Law Students",
    slug: "lex-memoria",
    badge: "LEGALTECH / ACTIVE RECALL",
    shortDescription:
      "A digital codal study and review system designed specifically for Philippine law students with article drills, bar exam mnemonics, and retention tracking.",
    description:
      "Lex Memoria provides interactive active-recall drills, codal provisions indexing, quiz modes for Bar examinations, and structured review roadmaps across Civil Law, Criminal Law, and Political Law.",
    problemStatement:
      "Philippine law students struggle to memorize thousands of statutory provisions and articles using traditional heavy physical codals.",
    solutionSummary:
      "Built a digital active-recall platform with indexed codals, spaced-repetition article drills, and real-time retention telemetry.",
    results: [
      "Full digital codal database with instant cross-referencing",
      "Spaced repetition active-recall drills for Bar reviewees",
      "Sub-second article lookup and mnemonic indexing",
    ],
    techStack: ["Next.js 16", "TypeScript", "Tailwind CSS", "PostgreSQL", "Vercel"],
    thumbnailSrc: "/images/projects/lex-memoria.png",
    liveDemoUrl: "https://lawrence.cloud-ip.cc/",
    githubUrl: "https://github.com/renneco27-crypto/cortesportfolio",
    category: "edtech",
    featured: true,
    color: "#e63946",
  },
  {
    id: "stylepeek-by-rence",
    title: "StylePeek by Rence",
    slug: "stylepeek",
    badge: "DEVTOOLS / CSS ENGINE",
    shortDescription:
      "A developer inspection tool for extracting, analyzing, and experimenting with real-time CSS design tokens, computed layouts, and design systems.",
    description:
      "StylePeek empowers frontend engineers and designers to inspect computed styling properties, detect design system inconsistencies, and export clean Tailwind CSS snippets on the fly.",
    problemStatement:
      "Inspecting complex CSS stylesheets in default devtools is slow and cluttered with vendor prefixes and irrelevant browser styles.",
    solutionSummary:
      "Created a streamlined inspection utility that isolates key visual styling, font hierarchies, color palettes, and margin/padding geometry.",
    results: [
      "Instant design token extraction and palette mapping",
      "One-click Tailwind CSS class generator",
      "Lightweight extension and web interface",
    ],
    techStack: ["JavaScript", "TypeScript", "CSS3 / AST Parser", "Browser Extension APIs"],
    thumbnailSrc: "/images/projects/stylepeek.png",
    githubUrl: "https://github.com/renneco27-crypto/StylePeek-by-Rence",
    category: "web",
    featured: true,
    color: "#f4a261",
  },
  {
    id: "naturalvoice-edgescreenreader",
    title: "NaturalVoice — Edge Neural Screen Reader",
    slug: "naturalvoice",
    badge: "ACCESSIBILITY / NEURAL TTS",
    shortDescription:
      "A high-performance assistive screen reader using Microsoft Edge neural text-to-speech voices for natural-sounding reading.",
    description:
      "NaturalVoice provides accessible, fluid web narration using high-fidelity Edge neural speech synthesis. Features smart paragraph navigation, adjustable speeds, and keyboard-first accessibility shortcuts.",
    problemStatement:
      "Built-in robotic screen readers cause listening fatigue and lack natural prosody and intonation for long-form reading.",
    solutionSummary:
      "Integrated low-latency neural TTS synthesis with DOM traversal hooks and accessibility shortcuts.",
    results: [
      "Human-like neural speech synthesis with zero robotic artifacting",
      "Keyboard-only navigation and shortcut listeners",
      "Sub-50ms playback initialization",
    ],
    techStack: ["JavaScript", "Edge TTS API", "Web Speech API", "Browser Extension"],
    thumbnailSrc: "/images/projects/naturalvoice.png",
    githubUrl: "https://github.com/renneco27-crypto/NaturalVoice_EdgeScreenReader_Renne",
    category: "accessibility",
    featured: true,
    color: "#3a86ff",
  },
  {
    id: "ai-chatbot",
    title: "AI Portfolio Chatbot",
    slug: "ai-chatbot",
    badge: "AI / LLM REASONING",
    shortDescription:
      "A recruiter-focused AI assistant providing instant, conversational access to architectural qualifications, project telemetry, and candidate evaluation.",
    description:
      "The chatbot integrates real-time token streaming with fallback rate-limiting, custom system prompt boundaries, and low-latency response generation. It enables recruiters and hiring managers to probe technical qualifications interactively.",
    problemStatement:
      "Recruiters leave without getting answers to basic questions about technical skills, project architecture, and availability.",
    solutionSummary:
      "Built with Vercel AI SDK streaming, custom prompt constraints, and dynamic conversational responses.",
    results: [
      "Zero-latency multi-turn conversational streaming",
      "Robust client-side rate limiting & IP token bucket",
      "Contextual multi-agent routing for portfolio knowledge",
    ],
    techStack: ["Next.js 16", "Vercel AI SDK", "TypeScript", "Tailwind CSS", "Neon Postgres"],
    thumbnailSrc: "/images/projects/ai-chatbot.png",
    liveDemoUrl: "/",
    githubUrl: "https://github.com/renneco27-crypto/cortesportfolio",
    category: "ai",
    featured: true,
    color: "#e63946",
  },
  {
    id: "trash4cash",
    title: "CampusTrash4Cash Barcode System",
    slug: "campustrash4cash",
    badge: "IOT / SUSTAINABILITY",
    shortDescription:
      "A sustainability-focused incentives platform encouraging responsible waste sorting across academic campuses through barcode & dynamic QR verification.",
    description:
      "A full-stack mobile and cloud architecture that issues tokenized digital credits when students deposit recyclables into designated receptacles. Features real-time vendor settlement and ledger accountability.",
    problemStatement:
      "Campuses struggle with improper plastic waste disposal and lack of student incentives to recycle consistently.",
    solutionSummary:
      "Implemented a barcode scanning rewards system connecting student accounts to campus canteen points.",
    results: [
      "Sub-second QR & barcode scan and transaction confirmation",
      "Promotes cleaner educational environments",
      "Incentivized peer recycling economy",
    ],
    techStack: ["React Native", "Firebase", "Node.js", "QR Verification"],
    thumbnailSrc: "/images/projects/Campus-Connect.png",
    githubUrl: "https://github.com/crisantohcortes1-commits/-Trash4CashBarcode",
    category: "sustainability",
    featured: true,
    color: "#f4a261",
  },
  {
    id: "auto-cert",
    title: "AutoCertificationAI",
    slug: "autocertificationai",
    badge: "AUTOMATION / VISION",
    shortDescription:
      "An intelligent batch-generation platform creating thousands of cryptographically verifiable certificates in seconds.",
    description:
      "High-throughput pipeline that ingests CSV rosters and dynamically generates print-ready certificates with auto-adjusting text kerning, typographic bounding boxes, and QR authenticity links.",
    problemStatement:
      "Manual certificate design and entry for hundreds of conference attendees takes hours and causes frequent spelling errors.",
    solutionSummary:
      "Developed an automated OpenCV/PIL image processing engine that formats and exports bulk high-res certificates.",
    results: [
      "95% reduction in administrative certification time",
      "Automated typographic kerning and canvas scaling",
      "Bulk parallel PDF/image rendering engine",
    ],
    techStack: ["Python", "OpenCV", "PIL", "Batch Queues", "Next.js"],
    thumbnailSrc: "/images/projects/brand-identity.png",
    liveDemoUrl: "https://autocertificationai.onrender.com/",
    githubUrl: "https://github.com/renneco27-crypto/AutoCertificationAI",
    category: "automation",
    featured: true,
    color: "#e63946",
  },
  {
    id: "studyup-stitchcsv",
    title: "StudyUp (StitchCSV AI Study Tool)",
    slug: "studyup-stitchcsv",
    badge: "EDTECH / STUDY TOOLS",
    shortDescription:
      "A study tool designed to turn structured CSV data into comprehensive, interactive study notes, flashcards, and quizzes.",
    description:
      "By importing formatted CSV files, the app instantly populates a customized dashboard with diverse learning modules including flashcards, 4-option multiple-choice quizzes, fill-in-the-blank identification, true/false questions, and list enumeration.",
    problemStatement:
      "Converting lecture spreadsheets and syllabus items into structured active-recall study decks is tedious.",
    solutionSummary:
      "Built a parser that transforms raw CSV study guides into interactive quizzes and flashcards with review streaks.",
    results: [
      "Instant multi-mode quiz generation from CSVs",
      "Spaced-repetition flashcards and streak tracker",
      "Integrated Telegram Bot companion for mobile quizzes",
    ],
    techStack: ["React", "TypeScript", "Telegram Bot API", "CSV Engine"],
    thumbnailSrc: "/images/projects/Offline-Study-Notes-PWA.png",
    liveDemoUrl: "https://median.co/share/nmpwama#androidphone",
    githubUrl: "https://github.com/renneco27-crypto/StitchCSV",
    category: "edtech",
    featured: false,
    color: "#8b5cf6",
  },
  {
    id: "school-attendance-maker",
    title: "School Attendance Maker",
    slug: "school-attendance-maker",
    badge: "WEB SYSTEMS / BIOMETRICS",
    shortDescription:
      "Synchronized classroom attendance tracking through dual instructor & student portals with anti-cheating protocols.",
    description:
      "A secure web application built for academic institutions that streamlines classroom attendance tracking. Features include Teacher Panel + Student Portal, Anti-Cheat Double QR Technology, Biometric Verification, and Excel Export.",
    problemStatement:
      "Paper attendance sheets and proxy attendance cheating waste lecture time and degrade attendance accuracy.",
    solutionSummary:
      "Deployed a synchronized double-QR and face verification attendance engine with automated reporting.",
    results: [
      "Zero proxy-checkin fraud via dynamic rotating QR codes",
      "Automated spreadsheet export for faculty records",
      "Cross-platform support across web and mobile APK",
    ],
    techStack: ["Next.js", "Node.js", "Biometrics", "QR Protocols"],
    thumbnailSrc: "/images/projects/Campus-Connect.png",
    liveDemoUrl: "https://attendancemaker-tsjz.onrender.com",
    githubUrl: "https://github.com/renneco27-crypto/attendancemaker",
    category: "web",
    featured: false,
    color: "#10b981",
  },
];
