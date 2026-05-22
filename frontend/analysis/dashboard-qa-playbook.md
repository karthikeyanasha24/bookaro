# Dashboard QA Playbook (UI + API)

## Goal
Validate that dashboard UI is fed by real backend payload and not by frontend mock fallback.

## Preconditions
- Frontend running on `http://localhost:8089`
- Backend running on `http://localhost:3001`
- For local empty DB visibility, backend can run with:
  - `DASHBOARD_DEV_FALLBACKS=true`

## 1) API Contract Check
Run:

```bash
curl -s "http://localhost:3001/dashboard/overview?period=day" | jq '{success, hasSections:(.data.sections!=null), missingRequired: (["todoList","propertyAttractivity","savedSearchResults","pastTransactions","p2pEstimation","p2pReport","trainingCenter","propertySearchPipeline","ownerPipeline","followedPropertyNews"] - ((.data.sections|keys) // []))}'
```

Expected:
- `success: true`
- `hasSections: true`
- `missingRequired: []`

## 2) Browser Strict Mode (no frontend mock fallback)
In browser devtools console, set:

```js
localStorage.setItem("disable401Redirect", "true");
localStorage.setItem("disableDashboardMockFallback", "true");
localStorage.setItem("token", "dev-token");
```

Then open:
- `http://localhost:8089/dashboard`

Notes:
- `disable401Redirect` and `disableDashboardMockFallback` runtime flags are active only in non-production builds.
- Env alternatives (build-time):
  - `REACT_APP_DISABLE_401_REDIRECT=true`
  - `REACT_APP_DASHBOARD_DISABLE_MOCK_FALLBACK=true`

## 3) Visual Assertions
Confirm dashboard renders and includes:
- Header with display-mode toggle and `Réinitialiser ordre`
- Section `Découvrez l'actualité des biens que vous suivez`
- Section `Formez-vous à l'immobilier : les derniers contenus`

If backend dev fallbacks are enabled, expected sample values include:
- Training card author: `AnyHomes Team`
- Training titles:
  - `Comment definir le bon prix de vente`
  - `5 conseils pour organiser vos visites`

## 4) Exit Cleanup
After QA session, clear runtime toggles:

```js
localStorage.removeItem("disable401Redirect");
localStorage.removeItem("disableDashboardMockFallback");
```

Optionally clear test token:

```js
localStorage.removeItem("token");
```
