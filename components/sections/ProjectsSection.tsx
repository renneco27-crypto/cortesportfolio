"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Bot, Recycle, BadgeCheck, ChartNoAxesCombined, ChevronDown } from "lucide-react";

type Card = {
  id: number;
  badge: string;
  title: string;
  shortDescription: string;
  tags: string[];
  description: string;
  results: string[];
  techStack: string[];
  githubUrl: string;
  accent: string;
  iconTone: string;
  iconBg: string;
  icon: typeof Bot;
  thumbnailClassName: string;
};

const cards: Card[] = [
  {
    id: 1,
    badge: "AI",
    title: "AI Portfolio Chatbot",
    shortDescription:
      "A recruiter-focused AI assistant integrated into a personal portfolio website to provide instant, conversational access to applicant information.",
    tags: ["Instant Access", "Recruiter-focused"],
    description:
      "The chatbot enables recruiters, hiring managers, and potential clients to ask questions about the candidate's background, technical skills, projects, education, experience, achievements, and career objectives without manually navigating through multiple pages.",
    results: [
      "Improved information accessibility",
      "Enhanced recruiter engagement",
      "Streamlined candidate evaluation",
    ],
    techStack: ["Next.js", "Vercel AI SDK", "TypeScript"],
    githubUrl: "https://github.com/corteslawrence027-art/CORTES-Engineering-Portfolio/tree/main/AI%20Portfolio%20Chatbot",
    accent: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    iconTone: "text-violet-200",
    iconBg: "bg-violet-400/10",
    icon: Bot,
    thumbnailClassName: "bg-[linear-gradient(135deg,#2b1a4a_0%,#111827_45%,#1f2937_100%)]",
  },
  {
    id: 2,
    badge: "Sustainability",
    title: "CampusTrash4Cash",
    shortDescription:
      "A sustainability-focused rewards platform that encourages responsible waste disposal within educational institutions.",
    tags: ["QR-based", "Rewards system"],
    description:
      "Students earn digital credits by properly disposing of recyclable waste through a QR-code-based verification system. Accumulated credits can be redeemed for snacks, school incentives, or other rewards from participating campus vendors.",
    results: ["Promotes cleaner environments", "Fosters student engagement", "Incentivized recycling"],
    techStack: ["React Native", "Firebase", "QR Integration"],
    githubUrl: "https://github.com/corteslawrence027-art/CORTES-Engineering-Portfolio/tree/main/CampusTrash4Cash",
    accent: "from-emerald-500/20 via-green-500/10 to-transparent",
    iconTone: "text-emerald-200",
    iconBg: "bg-emerald-400/10",
    icon: Recycle,
    thumbnailClassName: "bg-[linear-gradient(135deg,#052e16_0%,#14532d_45%,#111827_100%)]",
  },
  {
    id: 3,
    badge: "Automation",
    title: "AutoCertificationAI",
    shortDescription:
      "An intelligent certificate generation platform that automates the creation of personalized certificates for events and workshops.",
    tags: ["Bulk generation", "Auto-formatting"],
    description:
      "Organizers can upload a list of participants and instantly generate professionally formatted certificates in bulk. The system automatically adjusts text sizing and positioning while maintaining design consistency.",
    results: ["Reduced administrative workload", "Improved operational efficiency", "Bulk generation support"],
    techStack: ["Python", "OpenCV", "Bulk Processing"],
    githubUrl: "https://github.com/corteslawrence027-art/CORTES-Engineering-Portfolio/tree/main/AutoCertificationAi",
    accent: "from-violet-500/20 via-indigo-500/10 to-transparent",
    iconTone: "text-violet-200",
    iconBg: "bg-violet-400/10",
    icon: BadgeCheck,
    thumbnailClassName: "bg-[linear-gradient(135deg,#312e81_0%,#4c1d95_45%,#111827_100%)]",
  },
  {
    id: 4,
    badge: "EdTech",
    title: "Student Grading App",
    shortDescription:
      "A self-assessment and academic performance forecasting platform for students.",
    tags: ["Real-time insights", "Forecasting"],
    description:
      "Enables students to estimate their final grades based on completed outputs, written works, quizzes, examinations, and performance tasks. The system analyzes current academic standing and projects potential outcomes.",
    results: ["Real-time academic insights", "Informed decision making", "Performance strategy development"],
    techStack: ["Next.js", "Tailwind CSS", "Data Analytics"],
    githubUrl: "https://github.com/corteslawrence027-art/CORTES-Engineering-Portfolio/tree/main/Student_Grading_App",
    accent: "from-violet-500/20 via-purple-500/10 to-transparent",
    iconTone: "text-violet-200",
    iconBg: "bg-violet-400/10",
    icon: ChartNoAxesCombined,
    thumbnailClassName: "bg-[linear-gradient(135deg,#4c1d95_0%,#312e81_45%,#111827_100%)]",
  },
];

export default function ProjectsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [contentHeights, setContentHeights] = useState<Record<number, number>>({});
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleCards(cards.map((card) => card.id));
      return;
    }

    const timers = cards.map((card, index) =>
      window.setTimeout(() => {
        setVisibleCards((prev) => (prev.includes(card.id) ? prev : [...prev, card.id]));
      }, index * 100)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [prefersReducedMotion]);

  useEffect(() => {
    const updateHeights = () => {
      const nextHeights: Record<number, number> = {};

      contentRefs.current.forEach((node, index) => {
        if (node) {
          nextHeights[index] = node.scrollHeight;
        }
      });

      setContentHeights(nextHeights);
    };

    const frame = window.requestAnimationFrame(updateHeights);
    window.addEventListener("resize", updateHeights);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateHeights);
    };
  }, [expandedIndex, prefersReducedMotion]);

  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle(index);
    }
  };

  return (
    <section id="projects" className="py-24 px-6 bg-zinc-950 border-t border-zinc-800/50">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <div>
          <span className="font-mono text-xs text-violet-400 uppercase tracking-widest">Projects</span>
          <h2 className="text-4xl font-bold text-white mt-2">What I've Built</h2>
          <p className="text-zinc-400 mt-2">Problem → Solution → Results.</p>
          <div className="h-1 w-20 bg-violet-400 mt-4 rounded-full" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isOpen = expandedIndex === index;
            const isVisible = visibleCards.includes(card.id);

            return (
              <article
                key={card.title}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => handleToggle(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`group rounded-3xl border border-zinc-800 bg-zinc-900/90 p-0 text-left shadow-[0_12px_36px_rgba(2,6,23,0.35)] hover:border-violet-400 hover:shadow-[0_0_25px_rgba(167,139,250,0.2)] ${isVisible ? "visible opacity-100 translate-x-0" : "opacity-0 -translate-x-5"} ${prefersReducedMotion ? "" : "transition-all duration-300"}`}
                style={{ transition: prefersReducedMotion ? "none" : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
              >
                <div className="overflow-hidden rounded-t-3xl border-b border-zinc-800/80">
                  <div className={`relative h-40 overflow-hidden ${card.thumbnailClassName}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-black/20 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md ${card.iconBg}`}>
                        <Icon className={`h-10 w-10 ${card.iconTone}`} />
                      </div>
                    </div>
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-[10px] uppercase tracking-[0.25em] text-zinc-200/80">
                      <span>UI mockup</span>
                      <span>{card.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full bg-violet-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-violet-200">
                      {card.badge}
                    </span>
                    <ChevronDown className={`expand-icon h-5 w-5 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                  </div>

                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{card.shortDescription}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div
                    ref={(element) => {
                      contentRefs.current[index] = element;
                    }}
                    className="overflow-hidden"
                    style={{
                      height: isOpen ? `${contentHeights[index] ?? 0}px` : "0px",
                      transition: prefersReducedMotion ? "none" : "height 0.3s ease-out",
                    }}
                  >
                    <div className="mt-5 border-l-2 border-violet-400/50 pl-4 text-sm text-zinc-200">
                      <h4 className="text-xs uppercase tracking-[0.3em] text-violet-200">Description</h4>
                      <p className="mt-2 text-zinc-300">{card.description}</p>

                      <h4 className="mt-5 text-xs uppercase tracking-[0.3em] text-violet-200">Results</h4>
                      <ul className="mt-2 space-y-1 text-zinc-300">
                        {card.results.map((result) => (
                          <li key={result} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                            <span>{result}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {card.techStack.map((item) => (
                          <span key={item} className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-mono text-zinc-300">
                            {item}
                          </span>
                        ))}
                      </div>

                      <a
                        href={card.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-zinc-900 px-4 py-2 text-xs font-mono text-violet-400 transition-all duration-200 hover:border-violet-400 hover:bg-violet-400/10 hover:text-white hover:shadow-[0_0_12px_rgba(167,139,250,0.3)]"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2.1c-3.2.7-3.9-1.3-3.9-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.7 1.8 1.7 1.8.9 1.6 2.4 1.1 3 .9.1-.7.3-1.2.6-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.4-2.3 1.2-3.2-.1-.3-.5-1.4.1-2.9 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.5.2 2.6.1 2.9.7.9 1.2 1.9 1.2 3.2 0 4.4-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.65 18.35.5 12 .5Z" />
                        </svg>
                        View on GitHub
                      </a>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs uppercase tracking-[0.25em] text-zinc-400">
                    <span>Click to view details</span>
                    <ChevronDown className={`expand-icon h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}