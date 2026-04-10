import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ImageSlider from "../../components/common/ImageSlider";
import { removeHTMLTags } from "../../models/string.model";

const PropertiesGrid = ({
  data,
  detail,
  isLiked,
  disLiked,
  isFollow,
  navigateToDetail,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="">
        <div className="bg-[#f9f9f9] py-10">
          <div className="items-center  mx-auto container lg:px-10 px-6">
            <ul className="flex items-center pb-[30px]">
              <li onClick={() => navigate("/project")} className="text-[#47525E] cursor-pointer after">
                My Project
                <span className="mx-[4px]">|</span></li>
              <li onClick={() => navigate("/followed-properties")} className="text-[#47525E] cursor-pointer capitalize">
                Followed properties
                <span className="mx-[4px]">|</span></li>
              <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                {detail?.folder?.name}</li>
            </ul>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12">
                <p className="text-[#47525E]">
                  <span className="text-[#47525E] font-bold text-[20px]">
                    {data?.length}
                    {` Propert${data?.length > 1 ? "ies" : "y"}`}
                  </span>
                  {` followed for ${detail?.folder?.name || ""} search`}
                </p>
              </div>
              <div className="col-span-12 lg:mb-0 mb-4  pe-3">
                <div className="grid grid-cols-12 bg-[#f9f9f9] gap-4">
                  {data?.length > 0 ? data.map((item, index) => {
                    let price = parseInt(item?.price || 0);
                    let sur = parseInt(item?.surface || 0);
                    let perSqr;
                    if (sur > 0) {
                      perSqr = price / sur;
                    }
                    return (
                      <div key={index} className=" col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 bg-white property_list " >
                        <div className="flex flex-wrap">
                          <div className="lg:w-[30%] w-[100%]">
                            <ImageSlider images={item?.images} />
                          </div>
                          <div className="lg:w-[70%] w-[100%] ">
                            <div className="p-3 flex justify-between flex-wrap">
                              <div className="md:w-[20%]  w-[100%]">
                                <div className=" mb-0 ">
                                  {item?.propertyType == "offmarket" ? (
                                    <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                                      Off-Market
                                      <span className="text-[#47525E] text-[13px] ms-2 ">Occupied</span>
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
                                <div className=" mt-10 mx-auto block">
                                  <ul className="flex flex-wrap justify-center items-center mx-auto block">
                                    <li className="flex items-center w-1/2 mx-auto md:justify-center mb-3 justify-start">
                                      <img
                                        src="/assets/img/icons/heart-blue.png"
                                        alt=""
                                        className="w-[27px] h-[27px] me-[4px]"
                                      />
                                      <p className="text-[#343F4B] text-[16px] ms-2">
                                        {item?.likeCount || 0}
                                      </p>
                                    </li>
                                    <li className="flex items-center   w-1/2 mx-auto md:justify-center mb-3 justify-start">
                                      <img
                                        src="/assets/img/icons/user-blue.png"
                                        alt=""
                                        className="w-[27px] h-[27px] me-[4px]"
                                      />
                                      <p className="text-[#343F4B] text-[16px] ms-2 ">
                                        {item?.followerCount || 0}
                                      </p>
                                    </li>
                                    <li className="flex items-center   w-1/2 mx-auto  md:justify-center mb-3 justify-start">
                                      <img
                                        src="/assets/img/icons/eye-blue.png"
                                        alt=""
                                        className="w-[27px] h-[27px] me-[4px]"
                                      />
                                      <p className="text-[#343F4B] text-[16px] ms-2 ">
                                        3K
                                      </p>
                                    </li>
                                    <li className="flex items-center   w-1/2 mx-auto md:justify-center mb-3 justify-start">
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
                              <div onClick={() => navigateToDetail(item?._id)} className="lg:w-[65%] md:w-[75%] w-[100%]">
                                {item?.propertyTitle && (
                                  <h2 className="text-[#47525E] text-[20px] font-bold mt-2 capitalize">
                                    {item?.propertyTitle}
                                  </h2>)}
                                {item?.address && (
                                  <p className="text-[#47525E] text-[14px]">
                                    {item?.address}
                                  </p>)}
                                <ul className="flex items-center mt-3">
                                  {+item?.surface > 0 && (
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
                                  {+item?.rooms > 0 && (
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
                                  {+item?.toilets > 0 && (
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
                              <div className="lg:w-[10%] w-[100%]">
                                <ul className="flex items-center justify-center p-3 lg:flex-col flex-row h-full">
                                  <li className="my-3">
                                    <a onClick={() => item?.like ? disLiked(item) : isLiked(item)} >
                                      <img src={`assets/img/${item?.like ? "fill-heart" : "lined-heart"}.svg`} alt="" className="w-[30px]" />
                                    </a>
                                  </li>
                                  <li className="my-3">
                                    <a onClick={() => isFollow(item)}>
                                      <img src={`assets/img/${item?.followunfollows_details ? "fill-house" : "lined-house"}.svg`} alt="" className="w-[30px]" />
                                    </a>
                                  </li>
                                </ul>
                              </div>
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
                {/* <div className={`paginationWrapper ${total > filters?.count ? '' : 'd-none'}`}>
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
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertiesGrid;
