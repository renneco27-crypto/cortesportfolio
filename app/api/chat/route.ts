import { NextResponse } from "next/server";

function apiError(msg: string, status: number) {
  return NextResponse.json({ success: false, message: msg }, { status });
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 2000);
}

const LAWRENCE_CONTEXT_TERMS = [
  "lawrence", "rence", "skill", "skills", "project", "projects", "intern",
  "internship", "available", "availability", "contact", "email", "linkedin",
  "portfolio", "experience", "tech", "coding", "web", "developer", "work",
  "job", "hire", "study", "school", "aclc", "it", "support", "helpdesk",
  "testing", "remote", "graduate", "location", "from", "background",
  "resume", "education", "degree", "phone", "career", "goal"
];

function isRelevant(message: string): boolean {
  const lower = message.toLowerCase();

  if (/^(hello|hi|hey)\b/.test(lower)) {
    return true;
  }

  const hasLawrenceContext = LAWRENCE_CONTEXT_TERMS.some(term => lower.includes(term));

  if (!hasLawrenceContext) {
    return false;
  }

  return !/(^|\s)(what|how|who)\b/.test(lower) || lower.includes("lawrence") || lower.includes("rence") || lower.includes("skill") || lower.includes("skills") || lower.includes("project") || lower.includes("projects") || lower.includes("intern") || lower.includes("portfolio") || lower.includes("experience") || lower.includes("availability") || lower.includes("available") || lower.includes("contact") || lower.includes("email") || lower.includes("linkedin") || lower.includes("background") || lower.includes("location") || lower.includes("from") || lower.includes("school") || lower.includes("aclc") || lower.includes("resume") || lower.includes("degree");
}

function getFallbackReply(userMessage: string): string {
  const message = userMessage.toLowerCase();

  if (/(where|from|location|origin|born|based)/.test(message)) {
    return "Lawrence is from Ormoc City, Leyte, Philippines.";
  }

  if (/(skill|skills|tech|stack|next\.js|typescript|tailwind|vercel|neon|postgres)/.test(message)) {
    return "Lawrence works with Next.js, TypeScript, Tailwind CSS, Vercel AI SDK, and Neon Postgres.";
  }

  if (/(project|projects|portfolio|chatbot|telegram)/.test(message)) {
    return "His notable projects include the AI Portfolio Chatbot and a Telegram AI chatbot integration.";
  }

  if (/(intern|internship|available|availability|opportunity)/.test(message)) {
    return "Lawrence is currently open to internship opportunities.";
  }

  return "I’m Lawrence’s AI assistant and I can answer questions about his skills, projects, and internship availability.";
}

const SYSTEM_PROMPT = `
IMPORTANT: You are Lawrence's AI assistant. You MUST only use the information provided below to answer questions. If the answer is not listed here, say: "I don't have that information — please contact Lawrence directly at renneco27@gmail.com." Never make up or guess information.

You are Lawrence's AI assistant embedded on his portfolio website.
Your name is "Lawrence's AI". Answer questions about Lawrence Cortes — his background, skills, projects, and internship availability. Be friendly, concise, and professional. Lawrence is genuinely passionate about his work and always happy to talk further — feel free to mention that visitors are welcome to email him directly at renneco27@gmail.com for a 1-on-1 conversation.

=== PERSONAL INFO ===
Full Name: Lawrence Cortes (goes by "Rence")
Location: Ormoc City, Leyte, Philippines
Email: renneco27@gmail.com
Phone: +63 960 885 7457
LinkedIn: https://www.linkedin.com/in/lawrence-cortes-788101408
Portfolio: https://lawrencecortes.mystrikingly.com

=== EDUCATION ===
Degree: Bachelor of Science in Information Technology (BSIT)
School: ACLC College Ormoc Campus
Year Level: 1st Year
Expected Graduation: 2029

=== INTERNSHIP AVAILABILITY ===
- Available immediately upon acceptance
- Preferred roles: IT Support / Helpdesk, QA / Software Testing, Web Development (Beginner), IT Operations / Infrastructure
- Prefers remote work; onsite may be considered with prior school approval
- Schedule is flexible depending on academic requirements
- Available for interviews with prior notice

=== WORK EXPERIENCE ===
- Completed an internship at a Government Accounting Office
  Tasks: documentation, record management, administrative and accounting workflow support

=== CUSTOMER SUPPORT & COMMUNICATION ===
- Clear and professional written communication (email/chat-ready)
- Empathy and customer-focused interaction
- Ability to follow strict communication guidelines

=== OPERATIONAL & ADMINISTRATIVE SUPPORT ===
- Data entry, documentation, and record management
- SOP and policy adherence
- Multitasking across tools and responsibilities

=== TECHNICAL SKILLS ===
- Microsoft Office (Word, Excel)
- Google Workspace (Docs, Sheets)
- Basic troubleshooting
- Introductory programming concepts
- AI-assisted productivity tools (ChatGPT, Gemini, Claude)
- Digital documentation systems

=== TECH STACK EXPOSURE ===
HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Git, Docker, REST APIs, Java, Spring Boot, Hibernate/JPA, Maven/Gradle, Python, Go, Rust, Azure, Google Cloud, BigQuery, Kubernetes, Power BI

=== PROJECTS ===
- AI Portfolio Chatbot: Built with Next.js, TypeScript, Tailwind CSS, Vercel AI SDK, Neon Postgres — an AI assistant for his portfolio site
- Telegram AI Chatbot Integration: Step-by-step chatbot integration with Telegram

=== KEY ACHIEVEMENTS ===
- Improved document retrieval efficiency by 30% in a government office
- Contributed to a 20% workflow improvement by resolving issues collaboratively
- Reduced onboarding time by 25% through quick adaptation to new systems

=== WORK STYLE & STRENGTHS ===
- Detail-oriented, structured, and highly adaptable
- Strong soft skills: communication, discipline, attention to detail, problem-solving
- Handles multiple tasks efficiently while consistently meeting deadlines

=== CAREER GOALS ===
- Seeking real-world IT exposure beyond classroom learning
- Wants hands-on experience in programming, system workflows, and technical problem-solving
- Long-term direction: grow from IT support into more advanced technical roles in the IT field

Rules:
- Be concise and friendly
- Only answer questions about Lawrence's skills, projects, or availability
- If asked something unrelated, redirect politely back to Lawrence's portfolio
- Lawrence enjoys connecting directly — when relevant, invite the visitor to email him for a 1-on-1 chat
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = sanitize(body.message || "");

    if (!userMessage) return apiError("Message is required", 400);

    if (userMessage.length < 2) {
      return apiError("Message too short", 400);
    }

    if (!isRelevant(userMessage)) {
      return NextResponse.json({
        success: true,
        reply:
          "I can only answer questions about Lawrence's skills, projects, and internship availability. Try asking something like: 'What are Lawrence's skills?' or 'Is Lawrence available for internship?'",
      });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) return apiError("AI service unavailable", 503);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];

    console.log("Sending messages:", JSON.stringify(messages, null, 2));

    const models = [
      "nvidia/llama-3.1-nemotron-70b-instruct",
      "meta/llama-3.1-8b-instruct",
      "mistralai/mistral-7b-instruct-v0.3",
    ];

    let response: Response | null = null;
    let lastError = "";

    for (const model of models) {
      response = await fetch(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 512,
          }),
        }
      );

      if (response.ok) {
        break;
      }

      lastError = await response.text();
      console.error(`NVIDIA API error for model ${model}:`, lastError);
    }

    if (!response || !response.ok) {
      const fallbackReply = getFallbackReply(userMessage);
      console.log("Using fallback reply because NVIDIA request failed.");
      return NextResponse.json({ success: true, reply: fallbackReply });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "No response.";

    console.log("NVIDIA reply:", reply);

    return NextResponse.json({ success: true, reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return apiError("Internal server error", 500);
  }
}
