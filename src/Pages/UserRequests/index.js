import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { toast } from "react-toastify";
import Layout from "../../components/global/layout";
import { MdOutlineInbox } from "react-icons/md";
import { FaRegClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const TYPE_LABELS = {
  training_partnership: "Partenariat Formation",
  support: "Support",
  account_deletion: "Suppression compte",
  other: "Autre",
};

const STATUS_CONFIG = {
  pending: {
    label: "En attente",
    icon: <FaRegClock className="text-amber-500" />,
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  processed: {
    label: "Traité",
    icon: <FaCheckCircle className="text-emerald-500" />,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejeté",
    icon: <FaTimesCircle className="text-red-500" />,
    cls: "bg-red-50 text-red-700 border-red-200",
  },
};

const TABS = [
  { value: "", label: "Toutes" },
  { value: "training_partnership", label: "Partenariat Formation" },
  { value: "support", label: "Support" },
  { value: "account_deletion", label: "Suppression compte" },
  { value: "other", label: "Autre" },
];

const UserRequests = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ type: "", status: "", page: 1, count: 20 });
  const [expanded, setExpanded] = useState(null);

  const getData = (p = {}) => {
    const f = { ...filters, ...p };
    loader(true);
    ApiClient.get("user-requests/listing", f).then((res) => {
      if (res.success) {
        setData(res.data);
        setTotal(res.total);
      }
      loader(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleTabChange = (type) => {
    const f = { type, page: 1 };
    setFilters((prev) => ({ ...prev, ...f }));
    getData(f);
  };

  const handleStatusFilter = (status) => {
    const f = { status, page: 1 };
    setFilters((prev) => ({ ...prev, ...f }));
    getData(f);
  };

  const updateStatus = (id, status) => {
    loader(true);
    ApiClient.put("user-requests/status", { id, status }).then((res) => {
      if (res.success) {
        setData((prev) => prev.map((r) => (r.id === id || r._id === id) ? { ...r, status } : r));
        toast.success("Statut mis à jour");
      } else {
        toast.error(res.message);
      }
      loader(false);
    });
  };

  const pendingCount = data.filter((r) => r.status === "pending").length;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#976DD0]/10 flex items-center justify-center">
            <MdOutlineInbox className="text-[#976DD0] text-[20px]" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#343F4B]">
              Demandes utilisateurs
              {pendingCount > 0 && (
                <span className="ml-2 bg-[#976DD0] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
                  {pendingCount} en attente
                </span>
              )}
            </h1>
            <p className="text-sm text-[#8492A6]">{total} demande{total > 1 ? "s" : ""} au total</p>
          </div>
        </div>

        {/* Tabs by type */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filters.type === tab.value
                  ? "bg-[#976DD0] text-white border-[#976DD0]"
                  : "bg-white text-[#47525E] border-[#D2D2D2] hover:border-[#976DD0] hover:text-[#976DD0]"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="ml-auto border border-[#D2D2D2] rounded-full px-3 py-1.5 text-sm text-[#47525E] focus:outline-none focus:border-[#976DD0]"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="processed">Traité</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#E8EBF0] overflow-hidden">
          {data.length === 0 ? (
            <div className="py-16 text-center text-[#8492A6]">
              <MdOutlineInbox className="text-[48px] mx-auto mb-3 opacity-30" />
              <p>Aucune demande pour le moment</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#F7F8FA] border-b border-[#E8EBF0]">
                <tr>
                  <th className="text-left px-4 py-3 text-[#8492A6] font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-[#8492A6] font-semibold">Demandeur</th>
                  <th className="text-left px-4 py-3 text-[#8492A6] font-semibold">Type</th>
                  <th className="text-left px-4 py-3 text-[#8492A6] font-semibold">Message</th>
                  <th className="text-left px-4 py-3 text-[#8492A6] font-semibold">Statut</th>
                  <th className="text-left px-4 py-3 text-[#8492A6] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => {
                  const statusCfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending;
                  const isExpanded = expanded === (row.id || row._id);
                  return (
                    <tr key={row.id || row._id} className={`border-b border-[#F0F2F5] hover:bg-[#FAFBFC] transition-colors ${i % 2 === 0 ? "" : "bg-[#FAFBFC]/40"}`}>
                      <td className="px-4 py-3 text-[#47525E] whitespace-nowrap">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#343F4B]">{row.firstName} {row.lastName}</p>
                        <p className="text-[#8492A6] text-xs">{row.email}</p>
                        {row.phone && <p className="text-[#8492A6] text-xs">{row.phone}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-[#976DD0]/10 text-[#976DD0] text-xs font-medium px-2.5 py-1 rounded-full">
                          {TYPE_LABELS[row.type] || row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#47525E] max-w-[260px]">
                        {isExpanded ? (
                          <span>
                            {row.message || <em className="text-[#C4CBD4]">Aucun message</em>}
                            {" "}
                            <button onClick={() => setExpanded(null)} className="text-[#976DD0] text-xs underline">Réduire</button>
                          </span>
                        ) : (
                          <span>
                            <span className="line-clamp-2">{row.message || <em className="text-[#C4CBD4]">—</em>}</span>
                            {row.message?.length > 80 && (
                              <button onClick={() => setExpanded(row.id || row._id)} className="text-[#976DD0] text-xs underline">Voir plus</button>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusCfg.cls}`}>
                          {statusCfg.icon}
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {row.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(row.id || row._id, "processed")}
                              className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-full transition-colors"
                            >
                              Traiter
                            </button>
                            <button
                              onClick={() => updateStatus(row.id || row._id, "rejected")}
                              className="text-xs bg-white hover:bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full transition-colors"
                            >
                              Rejeter
                            </button>
                          </div>
                        )}
                        {row.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(row.id || row._id, "pending")}
                            className="text-xs text-[#8492A6] hover:text-[#976DD0] underline"
                          >
                            Remettre en attente
                          </button>
                        )}
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

export default UserRequests;
