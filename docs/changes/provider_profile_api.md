# Changes - Accommodation Provider Profile API

## Backend
- **Created**: `apps/web/app/api/accommodation-provider/profile/route.ts`
    - Implemented `GET` to fetch user and provider details.
    - Implemented `PUT` to update user contact info and provider company name.
    - Used `upsert` for `AccommodationProvider` to handle cases where the record might not exist yet.
