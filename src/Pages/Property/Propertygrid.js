import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ImageSlider from "../../components/common/ImageSlider";
import { removeHTMLTags } from "../../models/string.model";
import { CommonCreteria } from "./commonCreteria/commonCreteria";

const PropertiesGrid = ({
  data,
  isLiked,
  total,
  filters,
  handlePageChange,
  handleAccountTypeChange,
  accountType,
  disLiked,
  allfilters,
  isFollow,
  navigateToDetail,
  handleSortBy,
  toggleDropdown,
  dropdownIndex,
  editItem,
  deleteItem,
  dropdownRefs,
  favourites,
}) => {
  const { user } = useSelector((state) => state);
  const navigate = useNavigate();
  return (
    <>
      <div className="">
        <div className="bg-[#f9f9f9] py-10">
          <div className=" items-center  mx-auto container lg:px-10 px-6  ">
            {favourites && (
              <ul className="flex items-center pb-[30px]">
                <li onClick={() => navigate("/project")} className="text-[#47525E] cursor-pointer after">
                  My Project
                  <span className="mx-[4px]">|</span></li>

                <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                  Interacted Properties</li>
              </ul>
            )}
            <div className="grid grid-cols-12 gap-8">
              <CommonCreteria
                total={total}
                accountType={accountType}
                handleAccountTypeChange={handleAccountTypeChange}
                allfilters={allfilters}
                handleSortBy={handleSortBy}
              />
              <div className="col-span-12 lg:mb-0 mb-4 ">
                <div className="grid grid-cols-12 bg-[#f9f9f9] gap-4">
                  {data?.length > 0 ? data.map((item, index) => {
                    let price = parseInt(item?.price || 0);
                    let sur = parseInt(item?.surface || 0);
                    let perSqr;
                    if (sur > 0) {
                      perSqr = price / sur;
                    }
                    return (
                      <div key={index} className=" col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 bg-white property_list property-grid" >
                        <div className="flex flex-wrap ">
                          <div className="lg:w-[30%] w-[100%]">
                            <ImageSlider images={item?.images} />
                          </div>
                          <div className="lg:w-[70%] w-[100%] ">
                            <div className="p-3 flex justify-between flex-wrap relative h-full">
                              <div className="lg:w-[30%] md:w-[30%] w-[100%] ">
                                <div className=" mb-0 ">
                                  {(item?.propertyType === "offmarket" || item?.propertyType === "directory") ? (
                                    <h5 className="text-[#6D6E6D] text-[20px] font-bold capitalize">
                                      {item?.propertyType === "offmarket" ? "Off-Market" : `${item?.propertyType}`}
                                      <span className="text-[#47525E] font-normal text-[13px]  capitalize block">
                                        {item?.proposal === "both" ? "Rental/Purchase" : `${item?.proposal}`} compliance
                                      </span>
                                    </h5>
                                  ) : (item?.propertyType == "rent" && item?.propertyMonthlyCharges) ? (
                                    <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                                      {item?.propertyMonthlyCharges} €
                                      <span className="text-[#47525E] text-[13px] "> / month</span>
                                    </h5>
                                  ) : (
                                    <>
                                      {item?.price ? (
                                        <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                                          {item?.price} €
                                          {perSqr > 0 && <span className="text-[#47525E] text-[13px] ms-2 ">
                                            {perSqr?.toFixed(2)} {" €/sqm"}
                                          </span>}
                                        </h5>) : null}
                                    </>
                                  )}
                                </div>
                                <div className=" mt-10  block">
                                  <ul className="flex flex-wrap justify-center items-center mx-auto block">
                                    <li className="flex items-center w-1/2 mb-3 justify-start">
                                      <img
                                        src="/assets/img/icons/heart-blue.png"
                                        alt=""
                                        className="w-[27px] h-[27px] me-[4px]"
                                      />
                                      <p className="text-[#343F4B] text-[16px] ms-2">
                                        {item?.likeCount || 0}
                                      </p>
                                    </li>
                                    <li className="flex items-center   w-1/2 mb-3 justify-start">
                                      <img
                                        src="/assets/img/icons/user-blue.png"
                                        alt=""
                                        className="w-[27px] h-[27px] me-[4px]"
                                      />
                                      <p className="text-[#343F4B] text-[16px] ms-2 ">
                                        {item?.followerCount || 0}
                                      </p>
                                    </li>
                                    <li className="flex items-center   w-1/2  mb-3 justify-start">
                                      <img
                                        src="/assets/img/icons/eye-blue.png"
                                        alt=""
                                        className="w-[27px] h-[27px] me-[4px]"
                                      />
                                      <p className="text-[#343F4B] text-[16px] ms-2 ">
                                        3K
                                      </p>
                                    </li>
                                    <li className="flex items-center   w-1/2 mb-3 justify-start">
                                      <img
                                        src="/assets/img/icons/share-blue.png"
                                        alt=""
                                        className="w-[27px] h-[27px] me-[4px]"
                                      />
                                      <p className="text-[#343F4B] text-[16px] ms-2">
                                        2
                                      </p>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div onClick={() => navigateToDetail(item)} className="lg:w-[60%] md:w-[60%] w-[100%] ">
                                {item?.propertyTitle && (
                                  <h2 className="text-[#47525E] text-[20px] font-bold  capitalize">
                                    {item?.propertyTitle}
                                  </h2>)}
                                {(item?.city || item?.country) && (
                                  <p className="text-[#47525E] text-[14px]">
                                    {item?.city || item?.country} {item?.zipcode ? "," + item?.zipcode : ""}
                                  </p>)}
                                <ul className="flex items-center mt-3">
                                  {item?.surface && (
                                    <li className="flex items-center me-5">
                                      <img
                                        src="/assets/img/prop/home.png"
                                        alt=""
                                        className="w-[17px] h-[17px] me-1"
                                      />
                                      <p className="text-[#47525E] text-[14px]">
                                        {item?.surface}
                                      </p>
                                    </li>)}
                                  {item?.rooms && (
                                    <li className="flex items-center me-5">
                                      <img
                                        src="/assets/img/prop/bed.png"
                                        alt=""
                                        className="w-[17px] h-[17px] me-1"
                                      />
                                      <p className="text-[#47525E] text-[14px]">
                                        {item?.rooms}
                                      </p>
                                    </li>)}
                                  {item?.toilets && (
                                    <li className="flex items-center">
                                      <img
                                        src="/assets/img/prop/tub.png"
                                        alt=""
                                        className="w-[17px] h-[17px] me-1"
                                      />
                                      <p className="text-[#47525E] text-[14px]">
                                        {item?.toilets}
                                      </p>
                                    </li>)}
                                </ul>
                                {removeHTMLTags(item?.content) && (
                                  <p className="text-[#47525E] mt-3 ellipses-two">
                                    {item?.content?.length > 300
                                      ? new DOMParser().parseFromString(item.content, 'text/html').body.textContent.slice(0, 300) + "..."
                                      : new DOMParser().parseFromString(item.content, 'text/html').body.textContent
                                    }
                                  </p>)}
                              </div>
                              <div className="lg:w-[10%] md:w-[10%] w-[100%]">
                                <ul className="flex items-center justify-center p-3 lg:flex-col flex-row h-full">
                                  <li className="my-3">
                                    <a onClick={() => item?.favourite_details ? disLiked(item) : isLiked(item)} >
                                      <img src={`assets/img/${item?.favourite_details ? "fill-heart" : "lined-heart"}.svg`} alt="" className="w-[30px]" />

                                    </a>
                                  </li>
                                  <li className="my-3">
                                    <a onClick={() => isFollow(item)}>
                                      <img src={`assets/img/${item?.followunfollows_details ? "fill-house" : "lined-house"}.svg`} alt="" className="w-[30px]" />
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              {/* Three-dot menu */}
                              {(user?._id === item?.addedBy) &&
                                <div ref={(el) => (dropdownRefs.current[index] = el)} className="absolute top-2 right-2">
                                  <button onClick={() => toggleDropdown(index)} className="focus:outline-none">
                                    <img src="assets/img/dots.png" alt="Options" className="w-[20px] h-[20px]" />
                                  </button>
                                  {dropdownIndex === index && (
                                    <div className="absolute bg-white  rounded-[7px] shadow-lg mt-1 -left-[70px]">
                                      <ul>
                                        <li onClick={() => editItem(item)} className="p-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center"> <FiEdit className="me-2 text-[15px]" />
                                          <span className="text-[14px] text-[#333]">
                                            Edit
                                          </span></li>
                                        <li onClick={() => deleteItem(item)} className="p-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center"> <AiOutlineDelete className="me-2" />
                                          <span className="text-[14px] text-[#333]">
                                            Delete
                                          </span></li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }) :   <div className="text-center col-span-12 my-8">
                  <img src="assets/img/no-data.svg" className="w-[400px] mx-auto "/>
                  No Records Found
                </div>}
                </div>
                <div className={`paginationWrapper ${total > filters?.count ? '' : 'd-none'}`}>
                  <span>Show {data?.length} from {total} Properties</span>
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
    </>
  );
};

export default PropertiesGrid;
