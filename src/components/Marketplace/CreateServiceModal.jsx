import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import MarketplaceApi from '../../methods/api/marketplaceApi';
import CityAutocomplete from '../common/CityAutocomplete';

export default function CreateServiceModal({ service = null, onClose, onCreated }) {
  const isEdit = Boolean(service);
  const [form, setForm] = useState({
    category: '', service: 'Visites',
    title: '', zone: 'Lille', radius: '5', qty: '',
    price: '300', modality: 'Présentiel', deliveryTime: 'Variable', isFree: false,
    d1: '', d2: '', d3: '', d4: '',
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vatPercent, setVatPercent] = useState(20);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!service) return;
    const rawPriceTTC = service.priceTTC ?? service.price_ttc;
    const factor = 1 + (Number(vatPercent) || 0) / 100;
    const priceVal = rawPriceTTC ? Math.round((rawPriceTTC / factor) * 100) / 100 : 0;
    setForm({
      category: service.category?._id || service.category?.name_fr || service.category?.name || service.category || '',
      service: service.title || '',
      title: service.title || '',
      zone: service.city || '',
      radius: service.radiusKm?.toString() || '5',
      qty: service.quantity ? service.quantity.toString() : '',
      price: rawPriceTTC === 0 ? '0' : String(priceVal || ''),
      modality: service.modality || 'Présentiel',
      deliveryTime: service.delivery_time || 'Variable',
      isFree: rawPriceTTC === 0 || service.isFree || service.is_free || false,
      d1: service.d1 || '',
      d2: service.description || '',
      d3: service.summary || '',
      d4: service.d4 || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, vatPercent]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await MarketplaceApi.listCategories();
        const list = response.data || response.categories || response;
        const trans = [];
        const svcs = [];
        (list || []).forEach(c => {
          const label = c.label || c.name_fr || c.name || c.title;
          if (!label) return;
          const grp = c.group || c.type || (c.is_transaction ? 'Transaction' : 'Service');
          if (grp === 'Transaction') trans.push({ id: c._id, label });
          else svcs.push({ id: c._id, label });
        });
        if (!cancelled) {
          if (trans.length > 0) setTransactions(trans);
          if (svcs.length > 0) setServiceTypes(svcs);
          if (!form.category) {
            if (trans.length > 0) set('category', trans[0].id);
            else if (svcs.length > 0) set('category', svcs[0].id);
          }
        }
      } catch (e) { /* ignore */ }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await MarketplaceApi.getMarketplaceSettings();
        const v = r?.data?.vatPercent ?? r?.vatPercent ?? 20;
        if (!cancelled) setVatPercent(Number(v) || 20);
      } catch (e) { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async (draft = false) => {
    setLoading(true);
    try {
      const htPrice = Number(form.price || 0);
      const factor = 1 + (Number(vatPercent) || 0) / 100;
      const payload = {
        title: form.title,
        description: form.d2,
        summary: form.d3,
        price: Number(form.price || 0),
        is_free: Boolean(form.isFree),
        priceTTC: Math.round(htPrice * factor * 100) / 100,
        d4: form.d4,
        category: form.category,
        modality: form.modality,
        city: form.zone,
        radiusKm: Number(form.radius || 0),
        delivery_time: form.deliveryTime,
        imageUrls: [],
        draft,
      };
      const quantityValue = Number(String(form.qty || '').replace(/\D/g, ''));
      if (!Number.isNaN(quantityValue) && quantityValue > 0) payload.quantity = quantityValue;
      // Do not force priceTTC to 0 when service is marked as offered.
      // Keep `isFree` flag while sending the computed TTC to satisfy backend validation.
      if (isEdit && service?._id) {
        await MarketplaceApi.updateService(service._id, payload);
      } else {
        // Admin not expected to create pro services - fallback to update
        await MarketplaceApi.updateService(service?._id || '', payload);
      }
      toast.success(isEdit ? 'Service mis à jour' : 'Service créé');
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      try { toast.error(err.message || 'Erreur lors de la sauvegarde'); } catch (e) { }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!form.title.trim()) return false;
    if (!form.category.trim()) return false;
    if (!form.zone.trim()) return false;
    if (!form.radius.trim()) return false;
    if (!form.isFree && !String(form.price || '').trim()) return false;
    return true;
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#47525E] text-base">{isEdit ? 'Modifier le service' : 'Proposer un service'}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[72vh] space-y-5">
          <div>
            <p className="font-bold text-[#47525E] text-sm mb-3">Caractéristiques du service</p>
            <div className="mb-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                  <span className="text-[#976DD0]">⋙</span>
                  Titre du service
                  <span className="text-red-500">*</span>
                </label>
                <input value={form.title} onChange={e => set('title', e.target.value)} maxLength={60} placeholder={'Ex : Pack 10 visites accompagnées'} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0]" />
                <span className="text-[10px] text-gray-400 mt-0.5">{(form.title || '').length}/60</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="text-[11px] text-gray-500 font-medium">Catégorie</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-full">
                  {transactions.map(o => (
                    typeof o === 'string' ? (
                      <option key={o} value={o}>{o}</option>
                    ) : (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    )
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-[11px] text-gray-500 font-medium">Service</label>
                <select value={form.service} onChange={e => set('service', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-full">
                  {serviceTypes.map(o => (
                    typeof o === 'string' ? (
                      <option key={o} value={o}>{o}</option>
                    ) : (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    )
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-[11px] text-gray-500 font-medium">Modalité</label>
                <select value={form.modality} onChange={e => set('modality', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-full">
                  <option>Présentiel</option>
                  <option>À distance</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-[11px] text-gray-500 font-medium">Prix HT</label>
                {!form.isFree ? (
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <input value={form.price} onChange={e => set('price', e.target.value)} className="flex-1 px-3 py-2 text-[13px] focus:outline-none" placeholder="300" />
                    <span className="px-2 text-gray-400 text-sm">€</span>
                  </div>
                ) : (
                  <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg overflow-hidden px-3 py-2 text-[13px] text-[#976DD0] font-semibold">Offert</div>
                )}
                {!form.isFree && (<div className="text-[11px] text-gray-400 mt-1">Prix TTC: {Math.round((Number(form.price || 0) * (1 + (Number(vatPercent) || 0) / 100)) * 100) / 100} €</div>)}
              </div>

              <div className="col-span-2">
                <label className="text-[11px] text-gray-500 font-medium">Zone couverte</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <CityAutocomplete value={form.zone} onChange={(v) => set('zone', v)} onSelect={(p) => set('zone', p.city || p.formatted)} placeholder="Ville ou code postal" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px]" />
                  </div>
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 text-[12px] shrink-0">
                    <span className="text-gray-400">Rayon</span>
                    <input value={form.radius} onChange={e => set('radius', e.target.value)} className="w-10 text-[13px] focus:outline-none text-right" />
                    <span className="text-gray-400">km</span>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <label className="text-[11px] text-gray-500 font-medium">Quantité</label>
                <input value={form.qty} onChange={e => set('qty', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-full" placeholder="Pack 10 visites" />
              </div>

              <div className="col-span-2">
                <label className="text-[11px] text-gray-500 font-medium">Délai de délivrance</label>
                <select value={form.deliveryTime} onChange={e => set('deliveryTime', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-full">
                  {['Variable', '1 jour', '2 jours', '3 jours', '4 jours', '5 jours', '6 jours', '7 jours', '8 jours', '9 jours', '10 jours'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

            </div>

            <label className="mt-3 flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={e => set('isFree', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#976DD0]"
              />
              <span>
                <span className="text-[13px] font-semibold text-[#47525E]">Service offert</span>
                <span className="block text-[11px] text-gray-400">Coché : votre service est proposé gratuitement, le client effectue une réservation sans paiement.</span>
              </span>
            </label>

          </div>

          <div>
            <p className="font-bold text-[#47525E] text-sm mb-3">Présentation du service</p>
            <div className="space-y-3">
              {[
                { icon:'💡', label: "Qu'est-ce que ce service va vous apporter ?", key:'d1' },
                { icon:'📋', label: 'Description du service rendu', key:'d2' },
                { icon:'✅', label: 'Ce que vous obtiendrez', key:'d3' },
              ].map(({ icon, label, key }) => (
                <div key={key} className="border border-gray-200 rounded-xl p-3 flex gap-3">
                  <div className="w-9 h-9 bg-[#976DD0] rounded-lg flex items-center justify-center text-white shrink-0">{icon}</div>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-[#47525E] mb-1">
                      {label}
                      <span className="text-red-500">*</span>
                    </p>
                    <textarea rows={2} className="w-full text-[12px] text-gray-500 focus:outline-none resize-none" value={form[key]} onChange={e => set(key, e.target.value)} placeholder={label} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} disabled={loading} className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm text-[#47525E] hover:bg-gray-50">Annuler</button>
          <button onClick={() => handleSave(true)} disabled={loading} className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm text-[#47525E] hover:bg-gray-50">Enregistrer brouillon</button>
          <button onClick={() => handleSave(false)} disabled={loading || !isFormValid()} className={`flex-1 rounded-full py-2.5 text-sm font-semibold ${loading || !isFormValid() ? 'bg-gray-300 text-gray-500' : 'bg-[#976DD0] hover:bg-[#7d55b5] text-white'}`}>{isEdit ? 'Enregistrer' : 'Créer et activer'}</button>
        </div>
      </div>
    </div>
  );
}
