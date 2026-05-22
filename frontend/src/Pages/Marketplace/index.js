import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdSearch, MdLocationOn, MdKeyboardArrowDown, MdPerson, MdStorefront, MdWorkOutline, MdRateReview, MdOutlineInventory2, MdTextsms, MdSupportAgent } from 'react-icons/md';
import { PiStarFill, PiStar } from 'react-icons/pi';
import { FaCalendarDays } from 'react-icons/fa6';
import CityAutocomplete from '../../components/common/CityAutocomplete';
import { getServices, createOrder, searchProviders, getCategories, createServiceRequest, getFavoritePros } from '../../methods/api/marketplaceApi';
import PageLayout from '../../components/global/PageLayout';

export const T = {
  fr: {
    featuredTitle: "Nos agents locaux favoris pour vous accompagner sans commission",
    pageTitle: "Se faire accompagner par un professionnel",
    pageSub: "Nos agents immobiliers locaux et sûrs pour vous accompagner sans mandat ni commission",
    helpLabel: "J'ai besoin d'aide pour",
    allTx: "Toute la transaction",
    timing: "Indirect/immédiat",
    showBtn: "Afficher les résultats",
    results: (n) => `${n} services correspondent à votre besoin`,
    contact: "Contacter",
    buy: "Acheter",
    book: "Réserver",
    free: "Gratuit",
    propertyLabel: "Pour quel bien ?",
    propertyHint: "Sélectionnez le bien concerné par ce service",
    noProperty: "Aucun bien spécifique",
    bookingTitle: "Réservation du service",
    bookingFree: "Ce service est offert par le professionnel — aucun paiement requis.",
    confirmBooking: "Confirmer la réservation",
    bookingOk: "Réservation enregistrée !",
    loginRequired: "Connectez-vous pour réserver ce service.",
    goLogin: "Se connecter",
    noResult: "Aucun service disponible.",
    loading: "Chargement…",
    notFound: "Vous ne trouvez pas le service dont vous avez besoin ?",
    request: "Faire une demande",
    topAgent: "Top agent",
    distance: "À distance",
    exp: "ans d'expérience",
    services: "services réalisés",
    reviews: "avis",
    connectTo: "Se connecter à",
    restart: "Recommencer à zéro",
    manageTab: "Gérer la vente",
    proSection: "Présentation du professionnel",
    svcSection: "Présentation du service",
    expLabel: "Mon expérience en quelques mots",
    q1: "Qu'est-ce que ce service va vous apporter ?",
    q2: "Description du service rendu",
    q3: "Ce que vous obtiendrez",
    q4: "Facturation et paiement : votre argent est en sécurité",
    payNote: "Vous payez la prestation maintenant et Anyhomes conserve cette somme en tant que tiers de confiance. Une fois la prestation effectuée, vous confirmez la réalisation et AnyHomes déclenche le versement.",
    buying: "Achat en cours…",
    buyOk: "Commande créée ! Redirection…",
    buyErr: "Erreur lors de la commande.",
    qty: "Quantité",
    msgLabel: "Message au prestataire (optionnel)",
    confirm: "Confirmer la commande",
    cancel: "Annuler",
    switchLang: "EN",
  },
  en: {
    featuredTitle: "Our featured agents to guide you commission-free",
    pageTitle: "Get supported by a professional",
    pageSub: "Our local and trusted real estate agents to guide you without mandate or commission",
    helpLabel: "I need help with",
    allTx: "Any transaction",
    timing: "Indirect/immediate",
    showBtn: "Show results",
    results: (n) => `${n} services match your needs`,
    contact: "Contact",
    buy: "Buy",
    book: "Book",
    free: "Free",
    propertyLabel: "For which property?",
    propertyHint: "Select the property this service applies to",
    noProperty: "No specific property",
    bookingTitle: "Service booking",
    bookingFree: "This service is offered by the pro — no payment required.",
    confirmBooking: "Confirm booking",
    bookingOk: "Booking saved!",
    loginRequired: "Sign in to book this service.",
    goLogin: "Sign in",
    noResult: "No services available.",
    loading: "Loading…",
    notFound: "Can't find the service you need?",
    request: "Make a request",
    topAgent: "Top agent",
    distance: "Remote",
    exp: "years of experience",
    services: "services done",
    reviews: "reviews",
    connectTo: "Connect to",
    restart: "Start over",
    manageTab: "Manage sale",
    proSection: "Professional profile",
    svcSection: "Service overview",
    expLabel: "My experience in a few words",
    q1: "What will this service bring you?",
    q2: "Description of the service",
    q3: "What you will get",
    q4: "Billing & payment: your money is safe",
    payNote: "You pay now and Anyhomes holds the funds as a trusted third party. Once the service is delivered, you confirm and Anyhomes releases the funds.",
    buying: "Processing…",
    buyOk: "Order created! Redirecting…",
    buyErr: "Error placing order.",
    qty: "Quantity",
    msgLabel: "Message to provider (optional)",
    confirm: "Confirm order",
    cancel: "Cancel",
    switchLang: "FR",
  },
};

const DEFAULT_CATEGORIES = [
  { id: 'acheter',           label: 'Acheter',                group: 'Transaction' },
  { id: 'vendre',            label: 'Vendre',                 group: 'Transaction' },
  { id: 'louer',             label: 'Louer',                  group: 'Transaction' },
  { id: 'gerer',             label: 'Gérer',                  group: 'Transaction' },
  { id: 'visites',           label: 'Visites',                group: 'Service' },
  { id: 'estimation',        label: 'Estimation',             group: 'Service' },
  { id: 'negociation',       label: 'Négociation',            group: 'Service' },
  { id: 'recherche-bien',    label: 'Recherche de bien',      group: 'Service' },
  { id: 'analyse-acheteur',  label: 'Analyse acheteur',       group: 'Service' },
  { id: 'photo',             label: 'Prise de photo',         group: 'Service' },
  { id: 'dossier-vendeur',   label: 'Dossier vendeur',        group: 'Service' },
  { id: 'recherche-financement', label: 'Recherche de financement', group: 'Service' },
  { id: 'visite-virtuelle',  label: 'Visite virtuelle',       group: 'Service' },
];

// Compat rétro pour le code qui référence encore CATEGORIES
const CATEGORIES = DEFAULT_CATEGORIES;

// Mapping transaction -> services associés (ids)
const TRANSACTION_TO_SERVICES = {
  acheter: ['visites', 'recherche-bien', 'analyse-acheteur', 'recherche-financement', 'visite-virtuelle'],
  vendre: ['visites', 'estimation', 'negociation', 'photo', 'dossier-vendeur', 'visite-virtuelle'],
  louer: ['visites', 'estimation', 'photo', 'visite-virtuelle'],
  gerer: ['estimation', 'dossier-vendeur'],
};

const PROVIDER_PHOTOS = {
  "geoffroy-papelier": "/assets/img/agent-geoffroy-papelier.jpg.jpg",
  "michael-fournet": "/assets/img/agent-michael-fournet.jpg.jpg",
  "pauline-dupont": "/assets/img/agent-pauline-dupont.jpg",
  "Pauline Dupont": "/assets/img/agent-pauline-dupont.jpg",
};

const MOCK_FEATURED = [
  {
    id: 1,
    name: "Geoffroy Papelier",
    providerKey: "geoffroy-papelier",
    tag: "Sécuriser la vente de votre bien",
    headline: "Votre expert local pour sécuriser la réussite de votre projet immobilier",
    description: "Geoffroy Papelier, conseiller iAD à Lille, vous accompagne avec une expertise locale pour concrétiser votre projet immobilier.",
    stats: [
      { value: "10+", label: "Années d'expérience" },
      { value: "50",  label: "Clients accompagnés" },
      { value: "4,9/5", label: "25 avis clients" },
      { value: "100%", label: "Clients satisfaits" },
    ],
    photo: "/assets/img/agent-geoffroy-papelier.jpg.jpg",
    photoBg: "from-slate-300 to-slate-400",
    phone: "+33 6 12 34 56 78",
  },
  {
    id: 2,
    name: "Michaël Fournet",
    providerKey: "michael-fournet",
    tag: "Expertise terrain",
    headline: "Votre expert local pour sécuriser la réussite de votre projet immobilier",
    description: "Michaël Fournet, conseiller iad à Lille et autour, vous aide à avancer sereinement grâce à une approche concrète et adaptée à vos besoins.",
    stats: [
      { value: "10+", label: "Années d'expérience" },
      { value: "50",  label: "Clients accompagnés" },
      { value: "4,9/5", label: "25 avis clients" },
      { value: "100%", label: "Clients satisfaits" },
    ],
    photo: "/assets/img/agent-michael-fournet.jpg.jpg",
    photoBg: "from-gray-300 to-gray-400",
    phone: "+33 6 98 76 54 32",
  },
];

export const MOCK_SERVICES = [
  // Geoffroy Papelier
  { _id: 'mock-gp-1', providerKey: 'geoffroy-papelier', provider: { name: 'Geoffroy Papelier', role: 'Conseiller iAD', city: 'Lille' }, category: { name_fr: 'Estimation' }, title_fr: 'Estimation', title_en: 'Property valuation', price_ttc: 0, tarification_type: 'Offert', zone_covered: 'Lille +10 KM', quantity_label: '1 rapport d’estimation', rating: 4.9, reviewCount: 25 },
  { _id: 'mock-gp-2', providerKey: 'geoffroy-papelier', provider: { name: 'Geoffroy Papelier', role: 'Conseiller iAD', city: 'Lille' }, category: { name_fr: 'Visites' }, title_fr: 'Visites', title_en: 'Property visits', price_ttc: 300, tarification_type: 'Forfait', zone_covered: 'Lille +10 KM', quantity_label: 'Pack 10 visites', rating: 4.9, reviewCount: 18 },
  { _id: 'mock-gp-3', providerKey: 'geoffroy-papelier', provider: { name: 'Geoffroy Papelier', role: 'Conseiller iAD', city: 'Lille' }, category: { name_fr: 'Prise de photo' }, title_fr: 'Prise de photo', title_en: 'Professional photo shoot', price_ttc: 120, tarification_type: 'Forfait', zone_covered: 'Lille +10 KM', quantity_label: '20 photos HD', rating: 4.8, reviewCount: 12 },
  { _id: 'mock-gp-4', providerKey: 'geoffroy-papelier', provider: { name: 'Geoffroy Papelier', role: 'Conseiller iAD', city: 'Lille' }, category: { name_fr: 'Dossier vendeur' }, title_fr: 'Dossier vendeur', title_en: 'Seller file preparation', price_ttc: 80, tarification_type: 'Forfait', zone_covered: 'Lille +10 KM', quantity_label: '1 dossier complet', rating: 5, reviewCount: 8 },
  // Michaël Fournet
  { _id: 'mock-mf-1', providerKey: 'michael-fournet', provider: { name: 'Michaël Fournet', role: 'Conseiller iad', city: 'Lille' }, category: { name_fr: 'Négociation' }, title_fr: 'Négociation', title_en: 'Negotiation', price_ttc: 0, tarification_type: 'Offert', zone_covered: 'Métropole lilloise', quantity_label: '1 mandat de négociation', rating: 4.9, reviewCount: 30 },
  { _id: 'mock-mf-2', providerKey: 'michael-fournet', provider: { name: 'Michaël Fournet', role: 'Conseiller iad', city: 'Lille' }, category: { name_fr: 'Recherche de bien' }, title_fr: 'Recherche de bien', title_en: 'Property search', price_ttc: 500, tarification_type: 'Forfait', zone_covered: 'Métropole lilloise', quantity_label: 'Mission jusqu’à acquisition', rating: 4.9, reviewCount: 22 },
  { _id: 'mock-mf-3', providerKey: 'michael-fournet', provider: { name: 'Michaël Fournet', role: 'Conseiller iad', city: 'Lille' }, category: { name_fr: 'Analyse acheteur' }, title_fr: 'Analyse acheteur', title_en: 'Buyer analysis', price_ttc: 150, tarification_type: 'Forfait', zone_covered: 'Métropole lilloise', quantity_label: '1 rapport de qualification', rating: 4.8, reviewCount: 15 },
  { _id: 'mock-mf-4', providerKey: 'michael-fournet', provider: { name: 'Michaël Fournet', role: 'Conseiller iad', city: 'Lille' }, category: { name_fr: 'Visite virtuelle' }, title_fr: 'Visite virtuelle', title_en: 'Virtual tour', price_ttc: 200, tarification_type: 'Forfait', zone_covered: 'Métropole lilloise', quantity_label: '1 visite 360° + plan', rating: 5, reviewCount: 10 },
  // Pauline Dupont
  { _id: 'mock-pd-1', providerKey: 'pauline-dupont', provider: { name: 'Pauline Dupont', role: 'Agent indépendant IAD', city: 'Lille' }, category: { name_fr: 'Estimation' }, title_fr: 'Estimation gratuite de votre bien', title_en: 'Free property valuation', price_ttc: 0, tarification_type: 'Offert', zone_covered: 'Lille +5 KM', quantity_label: '1 rapport d’estimation', rating: 5, reviewCount: 32 },
  { _id: 'mock-pd-2', providerKey: 'pauline-dupont', provider: { name: 'Pauline Dupont', role: 'Agent indépendant IAD', city: 'Lille' }, category: { name_fr: 'Visites' }, title_fr: 'Pack 10 visites accompagnées', title_en: '10-visit accompanied pack', price_ttc: 300, tarification_type: 'Forfait', zone_covered: 'Lille +5 KM', quantity_label: 'Pack 10 visites', rating: 4.9, reviewCount: 24 },
  { _id: 'mock-pd-3', providerKey: 'pauline-dupont', provider: { name: 'Pauline Dupont', role: 'Agent indépendant IAD', city: 'Lille' }, category: { name_fr: 'Recherche de financement' }, title_fr: 'Mise en relation courtier', title_en: 'Mortgage broker introduction', price_ttc: 0, tarification_type: 'Offert', zone_covered: 'Lille +5 KM', quantity_label: '1 mise en relation', rating: 4.8, reviewCount: 14 },
  { _id: 'mock-pd-4', providerKey: 'pauline-dupont', provider: { name: 'Pauline Dupont', role: 'Agent indépendant IAD', city: 'Lille' }, category: { name_fr: 'Dossier vendeur' }, title_fr: 'Préparation dossier de vente', title_en: 'Seller file preparation', price_ttc: 80, tarification_type: 'Forfait', zone_covered: 'Lille +5 KM', quantity_label: '1 dossier complet', rating: 4.9, reviewCount: 11 },
];

function AuthRequiredModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-[340px] p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold text-[#47525E]">Connexion requise</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <p className="text-[13px] text-gray-600 mb-5">
          Pour faire une demande de service, vous devez d'abord créer un compte ou vous connecter.
        </p>
        <div className="flex flex-col gap-2">
          <Link to="/login" onClick={onClose} className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full text-center transition-colors">
            Se connecter
          </Link>
          <Link to="/register" onClick={onClose} className="border border-[#976DD0] text-[#976DD0] text-[13px] font-semibold px-4 py-2.5 rounded-full text-center hover:bg-[#F2ECF8] transition-colors">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServiceRequestModal({ user, lang, categories, onClose, onDone }) {
  const [phone, setPhone] = useState(user?.mobileNo || user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // On ne propose que les catégories de Transaction (Acheter / Vendre / Louer / Gérer),
  // alignées sur la zone de recherche en haut de la page.
  const reqCategories = (categories || []).filter(c => c.group === 'Transaction');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone.trim() || !email.trim() || !categoryId || !description.trim()) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    setSubmitting(true);
    try {
      const selected = reqCategories.find(c => (c.id || c._id) === categoryId);
      const categoryName = selected?.label || selected?.name || '';
      const res = await createServiceRequest({ phone: phone.trim(), email: email.trim(), categoryId, categoryName, description: description.trim(), lang }, lang);
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => { onDone && onDone(); onClose(); }, 1500);
      } else {
        setError(res?.message || "Erreur lors de l'envoi de la demande.");
      }
    } catch (err) {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[#47525E]">Décrivez votre besoin</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <p className="text-[14px] text-green-700 font-semibold mb-1">Demande envoyée !</p>
            <p className="text-[12px] text-gray-500">Notre équipe revient vers vous rapidement.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] text-[#47525E] font-semibold mb-1 block">Numéro de téléphone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0]"
              />
            </div>
            <div>
              <label className="text-[12px] text-[#47525E] font-semibold mb-1 block">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#976DD0]"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="text-[12px] text-[#47525E] font-semibold mb-1 block">Catégorie *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#976DD0]"
              >
                <option value="">Sélectionnez une catégorie…</option>
                {reqCategories.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>{c.label || c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] text-[#47525E] font-semibold mb-1 block">Description du service recherché *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="Décrivez précisément le service dont vous avez besoin…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[#976DD0]"
              />
              <p className="text-[10px] text-gray-400 text-right mt-0.5">{description.length}/2000</p>
            </div>

            {error && <p className="text-[12px] text-red-600">{error}</p>}

            <div className="flex gap-2 mt-2">
              <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={submitting} className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] disabled:opacity-60 text-white text-[13px] font-semibold px-4 py-2.5 rounded-full transition-colors">
                {submitting ? 'Envoi…' : 'Envoyer la demande'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ContactModal({ pro, onClose }) {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const user = useSelector(state => state.user);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  // Utilise les biens mockés ou ceux du user si dispo
  const properties = user?.properties && user.properties.length > 0 ? user.properties : MOCK_USER_PROPERTIES;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-[340px] p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[#47525E]">Contacter {pro.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="flex flex-col gap-3">
          {/* Option 1 : Messagerie interne avec dropdown des biens et message */}
          <div className="border border-[#976DD0] rounded-xl px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#976DD0] text-xl">💬</span>
              <div>
                <p className="text-[13px] font-semibold text-[#976DD0]">Messagerie interne AnyHomes</p>
                <p className="text-[11px] text-gray-400">Choisissez le bien concerné</p>
              </div>
            </div>
            <select
              value={selectedProperty}
              onChange={e => setSelectedProperty(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#976DD0] mb-2"
            >
              <option value="">— Aucun bien spécifique —</option>
              {properties.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
              <option value="not-listed">Bien non listé</option>
            </select>
            <textarea
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Votre message au professionnel..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[#976DD0] mb-2"
            />
            <a
              href={`/chat?property=${encodeURIComponent(selectedProperty)}&msg=${encodeURIComponent(customMessage)}`}
              className="block w-full mt-2 text-center bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir la messagerie
            </a>
          </div>
          {/* Option 2 : Téléphone */}
          {isMobile ? (
            <a
              href={`tel:${pro.phone?.replace(/\s/g, '')}`}
              className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-600 text-xl">📞</span>
              <div>
                <p className="text-[13px] font-semibold text-[#47525E]">Appeler</p>
                <p className="text-[11px] text-gray-400">{pro.phone}</p>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
              <span className="text-gray-600 text-xl">📞</span>
              <div>
                <p className="text-[13px] font-semibold text-[#47525E]">Numéro de téléphone</p>
                <p className="text-[13px] font-bold text-[#976DD0] tracking-wide">{pro.phone}</p>
              </div>
            </div>
          )}
          {/* Option 3 : Email */}
          {pro.email && (
            <a
              href={`mailto:${pro.email}`}
              className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-600 text-xl">✉️</span>
              <div>
                <p className="text-[13px] font-semibold text-[#47525E]">Email</p>
                <p className="text-[11px] text-gray-400">{pro.email}</p>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Stars({ value = 0, size = 14, interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <span key={i}
          style={{ fontSize: size, cursor: interactive ? "pointer" : "default" }}
          onClick={() => interactive && onChange && onChange(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`select-none ${i <= (hover || value) ? "text-[#976DD0]" : "text-gray-300"}`}
        >★</span>
      ))}
    </span>
  );
}

function FeaturedCard({ pro, lang, onViewAgent }) {
  const [showContact, setShowContact] = useState(false);
  const photo = pro.photo || pro.featuredProfilePhoto || (pro.name === 'Geoffroy Papelier' ? "/assets/img/Placeholder gauche.jpg" : "/assets/img/Placeholder droite.jpg");
  const stats = pro.stats || [
    { value: String(pro.featuredExperienceYears || 0), label: "Années d'expérience" },
    { value: String(pro.featuredClientsAccompanied || 0), label: "Clients accompagnés" },
    { value: String(pro.featuredRatingNotes || "-"), label: "Notes" },
    { value: String(pro.featuredSatisfactionRate || "-"), label: "Clients satisfaits" },
  ];
  return (
    <>
      {showContact && <ContactModal pro={pro} onClose={() => setShowContact(false)} />}
      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ minHeight: '324px' }}>
        <div className="flex h-full">
          <div className="w-2/3 bg-white p-5 flex flex-col justify-between">
            <div>
              <p className="font-bold text-black text-[11px] mb-1">{pro.tag}</p>
              <h2 className="text-[#7030A0] font-extrabold text-[18px] leading-snug mb-2">
                {pro.headline}
              </h2>
              <p className="text-[14px] text-black leading-tight line-clamp-3">{pro.description}</p>
            </div>
            <div className="flex gap-4 my-2">
              {pro.stats.map((s, i) => (
                <div key={i}>
                  <p className="text-[20px] font-bold text-black leading-none">{s.value}</p>
                  <p className="text-[12px] text-black mt-0.5 leading-[1.15]">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowContact(true)} className="border border-[#976DD0] text-[#976DD0] rounded-full px-4 py-1.5 text-[12px] font-semibold hover:bg-[#F2ECF8] transition-colors">
                Contacter
              </button>
              <button onClick={() => onViewAgent && onViewAgent(pro)} className="bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors">
                Voir ses services
              </button>
            </div>
          </div>
          <div className="w-1/3 bg-white flex items-center justify-center overflow-hidden">
            <img src={photo} alt={pro.name} className="h-full w-full object-cover" />
          </div>
        </div>
        <p className="absolute bottom-3 right-3 z-10 text-white font-bold text-sm drop-shadow-md bg-black/50 px-2 py-1 rounded">{pro.name}</p>
      </div>
    </>
  );
}

export function ServiceCard({ svc, lang, onView, onBuy, disableActions = false }) {
  const t = T[lang];
  const svcId = svc._id || svc.id;
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('marketplace.favorites');
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) && arr.includes(svcId);
    } catch { return false; }
  });
  const [showContact, setShowContact] = useState(false);
  const toggleSaved = () => {
    setSaved(prev => {
      const next = !prev;
      try {
        const raw = localStorage.getItem('marketplace.favorites');
        const arr = raw ? JSON.parse(raw) : [];
        const set = new Set(Array.isArray(arr) ? arr : []);
        if (next) set.add(svcId); else set.delete(svcId);
        localStorage.setItem('marketplace.favorites', JSON.stringify([...set]));
        // Stocke également un snapshot du service pour la page "Services sauvegardés"
        const sRaw = localStorage.getItem('marketplace.favorites.data');
        const data = sRaw ? JSON.parse(sRaw) : {};
        if (next) data[svcId] = svc; else delete data[svcId];
        localStorage.setItem('marketplace.favorites.data', JSON.stringify(data));
        window.dispatchEvent(new Event('marketplace-favorites-changed'));
      } catch { /* ignore */ }
      return next;
    });
  };
  const title = lang === "fr" ? (svc.title_fr || svc.title) : (svc.title_en || svc.title);
  const cat = svc.category?.name_fr || svc.category?.name || "";
  const price = svc.price_ttc ?? svc.price ?? 0;
  const provName = svc.provider?.name || "Pauline Dupont";
  const provRole = svc.provider?.role || "Agent indépendant IAD";
  const provCity = svc.city || svc.provider?.city || "Lille";
  const provPhoto = svc.provider?.photo || PROVIDER_PHOTOS[svc.providerKey] || PROVIDER_PHOTOS[provName];
  const modality = svc.modality || svc.service_type || svc.type || 'Présentiel';
  const isDistance = /distance|remote/i.test(String(modality));
  const zone = isDistance ? t.distance : (svc.zone_covered || (svc.city ? `${svc.city} +5 KM` : "Lille +5 KM"));
  const qty = svc.quantity || svc.quantity_label || "Pack 10 visites";
  const delivery = svc.delivery_time || 'Variable';
  const since = svc.provider?.companySince || svc.provider?.companySince;
  const experienceYears = (() => {
    if (!since) return 20;
    const parsedDate = new Date(since);
    if (!isNaN(parsedDate)) return Math.max(new Date().getFullYear() - parsedDate.getFullYear(), 1);
    const parsedYear = parseInt(String(since).slice(0, 4), 10);
    return !isNaN(parsedYear) ? Math.max(new Date().getFullYear() - parsedYear, 1) : 20;
  })();

  // Gestion du clic sur la carte (hors favoris et footer)
  const cardRef = useRef();
  const handleCardClick = (e) => {
    // Ne pas ouvrir la modale si clic sur le bouton favoris ou footer
    if (e.target.closest('.card-footer') || e.target.closest('.card-fav')) return;
    onView(svc);
  };

  return (
    <div ref={cardRef} className="relative bg-white border border-[#D5D5D5] rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer" onClick={handleCardClick}>
      {showContact && <ContactModal pro={svc.provider || { name: provName, phone: svc.provider?.phone, email: svc.provider?.email }} onClose={() => setShowContact(false)} />}
      {/* Tag Top agent */}
      <span className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#343F4B] text-white text-[12px] font-semibold px-3 py-1 rounded-b-md z-10">
        {t.topAgent}
      </span>
      <div className="flex items-center justify-end px-5 pt-3 pb-1 card-fav">
        <button
          onClick={e => { e.stopPropagation(); toggleSaved(); }}
          aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="bg-transparent p-0 leading-none transition-transform hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill={saved ? '#F5B400' : 'none'}
            stroke={saved ? '#976DD0' : '#9CA3AF'}
            strokeWidth={saved ? 2 : 1.6}
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path d="M12 21s-7.5-4.5-9.5-9.2C1.1 7.6 4 4 7.5 4c2 0 3.4 1 4.5 2.5C13.1 5 14.5 4 16.5 4 20 4 22.9 7.6 21.5 11.8 19.5 16.5 12 21 12 21z" />
          </svg>
        </button>
      </div>
      <div className="px-5 pb-3 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {provPhoto ? (
            <img src={provPhoto} alt={provName} className="w-[80px] h-[80px] rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {provName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-black text-[13px] truncate">{provName}</p>
            <p className="text-[11px] text-black truncate">{provRole}</p>
            <p className="text-[11px] text-black truncate">{provCity}</p>
          </div>
        </div>
        <div className="bg-[#F5F5F5] rounded-lg px-3 py-2 mb-2 grid grid-cols-2 gap-y-1.5 gap-x-3 text-[13px] leading-[1.1] text-black">
          <span className="flex items-center gap-1.5"><MdWorkOutline className="text-[15px] shrink-0" /> {experienceYears} {t.exp}</span>
          <span className="flex items-center gap-1.5"><MdStorefront className="text-[15px] shrink-0" /> 250 {t.services}</span>
          <span className="flex items-center gap-1.5"><PiStarFill className="text-[15px] text-[#976DD0] shrink-0" /> 5/5</span>
          <span className="flex items-center gap-1.5"><MdRateReview className="text-[15px] shrink-0" /> 150 {t.reviews}</span>
        </div>
        {svc.service ? (
          <span className="inline-block bg-[#F2ECF8] text-[#976DD0] text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2 self-start">{svc.service}</span>
        ) : cat ? (
          <span className="inline-block bg-[#F2ECF8] text-[#976DD0] text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2 self-start">{cat}</span>
        ) : null}
        <p className="font-bold text-black text-[15px] mb-2 line-clamp-2 text-center leading-[1.3] min-h-[40px]">{title}</p>
        <div className="space-y-0.5 text-[15px] text-black mb-3 flex-1 font-semibold">
          <div className="flex items-center gap-1.5"><MdSupportAgent className="text-[14px] text-black shrink-0" /><span>{modality}</span></div>
          <div className="flex items-center gap-1.5"><MdLocationOn className="text-[14px] text-black shrink-0" /><span>{zone}</span></div>
          <div className="flex items-center gap-1.5"><MdOutlineInventory2 className="text-[14px] text-black shrink-0" /><span>{qty}</span></div>
          <div className="flex items-center gap-1.5"><FaCalendarDays className="text-[14px] text-black shrink-0" /><span>{delivery}</span></div>
        </div>
        <div className={`pt-2 border-t border-gray-100 card-footer gap-2 ${price > 0 ? 'flex items-center justify-between' : 'flex flex-col items-center'}`}>
          {price > 0 ? (
            <>
              {/* Message icon button */}
              <button
                disabled={disableActions}
                onClick={e => { e.stopPropagation(); if (!disableActions) setShowContact(true); }}
                className={disableActions ? 'flex items-center justify-center text-gray-300 cursor-not-allowed transition-colors p-0' : 'flex items-center justify-center text-[#976DD0] hover:text-[#7d55b5] transition-colors p-0'}
                aria-label={t.contact}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6.75C3 5.23122 4.23122 4 5.75 4H18.25C19.7688 4 21 5.23122 21 6.75V15.25C21 16.7688 19.7688 18 18.25 18H7.5L3 22V6.75Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="11.5" r="1" fill="#976DD0" />
                  <circle cx="12" cy="11.5" r="1" fill="#976DD0" />
                  <circle cx="15.5" cy="11.5" r="1" fill="#976DD0" />
                </svg>
              </button>
              {/* Price and buy button aligned on the same line */}
              <div className="flex flex-1 items-center justify-end gap-3 min-w-0">
                <span className="font-bold text-[#976DD0] text-[17px] truncate">{price} €</span>
                <button disabled={disableActions} onClick={e => { e.stopPropagation(); if (!disableActions) onBuy(svc); }} className={disableActions ? 'bg-gray-200 text-gray-400 text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap cursor-not-allowed' : 'bg-[#976DD0] hover:bg-[#7d55b5] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap'}>
                  {t.buy}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center gap-3 w-full">
              <span className="text-[16px] text-gray-400 font-semibold line-through">{price} €</span>
              <div className="flex items-center gap-3">
                <button
                  disabled={disableActions}
                  onClick={e => { e.stopPropagation(); if (!disableActions) setShowContact(true); }}
                  className={disableActions ? 'flex items-center justify-center text-gray-300 cursor-not-allowed transition-colors p-0' : 'flex items-center justify-center text-[#976DD0] hover:text-[#7d55b5] transition-colors p-0'}
                  aria-label={t.contact}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6.75C3 5.23122 4.23122 4 5.75 4H18.25C19.7688 4 21 5.23122 21 6.75V15.25C21 16.7688 19.7688 18 18.25 18H7.5L3 22V6.75Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    <circle cx="8.5" cy="11.5" r="1" fill="#976DD0" />
                    <circle cx="12" cy="11.5" r="1" fill="#976DD0" />
                    <circle cx="15.5" cy="11.5" r="1" fill="#976DD0" />
                  </svg>
                </button>
                <span className="rounded-full bg-[#F3E8FF] px-3 py-1 text-[#6D28D9] text-[13px] font-semibold whitespace-nowrap">Offert</span>
                <button disabled={disableActions} onClick={e => { e.stopPropagation(); if (!disableActions) onBuy(svc); }} className={disableActions ? 'bg-gray-200 text-gray-400 text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap cursor-not-allowed' : 'bg-[#976DD0] hover:bg-[#7d55b5] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap'}>
                  {t.book}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ServiceModal({ svc, lang, onClose, onBuy, hideActions = false, disableActions = false, extraContent = null }) {
  const t = T[lang];
  const title = lang === "fr" ? (svc.title_fr || svc.title) : (svc.title_en || svc.title);
  const desc = lang === "fr" ? (svc.description_fr || svc.description) : (svc.description_en || svc.description);
  const price = svc.price_ttc ?? svc.price ?? 0;
  const provName = svc.provider?.name || "Pauline Dupont";
  const provCity = svc.city || "Lille";
  const modality = svc.modality || svc.service_type || svc.type || 'Présentiel';
  const zone = svc.zone_covered || svc.city || 'Lille';
  const rayon = svc.radiusKm ? `${svc.radiusKm} km` : svc.radius ? `${svc.radius} km` : '5 km';
  const qty = svc.quantity_label || (svc.quantity ? `${svc.quantity} visite${svc.quantity > 1 ? 's' : ''}` : 'Pack 10 visites');
  const deliveryTime = svc.delivery_time || svc.deliveryTime || 'Variable';
  const sections = [
    { icon: "💡", title: t.q1, text: desc },
    { icon: "📋", title: t.q2, text: desc },
    { icon: "✅", title: t.q3, text: desc },
    { icon: "🔒", title: t.q4, text: t.payNote },
  ];
  const serviceDetails = [
    { icon: '⊙', label: t.modality, value: modality },
    { icon: '📍', label: t.zone, value: zone },
    { icon: '📏', label: t.radius, value: rayon },
    { icon: '#', label: t.qty || 'Quantité', value: qty },
    { icon: '⏱️', label: t.delivery, value: deliveryTime },
  ];
  const [showContact, setShowContact] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const user = useSelector((state) => state.user);
  const isLogged = !!(user && (user._id || user.id)) || !!localStorage.getItem('token');
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {showContact && (
        <ContactModal pro={svc.provider || { name: provName, phone: svc.provider?.phone, email: svc.provider?.email }} onClose={() => setShowContact(false)} />
      )}
      {showAuth && <AuthRequiredModal onClose={() => setShowAuth(false)} />}
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4 flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <button className="flex items-center gap-1.5 text-[13px] font-semibold text-[#47525E] border border-gray-200 rounded-lg px-3 py-1.5">
            {t.manageTab} ▾
          </button>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 text-sm">✕</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto max-h-[72vh] space-y-5">
          <h2 className="text-xl font-bold text-[#47525E]">{title}</h2>
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-3">{t.proSection}</h3>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {provName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#47525E] text-sm">{provName}</p>
                <p className="text-xs text-gray-400 mb-1">Agent indépendant IAD • {provCity}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
                  <span>📅 20 {t.exp}</span>
                  <span>🔄 250 {t.services}</span>
                  <span className="flex items-center gap-0.5"><Stars value={5} size={11} /> 5/5</span>
                  <span>💬 150 {t.reviews}</span>
                </div>
              </div>
            </div>
            {desc && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-[#47525E] mb-1">{t.expLabel}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#47525E] mb-2">{t.svcSection}</h3>
            <div className="flex flex-wrap gap-2">
              {serviceDetails.map((s,i) => (
                <span key={i} className="flex items-center gap-1.5 bg-[#F2ECF8] text-[#976DD0] text-[11px] font-medium px-3 py-1 rounded-full">
                  <span>{s.icon}</span>
                  <span>{s.label}: {s.value}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {sections.map((s,i)=>(
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-[#976DD0] rounded-lg flex items-center justify-center text-white text-lg shrink-0">{s.icon}</div>
                <div>
                  <p className="text-[12px] font-bold text-[#47525E] mb-1">{s.title}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{s.text || "—"}</p>
                </div>
              </div>
            ))}
          </div>
          {extraContent && (
            <div className="mt-4">
              {extraContent}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          {!hideActions ? (
            <button
              disabled={disableActions}
              onClick={() => {
                if (!disableActions) {
                  if (!isLogged) setShowAuth(true);
                  else setShowContact(true);
                }
              }}
              className={disableActions ? 'border border-gray-200 text-gray-300 text-base font-semibold px-4 py-2 rounded-full bg-gray-100 cursor-not-allowed' : 'border border-[#976DD0] text-[#976DD0] text-base font-semibold px-4 py-2 rounded-full hover:bg-[#F2ECF8] transition-colors'}
            >
              Contacter {provName.split(" ")[0]}
            </button>
          ) : <div />}
          <div className="flex items-center gap-3">
            {price > 0 ? (
              <span className="font-bold text-[#47525E] text-sm">{price} € T.T.C</span>
            ) : (
              <span className="flex items-center gap-2 text-sm text-gray-400 font-semibold">
                <span className="line-through">{price} € T.T.C</span>
                <span className="rounded-full bg-[#F3E8FF] px-2 py-1 text-[#6D28D9]">Offert</span>
              </span>
            )}
            {!hideActions && (
              <button disabled={disableActions} onClick={() => { if (!disableActions) onBuy(svc); }} className={disableActions ? 'bg-gray-200 text-gray-400 text-base font-semibold px-7 py-2 rounded-full cursor-not-allowed' : 'bg-[#976DD0] hover:bg-[#7d55b5] text-white text-base font-semibold px-7 py-2 rounded-full transition-colors'}>
                {price > 0 ? t.buy : t.book}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock des biens du user (à remplacer par un appel API getMyProperties)
const MOCK_USER_PROPERTIES = [
  { _id: 'prop-1', title: 'Appartement T3 — 12 rue de Béthune, Lille', type: 'Vente' },
  { _id: 'prop-2', title: 'Maison T5 — 45 av. de la République, Marcq-en-Barœul', type: 'Vente' },
  { _id: 'prop-3', title: 'Studio — 8 rue Nationale, Lille', type: 'Location' },
];

// Catégories de service liées à un bien (vente/location). Hors de cette liste : pas de sélecteur.
const PROPERTY_RELATED_CATS = ['visites','estimation','negociation','recherche-bien','analyse-acheteur','photo','dossier-vendeur','recherche-financement','visite-virtuelle','Visites','Estimation','Négociation','Recherche de bien','Analyse acheteur','Prise de photo','Dossier vendeur','Recherche de financement','Visite virtuelle'];

function isPropertyRelated(svc) {
  const c = svc?.category?.id || svc?.category?.name_fr || svc?.category?.name || '';
  if (!c) return true; // par défaut, oui
  return PROPERTY_RELATED_CATS.some(x => x.toLowerCase() === String(c).toLowerCase());
}

export function BuyModal({ svc, lang, onClose, onDone }) {
  const t = T[lang];
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [propertyId, setPropertyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const price = svc.price_ttc ?? svc.price ?? 0;
  const isFree = price === 0;
  const title = lang === "fr" ? (svc.title_fr || svc.title) : (svc.title_en || svc.title);
  const isLogged = !!localStorage.getItem('token');
  const showProperty = isPropertyRelated(svc);

  const handle = async () => {
    setLoading(true);
    try {
      // Création du snapshot contractuel du service
      const service_snapshot = {
        _id: svc._id,
        title_fr: svc.title_fr,
        title_en: svc.title_en,
        title: svc.title,
        description_fr: svc.description_fr,
        description_en: svc.description_en,
        description: svc.description,
        tarification_type: svc.tarification_type,
        price_ttc: svc.price_ttc,
        price: svc.price,
        zone_covered: svc.zone_covered,
        quantity_label: svc.quantity_label,
        quantity: svc.quantity,
        provider: svc.provider,
        // Sections contractuelles
        section_service: lang === "fr" ? (svc.title_fr || svc.title) : (svc.title_en || svc.title),
        section_benefit: lang === "fr" ? t.q1 : T.en.q1,
        section_benefit_text: lang === "fr" ? (svc.description_fr || svc.description) : (svc.description_en || svc.description),
        section_description: lang === "fr" ? t.q2 : T.en.q2,
        section_description_text: lang === "fr" ? (svc.description_fr || svc.description) : (svc.description_en || svc.description),
        section_deliverable: lang === "fr" ? t.q3 : T.en.q3,
        section_deliverable_text: lang === "fr" ? (svc.description_fr || svc.description) : (svc.description_en || svc.description),
        section_billing: lang === "fr" ? t.q4 : T.en.q4,
        section_billing_text: lang === "fr" ? t.payNote : T.en.payNote,
      };
      const payload = {
        service_id: svc._id,
        quantity: qty,
        message: msg || undefined,
        property_id: propertyId || undefined,
        is_booking: isFree ? true : undefined,
        service_snapshot,
      };
      const res = await createOrder(payload, lang);
      const orderId = res?.order?._id || res?._id;
      if (orderId) {
        const ids = JSON.parse(localStorage.getItem("marketplace_order_ids") || "[]");
        if (!ids.includes(orderId)) localStorage.setItem("marketplace_order_ids", JSON.stringify([orderId, ...ids]));
        setFeedback({ type: "success", text: isFree ? t.bookingOk : t.buyOk });
        setTimeout(() => onDone(), 1300);
      } else {
        setFeedback({ type: "error", text: res?.message || t.buyErr });
      }
    } catch { setFeedback({ type: "error", text: t.buyErr }); }
    finally { setLoading(false); }
  };

  // Bloc auth requis (uniquement pour la réservation gratuite : on garde le flow actuel sinon)
  if (isFree && !isLogged) {
    return (
      <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
        <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#47525E]">{t.bookingTitle}</h3>
            <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
          </div>
          <p className="text-sm text-[#47525E] mb-5">{t.loginRequired}</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">{t.cancel}</button>
            <Link to="/login" onClick={onClose} className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full py-2 text-sm font-semibold text-center">
              {t.goLogin}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
      <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[#47525E]">{isFree ? t.bookingTitle : title}</h3>
          <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
        </div>
        {isFree && (
          <p className="text-[12px] text-[#976DD0] bg-[#F2ECF8] rounded-lg px-3 py-2 mb-4">{t.bookingFree}</p>
        )}
        <div className="mb-4">
          <p className="font-semibold text-[#47525E] text-[13px] mb-1">{title}</p>
        </div>
        {!isFree && (
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 block mb-2">{t.qty}</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">−</button>
              <span className="font-bold text-[#47525E] w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">+</button>
            </div>
          </div>
        )}
        {showProperty && (
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 block mb-1">{t.propertyLabel}</label>
            <select
              value={propertyId}
              onChange={e => setPropertyId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#976DD0]"
            >
              <option value="">— {t.noProperty} —</option>
              {MOCK_USER_PROPERTIES.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
            <p className="text-[10px] text-gray-400 mt-1">{t.propertyHint}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-500 block mb-1">{t.msgLabel}</label>
          <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#976DD0] resize-none" value={msg} onChange={e => setMsg(e.target.value)} />
        </div>
        {!isFree && (
          <div className="flex justify-between items-center font-semibold text-sm mb-4 py-3 border-t border-gray-100">
            <span className="text-[#47525E]">Total TTC</span>
            <span className="text-[#976DD0] text-base font-bold">{(price * qty).toFixed(2)} €</span>
          </div>
        )}
        {feedback && (
          <div className={`text-xs px-3 py-2 rounded-lg mb-3 ${feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{feedback.text}</div>
        )}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">{t.cancel}</button>
          <button onClick={handle} disabled={loading} className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] disabled:bg-gray-300 text-white rounded-full py-2 text-sm font-semibold transition-colors">
            {loading ? t.buying : (isFree ? t.confirmBooking : t.confirm)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [lang, setLang] = useState("fr");
  const t = T[lang];
  const user = useSelector((state) => state.user);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [buyModal, setBuyModal] = useState(null);
  const [requestModal, setRequestModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [selectedCats, setSelectedCats] = useState([]);
  const [featuredPros, setFeaturedPros] = useState(MOCK_FEATURED);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState('Lille - 59000');
  const [agentQuery, setAgentQuery] = useState('');
  const [agentSuggestions, setAgentSuggestions] = useState([]);
  const [postalCode, setPostalCode] = useState('59000');
  const [demoMockMode, setDemoMockMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentDropOpen, setAgentDropOpen] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const dropdownRef = useRef(null);
  const agentRef = useRef(null);
  const navigate = useNavigate();

  // Charger les catégories définies par l'admin (fallback sur la liste locale)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getCategories(lang);
        const list = res?.categories || res?.data || res;
        if (!cancelled && Array.isArray(list) && list.length > 0) {
          const normalizeGroup = (g) => {
            const s = String(g || '').toLowerCase();
            if (s.startsWith('trans')) return 'Transaction';
            return 'Service';
          };
          const mapped = list.map(c => ({
            id: c.id || c._id || c.slug || (c.name_fr || c.name || '').toLowerCase().replace(/\s+/g, '-'),
            label: c.label || c.name_fr || c.name || c.title,
            group: normalizeGroup(c.group || c.type || (c.is_transaction ? 'Transaction' : 'Service')),
          })).filter(c => c.label);
          // S'assurer qu'au moins 1 entrée Transaction et 1 Service sont présentes,
          // sinon on garde le fallback local pour ne pas casser l'UX.
          const hasTrans = mapped.some(c => c.group === 'Transaction');
          const hasSvc = mapped.some(c => c.group === 'Service');
          if (mapped.length > 0 && hasTrans && hasSvc) setCategories(mapped);
        }
      } catch { /* fallback DEFAULT_CATEGORIES */ }
    })();
    return () => { cancelled = true; };
  }, [lang]);

  useEffect(() => {
    const handle = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (agentRef.current && !agentRef.current.contains(e.target)) setAgentDropOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    const match = location.match(/\b(\d{5})\b/);
    setPostalCode(match ? match[1] : '');
  }, [location]);

  const fetchFeaturedPros = useCallback(async () => {
    setFeaturedLoading(true);
    try {
      if (demoMockMode) {
        setFeaturedPros(MOCK_FEATURED);
        return;
      }
      const res = await getFavoritePros(postalCode, lang);
      const globals = res?.data?.globalFavorites || [];
      const locals = res?.data?.localFavorites || [];
      const list = [...globals, ...locals].filter((pro, index, self) => self.findIndex(p => p.id === pro.id) === index);
      if (list.length > 0) {
        setFeaturedPros(list);
      }
    } catch (err) {
      console.warn('Unable to load featured pros', err);
    } finally {
      setFeaturedLoading(false);
    }
  }, [demoMockMode, lang, postalCode]);

  useEffect(() => { fetchFeaturedPros(); }, [fetchFeaturedPros]);

  // Debounced agent search
  useEffect(() => {
    if (!agentQuery || agentQuery.length < 2) { setAgentSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await searchProviders(agentQuery, lang);
        const list = res?.services || res?.data || [];
        const seen = new Set();
        const providers = [];
        list.forEach(svc => {
          const name = svc.provider?.name || svc.providerName;
          if (name && !seen.has(name)) { seen.add(name); providers.push({ name, id: svc.provider?._id || name }); }
        });
        setAgentSuggestions(providers);
        setAgentDropOpen(providers.length > 0);
      } catch { setAgentSuggestions([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [agentQuery, lang]);

  const toggleCat = (cat) => {
    setSelectedCats(prev =>
      prev.find(c => c.id === cat.id)
        ? prev.filter(c => c.id !== cat.id)
        : [...prev, cat]
    );
  };
  const removeCat = (id) => setSelectedCats(prev => prev.filter(c => c.id !== id));

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCats.length > 0) params.category = selectedCats.map(c => c.id).join(',');
      if (selectedAgent) params.provider = selectedAgent.id;
      if (location) params.location = location;
      if (demoMockMode) {
        setServices(MOCK_SERVICES);
      } else {
        const res = await getServices(params, lang);
        const list = res?.services || res?.data || [];
        const valid = Array.isArray(list) ? list.filter(s => s?.provider?.name) : [];
        setServices(valid);
      }
    } catch (e) {
      console.error(e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [lang, selectedCats, selectedAgent, demoMockMode, location]);

  const resultsRef = useRef(null);

  const handleViewAgent = (pro) => {
    const agent = { name: pro.name || pro.fullName, id: pro.id || pro._id || pro.providerKey || pro.name };
    setSelectedAgent(agent);
    setAgentQuery(agent.name);
    setSelectedCats([]);
    fetchServices();
    // Scroll vers les résultats
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => { fetchServices(); }, [fetchServices]);

  return (
    <PageLayout>
      <div className="bg-[#f3f5f9] min-h-full py-[22px] px-[22px] pb-24">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="font-bold text-black text-[24px]">{t.featuredTitle}</h2>
          <button
            onClick={() => setDemoMockMode(prev => !prev)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${demoMockMode ? 'bg-[#FDE68A] text-[#92400E]' : 'bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB]'}`}
          >
            {demoMockMode ? 'Mock activé' : 'Afficher mock'}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-7">
          {(featuredPros.length > 0 ? featuredPros : MOCK_FEATURED).map(pro => <FeaturedCard key={pro.id || pro._id} pro={pro} lang={lang} onViewAgent={handleViewAgent} />)}
        </div>
        <h1 ref={resultsRef} className="font-bold text-black text-[24px]">{t.pageTitle}</h1>
        <p className="text-[14px] text-gray-400 mb-4">{t.pageSub}</p>
        <div ref={dropdownRef} className="relative bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 mb-3">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Label */}
            <span className="flex items-center gap-1 text-[14px] text-gray-400 shrink-0">
              <MdSearch size={18} /> {t.helpLabel}
            </span>
            {/* Chips sélectionnés */}
            {selectedCats.length === 0 && (
              <span className="bg-gray-100 border border-gray-200 text-gray-400 text-[13px] px-3 py-1 rounded-full">Choisir un service</span>
            )}
            {selectedCats.slice(0, 2).map(c => (
              <span key={c.id} className="flex items-center gap-1 bg-[#F2ECF8] text-[#976DD0] text-[12px] font-semibold px-3 py-1 rounded-full">
                {c.label}
                <button onClick={() => removeCat(c.id)} className="text-[#976DD0] hover:text-[#7d55b5] leading-none ml-0.5">&times;</button>
              </span>
            ))}
            {selectedCats.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-[12px] font-semibold px-2.5 py-1 rounded-full">+{selectedCats.length - 2}</span>
            )}
            {/* Flèche dropdown */}
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="w-7 h-7 rounded-full bg-[#47525E] text-white flex items-center justify-center hover:bg-[#343F4B] transition-colors shrink-0"
            >
              <MdKeyboardArrowDown size={20} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            {/* Séparateur */}
            <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />
            {/* Localisation */}
            <div className="flex items-center gap-1.5 shrink-0">
              <MdLocationOn size={22} className="text-[#976DD0]" />
              <span className="text-[13px] text-gray-400">à</span>
              <div className="w-[160px]">
                <CityAutocomplete
                  value={location}
                  onChange={setLocation}
                  onSelect={(p) => setLocation(p.city || p.formatted)}
                  placeholder="Ville ou code postal"
                  className="text-[13px] text-[#47525E] font-medium bg-transparent border-0 border-b border-gray-300 focus:border-[#976DD0] focus:outline-none w-full pb-0.5"
                />
              </div>
            </div>
            {/* Séparateur */}
            <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />
            {/* Recherche agent */}
            <div ref={agentRef} className="relative flex items-center gap-1.5 shrink-0">
              <MdPerson size={20} className="text-[#976DD0]" />
              <input
                type="text"
                value={agentQuery}
                onChange={e => { setAgentQuery(e.target.value); setSelectedAgent(null); }}
                onFocus={() => agentSuggestions.length > 0 && setAgentDropOpen(true)}
                placeholder="Nom du professionnel"
                className="text-[13px] text-[#47525E] font-medium bg-transparent border-0 border-b border-gray-300 focus:border-[#976DD0] focus:outline-none w-[180px] pb-0.5"
              />
              {agentQuery && (
                <button onClick={() => { setAgentQuery(''); setSelectedAgent(null); setAgentSuggestions([]); }} className="text-gray-300 hover:text-gray-500 text-base leading-none">&times;</button>
              )}
              {agentDropOpen && agentSuggestions.length > 0 && (
                <div className="absolute left-0 top-full mt-1 z-40 bg-white rounded-xl border border-gray-200 shadow-lg py-1 min-w-[200px]">
                  {agentSuggestions.map(p => (
                    <button
                      key={p.id}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setSelectedAgent(p); setAgentQuery(p.name); setAgentDropOpen(false); }}
                      className="w-full text-left px-4 py-2 text-[13px] text-[#47525E] hover:bg-[#F2ECF8] hover:text-[#976DD0] transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1" />
            {/* Bouton recherche */}
            <button onClick={fetchServices} className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-[13px] font-semibold px-5 py-2 rounded-lg transition-colors shrink-0">
              {t.showBtn}
            </button>
          </div>
          {/* Panneau dropdown */}
          {dropdownOpen && (() => {
            const transactionCats = categories.filter(c => c.group === 'Transaction');
            const serviceCats = categories.filter(c => c.group === 'Service');
            const activeTrans = selectedCats.filter(c => c.group === 'Transaction');
            const allowedSvcIds = new Set(
              activeTrans.flatMap(c => TRANSACTION_TO_SERVICES[c.id] || [])
            );
            const visibleServices = activeTrans.length === 0
              ? []
              : serviceCats.filter(s => allowedSvcIds.size === 0 || allowedSvcIds.has(s.id));
            return (
              <div className="absolute left-0 top-full mt-2 z-30 bg-white rounded-xl border border-gray-200 shadow-lg p-5 w-full">
                {/* Transactions */}
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Transaction</p>
                  <div className="flex flex-wrap gap-2">
                    {transactionCats.map(cat => {
                      const active = selectedCats.find(c => c.id === cat.id);
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCat(cat)}
                          className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                            active
                              ? 'bg-[#976DD0] text-white border-[#976DD0]'
                              : 'bg-white text-[#47525E] border-gray-200 hover:border-[#976DD0] hover:text-[#976DD0]'
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Services liés aux transactions sélectionnées */}
                {activeTrans.length > 0 && visibleServices.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service</p>
                    <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto pr-1">
                      {visibleServices.map(cat => {
                        const active = selectedCats.find(c => c.id === cat.id);
                        return (
                          <button
                            key={cat.id}
                            onClick={() => toggleCat(cat)}
                            className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                              active
                                ? 'bg-[#976DD0] text-white border-[#976DD0]'
                                : 'bg-white text-[#47525E] border-gray-200 hover:border-[#976DD0] hover:text-[#976DD0]'
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex justify-end mt-3 pt-3 border-t border-gray-100 gap-2">
                  <button onClick={() => { setSelectedCats([]); setDropdownOpen(false); }} className="text-[12px] text-gray-400 hover:text-gray-600 px-3 py-1.5">Réinitialiser</button>
                  <button onClick={() => setDropdownOpen(false)} className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-[12px] font-semibold px-5 py-1.5 rounded-lg transition-colors">Valider la sélection</button>
                </div>
              </div>
            );
          })()}
        </div>
        {!loading && services.length > 0 && (
          <h2 className="text-center font-bold text-black text-[20px] mt-8 mb-5">{t.results(services.length)}</h2>
        )}
        {loading ? (
          <div className="text-center py-20 text-gray-400">{t.loading}</div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-400">{t.noResult}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map(svc => (
              <ServiceCard key={svc._id} svc={svc} lang={lang} onView={setViewModal} onBuy={setBuyModal} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <p className="text-[14px] text-gray-500 mb-3">{t.notFound}</p>
          <button
            onClick={() => {
              const isLogged = !!(user && (user._id || user.id)) || !!localStorage.getItem('token');
              if (!isLogged) setAuthModal(true);
              else setRequestModal(true);
            }}
            className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-[13px] font-semibold px-8 py-2.5 rounded-full transition-colors"
          >
            {t.request}
          </button>
        </div>
      </div>
      {viewModal && (
        <ServiceModal svc={viewModal} lang={lang} onClose={() => setViewModal(null)} onBuy={(svc) => { setViewModal(null); setBuyModal(svc); }} />
      )}
      {buyModal && (
        <BuyModal svc={buyModal} lang={lang} onClose={() => setBuyModal(null)} onDone={() => { setBuyModal(null); navigate('/marketplace/orders'); }} />
      )}
      {authModal && <AuthRequiredModal onClose={() => setAuthModal(false)} />}
      {requestModal && <ServiceRequestModal user={user} lang={lang} categories={categories} onClose={() => setRequestModal(false)} />}
      </div>
    </PageLayout>
  );
}
