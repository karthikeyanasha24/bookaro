import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiClient from "../../../methods/api/apiClient";
import Layout from "../../../components/global/layout";
import methodModel from "../../../methods/methods";

const DURATION_LABEL = { "1Day": "1J", "1Week": "7J", "1Month": "1 mois" };

const fmtPrice = (v) =>
  v != null ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v) : "—";

const StatusBadge = ({ status }) =>
  status === "active" ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">En cours</span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Terminée</span>
  );

const StatCard = ({ label, value, color = "purple" }) => {
  const colors = {
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    teal: "bg-teal-50 border-teal-200 text-teal-700",
  };
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-1 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-3xl font-bold">{value ?? "—"}</p>
    </div>
  );
};

const AdminCampaigns = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: "", status: "" });

  const fetchStats = useCallback(() => {
    ApiClient.get("admin/campaigns/stats").then((res) => {
      if (res.success) setStats(res.data);
    });
  }, []);

  const fetchCampaigns = useCallback(
    (override = {}) => {
      const f = { ...filters, ...override };
      setFilters(f);
      setLoading(true);
      ApiClient.get("admin/campaigns", f).then((res) => {
        if (res.success) {
          setCampaigns(res.data || []);
          setTotal(res.total || 0);
        }
        setLoading(false);
      });
    },
    [filters]
  );

  useEffect(() => {
    fetchStats();
    fetchCampaigns({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-[#111827]">Campagnes P2P</h3>
          <p className="text-sm text-[#6B7280] mt-1">Toutes les campagnes d'estimation pair-à-pair lancées sur la plateforme.</p>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Nombre de campagnes" value={stats?.totalCampaigns} color="purple" />
          <StatCard label="Nombre de biens" value={stats?.totalProperties} color="blue" />
          <StatCard label="Nombre d'estimateurs" value={stats?.totalEstimators} color="teal" />
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-box p-4 mb-4">
          <div className="flex flex-wrap gap-3 items-end">
            <input
              type="text"
              placeholder="Rechercher une campagne…"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && fetchCampaigns({ page: 1 })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
            />
            <select
              value={filters.status}
              onChange={(e) => fetchCampaigns({ status: e.target.value, page: 1 })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="active">En cours</option>
              <option value="inactive">Terminée</option>
            </select>
            <button
              onClick={() => fetchCampaigns({ page: 1 })}
              className="bg-[#976DD0] text-white px-4 py-2 rounded-lg text-sm hover:opacity-80"
            >
              Rechercher
            </button>
            <button
              onClick={() => { setFilters((f) => ({ ...f, search: "", status: "" })); fetchCampaigns({ search: "", status: "", page: 1 }); }}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow-box overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">Chargement…</div>
          ) : campaigns.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-gray-400">Aucune campagne trouvée.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Réf.</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date lancement</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Bien</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Durée</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Nb estimations</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Prix de réf.</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Prix moyen</th>
                  <th className="px-4 py-3 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((c) => {
                  const prop = c.property || {};
                  const propId = c.propertyId;
                  const imgFile = prop.images?.[0]?.file || null;
                  return (
                    <tr
                      key={c._id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/p2p-estimation/campaigns/${c._id}`)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          #{c._id?.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                        {c.startDate ? new Date(c.startDate).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Link to={`/property/detail/${propId}`} className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 block hover:opacity-80">
                            {imgFile ? (
                              <img src={methodModel.noImg(imgFile)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                            )}
                          </Link>
                          <div className="min-w-0">
                            <Link to={`/property/detail/${propId}`} className="font-medium text-[#111827] hover:underline block truncate max-w-[180px]">
                              {prop.propertyTitle || c.campaignName || "—"}
                            </Link>
                            {(prop.city || prop.zipcode) && (
                              <p className="text-xs text-gray-500">{[prop.zipcode, prop.city].filter(Boolean).join(" ")}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                          {DURATION_LABEL[c.duration] || c.duration || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-right font-medium">{c.estimationCount ?? 0}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmtPrice(c.referencePrice)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmtPrice(c.avgPrice)}</td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/p2p-estimation/campaigns/${c._id}`)}
                          className="text-xs border border-[#976DD0] text-[#976DD0] px-3 py-1.5 rounded-lg hover:bg-purple-50"
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {total > filters.limit && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-500">{total} campagne{total > 1 ? "s" : ""}</p>
              <div className="flex gap-2">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => fetchCampaigns({ page: filters.page - 1 })}
                  className="text-sm px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-40"
                >
                  ← Préc.
                </button>
                <span className="text-sm px-3 py-1 text-gray-600">
                  Page {filters.page} / {Math.ceil(total / filters.limit)}
                </span>
                <button
                  disabled={filters.page >= Math.ceil(total / filters.limit)}
                  onClick={() => fetchCampaigns({ page: filters.page + 1 })}
                  className="text-sm px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-40"
                >
                  Suiv. →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminCampaigns;
