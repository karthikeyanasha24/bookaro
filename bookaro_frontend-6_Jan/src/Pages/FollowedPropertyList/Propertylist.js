import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ImageSlider from "../../components/common/ImageSlider";

const PropertiesList = ({
  data,
  detail,
  isLiked,
  disLiked,
  isFollow,
  navigateToDetail,
}) => {

  return (
    <>
      <div className="">
        <div className="bg-[#f9f9f9] py-10">
          <div className="items-center  mx-auto container lg:px-10 px-6">
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
                    let price = Number(item?.price) || 0;
                    let sur = Number(item?.surface) || 0;
                    let perSqr;
                    if (sur > 0) {
                      perSqr = price / sur;
                    }
                    return (
                      <div key={index} className="xl:col-span-3 col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 bg-white">
                        <ImageSlider images={item?.images} />
                        <div onClick={() => navigateToDetail(item?._id)} className="p-3">
                          {item?.propertyTitle &&
                            (<h2 className="text-[#47525E] text-[16px] font-bold mt-2 capitalize ellipses mb-1">
                              {item?.propertyTitle}
                            </h2>)}
                          {item?.address &&
                            (<p className="text-[#47525E] text-[14px] ellipses">
                              {item?.address}
                            </p>)}
                          <ul className="flex items-center mt-3">
                            {+item?.surface > 0 && (
                              <li className="flex items-center me-5">
                                <img src="assets/img/prop/home.png" alt="" className="w-[17px] h-[17px] me-1" />
                                <p className="text-[#47525E] text-[14px]">{item?.surface}</p>
                              </li>)}
                            {+item?.rooms > 0 && (
                              <li className="flex items-center me-5">
                                <img src="assets/img/prop/bed.png" alt="" className="w-[17px] h-[17px] me-1" />
                                <p className="text-[#47525E] text-[14px]">{item?.rooms}</p>
                              </li>)}
                            {+item?.toilets > 0 && (
                              <li className="flex items-center">
                                <img src="assets/img/prop/tub.png" alt="" className="w-[17px] h-[17px] me-1" />
                                <p className="text-[#47525E] text-[14px]">{item?.toilets}</p>
                              </li>)}
                          </ul>
                          <div className="mt-3 mb-0">
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
                        </div>
                        <div className="bg-[#f9f9f9] p-3">
                          <ul className="flex items-center justify-center">
                            <li className="flex items-center mx-2">
                              <img
                                src="/assets/img/icons/heart-blue.png"
                                alt=""
                                className="w-[15px] h-[15px] me-[4px]"
                              />
                              <p className="text-[#343F4B] text-[14px]">{item?.likeCount || 0}</p>
                            </li>
                            <li className="flex items-center mx-2">
                              <img
                                src="/assets/img/icons/eye-blue.png"
                                alt=""
                                className="w-[15px] h-[15px] me-[4px]"
                              />
                              <p className="text-[#343F4B] text-[14px]">3K</p>
                            </li>
                            <li className="flex items-center mx-2">
                              <img
                                src="/assets/img/icons/share-blue.png"
                                alt=""
                                className="w-[15px] h-[15px] me-[4px]"
                              />
                              <p className="text-[#343F4B] text-[14px]">2</p>
                            </li>
                            <li className="flex items-center mx-2">
                              <img
                                src="/assets/img/icons/user-blue.png"
                                alt=""
                                className="w-[15px] h-[15px] me-[4px]"
                              />
                              <p className="text-[#343F4B] text-[14px]">{item?.followerCount || 0}</p>
                            </li>
                          </ul>
                        </div>
                        <div>
                          {/* <ul className="flex items-center justify-center p-3">
                            <li className="mx-3">
                              <a onClick={() => isFollow(item)}>
                                <img src={`assets/img/${item?.follow ? "home-like" : "prop/home-plus"}.png`} alt="" className="w-[25px]" />
                              </a>
                            </li>
                            <li className="mx-3">
                              <a onClick={() => item?.like ? disLiked(item) : isLiked(item)}>
                                <img src={`assets/img/prop/heart${item?.like ? "Like" : ""}.png`} alt="" className="w-[25px]" />
                              </a>
                            </li>
                          </ul> */}
                          <ul className="flex items-center justify-center p-3">
                                <li className="mx-3 ">
                                  <a onClick={() => isFollow(item)}>
                                    <img
                                      src={`assets/img/${
                                        item?.follow
                                          ? "fill-house"
                                          : "lined-house"
                                      }.svg`}
                                      alt=""
                                      className="w-[25px]"
                                    />
                                  </a>
                                </li>
                                <li className="mx-3">
                                  <a
                                    onClick={() =>
                                      item?.like
                                        ? disLiked(item)
                                        : isLiked(item)
                                    }
                                  >
                                    <img
                                      src={`assets/img/${
                                        item?.like
                                          ? "fill-heart"
                                          : "lined-heart"
                                      }.svg`}
                                      alt=""
                                      className="w-[25px]"
                                    />
                                  </a>
                                </li>
                              </ul>
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

export default PropertiesList;
