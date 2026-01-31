# Web Application

The Next.js frontend application for the WBTH (Welcome Back To Home) tourism platform - a comprehensive system connecting tourists with guides and accommodations in Sri Lanka.

## 📋 Overview

This is a full-stack Next.js application built with the App Router, featuring:

- **Multi-role authentication system** (Tourist, Guide, Accommodation Provider, Admin)
- **Role-based dashboards** with specialized features for each user type
- **ML-powered recommendations** for guides and accommodations
- **Real-time notifications** and chat functionality
- **Payment processing** via Stripe integration
- **Event management** and booking system
- **Rating and review system** for guides and accommodations

## 🏗️ Tech Stack

### Core Framework
- **Next.js 16.1.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Lucide React** - Icon library

### Authentication & Authorization
- **NextAuth.js 4.24** - Authentication for Next.js
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation

### Database & ORM
- **Prisma 7** - Next-generation ORM
- **PostgreSQL** - Database (via Neon/local Docker)
- **@repo/prisma** - Shared Prisma package from monorepo

### Forms & Validation
- **React Hook Form 7.66** - Form state management
- **Zod 4.1** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Payments
- **Stripe 20.2** - Payment processing
- **@stripe/stripe-js** - Stripe.js library
- **@stripe/react-stripe-js** - React components for Stripe

### Data Visualization
- **Chart.js 4.5** - Charting library
- **react-chartjs-2** - React wrapper for Chart.js

### Email
- **Resend 6.6** - Email delivery service

## 📁 Project Structure

```
apps/web/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── accommodation-provider/  # Provider-specific endpoints
│   │   ├── accommodations/          # Accommodation listings
│   │   ├── admin/                   # Admin management
│   │   ├── auth/                    # Authentication endpoints
│   │   ├── bookings/                # Booking management
│   │   ├── events/                  # Event management
│   │   ├── guide/                   # Guide-specific endpoints
│   │   ├── guides/                  # Guide listings
│   │   ├── notifications/           # Notification system
│   │   ├── payments/                # Stripe payment processing
│   │   ├── ratings/                 # Rating and review system
│   │   └── tourist/                 # Tourist-specific endpoints
│   ├── accommodations/           # Accommodation pages
│   ├── admin/                    # Admin dashboard
│   ├── dashboard/                # User dashboards
│   ├── events/                   # Event pages
│   ├── guides/                   # Guide pages
│   ├── login/                    # Login page
│   ├── recommendations/          # ML recommendations page
│   ├── register/                 # Registration page
│   ├── verify-email/             # Email verification
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── admin-dashboard/          # Admin components
│   ├── guide-dashboard/          # Guide components
│   ├── homepage/                 # Homepage components
│   ├── payments/                 # Payment components
│   ├── provider-dashboard/       # Provider components
│   ├── touristdashboard/         # Tourist components
│   ├── Chatbot.tsx               # AI chatbot component
│   └── NotificationBell.tsx      # Notification component
├── lib/                          # Utility functions
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── vercel-build.sh               # Custom Vercel build script
└── vercel.json                   # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and Yarn
- PostgreSQL database (local Docker or Neon)
- Stripe account for payment processing
- Resend account for email delivery

### Environment Variables

Create a `.env` file in the root of this directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wbth

# Authentication
JWT_SECRET=your-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Email
RESEND_API_KEY=your-resend-api-key

# ML Service
NEXT_PUBLIC_FLASK_API_URL=http://localhost:5000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
PLATFORM_FEE_PERCENTAGE=10
```

### Installation

From the **monorepo root** (`/home/gihan/WBTH`):

```bash
# Install all dependencies
yarn install

# Generate Prisma client
cd packages/prisma
yarn prisma generate

# Run database migrations
yarn prisma migrate dev
```

### Development

```bash
# From monorepo root
yarn dev

# Or from this directory
cd apps/web
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
# From this directory
yarn build

# Start production server
yarn start
```

## 🔑 User Roles & Features

### Tourist
- Browse and search guides and accommodations
- Get ML-powered personalized recommendations
- Book guides and accommodations
- Make payments via Stripe
- Rate and review services
- View booking history
- Receive notifications

### Guide
- Create and manage profile
- Set availability and pricing
- View and manage bookings
- Track earnings and statistics
- Receive booking notifications
- View ratings and reviews

### Accommodation Provider
- Create and manage accommodation listings
- Set pricing and availability
- Manage bookings
- Track revenue
- View analytics dashboard
- Respond to reviews

### Admin
- Manage all users (tourists, guides, providers)
- Create and manage events
- View platform analytics
- Monitor bookings and payments
- Moderate content and reviews
- System configuration

## 🔐 Authentication Flow

1. **Registration**: Users register via `/register` with role selection
2. **Email Verification**: Verification email sent via Resend
3. **Login**: NextAuth.js handles authentication at `/login`
4. **Protected Routes**: Middleware protects `/dashboard/*` routes
5. **Role-based Access**: API routes check user roles for authorization

## 💳 Payment Integration

The application uses Stripe for payment processing:

- **Platform Fee Model**: 10% platform fee on all transactions
- **Payment Flow**: Tourist → Platform → Service Provider
- **Supported Methods**: Credit/debit cards via Stripe Elements
- **Webhooks**: Stripe webhooks for payment confirmation

## 🤖 ML Recommendations

The app integrates with a Flask ML service (`apps/ml`) to provide:

- Personalized guide recommendations based on user preferences
- Accommodation suggestions based on budget and location
- Smart matching algorithm considering ratings, availability, and user history

## 📱 Key Features

### Dashboard Analytics
- Chart.js visualizations for bookings, revenue, and trends
- Real-time statistics and metrics
- Role-specific KPIs

### Notification System
- Real-time notification bell component
- Booking confirmations and updates
- Payment notifications
- System announcements

### Chatbot
- AI-powered assistance for tourists
- Help with bookings and recommendations
- FAQ support

### Event Management
- Admin-created events and festivals
- Event calendar display
- Tourist event browsing

## 🔧 Configuration Files

### `next.config.js`
- TypeScript build errors ignored for deployment
- Transpile packages configuration

### `middleware.ts`
- Protects dashboard routes with NextAuth
- Redirects unauthenticated users to login

### `vercel-build.sh`
- Custom build script for Vercel deployment
- Handles Prisma client generation in monorepo context

### `vercel.json`
- Vercel-specific deployment configuration
- Build output API settings

## 🧪 Development Tips

### Working with Prisma

```bash
# Generate Prisma client after schema changes
cd packages/prisma
yarn prisma generate

# Create a new migration
yarn prisma migrate dev --name your_migration_name

# Reset database (⚠️ destructive)
yarn prisma migrate reset
```

### Debugging

- Check browser console for client-side errors
- Use Next.js development error overlay
- Review API route responses in Network tab
- Check server logs for API errors

### Code Quality

```bash
# Run ESLint
yarn lint

# Type checking
yarn tsc --noEmit
```

## 🚀 Deployment

### Vercel (Recommended)

The app is configured for Vercel deployment:

```bash
# Deploy to production
vercel --prod
```

**Important**: Ensure all environment variables are set in Vercel dashboard.

### Environment-Specific Configuration

- **Development**: Uses local database and ML service
- **Production**: Uses Neon database and Cloud Run ML service
- Update `NEXT_PUBLIC_FLASK_API_URL` and `DATABASE_URL` accordingly

## 📚 Related Documentation

- [Main Project README](../../README.md)
- [Architecture Overview](../../docs/ARCHITECTURE.md)
- [Prisma Schema](../../packages/prisma/README.md)
- [ML Service](../ml/README.md)

## 🐛 Troubleshooting

### Prisma Client Issues

```bash
# Regenerate Prisma client
cd packages/prisma
yarn prisma generate
```

### Build Errors

- Ensure all environment variables are set
- Check that Prisma client is generated
- Verify database connection

### Authentication Issues

- Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set
- Check JWT_SECRET configuration
- Clear browser cookies and try again

## 📝 Notes

- This is part of a Turborepo monorepo structure
- Shared Prisma schema is in `packages/prisma`
- TypeScript build errors are currently ignored for deployment
- Uses custom build script for Vercel deployment due to Prisma 7 module resolution

---

**Last Updated**: January 30, 2026
