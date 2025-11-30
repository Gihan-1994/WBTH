# Walkthrough - Search, Booking & Homepage

I have implemented the core user-facing features for the Tourism Hub, enabling tourists to search for accommodations and guides, and make bookings.

## Changes

### Backend API
- **Accommodations**:
    - `GET /api/accommodations`: Search with filters (location, price, amenities, type, guests).
    - `GET /api/accommodations/[id]`: Get details.
- **Guides**:
    - `GET /api/guides`: Search with filters (location, language, expertise).
    - `GET /api/guides/[id]`: Get details.
- **Bookings**:
    - `POST /api/bookings`: Create a new booking.
    - `PUT /api/accommodation-provider/bookings/[id]/cancel`: Cancel booking (Provider).
    - `PUT /api/guide/bookings/[id]/cancel`: Cancel booking (Guide).
    - `PATCH /api/bookings/[id]/cancel`: Cancel booking (Tourist).

### Database Schema
- Added `city` and `province` fields to the `Guide` model to support location-based filtering.

### Frontend Pages
- **Homepage (`/`)**:
    - New design with links to Accommodations, Guides, and Profile.
    - Placeholders for future features (Recommendations, Events, Chatbot).
- **Accommodation Search (`/accommodations`)**:
    - Filter sidebar (Location, Price, Guests, Type).
    - List of accommodation cards.
- **Accommodation Details (`/accommodations/[id]`)**:
    - Full details view.
    - Booking modal to select dates and confirm booking.
- **Guide Search (`/guides`)**:
    - Filter sidebar (Location, Language, Expertise).
    - List of guide cards.
- **Guide Details (`/guides/[id]`)**:
    - Profile view with expertise and languages.
    - Booking modal.

## Verification Results

### Build Verification
- Ran `yarn build` in `apps/web` successfully.
- Resolved TypeScript errors related to Next.js 15 `params` (Promise) and React `Suspense` types.

### Manual Verification Steps
1.  **Homepage**: Visit `http://localhost:3000/`. Verify links work.
2.  **Search**:
    - Go to `/accommodations` and test filters.
    - Go to `/guides` and test filters.
3.  **Booking**:
    - Select an accommodation or guide.
    - Click "Book Now".
    - Fill in dates and confirm.
    - Check dashboard for the new booking.
