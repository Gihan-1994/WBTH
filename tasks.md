# Project Tasks

## Rules
1. Always add comments to exported functions.
2. Use simplest and efficient logics to perform functions.
3. Use performance optimized codes.
4. Use best practices for code quality.
5. Use new dependencies only if they are actually required.
6.Maintain folder structure by separating hooks ,utils,components etc.

## Tasks
- [x] Implement CI/CD Pipelines (GitHub Actions for lint, test, build)
- [x] Implement Role-Based Dashboards
    - [x] Create dashboard layouts for different user roles
    - [x] Implement login redirection logic based on user role
- [x] Implement Tourist Dashboard
    - [x] Update Schema: Add `Tourist` model (country, dob) linked to `User`
    - [x] Backend: API for Tourist Profile (get/update) and Change Password
    - [x] Backend: API for Tourist Bookings (get history, cancel booking)
    - [x] Frontend: Tourist Dashboard UI
        - [x] Top section: Tourist details
        - [x] Profile section: Edit info (name, email, phone, country, dob) & Change Password
        - [x] Booking History: List with status, view details modal, cancel action
        - [x] Bottom section: Booking Statistics
        - [x] Navigation: Button to Home Page
- [x] Implement Guide Dashboard
    - [x] Update Schema: Add `Guide` model (specialization, experience, languages, availability) linked to `User`
    - [x] Backend: API for Guide Profile (get/update) and Change Password
    - [x] Backend: API for Guide Bookings (get history, cancel booking)
    - [x] Frontend: Guide Dashboard UI
        - [x] Top section: Guide details
        - [x] Profile section: Edit info (name, email, phone, specialization, experience, languages, availability) & Change Password
        - [x] Booking History: List with status, view details modal, cancel action
        - [x] Bottom section: Booking Statistics(total, pending, confirmed, cancelled, income from payments)
        - [x] Navigation: Button to Home Page


