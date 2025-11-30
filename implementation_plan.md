# Implementation Plan - Search, Booking & Homepage

## Goal Description
Implement the core user-facing features for Tourists: Homepage, Accommodation Search, Guide Search, and Booking Creation. This will complete the primary user flows for finding and booking services.

## User Review Required
> [!IMPORTANT]
> Ensure the `Accommodation` and `Guide` models have sufficient seed data for testing search and filtering.

## Proposed Changes

### Backend (API Routes)

#### [NEW] [apps/web/app/api/accommodations/route.ts](file:///home/gihan/WBTH/apps/web/app/api/accommodations/route.ts)
- **GET**: Fetch accommodations with query parameters for filtering.
    - `location`: Filter by city or province (partial match).
    - `minPrice`, `maxPrice`: Filter by price range.
    - `amenities`: Filter by amenities.
    - `type`: Filter by accommodation type.
    - `guests`: Filter by group size.

#### [NEW] [apps/web/app/api/accommodations/[id]/route.ts](file:///home/gihan/WBTH/apps/web/app/api/accommodations/[id]/route.ts)
- **GET**: Fetch a single accommodation by ID.

#### [NEW] [apps/web/app/api/guides/route.ts](file:///home/gihan/WBTH/apps/web/app/api/guides/route.ts)
- **GET**: Fetch guides with query parameters for filtering.
    - `location`: Filter by city (from user profile or specific field).
    - `language`: Filter by languages spoken.
    - `expertise`: Filter by specialization.

#### [NEW] [apps/web/app/api/guides/[id]/route.ts](file:///home/gihan/WBTH/apps/web/app/api/guides/[id]/route.ts)
- **GET**: Fetch a single guide by ID.

#### [NEW] [apps/web/app/api/bookings/route.ts](file:///home/gihan/WBTH/apps/web/app/api/bookings/route.ts)
- **POST**: Create a new booking.
    - Accepts `userId`, `type` (accommodation/guide), `itemId` (accommodation_id/guide_id), `startDate`, `endDate`, `price`.
    - Validates availability (basic check).

### Frontend (UI Pages)

#### [MODIFY] [apps/web/app/page.tsx](file:///home/gihan/WBTH/apps/web/app/page.tsx)
- **Homepage**:
    - **Hero Section**: "Tourism Hub" heading, description, and call to action.
    - **Sections**:
        - **Personal Recommendations**: Placeholder for ML results.
        - **Accommodations**: Link to `/accommodations`.
        - **Guides**: Link to `/guides`.
        - **Upcoming Events**: Placeholder/Link to events.
        - **Chat Bot**: Placeholder icon/interaction.
        - **My Profile**: Dynamic link based on user role (Tourist/Guide/Provider).
    - **Styling**: Use colorful SVG icons and responsive grid layout.

#### [NEW] [apps/web/app/accommodations/page.tsx](file:///home/gihan/WBTH/apps/web/app/accommodations/page.tsx)
- **Search Page**:
    - Search bar and filters sidebar.
    - List of accommodation cards.

#### [NEW] [apps/web/app/accommodations/[id]/page.tsx](file:///home/gihan/WBTH/apps/web/app/accommodations/[id]/page.tsx)
- **Details Page**:
    - Full details, images, amenities.
    - **Book Now** button opening a booking modal/form.

#### [NEW] [apps/web/app/guides/page.tsx](file:///home/gihan/WBTH/apps/web/app/guides/page.tsx)
- **Search Page**:
    - Search bar and filters sidebar.
    - List of guide cards.

#### [NEW] [apps/web/app/guides/[id]/page.tsx](file:///home/gihan/WBTH/apps/web/app/guides/[id]/page.tsx)
- **Details Page**:
    - Full details, profile picture, experience, languages.
    - **Book Now** button opening a booking modal/form.

## Verification Plan

### Manual Verification
1.  **Homepage**:
    - Verify all sections are present and links work.
    - Verify "My Profile" redirects correctly for different logged-in roles.
2.  **Accommodation Search**:
    - Test filters (location, price, etc.) and verify results.
    - Click through to details page.
3.  **Guide Search**:
    - Test filters (language, expertise) and verify results.
    - Click through to details page.
4.  **Booking**:
    - Initiate a booking from accommodation/guide details page.
    - Submit booking.
    - Verify booking appears in the user's dashboard (Tourist and Provider/Guide).
