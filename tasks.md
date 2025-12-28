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
- [x] Implement Accommodation Provider Dashboard
    - [x] Update Schema: Add `AccommodationProvider` model (company name, list of accommodations owned) linked to `User`
    - [x] Update Schema: Add `Accommodation` model (name, type, amenities, rating, account no, budget, location, price range, province, interests, group size, num booking dates, prior bookings) linked to `AccommodationProvider`
    - [x] Backend: API for Accommodation Provider Profile (get/update) and Change Password
    - [x] Backend: API for Accommodation Provider Bookings (get history, cancel booking)
    - [x] Backend: API for Accommodation Provider Accommodations (get / update / delete / create)
    - [x] Frontend: Accommodation Provider Dashboard UI
        - [x] Top section: Accommodation Provider details
        - [x] Profile section: Edit info (company name, email, phone,company logo image) & Change Password
        - [x] Accommodations section: List with status, view details modal, update action,add some images action,delete action
        - [x] Booking History: List with status, view details modal, cancel action
        - [x] Bottom section: Booking Statistics(total, pending, confirmed, cancelled, income from payments)
        - [x] Navigation: Button to Home Page
- [x] Implement Accommodation Search
    - [x] Backend: API for searching accommodations with filters (location, budget, amenities, etc.)
    - [x] Frontend: Search Page (filters, list of accommodations)
    - [x] Frontend: Accommodation Details Page
- [x] Implement Guide Search
    - [x] Backend: API for searching guides with filters (location, language, expertise, etc.)
    - [x] Frontend: Search Page (filters, list of guides)
    - [x] Frontend: Guide Details Page
- [x] Implement Booking Creation
    - [x] Backend: API for creating bookings
    - [x] Frontend: Booking Flow (select dates, confirm)
- [x] Implement Homepage
    - [x] Main heading ("Tourism Hub") and description ("Your one-stop destination for all tourism needs")
    - [x] Sections: Personal recommendations based on ML algorithms,
        Accommodations, Guides, Upcoming Events , Chat bot interaction , My Profile
        - [x] Each section should have a title and description
        - [x] Navigation: Each section should navigate to its own page
        - [x] when click on my profile section it should navigate to user profile page according to their role. 
        - [x] Include some colourful suitable svg icons for each section
- [x] Implement ML based recommendations (Testing Phase 1)
    - [x] Follow the wbth_6_week_build_plan_architecture_spec.md and under Modules & Responsibilities find 4)Recommendations (ML) and implement section 4.1(Accommodation Recommendation — Simple Hybrid (Rule‑first + Scored Ranking)).
    - [x] As initial step genarate 1000 records of mock data for data columns mentioned in the wbth_6_week_build_plan_architecture_spec.md and under Modules & Responsibilities find 4)Recommendations (ML) and implement section 4.1(Accommodation Recommendation — Simple Hybrid (Rule‑first + Scored Ranking)).
    - [x] Implemet the ML model and try to generate recommendations for a user.
    - [x] Evaluate the model using some simple metrices.
    - [x] Currently user inputs are entered in the same python file.
    - [x] Use simple and efficient logics to perform functions. 
    - [x] Use performance optimized codes.
    - [x] Use best practices for code quality.
    - [x] Use new dependencies only if they are actually required.
    - [x] Add descriptive comments to the code.
    - [x] Do not interact with DB or frontend. 
    - [x] Update current progress and implementation in ML_progress.md file.
- [x] Implement ML based recommendations (Testing Phase 2)
    - [x] Refer the current accommoadation recommendation model and integrate it with the frontend.
    - [x] When user clicks for you section  in frondend it should dirrect to reccommondation page. That page contains 2 tabs as accommodation and guide. Currently implement only accommodation tab.
    - [x] In the accommodation tab, user should be able to select the location, budget, amenities, etc. and get recommendations based on those filters.
    - [x] Integrate the model with the postgres DB and get current accommodation data.
    - [x] Use both mock data and current accommodation data to generate recommendations.
    - [x] If the suggested accommodations are not available in the db it should show flag as "not registered in the system".
    - [x] If the suggested accommodations are available in the db it should show button as "book now".
    - [ ] 
    
    
    
