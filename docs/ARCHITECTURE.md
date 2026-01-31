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
    │  Render              │   │  Neon PostgreSQL       │
    │                      │   │  (Serverless)          │
    │  Flask ML Service    │   │                        │
    │  (apps/ml)           │   │  • User data           │
    │  • Recommendations   │   │  • Bookings            │
    │  • ML algorithms     │───┤  • Accommodations      │
    │  • Auto-scaling      │   │  • Guides              │
    └──────────────────────┘   └────────────────────────┘
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

### ML Service (Render)
- **Technology**: Flask, scikit-learn, pandas
- **Hosting**: Render
- **Features**:
  - Containerized deployment
  - Auto-scaling
  - Free tier available
  - Automatic HTTPS
  - Direct database access

### Database (Neon)
- **Technology**: PostgreSQL 16
- **Hosting**: Neon (Serverless PostgreSQL)
- **Features**:
  - Serverless architecture with auto-scaling
  - Automatic backups
  - Connection pooling (built-in)
  - Branching for development
  - Encryption at rest and in transit
  - Free tier: 0.5 GB storage

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
User → Vercel (Next.js API) → Render (ML Service)
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

### ML Service (Render)
- Auto-scaling based on traffic
- Scales to zero on free tier when not in use
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

### Render
- Real-time logs
- Performance monitoring
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
- Render: 750 hours/month (free tier)
- Neon: 0.5 GB storage

### Production Optimization
- Render: Scale to zero when idle (free tier)
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
