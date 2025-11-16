# Web‑Based Tourism Hub (WBTH)

## Delivery Plan (1.5 Months / 6 Weeks)

**Methodology:** Agile with weekly sprints, demo each Friday, code freeze in Week 6 mid‑week.

### Week 1 — Foundations & Environments
- Repo setup (frontend, backend, ML service) with shared conventions.
- CI/CD (GitHub Actions): lint, test, build, deploy to staging.
- Provision cloud resources: Vercel (Next.js), Google Cloud Run (Flask ML & Node API), Neon/Postgres.
- App scaffolding: Next.js (app router), Auth (NextAuth, JWT), Prisma schema bootstrap.
- Design system: Tailwind base tokens, UI shells for key pages.
- Definition of Done (DoD) & tracking board.

**Deliverables:** running staging URLs; DB migrations v1; auth skeleton; basic UI frame.

### Week 2 — Core Domain Models & User/Auth Flows
- Implement entities: User, Guide, AccommodationProvider, Accommodation, Booking, Event, Rating, Payment (model), Notification.
- Role‑based access control & email verification.
- Profile create/edit for Tourist/Guide/Provider.
- Seed scripts & fixtures.

**Deliverables:** CRUD + RBAC for core entities; verified email login; seeded demo data.

### Week 3 — Booking & Availability
- Accommodation search filters (budget, location, amenities); map view.
- Guide discovery filters (language, expertise, location); availability calendar.
- Booking creation/cancel flows; status transitions; email notifications.
- Payment **model** integration (recording only) and receipts; admin dashboards (basic).

**Deliverables:** end‑to‑end booking for accommodation & guides (without card capture); transactional emails.

### Week 4 — ML Recommenders & Guide Matching
- Flask ML service endpoints:
  - `POST /recommendations/accommodations`
  - `POST /match/guides`
- Collaborative + content‑based hybrid using seeded interactions.
- Relevance scoring & A/B toggle; feedback collection (likes, skips, ratings).

**Deliverables:** personalized cards with match %; telemetry on clicks; ML unit tests.

### Week 5 — Events, Chatbot, Performance & QA
- Event discovery & admin curation; location‑based suggestions.
- Botpress chatbot embed and handoff links to pages.
- Perf passes: API 95p <1s, page LCP target <3s on staging.
- Accessibility checks; responsive polish; error states; empty states.

**Deliverables:** events module; chatbot online; perf and a11y report; beta sign‑off.

### Week 6 — Harden, Document, Launch
- Security review (authz matrix, rate‑limits, input validation, audit logging).
- Observability: logs, metrics, alerts; synthetic checks; backups.
- Final UAT; fix & doc sprint.
- Production cutover; monitoring dashboard & runbook.

**Deliverables:** production release; release notes; admin and user guides.

---

## High‑Level Architecture

- **Frontend (Next.js 13+ / TypeScript / Tailwind)** on **Vercel**.
- **Backend API: Next.js API routes (v1)** on **Vercel**; **Future:** dedicated **Node.js/Express** service on **Google Cloud Run** with matching REST contracts.
- **ML Service (Python/Flask, scikit‑learn)** on **Google Cloud Run**.
- **Database: PostgreSQL (Neon) via Prisma ORM**.
- **Email/Notifications:** SMTP (Gmail/Brevo) via server actions.
- **Maps/Location:** Leaflet + provider tiles; geocoding provider (swappable).

**Why Postgres?** Aligns with the interim report’s choice and Prisma support; SRS permits Prisma; see Compatibility notes below.

### ASCII Diagram
```
[ Browser ]
    |  HTTPS
    v
[ Next.js (Vercel) ] -- REST --> [ Node.js API (Cloud Run) ] -- Prisma --> [ Postgres (Neon) ]
        |                               |
        | gRPC/REST                    | REST
        v                               v
[ Flask ML (Cloud Run) ]           [ SMTP / Email ]
        |
        v
   [ Model Store ]
```

---

## Modules & Responsibilities

### 1) Identity & Access
- NextAuth (email/password), JWT (24h expiry + refresh), email verification.
- Roles: `tourist`, `guide`, `accommodation_provider`, `admin`.
- Middleware guards per route; audit log for auth events.

### 2) Catalogue & Profiles
- **Accommodation Provider**: property listings, amenities, pricing, photos, availability.
- **Guide**: certifications, languages[], expertise[], price, geo areas, calendar.
- **Tourist**: preferences (budget, interests, sustainability flags), history.

### 3) Booking
- Create/Cancel flows for accommodation or guide (one type per booking).
- States: `pending` → `confirmed` → `cancelled`.
- Notifications to all parties; receipt generation.
- **Payments (Model)**: record intent & outcome; no card capture in v1.

### 4) Recommendations (ML)

**Services & Endpoints**
- Flask service on Cloud Run
  - `POST /recommendations/accommodations` → ranked list of accommodations `{id, score, reasons[], filters_applied[]}`
  - `POST /match/guides` → ranked list of guides `{id, score, reasons[], filters_applied[]}`

**Shared Inputs**
- **Data (from PostgreSQL):** pulled via read‑only service account.
- **User preferences (from UI):** posted in request body.
- **Telemetry:** clicks, likes/skips, bookings feed back as implicit signals.

---

#### 4.1 Accommodation Recommendation — Simple Hybrid (Rule‑first + Scored Ranking)

**Data columns (per your spec):** `id, name, price_range, province, interests[], group_size, travel_style, num_booking_dates, location (city + lat/lng or district), amenities[], rating, prior_bookings`.

**Hard Rule Filters (fast pre‑filter in DB):**
1) **Availability**: candidate has open dates overlapping desired range.
2) **Budget window**: requested budget intersects `price_range` (min/max).
3) **Required amenities**: set inclusion (e.g., must have `wifi` and `hot_water`).
4) **Location (optional hard filter)**: if the user explicitly selects *“city only”*, filter to that city; otherwise keep broader set and let scoring handle tiers.
5) **Group size fit**: `group_size` ≥ requested party size.

**Scoring (on remaining candidates):** Weighted sum in [0, 1].
- `S_interests` — overlap of interests (Jaccard on tag set).
- `S_style` — 1 if travel_style matches; else 0.
- `S_price` — price alignment: 1 if in range; else distance‑penalized.
- `S_amenities` — Jaccard similarity of amenities.
- `S_location` — **tiered location score** based on requested location:
  - if **within selected city** → `1.00`
  - else if **within selected province** → `0.60`
  - else (**outside province**) → `0.15`
  - if no location preference provided → `0.50`
- `S_group` — 1 if capacity fits; else 0.
- `S_rating` — min(1, rating/5) normalized.
- `S_popularity` — from **prior_bookings** (log‑scaled): `log(1+n) / log(1+n_max)`.

**Total score**
```
Score = w1*S_interests + w2*S_style + w3*S_price + w4*S_amenities +
        w5*S_location + w6*S_group + w7*S_rating + w8*S_popularity
```
- Start weights: `w = [0.2, 0.05, 0.10, 0.15, 0.15, 0.10, 0.20, 0.05]`  
  (↑ gave a little more weight to location tiers; popularity reduced slightly.)
- Tie‑breakers: higher `rating`, then higher `prior_bookings`, then closer distance.

**Returned reasons** (for transparency): top 3 facets (e.g., _“within selected city; matches coastal & adventure; has pool & wifi”_).

**Rule‑Based Filtering (post‑score pruning):**
- Safety/content rules (e.g., adult‑only flags if user has minors), blackout rules, provider status.

**Data/Infra Notes:**
- Keep denormalized, query‑friendly columns (arrays) in Postgres; add GIN indexes for `interests[]` and `amenities[]`.  
- Store `province` as an enum/text with btree index; maintain city→province lookup.
- Optionally cache candidate IDs per (province, budget, amenities) bucket in Redis.

---

#### 4.2 Guide Matching — Simple, Transparent Ranker

**Data columns:** `id, name, duration, location (city), province, languages[], specializations[], gender, prior_bookings, rating`.

**Hard Rule Filters:**
1) **Duration**: guide supports the requested duration (exact or within ± bucket: half‑day, 1 day, 2–3 days, 4+).
2) **Language**: must include at least one requested language; prefer all.
3) **Location (optional hard filter)**: if the user selects *“city only”*, filter to that city; otherwise keep broader set and use tiered scoring below.
4) **Gender preference**: respected if provided.

**Scoring (point‑additive, then normalized to [0,1]):**
- **Location tier**: +3 if within **selected city**; +2 if within **selected province**; +0 if outside.
- **Languages**: +3 per exact match (cap at requested count).
- **Specializations**: +3 for any overlap; +1 per extra overlap up to +5 total.
- **Duration fit**: +2 if exact bucket; +1 if adjacent bucket.
- **Gender**: +1 if matches preference.
- **Popularity** (prior_bookings): +1 if above median; +2 if top quartile.
- **Rating**: up to +3 scaled from rating (e.g., `rating/5 * 3`).

**Normalization**: divide by max attainable points for the given request to produce a 0‑1 score.

**Returned reasons:** e.g., _“City match; English & Sinhala; Wildlife & Photography; 1‑day fit; high rating.”_

**Why simple?** Deterministic, explainable, minimal data. Later, swap in logistic regression/GBDT once we have labeled outcomes.

---

#### 4.3 Evaluation & Feedback Loop & Feedback Loop
- **Offline:** curated queries → expected top‑k; measure Precision@k, MAP.
- **Online:** CTR, booking conversion, dwell time; A/B flag for weight sets.
- **Quality checks:** filter correctness, reason strings, cold‑start handling.

---

#### 4.4 Implementation Plan (Tasks)

**High‑Level Epics**
1) **Data & Indexing** — schemas, seeders, read models, indexes.
2) **Filtering Engine** — fast SQL filters + validation.
3) **Scoring Engine** — Python score calculators (accom & guide).
4) **API & Contracts** — request/response DTOs, error semantics, reasons[].
5) **Caching & Perf** — candidate caching, warm instances, timeouts.
6) **Telemetry & A/B** — events, dashboards, config for weights.
7) **QA & Launch** — test packs, guardrails, docs.

**Low‑Level Tasks (selected)**
- **Data & Indexing**
  - Add arrays: `interests[]`, `amenities[]`, `languages[]`, `specializations[]`.
  - Spatial support: store `lat, lng` (or districts) + Haversine helper.
  - Indexes: GIN on array cols; btree on `price_min/price_max`, `rating`, `region`.
  - Materialized view: availability windows per accommodation.
- **Filtering Engine**
  - SQL builders for: availability overlap, budget, geo, required amenities, group size.
  - Validation of user input (enums, ranges) + error codes.
- **Scoring Engine (Accommodation)**
  - Similarity functions (Jaccard, distance penalty, price alignment).
  - Compose weighted score; expose top‑k with `reasons[]`.
- **Scoring Engine (Guide)**
  - Point‑additive scoring and normalization.
- **API & Contracts**
  - DTOs: `/recommendations/accommodations` & `/match/guides`.
  - Include `filters_applied[]`, `reasons[]`, and `debug` flag (admin only).
- **Caching & Perf**
  - LRU cache of candidates per (geo,budget,amenities) key.
  - Response cache for identical queries (short TTL).
  - Cloud Run min instance = 1 (warm starts); 2s upstream timeout; 3 retries.
- **Telemetry & A/B**
  - Events: impression, click, like/skip, booking (IDs only).
  - Config store for weights; experiment toggles.
- **QA & Launch**
  - Synthetic query suite; P@5 thresholds; guardrail tests for filters.
  - Red‑team cases (empty results, conflicting prefs, extreme distances).

**Deliverables**
- Working endpoints returning ranked lists with clear reasons.
- Docs: algorithm overview, weight config, examples, and test plan.

---

### 5) Events
- Admin‑curated events; categories; geolocation; date range queries.
- Surfacing near travel dates and user interests.

### 6) Chatbot
- Botpress webchat widget; deep links to app pages; escalation guidance.

### 7) Admin
- User moderation; verification workflows; payments list; content management; metrics.

---

## API Surface (selected)

**Auth**
- `POST /auth/register` — role‑aware registration + email verify trigger.
- `POST /auth/login` — JWT session.
- `POST /auth/verify` — complete email verification.

**Profiles**
- `GET/PUT /me` — current user profile.
- `GET /guides?lang=&expertise=&geo=&available=`
- `GET /accommodations?budget=&geo=&amenities=`

**Bookings**
- `POST /bookings` — create (type: `accommodation|guide`).
- `PATCH /bookings/:id/cancel`
- `GET /bookings/mine`

**Payments (model)**
- `POST /payments` — record; attach to booking.

**Events**
- `GET /events?category=&from=&to=&near=`
- `POST /events` (admin)

**ML**
- `POST /ml/recommendations/accommodations`
- `POST /ml/match/guides`

---

## Data Model (Prisma/Postgres)

- **User**(id UUID, name, email unique, password_hash, contact_no, role, created_at)
- **Guide**(user_id FK, experience[], languages[], expertise[], rating, account_no, price)
- **AccommodationProvider**(user_id FK, provider_id UUID, company_name)
- **Accommodation**(provider_id FK, name, type[], amenities[], rating, account_no, budget[], location)
- **Booking**(id UUID, user_id FK, type, start_date, end_date, location, price, status, description[])
- **Rating**(id UUID, provider_id FK, rating)
- **Event**(id UUID, category, date, location, description[])
- **Payment**(id UUID, receiver_id, sender_id, booking_id, amount, status)
- **Notification**(id UUID, type, message[], created_at)
- **Admin**(id UUID, email, password_hash)

> Notes: Use generated ULIDs/UUIDs; timestamps with time zone (timestamptz); partial indexes for frequently filtered fields; text[] to mirror current docs; consider EAV or JSONB later for flexible attributes.

---

## Non‑Functional Requirements (NFRs)
- **Performance:** API p95 < 1000 ms; ML recommendations < 5 s (cold) / < 1 s (warm).
- **Scalability:** stateless services on Cloud Run with min instances for ML warm‑start.
- **Security:** JWT rotation, rate limits, input validation, output encoding, TLS, secrets in GCP/Vercel.
- **Privacy:** store minimal PII; encrypt at rest & in transit; delete/anonymize on request.
- **Observability:** structured logs, metrics (latency, error rates), tracing between Next/API/ML.

---

## CI/CD & Environments
- **Branches:** `main` (prod), `develop` (staging), PR branches.
- **Pipelines:** lint → unit tests (TS/Py) → build → integration tests → deploy to staging → UAT gate → prod.
- **Database:** Prisma migrations; shadow DB for CI; daily backups; point‑in‑time recovery.

---

## Testing Strategy
- **Unit:** Vitest (API), RTL/Playwright (UI), Pytest (ML).
- **Integration:** Postman collections in CI; DB integration; contract tests for ML.
- **Performance:** k6/Locust; DB query plans reviewed.
- **UAT:** scripts per persona; accessibility checks (axe‑core); mobile sanity.

---

## Risk Register & Mitigations (excerpt)
- **Cold ML latency** → keep 1 warm instance; cache top‑N per segment.
- **Data quality sparse** → bootstrap with curated data; collect implicit feedback.
- **Auth complexity** → reuse NextAuth flows; small, audited surface.
- **Map provider limits** → abstract map adapters; configurable tiles.

---

## Definition of Done (per feature)
- Story & acceptance criteria met; unit + integration tests pass; accessibility reviewed; telemetry added; docs updated; demo recorded.

---

## Compatibility Notes (SRS vs Interim)
- **DB:** Interim favors **PostgreSQL + Prisma**. We will **standardize on PostgreSQL for deployment** (Prisma supports both PostgreSQL and MySQL) while keeping schemas portable should a future switch be required.
- **Backend:** Interim allows **Next.js API routes now** with a **future dedicated backend**. We will follow **Interim** for v1 by implementing all APIs in **Next API routes on Vercel**. Later, we can introduce a dedicated **Node.js/Express** service on Cloud Run with identical REST contracts to maintain compatibility.
- **Tooling:** Yarn workspaces + Turborepo; TypeScript across Node/Next; Ruff/Black for Python; ESLint/Prettier; commitlint + conventional commits. _Initialize Yarn via npm:_ `npm install yarn` then use `yarn`.

---

## Acceptance Criteria for Final Submission
- Deployed production URLs (frontend, API, ML) and credentials for test users of all roles.
- Create/cancel bookings end‑to‑end with emails.
- Personalized accommodation and guide results surfaced with visible match scores.
- Events browsing with filters and details pages.
- Admin dashboards to verify users and moderate content.
- Release notes + user/admin guides + architecture README.


---

## Monorepo Architecture & Developer Experience (DX)

**Tooling:** pnpm workspaces + Turborepo; TypeScript across Node/Next; Ruff/Black for Python; ESLint/Prettier; commitlint + conventional commits.

**Repo Layout**
```
wbth/
  apps/
    web/            # Next.js 13+ (app router + API routes for v1)
    api/            # (future) Node.js/Express service (migrate from Next API routes later)
    ml/             # Flask service (recommendations & matching)
  packages/
    ui/             # shared React UI components (Tailwind + shadcn)
    config/         # eslint, tsconfig, jest, prettier shared configs
    lib/            # shared TS utilities (schemas, DTOs, guards)
    prisma/         # Prisma schema, migrations, seeders
  infra/
    gcp/            # Cloud Run, Neon, etc. IaC (Terraform or Pulumi)
    vercel/         # project config & env templates
  docs/             # architecture, ADRs, API docs, runbooks
  .github/          # actions
  turbo.json
  pnpm-workspace.yaml
```

**Workspaces (package.json)**
```json
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```
packages:
  - "apps/*"
  - "packages/*"
```

**Turborepo pipes (turbo.json)**
- `build`: web → api → ml (ml independent), packages as deps
- `lint`, `test`, `typecheck`, `dev`, `deploy`

**Scripts (root)**
- `dev`: `turbo run dev --parallel`
- `build`: `turbo run build`
- `test`: `turbo run test`
- `lint`: `turbo run lint`
- `migrate`: `yarn workspace packages/prisma prisma migrate deploy`
- `seed`: `yarn workspace packages/prisma prisma db seed`

**Env Management**
- `.env.example` at root; per‑app `.env` files; use Doppler/GCP Secrets for prod.

**IDE Setup**
- Recommend VS Code with Workspace settings: formatOnSave, eslint.validate, Python venv for `apps/ml`.
- Debug configs: `.vscode/launch.json` for web/api/ml; automatic port forwarding.

---

## Implementation Work Plan — High‑Level & Low‑Level Tasks by Module
*(Designed as IDE‑friendly, copy‑paste checklists and file paths.)*

### A) Identity & Access (NextAuth + JWT + RBAC)
**High‑Level Tasks**
1. Auth flows (register, verify email, login, logout, password reset).
2. RBAC (tourist, guide, provider, admin) with API/route guards.
3. Audit logging of auth events.

**Low‑Level Tasks**
- **apps/web**
  - `app/(auth)/register/page.tsx`: form w/ zod validation; POST `/api/auth/register`.
  - `app/(auth)/login/page.tsx`: NextAuth credentials provider UI.
  - `middleware.ts`: protect routes by role.
  - `lib/auth.ts`: NextAuth config; JWT callbacks to embed role & userId.
- **apps/api**
  - `src/routes/auth.ts`: `POST /auth/register|login|verify`.
  - `src/middleware/requireRole.ts`: guard; map roles → routes.
  - `src/logging/audit.ts`: `audit("auth", {...})` structured logs.
- **packages/prisma**
  - `schema.prisma`: `User`, `VerificationToken` models; unique email; role enum.
  - Seed: demo users for all roles.

### B) Catalogue & Profiles
**High‑Level Tasks**
1. Provider/Guide/Tourist profile CRUD.
2. Media upload (images) with signed URLs.
3. Search lists with filters & pagination.

**Low‑Level Tasks**
- **DB/Model**: `Guide`, `AccommodationProvider`, `Accommodation` with arrays & indexes; `Province`, `City` tables or enums.
- **API**: `GET/PUT /me`, `GET /guides`, `GET /accommodations` with query builders for price, province, city, amenities, languages, specialization.
- **Web**: filter panels (autocomplete for city/province), cards, pagination, skeleton loaders.
- **Media**: upload component → API route → cloud storage (GCS) signed PUT; store public URL.

### C) Booking Engine
**High‑Level Tasks**
1. Availability model (accommodation, guide).
2. Create/cancel bookings with status transitions.
3. Email notifications & receipts.

**Low‑Level Tasks**
- **DB**: `Availability` view/materialization; `Booking` with type enum; constraints: dates `start<=end`.
- **API**: `POST /bookings`, `PATCH /bookings/:id/cancel`, `GET /bookings/mine`.
- **Domain**: state machine (`pending→confirmed→cancelled`); invariants.
- **Web**: date pickers (range), conflict validation, success screens.
- **Emails**: templates in `packages/lib/email`; sender in `apps/api/src/services/email.ts`.

### D) Events Module
**High‑Level Tasks**
1. Admin CRUD for events; categories; geo/date filters.
2. Listing & detail pages with maps.

**Low‑Level Tasks**
- **DB**: `Event(id, title, category, start, end, city, province, location, description)`; GIN on category.
- **API**: `GET /events?category&from&to&near`, `POST /events` (admin).
- **Web**: `/events`, `/events/[id]`; map pin component; filters with URL state.

### E) Chatbot Integration (Botpress)
**High‑Level Tasks**
1. Embed widget; SSO handoff links.
2. Context links to pages.

**Low‑Level Tasks**
- Script loader in `apps/web/app/layout.tsx`.
- Handoff URLs including query params for prefilled searches.

### F) Admin Dashboard
**High‑Level Tasks**
1. User verification & moderation.
2. Content management (accommodations, guides, events).
3. Metrics overview.

**Low‑Level Tasks**
- **Web**: `/admin/*` routes; table components from `packages/ui`.
- **API**: admin guards; `GET /admin/stats`.
- **Charts**: basic charts with Recharts; server data hooks.

### G) Recommendations & Guide Matching (ML)
*(Detailed earlier; include only execution tasks here.)*
**High‑Level Tasks**
1. SQL candidate filters; DTOs; scoring functions; reasons[].
2. Flask endpoints; unit tests; A/B weights.
3. Integration in web (cards + reasons + like/skip events).

**Low‑Level Tasks**
- **apps/ml**: `accom.py`, `guide.py` for scorers; `api.py` (Flask routes); `tests/` with Pytest.
- **apps/api**: proxy routes `/ml/*` or service client w/ retries.
- **apps/web**: fetchers/hooks; UI for reasons & feedback buttons.

### H) Payments (Model Only)
**High‑Level Tasks**
1. Record payment intents/outcomes attached to bookings.
2. Receipt generation (PDF/HTML).

**Low‑Level Tasks**
- **DB**: `Payment(id, receiver_id, sender_id, booking_id, amount, status)`.
- **API**: `POST /payments` (record only).
- **Web**: receipt page; email template.

### I) Notifications & Email
**High‑Level Tasks**
1. Transactional emails and in‑app toasts.
2. Template library & preview.

**Low‑Level Tasks**
- **packages/lib/email**: MJML/React email templates; preview route `/dev/emails`.
- **API**: mailer service (SMTP/Brevo); queue option (later).

### J) Observability & Ops
**High‑Level Tasks**
1. Logging, metrics, traces; dashboards & alerts.
2. Backups & synthetic checks.

**Low‑Level Tasks**
- **Logging**: pino for Node; `structlog` for Python; request IDs propagated.
- **Metrics**: OpenTelemetry exporters; p95 latency SLOs.
- **Dashboards**: GCP + Vercel; uptime checks hitting health endpoints.
- **Backups**: Neon PITR; nightly verify script.

### K) Security & Compliance
**High‑Level Tasks**
1. Input validation; rate limiting; secret management.
2. AuthZ matrix review; least privilege service accounts.

**Low‑Level Tasks**
- Zod schemas for all DTOs; celebrate/Joi on Express.
- Helmet/CORS; `express-rate-limit`.
- Secrets via GCP Secret Manager; no secrets in repo.
- Periodic dependency audit (`pnpm audit`, `pip-audit`).

### L) CI/CD & Quality Gates
**High‑Level Tasks**
1. Build/lint/test pipelines; preview deploys; migrations.
2. UAT gates and release tagging.

**Low‑Level Tasks**
- **Actions**: `.github/workflows/ci.yml` with matrix: web/api/ml.
- **Preview**: Vercel preview for web; Cloud Run staging for api/ml.
- **Migrations**: job step `yarn workspace packages/prisma prisma migrate deploy`.
- **Artifacts**: Playwright reports, coverage; release notes generator (changesets).

### M) Testing Strategy (Executable)
**High‑Level Tasks**
1. Unit, integration, e2e (web), contract tests (API↔ML).

**Low‑Level Tasks**
- **Unit**: Vitest (web/api), Pytest (ml).
- **Integration**: Supertest (api); db test container; Postman collection in CI.
- **E2E**: Playwright flows (auth, search, booking, cancel).
- **Contract**: OpenAPI schemas; `schemathesis` fuzzing.

### N) Data & Migrations
**High‑Level Tasks**
1. Prisma schema evolution; seed data for demo.

**Low‑Level Tasks**
- `packages/prisma/schema.prisma` with enums (province, amenities, languages, specializations).
- Seeders for demo accommodations/guides/events with provinces/cities and prior_bookings.
- Migration scripts; `shadowDatabaseUrl` for CI.

---

## Sprint‑Friendly Backlog (6 Weeks)
- **W1**: Monorepo, auth skeleton, DB init, CI, staging envs.
- **W2**: Profiles & catalogue; search; media upload.
- **W3**: Booking engine; emails; admin basics.
- **W4**: ML endpoints & integration; reasons[] UI; telemetry.
- **W5**: Events; chatbot; performance; polish.
- **W6**: Security/observability; docs; UAT; production cutover.

