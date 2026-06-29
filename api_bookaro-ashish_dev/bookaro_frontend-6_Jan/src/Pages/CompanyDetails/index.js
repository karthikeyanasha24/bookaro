import { AccordionDetails, AccordionSummary } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { IoStar } from "react-icons/io5";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import {
  capLetter,
  dateFormate,
  imagePath,
  removeHTMLTags,
  removePropData,
} from "../../models/string.model";
import ContactAgency from "../PropertyDetails/ContactAgency";
import { FaArrowLeftLong } from "react-icons/fa6";
import UpgradePlan from "../../components/common/Modal/UpgradePlan";
import moment from "moment";

const CompanyDetails = () => {
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get("id");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loginModal, setloginModal] = useState(false);
  const [detail, setDetail] = useState();
  const activePlan = useSelector((state) => state.activePlan);
  const [propertyTotal, setpropertyTotal] = useState(0);
  const [ReviewData, setReviewData] = useState([]);
  const [propertyLoader, setpropertyLoader] = useState(false);
  const [planModal, setplanModal] = useState(false);

  const getDetails = () => {
    if (paramId) {
      loader(true);
      ApiClient.get("user/detail", {
        id: paramId,
      })
        ?.then((res) => {
          if (res.success) {
            setDetail(res?.data);
          } else navigate(-1);
        })
        .catch((err) => console.log("err", err))
        .finally(() => loader(false));
    }
  };
  useEffect(() => {
    getDetails();
  }, []);

  const hasProp =
    detail?.saleProperties > 0 ||
    detail?.rentProperties > 0 ||
    detail?.offmarketProperties > 0 ||
    detail?.directoryProperties;
  const [showFull, setShowFull] = useState(false);
  const truncatedContent =
    detail?.about && detail?.about.length > 800
      ? `${detail?.about.substring(0, 800)}...`
      : detail?.about;
  const refInfo = useRef(null);
  const refReview = useRef(null);
  const refProp = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [acrArr, setAcrArr] = useState([0]);

  const scrollFunction = (itm, i) => {
    setOpenIndex(i);
    if (i != null) {
      setAcrArr((prev) => {
        const update =
          Array.isArray(prev) && prev.includes(i) ? prev : [...prev, i];
        return update;
      });
    }
    setTimeout(() => {
      const offset = 130;
      const elementPosition = itm.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 500);
  };
  const handleAccordionChange = (i) => {
    setOpenIndex(openIndex === i ? -1 : i);
    if (i != null) {
      setAcrArr((prev) => {
        const update = prev.includes(i)
          ? prev.filter((item) => item !== i)
          : [...prev, i];
        return update;
      });
    }
  };
  const getAllProperty = () => {
    setpropertyLoader(true);
    ApiClient.get(
      `property/listing?page=1&count=1000&status=active&addedBy=${user?.id || user?._id
      }&maxDistance=&userLat=&userLng=&propertyType=&userId=${user?.id || user?._id
      }`
    ).then((res) => {
      if (res.success) {
        setpropertyTotal(res.total);
      }
      setpropertyLoader(false);
    });
  };

  const getReivew = () => {
    ApiClient.get(
      `agencyReviews/listing?agencyId=${user?.id || user?._id
      }`
    ).then((res) => {
      if (res.success) {
        setReviewData(res.data);
      }
    });
  }

  const getAverageRating = () => {
    const average =
      ReviewData.reduce((sum, item) => sum + Number(item.stars), 0) / ReviewData.length;
    const result = `${average?average.toFixed(1):0}/5`;
    return result
  }

  useEffect(() => {
    if (user.loggedIn) {
      getAllProperty();
      getReivew()
    } else {

    }
}, []);
  const handleProperty = () => {
    if (user.loggedIn) {
      if (propertyTotal >= activePlan?.[0]?.numberOfProperty) {
        setplanModal(true);
        return;
      }
      removePropData();
      return navigate("/property1");
    } else {
      setloginModal(true);
    }
  };

  return (
    <PageLayout>
      <UpgradePlan planModal={planModal} setplanModal={setplanModal} />
      <div className=" bg-white sticky  xl:top-[68px] top-[58px] w-full z-[7]">
        <div className=" items-center  mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-12 py-4 ">
            <div className="col-span-12 flex items-center justify-between md:flex-row flex-col">
              <ul className="flex items-center xl:justify-start justify-center ">
                <li>
                  <p
                    onClick={() => navigate(-1)}
                    className={`cursor-pointer text-[16px] pe-4 text-[#343F4B]`}
                  >
                    <FaArrowLeftLong />
                  </p>
                </li>
                <li onClick={() => scrollFunction(refInfo, null)}>
                  <p
                    className={`cursor-pointer text-[16px] pe-4
                      text-[#${openIndex === null ? "339B91] font-bold" : "343F4B]"
                      }`}
                  >
                    Info
                  </p>
                </li>

                <li onClick={() => navigate("/prolist")}
                >
                  <p
                    className={`cursor-pointer text-[16px] pe-4
                      text-[#${openIndex === 1 ? "339B91] font-bold" : "343F4B]"
                      }`}
                  >
                    Properties
                  </p>
                </li>
                <li onClick={() => scrollFunction(refReview, null)}>
                  <p
                    className={`cursor-pointer text-[16px] pe-4
                      text-[#${openIndex === 0 ? "339B91] font-bold" : "343F4B]"
                      }`}
                  >
                    Visit Review
                  </p>
                </li>
              </ul>
              {/* <ul className="flex items-center md:mt-0 mt-4">
                <li>
                  <button className="text-[14px] me-4  font-bold  text-[#787878] border-[1.5px] border-[#976DD0] text-center py-1 px-4 rounded-[20px]" >
                    Show phone number
                  </button>
                </li>
                <li>
                  <button className="text-[14px] pe-4  font-bold bg-[#976DD0] text-white border-[1.5px] border-[#976DD0] text-center py-1 px-4 rounded-[20px]" >
                    Direct message
                  </button>
                </li>
              </ul> */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#ebebeb4d]">
        <div className="container items-center mx-auto  px-6 lg:px-14 ">
          <div className=" py-8 pt-14">
            <div className="max-w-[700px] mx-auto bg-[#f0ecf5] py-4 px-10 flex md:items-center items-start justify-between rounded-[12px] md:flex-row flex-col">
              <div className="md:w-[70%] w-[100%]">
                <p className="text-[#47525E] text-[15px]">
                  A property to sell?
                </p>
                <h3 className="text-[#47525E] font-[600] text-[17px]">
                  List it and sell it on your own or with the support of our
                  local partner agencies
                </h3>
              </div>
              <button
                disabled={propertyLoader}
                onClick={() => handleProperty()}
                className="bg-[#976DD0] text-white text-[15px] rounded-[50px] py-2.5 px-6 font-bold md:mt-0 mt-3"
              >
                {propertyLoader ? "Loading..." : "List a property"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="pt-8 pb-[100px] bg-[#ebebeb4d] relative">
        <div className="container items-center  mx-auto px-6 lg:px-20 ">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%] w-[100%]">
            <div className="grid grid-cols-12 gap-10 ">
              <div className="lg:col-span-8 col-span-12">
                <div className="property_list">
                  <div className="relative mb-5">
                    <div
                      ref={refInfo}
                      className={`
                      ${detail?.coverImage
                          ? "md:h-[400px] h-[100%] object-cover w-full rounded-[8px]"
                          : " object-contain bg-white  md:h-[400px] h-[100%] rounded-[8px] border border-[#cdcdcd] border-dashed flex items-center justify-center"
                        }`}
                    >
                      <img
                        src={imagePath(
                          detail?.coverImage,
                          "assets/img/cover-c.svg"
                        )}
                        alt=""
                        className={`
                        ${detail?.coverImage
                            ? "md:h-[400px] h-[100%] object-cover w-full rounded-[8px]"
                            : " object-contain bg-white   rounded-[8px]  flex items-center justify-center"
                          }`}
                      />
                    </div>

                    <ul className="flex items-center absolute top-4 right-4 z-[7]">
                      <li className="bg-white rounded-[50px] cust-shadow me-2 cursor-pointer">
                        {user?._id === detail?._id && (
                          <img
                            onClick={() => navigate("/profile")}
                            alt=""
                            src="assets/img/edit_icon.svg"
                            className="w-[36px]  p-2"
                          />
                        )}
                      </li>
                    </ul>
                    <div className="flex mt-6 md:-mt-6 md:ms-5 ms-0">
                      <div className="me-5">
                        <img
                          src={imagePath(
                            detail?.companyLogo,
                            "assets/img/logo-c.svg"
                          )}
                          alt=""
                          className={`${detail?.companyLogo
                            ? "md:w-[120px] md:h-[120px] rounded-[10px] object-cover "
                            : "w-[80px] h-[80px] border border-[#cdcdcd] border-dashed bg-white flex items-center justify-center rounded-full"
                            } `}
                        />
                      </div>

                      <div className="md:mt-8 mt-0">
                        <span className="text-[#47525E] text-[11px]">
                          {`Real estate ${detail?.role}`}
                        </span>
                        <h2 className="text-[#47525E] font-[600] text-[17px]">
                          {/* FNAIM Agence Paris Lamarck */}
                          {detail?.companyName}
                        </h2>
                        <ul>
                          <li className="text-[#47525E] text-[14px]">
                            {/* 80 rue Lamarck, Paris 75018 */}
                            {`${detail?.city} ${detail?.pinCode}`}
                          </li>
                          <li className="text-[#47525E] text-[14px]">
                            {/* SIREN: 123456789 */}
                            {`${detail?.address}`}
                          </li>
                          <li className="text-[#47525E] text-[14px]">
                            {/* Depuis : 2012 */}
                            Since : {dateFormate(detail?.createdAt, "YYYY")}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Accordion
                    defaultExpanded
                    className="mb-5 border border-[#eaeaea] shadow-none"
                  >
                    <AccordionSummary
                      expandIcon={<MdOutlineKeyboardArrowDown />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      className="p-3"
                    >
                      <Typography>
                        <span className="py-0 text-[#976DD0] font-[600] text-[17px] p-4 w-full text-left flex items-center justify-between">
                          Agency information
                        </span>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className="text-gray-500 p-6 pt-0">
                      {hasProp > 0 && (
                        <div>
                          <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                            Key figures
                          </h4>
                          <div className="">
                            <ul className="flex  flex-wrap">
                              {detail?.saleProperties > 0 && (
                                <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                                  <div>
                                    <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                      {detail?.saleProperties}
                                    </h4>
                                    <p className="text-[#47525E]">
                                      Properties for sale
                                    </p>
                                  </div>
                                </li>
                              )}
                              {detail?.rentProperties > 0 && (
                                <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                                  <div>
                                    <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                      {detail?.rentProperties}
                                    </h4>
                                    <p className="text-[#47525E]">
                                      Properties for rent
                                    </p>
                                  </div>
                                </li>
                              )}
                              {detail?.offmarketProperties > 0 && (
                                <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                                  <div>
                                    <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                      {detail?.offmarketProperties}
                                    </h4>
                                    <p className="text-[#47525E]">
                                      Off-Market properties
                                    </p>
                                  </div>
                                </li>
                              )}
                              {detail?.directoryProperties > 0 && (
                                <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                                  <div>
                                    <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                      {detail?.directoryProperties}
                                    </h4>
                                    <p className="text-[#47525E]">
                                      Properties in Directory
                                    </p>
                                  </div>
                                </li>
                              )}
                              {/* <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                              <div>
                                <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                  0
                                </h4>
                                <p className="text-[#47525E]">Properties sold</p>
                              </div>
                            </li>
                            <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                              <div>
                                <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                  0/5
                                </h4>
                                <p className="text-[#47525E]">
                                  Overall clients ratings
                                </p>
                              </div>
                            </li>
                            <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                              <div>
                                <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                  0
                                </h4>
                                <p className="text-[#47525E]">
                                  Real estate agents
                                </p>
                              </div>
                            </li>
                            <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                              <div>
                                <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                  0
                                </h4>
                                <p className="text-[#47525E]">Buyers supported</p>
                              </div>
                            </li>
                            <li className="flex md:items-start items-center  lg:w-1/3 sm:w-1/2 w-full my-5">
                              <div>
                                <h4 className="text-[#59CEBB] text-center font-[600] text-[21px] leading-[24px]">
                                  0
                                </h4>
                                <p className="text-[#47525E]">
                                  Sellers cupported
                                </p>
                              </div>
                            </li> */}
                            </ul>
                          </div>
                        </div>
                      )}
                      {removeHTMLTags(detail?.about || "") && (
                        <div className="mt-7">
                          <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                            About {detail?.companyName}
                          </h4>
                          <div>
                            <h5 className="text-[#47525E] text-[18px] font-[600] my-4">
                              Here is the Agency Tagline
                            </h5>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: showFull
                                  ? detail?.about
                                  : truncatedContent,
                              }}
                              className="text-[#47525E] text-[14px] my-5"
                            ></p>
                            {detail?.about.length > 800 && (
                              <sapn
                                onClick={() => setShowFull(!showFull)}
                                className="text-[#976DD0] hover:underline cursor-pointer"
                              >
                                {showFull ? "See Less" : "See More"}
                              </sapn>
                            )}
                          </div>
                        </div>
                      )}
                      {detail?.servicesYouOffer?.length > 0 && (
                        <div className="mt-7">
                          <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                            {" "}
                            Services offered
                          </h4>
                          <ul className="flex flex-wrap mt-5">
                            {detail?.servicesYouOffer?.map((itm, i) => (
                              <li className="text-[#47525E] flex items-center md:w-1/2 w-full my-1">
                                <IoMdCheckmark className="me-2" />
                                {capLetter(itm?.name)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {detail?.openingHours?.length > 0 && (
                        <div className="mt-7">
                          <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                            {" "}
                            Opening hours
                          </h4>
                          <ul className="flex flex-wrap mt-5">
                            {detail?.openingHours?.map((item, i) => {
                              if (item?.isDayOff) return null;
                              return (
                                <li
                                  key={i}
                                  className="text-[#47525E] flex items-center w-full my-1"
                                >
                                  <IoMdCheckmark className="me-2" />
                                  {`${item.day} ${item.startTime && item.endTime
                                    ? `: ${item.startTime} - ${item.endTime}`
                                    : ``
                                    }`}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                      {detail?.team?.length > 0 && (
                        <div className="mt-7">
                          <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                            Team members
                          </h4>
                          <ul className="flex flex-wrap mt-7">
                            {detail?.team?.map((item, i) => (
                              <li className="flex items-start md:w-1/3 w-full mb-3 flex-col">
                                <div>
                                  <img
                                    src={imagePath(
                                      item?.image,
                                      "assets/img/man.jpg"
                                    )}
                                    alt=""
                                    className="w-[80px] h-[80px] rounded-full object-cover mx-auto"
                                  />
                                  <p className="text-[#47525E] text-[14px] text-center mt-2">
                                    {item?.name}
                                  </p>
                                  <h3 className="text-[#47525E] font-[600] text-center ">
                                    {item?.designation}
                                  </h3>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  <div className="my-12">
                    <div className="relative">
                      <img
                        src="assets/img/boost.jpg"
                        className="md:h-[350px] h-[100%] w-full rounded-tl-[12px] rounded-tr-[12px]"
                      />
                      <div className="absolute bree-serif-regular top-1/2 -translate-y-1/2 left-[30px] max-w-[500px] ">
                        <h2 className="text-white md:text-[30px] text-[20px] bree-serif-regular mb-5">
                          WANT US TO BOOST YOUR PROPERTY VALUE AND ONLINE
                          ATTRACTIVITY
                        </h2>
                        <button className="bg-[#976DD0] text-white px-7 py-2 font-[600] text-[20px]">
                          {" "}
                          Click here
                        </button>
                      </div>
                    </div>
                    <ul className="flex items-center bg-white border border-[#C3C3C3] border-t-0 rounded-bl-[10px] rounded-br-[10px] justify-center p-4">
                      <li className="text-[#976DD0] font-[600] text-base">
                        <Link>Quote my property</Link>
                      </li>
                      <li className="bg-[#E1E1E1] w-[16px] h-[16px] rounded-full md:mx-24  mx-6 shrink-0"></li>
                      <li className="text-[#976DD0] font-[600] text-base">
                        <Link>Help me sell</Link>
                      </li>
                    </ul>
                  </div>

                  <Accordion
                    ref={refReview}
                    expanded={acrArr?.includes(0)}
                    onChange={() => handleAccordionChange(0)}
                    className="mb-5 border border-[#eaeaea] shadow-none "
                  >
                    <AccordionSummary
                      expandIcon={<MdOutlineKeyboardArrowDown />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      className="p-3"
                    >
                      <Typography>
                        <p className="py-0 text-[#976DD0] font-[600] text-[17px] p-4 w-full text-left ">
                          Reviews
                          <span className="text-[#404347] block text-[14px] font-normal">
                            Source : {ReviewData[0]?.source}. Last update: {moment(ReviewData[0]?.createdAt).format("DD/MM/YY")}
                          </span>
                        </p>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className="text-gray-500 p-6">
                      <div>
                        <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2 flex justify-between items-center">
                          {" "}
                          Detailed reviews
                          <span className="flex items-center">
                            <IoStar className="me-[1px] text-[18px] text-[#5ACEBC]" />
                            <p className="text-[17px] text-[#5ACEBC] ms-1">
                              {getAverageRating()}
                            </p>
                          </span>
                        </h4>
                        <div className="">
                          <ul className="flex  flex-wrap">
                            {ReviewData?.map((item) => {
                              return <li className="flex items-start  mt-5 border-b border-[#DEDFDF]">
                                <div className="mb-5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center md:flex-row flex-col-reverse">
                                      <h4 className="text-[#47525E] capitalize text-center font-[600] text-[19px] leading-[24px]">
                                        {item?.reviewerName}
                                      </h4>
                                      <div className="flex md:ms-5 ms-0 mb-3 md:mb-0">
                                        {[...Array(item?.stars)].map((_, index) => (
                                          <span key={index}><IoStar className="me-[1px] text-[18px] text-[#5ACEBC]" /></span>
                                        ))}
                                        {/* <IoStar className="me-[1px] text-[18px] text-[#5ACEBC]" />
                                        <IoStar className="me-[1px] text-[18px] text-[#5ACEBC]" />
                                        <IoStar className="me-[1px] text-[18px] text-[#5ACEBC]" />
                                        <IoStar className="me-[1px] text-[18px] text-[#5ACEBC]" /> */}
                                      </div>
                                    </div>
                                    <p>{moment(item?.createdAt).format("DD/MM/YY")}</p>
                                  </div>

                                  <p className="text-[#404347] font-[400]  pt-2">
                                    {item?.comment}
                                  </p>
                                </div>
                              </li>
                            })}

                          </ul>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
              {/* {user?._id !== detail?._id && (
                <div className="lg:col-span-4 col-span-12  ">
                  <div className="sticky top-[150px]">
                    <ContactAgency
                      paramId={paramId}
                      claimProperty={true}
                      setloginModal={setloginModal}
                      detail={detail}
                      cName={detail?.companyName}
                      cId={detail?._id}
                    />
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CompanyDetails;
