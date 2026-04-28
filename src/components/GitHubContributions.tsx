import { useEffect, useRef, useState } from "react";
import { GitCommitHorizontal } from "lucide-react";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface Tooltip {
  date: string;
  count: number;
  x: number;
  y: number;
}

const USERNAME = "ssumai-kr";

const YEAR = new Date().getFullYear();
const FROM = `${YEAR}-01-01T00:00:00Z`;
const TO = `${YEAR}-12-31T23:59:59Z`;

const QUERY = `
query {
  user(login: "${USERNAME}") {
    contributionsCollection(from: "${FROM}", to: "${TO}") {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

function getColor(count: number): string {
  if (count === 0) return "hsl(var(--muted))";
  if (count < 4) return "#166534";
  if (count < 8) return "#15803d";
  if (count < 12) return "#16a34a";
  return "#22c55e";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default function GitHubContributions() {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      setError("VITE_GITHUB_TOKEN is not set");
      setLoading(false);
      return;
    }

    fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY }),
    })
      .then((res) => res.json())
      .then((data) => {
        const calendar =
          data.data.user.contributionsCollection.contributionCalendar;
        setWeeks(calendar.weeks);
        setTotal(calendar.totalContributions);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load contribution data");
        setLoading(false);
      });
  }, []);

  const CELL = 11;
  const GAP = 2;
  const STEP = CELL + GAP;
  const VB_W = 53 * STEP - GAP;
  const VB_H = 7 * STEP - GAP;

  function handleMouseMove(
    e: React.MouseEvent<SVGRectElement>,
    day: ContributionDay
  ) {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    setTooltip({
      date: day.date,
      count: day.contributionCount,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <div
      ref={wrapperRef}
      className="relative mt-4 rounded-xl border border-border bg-card p-4"
    >
      <h2 className="mb-3 flex items-center justify-between gap-2 text-base font-bold text-foreground">
        <span className="flex items-center gap-2">
          <GitCommitHorizontal className="h-4 w-4" />
          GitHub Contributions
        </span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
          {YEAR}
        </span>
      </h2>

      {loading && (
        <div className="flex h-24 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      )}

      {error && <p className="text-sm text-muted-foreground">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-3 text-xs text-muted-foreground">
            I made{" "}
            <span className="font-semibold text-foreground">{total} contributions</span>{" "}
            this year 🌱
          </p>
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width="100%"
            style={{ display: "block" }}
            onMouseLeave={() => setTooltip(null)}
          >
            {weeks.map((week, wi) =>
              week.contributionDays.map((day, di) => (
                <rect
                  key={day.date}
                  x={wi * STEP}
                  y={di * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={getColor(day.contributionCount)}
                  style={{ transition: "opacity 0.15s", cursor: "pointer" }}
                  onMouseMove={(e) => handleMouseMove(e, day)}
                  onMouseEnter={(e) =>
                    ((e.target as SVGRectElement).style.opacity = "0.75")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as SVGRectElement).style.opacity = "1")
                  }
                />
              ))
            )}
          </svg>
          <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
            <span>Less</span>
            {[0, 3, 7, 11, 15].map((n) => (
              <span
                key={n}
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  backgroundColor: getColor(n),
                  flexShrink: 0,
                }}
              />
            ))}
            <span>More</span>
          </div>
        </>
      )}

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 36,
            whiteSpace: "nowrap",
          }}
        >
          <span className="font-semibold">{formatDate(tooltip.date)}</span>
          <span className="ml-2 text-muted-foreground">
            {tooltip.count > 0 ? `${tooltip.count} contribution${tooltip.count !== 1 ? "s" : ""}` : "No contributions"}
          </span>
        </div>
      )}
    </div>
  );
}
