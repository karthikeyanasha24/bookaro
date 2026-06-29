import {
  capLetter,
  dateFormate,
  downloadFile,
  formatCurrency,
  imagePath,
} from "../../models/string.model";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { RxDotsHorizontal } from "react-icons/rx";
import pipeModel from "../../models/pipeModel";
import { MdCancel } from "react-icons/md";
import MsgHistory from "./MsgHistory";
import FunnelIcons from "./FunnelIcons";
import {
  buyerCurrentStatus,
  buyerNextStatus,
  preSignDuration,
} from "../../utils/shared.utils";
import { useMemo, useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import moment, { duration } from "moment";
import { toast } from "react-toastify";
import {
  IoIosCheckmarkCircleOutline,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { FaArrowRight, FaLock, FaRegCirclePlay } from "react-icons/fa6";
import ReactStars from "react-rating-stars-component";
import { GoCheckCircleFill } from "react-icons/go";
import { BiSolidOffer } from "react-icons/bi";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import methodModel from "../../methods/methods";
import SlotModal from "./SlotModal";
import AnsSlotModal from "./AnsSlotModal";
import socket from "../../config/ChatSocket/socket";
import Swal from "sweetalert2";
import datepipeModel from "../../models/datepipemodel";
import { useSelector } from "react-redux";
import SellerfileModal from "./SellerfileModal";
import UploadID from "../../components/common/Modal/UploadID";
import DirectMsgModal from "../PropertyDetails/DirectMsgModal";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import TrainingVideoCard from "../RealEstateTransactionSearcher/TrainingVideoCard";
import { useNavigate } from "react-router-dom";

export default function BuyerCard({
  selectedProperty,
  propertyId,
  offerStatus,
  setOfferStatus = (_) => { },
  card,
  i,
  visitSlots,
  setIsSlot = () => { },
  blurCardPlan = false,
  result = (_) => { },
  totalCard,
}) {
  const history = useNavigate();
  const [idProofOpen, setidProofOpen] = useState(false);
  const [isOpenMsg, setIsOpenMsg] = useState(false);
  const activePlan = useSelector((state) => state.activePlan);
  const user = useSelector((state) => state.user);
  const signingSlots = useMemo(() => {
    const today = datepipeModel.datetostring(new Date().toISOString()); // Get today's date in YYYY-MM-DD format
    const upcomingSlots = selectedProperty?.signingSlots?.filter(
      (slot) => slot.date >= today
    );
    return upcomingSlots;
  }, [selectedProperty]);

  function closeModal() {
    setIsOpenMsg(false);
  }
  function openModal() {
    setIsOpenMsg(true);
  }

  console.log(activePlan,"activePlanactivePlan")

  const getVideoId = (url) => {
    try {
      const parsed = new URL(url);

      // Handle youtu.be links (e.g., https://youtu.be/VIDEO_ID)
      if (parsed.hostname === "youtu.be") {
        return parsed.pathname.slice(1);
      }

      // Handle full YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
      if (parsed.hostname.includes("youtube.com")) {
        // Priority: get v param from URL
        const v = parsed.searchParams.get("v");
        if (v) return v;

        // If v is missing, try pathname parsing for embed or /v/VIDEO_ID
        const pathParts = parsed.pathname.split("/");
        const idFromPath = pathParts.find((part) =>
          /^[a-zA-Z0-9_-]{11}$/.test(part)
        );
        if (idFromPath) return idFromPath;
      }

      return null;
    } catch {
      return null;
    }
  };

  const videoId = getVideoId(card?.funnel?.youtubeUrl);
  const [isOpencancel, setIsOpencancel] = useState(false);
  const [isOpenBook, setIsOpenBook] = useState(false);
  const [bookSlot, setBookSlot] = useState(null);
  const [offer, setOffer] = useState("");
  const [preSlot, setPreSlot] = useState(null);
  const [saleSlot, setSaleSlot] = useState(null);

  const [openTransfer, setOpenTransfer] = useState(false);
  const [transfer, setTransfer] = useState();

  const openDialogBook = (card) => {
    setIsOpenBook(true);
    if (card?.userVisitDate) setBookSlot(card?.userVisitDate);
    if (card?.buyerPrice) setOffer(card?.buyerPrice?.amount);
    if (card?.userPresale) setPreSlot(card?.userPresale);
    if (card?.userSale) setSaleSlot(card?.userSale);
  };
  const handleChange = (card, status, key, value) => {
    const filter = {
      interestId: card?._id,
      interestUpdatedTime: new Date(),
    };
    if (status) filter.funnelStatus = status;

    // const price = Number(card.buyerPrice.amount);
    // console.log(typeof price);
    // if(price) filter.refusedPrice = price;

    if (status == "visit accept by owner") {
      filter.ownerVisitDate = card.userVisitDate;
      filter.finalVisitDate = card.userVisitDate;
    } else if (status == "offer accept by owner") {
      filter.ownerPrice = card?.buyerPrice?.amount;
      filter.finalPrice = Number(card?.buyerPrice?.amount);
      filter.offerStatus = true;
    } else if (status == "offer submit by owner") {
      filter.ownerPrice = offer;
    } else if (status == "preslot booked by owner") {
      const formattedDate = moment(preSlot, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      filter.ownerPresale = formattedDate;
    } else if (status == "preslot accept by owner") {
      filter.finalPresale = card.userPresale;
    } else if (status == "contract signed by owner") {
      filter.ownerSigned = true;
      filter.userSigned = true;
    } else if (status == "saleslot booked by owner") {
      const formattedDate = moment(saleSlot, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      // filter.ownerSale = formattedDate;
    } else if (status == "confirmation by owner") {
      filter.ownerConfirmation = true;
      filter.icon7 = true;
    }

    if (key === "ownerVisitDate") {
      const formattedDate = moment(value, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      filter[key] = formattedDate;
    }
    if (key === "documents") {
      filter[key] = value;
    }

    if (key && key?.startsWith("icon")) {
      filter[key] = true;
    }
    loader(true);
    ApiClient.put("interests/statusChange", filter).then((res) => {
      if (res.success) {
        result({ event: "submitted" });
        setOpenAnsSlotModal(false);
        setIsOpenBook(false);
        setIsOpencancel(false);
        if (filter.offerStatus) setOfferStatus(true);
        if (
          filter.funnelStatus == "offer accept by owner" ||
          filter.funnelStatus == "offer refused by owner"
        ) {
          socket.emit("informUsers", {
            funnelStatus: filter.funnelStatus,
            interestId: filter.interestId,
          });
          ApiClient.post("interests/informUsers", {
            funnelStatus: filter.funnelStatus,
            interestId: filter.interestId,
            message: currentStatus(filter.funnelStatus, card),
          }).then((res) => { });
        }
      }
      loader(false);
    });
  };
  const [directMsg, setdirectMsg] = useState(false);
  const [detail, setDetail] = useState();
  const [defaultMsg, setDefaultMsg] = useState("");
  const handleChat = (data) => {
    setDetail(data);
    setDefaultMsg("");
    setdirectMsg(true);
  };

  const transferFunc = (card) => {
    Swal.fire({
      title: "Are you sure? This is a one-way action and cannot be reversed.",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        transferProp(card);
      } else if (result.isDenied) {
      }
    });
  };

  const transferProp = async (card) => {
    try {
      if (
        !(card.buyerId?._id || card.buyerId?.id) ||
        !(card?.propertyId?.id || card?.propertyId?._id)
      ) {
        throw new Error("Missing required property or buyer ID");
      }
      let dto = {
        interestId: card?._id,
        propertyId: card?.propertyId?.id || card?.propertyId?._id,
        newOwner: card.buyerId?._id || card.buyerId?.id,
      };
      loader(true);
      const res = await ApiClient.put("interests/propertyTransfer", dto);
      if (res.success) {
        setOpenTransfer(true);
        setTransfer(res?.data);
        toast.success(res?.message);

        //   setSelectedProperty(null);
        //   setCards([]);
        //   getData();
        result({ event: "transfered" });
      } else {
        throw new Error("Property transfer failed");
      }
    } catch (error) {
      console.error("Error in transferProp:", error.message);
    } finally {
      loader(false);
    }
  };

  const currentStatus = (status, card) => {
    return buyerCurrentStatus(status, card);
  };
  const nextStatus = (status, card) => {
    return buyerNextStatus(status, card);
  };

  const [activeTab, setActiveTab] = useState("accept");
  const [openAnsSlotModal, setOpenAnsSlotModal] = useState(false);
  function openAnsSlotFunc(card) {
    if (!card) return;
    setOpenAnsSlotModal(true);
    if (card?.userVisitDate) setBookSlot(card?.userVisitDate);
    if (card?.buyerPrice) setOffer(card?.buyerPrice);
    if (card?.userPresale) setPreSlot(card?.userPresale);
    if (card?.userSale) setSaleSlot(card?.userSale);
  }
  function closeAnsSlotFunc() {
    setOpenAnsSlotModal(false);
    setActiveTab("accept");
  }
  const actionAnsAcceptSlotFunc = (card) => {
    handleChange(card, "visit accept by owner");
  };
  const actionAnsSlotFunc = (card) => {
    if (!bookSlot) return toast.error("Select a date");
    if (
      dateFormate(new Date(bookSlot)) ==
      dateFormate(new Date(card?.userVisitDate))
    )
      return toast.error("Both dates are same");
    handleChange(card, "slot booked by owner", "ownerVisitDate", bookSlot);
  };

  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [viewOfferModal, setViewOfferModal] = useState(false);

  function openOfferFunc(card) {
    if (!card) return;
    setOpenOfferModal(true);
    if (card?.buyerPrice) setOffer(card?.buyerPrice?.amount);
  }
  function closeOfferFunc() {
    setActiveTab("accept");
    setOpenOfferModal(false);
  }

  function openViewOfferFunc(card) {
    if (!card) return;
    setViewOfferModal(true);
    if (card?.buyerPrice) setOffer(card?.buyerPrice?.amount);
  }
  function closeViewOfferFunc() {
    setViewOfferModal(false);
  }

  const [openPreSaleModal, setOpenPreSaleModal] = useState(false);

  function openSlotFunc(card, final = false) {
    if (!signingSlots?.length) {
      return toast.error("Please add Signing slots");
    }

    if (final) {
      handleChange(card, "saleslot booked by owner");
    } else {
      handleChange(card, "preslot opened by owner", "icon5");
    }
  }
  function closePreSaleFunc() {
    setOpenPreSaleModal(false);
  }
  const actionPreSaleFunc = (card) => {
    if (!preSlot) return toast.error("Select a date");
    if (
      dateFormate(new Date(preSlot)) ==
      dateFormate(new Date(card?.ownerPresale))
    )
      return toast.error("Both dates are same");
    handleChange(card, "preslot booked by owner", "icon5");
  };

  const actionAnsAcceptPreSlotFunc = (card) => {
    handleChange(card, "preslot accept by owner");
  };
  const actionAnsPreSlotFunc = (card) => {
    if (!preSlot) return toast.error("Select a date");
    if (
      dateFormate(new Date(preSlot)) ==
      dateFormate(new Date(card?.ownerPresale))
    )
      return toast.error("Both dates are same");
    handleChange(card, "preslot booked by owner", "icon5");
  };

  const [reqModal, setReqModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState();

  const [offerModal, setOfferModal] = useState(false);
  const [offerData, setOfferData] = useState();
  const blurCard = false;

  const sendDocument = (card) => {
    setdocumentModal({
      sellerFiles: card.propertyId?.sellerFiles || [],
      propertyId: card.propertyId?._id,
    });
  };

  const [documentModal, setdocumentModal] = useState();

  const Actions = (
    <>
      {card?.funnelStatus != "cancelled" && (
        <>
          {(card?.funnelStatus == "interest sent" ||
            card?.funnelStatus == "offer sent") && (
              <button
                className={`${card?.funnelStatus == "interest sent" ||
                  card?.funnelStatus == "offer sent"
                  ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                  : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                  }`}
                onClick={() => {
                  if (blurCard || blurCardPlan) return;
                  // if (!selectedProperty?.sellerFiles?.identityProof?.length)
                  //   return setidProofOpen(true);
                  if (!visitSlots?.length)
                    return toast.error("Please open a visit slot first");
                  handleChange(card, "invite user for a visit");
                }}
              >
                Invite to Visit
              </button>
            )}
          {card?.funnelStatus == "invite user for a visit" && (
            <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
              Invited
            </p>
          )}

          {(card?.funnelStatus == "slot booked by owner" ||
            card?.funnelStatus == "preslot booked by owner") && (
              <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
                Booked
              </p>
            )}
          {card?.funnelStatus == "preslot opened by owner" && (
            <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
              Slot Opened
            </p>
          )}
          {card?.funnelStatus == "visit accept by user" && (
            <button
              className={`${card?.funnelStatus == "visit accept by user"
                ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                }`}
              onClick={() => {
                if (!blurCard || !blurCardPlan)
                  handleChange(card, "visit hosted", "icon2");
              }}
            >
              Hosted
            </button>
          )}
          {(card?.funnelStatus == "visit hosted" ||
            card?.funnelStatus == "buyer requested for document") && (
              <button
                className={`${card?.funnelStatus == "visit hosted" ||
                  card?.funnelStatus == "buyer requested for document"
                  ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                  : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                  }`}
                onClick={() => {
                  if (!blurCard) sendDocument(card);
                }}
              >
                Send Documents
              </button>
            )}
          {card?.funnelStatus == "offer submit by user" && (
            <>
              <button
                className={`${card?.funnelStatus == "offer submit by user"
                  ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                  : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                  }`}
                onClick={() => {
                  if (!blurCard || !blurCardPlan) openOfferFunc(card);
                }}
              >
                Answer offer
              </button>
              <Dialog
                open={openOfferModal}
                onClose={closeOfferFunc}
                className="relative z-[9999]"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <DialogPanel className="max-w-md w-full bg-white rounded-[20px] shadow-lg">
                    <DialogTitle className="">
                      <div className="react-custom">
                        <h3 className="text-center text-[#47525E] text-xl font-semibold px-4 mt-4">
                          Manage Your Offer
                        </h3>
                        <div className="flex  border-b border-gray-200 p-3 pb-0">
                          <button
                            onClick={() => setActiveTab("accept")}
                            className={`flex-1 py-3 text-center text-[14px] font-medium ${activeTab === "accept"
                              ? "border-b-4 border-[#976DD0] text-[#976DD0] bg-[#e6f9f4] transition-all duration-200"
                              : "text-[#47525E] hover:bg-[#f0f0f0] transition-all duration-200"
                               } flex justify-center items-center space-x-2`}
                          >
                            <GoCheckCircleFill className="text-[#976DD0] text-lg" />
                            <span>Accept the offer</span>
                          </button>
                          <button
                            onClick={() => setActiveTab("refuse")}
                            className={`flex-1 py-3 mx-3 text-center text-[14px] font-medium ${activeTab === "refuse"
                              ? "border-b-4 border-[#976DD0] text-[#976DD0] bg-[#e6f9f4] transition-all duration-200"
                              : "text-[#47525E] hover:bg-[#f0f0f0] transition-all duration-200"
                              } flex justify-center items-center space-x-2`}
                          >
                            <MdCancel className="text-[#976DD0] text-lg" />

                            <span>Refuse</span>
                          </button>
                          <button
                            onClick={() => setActiveTab("counter")}
                            className={`flex-1 py-3 text-center text-[14px] font-medium ${activeTab === "counter"
                              ? "border-b-4 border-[#976DD0] text-[#976DD0] bg-[#e6f9f4] transition-all duration-200"
                              : "text-[#47525E] hover:bg-[#f0f0f0] transition-all duration-200"
                              } flex justify-center items-center space-x-2`}
                          >
                            <BiSolidOffer className="text-[#976DD0] text-lg" />

                            <span>Counter offer</span>
                          </button>
                        </div>

                        {activeTab === "accept" && (
                          <div className="pt-6 pb-6 h-[300px] overflow-auto px-3 ">
                            {/* Offer Amount */}
                            <div className="flex items-center justify-between mt-5 px-4">
                              <span className="text-[#47525E] font-[600]">
                                Offer amount:
                              </span>
                              <span className="text-[#47525E] font-[500]">
                                {` ${formatCurrency(
                                  card?.buyerPrice?.amount
                                )} €`}
                              </span>
                            </div>

                            {/* Validity Date */}
                            <div className="flex items-center justify-between mt-3 px-4">
                              <span className="text-[#47525E] font-[600]">
                                Validity date:
                              </span>
                              <span className="text-[#47525E] font-[500]">
                                {` ${dateFormate(
                                  card?.buyerPrice?.validity_date
                                )}`}
                              </span>
                            </div>

                            {/* Move-In Date */}
                            <div className="flex items-center justify-between mt-3 px-4">
                              <span className="text-[#47525E] font-[600]">
                                Move In date:
                              </span>
                              <span className="text-[#47525E] font-[500]">
                                {` ${dateFormate(card?.buyerPrice?.move_in)}`}
                              </span>
                            </div>
                            {/* Suspensive Conditions (Count) */}
                            <div className="flex items-center justify-between mt-3 px-4">
                              <span className="block text-[#47525E] font-[600] mb-2">
                                Suspensive condition count:
                              </span>
                              <span className="text-[#47525E] font-[500]">
                                {card?.buyerPrice?.conditions?.length || 0}
                              </span>
                            </div>
                            {/* Funding Types (Listed View) */}
                            <div className="px-4 mt-3 ">
                              <span className="block text-[#47525E] font-[600] mb-2">
                                Funding types:
                              </span>
                              {card?.buyerPrice?.fundingType?.length > 0 ? (
                                <ul className="space-y-2 ">
                                  {card?.buyerPrice?.fundingType?.map(
                                    (funding, index) => (
                                      <li
                                        key={index}
                                        className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center"
                                      >
                                        <FaRegArrowAltCircleRight className="me-2" />

                                        {funding}
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <span className="text-[#47525E] font-[500]">
                                  No funding types available.
                                </span>
                              )}
                            </div>
                            <div className="px-4 mt-3 ">
                              <span className="block text-[#47525E] font-[600] mb-2">
                                Suspensive condition:
                              </span>
                              {card?.buyerPrice?.conditions?.length > 0 ? (
                                <ul className="space-y-2 ">
                                  {card?.buyerPrice?.conditions?.map(
                                    (condition, index) => (
                                      <li
                                        key={index}
                                        className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center"
                                      >
                                        <FaRegArrowAltCircleRight className="me-2" />

                                        {condition}
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <span className="text-[#47525E] font-[500]">
                                  No funding types available.
                                </span>
                              )}
                            </div>

                            {card?.buyerPrice?.bank?.amount > 0 && (
                              <div className="px-4 mt-3 ">
                                <span className="block text-[#47525E] font-[600] mb-2">
                                  Bank Loan:
                                </span>
                                <ul className="space-y-2 ">
                                  <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">
                                    Amount:{card?.buyerPrice?.bank?.amount} €
                                  </p>
                                  <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">
                                    Duration:{card?.buyerPrice?.bank?.duration}{" "}
                                    Year
                                  </p>
                                  <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">
                                    Rate:{card?.buyerPrice?.bank?.rate} %
                                  </p>
                                </ul>
                              </div>
                            )}

                            <div className="px-4 mt-5">
                              <span className="block text-[#47525E] font-[600] mb-2">
                                Documents:
                              </span>
                              {card?.buyerPrice?.documents?.length > 0 ? (
                                <ul className="space-y-2 ">
                                  {card?.buyerPrice?.documents?.map(
                                    (item, index) => (
                                      <li
                                        key={index}
                                        className="text-[#47525E] font-[500] py-[1px] rounded-md flex items-center"
                                      >
                                        <a
                                          target="_new"
                                          href={methodModel.noImg(
                                            item.fileName
                                          )}
                                          className=" flex items-center"
                                        >
                                          <FaRegArrowAltCircleRight className="me-2" />
                                          {item.originalname}
                                        </a>
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <span className="text-[#47525E] font-[500]">
                                  Document not attached.
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {activeTab === "refuse" && (
                          <div className=" h-[300px] flex justify-center flex-col">
                            <img
                              src="assets/img/reject-offer.png"
                              className="w-[80px] mx-auto mb-3"
                            />
                            <h3 className="text-center text-[#47525E] my-8 px-4">
                              Are you sure you want to refuse the offer of{" "}
                              <span className="flex items-center justify-center mt-3 font-[600] bg-[#efefef] px-3 py-2 rounded-[4px] mx-auto w-fit ">
                                Offer amount:
                                {` ${formatCurrency(
                                  card?.buyerPrice?.amount
                                )} €`}
                              </span>
                            </h3>
                          </div>
                        )}

                        {activeTab === "counter" && (
                          <div className=" h-[300px] flex justify-center flex-col px-4">
                            <div className="flex justify-start flex-col ">
                              <img
                                src="assets/img/counter-offer.png"
                                className="w-[80px] mx-auto mb-3"
                              />
                              <h3 className="text-center text-[#47525E] my-4 px-6">
                                Enter the amount you want to offer as a counter
                                offer
                              </h3>

                              <div className="relative  w-[100%] mb-8">
                                <input
                                  type="text"
                                  value={formatCurrency(offer)}
                                  onChange={(e) => {
                                    let value = e.target.value;
                                    value = value.replace(/[^0-9]/g, "");
                                    setOffer(value);
                                  }}
                                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                                  placeholder="Enter price"
                                />
                                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                                  €
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex border-t p-2 justify-between">
                          <button
                            onClick={() => {
                              closeOfferFunc();
                            }}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          {activeTab === "accept" ? (
                            <button
                              onClick={() =>
                                handleChange(card, "offer accept by owner")
                              }
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Accept
                            </button>
                          ) : activeTab === "refuse" ? (
                            <button
                              onClick={() =>
                                handleChange(card, "offer refused by owner")
                              }
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Refuse
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (+offer < 0)
                                  return toast.error("Enter amount");
                                if (offer == card?.buyerPrice)
                                  return toast.error("Both amounts are same");
                                handleChange(
                                  card,
                                  "offer submit by owner",
                                  "ownerPrice"
                                );
                              }}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Submit Counter Offer
                            </button>
                          )}
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogPanel>
                </div>
              </Dialog>
            </>
          )}

          {card?.funnelStatus == "offer refused by owner" && (
            <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
              Refused
            </p>
          )}
          {card?.funnelStatus == "offer refused by user" && (
            <>
              <button
                onClick={() => {
                  if (!blurCard || !blurCardPlan) openDialogBook(card);
                }}
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
              >
                Edit
              </button>
              <Dialog
                open={isOpenBook}
                onClose={() => { }}
                className="relative z-[9999]"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                  <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                    <DialogTitle className="p-6">
                      <p className="border-b text-[#389D93] text-[18px] text-center pb-5">
                        You can select a date
                      </p>
                      <div className="mt-6">
                        <div className="flex justify-start mt-3 flex-col ">
                          <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                            Offer amount*
                          </label>
                          <div className="relative  w-[100%] mb-8">
                            <input
                              type="text"
                              value={formatCurrency(offer)}
                              onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9]/g, "");
                                setOffer(value);
                              }}
                              className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                              placeholder="Enter price"
                            />
                            <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                              €
                            </span>
                          </div>
                        </div>
                      </div>
                    </DialogTitle>
                    <div className="flex border-t p-3 justify-between">
                      <button
                        onClick={() => setIsOpenBook(false)}
                        className="text-[#868389] text-[18px] underline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (+offer < 0) return toast.error("Enter amount");
                          if (offer == card?.buyerPrice)
                            return toast.error("Both amounts are same");
                          handleChange(
                            card,
                            "offer submit by owner",
                            "ownerPrice"
                          );
                        }}
                        className="bg-primary text-white px-3 py-2  rounded-[7px]"
                      >
                        Save
                      </button>
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>
            </>
          )}
          {(card?.funnelStatus == "offer accept by user" ||
            card?.funnelStatus == "offer accept by owner") && (
              <>
                <button
                  className={`${card?.funnelStatus == "offer accept by user" ||
                    card?.funnelStatus == "offer accept by owner"
                    ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                    : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                    }`}
                  onClick={() => {
                    if (!blurCard || !blurCardPlan) openSlotFunc(card);
                  }}
                >
                  Propose Pre-Signing date
                </button>
                <SlotModal
                  openSlotModal={openPreSaleModal}
                  closeSlotFunc={closePreSaleFunc}
                  card={card}
                  bookSlot={preSlot}
                  setBookSlot={setPreSlot}
                  actionSlotFunc={actionPreSaleFunc}
                />
              </>
            )}
          {card?.funnelStatus == "preslot booked by user" && (
            <>
              <button
                className={`${card?.funnelStatus == "preslot booked by user"
                  ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                  : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                  }`}
                onClick={() => {
                  if (!blurCard || !blurCardPlan) openAnsSlotFunc(card);
                }}
              >
                Answer
              </button>
              <AnsSlotModal
                openAnsSlotModal={openAnsSlotModal}
                closeAnsSlotFunc={closeAnsSlotFunc}
                card={card}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                bookSlot={preSlot}
                setBookSlot={setPreSlot}
                actionAnsSlotFunc={actionAnsPreSlotFunc}
                actionAnsAcceptSlotFunc={actionAnsAcceptPreSlotFunc}
                acceptDate={card?.userPresale}
              />
            </>
          )}
          {card?.funnelStatus == "preslot accept by user" ? (
            <button
              className={`${card?.funnelStatus == "preslot accept by user"
                ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                }`}
              onClick={() => {
                if (!blurCard || !blurCardPlan)
                  handleChange(card, "contract signed by owner", "icon6");
              }}
            >
              Confirm signing
            </button>
          ) : (
            <></>
          )}
          {(card?.funnelStatus == "contract signed by owner" ||
            card?.funnelStatus == "contract signed by user") && (
              <>
                <button
                  className={`${card?.funnelStatus == "contract signed by owner" ||
                    card?.funnelStatus == "contract signed by user"
                    ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                    : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                    }`}
                  onClick={() => {
                    if (!blurCard || !blurCardPlan) openSlotFunc(card, true);
                  }}
                >
                  Propose Final Signing Date
                </button>
              </>
            )}
          {card?.funnelStatus == "saleslot accept by user" && (
            <button
              className={`${card?.funnelStatus == "saleslot accept by user"
                ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                }`}
              onClick={() => {
                if (!blurCard || !blurCardPlan)
                  handleChange(card, "confirmation by owner");
              }}
            >
              Final Contract Signed
            </button>
          )}
          {(card?.funnelStatus == "confirmation by owner" ||
            card?.funnelStatus == "confirmation by user" ||
            card?.funnelStatus == "transferred") && (
              <button
                className={`${(card?.funnelStatus == "confirmation by owner" ||
                  card?.funnelStatus == "confirmation by user" ||
                  card?.funnelStatus == "transferred") &&
                  !(card?.transferDone && card?.interestStatus == "completed")
                  ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                  : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                  }`}
                onClick={() => {
                  if (!blurCard || !blurCardPlan) transferFunc(card);
                }}
                disabled={
                  card?.transferDone && card?.interestStatus == "completed"
                }
              >
                {card?.transferDone && card?.interestStatus == "completed"
                  ? "Transfered"
                  : "Transfer Property Ownership"}
              </button>
            )}
          {(card?.buyerPrice?.documents || card?.buyerPrice?.amount) && (
            <>
              <button
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                onClick={() => {
                  if (!blurCard || !blurCardPlan) openViewOfferFunc(card);
                }}
              >
                View Purchase Offer
              </button>
              <Dialog
                open={viewOfferModal}
                onClose={closeViewOfferFunc}
                className="relative z-[9999]"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <DialogPanel className="max-w-md w-full bg-white rounded-[20px] shadow-lg">
                    <DialogTitle className="">
                      <div className="react-custom">
                        <div className="pt-6 pb-6 h-[300px] overflow-auto px-3 ">
                          <h3 className="text-center text-[#47525E] text-xl font-semibold px-4">
                            Offer Detail
                          </h3>

                          <div className="flex items-center justify-between mt-5 px-4">
                            <span className="text-[#47525E] font-[600]">
                              Offer amount:
                            </span>
                            <span className="text-[#47525E] font-[500]">
                              {` ${formatCurrency(card?.buyerPrice?.amount)} €`}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-3 px-4">
                            <span className="text-[#47525E] font-[600]">
                              Validity date:
                            </span>
                            <span className="text-[#47525E] font-[500]">
                              {` ${dateFormate(
                                card?.buyerPrice?.validity_date
                              )}`}
                            </span>
                          </div>

                          {/* Move-In Date */}
                          <div className="flex items-center justify-between mt-3 px-4">
                            <span className="text-[#47525E] font-[600]">
                              Move In date:
                            </span>
                            <span className="text-[#47525E] font-[500]">
                              {` ${dateFormate(card?.buyerPrice?.move_in)}`}
                            </span>
                          </div>

                          {/* Suspensive Conditions (Count) */}
                          <div className="flex items-center justify-between mt-3 px-4">
                            <span className="block text-[#47525E] font-[600] mb-2">
                              Suspensive condition count:
                            </span>
                            <span className="text-[#47525E] font-[500]">
                              {card?.buyerPrice?.conditions?.length || 0}
                            </span>
                          </div>
                          {/* Funding Types (Listed View) */}
                          <div className="px-4 mt-3 ">
                            <span className="block text-[#47525E] font-[600] mb-2">
                              Funding types:
                            </span>
                            {card?.buyerPrice?.fundingType?.length > 0 ? (
                              <ul className="space-y-2 ">
                                {card?.buyerPrice?.fundingType?.map(
                                  (funding, index) => (
                                    <li
                                      key={index}
                                      className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center"
                                    >
                                      <FaRegArrowAltCircleRight className="me-2" />

                                      {funding}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <span className="text-[#47525E] font-[500]">
                                No funding types available.
                              </span>
                            )}
                          </div>

                          <div className="px-4 mt-3 ">
                            <span className="block text-[#47525E] font-[600] mb-2">
                              Suspensive condition:
                            </span>
                            {card?.buyerPrice?.conditions?.length > 0 ? (
                              <ul className="space-y-2 ">
                                {card?.buyerPrice?.conditions?.map(
                                  (condition, index) => (
                                    <li
                                      key={index}
                                      className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center"
                                    >
                                      <FaRegArrowAltCircleRight className="me-2" />

                                      {condition}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <span className="text-[#47525E] font-[500]">
                                No funding types available.
                              </span>
                            )}
                          </div>

                          {card?.buyerPrice?.bank?.amount > 0 && (
                            <div className="px-4 mt-3 ">
                              <span className="block text-[#47525E] font-[600] mb-2">
                                Bank Loan:
                              </span>
                              <ul className="space-y-2 ">
                                <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">
                                  Amount:{card?.buyerPrice?.bank?.amount} €
                                </p>
                                <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">
                                  Duration:{card?.buyerPrice?.bank?.duration}{" "}
                                  Year
                                </p>
                                <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">
                                  Rate:{card?.buyerPrice?.bank?.rate} %
                                </p>
                              </ul>
                            </div>
                          )}

                          <div className="px-4 mt-5">
                            <span className="block text-[#47525E] font-[600] mb-2">
                              Documents:
                            </span>
                            {card?.buyerPrice?.documents?.length > 0 ? (
                              <ul className="space-y-2 ">
                                {card?.buyerPrice?.documents?.map(
                                  (item, index) => (
                                    <li
                                      key={index}
                                      className="text-[#47525E] font-[500] py-[1px] rounded-md flex items-center"
                                    >
                                      <a
                                        target="_new"
                                        href={methodModel.noImg(item.fileName)}
                                        className=" flex items-center"
                                      >
                                        <FaRegArrowAltCircleRight className="me-2" />
                                        <span className="me-2">
                                          {item.originalname}
                                        </span>
                                      </a>
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        className="cursor-pointer text-[#383A3D] text-[14px]"
                                      >
                                        Preview
                                      </p>
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <span className="text-[#47525E] font-[500]">
                                Document not attached.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogPanel>
                </div>
              </Dialog>
            </>
          )}
          {(card?.funnelStatus == "offer sent" ||
            card?.funnelStatus == "invite user for a visit") &&
            card?.interestType == "offer sent" && (
              <>
                <button
                  className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                  onClick={() => {
                    if (blurCard) return;
                    setOfferModal(true);
                    setOfferData(card);
                  }}
                >
                  View Offer
                </button>
                <Dialog
                  open={offerModal}
                  onClose={() => {
                    setOfferModal(false);
                    setOfferData();
                  }}
                  className="relative z-[9999]"
                >
                  <DialogBackdrop className="fixed inset-0 bg-black/10" />
                  <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                      <DialogTitle className="">
                        <p className="border-b relative text-[#389D93] text-[18px] text-center py-5 px-3">
                          Offer Detail (non-bidding offer)
                          <span
                            className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                            onClick={() => {
                              setOfferModal(false);
                              setOfferData();
                            }}
                          >
                            <IoClose />
                          </span>
                        </p>
                        <div className="p-8">
                          <div className="mb-3">
                            {/* <div className="w-full">
                            <h5 className="font-bold">Offer Validity Date</h5>
                            <p>{` ${dateFormate(
                              offerData?.makeOfferValidDate
                            )}`}</p>
                          </div> */}
                            {/* <div className="w-full">
                            <h5 className="font-bold">Move In Date</h5>
                            <p>{` ${dateFormate(
                              offerData?.makeOfferMovinDate
                            )}`}</p>
                          </div> */}

                            <div className="w-full">
                              <h5 className="font-bold mb-1">Amount</h5>
                              <div className="bg-gray-100 rounded-md px-4 py-2">
                                <p>{offerData?.makeOfferAmount} €</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-bold mb-1">Description</h5>
                            <div className="bg-gray-100 rounded-md px-4 py-2">
                              <p className="max-h-[150px] overflow-y-auto">
                                {offerData?.makeOfferDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogTitle>
                    </DialogPanel>
                  </div>
                </Dialog>
              </>
            )}
          {card?.funnelStatus == "request to change the visit slot" && (
            <>
              <button
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                onClick={() => {
                  if (!blurCard || !blurCardPlan) setReqModal(true);
                }}
              >
                View request
              </button>
              <Dialog
                open={reqModal}
                onClose={() => setReqModal(false)}
                className="relative z-[9999]"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/10" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                  <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                    <DialogTitle className="p-6">
                      <p className="border-b text-[#389D93] text-[18px] text-center pb-5 ">
                        Request to change a slot
                      </p>

                      <div className="mt-5 bg-[#8962b814] p-3 rounded-[5px] ">
                        <div className="flex items-center">
                          <IoMdCheckmarkCircleOutline className="me-2 w-[20px] h-[20px] -mt-1" />
                          <p className="font-[600] mb-1">Reason</p>
                        </div>
                        <p className=" text-[#389D93] text-[18px]    pb-5 ">
                          {card?.changeRequestNote}
                        </p>
                      </div>
                      <div className="pt-8  flex items-center justify-center">
                        <Button
                          onClick={() => setReqModal(false)}
                          className="btn border border-[#976DD0] text-[#976DD0] font-[600] hover:bg-[#976DD0] hover:text-white transition"
                        >
                          Okay
                        </Button>
                      </div>
                    </DialogTitle>
                  </DialogPanel>
                </div>
              </Dialog>

              <button
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                onClick={() => {
                  if (!blurCard || !blurCardPlan) setIsSlot(card);
                }}
              >
                Change Slot
              </button>
            </>
          )}
          {card?.funnelStatus == "request to change the pre-sale slot" && (
            <>
              <button
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                onClick={() => {
                  if (!blurCard || !blurCardPlan) setReqModal(true);
                }}
              >
                View request
              </button>
              <Dialog
                open={reqModal}
                onClose={() => setReqModal(false)}
                className="relative z-[9999]"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/10" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                  <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                    <DialogTitle className="p-6">
                      <p className="border-b text-[#389D93] text-[18px] text-center pb-5 ">
                        Request to change a slot
                      </p>

                      <div className="mt-5 bg-[#8962b814] p-3 rounded-[5px] ">
                        <div className="flex items-center">
                          <IoMdCheckmarkCircleOutline className="me-2 w-[20px] h-[20px] -mt-1" />
                          <p className="font-[600] mb-1">Reason</p>
                        </div>
                        <p className=" text-[#389D93] text-[18px]    pb-5 ">
                          {card?.changeRequestNote}
                        </p>
                      </div>
                      <div className="pt-8  flex items-center justify-center">
                        <Button
                          onClick={() => setReqModal(false)}
                          className="btn border border-[#976DD0] text-[#976DD0] font-[600] hover:bg-[#976DD0] hover:text-white transition"
                        >
                          Okay
                        </Button>
                      </div>
                    </DialogTitle>
                  </DialogPanel>
                </div>
              </Dialog>

              <button
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                onClick={() => {
                  if (!blurCard || !blurCardPlan)
                    setIsSlot({
                      ...card,
                      slotType: "signingSlots",
                      visitSlots: signingSlots,
                      duration: preSignDuration,
                      title: "Manage Pre-sale slot",
                    });
                }}
              >
                Change Slot
              </button>
            </>
          )}
          {card?.funnelStatus == "request to change the final signing slot" && (
            <>
              <button
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                onClick={() => {
                  if (!blurCard || !blurCardPlan) setReqModal(true);
                }}
              >
                View request
              </button>
              <Dialog
                open={reqModal}
                onClose={() => setReqModal(false)}
                className="relative z-[9999]"
              >
                <DialogBackdrop className="fixed inset-0 bg-black/10" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                  <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                    <DialogTitle className="p-6">
                      <p className="border-b text-[#389D93] text-[18px] text-center pb-5 ">
                        Request to change a slot
                      </p>

                      <div className="mt-5 bg-[#8962b814] p-3 rounded-[5px] ">
                        <div className="flex items-center">
                          <IoMdCheckmarkCircleOutline className="me-2 w-[20px] h-[20px] -mt-1" />
                          <p className="font-[600] mb-1">Reason</p>
                        </div>
                        <p className=" text-[#389D93] text-[18px]    pb-5 ">
                          {card?.changeRequestNote}
                        </p>
                      </div>
                      <div className="pt-8  flex items-center justify-center">
                        <Button
                          onClick={() => setReqModal(false)}
                          className="btn border border-[#976DD0] text-[#976DD0] font-[600] hover:bg-[#976DD0] hover:text-white transition"
                        >
                          Okay
                        </Button>
                      </div>
                    </DialogTitle>
                  </DialogPanel>
                </div>
              </Dialog>

              <button
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                onClick={() => {
                  if (!blurCard || !blurCardPlan)
                    setIsSlot({
                      ...card,
                      slotType: "signingSlots",
                      type: "finalslot",
                      visitSlots: signingSlots,
                      duration: preSignDuration,
                      title: "Manage Signing slot",
                    });
                }}
              >
                Change Slot
              </button>
            </>
          )}
          {(card?.funnelStatus == "review submit by user" ||
            card?.funnelStatus == "offer submit by user") && (
              <>
                <button
                  className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                  onClick={() => {
                    if (blurCard) return;
                    setReviewModal(true);
                    setReviewData(card);
                  }}
                >
                  View review
                </button>
                <Dialog
                  open={reviewModal}
                  onClose={() => {
                    setReviewModal(false);
                    setReviewData();
                  }}
                  className="relative z-[9999]"
                >
                  <DialogBackdrop className="fixed inset-0 bg-black/10" />
                  <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                      <DialogTitle className="">
                        <p className="border-b text-[#389D93] text-[18px] text-center py-5 px-3">
                          Review about the property
                        </p>
                        <div className="mt-6 mb-8">
                          <div className="rating-section">
                            {[
                              {
                                name: "Location Quality",
                                value: reviewData?.review?.location,
                              },
                              {
                                name: "Property luminosity",
                                value: reviewData?.review?.luminosity,
                              },
                              {
                                name: "Property Condition",
                                value: reviewData?.review?.condition,
                              },
                              {
                                name: "Common areas condition",
                                value: reviewData?.review?.areaCondition,
                              },
                              {
                                name: "Quality of property information shared",
                                value: reviewData?.review?.propertyInformation,
                              },
                              {
                                name: "Peacefull setting",
                                value: reviewData?.review?.peacefullSetting,
                              },
                            ]?.map((itm, i) => (
                              <div
                                key={i}
                                className="flex justify-between my-4 ms-6 md:items-center items-start md:flex-row flex-col "
                              >
                                <div className="flex items-center md:w-[65%] md:mb-0 mb-2 w-[100%]">
                                  <FaArrowRight className="mr-2 text-[#976DD0] text-[12px]" />
                                  <label className="block text-[14px] text-[#47525E] font-[600]">
                                    {itm?.name}
                                  </label>
                                </div>
                                <div className="relative  md:w-[32%] w-[100%] flex justify-end me-6">
                                  <div
                                    style={{
                                      lineHeight: "23px",
                                    }}
                                  >
                                    <ReactStars
                                      count={5}
                                      size={23}
                                      value={itm.value || 0}
                                      isHalf={true}
                                      emptyIcon={<i className="far fa-star"></i>}
                                      halfIcon={
                                        <i className="fa fa-star-half-alt"></i>
                                      }
                                      fullIcon={<i className="fa fa-star"></i>}
                                      activeColor="#976DD0"
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {reviewData?.review?.note && (
                            <>
                              <div className="mt-6 border-t pt-4"></div>
                              <div className="flex justify-start mb-4 mx-6 flex-col ">
                                <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                                  Note
                                </label>
                                <div className="relative  w-[100%] mb-3">
                                  <p className="bg-[#efefef] p-3 rounded-[5px]">
                                    {reviewData?.review?.note}{" "}
                                  </p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </DialogTitle>
                    </DialogPanel>
                  </div>
                </Dialog>
              </>
            )}
        </>
      )}
    </>
  );

  return (
    <>
      <DirectMsgModal
        directMsg={directMsg}
        setdirectMsg={setdirectMsg}
        chat_with={detail?.buyerId?._id}
        property_id={detail?.propertyId?._id}
        defaultMsg={defaultMsg}
        setDefaultMsg={setDefaultMsg}
      />
      <UploadID
        idProofOpen={idProofOpen}
        setidProofOpen={setidProofOpen}
        id={selectedProperty?._id}
      />
      <div
        className={`${blurCard || blurCardPlan ? "blur-sm" : ""
          } lg:col-span-6 col-span-full bg-white  border border-[#BEBEBE] rounded-[12px] lg:mb-0 mb-4`}
      >
        <div className="relative">
          <div className=" absolute -top-3 -left-5">
            <img
              alt=""
              src={imagePath(card?.buyerId?.image, "assets/img/man.jpg")}
              className="w-[50px] h-[50px] rounded-full object-cover shrink-0"
            />
          </div>
          <div className="flex justify-between py-2 ">
            <div className="px-10 ">
              <h3 className="text-[#47525E] text-[14px] capitalize">
                {card.buyerId?.fullName}
              </h3>
              {card.buyerId?.city && (
                <p className="text-[#47525E] text-[14px]">
                  {card.buyerId?.city}, {card.buyerId?.country}
                </p>
              )}
              <span className="text-[#47525E] text-[14px]">
                {card?.buyer?.buyerfileIdenityVerification ? (
                  <div className="flex gap-2 items-center">
                    Buyer Identity Verified
                    <IoCheckmarkCircle className="text-[#37c751]" />
                  </div>
                ) : (
                  "Buyer Identity Not Verified"
                )}
              </span>
            </div>

            <div className="flex justify-content-end ml-auto me-4">
              <Menu>
                <MenuButton className="h-[20px]">
                  <RxDotsHorizontal />
                </MenuButton>
                <MenuItems className="bg-white border p-2 px-4 rounded-[12px]">
                  <MenuItem>
                    <a className="block text-[14px] py-1" href="/settings">
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a className="block text-[14px] py-1" href="/support">
                      Support
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a className="block text-[14px] py-1" href="/license">
                      License
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
          <div className="px-10">
            <div className="border p-3 py-1 rounded-md relative">
              <div className={`${user?.planId != "" && (card?.buyerId?.isDocumentVerified || card?.buyerId?.isDeclDocumentVerified) ? "" : "blur-sm"}`}>
                <p className="text-[12px]">{card?.buyerId?.isDocumentVerified ? "" : "No"} Document based financial background checked.</p>
                <p className="text-[12px]">{card?.buyerId?.isDeclDocumentVerified ? "" : "No"} Declarative based financial background checked.</p>
              </div>
              {user?.planId == "" && (card?.buyerId?.isDocumentVerified || card?.buyerId?.isDeclDocumentVerified) && <span className="absolute top-1/2 left-1/2 transform-all -translate-x-1/2 -translate-y-1/2">
                <FaLock />
              </span>}

            </div>
            {user?.planId == "" && (card?.buyerId?.isDocumentVerified || card?.buyerId?.isDeclDocumentVerified) && <div className="text-center mt-1">
              <a href="/plan" className="text-[#976DD0] text-[14px] underline">Purchase Plan</a>
            </div>}

          </div>

          <div class="border-t pt-2 px-4 my-2">
            <ul class="flex  ">
              {card?.propertyId?.surface ? (
                <>
                  <li class="flex items-center gap-1 text-[#47525E] text-[13.33px] me-4">
                    <img
                      src="assets/img/prop/home.png"
                      class="h-[15px] w-[14px]"
                      alt="img"
                    />
                    {card?.propertyId?.surface} m2
                  </li>
                </>
              ) : (
                <></>
              )}

              {card?.propertyId?.rooms ? (
                <>
                  <li class="flex items-center gap-1 text-[#47525E] text-[13.33px] me-4">
                    <img
                      src="assets/img/prop/bed.png"
                      class="h-[12px] w-[13px]"
                      alt="img"
                    />
                    {card?.propertyId?.rooms || 0}
                  </li>
                </>
              ) : (
                <></>
              )}

              {card?.propertyId?.bathroom ? (
                <>
                  <li class="flex items-center gap-1 text-[#47525E] text-[13.33px] me-4">
                    <img
                      src="assets/img/bed.png"
                      class="h-[12px] w-[14px]"
                      alt="img"
                    />
                    {card?.propertyId?.bathroom || 0}
                  </li>
                </>
              ) : (
                <></>
              )}
            </ul>
            <div class="flex items-center gap-2 mt-1">
              <h3 class="text-[19px] font-semibold">
                {pipeModel.number(card.propertyId?.price)} €
              </h3>
              <span class="text-[#47525E] text-[13.33px]">
                {pipeModel.number(
                  Number(card?.propertyId?.price) /
                  (card?.propertyId?.surface || 1)
                )}
                € /Sqm
              </span>
            </div>
          </div>
          <div className="px-4 min-h-[60px]">
            <div className="mt-4">
              {/* {card?.funnelStatus} */}
              <h5 className="text-[#47525E] text-[14px]">
                Status:{" "}
                <span className="text-[#47525E] font-[600]">
                  {currentStatus(card?.funnelStatus, card)}
                </span>
              </h5>
              {card?.funnelStatus == "offer sent" && (
                <h5 className="text-[#47525E] text-[14px] ">
                  Offer amount:{" "}
                  <span className="text-[#47525E] font-[600]">
                    {card?.makeOfferAmount}
                  </span>
                </h5>
              )}
              {card?.funnelStatus == "renter assigned" ||
                card?.funnelStatus == "transfered" ||
                card?.funnelStatus == "renter transfered" ? (
                <></>
              ) : (
                <h5 className="text-[#47525E] text-[14px] ">
                  Next action:{" "}
                  <span className="text-[#47525E] font-[600]">
                    {nextStatus(card?.funnelStatus, card)}
                  </span>
                </h5>
              )}
             {(activePlan?.[0]?.otherDetails?.leadsLevel?.key == "custom" && (activePlan?.[0]?.otherDetails?.leadsLevel?.value >= i + 1) || activePlan?.[0]?.otherDetails?.leadsLevel?.key == "unlimited") && (
                <h5 className="text-[#47525E] flex gap-1 items-center text-[14px]">
                  Financial credibility score:{" "}
                  <span className="text-white bg-[#21C6BE] rounded-full p-1 w-[20px] h-[20px] flex items-center justify-center ms-2">
                    {`${card?.buyerId?.documentGrade} `}
                  </span>
                </h5>
              )} 
              {+card?.buyerPrice?.amount > 0 && (
                <h5 className="text-[#47525E] text-[14px]">
                  Offer amount:{" "}
                  <span className="text-[#21C6BE] font-[600]">
                    {`${formatCurrency(card?.buyerPrice?.amount)}  €`}
                  </span>
                </h5>
              )}
              {Array.isArray(card?.buyerPrice?.conditions) &&
                card.buyerPrice.conditions.length > 0 && (
                  <h5 className="text-[#47525E] text-[14px]">
                    Suspensive conditions:{" "}
                    <span className="font-[600] ms-1">
                      {formatCurrency(card.buyerPrice.conditions.length)}
                    </span>
                  </h5>
                )}
              {card?.buyerPrice?.fundingType?.length > 0 && (
                <div className="px-4 mt-3 ">
                  <span className="block text-[#47525E] text-[14px] font-[600]">
                    Funding types:
                  </span>

                  <ul className="space-y-2 ">
                    {card?.buyerPrice?.fundingType?.map((funding, index) => (
                      <li
                        key={index}
                        className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center"
                      >
                        <FaRegArrowAltCircleRight className="me-2" />

                        {funding}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <h4 className="text-[#47525E] font-semibold pb-2 border-b-[1px] border-[#976DD0] pt-4 mx-4">
            {capLetter(
              card?.propertyType == "rent" ? "Rental" : card?.propertyType
            )}{" "}
            funnel
          </h4>
          <FunnelIcons card={card} />

          {!card.isTransferred ? (
            <>
              <div className="flex gap-3 p-4 flex-wrap justify-center">
                {Actions}
                <button
                  onClick={() => {
                    handleChat(card);
                  }}
                  className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]  "
                >
                  Message
                </button>
                <button
                  onClick={() => {
                    if (!blurCard || !blurCardPlan) openModal();
                  }}
                  className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]  "
                >
                  Transaction History
                  {/* Message */}
                </button>
                {!card?.finalSale && (
                  <button
                    className={`text-[#${card?.funnelStatus == "cancelled" ? "21C6BE" : "47525E"
                      }] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]`}
                    disabled={card?.funnelStatus == "cancelled"}
                    onClick={() => {
                      if (
                        card?.funnelStatus != "cancelled" &&
                        (!blurCard || !blurCardPlan)
                      )
                        setIsOpencancel(true);
                    }}
                  >
                    {card?.funnelStatus == "cancelled" ? "Cancelled" : "Cancel"}
                  </button>
                )}
                <Dialog
                  open={isOpencancel}
                  onClose={() => setIsOpencancel(false)}
                  className="relative z-[9999]"
                >
                  <DialogBackdrop className="fixed inset-0 bg-black/10" />
                  <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                      <DialogTitle className="p-6">
                        <MdCancel className="text-[80px] mx-auto text-[#976DD0]" />
                        <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-5">
                          Are you sure you want to cancel ?
                        </p>
                        <div className="pt-8  flex items-center justify-center">
                          <Button
                            onClick={() => setIsOpencancel(false)}
                            className="btn border border-[#976DD0] text-[#976DD0] font-[600] hover:bg-[#976DD0] hover:text-white transition"
                          >
                            No
                          </Button>
                          <Button
                            onClick={() => {
                              if (card?.funnelStatus != "cancelled")
                                handleChange(card, "cancelled");
                            }}
                            className="btn bg-[#976DD0] text-white hover:bg-transparent hover:text-[#976DD0] ms-3 border border-[#976DD0] "
                          >
                            Yes
                          </Button>
                        </div>
                      </DialogTitle>
                    </DialogPanel>
                  </div>
                </Dialog>
              </div>
            </>
          ) : (
            <></>
          )}

          {card?.funnel?.youtubeUrl && (
            <>
              {" "}
              <h4 className="text-[#47525E] text-[14px] font-[600] text-center mb-3">
                Current step training
              </h4>{" "}
              <TrainingVideoCard
                key={i}
                title={card?.funnel?.title}
                duration={card?.funnel?.duration}
                videoId={videoId}
                thumbnail={methodModel.userImg(card?.funnel?.image)}
              />{" "}
            </>
          )}
          <div
            className="cursor-pointer text-center underline mb-4"
            onClick={(e) => history("/training")}
          >
            More Trainings
          </div>
          {documentModal ? (
            <>
              <SellerfileModal
                onClose={() => setdocumentModal()}
                result={() => result({ event: "submitted" })}
                value={documentModal}
                card={card}
              />
            </>
          ) : (
            <></>
          )}
          {isOpenMsg ? (
            <>
              <MsgHistory
                isOpenMsg={isOpenMsg}
                closeModal={closeModal}
                card={card}
                i={i}
                actions={Actions}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
