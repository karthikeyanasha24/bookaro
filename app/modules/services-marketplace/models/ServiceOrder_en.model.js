const mongoose = require('mongoose');

const ServiceOrderEnSchema = new mongoose.Schema({
  serviceSnapshot: { type: Object, required: true }, // snapshot of the service at purchase
  proSnapshot: { type: Object, required: true }, // snapshot of the pro
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'ProService_en', required: true },
  status: { type: String, enum: [
    'pending_payment', 'paid', 'payment_failed', 'accepted_by_pro', 'in_progress', 'delivered_by_pro', 'cancellation_requested', 'confirmed_by_buyer', 'litigation_opened', 'payout_released', 'cancelled', 'refunded'
  ], default: 'pending_payment' },
  payoutStatus: { type: String, enum: ['pending', 'released', 'cancelled'], default: 'pending' },
  quantity: { type: Number, required: true },
  cancellationRequest: { type: Object, default: null },
  cancellationResponse: { type: Object, default: null },
  cancellationRequestedAt: { type: Date, default: null },
  totalPriceTTC: { type: Number, required: true },
  commissionHT: { type: Number, required: true },
  stripePaymentIntentId: { type: String },
  stripePayoutId: { type: String },
  paidAt: { type: Date },
  deliveredAt: { type: Date },
  deliveryMessage: { type: String, default: null },
  attachments: { type: [{ name: String, url: String, size: Number, mimeType: String }], default: [] },
  litigationDescription: { type: String, default: null },
  litigationInitiatedBy: { type: String, enum: ['buyer', 'pro'], default: null },
  confirmedAt: { type: Date },
  cancelledAt: { type: Date },
  refundedAt: { type: Date },
  litigationOpenedAt: { type: Date },
  payoutReleasedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceOrder_en', ServiceOrderEnSchema);
