import { useEffect, useState, useCallback } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import Layout from "../../../components/global/layout";
import { useNavigate } from "react-router-dom";
import methodModel from "../../../methods/methods";
import { FiSearch } from "react-icons/fi";
import { MdTrendingUp } from "react-icons/md";

const fmtPrice = (p) =>
  p != null && p > 0
    ? p.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })
    : null;

const fmtAge = (days) => {
  if (days < 1) return "Aujourd'hui";
  if (days < 30) return `${days}j`;
  if (days < 365) return `${Math.round(days / 30)}mois`;
  return `${(days / 365).toFixed(1)}an`;
};

const Avatar = ({ src, name, size = 8 }) => {
  const initials = (name || "?")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  return src ? (
    <img src={methodModel.noImg(src)} alt={name} className={`w-${size} h-${size} rounded-full object-cover`} />
  ) : (
    <div className={`w-${size} h-${size} rounded-full bg-[#976DD0] text-white flex items-center justify-center text-xs font-bold`}>
      {initials}
    </div>
  );
};

/** Gauge bar 0-100 with color gradient */
const IndexGauge = ({ value }) => {
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const color =
    pct >= 70 ? "#22c55e" :
    pct >= 40 ? "#976DD0" :
    pct >= 15 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-bold text-sm" style={{ color }}>{pct.toFixed(1)}%</span>
    </div>
  );
};

const STATUS_LABELS = {
  active: { label: "Actif", cls: "bg-green-100 text-green-700" },
  deactive: { label: "Inactif", cls: "bg-gray-100 text-gray-500" },
  pending: { label: "En attente", cls: "bg-amber-100 text-amber-700" },
};

const AttractivityIndex = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "", status: "", propertyType: "", sortBy: "attractivityIndex_desc", page: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const COUNT = 20;

  const load = useCallback(async (f) => {
    loader(true);
    try {
      const params = new URLSearchParams({
        page: f.page, count: COUNT, sortBy: f.sortBy,
      });
      if (f.search) params.append("search", f.search);
      if (f.status) params.append("status", f.status);
      if (f.propertyType) params.append("propertyType", f.propertyType);

      const res = await ApiClient.get(`admin/property-attractivity/index?${params}`);
      if (res?.success) {
        setData(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (_) {}
    loader(false);
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const applyFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }));

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilter("search", searchInput);
  };

  const totalPages = Math.ceil(total / COUNT);

  return (
    <Layout>
      <div className="min-h-screen bg-[#f3f5f9] p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <MdTrendingUp className="text-[#976DD0] text-2xl" />
            <h1 className="text-[22px] font-bold text-[#47525E]">Attractivity Index</h1>
          </div>
          <p className="text-sm text-gray-500">
            Classement de désirabilité de tous les biens — basé sur les vues, likes, follows, partages, intérêts, visites et messages
          </p>
        </div>

        {/* Formula info */}
        <div className="bg-[#ede5f7] border border-[#c9a8e8] rounded-[12px] px-5 py-3 mb-6 text-sm text-[#5a3e78]">
          <strong>Formule :</strong>{" "}
          I = <strong>20%</strong>×Visibilité + <strong>30%</strong>×Engagement + <strong>50%</strong>×Intention<br />
          Visibilité = ½×(Vues + Durée),&nbsp; Engagement = ¼×(Likes + Partages + Follows + Revisites),&nbsp; Intention = ⅓×(Intérêts + Messages + Demandes visite)
          &nbsp;× Bonus fraîcheur &nbsp;× 100
          <span className="ml-2 text-xs opacity-70">
            (tous les signaux normalisés par le 95e percentile de la plateforme)
          </span>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[12px] border border-[#D2D2D2] p-4 mb-5 flex flex-wrap gap-3 items-end">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[220px]">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher un bien (titre, adresse, code postal)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#D2D2D2] text-sm focus:outline-none focus:border-[#976DD0]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#976DD0] text-white rounded-lg text-sm hover:bg-[#7d55b5] transition-colors"
            >
              Chercher
            </button>
          </form>

          <select
            value={filters.status}
            onChange={(e) => applyFilter("status", e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#D2D2D2] text-sm focus:outline-none focus:border-[#976DD0]"
          >
            <option value="">Tous statuts</option>
            <option value="active">Actif</option>
            <option value="deactive">Inactif</option>
          </select>

          <select
            value={filters.propertyType}
            onChange={(e) => applyFilter("propertyType", e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#D2D2D2] text-sm focus:outline-none focus:border-[#976DD0]"
          >
            <option value="">Tous types</option>
            <option value="sale">Vente</option>
            <option value="rent">Location</option>
            <option value="offmarket">Offmarket</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => applyFilter("sortBy", e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#D2D2D2] text-sm focus:outline-none focus:border-[#976DD0]"
          >
            <option value="attractivityIndex_desc">Index ↓ (meilleurs)</option>
            <option value="attractivityIndex_asc">Index ↑ (plus faibles)</option>
            <option value="visibility_desc">Visibilité ↓</option>
            <option value="engagement_desc">Engagement ↓</option>
            <option value="intent_desc">Intention ↓</option>
            <option value="createdAt_desc">Date de création ↓</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[12px] border border-[#D2D2D2] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f8f8] text-[#47525E] text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Bien</th>
                  <th className="px-4 py-3 text-left">Réf.</th>
                  <th className="px-4 py-3 text-left">Surface</th>
                  <th className="px-4 py-3 text-left">CP / Ville</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Prix</th>
                  <th className="px-4 py-3 text-left">Propriétaire</th>
                  <th className="px-4 py-3 text-left">Ancienneté</th>
                  <th className="px-4 py-3 text-left min-w-[110px]">Visibilité</th>
                  <th className="px-4 py-3 text-left min-w-[110px]">Engagement</th>
                  <th className="px-4 py-3 text-left min-w-[110px]">Intention</th>
                  <th className="px-4 py-3 text-left min-w-[170px]">Index Global</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-10 text-center text-gray-400">
                      Aucun bien trouvé
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => {
                    const rank = (filters.page - 1) * COUNT + idx + 1;
                    const owner = item.addedBy;
                    const ownerName = owner
                      ? owner.fullName || `${owner.firstName || ""} ${owner.lastName || ""}`.trim()
                      : "—";
                    const propImg = item.images?.[0]?.file;
                    const price = item.price || item.propertyMonthlyCharges;
                    const statusConf = STATUS_LABELS[item.status] || { label: item.status, cls: "bg-gray-100 text-gray-500" };

                    return (
                      <tr key={item._id} className="border-t border-[#F0F0F0] hover:bg-[#fafafa]">
                        {/* Rank */}
                        <td className="px-4 py-3 text-gray-400 font-bold">#{rank}</td>

                        {/* Property */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => navigate(`/property/detail/${item._id}`)}
                            className="flex items-center gap-2 hover:text-[#976DD0] transition-colors max-w-[220px] text-left"
                          >
                            {propImg ? (
                              <img
                                src={methodModel.noImg(propImg)}
                                alt=""
                                className="w-12 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
                            )}
                            <span className="truncate font-medium text-sm">{item.propertyTitle || "Sans titre"}</span>
                          </button>
                        </td>

                        {/* Ref */}
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                          {String(item._id).slice(-8).toUpperCase()}
                        </td>

                        {/* Surface */}
                        <td className="px-4 py-3 text-gray-600">
                          {item.surface ? `${item.surface} m²` : "—"}
                        </td>

                        {/* CP / Ville */}
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {[item.zipcode, item.city].filter(Boolean).join(" ") || "—"}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConf.cls}`}>
                            {statusConf.label}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {fmtPrice(price) || "—"}
                          {item.propertyMonthlyCharges && item.price == null && (
                            <span className="text-xs text-gray-400">/mois</span>
                          )}
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => owner?._id && navigate(`/user/detail/${owner._id}`)}
                            className="flex items-center gap-2 hover:text-[#976DD0] transition-colors"
                          >
                            <Avatar src={owner?.image} name={ownerName} size={7} />
                            <span className="text-sm">{ownerName}</span>
                          </button>
                        </td>

                        {/* Age */}
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {fmtAge(item.ageDays)}
                        </td>

                        {/* Visibilité */}
                        <td className="px-4 py-3">
                          <IndexGauge value={item.visibilityScore} />
                        </td>
                        {/* Engagement */}
                        <td className="px-4 py-3">
                          <IndexGauge value={item.engagementScore} />
                        </td>
                        {/* Intention */}
                        <td className="px-4 py-3">
                          <IndexGauge value={item.intentScore} />
                        </td>
                        {/* Attractivity Index global */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <IndexGauge value={item.attractivityIndex} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0F0F0]">
              <span className="text-sm text-gray-500">
                {total.toLocaleString("fr-FR")} bien{total > 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                  className="px-3 py-1.5 rounded-lg border border-[#D2D2D2] text-sm disabled:opacity-40 hover:border-[#976DD0]"
                >
                  ← Précédent
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-500">
                  {filters.page} / {totalPages}
                </span>
                <button
                  disabled={filters.page >= totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                  className="px-3 py-1.5 rounded-lg border border-[#D2D2D2] text-sm disabled:opacity-40 hover:border-[#976DD0]"
                >
                  Suivant →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AttractivityIndex;
