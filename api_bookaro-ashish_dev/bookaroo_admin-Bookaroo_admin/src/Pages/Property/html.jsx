import { Tooltip } from "antd";
import { useEffect, useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";
import { PiEyeLight, PiFileCsv } from "react-icons/pi";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import SelectDropdown from "../../components/common/SelectDropdown";
import Layout from "../../components/global/layout";
import statusModel from "../../models/status.model";
import shared from "./shared";
import MultiSelectDropdown from "../../components/common/MultiSelectDropdown";
import { removeLocal } from "../../models/string.models";

const Html = ({
  sorting,
  filter,
  edit,
  view,
  statusChange,
  pageChange,
  count,
  deleteItem,
  clear,
  filters,
  setFilter,
  loaging,
  data,
  handleFilter,
  total = { total },
  sortClass,
  categoryOptions,
  sorderfilter,
  sortKey,
  handleImport,
  HandleSampleCsv,
  exportfun, isAllow,
  amentiesOptions, setAmentiesOptions
}) => {

  const columns = [
    {
      key: "username",
      name: "Username",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.username}</span>
      },
    },
    {
      key: "propertyTitle",
      name: "Property title",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.propertyTitle || "---"}</span>
      },
    },
    {
      key: "propertyType",
      name: "Property Type",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{`${row?.propertyType}, ${row?.type}`}</span>
      },
    },
    {
      key: "diagnosisType",
      name: "Diagnosis Type",
      render: (row) => {
        return <span className="capitalize">{row?.diagnosisType || "--"}</span>
      },
    },

    // {
    //   key: "cooking",
    //   name: "Cooking",
    //   render: (row) => {
    //     return <span className="capitalize">{row?.cooking.slice(0,1).map((data)=>data?.title).join(",") || "--"}</span>
    //   },
    // },
    {
      key: "status",
      name: "Status",
      render: (row) => {
        return (
          <>
            <div className="w-32" onClick={() => statusChange(row)}>
              <span className={`bg-[#976DD0] cursor-pointer text-sm !px-3 h-[30px] w-[100px] flex items-center justify-center border border-[#EBEBEB] text-[#3C3E49A3] !rounded capitalize ${row?.status == "deactive" ? " bg-gray-200 text-black" : "bg-[#976DD0] text-white"}`}>
                {row?.status == "deactive" ? "inactive" : "active"}
              </span>
            </div>
          </>
        );
      },
    },
    {
      key: "action",
      name: "Actions",
      render: (itm) => {
        return (
          <>
            <div className="flex items-center justify-start gap-1.5">
              {isAllow(`read${shared.check}`) && (
                <Tooltip placement="top" title="View">
                  <a onClick={(e) => view(itm?.id)} className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]">
                    <PiEyeLight />
                  </a>
                </Tooltip>
              )}
              {isAllow(`edit${shared.check}`) && (
                <Tooltip placement="top" title="Edit">
                  <a onClick={(e) => edit(itm?.id)} className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]">
                    <LiaEdit />
                  </a>
                </Tooltip>
              )}
              {isAllow(`delete${shared.check}`) && (
                <Tooltip placement="top" title="Delete">
                  <span onClick={() => deleteItem(itm?.id)} className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]">
                    <LiaTrashAlt />
                  </span>
                </Tooltip>
              )}
            </div>
          </>
        );
      },
    },
  ];

  const fileInputRef = useRef(null);
  useEffect(() => {
    removeLocal("step1")
    removeLocal("addMore")
  }, [])

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">{shared.title}</h3>
        </div>
        <div className="flex" onClick={() => { localStorage.removeItem("companyDetail") }}>
          {isAllow(`add${shared.check}`) && (
            <Link className="bg-primary leading-10 mr-3 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2" to={`/${shared.url}/add`}>
              <FiPlus className="text-xl text-white" /> Add {shared.addTitle}
            </Link>
          )}
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#976DD0] block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                placeholder="Search"
              />
              {filters?.search && (
                <i className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true" onClick={(e) => clear("search")}></i>
              )}
            </div>
            <button type="submit" className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
          <div className="flex gap-2 ml-auto flex-wrap">
            <div className="flex">
              <button className="!px-2.5 text-[#3C3E49] text-sm font-normal py-2.5 flex items-center justify-center gap-2 bg-[#fff] rounded-lg shadow-btn hover:bg-[#F3F2F5] border border-[#D0D5DD] transition-all focus:ring-2 ring-[#F1F2F3] disabled:bg-[#F3F2F5] disabled:cursor-not-allowed me-2" onClick={() => HandleSampleCsv()}>
                <PiFileCsv className="text-typo text-xl" />  Sample CSV
              </button>
              <button className="!px-2.5 text-[#3C3E49] text-sm font-normal py-2.5 flex items-center justify-center gap-2 bg-[#fff] rounded-lg shadow-btn hover:bg-[#F3F2F5] border border-[#D0D5DD] transition-all focus:ring-2 ring-[#F1F2F3] disabled:bg-[#F3F2F5] disabled:cursor-not-allowed me-2" onClick={() => exportfun()}>
                <PiFileCsv className="text-typo text-xl" />  Export CSV
              </button>
              <button
                className="!px-2.5 text-[#3C3E49] text-sm font-normal py-2.5 flex items-center justify-center gap-2 bg-[#fff] rounded-lg shadow-btn hover:bg-[#F3F2F5] border border-[#D0D5DD] transition-all focus:ring-2 ring-[#F1F2F3] disabled:bg-[#F3F2F5] disabled:cursor-not-allowed me-2"
                onClick={() => fileInputRef.current.click()}
              >
                <PiFileCsv className="text-typo text-xl" /> Import CSV
              </button>

              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImport}
              />
            </div>
            {/* <SelectDropdown
              id="statusDropdown"
              displayValue="name"
              placeholder="All Amenities"
              className="capitalize"
              theme="search"
              isClearable={false}
              intialValue={filters?.amenities}
              result={(e) => { handleFilter(e.value, "amenities") }}
              options={categoryOptions}
            /> */}
            <MultiSelectDropdown
              id="statusDropdown"
              displayValue="name"
              className="capitalize"
              theme="search"
              intialValue={amentiesOptions}
              result={(e) => setAmentiesOptions(e?.value)}
              options={categoryOptions}
              isClearable={false}
              required
            />
            <SelectDropdown
              id="statusDropdown"
              displayValue="name"
              placeholder="All Status"
              theme="search"
              isClearable={false}
              isSingle={false}
              intialValue={filters?.status}
              result={(e) => { handleFilter(e.value, 'status') }}
              options={statusModel.list}
            />
            {(filters?.status || filters?.type || filters?.categories ||
              filters?.host || filters?.venue || amentiesOptions?.length > 0) && (
                <button
                  onClick={() => clear()}
                  className="bg-primary leading-10 h-10 inline-block shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg">
                  Reset
                </button>
              )}
          </div>
        </div>

        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div>
        ) : (
          <Table
            className="mb-3 px-4"
            firstColumnClass=""
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
