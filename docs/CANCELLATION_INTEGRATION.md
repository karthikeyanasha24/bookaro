Cancellation flow — Integration notes

Goal

Provide a stubbed local backend for frontend development of the cancellation/accept/reject flow and outline the steps to integrate with the real backend API and Stripe later.

Local stub behavior (implemented in `server.js`)

- POST /marketplace/orders/:id/cancellation-request
  - Body: { reason }
  - Stores an in-memory cancellation request for `orderId` and sets order status to `cancellation_requested`.
  - Emits socket event `cancellation_requested` with payload { orderId, request }.
  - Response: { success: true, request }

- POST /pro/marketplace/orders/:id/cancellation/accept
  - Accepts a pending cancellation request for `orderId`.
  - Sets request.status = 'accepted' and order status to `cancelled`.
  - Emits `cancellation_accepted` event.
  - Response: { success: true }
  - NOTE: In production this endpoint must trigger the Stripe refund flow and persist the status change.

- POST /pro/marketplace/orders/:id/cancellation/reject
  - Marks request.status = 'rejected'. Restores previous order status.
  - Emits `cancellation_rejected` event.
  - Response: { success: true }

- POST /marketplace/orders/:id/litigation
  - Body: { reason }
  - Emits `litigation_opened` event and returns success. Used for "Problème ?" flows.

- POST /marketplace/orders/:id/confirm
  - Marks order as `confirmed_by_buyer` and emits `order_confirmed`.
  - Response: { success: true }

Frontend changes

- `src/methods/api/marketplaceApi.js` now contains wrappers:
  - `requestCancellation(orderId, payload)`
  - `acceptCancellation(orderId)`
  - `rejectCancellation(orderId)`

  By default, the API base URL is set to `http://localhost:8089` for local development so the frontend will hit the local stubs in `server.js`.

Production integration checklist

1. Implement corresponding endpoints in the real backend (port 6090 or API host):
   - POST /marketplace/orders/:id/cancellation-request
   - POST /pro/marketplace/orders/:id/cancellation/accept
   - POST /pro/marketplace/orders/:id/cancellation/reject
   - POST /marketplace/orders/:id/litigation
   - POST /marketplace/orders/:id/confirm

2. Persist data:
   - Save cancellation requests and their metadata (reason, createdAt, by, previousStatus, status).
   - Persist order status changes (cancellation requested/accepted/rejected/cancelled).

3. Stripe refund (on accept):
   - When a pro accepts a cancellation, call Stripe to perform a full refund for the related `payment_intent` or `charge`.
   - Record refund id and update order/payment records accordingly.
   - Handle failure cases: partial refund, delayed refund, retry logic.

4. Notifications & realtime:
   - Emit websocket events matching the ones used by the frontend for real-time UI updates:
     - `cancellation_requested`, `cancellation_accepted`, `cancellation_rejected`, `litigation_opened`, `order_confirmed`.
   - Create persistent notifications in DB for both client and pro.

5. Security & Authorization:
   - Ensure endpoints require authentication and proper authorization (buyer can request cancellation for their order; pro can accept/reject for orders they sold; admin can override).

6. Tests & monitoring:
   - Add unit/integration tests around cancellation logic and billing.
   - Monitor for refund failures and ensure alerts for operations team.

How to switch frontend to real backend

- Set `REACT_APP_MARKETPLACE_API_URL` in your frontend environment to the real API host (e.g., `https://api.example.com`) so `src/methods/api/marketplaceApi.js` points to the proper server.
- Remove or update the local stubs if they conflict with forwarded routing.

Notes

- The local stubs are meant for development only. They do not persist beyond server restart.
- The mock emits socket events to help testing real-time UI behavior; replace with the real socket implementation when integrating.

Contact

If you want, I can implement the production endpoints in the backend repo — give me access to that repo or its path and any API/DB/Stripe credentials (or test keys) required.
