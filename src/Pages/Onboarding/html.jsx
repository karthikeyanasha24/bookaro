import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import Table from "../../components/Table";
import shared from "./shared";
import { PiEyeLight } from "react-icons/pi";
import { useState } from "react";

const Html = ({
  setFilter,
  filters,
  clear,
  filter,
  loaging,
  data,
  total,
  pageChange,
  count,
  sorting,
  view,
  sorderfilter,
  sortKey,
}) => {
  const [searchText, setSearchText] = useState(filters.search);

  const columns = [
    {
      key: "fullName",
      name: "Full Name",
      sort: true,
      render: (row) => <span className="capitalize">{row?.fullName || "--"}</span>,
    },
    {
      key: "email",
      name: "Email",
      sort: true,
      render: (row) => <span>{row?.email || "--"}</span>,
    },
    {
      key: "profile",
      name: "Profile",
      render: (row) => <span>{row?.profile || "--"}</span>,
    },
    {
      key: "objective",
      name: "Objective",
      render: (row) => <span>{row?.objective || "--"}</span>,
    },
    {
      key: "completionPercent",
      name: "Completion",
      render: (row) => <span>{row?.completionPercent ?? 0}%</span>,
    },
    {
      key: "action",
      name: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tooltip placement="top" title="View">
            <button
              type="button"
              onClick={() => view(row.id || row._id)}
              className="border cursor-pointer hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 text-lg text-[#222] flex items-center justify-center"
            >
              <PiEyeLight />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">{shared.title}</h3>
          <p className="text-sm text-[#6B7280] mt-1">Manage onboarding progress for users.</p>
        </div>
      </div>

      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        <div className="flex p-4 items-center flex-wrap gap-2">
          <form
            className="flex items-center max-w-sm gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              filter();
            }}
          >
            <label htmlFor="onboarding-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="onboarding-search"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setFilter({ ...filters, search: e.target.value });
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#063688] block w-full ps-10 p-2.5 pr-10"
                placeholder="Search users, email, city..."
              />
              {searchText && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                  onClick={() => {
                    setSearchText("");
                    setFilter({ ...filters, search: "" });
                    clear();
                  }}
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="submit"
              className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0] hover:opacity-80"
            >
              Search
            </button>
          </form>
        </div>

        {!loaging ? (
          <Table
            className="mb-3 p-4 pt-0"
            data={data}
            columns={columns}
            page={filters.page}
            count={filters.count}
            total={total}
            result={(e) => {
              if (e.event === "page") pageChange(e.value);
              if (e.event === "sort") sorting(e.value);
              if (e.event === "count") count(e.value);
            }}
            sorderfilter={sorderfilter}
            sortKey={sortKey}
          />
        ) : (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" alt="Loading" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Html;
