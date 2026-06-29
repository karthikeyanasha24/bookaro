import { Checkbox } from "@headlessui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import methodModel from "../../../methods/methods";
import {
  categorizeData,
  dateOfDiagnosis,
  diagnosisType,
  saveChanges,
} from "../shared";
import { formatCurrency } from "../../../models/string.model";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RiDraftFill } from "react-icons/ri";
import PropertyCheck from "../propertyCheck";

const Step5 = ({
  step1,
  setActiveTabIndex,
  formData,
  setFormData,
  id,
  amenity,
}) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.user);
  const [draftModal, setdraftModal] = useState(false);
  const scrollRef = useRef(null);

  const categorizedData = categorizeData(amenity);
  const heatingType = categorizedData["Consumption mode".toLowerCase()] || [];
  const consumptionMode = categorizedData["Heating type".toLowerCase()] || [];
  const [msg, setMsg] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.diagnosisType)
      newErrors.diagnosisType = "Diagnosis Type is required.";
    if (formData?.diagnosisType?.toLowerCase()?.includes("yes")) {
      if (!formData.energyConsumption)
        newErrors.energyConsumption = "Energy Consumption is required.";
      if (!formData.emissions) newErrors.emissions = "Emissions is required.";
      if (!formData.dateOfDiagnosis)
        newErrors.dateOfDiagnosis = "Date of Diagnosis is required.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    return Object.keys(newErrors).length === 0;
  };

  const draftsave = () => {
    const payload = {
      ...formData,
      step: 3,
    };
    loader(true);
    ApiClient.post(`draft/add`, payload, {}, "", true).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        navigate("/");
      } else {
        setdraftModal(true);
        setMsg(res?.message);
      }
      loader(false);
    });
  };

  const ratingColors = {
    A: "bg-green-500",
    B: "bg-green-400",
    C: "bg-yellow-300",
    D: "bg-yellow-200",
    E: "bg-orange-300",
    F: "bg-red-300",
    G: "bg-red-500",
  };

  const handleNext = () => {
    if (!validate()) return;
    localStorage.setItem("step1", JSON.stringify(formData));
    if (id) {
      navigate(`/property/edit/${id}/5`);
    } else {
      navigate("/property/add/5");
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
  };

  const handleBack = () => {
    if (id) {
      navigate(`/property/edit/${id}/3`);
    } else {
      navigate("/property/add/3");
    }
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleRadioChange = (selectedOption, field) => {
    if (field === "diagnosisType") {
      setFormData((prevData) => ({
        ...prevData,
        [field]: selectedOption,
        energyConsumption: "",
        energy_efficient: "",
        emissions: "",
        emission_efficient: "",
        dateOfDiagnosis: "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: selectedOption,
        // ...(field !== "dateOfDiagnosis" && { dateOfDiagnosis: "" }),
      }));
    }
  };

  const changeNumber = (e, key) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value === "" || /^[0-9]*$/.test(value)) {
      setFormData({ ...formData, [key]: value });
      setErrors({ ...errors, [key]: "" });
    }
  };

  const save = () => {
    if (!validate()) return;
    step1.energymode = formData.energymode;
    step1.heatingType = formData.heatingType;
    step1.diagnosisType = formData.diagnosisType;
    step1.energyConsumption = formData.energyConsumption;
    step1.energy_efficient = formData.energy_efficient;
    step1.emissions = formData.emissions;
    step1.emission_efficient = formData.emission_efficient;
    step1.dateOfDiagnosis = formData.dateOfDiagnosis;
    step1.contact = formData.contact;
    localStorage.setItem("step1", JSON.stringify(step1));
    saveChanges(step1);
  };

  return (
    <div className=" flex justify-between flex-col h-full relative">
      <PropertyCheck />
      <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
        <div className="flex justify-between items-center gap-3 xl:mb-[50px] lg:mb-[50px] mb-[40px]">
          <h4 className="text-[#47525E] text-[24px] font-[600] text-left ">
            Indicates the results of your energy performance diagnosis
            <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
              *Mandatory information
            </span>
          </h4>
        </div>
        <div>
          <h4 className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
            {" "}
            Tell us more about your heating system
          </h4>
        </div>

        <div className="my-9">
          <label className="block text-[16px] text-[#47525E] font-[600] mt-4">
            Consumption mode <span className="font-[400] ms-1">(Optional)</span>
          </label>
          <ul className="flex gap-4 w-full items-center flex-wrap my-5">
            {consumptionMode.map((option) => (
              <li
                key={option.id}
                className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] relative"
              >
                <Checkbox
                  checked={formData.energymode == option.id}
                  onChange={() => handleRadioChange(option.id, "energymode")}
                  className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
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
                <img
                  src={methodModel.noImg(option?.icon, "img")}
                  className="w-[40px] mx-auto block mb-2 mt-3"
                />
                <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Equipment Options */}
        <div ref={scrollRef}>
          <label className="block text-[16px] text-[#47525E] font-[600] ">
            Heating type <span className="font-[400] ms-1">(Optional)</span>
          </label>
          <ul className="flex gap-4 w-full items-center flex-wrap my-5">
            {heatingType.map((option) => (
              <li
                key={option.id}
                className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] relative "
              >
                <Checkbox
                  checked={formData.heatingType === option.id}
                  onChange={() => handleRadioChange(option.id, "heatingType")}
                  className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
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
                <img
                  src={methodModel.noImg(option?.icon, "img")}
                  className="w-[40px] mx-auto block mb-2 mt-3"
                />
                <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Diagnosis Result */}
        <div>
          <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
            Do you have the results of your diagnosis?
          </label>
          <div className="font-[400]  text-[16px] text-[#47525E] mb-7 xl:w-[500px] w-[100%]">
            No worries, we only use it to place your property on our map in the
            right neighborhood.
          </div>
          <div className="flex items-start mb-4 flex-col">
            {diagnosisType.map((option) => (
              <div key={option.label} className="flex items-center me-4 mb-5 ">
                <Checkbox
                  checked={formData.diagnosisType == option.label}
                  onChange={() => {
                    handleRadioChange(option.label, "diagnosisType");
                    setErrors({
                      ...errors,
                      diagnosisType: "",
                      energyConsumption: "",
                      emissions: "",
                      dateOfDiagnosis: "",
                    });
                  }}
                  className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] p-[3px]"
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
                <label className="text-[#47525E] text-[16px]">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {errors.diagnosisType && (
            <span className="text-sm text-[#ff0000]">
              {errors.diagnosisType}
            </span>
          )}
        </div>

        {formData.diagnosisType
          ?.toLowerCase()
          ?.includes("diagnosis does not") ? (
          <div className="mt-4 bg-white p-5 rounded-md lg:w-[500px] w-[100%] shadow_new border  border-[#986dcd7d] mb-8 flex ">
            <div className="me-4 w-[20%]">
              <img
                src="/assets/img/info-g.svg"
                className="w-[42px] mb-4  -mt-[2px] shadow_new rounded-[50px] p-1 border"
                alt="Info"
              />
            </div>

            <div className="flex items-start flex-col w-[75%]">
              <h5 className="text-[#47525E] text-[16px] font-[600]  mb-2 border-b border-dashed border-[#47525E]  ">
                Are you sure it does not apply to your property?
              </h5>
              <label className="text-[#47525E] text-[14px] ">
                To ensure that this regulation does not apply to your property,
                please visit the website set by the government.
              </label>
              <button
                className="btn text-white bg-[#48464a] rounded-[5px] mt-3 px-4 py-1.5"
                onClick={() =>
                  window.open(
                    "https://www.economie.gouv.fr/particuliers/immobilier-diagnostic-performance-energetique-dpe",
                    "_blank"
                  )
                }
              >
                Learn More
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4 bg-white p-5 rounded-md lg:w-[500px] w-[100%] shadow_new border  border-[#986dcd7d] mb-8 flex ">
              <div className="me-4 w-[15%]">
                <img
                  src="/assets/img/info-g.svg"
                  className="sm:w-[60px] w-[50px] mb-4  -mt-[2px] shadow_new rounded-[50px] p-1 border"
                  alt="Info"
                />
              </div>

              <div className="flex items-start flex-col w-[80%]">
                <h5 className="text-[#47525E] text-[16px] font-[600]  mb-2 border-b border-dashed border-[#47525E]  ">
                  Communicate your DPE for greater transparency
                </h5>
                <label className="text-[#47525E] text-[14px] ">
                  Since January 2022, it has been compulsory to display your EPD
                  on your ad to sell a property. This information also plays a
                  key role in buyers' decision-making.
                </label>
              </div>
            </div>
            <div className="my-10">
              <div>
                <h4 className="text-[#47525E] text-[24px] font-[600] text-left xl:mb-[50px] lg:mb-[50px] mb-[40px] ">
                  Diagnosis results
                  <span className="font-[400]  text-[16px] text-[#47525E] block text-left mt-5 ">
                    DPE Vierge: my diagnostis does not show any ranking
                  </span>
                </h4>
              </div>
              {/* Energy Consumption */}
              <div className="mt-4">
                <label className="mb-1 block text-[16px] text-[#47525E] mb-2 font-[600]">
                  Energy consumption
                </label>
                <div className="relative lg:w-[500px] w-[100%]">
                  <input
                    type="text"
                    value={formatCurrency(formData.energyConsumption)}
                    disabled={
                      formData?.diagnosisType?.toLowerCase()?.includes("yes")
                        ? false
                        : true
                    }
                    onChange={(e) => changeNumber(e, "energyConsumption")}
                    className={`bg-white rounded-[4px] border border-[#976DD0] p-2 px-3 w-full
                    ${!formData?.diagnosisType?.toLowerCase()?.includes("yes")
                        ? "disabled"
                        : ""
                      }`}
                    placeholder=""
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs border-l border-[#976DD0] pl-2">
                    kWhEP/m2/year
                  </span>
                </div>
                {errors.energyConsumption && (
                  <span className="text-sm text-[#ff0000]">
                    {errors.energyConsumption}
                  </span>
                )}
              </div>
              {/* Rating Selector */}
              <div className="p-2 bg-white  lg:w-[500px] w-[100%] mb-4 rounded-[7px] mt-5">
                <div className="flex flex-col items-start  bg-white relative border rounded-[7px] h-[44px] steps-main-design">
                  <div className="flex justify-between w-full absolute bottom-0 steps-design ">
                    {Object.keys(ratingColors).map((rating) => (
                      <div
                        key={rating}
                        className={`flex-1 h-[5px] border-r text-[14px]  ${ratingColors[rating]}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between w-full text-[14px] steps-inner">
                    {Object.keys(ratingColors).map((rating) => (
                      <button
                        key={rating}
                        disabled={
                          formData?.diagnosisType
                            ?.toLowerCase()
                            ?.includes("yes")
                            ? false
                            : true
                        }
                        onClick={() => {
                          setFormData({
                            ...formData,
                            energy_efficient: rating,
                          });
                        }}
                        className={`flex-1 py-2 text-center transition duration-300  ${formData.energy_efficient == rating
                            ? "bg-[#976DD0] text-white"
                            : "bg-transparent text-[#47525E] border-r hover:bg-[#f0f4f8] text-[14px] font-[600]"
                          }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between  lg:w-[500px] w-[100%]">
                <p className="text-[#878889] text-[12px] ">
                  Energy-efficient home
                </p>
                <p className="text-[#878889] text-[12px] ">
                  Energy-intensive housing
                </p>
              </div>
            </div>
            <div className="mb-10">
              {/* Greenhouse Gas Emissions */}
              <div className="mt-4">
                <label className="mb-1 block text-[16px] text-[#47525E] mb-2 font-[600]">
                  Greenhouse gas emissions
                </label>
                <div className="relative lg:w-[500px] w-[100%]">
                  <input
                    type="text"
                    value={formatCurrency(formData.emissions)}
                    disabled={
                      formData?.diagnosisType?.toLowerCase()?.includes("yes")
                        ? false
                        : true
                    }
                    onChange={(e) => changeNumber(e, "emissions")}
                    className={`bg-white rounded-[4px] border border-[#976DD0] p-2 px-3 w-full
                    ${!formData?.diagnosisType?.toLowerCase()?.includes("yes")
                        ? "disabled"
                        : ""
                      }`}
                    placeholder=""
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs border-l border-[#976DD0] pl-2">
                    kgCO2/m2/Year
                  </span>
                </div>
                {errors.emissions && (
                  <span className="text-sm text-[#ff0000]">
                    {errors.emissions}
                  </span>
                )}
              </div>

              <div className="p-2 bg-white  lg:w-[500px] w-[100%] mb-4 rounded-[7px] mt-5">
                <div className="flex flex-col items-start  bg-white relative border rounded-[7px] h-[44px] steps-main-design">
                  <div className="flex justify-between w-full absolute bottom-0 steps-design ">
                    {Object.keys(ratingColors).map((rating) => (
                      <div
                        key={rating}
                        className={`flex-1 h-[5px] border-r text-[14px] ${ratingColors[rating]}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between w-full text-[14px] steps-inner">
                    {Object.keys(ratingColors).map((rating) => (
                      <button
                        key={rating}
                        disabled={
                          formData?.diagnosisType
                            ?.toLowerCase()
                            ?.includes("yes")
                            ? false
                            : true
                        }
                        onClick={() => {
                          setFormData({
                            ...formData,
                            emission_efficient: rating,
                          });
                        }}
                        className={`flex-1 py-2 text-center   transition duration-300 ${formData.emission_efficient === rating
                            ? "bg-[#976DD0] text-white"
                            : "bg-transparent text-[#47525E] border-r hover:bg-[#f0f4f8] text-[14px] font-[600]"
                          }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between  lg:w-[500px] w-[100%]">
                <p className="text-[#878889] text-[12px] ">Low emissions</p>
                <p className="text-[#878889] text-[12px] ">High emisisons</p>
              </div>
            </div>
            {/* Diagnosis Date */}
            <div className="mt-4">
              <label className="mb-3 block text-[16px] text-[#47525E] mb-2 font-[600]">
                Date of diagnosis
              </label>
              <div className="flex items-start mb-4 flex-col">
                {dateOfDiagnosis.map((option) => (
                  <div
                    key={option.label}
                    className="flex items-center me-4 mb-5 "
                  >
                    <Checkbox
                      checked={formData.dateOfDiagnosis == option.label}
                      disabled={
                        formData?.diagnosisType?.toLowerCase()?.includes("yes")
                          ? false
                          : true
                      }
                      onChange={() => {
                        handleRadioChange(option.label, "dateOfDiagnosis");
                        setErrors({ ...errors, dateOfDiagnosis: "" });
                      }}
                      className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] p-[3px]"
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
                    <label className="text-[#47525E] text-[16px]">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.dateOfDiagnosis && (
                <span className="text-sm text-[#ff0000]">
                  {errors.dateOfDiagnosis}
                </span>
              )}
            </div>
            <div className="mt-4 bg-white p-5 rounded-md lg:w-[500px] w-[100%] shadow_new border  border-[#986dcd7d] mb-8 flex ">
              <div className="me-4 w-[15%]">
                <img
                  src="/assets/img/info-g.svg"
                  className="sm:w-[60px] w-[50px] mb-4  -mt-[2px] shadow_new rounded-[50px] p-1 border"
                  alt="Info"
                />
              </div>

              <div className="flex items-start flex-col w-[80%]">
                <h5 className="text-[#47525E] text-[16px] font-[600]  mb-2 border-b border-dashed border-[#47525E]  ">
                  A good DPE increases your property value
                </h5>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name=""
                    className="me-2 mt-1"
                    checked={formData.contact}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        contact: e.target.checked,
                      });
                    }}
                  />
                  <label className="text-[#47525E] text-[14px] ">
                    I would like to be contacted by email or telephone by one of
                    our renovation partners to provide a quote for the
                    renovation of my property.
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {id ? (
        <div className="text-end bg-[#f2ecf8] p-5 w-full ">
          <button
            onClick={save}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
          >
            Save change
          </button>
        </div>
      ) : (
        <div className="text-end flex gap-2 justify-end  bg-[#f7f4fb] p-5 w-full ">
          <button
            onClick={draftsave}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
          >
            Save As Draft
          </button>
          <button
            onClick={handleBack}
            className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 "
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
      )}
      {msg === `You already have a draft for ${formData?.propertyType} type of property.` && (
        <SaveDraftModal
          draftModal={draftModal}
          setdraftModal={setdraftModal}
          data={formData}
          step={3}
        />
      )}
    </div>
  );
};

export default Step5;
