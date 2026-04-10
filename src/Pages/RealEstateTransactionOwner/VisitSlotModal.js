import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Calendar } from "react-multi-date-picker";
import {
  dateFormate,
  imagePath,
  stringSeprator,
} from "../../models/string.model";
import { useCallback, useEffect, useMemo, useState } from "react";
import FormControl from "../../components/common/FormControl";
import datepipeModel from "../../models/datepipemodel";
import ApiClient from "../../methods/api/apiClient";
import { toast } from "react-toastify";
import loader from "../../methods/loader";
import { BsFiletypePdf } from "react-icons/bs";
import { useSelector } from "react-redux";
import { getRandomCode } from "../../models/shared.units";

const durationList = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((itm) => ({
  name: `${itm} min`,
  id: itm,
}));

const VisitSlotModal = ({
  closeModal,
  visitSlot = [],
  saveSlots = (_) => { },
  card = null,
  duration,
  title = "Manage Visit Slot",
  isToggleButton = false,
  toggleValue = false,
  propertyId = null,
  getData,
}) => {
  const durations = duration || durationList;
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [identityproof, setIdentityproof] = useState({
    identityProof: [],
    familySituation: [],
    addressProof: [],
    carrezLaw: [],
    technicalDiagnostic: [],
    coOwnership: [],
    personalContribution: [],
    condominiumBooklet: [],
    minutesOfGeneral: [],
    titleDeed: [],
    otherDocs: [],
  });
  const [toggle, setToggle] = useState(toggleValue ? true : false);
  const user = useSelector((state) => state.user);

  const addTimeSlot = (date) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.date === date
          ? { ...slot, times: [...slot.times, { from: "", to: "" }] }
          : slot
      )
    );
  };

  useEffect(() => {
    if (propertyId) {
      ApiClient.get("property/detail", {
        id: propertyId,
        userId: user?.id || user._id,
      }).then((res) => {
        if (res.success) {
          let data = res.data?.propertyDetail;
          setIdentityproof({
            ...identityproof,
            identityProof: data.sellerFiles?.identityProof || [],
          });
        }
      });
    }
  }, [propertyId]);

  const fileList = useCallback(
    (key) => {
      let arr = [];
      if (identityproof?.[key]?.length)
        // arr = form?.[key]?.filter((itm) => itm.property == selectProperty) || [];
        arr = identityproof?.[key] || [];
      return arr;
    },
    [identityproof, propertyId]
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
  const handleSubmit = (identityproof) => {
    loader(true);
    const payload = {
      sellerFiles: identityproof,
      id: propertyId,
    };
    ApiClient.put("property/editProperty", payload)
      .then((res) => {
        if (res.success) {
          toast.success("Identity Proof Updated Successfully");
        }
      })
      .catch((err) => { })
      .finally(() => {
        loader(false);
      });
  };
  const deleteTimeSlot = (slotIndex) => {
    const newSlots = slots.filter((_, i) => i !== slotIndex);
    const newSelectedDates = selectedDates.filter((_, i) => i !== slotIndex);
    setSlots(newSlots);
    setSelectedDates(newSelectedDates);
  };
  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    let files = Array.from(e.target.files);
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`Each file must be smaller than ${maxSize}MB`);
      return (e.target.value = "");
    }
    setError({ ...error, identity: "" });

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
              property: propertyId,
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

  const validateAndSaveSlots = () => {
    setError({ ...error, slot: "" });

    if (slots.length === 0) {
      setError({ ...error, slot: "You must select at least one date." });
      return;
    }

    for (let slot of slots) {
      if (slot.times.length === 0) {
        setError({
          ...error,
          slot: `Please add at least one time slot for ${dateFormate(
            slot.date
          )}.`,
        });
        return;
      }

      if (identityproof?.identityProof?.length < 1) {
        setError({ ...error, identity: "Please upload your identity proof" });
        return;
      }

      const { fromhr, tohr, duration } = slot;

      if (!fromhr || !tohr || !duration) {
        setError({
          ...error,
          slot: "Please select From, To, and Duration for each slot.",
        });
        return;
      }
      // handleAutoinvite(toggle);

      // for (let time of slot.times) {
      //     const { fromhr, tohr, duration } = time;

      //     if (!fromhr || !tohr || !duration) {
      //         setError({ ...error, slot: "Please select From, To, and Duration for each slot." });
      //         return;
      //     }

      //     const fromTime = new Date(`2000-01-01T${fromhr}`);
      //     const toTime = new Date(`2000-01-01T${tohr}`);

      //     if (toTime <= fromTime) {
      //         setError({ ...error, slot: "The 'To' time must be after the 'From' time." });
      //         return;
      //     }

      //     const timeDifference = (toTime - fromTime) / (1000 * 60); // in minutes

      //     if (timeDifference < duration) {
      //         setError({ ...error, slot: `Duration (${duration} mins) exceeds the available time range.` });
      //         return;
      //     }
      // }
    }

    saveSlots(slots, toggle, card);
  };

  const updateTimeSlot = (date, index, field, value) => {
    setError({ ...error, slot: "" });
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.date === date
          ? {
            ...slot,
            times: slot.times.map((time, i) =>
              i === index ? { ...time, [field]: value } : time
            ),
          }
          : slot
      )
    );
  };

  const updateSlot = (index, p = {}) => {
    setError({ ...error, slot: "" });
    setSlots((prevSlots) => {
      let arr = [...prevSlots];
      let times = timeSlots({ ...arr[index], ...p });

      arr[index] = {
        ...arr[index],
        ...p,
        times: times,
      };
      return arr;
    });
  };

  const removeSlot = (index) => {
    setError({ ...error, slot: "" });
    setSlots((prevSlots) => {
      let arr = [...prevSlots];
      arr = arr.filter((_, i) => i != index);
      return arr;
    });
  };

  const removeTimeSlot = (date, index) => {
    setSlots((prevSlots) =>
      prevSlots
        .map((slot) =>
          slot.date === date
            ? { ...slot, times: slot.times.filter((_, i) => i !== index) }
            : slot
        )
        .filter((slot) => slot.times.length > 0)
    );
  };

  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) => date.format("YYYY-MM-DD"));
    const updatedSlots = formattedDates.map((date) => {
      const existingSlot = slots.find((slot) => slot.date === date);
      return existingSlot || { date, times: [] };
    });
    setSlots(updatedSlots);
    setSelectedDates(formattedDates);
    setError({ ...error, slot: "" });
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const upcomingSlots = visitSlot?.filter((slot) => slot.date >= today) || [];
    setSlots([...upcomingSlots]);
    setSelectedDates([...upcomingSlots.map((itm) => itm.date)]);
  }, [visitSlot]);

  const hours = useMemo(() => {
    let value = Array.from({ length: 24 }, (_, i) => ({
      name: datepipeModel.time(`${i}:00`),
      id: datepipeModel.timeString(`1-12-2020 ${i}:00`),
    }));

    return value;
  }, []);

  const timeSlots = useCallback((slot) => {
    if (!slot.fromhr || !slot.tohr || !slot.duration) {
      return [];
    }

    const slots = [];
    const start = new Date(`${slot.date}T${slot.fromhr}`);
    const end = new Date(`${slot.date}T${slot.tohr}`);

    let current = new Date(start);

    while (current < end) {
      const next = new Date(current.getTime() + slot.duration * 60000);
      if (next > end) break;

      const formatTime = (date) => date.toTimeString().slice(0, 5); // "HH:MM"

      slots.push({
        date: slot.date,
        from: formatTime(current),
        to: formatTime(next),
      });

      current = next;
    }
    return slots;
  }, []);

  const handleAutoinvite = (toggle) => {
    let payload = {
      autoInvite: toggle,
      id: propertyId,
    };
    loader(true);
    ApiClient.put(`property/editProperty`, payload).then((res) => {
      if (res.success) {
        // getData()
        toast.success(res.message);
      }
      loader(false);
    });
  };

  return (
    <Dialog open={true} onClose={closeModal} className="relative z-[9999] ">
      <DialogBackdrop className="fixed inset-0  bg-black/30" />
      <div className="fixed inset-0 h-full flex p-4 items-center justify-center z-50">
        <DialogPanel className="max-w-[550px] w-full bg-white rounded-[20px] shadow-lg">
          <DialogTitle className="p-3">
            <div className="react-custom react-cutom-new">
              {isToggleButton ? (
                <>
                  <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3 flex gap-3">
                    {title}
                    <label class="inline-flex items-center cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        value=""
                        class="sr-only peer"
                        checked={toggle}
                        onChange={(e) => {
                          const newToggle = e.target.checked;
                          setToggle(newToggle);
                        }}
                      />
                      <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[#976DD0] "></div>
                      <span class="ms-3 text-sm font-medium text-gray-900 ">
                        Automatic invites
                      </span>
                    </label>
                  </p>
                </>
              ) : (
                <>
                  <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3">
                    {title}
                  </p>
                </>
              )}

              <div className="max-h-[350px] overflow-y-scroll">
                <div className="py-5  px-2 pe-3 overflow-x-hidden">
                  <h3 className="text-md font-semibold mb-3">
                    Select Date <spna className="text-[#FF0000]">*</spna>
                  </h3>
                  <Calendar
                    multiple
                    onlyShowInRangeDates
                    minDate={new Date()}
                    value={selectedDates}
                    onChange={handleDateChange}
                  />
                  {slots.length > 0 && (
                    <div className="mt-4 ">
                      <h3 className="text-md font-semibold mb-3">
                        Select Time Slots:{" "}
                        <spna className="text-[#FF0000]">*</spna>
                      </h3>
                      {slots.map((slot, slotIndex) => (
                        <div key={slot.date} className="mb-3 border rounded">
                          <div className="flex justify-between items-center p-3 bg-[#986dcd26]">
                            <strong>{dateFormate(slot.date)}</strong>
                            {/* <button
                                                        onClick={() => addTimeSlot(slot.date)}
                                                        className="ml-3 px-2 py-1 bg-[#976DD0] text-white rounded"
                                                    >
                                                        + Add Slot
                                                    </button> */}
                            <button
                              onClick={() => deleteTimeSlot(slotIndex)}
                              className="ml-3 px-2 py-1 bg-[#976DD0] text-white rounded"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="grid md:grid-cols-3 grid-cols-1 justify-center gap-1 mt-2 p-3 items-center input_design">
                            <div className="">
                              <FormControl
                                type="select"
                                theme="search"
                                placeholder="from"
                                value={slot.fromhr}
                                options={hours}
                                onChange={(e) => {
                                  updateSlot(slotIndex, { fromhr: e });
                                }}
                              />
                            </div>
                            <div className="">
                              <FormControl
                                type="select"
                                placeholder="To"
                                theme="search"
                                value={slot.tohr}
                                options={hours.filter((hour) => hour.id > slot.fromhr)}
                                onChange={(e) => {
                                  updateSlot(slotIndex, { tohr: e });
                                }}
                              />
                            </div>
                            <div className="">
                              <FormControl
                                type="select"
                                placeholder="Duration"
                                theme="search"
                                value={slot.duration}
                                options={durations}
                                onChange={(e) => {
                                  updateSlot(slotIndex, { duration: e });
                                }}
                              />
                            </div>

                            {/* <button
                                                            onClick={() => removeSlot(slotIndex)}
                                                            className="px-3 text-[16px] text-red-700 py-2.5 bg-[#986dcd26] rounded flex items-center justify-center"
                                                        >
                                                            <AiOutlineDelete />
                                                        </button> */}
                          </div>
                          <div className="grid md:grid-cols-2 grid-cols-1 p-3 gap-4">
                            {slot.times?.map((time, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center justify-between gap-1 p-2 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition ease-in-out w-full "
                              >
                                {/* Slot label at the top */}
                                <span className="font-semibold text-gray-800 text-lg">{`Slot ${index + 1
                                  }`}</span>

                                {/* Time range at the bottom */}
                                <div className="flex flex-row gap-3 text-sm text-gray-600">
                                  <span className="font-medium">
                                    {datepipeModel.time(time.from)}
                                  </span>
                                  <span className="mx-1">-</span>
                                  <span className="font-medium">
                                    {datepipeModel.time(time.to)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {error?.slot && (
                    <p className="text-red-500 text-center mt-3">
                      {error?.slot}
                    </p>
                  )}
                </div>

                {/* upload identity proof */}

                {(title == "Manage visit slots" ||
                  title == "Manage Visit Slots") && (
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
                          bring trust to buyer.
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
                      {error?.identity && (
                        <p className="text-red-500 text-center mt-3">
                          {error?.identity}
                        </p>
                      )}
                    </div>
                  )}
              </div>
              <div className="flex border-t p-2 justify-between">
                <button
                  onClick={closeModal}
                  className="text-[#868389] text-[18px] underline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => validateAndSaveSlots()}
                  className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                >
                  Save
                </button>
              </div>
            </div>
          </DialogTitle>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default VisitSlotModal;
