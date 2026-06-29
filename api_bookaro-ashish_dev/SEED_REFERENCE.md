# Bookaroo seed data — reference

This file records what `node seed.js` does and how to verify it. **Object IDs change every time you re-run the seeder** unless you clear the DB first; copy new IDs from the terminal after each run if you need them for APIs or Compass filters.

---

## How to run the seeder

From this folder (`api_bookaro-ashish_dev`):

```bash
node seed.js
```

Connection string comes from `DB_URL` in `.env`, or defaults to:

`mongodb://127.0.0.1:27017/bookaroo`

---

## What gets seeded (summary)

| Area | Count (typical) |
|------|------------------|
| Users | 7 |
| Properties | 5 |
| Interests (leads) | 4 |
| Chat messages | 6 |
| AI conversation entries | 5 |
| Notifications | 6 |
| Blog posts | 5 |
| Past transactions | 8 |
| Timeline entries | 6 |
| AI fired (dedup) records | 4 |

---

## Test accounts (password for all: `password123`)

| Role | Email |
|------|--------|
| Seller 1 | jean.dupont@example.com |
| Seller 2 | marie.martin@example.com |
| Buyer 1 | ally.berry@example.com |
| Buyer 2 | paulette.duplantier@example.com |
| Admin | admin@bookaroo.com |
| AI Bot (do not log in) | ai-agent@bookaroo.com |

---

## Example IDs from one successful run

*(Replace these after you re-seed — they are only valid for that database state.)*

| Label | ObjectId |
|-------|----------|
| Seller 1 | `69e50c768fbfed83bd0ee0c7` |
| Property 1 | `69e50c768fbfed83bd0ee0d4` |
| AI Bot | `69e50c768fbfed83bd0ee0c6` |

---

## How to check the data

### 1. Frontend (app)

1. Start API: `npm start` in `api_bookaro-ashish_dev`.
2. Start frontend (e.g. port 8089): `npm start` in `bookaro_frontend-6_Jan`.
3. Log in with **Seller 1** or **Seller 2** above.
4. Try these routes (adjust host/port if yours differ):

   - **Owner transaction / leads:**  
     `http://localhost:8089/real-estate-transaction-owner`  
     Pick a property on the left; leads should appear if interests exist for that property.
   - **My properties:**  
     `http://localhost:8089/my-properties`
   - **Chat:**  
     `http://localhost:8089/chat`
   - **Notifications:**  
     `http://localhost:8089/notifications`
   - **Blogs:**  
     `http://localhost:8089/blogs`
   - **Past transactions:**  
     `http://localhost:8089/past-transactions`

5. Log in as **Buyer 1** or **Buyer 2** to see searcher-side flows (saved interests, etc., depending on seed).

### 2. MongoDB Compass

1. Connect with the same URI as in `.env` / seed output (e.g. `mongodb://127.0.0.1:27017`).
2. Database: **`bookaroo`** (or your `DB_NAME`).
3. Browse collections: **`users`**, **`properties`**, **`interests`**, **`messages`**, **`notifications`**, **`blogs`**, **`pasttransactions`** (exact names may vary — match your Compass list).

### 3. `mongosh` quick counts

```javascript
use bookaroo
db.users.countDocuments({ isDeleted: { $ne: true } })
db.properties.countDocuments({ isDeleted: { $ne: true } })
db.interests.countDocuments({ isDeleted: { $ne: true } })
db.blogs.countDocuments()
```

### 4. Re-seeding

Running `node seed.js` again **upserts** many documents; IDs printed at the end reflect the current run. If you need a clean slate, drop the database or collections first (only on local/dev), then run `node seed.js` again and **update the IDs section above** from the new terminal output.

---

## Related scripts

| Script | Command |
|--------|---------|
| Login-only users (different passwords) | `npm run seed:users` |
| Transaction-owner demo (separate from `seed.js`) | `npm run seed:transaction-demo` |

See comments at the top of `seed.js` for full behavior.
