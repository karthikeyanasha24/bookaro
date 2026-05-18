import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getMyOrders, confirmDelivery, openLitigation, postReview, requestCancellation, acceptCancellation, rejectCancellation } from '../../methods/api/marketplaceApi';
import { toast } from 'react-toastify';
import PageLayout from '../../components/global/PageLayout';
import { ServiceModal } from '../Marketplace';
// single socket instance for this module
const socket = io();
// Modal uniforme pour signaler un incident (même design que pro, couleur violette)
function IncidentModal({ order, onClose, onSubmit }) {
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ description: desc });
    } catch (e) { console.error(e); }
    setLoading(false);
    onClose();
  };
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#976DD0] text-base">Signaler un incident</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <div className="mb-4 text-[13px] text-gray-700">Décrivez le problème rencontré sur ce service. L'admin sera notifié et pourra intervenir.</div>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          rows={4}
          placeholder="Décrivez le problème..."
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">Annuler</button>
          <button onClick={handleSubmit} disabled={loading || !desc.trim()} className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full py-2 text-sm font-semibold">Soumettre</button>
        </div>
      </div>
    </div>
  );
}

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
    // cancellation
    cancellation_requested: 'Annulation demandée',
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
    activate: 'Soumettre',
    rateBtn: 'Evaluer',
  },
  en: {
    title: 'My service purchases',
    sub: 'Purchase history',
    loading: 'Loading…',
    empty: 'No purchases yet.',
    cols: { date:'Date', service:'Service', bien:'Property', pro:'Provider', num:'Order #', tarif:'Price paid', statut:'Status', livraison:'Delivery date', paiement:'Provider payment' },
    status: { pending_payment:'In progress', paid:'In progress', accepted_by_pro:'In progress', delivered_by_pro:'Completed', confirmed_by_buyer:'Completed', cancelled:'Cancelled', refunded:'Cancelled', litigation_opened:'In progress' },
    cancellation_requested: 'Cancellation requested',
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

// Badge backgrounds par label de statut visible (1 couleur par label)
const BADGE_BASE = 'inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold min-w-[120px]';
const STATUS_LABEL_BADGE = {
  'En cours': `bg-amber-200 text-black ${BADGE_BASE}`,
  'In progress': `bg-amber-200 text-black ${BADGE_BASE}`,
  'Terminé': `bg-violet-200 text-black ${BADGE_BASE}`,
  'Completed': `bg-violet-200 text-black ${BADGE_BASE}`,
  'Annulé': `bg-rose-200 text-black ${BADGE_BASE}`,
  'Cancelled': `bg-rose-200 text-black ${BADGE_BASE}`,
  'Annulation demandée': `bg-black text-white ${BADGE_BASE}`,
  'Cancellation requested': `bg-black text-white ${BADGE_BASE}`,
};

// Badge backgrounds par label de paiement (1 couleur par label, différente de Statut service)
const PAYMENT_LABEL_BADGE = {
  'En attente': `bg-blue-100 text-blue-900 ${BADGE_BASE}`,
  'Pending': `bg-blue-100 text-blue-900 ${BADGE_BASE}`,
  'Payé': `bg-green-100 text-green-900 ${BADGE_BASE}`,
  'Paid': `bg-green-100 text-green-900 ${BADGE_BASE}`,
  'Remboursé': `bg-yellow-100 text-yellow-900 ${BADGE_BASE}`,
  'Refunded': `bg-yellow-100 text-yellow-900 ${BADGE_BASE}`,
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
      await postReview({ orderId: order._id, rating, comment, recommend, draft }, lang);
      onSubmit();
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
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

function InvoiceModal({ order, lang, onClose }) {
  if (!order) return null;
  const t = T[lang];
  const invoiceNumber = order.orderNumber || `#${(order._id || '').slice(-6).toUpperCase()}`;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) : t.noDate;
  const provider = order.provider?.name || order.service?.provider?.name || '-';
  const serviceTitle = order.service?.title_fr || order.service?.title || '-';
  const total = order.totalPriceTTC ?? order.totalAmount ?? order.total ?? 0;
  const paymentStatus = order.payment_status === 'paid' || order.status === 'confirmed_by_buyer' ? t.payment.paid : t.payment.pending;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#47525E] text-base">Facture {invoiceNumber}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <div className="grid gap-3 text-[13px] text-gray-700">
          <div className="flex justify-between"><span className="font-semibold">Date</span><span>{date}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Prestataire</span><span>{provider}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Service</span><span>{serviceTitle}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Quantité</span><span>{order.quantity || 1}</span></div>
          <div className="flex justify-between"><span className="font-semibold">Statut paiement</span><span>{paymentStatus}</span></div>
          <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold"><span>Total TTC</span><span>{total} €</span></div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="border border-gray-300 rounded-full py-2 px-4 text-sm text-[#47525E]">Fermer</button>
          <button disabled className="bg-[#976DD0] text-white rounded-full py-2 px-4 text-sm font-semibold opacity-60 cursor-not-allowed">Télécharger</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Aperçu rapide d'un service (modal) ── */

function CancelRequestModal({ order, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  if (!order) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#47525E]">Demande d'annulation</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <p className="text-[13px] text-gray-600 mb-3">Vous pouvez indiquer le motif de votre demande. Le professionnel recevra la demande et devra l'accepter ou la refuser.</p>
        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-4" placeholder="Motif de la demande (obligatoire)" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">Annuler</button>
          <button onClick={async () => {
            if (!reason.trim()) return alert('Merci d\'indiquer un motif');
            setLoading(true);
            try {
              await onSubmit({ reason });
            } catch (e) { console.error(e); alert('Erreur lors de la soumission'); }
            finally { setLoading(false); }
          }} disabled={loading} className="flex-1 bg-[#976DD0] text-white rounded-full py-2 text-sm">Soumettre</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal Libérer les fonds (client) ── */
function ReleaseFundsModal({ order, onClose, onConfirm }) {
  if (!order) return null;
  const svcTitle = order.service?.title_fr || order.service?.title || 'Service';
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#47525E]">Félicitations — Prestation livrée</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <p className="text-[13px] text-gray-700 mb-4">Le professionnel a indiqué avoir livré la prestation: <strong>{svcTitle}</strong>.</p>
        <p className="text-[13px] text-gray-600 mb-4">En validant, vous déclencherez le paiement au prestataire.</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">Annuler</button>
          <button onClick={onConfirm} className="flex-1 bg-[#976DD0] text-white rounded-full py-2 text-sm font-semibold">Valider et payer</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Prompt après paiement — propose d'évaluer ── */
function PostReleasePrompt({ order, onClose, onEvaluate }) {
  if (!order) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm my-4 p-6 text-center">
        <h3 className="font-bold text-[#47525E] mb-2">Paiement déclenché</h3>
        <p className="text-[13px] text-gray-600 mb-4">Merci ! Le paiement a été envoyé au prestataire.</p>
        <p className="text-[13px] text-gray-600 mb-4">Souhaitez-vous laisser un avis sur cette prestation ?</p>
        <div className="flex gap-2 justify-center">
          <button onClick={onClose} className="border border-gray-300 rounded-full py-2 px-4 text-sm text-[#47525E]">Plus tard</button>
          <button onClick={onEvaluate} className="bg-[#976DD0] text-white rounded-full py-2 px-4 text-sm font-semibold">Evaluer</button>
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
  const isCancelled = ['cancelled','refunded','cancellation_requested'].includes(order.status);
  const hasIncident = order.status === 'litigation_opened' || order.incident_opened;
  const paymentLabel = (isDelivered || isConfirmed) ? (isConfirmed ? t.payment.paid : t.payment.pending) : null;
  const showIssue = ['pending_payment','paid','accepted_by_pro'].includes(order.status) || (order.status === 'delivered_by_pro' && order.payment_status !== 'paid');

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
      <td className="py-3 px-3 whitespace-nowrap font-medium">
        {num}
        {hasIncident && (
          <span className="ml-2 inline-block bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full align-middle">Incident</span>
        )}
      </td>
      <td className="py-3 px-3 whitespace-nowrap">{price}</td>
          {/* Statut */}
          <td className="py-3 px-3">
            {(() => {
              const cls = STATUS_LABEL_BADGE[statusLabel] || 'bg-gray-50 text-black';
              return (
                <span className={`inline-block ${cls} rounded-full px-3 py-1 text-[11px] font-semibold`}>{statusLabel}</span>
              );
            })()}
          </td>
      <td className="py-3 px-3 whitespace-nowrap">{dateLivraison}</td>
      {/* Paiement */}
      <td className="py-3 px-3">
        {paymentLabel && (
          (() => {
            const cls = PAYMENT_LABEL_BADGE[paymentLabel] || 'bg-gray-50 text-black';
            return <span className={`inline-block ${cls} rounded-full px-3 py-1 text-[11px] font-semibold`}>{paymentLabel}</span>;
          })()
        )}
      </td>
      {/* Actions */}
      <td className="py-3 px-3">
        <div className="flex flex-col gap-0.5 text-[12px]">
          {!isCancelled && !isDelivered && !isConfirmed && (
            <button onClick={() => onAction('cancel', order)} className="text-[#47525E] hover:text-red-500 text-left font-bold">
              {t.actions.cancel}
            </button>
          )}
          {order.status === 'cancellation_requested' && (
            <button onClick={() => onAction('respond', order)} className="text-red-600 hover:underline text-left font-bold">Répondre</button>
          )}
          <button onClick={() => onAction('see', order)} className="text-[#47525E] hover:text-[#976DD0] text-left font-bold">
            {t.actions.see}
          </button>
          {isDelivered && (
            <>
              <button onClick={() => onAction('release', order)} className="text-[#976DD0] hover:underline text-left font-bold">
                {t.actions.release}
              </button>
            </>
          )}
          {showIssue && (
            <button onClick={() => onAction('issue', order)} className="text-black font-bold hover:underline text-left">
              {t.actions.issue}
            </button>
          )}
          {isConfirmed && (
            <>
              <button onClick={() => onRate(order)} className="text-[#976DD0] hover:underline text-left font-bold">
                {t.rateBtn}
              </button>
              <button onClick={() => onAction('invoice', order)} className="text-[#47525E] hover:text-[#976DD0] text-left font-bold">
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

// Alias pour tests locaux (utilisé quand REACT_APP_DEBUG_MOCK_USER === 'true')
const MOCK_CLIENT_ORDERS = MOCK_ORDERS;

export default function MarketplaceOrders() {
  const [lang, setLang] = useState('fr');
  const t = T[lang];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [incidentOrder, setIncidentOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [respondOrder, setRespondOrder] = useState(null);
  const [releaseOrder, setReleaseOrder] = useState(null);
  const [postReleaseOrder, setPostReleaseOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let orders = [];
      if (process.env.REACT_APP_DEBUG_MOCK_USER === 'true') {
        orders = MOCK_CLIENT_ORDERS;
      } else {
        const res = await getMyOrders(lang);
        orders = res?.orders || res?.data || [];
      }
      setOrders(orders.length > 0 ? orders : MOCK_ORDERS);
    } catch (e) { console.error(e); setOrders(MOCK_ORDERS); }
    finally { setLoading(false); }
  }, [lang]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Real-time updates via WebSocket (reuse module socket)
  useEffect(() => {
    socket.on('cancellation_requested', ({ orderId, request }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancellation_requested', cancellationRequest: request } : o));
      toast.info(`Annulation demandée ${orderId ? `(${orderId.slice(-5).toUpperCase()})` : ''}`);
    });
    socket.on('cancellation_accepted', ({ orderId, request }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled', cancellationRequest: { ...(o.cancellationRequest||{}), status: 'accepted', ...request } } : o));
      toast.success(`Annulation acceptée ${orderId ? `(${orderId.slice(-5).toUpperCase()})` : ''}`);
    });
    socket.on('cancellation_rejected', ({ orderId, request }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: (request?.previousStatus || (o.cancellationRequest?.previousStatus || 'accepted_by_pro')), cancellationRequest: { ...(o.cancellationRequest||{}), status: 'rejected', ...request } } : o));
      toast.info(`Annulation refusée ${orderId ? `(${orderId.slice(-5).toUpperCase()})` : ''}`);
    });
    return () => {
      socket.off('cancellation_requested');
      socket.off('cancellation_accepted');
      socket.off('cancellation_rejected');
    };
  }, []);

  const handleAction = async (type, order) => {
    if (type === 'see') {
      setViewOrder(order);
    } else if (type === 'release') {
      setReleaseOrder(order);
    } else if (type === 'issue') {
      setIncidentOrder(order);
    } else if (type === 'cancel') {
      setCancelOrder(order);
    } else if (type === 'respond') {
      setRespondOrder(order);
    } else if (type === 'invoice') {
      setInvoiceOrder(order);
    }
  };

  return (
    <PageLayout>
      <div className="bg-[#f3f5f9] min-h-full py-[22px] px-[22px] pb-24">
        <div className="max-w-[1120px] mx-auto">
          <>
            <h1 className="text-xl font-bold text-[#47525E]">{t.title}</h1>
            <p className="text-[13px] text-gray-400">{t.sub}</p>
            <div className="flex gap-2 items-center">
              <button onClick={fetchOrders} className="text-[13px] border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 text-[#47525E]">{t.refresh}</button>
              <button onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')} className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 text-[#47525E]">{t.switchLang}</button>
            </div>
          </>
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

        {ratingOrder && (
          <RatingModal order={ratingOrder} lang={lang} onClose={() => setRatingOrder(null)} onSubmit={() => { setRatingOrder(null); fetchOrders(); }} />
        )}
        {viewOrder && (
          <ServiceModal
            svc={{
              ...(viewOrder.service_snapshot || viewOrder.service || {}),
              provider: viewOrder.provider || viewOrder.service?.provider,
            }}
            lang={lang}
            onClose={() => setViewOrder(null)}
            onBuy={() => {}}
            hideActions={true}
          />
        )}
        {incidentOrder && (
          <IncidentModal order={incidentOrder} onClose={() => setIncidentOrder(null)} onSubmit={async ({ description }) => {
            await openLitigation(incidentOrder._id, description, lang);
            setIncidentOrder(null);
            fetchOrders();
          }} />
        )}
        {respondOrder && (
          <div>
            {/* Client modal to respond to cancellation request */}
            {(() => {
              const order = respondOrder;
              const req = order.cancellationRequest || {};
              return (
                <div onClick={() => setRespondOrder(null)} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
                  <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-[#47525E]">Réponse à la demande d'annulation</h3>
                      <button onClick={() => setRespondOrder(null)} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
                    </div>
                    <div className="text-[13px] text-gray-700 mb-3">
                      <div className="mb-2"><strong>Motif :</strong></div>
                      <div className="whitespace-pre-line rounded border border-gray-100 p-3 text-sm text-gray-600">{req.reason || '-'}</div>
                      <div className="text-[12px] text-gray-400 mt-3">Envoyée: {req.createdAt ? new Date(req.createdAt).toLocaleString('fr-FR') : '-'}</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={async () => {
                        try { await rejectCancellation(respondOrder._id, lang); toast.info('Vous avez refusé la demande'); } catch (e) { console.warn(e); }
                        setOrders(prev => prev.map(o => o._id === respondOrder._id ? { ...o, status: o.cancellationRequest?.previousStatus || 'accepted_by_pro' } : o));
                        setRespondOrder(null);
                      }} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">Refuser</button>
                      <button onClick={async () => {
                        try { await acceptCancellation(respondOrder._id, lang); toast.success('Vous avez accepté la demande — remboursement en cours'); } catch (e) { console.warn(e); }
                        setOrders(prev => prev.map(o => o._id === respondOrder._id ? { ...o, status: 'cancelled' } : o));
                        setRespondOrder(null);
                      }} className="flex-1 bg-[#D14343] text-white rounded-full py-2 text-sm">Accepter et rembourser</button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
        {cancelOrder && (
            <CancelRequestModal order={cancelOrder} onClose={() => setCancelOrder(null)} onSubmit={async ({ reason }) => {
            try {
              await requestCancellation(cancelOrder._id, { reason }, lang);
              // emit locally so other open clients update immediately
              try {
                socket.emit('cancellation_requested', { orderId: cancelOrder._id, request: { reason, createdAt: new Date().toISOString(), by: 'client' } });
                toast.success('Demande d\'annulation envoyée');
              } catch (e) { /* ignore */ }
            } catch (e) { console.warn(e); }
            setOrders(prev => prev.map(o => o._id === cancelOrder._id ? { ...o, status: 'cancellation_requested', cancellationRequest: { reason, createdAt: new Date().toISOString(), by: 'client' } } : o));
            setCancelOrder(null);
          }} />
        )}
        {invoiceOrder && (
          <InvoiceModal order={invoiceOrder} lang={lang} onClose={() => setInvoiceOrder(null)} />
        )}
        {releaseOrder && (
          <ReleaseFundsModal order={releaseOrder} onClose={() => setReleaseOrder(null)} onConfirm={async () => {
            try { await confirmDelivery(releaseOrder._id, lang); } catch (e) { console.warn(e); }
            setReleaseOrder(null);
            fetchOrders();
            setPostReleaseOrder(releaseOrder);
          }} />
        )}
        {postReleaseOrder && (
          <PostReleasePrompt order={postReleaseOrder} onClose={() => setPostReleaseOrder(null)} onEvaluate={() => { setPostReleaseOrder(null); setRatingOrder(postReleaseOrder); }} />
        )}
      </div>
    </PageLayout>
  );
}

