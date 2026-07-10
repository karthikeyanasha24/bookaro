import { Tooltip } from "antd";
import { PiEyeLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import Layout from "../../components/global/layout";
import shared from "./shared";

const TYPE_LABELS = {
  sale: "Vente",
  rent: "Location",
  directory: "Annuaire",
};

const exportCSV = (data) => {
  const headers = ["Réf. MoteurImmo", "Réf. AnyHomes", "Type de bien", "Surface", "CP", "Ville", "Statut", "Source", "Dernier sync"];
  const rows = data.map((row) => {
    const prop = row?.propertyId || {};
    return [
      row?.sourceId || "",
      prop?.propertyRef || "",
      prop?.type || "",
      prop?.surface || "",
      prop?.zipcode || "",
      prop?.city || "",
      TYPE_LABELS[prop?.propertyType] || prop?.propertyType || "",
      row?.raw?.origin || row?.raw?.publisher?.name || "",
      row?.lastSyncAt ? new Date(row.lastSyncAt).toLocaleDateString("fr-FR") : "",
    ];
  });

  const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "moteurimmo_imports.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const Html = ({
  view,
  pageChange,
  count,
  clear,
  filters,
  setFilter,
  filter,
  loaging,
  data,
  total,
  sortClass,
  sorting,
  sorderfilter,
  sortKey,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: "sourceId",
      name: "Réf. MoteurImmo",
      render: (row) => {
        return <span className="text-sm font-medium text-[#111827]">{row?.sourceId ? row.sourceId.substring(0, 16) + "..." : "--"}</span>;
      },
    },
    {
      key: "propertyRef",
      name: "Réf. AnyHomes",
      render: (row) => {
        const prop = row?.propertyId;
        if (!prop) return <span className="text-[#9CA3AF]">--</span>;
        return (
          <a
            className="text-[#976DD0] underline font-medium cursor-pointer"
            onClick={() => {
              if (prop?._id) navigate(`/property/admin/${prop._id}`);
            }}
          >
            {prop?.propertyRef || prop?._id?.substring(0, 12) + "..." || "--"}
          </a>
        );
      },
    },
    {
      key: "type",
      name: "Type de bien",
      render: (row) => {
        const kind = row?.propertyId?.type;
        const label = kind ? kind.charAt(0).toUpperCase() + kind.slice(1) : "--";
        return <span className="capitalize">{label}</span>;
      },
    },
    {
      key: "surface",
      name: "Surface",
      render: (row) => {
        const s = row?.propertyId?.surface;
        return <span>{s ? `${s} m²` : "--"}</span>;
      },
    },
    {
      key: "zipcode",
      name: "CP",
      render: (row) => {
        return <span>{row?.propertyId?.zipcode || "--"}</span>;
      },
    },
    {
      key: "city",
      name: "Ville",
      render: (row) => {
        return <span>{row?.propertyId?.city || "--"}</span>;
      },
    },
    {
      key: "propertyType",
      name: "Statut",
      render: (row) => {
        const pt = row?.propertyId?.propertyType;
        return (
          <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-[#F4EDF9] text-[#7B4DA4] capitalize">
            {TYPE_LABELS[pt] || pt || "--"}
          </span>
        );
      },
    },
    {
      key: "origin",
      name: "Source",
      render: (row) => {
        const origin = row?.raw?.origin || row?.raw?.publisher?.name || "--";
        return <span className="text-sm text-[#6B7280]">{origin}</span>;
      },
    },
    {
      key: "lastSyncAt",
      name: "Dernier sync",
      render: (row) => {
        const d = row?.lastSyncAt || row?.createdAt;
        if (!d) return "--";
        return <span className="text-sm text-[#6B7280]">{new Date(d).toLocaleDateString("fr-FR")}</span>;
      },
    },
    {
      key: "action",
      name: "Actions",
      render: (itm) => {
        return (
          <div className="flex items-center justify-start gap-1.5">
            <Tooltip placement="top" title="Voir le détail">
              <a
                onClick={() => view(itm.id)}
                className="border cursor-pointer hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 flex items-center justify-center text-lg text-[#222]"
              >
                <PiEyeLight />
              </a>
            </Tooltip>
          </div>
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

      {/* Total + CSV export */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 shadow-sm">
            <div className="text-[12px] uppercase tracking-[0.16em] text-[#6B7280]">Total biens importés</div>
            <div className="text-2xl font-bold text-[#976DD0]">{total ?? 0}</div>
          </div>
        </div>
        <button
          onClick={() => exportCSV(data)}
          className="bg-[#976DD0] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter en CSV
        </button>
      </div>

      <div className="shadow-box w-full bg-white rounded-lg mt-4">
        <div className="flex p-4 items-center flex-wrap gap-2">
          <form
            className="flex items-center max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              filter();
            }}
          >
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <input
                type="text"
                id="simple-search"
                value={filters.search}
                onChange={(e) => setFilter({ ...filters, search: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#976DD0] block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                placeholder="Rechercher par réf. MoteurImmo..."
              />
              {filters?.search && (
                <i
                  className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                  aria-hidden="true"
                  onClick={(e) => clear("search")}
                ></i>
              )}
            </div>
            <button
              type="submit"
              className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>

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
              if (e.event == "sort") {
                sorting(e.value);
                sortClass(e.value);
              }
              if (e.event == "count") count(e.value);
            }}
            sorderfilter={sorderfilter}
            sortKey={sortKey}
          />
        )}
      </div>
    </Layout>
  );
};

export default Html;
