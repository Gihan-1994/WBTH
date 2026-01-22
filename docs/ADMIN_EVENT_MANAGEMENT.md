# Admin Event Management Feature Documentation

## Overview
The Admin Event Management feature allows administrators to create, edit, view, and delete events with images. Events are displayed on the homepage in a calendar view, showing only upcoming events to users.

## Implementation Summary

### Database Changes

#### Schema Updates
Updated the `Event` model in [schema.prisma](file:///home/gihan/WBTH/packages/prisma/schema.prisma):
- Added `title` field (String with default "Untitled Event")
- Added `eventImages` field (String[] for Base64 encoded images)
- Maintained existing fields: `id`, `category`, `date`, `location`, `description`

### Backend - API Endpoints

#### Admin Event Endpoints (Protected)

**GET** `/api/admin/events`
- Fetches all events ordered by date (descending)
- Requires admin authentication

**POST** `/api/admin/events`
- Creates a new event
- Required fields: `title`, `category`, `date`, `location`
- Optional fields: `description` (array), `eventImages` (array of Base64 strings)

**GET** `/api/admin/events/[id]`
- Fetches a single event by ID
- Requires admin authentication

**PUT** `/api/admin/events/[id]`
- Updates an existing event
- Required fields: `title`, `category`, `date`, `location`
- Optional fields: `description`, `eventImages`

**DELETE** `/api/admin/events/[id]`
- Deletes an event by ID
- Requires admin authentication

#### Public Event Endpoint

**GET** `/api/events/upcoming`
- Fetches upcoming events (date >= today)
- Ordered by date (ascending)
- No authentication required

### Admin Dashboard Components

#### EventsSection Component
**Location**: [EventsSection.tsx](file:///home/gihan/WBTH/apps/web/components/admin-dashboard/EventsSection.tsx)

Features:
- Table view of all events with thumbnails
- Search functionality (by title, category, location)
- CRUD operations (View, Edit, Delete)
- "Add New Event" button
- Loading and error states

#### Modal Components

**AddEventModal**
**Location**: [AddEventModal.tsx](file:///home/gihan/WBTH/apps/web/components/admin-dashboard/modals/AddEventModal.tsx)

Features:
- Form fields: Title, Category, Date, Location, Description (dynamic array)
- Multiple image upload with preview
- Image validation (JPG/PNG/WebP, max 2MB per image)
- Base64 encoding for images
- Success/error notifications

**EditEventModal**
**Location**: [EditEventModal.tsx](file:///home/gihan/WBTH/apps/web/components/admin-dashboard/modals/EditEventModal.tsx)

Features:
- Pre-populated form with existing event data
- Edit all fields including images
- Add/remove images
- Update functionality

**ViewEventModal**
**Location**: [ViewEventModal.tsx](file:///home/gihan/WBTH/apps/web/components/admin-dashboard/modals/ViewEventModal.tsx)

Features:
- Read-only event details display
- Image carousel with navigation
- Formatted date and location
- Color-coded information sections

### Homepage Components

#### EventCalendar Component
**Location**: [EventCalendar.tsx](file:///home/gihan/WBTH/apps/web/components/homepage/EventCalendar.tsx)

Features:
- Fetches upcoming events from public API
- Groups events by date
- Displays events in calendar-style view
- Shows events for next 30 days only
- Loading skeleton and empty state
- Responsive design

#### EventCard Component
**Location**: [EventCard.tsx](file:///home/gihan/WBTH/apps/web/components/homepage/EventCard.tsx)

Features:
- Displays individual event with image
- Shows title, category, time, location
- Expandable description section
- Hover effects and animations

### UI Integration

#### Admin Dashboard
**Location**: [page.tsx](file:///home/gihan/WBTH/apps/web/app/dashboard/admin/page.tsx)

Changes:
- Added "Events" tab to navigation
- Integrated `EventsSection` component
- Removed "Coming Soon" section

#### Homepage
**Location**: [page.tsx](file:///home/gihan/WBTH/apps/web/app/page.tsx)

Changes:
- Replaced "Coming Soon" badge with "View Events" button
- Added toggle state for event calendar display
- Integrated `EventCalendar` component
- Expandable event calendar section

## Usage Instructions

### For Administrators

#### Creating an Event
1. Navigate to Admin Dashboard
2. Click on "Events" tab
3. Click "Add New Event" button
4. Fill in required fields:
   - Event Title
   - Category (e.g., Festival, Concert, Workshop)
   - Date and Time
   - Location
5. Optionally add description points
6. Upload event images (JPG/PNG/WebP, max 2MB each)
7. Click "Create Event"

#### Editing an Event
1. In Events tab, locate the event in the table
2. Click the Edit icon (green pencil)
3. Modify any fields as needed
4. Add or remove images
5. Click "Update Event"

#### Viewing Event Details
1. In Events tab, click the View icon (blue eye)
2. Browse through event details and images
3. Use carousel navigation for multiple images

#### Deleting an Event
1. In Events tab, click the Delete icon (red trash)
2. Confirm deletion in the popup
3. Event will be removed from the system

### For Users

#### Viewing Upcoming Events
1. Navigate to the homepage
2. Scroll to "Upcoming Events" section
3. Click "View Events" button
4. Browse events grouped by date
5. Click "View Details" on any event card to expand description
6. Click "Hide Events" to collapse the calendar

## Technical Details

### Image Storage
- Images are stored as Base64 encoded strings in the database
- Maximum file size: 2MB per image
- Supported formats: JPG, PNG, WebP
- Multiple images per event supported

### Event Filtering
- Homepage displays only upcoming events (date >= today)
- Limited to next 30 days
- Events ordered chronologically

### Responsive Design
- All components are mobile-friendly
- Event cards adapt to screen size
- Calendar view stacks on smaller screens

## File Structure

```
apps/web/
├── app/
│   ├── api/
│   │   ├── admin/events/
│   │   │   ├── route.ts (GET, POST)
│   │   │   └── [id]/route.ts (GET, PUT, DELETE)
│   │   └── events/
│   │       └── upcoming/route.ts (GET - public)
│   ├── dashboard/admin/
│   │   └── page.tsx (Admin Dashboard with Events tab)
│   └── page.tsx (Homepage with Event Calendar)
└── components/
    ├── admin-dashboard/
    │   ├── EventsSection.tsx
    │   ├── types.ts (Updated with EventData)
    │   └── modals/
    │       ├── AddEventModal.tsx
    │       ├── EditEventModal.tsx
    │       └── ViewEventModal.tsx
    └── homepage/
        ├── EventCalendar.tsx
        └── EventCard.tsx

packages/prisma/
└── schema.prisma (Updated Event model)
```

## Testing Checklist

### Admin Dashboard
- ✅ Navigate to Events tab
- ✅ Create event with images
- ✅ Edit existing event
- ✅ View event details
- ✅ Delete event
- ✅ Search events by title/category/location

### Homepage
- ✅ Click "View Events" button
- ✅ Verify only upcoming events display
- ✅ Check events grouped by date
- ✅ Expand event card details
- ✅ Verify images display correctly
- ✅ Test responsive design on mobile

### API
- ✅ Admin endpoints require authentication
- ✅ Public endpoint accessible without auth
- ✅ Image validation works (size, type)
- ✅ Events ordered correctly

## Future Enhancements

Potential improvements for future iterations:
- Event categories dropdown with predefined options
- Event registration/RSVP functionality
- Event search and filtering on homepage
- Event sharing on social media
- Email notifications for upcoming events
- Recurring events support
- Event capacity management
- Integration with calendar apps (Google Calendar, iCal)
