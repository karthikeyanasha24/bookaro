const db = require('../app/models');
const bcrypt = require('bcrypt');

async function main() {
  try {
    await db.mongoose.connect(db.url, {});
    const Users = db.users;
    const email = 'dev_auto_user@example.com';
    let existing = await Users.findOne({ email: email, isDeleted: false });
    if (existing) {
      console.log('exists', existing._id.toString());
      process.exit(0);
    }
    const now = new Date();
    const passwordPlain = 'Password123';
    const passwordHash = await bcrypt.hashSync(passwordPlain, bcrypt.genSaltSync(10));
    const data = {
      email: email,
      firstName: 'Dev',
      lastName: 'Auto',
      fullName: 'Dev Auto',
      password: passwordHash,
      status: 'active',
      role: 'user',
      isVerified: 'Y',
      createdAt: now,
      updatedAt: now,
      addedType: 'admin'
    };
    const newUser = await Users.create(data);
    console.log('created', newUser._id.toString());
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
