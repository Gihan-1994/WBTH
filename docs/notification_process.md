# Notification System Documentation

## Overview

The notification system provides real-time updates to users about booking-related events in the WBTH (Where's Been, There's Home) tourism platform. It supports bidirectional communication between tourists and service providers (guides and accommodation providers).

---

## Database Schema

### Notification Model

```prisma
model Notification {
  id         String           @id @default(uuid())
  user_id    String
  type       NotificationType
  message    String
  booking_id String?
  is_read    Boolean          @default(false)
  metadata   Json?
  created_at DateTime         @default(now()) @map("created_at")
  user       User             @relation(fields: [user_id], references: [id])
  booking    Booking?         @relation(fields: [booking_id], references: [id])

  @@index([user_id, is_read])
  @@map("notifications")
}
```

### Notification Types

```prisma
enum NotificationType {
  BOOKING_CREATED
  BOOKING_CONFIRMED
  BOOKING_CANCELLED
  BOOKING_UPDATED
  PAYMENT_RECEIVED
  PAYMENT_SENT
}
```

### Notification Metadata Structure

Stored as JSON in the `metadata` field:

```typescript
interface NotificationMetadata {
    booking_id: string;
    booker_id: string;           // Tourist ID
    booker_name: string;          // Tourist name
    provider_id: string;          // Guide/Provider ID
    provider_name: string;        // Guide/Provider name
    booking_type: "guide" | "accommodation";
    old_status?: "pending" | "confirmed" | "cancelled";
    new_status: "pending" | "confirmed" | "cancelled";
    updated_at: string;           // ISO timestamp
    start_date: string;           // ISO timestamp
    end_date: string;             // ISO timestamp
}
```

---

## Notification Flow

### 1. Booking Created

**Trigger:** Tourist creates a new booking

**Recipients:** Both tourist (booker) and provider

**Messages:**
- **Tourist:** "You placed a {type} booking ({id}) with {provider}. Awaiting confirmation."
- **Provider:** "{Tourist} placed a {type} booking ({id}). Please review and confirm."

**Implementation:**
```typescript
// In /api/bookings/route.ts (POST handler)
await notifyBookingCreated({
    bookingId: booking.id,
    touristId: userId,
    touristName: user.name,
    providerId: providerUserId,
    providerName: providerName,
    bookingType: type,
    startDate: start_date,
    endDate: end_date,
});
```

---

### 2. Booking Confirmed

**Trigger:** Provider confirms a pending booking

**Recipients:** Both tourist and provider

**Messages:**
- **Tourist:** "Your booking ({id}) with {provider} has been confirmed!"
- **Provider:** "You confirmed booking {id}."

**Implementation:**
```typescript
// In /api/guide/bookings/[id]/confirm/route.ts (PUT handler)
// OR /api/accommodation-provider/bookings/[id]/confirm/route.ts
await notifyBookingConfirmed({
    bookingId: booking.id,
    touristId: tourist.id,
    touristName: tourist.name,
    providerId: userId,
    providerName: guide.user.name,
    bookingType: booking.type,
    startDate: booking.start_date,
    endDate: booking.end_date,
});
```

---

### 3. Booking Cancelled

**Trigger:** Tourist or provider cancels a booking

**Recipients:** Both parties

**Messages:**
- **Tourist (self-cancelled):** "You cancelled booking {id}."
- **Tourist (provider-cancelled):** "Your booking ({id}) has been cancelled by the provider."
- **Provider (self-cancelled):** "You cancelled booking {id}."
- **Provider (tourist-cancelled):** "{Tourist} cancelled booking {id}."

**Implementation:**
```typescript
// In /api/bookings/[id]/cancel/route.ts
await notifyBookingCancelled({
    bookingId: booking.id,
    touristId: booking.user_id,
    touristName: user.name,
    providerId: providerUserId,
    providerName: providerName,
    bookingType: booking.type,
    startDate: booking.start_date,
    endDate: booking.end_date,
    cancelledBy: "tourist", // or "provider"
});
```

---

## Backend Implementation

### Core Notification Functions

File: `apps/web/lib/notifications.ts`

#### 1. Create Notification
```typescript
export async function createNotification(params: {
    userId: string;
    type: NotificationType;
    message: string;
    bookingId: string;
    metadata: NotificationMetadata;
})
```

Creates a single notification record in the database.

#### 2. Notify Booking Created
```typescript
export async function notifyBookingCreated(params: {
    bookingId: string;
    touristId: string;
    touristName: string;
    providerId: string;
    providerName: string;
    bookingType: BookingType;
    startDate: Date;
    endDate: Date;
})
```

Creates two notifications: one for tourist, one for provider.

#### 3. Notify Booking Confirmed
```typescript
export async function notifyBookingConfirmed(params: {...})
```

Creates two notifications when a booking is confirmed.

#### 4. Notify Booking Cancelled
```typescript
export async function notifyBookingCancelled(params: {
    ...
    cancelledBy: "tourist" | "provider";
})
```

Creates two notifications with context-aware messages based on who cancelled.

---

## API Endpoints

### GET /api/notifications

**Purpose:** Fetch user's notifications

**Query Parameters:**
- `limit` (optional): Number of notifications to return (default: 10)
- `skip` (optional): Number to skip for pagination (default: 0)
- `status` (optional): "read" | "unread" | "all" (default: "all")

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "BOOKING_CONFIRMED",
      "message": "Your booking (123) with John has been confirmed!",
      "booking_id": "uuid",
      "is_read": false,
      "created_at": "2025-12-30T00:00:00.000Z",
      "booking": {
        "id": "uuid",
        "type": "guide",
        "status": "confirmed",
        "start_date": "2025-12-31",
        "end_date": "2026-01-01"
      }
    }
  ],
  "total": 25,
  "unreadCount": 5
}
```

---

### PUT /api/notifications/[id]/read

**Purpose:** Mark a single notification as read

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

---

### PUT /api/notifications/read-all

**Purpose:** Mark all user's notifications as read

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

---

## Frontend Implementation

### NotificationBell Component

File: `apps/web/components/NotificationBell.tsx`

**Features:**
- Real-time unread count badge
- Dropdown notification list
- Auto-refresh every 60 seconds
- Click to mark as read
- "Mark all as read" functionality
- Relative time display ("2m ago", "1h ago", etc.)

**State Management:**
```typescript
const [notifications, setNotifications] = useState<Notification[]>([]);
const [unreadCount, setUnreadCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
```

**Key Functions:**
- `fetchNotifications()` - Fetch from API
- `markAsRead(id)` - Mark single notification
- `markAllAsRead()` - Mark all notifications
- `formatTimeAgo(date)` - Format relative time

---

### Dashboard Integration

The `NotificationBell` component is integrated into all three dashboards:

1. **Tourist Dashboard** (`apps/web/app/dashboard/tourist/page.tsx`)
2. **Guide Dashboard** (`apps/web/app/dashboard/guide/page.tsx`)
3. **Provider Dashboard** (`apps/web/app/dashboard/provider/page.tsx`)

**Implementation:**
```tsx
import NotificationBell from "@/components/NotificationBell";

// In header
<div className="flex items-center gap-4">
    <NotificationBell />
    <button>Home</button>
</div>
```

---

## Notification Message Templates

File: `apps/web/lib/notifications.ts`

```typescript
export const NOTIFICATION_TEMPLATES = {
    BOOKING_CREATED: {
        forTourist: (providerName, bookingId, bookingType) =>
            `You placed a ${bookingType} booking (${bookingId}) with ${providerName}. Awaiting confirmation.`,
        forProvider: (touristName, bookingId, bookingType) =>
            `${touristName} placed a ${bookingType} booking (${bookingId}). Please review and confirm.`,
    },
    BOOKING_CONFIRMED: {
        forTourist: (providerName, bookingId) =>
            `Your booking (${bookingId}) with ${providerName} has been confirmed!`,
        forProvider: (bookingId) =>
            `You confirmed booking ${bookingId}.`,
    },
    BOOKING_CANCELLED: {
        forTourist: (bookingId, cancelledByYou) =>
            cancelledByYou
                ? `You cancelled booking ${bookingId}.`
                : `Your booking (${bookingId}) has been cancelled by the provider.`,
        forProvider: (touristName, bookingId, cancelledByYou) =>
            cancelledByYou
                ? `You cancelled booking ${bookingId}.`
                : `${touristName} cancelled booking ${bookingId}.`,
    },
};
```

---

## Complete Flow Example

### Scenario: Tourist Books a Guide

1. **Tourist creates booking**
   - Endpoint: `POST /api/bookings`
   - Action: Create booking with status `pending`
   - Notification: Call `notifyBookingCreated()`

2. **Notifications created**
   - Tourist receives: "You placed a guide booking with John..."
   - Guide receives: "Sarah placed a guide booking..."
   - Both notifications marked `is_read: false`

3. **Guide opens dashboard**
   - NotificationBell shows unread count (1)
   - Guide clicks bell → sees notification
   - Notification auto-marked as read on click

4. **Guide confirms booking**
   - Endpoint: `PUT /api/guide/bookings/[id]/confirm`
   - Action: Update booking status to `confirmed`
   - Notification: Call `notifyBookingConfirmed()`

5. **Confirmation notifications**
   - Tourist receives: "Your booking with John has been confirmed!"
   - Guide receives: "You confirmed booking xxx."

6. **Tourist sees confirmation**
   - Dashboard bell shows (1) unread
   - Clicks to view → "Booking confirmed!" message
   - Notification marked as read

---

## Database Queries

### Optimized Notification Fetch

```sql
SELECT 
    n.id,
    n.type,
    n.message,
    n.is_read,
    n.created_at,
    b.id as booking_id,
    b.type as booking_type,
    b.status as booking_status
FROM notifications n
LEFT JOIN bookings b ON n.booking_id = b.id
WHERE n.user_id = $1
ORDER BY n.created_at DESC
LIMIT $2
OFFSET $3
```

**Index:** `@@index([user_id, is_read])` ensures fast lookups

---

## Security Considerations

1. **Authentication Required:** All notification endpoints require authenticated session
2. **Authorization:** Users can only access their own notifications
3. **Data Privacy:** Metadata stored as JSON for flexibility but validated on creation
4. **XSS Prevention:** All notification messages are text-only, sanitized on display

---

## Future Enhancements

- [ ] Real-time push notifications using WebSockets
- [ ] Email notifications for important events
- [ ] SMS notifications for urgent updates
- [ ] Notification preferences/settings per user
- [ ] Batch notification cleanup (auto-delete old notifications)
- [ ] Rich notification types with action buttons

---

## Testing

### Manual Testing Checklist

- [ ] Create booking → verify both parties receive notifications
- [ ] Confirm booking → verify confirmation notifications
- [ ] Cancel booking → verify cancellation notifications  
- [ ] Mark as read → verify unread count decreases
- [ ] Mark all as read → verify count resets to 0
- [ ] Auto-refresh → verify new notifications appear every 60s
- [ ] Click outside dropdown → verify it closes

### API Testing

```bash
# Fetch notifications
curl http://localhost:3000/api/notifications?limit=5

# Mark as read
curl -X PUT http://localhost:3000/api/notifications/{id}/read

# Mark all as read
curl -X PUT http://localhost:3000/api/notifications/read-all
```

---

## Troubleshooting

### No notifications appearing

1. Check user is authenticated
2. Verify `user_id` in database matches session
3. Check database for notification records
4. Verify API endpoints return 200 status

### Unread count not updating

1. Check `is_read` column in database
2. Verify mark-as-read API calls succeed
3. Clear browser cache and refresh

### Notification bell not showing

1. Verify component is imported
2. Check for console errors
3. Ensure user session is active
