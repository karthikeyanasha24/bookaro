// Mocks pour les ventes de services et consultation

export const MOCK_PRO_ORDERS = [
  {
    _id: 'order1',
    createdAt: '2026-05-01T10:00:00Z',
    delivery_date: '2026-05-03T15:00:00Z',
    totalTTC: 350,
    status: 'delivered_by_pro',
    payment_status: 'paid',
    client: { name: 'Alice Martin', email: 'alice@example.com' },
    property: { title: 'Appartement Paris 15e' },
    service_snapshot: {
      title_fr: 'Diagnostic énergétique',
      section_service: 'Diagnostic complet DPE',
      section_benefit_text: 'Obtenez un rapport précis sur la performance énergétique.',
      section_description_text: 'Visite sur place, analyse, rapport PDF.',
      section_deliverable_text: 'Rapport PDF, conseils personnalisés',
      section_billing_text: 'Facture disponible après paiement',
      price_ttc: 350,
      zone_covered: 'Paris',
      tarification_type: 'Forfait',
    },
    attachments: [
      { url: 'https://dummyfiles.com/rapport-dpe.pdf', name: 'rapport-dpe.pdf' }
    ]
  },
  {
    _id: 'order2',
    createdAt: '2026-05-05T09:00:00Z',
    totalTTC: 120,
    status: 'in_progress',
    payment_status: 'pending',
    client: { name: 'Bob Dupont', email: 'bob@example.com' },
    property: { title: 'Maison Lyon 3e' },
    service_snapshot: {
      title_fr: 'Etat des lieux',
      section_service: 'Etat des lieux entrée',
      section_benefit_text: 'Sécurisez votre location.',
      section_description_text: 'Etat des lieux détaillé, photos, signature.',
      section_deliverable_text: 'Document signé, photos',
      section_billing_text: 'Paiement à la commande',
      price_ttc: 120,
      zone_covered: 'Lyon',
      tarification_type: 'Unitaire',
    },
    attachments: []
  }
];

export const MOCK_CLIENT_ORDERS = [
  {
    _id: 'order1',
    createdAt: '2026-05-01T10:00:00Z',
    delivery_date: '2026-05-03T15:00:00Z',
    totalTTC: 350,
    status: 'delivered_by_pro',
    payment_status: 'paid',
    pro: { name: 'Sophie Pro', email: 'sophiepro@example.com' },
    property: { title: 'Appartement Paris 15e' },
    service_snapshot: {
      title_fr: 'Diagnostic énergétique',
      section_service: 'Diagnostic complet DPE',
      section_benefit_text: 'Obtenez un rapport précis sur la performance énergétique.',
      section_description_text: 'Visite sur place, analyse, rapport PDF.',
      section_deliverable_text: 'Rapport PDF, conseils personnalisés',
      section_billing_text: 'Facture disponible après paiement',
      price_ttc: 350,
      zone_covered: 'Paris',
      tarification_type: 'Forfait',
    },
    attachments: [
      { url: 'https://dummyfiles.com/rapport-dpe.pdf', name: 'rapport-dpe.pdf' }
    ]
  }
];
