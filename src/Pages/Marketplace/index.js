import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MdSearch, MdLocationOn, MdKeyboardArrowDown, MdPerson } from 'react-icons/md';
import { getServices, createOrder, searchProviders } from '../../methods/api/marketplaceApi';
import PageLayout from '../../components/global/PageLayout';

const T = {
  fr: {
    featuredTitle: "Nos agents favoris pour vous accompagner sans commission",
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

const CATEGORIES = [
  { id: 'vente',            label: 'Vendre',                  group: 'Transaction' },
  { id: 'achat',            label: 'Acheter',                 group: 'Transaction' },
  { id: 'location',         label: 'Louer',                   group: 'Transaction' },
  { id: 'estimation',       label: 'Estimer',                 group: 'Transaction' },
  { id: 'administratif',    label: "L'administratif",         group: 'Service' },
  { id: 'commercialisation',label: 'La commercialisation',    group: 'Service' },
  { id: 'photo',            label: 'La prise de photo',       group: 'Service' },
  { id: 'redaction',        label: "La rédaction d'annonce",  group: 'Service' },
  { id: 'juridique',        label: 'Le juridique',            group: 'Service' },
];

const MOCK_FEATURED = [
  {
    id: 1,
    name: "Geoffroy Papelier",
    providerKey: "geoffroy-papelier",
    tag: "Sécuriser la vente de votre bien",
    headline: "Votre expert local pour sécuriser la réussite de votre projet immobilier",
    description: "Geoffroy Papelier, conseiller immobilier iAD à Lille et ses alentours, vous accompagne avec une expertise locale et des solutions concrètes pour faire avancer votre projet immobilier. Estimation, accompagnement, conseils ou mise en vente : découvrez ses services à la carte selon vos besoins.",
    stats: [
      { value: "10+", label: "Années d'expérience" },
      { value: "50",  label: "Clients accompagnés" },
      { value: "4,9/5", label: "25 avis clients" },
      { value: "100%", label: "Clients accompagnés" },
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
    description: "Michaël Fournet, conseiller immobilier iad à Lille et sa région, maîtrise parfaitement les spécificités de ce marché dynamique. De l'estimation précise à l'accompagnement transactionnel, ses services s'adaptent exactement à votre projet. Consultez sa page AnyHomes pour sélectionner l'expertise qui accélère votre projet.",
    stats: [
      { value: "10+", label: "Années d'expérience" },
      { value: "50",  label: "Clients accompagnés" },
      { value: "4,9/5", label: "25 avis clients" },
      { value: "100%", label: "Clients accompagnés" },
    ],
    photo: "/assets/img/agent-michael-fournet.jpg.jpg",
    photoBg: "from-gray-300 to-gray-400",
    phone: "+33 6 98 76 54 32",
  },
];

const MOCK_SERVICES = [
  // Geoffroy Papelier
  { _id: 'mock-gp-1', providerKey: 'geoffroy-papelier', provider: { name: 'Geoffroy Papelier', role: 'Conseiller iAD', city: 'Lille' }, category: { name_fr: 'Commercialisation' }, title_fr: 'Estimation immobilière de votre bien', title_en: 'Property valuation', price_ttc: 0, tarification_type: 'Offert', zone_covered: 'Lille +10 KM', quantity_label: '1 rapport d’estimation', rating: 4.9, reviewCount: 25 },
  { _id: 'mock-gp-2', providerKey: 'geoffroy-papelier', provider: { name: 'Geoffroy Papelier', role: 'Conseiller iAD', city: 'Lille' }, category: { name_fr: 'Commercialisation' }, title_fr: 'Mise en vente complète avec suivi', title_en: 'Full sale management', price_ttc: 1500, tarification_type: 'Forfait', zone_covered: 'Lille +10 KM', quantity_label: 'De la mise en ligne à la signature', rating: 4.9, reviewCount: 18 },
  { _id: 'mock-gp-3', providerKey: 'geoffroy-papelier', provider: { name: 'Geoffroy Papelier', role: 'Conseiller iAD', city: 'Lille' }, category: { name_fr: 'Photo & visite virtuelle' }, title_fr: 'Séance photo professionnelle', title_en: 'Professional photo shoot', price_ttc: 120, tarification_type: 'Forfait', zone_covered: 'Lille +10 KM', quantity_label: '20 photos HD', rating: 4.8, reviewCount: 12 },
  { _id: 'mock-gp-4', providerKey: 'geoffroy-papelier', provider: { name: 'Geoffroy Papelier', role: 'Conseiller iAD', city: 'Lille' }, category: { name_fr: 'Administratif' }, title_fr: 'Préparation du dossier de vente', title_en: 'Sale file preparation', price_ttc: 80, tarification_type: 'Forfait', zone_covered: 'Lille +10 KM', quantity_label: '1 dossier complet', rating: 5, reviewCount: 8 },
  // Michaël Fournet
  { _id: 'mock-mf-1', providerKey: 'michael-fournet', provider: { name: 'Michaël Fournet', role: 'Conseiller iad', city: 'Lille' }, category: { name_fr: 'Estimation' }, title_fr: 'Estimation précise de marché', title_en: 'Precise market appraisal', price_ttc: 0, tarification_type: 'Offert', zone_covered: 'Métropole lilloise', quantity_label: '1 rapport d’expertise', rating: 4.9, reviewCount: 30 },
  { _id: 'mock-mf-2', providerKey: 'michael-fournet', provider: { name: 'Michaël Fournet', role: 'Conseiller iad', city: 'Lille' }, category: { name_fr: 'Commercialisation' }, title_fr: 'Rédaction & diffusion d’annonce', title_en: 'Listing writing & distribution', price_ttc: 50, tarification_type: 'Forfait', zone_covered: 'Métropole lilloise', quantity_label: '1 annonce multi-portails', rating: 4.9, reviewCount: 22 },
  { _id: 'mock-mf-3', providerKey: 'michael-fournet', provider: { name: 'Michaël Fournet', role: 'Conseiller iad', city: 'Lille' }, category: { name_fr: 'Visite & accompagnement' }, title_fr: 'Organisation et conduite des visites', title_en: 'Visit scheduling & hosting', price_ttc: 300, tarification_type: 'Forfait', zone_covered: 'Métropole lilloise', quantity_label: 'Pack 10 visites', rating: 4.8, reviewCount: 15 },
  { _id: 'mock-mf-4', providerKey: 'michael-fournet', provider: { name: 'Michaël Fournet', role: 'Conseiller iad', city: 'Lille' }, category: { name_fr: 'Juridique' }, title_fr: 'Accompagnement compromis & acte', title_en: 'Contract & deed assistance', price_ttc: 200, tarification_type: 'Forfait', zone_covered: 'Métropole lilloise', quantity_label: 'De l’offre à l’acte', rating: 5, reviewCount: 10 },
];

function ContactModal({ pro, onClose }) {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-[320px] p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-[#47525E]">Contacter {pro.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="flex flex-col gap-3">
          {/* Option 1 : Messagerie */}
          <a
            href="/chat"
            className="flex items-center gap-3 border border-[#976DD0] rounded-xl px-4 py-3 hover:bg-[#F2ECF8] transition-colors"
          >
            <span className="text-[#976DD0] text-xl">💬</span>
            <div>
              <p className="text-[13px] font-semibold text-[#976DD0]">Messagerie de l'app</p>
              <p className="text-[11px] text-gray-400">Envoyer un message via AnyHomes</p>
            </div>
          </a>
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
  return (
    <>
    {showContact && <ContactModal pro={pro} onClose={() => setShowContact(false)} />}
    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ minHeight: '270px' }}>
      {/* Photo plein fond */}
      {pro.photo
        ? <img src={pro.photo} alt={pro.name} className="absolute inset-0 w-full h-full object-cover object-top" />
        : <div className={`absolute inset-0 bg-gradient-to-br ${pro.photoBg}`} />
      }
      {/* Layer blanc transparent sur les 2/3 gauche */}
      <div className="absolute inset-y-0 left-0 bg-white/80" style={{ width: '66.666%' }} />
      {/* Contenu texte */}
      <div className="relative z-10 flex flex-col justify-between h-full p-5" style={{ minHeight: '270px', width: '66.666%' }}>
        <div>
          <p className="font-bold text-black text-[11px] mb-1">{pro.tag}</p>
          <h2 className="text-[#976DD0] font-bold text-[14px] leading-snug mb-2">
            {pro.headline}
          </h2>
          <p className="text-[11px] text-black leading-tight line-clamp-3">{pro.description}</p>
        </div>
        {/* Stats */}
        <div className="flex gap-4 my-2">
          {pro.stats.map((s, i) => (
            <div key={i}>
              <p className="text-[16px] font-bold text-black leading-none">{s.value}</p>
              <p className="text-[10px] text-black mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        {/* Boutons */}
        <div className="flex gap-2">
          <button onClick={() => setShowContact(true)} className="border border-[#976DD0] text-[#976DD0] rounded-full px-4 py-1.5 text-[11px] font-semibold hover:bg-[#F2ECF8] transition-colors">
            Contacter
          </button>
          <button onClick={() => onViewAgent && onViewAgent(pro)} className="bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full px-4 py-1.5 text-[11px] font-semibold transition-colors">
            Voir ses services à la carte
          </button>
        </div>
      </div>
      {/* Nom de l'agent — bas droite sur la photo */}
      <p className="absolute bottom-3 right-3 z-10 text-white font-bold text-sm drop-shadow-md">{pro.name}</p>
    </div>
    </>
  );
}

function ServiceCard({ svc, lang, onView, onBuy }) {
  const t = T[lang];
  const [saved, setSaved] = useState(false);
  const title = lang === "fr" ? (svc.title_fr || svc.title) : (svc.title_en || svc.title);
  const cat = svc.category?.name_fr || svc.category?.name || "";
  const price = svc.price_ttc ?? svc.price ?? 0;
  const provName = svc.provider?.name || "Pauline Dupont";
  const provRole = svc.provider?.role || "Agent indépendant IAD";
  const provCity = svc.city || svc.provider?.city || "Lille";
  const tarif = svc.tarification_type || "Forfait";
  const zone = svc.zone_covered || (svc.city ? `${svc.city} +5 KM` : "Lille +5 KM");
  const qty = svc.quantity_label || svc.quantity || "Pack 10 visites";

  return (
    <div className="bg-white border border-[#D5D5D5] rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span className="bg-[#343F4B] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm">{t.topAgent}</span>
        <button onClick={() => setSaved(s => !s)} className={`text-lg transition-colors ${saved ? "text-[#976DD0]" : "text-gray-300 hover:text-[#976DD0]"}`}>
          {saved ? "★" : "☆"}
        </button>
      </div>
      <div className="px-3 pb-3 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {provName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#47525E] text-[13px] truncate">{provName}</p>
            <p className="text-[11px] text-gray-400 truncate">{provRole} • {provCity}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-500 mb-2">
          <span>📅 20 {t.exp}</span>
          <Stars value={5} size={10} /> <span>5/5</span>
          <span>🔄 250 {t.services}</span>
          <span>💬 150 {t.reviews}</span>
        </div>
        {cat && (
          <span className="inline-block bg-[#F2ECF8] text-[#976DD0] text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 self-start">{cat}</span>
        )}
        <p className="font-semibold text-[#47525E] text-[13px] mb-2 line-clamp-2">{title}</p>
        <div className="space-y-0.5 text-[11px] text-gray-500 mb-3 flex-1">
          <div className="flex items-center gap-1.5"><span className="text-[#976DD0] font-bold">⊙</span><span>{tarif}</span></div>
          <div className="flex items-center gap-1.5"><span className="text-[#976DD0]">📍</span><span>{zone}</span></div>
          <div className="flex items-center gap-1.5"><span className="text-[#976DD0] font-bold">#</span><span>{qty}</span></div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button onClick={() => onView(svc)} className="text-[11px] border border-[#976DD0] text-[#976DD0] rounded-full px-3 py-1 hover:bg-[#F2ECF8] transition-colors">
            {t.contact}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#976DD0] text-[13px]">{price > 0 ? `${price} €` : t.free}</span>
            <button onClick={() => onBuy(svc)} className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors">
              {price > 0 ? t.buy : t.book}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceModal({ svc, lang, onClose, onBuy }) {
  const t = T[lang];
  const title = lang === "fr" ? (svc.title_fr || svc.title) : (svc.title_en || svc.title);
  const desc = lang === "fr" ? (svc.description_fr || svc.description) : (svc.description_en || svc.description);
  const price = svc.price_ttc ?? svc.price ?? 0;
  const provName = svc.provider?.name || "Pauline Dupont";
  const provCity = svc.city || "Lille";
  const tarif = svc.tarification_type || "Forfait";
  const zone = svc.zone_covered || (svc.city ? `${svc.city} <5 km` : "Lille <5 km");
  const qty = svc.quantity_label || svc.quantity || "Pack 10 visites";
  const sections = [
    { icon: "💡", title: t.q1, text: desc },
    { icon: "📋", title: t.q2, text: desc },
    { icon: "✅", title: t.q3, text: desc },
    { icon: "🔒", title: t.q4, text: t.payNote },
  ];
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4 flex flex-col">
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
              {[{icon:"⊙",label:tarif},{icon:"📍",label:zone},{icon:"#",label:qty}].filter(s=>s.label).map((s,i)=>(
                <span key={i} className="flex items-center gap-1.5 bg-[#F2ECF8] text-[#976DD0] text-[11px] font-medium px-3 py-1 rounded-full">
                  {s.icon} {s.label}
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
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button className="border border-[#976DD0] text-[#976DD0] text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#F2ECF8] transition-colors">
            Contacter {provName.split(" ")[0]}
          </button>
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#47525E] text-sm">{price > 0 ? `${price} € T.T.C` : t.free}</span>
            <button onClick={() => onBuy(svc)} className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors">
              {price > 0 ? t.buy : t.book}
            </button>
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
const PROPERTY_RELATED_CATS = ['vente','location','estimation','administratif','commercialisation','photo','redaction','juridique','Commercialisation','Estimation','Administratif','Photo & visite virtuelle','Visite & accompagnement','Juridique'];

function isPropertyRelated(svc) {
  const c = svc?.category?.id || svc?.category?.name_fr || svc?.category?.name || '';
  if (!c) return true; // par défaut, oui
  return PROPERTY_RELATED_CATS.some(x => x.toLowerCase() === String(c).toLowerCase());
}

function BuyModal({ svc, lang, onClose, onDone }) {
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
      const payload = {
        service_id: svc._id,
        quantity: qty,
        message: msg || undefined,
        property_id: propertyId || undefined,
        is_booking: isFree ? true : undefined,
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
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#47525E]">{t.bookingTitle}</h3>
            <button onClick={onClose} className="text-gray-400 text-lg">✕</button>
          </div>
          <p className="text-sm text-[#47525E] mb-5">{t.loginRequired}</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 border border-gray-300 rounded-full py-2 text-sm text-[#47525E]">{t.cancel}</button>
            <a href="/login" className="flex-1 bg-[#976DD0] hover:bg-[#7d55b5] text-white rounded-full py-2 text-sm font-semibold text-center">
              {t.goLogin}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [buyModal, setBuyModal] = useState(null);
  const [selectedCats, setSelectedCats] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState('Lille - 59000');
  const [agentQuery, setAgentQuery] = useState('');
  const [agentSuggestions, setAgentSuggestions] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentDropOpen, setAgentDropOpen] = useState(false);
  const dropdownRef = useRef(null);
  const agentRef = useRef(null);

  useEffect(() => {
    const handle = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (agentRef.current && !agentRef.current.contains(e.target)) setAgentDropOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

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
      const res = await getServices(params, lang);
      let list = res?.services || res?.data || [];
      // Si un agent est sélectionné, forcer les mocks filtrés (l'API ne filtre pas encore par agent)
      if (selectedAgent) {
        list = MOCK_SERVICES.filter(s => s.provider?.name === selectedAgent.name);
      } else if (list.length === 0) {
        list = MOCK_SERVICES;
      }
      setServices(list);
    } catch (e) {
      console.error(e);
      setServices(selectedAgent
        ? MOCK_SERVICES.filter(s => s.provider?.name === selectedAgent.name)
        : MOCK_SERVICES
      );
    }
    finally { setLoading(false); }
  }, [lang, selectedCats, selectedAgent]);

  const resultsRef = useRef(null);

  const handleViewAgent = (pro) => {
    const agent = { name: pro.name, id: pro.providerKey };
    setSelectedAgent(agent);
    setAgentQuery(pro.name);
    setSelectedCats([]);
    // Forcer directement les services filtrés sans attendre le fetch asynchrone
    const filtered = MOCK_SERVICES.filter(s => s.provider?.name === pro.name);
    setServices(filtered);
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
        <h2 className="font-bold text-[#47525E] text-[15px] mb-3">{t.featuredTitle}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-7">
          {MOCK_FEATURED.map(pro => <FeaturedCard key={pro.id} pro={pro} lang={lang} onViewAgent={handleViewAgent} />)}
        </div>
        <h1 ref={resultsRef} className="font-bold text-[#47525E] text-[17px]">{t.pageTitle}</h1>
        <p className="text-[13px] text-gray-400 mb-4">{t.pageSub}</p>
        <div ref={dropdownRef} className="relative bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 mb-3">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Label */}
            <span className="flex items-center gap-1 text-[13px] text-gray-400 shrink-0">
              <MdSearch size={18} /> {t.helpLabel}
            </span>
            {/* Chips sélectionnés */}
            {selectedCats.length === 0 && (
              <span className="bg-[#F2ECF8] text-[#976DD0] text-[12px] font-semibold px-3 py-1 rounded-full">Toute la transaction</span>
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
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ville ou code postal"
                className="text-[13px] text-[#47525E] font-medium bg-transparent border-0 border-b border-gray-300 focus:border-[#976DD0] focus:outline-none w-[140px] pb-0.5"
              />
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
                placeholder="Nom de l'agent"
                className="text-[13px] text-[#47525E] font-medium bg-transparent border-0 border-b border-gray-300 focus:border-[#976DD0] focus:outline-none w-[140px] pb-0.5"
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
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-2 z-30 bg-white rounded-xl border border-gray-200 shadow-lg p-5 w-full">
              {['Transaction', 'Service'].map(group => (
                <div key={group} className="mb-4 last:mb-0">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.filter(c => c.group === group).map(cat => {
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
              ))}
              <div className="flex justify-end mt-3 pt-3 border-t border-gray-100 gap-2">
                <button onClick={() => { setSelectedCats([]); setDropdownOpen(false); }} className="text-[12px] text-gray-400 hover:text-gray-600 px-3 py-1.5">Réinitialiser</button>
                <button onClick={() => setDropdownOpen(false)} className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-[12px] font-semibold px-5 py-1.5 rounded-lg transition-colors">Valider la sélection</button>
              </div>
            </div>
          )}
        </div>
        {!loading && services.length > 0 && (
          <p className="text-[13px] text-gray-500 mb-4">{t.results(services.length)}</p>
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
          <p className="text-[13px] text-gray-500 mb-3">{t.notFound}</p>
          <button className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-[13px] font-semibold px-8 py-2.5 rounded-full transition-colors">
            {t.request}
          </button>
        </div>
      </div>
      {viewModal && (
        <ServiceModal svc={viewModal} lang={lang} onClose={() => setViewModal(null)} onBuy={(svc) => { setViewModal(null); setBuyModal(svc); }} />
      )}
      {buyModal && (
        <BuyModal svc={buyModal} lang={lang} onClose={() => setBuyModal(null)} onDone={() => { setBuyModal(null); window.location.href = "/marketplace/orders"; }} />
      )}
      </div>
    </PageLayout>
  );
}
