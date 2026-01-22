# Next.js API Routes & Prisma Integration Guide

This document explains the lifecycle of an API request in a Next.js application and how it interacts with Prisma to perform database operations, specifically focusing on the `PUT /api/admin/events/[id]` route.

## 1. Route Identification (File-System Routing)

Next.js uses the directory structure within `apps/web/app/` to define URLs.

- **Routing Root**: The `app/` folder is the starting point. It is **not** included in the URL.
- **Path Mapping**:
  `app/api/admin/events/[id]/route.ts` 
  maps to 
  `PUT /api/admin/events/:id`

> [!NOTE]
> Everything before `app/` (like `apps/web/`) belongs to your project's workspace organization and is ignored by the router.

## 2. Handling the Request (Next.js Layer)

When a request like `PUT /api/admin/events/123` hits the server, Next.js enters the `route.ts` handler.

### The Dynamics Segment (`[id]`)
In Next.js 15+, `params` is a **Promise**. You must unwrap it using `await` before you can access properties like `id`.

```typescript
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Type as Promise
) {
    // 1. Unwrapping parameters
    const { id: eventId } = await params; // eventId = "123"
    
    // 2. Parsing Request Body
    const body = await req.json(); // { title: "New Name", ... }
    
    // ... validation logic ...
}
```

## 3. Database Operation (Prisma Layer)

Prisma is the bridge between your code and the database. It doesn't know about URLs; it only knows about **data**.

### The Transfer of Data
Once you have extracted the `eventId` from the URL via Next.js, you manually pass it to a Prisma function.

```typescript
// Continuing inside the same PUT function:

const event = await prisma.event.update({
    where: { 
        id: eventId // Next.js provided '123' -> Prisma uses it for the SQL WHERE clause
    },
    data: {
        title: body.title,
        category: body.category,
        // ... other fields
    }
});
```

## 4. Middleware & Authentication Redirection

While Next.js handles routing, **Middleware** acts as a security layer that intercepts requests before they reach the route handler or the page.

### The Security Guard Analogy
- **Routing** is the **Map**: It defines that the "Admin Office" is in Room 101 (`/dashboard`).
- **Middleware** is the **Security Guard**: Holds the door and checks for a valid session cookie *before* letting anyone in.

### Automatic Redirection Flow
In this project, `middleware.ts` protects the `/dashboard` routes:

```typescript
// apps/web/middleware.ts
import { withAuth } from "next-auth/middleware";
export default withAuth;
export const config = { matcher: ["/dashboard/:path*"] };
```

If a user is **not logged in**:
1. NextAuth middleware intercepts the request to `/dashboard`.
2. It checks `authOptions.pages.signIn` configuration in `lib/auth-options.ts`.
3. It automatically redirects the user to the login page (e.g., `/login`).

## 5. End-to-End Flow Summary

| Stage | Layer | Responsibility | Knowledge of URL |
| :--- | :--- | :--- | :--- |
| **Request** | Browser | Sends HTTP PUT to `/api/admin/events/123` | ✅ Full |
| **Security** | Middleware | Intercepts request to check authentication | ✅ Full |
| **Router** | Next.js | Matches file path and extracts `params.id` | ✅ Full |
| **Handler** | Your Code | Receives params, validates, and calls Prisma | 🌓 Partial |
| **ORM** | Prisma | Converts JS object to SQL: `WHERE id = '123'` | ❌ None |
| **Database** | Postgres | Executes SQL update on the row with ID `123` | ❌ None |

## Key Takeaway
**Next.js** handles the "Outer Shell" (HTTP, URLs, routing, params, and middleware protection). **Prisma** handles the "Inner Core" (Database connections, SQL generation, type-safe queries). They are connected solely by the data you pass between them in your Route Handler functions.
