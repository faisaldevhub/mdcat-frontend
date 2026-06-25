# MDCAT Platform — Frontend Architecture

> **Version:** 1.0
> **Created:** 2026-06-25
> **Status:** Approved Architecture — Implementation Pending
> **Domain:** mdcatinsecond.com
> **Frontend Deployment:** Vercel
> **Backend Deployment:** Hostinger (WordPress + REST API)

---

## Table of Contents

1. [Project Goals](#1-project-goals)
2. [Technology Stack](#2-technology-stack)
3. [Folder Structure](#3-folder-structure)
4. [Routing Strategy](#4-routing-strategy)
5. [Authentication Flow](#5-authentication-flow)
6. [API Layer](#6-api-layer)
7. [State Management](#7-state-management)
8. [Feature Modules](#8-feature-modules)
9. [Component Architecture](#9-component-architecture)
10. [Design System](#10-design-system)
11. [Data Fetching Strategy](#11-data-fetching-strategy)
12. [Error Handling](#12-error-handling)
13. [Security](#13-security)
14. [Performance](#14-performance)
15. [Coding Standards](#15-coding-standards)
16. [Development Workflow](#16-development-workflow)
17. [Frontend Development Phases](#17-frontend-development-phases)
18. [Future Scalability](#18-future-scalability)

---

## 1. Project Goals

### Purpose

The MDCAT Platform frontend is a decoupled Next.js application that serves as the student-facing interface for the MDCAT exam preparation platform. It replaces the WordPress-rendered frontend with a modern, performant, and interactive single-page application while WordPress continues to serve as the backend CMS and admin panel.

### Relationship with WordPress Plugin

WordPress remains the backend server. The `mdcat-platform` plugin handles:

- Content management (subjects, chapters, collections, questions)
- Quiz engine (attempt lifecycle, scoring, review)
- Gamification (XP, badges, achievements, streak, leaderboard)
- Analytics (subject/chapter performance)
- Revision (bookmarks, wrong questions)
- Notifications
- Student management (admin panel)
- Access control and suspension

The frontend does **not** duplicate any backend logic. It is a pure presentation layer that reads from and writes to the REST API.

### Relationship with REST API

The frontend consumes the 33-endpoint REST API exposed at `/wp-json/mdcat/v1/`. The API uses JWT authentication with access/refresh token pairs. Every student-facing feature has a corresponding REST endpoint. The frontend maps 1:1 to these endpoints — no BFF (Backend-for-Frontend) layer is needed.

### Core Principles

1. **API-first.** The frontend trusts the API as the single source of truth for data, validation, and business rules.
2. **No business logic duplication.** Scoring, analytics calculations, gamification rules, and access control decisions are made by the backend. The frontend only renders the results.
3. **Two audiences.** Public visitors browse content. Authenticated students access the full platform.
4. **Design-driven.** The UI is built from the Stitch design system. Every page has a design reference.
5. **Mobile-first responsive.** All pages must work on mobile, tablet, and desktop.

---

## 2. Technology Stack

### Core Framework

| Technology | Version | Purpose | Rationale |
|-----------|---------|---------|-----------|
| **Next.js** | 15+ (App Router) | Framework | Server components, file-based routing, middleware, image optimization, API route proxying. The App Router enables RSC (React Server Components) for public pages while keeping student pages interactive. |
| **React** | 19+ | UI Library | Ships with Next.js. Concurrent features, Suspense boundaries, and Server Components. |
| **TypeScript** | 5+ | Type Safety | Catches API contract mismatches at compile time. Types are generated from API response shapes. |

### Styling

| Technology | Purpose | Rationale |
|-----------|---------|-----------|
| **Tailwind CSS** | Utility-first CSS | Rapid UI development matching Stitch designs. Purges unused CSS in production. Consistent spacing/color tokens. |
| **shadcn/ui** | Component primitives | Accessible, unstyled Radix-based components (Dialog, Dropdown, Toast, etc.) that pair with Tailwind. Copied into the project — no runtime dependency. |
| **tailwind-merge** | Class merging | Resolves conflicting Tailwind classes in component composition. |
| **clsx** | Conditional classes | Clean conditional class logic. |

### Data Layer

| Technology | Purpose | Rationale |
|-----------|---------|-----------|
| **TanStack Query (React Query)** v5 | Server state management | Handles caching, background refetching, stale-while-revalidate, optimistic updates, and request deduplication. Eliminates manual loading/error/data state management. Purpose-built for REST API consumption. |
| **Axios** | HTTP client | Request/response interceptors for JWT injection and token refresh. Centralized error transformation. Automatic JSON handling. Better error objects than `fetch`. |

### Forms & Validation

| Technology | Purpose | Rationale |
|-----------|---------|-----------|
| **React Hook Form** | Form management | Uncontrolled inputs for performance. Minimal re-renders. Built-in validation integration. |
| **Zod** | Schema validation | TypeScript-first validation. Schemas double as type definitions. Used for form validation and API response validation. |

### State Management

| Technology | Purpose | Rationale |
|-----------|---------|-----------|
| **Zustand** | Global client state | Lightweight (1KB), no boilerplate, no providers. Used only for auth state and UI preferences (theme, sidebar). Everything else is server state managed by React Query. |

### Visualization

| Technology | Purpose | Rationale |
|-----------|---------|-----------|
| **Recharts** | Charts & graphs | Composable, responsive charts for analytics dashboards. Built on D3 but React-native. Supports the chart types visible in Stitch designs (bar, pie, area). |

### Developer Tooling

| Technology | Purpose |
|-----------|---------|
| **ESLint** | Code quality and consistency |
| **Prettier** | Automatic formatting |
| **Husky + lint-staged** | Pre-commit hooks |

---

## 3. Folder Structure

```
mdcat-frontend/
├── docs/
│   └── FRONTEND_ARCHITECTURE.md      # This document
│
├── public/
│   ├── fonts/                         # Self-hosted fonts (Inter, etc.)
│   ├── icons/                         # Favicon, app icons
│   └── images/                        # Static marketing images
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (public)/                  # Public route group (no auth)
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── pricing/
│   │   │   ├── subjects/
│   │   │   ├── chapters/
│   │   │   ├── collections/
│   │   │   └── layout.tsx             # Public layout (marketing nav)
│   │   │
│   │   ├── (auth)/                    # Auth route group
│   │   │   ├── login/
│   │   │   └── layout.tsx             # Minimal auth layout
│   │   │
│   │   ├── (student)/                 # Protected route group
│   │   │   ├── dashboard/
│   │   │   ├── subjects/
│   │   │   ├── chapters/
│   │   │   ├── collections/
│   │   │   ├── quiz/
│   │   │   ├── analytics/
│   │   │   ├── bookmarks/
│   │   │   ├── wrong-questions/
│   │   │   ├── leaderboard/
│   │   │   ├── achievements/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── layout.tsx             # Student layout (sidebar + topbar)
│   │   │
│   │   ├── not-found.tsx              # 404 page
│   │   ├── error.tsx                  # Global error boundary
│   │   ├── loading.tsx                # Global loading fallback
│   │   └── layout.tsx                 # Root layout (html, body, providers)
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives (Button, Input, Dialog, etc.)
│   │   ├── shared/                    # Cross-feature components (Logo, Avatar, EmptyState, etc.)
│   │   └── layouts/                   # Layout shells (PublicNav, StudentSidebar, TopBar, etc.)
│   │
│   ├── features/                      # Feature-specific components and hooks
│   │   ├── auth/
│   │   │   ├── components/            # LoginForm, etc.
│   │   │   ├── hooks/                 # useAuth, useLogin, useLogout
│   │   │   └── types.ts
│   │   ├── dashboard/
│   │   │   ├── components/            # StatsCard, ProgressChart, etc.
│   │   │   ├── hooks/                 # useDashboardStats, useProgress, etc.
│   │   │   └── types.ts
│   │   ├── content/
│   │   │   ├── components/            # SubjectCard, ChapterList, CollectionCard, etc.
│   │   │   ├── hooks/                 # useSubjects, useChapters, useCollections
│   │   │   └── types.ts
│   │   ├── quiz/
│   │   │   ├── components/            # QuizInterface, QuestionCard, ResultSummary, ReviewPanel
│   │   │   ├── hooks/                 # useStartQuiz, useAnswerQuestion, useCompleteQuiz, etc.
│   │   │   └── types.ts
│   │   ├── analytics/
│   │   │   ├── components/            # PerformanceChart, SubjectBreakdown, etc.
│   │   │   ├── hooks/                 # usePerformance
│   │   │   └── types.ts
│   │   ├── revision/
│   │   │   ├── components/            # BookmarkList, WrongQuestionList, etc.
│   │   │   ├── hooks/                 # useBookmarks, useToggleBookmark, useWrongQuestions
│   │   │   └── types.ts
│   │   ├── gamification/
│   │   │   ├── components/            # StreakCard, XPBar, BadgeGrid, AchievementList, LeaderboardTable
│   │   │   ├── hooks/                 # useStreak, useXP, useBadges, useAchievements, useLeaderboard
│   │   │   └── types.ts
│   │   └── notifications/
│   │       ├── components/            # NotificationList, NotificationItem, etc.
│   │       ├── hooks/                 # useNotifications, useMarkRead
│   │       └── types.ts
│   │
│   ├── services/                      # API service layer
│   │   ├── api-client.ts              # Axios instance, interceptors, token refresh
│   │   ├── auth.service.ts            # Login, refresh, logout, me
│   │   ├── content.service.ts         # Subjects, chapters, collections
│   │   ├── dashboard.service.ts       # Stats, progress, continue-learning, study-plan
│   │   ├── quiz.service.ts            # Start, questions, answer, complete, result, review, history
│   │   ├── analytics.service.ts       # Performance
│   │   ├── revision.service.ts        # Bookmarks, toggle, wrong-questions
│   │   ├── gamification.service.ts    # Streak, XP, badges, achievements, leaderboard
│   │   └── notification.service.ts    # Notifications, mark-read, mark-all-read
│   │
│   ├── hooks/                         # Global reusable hooks
│   │   ├── use-auth.ts                # Auth state accessor
│   │   ├── use-media-query.ts         # Responsive breakpoints
│   │   └── use-debounce.ts            # Input debouncing
│   │
│   ├── lib/                           # Utilities and configuration
│   │   ├── utils.ts                   # cn(), formatDate(), etc.
│   │   ├── query-client.ts            # TanStack Query client configuration
│   │   └── validators.ts              # Shared Zod schemas
│   │
│   ├── stores/                        # Zustand stores
│   │   ├── auth.store.ts              # Tokens, user, isAuthenticated
│   │   └── ui.store.ts                # Theme, sidebar collapsed, etc.
│   │
│   ├── types/                         # Global TypeScript types
│   │   ├── api.ts                     # API envelope types (ApiResponse, ApiError, PaginatedResponse)
│   │   ├── user.ts                    # User, AuthTokens
│   │   └── common.ts                  # Shared types (ID, Timestamps, etc.)
│   │
│   ├── constants/                     # Application constants
│   │   ├── routes.ts                  # Route path constants
│   │   ├── api-endpoints.ts           # API endpoint path constants
│   │   └── query-keys.ts             # TanStack Query key factory
│   │
│   ├── styles/
│   │   └── globals.css                # Tailwind directives + global styles
│   │
│   └── middleware.ts                  # Next.js middleware (auth redirect)
│
├── tailwind.config.ts                 # Tailwind configuration (colors, fonts, spacing from Stitch)
├── tsconfig.json
├── next.config.ts
├── package.json
└── .env.local                         # NEXT_PUBLIC_API_URL
```

### Directory Purpose Reference

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router. Pages and layouts only. Minimal logic — delegates to features. |
| `features/` | Feature-scoped components, hooks, and types. Each feature owns its UI and data-fetching hooks. |
| `components/ui/` | shadcn/ui primitives. Never contain business logic. |
| `components/shared/` | Cross-feature presentational components. |
| `components/layouts/` | Page shells: navigation, sidebar, topbar. |
| `services/` | API call functions. One file per backend module. No UI, no hooks, no state. |
| `hooks/` | Global reusable hooks not tied to a specific feature. |
| `stores/` | Zustand stores. Minimal — only auth and UI preferences. |
| `types/` | Shared TypeScript interfaces and type aliases. |
| `constants/` | String constants for routes, API paths, and query keys. |
| `lib/` | Utility functions and configuration objects. |

---

## 4. Routing Strategy

### Route Groups

Next.js App Router uses route groups (parenthesized directories) to organize routes without affecting the URL path.

| Route Group | Layout | Auth Required | Purpose |
|-------------|--------|:-------------:|---------|
| `(public)` | Public layout (marketing nav, footer) | No | Landing page, pricing, content browsing |
| `(auth)` | Minimal layout (centered card) | No (redirect if logged in) | Login page |
| `(student)` | Student layout (sidebar, topbar) | Yes | All authenticated student features |

### Public Routes

| Path | Page | Data Source |
|------|------|------------|
| `/` | Landing page | Static + marketing content |
| `/pricing` | Pricing plans | Static |
| `/subjects` | Subject catalog | `GET /subjects` (public preview) |
| `/subjects/[id]` | Subject detail | `GET /subjects/{id}` |
| `/chapters` | Chapter listing | `GET /chapters` |
| `/collections` | Collection listing | `GET /collections` |
| `/collections/[id]` | Collection preview | `GET /collections/{id}` (metadata only, no questions) |

**Behavior:** Public content pages show subjects, chapters, and collections as a browseable catalog. No quiz questions are displayed. A prominent "Start Quiz" CTA button redirects to `/login?redirect=/quiz/start/{collection_id}`.

### Auth Routes

| Path | Page | Behavior |
|------|------|----------|
| `/login` | Login form | Accepts `?redirect=` query param. Redirects to `/dashboard` after login if no redirect specified. If already logged in, redirects to `/dashboard`. |

### Protected Student Routes

| Path | Page | API Endpoints Used |
|------|------|--------------------|
| `/dashboard` | Student dashboard | stats, progress, continue-learning, study-plan |
| `/subjects` | Subject browser | `GET /subjects` |
| `/subjects/[id]` | Subject detail + chapters | `GET /subjects/{id}`, `GET /chapters?subject_id=` |
| `/chapters/[id]` | Chapter detail + collections | `GET /chapters/{id}`, `GET /collections?chapter_id=` |
| `/collections/[id]` | Collection detail | `GET /collections/{id}` |
| `/quiz/[id]` | Active quiz (attempt) | questions, answer |
| `/quiz/[id]/result` | Quiz result | result |
| `/quiz/[id]/review` | Quiz review | review |
| `/quiz/history` | Attempt history | history |
| `/analytics` | Performance analytics | performance |
| `/bookmarks` | Bookmarked questions | bookmarks |
| `/wrong-questions` | Wrong questions | wrong-questions |
| `/leaderboard` | Student rankings | leaderboard |
| `/achievements` | Badges + achievements | badges, achievements, xp, streak |
| `/notifications` | Notification feed | notifications |
| `/profile` | User profile | me |
| `/settings` | Preferences | me |

**Note:** Public `/subjects` and student `/subjects` share the same URL path but render different layouts. The `(public)` group renders the marketing nav; the `(student)` group renders the sidebar. The active route group is determined by authentication state in middleware.

### Layout Strategy

```
Root Layout (html, body, Providers)
├── (public) Layout → PublicNav + Footer
│   ├── Landing Page
│   ├── Pricing
│   └── Content Pages
├── (auth) Layout → Centered card, no nav
│   └── Login
└── (student) Layout → Sidebar + TopBar + Main
    ├── Dashboard
    ├── Quiz
    ├── Analytics
    └── ...all student pages
```

### Special Pages

| Page | Purpose |
|------|---------|
| `not-found.tsx` | Custom 404. Links back to home or dashboard. |
| `error.tsx` | Client-side error boundary. Shows "something went wrong" with retry. |
| `loading.tsx` | Root loading fallback. Shows skeleton. |
| `(student)/loading.tsx` | Student section loading. Shows sidebar + skeleton content area. |

---

## 5. Authentication Flow

### Overview

Authentication uses JWT access/refresh token pairs issued by `POST /auth/login`. The access token (24h TTL) is sent as `Authorization: Bearer {token}` on every API request. The refresh token (30d TTL) is used to silently obtain new access tokens before expiration.

### Token Storage

| Token | Storage | Rationale |
|-------|---------|-----------|
| Access Token | In-memory (Zustand store) | Never persisted to localStorage — reduces XSS exposure. Lost on page refresh, restored via refresh token. |
| Refresh Token | `httpOnly` secure cookie (ideal) or localStorage (fallback) | If the backend sets a `httpOnly` cookie, the frontend never touches it directly. If cookies are not available, localStorage is the fallback. |
| User Object | Zustand store + sessionStorage cache | Avoids unnecessary `/auth/me` calls after soft navigations. |

### Login Flow

```
1. User submits email + password
2. Frontend calls POST /auth/login
3. Backend validates credentials, checks suspension, returns:
   { access_token, refresh_token, expires_in, user }
4. Frontend stores access_token in Zustand (memory)
5. Frontend stores refresh_token (cookie or localStorage)
6. Frontend stores user object in Zustand
7. Frontend redirects to ?redirect param or /dashboard
8. All subsequent API calls include Authorization: Bearer {access_token}
```

### Silent Token Refresh

```
1. Axios response interceptor catches 401 (token_expired)
2. Interceptor queues the failed request
3. Interceptor calls POST /auth/refresh with refresh_token
4. Backend validates refresh token, checks suspension, returns new access_token
5. Interceptor updates the Zustand store with new access_token
6. Interceptor retries all queued requests with the new token
7. If refresh fails (expired, suspended) → redirect to /login
```

**Concurrency:** Only one refresh request is made. If multiple 401s arrive simultaneously, subsequent requests wait for the first refresh to complete. This is handled by a request queue in the Axios interceptor.

### Session Restoration (Page Refresh)

```
1. User refreshes the page
2. Access token is lost (in-memory only)
3. Middleware checks for refresh token (cookie or localStorage)
4. If present → silent refresh is triggered before any API call
5. New access token is stored in memory
6. User session is restored seamlessly
7. If refresh token is also expired → redirect to /login
```

### Logout Flow

```
1. User clicks Logout
2. Frontend calls POST /auth/logout
3. Frontend clears access_token from Zustand store
4. Frontend clears refresh_token from cookie/localStorage
5. Frontend clears user object and React Query cache
6. Frontend redirects to /login
```

### Middleware (Route Protection)

`middleware.ts` runs on the Edge before every navigation. It enforces:

| Condition | Action |
|-----------|--------|
| Unauthenticated user → `(student)` route | Redirect to `/login?redirect={original_path}` |
| Authenticated user → `/login` | Redirect to `/dashboard` |
| All other cases | Pass through |

Authentication check in middleware is lightweight: it only verifies the existence of the refresh token (cookie or header). Full JWT validation happens server-side when the API is called.

---

## 6. API Layer

### API Client

A single Axios instance configured with:

- **Base URL:** `NEXT_PUBLIC_API_URL` (e.g., `https://backend.mdcatinsecond.com/wp-json/mdcat/v1`)
- **Default headers:** `Content-Type: application/json`, `Accept: application/json`
- **Request interceptor:** Injects `Authorization: Bearer {access_token}` from the auth store on every request
- **Response interceptor:** Catches 401 → triggers silent refresh → retries failed request
- **Error interceptor:** Transforms API errors into a consistent `ApiError` type

### Service Layer

Each backend module maps to one service file. Service files are pure functions — no hooks, no state, no components.

```
Service File                  | Backend Endpoints
------------------------------|--------------------------------------------------
auth.service.ts               | POST /auth/login, POST /auth/refresh,
                              | POST /auth/logout, GET /auth/me
content.service.ts            | GET /subjects, GET /subjects/{id},
                              | GET /chapters, GET /chapters/{id},
                              | GET /collections, GET /collections/{id}
dashboard.service.ts          | GET /dashboard/stats, GET /dashboard/progress,
                              | GET /dashboard/continue-learning,
                              | GET /dashboard/study-plan
quiz.service.ts               | POST /quiz/start, GET /quiz/{id}/questions,
                              | POST /quiz/{id}/answer,
                              | POST /quiz/{id}/complete,
                              | GET /quiz/{id}/result, GET /quiz/{id}/review,
                              | GET /quiz/history
analytics.service.ts          | GET /analytics/performance
revision.service.ts           | GET /revision/bookmarks,
                              | POST /revision/bookmarks/toggle,
                              | GET /revision/wrong-questions
gamification.service.ts       | GET /gamification/streak, GET /gamification/xp,
                              | GET /gamification/badges,
                              | GET /gamification/achievements,
                              | GET /gamification/leaderboard
notification.service.ts       | GET /notifications,
                              | POST /notifications/{id}/read,
                              | POST /notifications/read-all
```

### Request Flow

```
Component → Hook (React Query) → Service Function → Axios Client → REST API
                                                          ↓
                                              Interceptor (JWT injection)
                                                          ↓
                                              Backend validates token
                                                          ↓
                                              Response → Interceptor (error handling)
                                                          ↓
                                              React Query cache → Component re-renders
```

### Error Handling in Services

Services do not catch errors. They let Axios throw. React Query's `onError` callback handles error display. The Axios response interceptor normalizes all errors into a consistent shape:

```
{
  code: string      // API error code (e.g., "token_expired", "not_found")
  message: string   // Human-readable message from the API
  status: number    // HTTP status code
  errors: object    // Optional field-level errors
}
```

### Retry Policy

| Scenario | Retry? | Details |
|----------|:------:|---------|
| 401 (expired token) | Yes | Silent refresh, then retry original request once |
| 401 (invalid/missing token) | No | Redirect to login |
| 403 (suspended) | No | Show suspension message |
| 404 | No | Show not found |
| 429 (rate limited) | No | Show rate limit message |
| 5xx | Yes | React Query retries 3 times with exponential backoff |
| Network error | Yes | React Query retries 3 times |

---

## 7. State Management

### State Categories

| Category | Tool | Scope | Examples |
|----------|------|-------|---------|
| **Server state** | TanStack Query | Per-query cache | Dashboard stats, subjects list, quiz questions, notifications, leaderboard |
| **Auth state** | Zustand | Global (persisted) | Access token, user object, isAuthenticated flag |
| **UI state** | Zustand | Global | Sidebar collapsed, theme preference |
| **Page state** | React `useState` | Component-local | Selected tab, modal open/closed, dropdown selection |
| **Form state** | React Hook Form | Component-local | Login form values, validation errors |
| **URL state** | Next.js `searchParams` | URL | Current page in paginated lists, filter selections, sort order |

### What Does NOT Belong in Global State

| Data | Reason |
|------|--------|
| Dashboard stats | Server state — React Query cache |
| Subject list | Server state — React Query cache |
| Quiz questions | Server state — React Query cache |
| Notification count | Server state — React Query cache (polled) |
| Form values | Local form state — React Hook Form |
| Modal visibility | Local component state — `useState` |
| Current quiz answer selections | Local page state — `useState` or `useReducer` |

### Zustand Store Structure

**Auth Store:**

- `accessToken` — current JWT access token (string | null)
- `user` — authenticated user object (User | null)
- `isAuthenticated` — derived boolean
- `setAuth(token, user)` — set after login/refresh
- `clearAuth()` — clear on logout
- `updateToken(token)` — update after silent refresh

**UI Store:**

- `sidebarCollapsed` — sidebar state (boolean)
- `theme` — color scheme preference ('light' | 'dark' | 'system')
- `toggleSidebar()`
- `setTheme(theme)`

---

## 8. Feature Modules

Each feature module is a self-contained directory under `src/features/`. It owns its components, hooks, and types. Feature modules do not import from other feature modules — shared dependencies live in `components/shared/` or `hooks/`.

---

### 8.1 Authentication

**Directory:** `features/auth/`

**Responsibilities:**
- Login form with validation
- Login error display (invalid credentials, rate limited, suspended)
- Post-login redirect handling
- Logout confirmation

**API Endpoints:**
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

**Hooks:** `useLogin`, `useLogout`, `useCurrentUser`

---

### 8.2 Dashboard

**Directory:** `features/dashboard/`

**Responsibilities:**
- Aggregate stats display (total attempts, accuracy, bookmarks, weak topics)
- Subject/chapter progress bars
- Continue learning card with next recommended collection
- Study plan recommendations (priority topics, weak subjects, daily plan)
- Streak indicator

**API Endpoints:**
- `GET /dashboard/stats`
- `GET /dashboard/progress`
- `GET /dashboard/continue-learning`
- `GET /dashboard/study-plan`

**Hooks:** `useDashboardStats`, `useProgress`, `useContinueLearning`, `useStudyPlan`

---

### 8.3 Content (Subjects, Chapters, Collections)

**Directory:** `features/content/`

**Responsibilities:**
- Subject listing and detail pages
- Chapter listing (filterable by subject) and detail pages
- Collection listing (filterable by chapter) and detail pages
- Content hierarchy navigation (Subject → Chapter → Collection → Start Quiz)
- Public content preview (no questions)
- "Start Quiz" CTA that initiates attempt or redirects to login

**API Endpoints:**
- `GET /subjects`, `GET /subjects/{id}`
- `GET /chapters`, `GET /chapters/{id}`
- `GET /collections`, `GET /collections/{id}`

**Hooks:** `useSubjects`, `useSubject`, `useChapters`, `useChapter`, `useCollections`, `useCollection`

---

### 8.4 Quiz

**Directory:** `features/quiz/`

**Responsibilities:**
- Quiz start (creates attempt)
- Question display with option selection
- Answer submission with instant feedback (is_correct, correct_option)
- Question navigation (previous/next)
- Quiz completion with score calculation
- Result summary page
- Full post-quiz review with explanations
- Paginated attempt history

**API Endpoints:**
- `POST /quiz/start`
- `GET /quiz/{id}/questions`
- `POST /quiz/{id}/answer`
- `POST /quiz/{id}/complete`
- `GET /quiz/{id}/result`
- `GET /quiz/{id}/review`
- `GET /quiz/history`

**Hooks:** `useStartQuiz`, `useQuizQuestions`, `useAnswerQuestion`, `useCompleteQuiz`, `useQuizResult`, `useQuizReview`, `useQuizHistory`

**State Notes:** The active quiz session (current question index, selected answers, navigation state) is local page state managed with `useReducer`. It is not global state because it is only relevant within the quiz page.

---

### 8.5 Analytics

**Directory:** `features/analytics/`

**Responsibilities:**
- Subject-level accuracy breakdown (bar chart)
- Chapter-level performance with performance labels (table + chart)
- Identification of weakest chapters

**API Endpoints:**
- `GET /analytics/performance`

**Hooks:** `usePerformance`

---

### 8.6 Revision

**Directory:** `features/revision/`

**Responsibilities:**
- Bookmarked questions listing
- Bookmark toggle (add/remove)
- Wrong questions listing (ordered by recency and frequency)
- Question detail with correct answer, explanation, and context (collection/chapter/subject)

**API Endpoints:**
- `GET /revision/bookmarks`
- `POST /revision/bookmarks/toggle`
- `GET /revision/wrong-questions`

**Hooks:** `useBookmarks`, `useToggleBookmark`, `useWrongQuestions`

---

### 8.7 Gamification

**Directory:** `features/gamification/`

**Responsibilities:**
- Streak display (current, longest, total active days)
- XP summary with level progress bar
- Badge showcase (all 12, earned + locked)
- Achievement list (earned only, chronological)
- Leaderboard table (weekly/monthly/all-time, top N, current user position)
- Post-quiz gamification feedback (XP earned, badges unlocked — rendered from quiz complete response)

**API Endpoints:**
- `GET /gamification/streak`
- `GET /gamification/xp`
- `GET /gamification/badges`
- `GET /gamification/achievements`
- `GET /gamification/leaderboard`

**Hooks:** `useStreak`, `useXP`, `useBadges`, `useAchievements`, `useLeaderboard`

---

### 8.8 Notifications

**Directory:** `features/notifications/`

**Responsibilities:**
- Notification feed (paginated, 15 per page, infinite scroll or load more)
- Unread count badge in sidebar/topbar
- Mark single notification as read
- Mark all notifications as read
- Notification types: badge_unlock, achievement_unlock, enrollment status, general

**API Endpoints:**
- `GET /notifications`
- `POST /notifications/{id}/read`
- `POST /notifications/read-all`

**Hooks:** `useNotifications`, `useUnreadCount`, `useMarkRead`, `useMarkAllRead`

**Polling:** Unread count is polled every 60 seconds in the background via React Query's `refetchInterval`. Full notification list is refetched on focus.

---

### 8.9 Profile & Settings

**Directory:** `features/auth/` (extends auth module)

**Responsibilities:**
- Display user profile (name, email, role, avatar, registration date)
- Theme preference (light/dark/system)
- Future: notification preferences, password change

**API Endpoints:**
- `GET /auth/me`

**Notes:** No update-profile API exists in the backend. Profile is read-only. Settings are stored client-side (Zustand + localStorage).

---

## 9. Component Architecture

### Component Categories

| Category | Location | Purpose | Rules |
|----------|----------|---------|-------|
| **UI Components** | `components/ui/` | Design system primitives | No business logic. No API calls. Accept props only. Reusable everywhere. |
| **Shared Components** | `components/shared/` | Cross-feature presentational components | May compose UI components. No API calls. No feature-specific logic. |
| **Layout Components** | `components/layouts/` | Page shells and navigation | Handle layout structure. May read auth state for conditional rendering. |
| **Feature Components** | `features/{name}/components/` | Feature-specific UI | May use feature hooks. May make API calls via hooks. Not imported by other features. |
| **Page Components** | `app/` | Route entry points | Minimal logic. Compose feature components. Pass params. |

### Component Rules

1. **UI components are stateless.** They accept props and render. No `useState`, no `useEffect`, no API calls.
2. **Feature components own their data.** They call their feature's hooks and render the result.
3. **Pages are thin.** They extract route params and render feature components. Maximum 30 lines.
4. **No cross-feature imports.** If two features need the same component, move it to `components/shared/`.
5. **Every component has a single responsibility.** A component either fetches data OR renders UI — not both. Exception: small feature components where splitting would be over-engineering.

### Composition Example

```
Page (app/(student)/dashboard/page.tsx)
├── DashboardStats (feature component — calls useDashboardStats)
│   ├── StatsCard (shared component)
│   └── StatsCard
├── ProgressSection (feature component — calls useProgress)
│   └── ProgressBar (UI component)
├── ContinueLearning (feature component — calls useContinueLearning)
│   └── CollectionCard (shared component)
└── StudyPlan (feature component — calls useStudyPlan)
    └── RecommendationCard (shared component)
```

---

## 10. Design System

The design system is derived from the Stitch designs located in `stitch-designs/`. All design tokens are encoded in `tailwind.config.ts`.

### Color Palette

Extracted from `stitch-designs/inspiration/color palette.png`. Colors are defined as CSS custom properties for theme support:

| Token | Usage |
|-------|-------|
| `primary` | Primary actions, active states, links |
| `primary-foreground` | Text on primary backgrounds |
| `secondary` | Secondary actions, tags |
| `accent` | Highlights, badges, notifications |
| `background` | Page background |
| `foreground` | Primary text |
| `card` | Card backgrounds |
| `card-foreground` | Card text |
| `muted` | Disabled states, placeholders |
| `muted-foreground` | Muted text |
| `destructive` | Error states, delete actions |
| `border` | Borders, dividers |
| `success` | Correct answers, passed states |
| `warning` | Weak areas, attention |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 | Inter | 700 (Bold) | 2rem (32px) |
| H2 | Inter | 600 (Semibold) | 1.5rem (24px) |
| H3 | Inter | 600 | 1.25rem (20px) |
| Body | Inter | 400 (Regular) | 1rem (16px) |
| Small | Inter | 400 | 0.875rem (14px) |
| Caption | Inter | 500 (Medium) | 0.75rem (12px) |

### Component Standards

| Component | Stitch Design Reference | Notes |
|-----------|------------------------|-------|
| **Stats Card** | `dashboard/student_dashboard_desktop.png` | Colored icon, metric value, label, trend indicator |
| **Progress Bar** | `dashboard/student_dashboard_desktop 2.png` | Percentage fill, label, fraction text |
| **Collection Card** | `q_bank_desktop.png` | Title, question count, chapter badge, start button |
| **Quiz Interface** | `quiz_mode_desktop 1.png`, `quiz_mode_desktop 2.png` | Question text, 4 options (A/B/C/D), navigation, timer |
| **Performance Chart** | `dashboard/performance_analytics_desktop.png` | Bar chart with subject labels, accuracy percentage |
| **Badge Grid** | `dashboard/achievements_desktop.png` | 3-column grid, icon, name, earned/locked state |
| **Leaderboard** | `dashboard/student_rankings_desktop.png` | Rank, avatar, name, XP, level badge |
| **Bookmarks List** | `dashboard/bookmarks_desktop.png` | Question preview, subject/chapter tags, bookmark icon |
| **Wrong Questions** | `dashboard/wrong_questions_desktop.png` | Question text, wrong count badge, last seen date |

### Interactive States

Every interactive element must define:

| State | Treatment |
|-------|-----------|
| Default | Base appearance |
| Hover | Subtle brightness/shadow change (150ms transition) |
| Active/Pressed | Scale down (0.98) or darken |
| Focus | Ring outline for keyboard navigation (accessible) |
| Disabled | Reduced opacity (0.5), cursor not-allowed |
| Loading | Skeleton shimmer or spinner |

### Empty States

Every list/data page must handle the zero-data state:

| Page | Empty State Message |
|------|-------------------|
| Dashboard (new student) | "Welcome! Start your first quiz to see your progress here." |
| Bookmarks | "No bookmarks yet. Bookmark questions during quiz review." |
| Wrong Questions | "No wrong questions. Complete a quiz to see questions you missed." |
| Notifications | "No notifications yet." |
| Achievements | "No achievements earned yet. Complete quizzes to unlock achievements." |
| Quiz History | "No quiz attempts yet. Start a quiz to begin learning." |

### Loading Skeletons

Every data-dependent section renders a skeleton while loading. Skeletons match the shape and size of the actual content (card skeleton, table row skeleton, chart skeleton). No blank white pages.

### Toast Notifications

System-level feedback (bookmark toggled, notification marked read, quiz submitted) is displayed via non-blocking toast notifications positioned at the bottom-right. Toasts auto-dismiss after 4 seconds.

---

## 11. Data Fetching Strategy

### Server Components vs Client Components

| Use Server Components For | Use Client Components For |
|---------------------------|---------------------------|
| Public content pages (landing, pricing) | Authenticated student pages |
| SEO-critical content | Interactive elements (quiz, forms) |
| Static marketing pages | Real-time data (notifications, streak) |
| Metadata generation (title, description) | Pages that read from auth store |

**Rationale:** Public pages benefit from server-side rendering for SEO and initial load performance. Student pages are inherently interactive and require client-side state (auth tokens, React Query cache, form state).

### Fetching Patterns

| Pattern | When | Tool |
|---------|------|------|
| **Fetch on mount** | Page-level data (dashboard stats, quiz questions) | `useQuery` with no special config |
| **Fetch on demand** | Mutations (start quiz, submit answer, toggle bookmark) | `useMutation` |
| **Background refresh** | Data that may change while viewing (notifications) | `useQuery` with `refetchInterval` |
| **Refetch on focus** | Data that may be stale after tab switch (dashboard) | `useQuery` with `refetchOnWindowFocus: true` (default) |
| **Infinite scroll** | Paginated lists (notifications, quiz history) | `useInfiniteQuery` |
| **Prefetch** | Anticipated navigation (hover over collection → prefetch details) | `queryClient.prefetchQuery` |

### Caching Strategy

| Data | Stale Time | Cache Time | Rationale |
|------|:----------:|:----------:|-----------|
| Subjects/Chapters/Collections | 5 minutes | 30 minutes | Content changes rarely. Safe to serve stale. |
| Dashboard stats | 30 seconds | 5 minutes | Should reflect recent quiz completions. |
| Quiz questions (active attempt) | Infinity | Until quiz completes | Questions don't change during an attempt. |
| Quiz history | 1 minute | 10 minutes | New entries appear after quiz completion. |
| Analytics performance | 1 minute | 10 minutes | Updated after quiz completion. |
| Bookmarks / Wrong questions | 30 seconds | 5 minutes | Toggle mutations invalidate immediately. |
| Gamification (streak, XP, badges) | 1 minute | 10 minutes | Updated after quiz completion. |
| Leaderboard | 2 minutes | 10 minutes | Rankings shift infrequently during a session. |
| Notifications | 30 seconds | 5 minutes | Polled in background. |
| User profile (/auth/me) | 10 minutes | 30 minutes | Rarely changes. |

### Cache Invalidation

After mutations, related query caches are invalidated:

| Mutation | Invalidates |
|----------|------------|
| `POST /quiz/start` | — (no existing cache affected) |
| `POST /quiz/{id}/answer` | — (no cache invalidation needed) |
| `POST /quiz/{id}/complete` | dashboard stats, quiz history, analytics, gamification (all), notifications |
| `POST /revision/bookmarks/toggle` | bookmarks list, dashboard stats (bookmarked_count) |
| `POST /notifications/{id}/read` | notifications list, unread count |
| `POST /notifications/read-all` | notifications list, unread count |

### Optimistic Updates

| Mutation | Optimistic Behavior |
|----------|-------------------|
| Toggle bookmark | Immediately flip `is_bookmarked` in the UI. Revert on error. |
| Mark notification read | Immediately mark as read in the list. Decrement unread count. Revert on error. |
| Mark all notifications read | Immediately mark all as read. Set count to 0. Revert on error. |

### Error States

Every query hook renders an error state when the query fails. Error states include:

- A human-readable message from the API
- A "Try Again" button that calls `refetch()`
- No blank pages — the error replaces the loading skeleton

---

## 12. Error Handling

### Error Hierarchy

```
Global Error Boundary (app/error.tsx)
└── Per-page Error Boundary (app/(student)/quiz/error.tsx)
    └── Per-component Error Handling (React Query onError / isError)
```

### Error Types and Handling

| Error | HTTP Status | UI Behavior |
|-------|:-----------:|-------------|
| **Missing JWT** | 401 | Redirect to `/login` |
| **Expired JWT** | 401 | Silent refresh → retry. If refresh fails → redirect to `/login` |
| **Invalid JWT** | 401 | Clear tokens → redirect to `/login` |
| **Account suspended** | 403 | Show suspension message. Clear tokens. Link to contact admin. |
| **Not found** | 404 | Show inline "not found" message within the page layout |
| **Validation error** | 400/422 | Show field-level errors on the form |
| **Rate limited** | 429 | Show "too many attempts" message with cooldown timer |
| **Server error** | 500 | Show generic error with "Try Again" button. React Query retries 3x. |
| **Network error** | — | Show "You appear to be offline" toast. React Query retries on reconnect. |

### Toast Error Display

Non-critical errors (failed bookmark toggle, notification read failure) are displayed as toast notifications. Critical errors (auth failures, quiz submission failures) are displayed inline with the affected component.

---

## 13. Security

### Protected Routes

- All `(student)` routes require authentication, enforced by `middleware.ts`
- The middleware checks for the existence of a refresh token before allowing navigation
- If no token is present, the user is redirected to `/login`
- Full JWT validation happens when the API is called — the middleware is a UX guard, not a security gate

### Private Data Protection

- Quiz questions are never rendered on public pages
- Student dashboard, analytics, bookmarks, wrong questions, and notifications are only accessible behind authentication
- The backend enforces data ownership — the frontend does not perform authorization decisions

### JWT Handling

- Access tokens are stored in memory only (Zustand store) — not in localStorage
- Tokens are never logged, never included in error reports, never sent to analytics
- The `NEXT_PUBLIC_API_URL` is the only environment variable exposed to the browser
- No backend secrets, signing keys, or database credentials exist in the frontend

### Role-Based Rendering

- The `user.role` field from `/auth/me` determines UI rendering
- Admin-only features (student management, content management) are never rendered in the student frontend
- If a student role changes (e.g., gets suspended), the next API call returns 403, and the frontend logs them out

### Data Leakage Prevention

- React Query caches are cleared on logout (`queryClient.clear()`)
- Auth store is cleared on logout
- `sessionStorage` is cleared on logout
- No student data persists after logout

---

## 14. Performance

### Code Splitting

- Next.js automatically code-splits by route
- Heavy components (charts, quiz engine) are loaded via `dynamic()` with `{ ssr: false }`
- Feature modules are only loaded when their route is visited

### Lazy Loading

| Component | Strategy |
|-----------|----------|
| Charts (Recharts) | `dynamic(() => import('...'), { ssr: false })` |
| Quiz review (question list) | Virtualized list for long reviews (50+ questions) |
| Achievement modals | Loaded on demand when triggered |
| Notification panel | Loaded when sidebar icon is clicked |

### Image Optimization

- All images use Next.js `<Image>` component for automatic WebP/AVIF conversion, resizing, and lazy loading
- User avatars use `avatar_url` from the API with `<Image>` `unoptimized` if external
- Stitch design assets in `public/images/` are optimized at build time

### Caching

| Layer | What | TTL |
|-------|------|-----|
| React Query | API responses | Per-query (see section 11) |
| Next.js | Static pages (landing, pricing) | ISR or full static |
| Browser | Fonts, static images | Cache-Control headers via `next.config.ts` |
| CDN (Vercel) | Static assets | Immutable hashes |

### Prefetching

- Next.js `<Link>` components prefetch routes on hover/viewport entry
- Content detail pages are prefetched when hovering over list items
- Quiz questions are not prefetched (they require an active attempt)

### Bundle Optimization

- Tree shaking is handled by Next.js + Webpack automatically
- Icons are imported individually (not entire icon libraries)
- `tailwind.config.ts` content paths are configured to purge unused CSS
- No unused npm packages (audited before each phase)

---

## 15. Coding Standards

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Component file | `kebab-case.tsx` | `stats-card.tsx` |
| Hook file | `kebab-case.ts` | `use-dashboard-stats.ts` |
| Service file | `kebab-case.ts` | `dashboard.service.ts` |
| Type file | `kebab-case.ts` | `types.ts` |
| Constant file | `kebab-case.ts` | `query-keys.ts` |
| Store file | `kebab-case.ts` | `auth.store.ts` |

### Component Naming

| Type | Convention | Example |
|------|-----------|---------|
| React component | PascalCase | `StatsCard` |
| Hook | camelCase with `use` prefix | `useDashboardStats` |
| Service function | camelCase | `getDashboardStats` |
| Type / Interface | PascalCase | `DashboardStats` |
| Constant | UPPER_SNAKE_CASE | `API_ENDPOINTS` |
| Enum value | PascalCase | `QuizStatus.InProgress` |

### Import Order

```
1. React / Next.js imports
2. Third-party library imports
3. Internal aliases (@/ imports)
   a. Components
   b. Hooks
   c. Services
   d. Types
   e. Constants
   f. Utils
4. Relative imports (./sibling)
5. Style imports
```

### Export Rules

- Components: named export (not default)
- Hooks: named export
- Services: named export
- Types: named export
- Pages: default export (Next.js requirement)

### General Rules

1. **No `any` type.** Use `unknown` and narrow with type guards.
2. **No inline styles.** Use Tailwind classes.
3. **No magic strings.** Use constants from `constants/`.
4. **No console.log in production.** Use a logger utility that is stripped in production builds.
5. **No nested ternaries.** Use early returns or if/else.
6. **Max file length: 300 lines.** If longer, split into smaller components.
7. **Max function length: 50 lines.** Extract helpers.
8. **All API types match backend contracts.** Types are manually verified against the API response contracts.

---

## 16. Development Workflow

### Feature Development Process

```
Plan Feature
    ↓
Review Stitch Design
    ↓
Approve Design Match
    ↓
Create Feature Branch (feature/{name})
    ↓
Define Types (types.ts)
    ↓
Create Service Functions (*.service.ts)
    ↓
Create React Query Hooks (hooks/)
    ↓
Build UI Components (components/)
    ↓
Wire Components to Hooks
    ↓
Build Page (app/)
    ↓
Manual Test Against Live API
    ↓
Test Edge Cases (empty state, error state, loading state)
    ↓
Test Responsive (mobile, tablet, desktop)
    ↓
Git Commit
    ↓
Move to Next Feature
```

### Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/{name}` | Individual feature work |
| `fix/{name}` | Bug fixes |

### Commit Convention

```
feat: add dashboard stats cards
fix: handle empty state in bookmarks
style: align quiz option cards
refactor: extract question card component
chore: update dependencies
```

### Definition of Done

A feature is "done" when:

1. ✅ All Stitch design elements are implemented
2. ✅ All API integrations work against the live backend
3. ✅ Loading state renders a skeleton
4. ✅ Error state renders a retry option
5. ✅ Empty state renders a helpful message
6. ✅ Responsive on mobile, tablet, and desktop
7. ✅ No TypeScript errors
8. ✅ No ESLint warnings
9. ✅ Committed with a descriptive message

---

## 17. Frontend Development Phases

---

### Phase 3A — Foundation

**Objective:** Set up the Next.js project with all tooling, configuration, and architectural scaffolding.

**Dependencies:** None.

**Deliverables:**
- Initialized Next.js project with App Router
- TypeScript configuration
- Tailwind CSS configured with Stitch design tokens
- shadcn/ui initialized
- ESLint + Prettier configured
- Folder structure created (all directories from section 3)
- Environment variables defined (`.env.local`, `.env.example`)
- API client created (Axios instance with interceptors)
- React Query client configured
- Zustand stores created (auth, UI)
- Global types defined (API envelope, User, common types)
- Constants defined (routes, API endpoints, query keys)
- Middleware stub created
- Root layout with provider wrappers

**Acceptance Criteria:**
- `npm run dev` starts without errors
- `npm run build` completes without errors
- Tailwind classes render correctly
- shadcn/ui Button component renders
- API client can make a request to the backend (manual test)

---

### Phase 3B — Design System

**Objective:** Build the reusable component library from Stitch designs.

**Dependencies:** Phase 3A.

**Deliverables:**
- All shadcn/ui primitives configured (Button, Input, Card, Dialog, DropdownMenu, Badge, Skeleton, Toast, Tabs, Table, Avatar, Progress)
- Shared components: Logo, EmptyState, ErrorState, PageHeader, StatCard
- Layout components: PublicNav, PublicFooter, StudentSidebar, StudentTopBar
- Global CSS finalized (dark mode support)
- Typography scale applied
- Color palette applied
- Loading skeletons for all major content types

**Acceptance Criteria:**
- Component showcase page renders all components correctly
- Light and dark themes toggle without artifacts
- Responsive on all breakpoints
- All components match Stitch designs

---

### Phase 3C — Authentication

**Objective:** Implement the complete auth flow.

**Dependencies:** Phase 3B.

**Deliverables:**
- Login page (`/login`)
- Login form with validation (React Hook Form + Zod)
- JWT token storage (in-memory + refresh token persistence)
- Silent token refresh (Axios interceptor)
- Session restoration on page refresh
- Logout flow with cache clearing
- `middleware.ts` route protection
- Auth redirect logic (`?redirect=` support)
- Suspended account handling

**Acceptance Criteria:**
- Login with valid credentials → redirects to dashboard
- Login with wrong password → shows error
- Login when rate limited → shows rate limit message
- Page refresh → session restored silently
- Expired token → silently refreshed
- Logout → clears all state, redirects to login
- Visiting `/dashboard` without auth → redirects to login
- Visiting `/login` when authenticated → redirects to dashboard

---

### Phase 3D — Dashboard

**Objective:** Build the student dashboard — the primary landing page after login.

**Dependencies:** Phase 3C.

**Deliverables:**
- Dashboard page (`/dashboard`)
- Stats cards (total attempts, accuracy, bookmarks, weak topics)
- Progress section (overall, subjects, chapters)
- Continue learning card
- Study plan section (priority topics, weak subjects, daily plan)
- Streak indicator
- All loading skeletons
- Empty state for new students

**Acceptance Criteria:**
- Dashboard renders all 4 API responses
- New student sees empty state with guidance
- Active student sees real data
- Loading states show skeletons
- Error states show retry buttons

---

### Phase 3E — Content

**Objective:** Build the subject/chapter/collection browsing experience.

**Dependencies:** Phase 3D.

**Deliverables:**
- Subject listing page
- Subject detail page (with chapter list)
- Chapter detail page (with collection list)
- Collection detail page (with "Start Quiz" CTA)
- Public content pages (marketing nav layout)
- Student content pages (sidebar layout)
- Content filtering (chapters by subject, collections by chapter)

**Acceptance Criteria:**
- Full navigation path: Subjects → Chapters → Collections
- Filtering works correctly
- Inactive collections are not displayed
- "Start Quiz" CTA creates an attempt and navigates to quiz page
- Public visitors can browse content without authentication
- Public visitors clicking "Start Quiz" are redirected to login

---

### Phase 3F — Quiz

**Objective:** Build the core quiz engine — the heart of the product.

**Dependencies:** Phase 3E.

**Deliverables:**
- Quiz start flow (POST /quiz/start → navigate to quiz)
- Quiz interface page
  - Question display with 4 options (A/B/C/D)
  - Option selection with instant feedback
  - Question navigation (next/previous)
  - Progress indicator (question X of Y)
  - Submit/Complete quiz button
- Quiz result page (score summary, gamification feedback)
- Quiz review page (all questions with correct answers and explanations)
- Quiz history page (paginated, filterable)
- Gamification modal after completion (XP earned, badges unlocked)

**Acceptance Criteria:**
- Complete quiz lifecycle works end-to-end
- Questions display in correct order (sort_order ASC, id ASC)
- Answering shows is_correct and correct_option immediately
- Completing shows score and gamification data
- Review shows all questions with explanations
- History is paginated with correct totals
- Cannot access another student's attempt

---

### Phase 3G — Analytics, Revision, Gamification, Notifications

**Objective:** Build all remaining student features.

**Dependencies:** Phase 3F.

**Deliverables:**

**Analytics:**
- Performance page with subject accuracy chart and chapter breakdown
- Weak area identification

**Revision:**
- Bookmarks page with bookmarked question list
- Wrong questions page
- Bookmark toggle from quiz review and revision pages
- Optimistic UI updates for toggle

**Gamification:**
- Achievements page (badges + achievements)
- Leaderboard page (weekly/monthly/all-time tabs)
- XP and streak display in dashboard and sidebar
- Post-quiz gamification feedback

**Notifications:**
- Notification page with paginated feed
- Unread count badge in topbar
- Mark read / mark all read
- Notification type icons (badge, achievement, general)
- Background polling for new notifications

**Acceptance Criteria:**
- Analytics charts render accurately
- Bookmarks can be toggled and list updates instantly
- Wrong questions are ordered correctly
- All 12 badges render (earned + locked)
- Leaderboard shows correct rankings with current user position
- Notifications paginate correctly
- Unread count updates in real-time

---

### Phase 3H — Public Website, Optimization, Deployment

**Objective:** Build the marketing website and prepare for production.

**Dependencies:** Phase 3G.

**Deliverables:**

**Public Website:**
- Landing page (from Stitch `landing-page/Home.png`)
- Pricing page
- SEO metadata for all public pages
- Open Graph tags
- Sitemap generation

**Optimization:**
- Lighthouse audit (target: 90+ on all metrics)
- Bundle analysis and optimization
- Image optimization
- Font loading optimization
- Core Web Vitals compliance

**Deployment:**
- Vercel deployment configuration
- Environment variables for production
- Custom domain (mdcatinsecond.com) configuration
- Production CORS origin added to WordPress

**Acceptance Criteria:**
- Landing page matches Stitch design
- Lighthouse Performance ≥ 90
- Lighthouse Accessibility ≥ 95
- Lighthouse SEO ≥ 95
- Production build deploys to Vercel without errors
- All API calls work against Hostinger backend
- CORS allows requests from production domain

---

## 18. Future Scalability

The architecture is designed to accommodate future modules without restructuring.

### Adding a New Feature Module

To add a new feature (e.g., AI Tutor):

1. Create `src/features/ai-tutor/` with `components/`, `hooks/`, `types.ts`
2. Create `src/services/ai-tutor.service.ts`
3. Add query keys to `constants/query-keys.ts`
4. Add routes to `constants/routes.ts`
5. Create pages in `app/(student)/ai-tutor/`

No existing code needs to change.

### Planned Future Modules

| Module | Frontend Impact | Architectural Notes |
|--------|----------------|-------------------|
| **AI Tutor** | New feature module, chat-like UI | WebSocket or SSE for streaming responses. New `features/ai-tutor/`. |
| **Flashcards** | New feature module, swipeable cards | Local state for card flip. New `features/flashcards/`. |
| **Notes** | New feature module, rich text editor | Dynamic import for editor library. New `features/notes/`. |
| **Mock Exams** | Extension of quiz module | Reuses quiz components with timer constraints. May extend `features/quiz/`. |
| **Live Tests** | Extension of quiz module + real-time | WebSocket for simultaneous start/end. Extends `features/quiz/`. |
| **Discussion Forum** | New feature module | Paginated threads. New `features/forum/`. |
| **Admin Frontend** | Separate Next.js app or route group | Could be a new `(admin)` route group with its own layout, or a separate deployment. Admin APIs would need REST endpoints first. |
| **Mobile App** | React Native app | Shares `services/`, `types/`, and `constants/` via a shared package. UI components are platform-specific. |

### Scalability Guarantees

1. **Feature isolation.** Each feature module is independent. Adding a feature does not modify existing features.
2. **Service layer reuse.** Service functions are framework-agnostic. A React Native app could import the same service layer.
3. **Type safety.** TypeScript interfaces catch API contract changes at compile time. When the backend adds a field, the frontend type must be updated.
4. **Cache coordination.** React Query's cache invalidation system handles cross-feature data dependencies (e.g., quiz completion invalidates dashboard, analytics, and gamification caches).
5. **Layout extensibility.** The student sidebar is data-driven — adding a new navigation item is a single entry in a configuration array.
