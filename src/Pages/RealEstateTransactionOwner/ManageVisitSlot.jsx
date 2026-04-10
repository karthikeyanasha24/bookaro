import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdCheckmark } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { MdFolderOpen } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const applyInvite = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!invite) return setError({ ...error, email: "Enter email address." });
    if (!emailRegex.test(invite))
      return setError({ ...error, email: "Enter valid email address." });

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
      <h4 className="text-black text-center mb-10 font-[600] text-[18px]">
        Manage your leads
      </h4>
      <div className="grid xl:grid-cols-5 lg:grid-cols-3  md:grid-cols-2 md:gap-3 gap-0 mb-16">
        {/* visit slots */}

        <div className=" relative cursor-pointer flex md:mb-0 mb-3">
          <div
            className=" w-full bg-white p-3 rounded-[12px] flex items-center flex-col"
            onClick={() => {
              if (!selectedProperty?._id) return toast.error("Select property");
              // if (!selectedProperty?.sellerFiles?.identityProof?.length)
              //   return setidProofOpen(true);
              openModal({
                title: "Manage visit slots",
                type: "visitSlots",
                isToggleButton: true,
              });
            }}
          >
            <div className="bg-[#000000] w-[30px] h-[30px] rounded-full p-1 flex items-center justify-center  shrink-0 mb-5 mt-3">
              <IoCalendarOutline className="text-white" />
            </div>
            <div className="text-center">
              <h5 className="text-[#47525E] text-sm font-semibold">
                Manage visit slots
              </h5>
              <p className="text-[12px] text-[#47525E]">
                {slotsKey?.visitSlots?.length || 0} slot
                {slotsKey?.visitSlots?.length > 1 ? "s" : ""} opened | Automatic
                invites {selectedProperty?.autoInvite ? "ON" : "OFF"}
              </p>
            </div>
          </div>
          <label
            className={`absolute md:-top-2 md:-right-1 right-3 top-1/2 md:translate-y-0 -translate-y-1/2 w-[20px] h-[20px]  rounded-full border-2 cursor-pointer flex items-center justify-center
                             ${slotsKey?.visitSlots?.length > 0
                ? "bg-[#73339B] border-[#73339B] p-[10px] "
                : "bg-white border-gray-300 p-[10px]"
              }`}
          >
            {slotsKey?.visitSlots?.length > 0 && (
              <span className="text-white text-lg">
                <IoMdCheckmark />
              </span>
            )}
          </label>
        </div>
        {/* seller files */}
        <div className=" relative cursor-pointer flex md:mb-0 mb-3">
          <div
            className=" w-full bg-white p-3 rounded-[12px] flex items-center flex-col"
            onClick={() => {
              if (!selectedProperty?._id) return toast.error("Select property");
              else navigate(`/seller-file?id=${selectedProperty?._id}`);
            }}
          >
            <div className="bg-[#000000] w-[30px] h-[30px] rounded-full p-1 flex items-center justify-center  shrink-0 mb-5 mt-3">
              <MdFolderOpen className="text-white" />
            </div>
            <div className="text-center">
              <h5 className="text-[#47525E] text-sm font-semibold">
                Seller files
              </h5>
              <p className="text-[12px] text-[#47525E]">
                {selectedProperty?.sellerFilesCount || 0} documents added
              </p>
            </div>
          </div>
          <label
            className={`absolute md:-top-2 md:-right-1 right-3 top-1/2 md:translate-y-0 -translate-y-1/2 w-[20px] h-[20px]  rounded-full border-2 cursor-pointer flex items-center justify-center
                             ${+selectedProperty?.sellerFilesCount > 0
                ? "bg-[#73339B] border-[#73339B] p-[10px] "
                : "bg-white border-gray-300 p-[10px]"
              }`}
          >
            {+selectedProperty?.sellerFilesCount > 0 && (
              <span className="text-white text-lg">
                <IoMdCheckmark />
              </span>
            )}
          </label>
        </div>
        {/* invite */}
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
                  Enter email address you want to invite
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
                        placeholder="Email address"
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
                  Cancel
                </button>
                <button
                  onClick={() => applyInvite()}
                  className="bg-primary text-white px-3 py-2  rounded-[7px]"
                >
                  Save
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
        <div className=" relative cursor-pointer flex md:mb-0 mb-3">
          <div
            className=" w-full bg-white p-3 rounded-[12px] flex items-center flex-col"
            onClick={() => {
              if (!selectedProperty?._id) return toast.error("Select property");
              setInviteModal(true);
            }}
          >
            <div className="bg-[#000000] w-[30px] h-[30px] rounded-full p-1 flex items-center justify-center  shrink-0 mb-5 mt-3">
              <AiOutlineUser className="text-white" />
            </div>
            <div className="text-center">
              <h5 className="text-[#47525E] text-sm font-semibold">
                Invite a lead
              </h5>
            </div>
          </div>
        </div>
        {/* signing dates */}
        <div className=" relative cursor-pointer flex md:mb-0 mb-3">
          <div
            className={`w-full bg-white p-3 rounded-[12px] flex items-center flex-col ${(offerStatus || applicationAccepted)?"":"cursor-not-allowed"}`}
            onClick={() => {
              if (!selectedProperty?._id) return toast.error("Select property");
              if (offerStatus || applicationAccepted) {
                openModal({
                  title: "Manage signing slots",
                  type: "signingSlots",
                });
              }

            }}
          >
            <div className="bg-[#000000] w-[30px] h-[30px] rounded-full p-1 flex items-center justify-center  shrink-0 mb-5 mt-3">
              <IoCalendarOutline className="text-white" />
            </div>
            <div className="text-center">
              <h5 className="text-[#47525E] text-sm font-semibold">
                Set signing dates
              </h5>
              <p className="text-[12px] text-[#47525E]">
                {slotsKey.signingSlots?.length || 0} slot opened
              </p>
            </div>
          </div>
          <label
            className={`absolute md:-top-2 md:-right-1 right-3 top-1/2 md:translate-y-0 -translate-y-1/2 w-[20px] h-[20px]  rounded-full border-2 cursor-pointer flex items-center justify-center
                         ${slotsKey.signingSlots?.length
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
                    Home inventory dates
                  </h5>
                  <p className="text-[12px] text-[#47525E]">
                    {selectedProperty?.homeInventorySlots?.length || 0} slot
                    {selectedProperty?.homeInventorySlots?.length > 1
                      ? "s"
                      : ""}{" "}
                    opened
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
                    Transfer ownership
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
