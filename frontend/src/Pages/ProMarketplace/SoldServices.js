import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getProOrders, deliverOrder, openLitigationPro, acceptCancellation, rejectCancellation, proRequestCancellation } from '../../methods/api/marketplaceApi';
import { toast } from 'react-toastify';
import { MOCK_PRO_ORDERS } from '../../mocks/marketplaceOrders.mock';
import { uploadFiles } from '../../methods/api/upload';
import PageLayout from '../../components/global/PageLayout';
import { ServiceModal } from '../Marketplace';

const socket = io();

// Modal pour signaler un incident
function IncidentModal({ order, onClose, onSubmit }) {
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit({ description: desc });
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

// Modale de soumission du travail
function SubmitWorkModal({ order, onClose, onSubmit }) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (fileList) => {
    setFiles(Array.from(fileList));
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit({ message, files });
    setLoading(false);
    onClose();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#47525E] text-base">Soumettre le travail</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <div className="mb-4 text-[13px] text-gray-700">Vous confirmez la livraison de votre prestation. Ajoutez un message et/ou des pièces jointes si besoin.</div>
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          rows={3}
          placeholder="Message au client (optionnel)"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div
          className={`mb-3 border-2 border-dashed rounded-lg px-4 py-6 flex flex-col items-center justify-center transition-colors ${dragActive ? 'border-[#976DD0] bg-[#f7f2fc]' : 'border-gray-200 bg-gray-50'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <span className="text-[#976DD0] text-2xl mb-1">📎</span>
            <span className="text-[13px] text-[#47525E] font-medium mb-1">Déposez vos fichiers ici ou <span className="underline">sélectionnez</span></span>
            <span className="text-[11px] text-gray-400">(PDF, images, etc. – max 10 fichiers)</span>
          </label>
          {files.length > 0 && (
            <ul className="mt-3 w-full text-left text-[13px] text-[#47525E] list-disc pl-5">
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">Annuler</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full py-2 text-sm font-semibold">Soumettre</button>
        </div>
      </div>
    </div>
  );
}

// Modale fiche descriptive du service vendu
function SoldServiceModal({ order, onClose }) {
  if (!order) return null;

  const svcSnapshot = order.serviceSnapshot || order.service_snapshot || order.service || {};
  const service = {
    ...svcSnapshot,
    provider: svcSnapshot.provider || order.proSnapshot || order.pro || {},
    price_ttc: svcSnapshot.priceTTC ?? svcSnapshot.price_ttc ?? order.totalPriceTTC ?? order.total ?? 0,
    city: svcSnapshot.city || order.service?.city || undefined,
    radiusKm: svcSnapshot.radiusKm ?? svcSnapshot.radius,
    delivery_time: svcSnapshot.delivery_time || svcSnapshot.deliveryTime,
    quantity: svcSnapshot.quantity ?? order.quantity,
  };

  const extraContent = order.status === 'delivered_by_pro' ? (
    <div className="rounded-2xl border border-gray-100 bg-[#f7f2fc] p-4">
      <h3 className="text-sm font-bold text-[#47525E] mb-2">Prestation livrée</h3>
      <p className="text-[13px] text-gray-700 mb-2">
        Date de livraison : <strong>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('fr-FR') : 'Non renseignée'}</strong>
      </p>
      {order.attachments && order.attachments.length > 0 ? (
        <div>
          <p className="text-[13px] text-gray-700 mb-2">Pièces jointes :</p>
          <ul className="list-disc ml-5 space-y-1 text-[13px] text-[#47525E]">
            {order.attachments.map((file, idx) => (
              <li key={idx}>
                <a href={file.url} target="_blank" rel="noreferrer" className="text-[#976DD0] underline">{file.name || file.url}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[13px] text-gray-500">Aucune pièce jointe fournie.</p>
      )}
    </div>
  ) : null;

  return <ServiceModal svc={service} lang="fr" onClose={onClose} hideActions extraContent={extraContent} />;
}

// Modal pour traiter une demande d'annulation côté pro
function ProCancelReviewModal({ order, onClose, onAccept, onReject }) {
  if (!order) return null;
  const req = order.cancellationRequest || {};
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#47525E]">Demande d'annulation</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <div className="text-[13px] text-gray-700 mb-3">
          <div className="mb-2"><strong>Motif client:</strong></div>
          <div className="whitespace-pre-line rounded border border-gray-100 p-3 text-sm text-gray-600">{req.reason || '-'}</div>
          <div className="text-[12px] text-gray-400 mt-3">Demande envoyée: {req.createdAt ? new Date(req.createdAt).toLocaleString('fr-FR') : '-'}</div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onReject} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">Refuser</button>
          <button onClick={onAccept} className="flex-1 bg-[#D14343] text-white rounded-full py-2 text-sm">Accepter et rembourser</button>
        </div>
      </div>
    </div>
  );
}

// Modal to create a cancellation request from the pro
function ProCancelRequestModal({ order, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  if (!order) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#47525E]">Demande d'annulation (prestataire)</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <p className="text-[13px] text-gray-600 mb-3">Indiquez le motif de la demande d'annulation qui sera envoyé au client.</p>
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

export default function SoldServices() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [submitOrder, setSubmitOrder] = useState(null);
  const [incidentOrder, setIncidentOrder] = useState(null);
  const [cancelReviewOrder, setCancelReviewOrder] = useState(null);
  const [proCancelOrder, setProCancelOrder] = useState(null);

  const BADGE_BASE = 'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold w-[112px] whitespace-nowrap';
  // Unique, harmonious pastel palette (no duplicates between status and payment badges)
  const STATUS_BADGE = {
    'En cours': `bg-teal-500 text-white ${BADGE_BASE}`,
    'Terminé': `bg-violet-200 text-black ${BADGE_BASE}`,
    'Annulé': `bg-rose-200 text-black ${BADGE_BASE}`,
    'Annulation demandée': `bg-black text-white ${BADGE_BASE}`,
  };
  const PAYMENT_BADGE = { paid: `bg-slate-200 text-black ${BADGE_BASE}`, pending: `bg-stone-200 text-black ${BADGE_BASE}`, refunded: `bg-pink-100 text-black ${BADGE_BASE}` };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    if (process.env.REACT_APP_DEBUG_MOCK_USER === 'true') {
      setOrders(MOCK_PRO_ORDERS);
      setLoading(false);
      return;
    }
    try {
      const res = await getProOrders();
      setOrders(res?.orders || []);
    } catch (e) { setOrders([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Real-time WebSocket listeners
  useEffect(() => {
    const socket = io();
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
    return () => { socket.disconnect(); };
  }, []);

  const handleSubmit = async ({ message, files }) => {
    let uploaded = [];
    if (files && files.length > 0) {
      try {
        const res = await uploadFiles(files);
        uploaded = res.files || [];
      } catch (e) {
        alert('Erreur lors de l\'upload des fichiers');
        return;
      }
    }
    await deliverOrder(submitOrder._id, { message, attachments: uploaded });
    fetchOrders();
  };

  return (
    <PageLayout>
      <div className="bg-[#f3f5f9] min-h-full py-[22px] px-[22px] pb-24">
        <div className="max-w-[1120px] mx-auto">
          <h1 className="text-xl font-bold text-[#47525E] mb-4">Services vendus</h1>
          <button onClick={fetchOrders} className="text-[13px] border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 text-[#47525E] mb-4">↺ Actualiser</button>
          {loading ? (
            <div className="text-center py-20 text-gray-400">Chargement…</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Aucun service vendu.</div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-[12px] text-gray-400 font-medium">
                    <th className="text-left py-2 px-3">Date vente</th>
                    <th className="text-left py-2 px-3">Service</th>
                    <th className="text-left py-2 px-3">Bien concerné</th>
                    <th className="text-left py-2 px-3">Client</th>
                    <th className="text-left py-2 px-3">N° Commande</th>
                    <th className="text-left py-2 px-3">Prix</th>
                    <th className="text-left py-2 px-3">Statut service</th>
                    <th className="text-left py-2 px-3">Date livraison</th>
                    <th className="text-left py-2 px-3">Paiement</th>
                    <th className="text-left py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const svc = order.service_snapshot || order.service || {};
                    const client = order.client || {};
                    const dateVente = order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : '-';
                    const dateLivraison = order.delivery_date || order.deliveredAt ? new Date(order.delivery_date || order.deliveredAt).toLocaleDateString('fr-FR') : '-';
                    const num = `#${(order._id || '').slice(-5).toUpperCase() || '00123'}`;
                    const price = `${order.totalTTC || order.total || 0} € TTC`;
                    const STATUS_LABEL = {
                      pending_payment: 'En cours',
                      paid: 'En cours',
                      accepted_by_pro: 'En cours',
                      delivered_by_pro: 'Terminé',
                      confirmed_by_buyer: 'Terminé',
                      cancelled: 'Annulé',
                      refunded: 'Annulé',
                      litigation_opened: 'En cours',
                      cancellation_requested: 'Annulation demandée',
                    };
                    const statusLabel = STATUS_LABEL[order.status] || 'En cours';
                    const paymentLabel = order.payment_status === 'paid' ? 'Payé' : 'En attente';
                    // Affichage du sticker Incident si incident signalé
                    const hasIncident = !!order.incident;
                    return (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50/50 text-[13px] text-[#47525E]">
                        <td className="py-3 px-3 whitespace-nowrap">{dateVente}</td>
                        <td className="py-3 px-3 flex items-center gap-2">
                          {svc.title_fr || svc.title_en || svc.title || '-'}
                          {hasIncident && <span className="ml-2 bg-[#D14343] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Incident</span>}
                        </td>
                        <td className="py-3 px-3">{order.property?.title || '-'}</td>
                        <td className="py-3 px-3">{client.name || '-'}</td>
                        <td className="py-3 px-3 whitespace-nowrap font-medium">{num}</td>
                        <td className="py-3 px-3 whitespace-nowrap">{price}</td>
                        <td className="py-3 px-3">{
                          (() => {
                            const cls = STATUS_BADGE[statusLabel] || `bg-gray-50 text-black ${BADGE_BASE}`;
                            return <span className={cls}>{statusLabel}</span>;
                          })()
                        }</td>
                        <td className="py-3 px-3 whitespace-nowrap">{dateLivraison}</td>
                        <td className="py-3 px-3">{
                          (() => {
                            const key = order.payment_status || (paymentLabel === 'En attente' ? 'pending' : 'paid');
                            const cls = PAYMENT_BADGE[key] || `bg-gray-50 text-black ${BADGE_BASE}`;
                            return <span className={cls}>{paymentLabel}</span>;
                          })()
                        }</td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-0.5 text-[12px]">
                            <button onClick={() => setSubmitOrder(order)} className="text-[#976DD0] font-bold hover:underline text-left">Soumettre</button>
                            <button onClick={() => setViewOrder(order)} className="text-[#47525E] font-bold hover:text-[#976DD0] text-left">Voir</button>
                            {!(order.status === 'cancellation_requested' || order.status === 'cancelled' || order.status === 'refunded' || order.status === 'delivered_by_pro' || order.status === 'confirmed_by_buyer') && (
                              <button onClick={() => setProCancelOrder(order)} className="text-black font-bold hover:underline text-left">Annuler</button>
                            )}
                            {order.status === 'cancellation_requested' && (
                              <button onClick={() => setCancelReviewOrder(order)} className="text-black font-bold hover:underline text-left">Répondre</button>
                            )}
                            <button onClick={() => setIncidentOrder(order)} className="text-black font-bold hover:underline text-left whitespace-nowrap">Problème ?</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {submitOrder && <SubmitWorkModal order={submitOrder} onClose={() => setSubmitOrder(null)} onSubmit={handleSubmit} />}
      {viewOrder && <SoldServiceModal order={viewOrder} onClose={() => setViewOrder(null)} />}
      {incidentOrder && <IncidentModal order={incidentOrder} onClose={() => setIncidentOrder(null)} onSubmit={async ({ description }) => {
        // Appel backend pour ouvrir un litige côté pro
        await openLitigationPro(incidentOrder._id, description);
        // Marquer l'incident côté UI (mock)
        setOrders(orders => orders.map(o => o._id === incidentOrder._id ? { ...o, incident: { description } } : o));
      }} />}
      {proCancelOrder && (
        <ProCancelRequestModal order={proCancelOrder} onClose={() => setProCancelOrder(null)} onSubmit={async ({ reason }) => {
            try {
            await proRequestCancellation(proCancelOrder._id, { reason });
            try { socket.emit('cancellation_requested', { orderId: proCancelOrder._id, request: { reason, createdAt: new Date().toISOString(), by: 'pro', previousStatus: proCancelOrder.status } }); toast.success('Demande d\'annulation envoyée au client'); } catch (e) {}
          } catch (e) { console.warn(e); }
          // optimistic UI: mark as cancellation_requested
          setOrders(prev => prev.map(o => o._id === proCancelOrder._id ? { ...o, status: 'cancellation_requested', cancellationRequest: { reason, createdAt: new Date().toISOString(), by: 'pro', previousStatus: proCancelOrder.status } } : o));
          setProCancelOrder(null);
        }} />
      )}
      {cancelReviewOrder && (
        <ProCancelReviewModal order={cancelReviewOrder} onClose={() => setCancelReviewOrder(null)} onAccept={async () => {
          try {
            // If the cancellation request was initiated by the pro locally, call API with by='pro'
            if (cancelReviewOrder.cancellationRequest?.by === 'pro') {
              try { await acceptCancellation(cancelReviewOrder._id); } catch (e) { console.warn(e); }
            } else {
              try { await acceptCancellation(cancelReviewOrder._id); } catch (e) { console.warn(e); }
            }
          } catch (e) { console.warn(e); }
          // optimistic update: mark cancelled
          setOrders(prev => prev.map(o => o._id === cancelReviewOrder._id ? { ...o, status: 'cancelled' } : o));
          try { socket.emit('cancellation_accepted', { orderId: cancelReviewOrder._id, request: cancelReviewOrder.cancellationRequest || {} }); toast.success('Annulation acceptée — remboursement déclenché'); } catch (e) {}
          setCancelReviewOrder(null);
        }} onReject={async () => {
          try {
            try { await rejectCancellation(cancelReviewOrder._id); } catch (e) { console.warn(e); }
          } catch (e) { console.warn(e); }
          // optimistic: revert to previous status if available
          setOrders(prev => prev.map(o => o._id === cancelReviewOrder._id ? { ...o, status: o.cancellationRequest?.previousStatus || 'accepted_by_pro' } : o));
          try { socket.emit('cancellation_rejected', { orderId: cancelReviewOrder._id, request: cancelReviewOrder.cancellationRequest || {} }); toast.info('Annulation refusée'); } catch (e) {}
          setCancelReviewOrder(null);
        }} />
      )}
    </PageLayout>
  );
}
