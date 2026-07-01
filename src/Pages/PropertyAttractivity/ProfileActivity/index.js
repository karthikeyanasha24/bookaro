import { useEffect, useState, useCallback } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import Layout from "../../../components/global/layout";
import { useNavigate } from "react-router-dom";
import methodModel from "../../../methods/methods";
import {
  FaEye, FaHeart, FaBookmark, FaShare, FaBell, FaEnvelope, FaHandshake, FaArrowsAltH,
} from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";

const EVENT_TYPES = [
  { value: "", label: "Toutes", icon: <FaArrowsAltH /> },
  { value: "profile_view", label: "Vues", icon: <FaEye /> },
  { value: "like", label: "Likes", icon: <FaHeart /> },
  { value: "follow", label: "Follows", icon: <FaBookmark /> },
  { value: "share", label: "Partages", icon: <FaShare /> },
  { value: "offer_sent", label: "Intérêts / Offres", icon: <FaBell /> },
  { value: "contact_owner", label: "Messages", icon: <FaEnvelope /> },
  { value: "visit_request", label: "Visites bookées", icon: <FaHandshake /> },
];

const TYPE_COLORS = {
  profile_view: "bg-blue-100 text-blue-700",
  like: "bg-pink-100 text-pink-700",
  unlike: "bg-gray-100 text-gray-600",
  follow: "bg-violet-100 text-violet-700",
  unfollow: "bg-gray-100 text-gray-500",
  share: "bg-cyan-100 text-cyan-700",
  offer_sent: "bg-amber-100 text-amber-700",
  contact_owner: "bg-green-100 text-green-700",
  visit_request: "bg-orange-100 text-orange-700",
};

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const fmtDuration = (sec) => {
  if (!sec || sec <= 0) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const Avatar = ({ src, name, size = 8 }) => {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return src ? (
    <img src={methodModel.noImg(src)} alt={name} className={`w-${size} h-${size} rounded-full object-cover`} />
  ) : (
    <div className={`w-${size} h-${size} rounded-full bg-[#976DD0] text-white flex items-center justify-center text-xs font-bold`}>
      {initials}
    </div>
  );
};

const SummaryCard = ({ icon, label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-[12px] border transition-all cursor-pointer
      ${active
        ? "border-[#976DD0] bg-[#976DD0] text-white shadow-md"
        : "border-[#D2D2D2] bg-white text-[#47525E] hover:border-[#976DD0]"
      }`}
  >
    <span className="text-2xl mb-1">{icon}</span>
    <span className="text-xl font-bold">{count.toLocaleString("fr-FR")}</span>
    <span className="text-xs mt-0.5 opacity-80">{label}</span>
  </button>
);

const ProfileActivity = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({});
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeType, setActiveType] = useState("");
  const [page, setPage] = useState(1);
  const COUNT = 20;

  const loadSummary = useCallback(async () => {
    try {
      const res = await ApiClient.get("admin/property-attractivity/activity-summary");
      if (res?.success) setSummary(res.data || {});
    } catch (_) {}
  }, []);

  const loadLogs = useCallback(async (type, pg) => {
    loader(true);
    try {
      const params = new URLSearchParams({ page: pg, count: COUNT });
      if (type) params.append("type", type);
      const res = await ApiClient.get(`admin/property-attractivity/activity-logs?${params}`);
      if (res?.success) {
        setLogs(res.data || []);
        setTotal(res.total || 0);
      }
    } catch (_) {}
    loader(false);
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadLogs(activeType, page);
  }, [activeType, page, loadLogs]);

  const handleTabChange = (type) => {
    setActiveType(type);
    setPage(1);
  };

  const totalPages = Math.ceil(total / COUNT);

  return (
    <Layout>
      <div className="min-h-screen bg-[#f3f5f9] p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#47525E]">Profile Activity</h1>
          <p className="text-sm text-gray-500 mt-1">
            Activité consolidée sur tous les profils de bien
          </p>
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {EVENT_TYPES.filter((t) => t.value).map((t) => (
            <SummaryCard
              key={t.value}
              icon={t.icon}
              label={t.label}
              count={summary[t.value] || 0}
              active={activeType === t.value}
              onClick={() => handleTabChange(t.value)}
            />
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-[12px] border border-[#D2D2D2] overflow-hidden">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-[#D2D2D2]">
            {EVENT_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleTabChange(t.value)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm whitespace-nowrap transition-colors
                  ${activeType === t.value
                    ? "border-b-2 border-[#976DD0] text-[#976DD0] font-semibold"
                    : "text-[#47525E] hover:text-[#976DD0]"
                  }`}
              >
                {t.icon}
                {t.label}
                {t.value && (
                  <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full
                    ${activeType === t.value ? "bg-[#ede5f7] text-[#976DD0]" : "bg-gray-100 text-gray-500"}`}>
                    {(summary[t.value] || 0).toLocaleString("fr-FR")}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f8f8] text-[#47525E] text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Utilisateur</th>
                  <th className="px-4 py-3 text-left">Date & Heure</th>
                  <th className="px-4 py-3 text-left">Bien</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Durée</th>
                  <th className="px-4 py-3 text-left">Section visitée</th>
                  <th className="px-4 py-3 text-left">Tél. révélé</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                      Aucune activité trouvée
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const user = log.userId;
                    const prop = log.propertyId;
                    const userName = user
                      ? user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
                      : "Anonyme";
                    const propTitle = prop?.propertyTitle || "Bien inconnu";
                    const propImg = prop?.images?.[0]?.file;
                    const dur = fmtDuration(log.duration);

                    return (
                      <tr key={log._id} className="border-t border-[#F0F0F0] hover:bg-[#fafafa]">
                        {/* User */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => user?._id && navigate(`/user/detail/${user._id}`)}
                            className="flex items-center gap-2 hover:text-[#976DD0] transition-colors"
                          >
                            <Avatar src={user?.image} name={userName} size={8} />
                            <span className="font-medium">{userName}</span>
                          </button>
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {fmtDate(log.createdAt)}
                        </td>
                        {/* Property */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => prop?._id && navigate(`/property/detail/${prop._id}`)}
                            className="flex items-center gap-2 hover:text-[#976DD0] transition-colors max-w-[200px]"
                          >
                            {propImg ? (
                              <img src={methodModel.noImg(propImg)} alt="" className="w-10 h-8 rounded-md object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-8 rounded-md bg-gray-200 flex-shrink-0" />
                            )}
                            <span className="truncate text-sm font-medium">{propTitle}</span>
                          </button>
                        </td>
                        {/* Type badge */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${TYPE_COLORS[log.type] || "bg-gray-100 text-gray-600"}`}>
                              {log.type}
                            </span>
                            {log.funnelStatus && (
                              <span className="text-xs text-gray-400">{log.funnelStatus}</span>
                            )}
                            {log.makeOfferAmount > 0 && (
                              <span className="text-xs font-semibold text-[#976DD0]">
                                {log.makeOfferAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Duration */}
                        <td className="px-4 py-3 text-gray-500">
                          {dur ? (
                            <span className="flex items-center gap-1">
                              <MdOutlineAccessTime />
                              {dur}
                            </span>
                          ) : "—"}
                        </td>
                        {/* Section visited */}
                        <td className="px-4 py-3 text-gray-500">
                          {log.sectionVisited || "—"}
                        </td>
                        {/* Phone revealed */}
                        <td className="px-4 py-3">
                          {log.phoneRevealed === true ? (
                            <span className="text-green-600 font-medium text-xs">Oui</span>
                          ) : log.phoneRevealed === false ? (
                            <span className="text-gray-400 text-xs">Non</span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
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
                {total.toLocaleString("fr-FR")} résultat{total > 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-[#D2D2D2] text-sm disabled:opacity-40 hover:border-[#976DD0]"
                >
                  ← Précédent
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-500">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
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

export default ProfileActivity;
