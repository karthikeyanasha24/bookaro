import React, { useState, useEffect, useCallback } from 'react';
import { getProOrders, deliverOrder, openLitigation } from '../../methods/api/marketplaceApi';
import { MOCK_PRO_ORDERS } from '../../mocks/marketplaceOrders.mock';
import { uploadFiles } from '../../methods/api/upload';
import PageLayout from '../../components/global/PageLayout';

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
  const svc = order.service_snapshot || order.service || {};
  const client = order.client || {};
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4 flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="font-bold text-[#47525E] text-base">{svc.title_fr || svc.title_en || svc.title || 'Service'}</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[72vh] space-y-6">
          {/* Bien concerné */}
          {order.property && (
            <div className="mb-2">
              <h3 className="text-sm font-bold text-[#47525E] mb-1">Bien concerné</h3>
              <div className="text-[13px] text-gray-700">{order.property.title || '-'}</div>
            </div>
          )}
          {/* Présentation du service */}
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-1">Présentation du service</h3>
            <div className="text-[13px] text-gray-700 mb-2">{svc.section_service || svc.title_fr || svc.title_en || svc.title || '-'}</div>
          </div>
          {/* Qu'est-ce que ce service va vous apporter */}
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-1">Qu'est-ce que ce service va vous apporter ?</h3>
            <div className="text-[13px] text-gray-700 mb-2">{svc.section_benefit_text || '-'}</div>
          </div>
          {/* Description du service rendu */}
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-1">Description du service rendu</h3>
            <div className="text-[13px] text-gray-700 mb-2">{svc.section_description_text || '-'}</div>
          </div>
          {/* Ce que vous obtiendrez */}
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-1">Ce que vous obtiendrez</h3>
            <div className="text-[13px] text-gray-700 mb-2">{svc.section_deliverable_text || '-'}</div>
          </div>
          {/* Facturation */}
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-1">Facturation</h3>
            <div className="text-[13px] text-gray-700 mb-2">{svc.section_billing_text || '-'}</div>
          </div>
          {/* Infos complémentaires */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-[#F2ECF8] text-[#976DD0] text-[11px] font-medium px-3 py-1 rounded-full">Prix: {svc.price_ttc ?? svc.price ?? order.totalTTC ?? order.total ?? '-'} €</span>
            {svc.zone_covered && <span className="bg-[#F2ECF8] text-[#976DD0] text-[11px] font-medium px-3 py-1 rounded-full">{svc.zone_covered}</span>}
            {svc.tarification_type && <span className="bg-[#F2ECF8] text-[#976DD0] text-[11px] font-medium px-3 py-1 rounded-full">{svc.tarification_type}</span>}
          </div>
          {/* Client */}
          <div className="mt-4">
            <h3 className="text-sm font-bold text-[#47525E] mb-1">Client</h3>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {client.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#47525E] text-sm">{client.name || '-'}</p>
                <p className="text-xs text-gray-400 mb-1">{client.email || '-'}</p>
              </div>
            </div>
          </div>
          {/* Section Service finalisé */}
          {order.status === 'delivered_by_pro' && order.attachments && order.attachments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-[#47525E] mb-1">Service finalisé</h3>
              <ul className="list-disc ml-5">
                {order.attachments.map((file, idx) => (
                  <li key={idx}><a href={file.url} target="_blank" rel="noopener noreferrer" className="text-[#976DD0] underline">{file.name}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

export default function SoldServices() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [submitOrder, setSubmitOrder] = useState(null);
  const [incidentOrder, setIncidentOrder] = useState(null);
  const [cancelReviewOrder, setCancelReviewOrder] = useState(null);

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
                    const statusLabel = order.status === 'delivered_by_pro' ? 'Terminé' : 'En cours';
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
                        <td className="py-3 px-3">
                          {order.status === 'cancellation_requested' ? (
                            <button onClick={() => setCancelReviewOrder(order)} className="inline-block bg-red-100 text-red-600 text-[11px] font-bold px-3 py-1 rounded-full">Annulation demandée</button>
                          ) : (
                            statusLabel
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">{dateLivraison}</td>
                        <td className="py-3 px-3">{paymentLabel}</td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-0.5 text-[12px]">
                            <button onClick={() => setSubmitOrder(order)} className="text-[#976DD0] hover:underline text-left font-bold">Soumettre</button>
                            <button onClick={() => setViewOrder(order)} className="text-[#47525E] hover:text-[#976DD0] text-left font-bold">Voir</button>
                            {!(order.status === 'cancellation_requested' || order.status === 'cancelled' || order.status === 'refunded' || order.status === 'delivered_by_pro' || order.status === 'confirmed_by_buyer') && (
                              <button className="text-red-400 hover:underline text-left font-bold">Annuler</button>
                            )}
                            {order.status === 'cancellation_requested' && (
                              <button onClick={() => setCancelReviewOrder(order)} className="text-[12px] text-red-600 font-bold">Gérer annulation</button>
                            )}
                            <button onClick={() => setIncidentOrder(order)} className="text-[#D14343] hover:underline text-left font-bold">Problème ?</button>
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
        // Appel backend pour signaler l'incident
        await openLitigation(incidentOrder._id, description);
        // Marquer l'incident côté UI (mock)
        setOrders(orders => orders.map(o => o._id === incidentOrder._id ? { ...o, incident: { description } } : o));
      }} />}
      {cancelReviewOrder && (
        <ProCancelReviewModal order={cancelReviewOrder} onClose={() => setCancelReviewOrder(null)} onAccept={async () => {
          try {
            await fetch(`/api/marketplace/orders/${cancelReviewOrder._id}/cancellation/accept`, { method: 'POST' });
          } catch (e) { console.warn(e); }
          // optimistic update: mark cancelled
          setOrders(prev => prev.map(o => o._id === cancelReviewOrder._id ? { ...o, status: 'cancelled' } : o));
          setCancelReviewOrder(null);
        }} onReject={async () => {
          try {
            await fetch(`/api/marketplace/orders/${cancelReviewOrder._id}/cancellation/reject`, { method: 'POST' });
          } catch (e) { console.warn(e); }
          // optimistic: revert to previous status if available
          setOrders(prev => prev.map(o => o._id === cancelReviewOrder._id ? { ...o, status: o.cancellationRequest?.previousStatus || 'accepted_by_pro' } : o));
          setCancelReviewOrder(null);
        }} />
      )}
    </PageLayout>
  );
}
