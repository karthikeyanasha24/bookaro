import ReactPaginate from "react-paginate";
import { dateFormate } from "../../models/string.model";
import CommonCreteria from "./CommonCreteria";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const BuildingPermitGrid = ({
  data,
  total,
  filters,
  handlePageChange,
  allfilters,
  calculateNo,
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const findType = (itm) => {
    if (itm == "demolitionPermit") {
      return "Demolition Permit"
    } else if (itm == "nonResdential") {
      return "Non Resdential"
    } else {
      return "Resdential"
    }
  }
  return (
    <div className="">
      <div className="bg-[#f9f9f9] py-10">
        <div className=" items-center  mx-auto container lg:px-10 px-6">
          <div className="grid grid-cols-12 gap-8 ">
            <div className="col-span-12">    <p className="text-[#47525E]">
              <span className="text-[#47525E] font-bold text-[20px]">
                {total} results </span>
              for building permits
            </p></div>

            <div className="col-span-12 lg:mb-0 mb-4  ">
              <div className="grid grid-cols-12 gap-4">
                {data?.length > 0 ? (
                  data.map((itm, i) => {
                    return (
                      <div className=" xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 border border-[#D2D2D2] bg-white p-5 rounded-xl" >
                        <h4 className="text-[#47525E] font-[600] mb-3 text-[18px]">
                          {findType(itm?.type)} building
                        </h4>
                        <ul className="">
                          <li className="mb-1">
                            <p className="text-[#47525E] flex items-center">
                              <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                              Request date: {itm?.authorizationDate || "--"}
                            </p>
                          </li>
                          <li className="mb-1">
                            <p className="text-[#47525E] flex items-center">
                              <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                              Request Status: {itm?.statusLabel || "--"}
                            </p>
                          </li>
                          <li className="mb-1">
                            <p className="text-[#47525E] flex items-center">
                              <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                              Start Date: {itm?.worksStartDate || "--"}
                            </p>
                          </li>
                          <li className="mb-1">
                            <p className="text-[#47525E] flex items-center">
                              <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                              Requester Name: {itm?.requesterName || "--"}
                            </p>
                          </li>
                          <li className="mb-1">
                            <p className="text-[#47525E] flex items-center">
                              <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                              Address: {itm?.address || "--"}
                            </p>
                          </li>

                          {/* <li className="mb-1">
                            <p className="text-[#47525E] flex items-center">
                              <span className="bg-[#46A49B] w-[8px] h-[8px] rounded-full inline-block me-2 shrink-0"></span>
                              Building Type: {itm?.type || "--"}
                            </p>
                          </li> */}


                        </ul>
                        {/* <div className="flex justify-end">
                          <p className="bg-[#73319A] w-[35px] h-[35px] rounded-[50px] p-1 text-white flex items-center justify-center font-[600]">
                            {calculateNo(filters.page, filters.count) + i}
                          </p>
                        </div> */}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center col-span-12 my-8">
                    <img src="assets/img/no-data.svg" className="w-[400px] mx-auto " />
                    No Records Found
                  </div>
                )}
                {!user?.loggedIn && <p className="text-center col-span-12 my-8">
                  {/* <img src="/assets/img/no-data.png" className="w-[100px] mx-auto" /> */}
                  Want to see more building permit? <spna onClick={(e) => navigate("/login")} className="text-bold text-[#976DD0] cursor-pointer">Just log in first!</spna>
                </p>}
              </div>
              <div
                className={`paginationWrapper md:flex-row flex-col ${total > filters?.count ? "" : "d-none"
                  }`}
              >
                <span className="md:mb-0 mb-2">
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

export default BuildingPermitGrid;
