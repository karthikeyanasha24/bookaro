import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FaCalendarAlt } from "react-icons/fa";
import { dateFormate, stringSeprator } from "../../models/string.model";
import datepipeModel from "../../models/datepipemodel";
import { BsFiletypePdf } from "react-icons/bs";

const SlotModal = ({
  slotModal,
  closeSlotModal,
  card,
  actionSlotFunc,
  selectedSlot,
  handleSlotChange,
  checkboxChecked,
  handleCheckboxChange,
  showRequestChange,
  changeRequestNote,
  setChangeRequestNote,
  viewDoc,
  deleteDoc,
  fileList,
  setError,
  error,
  ImageUpload,
}) => {
  return (
    <Dialog
      open={slotModal}
      onClose={closeSlotModal}
      className="relative z-[9999]"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <DialogPanel className="max-w-md w-full  bg-white rounded-[20px] shadow-lg">
          <DialogTitle className="p-3">
            <div className="react-custom">
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3">
                Choose visit slots
              </p>
              <div className="max-h-[400px] overflow-y-auto">
                <div className="py-5 px-2 pe-3">
                  {card?.propertyId?.visitSlots?.length > 0 ? (
                    <div className="mt-4">
                      {card?.propertyId?.visitSlots
                        ?.filter(
                          (slot) =>
                            slot.date >= new Date().toISOString().split("T")[0]
                        )
                        ?.map((slot, i) => (
                          <div
                            key={i}
                            className="mb-4 border  rounded-lg bg-gray-50 p-4  transition-all "
                          >
                            <h3 className="text-md font-semibold mb-3 flex items-center text-[#976DD0]">
                              <FaCalendarAlt className="text-[#976DD0] mr-2" />
                              {dateFormate(slot.date)}
                            </h3>
                            {slot.times.map((time, i2) => (
                              <label
                                key={i2}
                                title={`${time?.booked ? "This slot already booked" : ""}`}
                                className="flex justify-between items-center bg-white p-3 rounded-md cursor-pointer mb-2 shadow-sm border-[#cdcdcd] border transition-all"
                              >
                                <span className="font-semibold text-gray-700">
                                  {`Slot ${i2 + 1}: ${datepipeModel.time(
                                    time.from
                                  )} - ${datepipeModel.time(time.to)}`}
                                </span>
                                <input
                                  type="radio"
                                  name="visitSlot"

                                  checked={
                                    selectedSlot?.date === slot.date &&
                                    selectedSlot?.from === time.from
                                  }
                                  onChange={() =>
                                    handleSlotChange(slot.date, time, card)
                                  }
                                   disabled={time?.booked}
                                  className="w-5 h-5 text-[#976DD0] focus:ring-[#976DD0] cursor-pointer"
                                />
                              </label>
                            ))}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">
                      No slots available.
                    </p>
                  )}
                </div>

                {/* {(title == "Manage visit slots" || title == "Manage Visit Slots") && */}
                <div
                  key="identityProof"
                  className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3"
                >
                  <div className="p-5 border-b border-[#D5D5D5]">
                    <h4 className="text-[#47525E] text-[19px] font-semibold">
                      Identity Proof <spna className="text-[#FF0000]">*</spna>
                    </h4>
                    <p className="text-[#47525E] my-2 text-[13px]">
                      Identity document required to visit a property and also
                      bring trust to owner.
                    </p>
                    <p className="text-[#47525E] italic text-[12px] ">
                      Could be an identity card or passport.
                    </p>
                  </div>
                  {fileList("identityProof").map((itm, i) => (
                    <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                      <div className="flex items-center">
                        <BsFiletypePdf className="text-[24px] me-3" />
                        <span className="text-[#383A3D] text-[12px]">
                          {stringSeprator(itm.originalname, 30)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <p
                          onClick={() => viewDoc(itm.fileName)}
                          className="cursor-pointer text-[#383A3D] text-[14px]"
                        >
                          Preview
                        </p>
                        <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                          {/* Edit */}
                        </p>
                        <p
                          onClick={() => deleteDoc(itm.id, "identityProof")}
                          className="cursor-pointer text-[#383A3D] text-[14px]"
                        >
                          Delete
                        </p>
                      </div>
                    </div>
                  ))}
                  {fileList("identityProof")?.length < 1 && (
                    <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                      <label className="relative  h-full w-full">
                        <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                          Upload document
                        </p>
                        <input
                          type="file"
                          name="file"
                          className="opacity-0 w-full h-[64px]"
                          onChange={(e) => ImageUpload(e, "identityProof")}
                        />
                      </label>
                    </div>
                  )}
                  {error?.identityproof && (
                    <p className="text-red-500 text-center mt-3">
                      {error?.identityproof}
                    </p>
                  )}
                </div>
                {/* } */}

                {/* Request to Change Slot */}
                <div className="py-4 px-4 bg-gray-100 rounded-md mt-4">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-exchange-alt text-[#976DD0] mr-2"></i>
                    <p className="text-gray-700 text-sm font-medium">
                      Can't find a suitable slot?
                    </p>
                  </div>

                  {/* Checkbox to toggle request change */}
                  <label className="flex items-center mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkboxChecked}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 mr-2 text-[#976DD0] border-[#976DD0] rounded-sm focus:ring-[#976DD0] transition-all duration-300"
                    />
                    <span className="text-[#389D93] text-sm font-medium">
                      Request to change the slot
                    </span>
                  </label>

                  {checkboxChecked && (
                    <div className="mt-3">
                      <textarea
                        value={changeRequestNote}
                        onChange={(e) => setChangeRequestNote(e.target.value)}
                        placeholder="Please provide a note for your request..."
                        className="w-full p-2 border rounded-md"
                        rows="4"
                      ></textarea>
                    </div>
                  )}
                </div>
                <div className="flex border-t p-2 justify-between">
                  <button
                    onClick={closeSlotModal}
                    className="text-[#868389] text-[18px] underline hover:text-[#389D93] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => actionSlotFunc(card)}
                    className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px] hover:bg-[#7b56a4] transition-all"
                  >
                    {checkboxChecked ? "Request" : "Book"}
                  </button>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SlotModal;
