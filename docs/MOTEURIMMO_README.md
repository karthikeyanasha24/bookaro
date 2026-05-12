# MoteurImmo integration

Quick notes to run the sync locally:

- Add your environment variables into a `.env` file (copy from `.env.example`).
- To test the HTTP client and fetch one page of listings run:

```bash
MOTEURIMMO_API_KEY=your_key_here node scripts/moteurimmo_test_fetch.js
```

- The sync is scheduled with Agenda via `cron/moteurimmo.cron.js` and runs every `MOTEURIMMO_POLL_MINUTES` (default 10).
- Media are downloaded to the local `uploads/` directory by default. To switch to S3, set AWS env vars and update the media downloader.
