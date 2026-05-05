# Meeting notes: AI agent triggers (Bookaroo) — status & demo script

Use this doc in a stakeholder meeting to explain **what shipped**, **where it lives in the app**, and **how to test it**. Replace `http://localhost:XXXX` with your real frontend URL and API base (`REACT_APP_API_URL`).

---

## Explain to him in plain language (what is actually new)

**One sentence:**  
“We didn’t rebuild login or listings. We added **automatic coaching messages** that appear as **notifications** when the user does something meaningful the first time (or on a schedule)—and we **store what we already sent** so we don’t repeat ourselves.”

**Three bullets if he asks “so what did you build?”**

1. **New backend service + two small database tables** — rules, message text, “already fired” flags, and simple engagement counters (e.g. how many listings you opened).
2. **Hooks on existing flows** — after OTP success, after first search save, after interest, after property detail loads, etc., the API **drops an extra notification** (`ai_agent_trigger`).
3. **Two scheduled jobs** — weekly digest-style notifications and a scan for owners with no interest for a while.

**What we did *not* build:** a separate “AI chat” screen or a guest-only homepage banner. Proof is under **Notifications**, not a new menu item.

---

## Path to show him — do this in order (best proof)

Use a **brand-new test account** (or incognito), because many messages fire **only once**.

| Step | Where to click (frontend) | What he should see |
|------|---------------------------|-------------------|
| 1 | **Sign up** → **`/otpverify`** complete OTP (login-type flow after register) | **`/notifications`** — welcome-style message (“Welcome to Bookaroo” / platform intro) |
| 2 | Whatever flow hits **first quick search** (authenticated `quicksearch/add`) | Notifications — **save your search** hint |
| 3 | **`/past-transactions`** → run search → **`/past-transation-list`** (while **logged in** so API sends token) | Notifications — **past transactions / peer estimation** hint (once) |
| 4 | Open **5 different** **`/property-details?id=…`** pages (same user, not your own listing) | Notifications — **past prices in the area** hint after enough distinct views |
| 5 | **Show interest** on a **for-sale** property, then on a **for-rent** property (if you have both) | Notifications — **buyer file** vs **renter file** messaging |
| 6 | (Optional, harder) Owner with **auto-invite** + free visit slots → interest triggers invite | Notifications — **visit preparation** message (better if `OPENAI_API_KEY` is set) |
| 7 | (Optional, time-based) Leave API running until Agenda fires | Weekly / no-interest nudges |

If **step 1 shows nothing**, the account probably **already** received that welcome — switch to a **new email** or check Mongo `aiAgentFired` / `notifications` for that user.

---

## Guide: how you explain it and run the demo (~15 minutes)

### Before the meeting (2 minutes)

1. Start **API** (`api_bookaro-ashish_dev`) and **frontend** (`bookaro_frontend-6_Jan`).
2. Prepare a **brand-new email** (e.g. `demo+feb17@yourdomain.com`) — many triggers are **one-time per user**.
3. Have ready: **two listing links** — one **for sale**, one **for rent** — that are **not** owned by the demo user (use real IDs in `/property-details?id=...`).
4. Open **`http://localhost:8089/notifications`** in a second tab so you can refresh quickly after each step.

### Opening — what to say (30 seconds)

> “Bookaroo already had signup, search, listings, and notifications. What we added is an **assistant layer on the server**: when the user hits certain moments, we **create an extra notification** with short guidance. We **remember** what we already sent so we don’t spam. There’s **no new ‘AI’ menu** — you’ll see it here in **Notifications**.”

Then click **Notifications** once (empty or old list is fine) so he knows where proof will appear.

### Demo flow — say this while you do this

| # | You say (rough script) | You do (browser) |
|---|------------------------|------------------|
| 1 | “First I’ll create a **new** user so **first-time** triggers can fire.” | **`http://localhost:8089/signup`** → register → **`http://localhost:8089/otpverify`** → complete OTP. |
| 1b | “Now we check **Notifications** — that’s where the **AI-style triggers** land (`ai_agent_trigger`).” | **`http://localhost:8089/notifications`** → refresh → point at **Welcome to Bookaroo** (or similar). |
| 2 | “When someone runs a **first quick search** while logged in, we nudge them to **save the search**.” | Do whatever your app does that calls **`quicksearch/add`** once (often from home/search). → **Notifications** again. |
| 3 | “When they use **past transactions** while logged in, we hint at **peer / P2P** style insight.” | **`http://localhost:8089/past-transactions`** → search → **`http://localhost:8089/past-transation-list`**. → **Notifications**. |
| 4 | “After they’ve opened **several different** property pages **as this user**, we suggest **past transaction prices** for areas they browse.” | Open **5 different** **`http://localhost:8089/property-details?id=...`** (not their own listing). → **Notifications**. |
| 5 | “When they show **interest**, we push **buyer file** or **renter file** depending on listing type.” | Open sale listing → show interest → **Notifications**. Repeat on a **rent** listing → **Notifications**. |
| 6 | *(Optional)* “If **auto-invite** fires, they also get **visit prep** text; with **OpenAI** key on the server it’s richer.” | Only if you have a property configured for auto-invite + slots. |

### If something doesn’t show — what to tell him (honest)

- **“Nothing new in Notifications”** → This account may have **already** consumed one-time triggers; use a **new email** or a second incognito window with a new user.
- **Past-transactions hint missing** → List call must run **logged in** (frontend sends **Bearer** token). If you test in Postman, add **`Authorization: Bearer <token>`**.
- **Five-property hint missing** → Property detail API needs **`userId`** on the request (your app usually sends it when logged in). Open **different** property IDs, and not **your own** listing.
- **Weekly / no-interest messages** → Need **time** (Agenda `1 week` / `1 day`) or explain they’re **background jobs**, not part of the live click demo.

### Closing — what to say (20 seconds)

> “So the **product surface** is unchanged; the **behavior** is new: **contextual coaching in Notifications**, backed by **Mongo** for dedup and **Agenda** for recurring nudges. Next step, if you want, is a **dedicated assistant panel** or **guest banner** — that would be UI work on top of this.”

---

## Reality check: what was already there vs what is actually new

**You are right that most of the *plumbing* was already in the product.** We did not replace signup, interests, property detail, or notifications. We **reused** them on purpose.

| Already in Bookaroo (unchanged product surface) | What we added (incremental) |
|---------------------------------------------------|------------------------------|
| Notifications model + listing UI | New rows with `type: "ai_agent_trigger"` and copy from `aiAgentTriggers.service.js` |
| Agenda + Mongo `agendaJobs` | Two new job names + schedule in `server.js` |
| `verifyOtp`, Google signup, `addInterest`, `property/detail`, `transaction/list`, etc. | Thin `setImmediate(...)` hooks calling one service |
| Emails for visit invite | Optional **extra** in-app notification + optional OpenAI text for visit prep |

**Why it can look like “no work” in the app**

- There is **no new screen** labelled “AI agent”; messages land in the **same notifications** list as before.
- Many triggers fire **once per user** (or once per property). Retesting with the same account shows **nothing new** after the first time.
- Some rules are **easy to miss**: e.g. property view triggers need `userId` on `GET /property/detail`; past-transaction hint needs **Authorization** on `GET /transaction/list`; weekly jobs need the **API server running long enough** for the interval.

**Net-new artefacts (concrete)**

- New files: `app/services/aiAgentTriggers.service.js`, `app/models/aiAgentFired.model.js`, `app/models/userAiEngagement.model.js`; `quickSearch` schema gained optional `userId`.
- Wired controllers: `UsersController`, `PropertyController`, `InterestsController`, `TransactionController`, `QuickSearchController`, `SaveSearchController`; `agenda.jobs.js` + `server.js`.

If stakeholders expected a **visible AI panel or chat**, that was **not** in scope of this slice—only **server-side triggers → notifications** (plus optional OpenAI for one message type).

---

## One-minute pitch (what to say)

“We added a **first wave of proactive assistant triggers** on the **API**: when users hit key moments—signup, first search, viewing listings, showing interest, listing a property—we create **in-app notifications** (`type: ai_agent_trigger`) so the product can guide them (save search, seller file, buyer/renter file, past transactions, visit prep, etc.). Weekly summaries and a ‘no interest in 14 days’ nudge run on **Agenda** jobs. Optional **OpenAI** improves the ‘visit preparation’ message if `OPENAI_API_KEY` is set. The **guest welcome** (unlogged homepage banner) was **not** built in the UI yet—only backend hooks for logged-in flows.”

---

## Where users see results

| What | In the app (typical routes) | What changed (backend) |
|------|-----------------------------|-------------------------|
| Welcome after account / OTP | `/otpverify` → home after success | `UsersController` fires welcome once |
| Google first login | Google OAuth flow | New Google user gets same welcome once |
| “Save your search” | Home search / quick search flows | `QuickSearchController` + `SaveSearchController` |
| First **for sale** listing | `/property/add` (wizard) | `PropertyController.add` — first sale listing |
| Past transactions → peer / P2P hint | `/past-transactions` → `/past-transation-list` | `TransactionController` if request sends **Bearer** token |
| 5 property profiles / heavy browsing | `/property-details?id=…` (with `userId` in query as today) | `PropertyController.details` |
| Interest → buyer/renter file | Property funnel / interest button | `InterestsController.addInterest` |
| Owner: first lead tips | Owner dashboard / same flow | Same controller |
| Visit invite → prep tips | Email + notification when auto-invite | Same + optional OpenAI |
| Weekly digests | `/notifications` | Agenda `weekly-ai-agent-digests` |
| Owner: no leads 14+ days | `/notifications` | Agenda `ai-agent-owner-no-interest-scan` |

---

## Technical map (files — for “where did we change code?”)

| Area | Main files |
|------|------------|
| Trigger rules & copy | `api_bookaro-ashish_dev/app/services/aiAgentTriggers.service.js` |
| Dedup + engagement metrics | `api_bookaro-ashish_dev/app/models/aiAgentFired.model.js`, `userAiEngagement.model.js` |
| Registration welcome | `api_bookaro-ashish_dev/app/controllers/UsersController.js` |
| Property views & first listing | `api_bookaro-ashish_dev/app/controllers/PropertyController.js` |
| Interests, visit prep | `api_bookaro-ashish_dev/app/controllers/InterestsController.js` |
| Past transactions hint | `api_bookaro-ashish_dev/app/controllers/TransactionController.js` |
| First quick search / save search | `api_bookaro-ashish_dev/app/controllers/QuickSearchController.js`, `SaveSearchController.js` |
| Scheduled jobs | `api_bookaro-ashish_dev/app/jobs/agenda.jobs.js`, `server.js` (schedules `every("1 week")` / `every("1 day")`) |
| Models registered | `api_bookaro-ashish_dev/app/models/index.js` |
| Quick search `userId` | `api_bookaro-ashish_dev/app/models/quickSearch.model.js` |

Notifications use the existing **`notifications`** collection with **`type: "ai_agent_trigger"`** so the **Notifications** page can list them like other alerts (confirm the UI filters don’t hide this type).

---

## API touchpoints (for QA or Postman)

Base URL: your API root (e.g. `http://localhost:6089` if using default server port).

| Trigger | Approximate API | Notes |
|---------|-----------------|--------|
| Welcome | `POST /user/verifyOtp` (body `type: "login"` after register) | Once per user |
| Quick search hint | `POST /quicksearch/add` | Logged-in (`Authorization`) |
| Save search hint | `POST /savesearch/add` | First zip-based save for user |
| First sale listing | `POST /property/add` | `propertyType: "sale"`, first time for user |
| Past tx / P2P hint | `GET /transaction/list?...` | Must send **Bearer** token |
| Profile views / 5 & 30 rules | `GET /property/detail?id=…&userId=…` | `userId` must be viewer; not owner |
| Interest + files + owner tips | `POST /interests/...` (existing add-interest route) | Check `InterestsController` routes file |

Exact paths under `/interests` follow your `interests.routes.js` (use that file on the branch you test).

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Optional — richer “prepare for your visit” text |
| `OPENAI_MODEL` | Optional — defaults to `gpt-4o-mini` in code |

---

## Test checklist (manual)

Use a **test user** and clear path where possible (new email / new account).

### Account & onboarding
- [ ] **New registration + OTP (`type: login`)** → one **Welcome to Bookaroo** notification (only once if you repeat OTP flow with same account).
- [ ] **New Google user** (first time that Google account) → same style welcome once.

### Search & save
- [ ] **First authenticated `POST /quicksearch/add`** → notification about **saving the search**.
- [ ] **First `POST /savesearch/add`** with zip flow (creates new rows) → **save search / alerts** notification.

### Listings (seller)
- [ ] **First `propertyType: "sale"` property** created by user → **seller file / documents** notification (once per user for that trigger design).

### Browsing & engagement
- [ ] Open **`/property-details`** with logged-in user so the client passes **`userId`** on `GET /property/detail` → after **5 distinct** non-own properties, **past transactions in area** hint (once).
- [ ] Continue browsing **without** showing interest until **30+** non-own views **and** **~60 days** since last interest (or never interested) → **agency / exclusive** style notification (once). *Easiest to validate with a fresh test user and DB tweak of dates/counts if needed.*

### Past transactions
- [ ] Logged-in user opens past transaction list so **`transaction/list`** runs **with Authorization** → **peer / P2P** hint notification (once).

### Interest funnel
- [ ] **Rent** property → show interest → **renter file / credibility** notification (per trigger rules).
- [ ] **Sale** property → show interest → **buyer file** notification.
- [ ] **First interest ever on a property** (owner side) → **lead management** tip to owner.
- [ ] Property with **auto-invite** and visit emails → buyer gets **visit prep** notification (static or OpenAI).

### Jobs (needs API server + Mongo + Agenda running)
- [ ] After **1 week** from job schedule (or run job manually in dev), **weekly lead** digest for users with interests → notification.
- [ ] After **1 day** schedule, **owner no interest** scan → listing with no interests **14+ days** → owner notification (batch limit applies in code).

### UI
- [ ] **`/notifications`** shows new rows; confirm **title/message** readable and **type** acceptable to frontend.

---

## Not in this delivery (say explicitly if asked)

- **Unlogged homepage welcome banner** — not implemented in React; needs UI + `localStorage` (or similar).
- **“Listed on AnyHomes”** as a separate integration — not wired; **first sale listing on Bookaroo** is what we hooked.
- **Weekly numbers** are **simplified** (not full funnel analytics); can be refined with product.

---

## Quick demo order (5 minutes)

1. Show **Notifications** empty, then **register + OTP** → refresh **notifications** → welcome.
2. **Quick search** once → save-search hint.
3. Open **5 property details** (as logged-in, with `userId` on detail API) → past-tx hint.
4. **Show interest** on rent and sale (two properties) → renter/buyer copy.
5. (Optional) Set **`OPENAI_API_KEY`** and trigger visit invite → compare static vs AI visit text.

---

## Appendix: full example URLs (copy-paste)

Defaults from this repo: **frontend** `npm start` uses **`PORT=8089`** (`bookaro_frontend-6_Jan/package.json`). **API** default **`PORT=6089`** (`api_bookaro-ashish_dev/server.js`).  
Replace `localhost`, ports, and `YOUR_PROPERTY_ID` if your `.env` differs.

### Frontend (browser) — whole URLs

| Page | Full URL |
|------|----------|
| Home | `http://localhost:8089/` |
| Sign up | `http://localhost:8089/signup` |
| OTP verify | `http://localhost:8089/otpverify` |
| Login | `http://localhost:8089/login` |
| Notifications | `http://localhost:8089/notifications` |
| Past transactions (search form) | `http://localhost:8089/past-transactions` |
| Past transaction results list | `http://localhost:8089/past-transation-list` |
| Property browse / search | `http://localhost:8089/properties` |
| Property detail | `http://localhost:8089/property-details?id=YOUR_PROPERTY_ID` |
| Add property (wizard) | `http://localhost:8089/property/add` |
| Buyer file | `http://localhost:8089/buyer-file` |
| Renter file | `http://localhost:8089/renter-file` |
| Seller file | `http://localhost:8089/seller-file` |
| Search alerts | `http://localhost:8089/serach-alert` |

Google signup has **no fixed path** in-app beyond whatever your login screen uses to start OAuth (usually from **`http://localhost:8089/login`** or signup).

### Backend (API) — whole URLs (for Postman; most are **POST** or **GET**)

Base: **`http://localhost:6089`**

| Purpose | Full URL | Method |
|---------|----------|--------|
| Welcome after OTP | `http://localhost:6089/user/verifyOtp` | POST |
| First quick search trigger | `http://localhost:6089/quicksearch/add` | POST |
| First save-search trigger | `http://localhost:6089/savesearch/add` | POST |
| Create listing (first sale) | `http://localhost:6089/property/add` | POST |
| Property detail (view counts) | `http://localhost:6089/property/detail?id=YOUR_PROPERTY_ID&userId=YOUR_USER_ID` | GET |
| Past transactions list | `http://localhost:6089/transaction/list` | GET (+ query params as today) |
| Add interest | `http://localhost:6089/interests/add` | POST |

**Note:** `GET http://localhost:6089/transaction/list` must include header **`Authorization: Bearer <token>`** for the past-transaction / P2P hint trigger.

---

*Document generated for internal review; adjust URLs and ports to match your environment.*
