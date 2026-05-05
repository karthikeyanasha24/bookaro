/**
 * Bookaroo — Comprehensive Sample Data Seeder
 * Run: node seed.js
 *
 * Seeds: users, properties (sale/rent/directory), interests/leads,
 *        blogs, past transactions, notifications, AI conversations,
 *        timeline entries, rooms/messages (chat).
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const DB_URL =
  process.env.DB_URL ||
  `mongodb://${process.env.HOST || "127.0.0.1"}:${process.env.DB_PORT || 27017}/${
    process.env.DB_NAME || "bookaroo"
  }`;

// ─── helpers ────────────────────────────────────────────────────────────────
const id = () => new mongoose.Types.ObjectId();
const now = () => new Date();
const daysAgo = (n) => new Date(Date.now() - n * 86400000);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── connect ─────────────────────────────────────────────────────────────────
async function connect() {
  await mongoose.connect(DB_URL, {});
  console.log("✅  Connected to MongoDB:", DB_URL);
}

// ─── models (minimal inline schemas so we don't need to import all app code) ─
function loadModels() {
  // Users
  const UserSchema = new mongoose.Schema(
    {
      firstName: String, lastName: String, fullName: String,
      email: { type: String, required: true, unique: true },
      password: String,
      role: { type: String, default: "user" },
      accountType: { type: String, default: "individual" },
      status: { type: String, default: "active" },
      isVerified: { type: String, default: "Y" },
      city: String, country: String, image: String,
      isDeleted: { type: Boolean, default: false },
      isAiBot: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  const User = mongoose.models.users || mongoose.model("users", UserSchema);

  // Properties
  const PropSchema = new mongoose.Schema(
    {
      propertyTitle: { type: String, required: true },
      propertyType: { type: String, enum: ["sale", "rent", "directory"], required: true },
      type: { type: String, enum: ["apartment", "castle", "farm", "building", "house"] },
      price: Number, rentPrice: Number,
      address: String, city: String, zipcode: String, country: String, state: String,
      addedBy: { type: mongoose.Types.ObjectId, ref: "users" },
      status: { type: String, default: "active" },
      isDeleted: { type: Boolean, default: false },
      newlocation: { type: { type: String, default: "Point" }, coordinates: [Number] },
      images: Array,
      content: String,
      numberOfRooms: Number, numberOfBedrooms: Number, numberOfBathrooms: Number,
      surfaceArea: Number, landSurface: Number,
      offMarket: { type: Boolean, default: false },
      propertyViewerCount: { type: Number, default: 0 },
      shareCount: { type: Number, default: 0 },
      visitBookedCount: { type: Number, default: 0 },
      autoInvite: { type: Boolean, default: false },
      visitSlots: { type: Array, default: [] },
      sellerFiles: { type: Object },
      offerStatus: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  PropSchema.index({ newlocation: "2dsphere" });
  const Property = mongoose.models.properties || mongoose.model("properties", PropSchema);

  // Interests
  const InterestSchema = new mongoose.Schema(
    {
      propertyId: { type: mongoose.Types.ObjectId, ref: "properties" },
      buyerId: { type: mongoose.Types.ObjectId, ref: "users" },
      propertyType: String,
      funnelStatus: String,
      interestType: { type: String, default: "interest sent" },
      buyerPrice: Object,
      ownerPrice: Number,
    },
    { timestamps: true }
  );
  const Interest = mongoose.models.interests || mongoose.model("interests", InterestSchema);

  // Notifications
  const NotifSchema = new mongoose.Schema(
    {
      sendTo: { type: mongoose.Types.ObjectId, ref: "users" },
      sendBy: { type: mongoose.Types.ObjectId, ref: "users" },
      status: { type: String, default: "unread" },
      type: String,
      message: String, title: String,
      property_id: { type: mongoose.Types.ObjectId, ref: "properties" },
    },
    { timestamps: true }
  );
  const Notification = mongoose.models.notifications || mongoose.model("notifications", NotifSchema);

  // Blogs
  const BlogSchema = new mongoose.Schema(
    {
      title: String, banner: String, description: String,
      duration: String, status: { type: String, default: "active" },
      addedBy: { type: mongoose.Types.ObjectId, ref: "users" },
      isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  const Blog = mongoose.models.blogs || mongoose.model("blogs", BlogSchema);

  // Rooms
  const RoomSchema = new mongoose.Schema(
    { subject: String, isGroupChat: { type: Boolean, default: false } },
    { timestamps: true }
  );
  const Room = mongoose.models.Rooms || mongoose.model("Rooms", RoomSchema);

  // RoomMembers
  const RoomMemberSchema = new mongoose.Schema(
    {
      room_id: { type: mongoose.Types.ObjectId, ref: "Rooms" },
      user_id: { type: mongoose.Types.ObjectId, ref: "users" },
      property_id: { type: mongoose.Types.ObjectId, ref: "properties" },
      isGroupChat: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  const RoomMember = mongoose.models.RoomMembers || mongoose.model("RoomMembers", RoomMemberSchema);

  // Messages
  const MsgSchema = new mongoose.Schema(
    {
      type: { type: String, enum: ["TEXT", "VIDEO", "IMAGE", "DOCUMENT"], default: "TEXT" },
      room_id: { type: mongoose.Types.ObjectId, ref: "Rooms" },
      sender: { type: mongoose.Types.ObjectId, ref: "users" },
      content: String,
      property_id: { type: mongoose.Types.ObjectId, ref: "properties" },
      message_type: String,
      status: { type: String, default: "unread" },
      isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  const Message = mongoose.models.Messages || mongoose.model("Messages", MsgSchema);

  // AI Conversations (new)
  const AiConvSchema = new mongoose.Schema(
    {
      propertyId: { type: mongoose.Types.ObjectId, ref: "properties" },
      userId: { type: mongoose.Types.ObjectId, ref: "users" },
      role: { type: String, enum: ["user", "ai"], required: true },
      content: { type: String, required: true },
      triggerKey: String,
      contextSnapshot: Object,
    },
    { timestamps: true }
  );
  const AiConversation = mongoose.models.aiconversations || mongoose.model("aiconversations", AiConvSchema);

  // AI Agent Fired (dedup)
  const AiFiredSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
      triggerKey: { type: String, required: true },
      propertyId: { type: mongoose.Types.ObjectId, ref: "properties", default: null },
    },
    { timestamps: true }
  );
  AiFiredSchema.index({ userId: 1, triggerKey: 1, propertyId: 1 }, { unique: true });
  const AiFired = mongoose.models.aiAgentFired || mongoose.model("aiAgentFired", AiFiredSchema);

  // Past Transactions (for dashboard widget)
  const PastTxSchema = new mongoose.Schema(
    {
      id_mutation: String, mutation_date: String,
      nature_mutation: String, land_value: String,
      address_channel_name: String, postal_code: String,
      community_name: String, actual_built_surface: String,
      number_of_pieces: String, type_local: String,
      city: String,
    },
    { timestamps: true }
  );
  const PastTx = mongoose.models.pastTransactions || mongoose.model("pastTransactions", PastTxSchema);

  // Timeline
  const TimelineSchema = new mongoose.Schema(
    {
      propertyId: { type: mongoose.Types.ObjectId, ref: "properties" },
      userId: { type: mongoose.Types.ObjectId, ref: "users" },
      type: String, title: String, description: String,
    },
    { timestamps: true }
  );
  const Timeline = mongoose.models.timelines || mongoose.model("timelines", TimelineSchema);

  return { User, Property, Interest, Notification, Blog, Room, RoomMember, Message, AiConversation, AiFired, PastTx, Timeline };
}

// ─── seed data ───────────────────────────────────────────────────────────────
async function seed() {
  await connect();
  const M = loadModels();

  const hashedPwd = await bcrypt.hash("password123", 10);

  // ── 1. Users ────────────────────────────────────────────────────────────────
  console.log("\n📦 Seeding users…");

  // AI Bot user
  const aiBotId = id();
  const seller1Id = id();
  const seller2Id = id();
  const buyer1Id = id();
  const buyer2Id = id();
  const buyer3Id = id();
  const adminId = id();

  const users = [
    {
      _id: aiBotId,
      firstName: "Bookaroo",
      lastName: "AI",
      fullName: "Bookaroo AI Assistant",
      email: "ai-agent@bookaroo.com",
      password: hashedPwd,
      role: "user",
      accountType: "individual",
      isVerified: "Y",
      isAiBot: true,
      image: "/assets/img/ai-avatar.png",
      city: "Paris",
      country: "France",
    },
    {
      _id: adminId,
      firstName: "Admin",
      lastName: "Bookaroo",
      fullName: "Admin Bookaroo",
      email: "admin@bookaroo.com",
      password: hashedPwd,
      role: "admin",
      accountType: "individual",
      isVerified: "Y",
      city: "Paris",
      country: "France",
    },
    {
      _id: seller1Id,
      firstName: "Jean",
      lastName: "Dupont",
      fullName: "Jean Dupont",
      email: "jean.dupont@example.com",
      password: hashedPwd,
      role: "user",
      accountType: "individual",
      isVerified: "Y",
      city: "Paris",
      country: "France",
    },
    {
      _id: seller2Id,
      firstName: "Marie",
      lastName: "Martin",
      fullName: "Marie Martin",
      email: "marie.martin@example.com",
      password: hashedPwd,
      role: "user",
      accountType: "pro",
      isVerified: "Y",
      city: "Lyon",
      country: "France",
    },
    {
      _id: buyer1Id,
      firstName: "Ally",
      lastName: "Berry",
      fullName: "Ally Berry",
      email: "ally.berry@example.com",
      password: hashedPwd,
      role: "user",
      accountType: "individual",
      isVerified: "Y",
      city: "Paris",
      country: "France",
    },
    {
      _id: buyer2Id,
      firstName: "Paulette",
      lastName: "Duplantier",
      fullName: "Paulette Duplantier",
      email: "paulette.duplantier@example.com",
      password: hashedPwd,
      role: "user",
      accountType: "individual",
      isVerified: "Y",
      city: "Dieppe",
      country: "France",
    },
    {
      _id: buyer3Id,
      firstName: "Thomas",
      lastName: "Bernard",
      fullName: "Thomas Bernard",
      email: "thomas.bernard@example.com",
      password: hashedPwd,
      role: "user",
      accountType: "individual",
      isVerified: "Y",
      city: "Marseille",
      country: "France",
    },
  ];

  for (const u of users) {
    await M.User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
  }
  console.log(`   ✓ ${users.length} users upserted`);

  // ── 2. Properties ───────────────────────────────────────────────────────────
  console.log("\n📦 Seeding properties…");

  const prop1Id = id();
  const prop2Id = id();
  const prop3Id = id();
  const prop4Id = id();
  const prop5Id = id();

  const properties = [
    {
      _id: prop1Id,
      propertyTitle: "Beautiful Haussmann Apartment - 12 Rue de Rivoli",
      propertyType: "sale",
      type: "apartment",
      price: 485000,
      address: "12 Rue de Rivoli",
      city: "Paris",
      zipcode: "75001",
      country: "France",
      state: "Île-de-France",
      addedBy: seller1Id,
      status: "active",
      isDeleted: false,
      newlocation: { type: "Point", coordinates: [2.3416, 48.8553] },
      images: [
        { file: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", fileName: "prop1.jpg" },
        { file: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800", fileName: "prop1b.jpg" },
      ],
      content: "Superb Haussmann-style apartment in the heart of Paris, fully renovated. Bright and spacious with classic moldings, parquet floors, and high ceilings. Close to all amenities.",
      numberOfRooms: 4,
      numberOfBedrooms: 2,
      numberOfBathrooms: 1,
      surfaceArea: 78,
      propertyViewerCount: 142,
      shareCount: 23,
      visitBookedCount: 8,
      offMarket: false,
      autoInvite: true,
      visitSlots: [
        { date: new Date(Date.now() + 7 * 86400000), time: "14:00", available: true },
        { date: new Date(Date.now() + 8 * 86400000), time: "10:00", available: true },
      ],
      sellerFiles: { documents: 3, verified: true },
    },
    {
      _id: prop2Id,
      propertyTitle: "Modern Studio to Rent - Quartier Latin",
      propertyType: "rent",
      type: "apartment",
      price: 1200,
      address: "12 Rue de Rivoli, Quartier Latin",
      city: "Paris",
      zipcode: "75005",
      country: "France",
      state: "Île-de-France",
      addedBy: seller1Id,
      status: "active",
      isDeleted: false,
      newlocation: { type: "Point", coordinates: [2.3500, 48.8502] },
      images: [
        { file: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", fileName: "prop2.jpg" },
      ],
      content: "Charming studio in the Quartier Latin. Ideal for a student or young professional. Fully equipped kitchen, south-facing, quiet street.",
      numberOfRooms: 1,
      numberOfBedrooms: 0,
      numberOfBathrooms: 1,
      surfaceArea: 22,
      propertyViewerCount: 87,
      shareCount: 12,
      visitBookedCount: 5,
      offMarket: false,
    },
    {
      _id: prop3Id,
      propertyTitle: "Villa with Pool - Côte d'Azur",
      propertyType: "sale",
      type: "house",
      price: 1250000,
      address: "42 Promenade des Pins",
      city: "Nice",
      zipcode: "06000",
      country: "France",
      state: "Provence-Alpes-Côte d'Azur",
      addedBy: seller2Id,
      status: "active",
      isDeleted: false,
      newlocation: { type: "Point", coordinates: [7.2620, 43.7102] },
      images: [
        { file: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", fileName: "prop3.jpg" },
        { file: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", fileName: "prop3b.jpg" },
      ],
      content: "Exceptional contemporary villa with panoramic sea views, heated pool, and landscaped garden. 5 bedrooms, garage, and high-end finishes throughout.",
      numberOfRooms: 7,
      numberOfBedrooms: 5,
      numberOfBathrooms: 3,
      surfaceArea: 320,
      landSurface: 1200,
      propertyViewerCount: 310,
      shareCount: 56,
      visitBookedCount: 14,
    },
    {
      _id: prop4Id,
      propertyTitle: "3-Bedroom Family Home - Lyon Croix-Rousse",
      propertyType: "rent",
      type: "house",
      price: 1850,
      address: "8 Montée de la Boucle",
      city: "Lyon",
      zipcode: "69001",
      country: "France",
      state: "Auvergne-Rhône-Alpes",
      addedBy: seller2Id,
      status: "active",
      isDeleted: false,
      newlocation: { type: "Point", coordinates: [4.8357, 45.7640] },
      images: [
        { file: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", fileName: "prop4.jpg" },
      ],
      content: "Beautiful family home with garden in the famous Croix-Rousse neighbourhood. Bright living room, open kitchen, 3 large bedrooms. Close to schools and public transport.",
      numberOfRooms: 5,
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      surfaceArea: 110,
      propertyViewerCount: 64,
      shareCount: 9,
    },
    {
      _id: prop5Id,
      propertyTitle: "Commercial Space for Directory - Marais District",
      propertyType: "directory",
      type: "building",
      price: 750000,
      address: "15 Rue des Francs-Bourgeois",
      city: "Paris",
      zipcode: "75003",
      country: "France",
      state: "Île-de-France",
      addedBy: seller2Id,
      status: "active",
      isDeleted: false,
      newlocation: { type: "Point", coordinates: [2.3578, 48.8575] },
      images: [
        { file: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", fileName: "prop5.jpg" },
      ],
      content: "Prime commercial property in Le Marais. Ground floor retail space with excellent street visibility. Ideal for gallery, boutique, or office.",
      numberOfRooms: 3,
      surfaceArea: 180,
      propertyViewerCount: 45,
    },
  ];

  for (const p of properties) {
    await M.Property.findOneAndUpdate({ _id: p._id }, p, { upsert: true, new: true });
  }
  console.log(`   ✓ ${properties.length} properties upserted`);

  // ── 3. Interests / Leads ────────────────────────────────────────────────────
  console.log("\n📦 Seeding interests (leads)…");

  const interests = [
    {
      _id: id(),
      propertyId: prop1Id,
      buyerId: buyer1Id,
      propertyType: "sale",
      funnelStatus: "interest received",
      interestType: "interest sent",
      buyerPrice: { amount: 470000, currency: "EUR" },
      ownerPrice: 485000,
      createdAt: daysAgo(5),
    },
    {
      _id: id(),
      propertyId: prop1Id,
      buyerId: buyer2Id,
      propertyType: "sale",
      funnelStatus: "interest received",
      interestType: "interest sent",
      buyerPrice: { amount: 475000, currency: "EUR" },
      ownerPrice: 485000,
      createdAt: daysAgo(3),
    },
    {
      _id: id(),
      propertyId: prop3Id,
      buyerId: buyer3Id,
      propertyType: "sale",
      funnelStatus: "invite user for a visit",
      interestType: "offer sent",
      buyerPrice: { amount: 1200000, currency: "EUR" },
      ownerPrice: 1250000,
      createdAt: daysAgo(10),
    },
    {
      _id: id(),
      propertyId: prop2Id,
      buyerId: buyer1Id,
      propertyType: "rent",
      funnelStatus: "interest received",
      interestType: "interest sent",
      buyerPrice: { amount: 1150, currency: "EUR" },
      createdAt: daysAgo(2),
    },
  ];

  for (const i of interests) {
    await M.Interest.findOneAndUpdate({ propertyId: i.propertyId, buyerId: i.buyerId }, i, { upsert: true, new: true });
  }
  console.log(`   ✓ ${interests.length} interests upserted`);

  // ── 4. Chat Rooms & Messages ────────────────────────────────────────────────
  console.log("\n📦 Seeding chat rooms & messages…");

  const room1Id = id();
  const room2Id = id();
  const aiRoom1Id = id();

  // Regular chat room (buyer1 ↔ seller1 about prop1)
  await M.Room.findOneAndUpdate({ _id: room1Id }, { _id: room1Id, subject: "sale", isGroupChat: false }, { upsert: true });
  await M.RoomMember.findOneAndUpdate({ room_id: room1Id, user_id: seller1Id }, { room_id: room1Id, user_id: seller1Id, property_id: prop1Id }, { upsert: true });
  await M.RoomMember.findOneAndUpdate({ room_id: room1Id, user_id: buyer1Id }, { room_id: room1Id, user_id: buyer1Id, property_id: prop1Id }, { upsert: true });

  // AI chat room (seller1 ↔ AI bot about prop1)
  await M.Room.findOneAndUpdate({ _id: aiRoom1Id }, { _id: aiRoom1Id, subject: "ai-chat", isGroupChat: false }, { upsert: true });
  await M.RoomMember.findOneAndUpdate({ room_id: aiRoom1Id, user_id: seller1Id }, { room_id: aiRoom1Id, user_id: seller1Id, property_id: prop1Id }, { upsert: true });
  await M.RoomMember.findOneAndUpdate({ room_id: aiRoom1Id, user_id: aiBotId }, { room_id: aiRoom1Id, user_id: aiBotId, property_id: prop1Id }, { upsert: true });

  // Regular messages
  const messages = [
    { room_id: room1Id, sender: buyer1Id, property_id: prop1Id, content: "Hello, I'm very interested in this apartment. Can we schedule a visit?", type: "TEXT", status: "read" },
    { room_id: room1Id, sender: seller1Id, property_id: prop1Id, content: "Hello! Of course, I have slots available next week. Are you free on Tuesday at 2pm?", type: "TEXT", status: "read" },
    { room_id: room1Id, sender: buyer1Id, property_id: prop1Id, content: "Tuesday at 2pm works perfectly for me. See you then!", type: "TEXT", status: "unread" },
    // AI chat messages
    { room_id: aiRoom1Id, sender: aiBotId, property_id: prop1Id, content: "👋 Hello! I'm Bookaroo's AI assistant. I noticed your property at 12 Rue de Rivoli has been getting great interest — 2 leads so far! Would you like advice on how to maximize your chances of selling at the best price?", type: "TEXT", status: "unread", message_type: "ai_message" },
    { room_id: aiRoom1Id, sender: seller1Id, property_id: prop1Id, content: "Yes please! What price do you recommend?", type: "TEXT", status: "read", message_type: "ai_message" },
    { room_id: aiRoom1Id, sender: aiBotId, property_id: prop1Id, content: "Based on recent transactions in the 1st arrondissement, apartments of similar size (70-85m²) have sold between €5,800 and €6,400/m². Your asking price of €485,000 (≈€6,218/m²) is well-positioned. I'd recommend not going below €470,000 given current demand.", type: "TEXT", status: "unread", message_type: "ai_message" },
  ];

  for (const m of messages) {
    await M.Message.create(m).catch(() => {});
  }
  console.log(`   ✓ ${messages.length} messages seeded`);

  // ── 5. AI Conversations ─────────────────────────────────────────────────────
  console.log("\n📦 Seeding AI conversations…");

  const aiConvs = [
    {
      propertyId: prop1Id,
      userId: seller1Id,
      role: "ai",
      content: "👋 Hello! I'm Bookaroo's AI assistant. I noticed your property at 12 Rue de Rivoli has been getting great interest — 2 leads so far! Would you like advice on how to maximize your chances of selling at the best price?",
      triggerKey: "OWNER_LEAD_MANAGEMENT_TIP",
      contextSnapshot: { propertyTitle: "Beautiful Haussmann Apartment", leadsCount: 2, city: "Paris" },
      createdAt: daysAgo(3),
    },
    {
      propertyId: prop1Id,
      userId: seller1Id,
      role: "user",
      content: "Yes please! What price do you recommend?",
      createdAt: daysAgo(3),
    },
    {
      propertyId: prop1Id,
      userId: seller1Id,
      role: "ai",
      content: "Based on recent transactions in the 1st arrondissement, apartments of similar size (70-85m²) have sold between €5,800 and €6,400/m². Your asking price of €485,000 (≈€6,218/m²) is well-positioned. I'd recommend not going below €470,000 given current demand.",
      triggerKey: null,
      contextSnapshot: { pricePerSqm: 6218, city: "Paris", surfaceArea: 78 },
      createdAt: daysAgo(3),
    },
    {
      propertyId: prop1Id,
      userId: seller1Id,
      role: "ai",
      content: "📊 Weekly update: Your property received 34 new views this week (+18% vs last week). You now have 2 active leads. The most active one visited your listing 5 times this week — consider inviting them for a viewing!",
      triggerKey: "WEEKLY_OWNER_DIGEST",
      contextSnapshot: { weeklyViews: 34, leadsCount: 2 },
      createdAt: daysAgo(1),
    },
    {
      propertyId: prop3Id,
      userId: seller2Id,
      role: "ai",
      content: "🏡 Great news! A buyer has shown strong interest in your villa in Nice. They've visited your listing 3 times this week. Based on their profile, they have verified financial capacity. Would you like me to help you prepare for a visit invitation?",
      triggerKey: "OWNER_LEAD_MANAGEMENT_TIP",
      contextSnapshot: { propertyTitle: "Villa with Pool", city: "Nice", buyerViews: 3 },
      createdAt: daysAgo(2),
    },
  ];

  for (const c of aiConvs) {
    await M.AiConversation.create(c).catch(() => {});
  }
  console.log(`   ✓ ${aiConvs.length} AI conversation entries seeded`);

  // ── 6. Notifications ────────────────────────────────────────────────────────
  console.log("\n📦 Seeding notifications…");

  const notifications = [
    {
      sendTo: seller1Id, sendBy: aiBotId,
      type: "ai_agent_trigger",
      title: "💡 Tip: Complete your Seller File",
      message: "Your property 'Beautiful Haussmann Apartment' is listed but your seller file is incomplete. Buyers prefer sellers with complete profiles — it increases your chances by 40%!",
      property_id: prop1Id, status: "unread",
      createdAt: daysAgo(4),
    },
    {
      sendTo: seller1Id, sendBy: aiBotId,
      type: "ai_agent_trigger",
      title: "🔥 Your property is trending!",
      message: "142 buyers have viewed '12 Rue de Rivoli' this month. Based on comparable listings, you could sell within 3-6 weeks at your asking price.",
      property_id: prop1Id, status: "read",
      createdAt: daysAgo(7),
    },
    {
      sendTo: buyer1Id, sendBy: aiBotId,
      type: "ai_agent_trigger",
      title: "🏠 Complete your Buyer File",
      message: "You've shown interest in a property. Sellers are 3x more likely to respond to buyers with a verified buyer file. Complete yours now to stand out!",
      property_id: prop1Id, status: "unread",
      createdAt: daysAgo(2),
    },
    {
      sendTo: buyer2Id, sendBy: aiBotId,
      type: "ai_agent_trigger",
      title: "📈 Past transactions in your area",
      message: "You've been browsing properties in Paris 1st. In the last 6 months, 23 similar apartments sold here at an average of €6,100/m². This helps you evaluate if current listings are fairly priced.",
      status: "unread",
      createdAt: daysAgo(1),
    },
    {
      sendTo: seller1Id, sendBy: seller2Id,
      type: "interest",
      title: "New interest received",
      message: "Ally Berry has shown interest in your property at 12 Rue de Rivoli.",
      property_id: prop1Id, status: "read",
      createdAt: daysAgo(5),
    },
    {
      sendTo: seller1Id, sendBy: buyer1Id,
      type: "message",
      title: "New message",
      message: "You have a new message about your property at 12 Rue de Rivoli.",
      property_id: prop1Id, status: "unread",
      createdAt: daysAgo(1),
    },
  ];

  for (const n of notifications) {
    await M.Notification.create(n).catch(() => {});
  }
  console.log(`   ✓ ${notifications.length} notifications seeded`);

  // ── 7. Blogs ────────────────────────────────────────────────────────────────
  console.log("\n📦 Seeding blog posts…");

  const blogs = [
    {
      title: "How to price your property correctly in 2026",
      banner: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800",
      description: "Setting the right price for your property is crucial. Too high and buyers lose interest; too low and you leave money on the table. In this guide, we walk you through the key factors to consider when pricing your home in the current French market.",
      duration: "5 min read",
      status: "active",
      addedBy: adminId,
      isDeleted: false,
      createdAt: daysAgo(14),
    },
    {
      title: "The ultimate guide to the Buyer File (Dossier Acheteur)",
      banner: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
      description: "A complete buyer file is your most powerful tool when making an offer on a property. Sellers and agents will take you much more seriously when you come prepared. Here's everything you need to include.",
      duration: "7 min read",
      status: "active",
      addedBy: adminId,
      isDeleted: false,
      createdAt: daysAgo(10),
    },
    {
      title: "Off-market real estate: What it is and how to access it",
      banner: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      description: "Off-market properties — those sold without public advertising — can represent incredible opportunities for buyers. But how do you find them? We explain the Bookaroo approach and why direct-to-seller transactions are becoming more popular.",
      duration: "4 min read",
      status: "active",
      addedBy: adminId,
      isDeleted: false,
      createdAt: daysAgo(7),
    },
    {
      title: "Understanding the French real estate transaction process",
      banner: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
      description: "From the initial offer (offre d'achat) to signing the final deed at the notary (acte authentique), buying a property in France involves several distinct steps. This guide walks you through the full process with timelines and tips.",
      duration: "10 min read",
      status: "active",
      addedBy: adminId,
      isDeleted: false,
      createdAt: daysAgo(3),
    },
    {
      title: "5 mistakes sellers make that cost them thousands",
      banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      description: "Selling a property involves many decisions. Some common mistakes can significantly reduce your final sale price or delay the transaction for months. We've identified the top 5 errors and how to avoid them.",
      duration: "6 min read",
      status: "active",
      addedBy: adminId,
      isDeleted: false,
      createdAt: daysAgo(1),
    },
  ];

  for (const b of blogs) {
    const exists = await M.Blog.findOne({ title: b.title });
    if (!exists) await M.Blog.create(b);
  }
  console.log(`   ✓ ${blogs.length} blogs seeded`);

  // ── 8. Past Transactions ────────────────────────────────────────────────────
  console.log("\n📦 Seeding past transactions…");

  const pastTxData = [
    { id_mutation: "2024-123456", mutation_date: "2024-03-15", nature_mutation: "Vente", land_value: "485000", address_channel_name: "Rue de Rivoli", postal_code: "75001", community_name: "Paris 1er", actual_built_surface: "75", number_of_pieces: "4", type_local: "Appartement", city: "Paris" },
    { id_mutation: "2024-123457", mutation_date: "2024-02-28", nature_mutation: "Vente", land_value: "312000", address_channel_name: "Boulevard Haussmann", postal_code: "75009", community_name: "Paris 9e", actual_built_surface: "52", number_of_pieces: "3", type_local: "Appartement", city: "Paris" },
    { id_mutation: "2024-123458", mutation_date: "2024-04-10", nature_mutation: "Vente", land_value: "650000", address_channel_name: "Avenue Montaigne", postal_code: "75008", community_name: "Paris 8e", actual_built_surface: "98", number_of_pieces: "5", type_local: "Appartement", city: "Paris" },
    { id_mutation: "2024-123459", mutation_date: "2023-12-20", nature_mutation: "Vente", land_value: "195000", address_channel_name: "Rue de la Paix", postal_code: "69001", community_name: "Lyon 1er", actual_built_surface: "61", number_of_pieces: "3", type_local: "Appartement", city: "Lyon" },
    { id_mutation: "2024-123460", mutation_date: "2024-01-15", nature_mutation: "Vente", land_value: "875000", address_channel_name: "Promenade des Anglais", postal_code: "06000", community_name: "Nice", actual_built_surface: "150", number_of_pieces: "6", type_local: "Maison", city: "Nice" },
    { id_mutation: "2024-123461", mutation_date: "2024-03-01", nature_mutation: "Vente", land_value: "420000", address_channel_name: "Rue Saint-Denis", postal_code: "75002", community_name: "Paris 2e", actual_built_surface: "68", number_of_pieces: "3", type_local: "Appartement", city: "Paris" },
    { id_mutation: "2024-123462", mutation_date: "2024-05-05", nature_mutation: "Vente", land_value: "1100000", address_channel_name: "Boulevard de la Croisette", postal_code: "06400", community_name: "Cannes", actual_built_surface: "200", number_of_pieces: "7", type_local: "Maison", city: "Cannes" },
    { id_mutation: "2024-123463", mutation_date: "2024-02-10", nature_mutation: "Vente", land_value: "255000", address_channel_name: "Rue du Commerce", postal_code: "31000", community_name: "Toulouse", actual_built_surface: "80", number_of_pieces: "4", type_local: "Appartement", city: "Toulouse" },
  ];

  for (const tx of pastTxData) {
    const exists = await M.PastTx.findOne({ id_mutation: tx.id_mutation });
    if (!exists) await M.PastTx.create(tx);
  }
  console.log(`   ✓ ${pastTxData.length} past transactions seeded`);

  // ── 9. Timeline entries ─────────────────────────────────────────────────────
  console.log("\n📦 Seeding timeline entries…");

  const timelineEntries = [
    { propertyId: prop1Id, userId: seller1Id, type: "property_listed", title: "Property listed", description: "Your property at 12 Rue de Rivoli was listed on Bookaroo.", createdAt: daysAgo(30) },
    { propertyId: prop1Id, userId: buyer1Id, type: "interest_received", title: "New lead: Ally Berry", description: "Ally Berry from Paris expressed interest in your property.", createdAt: daysAgo(5) },
    { propertyId: prop1Id, userId: buyer2Id, type: "interest_received", title: "New lead: Paulette Duplantier", description: "Paulette Duplantier from Dieppe expressed interest in your property.", createdAt: daysAgo(3) },
    { propertyId: prop1Id, userId: seller1Id, type: "visit_slot_added", title: "Visit slots added", description: "You added 2 visit slots for next week.", createdAt: daysAgo(2) },
    { propertyId: prop3Id, userId: seller2Id, type: "property_listed", title: "Property listed", description: "Your villa in Nice was listed on Bookaroo.", createdAt: daysAgo(20) },
    { propertyId: prop3Id, userId: buyer3Id, type: "interest_received", title: "New lead: Thomas Bernard", description: "Thomas Bernard from Marseille submitted an offer for your villa.", createdAt: daysAgo(10) },
  ];

  for (const t of timelineEntries) {
    await M.Timeline.create(t).catch(() => {});
  }
  console.log(`   ✓ ${timelineEntries.length} timeline entries seeded`);

  // ── 10. AI Dedup records ────────────────────────────────────────────────────
  console.log("\n📦 Seeding AI fired records (dedup)…");
  const firedRecords = [
    { userId: seller1Id, triggerKey: "ACCOUNT_WELCOME", propertyId: null },
    { userId: seller1Id, triggerKey: "SELLER_FILE_FIRST_SALE_LISTING", propertyId: prop1Id },
    { userId: buyer1Id, triggerKey: "ACCOUNT_WELCOME", propertyId: null },
    { userId: buyer1Id, triggerKey: "BUYER_FILE_INTEREST", propertyId: prop1Id },
  ];
  for (const f of firedRecords) {
    await M.AiFired.findOneAndUpdate({ userId: f.userId, triggerKey: f.triggerKey, propertyId: f.propertyId || null }, f, { upsert: true }).catch(() => {});
  }
  console.log(`   ✓ ${firedRecords.length} AI dedup records seeded`);

  console.log("\n🎉  All seed data inserted successfully!\n");
  console.log("   Test accounts:");
  console.log("   ─────────────────────────────────────────");
  console.log("   Seller 1: jean.dupont@example.com / password123");
  console.log("   Seller 2: marie.martin@example.com / password123");
  console.log("   Buyer 1:  ally.berry@example.com / password123");
  console.log("   Buyer 2:  paulette.duplantier@example.com / password123");
  console.log("   Admin:    admin@bookaroo.com / password123");
  console.log("   ─────────────────────────────────────────");
  console.log("   AI Bot:   ai-agent@bookaroo.com (system user, do not login)");
  console.log("\n   IDs for reference:");
  console.log("   Seller1 ID:", seller1Id.toString());
  console.log("   Prop1  ID:", prop1Id.toString());
  console.log("   AI Bot ID:", aiBotId.toString());

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
