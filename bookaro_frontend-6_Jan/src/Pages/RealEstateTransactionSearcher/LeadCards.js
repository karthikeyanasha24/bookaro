import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineDelete, AiOutlineYoutube } from "react-icons/ai";
import { BiSolidOffer } from "react-icons/bi";
import { FaArrowRight, FaCircleArrowDown, FaRegCirclePlay, FaRegEye } from "react-icons/fa6";
import { GoCheckCircleFill, GoLightBulb } from "react-icons/go";
import { IoMdCheckmark } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import ReactPaginate from "react-paginate";
import ReactStars from "react-rating-stars-component";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import {
  capLetter,
  dateFormate,
  downloadFile,
  formatCurrency,
  imagePath,
  stringSeprator,
} from "../../models/string.model";
import AnsSlotModal from "./AnsSlotModal";
import MsgHistory from "./MsgHistory";
import SlotModal from "./SlotModal";
import LanderCard from "./LanderCard";
import FunnelIcons from "../RealEstateTransactionOwner/FunnelIcons";
import { FiUpload } from "react-icons/fi";
import FormControl from "../../components/common/FormControl";
import socket from "../../config/ChatSocket/socket";
import {
  sellerCurrentStatus,
  sellerNextStatus,
} from "../../utils/shared.utils";
import SlotBookModal from "./SlotBookModal";
import { IoChatboxEllipsesOutline, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import DirectMsgModal from "../PropertyDetails/DirectMsgModal";
import { BsFiletypePdf } from "react-icons/bs";
import environment from "../../environment";
import pipeModel from "../../models/pipeModel";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { getRandomCode } from "../../models/shared.units";
import { login_success } from "../../actions/user";
import TrainingVideoCard from "./TrainingVideoCard";

const LeadCards = ({
  cards,
  getCards,
  totalCard,
  handlePageChange,
  filters,
  tabs,
  type,
  setType,
}) => {
  const history = useNavigate()
  const user = useSelector((state) => state.user);
  const [isOpenMsg, setIsOpenMsg] = useState(false);
  function closeModal() {
    setIsOpenMsg(false);
  }
  function openModal(card) {
    setcard(card);
    setIsOpenMsg(true);
  }
  const activePlan = useSelector((state) => state.activePlan);
  console.log(activePlan, "activePlan")

  const [isOpencancel, setIsOpencancel] = useState(false);
  const [isOpenBook, setIsOpenBook] = useState(false);
  const [bookSlot, setBookSlot] = useState(null);
  const [error, setError] = useState({});
  const [isOpenDoc, setIsOpenDoc] = useState(false);
  const [isOpenOffer, setIsOpenOffer] = useState();
  const [offer, setOffer] = useState("");
  const [preSlot, setPreSlot] = useState(null);
  const [saleSlot, setSaleSlot] = useState(null);
  const [slotBookModal, setSlotBookModal] = useState();
  const [visitSlots, setvisitSlots] = useState([]);
  const [card, setcard] = useState({});
  const [documentModule, setDocumentModule] = useState(false);
  const [documentData, setDocumentData] = useState();
  const [bankAmount, setBankAmount] = useState("");


  const openDialogBook = (card) => {
    setIsOpenBook(true);
    if (card?.ownerVisitDate) setBookSlot(card?.ownerVisitDate);
    setOffer(card?.ownerPrice || card?.buyerPrice || "");
    if (card?.ownerPresale) setPreSlot(card?.ownerPresale);
    if (card?.ownerSale) setSaleSlot(card?.ownerSale);
  };
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  // new work started
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotModal, setSlotModal] = useState(false);
  function openSlotModal(card) {
    setSlotModal(true);
  }
  function closeSlotModal() {
    setSlotModal(false);
  }
  const [showRequestChange, setShowRequestChange] = useState(false);
  const [changeRequestNote, setChangeRequestNote] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [identityproof, setIdentityproof] = useState({
    identityProof: [],
    familySituation: [],
    addressProof: [],
    salarySlips: [],
    bankStatement: [],
    taxNotice: [],
    personalContribution: [],
  });
  console.log(identityproof, "identiproof")
  const dispatch = useDispatch()
  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
    setShowRequestChange(!showRequestChange);
    setSelectedSlot(null);
    setChangeRequestNote("");
  };
  const actionSlotFunc = (card) => {
    if (identityproof?.identityProof?.length < 1) {
      setError({ ...error, identityproof: "Please upload identity proof" })
      return
    }
    if (checkboxChecked) {
      if (!changeRequestNote)
        return toast.error("Provide a note for your request");
      handleChange(card, "request to change the visit slot");
      closeSlotModal();
    } else {
      if (!selectedSlot) return toast.error("Select a slot");
      handleChange(card, "visit accept by user");
      closeSlotModal();
    }
  };
  // const handleSlotChange = (date, time) => {
  //     const chosenSlot = { date, from: time.from, to: time.to };
  //     setSelectedSlot(chosenSlot);
  //     setCheckboxChecked(false);
  //     setChangeRequestNote('')
  // };



  const downloadAll = async (e, allDocs) => {
    e.preventDefault();
    loader(true);
    const token = localStorage.getItem("token");
    const filesToDownload = Object.values(allDocs)
      .flat()
      .filter((doc) => doc?.checked)
      .map((doc) => doc.fileName);

    try {
      const response = await fetch(`${environment?.api}upload/zip-files`, {
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

  useEffect(() => {
    if (user?.buyerFiles) {
      setIdentityproof({
        ...identityproof,
        identityProof: user?.buyerFiles?.identityProof || [],
      });
    }
  }, [user?.buyerFiles]);

  const fileList = useCallback(
    (key) => {
      let arr = [];
      if (identityproof?.[key]?.length)
        // arr = form?.[key]?.filter((itm) => itm.property == selectProperty) || [];
        arr = identityproof?.[key] || [];
      return arr;
    },
    [identityproof, card?.propertyId?._id]
  );
  const viewDoc = (fileName) => {
    const url = imagePath(fileName);
    window.open(url, "_blank");
  };
  const deleteDoc = (i, key) => {
    let data = identityproof[key]?.filter((itm) => itm.id != i);
    let sman = { ...identityproof };
    sman = {
      ...sman,
      [key]: data,
    };
    setIdentityproof(sman);
    handleSubmit(sman);
  };
  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    let files = Array.from(e.target.files);
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`Each file must be smaller than ${maxSize}MB`);
      return (e.target.value = "");
    }
    setError({ ...error, identity: "" })

    loader(true);
    ApiClient.multiImageUpload(
      "upload/multiple-images",
      files, // filteredFiles,
      {},
      "files"
    )
      .then((res) => {
        if (res.success) {
          const data = res?.files?.map((item) => {
            return {
              fileName: item?.fileName,
              originalname: item?.originalname,
              property: card?.propertyId?._id,
              id: getRandomCode(16),
            };
          });
          // if (data?.length + form[key]?.length > maxLimit) return toast.error(`Maximum ${maxLimit} files allowed to add`);
          let sman = { ...identityproof };
          sman = {
            ...sman,
            [key]: [...data, ...(sman[key]?.length ? sman[key] : [])],
          };
          setIdentityproof((sman) => {
            return {
              ...sman,
              [key]: [...data, ...(sman[key]?.length ? sman[key] : [])],
            };
          });
          handleSubmit(sman);
        }
      })
      .catch((er) => console.log("err in file upload", er))
      .finally(() => {
        loader(false);
        e.target.value = "";
      });
  };
  const handleSubmit = (form) => {

    loader(true);
    const payload = {
      userId: user?.id || user?._id,
      buyerFiles: form,
    };
    ApiClient.put("user/editUserDetails", payload)
      .then((res) => {
        if (res.success) {
          toast.success(res?.message);
          dispatch(login_success({ buyerFiles: form }));
        }
      })
      .catch((err) => { })
      .finally(() => { loader(false) })
  };

  const handleSlotChange = (date, time, card) => {
    const chosenSlot = { date, from: time.from, to: time.to };
    setSelectedSlot(chosenSlot);
    setCheckboxChecked(false);
    setChangeRequestNote("");

    const updatedSlots = card.propertyId.visitSlots.map((slot) => {
      if (slot.date === date) {
        const updatedTimes = slot.times.map((t) => {
          if (t.from === time.from && t.to === time.to) {
            return { ...t, booked: true };
          }
          return t;
        });
        return { ...slot, times: updatedTimes };
      }
      return slot;
    });
    setvisitSlots(updatedSlots);
  };

  const [rating, setRating] = useState({
    location: null,
    luminosity: null,
    condition: null,
    areaCondition: null,
    propertyInformation: null,
    peacefullSetting: null,
  });
  const handleRating = (rate, key) => {
    setRating({ ...rating, [key]: rate });
  };

  const ratingArr = [
    { name: "Location Quality", value: "location" },
    { name: "Property luminosity", value: "luminosity" },
    { name: "Property Condition", value: "condition" },
    { name: "Common areas condition", value: "areaCondition" },
    {
      name: "Quality of property information shared",
      value: "propertyInformation",
    },
    { name: "Peacefull setting", value: "peacefullSetting" },
  ];
  const handleNotifyOwner = (card) => {
    const filter = {
      interestId: card?._id,
    };

    loader(true);
    ApiClient.post("interests/notifyOwner", filter).then((res) => {
      if (res.success) {
        toast.success(res.message);
        getCards();
      } else {
        toast.error(res.message);
      }

      loader(false);
    });
  };

  const handleChange = (card, status, key, value) => {
    const filter = {
      interestId: card?._id,
      interestUpdatedTime: new Date(),
    };
    if (status) filter.funnelStatus = status;
    if (status == "preslot accept by user") {
      filter.finalSignSlot = value.slot;
      filter.icon1 = true;
    } else if (status == "saleslot accept by user") {
      filter.finalSaleSlot = value.slot;
    } else if (status == "visit accept by user") {
      filter.finalVisitDate = selectedSlot;
      filter.visitSlots = visitSlots;

      filter.icon1 = true;
    } else if (
      status == "request to change the pre-sale slot" ||
      status == "request to change the final signing slot"
    ) {
      filter.changeRequestNote = value.requestNote;
    } else if (status == "request to change the visit slot") {
      filter.changeRequestNote = changeRequestNote;
    } else if (status == "offer submit by user") {
      if (isOpenOffer) {
        filter.buyerPrice = isOpenOffer;
      } else {
        filter.buyerPrice = {
          ...(card.buyerPrice || {}),
          amount: offer || card.buyerPrice?.amount || "",
        };
      }
    } else if (status == "review submit by user") {
      filter.review = rating;
      // delete filter.status;
    } else if (status == "offer accept by user") {
      filter.finalPrice = card.ownerPrice;
      filter.offerStatus = true;
    } else if (status == "preslot booked by user") {
      filter.userPresale = preSlot;
    } else if (status == "contract signed by user") {
      filter.userSigned = true;
      filter.ownerSigned = true;
      filter.contractSigned = true;
    } else if (status == "saleslot booked by user") {
      filter.userSale = saleSlot;
    } else if (status == "confirmation by user") {
      filter.userConfirmation = true;
      filter.icon7 = true;
    }

    if (key && key?.startsWith("icon")) {
      filter[key] = true;
    }
    loader(true);
    ApiClient.put("interests/statusChange", filter).then((res) => {
      if (res.success) {
        getCards();
        setIsOpencancel(false);
        if (filter.funnelStatus == "offer accept by user") {
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

  const currentStatus = (status, card) => {
    return sellerCurrentStatus(status, card);
  };
  const nextStatus = (status, card) => {
    return sellerNextStatus(status, card);
  };

  const [activeTab, setActiveTab] = useState("accept");
  const [openAnsSlotModal, setOpenAnsSlotModal] = useState(false);
  function openAnsSlotFunc(card) {
    if (!card) return;
    setOpenAnsSlotModal(true);
    if (card?.ownerVisitDate) setBookSlot(card?.ownerVisitDate);
    if (card?.ownerPresale) setPreSlot(card?.ownerPresale);
    if (card?.ownerSale) setSaleSlot(card?.ownerSale);
  }
  function closeAnsSlotFunc() {
    setOpenAnsSlotModal(false);
    setActiveTab("accept");
  }
  const actionAnsAcceptSlotFunc = (card) => {
    handleChange(card, "visit accept by user");
  };
  const actionAnsSlotFunc = (card) => {
    if (!bookSlot) return toast.error("Select a date");
    if (
      dateFormate(new Date(bookSlot)) ==
      dateFormate(new Date(card?.userVisitDate))
    )
      return toast.error("Both dates are same");
    handleChange(card, "slot booked by user", "icon1");
  };

  const [openOfferModal, setOpenOfferModal] = useState(false);
  function openOfferFunc(card) {
    if (!card) return;
    setOpenOfferModal(true);
    setOffer(card?.ownerPrice || card?.buyerPrice || "");
  }
  function closeOfferFunc() {
    setActiveTab("accept");
    setOpenOfferModal(false);
  }

  const actionAnsAcceptPreSlotFunc = (card) => {
    handleChange(card, "preslot accept by user");
  };
  const actionAnsPreSlotFunc = (card) => {
    if (!preSlot) return toast.error("Select a date");
    if (
      dateFormate(new Date(preSlot)) == dateFormate(new Date(card?.userPresale))
    )
      return toast.error("Both dates are same");
    handleChange(card, "preslot booked by user");
  };

  const [selectedCard, setSelectedCard] = useState();

  const openOffer = (card) => {
    setIsOpenOffer({
      id: card._id,
      validity_date: card?.buyerPrice?.validity_date || "",
      move_in: card?.buyerPrice?.move_in || "",
      amount: card?.buyerPrice?.amount || "",
      fundingType: card?.buyerPrice?.fundingType || [],
      conditions: card?.buyerPrice?.conditions || [],
      bank: card?.buyerPrice?.bank || {},
      agree: card?.buyerPrice?.agree || false,
    });
  };

  const offerSubmit = () => {
    // if(!isOpenOffer?.documents?.length){
    //     toast.error("Please upload documents")
    //     return
    // }

    if (
      !isOpenOffer?.conditions?.length &&
      isOpenOffer?.fundingType?.includes("Bank Loan")
    ) {
      toast.error("Please select conditions");
      return;
    }

    handleChange(selectedCard, "offer submit by user", "icon4");
    setIsOpenOffer();
  };

  const updateBank = useCallback((payload) => {
    setIsOpenOffer((prev) => ({
      ...prev,
      bank: {
        ...prev.bank,
        ...payload,
      },
    }));
  }, []);

  const uploaddocument = (e) => {
    let files = e.target.files;

    if (!files.length) {
      return;
    }

    loader(true);
    ApiClient.multiImageUpload(
      "upload/multiple-images",
      files, // filteredFiles,
      {},
      "files"
    )
      .then((res) => {
        if (res.success) {
          const allFiles = res?.files?.map((item) => {
            return {
              fileName: item?.fileName,
              originalname: item?.originalname,
            };
          });

          let data = [...(isOpenOffer?.documents || []), ...allFiles];
          setIsOpenOffer((prev) => ({ ...prev, documents: data }));
        }
      })
      .catch((er) => console.log("err in file upload", er))
      .finally(() => {
        loader(false);
        e.target.value = "";
      });
  };

  const removeDocument = (index) => {
    setIsOpenOffer((prev) => {
      let documents = prev.documents || [];
      documents = documents.filter((_, i) => i != index);
      return { ...prev, documents: documents };
    });
  };

  const conditions = useMemo(() => {
    let arr = [
      "Setting up a bridging loan",
      "No easements",
      "No pre-emption",
      "Obtaining administrative authorisation",
      "Obtaining authorisation from the condominium association",
      "Prior sale of the property",
      "Transfer of rights to another end buyer",
      "Construction Work-related events",
      "Obtaining a bank loan",
    ].filter((itm) => !isOpenOffer?.conditions?.includes(itm));
    return arr.map((itm) => ({ name: itm, id: itm }));
  }, [isOpenOffer?.conditions]);

  const addCondition = (p) => {
    setIsOpenOffer((prev) => {
      let conditions = [...(prev.conditions || [])];
      conditions.push(p);
      return { ...prev, conditions: conditions };
    });
  };

  const removeCondition = (index) => {
    setIsOpenOffer((prev) => {
      let conditions = [...(prev.conditions || [])];
      conditions = conditions.filter((_, i) => i != index);
      return { ...prev, conditions: conditions };
    });
  };



  const openPreSign = (card) => {
    setSlotBookModal({
      card: card,
      type: "preslot",
      slot: "",
      isRequest: false,
      requestNote: "",
      title: "Choose Pre-sale date",
      visitSlots: card.propertyId?.signingSlots || [],
    });
  };

  const saveBookSlot = (p) => {
    if (p.isRequest) {
      let status = "";
      if (slotBookModal.type == "preslot")
        status = "request to change the pre-sale slot";
      if (slotBookModal.type == "finalslot")
        status = "request to change the final signing slot";
      handleChange(slotBookModal?.card, status, "", p);
      setSlotBookModal();
    } else {
      let status = "";
      if (slotBookModal.type == "preslot") status = "preslot accept by user";
      if (slotBookModal.type == "finalslot") status = "saleslot accept by user";
      handleChange(slotBookModal?.card, status, "", p);
      setSlotBookModal();
    }
  };

  const getDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysBetween =
    isOpenOffer?.validity_date && isOpenOffer?.move_in
      ? getDaysBetween(isOpenOffer.validity_date, isOpenOffer.move_in)
      : null;

  const daysFromTodayToValidity = isOpenOffer?.validity_date
    ? getDaysBetween(new Date(), isOpenOffer.validity_date)
    : null;

  // console.log(daysBetween);

  const bookFinal = (card) => {
    // handleChange(card,'interest sent')
    setSlotBookModal({
      card: card,
      type: "finalslot",
      slot: "",
      isRequest: false,
      requestNote: "",
      title: "Choose final signing date",
      visitSlots: card.propertyId?.signingSlots || [],
    });
  };

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



  const gotostart = (card) => {
    handleChange(card, "interest sent");
  };

  const [directMsg, setdirectMsg] = useState(false);
  const [detail, setDetail] = useState();
  const [defaultMsg, setDefaultMsg] = useState("");

  const handleChat = (data) => {
    setDetail(data?.propertyId);
    if (user.loggedIn) {
      setDefaultMsg("");
      setdirectMsg(true);
      return;
    } else {
    }
  };

  return (
    <div>
      <DirectMsgModal
        directMsg={directMsg}
        setdirectMsg={setdirectMsg}
        detail={detail}
        defaultMsg={defaultMsg}
        setDefaultMsg={setDefaultMsg}
      />
      <ul className="flex items-center my-8 justify-center">
        {tabs.map((itm, i) => (
          <li
            onClick={() => setType(itm.value)}
            key={i}
            className={`${itm.value === type ? "text-[#21C6BE]" : "text-[#000000]"
              } text-[14px] me-5 cursor-pointer`}
          >
            {itm.name}
          </li>
        ))}
      </ul>
      {cards?.length > 0 && (
        <h2 className="text-center text-[#343F4B] mb-10">
          {totalCard} propert{totalCard > 1 ? "ies" : "y"} in your transaction
          funnel
        </h2>
      )}
      {cards?.length > 0 ? (
        <div className="grid grid-cols-12 md:gap-10 gap-0">
          {cards?.map((card, i) => {
            const videoId = getVideoId(card?.funnel?.youtubeUrl)
            return (
              <Fragment key={card._id}>
                {card.propertyType == "rent" ? (
                  <>
                    <LanderCard
                      card={card}
                      i={i}
                      result={(e) => {
                        if ((e.event = "submitted")) {
                          getCards();
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* <LanderCard card={card} result={e=>{
                                if(e.event='submitted'){
                                    getCards()
                                }
                            }} /> */}

                    <div className="xl:col-span-4 md:col-span-6 col-span-full bg-white border border-[#BEBEBE] rounded-[12px] relative py-2 md:mb-0 mb-4">
                      <div>
                        <div className="absolute top-0 -left-6">
                          <img
                            alt=""
                            src={imagePath(
                              card?.propertyId?.images?.[0]?.file,
                              "assets/img/man.jpg"
                            )}
                            className="w-[50px] h-[50px] rounded-full object-cover shrink-0"
                          />
                        </div>
                        <div className="px-10">
                          <h5 className="text-[13.33px] font-semibold">
                            {capLetter(card?.propertyId?.propertyTitle)}
                          </h5>
                          {(card?.propertyId?.city ||
                            card?.propertyId?.country) && (
                              <p className="text-[13.33px] text-[#47525E]">
                                {card?.propertyId?.city ||
                                  card?.propertyId?.country}{" "}
                                {card?.propertyId?.zipcode
                                  ? "," + card?.propertyId?.zipcode
                                  : ""}
                              </p>
                            )}
                          <p className="text-[13.33px] text-[#47525E] mt-1">
                            For {card?.propertyId?.propertyType}
                          </p>
                          <span className="text-[#389D93] text-sm font-medium">{card?.propertyId?.identityVerified ? "Owner Identity Verified" : "Owner Identity Not Verified"}</span>
                        </div>
                        <div className="border-t pt-2 px-4 my-2">
                          <ul className="flex  ">
                            {+card?.propertyId?.surface > 0 && (
                              <li className="flex items-center gap-1 text-[#47525E] text-[13.33px] me-4">
                                <img
                                  src="assets/img/prop/home.png"
                                  className="h-[15px] w-[14px]"
                                  alt="img"
                                />
                                {card?.propertyId?.surface} m2
                              </li>
                            )}
                            {+card?.propertyId?.rooms > 0 && (
                              <li className="flex items-center gap-1 text-[#47525E] text-[13.33px] me-4">
                                <img
                                  src="assets/img/prop/bed.png"
                                  className="h-[12px] w-[13px]"
                                  alt="img"
                                />
                                {card?.propertyId?.rooms || 0}
                              </li>
                            )}
                            {+card?.propertyId?.bathroom > 0 && (
                              <li className="flex items-center gap-1 text-[#47525E] text-[13.33px] me-4">
                                <img
                                  src="assets/img/bed.png"
                                  className="h-[12px] w-[14px]"
                                  alt="img"
                                />
                                {card?.propertyId?.bathroom || 0}
                              </li>
                            )}
                            {card?.propertyId?.energy_efficient && (
                              <li className="flex items-center gap-1 text-[#47525E] text-[13.33px]">
                                <img
                                  src="assets/img/header/bulb.png"
                                  className=" w-[14px]"
                                  alt="img"
                                />
                                DPE : {card?.propertyId?.energy_efficient}
                              </li>
                            )}
                          </ul>
                          {card?.propertyId?.propertyType === "rent" && (
                            <div className="flex items-center gap-2 mt-1">
                              <h3 className="text-[19px] font-semibold">
                                {formatCurrency(
                                  card?.propertyId?.propertyMonthlyCharges ||
                                  15000
                                )}{" "}
                                €
                              </h3>
                            </div>
                          )}
                          {card?.propertyId?.propertyType === "sale" && (
                            <div className="flex items-center gap-2 mt-1">
                              <h3 className="text-[19px] font-semibold">
                                {formatCurrency(card?.propertyId?.price)} €
                              </h3>
                              <span className="text-[#47525E] text-[13.33px]">
                                {formatCurrency(
                                  (
                                    card?.propertyId?.price /
                                    card?.propertyId?.surface
                                  )?.toFixed(0)
                                )}
                                € /Sqm
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="px-4 min-h-[60px]">
                          {/* {card?.funnelStatus} */}
                          <h5 className="text-[#47525E] text-[14px]">
                            Status:{" "}
                            <span className="text-[#47525E] font-[600] ms-1">
                              {currentStatus(card?.funnelStatus, card)}
                            </span>
                          </h5>
                          {(card?.funnelStatus == "offer sent") && <h5 className="text-[#47525E] text-[14px] ">
                            Offer amount:{" "}
                            <span className="text-[#47525E] font-[600]">
                              {card?.makeOfferAmount}
                            </span>
                          </h5>
                          }
                          {(card?.funnelStatus == "renter assigned" || card?.funnelStatus == "transfered" || card?.funnelStatus == "renter transfered") ? <></> : <h5 className="text-[#47525E] text-[14px] ">
                            Next action:{" "}
                            <span className="text-[#47525E] font-[600]">
                              {nextStatus(card?.funnelStatus, card)}
                            </span>
                          </h5>
                          }

                          {+card?.buyerPrice?.amount > 0 && (
                            <h5 className="text-[#47525E] text-[14px]">
                              Offer amount:{" "}
                              <span className="text-[#21C6BE] font-[600] ms-1">
                                {`${formatCurrency(card?.buyerPrice?.amount)}  €`}
                              </span>
                            </h5>
                          )}

                          {Array.isArray(card?.buyerPrice?.conditions) &&
                            card.buyerPrice.conditions.length > 0 && (
                              <h5 className="text-[#47525E] text-[14px]">
                                Suspensive conditions:{" "}
                                <span className="font-[600] ms-1">
                                  {formatCurrency(
                                    card.buyerPrice.conditions.length
                                  )}
                                </span>
                              </h5>
                            )}

                          {card?.buyerPrice?.fundingType?.length > 0 && (
                            <div className="my-2">
                              <span className="block text-[#47525E] font-[600] text-[14px]">
                                Funding types:
                              </span>

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

                            </div>
                          )}
                          <p className="text-[#47525E] text-[14px]">
                            Persons in the pipeline:{" "}
                            <span className="text-[#47525E] font-[600]">
                              {card?.totalLeads || 0}
                            </span>
                          </p>
                        </div>
                      </div>
                      <h4 className="text-[#47525E] font-semibold pb-2 border-b-[1px] border-[#976DD0] pt-4 mx-4">
                        {capLetter(
                          card?.propertyType == "rent"
                            ? "Rental"
                            : card?.propertyType || "purchase"
                        )}{" "}
                        funnel
                      </h4>
                      <FunnelIcons card={card} />

                      <div className="flex gap-3  flex-wrap justify-center p-4">

                        {isOpencancel ? (
                          <>
                            <Dialog
                              open={true}
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
                          </>
                        ) : (
                          <></>
                        )}

                        {card?.funnelStatus != "cancelled" && (
                          <>
                            {(card?.funnelStatus == "invite user for a visit" ||
                              card?.funnelStatus ==
                              "owner changed the slot") && (
                                <>
                                  <button
                                    className={`${(
                                      card?.funnelStatus == "invite user for a visit" ||
                                      card?.funnelStatus == "owner changed the slot"
                                    ) ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                      : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                    onClick={() => openSlotModal(card)}
                                  >
                                    Book visit slot
                                  </button>
                                  <SlotModal
                                    slotModal={slotModal}
                                    closeSlotModal={closeSlotModal}
                                    card={card}
                                    actionSlotFunc={actionSlotFunc}
                                    selectedSlot={selectedSlot}
                                    handleSlotChange={handleSlotChange}
                                    checkboxChecked={checkboxChecked}
                                    handleCheckboxChange={handleCheckboxChange}
                                    showRequestChange={showRequestChange}
                                    changeRequestNote={changeRequestNote}
                                    setChangeRequestNote={setChangeRequestNote}
                                    viewDoc={viewDoc}
                                    deleteDoc={deleteDoc}
                                    fileList={fileList}
                                    identityproof={identityproof}
                                    setIdentityproof={setIdentityproof}
                                    ImageUpload={ImageUpload}
                                    setError={setError}
                                    error={error}
                                  />
                                </>
                              )}
                            {/* {card?.funnelStatus == "request to change the visit slot" && (
                                            <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
                                                Requested
                                            </p>
                                        )} */}
                            {/* {(card?.funnelStatus == "slot booked by user" ||
                                            card?.funnelStatus == "visit accept by owner") && (
                                                <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] "
                                                >
                                                    Booked
                                                </p>
                                            )} */}

                            {/* {card?.funnelStatus == "slot booked by owner" && (
                                            <>
                                                <button className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                                                    onClick={() => openAnsSlotFunc(card)}
                                                >
                                                    Answer
                                                </button>
                                                <AnsSlotModal
                                                    openAnsSlotModal={openAnsSlotModal}
                                                    closeAnsSlotFunc={closeAnsSlotFunc}
                                                    card={card}
                                                    activeTab={activeTab}
                                                    setActiveTab={setActiveTab}
                                                    bookSlot={bookSlot}
                                                    setBookSlot={setBookSlot}
                                                    actionAnsSlotFunc={actionAnsSlotFunc}
                                                    actionAnsAcceptSlotFunc={actionAnsAcceptSlotFunc}
                                                    acceptDate={card?.ownerVisitDate}
                                                />
                                            </>
                                        )} */}
                            {(card?.funnelStatus == "visit hosted" ||
                              card?.funnelStatus ==
                              "buyer requested for document" ||
                              card?.funnelStatus ==
                              "document send by owner") && (
                                <>
                                  <button
                                    className={`${(card?.funnelStatus == "visit hosted" ||
                                      card?.funnelStatus ==
                                      "buyer requested for document" ||
                                      card?.funnelStatus ==
                                      "document send by owner") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                      : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                    onClick={() => setIsOpenDoc(true)}
                                  >
                                    Review Visit
                                  </button>
                                  {isOpenDoc ? (
                                    <>
                                      <Dialog
                                        open={isOpenDoc}
                                        onClose={() => setIsOpenDoc(false)}
                                        className="relative z-[9999]"
                                      >
                                        <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                        <div className="fixed inset-0 flex w-screen items-center justify-center px-10">
                                          <DialogPanel className="max-w-md w-full bg-white rounded-[20px] ">
                                            <DialogTitle className="">
                                              <p className="border-b text-[#389D93] text-[18px] text-center py-5 px-3">
                                                You can enter the review about the
                                                property
                                              </p>
                                              <div className="mt-6">
                                                <div className="rating-section">
                                                  <h2 className="text-[16px] font-bold text-[#333] mb-4 ms-6">
                                                    Rate the Criteria
                                                  </h2>
                                                  {ratingArr?.map((itm, i) => (
                                                    <div className="flex justify-between my-4 ms-6 md:items-center items-start md:flex-row flex-col ">
                                                      <div className="flex items-center md:w-[65%] md:mb-0 mb-2 w-[100%]">
                                                        <FaArrowRight className="mr-2 text-[#976DD0] text-[14px]" />
                                                        <label className="block text-[14px] text-[#47525E] font-[600]">
                                                          {itm.name}
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
                                                            onChange={(e) =>
                                                              handleRating(
                                                                e,
                                                                itm.value
                                                              )
                                                            }
                                                            size={23}
                                                            value={
                                                              rating?.[
                                                              itm.value
                                                              ] || 0
                                                            }
                                                            isHalf={true}
                                                            emptyIcon={
                                                              <i className="far fa-star"></i>
                                                            }
                                                            halfIcon={
                                                              <i className="fa fa-star-half-alt"></i>
                                                            }
                                                            fullIcon={
                                                              <i className="fa fa-star"></i>
                                                            }
                                                            activeColor="#976DD0"
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                                <div className="mt-6 border-t pt-4"></div>
                                                <div className="flex justify-start mb-4 mx-6 flex-col ">
                                                  <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                                                    Note
                                                  </label>
                                                  <div className="relative  w-[100%] mb-3">
                                                    <textarea
                                                      type="text"
                                                      value={rating.note}
                                                      onChange={(e) => {
                                                        setRating({
                                                          ...rating,
                                                          note: e.target.value,
                                                        });
                                                      }}
                                                      className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                                                      placeholder="Type here..."
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex border-t p-3 justify-between">
                                                <button
                                                  onClick={() =>
                                                    setIsOpenDoc(false)
                                                  }
                                                  className="text-[#868389] text-[18px] underline"
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    const isInvalid =
                                                      Object.values(rating).some(
                                                        (value) => value === null
                                                      );
                                                    if (isInvalid)
                                                      return toast.error(
                                                        "Enter ratings for all"
                                                      );
                                                    setIsOpenDoc(false);
                                                    handleChange(
                                                      card,
                                                      "review submit by user",
                                                      "icon3"
                                                    );
                                                  }}
                                                  className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                >
                                                  Save
                                                </button>
                                              </div>
                                            </DialogTitle>
                                          </DialogPanel>
                                        </div>
                                      </Dialog>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {/* {card?.funnelStatus == "visit hosted" && (
                                    <button
                                      className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                                      onClick={() => {
                                        openOffer(card);
                                        setSelectedCard(card);
                                      }}
                                    >
                                     Make an Offer
                                    </button>
                                  )} */}
                                </>
                              )}
                            {(card?.funnelStatus == "review submit by user" ||
                              card?.funnelStatus == "document send by owner" ||
                              card?.funnelStatus == "buyer requested for document") && (
                                <>
                                  <button
                                    className={`${(card?.funnelStatus == "review submit by user" ||
                                      card?.funnelStatus == "document send by owner" ||
                                      card?.funnelStatus == "buyer requested for document") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                      : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                    onClick={() => {
                                      openOffer(card);
                                      setSelectedCard(card);
                                    }}
                                  >
                                    Make an Offer
                                  </button>
                                </>
                              )}
                            {card?.funnelStatus == "visit hosted" && (
                              <>
                                <button
                                  className={`${(card?.funnelStatus == "visit hosted") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                    : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                  onClick={() =>
                                    handleChange(
                                      card,
                                      "buyer requested for document"
                                    )
                                  }
                                >
                                  Request Seller Files
                                </button>
                              </>
                            )}


                            {card?.funnelStatus == "offer submit by owner" && (
                              <>
                                <button
                                  className={`${(card?.funnelStatus == "offer submit by owner") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                    : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                  onClick={() => openOfferFunc(card)}
                                >
                                  Answer
                                </button>
                                <Dialog
                                  open={openOfferModal}
                                  onClose={closeOfferFunc}
                                  className="relative z-[9999]"
                                >
                                  <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                  <div className="fixed inset-0 flex items-center justify-center z-50">
                                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px] shadow-lg">
                                      <DialogTitle className="p-3">
                                        <div className="react-custom">
                                          <div className="flex space-x-4 border-b border-gray-200">
                                            <button
                                              onClick={() =>
                                                setActiveTab("accept")
                                              }
                                              className={`flex-1 py-3 text-center text-[14px] font-medium ${activeTab === "accept"
                                                ? "border-b-4 border-[#976DD0] text-[#976DD0] bg-[#e6f9f4] transition-all duration-200"
                                                : "text-[#47525E] hover:bg-[#f0f0f0] transition-all duration-200"
                                                } flex justify-center items-center space-x-2`}
                                            >
                                              <GoCheckCircleFill className="text-[#976DD0] text-lg" />
                                              <span>Accept the offer</span>
                                            </button>
                                            <button
                                              onClick={() =>
                                                setActiveTab("refuse")
                                              }
                                              className={`flex-1 py-3 text-center text-[14px] font-medium ${activeTab === "refuse"
                                                ? "border-b-4 border-[#976DD0] text-[#976DD0] bg-[#e6f9f4] transition-all duration-200"
                                                : "text-[#47525E] hover:bg-[#f0f0f0] transition-all duration-200"
                                                } flex justify-center items-center space-x-2`}
                                            >
                                              <MdCancel className="text-[#976DD0] text-lg" />
                                              <span>Refuse</span>
                                            </button>
                                            <button
                                              onClick={() =>
                                                setActiveTab("counter")
                                              }
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
                                            <div className="py-4 my-8">
                                              <h3 className="text-center text-[#47525E]  px-4">
                                                By accepting, you confirm the
                                                offer of{" "}
                                                <span className="flex items-center text-[#47525E] justify-center mt-3 font-[600] bg-[#efefef] px-3 py-2 rounded-[4px] mx-auto w-fit ">
                                                  {`${formatCurrency(
                                                    card?.ownerPrice
                                                  )}  €`}
                                                </span>
                                              </h3>
                                            </div>
                                          )}
                                          {activeTab === "refuse" && (
                                            <div className="py-4">
                                              <h3 className="text-center text-[#47525E] my-8 px-4">
                                                Are you sure you want to refuse
                                                the offer of{" "}
                                                <span className="flex items-center text-[#47525E] justify-center mt-3 font-[600] bg-[#efefef] px-3 py-2 rounded-[4px] mx-auto w-fit ">
                                                  {`${formatCurrency(
                                                    card?.ownerPrice
                                                  )}  €`}
                                                </span>
                                              </h3>
                                            </div>
                                          )}

                                          {/* {(activePlan?.[0]?.otherDetails?.leadsLevel?.key == "custom" && (activePlan?.[0]?.otherDetails?.leadsLevel?.value >= i + 1) || activePlan?.[0]?.otherDetails?.leadsLevel?.key == "unlimited") && (
                                            <h5 className="text-[#47525E] text-[14px]">
                                              Financial credibility score:{" "}
                                              <span className="text-white bg-[#21C6BE] rounded-full p-1 w-[30px] h-[30px] flex items-center justify-center ms-2">
                                                {`${card?.buyerId?.documentGrade} `}
                                              </span>
                                            </h5>
                                          )} */}

                                          {activeTab === "counter" && (
                                            <div className="my-8 px-4">
                                              <div className="flex justify-start mt-3 flex-col ">
                                                <label className="mb-2 block text-[15px] text-[#47525E] font-[600]">
                                                  Offer amount*
                                                </label>
                                                <div className="relative  w-[100%] mb-8">
                                                  <input
                                                    type="text"
                                                    value={formatCurrency(
                                                      offer
                                                    )}
                                                    onChange={(e) => {
                                                      let value =
                                                        e.target.value;
                                                      value = value.replace(
                                                        /[^0-9]/g,
                                                        ""
                                                      );
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
                                              onClick={closeOfferFunc}
                                              className="text-[#868389] text-[18px] underline"
                                            >
                                              Cancel
                                            </button>
                                            {activeTab === "accept" ? (
                                              <button
                                                onClick={() =>
                                                  handleChange(
                                                    card,
                                                    "offer accept by user"
                                                  )
                                                }
                                                className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                              >
                                                Accept
                                              </button>
                                            ) : activeTab === "refuse" ? (
                                              <button
                                                onClick={() =>
                                                  handleChange(
                                                    card,
                                                    "offer refused by user"
                                                  )
                                                }
                                                className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                              >
                                                Refuse
                                              </button>
                                            ) : (
                                              <button
                                                onClick={() => {
                                                  if (+offer < 0)
                                                    return toast.error(
                                                      "Enter amount"
                                                    );
                                                  if (offer == card?.ownerPrice)
                                                    return toast.error(
                                                      "Both amounts are same"
                                                    );
                                                  handleChange(
                                                    card,
                                                    "offer submit by user",
                                                    "buyerPrice"
                                                  );
                                                }}
                                                className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                              >
                                                Save
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
                            {card?.funnelStatus == "offer refused by user" && (
                              <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
                                Refused
                              </p>
                            )}
                            {card?.funnelStatus == "offer refused by owner" && (
                              <>
                                <button //onClick={() => openDialogBook(card)}
                                  onClick={() => {
                                    openOffer(card);
                                    setSelectedCard(card);
                                  }}
                                  className={`${(card?.funnelStatus == "offer refused by owner") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                    : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
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
                                      <DialogTitle className="">
                                        <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3">
                                          You can select a date
                                        </p>
                                        <div className="mt-8 px-4">
                                          <div className="flex justify-start flex-col ">
                                            <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                                              Offer amount*
                                            </label>
                                            <div className="relative  w-[100%] mb-10">
                                              <input
                                                type="text"
                                                value={formatCurrency(offer)}
                                                onChange={(e) => {
                                                  let value = e.target.value;
                                                  value = value.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                  );
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
                                        <div className="flex border-t p-3 justify-between">
                                          <button
                                            onClick={() => setIsOpenBook(false)}
                                            className="text-[#868389] text-[18px] underline"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            onClick={() => {
                                              if (+offer < 0)
                                                return toast.error(
                                                  "Enter amount"
                                                );
                                              if (offer == card?.ownerPrice)
                                                return toast.error(
                                                  "Both amounts are same"
                                                );
                                              handleChange(
                                                card,
                                                "offer submit by user",
                                                "buyerPrice"
                                              );
                                            }}
                                            className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                          >
                                            Save
                                          </button>
                                        </div>
                                      </DialogTitle>
                                    </DialogPanel>
                                  </div>
                                </Dialog>
                              </>
                            )}
                            {card?.funnelStatus ==
                              "preslot booked by owner" && (
                                <>
                                  <button
                                    className={`${(card?.funnelStatus == "preslot booked by owner") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                      : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                    onClick={() => openAnsSlotFunc(card)}
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
                                    actionAnsAcceptSlotFunc={
                                      actionAnsAcceptPreSlotFunc
                                    }
                                    acceptDate={card?.ownerPresale}
                                  />
                                </>
                              )}
                            {(card?.funnelStatus == "preslot opened by owner" ||
                              card?.funnelStatus ==
                              "owner changed the pre-signing slot") && (
                                <>
                                  <button
                                    className={`${(card?.funnelStatus == "preslot opened by owner" ||
                                      card?.funnelStatus == "owner changed the pre-signing slot") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                      : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                    onClick={() => openPreSign(card)}
                                  >
                                    Book Pre-Signing date
                                  </button>
                                </>
                              )}
                            {card?.funnelStatus == "preslot booked by user" && (
                              <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
                                Booked
                              </p>
                            )}
                            {card?.funnelStatus == "preslot accept by user" && (
                              <button
                                className={`${(card?.funnelStatus == "preslot accept by user") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                  : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                onClick={() =>
                                  handleChange(
                                    card,
                                    "contract signed by user",
                                    "icon6"
                                  )
                                }
                              >
                                Confirm signing
                              </button>
                            )}
                            {(card?.funnelStatus ==
                              "saleslot booked by owner" ||
                              card?.funnelStatus ==
                              "owner changed the final signing slot") && (
                                <>
                                  <button
                                    className={`${(card?.funnelStatus ==
                                      "saleslot booked by owner" ||
                                      card?.funnelStatus ==
                                      "owner changed the final signing slot") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                      : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                    onClick={() => bookFinal(card)}
                                  >
                                    Book Final Sale Signing Date
                                  </button>
                                </>
                              )}

                            {/* <button
                              className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                              onClick={() => gotostart(card)}
                            >
                              test start
                            </button> */}
                            {card?.funnelStatus ==
                              "saleslot accept by user" && (
                                <div onClick={open} className="">
                                  <button
                                    className={`${(card?.funnelStatus == "saleslot accept by user") ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                      : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"}`}
                                    onClick={() =>
                                      handleChange(card, "confirmation by user")
                                    }
                                  >
                                    Final Contract Signed
                                  </button>
                                </div>
                              )}
                            {(card?.funnelStatus == "confirmation by user" ||
                              card?.funnelStatus ==
                              "confirmation by owner") && (
                                <div onClick={open} className="">
                                  <button
                                    className={`${((card?.funnelStatus == "confirmation by user" ||
                                      card?.funnelStatus ==
                                      "confirmation by owner") && !card?.propertyTransferRequest) ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                      : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"} ${card?.propertyTransferRequest ? "bg-[#8492A6] text-white" : ""}`}
                                    onClick={() => handleNotifyOwner(card)}
                                    disabled={card?.propertyTransferRequest}
                                  >
                                    {card?.propertyTransferRequest
                                      ? "Requested"
                                      : "Request Property Transfer"}
                                  </button>
                                </div>
                              )}
                            {card?.documents && (
                              <>
                                <button
                                  className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                                  onClick={() => {
                                    setDocumentModule(true);
                                    setDocumentData(card);
                                  }}
                                >
                                  View Seller File
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
                                        <p className="border-b text-[#389D93] relative text-[18px] text-center py-5 px-3">
                                          Document Detail
                                          <span
                                            onClick={() => {
                                              setDocumentModule(false);
                                              setDocumentData();
                                            }}
                                            className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer"
                                          >
                                            <IoClose
                                              className="text-black"
                                              size={22}
                                            />
                                          </span>
                                        </p>
                                        <div className="text-end px-3 py-2">
                                          <button
                                            onClick={(e) =>
                                              downloadAll(e, documentData?.documents)
                                            }
                                            className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                          >
                                            Download All
                                          </button>
                                        </div>
                                        <div className="p-6 max-h-[400px] overflow-y-scroll">
                                          <div className="rating-section">
                                            {documentData?.documents && (
                                              <>
                                                {documentData?.documents?.addressProof
                                                  ?.length > 0 && (
                                                    <>
                                                      <p>Address Proof</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.addressProof?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                {documentData?.documents?.carrezLaw
                                                  ?.length > 0 && (
                                                    <>
                                                      <p>Carrez Law</p>
                                                      <div className="">
                                                        {documentData?.documents?.carrezLaw?.map(
                                                          (itm) => {
                                                            return (
                                                              <div className="flex flex-wrap  mt-4 mb-6 gap-5">
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                {documentData?.documents?.coOwnership
                                                  ?.length > 0 && (
                                                    <>
                                                      <p>Co Ownership</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.coOwnership?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                {documentData?.documents
                                                  ?.condominiumBooklet?.length >
                                                  0 && (
                                                    <>
                                                      <p>Condominium Booklet</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.condominiumBooklet?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                {documentData?.documents
                                                  ?.familySituation?.length >
                                                  0 && (
                                                    <>
                                                      <p>Family Situation</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.familySituation?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                {documentData?.documents?.identityProof
                                                  ?.length > 0 && (
                                                    <>
                                                      <p>Identity Proof</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.identityProof?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}

                                                {documentData?.documents
                                                  ?.minutesOfGeneral?.length >
                                                  0 && (
                                                    <>
                                                      <p>Minutes Of General</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.minutesOfGeneral?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}

                                                {documentData?.documents
                                                  ?.personalContribution
                                                  ?.length > 0 && (
                                                    <>
                                                      <p>Personal Contribution</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.personalContribution?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                {documentData?.documents
                                                  ?.technicalDiagnostic
                                                  ?.length > 0 && (
                                                    <>
                                                      <p>Technical Diagnostic</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.technicalDiagnostic?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                {documentData?.documents?.titleDeed
                                                  ?.length > 0 && (
                                                    <>
                                                      <p>Title Deed</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.titleDeed?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </>
                                                  )}
                                                {documentData?.documents?.otherDocs
                                                  ?.length > 0 && (
                                                    <>
                                                      <p>Other Relevant Docs</p>
                                                      <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                        {documentData?.documents?.otherDocs?.map(
                                                          (itm) => {
                                                            return (
                                                              <>
                                                                <BsFiletypePdf className="text-[24px] me-3" />
                                                                <span className="text-[#383A3D] text-[12px]">
                                                                  {stringSeprator(
                                                                    itm?.originalname,
                                                                    30
                                                                  )}
                                                                </span>{" "}
                                                                <p
                                                                  onClick={() =>
                                                                    downloadFile(
                                                                      itm?.fileName
                                                                    )
                                                                  }
                                                                  title="preview"
                                                                  className="cursor-pointer text-[#383A3D] text-[14px]"
                                                                >
                                                                  <FaRegEye />
                                                                </p>
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                      </div>
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
                          </>
                        )}
                        <button
                          onClick={() => {
                            handleChat(card);
                          }}
                          className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]  "
                        >
                          Message
                        </button>
                        <button
                          onClick={() => openModal(card)}
                          className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]  "
                        >
                          Transaction History
                        </button>
                        {!card?.finalSale && (
                          <button
                            className={`text-[#${card?.funnelStatus == "cancelled"
                              ? "21C6BE"
                              : "47525E"
                              }] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] `}
                            disabled={card?.funnelStatus == "Cancelled"}
                            onClick={() => {
                              if (card?.funnelStatus != "cancelled")
                                setIsOpencancel(true);
                            }}
                          >
                            {card?.funnelStatus == "cancelled"
                              ? "Cancelled"
                              : "Cancel"}
                          </button>
                        )}
                      </div>
                      {card?.funnel?.youtubeUrl &&
                        <> <h4 className="text-[#47525E] text-[14px] font-[600] text-center mb-3">
                          Current step training
                        </h4>  <TrainingVideoCard
                            key={i}
                            title={card?.funnel?.title}
                            duration={card?.funnel?.duration}
                            videoId={videoId}
                            thumbnail={methodModel.userImg(card?.funnel?.image)}
                          /></>
                      }
                      <div className="cursor-pointer text-center underline" onClick={(e) => history("/training")}>More Trainings</div>
                    </div>
                  </>
                )}
              </Fragment>
            );
          })}
          <div
            className={`paginationWrapper xl:flex-row flex-col ${totalCard > filters?.limit ? "" : "d-none"
              }`}
          >
            <span className="xl:mb-0 mb-2 block">
              Show {cards?.length} from {totalCard} Properties
            </span>
            <ReactPaginate
              previousLabel="<Pre"
              nextLabel="Next>"
              breakLabel="..."
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              pageCount={Math.ceil(totalCard / filters.limit)}
              onPageChange={handlePageChange}
              forcePage={filters.page - 1}
              containerClassName={"pagination flex"}
              pageClassName={"pagination-item"}
              activeClassName={"pagination-item-active"}
            />
          </div>
        </div>
      ) : (
        <>
          <div>
            <img
              src="assets/img/transaction/transaction2.png"
              alt=""
              className="w-[250px] rounded-[5px] mx-auto"
            />
          </div>
          <p className="text-black font-[600] text-[20px] text-center my-5 max-w-xs mx-auto">
            Properties your are targeting either for rental or purchase will be
            listed here.{" "}
          </p>
          <div className="mt-10">
            <p className="bg-white w-full h-[2px] max-w-md mx-auto"></p>
          </div>
          <div className="flex items-center justify-center mt-10">
            <GoLightBulb className="text-[24px] me-3" />
            <h3 className="text-[#343F4B] font-[700] text-[20px]">
              Selling alone training
            </h3>
          </div>
          <div className="p-3  border-[2px] border-[#976DD0] rounded-[12px] bg-white md:max-w-sm max-w-full mx-auto flex justify-between  my-6">
            <p className="text-[#47525E] md:text-[18px] md:w-[60%] text-[16px] w-[50%]">
              What to check before signing a sale contract?
            </p>
            <div className="flex items-center">
              <AiOutlineYoutube className="text-[30px] text-[#8492A6]" />
              <label
                className={` w-[25px] h-[25px]  ms-3 rounded-full border-2 cursor-pointer flex items-center justify-center
                                    ${true
                    ? "bg-[#73339B] border-[#73339B] p-[10px] "
                    : "bg-white border-gray-300 p-[10px]"
                  }`}
              >
                {true && (
                  <span className="text-white text-lg">
                    <IoMdCheckmark />
                  </span>
                )}
              </label>
            </div>
          </div>
          <div className="p-3  border-[2px] border-[#976DD0] rounded-[12px] bg-white md:max-w-sm max-w-full mx-auto flex justify-between">
            <p className="text-[#47525E] md:text-[18px] md:w-[60%] text-[16px] w-[50%]">
              How should this signature happen?
            </p>
            <div className="flex items-center">
              <AiOutlineYoutube className="text-[30px] text-[#8492A6]" />
              <label
                className={` w-[25px] h-[25px]  ms-3 rounded-full border-2 cursor-pointer flex items-center justify-center
                                    ${false
                    ? "bg-[#73339B] border-[#73339B] p-[10px] "
                    : "bg-white border-gray-300 p-[10px]"
                  }`}
              >
                {false && (
                  <span className="text-white text-lg">
                    <IoMdCheckmark />
                  </span>
                )}
              </label>
            </div>
          </div>
        </>
      )}
      {isOpenMsg && (
        <MsgHistory isOpenMsg={isOpenMsg} closeModal={closeModal} card={card} />
      )}

      {isOpenOffer ? (
        <>
          <Dialog
            open={true}
            onClose={() => {
              setIsOpenOffer();
              setSelectedCard();
            }}
            className="relative z-[9999]"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <DialogPanel className="max-w-md w-full bg-white rounded-[20px] shadow-lg">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    offerSubmit();
                  }}
                >
                  <DialogTitle className=" ">
                    <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3 p-3">
                      You can select a date
                    </p>
                    <div>
                      <ul className="p-6 h-[300px] overflow-auto">
                        <li className="mb-4">
                          <label className="text-[#5A5A5A] text-[15px] font-semibold mb-2 block">
                            Select your offer validity date <span className="text-[#FF0000]">*</span>
                          </label>
                          <input
                            type="date"
                            placeholder="Select validity date"
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full border border-[#976DD0] rounded-[8px] px-3 py-2"
                            value={isOpenOffer?.validity_date || ""}
                            onChange={(e) => {
                              setIsOpenOffer((prev) => ({
                                ...prev,
                                validity_date: e.target.value,
                              }));
                            }}
                            required
                          />
                          {daysFromTodayToValidity !== null && (
                            <p className="text-sm text-gray-600 mt-2 text-green-600">
                              Offer validity is in {daysFromTodayToValidity} day
                              {daysFromTodayToValidity !== 1 ? "s" : ""}.
                            </p>
                          )}
                        </li>
                        <li className="mb-4">
                          <label className="text-[#5A5A5A] text-[15px] font-semibold mb-2 block">
                            When would you like to move in? <span className="text-[#FF0000]">*</span>
                          </label>
                          <input
                            type="date"
                            placeholder="Enter a date"
                            value={isOpenOffer?.move_in || ""}
                            min={
                              isOpenOffer?.validity_date
                                ? new Date(
                                  new Date(
                                    isOpenOffer.validity_date
                                  ).getTime() + 86400000
                                )
                                  .toISOString()
                                  .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              setIsOpenOffer((prev) => ({
                                ...prev,
                                move_in: e.target.value,
                              }));
                            }}
                            required
                            className="w-full border border-[#976DD0] rounded-[8px] px-3 py-2"
                          />
                          {daysBetween !== null && (
                            <p className="text-sm text-gray-600 mt-2 text-green-600">
                              Move-in is {daysBetween} day
                              {daysBetween !== 1 ? "s" : ""} after the offer
                              validity date.
                            </p>
                          )}
                        </li>
                        <li className="mb-4">
                          <label className="text-[#5A5A5A] text-[15px] font-semibold mb-2 block">
                            Purchase proposed amount <span className="text-[#FF0000]">*</span>
                          </label>
                          <div className="relative">
                            {" "}
                            <input
                              type="text"
                              placeholder="Enter amount"
                              className="w-full border border-[#976DD0] rounded-[8px] px-3 py-2"
                              value={isOpenOffer?.amount || ""}
                              onChange={(e) => {
                                setIsOpenOffer((prev) => ({
                                  ...prev,
                                  amount: methodModel.isNumber(e),
                                }));
                              }}
                              required
                            />
                            <p className="text-[#5A5A5A] text-[14px] absolute right-3 top-2.5 bg-white">
                              EUR
                            </p>
                          </div>
                        </li>
                        <li className="mb-4">
                          <label className="text-[#5A5A5A] text-[15px] font-semibold mb-2 block">
                            How will you fund your purchase? <span className="text-[#FF0000]">*</span>
                          </label>
                          <ul>
                            {[
                              "Personal financial contribution",
                              "Sell my property",
                              "Bank Loan",
                            ].map((itm, i) => (
                              <li key={i} className="mb-1">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="w-3 h-3 rounded-[4px] border border-[#976DD0]"
                                    checked={
                                      isOpenOffer?.fundingType?.includes(itm) ||
                                      false
                                    }
                                    required={isOpenOffer?.fundingType?.length == 0}
                                    onChange={(e) => {
                                      setIsOpenOffer((prev) => {
                                        const newFundingTypes = prev.fundingType
                                          ? [...prev.fundingType]
                                          : [];
                                        if (e.target.checked) {
                                          newFundingTypes.push(itm);
                                        } else {
                                          const index =
                                            newFundingTypes.indexOf(itm);
                                          if (index > -1)
                                            newFundingTypes.splice(index, 1);
                                        }
                                        return {
                                          ...prev,
                                          fundingType: newFundingTypes,
                                          conditions:
                                            !e.target.checked &&
                                              itm == "Bank Loan"
                                              ? []
                                              : prev.conditions,
                                          bank:
                                            !e.target.checked &&
                                              itm == "Bank Loan"
                                              ? {}
                                              : prev.bank,
                                        };
                                      });
                                    }}
                                  />
                                  <p className="text-[#5A5A5A] ms-2">{itm}</p>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mb-4">
                          <label className="text-[#5A5A5A] text-[15px] font-semibold  block">
                            Want to attach a relevant document?
                          </label>
                          <p className="text-[#5A5A5A] italic">
                            i.e. an agreement from bank may favour you offer
                          </p>
                          {isOpenOffer.documents?.map((item, i) => {
                            return (
                              <div
                                className="flex mt-5 gap-1 align-items-end"
                                key={`${i}_document`}
                              >
                                <a
                                  target="_new"
                                  href={methodModel.noImg(item.fileName)}
                                  className="border-b border-dashed pb-1 w-[90%]"
                                >
                                  {item.originalname}
                                </a>
                                <AiOutlineDelete
                                  className="cursor-pointer text-[17px] ms-1 w-[10%]"
                                  onClick={() => removeDocument(i)}
                                />
                              </div>
                            );
                          })}

                          <div className="relative mt-4">
                            <label className="flex items-center justify-center">
                              <FiUpload className="text-[#976DD0] text-[20px]" />
                              <p className="ms-2 text-[16px]">
                                Upload a Document
                              </p>
                            </label>
                            <div>
                              <input
                                type="file"
                                onChange={uploaddocument}
                                multiple
                                className="w-fit opacity-0 absolute top-0"
                              />
                            </div>
                          </div>
                        </li>

                        <li className="mb-4">
                          <label className="text-[#5A5A5A] text-[15px] font-semibold mb-2 block">
                            Want to include suspensive conditions?
                          </label>

                          {isOpenOffer?.conditions.map((itm, i) => (
                            <li
                              key={i}
                              className="mb-1 border-b border-dashed border-[#CECCD2] py-2"
                            >
                              {itm == "Obtaining a bank loan" ? (
                                <>
                                  <div className="border-b border-[#ADACAF]">
                                    {itm}
                                  </div>
                                  <div className="flex items-center gap-3 mt-3 pb-3 ">
                                    <div className="relative border border-[#976DD0] w-[50%] rounded-[8px] px-3 py-2">
                                      <input
                                        type="text"
                                        placeholder="Enter amount"
                                        value={bankAmount !== "" ? pipeModel.number(bankAmount) : ""}
                                        onChange={(e) => {
                                          const raw = e.target.value.replace(/,/g, "");
                                          if (!isNaN(raw)) {
                                            setBankAmount(raw);
                                            updateBank({ amount: raw });
                                          }
                                        }}
                                        required
                                        className="w-full text-[15px]"
                                      />


                                      <p className="text-[#5A5A5A] text-[14px] absolute right-3 top-2.5 bg-white">
                                        €
                                      </p>
                                    </div>
                                    <div className="relative text-[#5A5A5A] text-[15px] w-[30%] border border-[#976DD0] bg-transparent  rounded-[8px] px-3 py-2 h-[40px]">
                                      <select
                                        value={isOpenOffer?.bank?.duration}
                                        onChange={(e) => {
                                          updateBank({
                                            duration: e.target.value,
                                          });
                                        }}
                                        required
                                        className="bg-transparent flex"
                                      >
                                        <option>Duration</option>

                                        {Array.from({ length: 30 }).map(
                                          (_, i) => {
                                            return (
                                              <option key={i + 1} value={i + 1}>
                                                {i + 1} year
                                              </option>
                                            );
                                          }
                                        )}
                                      </select>
                                      {/* <FaCircleArrowDown className="absolute top-0 right-2"/> */}
                                    </div>

                                    <div className="relative border border-[#976DD0] w-[30%] rounded-[8px] px-3 py-2">
                                      <input
                                        type="number"
                                        placeholder="Rate"
                                        value={isOpenOffer?.bank?.rate}
                                        onChange={(e) => {
                                          updateBank({
                                            rate: methodModel.isNumber(e),
                                          });
                                        }}
                                        required
                                        className="w-full "
                                      />
                                      <p className="text-[#5A5A5A] text-[14px] absolute right-3 top-2.5 bg-white">
                                        %
                                      </p>
                                    </div>


                                    <AiOutlineDelete
                                      className="cursor-pointer text-[17px] ms-1 w-[10%] ml-auto"
                                      onClick={() => removeCondition(i)}
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <label className="flex gap-3 items-center">
                                    <p className="w-full border border-[#976DD0] rounded-[8px] px-3 py-2 text-[15px]">
                                      {itm}
                                    </p>
                                    <AiOutlineDelete
                                      className="cursor-pointer text-[17px] ms-1 w-[10%] ml-auto"
                                      onClick={() => removeCondition(i)}
                                    />
                                  </label>
                                </>
                              )}
                            </li>
                          ))}

                          {conditions.length ? (
                            <>
                              <div>
                                <FormControl
                                  type="select"
                                  className="flex justify-center"
                                  placeholder={`Add ${isOpenOffer?.conditions?.length
                                    ? "another"
                                    : ""
                                    } conditon`}
                                  buttonClass="flex text-primary font-bold justify-center"
                                  noDefault
                                  onChange={(e) => {
                                    addCondition(e);
                                  }}
                                  options={conditions}
                                />
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </li>
                      </ul>
                    </div>
                  </DialogTitle>
                  <div className="bg-[#F3F6F4] p-4 mt-5 ">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name=""
                        checked={isOpenOffer?.agree || ""}
                        onChange={(e) => {
                          setIsOpenOffer((prev) => ({
                            ...prev,
                            agree: e.target.checked,
                          }));
                        }}
                        required
                        className="w-3 h-3 rounded-[4px] border border-[#976DD0]"
                      />
                      <p className="text-[#5A5A5A] ms-2 text-[14px]">
                        By sending this offer I understand that I share my
                        unequivocal desire to buy the following property:
                      </p>
                    </label>
                    <div className="flex items-center mt-2">
                      <div className="me-3">
                        <img
                          src={imagePath(
                            selectedCard?.propertyId?.images?.[0]?.file
                          )}
                          alt=""
                          className="w-[30px] h-[30px] object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <h5 className="text-[#47525E] font-semibold text-[14px]">
                          {capLetter(
                            stringSeprator(
                              selectedCard?.propertyId?.propertyTitle,
                              25
                            )
                          )}
                        </h5>
                        <p className="text-[#47525E] text-[14px]">
                          {stringSeprator(
                            selectedCard?.propertyId?.address,
                            50
                          ) || "Address not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t p-2 justify-between">
                    <button
                      className="text-[#868389] text-[18px] underline"
                      type="button"
                      onClick={() => {
                        setIsOpenOffer();
                        setSelectedCard();
                      }}
                    >
                      Cancel
                    </button>
                    <button className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]">
                      Submit Offer
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </div>
          </Dialog>
        </>
      ) : (
        <></>
      )}

      {slotBookModal ? (
        <>
          <SlotBookModal
            title={slotBookModal.title}
            value={slotBookModal}
            visitSlots={slotBookModal.visitSlots}
            close={() => setSlotBookModal()}
            save={saveBookSlot}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LeadCards;
