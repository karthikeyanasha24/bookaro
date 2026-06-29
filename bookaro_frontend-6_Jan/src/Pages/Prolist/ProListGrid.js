import React from "react";
import ReactPaginate from "react-paginate";
import CommonCreteria from "./CommonCreteria";
import { FaStar } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProListGrid = ({
  data,
  total,
  filters,
  handlePageChange,
  allfilters,
  navigateToDetail,
  openServiceView,
}) => {
  const { user } = useSelector((state) => state);
  const history = useNavigate()
  return (
    <div className="">
      <div className="bg-[#f9f9f9] py-10">
        <div className="items-center  mx-auto container lg:px-10 px-6">
          <div className="grid grid-cols-12 gap-8">
            <CommonCreteria allfilters={allfilters} total={total} />
            <div className="col-span-12 lg:mb-0 mb-4  pe-3">
              <div className="grid grid-cols-12 bg-[#f9f9f9] gap-4">
                {data?.length > 0 ? (
                  data.map((item, i) => {
                    return (
                      <div key={i}
                        className="2xl:col-span-4 xl:col-span-6 lg:col-span-6 col-span-12">
                        <div className="bg-white border border-[#EAE4F3] p-4 rounded-[14px] flex flex-col mb-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-black text-white text-[10px] px-2 py-1 rounded-[4px]">Top agent</span>
                            <button className="text-[#B8B8C0]">☆</button>
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="capitalize text-[#AAAAAA] text-[14px] font-[600]">
                                {item?.role}
                              </span>
                              <h2 className="text-[#47525E] font-[600] text-[17px]">
                                <button onClick={() => navigateToDetail(item)} className="text-left">{item?.companyName}</button>
                                {/* 123WEBIMMO.COM ANGERS */}
                              </h2>
                              <p className="text-[#47525E]">
                                {`${item?.city}${item?.pinCode ? ` (${item?.pinCode})` : ""}`}
                              </p>
                            </div>
                            <div className="flex items-center mt-1 font-[600]">
                              <FaStar className="text-[#1AB1A4] me-1 " />
                              4,4/5
                            </div>
                          </div>
                          <div className="flex mt-5 sm:flex-row flex-col sm:items-center items-start">
                            <img
                              src="assets/img/pro-logo.png"
                              alt=""
                              className="w-[68px] h-[68px] rounded-full border border-[#E5E7EB]"
                            />
                            <ul className="sm:ms-3 ms-0 flex sm:flex-row flex-col  gap-2 sm:mt-0 mt-4">
                              <li className="flex sm:flex-col flex-row items-center">
                                <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                                  {item?.rentCount || 0}
                                </p>
                                <span className="text-[#47525E] text-center  block">
                                  Properties for rent
                                </span>
                              </li>
                              <li className="flex sm:flex-col flex-row items-center">
                                <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                                  {item?.saleCount || 0}
                                </p>
                                <span className="text-[#47525E] text-center block">
                                  Properties for sale
                                </span>
                              </li>
                              <li className="flex sm:flex-col flex-row items-center">
                                <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                                  {item?.offMarketCount || 0}
                                </p>
                                <span className="text-[#47525E] text-center  block">
                                  Properties Off-Market
                                </span>
                              </li>
                              <li className="flex sm:flex-col flex-row items-center">
                                <p className="text-[#1AB1A4] font-[600] text-center text-[20px] sm:me-0 me-4">
                                  {item?.directoryCount || 0}
                                </p>
                                <span className="text-[#47525E] text-center  block">
                                  Properties Directory
                                </span>
                              </li>
                            </ul>
                          </div>
                          <div className="mt-4 border-t border-[#F0EBF8] pt-3 flex items-center justify-between">
                            <button
                              className="text-[#7B6E8E] text-[13px] underline"
                              onClick={() => openServiceView?.(item)}
                            >
                              Contact
                            </button>
                            <button
                              className="bg-[#976DD0] text-white text-[13px] px-4 py-1.5 rounded-full"
                              onClick={() => openServiceView?.(item)}
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center col-span-12 my-8">
                    <img src="assets/img/no-data.svg" className="w-[400px] mx-auto " />
                    No Records Found
                  </div>
                )}
                {!user?.loggedIn && <p className="text-center col-span-12 my-8">
                  {/* <img src="/assets/img/no-data.png" className="w-[100px] mx-auto" /> */}
                  Want to see more pro list? <spna onClick={(e) => history("/login")} className="text-bold text-[#976DD0] cursor-pointer">Just log in first!</spna>
                </p>}
              </div>
              <div
                className={`paginationWrapper ${total > filters?.count ? "" : "d-none"
                  }`}
              >
                <span>
                  Show {data?.length} from {total} Properties
                </span>
                <ReactPaginate
                  previousLabel="< Previous"
                  nextLabel="Next >"
                  breakLabel="..."
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={1}
                  pageCount={Math.ceil(total / filters?.count)}
                  onPageChange={handlePageChange}
                  forcePage={filters?.page - 1}
                  containerClassName={"pagination flex"}
                  pageClassName={"pagination-item"}
                  activeClassName={"pagination-item-active"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProListGrid;
