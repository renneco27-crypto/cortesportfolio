"use client";
import { useEffect, useRef, useState } from "react";

const REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const CACHE_KEY_PREFIX = "gh_contrib_cache_";

function levelForCount(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function buildWeeks(contributions: { date: string; count: number }[]) {
  const byDate: Record<string, { date: string; count: number }> = {};
  contributions.forEach((c) => { byDate[c.date] = c; });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));

  const start = new Date(end);
  start.setDate(start.getDate() - 7 * 52 - 6);
  start.setDate(start.getDate() - start.getDay());

  const weeks: { date: string; count: number }[][] = [];
  let cursor = new Date(start);
  let currentWeek: { date: string; count: number }[] = [];

  while (cursor <= today) {
    const iso = cursor.toISOString().slice(0, 10);
    const entry = byDate[iso];
    currentWeek.push({ date: iso, count: entry ? entry.count : 0 });
    if (cursor.getDay() === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (currentWeek.length) weeks.push(currentWeek);
  return weeks;
}

function monthLabelsForWeeks(weeks: { date: string }[][]) {
  const labels: { index: number; text: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const d = new Date(week[0].date + "T00:00:00");
    const m = d.getMonth();
    if (m !== lastMonth) {
      labels.push({
        index: i,
        text: d.toLocaleDateString(undefined, { month: "short" }),
      });
      lastMonth = m;
    }
  });
  return labels;
}

export default function GitHubGraph({ username = "renneco27-crypto" }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const updatedTextRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("Loading contribution data…");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!contentRef.current || !footerRef.current || !updatedTextRef.current) return;

      const cacheKey = CACHE_KEY_PREFIX + username.toLowerCase();
      const cached = localStorage.getItem(cacheKey);
      let data: any = null;
      let fromCache = false;
      let fetchedAt = Date.now();

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const age = Date.now() - parsed.fetchedAt;
          if (age < REFRESH_INTERVAL_MS) {
            data = parsed.data;
            fromCache = true;
            fetchedAt = parsed.fetchedAt;
          }
        } catch (_) {}
      }

      if (!data) {
        try {
          const res = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
          );
          if (!res.ok) throw new Error(`Could not load data (status ${res.status})`);
          data = await res.json();
          if (!data || !data.contributions) throw new Error("Unexpected response format");
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data, fetchedAt: Date.now() })
          );
          fetchedAt = Date.now();
        } catch (err: any) {
          if (!cancelled) setStatus(err.message);
          return;
        }
      }

      if (cancelled || !contentRef.current) return;

      const weeks = buildWeeks(data.contributions);
      const months = monthLabelsForWeeks(weeks);
      const totalCount = data.contributions.reduce(
        (sum: number, c: any) => sum + c.count,
        0
      );
      setTotal(totalCount);

      const levelColors = [
        "var(--l0, #161b22)",
        "var(--l1, #0e4429)",
        "var(--l2, #006d32)",
        "var(--l3, #26a641)",
        "var(--l4, #39d353)",
      ];

      let monthsHtml = "";
      weeks.forEach((_, i) => {
        const label = months.find((m) => m.index === i);
        monthsHtml += `<span style="width:14px;flex-shrink:0;font-size:11px;color:var(--muted,#8b949e);">${label ? label.text : ""}</span>`;
      });

      let weeksHtml = "";
      weeks.forEach((week) => {
        let daysHtml = "";
        week.forEach((day) => {
          const level = levelForCount(day.count);
          daysHtml += `<div class="gh-day" style="width:11px;height:11px;border-radius:2px;background:${levelColors[level]};outline:1px solid rgba(255,255,255,0.04);flex-shrink:0;" data-date="${day.date}" data-count="${day.count}"></div>`;
        });
        weeksHtml += `<div style="display:flex;flex-direction:column;gap:3px;">${daysHtml}</div>`;
      });

      contentRef.current.innerHTML = `
        <div style="overflow-x:auto;">
          <div style="display:flex;font-size:11px;color:var(--muted,#8b949e);margin-left:30px;margin-bottom:4px;">${monthsHtml}</div>
          <div style="display:flex;">
            <div style="display:flex;flex-direction:column;justify-content:space-between;font-size:11px;color:var(--muted,#8b949e);width:26px;padding-right:4px;padding-top:14px;">
              <span>Mon</span><span>Wed</span><span>Fri</span>
            </div>
            <div style="display:flex;gap:3px;">${weeksHtml}</div>
          </div>
        </div>
      `;

      footerRef.current.style.display = "flex";
      const ts = new Date(fetchedAt);
      updatedTextRef.current.textContent = `Updated ${ts.toLocaleString()}${fromCache ? " (cached)" : " (live)"}`;
      setStatus("");

      contentRef.current.querySelectorAll(".gh-day").forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const date = (el as HTMLElement).getAttribute("data-date");
          const count = (el as HTMLElement).getAttribute("data-count");
          if (tooltipRef.current) {
            tooltipRef.current.textContent = `${count} contribution${count === "1" ? "" : "s"} on ${new Date(date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
            tooltipRef.current.style.left = (e as MouseEvent).clientX + 12 + "px";
            tooltipRef.current.style.top = (e as MouseEvent).clientY + 12 + "px";
            tooltipRef.current.style.opacity = "1";
          }
        });
        el.addEventListener("mouseleave", () => {
          if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
        });
      });
    }

    load();
    return () => { cancelled = true; };
  }, [username]);

  return (
    <div
      className="github-graph"
      style={{
        background: "var(--card, #161b22)",
        border: "1px solid var(--border, #30363d)",
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text, #c9d1d9)" }}>
          GitHub contributions
        </h3>
        <span style={{ fontSize: 11, color: "var(--muted, #8b949e)" }}>
          {username}
        </span>
      </div>

      <div ref={contentRef}>
        {status && (
          <div
            style={{
              fontSize: 13,
              color: status.includes("error") || status.includes("Could") || status.includes("Unexpected")
                ? "#f85149"
                : "var(--muted, #8b949e)",
              padding: "20px 0",
              textAlign: "center",
            }}
          >
            {status}
          </div>
        )}
      </div>

      <div
        ref={footerRef}
        style={{
          display: "none",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          fontSize: 11,
          color: "var(--muted, #8b949e)",
        }}
      >
        <span ref={updatedTextRef}></span>
        {total > 0 && (
          <span>{total} contributions in the last year</span>
        )}
      </div>

      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          background: "#1c2128",
          border: "1px solid var(--border, #30363d)",
          color: "var(--text, #c9d1d9)",
          fontSize: 12,
          padding: "6px 8px",
          borderRadius: 6,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.1s",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      />
    </div>
  );
}
