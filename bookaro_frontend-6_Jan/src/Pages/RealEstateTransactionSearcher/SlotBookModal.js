import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FaCalendarAlt } from "react-icons/fa";
import { dateFormate } from "../../models/string.model";
import datepipeModel from "../../models/datepipemodel";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SlotBookModal = ({
  title = "Choose visit slots",
  close = () => { },
  value,
  save = () => { },
  visitSlots,
}) => {
  const [form, setForm] = useState({
    slot: null,
    isRequest: false,
    requestNote: "",
  });
  useEffect(() => {
    if (value) {
      setForm((prev) => ({
        ...prev,
        slot: value.slot || null,
        isRequest: value.isRequest || false,
        requestNote: value.requestNote || "",
      }));
    }
  }, [value]);

  const handleSlotChange = (slot) => {
    setForm((prev) => ({
      ...prev,
      slot: slot || null,
      isRequest: false,
      requestNote: "",
    }));
  };

  const setChangeRequestNote = (note) => {
    setForm((prev) => ({
      ...prev,
      requestNote: note || "",
    }));
  };

  const handleCheckboxChange = (e) => {
    let isRequest = e.target.checked;
    setForm((prev) => ({
      ...prev,
      isRequest: isRequest,
      requestNote: "",
      slot: null,
    }));
  };

  const submit = () => {
    if (form.isRequest) {
      if (!form.requestNote)
        return toast.error("Provide a note for your request");
      save(form);
    } else {
      if (!form.slot) return toast.error("Select a slot");
      save(form);
    }
  };

  return (
    <Dialog open={true} onClose={close} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <DialogPanel className="max-w-md w-full bg-white  rounded-[20px] shadow-lg">
          <DialogTitle className="p-3">
            <div className="react-custom">
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3">
                {title}
              </p>
              <div className="py-5 max-h-[350px] overflow-y-auto px-2 pe-3 overflow-x-hidden">
                {visitSlots?.length > 0 ? (
                  <div className="mt-4">
                    {visitSlots?.map((slot, i) => (
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
                            <span className="font-semibold text-gray-700" >
                              {`Slot ${i2 + 1}: ${datepipeModel.time(
                                time.from
                              )} - ${datepipeModel.time(time.to)}`}
                            </span>
                            <input
                              type="radio"
                              name="visitSlot"
                              checked={
                                form.slot?.date === slot.date &&
                                form.slot?.from === time.from
                              }
                              onChange={() => handleSlotChange(time)}
                              className="w-5 h-5 text-[#976DD0] focus:ring-[#976DD0] cursor-pointer"
                              disabled={time?.booked}
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
                    checked={form.isRequest}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 mr-2 text-[#976DD0] border-[#976DD0] rounded-sm focus:ring-[#976DD0] transition-all duration-300"
                  />
                  <span className="text-[#389D93] text-sm font-medium">
                    Request to change the slot
                  </span>
                </label>

                {form.isRequest && (
                  <div className="mt-3">
                    <textarea
                      value={form.requestNote}
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
                  onClick={close}
                  className="text-[#868389] text-[18px] underline hover:text-[#389D93] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submit()}
                  className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px] hover:bg-[#7b56a4] transition-all"
                >
                  {form.isRequest ? "Request" : "Book"}
                </button>
              </div>
            </div>
          </DialogTitle>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SlotBookModal;
