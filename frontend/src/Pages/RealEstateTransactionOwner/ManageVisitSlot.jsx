import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdCheckmark } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { MdFolderOpen, MdMoreVert } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import VisitSlotModal from "./VisitSlotModal";
import { preSignDuration } from "../../utils/shared.utils";
import datepipeModel from "../../models/datepipemodel";
import UploadID from "../../components/common/Modal/UploadID";

const ManageVisitSlot = ({
  selectedProperty,
  setSelectedProperty,
  visitSlots,
  offerStatus,
  applicationAccepted,
  getCards,
  getData,
}) => {
  const { t } = useTranslation();

  const { user } = useSelector((state) => state);
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [error, setError] = useState({});
  const [idProofOpen, setidProofOpen] = useState(false);
  const signingSlots = useMemo(() => {
    const today = datepipeModel.datetostring(new Date().toISOString()); // Get today's date in YYYY-MM-DD format
    const upcomingSlots = selectedProperty?.signingSlots?.filter(
      (slot) => slot.date >= today
    );
    return upcomingSlots;
  }, [selectedProperty]);

  const homeInventorySlots = useMemo(() => {
    const today = datepipeModel.datetostring(new Date().toISOString()); // Get today's date in YYYY-MM-DD format
    const upcomingSlots = selectedProperty?.homeInventorySlots?.filter(
      (slot) => slot.date >= today
    );
    return upcomingSlots;
  }, [selectedProperty]);

  const slotsKey = {
    visitSlots,
    signingSlots,
    homeInventorySlots,
  };

  const openModal = ({
    title = "Manage visit slots",
    type = "visitSlots",
    isToggleButton = false,
  }) => {
    const duration = preSignDuration;
    setModal({
      title: title,
      type: type,
      visitSlot: [...(slotsKey[type] || [])],
      duration: type == "signingSlots" ? duration : null,
      isToggleButton,
    });
  };
  const closeModal = () => {
    setModal();
  };

  const saveSlots = async (visitS = [], toggle = false) => {
    let dto = {
      id: selectedProperty?._id,
      [modal.type]: visitS || [],
      identityVerified: true,
    };

    if (modal.isToggleButton) dto.autoInvite = toggle;

    loader(true);
    try {
      const res = await ApiClient.allApi("property/editProperty", dto, "put");
      if (res.success) {
        setModal();
        // getCards();
        getData({}, dto)
        setSelectedProperty((prev) => ({ ...prev, ...dto }));
      } else {
        console.error("Error saving slots:", res);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      loader(false);
    }
  };

  const [inviteModal, setInviteModal] = useState(false);
  const [invite, setInvite] = useState("");
  const [showActions, setShowActions] = useState(false);
  const actionMenuRef = useRef(null);
  const isRentProperty = selectedProperty?.propertyType === "rent";

  useEffect(() => {
    if (!showActions) return;
    const handleClickOutside = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showActions]);

  const applyInvite = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!invite) return setError({ ...error, email: t("validation.emailRequired") });
    if (!emailRegex.test(invite))
      return setError({ ...error, email: t("validation.invalidEmail") });

    const dto = {
      userId: user?._id,
      propertyId: selectedProperty?._id,
      email: invite,
    };
    loader(true);
    try {
      const res = await ApiClient.post("property/shareProperty", dto);
      if (res.success) {
        setInviteModal(false);
      } else {
        console.error("Error saving slots:", res);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      loader(false);
    }
  };

  return (
    <>
      <UploadID
        idProofOpen={idProofOpen}
        setidProofOpen={setidProofOpen}
        id={selectedProperty?._id}
      />
      <div className="relative flex items-center justify-center mb-4">
        <h4 className="text-black text-center font-[600] text-[18px]">
          {t("transactionOwner.manageLeads")}
        </h4>
        <div className="absolute right-0 top-1/2 -translate-y-1/2" ref={actionMenuRef}>
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setShowActions((prev) => !prev)}
          >
            <MdMoreVert className="text-xl text-slate-700" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-[220px] rounded-[12px] bg-white border border-gray-200 shadow-lg z-20">
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-[#343F4B] hover:bg-gray-100"
                onClick={() => {
                  openModal({ title: "Manage visit slots", type: "visitSlots", isToggleButton: true });
                  setShowActions(false);
                }}
              >
                {t("transactionOwner.manageVisitInvitations")}
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-[#343F4B] hover:bg-gray-100"
                onClick={() => {
                  openModal({ title: "Manage visit slots", type: "visitSlots", isToggleButton: true });
                  setShowActions(false);
                }}
              >
                {t("transactionOwner.visitSlots")}
              </button>
              {!isRentProperty && (
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm text-[#343F4B] hover:bg-gray-100"
                  onClick={() => {
                    if (!selectedProperty?._id) return toast.error("Select property");
                    const sellerFileUrl = `/seller-file?id=${selectedProperty?._id}`;
                    const newWindow = window.open(sellerFileUrl, "_blank", "noopener,noreferrer");
                    if (newWindow) newWindow.opener = null;
                    setShowActions(false);
                  }}
                >
                  {t("transactionOwner.dossierVendeur")}
                </button>
              )}
              <button
                type="button"
                className="w-full text-left px-4 py-3 text-sm text-[#343F4B] hover:bg-gray-100"
                onClick={() => {
                  if (!selectedProperty?._id) return toast.error("Select property");
                  setInviteModal(true);
                  setShowActions(false);
                }}
              >
                {t("transactionOwner.inviteLead")}
              </button>
              {(offerStatus || applicationAccepted) && (
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 text-sm text-[#343F4B] hover:bg-gray-100"
                  onClick={() => {
                    if (!selectedProperty?._id) return toast.error("Select property");
                    openModal({ title: "Manage signing slots", type: "signingSlots" });
                    setShowActions(false);
                  }}
                >
                  {t("transactionOwner.dateSignature")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="grid xl:grid-cols-5 lg:grid-cols-3  md:grid-cols-2 md:gap-3 gap-0 mb-6">
        <Dialog
          open={inviteModal}
          onClose={() => {
            setInviteModal(false);
            setInvite("");
          }}
          className="relative z-[9999]"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex w-screen items-center justify-center">
            <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
              <DialogTitle className="p-6">
                <p className="border-b text-[#389D93] text-[18px] text-center pb-5">
                  {t("transactionOwner.inviteEmailTitle")}
                </p>
                <div className="mt-6">
                  <div className="flex justify-center my-8 mx-6 flex-col ">
                    {/* <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                                            Email address
                                        </label> */}
                    <div className="relative  w-[100%] ">
                      <input
                        type="text"
                        value={invite}
                        onChange={(e) => {
                          setInvite(e.target.value?.trim());
                          setError({ ...error, email: "" });
                        }}
                        className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                        placeholder={t("forms.emailAddress")}
                      />
                      {error?.email && (
                        <p className="text-red-500 text-center mt-3">
                          {error?.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </DialogTitle>
              <div className="flex border-t p-3 justify-between">
                <button
                  onClick={() => {
                    setInviteModal(false);
                    setInvite("");
                  }}
                  className="text-[#868389] text-[18px] underline"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={() => applyInvite()}
                  className="bg-primary text-white px-3 py-2  rounded-[7px]"
                >
                  {t("common.save")}
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
        {/* home inventory */}
        {(selectedProperty?.propertyType == "rent" &&
          selectedProperty?.contractSigned) && (
            <div className=" relative cursor-pointer flex md:mb-0 mb-3">
              <div
                className=" w-full bg-white p-3 rounded-[12px] flex items-center flex-col"
                onClick={() => {
                  if (!selectedProperty?._id)
                    return toast.error("Select property");
                  openModal({
                    title: "Manage Home Inventory slots",
                    type: "homeInventorySlots",
                  });
                }}
              >
                <div className="bg-[#000000] w-[30px] h-[30px] rounded-full p-1 flex items-center justify-center  shrink-0 mb-5 mt-3">
                  <IoCalendarOutline className="text-white" />
                </div>
                <div className="text-center">
                  <h5 className="text-[#47525E] text-sm font-semibold">
                    {t("transactionOwner.homeInventoryDates")}
                  </h5>
                  <p className="text-[12px] text-[#47525E]">
                    {t("transactionOwner.slotOpened", {
                      count: selectedProperty?.homeInventorySlots?.length || 0,
                    })}
                  </p>
                </div>
              </div>
              <label
                className={`absolute md:-top-2 md:-right-1 right-3 top-1/2 md:translate-y-0 -translate-y-1/2 w-[20px] h-[20px]  rounded-full border-2 cursor-pointer flex items-center justify-center
                             ${selectedProperty?.homeInventorySlots?.length > 0
                    ? "bg-[#73339B] border-[#73339B] p-[10px] "
                    : "bg-white border-gray-300 p-[10px]"
                  }`}
              >
                {selectedProperty?.homeInventorySlots?.length > 0 && (
                  <span className="text-white text-lg">
                    <IoMdCheckmark />
                  </span>
                )}
              </label>
              {/* <label
                            className={`absolute md:-top-2 md:-right-1 right-3 top-1/2 md:translate-y-0 -translate-y-1/2 w-[20px] h-[20px]  rounded-full border-2 cursor-pointer flex items-center justify-center
                             ${selectedProperty?.inventorySlots?.length > 0
                                    ? "bg-[#73339B] border-[#73339B] p-[10px] "
                                    : "bg-white border-gray-300 p-[10px]"
                                }`}
                        >
                            {selectedProperty?.inventorySlots?.length > 0 && (
                                <span className="text-white text-lg">
                                    <IoMdCheckmark />
                                </span>
                            )}
                        </label> */}
            </div>
          )}
        {/* transfer ownership */}
        {selectedProperty?.contractSigned &&
          selectedProperty?.propertyType == "sale" ? (
          <>
            <div className=" relative cursor-pointer flex md:mb-0 mb-3">
              <div className=" w-full bg-white p-3 rounded-[12px] flex items-center flex-col">
                <div className="bg-[#000000] w-[30px] h-[30px] rounded-full p-1 flex items-center justify-center  shrink-0 mb-5 mt-3">
                  <MdFolderOpen className="text-white" />
                </div>
                <div className="text-center">
                  <h5 className="text-[#47525E] text-sm font-semibold">
                    {t("transactionOwner.transferOwnership")}
                  </h5>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {modal ? (
        <>
          <VisitSlotModal
            closeModal={closeModal}
            title={modal.title}
            visitSlot={modal.visitSlot}
            getData={getData}
            saveSlots={saveSlots}
            duration={modal.duration}
            isToggleButton={modal.isToggleButton}
            type={modal.type}
            toggleValue={selectedProperty?.autoInvite}
            propertyId={selectedProperty?.id || selectedProperty?._id}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ManageVisitSlot;
