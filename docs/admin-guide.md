# Admin User Guide

## Getting Started

### First-Time Setup (Admin Registration)

1. **Visit the Homepage**
   - Navigate to the application homepage
   - Look for the "Admin Registration" button (red/pink gradient)
   - **Note:** This button only appears if no admin exists in the system

2. **Complete Registration**
   - Click "Admin Registration"
   - Fill in the registration form:
     - Full Name (required)
     - Email (required)
     - Contact Number (optional)
     - Password (required, minimum 6 characters)
     - Confirm Password (required)
   - Click "Register as Admin"

3. **Auto-Login**
   - After successful registration, you'll be automatically logged in
   - You'll be redirected to the Admin Dashboard
   - The "Admin Registration" button will disappear from the homepage
   - An "Admin Area" button will appear in the top-right corner of the homepage

---

## Accessing the Admin Dashboard

### For Existing Admin

1. **From Homepage**
   - Click the "Admin Area" button (top-right corner)
   - You'll be redirected to the login page

2. **Login**
   - Enter your admin email and password
   - Click "Login"
   - You'll be redirected to the Admin Dashboard

3. **Direct Access**
   - Navigate to: `/dashboard/admin`
   - If not logged in, you'll be redirected to the login page

---

## Admin Dashboard Features

### 📊 Analytics Section

The Analytics section provides comprehensive insights into your platform's performance.

#### Stats Cards

1. **Total Users**
   - Shows total user count
   - Breakdown by type: Tourist, Guide, Provider, Admin

2. **Total Bookings**
   - Shows total booking count
   - Displays conversion rate (confirmed bookings / total bookings)

3. **Platform Income**
   - Currently shows "Not Implemented"
   - Will display platform revenue once fee structure is implemented

4. **Active Guides**
   - Count of guides with availability = true

5. **Active Providers**
   - Count of accommodation providers

6. **Total Revenue**
   - Sum of all confirmed booking prices

#### Charts

1. **User Growth** (Line Chart)
   - Shows new user registrations over time
   - Toggle between daily and weekly views

2. **User Distribution** (Pie Chart)
   - Visual breakdown of users by role
   - Colors: Blue (Tourist), Green (Guide), Purple (Provider), Red (Admin)

3. **Booking Trends** (Bar Chart)
   - Shows booking volume over time
   - Toggle between daily and weekly views

4. **Revenue Trends** (Line Chart)
   - Shows revenue from confirmed bookings over time
   - Toggle between daily and weekly views

5. **Booking Status** (Doughnut Chart)
   - Visual breakdown of bookings by status
   - Colors: Yellow (Pending), Green (Confirmed), Red (Cancelled)

6. **Popular Destinations** (Horizontal Bar Chart)
   - Top 10 destinations by booking count
   - Based on accommodation locations

#### Time Period Toggle

- Switch between "Daily" and "Weekly" views
- Affects all time-based charts and stats
- Located at the top-right of the Analytics section

---

### 👥 Users Section

Manage all users in the system.

#### View Users

- **Table Columns:**
  - Name
  - Email
  - Role (with colored badge)
  - Contact Number
  - Join Date
  - Actions

#### Search Users

1. Enter search term in the search box
2. Search by name or email
3. Press Enter or click the search button

#### Filter by Role

- Use the role dropdown to filter users
- Options: All Roles, Tourist, Guide, Provider, Admin

#### Delete User

1. Click the trash icon next to the user
2. Confirm the deletion
3. **Note:** You cannot delete your own account

#### Create User (Coming Soon)

- Add new users directly from the admin panel
- Assign roles and set initial data

---

### 💬 Messages Section

Send messages to users via in-app notifications and email.

#### Broadcast Message

1. **Select Message Type**
   - "Broadcast to All" is currently available
   - Sends to all users in the system

2. **Compose Message**
   - Enter your message in the textarea
   - Keep it clear and concise

3. **Email Option**
   - Check "Also send as email" to send emails
   - Emails are only sent to users with email notifications enabled
   - Users who disabled email notifications will only receive in-app notifications

4. **Send Message**
   - Click "Send Message"
   - Wait for confirmation
   - You'll see how many users received the message

#### Message Delivery

- **In-App Notifications:**
  - All users receive in-app notifications
  - Visible in the notification bell icon
  - Type: ADMIN_MESSAGE

- **Email Notifications:**
  - Only sent if "Also send as email" is checked
  - Only sent to users with `email_notifications_enabled = true`
  - Subject: "📢 Message from Admin"
  - From: "WBTH Notifications <notifications@nggp94.xyz>"

#### Selective Messaging (Coming Soon)

- Send messages to specific users
- Select users from a list
- Useful for targeted communications

---

## Coming Soon Features

### 🧭 Guides Management

- View all guides with detailed information
- See guide ratings, languages, expertise
- View booking counts per guide
- Manage guide availability

### 🏨 Accommodations Management

- View accommodations grouped by provider
- See accommodation details, ratings, prices
- View booking counts per accommodation
- Manage accommodation listings

### 📅 Events Management

- Create new events
- Edit existing events
- Delete events
- Upload event images
- Set event dates and locations

### 📋 Bookings Management

- View all bookings with full details
- Filter by status (pending, confirmed, cancelled)
- View booking history
- Export booking data

---

## Best Practices

### Security

1. **Keep Your Password Secure**
   - Use a strong, unique password
   - Don't share your admin credentials
   - Change your password regularly

2. **Be Careful with Deletions**
   - User deletions are permanent
   - Always confirm before deleting
   - Consider disabling instead of deleting when possible

3. **Review Before Broadcasting**
   - Double-check messages before sending
   - Broadcast messages go to ALL users
   - Cannot be recalled once sent

### Communication

1. **Clear Messaging**
   - Keep messages concise and clear
   - Include action items if needed
   - Use professional language

2. **Email Etiquette**
   - Only use email for important announcements
   - Respect users' email notification preferences
   - Don't spam users with frequent emails

### Analytics

1. **Regular Monitoring**
   - Check analytics daily or weekly
   - Look for trends and patterns
   - Identify areas for improvement

2. **Data-Driven Decisions**
   - Use analytics to inform decisions
   - Track the impact of changes
   - Monitor user growth and engagement

---

## Troubleshooting

### Cannot Access Admin Dashboard

**Problem:** Redirected to login page or homepage

**Solutions:**
1. Ensure you're logged in with admin credentials
2. Check that your account has admin role
3. Clear browser cache and cookies
4. Try logging out and logging back in

### Charts Not Loading

**Problem:** Analytics charts show loading spinner indefinitely

**Solutions:**
1. Check browser console for errors
2. Ensure you have a stable internet connection
3. Try refreshing the page
4. Check if the API endpoint is accessible

### Cannot Delete User

**Problem:** Error when trying to delete a user

**Solutions:**
1. Ensure you're not trying to delete your own account
2. Check that the user exists
3. Verify you have admin privileges
4. Check browser console for specific error messages

### Messages Not Sending

**Problem:** Broadcast messages fail to send

**Solutions:**
1. Ensure message field is not empty
2. Check your internet connection
3. Verify API endpoint is accessible
4. Check browser console for errors

---

## Support

For technical issues or questions:
1. Check the browser console for error messages
2. Review the implementation documentation
3. Contact the development team

---

## Keyboard Shortcuts

- **Search Users:** Click search box, type, press Enter
- **Navigate Tabs:** Click tab buttons or use Tab key
- **Send Message:** Ctrl/Cmd + Enter in message textarea (coming soon)

---

## Tips & Tricks

1. **Quick Navigation**
   - Use the tab navigation to switch between sections quickly
   - Click "Home" to return to the main site

2. **Efficient User Management**
   - Use role filter to quickly find specific user types
   - Use search to find users by name or email

3. **Analytics Insights**
   - Switch between daily and weekly views for different perspectives
   - Look for patterns in booking trends
   - Monitor user growth to track platform success

4. **Effective Messaging**
   - Draft messages in a text editor first
   - Preview before sending
   - Keep a log of important broadcasts

---

## Version Information

- **Admin Feature Version:** 1.0.0
- **Last Updated:** January 2026
- **Chart.js Version:** 4.x
- **React Chart.js 2 Version:** 5.x
