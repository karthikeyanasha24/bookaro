// Centralisation des enums/statuts pour la marketplace

module.exports = {
  ServiceStatus: ['draft', 'active', 'inactive', 'deleted'],
  OrderStatus: [
    'pending_payment', 'paid', 'accepted_by_pro', 'in_progress', 'delivered_by_pro',
    'confirmed_by_buyer', 'litigation_opened', 'payout_released', 'cancelled', 'refunded'
  ],
  ReviewStatus: ['draft', 'published'],
  PayoutStatus: ['pending', 'released', 'cancelled'],
  BadgeStatus: ['favorite', 'recommended'],
  FavoriteStatus: ['active', 'unavailable']
};
