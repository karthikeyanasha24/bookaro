# Dashboard Production Gate Checklist

Date: 2026-04-15
Owner: Product + Front + Back + QA

## Release Decision
- [ ] GO
- [ ] NO-GO

## P0 Blockers (must all pass)

### 1) Auth and Security
- [ ] No QA runtime toggles enabled in production browsers.
- [ ] No QA env toggles enabled in production build/runtime:
  - `REACT_APP_DISABLE_401_REDIRECT`
  - `REACT_APP_DASHBOARD_DISABLE_MOCK_FALLBACK`
  - `DASHBOARD_DEV_FALLBACKS`
- [ ] Auth flow validated with real token lifecycle (login, refresh/expiry, logout).
- [ ] On invalid token, user is redirected correctly and safely.

### 2) API Contract Stability
- [ ] `GET /dashboard/overview?period=day|week|month|year` returns `success: true`.
- [ ] `data.sections` exists and includes all required keys:
  - `todoList`
  - `propertyAttractivity`
  - `savedSearchResults`
  - `pastTransactions`
  - `p2pEstimation`
  - `p2pReport`
  - `trainingCenter`
  - `propertySearchPipeline`
  - `ownerPipeline`
  - `followedPropertyNews`
- [ ] Backend error rate for dashboard endpoints < agreed SLO threshold.

### 3) Real Data Readiness
- [ ] Training section has real DB-backed data (not synthetic fallback).
- [ ] P2P report section has real DB-backed data (or approved empty-state).
- [ ] Followed news behavior validated with real timeline/property records.
- [ ] Empty-state copy validated for all sections when no data.

### 4) UI Functional Smoke (all 3 modes)
- [ ] Buyer mode renders correctly.
- [ ] Seller mode renders correctly.
- [ ] Owner mode renders correctly.
- [ ] Section reorder works up/down and persists per profile.
- [ ] `Réinitialiser ordre` restores default order for active profile only.
- [ ] Followed news card click opens timeline in a new tab.
- [ ] Collapse/expand behavior is correct (`Réduire` state included).

## P1 Quality Gates (strongly recommended)
- [ ] Lighthouse/Perf quick pass on dashboard route.
- [ ] No critical console errors during dashboard load.
- [ ] i18n strings validated FR/EN for new dashboard content.
- [ ] Monitoring dashboards and alerts configured for dashboard endpoints.

## Rollback Readiness
- [ ] Feature flag or rollback path documented.
- [ ] Last known good frontend build reference recorded.
- [ ] Last known good backend deployment reference recorded.
- [ ] On-call owner assigned for first release window.

## Sign-off
- Product: __________________
- Frontend Lead: __________________
- Backend Lead: __________________
- QA Lead: __________________
- Date/Time: __________________
