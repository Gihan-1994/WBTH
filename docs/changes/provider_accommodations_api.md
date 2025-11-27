# Changes - Accommodation Provider Accommodations API

## Backend
- **Created**: `apps/web/app/api/accommodation-provider/accommodations/route.ts`
    - Implemented `GET` to list all accommodations for the provider.
    - Implemented `POST` to create a new accommodation. Automatically creates a provider profile if one doesn't exist.
- **Created**: `apps/web/app/api/accommodation-provider/accommodations/[id]/route.ts`
    - Implemented `PUT` to update accommodation details.
    - Implemented `DELETE` to remove an accommodation.
    - Includes authorization checks to ensure the user owns the accommodation.
