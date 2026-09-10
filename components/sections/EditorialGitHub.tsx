"use client";

import React, { useEffect, useState } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface WeekDay {
  date: string;
  count: number;
  level: number;
}

export default function EditorialGitHub({ username = "renneco27-crypto" }: { username?: string }) {
  const [weeks, setWeeks] = useState<WeekDay[][]>([]);
  const [totalCommits, setTotalCommits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthLabels, setMonthLabels] = useState<{ index: number; text: string }[]>([]);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLiveContributions() {
      try {
        setLoading(true);
        // Try local Next.js API first
        let data: { totalContributions: number; contributions: ContributionDay[] } | null = null;

        try {
          const res = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`);
          if (res.ok) {
            data = await res.json();
          }
        } catch {
          // Fall through to direct fetch
        }

        // If local API failed, fetch directly from upstream
        if (!data || !data.contributions || data.contributions.length === 0) {
          const directRes = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
          );
          if (directRes.ok) {
            const directJson = await directRes.json();
            const rawContribs = directJson.contributions || [];
            const total =
              typeof directJson.total === "object" && directJson.total !== null
                ? directJson.total.lastYear ?? directJson.total[new Date().getFullYear()] ?? rawContribs.reduce((acc: number, c: ContributionDay) => acc + c.count, 0)
                : typeof directJson.total === "number"
                ? directJson.total
                : rawContribs.reduce((acc: number, c: ContributionDay) => acc + c.count, 0);

            data = {
              totalContributions: total,
              contributions: rawContribs,
            };
          }
        }

        if (cancelled || !data || !data.contributions) return;

        setTotalCommits(data.totalContributions);

        // Build 52-week calendar matrix
        const byDate: Record<string, ContributionDay> = {};
        data.contributions.forEach((c) => {
          byDate[c.date] = c;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // End on upcoming/most recent Saturday
        const end = new Date(today);
        end.setDate(end.getDate() + (6 - end.getDay()));

        // Start 52 weeks back, aligned to Sunday
        const start = new Date(end);
        start.setDate(start.getDate() - 7 * 52 - 6);
        start.setDate(start.getDate() - start.getDay());

        const builtWeeks: WeekDay[][] = [];
        let cursor = new Date(start);
        let currentWeek: WeekDay[] = [];

        while (cursor <= today || currentWeek.length > 0) {
          const iso = cursor.toISOString().slice(0, 10);
          const entry = byDate[iso];
          currentWeek.push({
            date: iso,
            count: entry ? entry.count : 0,
            level: entry ? entry.level : 0,
          });

          if (cursor.getDay() === 6 || cursor > today) {
            builtWeeks.push(currentWeek);
            currentWeek = [];
            if (cursor > today) break;
          }
          cursor.setDate(cursor.getDate() + 1);
        }

        setWeeks(builtWeeks);

        // Compute month labels
        const labels: { index: number; text: string }[] = [];
        let lastMonth = -1;
        builtWeeks.forEach((week, i) => {
          if (week[0]) {
            const d = new Date(week[0].date + "T00:00:00");
            const m = d.getMonth();
            if (m !== lastMonth) {
              labels.push({
                index: i,
                text: d.toLocaleDateString(undefined, { month: "short" }),
              });
              lastMonth = m;
            }
          }
        });
        setMonthLabels(labels);
      } catch (err) {
        console.error("Failed to load live GitHub contributions:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLiveContributions();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return "#161b22"; // Empty
      case 1:
        return "#0e4429"; // Low
      case 2:
        return "#006d32"; // Med
      case 3:
        return "#26a641"; // High
      default:
        return "#39d353"; // Max
    }
  };

  const techStack = [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "PostgreSQL",
    "Redis",
    "Vercel AI SDK",
    "Python",
    "Docker",
    "Node.js",
    "Figma",
    "Three.js",
    "React Native",
    "Firebase",
    "GraphQL",
    "WebSockets",
  ];

  return (
    <section className="w-full bg-[#050505]/75 backdrop-blur-sm pt-12 pb-24 border-t border-[#1a1a1a] select-none overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* GitHub Graph Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
          <div>
            <div className="font-mono text-xs tracking-widest text-[#888] uppercase mb-1">
              [ PROOF OF WORK ]
            </div>
            <h2 className="text-xl md:text-2xl font-light text-white tracking-tight">
              GITHUB DEVELOPMENT ACTIVITY
            </h2>
          </div>
          <div className="font-mono text-[0.7rem] text-[#666] uppercase mt-2 md:mt-0">
            {loading ? (
              <span className="animate-pulse">FETCHING LIVE CONTRIBUTIONS…</span>
            ) : (
              <span>{totalCommits ?? 842} COMMITS IN THE LAST YEAR</span>
            )}
          </div>
        </div>

        {/* GitHub Graph Container */}
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
          <div className="min-w-[720px] bg-[#090909] border border-[#222] rounded-[2px] p-6 inline-block">
            {/* Month Labels */}
            <div className="flex text-[0.65rem] font-mono text-[#555] ml-[32px] mb-2">
              {monthLabels.map((m, idx) => {
                const nextIdx = idx < monthLabels.length - 1 ? monthLabels[idx + 1].index : weeks.length;
                const numWeeks = Math.max(nextIdx - m.index, 1);
                const width = numWeeks * 14;
                return (
                  <span key={m.index} style={{ width: `${width}px` }} className="truncate">
                    {m.text}
                  </span>
                );
              })}
            </div>

            <div className="flex gap-2">
              {/* Day of week labels */}
              <div className="flex flex-col justify-between font-mono text-[0.65rem] text-[#555] pr-2 pt-1 h-[88px]">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Day Grid */}
              <div className="flex gap-[3px]">
                {weeks.length > 0
                  ? weeks.map((week, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-[3px]">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            className="w-[11px] h-[11px] rounded-[2px] outline outline-1 outline-[rgba(255,255,255,0.04)] cursor-pointer hover:outline-white/40 transition-transform duration-100 hover:scale-125"
                            style={{ backgroundColor: getColor(day.level) }}
                            onMouseMove={(e) =>
                              setTooltip({
                                text: `${day.count} contribution${day.count === 1 ? "" : "s"} on ${new Date(
                                  day.date + "T00:00:00"
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}`,
                                x: e.clientX + 12,
                                y: e.clientY + 12,
                              })
                            }
                            onMouseLeave={() => setTooltip(null)}
                          />
                        ))}
                      </div>
                    ))
                  : Array.from({ length: 52 }).map((_, wIdx) => (
                      <div key={wIdx} className="flex flex-col gap-[3px] animate-pulse">
                        {Array.from({ length: 7 }).map((__, dIdx) => (
                          <div
                            key={dIdx}
                            className="w-[11px] h-[11px] rounded-[2px] bg-[#161b22] outline outline-1 outline-[rgba(255,255,255,0.04)]"
                          />
                        ))}
                      </div>
                    ))}
              </div>
            </div>

            {/* Footer / Legend */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#1a1a1a] font-mono text-[0.68rem] text-[#555]">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#888] hover:text-white transition-colors"
              >
                @renneco27-crypto on GitHub
              </a>
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <div className="w-[10px] h-[10px] rounded-[1px] bg-[#161b22]"></div>
                <div className="w-[10px] h-[10px] rounded-[1px] bg-[#0e4429]"></div>
                <div className="w-[10px] h-[10px] rounded-[1px] bg-[#006d32]"></div>
                <div className="w-[10px] h-[10px] rounded-[1px] bg-[#26a641]"></div>
                <div className="w-[10px] h-[10px] rounded-[1px] bg-[#39d353]"></div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            pointerEvents: "none",
            zIndex: 999999,
          }}
          className="bg-[#18181b] border border-[#333] text-white text-xs font-mono px-2.5 py-1.5 rounded shadow-xl whitespace-nowrap"
        >
          {tooltip.text}
        </div>
      )}

      {/* Thin Monochrome Tech Stack Marquee */}
      <div className="w-full border-y border-[#1a1a1a] bg-[#080808] py-3 mt-16 overflow-hidden flex whitespace-nowrap relative">
        <div className="animate-marquee flex gap-8 items-center font-mono text-[0.75rem] text-[#666] uppercase tracking-widest">
          {[...techStack, ...techStack, ...techStack].map((tech, i) => (
            <React.Fragment key={i}>
              <span>{tech}</span>
              <span className="text-[#333]">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
