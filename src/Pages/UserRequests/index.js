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
import environment from "../../environment";

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
  { value: "property_report", label: "Signalement profil", isReport: true },
  { value: "pro_request", label: "Pro request", isProRequest: true },
];

const PRO_REQUEST_COLS = [
  { key: "reporter", label: "Nom et pr\u00e9nom" },
  { key: "phone", label: "T\u00e9l\u00e9phone" },
  { key: "email", label: "Email" },
  { key: "likeToBuy", label: "D\u00e9lai achat" },
  { key: "owner", label: "Propri\u00e9taire" },
  { key: "noMarketing", label: "No marketing" },
  { key: "messageText", label: "Message" },
  { key: "property", label: "Bien" },
  { key: "status", label: "Statut" },
  { key: "actions", label: "Actions" },
];

const REPORT_COLS = [
  { key: "ref", label: "R\u00e9f\u00e9rence" },
  { key: "date", label: "Date" },
  { key: "reporter", label: "Nom et pr\u00e9nom" },
  { key: "email", label: "Email" },
  { key: "phone", label: "T\u00e9l\u00e9phone" },
  { key: "property", label: "Bien signal\u00e9" },
  { key: "reason", label: "Raison" },
  { key: "status", label: "Statut" },
  { key: "actions", label: "Actions" },
];

const ENERGY_RENO_COLS = [
  { key: "owner", label: "Propri\u00e9taire" },
  { key: "email", label: "Email" },
  { key: "phone", label: "T\u00e9l\u00e9phone" },
  { key: "type", label: "Type de bien" },
  { key: "address", label: "Adresse / CP" },
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
  const [reportData, setReportData] = useState([]);
  const [reportTotal, setReportTotal] = useState(0);
  const [reportFilters, setReportFilters] = useState({ page: 1, count: 20, status: "" });
  const [reasonModal, setReasonModal] = useState(null);
  const [proMsgModal, setProMsgModal] = useState(null);
  const [proReqData, setProReqData] = useState([]);
  const [proReqTotal, setProReqTotal] = useState(0);
  const [proReqFilters, setProReqFilters] = useState({ page: 1, count: 20, status: "" });

  const activeTab = filters.type;
  const isRenoTab = activeTab === "energy_renovation";
  const isReportTab = activeTab === "property_report";
  const isProRequestTab = activeTab === "pro_request";

  const getData = (p = {}) => {
    const f = { ...filters, ...p };
    loader(true);
    ApiClient.get("user-requests/listing", f).then((res) => {
      if (res.success) { setData(res.data); setTotal(res.total); }
      loader(false);
    });
  };

  const getRenoData = (p = {}) => {
    const f = { ...renoFilters, ...p };
    loader(true);
    ApiClient.get("renovation-quote-requests/listing", f).then((res) => {
      if (res.success) {
        setRenoData(res.data.map((r) => ({ ...r, id: r._id || r.id })));
        setRenoTotal(res.total);
      }
      loader(false);
    });
  };

  const getReportData = (p = {}) => {
    const f = { ...reportFilters, ...p };
    loader(true);
    ApiClient.get("property-report/listing", f).then((res) => {
      if (res.success) {
        setReportData(res.data.map((r) => ({ ...r, id: r._id || r.id })));
        setReportTotal(res.total);
      }
      loader(false);
    });
  };

  const getProReqData = (p = {}) => {
    const f = { ...proReqFilters, ...p };
    loader(true);
    ApiClient.get("pro-request/listing", f).then((res) => {
      if (res.success) {
        setProReqData(res.data.map((r) => ({ ...r, id: r._id || r.id })));
        setProReqTotal(res.total);
      }
      loader(false);
    });
  };

  useEffect(() => { getData(); }, []);

  const handleTabChange = (type) => {
    setFilters((prev) => ({ ...prev, type, page: 1, status: "" }));
    if (type === "energy_renovation") getRenoData({ page: 1, status: "" });
    else if (type === "property_report") getReportData({ page: 1, status: "" });
    else if (type === "pro_request") getProReqData({ page: 1, status: "" });
    else getData({ type, page: 1, status: "" });
  };

  const handleStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
    if (isRenoTab) {
      setRenoFilters((prev) => ({ ...prev, status, page: 1 }));
      getRenoData({ status, page: 1 });
    } else if (isReportTab) {
      setReportFilters((prev) => ({ ...prev, status, page: 1 }));
      getReportData({ status, page: 1 });
    } else if (isProRequestTab) {
      setProReqFilters((prev) => ({ ...prev, status, page: 1 }));
      getProReqData({ status, page: 1 });
    } else {
      getData({ status, page: 1 });
    }
  };

  const exportCSV = () => {
    const rows = isRenoTab ? renoData : isReportTab ? reportData : isProRequestTab ? proReqData : data;
    if (!rows.length) { toast.info("Aucune donn\u00e9e \u00e0 exporter"); return; }

    let headers, getCells;
    if (isProRequestTab) {
      headers = ["Date", "Pr\u00e9nom", "Nom", "Email", "T\u00e9l\u00e9phone", "D\u00e9lai achat", "Propri\u00e9taire", "Message", "R\u00e9f bien", "Statut"];
      getCells = (row) => [
        row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "",
        row.firstName || "",
        row.lastName || "",
        row.email || "",
        row.phone || "",
        row.likeToBuy === "Later" ? "Plus tard" : "Maintenant",
        row.alreadyOwnProperty ? "Oui" : "Non",
        row.messageText || "",
        row.propertyRef || "",
        row.status || "pending",
      ];
    } else if (isReportTab) {
      headers = ["R\u00e9f\u00e9rence", "Date", "Pr\u00e9nom", "Nom", "Email", "T\u00e9l\u00e9phone", "ID Bien", "Raison", "Statut"];
      getCells = (row) => [
        row.ref || "",
        row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "",
        row.firstName || "",
        row.lastName || "",
        row.email || "",
        row.phone || "",
        row.propertyRef || row.propertyId || "",
        row.reason || "",
        row.status || "pending",
      ];
    } else if (isRenoTab) {
      headers = ["Propriétaire", "Email", "Téléphone", "Type de bien", "Adresse", "CP", "Ville", "Surface", "Pièces", "Chauffage", "Mode conso.", "Conso. (kWh/m²)", "GES (kgCO₂/m²)", "Date diagnostic", "Statut", "Date demande"];
      getCells = (row) => [
        [row.firstName, row.lastName].filter(Boolean).join(" "),
        row.email || "",
        row.phone || "",
        row.type || "",
        row.address || "",
        row.zipcode || "",
        row.city || "",
        row.surface ? `${row.surface} m²` : "",
        row.rooms || "",
        row.heatingType?.name || row.heatingType || "",
        row.energymode?.name  || row.energymode  || "",
        row.energyConsumption || "",
        row.emissions || "",
        row.dateOfDiagnosis ? moment(row.dateOfDiagnosis).format("DD/MM/YYYY") : "",
        row.status || "pending",
        row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "",
      ];
    } else {
      headers = ["Date", "Prénom", "Nom", "Email", "Téléphone", "Type", "Message", "Statut"];
      getCells = (row) => [
        row.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "",
        row.firstName || "",
        row.lastName  || "",
        row.email     || "",
        row.phone     || "",
        TYPE_LABELS[row.type] || row.type || "",
        row.message   || "",
        row.status    || "",
      ];
    }

    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers.map(escape).join(","), ...rows.map((r) => getCells(r).map(escape).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isProRequestTab ? "pro-requests.csv" : isReportTab ? "signalements-profil.csv" : isRenoTab ? "devis-renovation.csv" : `demandes-${activeTab || "toutes"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    ApiClient.put("renovation-quote-requests/status", { id: row.id || row._id, status: newStatus }).then((res) => {
      if (res.success) {
        setRenoData((prev) => prev.map((r) => (r.id === (row.id || row._id)) ? { ...r, status: newStatus } : r));
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

  const updateReportStatus = (row, newStatus) => {
    loader(true);
    ApiClient.put("property-report/status", { id: row.id || row._id, status: newStatus }).then((res) => {
      if (res.success) {
        setReportData((prev) => prev.map((r) => (r.id === (row.id || row._id)) ? { ...r, status: newStatus } : r));
        toast.success("Statut mis \u00e0 jour");
      } else { toast.error(res.message || "Erreur"); }
      loader(false);
    });
  };

  const updateProReqStatus = (row, newStatus) => {
    loader(true);
    ApiClient.put("pro-request/status", { id: row.id || row._id, status: newStatus }).then((res) => {
      if (res.success) {
        setProReqData((prev) => prev.map((r) => (r.id === (row.id || row._id)) ? { ...r, status: newStatus } : r));
        toast.success("Statut mis \u00e0 jour");
      } else { toast.error(res.message || "Erreur"); }
      loader(false);
    });
  };

  const renderProRequestCell = (row, key) => {
    switch (key) {
      case "reporter": {
        const name = [row?.firstName, row?.lastName].filter(Boolean).join(" ") || "\u2014";
        const userId = row?.userId;
        return (
          <td key={key} className="px-3 py-3">
            {userId ? (
              <a href={`/user/detail/${userId}`} target="_blank" rel="noreferrer"
                className="font-medium text-[#976DD0] hover:underline whitespace-nowrap">
                {name}
              </a>
            ) : (
              <p className="font-medium text-[#343F4B] whitespace-nowrap">{name}</p>
            )}
          </td>
        );
      }
      case "phone":
        return <td key={key} className="px-3 py-3 text-[#47525E] text-xs whitespace-nowrap">{row?.phone || "\u2014"}</td>;
      case "email":
        return <td key={key} className="px-3 py-3 text-[#47525E] text-xs">{row?.email || "\u2014"}</td>;
      case "likeToBuy": {
        const label = row?.likeToBuy === "Later" ? "Plus tard" : "Maintenant";
        const cls = row?.likeToBuy === "Later" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
        return (
          <td key={key} className="px-3 py-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>
          </td>
        );
      }
      case "owner": {
        const label = row?.alreadyOwnProperty ? "Oui" : "Non";
        const cls = row?.alreadyOwnProperty ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-600 border-gray-200";
        return (
          <td key={key} className="px-3 py-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>
          </td>
        );
      }
      case "noMarketing": {
        const checked = row?.noMarketingEmails === true;
        return (
          <td key={key} className="px-3 py-3 text-center">
            {checked
              ? <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Oui</span>
              : <span className="text-xs text-gray-400">Non</span>}
          </td>
        );
      }
      case "messageText":
        return (
          <td key={key} className="px-3 py-3 text-[#47525E] max-w-[180px]">
            {row?.messageText ? (
              <>
                <span className="line-clamp-2 text-xs">{row.messageText}</span>
                {row.messageText.length > 60 && (
                  <button onClick={() => setProMsgModal(row.messageText)}
                    className="text-[10px] text-[#976DD0] underline mt-0.5 block">
                    Voir tout
                  </button>
                )}
              </>
            ) : <span className="text-gray-400 text-xs">\u2014</span>}
          </td>
        );
      case "property": {
        const imgUrl = row?.propertyImage ? `${environment.api}img/${row.propertyImage}` : null;
        const propId = row?.propertyId;
        const propRef = row?.propertyRef || propId;
        return (
          <td key={key} className="px-3 py-3">
            {imgUrl && (
              <a href={`/property/admin/${propId}`} target="_blank" rel="noreferrer">
                <img src={imgUrl} alt="" className="w-12 h-8 rounded object-cover mb-1" />
              </a>
            )}
            {propRef && (
              <a href={`/property/admin/${propId}`} target="_blank" rel="noreferrer"
                className="text-xs text-[#976DD0] underline whitespace-nowrap block">
                {propRef}
              </a>
            )}
            {!imgUrl && !propRef && <span className="text-gray-400 text-xs">\u2014</span>}
          </td>
        );
      }
      case "status": {
        const s = row?.status || "pending";
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
        const s = row?.status || "pending";
        return (
          <td key={key} className="px-3 py-3">
            {s === "pending" ? (
              <div className="flex gap-2">
                <button onClick={() => updateProReqStatus(row, "processed")} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap">Traiter</button>
                <button onClick={() => updateProReqStatus(row, "rejected")} className="text-xs bg-white hover:bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full transition-colors">Rejeter</button>
              </div>
            ) : (
              <button onClick={() => updateProReqStatus(row, "pending")} className="text-xs text-[#8492A6] hover:text-[#976DD0] underline whitespace-nowrap">Remettre en attente</button>
            )}
          </td>
        );
      }
      default:
        return <td key={key} className="px-3 py-3">\u2014</td>;
    }
  };

  const renderReportCell = (row, key) => {
    switch (key) {
      case "ref":
        return <td key={key} className="px-3 py-3 text-xs font-mono text-[#976DD0] whitespace-nowrap">{row?.ref || "\u2014"}</td>;
      case "date":
        return <td key={key} className="px-3 py-3 text-[#47525E] text-xs whitespace-nowrap">{row?.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "\u2014"}</td>;
      case "reporter": {
        const name = [row?.firstName, row?.lastName].filter(Boolean).join(" ") || "\u2014";
        return (
          <td key={key} className="px-3 py-3">
            <p className="font-medium text-[#343F4B] whitespace-nowrap">{name}</p>
          </td>
        );
      }
      case "email":
        return <td key={key} className="px-3 py-3 text-[#47525E] text-xs">{row?.email || "\u2014"}</td>;
      case "phone":
        return <td key={key} className="px-3 py-3 text-[#47525E] text-xs whitespace-nowrap">{row?.phone || "\u2014"}</td>;
      case "property": {
        const propRef = row?.propertyRef || row?.propertyId;
        if (!propRef) return <td key={key} className="px-3 py-3 text-gray-400">\u2014</td>;
        const imgUrl = row?.propertyImage ? `${environment.api}img/${row.propertyImage}` : null;
        return (
          <td key={key} className="px-3 py-3">
            {imgUrl && (
              <img src={imgUrl} alt="" className="w-10 h-10 rounded object-cover mb-1" />
            )}
            <a
              href={`/property/admin/${row?.propertyId}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#976DD0] underline whitespace-nowrap"
            >
              {row?.propertyRef || row?.propertyId}
            </a>
          </td>
        );
      }
      case "reason":
        return (
          <td key={key} className="px-3 py-3 text-[#47525E] max-w-[220px]">
            <span className="line-clamp-2 text-xs">{row?.reason || "\u2014"}</span>
            {row?.reason && row.reason.length > 60 && (
              <button
                onClick={() => setReasonModal(row.reason)}
                className="text-[10px] text-[#976DD0] underline mt-0.5 block"
              >
                Voir tout
              </button>
            )}
          </td>
        );
      case "status": {
        const s = row?.status || "pending";
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
        const s = row?.status || "pending";
        return (
          <td key={key} className="px-3 py-3">
            {s === "pending" ? (
              <div className="flex gap-2">
                <button onClick={() => updateReportStatus(row, "processed")} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-full transition-colors whitespace-nowrap">Traiter</button>
                <button onClick={() => updateReportStatus(row, "rejected")} className="text-xs bg-white hover:bg-red-50 text-red-500 border border-red-200 px-3 py-1 rounded-full transition-colors">Rejeter</button>
              </div>
            ) : (
              <button onClick={() => updateReportStatus(row, "pending")} className="text-xs text-[#8492A6] hover:text-[#976DD0] underline whitespace-nowrap">Remettre en attente</button>
            )}
          </td>
        );
      }
      default:
        return <td key={key} className="px-3 py-3">\u2014</td>;
    }
  };

  const renderRenoCell = (row, key) => {
    switch (key) {
      case "owner": {
        const name = [row?.firstName, row?.lastName].filter(Boolean).join(" ") || "\u2014";
        return (
          <td key={key} className="px-3 py-3">
            <p className="font-medium text-[#343F4B] whitespace-nowrap">{name}</p>
          </td>
        );
      }
      case "email":
        return <td key={key} className="px-3 py-3 text-[#47525E] text-xs">{row?.email || "\u2014"}</td>;
      case "phone":
        return <td key={key} className="px-3 py-3 text-[#47525E] text-xs whitespace-nowrap">{row?.phone || "\u2014"}</td>;
      case "type":
        return <td key={key} className="px-3 py-3 capitalize text-[#47525E]">{row?.type || "\u2014"}</td>;
      case "address":
        return (
          <td key={key} className="px-3 py-3 text-[#47525E]">
            {row?.address || "\u2014"}
            {row?.zipcode && <span className="ml-1 text-xs text-gray-400">({row.zipcode})</span>}
          </td>
        );
      case "surface":
        return <td key={key} className="px-3 py-3 text-[#47525E]">{row?.surface ? `${row.surface} m\u00b2` : "\u2014"}</td>;
      case "rooms":
        return <td key={key} className="px-3 py-3 text-center text-[#47525E]">{row?.rooms ?? "\u2014"}</td>;
      case "heatingType":
        return <td key={key} className="px-3 py-3 capitalize text-[#47525E]">{row?.heatingType?.name || row?.heatingType || "\u2014"}</td>;
      case "energymode":
        return <td key={key} className="px-3 py-3 capitalize text-[#47525E]">{row?.energymode?.name || row?.energymode || "\u2014"}</td>;
      case "energyConsumption":
        return <td key={key} className="px-3 py-3 text-[#47525E]">{row?.energyConsumption || "\u2014"}</td>;
      case "emissions":
        return <td key={key} className="px-3 py-3 text-[#47525E]">{row?.emissions || "\u2014"}</td>;
      case "diagnosisDate": {
        const d = row?.dateOfDiagnosis;
        return <td key={key} className="px-3 py-3 text-[#47525E] whitespace-nowrap">{d ? moment(d).format("DD/MM/YYYY") : "\u2014"}</td>;
      }
      case "status": {
        const s = row?.status || "pending";
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
        const s = row?.status || "pending";
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
                : isReportTab
                ? `${reportTotal} signalement${reportTotal > 1 ? "s" : ""}`
                : isProRequestTab
                ? `${proReqTotal} demande${proReqTotal > 1 ? "s" : ""} pro`
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
              {tab.isReport && <span className={filters.type === tab.value ? "text-white" : "text-[#976DD0]"}>⚠️</span>}
              {tab.isProRequest && <span className={filters.type === tab.value ? "text-white" : "text-[#976DD0]"}>🏠</span>}
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
          <button
            onClick={exportCSV}
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border border-[#976DD0] text-[#976DD0] bg-white hover:bg-[#976DD0] hover:text-white transition-all whitespace-nowrap"
          >
            ↓ Export CSV
          </button>
        </div>

        {isProRequestTab ? (
          <div className="bg-white rounded-xl border border-[#E8EBF0] overflow-x-auto">
            {proReqData.length === 0 ? (
              <div className="py-16 text-center text-[#8492A6]">
                <MdOutlineInbox className="text-[48px] mx-auto mb-3 opacity-30" />
                <p>Aucune demande pro pour le moment</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#F7F8FA] border-b border-[#E8EBF0]">
                  <tr>
                    {PRO_REQUEST_COLS.map((col) => (
                      <th key={col.key} className="text-left px-3 py-3 text-[#8492A6] font-semibold whitespace-nowrap">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {proReqData.map((row, i) => (
                    <tr key={row.id || row._id} className={`border-b border-[#F0F2F5] hover:bg-[#FAFBFC] transition-colors ${i % 2 !== 0 ? "bg-[#FAFBFC]/40" : ""}`}>
                      {PRO_REQUEST_COLS.map((col) => renderProRequestCell(row, col.key))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : isReportTab ? (
          <div className="bg-white rounded-xl border border-[#E8EBF0] overflow-x-auto">
            {reportData.length === 0 ? (
              <div className="py-16 text-center text-[#8492A6]">
                <MdOutlineInbox className="text-[48px] mx-auto mb-3 opacity-30" />
                <p>Aucun signalement pour le moment</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#F7F8FA] border-b border-[#E8EBF0]">
                  <tr>
                    {REPORT_COLS.map((col) => (
                      <th key={col.key} className="text-left px-3 py-3 text-[#8492A6] font-semibold whitespace-nowrap">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={row.id || row._id} className={`border-b border-[#F0F2F5] hover:bg-[#FAFBFC] transition-colors ${i % 2 !== 0 ? "bg-[#FAFBFC]/40" : ""}`}>
                      {REPORT_COLS.map((col) => renderReportCell(row, col.key))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : isRenoTab ? (
          <div className="bg-white rounded-xl border border-[#E8EBF0] overflow-x-auto">
            {renoData.length === 0 ? (
              <div className="py-16 text-center text-[#8492A6]">
                <PiLeafFill className="text-[48px] mx-auto mb-3 opacity-20 text-green-500" />
                <p>Aucune demande de rénovation énergétique</p>
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

      {/* ── Modal raison du signalement ────────────────────────────────── */}
      {reasonModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setReasonModal(null)}
        >
          <div
            className="bg-white rounded-[12px] w-full max-w-lg p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg leading-none"
              onClick={() => setReasonModal(null)}
            >
              ✕
            </button>
            <h3 className="text-[15px] font-[600] text-[#343F4B] mb-3">Raison du signalement</h3>
            <p className="text-sm text-[#47525E] whitespace-pre-wrap leading-relaxed">{reasonModal}</p>
          </div>
        </div>
      )}

      {/* ── Modal message pro request ──────────────────────────────────── */}
      {proMsgModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setProMsgModal(null)}
        >
          <div
            className="bg-white rounded-[12px] w-full max-w-lg p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg leading-none"
              onClick={() => setProMsgModal(null)}
            >
              ✕
            </button>
            <h3 className="text-[15px] font-[600] text-[#343F4B] mb-3">Message du prospect</h3>
            <p className="text-sm text-[#47525E] whitespace-pre-wrap leading-relaxed">{proMsgModal}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserRequests;
