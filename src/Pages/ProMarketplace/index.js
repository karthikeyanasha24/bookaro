import React, { useState, useEffect, useCallback } from 'react';
import { FaCalendarDays } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { createProService, updateProService, deleteProService, getProServices, acceptOrder, deliverOrder, getStripeStatus, startStripeOnboard, getCategories } from '../../methods/api/marketplaceApi';
import PageLayout from '../../components/global/PageLayout';
import CityAutocomplete from '../../components/common/CityAutocomplete';
import { ServiceModal } from '../Marketplace';

const InputRow = ({ label, required = false, children, className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
      <span className="text-[#976DD0]">⋙</span>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

/* ─── Traductions ── */
const T = {
  fr: {
    title: 'Gestion de mes services à la demande',
    sub: 'Aide les membres à trouver et commander des services à la carte',
    addBtn: '+ Ajouter un service',
    tabs: { services: 'Mes services', orders: 'Suivi des services vendus' },
    countSvc: (n) => `Vous avez ${n} service${n > 1 ? 's' : ''} actif${n > 1 ? 's' : ''}`,
    countOrders: (n) => `Vous avez ${n} service${n > 1 ? 's' : ''} vendu${n > 1 ? 's' : ''}`,
    svcTable: { date:'Date création', cat:'Catégorie', svc:'Service', price:'Prix TTC', orders:'Commande', ca:'Total CA', status:'Statut' },
    actions: { activate:'Activer', deactivate:'Désactiver', see:'Voir', edit:'Modifier', delete:'Supprimer', accept:'Accepter', deliver:'Terminer service', approve:'Approuver' },
    statusLabels: { active:'Actif', inactive:'Inactif', draft:'Brouillon', pending:'En attente' },
    orderTabs: { all:'Tous', inprogress:'En cours', done:'Terminé', cancelled:'Annulé' },
    orderTable: { date:'Date vente', svc:'Service', bien:'Bien concerné', client:'Client', num:'N° Commande', price:'Prix', status:'Statut service', delivery:'Date livraison', payment:'Paiement' },
    orderStatus: { paid:'En cours', accepted_by_pro:'En cours', delivered_by_pro:'Terminé', confirmed_by_buyer:'Terminé', cancelled:'Annulé', refunded:'Annulé' },
    payment: { pending:'En attente', paid:'Payé' },
    loading: 'Chargement…',
    empty: 'Aucun service.',
    emptyOrders: 'Aucune commande.',
    noDate: '-',
    switchLang: 'EN',
    refresh: '↺',
    // Modal création
    modalTitle: 'Proposer un service',
    charTitle: 'Caractéristiques du service',
    svcTitle: 'Titre du service',
    svcTitlePh: 'Ex : Pack 10 visites accompagnées',
    cat: 'Catégorie',
    svcName: 'Service',
    modality: 'Modalité',
    zone: 'Zone couverte',
    radius: 'Rayon',
    qty: 'Quantité',
    priceHT: 'Prix HT',
    priceTTC: 'Prix TTC',
    delivery: 'Délai de délivrance',
    email: 'Email',
    descTitle: 'Présentation du service',
    d1: "Qu'est-ce que ce service va vous apporter ?",
    d2: 'Description du service rendu',
    d3: 'Ce que vous obtiendrez',
    d4: 'Facturation et paiement : votre argent est en sécurité',
    saveDraft: 'Enregistrer brouillon',
    activate: 'Créer et activer',
    cancel: 'Annuler',
    freeService: 'Service offert',
    freeServiceHint: "Coché : votre service est proposé gratuitement, le client effectue une réservation sans paiement.",
  },
  en: {
    title: 'Manage my on-demand services',
    sub: 'Help members find and book services on demand',
    addBtn: '+ Add a service',
    tabs: { services: 'My services', orders: 'Track sold services' },
    countSvc: (n) => `You have ${n} active service${n > 1 ? 's' : ''}`,
    countOrders: (n) => `You have ${n} sold service${n > 1 ? 's' : ''}`,
    svcTable: { date:'Created', cat:'Category', svc:'Service', price:'Taxed price', orders:'Orders', ca:'Total revenue', status:'Status' },
    actions: { activate:'Activate', deactivate:'Deactivate', see:'View', edit:'Edit', delete:'Delete', accept:'Accept', deliver:'Mark delivered', approve:'Approve' },
    statusLabels: { active:'Active', inactive:'Inactive', draft:'Draft', pending:'Pending' },
    orderTabs: { all:'All', inprogress:'In progress', done:'Completed', cancelled:'Cancelled' },
    orderTable: { date:'Sale date', svc:'Service', bien:'Property', client:'Client', num:'Order #', price:'Price', status:'Status', delivery:'Delivery date', payment:'Payment' },
    orderStatus: { paid:'In progress', accepted_by_pro:'In progress', delivered_by_pro:'Completed', confirmed_by_buyer:'Completed', cancelled:'Cancelled', refunded:'Cancelled' },
    payment: { pending:'Pending', paid:'Paid' },
    loading: 'Loading…',
    empty: 'No services.',
    emptyOrders: 'No orders.',
    noDate: '-',
    switchLang: 'FR',
    refresh: '↺',
    modalTitle: 'Offer a service',
    charTitle: 'Service characteristics',
    svcTitle: 'Service title',
    svcTitlePh: 'E.g. 10-visit accompanied pack',
    cat: 'Category',
    subcat: 'Sub-category',
    svcName: 'Service',
    tarif: 'Pricing type',
    modality: 'Modality',
    zone: 'Coverage area',
    radius: 'Radius',
    qty: 'Quantity',
    price: 'Price',
    svcType: 'Modality',
    email: 'Email',
    descTitle: 'Service description',
    d1: 'What will this service bring?',
    d2: 'Description of the service',
    d3: 'What the client will get',
    d4: 'Billing & payment: funds are secure',
    saveDraft: 'Save draft',
    activate: 'Create and activate',
    cancel: 'Cancel',
    freeService: 'Free service',
    freeServiceHint: 'Checked: your service is offered for free; the client books it without payment.',
  },
};

const SVC_STATUS_STYLE = {
  active: 'text-[#389D93] font-semibold',
  inactive: 'text-orange-500 font-semibold',
  draft: 'text-gray-400 font-semibold',
  pending: 'text-yellow-600 font-semibold',
};
const ORD_STATUS_STYLE = {
  'En cours': 'text-[#389D93]',
  'In progress': 'text-[#389D93]',
  'Terminé': 'text-[#47525E]',
  'Completed': 'text-[#47525E]',
  'Annulé': 'text-red-400',
  'Cancelled': 'text-red-400',
};

/* ─── Modal création service (image 2) ── */
const DEFAULT_TRANSACTIONS = ['Acheter', 'Vendre', 'Louer', 'Gérer'];
const DEFAULT_SERVICES = ['Visites', 'Estimation', 'Négociation', 'Recherche de bien', 'Analyse acheteur', 'Prise de photo', 'Dossier vendeur', 'Recherche de financement', 'Visite virtuelle'];


function CreateServiceModal({ lang, service = null, onClose, onCreated }) {
  const t = T[lang];
  const isEdit = Boolean(service);
  const user = useSelector(state => state.user);
  const [transactions, setTransactions] = useState(DEFAULT_TRANSACTIONS);
  const [serviceTypes, setServiceTypes] = useState(DEFAULT_SERVICES);
  const [form, setForm] = useState({
    category: 'Acheter', service: 'Visites',
    title: '', zone: 'Lille', radius: '5', qty: '',
    price: '300', modality: 'Présentiel', deliveryTime: 'Variable', isFree: false,
    d1: '', d2: '', d3: '', d4: '',
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!service) return;
    const priceVal = service.price_ttc ? Math.round((service.price_ttc / 1.2) * 100) / 100 : 0;
    setForm({
      category: service.category?.name_fr || service.category?.name || form.category,
      service: service.title_fr || service.title || form.service,
      title: service.title_fr || service.title || '',
      zone: service.city || form.zone,
      radius: service.radiusKm?.toString() || form.radius,
      qty: service.quantity ? service.quantity.toString() : '',
      price: service.price_ttc === 0 ? '0' : priceVal.toString(),
      modality: service.modality || service.type || 'Présentiel',
      deliveryTime: service.delivery_time || 'Variable',
      isFree: service.price_ttc === 0 || service.is_free,
      d1: service.summary || '',
      d2: service.description || '',
      d3: service.d3 || '',
      d4: service.d4 || '',
    });
  }, [service]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getCategories(lang);
        const list = res?.categories || res?.data || res;
        if (!cancelled && Array.isArray(list) && list.length > 0) {
          const trans = [];
          const svcs = [];
          list.forEach(c => {
            const label = c.label || c.name_fr || c.name || c.title;
            if (!label) return;
            const grp = c.group || c.type || (c.is_transaction ? 'Transaction' : 'Service');
            if (grp === 'Transaction') trans.push(label);
            else svcs.push(label);
          });
          if (trans.length > 0) setTransactions(trans);
          if (svcs.length > 0) setServiceTypes(svcs);
        }
      } catch { /* fallback */ }
    })();
    return () => { cancelled = true; };
  }, [lang]);

  const handleSave = async (draft = false) => {
    setLoading(true);
    try {
      const htPrice = Number(form.price || 0);
      const payload = {
        title: form.title,
        description: form.d2,
        summary: form.d3,
        category: form.category,
        modality: form.modality,
        priceTTC: form.isFree ? 0 : Math.round(htPrice * 1.2 * 100) / 100,
        city: form.zone,
        radiusKm: Number(form.radius || 0),
        delivery_time: form.deliveryTime,
        imageUrls: [],
      };
      const quantityValue = Number(form.qty?.replace(/\D/g, ''));
      if (!Number.isNaN(quantityValue) && quantityValue > 0) {
        payload.quantity = quantityValue;
      }
      if (form.isFree) {
        payload.priceTTC = 0;
      }
      if (isEdit && service?._id) {
        await updateProService(service._id, payload, lang);
      } else {
        await createProService(payload, lang);
      }
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!form.title.trim()) return false;
    if (!form.category.trim()) return false;
    if (!form.service.trim()) return false;
    if (!form.zone.trim()) return false;
    if (!form.radius.trim()) return false;
    if (!form.d1.trim() || !form.d2.trim() || !form.d3.trim() || !form.d4.trim()) return false;
    if (!form.isFree && !form.price.trim()) return false;
    return true;
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#47525E] text-base">{t.modalTitle}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[72vh] space-y-5">
          {/* Caractéristiques */}
          <div>
            <p className="font-bold text-[#47525E] text-sm mb-3">{t.charTitle}</p>
            <div className="mb-3">
              <InputRow label={t.svcTitle} required>
                <input value={form.title} onChange={e => set('title', e.target.value)} maxLength={60} placeholder={t.svcTitlePh} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0]" />
                <span className="text-[10px] text-gray-400 mt-0.5">{(form.title || '').length}/60</span>
              </InputRow>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputRow label={t.cat} required>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0]">
                  {transactions.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputRow>
              <InputRow label={t.svcName} required>
                <select value={form.service} onChange={e => set('service', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0]">
                  {serviceTypes.map(o => <option key={o}>{o}</option>)}
                </select>
              </InputRow>
              <InputRow label={t.modality} required>
                <select value={form.modality} onChange={e => set('modality', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0] w-full">
                  <option>Présentiel</option>
                  <option>À distance</option>
                </select>
              </InputRow>
              <InputRow label={t.priceHT} required>
                {form.isFree ? (
                  <div className="flex items-center border border-gray-200 bg-gray-50 rounded-lg overflow-hidden px-3 py-2 text-[13px] text-[#976DD0] font-semibold">
                    {lang === 'fr' ? 'Offert' : 'Free'}
                  </div>
                ) : (
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <input value={form.price} onChange={e => set('price', e.target.value)} className="flex-1 px-3 py-2 text-[13px] focus:outline-none" placeholder="300" />
                    <span className="px-2 text-gray-400 text-sm">€</span>
                  </div>
                )}
                {!form.isFree && (
                  <div className="text-[11px] text-gray-400 mt-1">{t.priceTTC}: {Math.round((Number(form.price || 0) * 1.2) * 100) / 100} €</div>
                )}
              </InputRow>
              <InputRow label={t.zone} required className="col-span-2">
                <div className="flex gap-2">
                  <div className="flex-1 min-w-0">
                    <CityAutocomplete
                      value={form.zone}
                      onChange={(v) => set('zone', v)}
                      onSelect={(p) => set('zone', p.city || p.formatted)}
                      placeholder="Ville ou code postal"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0]"
                    />
                  </div>
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 text-[12px] shrink-0">
                    <span className="text-gray-400">{t.radius}</span>
                    <input value={form.radius} onChange={e => set('radius', e.target.value)} className="w-10 text-[13px] focus:outline-none text-right" />
                    <span className="text-gray-400">km</span>
                  </div>
                </div>
              </InputRow>
              <InputRow label={t.qty} className="col-span-1">
                <input value={form.qty} onChange={e => set('qty', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0]" placeholder="Pack 10 visites" />
              </InputRow>
              <InputRow label={t.delivery} className="col-span-2">
                <select value={form.deliveryTime} onChange={e => set('deliveryTime', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0] w-full">
                  {['Variable', '1 jour', '2 jours', '3 jours', '4 jours', '5 jours', '6 jours', '7 jours', '8 jours', '9 jours', '10 jours'].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </InputRow>
            </div>
            {/* Service offert */}
            <label className="mt-3 flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={e => set('isFree', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#976DD0]"
              />
              <span>
                <span className="text-[13px] font-semibold text-[#47525E]">{t.freeService}</span>
                <span className="block text-[11px] text-gray-400">{t.freeServiceHint}</span>
              </span>
            </label>
          </div>

          {/* Présentation */}
          <div>
            <p className="font-bold text-[#47525E] text-sm mb-3">{t.descTitle}</p>
            <div className="space-y-3">
              {[
                { icon:'💡', label: t.d1, key:'d1' },
                { icon:'📋', label: t.d2, key:'d2' },
                { icon:'✅', label: t.d3, key:'d3' },
                { icon:'🔒', label: t.d4, key:'d4' },
              ].map(({ icon, label, key }) => (
                <div key={key} className="border border-gray-200 rounded-xl p-3 flex gap-3">
                  <div className="w-9 h-9 bg-[#976DD0] rounded-lg flex items-center justify-center text-white shrink-0">{icon}</div>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-[#47525E] mb-1">
                      {label}
                      <span className="text-red-500">*</span>
                    </p>
                    <textarea
                      rows={2}
                      className="w-full text-[12px] text-gray-500 focus:outline-none resize-none"
                      value={form[key]}
                      onChange={e => set(key, e.target.value)}
                      placeholder={label}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} disabled={loading} className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm text-[#47525E] hover:bg-gray-50">
            {t.cancel}
          </button>
          { !isEdit && (
            <button onClick={() => handleSave(true)} disabled={loading} className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm text-[#47525E] hover:bg-gray-50">
              {t.saveDraft}
            </button>
          )}
          <button
            onClick={() => handleSave(false)}
            disabled={loading || !isFormValid()}
            className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ${loading || !isFormValid() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#976DD0] hover:bg-[#7d55b5] text-white'}`}
          >
            {isEdit ? 'Modifier' : t.activate}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ─── Tableau services pro (image 3) ── */
function ServicesTab({ services, lang, onAdd, onAction, filter }) {
  const t = T[lang];
  const filteredCount = services.length;
  const filterLabel = filter === 'active'
    ? lang === 'fr' ? ` actif${filteredCount > 1 ? 's' : ''}` : ` active service${filteredCount > 1 ? 's' : ''}`
    : filter === 'inactive'
      ? lang === 'fr' ? ` inactif${filteredCount > 1 ? 's' : ''}` : ` inactive service${filteredCount > 1 ? 's' : ''}`
      : filter === 'draft'
        ? lang === 'fr' ? ` brouillon${filteredCount > 1 ? 's' : ''}` : ` draft service${filteredCount > 1 ? 's' : ''}`
        : '';
  const countMessage = lang === 'fr'
    ? `Vous avez ${filteredCount} service${filteredCount > 1 ? 's' : ''}${filterLabel}`
    : `You have ${filteredCount} service${filteredCount > 1 ? 's' : ''}${filterLabel}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-gray-500">{countMessage}</p>
        <button onClick={onAdd} className="flex items-center gap-1.5 border border-[#976DD0] text-[#976DD0] text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#F2ECF8] transition-colors">
          {t.addBtn}
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 text-gray-400">{t.empty}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-gray-100 text-[12px] text-gray-400 font-medium">
                <th className="text-left py-2 px-3">{t.svcTable.date}</th>
                <th className="text-left py-2 px-3">{t.svcTable.cat}</th>
                <th className="text-left py-2 px-3">{t.svcTable.svc}</th>
                <th className="text-left py-2 px-3">{t.svcTable.price}</th>
                <th className="text-left py-2 px-3">{t.svcTable.orders}</th>
                <th className="text-left py-2 px-3">{t.svcTable.ca}</th>
                <th className="text-left py-2 px-3">{t.svcTable.status}</th>
                <th className="text-left py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {services.map(svc => {
                const title = lang === 'fr' ? (svc.title_fr || svc.title) : (svc.title_en || svc.title);
                const cat = svc.category?.name_fr || svc.category?.name || '—';
                const dateStr = svc.createdAt ? new Date(svc.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {day:'2-digit',month:'2-digit',year:'numeric'}) : '—';
                const statusKey = svc.status || 'draft';
                const statusLabel = t.statusLabels[statusKey] || statusKey;
                return (
                  <tr key={svc._id} className="border-b border-gray-100 hover:bg-gray-50/50 text-[13px] text-[#47525E]">
                    <td className="py-3 px-3 whitespace-nowrap">{dateStr}</td>
                    <td className="py-3 px-3">{cat}</td>
                    <td className="py-3 px-3 font-medium">
                  <div className="flex flex-col gap-1">
                    <span>{title}</span>
                    {svc.delivery_time && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                        <FaCalendarDays className="text-gray-400" />
                        {svc.delivery_time}
                      </span>
                    )}
                  </div>
                </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {svc.price_ttc === 0 || svc.is_free ? (
                        <div className="flex flex-col gap-1">
                          <span className="line-through text-gray-400">{svc.price_ttc || svc.price || 0} € TTC</span>
                          <span className="inline-flex items-center justify-center rounded-full bg-[#F2ECF8] px-2 py-1 text-[11px] font-semibold text-[#976DD0]">Service offert</span>
                        </div>
                      ) : (
                        `${svc.price_ttc || svc.price || 0} € TTC`
                      )}
                    </td>
                    <td className="py-3 px-3">{svc.order_count || svc.orders || '-'}</td>
                    <td className="py-3 px-3">{svc.total_revenue ? `${svc.total_revenue} €` : '-'}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 w-[140px] text-[11px] font-semibold ${statusKey === 'active' ? 'bg-green-100 text-green-700' : statusKey === 'inactive' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1.5 text-[12px]">
                        <button onClick={() => onAction(svc.status === 'active' ? 'deactivate' : 'activate', svc)} className="border border-gray-300 rounded-full px-2.5 py-0.5 hover:bg-gray-50 text-[#47525E]">
                          {svc.status === 'active' ? t.actions.deactivate : t.actions.activate}
                        </button>
                        <button onClick={() => onAction('see', svc)} className="border border-gray-300 rounded-full px-2.5 py-0.5 hover:bg-gray-50 text-[#47525E]">{t.actions.see}</button>
                        <button onClick={() => onAction('edit', svc)} className="border border-gray-300 rounded-full px-2.5 py-0.5 hover:bg-gray-50 text-[#47525E]">{t.actions.edit}</button>
                        <button onClick={() => onAction('delete', svc)} className="border border-red-200 rounded-full px-2.5 py-0.5 hover:bg-red-50 text-red-400">{t.actions.delete}</button>
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
  );
}

/* ─── Page principale ── */
const MOCK_PRO_SERVICES = [
  {
    _id: 'psvc-1', createdAt: '2026-01-15T10:00:00Z',
    category: { name_fr: 'Vendre' }, subcategory: { name_fr: 'Estimation' },
    title_fr: 'Estimation immobilière de votre bien', title_en: 'Property valuation',
    price_ttc: 0, is_free: true, currency: 'EUR',
    ordersCount: 12, totalRevenue: 0, status: 'active',
  },
  {
    _id: 'psvc-2', createdAt: '2026-01-20T14:00:00Z',
    category: { name_fr: 'Vendre' }, subcategory: { name_fr: 'Commercialisation' },
    title_fr: 'Mise en vente complète avec suivi', title_en: 'Full sale management',
    price_ttc: 1500, currency: 'EUR',
    ordersCount: 3, totalRevenue: 4500, status: 'active',
  },
  {
    _id: 'psvc-3', createdAt: '2026-02-05T09:30:00Z',
    category: { name_fr: 'Vendre' }, subcategory: { name_fr: 'Photo' },
    title_fr: 'Séance photo professionnelle', title_en: 'Professional photo shoot',
    price_ttc: 120, currency: 'EUR',
    ordersCount: 8, totalRevenue: 960, status: 'active',
  },
  {
    _id: 'psvc-4', createdAt: '2026-02-12T11:00:00Z',
    category: { name_fr: 'Vendre' }, subcategory: { name_fr: 'Administratif' },
    title_fr: 'Préparation du dossier de vente', title_en: 'Sale file preparation',
    price_ttc: 80, currency: 'EUR',
    ordersCount: 5, totalRevenue: 400, status: 'active',
  },
  {
    _id: 'psvc-5', createdAt: '2026-03-10T16:00:00Z',
    category: { name_fr: 'Louer' }, subcategory: { name_fr: 'Visite' },
    title_fr: 'Organisation et conduite des visites', title_en: 'Visit scheduling & hosting',
    price_ttc: 300, currency: 'EUR',
    ordersCount: 2, totalRevenue: 600, status: 'inactive',
  },
  {
    _id: 'psvc-6', createdAt: '2026-04-01T10:00:00Z',
    category: { name_fr: 'Vendre' }, subcategory: { name_fr: 'Rédaction' },
    title_fr: 'Rédaction & diffusion d’annonce', title_en: 'Listing writing & distribution',
    price_ttc: 50, currency: 'EUR',
    ordersCount: 0, totalRevenue: 0, status: 'draft',
  },
];

const MOCK_PRO_ORDERS = [
  {
    _id: 'pord-001', orderNumber: 'CMD-20260412-001', createdAt: '2026-04-12T10:30:00Z',
    service: { title_fr: 'Estimation immobilière de votre bien', title_en: 'Property valuation', price_ttc: 0 },
    property: { title: 'Appartement T3 — 12 rue de Béthune, Lille' },
    buyer: { name: 'Sophie Martin', city: 'Lille' },
    quantity: 1, totalAmount: 0, status: 'confirmed_by_buyer', payment_status: 'paid',
    deliveredAt: '2026-04-18T14:00:00Z',
    is_booking: true,
  },
  {
    _id: 'pord-002', orderNumber: 'CMD-20260420-002', createdAt: '2026-04-20T09:15:00Z',
    service: { title_fr: 'Séance photo professionnelle', title_en: 'Professional photo shoot', price_ttc: 120 },
    property: { title: 'Appartement T3 — 12 rue de Béthune, Lille' },
    buyer: { name: 'Sophie Martin', city: 'Lille' },
    quantity: 1, totalAmount: 120, status: 'delivered_by_pro', payment_status: 'pending',
    deliveredAt: '2026-04-25T11:00:00Z',
  },
  {
    _id: 'pord-003', orderNumber: 'CMD-20260428-003', createdAt: '2026-04-28T16:45:00Z',
    service: { title_fr: 'Mise en vente complète avec suivi', title_en: 'Full sale management', price_ttc: 1500 },
    property: { title: 'Maison T4 — 12 rue Pasteur, Lambersart' },
    buyer: { name: 'Pierre Dubois', city: 'Lambersart' },
    quantity: 1, totalAmount: 1500, status: 'paid', payment_status: 'paid',
    deliveredAt: null,
  },
  {
    _id: 'pord-004', orderNumber: 'CMD-20260502-004', createdAt: '2026-05-02T12:00:00Z',
    service: { title_fr: 'Préparation du dossier de vente', title_en: 'Sale file preparation', price_ttc: 80 },
    property: { title: 'Studio — 24 bd Vauban, Lille' },
    buyer: { name: 'Léa Bernard', city: 'Lille' },
    quantity: 1, totalAmount: 80, status: 'accepted_by_pro', payment_status: 'paid',
    deliveredAt: null,
  },
  {
    _id: 'pord-005', orderNumber: 'CMD-20260504-005', createdAt: '2026-05-04T08:30:00Z',
    service: { title_fr: 'Estimation immobilière de votre bien', title_en: 'Property valuation', price_ttc: 0 },
    property: { title: 'Maison T5 — 45 av. de la République, Marcq-en-Barœul' },
    buyer: { name: 'Thomas Lefèvre', city: 'Marcq-en-Barœul' },
    quantity: 1, totalAmount: 0, status: 'paid', payment_status: 'paid',
    deliveredAt: null,
    is_booking: true,
  },
  {
    _id: 'pord-006', orderNumber: 'CMD-20260506-006', createdAt: '2026-05-06T15:20:00Z',
    service: { title_fr: 'Séance photo professionnelle', title_en: 'Professional photo shoot', price_ttc: 120 },
    property: { title: 'Appartement T2 — 7 rue de l’Hôpital, Lille' },
    buyer: { name: 'Camille Roux', city: 'Lille' },
    quantity: 1, totalAmount: 120, status: 'cancelled', payment_status: 'refunded',
    deliveredAt: null,
  },
];

export default function ProMarketplace() {
  const [lang, setLang] = useState('fr');
  const t = T[lang];
  const [services, setServices] = useState([]);
  const [serviceStatusFilter, setServiceStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [viewService, setViewService] = useState(null);
  const [editService, setEditService] = useState(null);
  const [deactivateService, setDeactivateService] = useState(null);
  const [deleteService, setDeleteService] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const svcRes = await getProServices(lang);
      const svcList = svcRes?.services || svcRes?.data || [];
      setServices(svcList.length > 0 ? svcList : MOCK_PRO_SERVICES);
    } catch (e) {
      console.error(e);
      setServices(MOCK_PRO_SERVICES);
    } finally { setLoading(false); }
  }, [lang]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleOrderAction = async (type, order) => {
    try {
      if (type === 'accept') { await acceptOrder(order._id, lang); fetchAll(); }
      else if (type === 'deliver') { await deliverOrder(order._id, lang); fetchAll(); }
    } catch (e) { console.error(e); }
  };

  const handleServiceAction = async (action, service) => {
    try {
      if (action === 'deactivate') {
        setDeactivateService(service);
      } else if (action === 'activate') {
        await updateProService(service._id, { status: 'active' }, lang);
        fetchAll();
      } else if (action === 'see') {
        setViewService(service);
      } else if (action === 'edit') {
        setEditService(service);
      } else if (action === 'delete') {
        setDeleteService(service);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageLayout>
      <div className="bg-[#f3f5f9] min-h-full py-[22px] px-[22px] pb-24">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-[#47525E]">{t.title}</h1>
            <p className="text-[13px] text-gray-400">{t.sub}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={fetchAll} className="text-[13px] border border-gray-300 rounded px-2 py-1 hover:bg-gray-50 text-[#47525E]">{t.refresh}</button>
            <button onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')} className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 text-[#47525E]">{t.switchLang}</button>
          </div>
        </div>

        <div className="flex gap-2 items-center mb-5">
          <span className="text-sm text-gray-500">Filtrer :</span>
          {['all', 'active', 'inactive', 'draft'].map((status) => {
            const label = status === 'all'
              ? 'Tous'
              : status === 'active'
                ? 'Actif'
                : status === 'inactive'
                  ? 'Inactif'
                  : 'Brouillon';
            return (
              <button
                key={status}
                type="button"
                onClick={() => setServiceStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition ${serviceStatusFilter === status ? 'bg-[#976DD0] text-white border-[#976DD0]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">{t.loading}</div>
        ) : (
          <>
            <ServicesTab
              services={services.filter((svc) => {
                if (serviceStatusFilter === 'all') return true;
                return svc.status === serviceStatusFilter;
              })}
              lang={lang}
              filter={serviceStatusFilter}
              onAdd={() => setCreateModal(true)}
              onAction={handleServiceAction}
            />
          </>
        )}
      </div>

      {createModal && (
        <CreateServiceModal lang={lang} onClose={() => setCreateModal(false)} onCreated={fetchAll} />
      )}
      {editService && (
        <CreateServiceModal
          lang={lang}
          service={editService}
          onClose={() => setEditService(null)}
          onCreated={() => { fetchAll(); setEditService(null); }}
        />
      )}
      {viewService && (
        <ServiceModal
          svc={viewService}
          lang={lang}
          onClose={() => setViewService(null)}
          onBuy={() => {}}
          hideActions={true}
        />
      )}
      {deactivateService && (
        <div onClick={() => setDeactivateService(null)} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#47525E] text-base">Confirmer la désactivation</h2>
              <button onClick={() => setDeactivateService(null)} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600">Voulez-vous vraiment désactiver ce service ? Il ne sera plus visible dans les résultats de recherche.</p>
              <div className="rounded-xl border border-[#E9D8FD] bg-[#F3E8FF] px-4 py-3 text-sm text-[#6D28D9]">
                <p className="font-medium">Service :</p>
                <p>{lang === 'fr' ? (deactivateService.title_fr || deactivateService.title) : (deactivateService.title_en || deactivateService.title)}</p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm text-[#47525E] hover:bg-gray-50"
                onClick={() => setDeactivateService(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full py-2.5 text-sm font-semibold transition-colors"
                onClick={async () => {
                  try {
                    await updateProService(deactivateService._id, { status: 'inactive' }, lang);
                    setDeactivateService(null);
                    fetchAll();
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                Désactiver
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteService && (
        <div onClick={() => setDeleteService(null)} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#47525E] text-base">Confirmer la suppression</h2>
              <button onClick={() => setDeleteService(null)} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600">Voulez-vous vraiment supprimer ce service ? Cette action est irréversible.</p>
              <div className="rounded-xl border border-[#E9D8FD] bg-[#F3E8FF] px-4 py-3 text-sm text-[#6D28D9]">
                <p className="font-medium">Service :</p>
                <p>{lang === 'fr' ? (deleteService.title_fr || deleteService.title) : (deleteService.title_en || deleteService.title)}</p>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                className="flex-1 border border-gray-300 rounded-full py-2.5 text-sm text-[#47525E] hover:bg-gray-50"
                onClick={() => setDeleteService(null)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full py-2.5 text-sm font-semibold transition-colors"
                onClick={async () => {
                  try {
                    await deleteProService(deleteService._id, lang);
                    setDeleteService(null);
                    fetchAll();
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageLayout>
  );
}
