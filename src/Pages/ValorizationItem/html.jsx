import Layout from "../../components/global/layout";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { FiPlus } from "react-icons/fi";
import Table from "../../components/Table";
import shared from "./shared";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";

const Html = ({
  sorting, filter, edit, view, pageChange, count, deleteItem, clear,
  filters, setFilter, loaging, data, total, sortClass, sorderfilter, sortKey, isAllow
}) => {

  const columns = [
    {
      key: "label",
      name: "Label",
      sort: true,
      render: (row) => <span className="capitalize">{row?.label}</span>,
    },
    {
      key: "label_en",
      name: "Label (EN)",
      render: (row) => <span>{row?.label_en || "-"}</span>,
    },
    {
      key: "order",
      name: "Order",
      render: (row) => <span>{row?.order || 0}</span>,
    },
    {
      key: "isActive",
      name: "Status",
      render: (row) => (
        <span className={`text-sm px-3 py-1 rounded-full ${row.isActive !== false ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
          {row.isActive !== false ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "action",
      name: "Action",
      render: (itm) => (
        <div className="flex items-center justify-start gap-1.5">
          {isAllow(`edit${shared.check}`) ? (
            <Tooltip placement="top" title="Edit">
              <a onClick={(e) => edit(itm.id)} className="border cursor-pointer hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]">
                <LiaEdit />
              </a>
            </Tooltip>
          ) : null}
          {isAllow(`delete${shared.check}`) ? (
            <Tooltip placement="top" title="Delete">
              <span onClick={() => deleteItem(itm.id)} className="border cursor-pointer hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]">
                <LiaTrashAlt />
              </span>
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">{shared.title}</h3>
        </div>
        <div className="flex">
          {isAllow(`add${shared.check}`) ? (
            <Link className="bg-primary leading-10 mr-3 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2" to={`/${shared.url}/add`}>
              <FiPlus className="text-xl text-white" /> Add {shared.addTitle}
            </Link>
          ) : null}
        </div>
      </div>
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#976DD0] block w-full ps-10 p-2.5 pr-10"
                placeholder="Search"
              />
              {filters?.search && (
                <i className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true" onClick={(e) => clear("search")}></i>
              )}
            </div>
            <button type="submit" className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0]">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </button>
          </form>
          {filters.search ? (
            <button onClick={() => clear()} className="bg-primary leading-10 h-10 inline-block shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg">Reset</button>
          ) : null}
        </div>
        {!loaging ? (
          <Table
            className="mb-3 p-4 pt-2"
            data={data}
            columns={columns}
            page={filters.page}
            count={filters.count}
            filters={filters}
            total={total}
            result={(e) => {
              if (e.event == "page") pageChange(e.value);
              if (e.event == "sort") { sorting(e.value); sortClass(e.value); }
              if (e.event == "count") count(e.value);
            }}
            sorderfilter={sorderfilter}
            sortKey={sortKey}
          />
        ) : null}
        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default Html;
