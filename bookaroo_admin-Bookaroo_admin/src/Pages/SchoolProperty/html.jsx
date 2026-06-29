import Layout from "../../components/global/layout";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { FiPlus } from "react-icons/fi";
import SelectDropdown from "../../components/common/SelectDropdown";
import shared from "./shared";
import { PiEyeLight, PiFileCsv } from "react-icons/pi";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";
import { useRef } from "react";
import Pagination from "react-pagination-js";

const Html = ({
  sorting,
  filter,
  edit,
  view,
  statusChange,
  pageChange,
  count,
  checklength,
  AllSelect,
  deleteItem,
  handleImport,
  clear,
  filters,
  setFilter,
  loaging,
  data,
  handleFilters,
  total = { total },
  handleCheck,
  sortClass,
  schoolType,
  removeSchools,
  DeleteSchools,
  schoolStatus,
  establishmentType,
}) => {
  const fileInputRef = useRef(null);
  const generateOptions = () => {
    const options = [];
    for (let i = 10; i <= total; i += 10) {
      options.push(i);
    }
    return options;
  };
  const columns = [
    {
      key: "EstablishmentName",
      name: "Name",
      // sort: true,
      render: (row) => {
        return (
          <span className="capitalize">{row?.EstablishmentName || "--"}</span>
        );
      },
    },
    {
      key: "email",
      name: "Email",
      render: (row) => {
        return <span className="capitalize">{row?.email || "--"}</span>;
      },
    },
    {
      key: "phone",
      name: "Phone",
      render: (row) => {
        return <span className="capitalize">{row?.phone || "--"}</span>;
      },
    },
    {
      key: "schoolType",
      name: "Type",
      render: (row) => {
        return <span className="capitalize">{row?.schoolType || "--"}</span>;
      },
    },
    // {
    //     key: "status",
    //     name: "Status",
    //     render: (row) => {
    //         return (
    //             <>
    //                 <div className="w-32" onClick={() => statusChange(row)}>
    //                     <span className={`bg-[#976DD0] cursor-pointer text-sm !px-3 h-[30px] w-[100px] flex items-center justify-center border border-[#EBEBEB] text-[#3C3E49A3] !rounded capitalize ${row.status == "deactive" ? " bg-gray-200 text-black" : "bg-[#976DD0] text-white"}`}>
    //                         {row.status == "deactive" ? "inactive" : "active"}
    //                     </span>
    //                 </div>
    //             </>
    //         )
    //     },
    // },
    {
      key: "action",
      name: "Action",
      render: (itm) => {
        return (
          <>
            <div className="flex items-center justify-start gap-1.5">
              <Tooltip placement="top" title="View">
                <a
                  onClick={(e) => view(itm.id)}
                  className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
                >
                  <PiEyeLight />
                </a>
              </Tooltip>
              <Tooltip placement="top" title="Edit">
                <a
                  onClick={(e) => edit(itm.id)}
                  className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
                >
                  <LiaEdit />
                </a>
              </Tooltip>
              <Tooltip placement="top" title="Delete">
                <span
                  onClick={() => deleteItem(itm.id)}
                  className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
                >
                  <LiaTrashAlt />
                </span>
              </Tooltip>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">
            {shared.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <Link
            className="bg-primary leading-10 mr-3 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2"
            to={`/${shared.url}/add`}
          >
            <FiPlus className="text-xl text-white" /> Add {shared.addTitle}
          </Link>
          <button
            className="btn btn-primary mb-0 py-2"
            onClick={DeleteSchools}
          >
            <i className="fa fa-times-circle me-2"></i>Delete
            Schools
          </button>
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
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <input
                type="text"
                id="simple-search"
                value={filters.search}
                onChange={(e) =>
                  setFilter({ ...filters, search: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#976DD0] block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                placeholder="Search"
              />
              {filters?.search && (
                <i
                  className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                  aria-hidden="true"
                  onClick={(e) => clear()}
                ></i>
              )}
            </div>
            <button
              type="submit"
              className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
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

          <div className="flex gap-2 ml-auto">
            <div className="flex">
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
                style={{ display: "none" }}
                onChange={handleImport}
              />
            </div>
            <SelectDropdown
              id="statusDropdown"
              displayValue="name"
              placeholder="All School Types"
              className="capitalize"
              theme="search"
              isClearable={false}
              intialValue={filters?.schoolType}
              result={(e) => {
                handleFilters(e.value, "schoolType");
              }}
              options={schoolType}
            />
            <SelectDropdown
              id="statusDropdown"
              displayValue="name"
              placeholder="All School Status"
              theme="search"
              isClearable={false}
              intialValue={filters?.schoolStatus}
              result={(e) => {
                handleFilters(e.value, "schoolStatus");
              }}
              options={schoolStatus}
            />

            {filters?.schoolType || filters?.schoolStatus ? (
              <>
                <button
                  onClick={() => clear()}
                  className="bg-primary leading-10 h-10 inline-block shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg"
                >
                  Reset
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>


        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div>
        ) : (
          <>   <div className="px-4 pb-4">
            <div className="relative overflow-x-auto border border-[#0000000d] rounded-bl-[6px] rounded-br-[6px]">
              <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 xl:w-full lg:w-[1300px] md:w-[1200px] w-[1200px] overflow-auto">
                <thead className="text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  {/* Main header */}
                  <tr>
                    {columns.map((itm, index) => (
                      <th
                        scope="col"
                        className={`px-2 py-3 whitespace-nowrap`}
                        key={itm.key}
                      >
                        <div className="flex">
                          {index === 0 && <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="checkbox"
                              value={""}
                              checked={checklength() ? true : false}
                              onChange={(e) => AllSelect(e)}
                              className="form-check"
                            />
                            Select All
                          </div>}
                          <span className={`${index === 0 ? "ml-6" : ""} inline-flex items-center gap-1`}>
                            <span>{itm.name}</span>
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Table data */}
                  {data.map((itm) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={itm.id}
                    >
                      {columns.map((citm, index) => (
                        <td
                          className={`px-2 py-4 whitespace-nowrap ${citm.className
                            } ${index === 0 ? "font-bold" : ""}`}
                          key={citm.key}
                        >
                          <div className="flex items-center">
                            {index === 0 && <input
                              type="checkbox"
                              name="checkbox"
                              value={itm?.id}
                              checked={
                                removeSchools.includes(itm?.id) ? true : false
                              }
                              onChange={(e) => handleCheck(e, itm?.id, index)}
                              className="form-check"
                            />}
                            <div className={`${index === 0 ? "ml-[85px]" : ""}`}>{citm.render(itm) || "--"}</div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            {total > 10 && (
              <>
                {filters?.count < total ? (
                  <div className="paginationWrapper flex items-center justify-between mt-15 px-4 lg:flex-row flex-col ">
                    <p className="lg:w-96 w-full text-sm text-gray-500 lg:text-left text-center lg:mb-0 mb-3">
                      Show{" "}
                      <select
                        value={filters?.count}
                        onChange={(e) => count(e.target.value)}
                        className="border rounded-md px-2 py-1"
                      >
                        {/* Dynamically generated options */}
                        {generateOptions().map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>{" "}
                      from {total} data
                    </p>
                    <Pagination
                      currentPage={filters?.page}
                      totalSize={total}
                      sizePerPage={filters?.count}
                      changeCurrentPage={pageChange}
                    />
                  </div>
                ) :
                  <div className="paginationWrapper flex items-center justify-between mt-15 px-4">
                    <p className="w-96 text-sm text-gray-500">
                      Show {total} from {total} data
                    </p>
                    {/* <Pagination
                  currentPage={page}
                  totalSize={total}
                  sizePerPage={pageSize}
                  changeCurrentPage={handlePaginate}
                /> */}
                  </div>
                }
              </>
            )}</>
        )}
      </div>
    </Layout>
  );
};

export default Html;
