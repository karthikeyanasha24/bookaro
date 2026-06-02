import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import Table from "../../components/Table";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Html = ({ loading, data, total, error, filters, setFilter, filter, pageChange, count }) => {
  const navigate = useNavigate();

  const columns = [
    {
      key: "fullName",
      name: "Full Name",
      sort: false,
      render: (row) => {
        const id = row._id || row.id;
        const name = row.fullName || row.name || "-";
        return id ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/detail/${id}`);
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
      key: "email",
      name: "Email",
      sort: false,
      render: (row) => row.email || "-",
    },
    {
      key: "confidenceScore",
      name: "Renter confidence score",
      sort: false,
      render: (row) =>
        row.renterFinancingReferenceScore ?? row.renterScore ?? row.renterReferenceScore ?? 0,
    },
    {
      key: "confidenceSource",
      name: "Score Source",
      sort: false,
      render: (row) =>
        row.renterFinancingReferenceScoreSource || row.renterScoreSource || row.renterReferenceScoreSource || "-",
    },
    {
      key: "date",
      name: "Updated At",
      sort: false,
      render: (row) => {
        const date =
          row.renterFinancingReferenceScoreUpdatedAt ||
          row.financingReferenceScoreUpdatedAt ||
          row.updatedAt ||
          row.createdAt;
        return date ? new Date(date).toLocaleString() : "-";
      },
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
            navigate(`/confidence/users/detail/${row._id || row.id}`);
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
          <h3 className="text-2xl font-semibold text-[#111827]">Renter confidence scores</h3>
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
                placeholder="Search users"
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
