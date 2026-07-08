"use client";
import { useEffect, useState } from "react";

const REFRESH_INTERVAL_MS = 60 * 60 * 1000;
const CACHE_KEY_PREFIX = "gh_contrib_cache_";

interface DayData {
  date: string;
  count: number;
}

interface WeekData extends Array<DayData> {}

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

  const weeks: WeekData[] = [];
  let cursor = new Date(start);
  let currentWeek: DayData[] = [];

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

function monthLabelsForWeeks(weeks: WeekData[]) {
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

const LEVEL_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const MUTED = "#8b949e";
const TEXT = "#c9d1d9";

export default function GitHubGraph({ username = "renneco27-crypto" }) {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("Loading contribution data…");
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cacheKey = CACHE_KEY_PREFIX + username.toLowerCase();
      const cached = localStorage.getItem(cacheKey);
      let data: any = null;
      let fc = false;
      let fa = Date.now();

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const age = Date.now() - parsed.fetchedAt;
          if (age < REFRESH_INTERVAL_MS) {
            data = parsed.data;
            fc = true;
            fa = parsed.fetchedAt;
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
          localStorage.setItem(cacheKey, JSON.stringify({ data, fetchedAt: Date.now() }));
          fa = Date.now();
        } catch (err: any) {
          if (!cancelled) setStatus(err.message);
          return;
        }
      }

      if (cancelled) return;

      const w = buildWeeks(data.contributions);
      const tc = data.contributions.reduce((sum: number, c: any) => sum + c.count, 0);

      setWeeks(w);
      setTotal(tc);
      setFetchedAt(fa);
      setFromCache(fc);
      setStatus("");
    }

    load();
    return () => { cancelled = true; };
  }, [username]);

  const months = weeks.length > 0 ? monthLabelsForWeeks(weeks) : [];

  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #30363d",
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
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: TEXT }}>
          GitHub contributions
        </h3>
        <span style={{ fontSize: 11, color: MUTED }}>{username}</span>
      </div>

      {status ? (
        <div
          style={{
            fontSize: 13,
            color: status.includes("error") || status.includes("Could") || status.includes("Unexpected")
              ? "#f85149" : MUTED,
            padding: "20px 0",
            textAlign: "center",
          }}
        >
          {status}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", fontSize: 11, color: MUTED, marginLeft: 30, marginBottom: 4 }}>
            {months.map((m) => (
              <span key={m.index} style={{ width: 14, flexShrink: 0 }}>{m.text}</span>
            ))}
          </div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                fontSize: 11,
                color: MUTED,
                width: 26,
                paddingRight: 4,
                paddingTop: 14,
              }}
            >
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {week.map((day) => {
                    const level = levelForCount(day.count);
                    return (
                      <div
                        key={day.date}
                        onMouseMove={(e) =>
                          setTooltip({
                            text: `${day.count} contribution${day.count === 1 ? "" : "s"} on ${new Date(day.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`,
                            x: e.clientX + 12,
                            y: e.clientY + 12,
                          })
                        }
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          width: 11,
                          height: 11,
                          borderRadius: 2,
                          background: LEVEL_COLORS[level],
                          outline: "1px solid rgba(255,255,255,0.04)",
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          fontSize: 11,
          color: MUTED,
        }}
      >
        <span>
          {fetchedAt
            ? `Updated ${new Date(fetchedAt).toLocaleString()}${fromCache ? " (cached)" : " (live)"}`
            : ""}
        </span>
        {total > 0 && <span>{total} contributions in the last year</span>}
      </div>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            background: "#1c2128",
            border: "1px solid #30363d",
            color: TEXT,
            fontSize: 12,
            padding: "6px 8px",
            borderRadius: 6,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
