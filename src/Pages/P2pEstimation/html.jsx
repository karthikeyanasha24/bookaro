import { Tooltip } from "antd";
import Table from "../../components/Table";
import Layout from "../../components/global/layout";
import shared from "./shared";
import { PiFileCsv } from "react-icons/pi";
import AsyncSelect from 'react-select/async';
import moment from "moment";
import { Link } from "react-router-dom";
import methodModel from "../../methods/methods";

const PERCEPTION_MAP = {
  underestimated: { label: "Sous-estimé",  cls: "bg-blue-100 text-blue-700" },
  appropriate:    { label: "Cohérent",      cls: "bg-green-100 text-green-700" },
  expensive:      { label: "Sur-estimé",   cls: "bg-red-100 text-red-700" },
};

const fmtPrice = (v) =>
  v != null ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v) : "—";

const StatCard = ({ label, value, color }) => {
  const palettes = {
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    blue:   "border-blue-200 bg-blue-50 text-blue-700",
    teal:   "border-teal-200 bg-teal-50 text-teal-700",
  };
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-1 ${palettes[color] || palettes.purple}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-3xl font-bold">{value ?? "—"}</p>
    </div>
  );
};

const Stars = ({ value }) => {
  if (value == null) return <span className="text-gray-400 text-xs">—</span>;
  const full = Math.round(value);
  return (
    <span className="text-yellow-400 text-xs">
      {"★".repeat(Math.min(5, full))}{"☆".repeat(Math.max(0, 5 - full))}
      <span className="text-gray-500 ml-1">{value}</span>
    </span>
  );
};

const Html = ({
  sorting, filter, view, pageChange, count,
  selectedproperty, setselectedproperty, getData, clear,
  filters, setFilter, loaging, data, property,
  sortClass, sorderfilter, total, sortKey, isAllow,
  loadOptions, stats, exportCSV,
}) => {

  const columns = [
    {
      key: "property",
      name: "Bien",
      render: (row) => {
        const imgFile = row?.property?.images?.[0]?.file || null;
        const propId = row?.propertyId;
        const title = row?.property?.propertyTitle || "—";
        return (
          <div className="flex items-center gap-2">
            <Link to={`/property/detail/${propId}`} className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0 hover:opacity-80">
              {imgFile ? (
                <img src={methodModel.noImg(imgFile)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
              )}
            </Link>
            <Link to={`/property/detail/${propId}`} className="text-[#976DD0] hover:underline font-medium truncate max-w-[150px]">
              {title}
            </Link>
          </div>
        );
      },
    },
    {
      key: "fullName",
      name: "Estimateur",
      render: (row) => {
        const userId = row?.user?._id || row?.userId;
        const name = row?.user?.fullName || "—";
        return userId ? (
          <Link to={`/user/detail/${userId}`} className="text-[#976DD0] hover:underline">{name}</Link>
        ) : (
          <span className="text-gray-500">{name}</span>
        );
      },
    },
    {
      key: "city",
      name: "Ville",
      render: (row) => <span>{row?.property?.city || "—"}</span>,
    },
    {
      key: "referencePrice",
      name: "Prix de réf.",
      render: (row) => <span>{fmtPrice(row?.property?.referencePrice)}</span>,
    },
    {
      key: "perception",
      name: "Perception",
      render: (row) => {
        const p = PERCEPTION_MAP[row?.referencePrice];
        return p ? (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.cls}`}>{p.label}</span>
        ) : <span className="text-gray-400">—</span>;
      },
    },
    {
      key: "userReasonablePrice",
      name: "Estimation",
      render: (row) => <span className="font-medium">{fmtPrice(row?.userReasonablePrice)}</span>,
    },
    {
      key: "ratePropertyTitle",
      name: "Titre",
      render: (row) => <Stars value={row?.ratePropertyTitle} />,
    },
    {
      key: "ratePropertyPictures",
      name: "Photos",
      render: (row) => <Stars value={row?.ratePropertyPictures} />,
    },
    {
      key: "rateInteriorDesign",
      name: "Déco",
      render: (row) => <Stars value={row?.rateInteriorDesign} />,
    },
    {
      key: "rateLocation",
      name: "Emplac.",
      render: (row) => <Stars value={row?.rateLocation} />,
    },
    {
      key: "rateCouldYouLiveIn",
      name: "Y habiter ?",
      render: (row) => <Stars value={row?.rateCouldYouLiveIn} />,
    },
    {
      key: "comment",
      name: "Commentaire",
      render: (row) => (
        <Tooltip title={row?.comment}>
          <span className="truncate block max-w-[160px] text-gray-600 cursor-default">{row?.comment || "—"}</span>
        </Tooltip>
      ),
    },
    {
      key: "createdAt",
      name: "Date",
      render: (row) => <span className="whitespace-nowrap text-gray-500">{moment(row?.createdAt).format("DD/MM/YYYY")}</span>,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <h3 className="text-2xl font-semibold text-[#111827]">{shared.title}</h3>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <StatCard label="Nombre d'estimations" value={stats.totalEstimations} color="purple" />
          <StatCard label="Biens concernés" value={stats.distinctProperties} color="blue" />
          <StatCard label="Estimateurs distincts" value={stats.distinctEstimators} color="teal" />
        </div>
      )}

      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        <div className="flex p-4 items-center flex-wrap gap-2">
          <form className="flex items-center max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); filter(); }}>
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <input
                type="text"
                id="simple-search"
                value={filters.search}
                onChange={(e) => setFilter({ ...filters, search: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-[#976DD0] block w-full ps-3 p-2.5 pr-10"
                placeholder="Rechercher…"
              />
              {filters?.search && (
                <i className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm cursor-pointer" onClick={() => clear("search")} />
              )}
            </div>
            <button type="submit" className="p-3 text-sm font-medium text-white bg-[#976DD0] rounded-lg hover:opacity-80">
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </button>
          </form>

          <div className="flex gap-2 ml-auto flex-wrap items-center">
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions={property}
              value={selectedproperty}
              className="w-[260px]"
              isClearable
              onChange={(e) => { setselectedproperty(e); getData({ propertyId: e?.value }); }}
            />
            {filters.property_id && (
              <button onClick={() => clear()} className="bg-primary leading-10 h-10 inline-block shadow-btn px-4 hover:opacity-80 text-sm text-white rounded-lg">Reset</button>
            )}
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-[#976DD0] text-[#976DD0] rounded-lg hover:bg-purple-50"
            >
              <PiFileCsv className="text-xl" /> Export CSV
            </button>
          </div>
        </div>

        {!loaging ? (
          <Table
            className="mb-3 p-4 pt-2"
            data={data}
            columns={columns}
            page={filters.page}
            total={total}
            count={filters.count}
            filters={filters}
            result={(e) => {
              if (e.event === "page") pageChange(e.value);
              if (e.event === "sort") { sorting(e.value); sortClass(e.value); }
              if (e.event === "count") count(e.value);
            }}
            sorderfilter={sorderfilter}
            sortKey={sortKey}
          />
        ) : (
          <div className="text-center py-4"><img src="/assets/img/loader.gif" className="pageLoader" alt="loading" /></div>
        )}
      </div>
    </Layout>
  );
};

export default Html;

