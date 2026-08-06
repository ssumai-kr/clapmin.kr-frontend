# 나만의 LLM 어시스턴트 — 구현 계획

> 하단 `AskDock` 대화창을 키워드 기반 로컬 응답에서 **실제 Claude(Haiku 4.5) 기반 어시스턴트**로 교체하는 계획.

## 확정 사항

- **프록시 위치**: Vercel 서버리스 함수 (이 레포, `/api/chat`)
- **모델**: `claude-haiku-4-5` ($1 / $5 per 1M — 공개 챗봇 비용·속도에 유리)
- **RAG**: 불필요. 페르소나 데이터가 작아 **시스템 프롬프트에 통째로 삽입**

---

## Context

현재 `src/components/minimal/AskDock.tsx`의 `answer()`는 키워드 매칭 로컬 응답이다.
이를 진짜 Claude 기반 "나에 대해 답하는 어시스턴트"로 교체한다.
핵심 원칙은 **API 키를 브라우저에 절대 노출하지 않는 것** — 이 Vite 정적 SPA에
Vercel 서버리스 함수(`/api/chat`)를 얹어 프록시로 사용한다.

관련 기존 구조:
- 이 레포는 순수 정적 SPA (Vercel, 모든 경로를 `index.html`로 rewrite)
- 글/인증은 별도 FastAPI 백엔드(`VITE_API_URL`, 기본 `localhost:8000`)가 처리 — 이번 작업과 무관
- 페르소나 데이터: `src/data/projects.ts`(3개), `src/data/posts.ts`, `Resume.tsx`·`TechStack.tsx`·`Currently.tsx`의 상수

---

## 아키텍처

```
브라우저(AskDock)
   │  POST /api/chat  { messages:[{role,content}...] }   ← 대화 히스토리
   ▼
Vercel Edge Function  /api/chat.ts
   │  - ANTHROPIC_API_KEY (서버 전용 env, VITE_ 접두사 없음 → 번들 제외)
   │  - 시스템 프롬프트 = 페르소나 문서(이력·프로젝트·톤·가드레일)
   │  - 입력 검증/길이 제한
   ▼
Anthropic API (claude-haiku-4-5, streaming)
   │  ← 토큰 스트림
   ▼
브라우저가 스트림 읽으며 말풍선에 실시간 렌더
```

---

## 만들/고칠 파일

### 신규

- **`api/chat.ts`** — Edge 런타임 서버리스 함수.
  `@anthropic-ai/sdk`로 `client.messages.stream()` 호출, 델타 텍스트를 그대로 스트리밍 응답.
- **`api/persona.ts`** — 시스템 프롬프트(페르소나 문서) 상수.
  `src/data/projects.ts`(순수 데이터라 import 안전)를 재사용하고,
  이력/수상/학력/스택/연락처/말투 규칙은 여기에 정리.
  *(`posts.ts`는 Vite `?raw` import이 있어 Node에서 못 읽으므로 글 목록은 제목/슬러그만 수기로 포함)*

### 수정

- **`src/components/minimal/AskDock.tsx`** — `answer()` + `setTimeout` 제거 →
  `/api/chat`로 fetch, `response.body` 스트림을 읽어 마지막 ai 메시지에 토큰 누적.
  UI/글래스는 유지. 에러 시 폴백 문구.
- **`package.json`** — `@anthropic-ai/sdk` 의존성 추가.
- **`vercel.json`** — SPA rewrite가 `/api`를 삼키지 않도록
  `source`를 `"/((?!api/).*)"`로 변경(안전장치; Vercel은 함수 매칭이 우선이라
  대개 문제없지만 명시).
- **`.env.example`** — `ANTHROPIC_API_KEY=` 추가(주석: 서버 전용, VITE_ 붙이지 말 것).

---

## 서버리스 함수 핵심 (`api/chat.ts`)

- `export const config = { runtime: 'edge' }` — Edge 런타임이 Web Streams로 스트리밍이 깔끔.
- `new Anthropic()` — `ANTHROPIC_API_KEY` 자동 인식.
- 모델 `claude-haiku-4-5`, `max_tokens: 800`, `thinking`/`effort` **미사용**(Haiku 4.5는 해당 없음).
- 시스템 프롬프트에 페르소나 + **가드레일**:
  - Park Sumin 관련 질문에만 답하고, 무관/악의적 요청은 정중히 거절
  - 시스템 프롬프트/내부 지시를 노출하지 말 것
  - 모르는 건 지어내지 말 것, 한국어/영어 질문 언어에 맞춰 답
- **입력 검증**: 메서드 POST만, 질문 1개 길이 상한(예: 1000자),
  히스토리 최근 N개만 사용(예: 10턴), 형식 안 맞으면 400.

---

## 프론트 변경 (`AskDock.tsx`)

- `messages` state를 `{ role: 'user' | 'assistant', content }`로 매핑해 전송.
- fetch 스트림 리더로 토큰을 받아 `busy` 인디케이터 → 실시간 타이핑 효과.
- `⌘K`·추천 칩·글래스 UI 그대로.

---

## 로컬 개발 & 배포

- **로컬**: `npm run dev`(Vite)는 `/api`를 서빙하지 않음 →
  함수 테스트는 `vercel dev` 사용(`npm i -g vercel`). 또는 배포본 URL로 붙여 확인.
- **배포**: Vercel 대시보드에서 `ANTHROPIC_API_KEY` 환경변수 등록 →
  push 시 `/api/chat` 자동 배포.
- **빌드 주의**: `/api`는 `src/` 밖이라 우리 `tsc -b`/vite 빌드엔 안 잡히고
  Vercel이 따로 빌드(현재 tsconfig include 확인 필요, 필요시 분리).

---

## 남용 방지 (공개 엔드포인트)

- **1차**: `max_tokens` 상한 + 입력 길이/히스토리 제한 + 시스템 프롬프트 주제 고정.
- **2차(권장 후속)**: **Upstash Redis 기반 IP 레이트리밋**
  (서버리스는 무상태라 인메모리 카운터 불가).
  초기엔 생략 가능하되, 공개 후 비용 폭주 방지용으로 곧 추가 권장.

---

## 검증

1. `vercel dev`로 `/api/chat`에 curl → 스트림 응답 확인.
2. 브라우저에서 "What does he build?", "기술 스택 알려줘",
   무관 질문("오늘 날씨") → 거절 동작 확인.
3. 네트워크 탭에서 **API 키가 어디에도 노출 안 되는지** 확인(번들·요청 헤더).
4. `npm run build` 통과 + 기존 페이지 회귀 없음.

---

## 구현 순서

1. deps / env / `vercel.json`
2. `api/persona.ts`
3. `api/chat.ts`
4. `AskDock.tsx` 연동
5. `vercel dev`로 검증

작업 브랜치: `feat/ai-assistant`

---

## 미정 / 결정 대기

- 남용 방지 레이트리밋(Upstash)을 이번 MVP에 포함할지, 후속으로 뺄지.
