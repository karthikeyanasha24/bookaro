import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import { FiSearch, FiDownload } from "react-icons/fi";
import environment from "../../environment";

const COLUMNS = (navigate) => [
  {
    key: "createdAt",
    name: "Date création",
    sort: false,
    render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString("fr-FR") : "-",
  },
  {
    key: "ownerName",
    name: "Nom & Prénom",
    sort: false,
    render: (row) =>
      row.ownerId ? (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/user/detail/${row.ownerId}`); }}
          className="text-[#3b82f6] hover:underline font-medium"
        >
          {row.ownerName}
        </button>
      ) : (
        row.ownerName
      ),
  },
  {
    key: "email",
    name: "Email",
    sort: false,
    render: (row) => row.email || "-",
  },
  {
    key: "phoneNumber",
    name: "Téléphone",
    sort: false,
    render: (row) => row.phoneNumber || "-",
  },
  {
    key: "image",
    name: "Photo",
    sort: false,
    render: (row) => {
      const src = row.image ? `${environment.api}img/${row.image}` : null;
      return (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/property/admin/${row._id}`); }}
          className="block"
          title="Voir le bien"
        >
          {src ? (
            <img
              src={src}
              alt="bien"
              className="w-14 h-14 object-cover rounded-md border border-gray-200"
              onError={(e) => { e.currentTarget.src = "/assets/img/placeholder.png"; }}
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
              N/A
            </div>
          )}
        </button>
      );
    },
  },
  {
    key: "propertyTitle",
    name: "Référence",
    sort: false,
    render: (row) => (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); navigate(`/property/admin/${row._id}`); }}
        className="text-[#3b82f6] hover:underline text-left font-mono text-xs"
      >
        {row.propertyRef || String(row._id)}
      </button>
    ),
  },
  {
    key: "surface",
    name: "Surface (m²)",
    sort: false,
    render: (row) => row.surface || "-",
  },
  {
    key: "rooms",
    name: "Pièces",
    sort: false,
    render: (row) => row.rooms || "-",
  },
  {
    key: "location",
    name: "Ville / CP",
    sort: false,
    render: (row) =>
      [row.city, row.zipcode].filter(Boolean).join(" ") || "-",
  },
  {
    key: "propertyTypeLabel",
    name: "Statut",
    sort: false,
    render: (row) => {
      const colors = {
        Vente: "bg-blue-100 text-blue-700",
        Location: "bg-green-100 text-green-700",
        Annuaire: "bg-purple-100 text-purple-700",
      };
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[row.propertyTypeLabel] || "bg-gray-100 text-gray-600"}`}>
          {row.propertyTypeLabel || "-"}
        </span>
      );
    },
  },
  {
    key: "price",
    name: "Prix",
    sort: false,
    render: (row) =>
      row.price != null
        ? `${Number(row.price).toLocaleString("fr-FR")} €`
        : "-",
  },
];

const CSV_HEADERS = [
  "Date création",
  "Nom & Prénom",
  "Email",
  "Téléphone",
  "Titre du bien",
  "Référence (ID)",
  "Surface (m²)",
  "Pièces",
  "Ville",
  "Code postal",
  "Statut",
  "Prix",
];

const rowToCsv = (row) => [
  row.createdAt ? new Date(row.createdAt).toLocaleDateString("fr-FR") : "",
  row.ownerName || "",
  row.email || "",
  row.phoneNumber || "",
  row.propertyTitle || "",
  row.propertyRef || String(row._id || ""),
  row.surface || "",
  row.rooms || "",
  row.city || "",
  row.zipcode || "",
  row.propertyTypeLabel || "",
  row.price != null ? row.price : "",
];

const exportCsv = (data, filename) => {
  const escape = (v) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const rows = [CSV_HEADERS, ...data.map(rowToCsv)];
  const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const LeadTable = ({
  label,
  data,
  total,
  loading,
  filters,
  setFilters,
  onFilter,
  onPageChange,
  onCountChange,
  exportFilename,
  navigate,
}) => (
  <div className="shadow-box w-full bg-white rounded-lg mt-4">
    <div className="flex flex-wrap items-center justify-between gap-2 p-4">
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => { e.preventDefault(); onFilter(); }}
      >
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 ps-10 p-2.5 pr-4"
            placeholder={`Rechercher dans ${label}...`}
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#976DD0] rounded-lg hover:opacity-80"
        >
          Rechercher
        </button>
      </form>
      <button
        type="button"
        onClick={() => exportCsv(data, exportFilename)}
        disabled={data.length === 0}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#976DD0] border border-[#976DD0] rounded-lg hover:bg-[#f5f0ff] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiDownload className="text-[16px]" />
        Exporter CSV
      </button>
    </div>
    {loading ? (
      <div className="text-center py-8">
        <img src="/assets/img/loader.gif" className="pageLoader mx-auto" alt="loading" />
      </div>
    ) : (
      <Table
        className="mb-3 p-4 pt-0"
        data={data}
        columns={COLUMNS(navigate)}
        page={filters.page}
        count={filters.count}
        filters={filters}
        total={total}
        result={(e) => {
          if (e.event === "page") onPageChange(e.value);
          if (e.event === "count") onCountChange(e.value);
        }}
      />
    )}
  </div>
);

const Html = ({
  activeTab,
  setActiveTab,
  error,
  agencyData, agencyTotal, agencyLoading, agencyFilters, setAgencyFilters,
  agencyFilter, agencyPageChange, agencyCountChange,
  anyHomesData, anyHomesTotal, anyHomesLoading, anyHomesFilters, setAnyHomesFilters,
  anyHomesFilter, anyHomesPageChange, anyHomesCountChange,
}) => {
  const navigate = useNavigate();

  const tabs = [
    { key: "agencies", label: "Lead vendeurs" },
    { key: "anyhomes", label: "Lead AnyHomes" },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4 mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">Lead BizDev</h3>
          <p className="text-sm text-gray-500 mt-1">
            Vendeurs ayant publié un bien et n'ayant pas refusé d'être contactés
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#976DD0] text-[#976DD0]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.key === "agencies" && agencyTotal > 0 && (
                <span className="ml-2 bg-[#976DD0]/10 text-[#976DD0] text-xs rounded-full px-2 py-0.5">
                  {agencyTotal}
                </span>
              )}
              {tab.key === "anyhomes" && anyHomesTotal > 0 && (
                <span className="ml-2 bg-[#976DD0]/10 text-[#976DD0] text-xs rounded-full px-2 py-0.5">
                  {anyHomesTotal}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "agencies" && (
        <LeadTable
          label="Lead vendeurs"
          data={agencyData}
          total={agencyTotal}
          loading={agencyLoading}
          filters={agencyFilters}
          setFilters={setAgencyFilters}
          onFilter={agencyFilter}
          onPageChange={agencyPageChange}
          onCountChange={agencyCountChange}
          exportFilename="lead-vendeurs.csv"
          navigate={navigate}
        />
      )}

      {activeTab === "anyhomes" && (
        <LeadTable
          label="Lead AnyHomes"
          data={anyHomesData}
          total={anyHomesTotal}
          loading={anyHomesLoading}
          filters={anyHomesFilters}
          setFilters={setAnyHomesFilters}
          onFilter={anyHomesFilter}
          onPageChange={anyHomesPageChange}
          onCountChange={anyHomesCountChange}
          exportFilename="lead-anyhomes.csv"
          navigate={navigate}
        />
      )}
    </Layout>
  );
};

export default Html;
