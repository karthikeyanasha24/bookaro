import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../../components/common/Modal/LoginModal";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import ContactAgency from "../PropertyDetails/ContactAgency";
import BlogSection from "../Blogs/BlogSection";
import ShowNumberModal from "../PropertyDetails/ShowNumberModal";
import DirectMsgModal from "../PropertyDetails/DirectMsgModal";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { dateFormate, formatCurrency, getOrdinal, imagePath } from "../../models/string.model";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

const PropertyTimeline = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get("id");
  const [detail, setDetail] = useState();
  const [loginModal, setloginModal] = useState(false);
  const [time, setTime] = useState([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    page: 1,
    count: 12,
  });
  const [data, setData] = useState();
  const [showNumber, setshowNumber] = useState(false);
  const [directMsg, setdirectMsg] = useState(false);

  const getPropertyDetails = () => {
    ApiClient.get("property/detail", { id: paramId, userId: user?._id })?.then((res) => {
      if (res.success) {
        setData(res?.data)
        let data = res?.data?.propertyDetail;
        setDetail(data);
      }
    });
  };

  const getTimeline = async () => {
    loader(true);
    const dto = {
      ...filters,
      propertyId: paramId,
    };
    try {
      const res = await ApiClient.get("timeline/list", dto);
      if (res.success) {
        setTime(res?.data?.timelines || []);
        setTotal(res?.data?.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      loader(false);
    }
  };

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  useEffect(() => {
    getTimeline({ ...filters });
  }, [filters]);

  useEffect(() => {
    if (paramId) {
      getTimeline()
      getPropertyDetails()
    }
    window.scrollTo(0, 0);
  }, [])
  const isFollow = () => {
    if (!user?.loggedIn) return setloginModal(true);
    const isliked = data?.followunfollows_details ? false : true;
    let method = "put";
    let url = `followUnfollow/update`;
    let value = {
      user_id: user?._id,
      property_id: data?.propertyDetail?._id || data?.propertyDetail?.id,
      follow_unfollow: isliked,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getPropertyDetails();
      } else toast.error(res.message);
      loader(false);
    });
  };

  const like = async (card) => {
    loader(true);
    const url = `timeline/liketimeline`;
    const dto = { id: card?.id, like: !card?.like };
    const method = "put";
    try {
      const res = await ApiClient.allApi(url, dto, method);
      if (res.success) {
        getTimeline();
      }
    } catch (error) {
      console.error("Error liking timeline:", error);
    } finally {
      loader(false);
    }
  };

  return (
    <>
      <PageLayout>
        <>
          <LoginModal
            loginModal={loginModal}
            setloginModal={setloginModal}
          />
          <ShowNumberModal
            showNumber={showNumber}
            setshowNumber={setshowNumber}
            detail={data?.propertyDetail}
          />
          <DirectMsgModal
            directMsg={directMsg}
            setdirectMsg={setdirectMsg}
            detail={data?.propertyDetail}
          />
          <div className="bg-white border-t border-[#969FAA]">
            <div className=" items-center  mx-auto px-6 lg:px-10">
              <div className="grid grid-cols-12 py-4 ">
                <div className="col-span-12 flex items-center justify-between xl:flex-row flex-col">
                  <ul className="flex items-center xl:justify-start justify-center ">
                    <li>
                      <p
                        onClick={() => navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Picture`)}
                        className={`cursor-pointer text-[16px] pe-4`}
                      >
                        Pictures
                      </p>
                    </li>
                    <li>
                      <p
                        onClick={() => navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Description`)}
                        className={`cursor-pointer text-[16px] pe-4`}
                      >
                        Description
                      </p>
                    </li>

                    <li>
                      <p
                        onClick={() => {
                          if (detail?.rating?.length > 0 &&
                            detail?.revenue_detail?.length > 0)
                            navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Attractivity`)
                        }}
                        className={`text-[16px] pe-4 ${detail?.rating?.length > 0 &&
                            detail?.revenue_detail?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
                      >
                        Attractivity
                      </p>
                    </li>
                    {/* )} */}
                    {/* {detail?.revenue_detail?.length > 0 && ( */}
                    <li>
                      <p
                        onClick={() => {
                          if (detail?.revenue_detail?.length > 0)
                            navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Revenues`)
                        }}
                        className={`cursor-pointer text-[16px] pe-4 ${detail?.revenue_detail?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
                      >
                        Revenues
                      </p>
                    </li>
                    {/* )} */}
                    {detail?.Expenses?.length > 0 && (
                      <li>
                        <p
                          onClick={() => {
                            if (detail?.Expenses?.length > 0)
                              navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Expenses`)
                          }}
                          className={`cursor-pointer text-[16px] pe-4 ${detail?.Expenses?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
                        >
                          Expenses
                        </p>
                      </li>
                    )}
                    {detail?.renovation_work?.length > 0 && (
                      <li>
                        <p
                          onClick={() => {
                            if (detail?.renovation_work?.length > 0)
                              navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Renovation works`)
                          }}
                          className={`cursor-pointer text-[16px] pe-4 ${detail?.renovation_work?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
                        >
                          Renovation works
                        </p>
                      </li>
                    )}
                    <li>
                      <p
                        onClick={() => {
                          if (detail?.linkedSchools?.length > 0)
                            navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Schools`)
                        }

                        }
                        className={`cursor-pointer text-[16px] pe-4 ${detail?.linkedSchools?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
                      >
                        Schools
                      </p>
                    </li>
                    <li>
                      <p
                        onClick={() => navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Map`)}
                        className={`cursor-pointer text-[16px] pe-4`}
                      >
                        Map
                      </p>
                    </li>
                    <li>
                      <p
                        onClick={() => navigate(`/property-details?id=${data?.propertyDetail?.id || data?.propertyDetail?._id}&scroll=Good to know`)}
                        className={`cursor-pointer text-[16px] pe-4`}
                      >
                        Good to know
                      </p>
                    </li>
                  </ul>

                  <ul className="flex items-center xl:mt-0 mt-4">
                    <li>
                      <Link
                        to={`/property-timeline?id=${paramId}`}
                        className="text-[16px] me-4 text-[#969FAA] font-bold flex items-center mb-0"
                      >
                        <span className="w-[8px] h-[8px] bg-[#ACABAA] block rounded-full me-3 "></span>
                        Timeline
                      </Link>
                    </li>
                    {!data?.propertyDetail?.sale_my_property && data?.propertyDetail?.phoneNumber && (
                      <li>
                        <button
                          onClick={() => setshowNumber(true)}
                          className="text-[14px] me-4  font-bold  text-[#787878] border-[1.5px] border-[#976DD0] text-center py-1 px-4 rounded-[20px]">
                          Show phone number
                        </button>
                      </li>
                    )}
                    {user?._id !== data?.propertyDetail?.addedBy && (
                      <li>
                        <button
                          onClick={() => {
                            if (user.loggedIn) return setdirectMsg(true);
                            else {
                              setloginModal(true);
                            }
                          }}
                          className="text-[14px] pe-4  font-bold bg-[#976DD0] text-white border-[1.5px] border-[#976DD0] text-center py-1 px-4 rounded-[20px]">
                          Direct message
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-[#f9f9f9] pt-10">
              <div className="container items-center  mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-12 gap-5">
                  <div className="xl:col-span-9 lg:col-span-8 col-span-12">
                    <div className="mb-5">
                      <h2 className="text-[#47525E] text-[24px] font-bold capitalize">
                        Property key events
                      </h2>
                      {user?._id !== data?.propertyDetail?.addedBy && (
                        <>
                          <p className="text-[#5A6978] text-[16px]">
                            Follow this property to be informed of key events
                          </p>
                          <button onClick={() => isFollow()} className="bg-[#13CEA7] text-white rounded-[4px] py-1 px-6 font-[600] mt-2">
                            {data?.followunfollows_details ?
                              "Followed" : "Follow"}
                          </button>
                        </>)}
                    </div>

                    <ul>
                      {time?.length > 0 ? (
                        time.map((itm, i) => {
                          // console.log("timeline type", i, itm?.type)
                          if (itm?.type === "newPrice") {
                            return (
                              <li key={i} className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                                <p className="text-[#31373E] ">Price change</p>
                                <div className="flex items-center">
                                  <h4 className="text-[#31373E] font-[700] text-[18px]">
                                    The property new price is {formatCurrency(itm?.newPrice)} €
                                  </h4>
                                  {/* <span className="text-[#31373E] ms-1 text-[14px]">(-5%)</span> */}
                                </div>
                                <div className="flex justify-between mt-2">
                                  <p className="text-[#31373E] w-[80%]">
                                    {dateFormate(itm?.updatedAt, "MMMM Do YYYY")}
                                  </p>
                                  {itm?.like ? (
                                    <BiSolidLike onClick={() => like(itm)} className="w-[24px] text-[#976DD0]  h-[24px] cursor-pointer" />
                                  ) : (
                                    <BiLike onClick={() => like(itm)} className="w-[24px]  h-[24px]  text-[#976DD0] cursor-pointer" />
                                  )}
                                </div>
                              </li>
                            )
                          } else if (itm?.type === "propertyMonthlyCharges") {
                            return (
                              <li key={i} className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                                <p className="text-[#31373E] ">Rent change</p>
                                <div className="flex items-center">
                                  <h4 className="text-[#31373E] font-[700] text-[18px]">
                                    The property new rent is {formatCurrency(itm?.propertyMonthlyCharges)} €
                                  </h4>
                                  {/* <span className="text-[#31373E] ms-1 text-[14px]">(-5%)</span> */}
                                </div>
                                <div className="flex justify-between mt-2">
                                  <p className="text-[#31373E] w-[80%]">
                                    {dateFormate(itm?.updatedAt, "MMMM Do YYYY")}
                                  </p>
                                  {itm?.like ? (
                                    <BiSolidLike onClick={() => like(itm)} className="w-[24px] text-[#976DD0]  h-[24px] cursor-pointer" />
                                  ) : (
                                    <BiLike onClick={() => like(itm)} className="w-[24px]  h-[24px] text-[#976DD0] cursor-pointer" />
                                  )}
                                </div>
                              </li>
                            )
                          } else if (itm?.type === "interestStatus") {
                            return (
                              <li key={i} className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                                <p className="text-[#31373E] ">Interest Status</p>
                                <div className="flex items-center">
                                  <h4 className="text-[#31373E] font-[700] text-[18px]">
                                    {itm.funnelStatus}
                                  </h4>
                                </div>
                                <div className="flex justify-between mt-2">
                                  <p className="text-[#31373E] w-[80%]">
                                    {dateFormate(itm?.updatedAt, "MMMM Do YYYY")}
                                  </p>
                                  {itm?.like ? (
                                    <BiSolidLike onClick={() => like(itm)} className="w-[24px] text-[#976DD0]  h-[24px] cursor-pointer" />
                                  ) : (
                                    <BiLike onClick={() => like(itm)} className="w-[24px]  h-[24px] text-[#976DD0] cursor-pointer" />
                                  )}
                                </div>
                              </li>
                            )
                          } else if (itm?.type === "ownerChange") {
                            return (
                              <li key={i} className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                                <p className="text-[#31373E] ">Property Transfer</p>
                                <div className="flex items-center">
                                  <h4 className="text-[#31373E] font-[700] text-[18px]">
                                    The property has been transferred by <span className="capitalize">{itm.oldOwner}</span> to <span className="capitalize">{itm.newOwner}</span>.
                                  </h4>
                                </div>
                                <div className="flex justify-between mt-2">
                                  <p className="text-[#31373E] w-[80%]">
                                    {dateFormate(itm?.updatedAt, "MMMM Do YYYY")}
                                  </p>
                                  {itm?.like ? (
                                    <BiSolidLike onClick={() => like(itm)} className="w-[24px] text-[#976DD0]  h-[24px] cursor-pointer" />
                                  ) : (
                                    <BiLike onClick={() => like(itm)} className="w-[24px]  h-[24px] text-[#976DD0] cursor-pointer" />
                                  )}
                                </div>
                              </li>
                            )
                          } else if (itm?.type === "proposal") {
                            return (
                              <li key={i} className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                                <p className="text-[#31373E] ">Proposal change</p>
                                <div className="flex items-center">
                                  <h4 className="text-[#31373E] font-[700] text-[18px]">
                                    This property is now open for {itm?.proposal === "both" ? "Rental/Purchase" : `${itm?.proposal}`} proposal
                                  </h4>
                                </div>
                                <div className="flex justify-between mt-2">
                                  <p className="text-[#31373E] w-[80%]">
                                    {dateFormate(itm?.updatedAt, "MMMM Do YYYY")}
                                  </p>
                                  {itm?.like ? (
                                    <BiSolidLike onClick={() => like(itm)} className="w-[24px] text-[#976DD0]  h-[24px] cursor-pointer" />
                                  ) : (
                                    <BiLike onClick={() => like(itm)} className="w-[24px]  h-[24px] text-[#976DD0] cursor-pointer" />
                                  )}
                                </div>
                              </li>
                            )
                          } else if (itm?.type === "propertyType") {
                            return (
                              <li key={i} className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                                <p className="text-[#31373E] ">Status change</p>
                                <h4 className="text-[#31373E] font-[700] text-[18px]">
                                  The property is now for {" "}
                                  {itm?.propertyType === "offmarket" ? "Off-Market" : itm?.propertyType}
                                </h4>
                                {/* <div className="flex items-center">
                                <p className="text-[#31373E] ">Price :</p>
                                <h4 className="text-[#31373E] font-[700] text-[18px]">
                                  {formatCurrency(time[i + 1]?.newPrice || time[i + 2]?.newPrice)} €
                                </h4>
                              </div>
                              <p className="text-[#31373E] ">
                                Real estate agency sale
                              </p>
                              <div className="flex items-center">
                                <div className="w-[30px] h-[30px] rounded-[50px]">
                                  <img
                                    src="assets/img/status-logo.png"
                                    alt=""
                                    className="w-[30px] h-[30px] rounded-[50px]  contain"
                                  />
                                </div>
                                <p className="text-[#42C4B3]">
                                  Barnes Internationals Realty
                                </p>
                              </div> */}
                                <div className="flex justify-between mt-2">
                                  <p className="text-[#31373E] w-[80%]">
                                    {dateFormate(itm?.updatedAt, "MMMM Do YYYY")}
                                  </p>
                                  {itm?.like ? (
                                    <BiSolidLike onClick={() => like(itm)} className="w-[24px] text-[#976DD0]  h-[24px] cursor-pointer" />
                                  ) : (
                                    <BiLike onClick={() => like(itm)} className="w-[24px]  h-[24px] text-[#976DD0] cursor-pointer" />
                                  )}
                                </div>
                              </li>
                            )
                          } else if (itm?.type === "revenue_detail") {
                            return (
                              <li key={i} className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                                <p className="text-[#31373E] ">Status change</p>
                                <h4 className="text-[#31373E] font-[700] text-[18px]">
                                  The property is now for {" "}
                                  {itm?.propertyType === "offmarket" ? "Off-Market" : itm?.propertyType}
                                </h4>
                                <div className="flex justify-between mt-2">
                                  <p className="text-[#31373E] w-[80%]">
                                    {dateFormate(itm?.updatedAt, "MMMM Do YYYY")}
                                  </p>
                                  {itm?.like ? (
                                    <BiSolidLike onClick={() => like(itm)} className="w-[24px] text-[#976DD0]  h-[24px] cursor-pointer" />
                                  ) : (
                                    <BiLike onClick={() => like(itm)} className="w-[24px]  h-[24px] text-[#976DD0] cursor-pointer" />
                                  )}
                                </div>
                              </li>
                            )
                          } if (itm?.type === "propertyCreated") {
                            return (
                              <li key={i} className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                                <p className="text-[#31373E] ">Property Profile</p>
                                <div className="flex items-center">
                                  <h4 className="text-[#31373E] font-[700] text-[18px]">
                                    Property profile created {dateFormate(itm?.createddAt, "MMMM Do YYYY")} €
                                  </h4>
                                  {/* <span className="text-[#31373E] ms-1 text-[14px]">(-5%)</span> */}
                                </div>
                                <div className="flex justify-between mt-2">
                                  {/* <p className="text-[#31373E] w-[80%]">
                                    {dateFormate(itm?.updatedAt, "MMMM Do YYYY")}
                                  </p> */}
                                  {itm?.like ? (
                                    <BiSolidLike onClick={() => like(itm)} className="w-[24px] text-[#976DD0]  h-[24px] cursor-pointer" />
                                  ) : (
                                    <BiLike onClick={() => like(itm)} className="w-[24px]  h-[24px]  text-[#976DD0] cursor-pointer" />
                                  )}
                                </div>
                              </li>
                            )
                          }
                        })
                      ) : (
                        <div className="text-center col-span-12 my-8">
                          <img src="assets/img/no-data.svg" className="w-[400px] mx-auto " />
                          No Records Found
                        </div>
                      )}

                      {/* Roof repaired by roofing contractor */}
                      {/* <li li className="bg-white border border-[#D2D2D2] rounded-[5px]  max-w-[500px] w-[100%] my-5" >
                        <img src="assets/img/prop-two.jpg" className="h-[250px] w-full cover" />
                        <div className="p-2">
                          <p className="text-[#31373E] ">Improvement works - Aesthetic</p>
                          <h4 className="text-[#31373E] font-[700] text-[18px]">
                            Roof repaired by roofing contractor
                          </h4>

                          <p className="text-[#42C4B3]">
                            McKinsey and Son Roofing ltd
                          </p>
                          <h4 className="text-[#31373E] font-[700] text-[18px]">
                            18 000 €
                          </h4>
                          <p className="text-[#31373E] ">Invoice Bookaroo verified</p>
                          <div className="flex justify-between mt-2">
                            <p className="text-[#31373E] w-[80%]">
                              December 1st 2023
                            </p>
                            <img
                              src="assets/img/icons/heart.png"
                              alt="heart"
                              className="w-[24px]"
                            />
                          </div>
                        </div>
                      </li> */}
                      {/* Interior design refreshed */}
                      {/* <li className="bg-white border border-[#D2D2D2] rounded-[5px]  max-w-[500px] w-[100%] my-5">
                        <img src="assets/img/prop-two.jpg" className="h-[250px] w-full cover" />
                        <div className="p-2">
                          <p className="text-[#31373E] ">Improvement works - Aesthetic</p>
                          <h4 className="text-[#31373E] font-[700] text-[18px]">
                            Interior design refreshed
                          </h4>

                          <p className="text-[#42C4B3]">
                            Interior Design Studio
                          </p>
                          <h4 className="text-[#31373E] font-[700] text-[18px]">
                            18 000 €
                          </h4>
                          <p className="text-[#31373E] ">Invoice not verified</p>
                          <div className="flex justify-between mt-2">
                            <p className="text-[#31373E] w-[80%]">
                              July 1st 2023
                            </p>
                            <img
                              src="assets/img/icons/heart.png"
                              alt="heart"
                              className="w-[24px]"
                            />
                          </div>
                        </div>
                      </li> */}
                      {/* price changed */}
                      {/* <li className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                        <p className="text-[#31373E] ">Price change</p>
                        <div className="flex items-center">
                          <h4 className="text-[#31373E] font-[700] text-[18px]">
                            The property new price is 950 000 €
                          </h4>
                          <span className="text-[#31373E] ms-1 text-[14px]">(-5%)</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className="text-[#31373E] w-[80%]">
                            Jun 1st 2023
                          </p>
                          <img
                            src="assets/img/icons/heart.png"
                            alt="heart"
                            className="w-[24px]"
                          />
                        </div>
                      </li> */}
                      {/* status changed */}
                      {/* <li className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                        <p className="text-[#31373E] ">Status change</p>
                        <h4 className="text-[#31373E] font-[700] text-[18px]">
                          The property is now for sale
                        </h4>
                        <div className="flex items-center">
                          <p className="text-[#31373E] ">Price :</p>
                          <h4 className="text-[#31373E] font-[700] text-[18px]">
                            1 000 000 €
                          </h4>
                        </div>
                        <p className="text-[#31373E] ">
                          Real estate agency sale
                        </p>
                        <div className="flex items-center">
                          <div className="w-[30px] h-[30px] rounded-[50px]">
                            <img
                              src="assets/img/status-logo.png"
                              alt=""
                              className="w-[30px] h-[30px] rounded-[50px]  contain"
                            />
                          </div>
                          <p className="text-[#42C4B3]">
                            Barnes Internationals Realty
                          </p>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className="text-[#31373E] w-[80%]">
                            January 1st 2023
                          </p>
                          <img
                            src="assets/img/icons/heart.png"
                            alt="heart"
                            className="w-[24px]"
                          />
                        </div>
                      </li> */}
                      {/* owner changed */}
                      {/* <li className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                        <p className="text-[#31373E] ">Owner change</p>
                        <h4 className="text-[#31373E] font-[700] text-[18px]">
                          The property has been sold to a new onwer
                        </h4>
                        <div className="flex justify-between mt-2">
                          <p className="text-[#31373E] w-[80%]">
                            January 1st 2019
                          </p>
                          <img
                            src="assets/img/icons/heart.png"
                            alt="heart"
                            className="w-[24px]"
                          />
                        </div>
                      </li> */}
                      {/* Revenues update  */}
                      {/* <li className="bg-white border border-[#D2D2D2] rounded-[5px] p-2 max-w-[500px] w-[100%] my-5">
                        <p className="text-[#31373E] ">Revenues update</p>
                        <h4 className="text-[#31373E] font-[700] text-[18px]">
                          Revenues have been updated for 2018
                        </h4>
                        <h4 className="text-[#31373E] font-[700] text-[18px]">
                          18 000 €
                        </h4>
                        <div className="flex justify-between mt-2">
                          <p className="text-[#31373E] w-[80%]">
                            January 1st 2019
                          </p>
                          <img
                            src="assets/img/icons/heart.png"
                            alt="heart"
                            className="w-[24px]"
                          />
                        </div>
                      </li> */}
                      <div className={`paginationWrapper xl:flex-row flex-col ${total > filters?.count ? "" : "d-none"}`} >
                        <span className="xl:mb-0 mb-2 block">
                          Show {time?.length} from {total} Properties
                        </span>
                        <ReactPaginate
                          previousLabel="<Pre"
                          nextLabel="Next>"
                          breakLabel="..."
                          pageRangeDisplayed={2}
                          marginPagesDisplayed={1}
                          pageCount={Math.ceil(total / filters.count)}
                          onPageChange={handlePageChange}
                          forcePage={filters.page - 1}
                          containerClassName={"pagination flex"}
                          pageClassName={"pagination-item"}
                          activeClassName={"pagination-item-active"}
                        />
                      </div>
                    </ul>
                  </div>
                  <div className="xl:col-span-3 lg:col-span-4 col-span-12">
                    <div className="border border-[#D8D8D8] bg-[#f1edf600] rounded-[7px] mb-10 relative">
                      <img src={imagePath(data?.propertyDetail?.images[0]?.file)} alt="" className="h-[220px] w-full cover" />
                      <div className="p-3">
                        {data?.propertyDetail?.propertyTitle &&
                          <h2 className="text-[#47525E] text-[18px] font-bold capitalize mb-3">
                            {data?.propertyDetail?.propertyTitle}
                          </h2>}
                        <ul className="flex flex-wrap">
                          {+data?.propertyDetail?.surface > 0 &&
                            <li className="#47525E me-4 flex items-center ">
                              {data?.propertyDetail?.surface} m2
                              <span className="w-[8px] h-[8px] bg-[#ACABAA] block rounded-full  mt-1 ms-4"></span>
                            </li>}
                          {+data?.propertyDetail?.rooms > 0 &&
                            <li className="#47525E me-4 flex items-center">
                              {data?.propertyDetail?.rooms} room
                              {`${Number(data?.propertyDetail?.rooms) > 1 ? "s" : ""}`}
                            </li>}
                        </ul>
                        <ul className="flex flex-wrap mt-2 ">
                          {+data?.propertyDetail?.bedrooms > 0 &&
                            <li className="#47525E me-4 flex items-center">
                              {data?.propertyDetail?.bedrooms} bedroom
                              {`${Number(data?.propertyDetail?.bedrooms) > 1 ? "s" : ""}`}
                            </li>}
                          {+data?.propertyDetail?.propertyFloor > 0 &&
                            <li className="#47525E me-2">
                              {(+data?.propertyDetail?.propertyFloor > 0 && +data?.propertyDetail?.totalFloorBuilding > 0)
                                ? `${getOrdinal(+data?.propertyDetail?.propertyFloor)}/${data?.propertyDetail?.totalFloorBuilding}`
                                : `${getOrdinal(+data?.propertyDetail?.propertyFloor)}`} floor
                            </li>}
                        </ul>
                        {(data?.propertyDetail?.propertyType === "sale" || data?.propertyDetail?.propertyType === "rent") && (
                          <p className="bg-white text-[#47525E] inline-block px-6 py-1 rounded-[7px] absolute top-[10px] left-[10px] font-[600]">
                            {data?.propertyDetail?.propertyType === "sale"
                              ? `${formatCurrency(data?.propertyDetail?.price)} €`
                              : `${formatCurrency(data?.propertyDetail?.propertyMonthlyCharges)} €/month`}
                          </p>
                        )}

                      </div>
                    </div>
                    <ContactAgency
                      paramId={paramId}
                      setloginModal={setloginModal}
                    />
                  </div>
                </div>

                {/* Real estate news */}
                <BlogSection />

                {/* Links Real estate property profile */}
                <div className="grid grid-cols-12 py-20">
                  <div className="col-span-12  mb-[40px]">
                    <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
                      Real estate property profile
                      <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                    </h2>
                  </div>
                  <div className="col-span-12  ">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                        <h3 className="text-[#47525E] font-bold mb-4">
                          House for sale
                        </h3>

                        <ul>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Paris
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Lille
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Marseille
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Lyon
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Rennes
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Nancy
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Bordeaux
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Dieppe
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Toulouse
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              House for sale Annecy
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                        <h3 className="text-[#47525E] font-bold mb-4">
                          Flat for sale
                        </h3>

                        <ul>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale in Paris
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale in Lille
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale in Marseille
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale Lyon
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale Rennes
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale Nancy
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale Bordeaux
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale Dieppe
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale Toulouse
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for sale Annecy
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                        <h3 className="text-[#47525E] font-bold mb-4">
                          Discover price of historical transactions in your
                          interest area.
                        </h3>

                        <ul>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Paris
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Lille
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Marseille
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Lyon
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Rennes
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Nancy
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Bordeaux
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Dieppe
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Toulouse
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Properties sold in Annecy
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                        <h3 className="text-[#47525E] font-bold mb-4">
                          Flat for rent
                        </h3>

                        <ul>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Paris
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Lille
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Marseille
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Lyon
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Rennes
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Nancy
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Bordeaux
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Dieppe
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Toulouse
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="text-[#47525E] underline lg:text-[16px] text-[14px]"
                            >
                              Flat for rent in Annecy
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </PageLayout >
    </>
  );
};

export default PropertyTimeline;
