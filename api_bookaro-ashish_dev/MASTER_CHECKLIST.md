# 🏠 Bookaroo — Master Project Checklist
**Platform:** Bookaroo (AnyHomes) — "The LinkedIn of Real Estate"  
**Stack:** React (TypeScript) + Node.js + MongoDB + Stripe + ChatGPT API  
**Live URL:** https://book.jcsoftwaresolution.in/  
**Design Reference:** https://marvelapp.com/prototype/83671c3/screens (35 screens)  
**Rules:** ✅ Strictly follow client requirements | ✅ All changes must be responsive (mobile/tablet/desktop) | ✅ Stick to existing purple/white Bookaroo theme

---

> **How to use this checklist:**  
> Change `[ ]` to `[x]` when a task is complete.  
> Each task has a **[SCOPE]** tag: `FRONTEND`, `BACKEND`, `BOTH`, or `BUG FIX`.

---

## 🔴 PHASE 1 — UI/UX: Landing Page Redesign (Non-Logged)
> **Marvel Refs:** `landing page - Mode SAAS`, `landing page - Pilot Lille`  
> **Current File:** `bookaro_frontend-6_Jan/src/Pages/LandingPage/`

### Section 1.1 — Hero / Above the Fold
- [ ] `[FRONTEND]` Replace current hero section with new design (cleaner layout, updated headline copy)
- [ ] `[FRONTEND]` Ensure search widget (Off-Market / Rent Now / Buy Now / Directory tabs) remains fully functional with new design
- [ ] `[FRONTEND]` Make hero fully responsive — mobile first (hamburger menu, stacked search form)
- [ ] `[FRONTEND]` Update top navigation bar styling to match new design (logo, nav links, Login/Signup buttons)

### Section 1.2 — "How It Works" Section (Sellers & Buyers)
- [x] `[FRONTEND]` Add/update "How it works for Sellers" visual flow (5-step process: List → Off-Market → Public Market → Transaction Tool → Transfer)
- [x] `[FRONTEND]` Add/update "How it works for Buyers" visual flow
- [x] `[FRONTEND]` Ensure section is responsive with proper card/icon layout on mobile

### Section 1.3 — Value Proposition Sections
- [ ] `[FRONTEND]` Update "Why Bookaroo" content blocks for Sellers section
- [ ] `[FRONTEND]` Update "Why Bookaroo" content blocks for Buyers section
- [x] `[FRONTEND]` Add Testimonials section (as shown in Marvel design)

### Section 1.4 — FAQ Section
- [x] `[FRONTEND]` Implement accordion-style FAQ component with open/close animation
- [ ] `[FRONTEND]` Add navigation arrows to cycle through FAQ items (as shown in Marvel)
- [x] `[FRONTEND]` Style active (open) vs. inactive (closed/light gray) FAQ states correctly
- [x] `[FRONTEND]` Make FAQ responsive — full-width accordion on mobile

### Section 1.5 — Blog/Learning Center Preview
- [ ] `[FRONTEND]` Add blog content preview cards section at bottom of landing page
- [ ] `[FRONTEND]` Link cards to actual Learning Center pages

### Section 1.6 — Footer
- [x] `[FRONTEND]` Review and update footer to match new design layout
- [x] `[FRONTEND]` Ensure all footer links are working and responsive

---

## 🟠 PHASE 2 — UI/UX: Post-Login App Interface
> **Marvel Refs:** `Dashboard - User`, `Onboarding`, `Transaction tool`  
> **Current Files:** `bookaro_frontend-6_Jan/src/Pages/Home.jsx`, all logged-in pages

### Section 2.1 — Post-Login Layout Overhaul
- [x] `[FRONTEND]` Implement persistent left sidebar navigation for all logged-in pages (replacing or upgrading current nav structure)
- [x] `[FRONTEND]` Left sidebar should include: Dashboard, Search/Directory, Messages, My Project, Owner Space, On-Demand Services, Profile/Settings
- [ ] `[FRONTEND]` Sidebar must be collapsible on mobile (hamburger → drawer)
- [ ] `[FRONTEND]` Apply new app-shell visual style consistently across all logged-in pages (background, cards, typography, spacing)
- [x] `[FRONTEND]` Ensure logged-in state feels distinct from non-logged (users should feel "inside an app", not on a marketing page)

### Section 2.2 — New User Dashboard (Home after login)
> **Marvel Ref:** `Dashboard - User`
- [x] `[BOTH]` Create new Dashboard page as the post-login landing screen
- [ ] `[FRONTEND]` Widget: "My Property Attractivity" — views, shares, messages received (for sellers/landlords)
- [ ] `[FRONTEND]` Widget: "My Saved Search Results" — show latest results from saved searches
- [ ] `[FRONTEND]` Widget: "My Purchase Pipeline" — properties in funnel, visits done, offers made
- [ ] `[FRONTEND]` Widget: "My Rental Pipeline" — rental applications submitted
- [ ] `[FRONTEND]` Widget: "Peer-to-Peer Global Metrics" — overestimated/underestimated/appropriate stats for my property
- [ ] `[FRONTEND]` Widget: "Properties awaiting Peer-to-Peer estimation in my area" — new properties near me
- [ ] `[FRONTEND]` Widget: "New content in Learning Center" — latest blog/video content
- [ ] `[BACKEND]` Create dashboard summary API endpoint aggregating all widget data for the logged-in user
- [x] `[FRONTEND]` Dashboard must be fully responsive — 2-column grid on tablet, single column on mobile

### Section 2.3 — Onboarding Screen
> **Marvel Ref:** `Onboarding`
- [x] `[FRONTEND]` Implement post-registration onboarding screen guiding new users through platform features
- [ ] `[FRONTEND]` Onboarding should surface key next actions: "List a property", "Start a search", "Fill your buyer/renter file"
- [x] `[FRONTEND]` Onboarding screen should be skippable and not repeat after first dismissal

---

## 🟡 PHASE 3 — Document-Based Declaration Expansion
> **Current File:** `bookaro_frontend-6_Jan/src/Pages/RenterFile/RenterFile.jsx`  
> **Current Backend:** `api_bookaro-ashish_dev/app/models/users.model.js` (declarativeRenterFiles field)  
> **Current State:** 3 questions — BuyOption, InvestOption, postalCode

### Section 3.1 — Renter Declarative File
- [ ] `[BOTH]` Add ~10–15 new questions to the renter declarative file form
- [ ] `[BACKEND]` Extend `declarativeRenterFiles` schema in users model to include all new fields
- [ ] `[FRONTEND]` Build form UI for all new questions following existing question pattern (radio, dropdown, text input as appropriate)
- [ ] `[FRONTEND]` Ensure form validates correctly and saves incrementally
- [ ] `[FRONTEND]` Ensure all new questions display correctly in the renter's profile summary view
- [ ] `[FRONTEND]` Make form fully responsive (single column on mobile)

### Section 3.2 — Buyer Declarative File
- [ ] `[BOTH]` Add ~10–15 new questions to the buyer declarative file form (same scope as renter)
- [ ] `[BACKEND]` Extend `declarativeBuyerFiles` schema accordingly
- [ ] `[FRONTEND]` Build form UI for buyer declarative file new questions
- [ ] `[FRONTEND]` Ensure buyer declarative file saves and displays correctly

> ⚠️ **PENDING FROM CLIENT:** Exact list of 10–15 questions (text, field types, validation rules) must be confirmed before building.

---

## 🟢 PHASE 4 — QR Code Feature
> **Marvel Ref:** `Property QR Code`  
> **Current State:** Not built. No QR code model/controller exists in codebase.

### Section 4.1 — Backend: QR Code & Tracking URL
- [ ] `[BACKEND]` Create new DB model: `propertyQrCodes` — fields: `propertyId`, `trackingUrl`, `scanCount`, `qrCodeImage`, `createdAt`
- [ ] `[BACKEND]` Create API: `POST /property/generate-qr/:propertyId` — generate unique short tracking URL + QR code image for a property
- [ ] `[BACKEND]` Create API: `GET /qr/:trackingCode` — redirect endpoint that increments `scanCount` then redirects to the property detail page URL
- [ ] `[BACKEND]` Create API: `GET /property/qr-stats/:propertyId` — return QR code + scan count for a property
- [ ] `[BACKEND]` Ensure one QR code per property (idempotent — regenerate if requested again)
- [ ] `[BACKEND]` Install and use a QR code generation library (e.g. `qrcode` npm package)

### Section 4.2 — Frontend: QR Code UI (Owner Space)
> **Marvel Ref:** `Property QR Code` screen
- [ ] `[FRONTEND]` Add "QR Code" option in the owner's property management panel
- [ ] `[FRONTEND]` UI: Property selector dropdown (if owner has multiple properties)
- [ ] `[FRONTEND]` UI: "Generate QR Code" button — calls API and displays the QR code image
- [ ] `[FRONTEND]` UI: If QR already exists, show it immediately with scan count
- [ ] `[FRONTEND]` UI: "Download QR Code" button — saves QR as PNG/SVG to user's device
- [ ] `[FRONTEND]` UI: Display scan count ("Scanned X times")
- [ ] `[FRONTEND]` Make QR code section responsive and accessible on mobile

---

## 🔵 PHASE 5 — On-Demand Services Marketplace
> **Marvel Refs:** `On demand agent - Landing page`, `On demand agent section - Individual user` (5 screens), `On demand agent section - For the company` (3 screens), `Company profile - On demand services view` (4 screens)  
> **Current State:** `services.model.js` exists (admin-only service categories). No marketplace logic built yet. Stripe already integrated.

### Section 5.1 — Admin: Service Category Management
- [ ] `[BACKEND]` Extend `services` admin panel to support: category, subcategory, service type (package vs. one-time), description
- [ ] `[BACKEND]` Admin can create/edit/deactivate service categories that appear in company's "Add Service" dropdown

### Section 5.2 — Company Side: Service Management
> **Marvel Ref:** `On demand agent section - For the company`
- [ ] `[BACKEND]` Create new DB model: `onDemandServices` — fields: `companyId`, `name`, `category`, `subcategory`, `serviceType` (package/one-time), `location`, `radius`, `quantity`, `price`, `valueDescription`, `description`, `deliverables`, `status` (active/inactive/draft), `soldCount`, `totalRevenue`
- [ ] `[BACKEND]` Create CRUD APIs for company service management: add, edit, activate/deactivate, delete, list
- [ ] `[FRONTEND]` New page: Company "On-Demand Services" management section (accessible from left menu when logged in as company)
- [ ] `[FRONTEND]` Table view: list all services with columns — Date Created, Category, Subcategory, Type, Price, Times Sold, Total Revenue, Status, Actions (view/edit/deactivate/delete)
- [ ] `[FRONTEND]` "Add New Service" form: Category (dropdown), Subcategory (dropdown), Location + radius, Quantity, Type (package/one-time), Price, Value description, Service description, Deliverables, Payment/invoicing info (read-only), Save as Draft / Create & Activate buttons
- [ ] `[FRONTEND]` "Services Sold" table: list all sold services with buyer, property, date, amount, status (ongoing/finished/cancelled), payment status, Release Payment / Dispute buttons, Invoice link
- [ ] `[FRONTEND]` All company service pages must be responsive

### Section 5.3 — User Side: Browse & Purchase Services
> **Marvel Ref:** `On demand agent section - Individual user`, `On demand agent - Landing page`
- [ ] `[BACKEND]` Create new DB model: `servicePurchases` — fields: `serviceId`, `buyerId`, `propertyId`, `sellerId`, `amount`, `status` (ongoing/finished/cancelled), `paymentStatus` (pending/released/disputed), `deliveryDate`, `stripePaymentIntentId`, `invoiceUrl`
- [ ] `[BACKEND]` Create APIs: search/filter services (by type, location, category), get service detail, purchase service (Stripe payment intent), release payment, raise dispute, list purchased services
- [ ] `[FRONTEND]` New "On-Demand Services" landing page (accessible from left sidebar / dashboard)
- [ ] `[FRONTEND]` Service search: multi-select "type of help" chips + location input + "Show results" button
- [ ] `[FRONTEND]` Search results: service cards showing — provider name, years experience, platform services count, ratings, service name, price, location/radius, CTA (Contact / Buy)
- [ ] `[FRONTEND]` Service detail modal/page: full description, deliverables, payment & invoicing explanation, price (tax included), Buy button
- [ ] `[FRONTEND]` Favorite agents: star/bookmark icon on agent card, "My Favorite Agents" saved list page
- [ ] `[FRONTEND]` "My Purchased Services" page: table with — Date, Service type, Property, Seller, Reference #, Amount, Service Status, Payment Status, Release/Dispute/Invoice actions
- [ ] `[BACKEND]` Stripe escrow-style logic: capture payment → hold → release on buyer confirmation OR dispute flow
- [ ] `[FRONTEND]` All user service pages must be responsive

### Section 5.4 — Company Profile: Services Tab
> **Marvel Ref:** `Company profile - On demand services view`, `Company profile - independant agent profile`
- [ ] `[FRONTEND]` Add "Services" tab to company/agent profile page (alongside existing Info, Reviews, Properties tabs)
- [ ] `[FRONTEND]` Services tab shows all active services offered by that company/agent (same card format as search results)
- [ ] `[FRONTEND]` Independent agent profile: add Portfolio tab (project showcase with images + description)
- [ ] `[FRONTEND]` Independent agent profile: Reviews tab (ratings breakdown + individual review cards)
- [ ] `[BACKEND]` Update company profile API to include services count and active services list

---

## 🟣 PHASE 6 — AI Agent Logging & ChatGPT Integration
> **Current State:** ChatGPT API partially integrated. No event → conversation orchestration. No AI log tables.  
> **Reference:** AI trigger events table (Excel/Google Sheet — to be shared by client)

### Section 6.1 — Database: AI Agent Log Tables
- [ ] `[BACKEND]` Create new DB model: `aiAgentLogs` — fields: `triggerEvent`, `triggerEventKey`, `recipientUserId`, `recipientRole` (seller/buyer/renter/owner), `propertyId`, `interestId`, `promptSent`, `contextData` (object), `aiResponse`, `channel` (in-app/email/push), `deliveredAt`, `status` (sent/failed/pending)
- [ ] `[BACKEND]` Create new DB model: `aiConversationConfig` — fields: `eventKey`, `interactionPurpose`, `recipientRole`, `frequency` (once/each-time), `promptTemplate`, `contextFields` (array of fields to pass), `expectedAction`, `channel`, `status` (active/inactive)
- [ ] `[BACKEND]` Seed initial `aiConversationConfig` collection from client-provided Excel table

### Section 6.2 — Orchestrator Service
- [ ] `[BACKEND]` Create orchestrator module that hooks into `InterestsController.js` post-status-change events
- [ ] `[BACKEND]` For each funnel status change, orchestrator looks up matching `aiConversationConfig` by `eventKey`
- [ ] `[BACKEND]` If match found: collect context data (user name, property details, visit date, etc.), build prompt, call ChatGPT API
- [ ] `[BACKEND]` Store full interaction in `aiAgentLogs` (both prompt+context and response)
- [ ] `[BACKEND]` Deliver AI message to user via in-app notification / message thread
- [ ] `[BACKEND]` Respect `frequency` setting — if "once", check logs before sending to avoid duplicates

### Section 6.3 — ChatGPT API Review & Alignment
- [ ] `[BACKEND]` Review existing ChatGPT API integration for connectivity and error handling
- [ ] `[BACKEND]` Ensure API calls are routed through a secure backend proxy (no API key exposed on frontend)
- [ ] `[BACKEND]` Validate that ChatGPT responses are correctly captured and stored in `aiAgentLogs`
- [ ] `[BACKEND]` Add rate limiting / error retry logic for API call failures
- [ ] `[BACKEND]` Restrict AI responses to real estate context only (system prompt guardrails)

> ⚠️ **PENDING FROM CLIENT:** Excel table with all trigger events, prompts, context fields, and expected actions must be provided before building orchestrator logic.

---

## ⚪ PHASE 7 — Transaction Tool Enhancements
> **Marvel Ref:** `Transactional flow update`  
> **Current Files:** `bookaro_frontend-6_Jan/src/Pages/RealEstateTransactionOwner/LeadCards.js`

### Section 7.1 — Lead Cards: New Data Points
- [ ] `[BOTH]` Add "Number of Visits" to each lead card on the seller's transaction funnel view
- [ ] `[BOTH]` Add "Number of Offers Made" to each lead card
- [ ] `[BOTH]` Add "Property Search Time" (how long buyer has been looking) to each lead card
- [ ] `[BACKEND]` Update interests/leads API to return these three new data points
- [ ] `[FRONTEND]` Update `LeadCards.js` UI to display the three new data points cleanly
- [ ] `[FRONTEND]` Ensure lead cards remain responsive at all screen sizes

### Section 7.2 — Bug Fix: Signing Date Visibility
- [ ] `[FRONTEND]` Fix bug: "Signing date" section/field should NOT be visible/displayed until `offerStatus === true` (offer has been accepted)
- [ ] `[FRONTEND]` Apply same fix on both seller side (`RealEstateTransactionOwner`) and buyer side (`RealEstateTransactionSearcher`)

---

## ⚫ PHASE 8 — Bug Fixes & Minor UI Corrections

### Section 8.1 — Peer-to-Peer Estimation Rating Display
- [ ] `[FRONTEND]` Fix rating bar chart: 1-star should be at the bottom, 5-star at the top (currently reversed)
- [ ] `[FRONTEND]` Verify fix applies in both owner's campaign dashboard and global metrics view

### Section 8.2 — Home Page (Logged-In State)
- [ ] `[FRONTEND]` After login, redirect/show new Dashboard (Phase 2.2) instead of the landing page — they must feel like they entered an app

### Section 8.3 — "My Project" → Home Seeker Section
- [ ] `[FRONTEND]` Remove duplicate "Manage your buyer file" link from Home Seeker section — only "Manage buyer file" should appear (not both seller file and buyer file links)

### Section 8.4 — Transaction Tool: "Signing date" (already in 7.2)
- Already tracked above in Phase 7.2

### Section 8.5 — General Responsive Audit
- [ ] `[FRONTEND]` Audit ALL pages for responsiveness: mobile (375px), tablet (768px), desktop (1280px+)
- [ ] `[FRONTEND]` Fix any overflow, broken layout, or unusable UI on mobile/tablet

---

## 📋 CROSS-CUTTING REQUIREMENTS (apply to ALL phases)

- [ ] All new UI components must use the existing **Bookaroo theme**: purple primary (`#7C3AED` approx), white backgrounds, clean sans-serif typography
- [ ] All new pages/components must be **fully responsive** (mobile-first)
- [ ] All API calls must follow existing **error handling patterns** in codebase
- [ ] No new third-party libraries added without discussion
- [ ] All new backend routes must follow existing **auth middleware** patterns
- [ ] Language: all development in **English** (French translation pass is separate, out of scope)
- [ ] All changes committed with clear **git commit messages** per feature/fix

---

## 🚫 EXPLICITLY OUT OF SCOPE (do not build)
- Mobile application (iOS/Android)
- Multilingual / French translation
- Advanced analytics dashboards
- AI model fine-tuning or custom training
- New payment flows beyond on-demand service purchases
- SEO optimization
- Import property from external URL feature

---

## 📊 PROGRESS SUMMARY

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Landing Page UI Redesign | ⬜ Not Started |
| Phase 2 | Post-Login App Interface + Dashboard | ⬜ Not Started |
| Phase 3 | Declaration File Expansion | ⏳ Awaiting questions from client |
| Phase 4 | QR Code Feature | ⬜ Not Started |
| Phase 5 | On-Demand Services Marketplace | ⬜ Not Started |
| Phase 6 | AI Agent Logging & ChatGPT | ⏳ Awaiting trigger events table from client |
| Phase 7 | Transaction Tool Enhancements | ⬜ Not Started |
| Phase 8 | Bug Fixes & Responsive Audit | ⬜ Not Started |

---

*Last updated: April 9, 2026 — Derived from video walkthrough, Scope of Work document, codebase analysis (3 repos), live site review (book.jcsoftwaresolution.in), and MarvelApp prototype (35 screens).*
