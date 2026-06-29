import {
  Dialog,
  DialogTitle,
  Transition,
  TransitionChild,
  Button,
  DialogPanel,
} from "@headlessui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FiMail } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageSlider from "../../components/common/ImageSlider";
import BuyPlanModal from "../../components/common/Modal/BuyPlanModal";
import FlwModal from "../../components/common/Modal/FlwModal";
import LoginModal from "../../components/common/Modal/LoginModal";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import {
  formatCurrency,
  getOrdinal,
  removePropData,
} from "../../models/string.model";
import BlogSection from "../Blogs/BlogSection";
import ContactAgency from "./ContactAgency";
import ContactAgencyModal from "./ContactAgencyModal";
import DirectMsgModal from "./DirectMsgModal";
import PropAttractivity from "./PropAttractivity";
import PropDescription from "./PropDescription";
import PropExpenses from "./PropExpenses";
import PropGoodToKnow from "./PropGoodToKnow";
import PropMap from "./PropMap";
import PropRenovation from "./PropRenovation";
import PropRevenues from "./PropRevenues";
import ShowNumberModal from "./ShowNumberModal";
import { MdLocalOffer, MdNotificationAdd } from "react-icons/md";
import UpgradePlan from "../../components/common/Modal/UpgradePlan";
import School from "./Schools";
import { IoMdClose } from "react-icons/io";

const PropertyDetails = () => {
  // const { t } = useTranslation();
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get("id");
  const ScrollId = params.get("scroll");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loginModal, setloginModal] = useState(false);
  const [buyPlanModal, setbuyPlanModal] = useState(false);
  const [detail, setDetail] = useState();
  const [data, setData] = useState();
  const [amenities, setAmenities] = useState([]);
  const [dropdownOptions, setdropdownOptions] = useState([]);
  const [locations, setLocations] = useState([]);
  const refPictures = useRef(null);
  const refDescription = useRef(null);
  const refAttractivity = useRef(null);
  const refRevenues = useRef(null);
  const refExpenses = useRef(null);
  const refRenovation = useRef(null);
  const refMap = useRef(null);
  const refSchool = useRef(null);
  const refGoodToKnow = useRef(null);
  const [showNumber, setshowNumber] = useState(false);
  const [directMsg, setdirectMsg] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [acrArr, setAcrArr] = useState([0]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(1);
  const [contactModal, setContactModal] = useState(false);
  const [defaultMsg, setDefaultMsg] = useState("");
  const [kwh, setKwh] = useState(0);
  const [gtk, setGtk] = useState({});
  const [flwModal, setflwModal] = useState(false);
  const [flwItem, setflwItem] = useState(null);
  const activePlan = useSelector((state) => state.activePlan);
  const [propertyTotal, setpropertyTotal] = useState(0);
  const [propertyLoader, setpropertyLoader] = useState(false);
  const [planModal, setplanModal] = useState(false);
  const [errorDesc, seterrorDesc] = useState("");
  const [offerForm, setOfferForm] = useState({
    amount: "",
    description: "",
    // makeOfferMovinDate: "",
    // makeOfferValidDate:""
  });
  const getKwhValue = () => {
    ApiClient.get("user/emiision-detail")?.then((res) => {
      if (res.success) {
        const raw = res?.data;
        const n =
          typeof raw === "number"
            ? raw
            : raw && typeof raw === "object"
              ? raw.kwh
              : raw;
        const parsed = Number(n);
        setKwh(Number.isFinite(parsed) ? parsed : 0.2516);
      }
    });
  };
  // const [isNotified, setIsNotified] = useState(false);
  const [isOfferMade, setIsOfferMade] = useState(false);
  const handleNotifyInterest = () => {
    if (isNotified) return;
    notifyInterest("interest sent"); // Call your action
  };

  const openShareModal = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setShareEmail("");
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedPropertyId(null);
  };

  const handleShare = () => {
    if (!shareEmail || !selectedPropertyId) {
      toast.error("Please enter a valid email");
      return;
    }
    const payload = {
      email: shareEmail,
      propertyId: selectedPropertyId,
      userId: user?._id || user?.id,
    };
    loader(true);
    ApiClient.post("property/shareProperty", payload).then((res) => {
      if (res.success) {
        toast.success("Property shared successfully");
        getPropertyDetails()
        closeShareModal();

      } else {
        toast.error(res.message);
      }
      loader(false);
    });
  };

  const isNotified = useMemo(() => {
    return data?.isInterested ? true : false;
  }, [data]);

  const handleMakeOffer = () => {
    if (isNotified) {
      return;
    }
    if (!user.loggedIn) return setloginModal(true);
    openModal();
    return;
    notifyInterest("offer made"); // Call your action for making an offer
    setIsOfferMade(true); // Update state to reflect offer has been made
  };
  const getGtkData = (propertyType, searchLocation, zipcode) => {
    let dto = {
      propertyType,
      searchLocation,
      zipcode
    };
    ApiClient.get("savesearch/list", dto)?.then((res) => {
      if (res.success) {
        setGtk(res.data);
      }
    });
  };

  useEffect(() => {
    if (detail?.propertyType)
      getGtkData(detail?.propertyType, detail?.city || detail?.country, detail?.zipcode);
  }, [detail?.propertyType]);

  const getPropertyDetails = () => {
    if (paramId) {
      loader(true);
      let payload = {
        id: paramId,
        userId: user?._id,
      }
      if (user?._id !== detail?.addedBy) {
        payload = {
          ...payload,
          isVisit: true
        }
      }
      ApiClient.get("property/detail", payload)?.then((res) => {
        if (res.success) {
          setData(res?.data);
          let data = res?.data?.propertyDetail;
          setDetail(data);
          if (data?.location) {
            const isExact = data.exactLocation;
            setLocations([
              {
                lat: isExact
                  ? parseFloat(data?.location?.lat)
                  : parseFloat(
                    data?.randomLocation?.lat || data?.location?.lat
                  ),
                lng: isExact
                  ? parseFloat(data?.location?.lng)
                  : parseFloat(
                    data?.randomLocation?.lng || data?.location?.lng
                  ),
                info: data?.city || data?.propertyTitle,
                exactLocation: isExact,
                icon: isExact
                  ? "/assets/img/prop/placeholder.png"
                  : "/assets/img/banner-one.png",
              },
            ]);
          }
        } else navigate(-1);
        loader(false);
      });
    }
  };
  const getAdditionalOptions = () => {
    loader(true);
    ApiClient.get("revenue/listing").then((res) => {
      loader(false);
      if (res.success) {
        setdropdownOptions(res.data);
      }
    });
  };
  const getAmenityData = () => {
    ApiClient.get("amenity/listing").then((res) => {
      if (res.success) {
        setAmenities(
          res.data.map((itm) => {
            return {
              name: itm?.title,
              id: itm?.id || itm?._id,
              category: itm?.categoryId?.name,
              icon: itm?.image,
            };
          })
        );
      }
    });
  };
  const categorizeData = (amenities) => {
    return amenities.reduce((acc, amenity) => {
      const category = amenity.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
      return acc;
    }, {});
  };

  useEffect(() => {
    removePropData();
    getPropertyDetails();
    getAdditionalOptions();
    getAmenityData();
    getKwhValue();
    if (!ScrollId) {
      window.scrollTo(0, 0);
    }
  }, []);

  const editItem = () => {
    navigate(`/property/edit/${detail?.id || detail?._id}`);
  };
  const isLiked = () => {
    if (!user?.loggedIn) return setloginModal(true);
    let method = "put";
    let url = `favorites/edit`;
    let value = {
      user_id: user?._id,
      property_id: detail?._id,
      like: true,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getPropertyDetails();
      } else toast.error(res.message);
      loader(false);
    });
  };
  const isFollow = () => {
    if (!user?.loggedIn) return setloginModal(true);
    if (!data?.followunfollows_details) {
      setflwItem(data);
      return setflwModal(true);
    }
    const isliked = data?.followunfollows_details ? false : true;
    let method = "put";
    let url = `followUnfollow/update`;
    let value = {
      user_id: user?._id,
      property_id: detail?._id || detail?.id,
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

  const disLiked = () => {
    if (!user?.loggedIn) return setloginModal(true);
    let method = "put";
    let url = `favorites/edit`;
    let value = {
      user_id: user?._id,
      property_id: detail?._id,
      like: false,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getPropertyDetails();
      } else toast.error(res.message);
      loader(false);
    });
  };
  // useEffect(() => {
  //   if (!ScrollId) return;
  //   setTimeout(() => {
  //     switch (ScrollId) {
  //       case "Description":
  //         scrollFunction(refDescription, 0)
  //         break;
  //       case "Attractivity":
  //         scrollFunction(refAttractivity, 1)
  //         break;
  //       case "Revenues":
  //         scrollFunction(refRevenues, 2)
  //         break;
  //       case "Expenses":
  //         scrollFunction(refExpenses, 3)
  //         break;
  //       case "Renovation works":
  //         scrollFunction(refRenovation, 4)
  //         break;
  //       case "Schools":
  //         scrollFunction(refSchool, 5)
  //         break;
  //       case "Map":
  //         scrollFunction(refMap, 6)
  //         break;
  //       case "Good to know":
  //         scrollFunction(refGoodToKnow, 7)
  //         break;
  //       default:
  //         scrollFunction(refPictures, null)
  //     }
  //   }, 100); // small delay so refs mount
  // }, [ScrollId]);



  // const scrollFunction = (itm, i) => {
  //   setOpenIndex(i);
  //   if (i != null) {
  //     setAcrArr((prev) => {
  //       const update =
  //         Array.isArray(prev) && prev.includes(i) ? prev : [...prev, i];
  //       return update;
  //     });
  //   }
  //   setTimeout(() => {
  //     const offset = 130;
  //     const elementPosition = itm.current.getBoundingClientRect().top;
  //     const offsetPosition = elementPosition + window.pageYOffset - offset;
  //     window.scrollTo({
  //       top: offsetPosition,
  //       behavior: "smooth",
  //     });
  //   }, 500);
  // };

  useEffect(() => {
    if (!ScrollId || !detail) return; // Wait for detail to load

    const targetRefMap = {
      Pictures: refPictures,
      Description: refDescription,
      Attractivity: refAttractivity,
      Revenues: refRevenues,
      Expenses: refExpenses,
      "Renovation works": refRenovation,
      Schools: refSchool,
      Map: refMap,
      "Good to know": refGoodToKnow,
    };

    const targetRef = targetRefMap[ScrollId];
    const targetIndex = {
      Description: 0,
      Attractivity: 1,
      Revenues: 2,
      Expenses: 3,
      "Renovation works": 4,
      Schools: 5,
      Map: 6,
      "Good to know": 7,
    }[ScrollId] || null;

    if (!targetRef) {
      scrollFunction(refPictures, null); // fallback to pictures
      return;
    }
    // Poll until the ref is mounted (max 3 seconds)
    let attempts = 0;
    const maxAttempts = 30; // 30 * 200ms = 6s
    const interval = setInterval(() => {
      if (targetRef.current) {
        clearInterval(interval);
        scrollFunction(targetRef, targetIndex);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn(`Scroll target "${ScrollId}" ref not found after timeout`);
        scrollFunction(refPictures, null); // fallback
      }
      attempts++;
    }, 200);

    return () => clearInterval(interval);
  }, [ScrollId, detail]); // Re-run when detail loads


  const scrollFunction = (itm, i) => {
    if (!itm || !itm.current) {
      console.warn("Ref not mounted yet:", itm);
      return;
    }
    setOpenIndex(i);
    if (i != null) {
      setAcrArr(prev => prev.includes(i) ? prev : [...prev, i]);
    }

    setTimeout(() => {
      if (!itm.current) return;

      const offset = 130;
      const elementPosition = itm.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }, 300);
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
  const handleAskLoc = () => {
    if (!user?.loggedIn) return setloginModal(true);
    setdirectMsg(true);
    setDefaultMsg(
      "Hello, I'm interested in your property and I would like to know the exact location"
    );
  };

  const [isOpen1, setIsOpen1] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const notifyInterest = async (status) => {
    if (!user.loggedIn) return setloginModal(true);
    // if (status === "offer sent" && !offerForm.description) {
    //   seterrorDesc("Required");
    //   return;
    // }
    try {
      let payload = {
        buyerId: user?._id,
        propertyId: paramId,
        funnelStatus: status,
        makeOfferAmount: Number(offerForm.amount),
        makeOfferDescription: offerForm.description,
        // makeOfferMovinDate: offerForm?.makeOfferMovinDate,
      };
      if (status != "offer sent") {
        delete payload.makeOfferAmount;
        delete payload.makeOfferDescription;
        // delete payload.makeOfferMovinDate;

      }
      const res = await ApiClient.post("interests/add", payload);
      if (res.success) {
        toast.success(res?.message);
        setOpenOffer(false);
        setIsOpen1(false);
        setData((prev) => ({ ...prev, isInterested: true }));
      }
    } catch (err) {
      console.error("Error:", err);
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

  useEffect(() => {
    if (user.loggedIn) {
      getAllProperty();
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

  const [openOffer, setOpenOffer] = useState(false);

  function closeModal() {
    setOpenOffer(false);
  }
  function openModal() {
    setOpenOffer(true);
    setOfferForm({ amount: "", description: "" });
    seterrorDesc("");
  }

  const getDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
      <PageLayout>
        <>
          <Transition appear show={openOffer} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25 z-[99] " />
              </TransitionChild>
              <div className="fixed inset-0 overflow-y-auto flex z-[999] justify-center items-center">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    notifyInterest("offer sent");
                  }}
                >
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <DialogPanel className="w-full max-w-[350px] min-w-[340px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                        <div className="mt-2 mb-4">
                          <label className="text-[16px] font-[600] leading-6 text-gray-900 mb-1 block">
                            Amount(€) <span className="text-[#FF0000]">*</span>
                          </label>
                          <input
                            value={offerForm?.amount}
                            onChange={(e) =>
                              setOfferForm({
                                ...offerForm,
                                amount: e.target.value,
                              })
                            }
                            type="number"
                            required
                            className="block w-full h-10 px-3 py-2.5 pb-3 mb-3 border-gray-300 border-[1px] bg-white focus:border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                          />
                        </div>
                        {/* <div className="mt-2 mb-4">
                          <label className="text-md font-medium leading-6 text-gray-900 mb-1 block">
                            Movin Date
                          </label>
                          <input
                            value={offerForm?.makeOfferMovinDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) =>
                              setOfferForm({
                                ...offerForm,
                                makeOfferMovinDate: e.target.value,
                              })
                            }
                            type="date"
                            // required
                            className="block w-full h-11 px-3 py-2.5 mb-3 border-[2px] bg-white border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                          />
                        </div> */}

                        <div className="">
                          <label className="text-[16px] font-[600] leading-6 text-gray-900 mb-1 block">
                            Description
                          </label>
                          <textarea
                            className="bg-white rounded-[7px] border-gray-300 border-[1px] outline-none focus:border-[#976DD0] p-2 px-3  md:w-[500px] w-full mb-3 text-[#5A5A5A]"
                            placeholder="Description"
                            rows={4}
                            type="text"
                            value={offerForm.description}
                            onChange={(e) => {
                              setOfferForm({
                                ...offerForm,
                                description: e.target.value,
                              });
                              seterrorDesc("");
                            }}
                          ></textarea>
                          {/* {errorDesc ? (
                            <div className="star">{errorDesc}</div>
                          ) : (
                            ""
                          )} */}
                        </div>
                        <div className="">
                          <p className="text-md font-medium leading-6 text-gray-900 mb-1 block">
                            Disclaimer: This is not a bidding offer
                          </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            type="submit"
                            className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold "
                          >
                            Submit
                          </button>
                        </div>
                      </DialogPanel>
                    </TransitionChild>
                  </div>
                </form>
              </div>
            </Dialog>

          </Transition>
          <Transition appear show={isShareModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeShareModal}>
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
              </TransitionChild>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <button
                        className="outline-none text-[#000] absolute top-5 right-5"
                        onClick={closeShareModal}
                      >
                        <IoMdClose size={24} />
                      </button>
                      <div className="text-center"> <h4 className="text-[18px]">Share Property</h4>
                        <p className="text-gray-400 text-sm leading-tight">
                          Enter an email address to share this property
                        </p></div>
                      <div className="mt-3">
                        <input
                          type="email"
                          className="w-full border-[1px] border-gray-300 rounded-[4px] p-2 outline-none focus:border-[#976DD0]"
                          placeholder="Enter email address"
                          value={shareEmail}
                          onChange={(e) => setShareEmail(e.target.value)}
                        />
                      </div>
                      <div className="mt-6 text-center">
                        <button
                          className="inline-flex items-center gap-2 rounded-full bg-[#976DD0] hover:opacity-80 px-5 py-1.5 text-sm/6 font-semibold text-white"
                          onClick={handleShare}
                        >
                          Share
                        </button>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>

          </Transition>

          <UpgradePlan planModal={planModal} setplanModal={setplanModal} />
          <LoginModal
            loginModal={loginModal}
            propertyId={paramId}
            setloginModal={setloginModal}
          />
          <BuyPlanModal
            buyPlanModal={buyPlanModal}
            setbuyPlanModal={setbuyPlanModal}
          />
          <FlwModal
            flwModal={flwModal}
            setflwModal={setflwModal}
            flwItem={flwItem}
            refetch={getPropertyDetails}
            existData={false}
          />
          <ShowNumberModal
            showNumber={showNumber}
            setshowNumber={setshowNumber}
            detail={detail}
          />
          <DirectMsgModal
            directMsg={directMsg}
            setdirectMsg={setdirectMsg}
            detail={detail}
            defaultMsg={defaultMsg}
            setDefaultMsg={setDefaultMsg}
          />
          <ContactAgencyModal
            open={contactModal}
            setOpen={setContactModal}
            paramId={paramId}
            setloginModal={setloginModal}
          />

          <div className=" bg-white sticky  top-[59px] xl:top-[68px] w-full z-[7]">
            <div className=" items-center  mx-auto px-6 lg:px-10">
              <div className="grid grid-cols-12 py-4 ">
                <div className="col-span-12 flex items-center justify-between md:flex-row flex-col">
                  <ul className="flex items-center xl:justify-start justify-center ">
                    <li>
                      <p
                        onClick={() => scrollFunction(refPictures, null)}
                        className={`cursor-pointer text-[16px] pe-4
                          text-[#${openIndex === null ? "339B91] font-bold" : "343F4B]"
                          }`}
                      >
                        Pictures
                      </p>
                    </li>
                    <li>
                      <p
                        onClick={() => scrollFunction(refDescription, 0)}
                        className={`cursor-pointer text-[16px] pe-4
                          text-[#${openIndex === 0 ? "339B91] font-bold" : "343F4B]"
                          }`}
                      >
                        Description
                      </p>
                    </li>
                    {/* {detail?.rating?.length > 0 &&
                      detail?.revenue_detail?.length > 0 && ( */}
                    <li>
                      <p
                        onClick={() => {
                          if (detail?.rating?.length > 0 &&
                            detail?.revenue_detail?.length > 0)
                            scrollFunction(refAttractivity, 1)
                        }}
                        className={`text-[16px] pe-4
                              text-[#${openIndex === 1
                            ? "339B91] font-bold"
                            : "343F4B]"
                          } ${detail?.rating?.length > 0 &&
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
                            scrollFunction(refRevenues, 2)
                        }}
                        className={`cursor-pointer text-[16px] pe-4
                            text-[#${openIndex === 2 ? "339B91] font-bold" : "343F4B]"
                          } ${detail?.revenue_detail?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
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
                              scrollFunction(refExpenses, 3)
                          }}
                          className={`cursor-pointer text-[16px] pe-4
                            text-[#${openIndex === 3 ? "339B91] font-bold" : "343F4B]"
                            } ${detail?.Expenses?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
                        >
                          Expenses
                        </p>
                      </li>
                    )}
                    {detail?.renovation_work?.length > 0 && (
                      <li>
                        <p
                          // onClick={() => {
                          //   if (detail?.renovation_work?.length > 0)
                          //     scrollFunction(refRenovation, 4)
                          // }}
                          onClick={() => {
                            if (detail?.renovation_work?.length > 0)
                              setTimeout(() => {
                                scrollFunction(refRenovation, 4);
                              }, 100);
                          }}

                          className={`cursor-pointer text-[16px] pe-4
                            text-[#${openIndex === 4 ? "339B91] font-bold" : "343F4B]"
                            } ${detail?.renovation_work?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
                        >
                          Renovation works
                        </p>
                      </li>
                    )}
                    <li>
                      <p
                        onClick={() => {
                          if (detail?.linkedSchools?.length > 0)
                            scrollFunction(refSchool, 5)
                        }

                        }
                        className={`cursor-pointer text-[16px] pe-4
                          text-[#${openIndex === 5 ? "339B91] font-bold" : "343F4B]"
                          } ${detail?.linkedSchools?.length > 0 ? "cursor-pointer " : "text-gray-400 cursor-not-allowed pointer-events-none"}`}
                      >
                        Schools
                      </p>
                    </li>
                    <li>
                      <p
                        onClick={() => scrollFunction(refMap, 6)}
                        className={`cursor-pointer text-[16px] pe-4
                          text-[#${openIndex === 6 ? "339B91] font-bold" : "343F4B]"
                          }`}
                      >
                        Map
                      </p>
                    </li>
                    <li>
                      <p
                        onClick={() => scrollFunction(refGoodToKnow, 7)}
                        className={`cursor-pointer text-[16px] pe-4
                          text-[#${openIndex === 7 ? "339B91] font-bold" : "343F4B]"
                          }`}
                      >
                        Good to know
                      </p>
                    </li>
                  </ul>

                  <ul className="flex items-center md:mt-0 mt-4">
                    <li>
                      <Link
                        to={`/property-timeline?id=${paramId}`}
                        className="text-[16px] me-4 text-[#969FAA] font-bold flex items-center mb-0"
                      >
                        <span className="w-[8px] h-[8px] bg-[#ACABAA] block rounded-full me-3 "></span>
                        Timeline
                      </Link>
                    </li>
                    {/* {!detail?.sale_my_property && detail?.phoneNumber && ( */}
                    <li>
                      <button
                        onClick={() => setshowNumber(true)}
                        className="text-[14px] me-4  font-bold  text-[#787878] border-[1.5px] border-[#976DD0] text-center py-1 px-4 rounded-[20px]"
                      >
                        Show phone number
                      </button>
                    </li>
                    {/* )} */}
                    {user?._id !== detail?.addedBy && (
                      <li>
                        <button
                          onClick={() => {
                            if (user.loggedIn) {
                              setDefaultMsg("");
                              return setdirectMsg(true);
                            } else {
                              setloginModal(true);
                            }
                          }}
                          className="text-[14px] pe-4  font-bold bg-[#976DD0] text-white border-[1.5px] border-[#976DD0] text-center py-1 px-4 rounded-[20px]"
                        >
                          Direct message
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f9f9f9]">
            <div className="container items-center  mx-auto px-6 lg:px-14">
              <div className=" py-8 relative">
                <div className="max-w-[1200px] mx-auto flex lg:flex-row flex-col gap-5">
                  <div className="bg-[#f0ecf5] py-4 px-10 flex md:items-center items-start justify-between rounded-[12px] md:flex-row flex-col 2xl:w-[68%] xl:w-[65%] w-[100%]">
                    <div className="md:w-[70%] w-[100%]">
                      <p className="text-[#47525E] text-[15px]">
                        A property to sell?
                        {/* {t(`A property to sell`)}? */}
                      </p>
                      <h3 className="text-[#47525E] font-[600] text-[17px]">
                        List it and sell it on your own or with the support of
                        our local partner agencies
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
                  {user?._id !== detail?.addedBy &&
                    (detail?.propertyType === "rent" ||
                      detail?.propertyType === "sale") && (
                      <div className="rounded-[10px] bg-[#f0ecf5] 2xl:w-[32%] xl:w-[35%] w-[100%]">
                        <h3 className="font-semibold text-[16px] mt-4 text-center p-2 mb-3">
                          Manage Interest
                        </h3>
                        <div className="flex gap-2 xl:flex-row flex-col mb-4 px-3 justify-center items-center">
                          {/* Notify Interest Button */}
                          <div
                            onClick={handleNotifyInterest}
                            className={`${!isNotified ? "bg-[#976dd0]" : "bg-[#976dd09c]"
                              } px-4 py-2 rounded-[35px] cursor-pointer w-1/2 flex items-center justify-center`}
                          >
                            <MdNotificationAdd className="text-[#fff] me-2 text-[20px]" />
                            <h4 className="text-center text-[15px] text-white">
                              {isNotified
                                ? "Notified Interest"
                                : "Notify Interest"}
                            </h4>
                          </div>

                          {/* Make an Offer Button */}
                          <div
                            onClick={handleMakeOffer}
                            className={`${!isNotified ? "bg-[#976dd0]" : "bg-[#976dd09c]"
                              } px-4 py-2 rounded-[35px] cursor-pointer w-1/2  flex items-center justify-center`}
                          >
                            <MdLocalOffer className="text-[#fff] me-2 text-[20px]" />
                            <h4 className="text-center text-[15px] text-white">
                              {isNotified ? "Offer Made" : "Make an Offer"}
                            </h4>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                {/* {user?._id !== detail?.addedBy &&
                  (detail?.propertyType === "rent" ||
                    detail?.propertyType === "sale") && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#E7E7E7] rounded-[10px]">
                      <button
                        id="basic-button"
                        className="px-3 flex"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={() => setIsOpen1(true)}
                      >
                        <RxDotsHorizontal className="text-[40px] font-[600] text-black leading-[40px] h-[32px]" />
                      </button>
                      <Transition appear show={isOpen1} as={Fragment}>
                        <Dialog
                          open={isOpen1}
                          onClose={() => setIsOpen1(false)}
                          className="relative z-50"
                        >
                          <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 rounded-[10px]">
                              <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen1(false)}></div>

                              <DialogPanel className="w-[400px]  border bg-white p-5 relative z-50 rounded-[10px]">
                                <button
                                  onClick={() => setIsOpen1(false)}
                                  className="absolute top-2 right-3 text-gray-600 text-2xl"
                                >
                                  &times;
                                </button>

                                <h2 className="text-lg  font-semibold mb-6">Manage Your Interest</h2>

                                <div className="flex gap-4 mt-8 mb-6">
                                  <div onClick={() => notifyInterest("interest sent")} className="bg-[#efefef] px-3 rounded-[5px] cursor-pointer w-1/2 py-4">
                                    <img
                                      src="assets/img/notify-interest.svg"
                                      alt="notify interest"
                                      className="w-[50px] mx-auto mb-3"
                                    />
                                    <h4 className="text-center">Notify interest</h4>
                                  </div>
                                  <div onClick={() => notifyInterest(
                                    "interest sent"
                                    // "non binding price received"
                                    )} className="bg-[#efefef] px-3 py-4 rounded-[5px] cursor-pointer w-1/2">
                                    <img
                                      src="assets/img/make-offer.svg"
                                      alt="make an offer"
                                      className="w-[50px] mx-auto mb-3"
                                    />
                                    <h4 className="text-center">Make an offer</h4>
                                  </div>
                                </div>
                              </DialogPanel>
                            </div>
                          </TransitionChild>
                        </Dialog>
                      </Transition>
                    </div>
                  )} */}
              </div>
            </div>
            <div className="container items-center  mx-auto px-6 lg:px-20 ">
              <div className="grid grid-cols-12 gap-8 ">
                <div className="lg:col-span-8 col-span-12">
                  <div ref={refPictures} className="property_list">
                    <div className="relative">
                      <ImageSlider images={detail?.images} />
                      <ul className="flex items-center absolute top-4 right-4 z-[5]">
                        {user?._id !== detail?.addedBy && (
                          <li
                            onClick={() => isFollow()}
                            className="bg-white rounded-[50px] cust-shadow me-2 cursor-pointer"
                          >
                            <img
                              src={`assets/img/${data?.followunfollows_details
                                ? "fill-house"
                                : "lined-house"
                                }.svg`}
                              alt=""
                              className="w-[36px]  p-2 "
                            />
                          </li>
                        )}
                        <li
                          onClick={() =>
                            data?.favourite_details ? disLiked() : isLiked()
                          }
                          className="bg-white rounded-[50px] cust-shadow me-2 cursor-pointer"
                        >
                          <img
                            src={`assets/img/${data?.favourite_details
                              ? "fill-heart"
                              : "lined-heart"
                              }.svg`}
                            alt=""
                            className="w-[36px]  p-2"
                          />
                        </li>
                        <li
                          onClick={() =>
                            openShareModal(data?.propertyDetail?.id || data?.propertyDetail?._id)
                          }
                          className="bg-white rounded-[50px] cust-shadow me-2 cursor-pointer"
                        >
                          <img
                            src={`assets/img/${data?.shareCount
                              ? "fillshare"
                              : "emptyshare"
                              }.png`}
                            alt=""
                            className="w-[36px] "
                          />
                        </li>
                        {user?._id === detail?.addedBy && (
                          <li
                            onClick={() => editItem()}
                            className="bg-white rounded-[50px] cust-shadow cursor-pointer"
                          >
                            <img
                              alt=""
                              src="assets/img/edit_icon.svg"
                              className="w-[36px]  p-2"
                            />
                          </li>
                        )}
                      </ul>
                      <div className="flex items-center justify-center absolute bottom-2 z-[6] left-1/2 transform -translate-x-1/2">
                        <button
                          type="button"
                          onClick={() => setIsOpen(true)}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 flex items-center"
                        >
                          <img
                            alt=""
                            src="assets/img/camera-p.svg"
                            className="w-[15px] me-2"
                          />
                          {detail?.images?.length} Photo
                          {detail?.images?.length > 1 ? "s" : ""}
                        </button>
                      </div>
                      <Transition appear show={isOpen} as={Fragment}>
                        <Dialog
                          as="div"
                          className="relative z-10"
                          onClose={() => setIsOpen(false)}
                        >
                          <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <div className="fixed inset-0 bg-black/25" />
                          </TransitionChild>

                          <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                              <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                              >
                                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all">
                                  <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 p-3 px-4 bg-white"
                                  >
                                    <div className="flex items-center justify-between ">
                                      <p className="flex items-center text-[16px] font-[600] text-[#976DD0]">
                                        {" "}
                                        <img
                                          alt=""
                                          src="assets/img/camera-b.svg"
                                          className="w-[20px] me-2 text-[#976DD0]"
                                        />
                                        Photos
                                      </p>
                                      {user?._id !== detail?.addedBy && (
                                        <button
                                          onClick={() => {
                                            setIsOpen(false);
                                            setContactModal(true);
                                          }}
                                          className="bg-[#976DD0] text-white rounded-[50px] text-[14px] px-7 py-2 font-[600] flex items-center"
                                        >
                                          <FiMail className="me-2" />
                                          Contact the Agency
                                        </button>
                                      )}
                                      <p
                                        className="text-[22px] cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                      >
                                        <RxCross2 />{" "}
                                      </p>
                                    </div>
                                  </Dialog.Title>
                                  <div className="mt-2 p-6 property_list proper_modal bg-[#f8f8f8]">
                                    <ImageSlider
                                      images={detail?.images}
                                      setActiveImg={setActiveImg}
                                    />
                                    <p className="bg-[#48464a] text-white  p-1 px-4 rounded-[5px] w-fit mt-4 text-center mx-auto">
                                      <span>{activeImg}</span>
                                      <span className="mx-[1px]">/</span>
                                      <span> {detail?.images?.length}</span>
                                    </p>
                                  </div>
                                </Dialog.Panel>
                              </TransitionChild>
                            </div>
                          </div>
                        </Dialog>
                      </Transition>
                    </div>

                    <div className="my-5">
                      <div className="flex justify-between">
                        {detail?.propertyTitle && (
                          <h2 className="text-[#47525E] text-[20px] font-bold capitalize">
                            {detail?.propertyTitle}
                          </h2>
                        )}

                        {detail?.propertyType === "rent" ? (
                          <>
                            <p className="text-[#47525E] text-[20px] font-bold ">
                              {`${formatCurrency(
                                detail?.propertyMonthlyCharges
                              )} €/month`}
                            </p>
                          </>
                        ) : (
                          <>
                            {detail?.propertyType === "sale" && (
                              <>
                                <p className="text-[#47525E] text-[20px] font-bold ">
                                  {`${formatCurrency(detail?.price)} €`}
                                </p>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <ul className="flex items-center">
                        {detail?.type && (
                          <li className="text-[#47525E] font-[16px] me-5 capitalize">
                            {detail?.type}
                          </li>
                        )}
                        {detail?.surface && (
                          <li className="text-[#47525E] font-[16px] me-5 flex items-center">
                            <span className="w-[8px] h-[8px] bg-[#ACABAA] block rounded-full me-2 "></span>
                            {formatCurrency(detail?.surface)}{" "}
                            <span className="ms-1">
                              m<sup>2</sup>
                            </span>
                          </li>
                        )}
                        {detail?.rooms && (
                          <li className="capitalize text-[#47525E] font-[16px] me-5 flex items-center">
                            <span className="w-[8px] h-[8px] bg-[#ACABAA] block rounded-full me-2 "></span>
                            {detail?.rooms} room
                            {`${Number(detail?.rooms) > 1 ? "s" : ""}`}
                          </li>
                        )}
                        {detail?.bedrooms && (
                          <li className="capitalize text-[#47525E] font-[16px] me-5 flex items-center">
                            <span className="w-[8px] h-[8px] bg-[#ACABAA] block rounded-full me-2 "></span>
                            {detail?.bedrooms} bedroom
                            {`${Number(detail?.bedrooms) > 1 ? "s" : ""}`}
                          </li>
                        )}
                        {detail?.propertyFloor && (
                          <li className="capitalize text-[#47525E] font-[16px] me-5 flex items-center">
                            <span className="w-[8px] h-[8px] bg-[#ACABAA] block rounded-full me-2 "></span>
                            {+detail?.propertyFloor > 0 &&
                              +detail?.totalFloorBuilding > 0
                              ? `${getOrdinal(+detail?.propertyFloor)}/${detail?.totalFloorBuilding
                              }`
                              : `${getOrdinal(+detail?.propertyFloor)}`}{" "}
                            floor
                            {/* {`${Number(detail?.propertyFloor) > 1 ? "s" : ""}`} */}
                          </li>
                        )}
                      </ul>
                    </div>
                    <div
                      ref={refDescription}
                      className="bg-white  rounded-[12px] mb-5"
                    >
                      <PropDescription
                        detail={detail}
                        categorizeData={categorizeData}
                        amenities={amenities}
                        handleAccordionChange={handleAccordionChange}
                        acrArr={acrArr}
                        kwh={kwh}
                      />
                    </div>
                    {detail?.rating?.length > 0 &&
                      detail?.revenue_detail?.length > 0 && (
                        <div
                          ref={refAttractivity}
                          className="bg-white  rounded-[12px] mb-5"
                        >
                          <PropAttractivity
                            detail={detail}
                            data={data}
                            dropdownOptions={dropdownOptions}
                            handleAccordionChange={handleAccordionChange}
                            acrArr={acrArr}
                          />
                        </div>
                      )}
                    {detail?.revenue_detail?.length > 0 && (
                      <div
                        ref={refRevenues}
                        className="bg-white  rounded-[12px] mb-5"
                      >
                        <PropRevenues
                          detail={detail}
                          dropdownOptions={dropdownOptions}
                          handleAccordionChange={handleAccordionChange}
                          acrArr={acrArr}
                        />
                      </div>
                    )}
                    {detail?.Expenses?.length > 0 && (
                      <div
                        ref={refExpenses}
                        className="bg-white  rounded-[12px] mb-5"
                      >
                        <PropExpenses
                          detail={detail}
                          dropdownOptions={dropdownOptions}
                          openIndex={openIndex}
                          handleAccordionChange={handleAccordionChange}
                          acrArr={acrArr}
                        />
                      </div>
                    )}
                    {detail?.renovation_work?.length > 0 && (
                      <div
                        ref={refRenovation}
                        className="bg-white  rounded-[12px] mb-5"
                      >
                        <PropRenovation
                          detail={detail}
                          dropdownOptions={dropdownOptions}
                          handleAccordionChange={handleAccordionChange}
                          acrArr={acrArr}
                        />
                      </div>
                    )}
                    {detail && detail?.linkedSchools?.length > 0 && (
                      <div
                        ref={refSchool}
                        className="bg-white  rounded-[12px] mb-5"
                      >
                        <School
                          detail={detail}
                          gtk={gtk}
                          handleAccordionChange={handleAccordionChange}
                          acrArr={acrArr}
                        />
                      </div>
                    )}

                    <div ref={refMap} className="bg-white  rounded-[12px] mb-5">
                      <PropMap
                        locations={locations}
                        detail={detail}
                        handleAskLoc={handleAskLoc}
                        openIndex={openIndex}
                        handleAccordionChange={handleAccordionChange}
                        acrArr={acrArr}
                      />
                    </div>
                    {/* {detail && detail?.linkedSchools?.length > 0 && ( */}
                    <div
                      ref={refGoodToKnow}
                      className="bg-white  rounded-[12px] mb-5"
                    >
                      <PropGoodToKnow
                        detail={detail}
                        gtk={gtk}
                        handleAccordionChange={handleAccordionChange}
                        acrArr={acrArr}
                      />
                    </div>
                    {/* )} */}

                    {detail?.importBy !== "platform" && (
                      <div>
                        <a className="underline text-[#47525E] text-[16px] ">
                          View property original listing
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                {(detail?.role =="agency" || detail?.role =="agent" || detail?.role =="hunter")  && (           
                  <div className="lg:col-span-4 col-span-12">
                    <div className="sticky top-[150px]">
                      <h4
                        onClick={() =>
                          navigate(`/company-details?id=${data?.ownerId}`)
                        }
                        className="cursor-pointer font-[600] text-[15px] mb-4 bg-white text-[#976DD0] border border-dashed border-[#cdcdcd] p-4 rounded-[8px]"
                      >
                        {data?.companyName}
                      </h4>
                      <ContactAgency
                        paramId={paramId}
                        claimProperty={false}
                        setloginModal={setloginModal}
                        detail={detail}
                        setshowNumber={setshowNumber}
                        cName={data?.companyName}
                        cId={data?.ownerId}
                      />
                    </div>
                  </div>
                )}
                  {/* {user?._id !== detail?.addedBy && data?.role === "agency" && ( */}
                {(data?.role === "admin" || data?.role === "staff") && detail?.importBy == "platform"  && (           
                  <div className="lg:col-span-4 col-span-12">
                    <div className="sticky top-[150px]">
                      <h4
                        onClick={() =>
                          navigate(`/company-details?id=${data?.ownerId}`)
                        }
                        className="cursor-pointer font-[600] text-[15px] mb-4 bg-white text-[#976DD0] border border-dashed border-[#cdcdcd] p-4 rounded-[8px]"
                      >
                        {data?.companyName}
                      </h4>
                      <ContactAgency
                        paramId={paramId}
                        claimProperty={true}
                        setloginModal={setloginModal}
                        detail={detail}
                        setshowNumber={setshowNumber}
                        cName={data?.companyName}
                        cId={data?.ownerId}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Real estate news */}
              <BlogSection />

              {/* Real estate property profile */}
              <div className="grid grid-cols-12 py-20">
                <div className="col-span-12  mb-[40px]">
                  <h2 className="capitalize text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
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
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Paris
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Lille
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Marseille
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Lyon
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Rennes
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Nancy
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Bordeaux
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Dieppe
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            House for sale Toulouse
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
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
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale in Paris
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale in Lille
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale in Marseille
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale Lyon
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale Rennes
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale Nancy
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale Bordeaux
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale Dieppe
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for sale Toulouse
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
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
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Paris
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Lille
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Marseille
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Lyon
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Rennes
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Nancy
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Bordeaux
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Dieppe
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Properties sold in Toulouse
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
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
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Paris
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Lille
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Marseille
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Lyon
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Rennes
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Nancy
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Bordeaux
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Dieppe
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
                            Flat for rent in Toulouse
                          </a>
                        </li>
                        <li>
                          <a className="text-[#47525E] underline lg:text-[16px] text-[14px]">
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
        </>
      </PageLayout>
    </>
  );
};

export default PropertyDetails;
