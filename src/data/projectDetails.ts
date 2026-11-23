/**
 * 프로젝트 클릭 시 열리는 팝업에 들어가는 구현 내용 상세.
 *
 * 출처는 이력서(경험 기록)와 `api/persona.ts` 의 프로젝트 섹션이며, 두 곳의
 * 숫자·기간·상태 표기를 그대로 옮긴다. 과장하지 않는 것이 규칙이므로
 * 미완성·운영 중단 같은 상태는 `status` 에 명시한다.
 *
 * 프로젝트 목록은 `/api/projects` 에서 오고 id 가 고정이 아니기 때문에,
 * 매칭은 title 을 정규화한 문자열(`aliases`)로 한다.
 */

export interface DetailSection {
  heading: string;
  items: string[];
}

export interface ProjectDetail {
  /** 목록의 title 과 비교할 후보들. 대소문자·공백·기호는 무시된다. */
  aliases: string[];
  /** 팝업 상단 한 문단 요약. */
  summary: string;
  period: string;
  role: string;
  team?: string;
  /** 상태를 그대로 적는 칸 (미완성, 운영 중단 등). 없으면 표시하지 않는다. */
  status?: string;
  /** 기여 규모 — PR·커밋·라인·사용자 수처럼 검증된 숫자만. */
  scale?: string[];
  stack: string[];
  sections: DetailSection[];
}

export const projectDetails: ProjectDetail[] = [
  {
    aliases: ["SSUPORT", "SSUport", "숭실대학교 특별장학금 통합 서비스"],
    summary:
      "Soongsil University's integrated special-scholarship service — a wizard students apply through, and a grading app the committee screens with. My biggest project, and the one I lead the frontend of.",
    period: "Jan 2026 – ongoing",
    role: "Frontend Lead — application flow, university SSO, CI/CD, code quality",
    team: "6 frontend developers, plus backend, PM and designer",
    scale: [
      "43 merged PRs (40 excluding release PRs), +20,753 / −8,401 lines, 50 issues opened",
      "575 students applied in the pilot; 2,100 applications in the first official round",
      "Piloted 2026-04-19 with one scholarship type, expanded to four in Sep 2026",
    ],
    stack: [
      "React 18",
      "TypeScript",
      "Vite",
      "Emotion",
      "TanStack Query v5",
      "Zustand",
      "React Hook Form",
      "Feature-Sliced Design",
      "pnpm + Turborepo",
      "AWS S3 + CloudFront",
      "GitHub Actions",
      "Mixpanel",
    ],
    sections: [
      {
        heading: "Application flow",
        items: [
          "Four scholarship types × a 5-step wizard in a single flow, each with different input fields, required documents and validation rules.",
          "The current step lives in the URL, so back/forward and refresh survive instead of dropping the applicant at step 1.",
          "An isStepAccessible guard blocks skipping ahead by editing the URL — the step is user-editable input, not trusted state.",
        ],
      },
      {
        heading: "Extensibility",
        items: [
          "A registry table keyed by scholarship ID, so adding a scholarship type is a config change rather than another branch in the flow.",
          "Label ↔ server-code maps are generated from that same table, so the two can't drift apart.",
          "A reverse parser plus round-trip validation protects answers that were already saved.",
        ],
      },
      {
        heading: "Auth & SSO",
        items: [
          "Migrated the university SSO to a v2 flow: a one-time ticket exchange and a top-level navigation, instead of carrying tokens in the URL.",
          "Worked with the SSO team on storing terms-of-service consent and requiring re-consent after a revision.",
        ],
      },
      {
        heading: "Security",
        items: [
          "Found that the form was chosen from an unvalidated URL parameter, so an edited URL could open the wrong scholarship form for my own application, and fixed it by validating the parameter.",
          "The server verified ownership throughout, so no one could ever reach another student's application.",
        ],
      },
      {
        heading: "Reliability",
        items: [
          "Resolved a production outage where returning users got a 405 on SSO login because a stale, uncached index.html was still being served — fixed the cache policy and the deploy upload order (assets long-cached, index.html no-cache and uploaded last).",
          "Traced an outage that blocked all new sign-ups back to my own change and recovered it the same day.",
          "Caught a silent bug that sent decimal working hours to the server 10× too large. It raised no error, but it could have affected scholarship screening — the errors that quietly produce wrong values are the dangerous kind.",
        ],
      },
      {
        heading: "Performance",
        items: [
          "Cut application images from 13.3MB to 2.0MB (85%) with client-side compression.",
          "Audited all 179 components before applying useMemo / React.memo to only 8 places.",
          "Added a 3-layer cache (memory, localStorage, network) so the public-holiday API is called once per year per browser.",
        ],
      },
      {
        heading: "CI/CD & observability",
        items: [
          "Rebuilt the pipeline to detect changes and build/deploy only the affected apps, in parallel.",
          "Moved hosting to AWS S3 + CloudFront with OIDC credentials, so there are no long-lived keys.",
          "Upload failures are logged with status code, server and S3 error codes plus client diagnostics, so a failure can be traced by cause.",
          "Proposed fixing A/B test groups per account instead of per scholarship, and added a CES survey on the completion screen.",
        ],
      },
    ],
  },
  {
    aliases: [
      "Soongsil University Student Council",
      "숭실대학교 총학생회 홈페이지",
      "SSU Student Council",
    ],
    summary:
      "The official website of the Soongsil University Student Council — a service handed down across committee generations, used by 2,500+ registered students.",
    period: "Oct 2024 – ongoing",
    role: "Frontend Engineer — notice boards, unified search, operations",
    scale: ["14 merged PRs", "2,500+ registered students"],
    stack: [
      "React 18",
      "TypeScript",
      "Vite",
      "TailwindCSS",
      "Radix UI",
      "TanStack Query",
      "React Hook Form + Zod",
      "Jotai",
      "react-i18next",
    ],
    sections: [
      {
        heading: "What I built",
        items: [
          "The notice boards end to end — list, detail, write and edit, plus all of their APIs.",
          "A unified search across 4 boards, and ongoing operational fixes on the archive board.",
        ],
      },
      {
        heading: "Search",
        items: [
          "Chose per-board parallel requests over a dedicated search endpoint, based on measurements rather than assumption.",
          "Each section paginates independently, so one board's result count doesn't distort the others.",
          "Fixed a double-encoding bug that broke search for queries with non-ASCII characters.",
        ],
      },
      {
        heading: "Maintenance",
        items: [
          "Merged the separate write and edit routes into one, so the form has a single source of truth.",
          "Moved hardcoded board categories to a dynamic API, so the next committee can change them without a deploy.",
        ],
      },
      {
        heading: "Performance",
        items: [
          "Client-side image compression with WebP conversion cut upload time by about 80% (8s → 1.5s).",
        ],
      },
    ],
  },
  {
    aliases: ["SaintBridge", "숭실대학교 학사 서비스 통합 오픈소스 라이브러리"],
    summary:
      "A local-first TypeScript SDK meant to let student developers reach u-SAINT (the SAP Web Dynpro academic system), the LMS and the central library through one type-safe API.",
    period: "Aug 2026 – ongoing",
    role: "Solo project",
    status:
      "Pre-v0.1. The authentication layer and the HTTP transport layer are built; it cannot yet log into the school services or fetch academic data. Unofficial, not affiliated with the university, and read-only by design.",
    scale: [
      "~5,300 lines of source and ~6,000 lines of tests",
      "284 tests across 33 files, all runnable without a real account",
    ],
    stack: [
      "TypeScript (strict)",
      "Node.js ESM",
      "pnpm workspace",
      "Zod",
      "Vitest",
      "Playwright",
      "GitHub Actions",
    ],
    sections: [
      {
        heading: "Why this build order",
        items: [
          "Sending wrong requests to the school can get an account locked, so the transport layer — nothing leaks to the wrong host — and the credential boundary came before any real endpoint.",
        ],
      },
      {
        heading: "Session design",
        items: [
          "SSO-derived service sessions are managed by a state machine plus transactional binding, so one service failing can't corrupt another service's session.",
        ],
      },
      {
        heading: "Safety boundaries",
        items: [
          "HTTPS with a host allowlist, manual redirect handling and isolated cookie jars.",
          "Credentials are held in one-time containers that can't reach logs or serialization.",
          "The EUC-KR decoder fails instead of guessing, because a silently mis-decoded name is worse than an error.",
        ],
      },
      {
        heading: "Tooling",
        items: [
          "TypeScript strict with noUncheckedIndexedAccess and exactOptionalPropertyTypes.",
          "A script enforces the dependency direction in CI — rules should be enforced by tooling, not by documents.",
        ],
      },
    ],
  },
  {
    aliases: ["ssakssakfood", "싹싹푸드", "ssakssak food"],
    summary:
      "A location-based food-rescue mobile web app: neighbourhood shops list near-expiry food at a discount or give it away, and residents reserve and pick it up. Its core feature was letting children with a meal card receive shared food for 0 won.",
    period: "Oct 2025 – Nov 2025 (about 5 weeks)",
    role: "Frontend — setup, auth, reservation & payment, shop management, deploy",
    team: "2 frontend developers; I wrote 123 of the 332 commits",
    scale: ["Chairman's Award, K-PaaS contest (Dec 2025)"],
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS v4",
      "React Query",
      "Zustand",
      "React Router v7",
      "PortOne",
      "Kakao Local API",
      "Vercel",
    ],
    sections: [
      {
        heading: "Routing for two roles",
        items: [
          "Consumers and shop owners share the same URLs, so screens branch on the account's memberType instead of maintaining two routing trees.",
          "The AuthGuard is applied as a higher-order function at router definition time, so a new route can't be added without one.",
        ],
      },
      {
        heading: "Reservation & payment",
        items: [
          "A two-stage flow: reservation first, then the PortOne payment.",
          "Fixed 0-won meal-card orders being blocked at the payment sheet — the case the whole feature existed for.",
        ],
      },
      {
        heading: "Operations",
        items: [
          "Traced a production API failure to the evaluation order of the rewrite rules.",
        ],
      },
    ],
  },
  {
    aliases: ["grabPT", "grab PT"],
    summary:
      "A matching platform between personal-training clients and trainers, built in the university IT club UMC. I ran it as PM and worked on the frontend.",
    period: "Jun 2025 – Jan 2026",
    role: "PM and Frontend Engineer — my-page & profile domain, trainer search, CI/CD, review",
    team: "3 frontend, 3 backend; the team kept building after the official UMC term ended in Aug 2025",
    status:
      "Not currently deployed — the service is taken down, so there is no live link.",
    scale: ["~200 commits, 18 PRs (+8,071 / −3,258)", "Code review on 26 PRs"],
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS 4",
      "TanStack Query v5",
      "Zustand",
      "React Hook Form + Zod",
      "Vercel",
      "GitHub Actions",
    ],
    sections: [
      {
        heading: "As PM",
        items: [
          "Wrote the feature specs, set priorities and ran the sprints.",
          "Set the team rules for branches, commits and code review, with a CI gate: git-flow plus ESLint / Prettier / TypeScript on every PR.",
        ],
      },
      {
        heading: "Profile domain",
        items: [
          "Unified the split user/trainer profile editing onto one API, with separate view and edit modes instead of two near-duplicate screens.",
        ],
      },
      {
        heading: "Location search",
        items: [
          "A useGeolocation hook that handles all three failure paths — unsupported, permission denied, conversion failure — with Kakao Local reverse geocoding.",
        ],
      },
      {
        heading: "Resilience & caching",
        items: [
          "A wrapper that recovers from lazy-chunk load failures after a deploy, applied to all 23 lazily loaded pages.",
          "Found a query-key collision where the request-form ID was missing from the key, so different forms were sharing one cache entry.",
        ],
      },
    ],
  },
  {
    aliases: ["Finance Simulator", "금융 시뮬레이션 서비스"],
    summary:
      "A turn-based personal-finance simulation. I worked on the backend — the trading APIs behind the simulation.",
    period: "Jul 2026 – Aug 2026",
    role: "Backend Developer",
    stack: ["Python", "FastAPI", "SQLAlchemy", "MySQL"],
    sections: [
      {
        heading: "What I built",
        items: [
          "The REST APIs for stock buy/sell and holdings, with the trading rules and response shapes documented.",
        ],
      },
      {
        heading: "Concurrency",
        items: [
          "Found that near-simultaneous buy/sell requests from the same user had no lock between the read and the write, which could drive a balance negative or oversell a holding.",
          "Fixed it with row-level locks (SELECT … FOR UPDATE) and a consistent lock order, and added regression tests for the race.",
        ],
      },
    ],
  },
];

/** 비교용 키 — 대소문자·공백·기호를 지운다. */
function normalize(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

const byAlias = new Map<string, ProjectDetail>();
for (const detail of projectDetails) {
  for (const alias of detail.aliases) byAlias.set(normalize(alias), detail);
}

/** 목록 title 에 해당하는 상세. 없으면 undefined (팝업 없이 기존 링크 동작). */
export function findProjectDetail(title: string): ProjectDetail | undefined {
  return byAlias.get(normalize(title));
}
