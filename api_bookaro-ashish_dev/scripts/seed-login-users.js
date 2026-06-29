/**
 * Creates / updates default user + admin accounts for local login.
 * Run from api folder: node scripts/seed-login-users.js
 *
 * User app (role user):  bookaroo_user@yopmail.com
 * Test user:              test@gmail.com (full name: Test User)
 * Admin app (role admin): bookaroo_admin@yopmail.com
 * Password (all above):   12456890
 */
"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dbConfig = require("../app/config/db.config.js");

const PASSWORD = "12456890";

const ACCOUNTS = [
  {
    email: "bookaroo_user@yopmail.com",
    role: "user",
    fullName: "Bookaroo User",
  },
  {
    email: "bookaroo_admin@yopmail.com",
    role: "admin",
    fullName: "Bookaroo Admin",
  },
  {
    email: "test@gmail.com",
    role: "user",
    fullName: "Test User",
  },
];

async function main() {
  await mongoose.connect(dbConfig.url);
  const Users = require("../app/models/users.model.js")(mongoose);
  const hash = bcrypt.hashSync(PASSWORD, bcrypt.genSaltSync(10));

  for (const acc of ACCOUNTS) {
    const email = acc.email.toLowerCase();
    await Users.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          password: hash,
          fullName: acc.fullName,
          role: acc.role,
          status: "active",
          isVerified: "Y",
          isDeleted: false,
        },
      },
      { upsert: true, new: true }
    );
    console.log("OK:", email, "(" + acc.role + ")");
  }

  console.log("\nLogin:");
  console.log("  User app:  bookaroo_user@yopmail.com / " + PASSWORD);
  console.log("  Test user: test@gmail.com / " + PASSWORD);
  console.log("  Admin app: bookaroo_admin@yopmail.com / " + PASSWORD);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
