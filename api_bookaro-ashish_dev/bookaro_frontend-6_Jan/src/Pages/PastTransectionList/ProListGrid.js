import ReactPaginate from "react-paginate";
import CommonCreteria from "./CommonCreteria";
import { capLetter, dateFormate, formatCurrency } from "../../models/string.model";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PastTransectionGrid = ({
  data,
  total,
  filters,
  handlePageChange,
  allfilters,
  calculateNo,
  handleSortBy,
  getType,
}) => {
  const { user } = useSelector((state) => state);
  const history = useNavigate()
  return (
    <div className="">
      <div className="bg-[#f9f9f9] py-10">
        <div className=" items-center  mx-auto container lg:px-10 px-6">
          <div className="grid grid-cols-12 md:gap-8 gap-0">
            <CommonCreteria allfilters={allfilters} total={total} handleSortBy={handleSortBy} />
            <div className="col-span-12 lg:mb-0 mb-4  pe-3">
              <div className="grid grid-cols-12  md:gap-4 gap-0">
                {data?.length > 0 ? (
                  data.map((itm, i) => {
                    let price = Math.floor(itm?.land_value);
                    let sur = Math.floor(itm?.lot1_surface_carrez);
                    let perSqr = Math.floor(price / sur);
                    let type = itm.local_type?.toLowerCase();
                    return (
                      <div className="lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[20px] md:mb-0 mb-3">
                        <div className={`${getType(type).class} h-[160px] rounded-tl-[20px] rounded-tr-[20px]`}>
                          <img alt=""
                            src={`${getType(type).img}`}
                            className="h-[120px] rounded-tl-[20px] rounded-tr-[20px] mx-auto"
                          />
                          <p className="text-center text-[#2D3336] uppercase text-[12px] font-[600]">
                            {itm.local_type}
                          </p>
                        </div>
                        <ul className="p-3">
                          {+price > 0 && <li className="flex items-center mb-1">
                            <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">
                              Transaction price:
                            </h5>
                            <p className="text-[13px]">{formatCurrency(price)} €</p>
                          </li>}
                          {+sur > 0 && <li className="flex items-center mb-1">
                            <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">
                              Surface:{" "}
                            </h5>
                            <p className="text-[13px]">{formatCurrency(sur)} sqm</p>
                          </li>}
                          {+perSqr > 0 && <li className="flex items-center mb-1">
                            <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">
                              Price per Sqm:{" "}
                            </h5>
                            <p className="text-[13px]">{formatCurrency(perSqr)} €</p>
                          </li>}
                          {+itm?.number_of_main_pieces > 0 && <li className="flex items-center mb-1">
                            <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">
                              Number of rooms:{" "}
                            </h5>
                            <p className="text-[13px]">{itm?.number_of_main_pieces}</p>
                          </li>}

                          {itm?.mutation_date && <li className="flex items-center mb-1">
                            <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px]">
                              Transaction date:
                            </h5>
                            <p className="text-[13px]">{dateFormate(itm?.mutation_date)}</p>
                          </li>}
                          {itm?.address_channel_name && <li className="flex items-start mb-1">
                            <h5 className="text-[#47525E] font-[300] me-3 w-[120px] text-[13px] shrink-0">
                              Location:
                            </h5>
                            <p className="text-[13px] ">
                              {`${capLetter(itm?.address_channel_name)}${itm?.community_name
                                ? `, ${itm.community_name?.toLowerCase()}` : ""}${itm?.postal_code ? ` (${itm.postal_code})` : ""}`}
                            </p>
                          </li>}
                        </ul>
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
                  Want to see more past transaction list? <spna onClick={(e) => history("/login")} className="text-bold text-[#976DD0] cursor-pointer">Just log in first!</spna>
                </p>}
              </div >
              <div
                className={`paginationWrapper ${total > filters?.count ? "" : "d-none"
                  }`}
              >
                <span>
                  Show {data?.length} from {total} Properties
                </span>
                {user?.loggedIn && <ReactPaginate
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
                />}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastTransectionGrid;
