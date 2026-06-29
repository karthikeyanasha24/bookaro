"use strict";
const dotenv = require("dotenv");

dotenv.config();

const env = process.env;
const host = env.HOST || "127.0.0.1";
const dbPort = env.DB_PORT || "27017";
const dbName = env.DB_NAME || "bookaroo";

/** Full URI (Atlas `mongodb+srv://...` or local). Must match Agenda `db` address. */
let url;
const explicit =
  (env.DB_URL && env.DB_URL.trim()) || (env.MONGODB_URI && env.MONGODB_URI.trim());
if (explicit) {
  url = explicit;
} else if (env.DB_USER && env.DB_PASSWORD) {
  url = `mongodb://${encodeURIComponent(env.DB_USER)}:${encodeURIComponent(
    env.DB_PASSWORD
  )}@${host}:${dbPort}/${dbName}`;
} else {
  url = `mongodb://${host}:${dbPort}/${dbName}`;
}

module.exports = {
  url,
};
