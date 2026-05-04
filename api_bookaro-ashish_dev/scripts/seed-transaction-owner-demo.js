/**
 * Seeds a demo property + two buyer interests for the owner transaction page
 * (GET property/myProperties + GET interests/list).
 *
 * Run from api folder:
 *   node scripts/seed-transaction-owner-demo.js
 *
 * Optional env:
 *   SEED_OWNER_EMAIL   — owner account (default: bookaroo_user@yopmail.com)
 *
 * Login as that owner, open:
 *   http://localhost:8089/real-estate-transaction-owner
 * Select property titled "[SEED] Owner transaction demo — sale".
 *
 * Password for seed buyers (same as seed-login-users): 12456890
 *   sample.lead1@bookaroo.demo
 *   sample.lead2@bookaroo.demo
 */
"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dbConfig = require("../app/config/db.config.js");

const PASSWORD = "12456890";
const SEED_PROPERTY_TITLE = "[SEED] Owner transaction demo — sale";
const DEFAULT_OWNER_EMAIL = "bookaroo_user@yopmail.com";

async function ensureUser(db, { email, fullName, city, country, extra = {} }) {
  const hash = bcrypt.hashSync(PASSWORD, bcrypt.genSaltSync(10));
  return db.users.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        email: email.toLowerCase(),
        password: hash,
        fullName,
        city,
        country,
        role: "user",
        status: "active",
        isVerified: "Y",
        isDeleted: false,
        ...extra,
      },
    },
    { upsert: true, new: true }
  );
}

async function ensureFunnelSnippet(db) {
  await db.funnelUrl.findOneAndUpdate(
    { funnelStatus: "interest sent", status: "active" },
    {
      $setOnInsert: {
        topic: "Seed",
        funnelStatus: "interest sent",
        status: "active",
        type: "seller",
        title: "Next steps after a lead shows interest",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "2 min",
      },
    },
    { upsert: true, new: true }
  );
}

async function main() {
  await mongoose.connect(dbConfig.url);
  const db = require("../app/models/index.js");

  const ownerEmail = (
    process.env.SEED_OWNER_EMAIL || DEFAULT_OWNER_EMAIL
  ).toLowerCase();
  const owner = await db.users.findOne({
    email: ownerEmail,
    isDeleted: false,
  });
  if (!owner) {
    throw new Error(
      `Owner not found: ${ownerEmail}. Run: node scripts/seed-login-users.js`
    );
  }

  const buyer1 = await ensureUser(db, {
    email: "sample.lead1@bookaroo.demo",
    fullName: "Paulette Duplantier",
    city: "Dieppe",
    country: "France",
    extra: {
      isDocumentVerified: true,
      documentGrade: "B",
      image: "",
    },
  });

  const buyer2 = await ensureUser(db, {
    email: "sample.lead2@bookaroo.demo",
    fullName: "Ally Berry",
    city: "Paris",
    country: "France",
    extra: {
      isDocumentVerified: true,
      documentGrade: "B",
      image: "",
    },
  });

  let property = await db.property.findOne({
    propertyTitle: SEED_PROPERTY_TITLE,
    addedBy: owner._id,
    isDeleted: false,
  });

  const propertyBody = {
    propertyTitle: SEED_PROPERTY_TITLE,
    type: "house",
    propertyType: "sale",
    addedBy: owner._id,
    isDeleted: false,
    status: "active",
    address: "12 Rue de Rivoli, Paris",
    city: "Paris",
    country: "France",
    newlocation: { type: "Point", coordinates: [2.3622, 48.8566] },
    maximumLead: "50",
    interestUpdatedTime: new Date(),
    autoInvite: false,
    offMarket: false,
    visitSlots: [],
    signingSlots: [],
    homeInventorySlots: [],
    sellerFiles: {
      identityProof: [
        { fileName: "seed-identity.pdf", originalname: "seed-identity.pdf" },
      ],
    },
  };

  if (!property) {
    property = await db.property.create(propertyBody);
    console.log("Created property:", property._id.toString());
  } else {
    property = await db.property.findByIdAndUpdate(
      property._id,
      {
        $set: {
          ...propertyBody,
          interestUpdatedTime: new Date(),
        },
      },
      { new: true }
    );
    console.log("Updated property:", property._id.toString());
  }

  await db.interests.deleteMany({ propertyId: property._id });

  const interestPayload = {
    propertyId: property._id,
    propertyType: "sale",
    funnelStatus: "interest sent",
    interestType: "interest sent",
    status: "active",
    interestStatus: "pending",
    isDeleted: false,
    offerStatus: false,
    applicationAccepted: false,
    buyerPrice: { amount: 0, conditions: [], fundingType: [] },
  };

  await db.interests.create({
    ...interestPayload,
    buyerId: buyer1._id,
  });
  await db.interests.create({
    ...interestPayload,
    buyerId: buyer2._id,
  });

  await ensureFunnelSnippet(db);

  console.log("\nDone. Log in as owner:", ownerEmail, "/", PASSWORD);
  console.log("Open transaction owner URL and select:");
  console.log(" ", SEED_PROPERTY_TITLE);
  console.log("\nDemo buyer logins (optional):");
  console.log("  sample.lead1@bookaroo.demo /", PASSWORD);
  console.log("  sample.lead2@bookaroo.demo /", PASSWORD);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
