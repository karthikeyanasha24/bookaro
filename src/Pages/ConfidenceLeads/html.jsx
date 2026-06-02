import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import Table from "../../components/Table";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Html = ({ loading, data, total, error, filters, setFilter, filter, pageChange, count }) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: "renterName",
      name: "Renter",
      sort: false,
      render: (row) => {
        const userId = row.buyerId?._id || row.buyerId?.id || row.buyer?._id || row.buyer?.id;
        const name =
          row.buyerId?.fullName ||
          row.buyer?.fullName ||
          row.buyerId?.name ||
          row.buyer?.name ||
          "-";
        return userId ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/detail/${userId}`);
            }}
            className="text-[#3b82f6] hover:underline"
          >
            {name}
          </button>
        ) : (
          name
        );
      },
    },
    {
      key: "property",
      name: "Property",
      sort: false,
      render: (row) => row.propertyId?.propertyTitle || row.property?.title || "-",
    },
    {
      key: "price",
      name: "Price",
      sort: false,
      render: (row) => (row.propertyId?.price != null ? `${row.propertyId.price} €` : "-"),
    },
    {
      key: "location",
      name: "Location",
      sort: false,
      render: (row) =>
        [row.propertyId?.city, row.propertyId?.zipcode].filter(Boolean).join(" - ") ||
        [row.property?.city, row.property?.zipcode].filter(Boolean).join(" - ") ||
        "-",
    },
    {
      key: "scoreDate",
      name: "Score calculation date",
      sort: false,
      render: (row) => {
        const date =
          row.updatedAt ||
          row.renterReferenceScoreUpdatedAt ||
          row.financingReferenceScoreUpdatedAt ||
          row.createdAt ||
          row.scoreDate;
        return date ? new Date(date).toLocaleString() : "-";
      },
    },
    {
      key: "leadScore",
      name: "Lead locative score",
      sort: false,
      render: (row) =>
        row.renterScore ??
        row.renterReferenceScore ??
        row.financingReferenceScore ??
        row.financialScore ??
        row.score ??
        0,
    },
    {
      key: "scoreSource",
      name: "Score source",
      sort: false,
      render: (row) =>
        row.renterScoreSource ||
        row.renterReferenceScoreSource ||
        row.financingReferenceScoreSource ||
        row.scoreSource ||
        "-",
    },
    {
      key: "scoreLabel",
      name: "Score label",
      sort: false,
      render: (row) =>
        row.renterScoreLabel ||
        row.renterReferenceScoreLabel ||
        row.scoreLabel ||
        row.confidenceLabel ||
        "-",
    },
    {
      key: "status",
      name: "Score status",
      sort: false,
      render: (row) =>
        row.renterScoreStatus ||
        row.renterReferenceScoreStatus ||
        row.scoreStatus ||
        row.status ||
        "-",
    },
    {
      key: "actions",
      name: "Actions",
      sort: false,
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/confidence/leads/detail/${row._id || row.id}`);
          }}
          className="rounded-md border border-[#976DD0] bg-white px-3 py-1 text-sm text-[#976DD0] hover:bg-[#f5f0ff]"
        >
          Voir
        </button>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">Lead confidence scores</h3>
        </div>
      </div>
      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-t-lg text-red-700">
            {error}
          </div>
        ) : null}
        <div className="flex p-4 items-center flex-wrap gap-2">
          <form
            className="flex items-center max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              filter();
            }}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilter({ ...filters, search: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#063688] block w-full ps-10 p-2.5 pr-10"
                placeholder="Search leads"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <button
              type="submit"
              className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0] hover:opacity-80"
            >
              Search
            </button>
          </form>
        </div>
        {!loading ? (
          <Table
            className="mb-3 p-4 pt-0"
            data={data}
            columns={columns}
            page={filters.page}
            count={filters.count}
            filters={filters}
            total={total}
            result={(e) => {
              if (e.event === "page") pageChange(e.value);
              if (e.event === "count") count(e.value);
            }}
          />
        ) : (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" alt="loading" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Html;
