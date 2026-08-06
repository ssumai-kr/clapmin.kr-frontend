import { useEffect, useState } from "react";

interface Day { date: string; contributionCount: number }
interface Week { contributionDays: Day[] }

const USERNAME = "ssumai-kr";
const YEAR = new Date().getFullYear();
const QUERY = `query { user(login: "${USERNAME}") { contributionsCollection(from: "${YEAR}-01-01T00:00:00Z", to: "${YEAR}-12-31T23:59:59Z") { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`;

/** Monochrome contribution grid — same GitHub GraphQL source as the old widget. */
function shade(n: number) {
  if (n === 0) return "rgba(255,255,255,0.07)";
  if (n < 3) return "rgba(255,255,255,0.22)";
  if (n < 7) return "rgba(255,255,255,0.45)";
  if (n < 11) return "rgba(255,255,255,0.72)";
  return "#FFFFFF";
}

export default function Activity() {
  const [days, setDays] = useState<Day[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) return;
    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY }),
    })
      .then((r) => r.json())
      .then((d) => {
        const cal = d.data.user.contributionsCollection.contributionCalendar;
        setDays(cal.weeks.flatMap((w: Week) => w.contributionDays));
        setTotal(cal.totalContributions);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Activity</h2>
      <div className="rounded-2xl border border-white/[0.06] bg-[#2B2B2B] p-4">
        <div
          className="grid grid-flow-col justify-between gap-[2.5px]"
          style={{ gridTemplateRows: "repeat(7, 8px)" }}
        >
          {days.map((d) => (
            <div
              key={d.date}
              title={`${d.date} · ${d.contributionCount}`}
              className="h-2 w-2 rounded-[2px]"
              style={{ background: shade(d.contributionCount) }}
            />
          ))}
        </div>
        <div className="mt-3.5 flex items-center justify-between text-[11.5px] text-white/35">
          <span>{total} contributions</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            {[0, 2, 6, 10, 14].map((n) => (
              <span key={n} className="inline-block h-2 w-2 rounded-[2px]" style={{ background: shade(n) }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
