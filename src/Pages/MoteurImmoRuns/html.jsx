import { FaClock } from "react-icons/fa6";
import Table from "../../components/Table";
import Layout from "../../components/global/layout";
import shared from "./shared";

const STATUS_LABELS = {
  running: "En cours",
  completed: "Terminé",
  failed: "Échoué",
};

const STATUS_COLORS = {
  running: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}min`);
  parts.push(`${s}s`);
  return parts.join(" ");
};

const Html = ({
  pageChange,
  count,
  filters,
  loaging,
  data,
  total,
}) => {
  const columns = [
    {
      key: "runRef",
      name: "Réf. du run",
      render: (row) => {
        return <span className="text-sm font-medium text-[#111827]">{row?.runRef || "--"}</span>;
      },
    },
    {
      key: "startDate",
      name: "Date et heure",
      render: (row) => {
        const d = row?.startDate;
        if (!d) return "--";
        return <span className="text-sm text-[#6B7280]">{new Date(d).toLocaleString("fr-FR")}</span>;
      },
    },
    {
      key: "duration",
      name: "Durée",
      render: (row) => {
        return (
          <span className="text-sm text-[#6B7280] flex items-center gap-1">
            <FaClock className="text-[11px]" />
            {formatDuration(row?.duration)}
          </span>
        );
      },
    },
    {
      key: "totalCount",
      name: "Nb total",
      render: (row) => {
        return <span className="font-medium">{row?.totalCount ?? 0}</span>;
      },
    },
    {
      key: "saleCount",
      name: "Nb Vente",
      render: (row) => {
        return <span>{row?.saleCount ?? 0}</span>;
      },
    },
    {
      key: "rentCount",
      name: "Nb Location",
      render: (row) => {
        return <span>{row?.rentCount ?? 0}</span>;
      },
    },
    {
      key: "ignoredCount",
      name: "Nb ignorés",
      render: (row) => {
        return <span className="text-[#9CA3AF]">{row?.ignoredCount ?? 0}</span>;
      },
    },
    {
      key: "status",
      name: "Statut",
      render: (row) => {
        return (
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[row?.status] || "bg-gray-100 text-gray-600"}`}>
            {STATUS_LABELS[row?.status] || row?.status || "--"}
          </span>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">{shared.title}</h3>
        </div>
      </div>
      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" alt="loader" />
          </div>
        ) : (
          <Table
            className="mb-3 pt-0 p-4"
            firstColumnClass="width_row"
            data={data}
            columns={columns}
            page={filters.page}
            count={filters.count}
            filters={filters}
            total={total}
            result={(e) => {
              if (e.event == "page") pageChange(e.value);
              if (e.event == "count") count(e.value);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default Html;
