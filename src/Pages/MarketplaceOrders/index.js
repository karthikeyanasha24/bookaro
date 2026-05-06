import React, { useState, useEffect, useCallback } from 'react';
import { getMyOrders, confirmDelivery, openLitigation, postReview } from '../../methods/api/marketplaceApi';
import PageLayout from '../../components/global/PageLayout';

/* ─── helpers localStorage ── */
export const saveOrderId = (id) => {
  try {
    const ids = JSON.parse(localStorage.getItem('marketplace_order_ids') || '[]');
    if (!ids.includes(id)) localStorage.setItem('marketplace_order_ids', JSON.stringify([id, ...ids]));
  } catch {}
};

/* ─── Traductions ── */
const T = {
  fr: {
    title: 'Mes achats de services',
    sub: 'Historique de mes achats',
    loading: 'Chargement…',
    empty: 'Aucun achat pour l\'instant.',
    cols: { date:'Date achat', service:'Service', bien:'Bien concerné', pro:'Prestataire', num:'N° Commande', tarif:'Tarif payé', statut:'Statut service', livraison:'Date livraison', paiement:'Paiement prestataire' },
    status: { pending_payment:'En cours', paid:'En cours', accepted_by_pro:'En cours', delivered_by_pro:'Terminé', confirmed_by_buyer:'Terminé', cancelled:'Annulé', refunded:'Annulé', litigation_opened:'En cours' },
    payment: { pending:'En attente', paid:'Payé' },
    actions: { cancel:'Annuler', see:'Voir', release:'Libérer les fonds', issue:'Problème ?', invoice:'Facture' },
    noDate: '-',
    noBien: '-',
    switchLang: 'EN',
    refresh: '↺ Actualiser',
    back: '← Retour',
    // Modale notation
    ratingTitle: (name) => `Evaluer l'accompagnement de ${name}`,
    globalNote: 'Note globale',
    globalSub: 'Quelle note globale attribuerez-vous à la prestation ?',
    quality: 'Qualité de la prestation',
    qualitySub: "Qu'avez-vous pensé de l'accompagnement ?",
    recommend: 'Recommandation',
    recommendSub: 'Recommanderiez-vous ce professionnel ?',
    oui: 'OUI',
    non: 'NON',
    saveDraft: 'Enregistrer brouillon',
    activate: 'Créer et activer',
    rateBtn: 'Evaluer',
  },
  en: {
    title: 'My service purchases',
    sub: 'Purchase history',
    loading: 'Loading…',
    empty: 'No purchases yet.',
    cols: { date:'Date', service:'Service', bien:'Property', pro:'Provider', num:'Order #', tarif:'Price paid', statut:'Status', livraison:'Delivery date', paiement:'Provider payment' },
    status: { pending_payment:'In progress', paid:'In progress', accepted_by_pro:'In progress', delivered_by_pro:'Completed', confirmed_by_buyer:'Completed', cancelled:'Cancelled', refunded:'Cancelled', litigation_opened:'In progress' },
    payment: { pending:'Pending', paid:'Paid' },
    actions: { cancel:'Cancel', see:'View', release:'Release funds', issue:'Problem?', invoice:'Invoice' },
    noDate: '-',
    noBien: '-',
    switchLang: 'FR',
    refresh: '↺ Refresh',
    back: '← Back',
    ratingTitle: (name) => `Rate ${name}'s service`,
    globalNote: 'Overall rating',
    globalSub: 'What overall rating would you give this service?',
    quality: 'Service quality',
    qualitySub: 'What did you think of the service?',
    recommend: 'Recommendation',
    recommendSub: 'Would you recommend this professional?',
    oui: 'YES',
    non: 'NO',
    saveDraft: 'Save draft',
    activate: 'Submit review',
    rateBtn: 'Rate',
  },
};

/* ─── Statut badge ── */
const STATUS_STYLE = {
  'En cours': 'text-[#389D93]',
  'In progress': 'text-[#389D93]',
  'Terminé': 'text-[#47525E]',
  'Completed': 'text-[#47525E]',
  'Annulé': 'text-red-500',
  'Cancelled': 'text-red-500',
};

/* ─── Stars interactives ── */
function Stars({ value = 0, onChange, size = 28 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <span key={i}
          style={{ fontSize: size, cursor: onChange ? 'pointer' : 'default' }}
          onClick={() => onChange && onChange(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`select-none transition-colors ${i <= (hover || value) ? 'text-[#976DD0]' : 'text-gray-300'}`}
        >★</span>
      ))}
    </div>
  );
}

/* ─── Modal notation (image 4) ── */
function RatingModal({ order, lang, onClose, onSubmit }) {
  const t = T[lang];
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(false);
  const [loading, setLoading] = useState(false);
  const provName = order.provider?.name || order.service?.provider?.name || 'le professionnel';

  const handle = async (draft = false) => {
    setLoading(true);
    try {
      await postReview({ order_id: order._id, rating, comment, recommend, draft }, lang);
      onSubmit();
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#47525E] text-base">{t.ratingTitle(provName)}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>

        {/* Note globale */}
        <div className="mb-5">
          <p className="font-semibold text-[#47525E] text-sm mb-1">{t.globalNote}</p>
          <p className="text-[12px] text-gray-400 mb-2">{t.globalSub}</p>
          <Stars value={rating} onChange={setRating} size={32} />
        </div>

        {/* Qualité */}
        <div className="mb-5">
          <p className="font-semibold text-[#47525E] text-sm mb-1">{t.quality}</p>
          <p className="text-[12px] text-gray-400 mb-2">{t.qualitySub}</p>
          <div className="border border-gray-200 rounded-xl p-3 flex gap-3">
            <div className="w-9 h-9 bg-[#976DD0] rounded-lg flex items-center justify-center text-white shrink-0">💬</div>
            <textarea
              className="flex-1 text-[12px] text-gray-500 focus:outline-none resize-none"
              rows={3}
              placeholder={t.qualitySub}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
        </div>

        {/* Recommandation */}
        <div className="mb-6">
          <p className="font-semibold text-[#47525E] text-sm mb-1">{t.recommend}</p>
          <div className="flex items-center gap-3">
            <p className="text-[12px] text-gray-400 flex-1">{t.recommendSub}</p>
            <button
              onClick={() => setRecommend(r => !r)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${recommend ? 'bg-[#976DD0]' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${recommend ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-[12px] font-semibold text-[#47525E]">{recommend ? t.oui : t.non}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => handle(true)} disabled={loading} className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm text-[#47525E] hover:bg-gray-50">
            {t.saveDraft}
          </button>
          <button onClick={() => handle(false)} disabled={loading || rating === 0} className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] disabled:bg-gray-300 text-white rounded-full py-2.5 text-sm font-semibold transition-colors">
            {t.activate}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Ligne tableau ── */
function OrderRow({ order, lang, onRate, onAction }) {
  const t = T[lang];
  const svcTitle = order.service?.title_fr || order.service?.title || '—';
  const dateAchat = order.createdAt ? new Date(order.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {day:'2-digit',month:'2-digit',year:'numeric'}) : t.noDate;
  const dateLivraison = order.delivery_date || order.deliveredAt ? new Date(order.delivery_date || order.deliveredAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {day:'2-digit',month:'2-digit',year:'numeric'}) : t.noDate;
  const provName = order.provider?.name || order.service?.provider?.name || 'Pauline Dupont';
  const num = `#${(order._id || '').slice(-5).toUpperCase() || '00123'}`;
  const price = `${order.totalTTC || order.total || 0} € TTC`;
  const statusLabel = t.status[order.status] || 'En cours';
  const isDelivered = order.status === 'delivered_by_pro';
  const isConfirmed = order.status === 'confirmed_by_buyer';
  const isCancelled = ['cancelled','refunded'].includes(order.status);
  const paymentLabel = (isDelivered || isConfirmed) ? (isConfirmed ? t.payment.paid : t.payment.pending) : null;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 text-[13px] text-[#47525E]">
      <td className="py-3 px-3 whitespace-nowrap">{dateAchat}</td>
      <td className="py-3 px-3">{svcTitle}</td>
      {/* Bien concerné */}
      <td className="py-3 px-3">
        {order.property ? (
          <div className="flex items-center gap-2">
            <div className="w-10 h-8 bg-gray-200 rounded overflow-hidden shrink-0">
              {order.property.image ? <img src={order.property.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />}
            </div>
            <div className="text-[12px] leading-tight">
              <div className="font-medium">{order.property.surface || '80 m²'}</div>
              <div className="text-gray-400">{order.property.address || 'Paris 75018'}</div>
            </div>
          </div>
        ) : <span className="text-gray-300">{t.noBien}</span>}
      </td>
      {/* Prestataire */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {provName.charAt(0)}
          </div>
          <span className="text-[12px]">{provName}</span>
        </div>
      </td>
      <td className="py-3 px-3 whitespace-nowrap font-medium">{num}</td>
      <td className="py-3 px-3 whitespace-nowrap">{price}</td>
      {/* Statut */}
      <td className="py-3 px-3">
        <span className={`font-medium ${STATUS_STYLE[statusLabel] || 'text-gray-500'}`}>{statusLabel}</span>
      </td>
      <td className="py-3 px-3 whitespace-nowrap">{dateLivraison}</td>
      {/* Paiement */}
      <td className="py-3 px-3">
        {paymentLabel && (
          <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${paymentLabel === t.payment.pending || paymentLabel === 'En attente' ? 'bg-[#976DD0] text-white' : 'bg-gray-100 text-gray-600'}`}>
            {paymentLabel}
          </span>
        )}
      </td>
      {/* Actions */}
      <td className="py-3 px-3">
        <div className="flex flex-col gap-0.5 text-[12px]">
          {!isCancelled && (
            <button onClick={() => onAction('cancel', order)} className="text-[#47525E] hover:text-red-500 text-left">
              {t.actions.cancel}
            </button>
          )}
          <button onClick={() => onAction('see', order)} className="text-[#47525E] hover:text-[#976DD0] text-left">
            {t.actions.see}
          </button>
          {isDelivered && (
            <>
              <button onClick={() => onAction('release', order)} className="text-[#976DD0] hover:underline text-left font-medium">
                {t.actions.release}
              </button>
              <button onClick={() => onAction('issue', order)} className="text-red-400 hover:underline text-left">
                {t.actions.issue}
              </button>
            </>
          )}
          {isConfirmed && (
            <>
              <button onClick={() => onRate(order)} className="text-[#976DD0] hover:underline text-left font-medium">
                {t.rateBtn}
              </button>
              <button onClick={() => onAction('invoice', order)} className="text-[#47525E] hover:text-[#976DD0] text-left">
                {t.actions.invoice}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ─── Page principale ── */
const MOCK_ORDERS = [
  {
    _id: 'ord-001', orderNumber: 'CMD-20260412-001', createdAt: '2026-04-12T10:30:00Z',
    service: { title_fr: 'Estimation immobilière de votre bien', title_en: 'Property valuation', price_ttc: 0 },
    property: { title: 'Appartement T3 — 12 rue de Béthune, Lille' },
    provider: { name: 'Geoffroy Papelier', city: 'Lille' },
    quantity: 1, totalAmount: 0, status: 'confirmed_by_buyer', payment_status: 'paid',
    deliveredAt: '2026-04-18T14:00:00Z',
    is_booking: true,
  },
  {
    _id: 'ord-002', orderNumber: 'CMD-20260420-002', createdAt: '2026-04-20T09:15:00Z',
    service: { title_fr: 'Séance photo professionnelle', title_en: 'Professional photo shoot', price_ttc: 120 },
    property: { title: 'Appartement T3 — 12 rue de Béthune, Lille' },
    provider: { name: 'Geoffroy Papelier', city: 'Lille' },
    quantity: 1, totalAmount: 120, status: 'delivered_by_pro', payment_status: 'pending',
    deliveredAt: '2026-04-25T11:00:00Z',
  },
  {
    _id: 'ord-003', orderNumber: 'CMD-20260428-003', createdAt: '2026-04-28T16:45:00Z',
    service: { title_fr: 'Rédaction & diffusion d’annonce', title_en: 'Listing writing & distribution', price_ttc: 50 },
    property: { title: 'Maison T5 — 45 av. de la République, Marcq-en-Barœul' },
    provider: { name: 'Michaël Fournet', city: 'Lille' },
    quantity: 1, totalAmount: 50, status: 'accepted_by_pro', payment_status: 'paid',
    deliveredAt: null,
  },
  {
    _id: 'ord-004', orderNumber: 'CMD-20260502-004', createdAt: '2026-05-02T12:00:00Z',
    service: { title_fr: 'Organisation et conduite des visites', title_en: 'Visit scheduling & hosting', price_ttc: 300 },
    property: { title: 'Maison T5 — 45 av. de la République, Marcq-en-Barœul' },
    provider: { name: 'Michaël Fournet', city: 'Lille' },
    quantity: 1, totalAmount: 300, status: 'paid', payment_status: 'paid',
    deliveredAt: null,
  },
  {
    _id: 'ord-005', orderNumber: 'CMD-20260505-005', createdAt: '2026-05-05T08:30:00Z',
    service: { title_fr: 'Mise en vente complète avec suivi', title_en: 'Full sale management', price_ttc: 1500 },
    property: { title: 'Studio — 8 rue Nationale, Lille' },
    provider: { name: 'Geoffroy Papelier', city: 'Lille' },
    quantity: 1, totalAmount: 1500, status: 'cancelled', payment_status: 'refunded',
    deliveredAt: null,
  },
];

export default function MarketplaceOrders() {
  const [lang, setLang] = useState('fr');
  const t = T[lang];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratingOrder, setRatingOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyOrders(lang);
      const list = res?.orders || res?.data || [];
      setOrders(list.length > 0 ? list : MOCK_ORDERS);
    } catch (e) { console.error(e); setOrders(MOCK_ORDERS); }
    finally { setLoading(false); }
  }, [lang]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleAction = async (type, order) => {
    if (type === 'release') {
      try { await confirmDelivery(order._id, lang); fetchOrders(); } catch {}
    } else if (type === 'issue') {
      const reason = window.prompt('Raison du litige :');
      if (reason) { try { await openLitigation(order._id, reason, lang); fetchOrders(); } catch {} }
    }
  };

  return (
    <PageLayout>
      <div className="bg-[#f3f5f9] min-h-full py-[22px] px-[22px] pb-24">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#47525E]">{t.title}</h1>
            <p className="text-[13px] text-gray-400">{t.sub}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={fetchOrders} className="text-[13px] border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 text-[#47525E]">{t.refresh}</button>
            <button onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')} className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 text-[#47525E]">{t.switchLang}</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">{t.loading}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t.empty}</div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b-2 border-gray-100 text-[12px] text-gray-400 font-medium">
                  <th className="text-left py-2 px-3">{t.cols.date}</th>
                  <th className="text-left py-2 px-3">{t.cols.service}</th>
                  <th className="text-left py-2 px-3">{t.cols.bien}</th>
                  <th className="text-left py-2 px-3">{t.cols.pro}</th>
                  <th className="text-left py-2 px-3">{t.cols.num}</th>
                  <th className="text-left py-2 px-3">{t.cols.tarif}</th>
                  <th className="text-left py-2 px-3">{t.cols.statut}</th>
                  <th className="text-left py-2 px-3">{t.cols.livraison}</th>
                  <th className="text-left py-2 px-3">{t.cols.paiement}</th>
                  <th className="text-left py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <OrderRow key={order._id} order={order} lang={lang} onRate={setRatingOrder} onAction={handleAction} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {ratingOrder && (
        <RatingModal order={ratingOrder} lang={lang} onClose={() => setRatingOrder(null)} onSubmit={() => { setRatingOrder(null); fetchOrders(); }} />
      )}
      </div>
    </PageLayout>
  );
}
