import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ApiClient from "../../../methods/api/apiClient";
import Layout from "../../../components/global/layout";
import methodModel from "../../../methods/methods";
import { FiArrowLeft } from "react-icons/fi";

const DURATION_LABEL = { "1Day": "1 jour", "1Week": "7 jours", "1Month": "1 mois" };

const fmtPrice = (v) =>
  v != null ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v) : "—";

const PERCEPTION_CONFIG = {
  underestimated: { label: "Sous-estimé", color: "bg-blue-500" },
  appropriate:    { label: "Cohérent",    color: "bg-green-500" },
  expensive:      { label: "Sur-estimé",  color: "bg-red-500" },
};

const PERCEPTION_BADGE = {
  underestimated: "bg-blue-100 text-blue-700",
  appropriate:    "bg-green-100 text-green-700",
  expensive:      "bg-red-100 text-red-700",
};

const QUALITATIF_LABELS = {
  ratePropertyTitle:    "Titre",
  ratePropertyPictures: "Photos",
  rateInteriorDesign:   "Déco intérieure",
  rateLocation:         "Emplacement",
  rateCouldYouLiveIn:   "Y habiteriez-vous ?",
};

const Stars = ({ value }) => {
  if (value == null) return <span className="text-gray-400 text-xs">—</span>;
  const full = Math.round(value);
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(full)}{"☆".repeat(Math.max(0, 5 - full))}
      <span className="text-gray-500 text-xs ml-1">{value}/5</span>
    </span>
  );
};

const PerceptionBar = ({ label, pct, colorClass }) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-800">{pct}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2.5">
      <div className={`${colorClass} h-2.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

const PriceBar = ({ price, count, maxCount }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-xs text-gray-500 w-28 text-right shrink-0">{fmtPrice(price)}</span>
    <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
      <div
        className="bg-purple-400 h-full rounded transition-all"
        style={{ width: maxCount > 0 ? `${Math.round((count / maxCount) * 100)}%` : "0%" }}
      />
    </div>
    <span className="text-xs text-gray-600 w-6">{count}</span>
  </div>
);

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ApiClient.get(`admin/campaigns/${id}`).then((res) => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[400px] text-gray-400">Chargement…</div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="p-6 text-red-500">Campagne introuvable.</div>
      </Layout>
    );
  }

  const { campaign, consolidated, estimations } = data;
  const prop = campaign.propertyId || {};
  const owner = campaign.userId || {};
  const imgFile = prop.images?.[0]?.file || null;
  const maxBucket = consolidated.priceDistribution.length
    ? Math.max(...consolidated.priceDistribution.map((b) => b.count))
    : 1;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/p2p-estimation/campaigns")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-5 text-sm"
        >
          <FiArrowLeft /> Retour aux campagnes
        </button>

        <div className="bg-white rounded-xl shadow-box p-6 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-start gap-5">
            {/* Image bien */}
            <Link to={`/property/detail/${prop._id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 hover:opacity-80">
              {imgFile ? (
                <img src={methodModel.noImg(imgFile)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
              )}
            </Link>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#111827]">{campaign.campaignName || "—"}</h2>
              <Link to={`/property/detail/${prop._id}`} className="text-[#976DD0] hover:underline text-sm">
                {prop.propertyTitle || "—"}
              </Link>
              {(prop.city || prop.zipcode) && (
                <p className="text-sm text-gray-500">{[prop.zipcode, prop.city].filter(Boolean).join(" ")}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                <span>Lancé le : <strong>{campaign.startDate ? new Date(campaign.startDate).toLocaleDateString("fr-FR") : "—"}</strong></span>
                <span>·</span>
                <span>Fin le : <strong>{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString("fr-FR") : "—"}</strong></span>
                <span>·</span>
                <span>Durée : <strong>{DURATION_LABEL[campaign.duration] || campaign.duration || "—"}</strong></span>
                <span>·</span>
                <span>
                  Statut :{" "}
                  {campaign.status === "active" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">En cours</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Terminée</span>
                  )}
                </span>
                {owner._id && (
                  <>
                    <span>·</span>
                    <span>
                      Propriétaire :{" "}
                      <Link to={`/user/detail/${owner._id}`} className="text-[#976DD0] hover:underline font-medium">
                        {owner.fullName || "—"}
                      </Link>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Partie 1 : Données consolidées */}
        <h3 className="text-lg font-semibold text-[#111827] mb-3">Partie 1 — Données consolidées</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Prix */}
          <div className="bg-white rounded-xl shadow-box p-5">
            <p className="text-sm text-gray-500 mb-1">Prix de référence</p>
            <p className="text-2xl font-bold text-[#976DD0]">{fmtPrice(campaign.referencePrice)}</p>
            <p className="text-sm text-gray-500 mt-3 mb-1">Estimation moyenne</p>
            <p className="text-2xl font-bold text-gray-800">{fmtPrice(consolidated.avgPrice)}</p>
            <p className="text-sm text-gray-400 mt-3">{consolidated.estimationCount} estimation{consolidated.estimationCount !== 1 ? "s" : ""}</p>
          </div>

          {/* Perception */}
          <div className="bg-white rounded-xl shadow-box p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Perception du prix de référence</p>
            {Object.entries(PERCEPTION_CONFIG).map(([key, cfg]) => (
              <PerceptionBar
                key={key}
                label={cfg.label}
                pct={consolidated.perceptionPct[key] || 0}
                colorClass={cfg.color}
              />
            ))}
          </div>

          {/* Notes qualitatives */}
          <div className="bg-white rounded-xl shadow-box p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Notes qualitatives</p>
            {Object.entries(QUALITATIF_LABELS).map(([field, label]) => (
              <div key={field} className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{label}</span>
                <Stars value={consolidated.qualitative[field]} />
              </div>
            ))}
          </div>
        </div>

        {/* Distribution des prix */}
        {consolidated.priceDistribution.length > 0 && (
          <div className="bg-white rounded-xl shadow-box p-5 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Distribution des estimations de prix</p>
            {consolidated.priceDistribution.map((b) => (
              <PriceBar key={b.price} price={b.price} count={b.count} maxCount={maxBucket} />
            ))}
          </div>
        )}

        {/* Partie 2 : Données par estimation */}
        <h3 className="text-lg font-semibold text-[#111827] mb-3">Partie 2 — Données par estimation</h3>
        <div className="bg-white rounded-xl shadow-box overflow-x-auto">
          {estimations.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-400">Aucune estimation pour cette campagne.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Estimateur</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Perception</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Estimation prix</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Notes qualit.</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Commentaire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {estimations.map((e) => {
                  const user = e.userId || {};
                  const avgRating = [
                    e.ratePropertyTitle,
                    e.ratePropertyPictures,
                    e.rateInteriorDesign,
                    e.rateLocation,
                    e.rateCouldYouLiveIn,
                  ]
                    .filter((v) => v != null)
                    .reduce((s, v, _, a) => s + v / a.length, 0);
                  return (
                    <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                            {user.featuredProfilePhoto ? (
                              <img src={methodModel.noImg(user.featuredProfilePhoto)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                {(user.fullName || "?")[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                          {user._id ? (
                            <Link to={`/user/detail/${user._id}`} className="text-[#976DD0] hover:underline font-medium">
                              {user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "—"}
                            </Link>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {e.createdAt ? new Date(e.createdAt).toLocaleDateString("fr-FR") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {e.referencePrice ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PERCEPTION_BADGE[e.referencePrice] || "bg-gray-100 text-gray-600"}`}>
                            {PERCEPTION_CONFIG[e.referencePrice]?.label || e.referencePrice}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">
                        {fmtPrice(e.userReasonablePrice)}
                      </td>
                      <td className="px-4 py-3">
                        <Stars value={avgRating > 0 ? Math.round(avgRating * 10) / 10 : null} />
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px]">
                        <p className="truncate" title={e.comment}>{e.comment || "—"}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CampaignDetail;
