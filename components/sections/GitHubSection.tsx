"use client";
import { useEffect, useRef, useState } from "react";
import { GitFork } from "lucide-react";

const GITHUB_URL = "https://github.com/corteslawrence027-art/CORTES-Engineering-Portfolio";

const terminalLines = [
  { cmd: "$ whoami", out: "> lawrence cortes — software developer, cebu ph" },
  { cmd: "$ ls ./projects", out: "> brand-identity/   ai-chatbot/   tiktok-funnel/   security-ctf/" },
  { cmd: "$ cat README.md", out: "> Full-stack portfolio — Next.js, Tailwind, Vercel AI SDK\n> Brand systems from Photoshop · Security writeups from pwn.college" },
  { cmd: "$ open github", out: `> Opening CORTES Engineering Portfolio...\n> ${GITHUB_URL}` },
];

export default function GitHubSection() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCta, setShowCta] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const interval = window.setInterval(() => {
            i++;
            setVisibleLines(i);
            if (i >= terminalLines.length) {
              window.clearInterval(interval);
              window.setTimeout(() => setShowCta(true), 400);
            }
          }, 800);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="github" className="relative overflow-hidden border-t border-zinc-800/50 bg-zinc-950 px-6 py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_18%),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_100%,32px_32px,32px_32px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(9,9,11,0.9))]" />
      </div>

      <div className="relative mx-auto max-w-6xl flex flex-col items-center gap-10">
        <div className="text-center">
          <span className="inline-block rounded-full border border-violet-500/30 bg-zinc-900 px-4 py-1.5 font-mono text-xs text-violet-300 mb-4">
            $ git clone lawrence/portfolio
          </span>
          <h2 className="text-5xl font-bold text-white">Open Source</h2>
          <p className="text-emerald-400 font-mono mt-2">Real code. Real projects. No fluff.</p>
        </div>

        <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-zinc-700/50 shadow-2xl shadow-violet-950/30">
          <div className="flex items-center gap-2 bg-zinc-800 px-4 py-3 border-b border-zinc-700">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-3 font-mono text-xs text-zinc-500">lawrence@cortes: ~/portfolio</span>
          </div>

          <div className="bg-zinc-950 p-6 font-mono text-sm min-h-48 flex flex-col gap-3">
            {terminalLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-emerald-400">{line.cmd}</span>
                <span className="text-zinc-400 whitespace-pre-line pl-2">{line.out}</span>
              </div>
            ))}
            {visibleLines < terminalLines.length && (
              <span className="inline-block h-4 w-2 bg-emerald-400 animate-pulse" />
            )}
          </div>
        </div>

        {showCta && (
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3 text-sm font-mono text-white hover:bg-violet-500 transition-all duration-300 shadow-lg shadow-violet-600/30 animate-pulse-once"
          >
            <GitFork size={16} /> View on GitHub →
          </a>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {['4 repos', 'Next.js + React', 'Open to collab', 'Cebu, PH'].map((chip) => (
            <span key={chip} className="rounded-full border border-zinc-700/40 bg-zinc-900 px-4 py-1.5 font-mono text-xs text-zinc-400">
              {chip}
            </span>
          ))}
        </div>

        <div className="w-full overflow-hidden opacity-30">
          <p className="font-mono text-xs text-emerald-400 whitespace-nowrap animate-marquee">
            next.js · tailwind · photoshop · vercel ai sdk · neon postgres · tiktok pixel · framer motion · three.js · linux · python · react · typescript · next.js · tailwind · photoshop · vercel ai sdk · neon postgres ·
          </p>
        </div>
      </div>
    </section>
  );
}
