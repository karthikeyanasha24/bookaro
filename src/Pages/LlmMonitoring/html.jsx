import Layout from "../../components/global/layout";
import Table from "../../components/Table";
import SelectDropdown from "../../components/common/SelectDropdown";

const Html = ({
  shared,
  logs,
  loading,
  filters,
  total,
  pageChange,
  handleFilterChange,
  clearFilters,
  errorCodes,
  viewMode,
  setViewMode,
  rawLogs,
  toggleStatus,
}) => {
  const errorCodeOptions = Object.values(errorCodes).map((ec) => ({
    name: `${ec.code} - ${ec.label}`,
    value: ec.code,
  }));

  const interactionOptions = [
    { name: "Tous", value: "" },
    { name: "Titre et description", value: "Titre et description" },
    { name: "Coach IA", value: "Coach IA" },
  ];

  const columns = viewMode === "grouped"
    ? [
        {
          key: "error_code",
          name: "Code erreur",
          render: (row) => (
            <span className="font-semibold text-[#976DD0]">{row._id?.error_code || row.error_code}</span>
          ),
        },
        {
          key: "error_label",
          name: "Libellé",
          render: (row) => <span>{row.error_label}</span>,
        },
        {
          key: "interaction_type",
          name: "Type d'interaction",
          render: (row) => (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              row._id?.interaction_type === "Coach IA" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            }`}>
              {row._id?.interaction_type || row.interaction_type}
            </span>
          ),
        },
        {
          key: "llm_provider",
          name: "Fournisseur LLM",
          render: (row) => <span className="capitalize">{row.llm_provider || row._id?.llm_provider || "-"}</span>,
        },
        {
          key: "user_email",
          name: "Utilisateur",
          render: (row) => <span className="text-sm">{row.user_email || row._id?.user_email || "-"}</span>,
        },
        {
          key: "count",
          name: "Occurrences",
          render: (row) => (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 text-sm font-bold">
              {row.count}
            </span>
          ),
        },
        {
          key: "status",
          name: "Statut",
          render: (row) => (
            <button
              onClick={() => toggleStatus(row.error_ref, row.status || "pending")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                (row.status || "pending") === "traité"
                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                  : "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
              }`}
            >
              {(row.status || "pending") === "traité" ? "Traité" : "Pending"}
            </button>
          ),
        },
        {
          key: "latest",
          name: "Dernière occurrence",
          render: (row) => (
            <span className="text-sm text-gray-500">
              {row.latest ? new Date(row.latest).toLocaleString("fr-FR") : "-"}
            </span>
          ),
        },
      ]
    : [
        {
          key: "error_ref",
          name: "Référence",
          render: (row) => <span className="font-mono text-xs">{row.error_ref}</span>,
        },
        {
          key: "error_code",
          name: "Code",
          render: (row) => <span className="font-semibold text-[#976DD0]">{row.error_code}</span>,
        },
        {
          key: "error_label",
          name: "Libellé",
          render: (row) => <span>{row.error_label}</span>,
        },
        {
          key: "llm_provider",
          name: "LLM",
          render: (row) => <span className="capitalize">{row.llm_provider || "-"}</span>,
        },
        {
          key: "interaction_type",
          name: "Type",
          render: (row) => (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              row.interaction_type === "Coach IA" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            }`}>
              {row.interaction_type}
            </span>
          ),
        },
        {
          key: "user_email",
          name: "Utilisateur",
          render: (row) => <span className="text-sm">{row.user_email || "-"}</span>,
        },
        {
          key: "error_detail",
          name: "Détail",
          render: (row) => (
            <span className="text-xs text-gray-500 max-w-[200px] block truncate" title={row.error_detail}>
              {row.error_detail || "-"}
            </span>
          ),
        },
        {
          key: "status",
          name: "Statut",
          render: (row) => (
            <button
              onClick={() => toggleStatus(row.error_ref, row.status || "pending")}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                (row.status || "pending") === "traité"
                  ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                  : "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
              }`}
            >
              {(row.status || "pending") === "traité" ? "Traité" : "Pending"}
            </button>
          ),
        },
        {
          key: "createdAt",
          name: "Date",
          render: (row) => (
            <span className="text-sm text-gray-500">
              {row.createdAt ? new Date(row.createdAt).toLocaleString("fr-FR") : "-"}
            </span>
          ),
        },
      ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center gap-y-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-[#111827]">{shared.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Surveillance des erreurs des services d'IA
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grouped")}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === "grouped" ? "bg-white shadow-sm text-[#976DD0] font-medium" : "text-gray-500"
                }`}
              >
                Groupé
              </button>
              <button
                onClick={() => setViewMode("detailed")}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === "detailed" ? "bg-white shadow-sm text-[#976DD0] font-medium" : "text-gray-500"
                }`}
              >
                Détail
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-64">
              <label className="block text-sm font-medium text-gray-600 mb-1">Code erreur</label>
              <SelectDropdown
                placeholder="Tous les codes"
                displayValue="name"
                theme="normal"
                intialValue={filters.errorCode}
                result={(e) => handleFilterChange("errorCode", e?.value || "")}
                options={[{ name: "Tous", value: "" }, ...errorCodeOptions]}
                isClearable={false}
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-600 mb-1">Type d'interaction</label>
              <SelectDropdown
                placeholder="Tous"
                displayValue="name"
                theme="normal"
                intialValue={filters.interactionType}
                result={(e) => handleFilterChange("interactionType", e?.value || "")}
                options={interactionOptions}
                isClearable={false}
              />
            </div>
            <button
              onClick={clearFilters}
              className="h-10 px-4 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden">
          <Table
            columns={columns}
            data={logs}
            loading={loading}
            total={total}
            currentPage={filters.page}
            pageChange={pageChange}
            count={filters.limit}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Html;
