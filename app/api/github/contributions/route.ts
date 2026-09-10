import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "renneco27-crypto";

  try {
    // 1. If a GitHub Personal Access Token is available, attempt GraphQL query
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const gqlQuery = {
        query: `
          query($username: String!) {
            user(login: $username) {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                      contributionLevel
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { username },
      };

      const gqlRes = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "CORTES-Portfolio",
        },
        body: JSON.stringify(gqlQuery),
        next: { revalidate: 3600 },
      });

      if (gqlRes.ok) {
        const gqlData = await gqlRes.json();
        const calendar = gqlData?.data?.user?.contributionsCollection?.contributionCalendar;
        if (calendar) {
          const totalContributions = calendar.totalContributions;
          const contributions: ContributionDay[] = [];
          const weeks: number[][] = [];

          const levelMap: Record<string, number> = {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          };

          for (const week of calendar.weeks) {
            const weekDays: number[] = [];
            for (const day of week.contributionDays) {
              const lvl = levelMap[day.contributionLevel] ?? 0;
              weekDays.push(lvl);
              contributions.push({
                date: day.date,
                count: day.contributionCount,
                level: lvl,
              });
            }
            weeks.push(weekDays);
          }

          return NextResponse.json({
            success: true,
            source: "github-graphql",
            username,
            totalContributions,
            contributions,
            weeks,
          });
        }
      }
    }

    // 2. Fetch live data via reliable contributions API
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`Upstream returned ${res.status}`);
    }

    const data = await res.json();
    const rawContribs: ContributionDay[] = data.contributions || [];
    const totalContributions =
      typeof data.total === "object" && data.total !== null
        ? data.total.lastYear ?? data.total[new Date().getFullYear()] ?? rawContribs.reduce((acc, c) => acc + c.count, 0)
        : typeof data.total === "number"
        ? data.total
        : rawContribs.reduce((acc, c) => acc + c.count, 0);

    // Group into 52 weeks (7 days per week)
    const weeks: number[][] = [];
    let currentWeek: number[] = [];

    rawContribs.forEach((c, idx) => {
      currentWeek.push(c.level);
      if (currentWeek.length === 7 || idx === rawContribs.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return NextResponse.json({
      success: true,
      source: "github-contributions-api",
      username,
      totalContributions,
      contributions: rawContribs,
      weeks,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch GitHub contributions";
    console.error("Error in /api/github/contributions:", errMessage);

    return NextResponse.json(
      {
        success: false,
        error: errMessage,
        username,
        totalContributions: 842,
      },
      { status: 500 }
    );
  }
}
