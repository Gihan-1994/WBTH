# Prisma Package

Shared Prisma ORM package for the WBTH tourism platform. This package contains the database schema, migrations, and Prisma client configuration used across the monorepo.

## 📋 Overview

This package serves as the central database layer for the WBTH project, providing:

- **Unified Database Schema** - Single source of truth for all data models
- **Type-Safe Database Client** - Auto-generated TypeScript types for database operations
- **Migration Management** - Version-controlled database schema changes
- **Seed Data** - Development and testing data for local setup
- **Shared Package** - Used by both `apps/web` and `apps/ml`

## 🗄️ Database Schema

The schema defines the following core models:

### User Management
- **User** - Base user model with authentication and role management
- **Tourist** - Tourist-specific profile data
- **Guide** - Tour guide profiles with expertise and availability
- **AccommodationProvider** - Accommodation provider company information
- **Admin** - Admin user privileges

### Business Logic
- **Accommodation** - Accommodation listings with pricing and amenities
- **Booking** - Booking records for guides and accommodations
- **Rating** - User ratings and reviews for services
- **Payment** - Payment transactions via Stripe
- **Event** - Platform events and festivals
- **Notification** - User notification system

### Authentication
- **VerificationToken** - Email verification tokens

### Enums
- `UserRole` - tourist, guide, accommodation_provider, admin
- `BookingType` - accommodation, guide
- `BookingStatus` - pending, confirmed, cancelled
- `PaymentStatus` - pending, authorized, captured, cancelled, failed
- `NotificationType` - Various notification types

## 🏗️ Tech Stack

- **Prisma 7.0.1** - Next-generation ORM
- **PostgreSQL 16** - Database (hosted on Neon)
- **TypeScript 5** - Type safety
- **pg 8.16** - PostgreSQL driver
- **@prisma/adapter-pg** - PostgreSQL adapter for Prisma

## 📁 Package Structure

```
packages/prisma/
├── schema.prisma           # Database schema definition
├── migrations/             # Database migration files
├── seed/                   # Seed data scripts
│   ├── index.ts           # Main seed script
│   ├── users.ts           # User seed data
│   ├── guides.ts          # Guide seed data
│   ├── accommodations.ts  # Accommodation seed data
│   └── events.ts          # Event seed data
├── src/
│   └── client.ts          # Prisma client export
├── dist/                  # Compiled TypeScript output
├── backups/               # Database backup files
├── build.sh               # Build script
├── package.json           # Package configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local Docker or Neon)
- Yarn package manager

### Environment Setup

Create a `.env` file in this directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/wbth
```

For production (Neon):
```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/wbth?sslmode=require
```

## 📝 Common Commands

### Generate Prisma Client

After any schema changes, regenerate the Prisma client:

```bash
# From this directory
npx prisma generate

# Or from monorepo root
cd packages/prisma
npx prisma generate
```

### Create a Migration

When you modify `schema.prisma`, create a migration:

```bash
npx prisma migrate dev --name your_migration_name
```

This will:
1. Create a new migration file in `migrations/`
2. Apply the migration to your database
3. Regenerate the Prisma client

### Apply Migrations (Production)

Deploy pending migrations to production:

```bash
yarn migrate
# or
npx prisma migrate deploy
```

### Seed the Database

Populate the database with test data:

```bash
yarn seed
# or
npx tsx seed/index.ts
```

The seed script creates:
- Admin user
- Sample tourists
- Sample guides with profiles
- Sample accommodations
- Sample events

### Pull Database Schema

Pull the current database schema (useful when working with existing databases):

```bash
npx prisma db pull
```

### Reset Database (⚠️ Destructive)

Drop all data and reapply migrations:

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Apply all migrations
4. Run seed scripts

### Open Prisma Studio

Visual database browser:

```bash
npx prisma studio
```

Access at `http://localhost:5555`

## 🔧 Usage in Applications

### Importing the Prisma Client

In `apps/web` or other packages:

```typescript
import prisma from '@repo/prisma';

// Query users
const users = await prisma.user.findMany();

// Create a booking
const booking = await prisma.booking.create({
  data: {
    user_id: userId,
    type: 'guide',
    start_date: new Date(),
    end_date: new Date(),
    price: 100,
    status: 'pending',
  },
});

// Update with relations
const guide = await prisma.guide.update({
  where: { user_id: guideId },
  data: { 
    availability: false,
    rating: 4.5,
  },
  include: {
    user: true,
    bookings: true,
  },
});
```

### Type Safety

Prisma automatically generates TypeScript types:

```typescript
import { User, Guide, Booking, BookingStatus } from '@prisma/client';

// Fully typed
const createBooking = async (userId: string): Promise<Booking> => {
  return await prisma.booking.create({
    data: {
      user_id: userId,
      type: 'guide',
      status: 'pending', // Type-checked against BookingStatus enum
      // ... other fields
    },
  });
};
```

## 🗂️ Database Models Overview

### User Model
Central authentication and profile model with role-based access.

**Relations:**
- `tourist` - Tourist profile (1:1)
- `guide` - Guide profile (1:1)
- `accommodationProvider` - Provider profile (1:1)
- `admin` - Admin privileges (1:1)
- `bookings` - User's bookings (1:many)
- `ratings` - User's ratings (1:many)
- `notifications` - User's notifications (1:many)
- `paymentsSent` / `paymentsReceived` - Payment transactions

### Guide Model
Tour guide profiles with expertise, languages, and availability.

**Key Fields:**
- `experience` - Array of experience descriptions
- `languages` - Spoken languages
- `expertise` - Areas of expertise
- `rating` - Average rating (calculated)
- `booking_price` - Price per booking
- `availability` - Current availability status

### Accommodation Model
Accommodation listings with detailed attributes for ML recommendations.

**Key Fields:**
- `type` - Accommodation types (hotel, villa, etc.)
- `amenities` - Available amenities
- `budget` - Budget categories
- `price_range_min/max` - Price range
- `interests` - Related interests for matching
- `images` - Photo URLs
- `rating` - Average rating (calculated)

### Booking Model
Booking records linking users with guides or accommodations.

**Key Fields:**
- `type` - 'guide' or 'accommodation'
- `status` - pending, confirmed, cancelled
- `start_date` / `end_date` - Booking dates
- `price` - Total price
- Relations to `user`, `guide`, `accommodation`, `payments`, `rating`

### Payment Model
Stripe payment transactions with status tracking.

**Key Fields:**
- `stripe_payment_intent_id` - Stripe payment intent
- `status` - Payment status (pending, captured, etc.)
- `amount` - Payment amount
- Relations to `sender`, `receiver`, `booking`

## 🔄 Migration Workflow

### Development Workflow

1. **Modify Schema**: Edit `schema.prisma`
2. **Create Migration**: `npx prisma migrate dev --name feature_name`
3. **Test Locally**: Verify changes work as expected
4. **Commit**: Commit both schema and migration files
5. **Push**: Push to repository

### Production Deployment

1. **Pull Latest**: Ensure you have latest migrations
2. **Deploy**: `npx prisma migrate deploy` (runs automatically on Vercel/Render)
3. **Verify**: Check that migrations applied successfully

## 🌱 Seed Data

The seed scripts in `seed/` create realistic test data:

### Users (`seed/users.ts`)
- Admin user (admin@wbth.com)
- Sample tourists
- Sample guides
- Sample accommodation providers

### Guides (`seed/guides.ts`)
- Guides with various expertise (cultural, adventure, nature)
- Different languages and experience levels
- Varied pricing and availability

### Accommodations (`seed/accommodations.ts`)
- Hotels, villas, guesthouses
- Different budget ranges
- Various locations across Sri Lanka
- Diverse amenities and features

### Events (`seed/events.ts`)
- Cultural festivals
- Seasonal events
- Tourist attractions

## 🔐 Best Practices

### Schema Design
- Use descriptive field names
- Add indexes for frequently queried fields
- Use enums for fixed value sets
- Document complex relations with comments

### Migrations
- Name migrations descriptively
- Never edit existing migrations
- Test migrations locally before deploying
- Keep migrations small and focused

### Queries
- Use `select` to fetch only needed fields
- Use `include` for relations sparingly
- Implement pagination for large datasets
- Use transactions for multi-step operations

### Type Safety
- Always use generated types
- Avoid `any` types
- Use Prisma's type helpers (`Prisma.UserCreateInput`, etc.)

## 🐛 Troubleshooting

### Prisma Client Not Found

```bash
# Regenerate the client
npx prisma generate
```

### Migration Conflicts

```bash
# Reset local database (⚠️ destructive)
npx prisma migrate reset

# Or resolve conflicts manually in migrations/
```

### Connection Issues

- Verify `DATABASE_URL` in `.env`
- Check database is running (Docker: `docker ps`)
- Ensure SSL mode for Neon: `?sslmode=require`

### Type Errors After Schema Changes

```bash
# Regenerate client and restart TypeScript server
npx prisma generate
# In VSCode: Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

## 📊 Database Hosting

**Production**: Neon (Serverless PostgreSQL)
- Automatic backups
- Connection pooling
- Branching for development
- Free tier: 0.5 GB storage

**Local Development**: Docker PostgreSQL
```bash
docker run -d \
  --name wbth-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=NGPrabuddhaE2240024 \
  -e POSTGRES_DB=wbth \
  -p 5432:5432 \
  postgres:16
```

## 🔗 Related Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [Main Project README](../../README.md)
- [Architecture Overview](../../docs/ARCHITECTURE.md)
- [Web Application](../../apps/web/README.md)
- [ML Service](../../apps/ml/README.md)

## 📦 Package Exports

This package exports the Prisma client for use in other packages:

```json
{
  "main": "./dist/src/client.js",
  "types": "./dist/src/client.d.ts"
}
```

Import in other packages:
```typescript
import prisma from '@repo/prisma';
```

## 🔄 Recent Updates

- Upgraded to Prisma 7.0.1
- Added `booking_price` fields for guides and accommodations
- Implemented rating system with calculated averages
- Added notification system with types
- Enhanced accommodation model for ML recommendations

---

**Last Updated**: January 31, 2026
