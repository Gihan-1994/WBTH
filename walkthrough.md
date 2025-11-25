# Walkthrough - Fixing Guide Availability Type Error

I have fixed the TypeScript error in `apps/web/app/api/guide/profile/route.ts` where the `availability` property was missing from the `Guide` type.

## Changes

### Prisma Schema

I added the `availability` field to the `Guide` model in `packages/prisma/schema.prisma`.

```prisma
model Guide {
  // ...
  price      Float?
  availability Boolean @default(true) // Added this field
  user       User     @relation(fields: [user_id], references: [id])
  // ...
}
```

### Database and Client

I ran the following commands to apply the changes:

1.  `npx prisma generate` - To regenerate the Prisma Client with the new field.
2.  `npx prisma db push` - To update the database schema.

## Verification

### API Route

The file `apps/web/app/api/guide/profile/route.ts` should now compile correctly as the `Guide` type now includes `availability`.

```typescript
// This should now work without error
availability: user.guide?.availability || false,
```

### Frontend

The frontend at `apps/web/app/guide/dashboard/page.tsx` was already expecting this field, so it should now correctly display and update the availability status.
