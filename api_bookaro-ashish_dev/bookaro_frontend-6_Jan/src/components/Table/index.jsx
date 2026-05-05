import React, { useEffect, useState } from "react";
import { HiOutlineArrowDown, HiOutlineArrowUp } from "react-icons/hi";
import Pagination from "react-pagination-js";

const Table = ({
  className = "",
  data = [],
  theme = "table",
  ListHtml = (e) => {},
  rowClass = "",
  columns = [],
  topHead = [],
  count = 50,
  total = 0,
  page = 1,
  result = (e) => {},
  nodata = "Data Not Found",
  firstColumnClass = "",
  filters,
}) => {
  const [pageSize, setPageSize] = useState(count);

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    result({ event: "count", value: parseInt(e.target.value) });
  };

  const handlePaginate = (e) => {
    result({ event: "page", value: e });
  };

  const view = (row) => {
    result({ event: "row", row: row });
  };

  const headclick = (itm) => {
    if (itm.sort) {
      result({ event: "sort", value: itm.key });
    }
  };

  // Generate options array based on the total value
  const generateOptions = () => {
    const options = [];
    for (let i = 10; i <= total; i += 10) {
      options.push(i);
    }
    return options;
  };

  return (
    <>
      <div className={`${className}`}>
        {total ? (
          <>
            {/* Table view */}
            {theme === "table" && (
              <div className="relative table-responsive overflow-x-auto border border-[#eee] sm:rounded-lg ">
                <table className="table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-sm text-[#986dcd] font-[600] capitalize bg-white dark:bg-gray-700 dark:text-gray-400">
                    {/* Top header */}
                    {topHead?.length ? (
                      <tr className="bg-gray-200 border-b border-black">
                        {topHead.map((itm, i) => (
                          <th
                            scope="col"
                            className={`px-2 py-3 text-center text-[#986dcd] ${
                              topHead.length - 1 === i
                                ? ""
                                : "border-r border-black whitespace-nowrap"
                            }`}
                            colSpan={itm?.colSpan || 0}
                            key={i}
                          >
                            {itm.name}
                          </th>
                        ))}
                      </tr>
                    ) : null}
                    {/* Main header */}
                    <tr>
                      {columns.map((itm) => (
                        <th
                          scope="col"
                          className={`px-2 py-3   ${
                            itm.sort ? "cursor-pointer whitespace-nowrap" : ""
                          }`}
                          key={itm.key}
                        >
                          <span className="inline-flex items-center gap-1">
                            <span> {itm.name} </span>
                            {itm.sort ? (
                              <>
                                <span className="" onClick={() => headclick(itm)}>
                                  <HiOutlineArrowDown className=" inline text-sm" />
                                </span>
                              </>
                            ) : null}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Table data */}
                    {data.map((itm) => (
                      <tr
                        onClick={() => view(itm)}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={itm.id}
                      >
                        {columns.map((citm,index) => (
                          <td className={`px-2 py-4 whitespace-nowrap ${citm.className} ${index === 0 ? firstColumnClass : ''}`} key={citm.key}>
                            {citm.render(itm) || "--"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* List view */}
            {theme === "list" && (
              <div className={`rowClass ${rowClass}`}>
                {data.map((itm, index) => (
                  <ListHtml key={index} row={itm} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {count < total && (
              <div className="paginationWrapper flex items-center justify-between mt-15 px-4">
                <p className="w-96 text-sm text-gray-500">
                  Show{" "}
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
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
                  currentPage={page}
                  totalSize={total}
                  sizePerPage={pageSize}
                  changeCurrentPage={handlePaginate}
                />
              </div>
            )}
          </>
        ) : (
          // <div className="p-4 text-center">{nodata}</div>
          <div className="px-4 pb-4">
          <div className="relative overflow-x-auto border border-[#0000000d]  rounded-bl-[6px] rounded-br-[6px]">
           
            <table className="xl:w-full lg:w-[1300px] md:w-[1200px] w-[1200px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                {/* Top header */}
                {topHead?.length ? (
                  <tr className="bg-gray-200 border-b border-black">
                    {topHead.map((itm, i) => (
                      <th
                        scope="col"
                        className={`px-2 py-3 text-center ${
                          topHead.length - 1 === i
                            ? ""
                            : "border-r border-black whitespace-nowrap"
                        }`}
                        colSpan={itm?.colSpan || 0}
                        key={i}
                      >
                        {itm.name}
                      </th>
                    ))}
                  </tr>
                ) : null}
                {/* Main header */}
                <tr>
                  {columns.map((itm) => (
                    <th
                      scope="col"
                      className={`px-2 py-3   ${
                        itm.sort ? "cursor-pointer whitespace-nowrap" : ""
                      }`}
                      onClick={() => headclick(itm)}
                      key={itm.key}
                    >
                      <span className="inline-flex items-center gap-1">
                        <span> {itm.name} </span>
                        {itm.sort ? (
                          <>
                            <span className="">
                              <HiOutlineArrowDown className=" inline text-sm" />
                            </span>
                          </>
                        ) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
              <tr>
                <td colSpan="7">
                <div className="p-4 text-center">{nodata}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default Table;
