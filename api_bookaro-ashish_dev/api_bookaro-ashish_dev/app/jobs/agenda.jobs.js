const db = require("../models");
const aiAgentTriggers = require("../services/aiAgentTriggers.service");
const aiOrchestrator = require("../services/aiOrchestrator.service");

module.exports = (agenda, db) => {
  agenda.define("deactivate-trial-plan", async (job) => {
    const { userId } = job.attrs.data;

    try {
      await db.users.updateOne(
        { _id: userId },
        {
          $set: {
            planId: null,
            planType: null,
            planDuration: null,
            freeTrialStatus: "done"
          }
        }
      );

      console.log(`Trial plan deactivated for user ${userId}`);
    } catch (err) {
      console.error("Error deactivating trial plan:", err);
    }
  });

  //agenda to expire the active campaign
  agenda.define("expire-active-campaign", async (job) => {
    const { campaginId } = job.attrs.data;
    try {
      await db.peerCampaign.updateOne(
        { _id: campaginId },
        {
          $set: {
            status: "inactive"
          }
        }
      );
      console.log(`Active campaign expired ${campaginId}`);
    } catch (err) {
      console.error("Error expiring the active campaign:", err);
    }
  });
  //// agenda to delete the unused records
  //   agenda.define("cleanup-agenda-jobs", async () => {
  //   try {
  //     const result = await db.agendaJobs.deleteMany({
  //       nextRunAt: null,
  //       repeatInterval: null,
  //       lastFinishedAt: { $exists: true },
  //       lockedAt: null
  //     });

  //     console.log(`Cleaned up ${result.deletedCount} completed one-time jobs.`);
  //   } catch (err) {
  //     console.error("Error cleaning up agenda jobs:", err);
  //   }
  // });

  agenda.define("weekly-ai-agent-digests", async () => {
    try {
      await aiAgentTriggers.weeklyLeadDigests();
      await aiAgentTriggers.weeklyOwnerDigests();
      // Also run enhanced orchestrator digests (stores in AI chat history)
      await aiOrchestrator.runWeeklyOwnerDigests(db);
    } catch (err) {
      console.error("weekly-ai-agent-digests", err);
    }
  });

  agenda.define("ai-agent-owner-no-interest-scan", async () => {
    try {
      await aiAgentTriggers.maybeNotifyOwnerNoInterest2Weeks();
      // Also run orchestrator no-interest scan
      await aiOrchestrator.runNoInterestScan(db);
    } catch (err) {
      console.error("ai-agent-owner-no-interest-scan", err);
    }
  });
};
