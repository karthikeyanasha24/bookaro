import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft, FaHouse, FaLocationDot, FaUser, FaImages,
  FaChartBar, FaEuroSign, FaHammer, FaWrench, FaHeart,
  FaBookmark, FaUsers, FaBolt, FaStar, FaShare,
  FaEye, FaCalendarDays, FaEnvelope, FaCircleInfo,
} from "react-icons/fa6";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (date) => date ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtNum = (n) => n !== undefined && n !== null ? Number(n).toLocaleString("fr-FR") : "—";
const fmtEur = (n) => n !== undefined && n !== null ? `${Number(n).toLocaleString("fr-FR")} €` : "—";

const DPE_COLORS = { A: "bg-green-600", B: "bg-green-400", C: "bg-lime-400", D: "bg-yellow-400", E: "bg-orange-400", F: "bg-orange-600", G: "bg-red-600" };

function Badge({ label, color = "bg-gray-100 text-gray-700", className = "" }) {
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color} ${className}`}>{label}</span>;
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

function UserChip({ user }) {
  if (!user) return <span className="text-gray-400 text-sm">—</span>;
  const name = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Utilisateur";
  return (
    <Link to={`/user/detail/${user._id}`} className="inline-flex items-center gap-2 text-purple-700 hover:underline text-sm">
      {user.image ? (
        <img src={methodModel.noImg(user.image)} className="w-6 h-6 rounded-full object-cover" alt="" />
      ) : (
        <span className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">{name[0]?.toUpperCase()}</span>
      )}
      {name}
    </Link>
  );
}

function SectionTitle({ children }) {
  return <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-5 border-b border-gray-100 pb-1">{children}</h3>;
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2 py-1.5 border-b border-gray-50 last:border-0">
      <span className="w-44 shrink-0 text-xs text-gray-500">{label}</span>
      <span className="text-sm text-gray-800 break-words">{value ?? "—"}</span>
    </div>
  );
}

const TABS = [
  { id: "general", label: "Général", icon: <FaHouse /> },
  { id: "caracteristiques", label: "Caractéristiques", icon: <FaCircleInfo /> },
  { id: "photos", label: "Photos", icon: <FaImages /> },
  { id: "revenus", label: "Revenus", icon: <FaEuroSign /> },
  { id: "depenses", label: "Dépenses", icon: <FaWrench /> },
  { id: "travaux", label: "Travaux", icon: <FaHammer /> },
  { id: "attractivite", label: "Attractivité", icon: <FaChartBar /> },
  { id: "leads", label: "Leads", icon: <FaUsers /> },
  { id: "followers", label: "Followers", icon: <FaBookmark /> },
  { id: "likes", label: "Likes", icon: <FaHeart /> },
  { id: "activite", label: "Activité", icon: <FaBolt /> },
];

const EVENT_BADGES = {
  profile_view: "bg-blue-100 text-blue-700",
  like: "bg-pink-100 text-pink-700",
  unlike: "bg-gray-100 text-gray-600",
  follow: "bg-purple-100 text-purple-700",
  unfollow: "bg-gray-100 text-gray-600",
  share: "bg-teal-100 text-teal-700",
  contact_owner: "bg-yellow-100 text-yellow-700",
  visit_request: "bg-orange-100 text-orange-700",
  offer_sent: "bg-green-100 text-green-700",
  offer_status_change: "bg-green-100 text-green-700",
  status_change: "bg-indigo-100 text-indigo-700",
  photo_added: "bg-sky-100 text-sky-700",
  description_update: "bg-sky-100 text-sky-700",
  price_change: "bg-red-100 text-red-700",
  service_purchase: "bg-violet-100 text-violet-700",
  campaign_launch: "bg-emerald-100 text-emerald-700",
  other: "bg-gray-100 text-gray-600",
};

const FUNNEL_LABELS = {
  pending: "En attente",
  accepted: "Accepté",
  rejected: "Rejeté",
  completed: "Complété",
  cancelled: "Annulé",
};

export default function PropertyAdminView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [stats, setStats] = useState({});
  const [leads, setLeads] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [likers, setLikers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = () => {
    setLoading(true);
    setError(null);
    ApiClient.get(`property/admin/detail/${id}`)
      .then((res) => {
        if (res?.success) {
          setData(res.data.property);
          setStats(res.data.stats || {});
          setLeads(res.data.leads || []);
          setFollowers(res.data.followers || []);
          setLikers(res.data.likers || []);
          setActivityLogs(res.data.activityLogs || []);
        } else {
          setError("Bien introuvable.");
        }
      })
      .catch(() => setError("Erreur de chargement."))
      .finally(() => setLoading(false));
  };

  // ─── tab renderers ────────────────────────────────────────────────────────

  const renderGeneral = () => (
    <div className="max-w-3xl space-y-0">
      <SectionTitle>Identité</SectionTitle>
      <Row label="Titre" value={data.propertyTitle} />
      <Row label="Type de bien" value={data.propertyType || data.type} />
      <Row label="Statut" value={
        <Badge label={data.status || "—"} color={data.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} />
      } />
      <Row label="Off-market" value={data.offMarket ? <Badge label="Oui" color="bg-orange-100 text-orange-700" /> : <Badge label="Non" color="bg-gray-100 text-gray-500" />} />
      <Row label="Import par" value={data.importBy || "—"} />
      <Row label="URL externe" value={data.externalUrl ? <a href={data.externalUrl} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline break-all">{data.externalUrl}</a> : "—"} />
      <Row label="Lien frontend" value={
        <a href={`https://book.jcsoftwaresolution.in/property-details?id=${data._id}`} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">Voir sur l'app</a>
      } />

      <SectionTitle>Localisation</SectionTitle>
      <Row label="Adresse" value={data.address} />
      <Row label="Ville" value={data.city} />
      <Row label="Code postal" value={data.zipcode} />
      <Row label="Pays" value={data.country} />
      <Row label="Coordonnées GPS" value={
        data.mapLatLng?.coordinates
          ? `${data.mapLatLng.coordinates[1]}, ${data.mapLatLng.coordinates[0]}`
          : data.lat
          ? `${data.lat}, ${data.lng}`
          : "—"
      } />

      <SectionTitle>Propriétaire</SectionTitle>
      <Row label="Ajouté par" value={data.addedBy ? <UserChip user={typeof data.addedBy === "object" ? data.addedBy : { _id: data.addedBy }} /> : "—"} />
      <Row label="Agence" value={data.agency ? <UserChip user={typeof data.agency === "object" ? data.agency : { _id: data.agency }} /> : "—"} />

      <SectionTitle>Prix</SectionTitle>
      <Row label="Prix de vente" value={fmtEur(data.price)} />
      <Row label="Loyer mensuel" value={fmtEur(data.loyer || data.rent)} />
      <Row label="Charges" value={fmtEur(data.charges)} />

      <SectionTitle>Description</SectionTitle>
      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{data.content || "—"}</div>

      <SectionTitle>Dates</SectionTitle>
      <Row label="Créé le" value={fmt(data.createdAt)} />
      <Row label="Publié le" value={fmt(data.publicationDate)} />
      <Row label="Modifié le" value={fmt(data.lastModificationDate || data.updatedAt)} />

      {data.linkedSchools?.length > 0 && (
        <>
          <SectionTitle>Écoles liées</SectionTitle>
          {data.linkedSchools.map((s, i) => (
            <Row key={i} label={`École ${i + 1}`} value={s.schoolId?.EstablishmentName || s.schoolId?._id || s.schoolId} />
          ))}
        </>
      )}
    </div>
  );

  const renderCaracteristiques = () => (
    <div className="max-w-3xl">
      <SectionTitle>Surfaces &amp; Pièces</SectionTitle>
      <Row label="Surface habitable" value={data.surface ? `${data.surface} m²` : "—"} />
      <Row label="Surface terrain" value={data.landSurface ? `${data.landSurface} m²` : "—"} />
      <Row label="Pièces" value={fmtNum(data.rooms)} />
      <Row label="Chambres" value={fmtNum(data.bedrooms)} />
      <Row label="Salles de bain" value={fmtNum(data.bathroom)} />
      <Row label="Toilettes" value={fmtNum(data.toilets)} />
      <Row label="Séjour" value={fmtNum(data.livingRoom)} />

      <SectionTitle>Bâtiment</SectionTitle>
      <Row label="Étage du bien" value={fmtNum(data.propertyFloor)} />
      <Row label="Nb étages total" value={fmtNum(data.totalFloorBuilding)} />
      <Row label="Année de construction" value={data.building?.year || data.buildingYear || "—"} />
      <Row label="État du bien" value={data.propertyState?.name || "—"} />
      <Row label="Usage" value={data.usedAs || "—"} />
      <Row label="Situation" value={Array.isArray(data.situation) ? data.situation.join(", ") : (data.situation || "—")} />

      <SectionTitle>Énergie</SectionTitle>
      <Row label="Mode de chauffage" value={data.heatingType?.name || data.heatingType || "—"} />
      <Row label="Énergie" value={data.energymode?.name || data.energymode || "—"} />
      {(data.energy_efficient || data.emission_efficient) && (
        <>
          <Row label="DPE Énergie" value={
            data.energy_efficient
              ? <span className={`text-white text-xs font-bold px-2 py-0.5 rounded ${DPE_COLORS[data.energy_efficient] || "bg-gray-400"}`}>{data.energy_efficient}</span>
              : "—"
          } />
          <Row label="DPE Émissions" value={
            data.emission_efficient
              ? <span className={`text-white text-xs font-bold px-2 py-0.5 rounded ${DPE_COLORS[data.emission_efficient] || "bg-gray-400"}`}>{data.emission_efficient}</span>
              : "—"
          } />
          <Row label="Consommation (kWh/m²/an)" value={fmtNum(data.energyConsumption)} />
          <Row label="Émissions (gCO₂/m²/an)" value={fmtNum(data.emissions)} />
          <Row label="Type de diagnostic" value={data.diagnosisType || "—"} />
        </>
      )}

      {[
        { label: "Équipements", key: "equipment" },
        { label: "Extérieur", key: "outside" },
        { label: "Cuisine", key: "cooking" },
        { label: "Accessibilité", key: "serviceAccessibility" },
        { label: "Annexes", key: "ancilliary" },
        { label: "Environnement", key: "environment" },
        { label: "Loisirs", key: "leisure" },
        { label: "Aménités", key: "amenities" },
      ].map(({ label, key }) =>
        data[key]?.length ? (
          <div key={key}>
            <SectionTitle>{label}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {data[key].map((item) => (
                <Badge key={item._id || item} label={item.name || item} color="bg-gray-100 text-gray-700" />
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );

  const renderPhotos = () => {
    const imgs = data.images || data.photos || [];
    if (!imgs.length) return <p className="text-gray-400 text-sm mt-4">Aucune photo disponible.</p>;
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
        {imgs.map((img, i) => (
          <a key={i} href={methodModel.noImg(img)} target="_blank" rel="noreferrer">
            <img
              src={methodModel.noImg(img)}
              loading="lazy"
              className="w-full h-40 object-cover rounded-xl border border-gray-100 hover:opacity-90 transition"
              alt={`Photo ${i + 1}`}
            />
          </a>
        ))}
      </div>
    );
  };

  const renderRevenus = () => {
    const items = data.revenue_detail || [];
    if (!items.length) return <p className="text-gray-400 text-sm mt-4">Aucun revenu enregistré.</p>;
    return (
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Année</th>
              <th className="px-3 py-2">Montant</th>
              <th className="px-3 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2">{r.type?.name || r.type || "—"}</td>
                <td className="px-3 py-2">{r.source?.name || r.source || "—"}</td>
                <td className="px-3 py-2">{r.year || "—"}</td>
                <td className="px-3 py-2 font-semibold text-green-700">{fmtEur(r.price)}</td>
                <td className="px-3 py-2">
                  <Badge label={r.status || "—"} color={r.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDepenses = () => {
    const items = data.Expenses || data.expenses || [];
    if (!items.length) return <p className="text-gray-400 text-sm mt-4">Aucune dépense enregistrée.</p>;
    return (
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Année</th>
              <th className="px-3 py-2">Montant</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2">{e.type?.name || e.type || "—"}</td>
                <td className="px-3 py-2">{e.year || "—"}</td>
                <td className="px-3 py-2 font-semibold text-red-600">{fmtEur(e.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTravaux = () => {
    const items = data.renovation_work || [];
    if (!items.length) return <p className="text-gray-400 text-sm mt-4">Aucun travaux enregistrés.</p>;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {items.map((t, i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-gray-800 text-sm">{t.title?.name || t.title || `Travaux ${i + 1}`}</span>
              <Badge label={t.status || "—"} color={t.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} />
            </div>
            <p className="text-xs text-gray-600 mb-2">{t.description || ""}</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="font-semibold text-orange-600">{fmtEur(t.price)}</span>
              {t.renovationDate && <span>{fmt(t.renovationDate)}</span>}
            </div>
            {t.images?.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {t.images.slice(0, 4).map((img, j) => (
                  <img key={j} src={methodModel.noImg(img)} loading="lazy" className="w-16 h-16 object-cover rounded" alt="" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderAttractivite = () => (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
        <KpiCard icon={<FaEye />} label="Vues" value={fmtNum(stats.viewCount)} />
        <KpiCard icon={<FaHeart />} label="Likes" value={fmtNum(stats.likeCount)} />
        <KpiCard icon={<FaBookmark />} label="Followers" value={fmtNum(stats.followerCount)} />
        <KpiCard icon={<FaShare />} label="Partages" value={fmtNum(stats.shareCount)} />
        <KpiCard icon={<FaCalendarDays />} label="Visites réservées" value={fmtNum(stats.visitBookedCount)} color="bg-teal-50 text-teal-700" />
        <KpiCard icon={<FaUsers />} label="Leads" value={fmtNum(stats.leadCount)} color="bg-blue-50 text-blue-700" />
        <KpiCard icon={<FaBolt />} label="Indicateur activité" value={fmtNum(stats.activityIndicatorCount)} color="bg-yellow-50 text-yellow-700" />
        <KpiCard icon={<FaEnvelope />} label="Contacts reçus" value={fmtNum(stats.contactCount)} color="bg-orange-50 text-orange-700" />
      </div>

      {data.rating?.length > 0 && (
        <>
          <SectionTitle>Avis par plateforme</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase text-left">
                  <th className="px-3 py-2">Plateforme</th>
                  <th className="px-3 py-2">Note</th>
                  <th className="px-3 py-2">URL</th>
                </tr>
              </thead>
              <tbody>
                {data.rating.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-3 py-2">{r.type?.name || r.type || "—"}</td>
                    <td className="px-3 py-2 flex items-center gap-1 font-semibold text-yellow-600">
                      <FaStar className="text-yellow-400" /> {r.rating_value || "—"}
                    </td>
                    <td className="px-3 py-2">
                      {r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline truncate">{r.url}</a> : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  const renderLeads = () => {
    if (!leads.length) return <p className="text-gray-400 text-sm mt-4">Aucun lead pour ce bien.</p>;
    return (
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-3 py-2">Acheteur</th>
              <th className="px-3 py-2">Statut Funnel</th>
              <th className="px-3 py-2">Classe</th>
              <th className="px-3 py-2">Proba. Financement</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2">
                  {l.buyerId ? (
                    <Link to={`/user/detail/${l.buyerId._id || l.buyerId}`} className="text-purple-700 hover:underline">
                      {l.buyerId.fullName || `${l.buyerId.firstName || ""} ${l.buyerId.lastName || ""}`.trim() || "—"}
                    </Link>
                  ) : "—"}
                </td>
                <td className="px-3 py-2">
                  <Badge label={FUNNEL_LABELS[l.funnelStatus] || l.funnelStatus || "—"} color="bg-blue-50 text-blue-700" />
                </td>
                <td className="px-3 py-2">{l.scoreClass || "—"}</td>
                <td className="px-3 py-2">{l.financingProbability !== undefined ? `${l.financingProbability}%` : "—"}</td>
                <td className="px-3 py-2 text-gray-500">{fmt(l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFollowers = () => {
    const items = followers;
    if (!items.length) return <p className="text-gray-400 text-sm mt-4">Aucun follower.</p>;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {items.map((f, i) => {
          const user = f.user_id || f;
          return (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              {user.image ? (
                <img src={methodModel.noImg(user.image)} className="w-10 h-10 rounded-full object-cover" alt="" />
              ) : (
                <span className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                  {(user.fullName || user.firstName || "?")[0]?.toUpperCase()}
                </span>
              )}
              <div>
                <Link to={`/user/detail/${user._id}`} className="text-sm font-medium text-gray-800 hover:text-purple-700">
                  {user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "—"}
                </Link>
                <div className="text-xs text-gray-400">{fmt(f.createdAt)}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLikes = () => {
    const items = likers;
    if (!items.length) return <p className="text-gray-400 text-sm mt-4">Aucun like.</p>;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
        {items.map((f, i) => {
          const user = f.user_id || f;
          return (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white">
              {user.image ? (
                <img src={methodModel.noImg(user.image)} className="w-10 h-10 rounded-full object-cover" alt="" />
              ) : (
                <span className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                  {(user.fullName || user.firstName || "?")[0]?.toUpperCase()}
                </span>
              )}
              <div>
                <Link to={`/user/detail/${user._id}`} className="text-sm font-medium text-gray-800 hover:text-pink-600">
                  {user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "—"}
                </Link>
                <div className="text-xs text-gray-400">{fmt(f.createdAt)}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderActivite = () => {
    if (!activityLogs.length) return <p className="text-gray-400 text-sm mt-4">Aucune activité enregistrée pour ce bien.</p>;
    return (
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Détail</th>
              <th className="px-3 py-2">Utilisateur</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2">
                  <Badge label={log.type} color={EVENT_BADGES[log.type] || "bg-gray-100 text-gray-600"} />
                </td>
                <td className="px-3 py-2 text-gray-600">{log.label || "—"}</td>
                <td className="px-3 py-2">
                  {log.userId ? <UserChip user={log.userId} /> : <span className="text-gray-400 text-xs">Anonyme</span>}
                </td>
                <td className="px-3 py-2 text-gray-400 whitespace-nowrap">{fmt(log.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TAB_RENDERERS = {
    general: renderGeneral,
    caracteristiques: renderCaracteristiques,
    photos: renderPhotos,
    revenus: renderRevenus,
    depenses: renderDepenses,
    travaux: renderTravaux,
    attractivite: renderAttractivite,
    leads: renderLeads,
    followers: renderFollowers,
    likes: renderLikes,
    activite: renderActivite,
  };

  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
          >
            <FaArrowLeft />
          </button>
          {loading ? (
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          ) : data ? (
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-lg font-semibold text-gray-800 leading-tight">
                {data.propertyTitle || "Bien immobilier"}
              </h1>
              <Badge
                label={data.status || "—"}
                color={data.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
              />
              {data.offMarket && <Badge label="Off-market" color="bg-orange-100 text-orange-700" />}
              {data.city && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <FaLocationDot /> {data.city} {data.zipcode}
                </span>
              )}
            </div>
          ) : null}
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="m-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}

        {!loading && !error && data && (
          <>
            {/* Tabs nav */}
            <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
              <div className="flex gap-0 min-w-max">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-purple-600 text-purple-700"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="px-6 py-6">
              {TAB_RENDERERS[activeTab]?.()}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
