# Changes - Accommodation Provider Bookings API

## Backend
- **Created**: `apps/web/app/api/accommodation-provider/bookings/route.ts`
    - Implemented `GET` to fetch bookings for all accommodations owned by the provider.
    - Includes statistics calculation (total, pending, confirmed, cancelled, income).
- **Created**: `apps/web/app/api/accommodation-provider/bookings/[id]/cancel/route.ts`
    - Implemented `PUT` to cancel a specific booking.
    - Includes authorization check to ensure the booking belongs to the provider.
