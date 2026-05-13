module.exports = (mongoose) => {
  const DashboardPreferencesSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true,
      },
      preferences: {
        buyer: {
          sectionOrder: { type: [String], default: [] },
          sectionVisibility: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
        renter: {
          sectionOrder: { type: [String], default: [] },
          sectionVisibility: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
        seller: {
          sectionOrder: { type: [String], default: [] },
          sectionVisibility: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
        owner: {
          sectionOrder: { type: [String], default: [] },
          sectionVisibility: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
      },
    },
    { timestamps: true }
  );

  return mongoose.model("dashboardpreferences", DashboardPreferencesSchema);
};
