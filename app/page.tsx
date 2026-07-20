"use client";
import emailjs from "@emailjs/browser";
import { useEffect, useState, useRef } from "react";
import DeveloperSection from "@/components/sections/DeveloperSection";
import ZoomSection from "@/components/ui/ZoomSection";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ProjectCorridor from "@/components/ui/ProjectCorridor";
import type { PortfolioCredential } from "@/types";

const currentYear = new Date().getFullYear();

export default function HomePage() {
  // ==========================================
  // 1. EmailJS States & Refs
  // ==========================================
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ senderName: "", senderEmail: "", messageBody: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState({ type: "success", text: "" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setFeedback({ type: "success", text: "" });

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
    const contactTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT!;
    const autoreplyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTOREPLY!;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

    try {
      await emailjs.send(serviceId, contactTemplateId, {
        name: form.senderName,
        from_email: form.senderEmail,
        title: form.messageBody.slice(0, 60),
        message: form.messageBody,
      }, publicKey);

      await emailjs.send(serviceId, autoreplyTemplateId, {
        name: form.senderName,
        from_email: form.senderEmail,
        title: form.messageBody.slice(0, 60),
        message: form.messageBody,
      }, publicKey);

      setStatus("success");
      setFeedback({ type: "success", text: "Message sent!" });
      setForm({ senderName: "", senderEmail: "", messageBody: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFeedback({ type: "error", text: "Failed to send message." });
    }
  }

  // ==========================================
  // 2. Chat Widget States & Refs (Cleaned up duplicates)
  // ==========================================
  const [chatOpen, setChatOpen] = useState(false);
  const [pokeHidden, setPokeHidden] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant" | "system"; content: string }>>([
    {
      role: "assistant",
      content: "Hey, I'm Lawrence 👋 Ask me anything about my skills, projects, or internship availability!",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLDivElement>(null);

  const [chatSleeping, setChatSleeping] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("/resume/lawrence-cortes-resume.pdf");
  const [credentials, setCredentials] = useState<PortfolioCredential[]>([]);

  // Fetch dynamic credentials on mount
  useEffect(() => {
    fetch("/api/credentials")
      .then((r) => r.json())
      .then(setCredentials)
      .catch(console.error);
  }, []);

  // Fetch dynamic resume URL on mount
  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.url) {
          setResumeUrl(data.url);
        }
      })
      .catch((err) => console.error("Error fetching dynamic resume URL:", err));
  }, []);

  // Sleepy Chatbot timeout logic
  useEffect(() => {
    const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
    let inactivityTimer: NodeJS.Timeout;

    function putChatbotToSleep() {
      setChatSleeping(true);
    }

    function resetTimer() {
      setChatSleeping(false);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(putChatbotToSleep, IDLE_TIMEOUT_MS);
    }

    // Initialize timer
    resetTimer();

    // Listen for active screen usage
    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Instantly catch when tab changes or phone locks
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        putChatbotToSleep();
      } else {
        resetTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Auto scroll messages to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ==========================================
  // 3. Interface Side Effects (Terminal, Themes, etc.)
  // ==========================================
  useEffect(() => {
    // Dynamic year display
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear().toString();
    }

    // mobile menu
    const menuToggle = document.getElementById("menuToggle");
    const mobilePanel = document.getElementById("mobilePanel");
    if (menuToggle && mobilePanel) {
      menuToggle.addEventListener("click", () => {
        const open = mobilePanel.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(open));
      });
      mobilePanel.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          mobilePanel.classList.remove("open");
          menuToggle.setAttribute("aria-expanded", "false");
        })
      );
    }



    // terminal typing effect
    const lines = [
      { p: "guest@lc.dev", c: "~$ ", t: "whoami", cls: "cmd" },
      { t: "Lawrence Cortes", cls: "out" },
      { t: "BS Information Technology · Ormoc City, PH", cls: "dim" },
      { p: "guest@lc.dev", c: "~$ ", t: "cat focus.txt", cls: "cmd" },
      { t: "Full-stack dev (React / Next.js / Node)", cls: "out" },
      { t: "Government-grade attention to detail", cls: "out" },
      { p: "guest@lc.dev", c: "~$ ", t: "echo $STATUS", cls: "cmd" },
      { t: "Open to internships · " + currentYear, cls: "out" },
    ];
    const termBody = document.getElementById("termBody");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function renderStatic() {
      if (termBody) {
        termBody.innerHTML = lines
          .map((l) => {
            if (l.cls === "cmd")
              return `<div class="ln"><span class="prompt">${l.p}</span><span class="path2">${l.c}</span>${l.t}</div>`;
            return `<div class="ln ${l.cls === "dim" ? "dim" : "out"}">${l.t}</div>`;
          })
          .join("");
      }
    }

    const activeTimeoutIds: number[] = [];
    if (reduceMotion) {
      renderStatic();
    } else {
      let li = 0;
      function typeLine() {
        if (li >= lines.length || !termBody) return;
        const l = lines[li];
        const div = document.createElement("div");
        div.className = "ln " + (l.cls === "dim" ? "dim" : l.cls === "cmd" ? "" : "out");
        termBody.appendChild(div);
        const prefix = l.cls === "cmd" ? `<span class="prompt">${l.p}</span><span class="path2">${l.c}</span>` : "";
        let i = 0;
        const speed = l.cls === "cmd" ? 38 : 8;
        function tick() {
          if (!termBody) return;
          div.innerHTML = prefix + l.t.slice(0, i) + '<span class="cursor"></span>';
          i++;
          if (i <= l.t.length) {
            const tId = window.setTimeout(tick, speed);
            activeTimeoutIds.push(tId);
          } else {
            div.innerHTML = prefix + l.t;
            li++;
            const tId = window.setTimeout(typeLine, l.cls === "cmd" ? 250 : 180);
            activeTimeoutIds.push(tId);
          }
        }
        tick();
      }
      typeLine();
    }

    // scroll reveal
    const reveals = document.querySelectorAll(".reveal");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && !reduceMotion) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io?.unobserve(en.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      reveals.forEach((el) => io?.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    const pokeTimeout = window.setTimeout(() => setPokeHidden(true), 12000);

    // contact form -> mailto
    const formElement = document.getElementById("contactForm");
    const note = document.getElementById("formNote");
    if (formElement && note) {
      formElement.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = (document.getElementById("cf-name") as HTMLInputElement).value.trim();
        const email = (document.getElementById("cf-email") as HTMLInputElement).value.trim();
        const message = (document.getElementById("cf-message") as HTMLTextAreaElement).value.trim();
        const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        window.open("https://www.facebook.com/Rennejay.Dev.21", "_blank");
        note.textContent = "Open your email app…";
      });
    }

    return () => {
      activeTimeoutIds.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(pokeTimeout);
      if (io) {
        io.disconnect();
      }
    };
  }, []);

  // Doors transition effect — reversible
  useEffect(() => {
    const devEl = devRef.current;
    if (!devEl) return;
    const heroGrid = document.querySelector(".hero-grid");
    if (!heroGrid) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          heroGrid.classList.add("doors-open");
        } else {
          heroGrid.classList.remove("doors-open");
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(devEl);
    return () => obs.disconnect();
  }, []);

  // ==========================================
  // 4. Chat Message Submission Handler
  // ==========================================
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatSleeping) return;
    const userMessage = inputVal.trim();
    if (!userMessage) return;

    setInputVal("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "system", content: data.message || "Something went wrong." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
           content: "AI service unavailable. Please try again later or message Lawrence on Facebook at facebook.com/Rennejay.Dev.21.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };
  return (
    <>
      <header>
        <div className="container nav">
          <a href="#top" className="logo">
            LC<span>.</span>DEV
          </a>

          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#developer">Developer</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#certifications">Certifications</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="nav-actions">
            <a
              className="icon-btn"
              href="https://github.com/renneco27-crypto"
              target="_blank"
              rel="noopener"
              aria-label="GitHub profile"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.02 3.26 9.28 7.79 10.78.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.17.69-3.84-1.36-3.84-1.36-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.39-1.25.71-1.54-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.18-3.06-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.06 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55A10.53 10.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
              </svg>
            </a>

            <a className="btn btn-primary" href={resumeUrl} target="_blank" rel="noopener noreferrer" id="resumeBtn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              Resume
            </a>
          </div>
        </div>

        <div className="mobile-panel" id="mobilePanel">
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#developer">Developer</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#certifications">Certifications</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </header>

      <main id="top">
        {/* ABOUT / HERO */}
        <ZoomSection>
          <section className="section hero" id="about">
            <div className="container">
              <div className="hero-grid">
                <div className="reveal">
                  <span className="eyebrow">About</span>
                  <h1>
                    Developer by code,
                    <br />
                    <span className="accent">designer by eye.</span>
                  </h1>
                  <h3 style={{ marginTop: "1.5rem", fontSize: "1.15rem", color: "var(--violet-300)" }}>
                    Currently Focused On
                  </h3>
                  <ul style={{ marginTop: "0.8rem", display: "grid", gap: "0.5rem", listStyle: "none" }}>
                    <li style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", color: "var(--zinc-300)", fontSize: "0.95rem" }}>
                      <span style={{ color: "var(--emerald-400)" }}>▹</span>
                      Building full-stack web applications with React, Next.js, and Node.js
                    </li>
                    <li style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", color: "var(--zinc-300)", fontSize: "0.95rem" }}>
                      <span style={{ color: "var(--emerald-400)" }}>▹</span>
                      Strengthening backend development using Java and Spring Boot
                    </li>
                    <li style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", color: "var(--zinc-300)", fontSize: "0.95rem" }}>
                      <span style={{ color: "var(--emerald-400)" }}>▹</span>
                      Learning cloud technologies through Azure and Google Cloud
                    </li>
                    <li style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", color: "var(--zinc-300)", fontSize: "0.95rem" }}>
                      <span style={{ color: "var(--emerald-400)" }}>▹</span>
                      Preparing for a software engineering internship
                    </li>
                  </ul>

                  <div className="hero-actions">
                    <a href="#contact" className="btn btn-primary">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 2 11 13" />
                        <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
                      </svg>
                      Get in touch
                    </a>
                    <a
                      href="https://github.com/renneco27-crypto"
                      target="_blank"
                      rel="noopener"
                      className="btn btn-ghost"
                    >
                      View GitHub
                    </a>
                  </div>

                  <div className="stat-row">
                    <div className="stat-card">
                      <div className="num"><AnimatedCounter targetValue={98} suffix="%" durationMs={2000} startFrom={1} /></div>
                      <div className="label">Task accuracy</div>
                    </div>
                    <div className="stat-card">
                      <div className="num"><AnimatedCounter targetValue={100} suffix="%" durationMs={2000} startFrom={1} /></div>
                      <div className="label">On-time delivery</div>
                    </div>
                    <div className="stat-card">
                      <div className="num"><AnimatedCounter targetValue={20} suffix="+" durationMs={2000} startFrom={1} /></div>
                      <div className="label">Tools &amp; languages</div>
                    </div>
                  </div>
                </div>

                <div className="reveal">
                  <div className="term">
                    <div className="term-bar">
                      <span className="term-dot t1"></span>
                      <span className="term-dot t2"></span>
                      <span className="term-dot t3"></span>
                      <span className="path">guest@lc.dev — zsh</span>
                    </div>
                    <div className="term-body" id="termBody"></div>
                  </div>
                  <span className="badge-live">
                    <span className="dot"></span> Open to internships · {currentYear}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </ZoomSection>

        {/* DEVELOPER */}
        <div ref={devRef}>
          <DeveloperSection />
        </div>

        {/* SKILLS */}
        <ZoomSection>
          <section className="section" id="skills">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Skills</span>
               <h2>Built across the stack</h2>
  <p>
    I combine technical problem-solving with strong communication and
    collaboration skills. Whether building applications, learning new
    technologies, or supporting team objectives, I focus on delivering
    reliable results and continuously improving my craft.
  </p>
  <p style={{ marginTop: '0.7rem' }}>
    From software development and cloud technologies to documentation,
    customer support, and process-driven work, I bring a well-rounded skill
    set that helps me adapt quickly and contribute effectively in professional
    environments.
  </p>
            </div>

            <div className="skill-grid">
              <div className="skill-card reveal">
                <h3>
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </span>
                  Languages &amp; Frameworks
                </h3>
                <div className="tag-row">
                  <span className="tag">JavaScript</span>
                  <span className="tag">TypeScript</span>
                  <span className="tag">React</span>
                  <span className="tag">Next.js</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">HTML</span>
                  <span className="tag">CSS</span>
                  <span className="tag">Java</span>
                  <span className="tag">Python</span>
                  <span className="tag">C#</span>
                  <span className="tag">C++</span>
                  <span className="tag">Go</span>
                  <span className="tag">Rust</span>
                  <span className="tag">Kotlin</span>
                </div>
              </div>

              <div className="skill-card reveal">
                <h3>
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
                      <path d="M3 12a9 3 0 0 0 18 0" />
                    </svg>
                  </span>
                  Backend &amp; Data
                </h3>
                <div className="tag-row">
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">MongoDB</span>
                  <span className="tag">Spring Boot</span>
                  <span className="tag">Maven/Gradle</span>
                  <span className="tag">REST APIs</span>
                </div>
              </div>

              <div className="skill-card reveal">
                <h3>
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.5 19H9a7 7 0 1 1 1.1-13.9A6.5 6.5 0 0 1 22 8.5a4.5 4.5 0 0 1-1 8.4" />
                    </svg>
                  </span>
                  Cloud &amp; Tooling
                </h3>
                <div className="tag-row">
                  <span className="tag">Azure</span>
                  <span className="tag">Google Cloud</span>
                  <span className="tag">Docker</span>
                  <span className="tag">Git</span>
                </div>
              </div>

              <div className="skill-card reveal">
                <h3>
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                  Customer Support &amp; Communication
                </h3>
                <div className="tag-row">
                  <span className="tag">Clear written comms</span>
                  <span className="tag">Email/chat-ready</span>
                  <span className="tag">Empathy-driven interaction</span>
                  <span className="tag">Strict guideline adherence</span>
                  <span className="tag">ChatGPT</span>
                  <span className="tag">Gemini</span>
                  <span className="tag">Claude</span>
                </div>
              </div>

              <div className="skill-card reveal">
                <h3>
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                      <path d="M10 9H8" />
                    </svg>
                  </span>
                  Operational &amp; Admin Support
                </h3>
                <div className="tag-row">
                  <span className="tag">Data entry</span>
                  <span className="tag">Documentation</span>
                  <span className="tag">Record management</span>
                  <span className="tag">SOP adherence</span>
                  <span className="tag">Multitasking</span>
                  <span className="tag">Process compliance</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ZoomSection>

        {/* EXPERIENCE */}
        <section className="section" id="experience">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Experience</span>
              <h2>Where the discipline comes from</h2>
              <p>Before code, it was government paperwork — same standard for accuracy either way.</p>
            </div>

            <div className="exp-card reveal">
              <div>
                <h3 className="exp-role">Accounting Intern</h3>
                <div className="exp-meta">
                  <strong>Government Accounting Office</strong> · Philippines
                  <br />
                  04/2024 – 06/2024
                </div>
              </div>
              <ul className="exp-list">
                <li>
                  Completed administrative and accounting tasks with 98% accuracy, keeping documentation aligned with
                  procedure.
                </li>
                <li>Reorganized records and filing, improving document retrieval efficiency by 30%.</li>
                <li>Held 100% on-time task completion while handling multiple responsibilities at once.</li>
                <li>Followed government policy and workflow requirements with zero compliance errors.</li>
                <li>Worked with the team to clear blockers, contributing to a ~20% faster task turnaround.</li>
                <li>Picked up new systems and procedures 25% faster than the expected onboarding pace.</li>
              </ul>
            </div>

            <div className="achv-grid">
              <div className="achv-card reveal">
                <div className="num">+<AnimatedCounter targetValue={30} suffix="%" durationMs={2000} startFrom={1} /></div>
                <div className="label">Retrieval efficiency</div>
              </div>
              <div className="achv-card reveal">
                <div className="num">+<AnimatedCounter targetValue={20} suffix="%" durationMs={2000} startFrom={1} /></div>
                <div className="label">Workflow turnaround</div>
              </div>
              <div className="achv-card reveal">
                <div className="num">&minus;<AnimatedCounter targetValue={25} suffix="%" durationMs={2000} startFrom={1} /></div>
                <div className="label">Onboarding time</div>
              </div>
              <div className="achv-card reveal">
                <div className="num"><AnimatedCounter targetValue={0} suffix="" durationMs={2000} startFrom={0} /></div>
                <div className="label">Compliance errors</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS — scroll-locked corridor */}
        <ProjectCorridor />

        {/* CERTIFICATIONS */}
        <section className="section" id="certifications">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Certifications</span>
              <h2>Credentials on record</h2>
              <p>Cloud fundamentals, security basics, and the civil-service track record behind the resume.</p>
            </div>

            <div className="cert-grid">
              {credentials.map((cert) => (
                <div key={cert.id} className="cert-row reveal">
                  <span className="ico">
                    {cert.badge_icon === "shield" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ) : cert.badge_icon === "check" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                        <path d="m8.5 14 -1.5 6 5-2 5 2-1.5-6" />
                      </svg>
                    ) : cert.badge_icon === "graduation" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5Z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 style={{ margin: 0 }}>{cert.label}</h4>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${cert.status === "earned" ? "bg-emerald-400/10 text-emerald-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                        {cert.status === "earned" ? "Earned" : "Pending"}
                      </span>
                    </div>
                    <p style={{ marginTop: "0.25rem" }}>{cert.issuing_body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="container">
            <div className="section-head reveal">
              <span className="eyebrow">Contact</span>
              <h2>Let's build something</h2>
              <p>Internship inquiries, freelance projects, or just say hi.</p>
            </div>

            <div className="contact-grid">
              <div className="card reveal">
                <div className="id-row">
                  <img src="/images/lawrence-face.jpg" alt="Lawrence Cortes" className="avatar" style={{ objectFit: 'cover' }} />
                  <div>
                    <h3>Lawrence Cortes</h3>
                    <div className="sub">Ormoc City, Leyte · PH</div>
                  </div>
                </div>

                <span className="status-chip">
                  <span className="dot"></span> Open to internships · {currentYear}
                </span>

                <div className="info-list">
                  <div className="info-row">
                    <span className="ico">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </span>
                    <div>
                      <div className="t1">CORTES Engineering Portfolio</div>
                      <div className="t2">github.com/renneco27-crypto</div>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="ico">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-10 6L2 7" />
                      </svg>
                    </span>
                    <div>
                      <div className="t1">Facebook</div>
                      <div className="t2">facebook.com/Rennejay.Dev.21</div>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="ico">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </span>
                    <div>
                      <div className="t1">LinkedIn</div>
                      <div className="t2">linkedin.com/in/lawrence-cortes-788101408</div>
                    </div>
                  </div>
                </div>

                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-block" id="resumeBtn2" style={{ marginTop: "1.5rem" }}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 15V3m0 12-4-4m4 4 4-4" />
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  </svg>
                  Resume PDF
                </a>
              </div>

              <div className="card reveal">
                <h3 style={{ fontSize: "1.05rem", marginBottom: "1.3rem" }}>Send a message</h3>
               <form ref={formRef} onSubmit={handleSubmit} id="contactForm">
  <div className="field">
    <label htmlFor="cf-name">Your name</label>
    <input 
      id="cf-name" 
      name="name" 
      type="text" 
      placeholder="Jane Doe" 
      value={form.senderName}
      onChange={(e) => setForm({ ...form, senderName: e.target.value })}
      required 
    />
  </div>
  <div className="field">
    <label htmlFor="cf-email">Your email</label>
    <input 
      id="cf-email" 
      name="email" 
      type="email" 
      placeholder="jane@company.com" 
      value={form.senderEmail}
      onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
      required 
    />
  </div>
  <div className="field">
    <label htmlFor="cf-message">Message</label>
    <textarea
      id="cf-message"
      name="message"
      rows={4}
      placeholder="Tell me about the role or project…"
      value={form.messageBody}
      onChange={(e) => setForm({ ...form, messageBody: e.target.value })}
      required
    ></textarea>
  </div>
  <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
    {status === "sending" ? "Sending..." : "Send Message"}
  </button>
  {feedback.text && (
    <p style={{ marginTop: "0.5rem", color: feedback.type === "success" ? "#4ade80" : "#f87171" }}>
      {feedback.text}
    </p>
  )}
</form>
                <p className="form-note" id="formNote"></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-row">
          <p>
            © <span id="year"></span> Lawrence Cortes. Built with care, shipped from Ormoc City.
          </p>
          <div className="footer-links">
            <a
              href="https://github.com/renneco27-crypto"
              target="_blank"
              rel="noopener"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.02 3.26 9.28 7.79 10.78.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.17.69-3.84-1.36-3.84-1.36-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.39-1.25.71-1.54-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.18-3.06-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.06 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55A10.53 10.53 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/lawrence-cortes-788101408"
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://www.facebook.com/Rennejay.Dev.21" target="_blank" rel="noopener" aria-label="Facebook">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* CHAT WIDGET */}
      <div className="chat-dock">
        <div className={`poke ${pokeHidden ? "hidden" : ""}`} id="poke">
          Press me
          <button id="pokeClose" aria-label="Dismiss" onClick={(e) => { e.stopPropagation(); setPokeHidden(true); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={`chat-panel ${chatOpen ? "open" : ""}`} id="chatPanel">
          <div className="chat-panel-container">
            <div className="chat-header">
              <h4>Lawrence's AI Assistant 👋</h4>
            </div>
            
            <div className="chat-messages">
              {messages.map((m, idx) => (
                <div key={idx} className={`chat-message ${m.role}`}>
                  {m.content}
                </div>
              ))}
              {isTyping && (
                <div className="chat-typing">
                  AI is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {chatSleeping ? (
              <div 
                className="chat-status-sleep" 
                onClick={() => setChatSleeping(false)}
              >
                Chat disconnected due to inactivity. <span style={{ color: "var(--violet-400)", textDecoration: "underline", fontWeight: "600" }}>Click to reconnect</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="chat-form">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask me anything..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isTyping}
                />
                <button type="submit" className="chat-send-btn" disabled={isTyping || chatSleeping} aria-label="Send message">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1.1rem", height: "1.1rem" }}>
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>

        <button
          className="chat-fab"
          id="chatFab"
          aria-label="Open quick contact"
          aria-expanded={chatOpen}
          title="Press me"
          onClick={() => {
            setChatOpen(!chatOpen);
            setPokeHidden(true);
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
          <span className="online"></span>
        </button>
      </div>
    </>
  );
}