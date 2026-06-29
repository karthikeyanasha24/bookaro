import {
  capLetter,
  dateFormate,
  downloadFile,
  formatCurrency,
  imagePath,
  stringSeprator,
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
import { toast } from "react-toastify";
import moment from "moment";
import { useMemo, useState, useEffect } from "react";
import loader from "../../methods/loader";
import ApiClient from "../../methods/api/apiClient";
import { MdCancel } from "react-icons/md";
import MsgHistory from "./MsgHistory";
import ReactStars from "react-rating-stars-component";
import { FaArrowRight, FaEye, FaRegCirclePlay, FaRegEye } from "react-icons/fa6";
import ApplicationModal from "./ApplicationModal";
import FunnelIcons from "./FunnelIcons";
import DatePicker from "react-datepicker";
import AnswerSlotModal from "../RealEstateTransactionSearcher/AnswerSlotModal";
import socket from "../../config/ChatSocket/socket";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import {
  preSignDuration,
  renterCurrentStatus,
  renterNextStatus,
} from "../../utils/shared.utils";
import datepipeModel from "../../models/datepipemodel";
import UploadID from "../../components/common/Modal/UploadID";
import DirectMsgModal from "../PropertyDetails/DirectMsgModal";
import { useSelector } from "react-redux";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { BsFiletypePdf } from "react-icons/bs";
import environment from "../../environment";
import TrainingVideoCard from "../RealEstateTransactionSearcher/TrainingVideoCard";
import methodModel from "../../methods/methods";
import { useNavigate } from "react-router-dom";

export default function RenterCard({
  card,
  i,
  blurCardPlan = false,
  selectedProperty,
  propertyId,
  setApplicationAccepted = () => { },
  applicationAccepted = false,
  result = (_) => { },
  visitSlots,
  setIsSlot = () => { },
}) {

  const history = useNavigate()
  const user = useSelector((state) => state.user);
  const [idProofOpen, setidProofOpen] = useState(false);
  const [bookSlot, setBookSlot] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [offerModal, setOfferModal] = useState(false);
  const [offerData, setOfferData] = useState();
  const [saleSlot, setSaleSlot] = useState(null);
  const [isOpencancel, setIsOpencancel] = useState(false);
  const [reqModal, setReqModal] = useState(false);
  const [isSign, setIsSign] = useState();
  const [answerApplication, setAnswerApplication] = useState();
  const [answerSlotModal, setAnswerSlotModal] = useState();
  const [documentModule, setDocumentModule] = useState(false);
  const [documentData, setDocumentData] = useState();
  const activePlan = useSelector((state) => state.activePlan);
    console.log(activePlan, "activePlan")
  const signingSlots = useMemo(() => {
    const today = datepipeModel.datetostring(new Date().toISOString()); // Get today's date in YYYY-MM-DD format
    const upcomingSlots = selectedProperty?.signingSlots?.filter(
      (slot) => slot.date >= today
    );
    return upcomingSlots;
  }, [selectedProperty]);


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
        const idFromPath = pathParts.find((part) => /^[a-zA-Z0-9_-]{11}$/.test(part));
        if (idFromPath) return idFromPath;
      }

      return null;
    } catch {
      return null;
    }
  };

  const videoId = getVideoId(card?.funnel?.youtubeUrl)

  const homeInventorySlots = useMemo(() => {
    const today = datepipeModel.datetostring(new Date().toISOString()); // Get today's date in YYYY-MM-DD format
    const upcomingSlots = selectedProperty?.homeInventorySlots?.filter(
      (slot) => slot.date >= today
    );
    return upcomingSlots;
  }, [selectedProperty]);

  // const blurCard = (applicationAccepted && !card.applicationAccepted) ? true : false
  const blurCard = false;

  const currentStatus = (status, card) => {
    return renterCurrentStatus(status, card);
  };

  const nextStatus = (status, card) => {
    return renterNextStatus(status, card);
  };

  const [directMsg, setdirectMsg] = useState(false);
  const [detail, setDetail] = useState();
  const [defaultMsg, setDefaultMsg] = useState("");
  const handleChat = (data) => {
    setDetail(data);
    setDefaultMsg("");
    setdirectMsg(true);
  };

  const downloadAll = async (e, allDocs) => {
    e.preventDefault();
    loader(true);
    const token = localStorage.getItem("token");

    const filesToDownload = Object.values(allDocs)
      .flat()
      .filter((doc) => doc?.checked)
      .map((doc) => doc.fileName);

    try {
      const response = await fetch(`${environment.api}upload/zip-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in Authorization header
        },
        body: JSON.stringify({ files: filesToDownload }),
      });

      if (!response.ok) throw new Error("Failed to download zip");
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "documents.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading zip file:", error);
    }

    loader(false);
  };

  const handleChange = (card, status, key, value) => {
    const filter = {
      interestId: card?._id,
      interestUpdatedTime: new Date(),
    };
    if (status) filter.funnelStatus = status;

    if (status == "visit accept by owner") {
      filter.ownerVisitDate = card.userVisitDate;
      filter.finalVisitDate = card.userVisitDate;
    } else if (status == "signing date booked by owner") {
      const formattedDate = moment(
        value || bookSlot,
        "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
      )
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      filter.ownerPresale = formattedDate;
    } else if (status == "home inventory date booked by owner") {
      const formattedDate = moment(
        value || bookSlot,
        "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
      )
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      filter.ownerHomeInventory = formattedDate;
    } else if (status == "preslot accept by owner") {
      filter.finalPresale = card.userPresale;
    } else if (status == "contract signed by owner") {
      filter.ownerSigned = true;
      filter.userSigned = true;
    } else if (status == "saleslot booked by owner") {
      const formattedDate = moment(saleSlot, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        .utc()
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
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

    if (filter.funnelStatus == "owner accept the application") {
      filter.applicationAccepted = true;
    }

    if (
      (filter?.funnelStatus == "contract signed by owner" ||
        filter?.funnelStatus == "contract signed by user" ||
        filter?.funnelStatus == "renter transfered" ||
        filter?.funnelStatus == "renter assigned") &&
      filter?.ownerSigned &&
      card?.userSigned
    )
      filter.icon7 = true;

    loader(true);
    ApiClient.put("interests/statusChange", filter).then((res) => {
      if (res.success) {
        result({ event: "submitted" });
        setAnswerApplication();
        setIsSign();
        setAnswerSlotModal();
        setIsOpencancel(false);
        if (filter.applicationAccepted) setApplicationAccepted(true);
        if (
          filter.funnelStatus == "owner accept the application" ||
          filter.funnelStatus == "owner reject the application"
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

  const [isOpenMsg, setIsOpenMsg] = useState(false);
  function closeModal() {
    setIsOpenMsg(false);
  }
  function openModal() {
    setIsOpenMsg(true);
  }

  const answerOpen = (card) => {
    setAnswerApplication(card?.applicationFile);
  };

  const answerButton = (p) => {
    let status = "owner accept the application";
    if (p == "reject") status = "owner reject the application";
    let key = "";
    if (p == "accept") key = "icon5";
    handleChange(card, status, key);
  };

  const openSign = (p) => {
    setIsSign(p);
  };

  const signSubmit = () => {
    if (!bookSlot) return;
    let status = "signing date booked by owner";
    if (isSign == "home inventory")
      status = "home inventory date booked by owner";
    handleChange(card, status);
  };

  const acceptAnswer = (p) => {
    handleChange(card, "preslot accept by owner", "icon6");
  };

  const changeSlot = (p) => {
    if (!p) return toast.error("Select a date");
    if (
      dateFormate(new Date(p)) == dateFormate(new Date(answerSlotModal?.date))
    )
      return toast.error("Both dates are same");
    handleChange(card, "signing date booked by owner", "", p);
  };

  function openSlotFunc(card, final = false) {
    if (!signingSlots?.length) {
      return toast.error("Please add Signing slots");
    }
    handleChange(card, "preslot opened by owner", "icon5");
  }

  function openhomeinventory(card) {
    if (!homeInventorySlots?.length) {
      return toast.error("Please add Home Inventory slots");
    }
    handleChange(card, "home inventory opened by owner", "icon5");
  }

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

          {card?.funnelStatus == "preslot opened by owner" && (
            <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
              Slot Opened
            </p>
          )}

          {card?.funnelStatus == "home inventory accept by user" && (
            <button
              className={`${card?.funnelStatus == "home inventory accept by user"
                ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                }`}
              onClick={() => rentalTransfer(card)}
            >
              Final Contract Signed
            </button>
          )}
          {(card?.funnelStatus == "slot booked by owner" ||
            card?.funnelStatus == "signing date booked by owner") && (
              <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
                Booked
              </p>
            )}
          {
            //card?.funnelStatus == "visit accept by owner" ||
            card?.funnelStatus == "visit accept by user" && (
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
            )
          }
          {card?.funnelStatus == "application submit by user" && (
            <>
              <button
                className={`${card?.funnelStatus == "application submit by user"
                  ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                  : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                  }`}
                onClick={() => {
                  if (!blurCard || !blurCardPlan) answerOpen(card);
                }}
              >
                Answer
              </button>
            </>
          )}

          {card?.funnelStatus == "offer refused by owner" && (
            <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
              Refused
            </p>
          )}
          {card?.funnelStatus == "owner accept the application" && (
            <>
              <button
                className={`${card?.funnelStatus == "owner accept the application"
                  ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                  : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                  }`}
                onClick={() => {
                  if (!blurCard || !blurCardPlan) openSlotFunc(card);
                }}
              >
                Propose Pre-Signing date
              </button>
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
                  if (!blurCard || !blurCardPlan)
                    setAnswerSlotModal({ date: card?.userPresale });
                }}
              >
                Answer
              </button>
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
                    if (!blurCard || !blurCardPlan) openhomeinventory(card);
                  }}
                >
                  Open home inventory slot
                </button>
              </>
            )}
          {(card?.applicationFile?.addressProof?.length > 0 ||
            card?.applicationFile?.identityProof?.length > 0 ||
            card?.applicationFile?.otherDocs?.length > 0 ||
            card?.applicationFile?.salarySlips?.length > 0) && (
              <>
                <button
                  className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                  onClick={() => {
                    setDocumentModule(true);
                    setDocumentData(card);
                  }}
                >
                  View Renter File
                </button>
                <Dialog
                  open={documentModule}
                  onClose={() => {
                    setDocumentModule(false);
                    setDocumentData();
                  }}
                  className="relative z-[9999]"
                >
                  <DialogBackdrop className="fixed inset-0 bg-black/10" />
                  <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                      <DialogTitle className="">
                        <p className="border-b text-[#47525E] relative text-[18px] text-center py-5 px-3">
                          Document Detail
                          <span
                            onClick={() => {
                              setDocumentModule(false);
                              setDocumentData();
                            }}
                            className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer"
                          >
                            <IoClose className="text-black" size={22} />
                          </span>
                        </p>
                        <div className="text-end px-3 py-2">
                          <button
                            onClick={(e) => downloadAll(e, card?.applicationFile)}
                            className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                          >
                            Download All
                          </button>
                        </div>
                        <div className="p-6 max-h-[400px] overflow-y-scroll">
                          <div className="rating-section">
                            {card?.applicationFile && (
                              <>
                                {card?.applicationFile?.addressProof?.length >
                                  0 && (
                                    <>
                                      <p className="text-black font-bold mb-2">
                                        Proof of current address
                                      </p>
                                      {card?.applicationFile?.addressProof?.map(
                                        (item) => {
                                          return (
                                            <>
                                              <div className="flex gap-2 items-center mb-4">
                                                <BsFiletypePdf className="text-[24px] text-black" />
                                                <span className="text-black text-[12px]">
                                                  {stringSeprator(
                                                    item?.originalname,
                                                    30
                                                  )}
                                                </span>{" "}
                                                <p
                                                  onClick={() =>
                                                    downloadFile(item?.fileName)
                                                  }
                                                  title="preview"
                                                  className="cursor-pointer text-[#976DD0]  text-[16px]"
                                                >
                                                  <FaEye />
                                                </p>
                                              </div>
                                            </>
                                          );
                                        }
                                      )}
                                    </>
                                  )}
                                {card?.applicationFile?.identityProof?.length >
                                  0 && (
                                    <>
                                      <p className="text-black font-bold mb-2">
                                        Proof of identity
                                      </p>
                                      {card?.applicationFile?.identityProof?.map(
                                        (item) => {
                                          return (
                                            <>
                                              <div className="flex items-center gap-2 mb-4">
                                                <BsFiletypePdf className="text-[24px] text-black" />
                                                <span className="text-black text-[12px]">
                                                  {stringSeprator(
                                                    item?.originalname,
                                                    30
                                                  )}
                                                </span>{" "}
                                                <p
                                                  onClick={() =>
                                                    downloadFile(item?.fileName)
                                                  }
                                                  title="preview"
                                                  className="cursor-pointer text-[#976DD0]  text-[16px]"
                                                >
                                                  <FaEye />
                                                </p>
                                              </div>
                                            </>
                                          );
                                        }
                                      )}
                                    </>
                                  )}

                                {card?.applicationFile?.salarySlips?.length >
                                  0 && (
                                    <>
                                      <p className="text-black font-bold mb-2">
                                        Salary Slips
                                      </p>
                                      {card?.applicationFile?.salarySlips?.map(
                                        (item) => {
                                          return (
                                            <>
                                              <div className="flex item-center gap-2 mb-4">
                                                <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                                <span className="text-black text-[12px]">
                                                  {stringSeprator(
                                                    item?.originalname,
                                                    30
                                                  )}
                                                </span>{" "}
                                                <p
                                                  onClick={() =>
                                                    downloadFile(item?.fileName)
                                                  }
                                                  title="preview"
                                                  className="cursor-pointer text-[#976DD0]  text-[16px]"
                                                >
                                                  <FaEye />
                                                </p>
                                              </div>
                                            </>
                                          );
                                        }
                                      )}
                                    </>
                                  )}

                                {card?.applicationFile?.otherDocs?.length > 0 && (
                                  <>
                                    <p className="text-black font-bold mb-2">
                                      Other Document
                                    </p>
                                    {card?.applicationFile?.otherDocs?.map(
                                      (item) => {
                                        return (
                                          <>
                                            <div className="flex items-center gap-2 mb-4">
                                              <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                              <span className="text-black text-[12px]">
                                                {stringSeprator(
                                                  item?.originalname,
                                                  30
                                                )}
                                              </span>{" "}
                                              <p
                                                onClick={() =>
                                                  downloadFile(item?.fileName)
                                                }
                                                title="preview"
                                                className="cursor-pointer text-[#976DD0]  text-[16px]"
                                              >
                                                <FaEye />
                                              </p>
                                            </div>
                                          </>
                                        );
                                      }
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </DialogTitle>
                    </DialogPanel>
                  </div>
                </Dialog>
              </>
            )}
          {card?.makeOfferAmount > 0 && (
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
                          className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer"
                          onClick={() => {
                            setOfferModal(false);
                            setOfferData();
                          }}
                        >
                          <IoClose className="text-black" />
                        </span>
                      </p>
                      <div className="p-8">
                        <div className="grid gap-2 sm:grid-cols-2 mb-3">
                          <div className="w-full">
                            <h5 className="font-bold">Amount</h5>
                            <p>{offerData?.makeOfferAmount} €</p>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-bold">Description</h5>
                          <p>{offerData?.makeOfferDescription}</p>
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
              <button
                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
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

          {card?.funnelStatus ==
            "request to change the home inventory slot" && (
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
                        slotType: "homeInventorySlots",
                        visitSlots: homeInventorySlots,
                        title: "Manage home Inventory slot",
                      });
                  }}
                >
                  Change Slot
                </button>
              </>
            )}
          {(card?.funnelStatus == "review submit by user" ||
            card?.funnelStatus == "application submit by user") && (
              <>
                <button
                  className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                  onClick={() => {
                    if (!blurCard || !blurCardPlan) setReviewModal(true);
                  }}
                >
                  View review
                </button>
              </>
            )}
        </>
      )}
    </>
  );

  const rentalTransfer = (card) => {
    let payload = {
      interestId: card._id,
      funnelStatus: "renter assigned",
    };
    loader(true);
    ApiClient.post("interests/renterTransfer", payload)
      .then((res) => {
        if (res.success) {
          result({ event: "renterTransfer" });
          handleChange(card, "renter assigned", "icon7")
        }
      })
      .finally(() => {
        loader(false);
      });
  };

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
          } lg:col-span-6 col-span-full bg-white  border border-[#BEBEBE] rounded-[12px]`}
      >
        <div className="relative">
          <div className=" absolute -top-3 -left-5">
            <img
              alt=""
              src={imagePath(card?.buyerId?.image, "assets/img/man.jpg")}
              className="w-[50px] h-[50px] rounded-full object-cover shrink-0"
            />
          </div>
          <div className="flex justify-between py-2">
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
                {card?.buyer?.renterfileIdenityVerification ? (
                  <div className="flex gap-2 items-center">
                    Renter Identity Verified
                    <IoCheckmarkCircle className="text-[#37c751]" />
                  </div>
                ) : (
                  "Renter Identity Not Verified"
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

            {card?.propertyId?.propertyType === "rent" && (
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-[19px] font-semibold">
                  {formatCurrency(card?.propertyId?.propertyMonthlyCharges)} €
                </h3>
              </div>
            )}

            {card?.propertyId?.propertyType === "sale" && (
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
            )}
          </div>
          <div className="px-4 ">
            <div className="mt-4">
              {/* {card?.funnelStatus} */}
              <h5 className="text-[#47525E] text-[14px]">
                Status:{" "}
                <span className="text-[#47525E] font-[600]">
                  {currentStatus(card?.funnelStatus, card)}
                </span>
              </h5>
              {(activePlan?.[0]?.otherDetails?.leadsLevel?.key == "custom" && (activePlan?.[0]?.otherDetails?.leadsLevel?.value >= i + 1) || activePlan?.[0]?.otherDetails?.leadsLevel?.key == "unlimited") && (
                <h5 className="text-[#47525E] flex gap-1 items-center text-[14px]">
                  Financial credibility score:{" "}
                  <span className="text-white bg-[#21C6BE] rounded-full p-1 w-[20px] h-[20px] flex items-center justify-center ms-2">
                    {`${card?.buyerId?.documentGrade} `}
                  </span>
                </h5>
              )}
              {card?.funnelStatus == "offer sent" && (
                <h5 className="text-[#47525E] text-[14px] ">
                  Offer amount:{" "}
                  <span className="text-[#47525E] font-[600]">
                    {card?.makeOfferAmount}
                  </span>
                </h5>
              )}

              {(card?.funnelStatus == "renter assigned" ||
                card?.funnelStatus == "transfered" || card?.funnelStatus == "renter transfered") ? (
                <></>
              ) : (
                <h5 className="text-[#47525E] text-[14px] ">
                  Next action:{" "}
                  <span className="text-[#47525E] font-[600]">
                    {nextStatus(card?.funnelStatus, card)}
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

              {/* <p className="text-[#47525E] text-[14px]">
                                            Financial credibility score:{" "}
                                            <span className="text-[#47525E] font-[600]">
                                                ---
                                            </span>
                                        </p> */}
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
                      }] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] `}
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
              </div>
            </>
          ) : (
            <></>
          )}
          {card?.funnel?.youtubeUrl &&
            <> <h4 className="text-[#47525E] text-[14px] font-[600] text-center mb-3">
              Current step training
            </h4>  <TrainingVideoCard
                key={i}
                title={card?.funnel?.title}
                duration={card?.funnel?.duration}
                videoId={videoId}
                thumbnail={methodModel.userImg(card?.funnel?.image)}
              /> </>
          }
          <div
            className="cursor-pointer text-center underline mb-4"
            onClick={(e) => history("/training")}
          >
            More Trainings
          </div>
        </div>
      </div>

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

      {/* <Dialog
            open={reqModal}
            onClose={() => setReqModal(false)}
            className="relative z-[9999]"
        >
            <DialogBackdrop className="fixed inset-0 bg-black/10" />
            <div className="fixed inset-0 flex w-screen items-center justify-center">
                <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                    <DialogTitle className="p-6">
                        fdf

                        <MdCancel className="text-[80px] mx-auto text-[#976DD0]" onClick={() => setReqModal(false)} />
                        <p className=" text-[#389D93] text-[18px] text-center pb-5 mt-5">
                            {card?.changeRequestNote}
                        </p>
                    </DialogTitle>
                </DialogPanel>
            </div>
        </Dialog> */}
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

      {answerApplication ? (
        <>
          <ApplicationModal
            answerApplication={answerApplication}
            onClose={() => setAnswerApplication()}
            result={(e) => {
              if (e.event == "submit") answerButton(e.value);
            }}
          />
        </>
      ) : (
        <></>
      )}

      {reviewModal ? (
        <>
          <Dialog
            open={reviewModal}
            onClose={() => {
              setReviewModal(false);
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
                          value: card?.review?.location,
                        },
                        {
                          name: "Property luminosity",
                          value: card?.review?.luminosity,
                        },
                        {
                          name: "Property Condition",
                          value: card?.review?.condition,
                        },
                        {
                          name: "Common areas condition",
                          value: card?.review?.areaCondition,
                        },
                        {
                          name: "Quality of property information shared",
                          value: card?.review?.propertyInformation,
                        },
                        {
                          name: "Peacefull setting",
                          value: card?.review?.peacefullSetting,
                        },
                      ]?.map((itm, i) => (
                        <div
                          key={i}
                          className="flex justify-between my-4 ms-6 md:items-center items-start md:flex-row flex-col "
                        >
                          <div className="flex items-center md:w-[65%] md:mb-0 mb-2 w-[100%]">
                            <FaArrowRight className="mr-2 text-[#976DD0] text-[12px]" />
                            <label className="block text-[14px] text-[#47525E] font-[600]">
                              {itm.name}
                            </label>
                          </div>
                          <div className="relative  md:w-[32%] w-[100%] flex justify-end me-6">
                            <div style={{ lineHeight: "23px" }}>
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
                    {card?.review?.note && (
                      <>
                        <div className="mt-6 border-t pt-4"></div>
                        <div className="flex justify-start mb-4 mx-6 flex-col ">
                          <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                            Note
                          </label>
                          <div className="relative  w-[100%] mb-3">
                            <p className="bg-[#efefef] p-3 rounded-[5px]">
                              {card?.review.note}{" "}
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
      ) : (
        <></>
      )}

      {isSign ? (
        <>
          <Dialog
            open={isSign ? true : false}
            onClose={() => setIsSign()}
            className="relative z-[9999]"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <DialogPanel className="max-w-md w-full bg-white rounded-[20px] shadow-lg">
                <DialogTitle className="p-3">
                  <div className="react-custom">
                    <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3">
                      You can select a date
                    </p>
                    <div className="py-5">
                      <DatePicker
                        selected={bookSlot}
                        onChange={(date) => setBookSlot(date)}
                        minDate={new Date()}
                        inline
                      />
                    </div>
                    <div className="flex border-t p-2 justify-between">
                      <button
                        type="button"
                        onClick={() => setIsSign()}
                        className="text-[#868389] text-[18px] underline"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => signSubmit()}
                        className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </DialogTitle>
              </DialogPanel>
            </div>
          </Dialog>
        </>
      ) : (
        <></>
      )}

      {answerSlotModal ? (
        <>
          <AnswerSlotModal
            result={(e) => {
              if (e.event == "accept") acceptAnswer(e.value);
              if (e.event == "book") changeSlot(e.value);
            }}
            date={answerSlotModal?.date}
            onClose={() => {
              setAnswerSlotModal();
            }}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
