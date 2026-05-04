# YVES / Bookaroo — product & engineering checklist

Checklist derived from the workflow / AI orchestration discussion and mapped to this repository.

---

## A. Product goals (from discussion)

- [ ] **Event-driven AI conversations**: Use **workflow logs** (each funnel / transaction event) to **trigger** the right dialogue between an **AI agent** and the user (**seller** or **potential buyer**), on **both** sides of a deal.
- [ ] **Orchestrator (“girl” / rules engine)**: For **each event type**, define which **conversation** (prompt template, channel, audience) runs. Replace the ad-hoc spreadsheet with a **maintainable config** (DB, JSON, or admin UI) that mirrors the Google Sheet mapping: *event → conversation spec*.
- [ ] **AI agent in the product**: Add an **AI agent interface** (chat surface, notifications entry points) and wire it into the **same journey** as the transaction workflow—not a standalone demo.
- [ ] **Ownership transfer as workflow end state**: Treat **property profile ownership transfer to the new owner** as the **terminal step** of the happy path; orchestration rules should include pre- and post-transfer events.
- [ ] **“LinkedIn of real estate” alignment**: **Property profiles** + **follow** behavior → users get notified on **major property profile events**; orchestrator should reuse or align with those **same events** so follows and active deals stay consistent.

---

## B. Transcript walkthrough (what the “whole file” is saying)

| Time / topic | Meaning |
|--------------|---------|
| Workflow works end-to-end | The **interest / funnel** flow already moves from start toward **completion**, including **transfer** semantics. |
| Logs are generated | Each step persists **audit / timeline** rows (here: `interestTransactions` + related APIs). |
| Missing orchestrator | No central service that subscribes to **events** and dispatches **which AI conversation** to **which role**. |
| Google Sheet / Excel | **Source of truth for design** until implemented; needs to become **code + data**. |
| AI agent interface missing | UI and backend paths for **LLM-backed** chat are not integrated into this workflow yet. |
| Platform metaphor | **Property profile** = profile page; **follow** = subscription to **major events**—good hook for **notification + AI** entry points. |

---

## C. Where to work in *this* codebase

### Backend (`api_bookaro-ashish_dev`)

| Area | Path / symbol | Why it matters |
|------|----------------|----------------|
| **Funnel APIs & status changes** | `app/controllers/InterestsController.js` — `statusChange`, `propertyTransfer`, `renterTransfer`, `notifyOwner`, `informUsers` | **Primary place new `interestTransactions` rows are created** and emails/notifications fire. **Hook point** for an orchestrator (after successful writes). |
| **Transaction log model** | `app/models/interestTransactions.model.js` | Schema for **funnel snapshots** (`funnelStatus`, dates, flags, documents). Either **extend** with `eventType` / `payload` for AI, or **emit** domain events from the controller without bloating the document. |
| **Timeline API for UI** | `InterestsController.interestMessages` + route `GET interests/interestMessages` in `app/routes/interests.routes.js` | Powers **buyer/owner message history** modals today—natural place to **merge human + AI** thread metadata later. |
| **Transfer records** | `propertyTransfer` flow (same controller) + `db.propertyTransfers` | **Ownership transfer** boundary—orchestrator rules for “deal closed / profile handoff” likely anchor here. |
| **Notifications** | `informUsers`, FCM/email paths inside `InterestsController.js` | Pattern for **pushing** users on property changes—AI could **piggyback** or stay parallel. |
| **User chat (non-AI)** | `app/routes/chat.routes.js`, `app/controllers/ChatController.js` | Existing **peer messaging**; decide whether AI is a **separate channel** or **same thread** with a bot user. |

### Frontend (`bookaro_frontend-6_Jan`)

| Area | Path | Why it matters |
|------|------|----------------|
| **Owner transaction UI** | `src/Pages/RealEstateTransactionOwner/` — `index.js`, `LeadCards.js`, `MsgHistory.js`, modals (`ApplicationModal`, slots, etc.) | **Seller-side** funnel UI; **embed AI panel** or **launch conversations** from step transitions. |
| **Searcher / buyer UI** | `src/Pages/RealEstateTransactionSearcher/` — same pattern | **Buyer-side** mirror. |
| **History modal** | `MsgHistory.js` (both Owner and Searcher) — calls `interests/interestMessages` | **First UX** to extend for **AI turns** or **“suggested next actions”** tied to log entries. |
| **Realtime** | `src/components/global/PageLayout/index.js` (socket `notify-message`) | Optional channel to **refresh** UI when orchestrator triggers new AI state. |

### Admin (`bookaroo_admin-Bookaroo_admin`)

- Useful later for **editing event → conversation mapping** without redeploying; no orchestrator code found there today.

---

## D. Suggested build order (engineering)

1. **Inventory events**: List every code path that creates or updates `interestTransactions` / completes `propertyTransfer` (grep `interestTransactions.create` and `statusChange` branches).
2. **Config layer**: Import the spreadsheet into versioned **YAML/JSON** or a **Mongo collection** with: `eventKey`, `roles`, `conversationId` or prompt template, `channels` (in-app, email, push).
3. **Orchestrator service** (module or microservice): Subscribe to **writes** or expose **internal hooks** from `InterestsController` after successful DB ops; idempotent, with logging.
4. **AI API + UI**: Secure backend proxy to the model; frontend component beside or inside `MsgHistory` / lead detail.
5. **Follow / property alerts**: Align **notification events** with orchestrator **event keys** so followers and parties see consistent semantics.

---

## E. Explicit gaps in repo (today)

- No **LLM / agent** integration in application code (only generic `chat` for user messages).
- No **event → conversation** router; logic is **implicit** in controller branches + `interestTransactions` writes.
- **README** at repo root is minimal; this file is the working checklist until you promote content elsewhere.

---

## F. Current delivery status (meeting snapshot)

### ✅ Completed so far

- [x] Platform boot reliability fixes (API/frontend/admin startup blockers addressed)
- [x] Login blockers fixed (`JWT_SECRET` setup + seeded accounts for testing)
- [x] API URL / env setup for frontend and admin (removed `undefined...` request failures)
- [x] Sidebar overlap fix (logged-in pages no longer covered by sidebar)
- [x] Mobile sidebar drawer implemented (open/close behavior)
- [x] Sidebar menu migrated toward Marvel hierarchy with nested sections
- [x] Sidebar submenus now click-to-toggle dropdowns
- [x] Sidebar visual cleanup (professional icons, width/text clipping fixes)
- [x] Logged-in footer switched to compact app footer (full marketing footer kept for non-logged pages)

### 🔄 In progress

- [ ] Pixel-perfect Marvel parity pass for sidebar/app-shell typography, spacing, and interactions
- [ ] Route-by-route mapping for each sidebar sub-item (replace temporary fallback links)
- [ ] Dashboard shell polish for stronger “inside app” feeling after login

### ⛔ Blocked / awaiting client inputs

- [ ] Final event-to-conversation mapping sheet for AI orchestrator (latest agreed version)
- [ ] Final question list (10-15 each) for buyer/renter declarative forms
- [ ] Final UX decision on on-demand services edge flows (release/dispute/payment details)
- [ ] Final Marvel references for remaining screens to style exactly

### 🧭 Next 3 milestones (ETA)

- [ ] Milestone 1: Sidebar/app-shell Marvel parity polish (0.5-1 day)
- [ ] Milestone 2: Logged-in dashboard baseline widgets (1-2 days)
- [ ] Milestone 3: QR code MVP (generate + redirect tracking + stats UI) (1.5-2.5 days)

---

## G. Phase Scope (video source of truth)

All items below are derived from the reviewed walkthrough video and are treated as in-scope for this phase.

### 1) UI/UX upgrades

- [ ] Landing page UI upgrade (layout, spacing, typography, hierarchy, responsive behavior)
- [ ] Post-login UI consistency pass across onboarding, dashboard, property, transaction, and services screens (UI only)
- [ ] Lead cards enhancement in transaction tools (add: number of visits, number of offers, property search time)

### 2) Document-based declaration enhancements

- [ ] Expand declaration section by ~10-15 additional questions (same existing interaction pattern)
- [ ] Ensure new questions are persisted correctly in current/extended data model
- [ ] Ensure questions are visible and editable in relevant flows

### 3) QR code functionality

- [ ] Generate unique QR code per property
- [ ] Allow download/reuse of generated QR code
- [ ] Implement redirect URL flow: QR scan -> platform -> corresponding property details page
- [ ] Add frontend controls to generate and download/share QR code
- [ ] Add backend tracking URL + redirect handler for each property

### 4) AI agent logging and integration validation

- [ ] Create DB tables/collections for AI communications (messages, responses, timestamps, context IDs)
- [ ] Log all system-triggered AI-to-user communications with event linkage
- [ ] Validate existing ChatGPT API integration (connectivity, response handling, error handling)
- [ ] Align ChatGPT integration with new AI logging model and ensure retrievability

### 5) On-demand services

- [ ] On-demand services listing and purchase flow validation/alignment (as shown in video)

### 6) Deliverables for this phase

- [ ] Updated landing page UI
- [ ] Updated logged-in UI aligned with provided designs
- [ ] Expanded declaration questionnaire
- [ ] QR code generation + redirect implementation
- [ ] AI agent communication log tables
- [ ] Verified ChatGPT API compatibility with logging
- [ ] Updated source code with all approved changes

### 7) Explicit exclusions for this phase

- [ ] No mobile app development
- [ ] No multilingual support
- [ ] No advanced analytics dashboards
- [ ] No AI model training/fine-tuning
- [ ] No new payment logic/financial workflow redesign
