import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { removePropData } from "../../models/string.model";

import { Checkbox } from "@headlessui/react";
import { goalTypes } from "./shared";
import ApiClient from "../../methods/api/apiClient";
import { useSelector } from "react-redux";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";

const PropertyPage1 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyType: "",
    proposal: "",
  });
  const [selectedType, setSelectedType] = useState("");
  const [Error, setError] = useState("");
  const user = useSelector((state) => state.user);
  const handleTypeSelect = (propertyType) => {
    if (!propertyType) return setError("Select Property Type..");
    setError("");
    setSelectedType(propertyType);
    const step1 = JSON.parse(localStorage.getItem("step1"));
    delete step1?.proposal;
    delete step1?.usedAs;
    localStorage.setItem(
      "step1",
      JSON.stringify({
        ...step1,
        propertyType: propertyType,
      })
    );
    if (propertyType !== "directory" ) {
      if (user?.accountType == "pro") navigate(`/property3`);
      else
      navigate(`/property2`);
    }
  };
  let [total, settotal] = useState(0);
  let [saleData, setsaleData] = useState([]);
  let [rentData, setrentData] = useState([]);
  let [directoryData, setdirectoryData] = useState([]);

  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  useEffect(() => {
    DraftList();
    const step1 = JSON.parse(localStorage.getItem("step1"));
    if (step1) {
      setSelectedType(step1?.propertyType);
      setFormData({ ...formData, proposal: step1?.proposal });
    }
    removePropData(true);
  }, []);

  const DraftList = () => {
    ApiClient.get(`draft/listing?userId=${user?.id || user?._id}`).then(
      (res) => {
        if (res.success) {
          if (res?.data?.length > 0) {
            document.getElementById("draftId").click();
            setsaleData(
              res?.data?.filter((item) => item?.propertyType == "sale")
            );
            setrentData(
              res?.data?.filter((item) => item?.propertyType == "rent")
            );
            setdirectoryData(
              res?.data?.filter((item) => item?.propertyType == "directory")
            );
            settotal(res?.total);
          }
        }
      }
    );
  };

  const toogleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
    setError("");
  };

  const handleNext = () => {
    if (!formData?.proposal) return setError("Select your choice");
    const step1 = JSON.parse(localStorage.getItem("step1"));
    localStorage.setItem(
      "step1",
      JSON.stringify({
        ...step1,
        proposal: formData?.proposal,
      })
    );
    navigate(`/property3`);
  };

  const saveDraft = (value) => {
    value = {
      ...value,
      completeDraft: true,
    };
    localStorage.setItem("step1", JSON.stringify(value));
    localStorage.setItem("addMore", value?.add_more_step);

    navigate(`/property/add/${value?.step + 1}`);
  };

  return (
    <>
      <PageLayout>
        <div className="pt-14 lg:pt-16 bg-[#f2ecf8] h-full pb-[220px]">
          <div className="container items-center  px-8 mx-auto xl:px-5 h-full">
            <ul className="flex items-center ">
              <li className="text-[#47525E] after">List your property</li>
            </ul>
            <div className="grid grid-cols-12 h-full">
              <div className="col-span-full md:mx-auto h-full mx-0  ">
                <h4 className="text-[#47525E] font-[600] text-[28px] text-center pb-16 pt-12">
                  What is your main goal ?
                </h4>
                <div className="text-center md:mt-10 mt-0 h-full">
                  <ul className="flex md:flex-nowrap flex-wrap items-center">
                    {goalTypes.map((property) => (
                      <li
                        key={property.name}
                        onClick={() => handleTypeSelect(property.name)}
                        className={`text-[#606264]  rounded-[10px] lg:w-[220px]  lg:h-[140px] md:w-[150px] md:h-[120px]  w-[130px] h-[120px] text-center flex items-center justify-center  flex-col font-medium mx-3 cursor-pointer border-[2px]
                          ${
                            selectedType === property.name
                              ? "border-[#73339B]"
                              : "border-transparent group hover:border-[#73339B]"
                          }  xl:my-0 my-2`}
                      >
                        <img
                          src={property.icon}
                          alt={property.name}
                          className="w-[60px] mx-auto block mb-2"
                        />
                        {property.label}
                      </li>
                    ))}
                  </ul>
                  {selectedType === "directory" && (
                    <div className="text-left md:max-w-2xl max-w-full mt-14 md:mx-24 mx-10">
                      <h2 className="text-[#47525E] font-[600] text-[20px]">
                        How do you want your property to be listed?
                      </h2>
                      <p className="text-[#47525E] my-4">
                        People following your property will be informed
                        instantanately of any change
                      </p>
                      <h3 className="text-[#47525E] font-[600] text-[18px]">
                        List property as:
                      </h3>
                      <div className="flex flex-col  mt-3 mb-7">
                        <div className="flex items-center mb-3">
                          <Checkbox
                            className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                            checked={formData?.proposal === "rental"}
                            value={formData?.proposal}
                            onChange={() => toogleChange("proposal", "rental")}
                          >
                            <svg
                              className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Checkbox>
                          <label className="text-[#47525E] sm:text-[16px] text-[13px]">
                            Open to rental proposal
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                            checked={formData?.proposal === "purchase"}
                            value={formData?.proposal}
                            onChange={() =>
                              toogleChange("proposal", "purchase")
                            }
                          >
                            <svg
                              className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Checkbox>
                          <label className="text-[#47525E] sm:text-[16px] text-[13px]">
                            Open to purchase proposal
                          </label>
                        </div>
                      </div>
                      <p className="text-[#47525E] italic">
                        This choice let us know when to display your property
                        when user search properties in directory either for
                        rental or for purchase opportunities.
                      </p>
                    </div>
                  )}
                  <div className="text-left md:max-w-2xl max-w-full  md:mx-24 mx-10 mt-2 text-left text-sm text-[#ff0000]">
                    {Error}
                  </div>
                  {selectedType === "directory" && (
                    <div className="mx-auto block mt-20  flex items-center justify-center pb-20">
                      <button
                        onClick={handleNext}
                        className=" text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn text-[18px]"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={open}
          id="draftId"
          className="hidden rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
        >
          Open dialog
        </Button>

        <Dialog
          open={isOpen}
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={close}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="relative w-full max-w-xl rounded-xl bg-[#976DD0]/50 p-6 py-8 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                <button
                  className="absolute top-3 right-3 text-[#fff]"
                  onClick={close}
                >
                  <IoMdClose />
                </button>
                <DialogTitle
                  as="h3"
                  className="text-[18px] font-[600] text-white text-center"
                >
                  Draft Data
                </DialogTitle>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${total} gap-5 mt-6`}
                >
                  {saleData?.length > 0 && (
                    <div className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-[#976DD0] mb-2">
                          Sale Draft
                        </h4>
                        <p className="text-sm text-gray-700">
                          You have one draft listed for sale. Would you like to
                          continue with it?
                        </p>
                      </div>
                      <div className="text-end mt-4">
                        <button
                          className="bg-[#976DD0] hover:bg-[#061f3d] text-white text-sm px-4 py-2 rounded-md transition-all"
                          onClick={() => saveDraft(saleData[0])}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {rentData?.length > 0 && (
                    <div className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-[#976DD0] mb-2">
                          Rent Draft
                        </h4>
                        <p className="text-sm text-gray-700">
                          You have one draft listed for rent. Would you like to
                          continue with it?
                        </p>
                      </div>
                      <div className="text-end mt-4">
                        <button
                          className="bg-[#976DD0] hover:bg-[#061f3d] text-white text-sm px-4 py-2 rounded-md transition-all"
                          onClick={() => saveDraft(rentData[0])}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}

                  {directoryData?.length > 0 && (
                    <div className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-[#976DD0] mb-2">
                          Directory Draft
                        </h4>
                        <p className="text-sm text-gray-700">
                          You have one draft listed for directory. Would you
                          like to continue with it?
                        </p>
                      </div>
                      <div className="text-end mt-4">
                        <button
                          className="bg-[#976DD0] hover:bg-[#061f3d] text-white text-sm px-4 py-2 rounded-md transition-all"
                          onClick={() => saveDraft(directoryData[0])}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </PageLayout>
    </>
  );
};

export default PropertyPage1;
