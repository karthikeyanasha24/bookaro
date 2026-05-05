# Bookaroo — Change Flow Document
**Project:** Bookaroo ("AnyHomes") — The LinkedIn of Real Estate  
**Client:** Yves  
**Prepared by:** Development Team  
**Date:** April 2026  

---

## Overview

This document summarises all changes made to the Bookaroo platform across Phases 1–3. It is written to be clear and non-technical so you can walk through each change with the client confidently.

---

## PHASE 1 — Landing Page Redesign

### What changed on the public homepage

**Goal:** Replace the old French-language sections with a modern, English-language landing page that tells new visitors exactly what Bookaroo does and why they should sign up.

---

### 1.1 — "How It Works" — For Sellers (NEW)

**File:** `src/Pages/Home.jsx`  
**What the client sees:** A horizontal 5-step timeline (collapsing to vertical on mobile) that walks property owners through the Bookaroo journey:

| Step | Label |
|------|-------|
| 1 | List in Directory |
| 2 | Test with Off-Market |
| 3 | Publish on Market |
| 4 | Transaction Tool |
| 5 | Transfer Ownership |

- **Desktop/tablet:** Steps appear side by side with purple numbered circles connected by a line
- **Mobile:** Steps stack vertically with a connector line between them
- **Colours:** Purple `#976DD0` circles and connectors; grey `#47525E` labels

---

### 1.2 — "How It Works" — For Buyers (NEW)

**File:** `src/Pages/Home.jsx`  
**What the client sees:** A two-column section explaining the 3 buyer steps, alongside a "Why Choose Bookaroo?" value card with:
- 4 checkmark bullet points (exclusive off-market access, direct owner connection, transparent transactions, integrated tools)
- A "Sign Up to Browse" / "Start Browsing" button (shows correct label based on login state)

---

### 1.3 — Testimonials Section (NEW)

**File:** `src/Pages/Home.jsx`  
**What the client sees:** Three user testimonial cards in a grid (3-col on desktop, 1-col on mobile):
- Marie Dubois — Property Seller
- Jean Martin — Home Buyer
- Sophie Lambert — Real Estate Agent

Each card has an avatar initial, role badge, and an italic quote.

---

### 1.4 — FAQ Accordion Section (NEW)

**File:** `src/Pages/Home.jsx`  
**What the client sees:** 5 accordion questions with purple expand/collapse behaviour:
1. How do I list my property on Bookaroo?
2. Is it really free to list?
3. What is the Off-Market feature?
4. How safe are transactions on Bookaroo?
5. Can I use Bookaroo as a buyer without listing?

Clicking a question opens the answer. The active item turns purple. Works on all screen sizes.

---

### 1.5 — Old French Content Removed

**Files modified:** `src/Pages/Home.jsx`  
**What changed:** The following old French-language sections were removed entirely:
- "Pourquoi Bookaroo" (Why Bookaroo)
- "Transaction simplifiée" (Simplified Transaction) 
- "Historique des transactions" (Transaction History)
- Purple CTA banner with "C'est 100% gratuit" text

These sections were replaced by the new English sections above (1.1–1.4).

---

### 1.6 — New Footer (NEW)

**File:** `src/Pages/Home.jsx`  
**What the client sees:** A dark purple footer (`#2D1B4E`) at the bottom of the homepage with:
- **Brand column** — Bookaroo logo, tagline, social media icon links
- **Platform links** — Browse Properties, Off-Market, List My Property, Renter File, Buyer File
- **Company links** — About, Plans & Pricing, Market Insights, Blog, Help Center
- **Newsletter subscription** — Email input + Subscribe button
- **Bottom bar** — © copyright year (auto-updates), Privacy Policy / Terms / Cookie Settings links

---

## PHASE 2 — Post-Login App Interface

### What changed for logged-in users

**Goal:** Give logged-in users a modern dashboard-style interface with a persistent navigation sidebar and a summary dashboard of their activity.

---

### 2.1 — Left Navigation Sidebar (NEW)

**File:** `src/components/global/Sidebar/index.js`  
**Who sees it:** All logged-in users, on all pages (desktop only — hidden on mobile/tablet)  
**What the client sees:** A fixed left sidebar with:

| Icon | Label | Destination |
|------|-------|-------------|
| 🏠 | Dashboard | /dashboard |
| 🏡 | My Properties | /my-properties |
| 📋 | Directory | /properties |
| 📁 | My Project | /project |
| 📄 | Buyer File | /buyer-file |
| 🗂️ | Renter File | /renter-file |
| 📑 | Seller File | /seller-file |
| 🤝 | Transactions | /real-estate-transaction-owner |
| 🔔 | Search Alerts | /serach-alert |
| 📊 | Market Insights | /past-transactions |
| 💬 | Chat | /chat |
| 👤 | Profile | /profile/Account |

- **Collapse/Expand** button (‹/›) to show only icons when collapsed (saves screen space)
- Active page is highlighted in purple
- User name and plan type shown at the bottom of the sidebar
- **How it integrates:** The sidebar is automatically added to every page when the user is logged in, through the global `PageLayout` component. No changes needed to individual pages.

---

### 2.2 — Dashboard Page (NEW)

**File:** `src/Pages/Dashboard/index.jsx`  
**Route:** `/dashboard`  
**What the client sees:** A full-page dashboard with the following layout:

**Header Row:**  
- "Welcome back, [Name] 👋" greeting
- Current plan badge + Upgrade button

**8 Summary Widgets (2×4 grid on desktop, 2×4 on mobile):**

| # | Widget | Navigates to |
|---|--------|-------------|
| 1 | My Properties | /my-properties |
| 2 | Active Transactions | /real-estate-transaction-owner |
| 3 | Property Views | /my-properties |
| 4 | Followed Properties | /followed-properties |
| 5 | Search Alerts | /serach-alert |
| 6 | Unread Messages | /chat |
| 7 | Pending Visits | /real-estate-transaction-owner |
| 8 | Market Updates | /past-transactions |

Each widget shows a live count (fetched from the API), an icon, and a colour-coded label. Clicking any widget navigates to the relevant page.

**Quick Actions Row:** 6 shortcut buttons for the most common tasks (List Property, Search, Buyer File, Renter File, Market Data, Settings)

**Bottom Two Columns:**
- **Recent Activity** — Shows recent platform actions; empty state shows a "List My Property" CTA
- **Plan Card** — Shows current plan name with a "View All Plans" link
- **Profile Completion** — Checklist of 4 items (basic info, phone, company, buyer/renter file) with green ticks when done

---

### 2.3 — Onboarding Screen (NEW)

**File:** `src/Pages/Onboarding/index.jsx`  
**Route:** `/onboarding`  
**What the client sees:** A 5-step onboarding wizard for new users, with:

| Step | Question |
|------|----------|
| 1 | What best describes you? (Buyer / Seller / Both / Agent) |
| 2 | What are your real estate goals? (multi-select) |
| 3 | What's your project timeline? |
| 4 | What type of property? + Preferred location input |
| 5 | Confirmation screen + Go to Dashboard button |

- Progress bar at top
- Step dots showing completion
- Skip option at bottom
- On completion, saves `onboardingData` to the user's profile via API and redirects to `/dashboard`

---

### 2.4 — Sidebar Offset Applied to All Pages

**File:** `src/components/global/PageLayout/index.js`  
**What changed:** The main content area (`<main>`) automatically shifts right by 220px on desktop when the user is logged in, so page content doesn't overlap with the new sidebar. On mobile/tablet, the sidebar is hidden (CSS `hidden lg:flex`) and there is no offset.

---

### 2.5 — Routes Added

**File:** `src/App.tsx`  
Two new routes registered:
- `/dashboard` → `Pages/Dashboard`
- `/onboarding` → `Pages/Onboarding`

---

## PHASE 3 — Declaration File Expansion

### What changed in the user declaration forms

**Goal:** Collect more detailed information from both renters and buyers so that property owners and agents get richer applicant profiles. The client requested 12 additional questions on each form.

---

### 3.1 — Renter File — New Questions

**File:** `src/Pages/RenterFile/RenterFile.jsx`  
**Status:** Already implemented in a prior session ✅

The following 12 new questions were added to the "Declarative" tab of the Renter File (in addition to the original 3: Alone/Two/SCI, Investment type, City):

| # | Question | Type |
|---|----------|------|
| 1 | Employment status | Button select (CDI/CDD/Self-employed/Civil servant/Retired/Other) |
| 2 | Gross monthly income | Button select (ranges) |
| 3 | Number of occupants | Button select (1–5+) |
| 4 | Current housing situation | Button select (Owner/Tenant/Hosted) |
| 5 | Reason for moving | Button select (Professional/Personal/Enlargement/Other) |
| 6 | Desired move-in date | Date input |
| 7 | Do you have pets? | Button select (Yes/No) |
| 8 | Do you have a guarantor? | Button select (Yes/No/Visale) |
| 9 | Duration of employment | Button select (< 1yr / 1–3yrs / 3yrs+) |
| 10 | Do you receive housing benefit (APL)? | Button select (Yes/No) |
| 11 | Desired rental duration | Button select (Short/Medium/Long) |
| 12 | City you are looking in | Free-text input |

**Backend schema updated:** `declarativeRenterFiles` in `users.model.js` already contains all these fields.

---

### 3.2 — Buyer File — New Questions

**File:** `src/Pages/BuyerFile/index.js`  
**What was added:** The following 12 new questions were added to the "Declarative" tab of the Buyer File (after the original 3 questions):

| # | Question | Type |
|---|----------|------|
| 1 | Your total budget | Button select (ranges up to €700k+) |
| 2 | Preferred property type | Button select (Apartment/House/Building/Land/Commercial) |
| 3 | Desired surface area (m²) | Button select (ranges) |
| 4 | Number of rooms needed | Button select (Studio to 6+ rooms) |
| 5 | How do you plan to finance? | Button select (Cash/Mortgage/Investigating) |
| 6 | Mortgage pre-approval status | Button select (Approved/In progress/Not yet/N/A) |
| 7 | Your employment status | Button select (CDI/CDD/Self-employed/Civil servant/Retired/Other) |
| 8 | Gross monthly household income | Button select (ranges) |
| 9 | When do you want to buy? | Button select (ASAP / 3–6m / 6–12m / 1–2yrs / Exploring) |
| 10 | Have you already sold your current property? | Button select (Yes/No/N/A) |
| 11 | How long have you been searching? | Button select (Just started → 1+ year) |
| 12 | What is your top priority? | Button select (Price/Location/Size/Condition/Neighbourhood) |

---

### 3.3 — Database Schema Updates

**File:** `api_bookaro-ashish_dev/app/models/users.model.js`  

**`declarativeBuyerFiles`** — 12 new String fields added:
`budgetRange`, `propertyType`, `desiredArea`, `numberOfRooms`, `financingStatus`, `mortgagePreApproved`, `employmentStatus`, `monthlyIncome`, `purchaseTimeline`, `alreadySoldProperty`, `searchDuration`, `buyerPriority`

**`onboardingData`** (new nested object) — stores the 5-step onboarding answers:
`profileType`, `projectTimeline`, `budget`, `propertyType`, `location`, `goals[]`, `notifications`

**`onboardingComplete`** — Boolean flag to track if user completed onboarding

---

## Summary of Files Changed

| File | Phase | What Changed |
|------|-------|-------------|
| `src/Pages/Home.jsx` | 1 | Added How It Works (Seller + Buyer), Testimonials, FAQ, Footer; removed old French sections |
| `src/components/global/PageLayout/index.js` | 2 | Added Sidebar import + conditional rendering + main offset |
| `src/components/global/Sidebar/index.js` | 2 | **NEW FILE** — Left navigation sidebar |
| `src/Pages/Dashboard/index.jsx` | 2 | **NEW FILE** — Dashboard with 8 widgets |
| `src/Pages/Onboarding/index.jsx` | 2 | **NEW FILE** — 5-step onboarding wizard |
| `src/App.tsx` | 2 | Added `/dashboard` and `/onboarding` routes |
| `src/Pages/BuyerFile/index.js` | 3 | Added 12 new declarative questions + expanded state |
| `api_bookaro-ashish_dev/app/models/users.model.js` | 3 | Extended buyer schema, added onboarding fields |

---

## What Stays Exactly the Same

- All existing property search, off-market, and directory functionality
- All existing payment/Stripe integration
- All navigation menus and dropdowns in the top navbar
- All existing property listing and editing flows
- All existing authentication (login, signup, OTP, forgot password)
- All existing chat functionality
- All existing transaction management pages
- All mobile responsiveness for existing pages

---

## Responsive Design Notes

All new components follow the same breakpoint pattern as the rest of the codebase:
- **Mobile (< 768px):** Single-column layouts, sidebar hidden, stacked cards
- **Tablet (768px–1279px):** Two-column layouts where applicable, sidebar hidden
- **Desktop (1280px+):** Full multi-column layouts, sidebar visible and collapsible

---

*Document generated automatically from the development change log — April 2026*
