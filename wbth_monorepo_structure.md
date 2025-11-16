# WBTH Monorepo — Complete 6‑Week Implementation Folder Structure

This document lists a **production-ready monorepo layout** with **all files you’ll need** to implement the project in 6 weeks (Next.js + Prisma/Postgres + Flask ML). It includes a tree, file purposes, and minimal starter contents for key config files so the repo is immediately scaffoldable.

---

## Repository Tree

```text
wbth/
  .editorconfig
  .gitignore
  .nvmrc
  .prettierignore
  .prettierrc
  .eslintrc.cjs
  LICENSE
  README.md
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  .env.example
  .envrc.example
  scripts/
    dev.sh
    migrate.sh
    seed.sh
    lint.sh
    typecheck.sh
  .github/
    ISSUE_TEMPLATE/
      bug_report.md
      feature_request.md
    PULL_REQUEST_TEMPLATE.md
    workflows/
      ci.yml
      release.yml
  docs/
    README.md
    adr/
      0001-monorepo-structure.md
      0002-db-choice-prisma-postgres.md
      0003-auth-and-rbac.md
    api/
      openapi.yaml
      contracts.md
    runbooks/
      deploy-web-vercel.md
      deploy-ml-cloud-run.md
      rollback.md
      seeding.md
    wireframes/
      dashboard.png
      booking-flow.png
  infra/
    vercel/
      vercel.json
      env.example
    db/
      README.md
      docker-compose.postgres.yml
      backup.sh
      restore.sh
    gcp/
      cloudrun-service-ml.yaml
      service-account-ml.json.example
      README.md
  packages/
    prisma/
      package.json
      schema.prisma
      migrations/
        (auto-generated on first migrate)
      seed/
        index.ts
        users.ts
        guides.ts
        accommodations.ts
        events.ts
      src/
        client.ts
        types.ts
      tsconfig.json
      README.md
    ui/
      package.json
      src/
        index.ts
        components/
          Button.tsx
          Card.tsx
          Input.tsx
          Avatar.tsx
          Badge.tsx
          Toast.tsx
        styles/
          index.css
      tsconfig.json
      README.md
    lib/
      package.json
      src/
        auth/
          rbac.ts
          tokens.ts
        dto/
          index.ts
          user.ts
          guide.ts
          accommodation.ts
          booking.ts
          event.ts
          rating.ts
          payment.ts
          notification.ts
        validation/
          index.ts
          user.zod.ts
          booking.zod.ts
        utils/
          logger.ts
          fetcher.ts
          pagination.ts
          errors.ts
      tsconfig.json
      README.md
  apps/
    web/
      .env.example
      next.config.js
      postcss.config.js
      tailwind.config.ts
      tsconfig.json
      package.json
      middleware.ts
      public/
        favicon.ico
        logo.svg
        og.png
      app/
        layout.tsx
        globals.css
        page.tsx
        (auth)/
          layout.tsx
          login/page.tsx
          register/page.tsx
          verify/page.tsx
          reset-password/page.tsx
        (dashboard)/
          layout.tsx
          page.tsx
          tourist/page.tsx
          guide/page.tsx
          provider/page.tsx
          admin/page.tsx
        accommodations/
          page.tsx
          [id]/page.tsx
        guides/
          page.tsx
          [id]/page.tsx
        events/
          page.tsx
          [id]/page.tsx
        bookings/
          page.tsx
          new/page.tsx
          [id]/page.tsx
        api/
          auth/
            route.ts
            callback/route.ts
            register/route.ts
            reset/route.ts
          profiles/
            route.ts
          accommodations/
            route.ts
            [id]/route.ts
          guides/
            route.ts
            [id]/route.ts
          events/
            route.ts
            [id]/route.ts
          bookings/
            route.ts
            [id]/route.ts
          payments/
            route.ts
          ratings/
            route.ts
          notifications/
            route.ts
          ml/
            recommend/route.ts
            match-guide/route.ts
      components/
        Header.tsx
        Footer.tsx
        Nav.tsx
        AuthGuard.tsx
        DataTable.tsx
        EmptyState.tsx
        Loading.tsx
      lib/
        auth.ts
        prisma.ts
        email.ts
        api.ts
        rbac.ts
        constants.ts
        hooks/
          useDebounce.ts
          useToast.ts
      styles/
        prose.css
      tests/
        e2e/
          auth.spec.ts
          booking.spec.ts
        unit/
          api-auth.test.ts
          booking-utils.test.ts
        vitest.config.ts
      lint-staged.config.mjs
      playwright.config.ts
    ml/
      .env.example
      Dockerfile
      gunicorn.conf.py
      requirements.txt
      README.md
      wbth_ml/
        __init__.py
        api.py
        accom.py
        guide.py
        utils.py
        models/
          __init__.py
          accom_recommender.pkl (placeholder)
          guide_matcher.pkl (placeholder)
        tests/
          __init__.py
          test_api.py
          test_accom.py
          test_guide.py
```

---

## Key Files — Purpose & Minimal Starter Contents

> You can paste these directly to bootstrap the repo.

### Root configuration

**`package.json`**
```json
{
  "name": "wbth",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "migrate": "pnpm -C packages/prisma prisma migrate deploy",
    "seed": "pnpm -C packages/prisma prisma db seed"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "prettier": "^3.3.3"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**`.gitignore`**
```
node_modules
.env*
*.local
dist
.next
coverage
.mypy_cache
__pycache__/
*.pyc
.DS_Store
```
**`.editorconfig`**
```
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

**`pnpm-workspace.yaml`**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**`turbo.json`**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "dev": { "cache": false },
    "lint": {},
    "test": {},
    "typecheck": {}
  }
}
```

**`.env.example`**
```
# Shared
DATABASE_URL=postgresql://user:pass@host:5432/wbth
JWT_SECRET=replace-me

# Web
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-me
ML_SERVICE_URL=http://localhost:8080

# ML
PORT=8080
```

---

### `packages/prisma`

**`schema.prisma` (minimal skeleton — expand models as needed)**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(TOURIST)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  bookings  Booking[]
  ratings   Rating[]
}

model Guide {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String   @unique
  bio       String?
  skills    String[]
  ratings   Rating[]
}

model Accommodation {
  id          String   @id @default(cuid())
  name        String
  providerId  String
  location    String
  pricePerNight Int
  ratings     Rating[]
  bookings    Booking[]
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  startsAt    DateTime
  endsAt      DateTime
}

model Booking {
  id              String   @id @default(cuid())
  user            User     @relation(fields: [userId], references: [id])
  userId          String
  kind            BookingKind
  accommodation   Accommodation? @relation(fields: [accommodationId], references: [id])
  accommodationId String?
  guide           Guide?   @relation(fields: [guideId], references: [id])
  guideId         String?
  createdAt       DateTime @default(now())
  status          BookingStatus @default(PENDING)
}

model Rating {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  stars     Int
  comment   String?
  guide     Guide?        @relation(fields: [guideId], references: [id])
  guideId   String?
  accommodation Accommodation? @relation(fields: [accommodationId], references: [id])
  accommodationId String?
  createdAt DateTime @default(now())
}

model Payment {
  id        String   @id @default(cuid())
  booking   Booking  @relation(fields: [bookingId], references: [id])
  bookingId String
  amount    Int
  status    PaymentStatus @default(RECORDED)
  createdAt DateTime @default(now())
}

enum Role { ADMIN PROVIDER GUIDE TOURIST }
enum BookingKind { ACCOMMODATION GUIDE }
enum BookingStatus { PENDING CONFIRMED CANCELLED }
enum PaymentStatus { RECORDED FAILED REFUNDED }
```

**`src/client.ts`**
```ts
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
```

**`seed/index.ts`**
```ts
import { prisma } from '../src/client';
import users from './users';
import guides from './guides';
import accommodations from './accommodations';
import events from './events';

async function main() {
  await prisma.user.createMany({ data: users });
  // …create related guides, accommodations, events
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());
```

---

### `apps/web` (Next.js 13+ App Router)

**`package.json`**
```json
{
  "name": "@wbth/web",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "eslint .",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@prisma/client": "^5.18.0",
    "next": "14.2.5",
    "next-auth": "^5.0.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "eslint": "^9.11.0",
    "typescript": "^5.5.4",
    "vitest": "^2.0.0",
    "@types/node": "^20.11.30",
    "@types/react": "^18.2.66",
    "tailwindcss": "^3.4.9",
    "postcss": "^8.4.44",
    "autoprefixer": "^10.4.20"
  }
}
```

**`next.config.js`**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: true },
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  redirects: async () => [
    { source: '/dashboard', destination: '/(dashboard)', permanent: false }
  ]
};
module.exports = nextConfig;
```

**`middleware.ts`**
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // very light RBAC gate (expand later)
  if (path.startsWith('/(dashboard)') && !req.cookies.get('session')) {
    return NextResponse.redirect(new URL('/(auth)/login', req.url));
  }
  return NextResponse.next();
}
```

**`app/api/ml/recommend/route.ts`**
```ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const mlUrl = process.env.ML_SERVICE_URL ?? 'http://localhost:8080';
  const res = await fetch(`${mlUrl}/recommend`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data);
}
```

*(Create similar handlers for `match-guide`, `bookings`, `accommodations`, `guides`, etc.)*

**`lib/prisma.ts`**
```ts
import { PrismaClient } from '@prisma/client';
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
export const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
```

**`tailwind.config.ts`**
```ts
import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')]
};
export default config;
```

---

### `apps/ml` (Flask + Gunicorn on Cloud Run)

**`requirements.txt`**
```
flask
gunicorn
numpy
scikit-learn
pydantic
```

**`Dockerfile`**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY wbth_ml ./wbth_ml
EXPOSE 8080
CMD ["gunicorn", "-c", "wbth_ml/../gunicorn.conf.py", "wbth_ml.api:app"]
```

**`gunicorn.conf.py`**
```py
bind = "0.0.0.0:8080"
workers = 2
threads = 4
timeout = 30
```

**`wbth_ml/api.py`**
```py
from flask import Flask, request, jsonify
from wbth_ml.accom import recommend_accommodations
from wbth_ml.guide import match_guide

app = Flask(__name__)

@app.post("/recommend")
def recommend():
    payload = request.get_json(force=True)
    return jsonify(recommend_accommodations(payload))

@app.post("/match-guide")
def match():
    payload = request.get_json(force=True)
    return jsonify(match_guide(payload))

@app.get("/healthz")
def health():
    return {"ok": True}
```

**`wbth_ml/accom.py`**
```py
def recommend_accommodations(payload: dict):
    # Stub logic — replace with model inference
    return {"items": [], "explain": "cold start recommendation stub"}
```

**`wbth_ml/guide.py`**
```py
def match_guide(payload: dict):
    # Stub logic — replace with model inference
    return {"guides": [], "explain": "skills/location matching stub"}
```

---

### Infra

**`infra/vercel/vercel.json`**
```json
{
  "buildCommand": "pnpm -C apps/web build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

**`infra/db/docker-compose.postgres.yml`**
```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: wbth
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

---

## Development Scripts

**`scripts/dev.sh`**
```bash
#!/usr/bin/env bash
set -euo pipefail
pnpm -C packages/prisma prisma generate
pnpm -C apps/web dev &
python apps/ml/wbth_ml/api.py
```

**`scripts/migrate.sh`**
```bash
#!/usr/bin/env bash
set -euo pipefail
pnpm -C packages/prisma prisma migrate deploy
```

**`scripts/seed.sh`**
```bash
#!/usr/bin/env bash
set -euo pipefail
pnpm -C packages/prisma prisma db seed
```

---

## How to Use

1. **Install toolchain**
   ```bash
   corepack enable && corepack prepare pnpm@latest --activate
   pnpm i
   ```
2. **Start Postgres (optional local)**
   ```bash
   docker compose -f infra/db/docker-compose.postgres.yml up -d
   ```
3. **Env**
   - Copy `.env.example` to `.env` per app (`apps/web`, `apps/ml`) and set secrets.
4. **Generate & Migrate**
   ```bash
   pnpm -C packages/prisma prisma generate
   pnpm -C packages/prisma prisma migrate dev
   ```
5. **Run**
   ```bash
   pnpm dev
   ```

---

> Tip: keep Week 1 focused on scaffolding + auth + two core flows; Week 2 on catalogue + booking; Week 3 ML stubs; Weeks 4–5 polish/tests; Week 6 demo/QA.

