# Walkthrough - Accommodation Provider Dashboard

## Changes

### Backend API
I have implemented the following API routes to support the Accommodation Provider Dashboard:

-   `GET /api/accommodation-provider/profile`: Fetches the provider's profile and company details.
-   `PUT /api/accommodation-provider/profile`: Updates the provider's profile and company details.
-   `GET /api/accommodation-provider/bookings`: Retrieves a list of bookings for all accommodations owned by the provider, including statistics.
-   `PUT /api/accommodation-provider/bookings/[id]/cancel`: Allows the provider to cancel a specific booking.
-   `GET /api/accommodation-provider/accommodations`: Lists all accommodations owned by the provider.
-   `POST /api/accommodation-provider/accommodations`: Creates a new accommodation.
-   `PUT /api/accommodation-provider/accommodations/[id]`: Updates an existing accommodation.
-   `DELETE /api/accommodation-provider/accommodations/[id]`: Deletes an accommodation.

### Frontend UI
I have created the Accommodation Provider Dashboard at `/dashboard/provider`. Key features include:

-   **Profile Management**: View and edit company and personal details, including **Company Logo upload**.
-   **Statistics**: View total bookings, pending/confirmed/cancelled counts, and total income.
-   **Accommodation Management**:
    -   View a list of accommodations.
    -   Add new accommodations with details like location, price range, amenities, etc.
    -   Edit and delete existing accommodations.
    -   **Manage Images**: Add, update, and remove images for each accommodation via a dedicated popup.
-   **Booking Management**:
    -   View booking history with status and details.
    -   Cancel pending bookings.

## Verification Results

### Automated Checks
-   **Type Check**: Ran `yarn tsc --noEmit` in `apps/web` to ensure no TypeScript errors were introduced.

### Manual Verification Steps
To verify the implementation manually:

1.  **Login**: Log in as a user with the `accommodation_provider` role.
2.  **Navigate**: Go to `/dashboard/provider`.
3.  **Profile**:
    -   Click "Edit Profile".
    -   Update Company Name and Phone.
    -   Save and verify changes persist.
4.  **Accommodations**:
    -   Click "+ Add New".
    -   Fill in details (Name: "Test Villa", Location: "Beach", Price: 100-200).
    -   Save and verify it appears in the list.
    -   Edit the accommodation and change the name.
    -   Delete the accommodation.
5.  **Bookings**:
    -   (Requires existing bookings in DB) Verify bookings are listed.
    -   Click "Cancel" on a pending booking and verify status updates.
