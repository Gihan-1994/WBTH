# Email Notification Integration - Setup Guide

## ✅ What Was Implemented

Email notifications using **Resend** have been integrated into your existing notification system. Now when booking status changes, users receive **both**:
1. In-app notification (bell icon)
2. Email notification (same message)

---

## 📋 Setup Checklist

### 1. Environment Variable (Already Done ✓)

You've already added `RESEND_API_KEY` to `/apps/web/.env`

### 2. Configure Email Domain (Important!)

In `apps/web/lib/email.ts`, line 23, update the sender email:

```typescript
from: 'WBTH Notifications <notifications@yourdomain.com>',
```

**Options:**
- **For Testing**: Use `onboarding@resend.dev` (Resend's test domain)
- **For Production**: Add your own domain in Resend dashboard

**To use Resend's test domain (for immediate testing):**
```typescript
from: 'WBTH <onboarding@resend.dev>',
```

### 3. Optional: Add App URL

Add to `/apps/web/.env` for "View Dashboard" button in emails:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔧 Files Modified

### Created
- `/apps/web/lib/email.ts` - Email service using Resend

### Modified
- `/apps/web/lib/notifications.ts` - Added email sending to `createNotification()`

---

## 🎨 Email Template Features

The HTML emails include:
- ✅ Professional gradient header with WBTH branding
- ✅ Clean, responsive design
- ✅ Same notification message as in-app
- ✅ Booking ID display
- ✅ "View Dashboard" button
- ✅ Emoji subjects (📅 🎥 ❌ etc.)

---

## 🧪 Testing

### Quick Test

1. **Update sender email** in `email.ts` to `onboarding@resend.dev`
2. **Restart dev server**: `yarn dev`
3. Create a booking
4. Check your email inbox

### What to Check

- [ ] Email arrives at both tourist and provider inboxes
- [ ] Subject line has emoji and correct text
- [ ] Message matches in-app notification
- [ ] Booking ID is displayed
- [ ] Email looks good on desktop and mobile
- [ ] "View Dashboard" button works

---

## 📊 How It Works

```typescript
// When createNotification() is called:

1. Creates in-app notification in database
2. Fetches user's email
3. Sends email asynchronously (non-blocking)
4. If email fails, logs error but doesn't break booking flow
```

**Fire-and-forget approach**: Email sending doesn't block the booking process. If Resend is down, bookings still work!

---

## 🎯 Email Subjects

| Event | Subject |
|-------|---------|
| Booking Created | 📅 New Booking Notification |
| Booking Confirmed | ✅ Booking Confirmed |
| Booking Cancelled | ❌ Booking Cancelled |
| Booking Updated | 🔄 Booking Updated |
| Payment Received | 💰 Payment Received |
| Payment Sent | 💸 Payment Sent |

---

## 🔍 Troubleshooting

### Emails not sending?

**Check console logs** - Look for:
```
Email sent to user@example.com: ✅ Booking Confirmed
```

Or errors:
```
Failed to send email notification: [error details]
```

### Common Issues

1. **"RESEND_API_KEY not configured"**
   - Make sure `.env` has `RESEND_API_KEY=re_...`
   - Restart dev server after adding

2. **"Domain not verified"**
   - Use `onboarding@resend.dev` for testing
   - Or verify your domain in Resend dashboard

3. **Emails go to spam**
   - Use Resend's verified domain
   - Or set up SPF/DKIM records for your domain

---

## 🚀 Production Deployment

### Before going live:

1. **Add your domain** in Resend dashboard
2. **Verify domain** (add DNS records)
3. **Update sender email** in `email.ts`
4. **Set `NEXT_PUBLIC_APP_URL`** to production URL
5. **Test** with real email addresses
6. **Monitor** Resend dashboard for delivery stats

---

## 📈 Resend Free Tier Limits

- ✅ 100 emails per day
- ✅ 3,000 emails per month
- ✅ Unlimited team members
- ✅ Email analytics

**Upgrade when you exceed limits** - Resend pricing is very affordable.

---

## 🎨 Customizing Email Template

To customize the email design, edit `/apps/web/lib/email.ts`:

```typescript
// Change colors
style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"

// Add more info
${params.additionalInfo ? `<p>${params.additionalInfo}</p>` : ''}

// Customize footer
<p style="color: #999;">Contact us at support@yourdomain.com</p>
```

---

## ✨ Future Enhancements

- [ ] Email preferences (opt-out)
- [ ] Digest emails (daily summary)
- [ ] Rich booking details in email
- [ ] Attachment support (booking confirmation PDF)
- [ ] Multi-language emails
