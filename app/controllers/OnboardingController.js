const db = require('../models');
const Onboarding = db.onboarding;
const mongoose = require('mongoose');

const DEFAULT = {
  profile: 'owner',
  objective: 'sell',
  completions: {},
};

// Map persisted signupObjective (French labels) to onboarding profile/objective
const SIGNUP_OBJECTIVE_MAP = {
  Acheter: { profile: 'buyer', objective: 'active_buy' },
  Louer: { profile: 'buyer', objective: 'active_rent' },
  'Planifier mon projet': { profile: 'buyer', objective: 'passive' },
  'Opportunités hors marché': { profile: 'buyer', objective: 'active_buy' },
  'Vendre ma propriété': { profile: 'owner', objective: 'sell' },
  'Louer ma propriété': { profile: 'owner', objective: 'rent' },
  'Évaluer ma propriété': { profile: 'owner', objective: 'increase_value' },
  'Préparer une vente future': { profile: 'owner', objective: 'sell' },
};

module.exports = {
  getState: async (req, res) => {
    try {
      const userId = req.identity?.id || req.query.userId;
      if (!userId) return res.status(200).json({ success: true, data: DEFAULT });

      if (!mongoose.isValidObjectId(userId)) return res.status(200).json({ success: true, data: DEFAULT });

      let rec = await Onboarding.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean();
      if (!rec) {
        // Try to prefill from user's signupObjective when available (first-time)
        try {
          const Users = db.users;
          const user = await Users.findById(userId).lean();
          if (user && user.signupObjective) {
            const mapped = SIGNUP_OBJECTIVE_MAP[user.signupObjective];
            if (mapped) {
              const uid = mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : userId;
              const created = await Onboarding.create({ userId: uid, profile: mapped.profile, objective: mapped.objective, completions: {} });
              return res.status(200).json({ success: true, data: created });
            }
          }
        } catch (e) {
          console.error('Onboarding.prefill error', e);
        }
        return res.status(200).json({ success: true, data: DEFAULT });
      }
      return res.status(200).json({ success: true, data: rec });
    } catch (err) {
      console.error('Onboarding.getState', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.identity?.id || req.body.userId;
      const { profile, objective } = req.body;
      if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

      const update = { profile, objective };
      const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
      const uid = mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : userId;
      await Onboarding.findOneAndUpdate({ userId: uid }, update, opts);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Onboarding.updateProfile', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  updateObjective: async (req, res) => {
    try {
      const userId = req.identity?.id || req.body.userId;
      const { objective } = req.body;
      if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
      const uid2 = mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : userId;
      await Onboarding.findOneAndUpdate({ userId: uid2 }, { objective }, { upsert: true, new: true });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Onboarding.updateObjective', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  sendEvent: async (req, res) => {
    try {
      const userId = req.identity?.id || req.body.userId;
      const { eventType } = req.body;
      if (!userId) return res.status(400).json({ success: false, message: 'userId required' });

      // Map of events -> onboarding actions (mirror frontend mapping)
      const EVENT_TO_ACTIONS = {
        property_published_sale:       ['put_property_for_sale'],
        property_published_rent:       ['put_property_for_rent'],
        property_published_directory:  ['publish_property_directory'],
        p2p_campaign_started:          ['estimate_property_value'],
        transaction_history_searched:  ['consult_transaction_history'],
        training_content_viewed:       ['learn_real_estate'],
        seller_dossier_document_added: ['build_seller_dossier'],
        buyer_dossier_document_added:  ['build_buyer_dossier'],
        tenant_dossier_document_added: ['build_tenant_dossier'],
        peer_estimation_submitted:     ['peer_estimation'],
        property_searched_sale:        ['search_property_buy'],
        property_searched_rent:        ['search_property_rent'],
        directory_browsed:             ['browse_property_directory'],
        professional_searched:         ['find_professional'],
        property_followed:             ['follow_property'],
        owner_contacted:               ['contact_owner_agency'],
      };

      const toComplete = EVENT_TO_ACTIONS[eventType] || [];
      const uid = mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : userId;

      let rec = await Onboarding.findOne({ userId: uid });
      if (!rec) {
        rec = await Onboarding.create({ userId: uid, profile: 'owner', objective: 'sell', completions: {} });
      }

      const completions = { ...(rec.completions || {}) };
      toComplete.forEach((id) => { completions[id] = 'done'; });

      rec.completions = completions;
      await rec.save();

      return res.status(200).json({ success: true, data: rec });
    } catch (err) {
      console.error('Onboarding.sendEvent', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
};
