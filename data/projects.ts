import type { Project } from "@/types";

export const projectsData: Project[] = [
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
    id: "student-grading",
    title: "Student Grading & Projection App",
    slug: "student-grading",
    badge: "EDTECH / ANALYTICS",
    shortDescription:
      "A self-assessment and academic performance forecasting engine for engineering cohorts.",
    description:
      "Interactive data analytics system analyzing weighted coursework components to project final grade outcomes, allowing students to simulate score requirements for academic honors.",
    problemStatement:
      "Students lack visibility into how upcoming exams impact their cumulative GPA and honors eligibility.",
    solutionSummary:
      "Created a weighted grade simulator with instant threshold projection and visual score analytics.",
    results: [
      "Real-time predictive grade trajectory modeling",
      "Interactive weighted GPA calculators",
      "Instant scenario simulation for exam targets",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Data Analytics"],
    thumbnailSrc: "/images/projects/Student-Performance-Dashboard.png",
    githubUrl: "https://github.com/crisantohcortes1-commits/studentself_gradingapp",
    category: "edtech",
    featured: true,
    color: "#9b2226",
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
    id: "fortheblind-extension",
    title: "For the Blind — Desktop Extension",
    slug: "fortheblind-extension",
    badge: "ACCESSIBILITY / SPEECH",
    shortDescription:
      "A browser and desktop extension for blind and visually impaired users that provides fast speech feedback and keyboard navigation.",
    description:
      "Features speech feedback while navigating web pages, text/link/button/heading reading, caret tracking, selected text reading, element labels announced before their role, and Navigator Mode with Alt + C shortcuts.",
    problemStatement:
      "Standard web screen readers are often sluggish, complex to configure, and fail on dynamic SPA interfaces.",
    solutionSummary:
      "Engineered lightweight, low-latency text-to-speech hooks and key-driven exploration shortcuts.",
    results: [
      "Sub-50ms speech feedback latency",
      "Keyboard-only navigation without mouse dependency",
      "Custom hotkey mode for fast web browsing",
    ],
    techStack: ["JavaScript", "Web Speech API", "Browser Extension APIs"],
    thumbnailSrc: "/images/projects/brand-identity.png",
    githubUrl: "https://github.com/renneco27-crypto/ForTheBlind_DesktopExtention",
    category: "accessibility",
    featured: false,
    color: "#3b82f6",
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
  {
    id: "tiktok-lead-funnel",
    title: "TikTok Lead Funnel & CRM",
    slug: "tiktok-lead-funnel",
    badge: "MARKETING TECH / CRM",
    shortDescription:
      "Short-form content lead capture strategy with TikTok Pixel and real-time CRM attribution.",
    description:
      "Integrated TikTok Pixel and Events API with a custom Next.js landing page to track user funnel stages and pass validated leads into a client CRM dashboard.",
    problemStatement:
      "Local business could not track return on ad spend or attribute sales to short-form video campaigns.",
    solutionSummary:
      "Set up TikTok Pixel, Server Events API, and connected conversion tracking to a live reporting dashboard.",
    results: [
      "CPA reduced by 30% in first month",
      "150+ high-intent leads captured in 2 weeks",
      "Full funnel event attribution",
    ],
    techStack: ["TikTok Pixel API", "Events API", "Next.js", "Tailwind CSS"],
    thumbnailSrc: "/images/projects/tiktok-funnel.png",
    githubUrl: "https://github.com/renneco27-crypto/cortesportfolio",
    category: "marketing",
    featured: false,
    color: "#ec4899",
  },
];
