# WBTH Deployment Architecture

## Overview

This document provides a visual overview of the WBTH deployment architecture.

## Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Vercel CDN                                │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Next.js Frontend (apps/web)                │    │
│  │  • Server-side rendering                           │    │
│  │  • API routes                                      │    │
│  │  • Static assets                                   │    │
│  └────────────┬───────────────────────┬─────────────┘    │
└───────────────┼───────────────────────┼──────────────────┘
                │                       │
                │                       │
    ┌───────────▼──────────┐   ┌───────▼────────────────┐
    │  Google Cloud Run    │   │  Managed PostgreSQL    │
    │                      │   │  (Neon/Supabase/       │
    │  Flask ML Service    │   │   Cloud SQL)           │
    │  (apps/ml)           │   │                        │
    │  • Recommendations   │   │  • User data           │
    │  • ML algorithms     │───┤  • Bookings            │
    │  • Auto-scaling      │   │  • Accommodations      │
    └──────────────────────┘   │  • Guides              │
                               └────────────────────────┘
```

## Component Details

### Frontend (Vercel)
- **Technology**: Next.js 15, React 19
- **Hosting**: Vercel
- **Features**:
  - Server-side rendering for SEO
  - API routes for backend logic
  - Static asset optimization
  - Automatic HTTPS
  - Global CDN distribution

### ML Service (Google Cloud Run)
- **Technology**: Flask, scikit-learn, pandas
- **Hosting**: Google Cloud Run
- **Features**:
  - Containerized deployment
  - Auto-scaling (0-10 instances)
  - Pay-per-use pricing
  - Automatic HTTPS
  - Direct database access

### Database (Managed PostgreSQL)
- **Technology**: PostgreSQL 16
- **Hosting Options**:
  - **Neon** (Recommended): Serverless PostgreSQL
  - **Supabase**: PostgreSQL with additional features
  - **Cloud SQL**: Fully managed GCP PostgreSQL
- **Features**:
  - Automatic backups
  - Connection pooling
  - High availability
  - Encryption at rest and in transit

## Data Flow

### User Registration/Login
```
User → Vercel (Next.js) → PostgreSQL
                ↓
         NextAuth.js
                ↓
         JWT Token → User
```

### Accommodation Recommendations
```
User → Vercel (Next.js API) → Cloud Run (ML Service)
                                      ↓
                               PostgreSQL (fetch data)
                                      ↓
                               ML Algorithm
                                      ↓
                               Recommendations → User
```

### Booking Flow
```
User → Vercel (Next.js API) → PostgreSQL (create booking)
                ↓
         Email Service (Resend)
                ↓
         Notification → Provider/Guide
```

## Security

### Authentication
- NextAuth.js with JWT tokens
- Secure session management
- Password hashing with bcrypt

### Network Security
- All connections over HTTPS
- Environment variables for secrets
- Database connection pooling
- CORS configuration

### Data Protection
- Database encryption at rest
- Encrypted connections (SSL/TLS)
- No sensitive data in logs
- Regular security updates

## Scalability

### Frontend (Vercel)
- Automatic scaling based on traffic
- Global CDN for fast content delivery
- Edge functions for low latency

### ML Service (Cloud Run)
- Auto-scaling: 0-10 instances
- Scales to zero when not in use
- Handles concurrent requests efficiently

### Database
- Connection pooling for efficiency
- Read replicas for high traffic (optional)
- Automatic backups and point-in-time recovery

## Monitoring

### Vercel
- Real-time logs
- Performance analytics
- Error tracking
- Deployment history

### Google Cloud Run
- Cloud Logging
- Cloud Monitoring
- Request metrics
- Error rates

### Database
- Query performance monitoring
- Connection pool metrics
- Storage usage alerts

## Disaster Recovery

### Backups
- Database: Automated daily backups
- Code: Version control (Git)
- Configuration: Environment variables documented

### Recovery Time Objective (RTO)
- Frontend: < 5 minutes (redeploy)
- ML Service: < 10 minutes (redeploy)
- Database: < 1 hour (restore from backup)

## Cost Optimization

### Free Tier Usage
- Vercel: 100 GB bandwidth/month
- Cloud Run: 2M requests/month
- Neon: 0.5 GB storage

### Production Optimization
- Cloud Run: Scale to zero when idle
- Database: Right-size instance
- Vercel: Optimize images and assets
- CDN: Cache static content

## Future Enhancements

### Potential Additions
- Redis cache for frequently accessed data
- Message queue for async tasks
- CDN for user-uploaded images
- Multi-region deployment
- Advanced monitoring (Datadog, New Relic)
- Error tracking (Sentry)
