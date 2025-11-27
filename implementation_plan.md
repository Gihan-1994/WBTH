# Implementation Plan - Accommodation Provider Dashboard

## Goal Description
Implement the Accommodation Provider Dashboard to allow providers to manage their profile, accommodations, and bookings. This includes backend API routes and a frontend dashboard UI.

## User Review Required
> [!IMPORTANT]
> Ensure the `AccommodationProvider` and `Accommodation` models are correctly set up in the database (verified as existing in schema).

## Proposed Changes

### Backend (API Routes)

#### [NEW] [apps/web/app/api/accommodation-provider/profile/route.ts](file:///home/gihan/WBTH/apps/web/app/api/accommodation-provider/profile/route.ts)
- **GET**: Fetch provider profile (company name, user details).
- **PUT**: Update provider profile.

#### [NEW] [apps/web/app/api/accommodation-provider/bookings/route.ts](file:///home/gihan/WBTH/apps/web/app/api/accommodation-provider/bookings/route.ts)
- **GET**: Fetch booking history for all accommodations owned by the provider.
- **PUT**: Cancel a booking.

#### [NEW] [apps/web/app/api/accommodation-provider/accommodations/route.ts](file:///home/gihan/WBTH/apps/web/app/api/accommodation-provider/accommodations/route.ts)
- **GET**: List all accommodations for the provider.
- **POST**: Create a new accommodation.

#### [NEW] [apps/web/app/api/accommodation-provider/accommodations/[id]/route.ts](file:///home/gihan/WBTH/apps/web/app/api/accommodation-provider/accommodations/[id]/route.ts)
- **PUT**: Update an accommodation.
- **DELETE**: Delete an accommodation.

### Frontend (Dashboard UI)

#### [MODIFY] [apps/web/app/dashboard/provider/page.tsx](file:///home/gihan/WBTH/apps/web/app/dashboard/provider/page.tsx)
- Implement the dashboard layout.
- **Top Section**: Provider details.
- **Profile Section**: Edit form for company name, contact info, etc.
- **Accommodations Section**: List of accommodations with Add/Edit/Delete actions.
- **Booking History**: List of bookings with Cancel action.
- **Statistics**: Summary cards (Total, Pending, Confirmed, Cancelled, Income).

## Verification Plan

### Manual Verification
1.  **Login**: Log in as an Accommodation Provider (may need to seed a user or register).
2.  **Profile**: View and update profile details. Verify persistence.
3.  **Accommodations**:
    *   Create a new accommodation.
    *   View the list.
    *   Update the accommodation.
    *   Delete the accommodation.
4.  **Bookings**:
    *   View booking history (seed some bookings if needed).
    *   Cancel a pending booking.
5.  **Statistics**: Verify the numbers match the booking data.
