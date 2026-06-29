import { Checkbox, Switch } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../models/string.model";
import { proposalData, rateLeadOption, userLeadOption } from "../shared";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RiDraftFill } from "react-icons/ri";
import PropertyCheck from "../propertyCheck";

const Step9 = ({
  step1,
  activeTabIndex,
  setActiveTabIndex,
  formData,
  setFormData,
  id,
  editMode = true,
  page,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const scrollRef = useRef(null);
  const [draftModal, setdraftModal] = useState(false);
  const user = useSelector((state) => state.user);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    // check onMount if the page is price + directory
    if (formData?.propertyType === "directory" && activeTabIndex === 6) {
      setActiveTabIndex(6);
    }
  }, [formData]);
  const draftsave = () => {
    const payload = {
      ...formData,
      step: 7,
    };
    loader(true);
    ApiClient.post(`draft/add`, payload, {}, "", true).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        navigate("/")
      } else {
        setdraftModal(true);
        setMsg(res?.message);
      }
      loader(false);
    });
  };

  const validate = () => {
    const typeValidations = {
      sale: ["price", "propertyCharges"],
      rent: ["propertyCharges", "propertyMonthlyCharges", "guaranteeDeposit"],
      offmarket: ["proposal", "userLeads", "rateLeads"],
    };
    const currentType = formData?.propertyType;
    const requiredFields = typeValidations[currentType] || [];
    const missingFields = requiredFields?.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      setError("Enter mandetory fields..");
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    localStorage.setItem("step1", JSON.stringify(formData));
    if (page) {
      navigate(`/property/${page}/${id}?step=9`);
    } else if (id) {
      navigate(`/property/edit/${id}/9`);
    } else {
      navigate("/property/add/9");
    }
    setActiveTabIndex(9);
  };

  const handleBack = () => {
    if (page) {
      navigate(`/property/${page}/${id}?step=7`);
    } else if (id) {
      navigate(`/property/edit/${id}/7`);
    } else {
      navigate("/property/add/7");
    }
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleChange = (field) => (e) => {
    if (editMode) {
      let value = e.target.value;
      value = value.replace(/[^0-9]/g, "");
      const updatedFormData = { ...formData, [field]: value };
      if (
        field === "price" &&
        parseInt(updatedFormData.propertyAgencyFees) >= parseInt(value)
      ) {
        return setError("Property price must be greater than agency fees.");
      }
      if (
        field === "propertyAgencyFees" &&
        parseInt(value) >= parseInt(updatedFormData.price)
      ) {
        return setError("Agency fees must be less than the property price.");
      }
      setFormData(updatedFormData);

      // setFormData({ ...formData, [field]: value });
      if (formData?.propertyType === "sale") {
        if (formData.price !== "" && formData.propertyCharges !== "") {
          setError("");
        }
      } else if (formData?.propertyType === "rent") {
        if (
          formData.propertyCharges !== "" &&
          formData.propertyMonthlyCharges !== "" &&
          formData.guaranteeDeposit !== ""
        ) {
          setError("");
        }
      } else if (formData?.propertyType === "offmarket") {
        if (formData.searchType !== "" && formData.proposal !== "") {
          setError("");
        }
      }
    }
  };

  const toogleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
    setError("");
  };

  return (
    <>
      <div className="flex justify-between flex-col h-full  relative">
        <PropertyCheck />
        <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <div className="flex justify-between items-center gap-3  xl:mb-[50px] lg:mb-[50px] mb-[40px]">
            <h4 className="text-[#47525E] text-[24px] font-[600]">
              {formData?.propertyType?.toLowerCase() === "offmarket"
                ? "Propose your property to only qualified candidates"
                : "What are the price and other cost details?"}
              <span
                ref={scrollRef}
                className="text-[#47525E] font-[400] block text-[14px]"
              >
                *Mandatory information
              </span>
            </h4>

          </div>
          {formData?.propertyType?.toLowerCase() === "offmarket" && (
            <div className="mt-4 lg:max-w-[900px] w-[100%]">
              <div className="bg-[#e5d9f2] rounded-[20px] p-8">
                <h2 className="text-[#47525E] font-[600] text-[18px] mb-3">
                  Open to discussion, relax and let proposals pop-out in
                  your mailbox.
                </h2>
                <p className="text-[#47525E] text-[14px] font-[600]">
                  Let Bookaroo users know you are open to proposals *
                </p>
                <div className="grid grid-cols-12">
                  <div className="lg:col-span-7 col-span-12">
                    <ul className="w-full mt-16">
                      {proposalData.map((itm, i) => (
                        <li className="flex items-center mb-3 w-full">
                          <p className="text-[#47525E] font-[600] text-[15px] me-10 w-[60%]">
                            {itm.name}
                          </p>
                          <Switch
                            checked={formData?.proposal === itm.value}
                            value={formData?.proposal}
                            onChange={() => toogleChange("proposal", itm.value)}
                            className={`${formData?.proposal === itm.value
                              ? "bg-[#986dcd]"
                              : "bg-[#000]"
                              } relative inline-flex h-4 w-8 items-center rounded-full transition-colors`}
                          >
                            <span className="sr-only">
                              Enable notifications
                            </span>
                            <span
                              className={`${formData?.proposal === itm.value
                                ? "translate-x-4"
                                : "translate-x-1"
                                } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                            />
                          </Switch>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-5 col-span-12">
                    <img
                      src="/assets/img/off-market.png"
                      className="rounded-[20px] lg:w-full w-[400px] mt-4"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <p className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
                  Make sure to get only qualified leads
                </p>
                <h4 className="text-[#47525E]  my-[4px] mt-8 font-[600]">
                  Only following user can see my property under Off-market*:
                </h4>
                <div className="  mt-5 xl:w-[500px] w-[100%] ">
                  {userLeadOption?.map((itm, i) => (
                    <div key={i} className="flex items-center  my-2 w-full ">
                      <Checkbox
                        checked={formData.userLeads === itm.value}
                        onChange={() => toogleChange("userLeads", itm.value)}
                        className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
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
                      <label className="text-[#47525E]">{itm.name}</label>
                    </div>
                  ))}
                </div>
                <h4 className="text-[#47525E]  mt-8 font-[600]">
                  Only following rates will see my property
                </h4>
                <div className=" mt-5 xl:w-[500px] w-[100%] ">
                  {rateLeadOption?.map((itm, i) => (
                    <div key={i} className="flex items-center  my-2 w-full ">
                      <Checkbox
                        checked={formData.rateLeads === itm.value}
                        onChange={() => toogleChange("rateLeads", itm.value)}
                        className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
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
                      <label className="text-[#47525E]">{itm.name}</label>
                    </div>
                  ))}
                </div>

                <div className="mt-5 xl:w-[500px] w-[100%]">
                  <p className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
                    Don't get overwelmed by requests
                  </p>
                  <p className="text-[#47525E] my-3">
                    Once we reach that maximum number of leads we will block
                    abillity to contact you.
                  </p>
                  <div className="border border-[#976DD0] p-2 rounded-[5px] bg-white flex items-center w-[250px]">
                    <input
                      value={formatCurrency(formData.maxLeads)}
                      onChange={handleChange("maxLeads")}
                      className="bg-[#F1F1F1] w-[80px] h-[40px] rounded-[4px] p-2"
                    />
                    <p className="text-[#47525E] ms-2">Maximum leads </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData?.propertyType?.toLowerCase() === "sale" && (
            <div className="mt-4 lg:max-w-[500px] w-[100%]">
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Property price without fees*
              </label>
              <div className="relative w-[100%] mb-8 ">
                <input
                  disabled={!editMode}
                  type="text"
                  value={formatCurrency(formData.price)}
                  onChange={handleChange("price")}
                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Enter price"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Property agency fees (included in buyer price)
              </label>
              <div className="relative  w-[100%] mb-8 ">
                <input
                  disabled={!editMode}
                  type="text"
                  value={formatCurrency(formData.propertyAgencyFees)}
                  onChange={handleChange("propertyAgencyFees")}
                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Enter agency fees"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Property total price for buyer
              </label>
              <div className="relative lg:w-[500px] w-[100%] mb-8">
                <input
                  disabled
                  type="text"
                  value={formatCurrency(
                    (+formData.price || 0) + (+formData.propertyAgencyFees || 0)
                  )}
                  className="bg-gray-200 rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Total price for buyer"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>

              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Property annual building charges*
              </label>
              <div className="relative lg:w-[500px] w-[100%] mb-8">
                <input
                  disabled={!editMode}
                  type="text"
                  value={formatCurrency(formData.propertyCharges)}
                  onChange={handleChange("propertyCharges")}
                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Enter annual building charges"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>
            </div>
          )}

          {formData?.propertyType?.toLowerCase() === "rent" && (
            <div className="mt-4 lg:max-w-[500px] w-[100%]">
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Monthly rent*
              </label>
              <div className="relative  w-[100%] mb-4">
                <input
                  disabled={!editMode}
                  type="text"
                  value={formatCurrency(formData?.propertyMonthlyCharges)}
                  onChange={handleChange("propertyMonthlyCharges")}
                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Enter monthly rent"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Building provisional charges*
              </label>
              <div className="relative  w-[100%] mb-4">
                <input
                  disabled={!editMode}
                  type="text"
                  value={formatCurrency(formData.propertyCharges)}
                  onChange={handleChange("propertyCharges")}
                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Enter Building charges"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>

              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Total monthly rent including charges
              </label>
              <div className="relative lg:w-[500px] w-[100%] mb-4">
                <input
                  disabled
                  type="text"
                  value={formatCurrency(
                    (+formData.propertyCharges || 0) +
                    (+formData?.propertyMonthlyCharges || 0)
                  )}
                  className="bg-gray-200 rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Total monthly charges"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>

              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Agency fees
              </label>
              <div className="relative  w-[100%] mb-4">
                <input
                  disabled={!editMode}
                  type="text"
                  value={formatCurrency(formData.propertyAgencyFees)}
                  onChange={handleChange("propertyAgencyFees")}
                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Enter Agency fees"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Inventory of property
              </label>
              <div className="relative  w-[100%] mb-4">
                <input
                  disabled={!editMode}
                  type="text"
                  value={formatCurrency(formData.propertyInventory)}
                  onChange={handleChange("propertyInventory")}
                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Enter Inventory of property"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                One time fees paid by renter
              </label>
              <div className="relative lg:w-[500px] w-[100%] mb-4">
                <input
                  disabled
                  type="text"
                  value={formatCurrency(
                    (+formData.propertyAgencyFees || 0) +
                    (+formData?.propertyInventory || 0)
                  )}
                  className="bg-gray-200 rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="One time fees"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Guarantee deposit*
              </label>
              <div className="relative lg:w-[500px] w-[100%] mb-4">
                <input
                  disabled={!editMode}
                  type="text"
                  value={formatCurrency(formData.guaranteeDeposit)}
                  onChange={handleChange("guaranteeDeposit")}
                  className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                  placeholder="Enter Inventory of property"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
              </div>
            </div>
          )}

          {error && <div className="mt-2 text-sm text-[#ff0000]">{error}</div>}
        </div>
        <div className="text-end flex gap-2 justify-end bg-[#f7f4fb] p-5 w-full ">
          <button
            onClick={draftsave}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
          >
            Save As Draft
          </button>
          <button
            onClick={handleBack}
            className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4"
          >
            Next
          </button>
        </div>
      </div>
      {msg === `You already have a draft for ${formData?.propertyType} type of property.` ? (
        <SaveDraftModal
          draftModal={draftModal}
          setdraftModal={setdraftModal}
          data={formData}
          step={7}
        />
      ) : <></>}
    </>
  );
};

export default Step9;
