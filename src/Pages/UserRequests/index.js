import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { toast } from "react-toastify";
import Layout from "../../components/global/layout";
import { MdOutlineInbox } from "react-icons/md";
import { FaRegClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { PiLeafFill } from "react-icons/pi";
import Swal from "sweetalert2";
import moment from "moment";

const formatDate = (d) => {
  if (!d) return "\u2014";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const TYPE_LABELS = {
  training_partnership: "Partenariat Formation",
  support: "Support",
  account_deletion: "Suppression compte",
  other: "Autre",
};

const STATUS_CONFIG = {
  pending: { label: "En attente", icon: <FaRegClock className="text-amber-500" />, cls: "bg-amber-50 text-amber-700 border-amber-200" },
  processed: { label: "Trait\u00e9", icon: <FaCheckCircle className="text-emerald-500" />, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  accepted: { label: "Accept\u00e9", icon: <FaCheckCircle className="text-emerald-500" />, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Rejet\u00e9", icon: <FaTimesCircle className="text-red-500" />, cls: "bg-red-50 text-red-700 border-red-200" },
};

const TABS = [
  { value: "", label: "Toutes" },
  { value: "training_partnership", label: "Partenariat Formation" },
  { value: "support", label: "Support" },
  { value: "account_deletion", label: "Suppression compte" },
  { value: "other", label: "Autre" },
  { value: "energy_renovation", label: "R\u00e9novation \u00e9nerg\u00e9tique", isReno: true },
];

const ENERGY_RENO_COLS = [
  { key: "owner", label: "Propri\u00e9taire" },
  { key: "type", label: "Type de bien" },
  { key: "address", label: "Adresse / CP" },
  { key: "propertyFloor", label: "\u00c9tage" },
  { key: "building", label: "Ann\u00e9e constr." },
  { key: "totalFloorBuilding", label: "Nb \u00e9tages" },
  { key: "surface", label: "Surface" },
  { key: "rooms", label: "Pi\u00e8ces" },
  { key: "heatingType", label: "Chauffage" },
  { key: "energymode", label: "Mode conso." },
  { key: "energyConsumption", label: "Conso. (kWh/m\u00b2)" },
  { key: "emissions", label: "GES (kgCO\u2082/m\u00b2)" },
  { key: "diagnosisDate", label: "Date diagnostic" },
  { key: "status", label: "Statut" },
  { key: "actions", label: "Actions" },
];

const UserRequests = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ type: "", status: "", page: 1, count: 20 });
  const [expanded, setExpanded] = useState(null);
  const [renoData, setRenoData] = useState([]);
  const [renoTotal, setRenoTotal] = useState(0);
  const [renoFilters, setRenoFilters] = useState({ page: 1, count: 20, status: "" });

  const activeTab = filters.type;
  const isRenoTab = activeTab === "energy_renovation";

  const getData = (p = {}) => {
    const f = { ...filters, ...p };
    loader(true);
    ApiClient.get("user-requests/listing", f).then((res) => {
      if (res.success) { setData(res.data); setTotal(res.total); }
      loader(false);
    });
  };

  const getRenoData = (p = {}) => {
    const f = { ...renoFilters, ...p, contact: "true" };
    loader(true);
    ApiClient.get("property/listing", f).then((res) => {
      if (res.success) {
        setRenoData(res.data.map((r) => ({ ...r, id: r._id })));
        setRenoTotal(res.total);
      }
      loader(false);
    });
  };

  useEffect(() => { getData(); }, []);

  const handleTabChange = (type) => {
    setFilters((prev) => ({ ...prev, type, page: 1, status: "" }));
    if (type === "energy_renovation") getRenoData({ page: 1, status: "" });
    else getData({ type, page: 1, status: "" });
  };

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
    if (isRenoTab) {
      setRenoFilters((prev) => ({ ...prev, status, page: 1 }));
      getRenoData({ status, page: 1 });
    } else {
      getData({ status, page: 1 });
    }
  };

  const updateStatus = (id, status) => {
    loader(true);
    ApiClient.put("user-requests/status", { id, status }).then((res) => {
      if (res.success) {
        setData((prev) => prev.map((r) => (r.id === id || r._id === id) ? { ...r, status } : r));
        toast.success("Statut mis \u00e0 jour");
      } else { toast.error(res.message); }
      loader(false);
    });
  };

  const updateRenoStatus = (row, newStatus) => {
    loader(true);
    ApiClient.put("property/editProperty", { id: row.id || row._id, request_status: newStatus }).then((res) => {
      if (res.success) {
        setRenoData((prev) => prev.map((r) => (r.id === (row.id || row._id)) ? { ...r, request_status: newStatus } : r));
        toast.success("Statut mis \u00e0 jour");
      } else { toast.error(res.message || "Erreur"); }
      loader(false);
    });
  };

  const confirmRenoAction = (row, newStatus) => {
    Swal.fire({
      title: newStatus === "accepted" ? "Confirmer la prise en charge" : "Confirmer le rejet",
      text: newStatus === "accepted" ? "Marquer cette demande comme trait\u00e9e ?" : "Rejeter cette demande de r\u00e9novation ?",
      iconHtml: newStatus === "accepted"
        ? '<img src="/assets/img/svgs/lightbulb.svg" style="width:50px;height:50px;padding:4px"/>'
        : '<img src="/assets/img/svgs/reject-request.png" style="width:60px;height:60px"/>',
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
    }).then((result) => { if (result.isConfirmed) updateRenoStatus(row, newStatus); });
  };

  const pendingCount = data.filter((r) => r.status === "pending").length;

  const renderRenoCell = (row, key) => {
    switch (key) {
      case "owner": {
        const u = row?.addedBy_details;
        const name = u?.fullName || [u?.firstName, u?.lastName].filter(Boolean).join(" ") || "\u2014";
        return (
          <td key={key} className="px-3 py-3">
            <p className="font-medium text-[#343F4B] whitespace-nowrap">{name}</p>
            {u?.email && <p className="text-[#8492A6] text-xs">{u.email}</p>}
          </td>
        );
      }
      case "type":
        return <td key={key} className="px-3 py-3 capitalize text-[#47525E]">{row?.type || "\u2014"}</td>;
      case "address":
        return (
          <td key={key} className="px-3 py-3 text-[#47525E]">
            {row?.address || "\u2014"}
            {row?.zipcode && <span className="ml-1 text-xs text-gray-400">({row.zipcode})</span>}
          </td>
        );
      case "propertyFloor":
        return <td key={key} className="px-3 py-3 text-center text-[#47525E]">{row?.propertyFloor ?? "\u2014"}</td>;
      case "building":
        return <td key={key} className="px-3 py-3 text-[#47525E]">{row?.building || "\u2014"}</td>;
      case "totalFloorBuilding":
        return <td key={key} className="px-3 py-3 text-center text-[#47525E]">{row?.totalFloorBuilding ?? "\u2014"}</td>;
      case "surface":
        return <td key={key} className="px-3 py-3 text-[#47525E]">{row?.surface ? `${row.surface} m\u00b2` : "\u2014"}</td>;
      case "rooms":
        return <td key={key} className="px-3 py-3 text-center text-[#47525E]">{row?.rooms ?? "\u2014"}</td>;
      case "heatingType":
        return <td key={key} className="px-3 py-3 capitalize text-[#47525E]">{row?.heatingType?.name || "\u2014"}</td>;
      case "energymode":
        return <td key={key} className="px-3 py-3 capitalize text-[#47525E]">{row?.energymode?.name || "\u2014"}</td>;
      case "energyConsumption":
        return <td key={key} className="px-3 py-3 text-[#47525E]">{row?.energyConsumption || "\u2014"}</td>;
      case "emissions":
        return <td key={key} className="px-3 py-3 text-[#47525E]">{row?.emissions || "\u2014"}</td>;
      case "diagnosisDate": {
        const d = row?.diagnosisDate || row?.dateOfDiagnosis;
        return <td key={key} className="px-3 py-3 text-[#47525E] whitespace-nowrap">{d ? moment(d).format("DD/MM/YYYY") : "\u2014"}</td>;
      }
      case "status": {
        const s = row?.request_status || "pending";
        const cfg = STATUS_CONFIG[s] || STATUS_CONFIG.pending;
        return (
          <td key={key} className="px-3 py-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.cls}`}>
              {cfg.icon}{cfg.label}
            </span>
          </td>
        );
      }
      case "actions": {
        const s = row?.request_status || "pending";
        return (
          <td key={key} className="px-3 py-3">
            {s === "pending" ? (
              <div className="flex gap-2">
                <button onClick={() => confirmRenoAction(row, "accepted")} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap">Traiter</button>
                <button onClick={() => confirmRenoAction(row, "rejected")} className="text-xs bg-white hover:bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full transition-colors">Rejeter</button>
              </div>
            ) : (
              <button onClick={() => updateRenoStatus(row, "pending")} className="text-xs text-[#8492A6] hover:text-[#976DD0] underline whitespace-nowrap">Remettre en attente</button>
            )}
          </td>
        );
      }
      default:
        return <td key={key} className="px-3 py-3">\u2014</td>;
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#976DD0]/10 flex items-center justify-center">
            <MdOutlineInbox className="text-[#976DD0] text-[20px]" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#343F4B]">
              Demandes utilisateurs
              {!isRenoTab && pendingCount > 0 && (
                <span className="ml-2 bg-[#976DD0] text-white text-[11px] font-semibold rounded-full px-2 py-0.5">{pendingCount} en attente</span>
              )}
            </h1>
            <p className="text-sm text-[#8492A6]">
              {isRenoTab
                ? `${renoTotal} demande${renoTotal > 1 ? "s" : ""} de r\u00e9novation \u00e9nerg\u00e9tique`
                : `${total} demande${total > 1 ? "s" : ""} au total`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filters.type === tab.value
                  ? "bg-[#976DD0] text-white border-[#976DD0]"
                  : "bg-white text-[#47525E] border-[#D2D2D2] hover:border-[#976DD0] hover:text-[#976DD0]"
              }`}
            >
              {tab.isReno && <PiLeafFill className={filters.type === tab.value ? "text-white" : "text-green-500"} />}
              {tab.label}
            </button>
          ))}
          <select
            value={filters.status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="ml-auto border border-[#D2D2D2] rounded-full px-3 py-1.5 text-sm text-[#47525E] focus:outline-none focus:border-[#976DD0]"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            {isRenoTab ? (
              <>
                <option value="accepted">Accept\u00e9</option>
                <option value="rejected">Rejet\u00e9</option>
              </>
            ) : (
              <>
                <option value="processed">Trait\u00e9</option>
                <option value="rejected">Rejet\u00e9</option>
              </>
            )}
          </select>
        </div>

        {isRenoTab ? (
          <div className="bg-white rounded-xl border border-[#E8EBF0] overflow-x-auto">
            {renoData.length === 0 ? (
              <div className="py-16 text-center text-[#8492A6]">
                <PiLeafFill className="text-[48px] mx-auto mb-3 opacity-20 text-green-500" />
                <p>Aucune demande de r\u00e9novation \u00e9nerg\u00e9tique</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#F7F8FA] border-b border-[#E8EBF0]">
                  <tr>
                    {ENERGY_RENO_COLS.map((col) => (
                      <th key={col.key} className="text-left px-3 py-3 text-[#8492A6] font-semibold whitespace-nowrap">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {renoData.map((row, i) => (
                    <tr key={row.id || row._id} className={`border-b border-[#F0F2F5] hover:bg-[#FAFBFC] transition-colors ${i % 2 !== 0 ? "bg-[#FAFBFC]/40" : ""}`}>
                      {ENERGY_RENO_COLS.map((col) => renderRenoCell(row, col.key))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
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
                      <tr key={row.id || row._id} className={`border-b border-[#F0F2F5] hover:bg-[#FAFBFC] transition-colors ${i % 2 !== 0 ? "bg-[#FAFBFC]/40" : ""}`}>
                        <td className="px-4 py-3 text-[#47525E] whitespace-nowrap">{formatDate(row.createdAt)}</td>
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
                              {" "}<button onClick={() => setExpanded(null)} className="text-[#976DD0] text-xs underline">R\u00e9duire</button>
                            </span>
                          ) : (
                            <span>
                              <span className="line-clamp-2">{row.message || <em className="text-[#C4CBD4]">\u2014</em>}</span>
                              {row.message?.length > 80 && (
                                <button onClick={() => setExpanded(row.id || row._id)} className="text-[#976DD0] text-xs underline">Voir plus</button>
                              )}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusCfg.cls}`}>
                            {statusCfg.icon}{statusCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {row.status === "pending" ? (
                            <div className="flex gap-2">
                              <button onClick={() => updateStatus(row.id || row._id, "processed")} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-full transition-colors">Traiter</button>
                              <button onClick={() => updateStatus(row.id || row._id, "rejected")} className="text-xs bg-white hover:bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full transition-colors">Rejeter</button>
                            </div>
                          ) : (
                            <button onClick={() => updateStatus(row.id || row._id, "pending")} className="text-xs text-[#8492A6] hover:text-[#976DD0] underline">Remettre en attente</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserRequests;
