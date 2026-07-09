"use client";

const ROW1 = [
  { label: "HTML", color: "#e34c26" },
  { label: "CSS", color: "#264de4" },
  { label: "JavaScript", color: "#f7df1e" },
  { label: "TypeScript", color: "#3178c6" },
  { label: "React", color: "#61dafb" },
  { label: "Next.js", color: "#ffffff" },
  { label: "Node.js", color: "#3c873a" },
  { label: "C#", color: "#9b4f96" },
  { label: "Go", color: "#00add8" },
  { label: "Rust", color: "#dea584" },
];

const ROW2 = [
  { label: "MongoDB", color: "#47a248" },
  { label: "Git", color: "#f05032" },
  { label: "Docker", color: "#2496ed" },
  { label: "REST APIs", color: "#ff6c37" },
  { label: "Java", color: "#ed8b00" },
  { label: "Spring Boot", color: "#6db33f" },
  { label: "Maven/Gradle", color: "#02303a" },
  { label: "Python", color: "#3776ab" },
  { label: "Azure", color: "#0078d4" },
  { label: "Google Cloud", color: "#4285f4" },
  { label: "C++", color: "#00599c" },
  { label: "Kotlin", color: "#7f52ff" },
  { label: "PostgreSQL", color: "#336791" },
];

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "7px 14px",
        borderRadius: 9999,
        border: "0.5px solid rgba(147,51,234,0.3)",
        background: "rgba(30,20,50,0.85)",
        fontSize: 13,
        fontWeight: 500,
        color: "#e2e8f0",
        whiteSpace: "nowrap",
        cursor: "default",
        userSelect: "none",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(147,51,234,0.7)";
        (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(147,51,234,0.3)";
        (e.currentTarget as HTMLElement).style.background = "rgba(30,20,50,0.85)";
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

export default function TechStackMarquee() {
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <style>{`
        .marquee-wrap { overflow: hidden; padding: 1.5rem 0; position: relative; }
        .marquee-wrap::before, .marquee-wrap::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2; pointer-events: none;
        }
        .marquee-wrap::before { left: 0; background: linear-gradient(to right, var(--bg,#0a0a0f), transparent); }
        .marquee-wrap::after { right: 0; background: linear-gradient(to left, var(--bg,#0a0a0f), transparent); }
        .marquee-track { display: flex; gap: 10px; width: max-content; animation: marquee-scroll 22s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .marquee-track2 { animation-duration: 28s; animation-direction: reverse; margin-top: 10px; }
        @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...ROW1, ...ROW1].map((t, i) => <Tag key={i} label={t.label} color={t.color} />)}
        </div>
        <div className="marquee-track marquee-track2">
          {[...ROW2, ...ROW2].map((t, i) => <Tag key={i} label={t.label} color={t.color} />)}
        </div>
      </div>
    </div>
  );
}
