#!/usr/bin/env node
require('dotenv').config();
const db = require('../app/models');
const bcrypt = require('bcrypt');

(async () => {
  try {
    db.mongoose.set('strictQuery', false);
    await db.mongoose.connect(db.url, {});

    const Users = db.users;
    const email = 'system_anyhomes_importer@anyhomes.local';

    let existing = await Users.findOne({ email });
    if (existing) {
      console.log('system user already exists:', existing._id.toString());
      process.exit(0);
    }

    const plainPassword = Math.random().toString(36).slice(-12);
    const hashed = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10));

    const user = await Users.create({
      fullName: 'system_anyhomes_importer',
      username: 'system_anyhomes_importer',
      email: email,
      password: hashed,
      role: 'admin',
      status: 'active',
      isVerified: 'Y',
      isImported: true,
      addedType: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Created system user id:', user._id.toString());
    console.log('Email:', email);
    console.log('Plain password (store securely):', plainPassword);
    process.exit(0);
  } catch (err) {
    console.error('Error creating system user:', err);
    process.exit(1);
  }
})();
