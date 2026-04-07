import {
    capLetter,
    dateFormate,
    formatCurrency,
    imagePath,
} from "../../models/string.model";
import {
    Button,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import MsgHistory from "./MsgHistory";
import SlotModal from "./SlotModal";
import loader from "../../methods/loader";
import ApiClient from "../../methods/api/apiClient";
import ReviewModal from "./ReviewModal";
import ApplicationModal from "./ApplicationModal";
import FunnelIcons from "../RealEstateTransactionOwner/FunnelIcons";
import AnswerSlotModal from "./AnswerSlotModal";
import {
    landerCurrentStatus,
    landerNextStatus,
} from "../../utils/shared.utils";
import SlotBookModal from "./SlotBookModal";
import DirectMsgModal from "../PropertyDetails/DirectMsgModal";
import { useDispatch, useSelector } from "react-redux";
import { getRandomCode } from "../../models/shared.units";
import { login_success } from "../../actions/user";
import TrainingVideoCard from "./TrainingVideoCard";
import methodModel from "../../methods/methods";

export default function LanderCard({ card, i, result = (_) => { } }) {
    const history = useNavigate()
    const user = useSelector((state) => state.user);
    const [isOpencancel, setIsOpencancel] = useState(false);
    const [isReviewModal, setIsReviewModal] = useState();
    const [isApplication, setIsApplication] = useState();
    const [answerSlotModal, setAnswerSlotModal] = useState();
    const [error, setError] = useState({});
    const [slotBookModal, setSlotBookModal] = useState();
    const [visitSlots, setvisitSlots] = useState([]);
    const dispatch = useDispatch();
    const activePlan = useSelector((state) => state.activePlan);
    console.log(activePlan, "activePlan")
    const currentStatus = (status, card) => {
        return landerCurrentStatus(status, card);
    };
    const nextStatus = (status, card) => {
        return landerNextStatus(status, card);
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

    const videoId = getVideoId(card?.funnel?.youtubeUrl)
    const handleChange = (card, status, key, value) => {
        const filter = {
            interestId: card?._id,
            interestUpdatedTime: new Date(),
        };
        if (status) filter.funnelStatus = status;
        if (status == "visit accept by user") {
            filter.finalVisitDate = selectedSlot;
            filter.visitSlots = visitSlots;
            filter.icon1 = true;
        } else if (
            status == "request to change the visit slot" ||
            status == "request to change the pre-sale slot" ||
            status == "request to change the home inventory slot" ||
            status == "request to change the final signing slot"
        ) {
            filter.changeRequestNote = value?.requestNote || changeRequestNote;
        } else if (status == "application submit by user") {
            filter.applicationFile = value;
        } else if (status == "review submit by user") {
            filter.review = value;
        } else if (status == "offer accept by user") {
            filter.finalPrice = card.ownerPrice;
        } else if (status == "preslot booked by user") {
            filter.userPresale = value;
        }
        if (status == "preslot accept by user") {
            filter.finalSignSlot = value.slot;
            filter.icon1 = true;
        }
        if (status == "home inventory accept by user") {
            filter.finalHomeInventorySlot = value.slot;
        } else if (status == "saleslot accept by user") {
            filter.finalSaleSlot = value.slot;
        } else if (status == "contract signed by user") {
            filter.userSigned = true;
            filter.ownerSigned = true;
            filter.contractSigned = true;
        }

        if (key && key?.startsWith("icon")) {
            filter[key] = true;
        }

        if (
            (filter?.funnelStatus == "contract signed by owner" ||
                filter?.funnelStatus == "contract signed by user" ||
                filter?.funnelStatus == "renter transfered" ||
                filter?.funnelStatus == "renter assigned") &&
            card?.ownerSigned &&
            filter?.userSigned
        )
            filter.icon7 = true;
        loader(true);
        ApiClient.put("interests/statusChange", filter).then((res) => {
            if (res.success) {
                result({ event: "submitted" });
                setAnswerSlotModal();
                setIsOpencancel(false);
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

    const [slotModal, setSlotModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [changeRequestNote, setChangeRequestNote] = useState("");
    const [showRequestChange, setShowRequestChange] = useState(false);
    const [checkboxChecked, setCheckboxChecked] = useState(false);

    const [identityproof, setIdentityproof] = useState({
        identityProof: [],
        addressProof: [],
        salarySlips: [],
        otherDocs: [],
    });
    function openSlotModal(card) {
        setSlotModal(true);
    }
    function closeSlotModal() {
        setSlotModal(false);
    }

    useEffect(() => {
        if (user?.renterFiles) {
            setIdentityproof({
                ...identityproof,
                identityProof: user?.renterFiles?.identityProof || [],
            });
        }
    }, [user?.renterFiles]);

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
        // validate max limit files
        if (files.length + identityproof[key]?.length > maxLimit) {
            toast.error(`Maximum ${maxLimit} files allowed to add`);
            return (e.target.value = ""); // Clear file input
        }
        // validate max size
        const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
        const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
        if (oversizedFiles.length > 0) {
            toast.error(`Each file must be smaller than ${maxSize}MB`);
            return (e.target.value = "");
        }
        setError({ ...error, identityproof: "" });

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
                            checked: true,
                        };
                    });
                    if (data?.length + identityproof[key]?.length > maxLimit)
                        return toast.error(`Maximum ${maxLimit} files allowed to add`);
                    // setForm((prev) => ({
                    //   ...prev,
                    //   [key]: [...prev[key], ...data],
                    // }));
                    let sman = { ...identityproof };
                    sman = {
                        ...sman,
                        [key]: [...sman[key], ...data],
                    };
                    setIdentityproof(sman);
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
            renterFiles: form,
        };
        ApiClient.put("user/editUserDetails", payload)
            .then((res) => {
                if (res.success) {
                    toast.success(res?.message);
                    dispatch(login_success({ renterFiles: form }));
                }
            })
            .catch((err) => { })
            .finally(() => {
                loader(false);
            });
    };

    const actionSlotFunc = (card) => {
        if (identityproof?.identityProof?.length < 1) {
            setError({ ...error, identityproof: "Please upload identity proof" });
            return;
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
    const handleCheckboxChange = () => {
        setCheckboxChecked(!checkboxChecked);
        setShowRequestChange(!showRequestChange);
        setSelectedSlot(null);
        setChangeRequestNote("");
    };

    // const handleSlotChange = (date, time) => {
    //     const chosenSlot = { date, from: time.from, to: time.to };
    //     setSelectedSlot(chosenSlot);
    //     setCheckboxChecked(false);
    //     setChangeRequestNote('')
    // };

    const handleSlotChange = (date, time) => {
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

    const reviewSubmit = (e) => {
        handleChange(card, "review submit by user", "icon3", e);
    };

    const applicationSubmit = (e) => {
        handleChange(card, "application submit by user", "icon4", e);
    };

    const acceptAnswer = (p) => {
        handleChange(card, "preslot accept by user", "icon6");
    };

    const changeSlot = (p) => {
        if (!p) return toast.error("Select a date");
        if (
            dateFormate(new Date(p)) == dateFormate(new Date(answerSlotModal?.date))
        )
            return toast.error("Both dates are same");
        handleChange(card, "preslot booked by user", "", p);
    };

    const gotostart = (card) => {
        handleChange(card, "interest sent");
    };

    const saveBookSlot = (p) => {
        if (p.isRequest) {
            let status = "";
            if (slotBookModal.type == "preslot")
                status = "request to change the pre-sale slot";
            if (slotBookModal.type == "homeInventory")
                status = "request to change the home inventory slot";
            if (slotBookModal.type == "finalslot")
                status = "request to change the final signing slot";
            handleChange(slotBookModal?.card, status, "", p);
            setSlotBookModal();
        } else {
            let status = "";
            if (slotBookModal.type == "preslot") status = "preslot accept by user";
            if (slotBookModal.type == "homeInventory")
                status = "home inventory accept by user";
            if (slotBookModal.type == "finalslot") status = "saleslot accept by user";
            handleChange(slotBookModal?.card, status, "", p);
            setSlotBookModal();
        }
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

    const openhomeinventory = (card) => {
        setSlotBookModal({
            card: card,
            type: "homeInventory",
            slot: "",
            isRequest: false,
            requestNote: "",
            title: "Choose Home Inventory slot",
            visitSlots: card.propertyId?.homeInventorySlots || [],
        });
    };

    const rentalTransfer = (card) => {
        let payload = {
            interestId: card._id,
            funnelStatus: "renter transfered",
        };
        loader(true);
        ApiClient.post("interests/renterTransfer", payload)
            .then((res) => {
                if (res.success) {
                    result({ event: "submitted" });
                    handleChange(card, "renter transfered", "icon7");
                }
            })
            .finally(() => {
                loader(false);
            });
    };

    const [directMsg, setdirectMsg] = useState(false);
    const [detail, setDetail] = useState();
    const [defaultMsg, setDefaultMsg] = useState("");

    const handleChat = (data) => {
        setDetail(data?.propertyId);
        if (user.loggedIn) {
            setDefaultMsg("");
            return setdirectMsg(true);
        } else {
            //   setloginModal(true);
        }
    };


    return (
        <>
            <DirectMsgModal
                directMsg={directMsg}
                setdirectMsg={setdirectMsg}
                detail={detail}
                defaultMsg={defaultMsg}
                setDefaultMsg={setDefaultMsg}
            />
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
                        {(card?.propertyId?.city || card?.propertyId?.country) && (
                            <p className="text-[13.33px] text-[#47525E]">
                                {card?.propertyId?.city || card?.propertyId?.country}{" "}
                                {card?.propertyId?.zipcode
                                    ? "," + card?.propertyId?.zipcode
                                    : ""}
                            </p>
                        )}
                        <p className="text-[13.33px] text-[#47525E] mt-1">
                            For {card?.propertyId?.propertyType}
                        </p>
                        <span className="text-[#389D93] text-sm font-medium">
                            {card?.propertyId?.identityVerified
                                ? "Owner Identity Verified"
                                : "Owner Identity Not Verified"}
                        </span>
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
                                    {formatCurrency(card?.propertyId?.propertyMonthlyCharges)} €
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
                                            card?.propertyId?.price / card?.propertyId?.surface
                                        )?.toFixed(0)
                                    )}
                                    € /Sqm
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="px-4 min-h-[60]">
                        {/* {card?.funnelStatus} */}
                        <h5 className="text-[#47525E] text-[14px]">
                            Status:{" "}
                            <span className="text-[#47525E] font-[600] ms-1">
                                {currentStatus(card?.funnelStatus, card)}
                            </span>
                        </h5>
                        {/* {(activePlan?.[0]?.otherDetails?.leadsLevel?.key == "custom" && (activePlan?.[0]?.otherDetails?.leadsLevel?.value >= i + 1) || activePlan?.[0]?.otherDetails?.leadsLevel?.key == "unlimited") && (
                            <h5 className="text-[#47525E] text-[14px]">
                                Financial credibility score:{" "}
                                <span className="text-white bg-[#21C6BE] rounded-full p-1 w-[30px] h-[30px] flex items-center justify-center ms-2">
                                    {`${card?.buyerId?.documentGrade} `}
                                </span>
                            </h5>
                        )} */}
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
                        {/* <h5 className="text-[#47525E] text-[14px] ">
                        Identity Verification:{" "}
                        <span className="text-[#47525E] font-[600]">
                            {card?.propertyId?.identityVerified ? "Identity Verified" : "Identity Not Verified"}
                        </span>
                    </h5> */}
                        {+card?.buyerPrice?.amount > 0 && (
                            <h5 className="text-[#47525E] text-[14px]">
                                Offer:{" "}
                                <span className="text-[#21C6BE] font-[600] ms-1">
                                    {`${formatCurrency(card?.buyerPrice?.amount)}  €`}
                                </span>
                            </h5>
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

                <div className="flex gap-3 p-4 flex-wrap justify-center ">
                    {card?.funnelStatus != "cancelled" && (
                        <>
                            {(card?.funnelStatus == "invite user for a visit" ||
                                card?.funnelStatus == "owner changed the slot") && (
                                    <>
                                        <button
                                            className={`${card?.funnelStatus == "invite user for a visit" ||
                                                card?.funnelStatus == "owner changed the slot"
                                                ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                                : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                                                }`}
                                            onClick={() => openSlotModal(card)}
                                        >
                                            Book visit slot
                                        </button>
                                    </>
                                )}

                            {card?.funnelStatus == "visit hosted" && (
                                <>
                                    <button
                                        className={`${card?.funnelStatus == "visit hosted"
                                            ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                            : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                                            }`}
                                        onClick={() => setIsReviewModal(true)}
                                    >
                                        Review Visit
                                    </button>
                                    <button
                                        className={`${card?.funnelStatus == "visit hosted"
                                            ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                            : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                                            }`}
                                        onClick={() => {
                                            setIsApplication(card);
                                        }}
                                    >
                                        Submit Application
                                    </button>
                                </>
                            )}
                            {card?.funnelStatus == "review submit by user" && (
                                <>
                                    <button
                                        className={`${card?.funnelStatus == "review submit by user"
                                            ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                            : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                                            }`}
                                        onClick={() => {
                                            setIsApplication(card);
                                        }}
                                    >
                                        Submit Application
                                    </button>
                                </>
                            )}
                            {card?.funnelStatus == "offer submit by owner" && (
                                <>
                                    <button
                                        className={`${card?.funnelStatus == "offer submit by owner"
                                            ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                            : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                                            }`}
                                    // onClick={() => openOfferFunc(card)}
                                    >
                                        Answer
                                    </button>
                                </>
                            )}

                            {(card?.funnelStatus == "preslot opened by owner" ||
                                card?.funnelStatus == "owner changed the pre-signing slot") && (
                                    <>
                                        <button
                                            className={`${card?.funnelStatus == "preslot opened by owner" ||
                                                card?.funnelStatus == "owner changed the pre-signing slot"
                                                ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                                : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                                                }`}
                                            onClick={() => openPreSign(card)}
                                        >
                                            Book Pre-Signing date
                                        </button>
                                    </>
                                )}

                            {(card?.funnelStatus == "home inventory opened by owner" ||
                                card?.funnelStatus ==
                                "owner changed the home inventory slot") && (
                                    <>
                                        <button
                                            className={`${card?.funnelStatus == "home inventory opened by owner" ||
                                                card?.funnelStatus ==
                                                "owner changed the home inventory slot"
                                                ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                                : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                                                }`}
                                            onClick={() => openhomeinventory(card)}
                                        >
                                            Book home inventory slot
                                        </button>
                                    </>
                                )}

                            {card?.funnelStatus == "preslot accept by user" && (
                                <button
                                    className={`${card?.funnelStatus == "preslot accept by user"
                                        ? " border border-[#8492A6]  hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] bg-[#976DD0] hover:bg-[#976DD0]/80 text-white"
                                        : "text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]"
                                        }`}
                                    onClick={() =>
                                        handleChange(card, "contract signed by user", "icon6")
                                    }
                                >
                                    Confirm signing
                                </button>
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

                            {card?.funnelStatus == "offer refused by user" && (
                                <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
                                    Refused
                                </p>
                            )}
                            {card?.funnelStatus == "offer refused by owner" && (
                                <>
                                    <button
                                        // onClick={() => { openOffer(card); setSelectedCard(card) }}
                                        className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                                    >
                                        Edit
                                    </button>
                                </>
                            )}
                            {card?.funnelStatus == "preslot booked by user" && (
                                <p className="text-[#2DC9C1]  px-4 py-1 rounded-[35px] text-[14px] ">
                                    Booked
                                </p>
                            )}

                            {/* <button
                                className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px] "
                                onClick={() => gotostart(card)}
                            >
                                test start
                            </button> */}

                            {(card?.funnelStatus == "contract signed by owner" ||
                                card?.funnelStatus == "contract signed by user") && (
                                    <>
                                        <div className="text-[#21C6BE] text-[14px] flex items-center justify-center">
                                            Contract Signed
                                        </div>
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
                        onClick={openModal}
                        className="text-[#47525E] border border-[#8492A6] hover:bg-[#8492A6] hover:text-white transition px-4 py-1 rounded-[35px] text-[14px]  "
                    >
                        Transaction history
                    </button>
                    {!card?.finalSale && (
                        <button
                            className={`text-[#${card?.funnelStatus == "cancelled" ? "21C6BE" : "47525E"
                                }]
                    ${card?.funnelStatus == "cancelled"
                                    ? ""
                                    : "border border-[#8492A6] hover:bg-[#8492A6] hover:text-white"
                                }
                    transition
                    px-4 py-1 rounded-[35px] text-[14px]
                    ${card?.funnelStatus == "cancelled"
                                    ? "cursor-not-allowed"
                                    : ""
                                }`}
                            disabled={card?.funnelStatus == "cancelled"}
                            onClick={() => {
                                if (card?.funnelStatus != "cancelled") setIsOpencancel(true);
                            }}
                        >
                            {card?.funnelStatus == "cancelled" ? "Cancelled" : "Cancel"}
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
                        />  </>
                }
                <div className="cursor-pointer text-center underline" onClick={(e) => history("/training")}>More Trainings</div>
            </div>

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

            {isOpenMsg && (
                <MsgHistory isOpenMsg={isOpenMsg} closeModal={closeModal} i={i} card={card} />
            )}

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

            {isReviewModal ? (
                <>
                    <ReviewModal
                        result={(e) => {
                            if (e.event == "submit") {
                                reviewSubmit(e.value);
                            }
                        }}
                        onClose={() => {
                            setIsReviewModal();
                        }}
                    />
                </>
            ) : (
                <></>
            )}

            {isApplication ? (
                <>
                    <ApplicationModal
                        result={(e) => {
                            if (e.event == "submit") {
                                applicationSubmit(e.value);
                            }
                        }}
                        onClose={() => {
                            setIsApplication();
                        }}
                    />
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
        </>
    );
}
