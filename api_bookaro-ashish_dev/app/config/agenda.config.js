const Agenda = require("agenda");
const dotenv = require("dotenv");
const dbConfig = require("./db.config.js");

dotenv.config();

const address =
  (process.env.DB_URL && process.env.DB_URL.trim()) ||
  (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) ||
  dbConfig.url;

const agenda = new Agenda({
  db: { address, collection: "agendaJobs" },
});

module.exports = agenda;