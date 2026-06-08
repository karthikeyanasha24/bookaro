import React, { useState, useEffect } from 'react';
import MarketplaceApi from '../../methods/api/marketplaceApi';

function Stars({ value = 5, size = 13 }) {
  return (
    <span style={{ fontSize: size }}>
      {'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}
    </span>
  );
}

/**
 * Modale de visualisation d'un service côté admin.
 * Identique à ServiceModal (marketplace pro) mais sans actions et
 * avec le texte d4 "Facturation et paiement" centralisé depuis les settings admin.
 */
export default function ServiceDetailModal({ svc, onClose, extraFooter = null }) {
  const [paymentInfo, setPaymentInfo] = useState('');

  useEffect(() => {
    MarketplaceApi.getMarketplaceSettings()
      .then(r => {
        if (r?.success) setPaymentInfo(r.data?.paymentInfo || '');
      })
      .catch(() => {});
  }, []);

  if (!svc) return null;

  const title = svc.title_fr || svc.title || '—';
  const description = svc.description || '';
  const summary = svc.summary || '';
  const d1 = svc.d1 || '';
  const price = svc.priceTTC ?? svc.price_ttc ?? 0;
  const provName = svc.pro?.name || svc.pro?.firstName || svc.pro?.email || '—';
  const provCity = svc.pro?.city || svc.city || '—';
  const modality = svc.modality || 'Présentiel';
  const zone = svc.city || '—';
  const rayon = svc.radiusKm ? `${svc.radiusKm} km` : '—';
  const qty = svc.quantity ? `${svc.quantity}` : '—';
  const deliveryTime = svc.delivery_time || 'Variable';
  const categoryName = svc.category?.name || '—';

  const sections = [
    { icon: '💡', title: "Qu'est-ce que ce service va vous apporter ?", text: d1 || description },
    { icon: '📋', title: 'Description du service rendu', text: description },
    { icon: '✅', title: 'Ce que vous obtiendrez', text: summary },
    { icon: '🔒', title: 'Facturation et paiement : votre argent est en sécurité', text: paymentInfo },
  ];

  const serviceDetails = [
    { icon: '🏷️', label: 'Catégorie', value: categoryName },
    { icon: '⊙', label: 'Modalité', value: modality },
    { icon: '📍', label: 'Zone', value: zone },
    { icon: '📏', label: 'Rayon', value: rayon },
    { icon: '#', label: 'Quantité', value: qty },
    { icon: '⏱️', label: 'Délai', value: deliveryTime },
  ];

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-[13px] font-semibold text-[#47525E]">Détail du service</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[72vh] space-y-5">

          {/* Titre */}
          <h2 className="text-xl font-bold text-[#47525E]">{title}</h2>

          {/* Section pro */}
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-3">Présentation du professionnel</h3>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {provName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#47525E] text-sm">{provName}</p>
                <p className="text-xs text-gray-400 mb-1">{svc.pro?.role || 'Professionnel'} • {provCity}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
                  <span className="flex items-center gap-0.5"><Stars value={5} size={11} /> 5/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Détails du service */}
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-2">Présentation du service</h3>
            <div className="flex flex-wrap gap-2">
              {serviceDetails.map((s, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-[#F2ECF8] text-[#976DD0] text-[11px] font-medium px-3 py-1 rounded-full">
                  <span>{s.icon}</span>
                  <span>{s.label}: {s.value}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Sections de description */}
          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-[#976DD0] rounded-lg flex items-center justify-center text-white text-lg shrink-0">{s.icon}</div>
                <div>
                  <p className="text-[12px] font-bold text-[#47525E] mb-1">{s.title}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{s.text || '—'}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer — prix, actions optionnelles */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div>{extraFooter}</div>
          <div className="flex items-center gap-3">
            {price > 0 ? (
              <span className="font-bold text-[#47525E] text-sm">{price} € T.T.C</span>
            ) : (
              <span className="flex items-center gap-2 text-sm text-gray-400 font-semibold">
                <span className="line-through">0 € T.T.C</span>
                <span className="rounded-full bg-[#F3E8FF] px-2 py-1 text-[#6D28D9]">Offert</span>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
