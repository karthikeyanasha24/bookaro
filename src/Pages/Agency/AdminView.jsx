import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft, FaBuilding, FaUser, FaListCheck,
  FaHouse, FaMoneyBillWave, FaChartBar, FaStar,
  FaEnvelope, FaPhone, FaEarthEurope, FaClock,
  FaCircleCheck, FaCircleXmark, FaEye, FaCreditCard,
} from "react-icons/fa6";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (date) =>
  date
    ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
    : "—";
const fmtEur = (n) => (n !== undefined && n !== null ? `${Number(n).toLocaleString("fr-FR")} €` : "—");

function Badge({ label, color = "bg-gray-100 text-gray-700", className = "" }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color} ${className}`}>
      {label}
    </span>
  );
}

function KpiCard({ icon, label, value, color = "bg-purple-50 text-purple-700" }) {
  return (
    <div className={`rounded-xl p-4 flex items-center gap-3 ${color} shadow-sm`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold leading-tight">{value}</div>
        <div className="text-xs opacity-70 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-5 border-b border-gray-100 pb-1">
      {children}
    </h3>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="w-48 shrink-0 text-xs text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 break-words">{value ?? "—"}</span>
    </div>
  );
}

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  blocked: "bg-gray-200 text-gray-700",
};

const SUB_STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  trialing: "bg-blue-100 text-blue-700",
  past_due: "bg-orange-100 text-orange-700",
  canceled: "bg-red-100 text-red-600",
  cancelled: "bg-red-100 text-red-600",
  unpaid: "bg-red-200 text-red-700",
  incomplete: "bg-yellow-100 text-yellow-700",
  incomplete_expired: "bg-gray-100 text-gray-500",
  paused: "bg-gray-100 text-gray-600",
};

const SUB_STATUS_LABELS = {
  active: "Actif",
  trialing: "Essai",
  past_due: "En retard",
  canceled: "Résilié",
  cancelled: "Résilié",
  unpaid: "Impayé",
  incomplete: "Incomplet",
  incomplete_expired: "Expiré",
  paused: "En pause",
};

const INTERVAL_LABELS = { month: "Mensuel", year: "Annuel" };

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "--";
  const n = Number(value);
  return Number.isNaN(n) ? String(value)
    : new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
};

function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
      <div className="font-semibold text-gray-600">{title}</div>
      <div className="mt-1">{description}</div>
    </div>
  );
}

const ORDER_STATUS_COLORS = {
  paid: "bg-green-100 text-green-700",
  accepted_by_pro: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  delivered_by_pro: "bg-indigo-100 text-indigo-700",
  confirmed_by_buyer: "bg-teal-100 text-teal-700",
  payout_released: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
  pending_payment: "bg-orange-100 text-orange-700",
  payment_failed: "bg-red-200 text-red-800",
  cancellation_requested: "bg-pink-100 text-pink-700",
  litigation_opened: "bg-red-300 text-red-900",
};

const ORDER_STATUS_LABELS = {
  paid: "Payé",
  accepted_by_pro: "Accepté",
  in_progress: "En cours",
  delivered_by_pro: "Livré",
  confirmed_by_buyer: "Confirmé",
  payout_released: "Versé",
  cancelled: "Annulé",
  refunded: "Remboursé",
  pending_payment: "Paiement en attente",
  payment_failed: "Échec paiement",
  cancellation_requested: "Annulation demandée",
  litigation_opened: "Litige ouvert",
};

const SERVICE_STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  inactive: "bg-gray-100 text-gray-500",
  deleted: "bg-red-100 text-red-700",
};

const TABS = [
  { id: "general", label: "Général", icon: <FaUser /> },
  { id: "profil", label: "Profil entreprise", icon: <FaBuilding /> },
  { id: "biens", label: "Les biens immo", icon: <FaHouse /> },
  { id: "services", label: "Services à la carte", icon: <FaListCheck /> },
  { id: "transactions", label: "Les transactions", icon: <FaMoneyBillWave /> },
  { id: "marketplace", label: "MarketPlace", icon: <FaChartBar /> },
  { id: "abonnement", label: "Abonnement", icon: <FaCreditCard /> },
];

export default function CompanyAdminView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionActive, setSubscriptionActive] = useState(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [plans, setPlans] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignPlanId, setAssignPlanId] = useState("");
  const [assignMsg, setAssignMsg] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = () => {
    setLoading(true);
    setError(null);
    loader(true);
    Promise.allSettled([
      ApiClient.get(`user/admin/company-detail/${id}`),
      ApiClient.get("subscription/list", { userId: id }),
      ApiClient.get("plan/listing", { status: "active", isDeleted: false }),
    ]).then(([companyRes, subscriptionRes, plansRes]) => {
      if (companyRes.status === "fulfilled" && companyRes.value?.success) {
        setApiData(companyRes.value.data);
      } else {
        setError("Company introuvable.");
      }
      if (subscriptionRes.status === "fulfilled" && subscriptionRes.value?.success) {
        setSubscriptionActive(subscriptionRes.value.active || null);
        setSubscriptionHistory(Array.isArray(subscriptionRes.value.data) ? subscriptionRes.value.data : []);
      }
      if (plansRes.status === "fulfilled" && plansRes.value?.success) {
        const allPlans = plansRes.value.data || plansRes.value.list || [];
        setPlans(Array.isArray(allPlans) ? allPlans : []);
      }
    }).catch(() => setError("Erreur de chargement."))
      .finally(() => {
        setLoading(false);
        loader(false);
      });
  };

  const handleAssignPlan = async () => {
    if (!assignPlanId) return;
    setAssignLoading(true);
    setAssignMsg(null);
    try {
      const selectedPlan = plans.find((p) => p._id === assignPlanId);
      const res = await ApiClient.put("user/edit", {
        id,
        planId: assignPlanId,
        planType: selectedPlan?.planType || "free",
      });
      if (res?.success) {
        setAssignMsg({ type: "success", text: `Plan "${selectedPlan?.name}" assigné avec succès.` });
        loadData();
      } else {
        setAssignMsg({ type: "error", text: "Échec de l'assignation." });
      }
    } catch {
      setAssignMsg({ type: "error", text: "Erreur réseau." });
    } finally {
      setAssignLoading(false);
    }
  };

  // ─── helpers de rendu ─────────────────────────────────────────────────────

  const renderGeneral = () => {
    const u = apiData.user;
    return (
      <div className="max-w-3xl space-y-0">
        <div className="flex items-center gap-6 mb-6">
          {u.companyLogo ? (
            <img
              src={methodModel.noImg(u.companyLogo)}
              className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow"
              alt="Logo"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-purple-100 flex items-center justify-center text-3xl text-purple-400">
              <FaBuilding />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {u.companyName || u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "—"}
            </h2>
            <p className="text-sm text-gray-400">{u.email}</p>
            <div className="flex gap-2 mt-1">
              <Badge
                label={u.status || "inconnu"}
                color={STATUS_COLORS[u.status] || "bg-gray-100 text-gray-600"}
              />
              <Badge label={u.role} color="bg-indigo-100 text-indigo-700" />
              {u.accountType && (
                <Badge label={u.accountType} color="bg-sky-100 text-sky-700" />
              )}
            </div>
          </div>
        </div>

        <SectionTitle>Identité</SectionTitle>
        <Row label="Prénom" value={u.firstName} />
        <Row label="Nom" value={u.lastName} />
        <Row label="Nom complet" value={u.fullName} />
        <Row label="Nom de la société" value={u.companyName} />
        <Row label="Numéro d'enregistrement" value={u.registrationNumber} />
        <Row label="Rôle" value={u.role} />
        <Row label="Type de compte" value={u.accountType} />
        <Row label="Statut" value={u.status} />
        <Row label="Membre depuis" value={fmt(u.createdAt)} />

        <SectionTitle>Contact</SectionTitle>
        <Row
          label="Email principal"
          value={u.email ? (
            <a href={`mailto:${u.email}`} className="text-purple-700 hover:underline flex items-center gap-1">
              <FaEnvelope className="text-xs" /> {u.email}
            </a>
          ) : null}
        />
        <Row
          label="Email société"
          value={u.companyEmail ? (
            <a href={`mailto:${u.companyEmail}`} className="text-purple-700 hover:underline flex items-center gap-1">
              <FaEnvelope className="text-xs" /> {u.companyEmail}
            </a>
          ) : null}
        />
        <Row
          label="Téléphone"
          value={u.mobileNo ? `${u.dialCode || ""} ${u.mobileNo}` : null}
        />
        <Row
          label="Tél. société"
          value={u.companyContactNumber}
        />

        <SectionTitle>Adresse</SectionTitle>
        <Row label="Adresse" value={u.address} />
        <Row label="Ville" value={u.city} />
        <Row label="Code postal" value={u.pinCode} />
        <Row label="Pays" value={u.country} />

        <SectionTitle>Abonnement & Paiement</SectionTitle>
        <Row label="Plan" value={u.planId?.name} />
        <Row label="Type de plan" value={u.planType} />
        <Row label="Durée" value={u.planDuration} />
        <Row
          label="Stripe Connect actif"
          value={
            u.stripeConnectActive ? (
              <FaCircleCheck className="text-green-500" />
            ) : (
              <FaCircleXmark className="text-red-400" />
            )
          }
        />
        <Row label="Stripe Connect ID" value={u.stripeConnectAccountId} />

        <SectionTitle>Vérification</SectionTitle>
        <Row label="Email vérifié" value={u.isVerified === "Y" ? "Oui" : "Non"} />
        <Row label="Documents vérifiés" value={u.docVerified === "Y" ? "Oui" : "Non"} />
        <Row
          label="Bloqué"
          value={u.isBlocked ? <Badge label="Bloqué" color="bg-red-100 text-red-700" /> : "Non"}
        />
      </div>
    );
  };

  const renderProfil = () => {
    const p = apiData.companyProfile;
    const u = apiData.user;
    return (
      <div className="max-w-3xl">
        {u.coverImage && (
          <div className="mb-5 rounded-xl overflow-hidden h-48 bg-gray-100">
            <img
              src={methodModel.noImg(u.coverImage)}
              className="w-full h-full object-cover"
              alt="Cover"
            />
          </div>
        )}

        <SectionTitle>Description</SectionTitle>
        <Row label="Accroche (tagline)" value={p.tagline} />
        <Row label="À propos" value={p.about} />
        <Row
          label="Site web"
          value={p.website ? (
            <a href={p.website} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline flex items-center gap-1">
              <FaEarthEurope className="text-xs" /> {p.website}
            </a>
          ) : null}
        />

        <SectionTitle>Profil mis en avant (Marketplace)</SectionTitle>
        <Row label="Sous-titre featured" value={p.featuredSubheading} />
        <Row label="Titre featured" value={p.featuredTitle} />
        <Row label="Bio featured" value={p.featuredBio} />
        <Row label="Années d'expérience" value={p.featuredExperienceYears} />
        <Row label="Clients accompagnés" value={p.featuredClientsAccompanied} />
        <Row label="Note qualitative" value={p.featuredRatingNotes} />
        <Row label="Taux de satisfaction" value={p.featuredSatisfactionRate} />
        {p.featuredProfilePhoto && (
          <div className="mt-3">
            <img
              src={methodModel.noImg(p.featuredProfilePhoto)}
              className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow"
              alt="Featured"
            />
          </div>
        )}

        <SectionTitle>Badges / Statuts</SectionTitle>
        <Row
          label="Favori global"
          value={p.isGlobalFavorite ? <Badge label="Oui" color="bg-green-100 text-green-700" /> : "Non"}
        />
        <Row
          label="Favori local"
          value={p.isLocalFavorite ? <Badge label="Oui" color="bg-green-100 text-green-700" /> : "Non"}
        />
        <Row
          label="Top Agent"
          value={p.isTopAgent ? <Badge label="Oui" color="bg-yellow-100 text-yellow-700" /> : "Non"}
        />

        <SectionTitle>Horaires d'ouverture</SectionTitle>
        {Array.isArray(p.openingHours) && p.openingHours.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <tbody>
              {p.openingHours.map((h, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-1 pr-4 text-gray-500 text-xs w-32">{h.day || h.name || `Jour ${i + 1}`}</td>
                  <td className="py-1 text-gray-800 flex items-center gap-1">
                    <FaClock className="text-xs text-gray-400" />
                    {h.open || h.from || "—"} → {h.close || h.to || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">Aucun horaire renseigné.</p>
        )}

        <SectionTitle>Services proposés</SectionTitle>
        {Array.isArray(p.servicesYouOffer) && p.servicesYouOffer.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {p.servicesYouOffer.map((s, i) => (
              <Badge key={i} label={s} color="bg-purple-100 text-purple-700" />
            ))}
          </div>
        ) : Array.isArray(p.servicesOffered) && p.servicesOffered.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {p.servicesOffered.map((s, i) => (
              <Badge key={i} label={s} color="bg-purple-100 text-purple-700" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Aucun service renseigné.</p>
        )}

        <SectionTitle>Photos</SectionTitle>
        {Array.isArray(p.images) && p.images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {p.images.map((img, i) => (
              <img
                key={i}
                src={methodModel.noImg(img)}
                className="w-full h-24 object-cover rounded-lg border border-gray-100"
                alt={`Photo ${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Aucune photo.</p>
        )}
      </div>
    );
  };

  const renderBiens = () => {
    const props = apiData.properties || [];
    if (props.length === 0) {
      return <p className="text-sm text-gray-400 mt-4">Aucun bien immobilier associé à ce pro.</p>;
    }
    return (
      <div>
        <div className="mb-4 text-sm text-gray-500">{props.length} bien(s)</div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Titre</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Ville</th>
                <th className="px-4 py-3 text-left">Prix</th>
                <th className="px-4 py-3 text-left">Surface</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Ajouté le</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {props.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{p.title}</td>
                  <td className="px-4 py-3 text-gray-500">{p.propertyType || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{p.city || "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{fmtEur(p.price)}</td>
                  <td className="px-4 py-3 text-gray-500">{p.surface ? `${p.surface} m²` : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge
                      label={p.status || "—"}
                      color={STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-400">{fmt(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/property/admin/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      <FaEye /> Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderServices = () => {
    const services = apiData.services || [];
    if (services.length === 0) {
      return <p className="text-sm text-gray-400 mt-4">Aucun service à la carte enregistré.</p>;
    }
    return (
      <div>
        <div className="mb-4 text-sm text-gray-500">{services.length} service(s)</div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Titre</th>
                <th className="px-4 py-3 text-left">Catégorie</th>
                <th className="px-4 py-3 text-left">Prix TTC</th>
                <th className="px-4 py-3 text-left">Ville</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Mis en avant</th>
                <th className="px-4 py-3 text-left">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{s.title}</td>
                  <td className="px-4 py-3 text-gray-500">{s.category?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{fmtEur(s.priceTTC)}</td>
                  <td className="px-4 py-3 text-gray-500">{s.city || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge
                      label={s.status}
                      color={SERVICE_STATUS_COLORS[s.status] || "bg-gray-100 text-gray-600"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {s.isFeatured ? (
                      <FaCircleCheck className="text-green-500" />
                    ) : (
                      <FaCircleXmark className="text-gray-300" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{fmt(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTransactions = () => {
    const { orders = [], totalOrders, totalRevenueTTC, totalProAmount } = apiData.transactions || {};
    const reviews = apiData.reviewsSummary || {};
    return (
      <div>
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <KpiCard icon={<FaMoneyBillWave />} label="CA total TTC" value={fmtEur(totalRevenueTTC)} color="bg-green-50 text-green-700" />
          <KpiCard icon={<FaMoneyBillWave />} label="Versé au pro" value={fmtEur(totalProAmount)} color="bg-emerald-50 text-emerald-700" />
          <KpiCard icon={<FaListCheck />} label="Commandes" value={totalOrders || 0} color="bg-blue-50 text-blue-700" />
          <KpiCard
            icon={<FaStar />}
            label={`Note moyenne (${reviews.totalReviews || 0} avis)`}
            value={reviews.avgRating ? `${reviews.avgRating}/5` : "—"}
            color="bg-yellow-50 text-yellow-700"
          />
        </div>

        {/* Table commandes */}
        {orders.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune transaction.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Acheteur</th>
                  <th className="px-4 py-3 text-left">Montant TTC</th>
                  <th className="px-4 py-3 text-left">Pro reçoit</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const buyer = o.buyer;
                  const buyerName =
                    buyer?.fullName ||
                    `${buyer?.firstName || ""} ${buyer?.lastName || ""}`.trim() ||
                    buyer?.email ||
                    "Inconnu";
                  return (
                    <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                        {o.service?.title || o.serviceSnapshot?.title || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {buyer ? (
                          <Link
                            to={`/user/detail/${buyer._id}`}
                            className="text-purple-700 hover:underline text-xs"
                          >
                            {buyerName}
                          </Link>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{fmtEur(o.totalPriceTTC)}</td>
                      <td className="px-4 py-3 text-green-700">{fmtEur(o.proAmount)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          label={ORDER_STATUS_LABELS[o.status] || o.status}
                          color={ORDER_STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-400">{fmt(o.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Avis clients */}
        {reviews.totalReviews > 0 && (
          <div className="mt-8">
            <SectionTitle>Avis clients ({reviews.totalReviews})</SectionTitle>
            <div className="space-y-3">
              {(reviews.reviews || []).map((r) => {
                const buyer = r.buyer;
                const buyerName =
                  buyer?.fullName ||
                  `${buyer?.firstName || ""} ${buyer?.lastName || ""}`.trim() ||
                  "Anonyme";
                return (
                  <div key={r._id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      {buyer?.image ? (
                        <img
                          src={methodModel.noImg(buyer.image)}
                          className="w-7 h-7 rounded-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                          {buyerName[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">{buyerName}</span>
                      <div className="flex gap-0.5 ml-auto">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < r.rating ? "text-yellow-400" : "text-gray-200"}
                            size={12}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-2">{fmt(r.createdAt)}</span>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                    {r.recommend && (
                      <Badge label="Recommandé" color="bg-green-100 text-green-700" className="mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMarketplace = () => {
    const stats = apiData.marketplaceStats || [];
    if (stats.length === 0) {
      return <p className="text-sm text-gray-400 mt-4">Aucun service actif sur la marketplace.</p>;
    }
    return (
      <div>
        <div className="mb-4 text-sm text-gray-500">{stats.length} service(s) analysé(s)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.serviceId} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-800 text-sm leading-tight">{s.title}</div>
                  {s.category && (
                    <div className="text-xs text-gray-400 mt-0.5">{s.category}</div>
                  )}
                </div>
                <Badge
                  label={s.status}
                  color={SERVICE_STATUS_COLORS[s.status] || "bg-gray-100 text-gray-600"}
                />
              </div>
              <div className="text-lg font-bold text-purple-700 mb-3">{fmtEur(s.priceTTC)}</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-pink-50 rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-0.5">Favoris</div>
                  <div className="font-bold text-pink-600">{s.totalFavorites}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-0.5">Ventes</div>
                  <div className="font-bold text-blue-600">{s.totalOrders}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-xs text-gray-500 mb-0.5">CA TTC</div>
                  <div className="font-bold text-green-600 text-xs">{fmtEur(s.totalRevenueTTC)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totaux */}
        <div className="grid grid-cols-3 gap-4">
          <KpiCard
            icon={<FaStar />}
            label="Total favoris"
            value={stats.reduce((a, s) => a + s.totalFavorites, 0)}
            color="bg-pink-50 text-pink-700"
          />
          <KpiCard
            icon={<FaListCheck />}
            label="Total ventes"
            value={stats.reduce((a, s) => a + s.totalOrders, 0)}
            color="bg-blue-50 text-blue-700"
          />
          <KpiCard
            icon={<FaMoneyBillWave />}
            label="CA total TTC"
            value={fmtEur(stats.reduce((a, s) => a + s.totalRevenueTTC, 0))}
            color="bg-green-50 text-green-700"
          />
        </div>
      </div>
    );
  };

  const renderAbonnement = () => {
    const user = apiData?.user || {};
    const planName = subscriptionActive?.planId?.name || subscriptionActive?.planType || null;
    const planInterval = subscriptionActive?.interval;
    const planPrice = subscriptionActive?.amount;
    const activePricing = subscriptionActive?.planId?.pricing || [];
    const displayPrice = planPrice != null && planPrice > 0
      ? formatCurrency(planPrice)
      : activePricing.find((p) => p.interval === (planInterval || "month"))?.unit_amount != null
        ? formatCurrency(activePricing.find((p) => p.interval === (planInterval || "month"))?.unit_amount)
        : null;
    const directPlan = !subscriptionActive && user?.planId && typeof user.planId === "object" ? user.planId : null;

    return (
      <div className="space-y-6">
        {/* Abonnement actuel */}
        <div className="shadow-sm rounded-2xl bg-white border border-gray-100 overflow-hidden">
          <div className="p-4 border-b font-medium text-purple-600 flex items-center gap-3">
            <div className="bg-purple-50 p-3 rounded-md"><FaCreditCard className="text-[18px]" /></div>
            Abonnement actuel
          </div>
          <div className="p-5">
            {subscriptionActive ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">Plan</div>
                  <div className="mt-1 text-sm font-semibold text-gray-800 capitalize">{planName || "--"}</div>
                </div>
                <div className="rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">Statut</div>
                  <div className="mt-1">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${SUB_STATUS_COLORS[subscriptionActive.status] || "bg-gray-100 text-gray-600"}`}>
                      {SUB_STATUS_LABELS[subscriptionActive.status] || subscriptionActive.status || "--"}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">Facturation</div>
                  <div className="mt-1 text-sm font-medium text-gray-800">
                    {INTERVAL_LABELS[planInterval] || planInterval || "--"}
                    {displayPrice ? <span className="ml-1 text-purple-600">· {displayPrice}</span> : null}
                  </div>
                </div>
                <div className="rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                  <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">Expire le</div>
                  <div className="mt-1 text-sm font-medium text-gray-800">
                    {subscriptionActive.validUpto ? new Date(subscriptionActive.validUpto).toLocaleDateString("fr-FR") : "Sans limite"}
                  </div>
                </div>
                {subscriptionActive.status === "trialing" && subscriptionActive.trialEnd ? (
                  <div className="md:col-span-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-blue-500">Fin de la période d'essai</div>
                    <div className="mt-1 text-sm font-medium text-gray-800">{new Date(subscriptionActive.trialEnd).toLocaleDateString("fr-FR")}</div>
                  </div>
                ) : null}
                {subscriptionActive.subscriptionId ? (
                  <div className="md:col-span-2 rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">ID Stripe</div>
                    <div className="mt-1 text-xs font-mono text-gray-500 break-all">{subscriptionActive.subscriptionId}</div>
                  </div>
                ) : null}
              </div>
            ) : directPlan ? (
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                  Plan assigné directement (sans souscription Stripe)
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">Plan</div>
                    <div className="mt-1 text-sm font-semibold text-gray-800 capitalize">{directPlan.name || "--"}</div>
                  </div>
                  <div className="rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">Type</div>
                    <div className="mt-1">
                      <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                        {directPlan.planType || "free"}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">Off-Market</div>
                    <div className="mt-1 text-sm font-medium text-gray-800">{directPlan.offMarket ? "Oui" : "Non"}</div>
                  </div>
                  <div className="rounded-xl border border-purple-100 bg-gray-50 px-4 py-3">
                    <div className="text-[12px] uppercase tracking-[0.16em] text-gray-500">Nb biens max</div>
                    <div className="mt-1 text-sm font-medium text-gray-800">{directPlan.numberOfProperty ?? "--"}</div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState title="Aucun abonnement actif" description="Cette entreprise n'a pas d'abonnement actif ou en essai." />
            )}
          </div>
        </div>

        {/* Assigner un plan manuellement */}
        <div className="shadow-sm rounded-2xl bg-white border border-gray-100 overflow-hidden">
          <div className="p-4 border-b font-medium text-purple-600">Assigner un plan manuellement</div>
          <div className="p-5">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Plan</label>
                <select
                  value={assignPlanId}
                  onChange={(e) => setAssignPlanId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="">-- Sélectionner un plan --</option>
                  {plans.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} ({p.planType})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAssignPlan}
                disabled={!assignPlanId || assignLoading}
                className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition"
              >
                {assignLoading ? "Assignation…" : "Assigner"}
              </button>
            </div>
            {assignMsg ? (
              <div className={`mt-3 text-sm px-3 py-2 rounded-lg ${assignMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {assignMsg.text}
              </div>
            ) : null}
          </div>
        </div>

        {/* Historique */}
        <div className="shadow-sm rounded-2xl bg-white border border-gray-100 overflow-hidden">
          <div className="p-4 border-b font-medium text-purple-600">Historique des abonnements</div>
          <div className="p-5">
            {subscriptionHistory.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-purple-50 text-gray-500">
                      <th className="text-left px-4 py-2 font-medium">Plan</th>
                      <th className="text-left px-4 py-2 font-medium">Facturation</th>
                      <th className="text-left px-4 py-2 font-medium">Montant</th>
                      <th className="text-left px-4 py-2 font-medium">Statut</th>
                      <th className="text-left px-4 py-2 font-medium">Début</th>
                      <th className="text-left px-4 py-2 font-medium">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionHistory.map((sub, idx) => {
                      const pName = sub?.planId?.name || sub?.planType || "--";
                      const rowPrice = sub.amount > 0
                        ? formatCurrency(sub.amount)
                        : (sub?.planId?.pricing || []).find((p) => p.interval === (sub.interval || "month"))?.unit_amount != null
                          ? formatCurrency((sub?.planId?.pricing || []).find((p) => p.interval === (sub.interval || "month"))?.unit_amount)
                          : "--";
                      return (
                        <tr key={sub._id || idx} className="border-b last:border-0 hover:bg-purple-50/30">
                          <td className="px-4 py-3 font-medium text-gray-800 capitalize">{pName}</td>
                          <td className="px-4 py-3 text-gray-600">{INTERVAL_LABELS[sub.interval] || sub.interval || "--"}</td>
                          <td className="px-4 py-3 text-gray-600">{rowPrice}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${SUB_STATUS_COLORS[sub.status] || "bg-gray-100 text-gray-600"}`}>
                              {SUB_STATUS_LABELS[sub.status] || sub.status || "--"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(sub.createdAt)}</td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                            {sub.validUpto ? new Date(sub.validUpto).toLocaleDateString("fr-FR") : "–"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="Aucun historique" description="Aucun abonnement passé ou présent enregistré pour cette entreprise." />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!apiData) return null;
    switch (activeTab) {
      case "general": return renderGeneral();
      case "profil": return renderProfil();
      case "biens": return renderBiens();
      case "services": return renderServices();
      case "transactions": return renderTransactions();
      case "marketplace": return renderMarketplace();
      case "abonnement": return renderAbonnement();
      default: return null;
    }
  };

  // ─── render principal ─────────────────────────────────────────────────────

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition"
          >
            <FaArrowLeft /> Retour
          </button>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaBuilding className="text-purple-500" /> Vue Admin — Company
          </h1>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48 text-gray-400">
            Chargement…
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">{error}</div>
        )}

        {!loading && !error && apiData && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Onglets */}
            <div className="border-b border-gray-100 px-6 pt-2">
              <div className="flex gap-1 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? "border-purple-600 text-purple-700"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className="p-6">{renderTabContent()}</div>
          </div>
        )}
      </div>
    </Layout>
  );
}
