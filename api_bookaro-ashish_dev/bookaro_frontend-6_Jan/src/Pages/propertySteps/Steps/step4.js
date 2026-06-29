import { Checkbox } from "@headlessui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectDropdown from "../../../components/common/SelectDropdown";
import methodModel from "../../../methods/methods";
import { categorizeData, saveChanges, situation } from "../shared";
import { capLetter, formatCurrency } from "../../../models/string.model";
import loader from "../../../methods/loader";
import ApiClient from "../../../methods/api/apiClient";
import { toast } from "react-toastify";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import { useSelector } from "react-redux";
import { RiDraftFill } from "react-icons/ri";
import PropertyCheck from "../propertyCheck";

const Step4 = ({
  step1,
  formData,
  setFormData,
  handleCheckboxChange,
  handleIncrement,
  handleDecrement,
  setActiveTabIndex,
  amenity,
  id,
  dropdownOptions,
}) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.user);
  const [draftModal, setdraftModal] = useState(false);
  const scrollRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.surface) newErrors.surface = "Surface is required.";
    if (formData.rooms == 0) newErrors.rooms = "Rooms cannot be zero.";
    // if (formData.bedrooms == 0) newErrors.bedrooms = "Bedrooms cannot be zero.";
    if (formData.propertyFloor == 0)
      newErrors.propertyFloor = "Number of Floors in Building cannot be zero..";
    // if (formData.toilets == 0) newErrors.toilets = "Toilets cannot be zero.";
    // if (formData.livingRoom == 0) newErrors.livingRoom = "Living room cannot be zero.";
    // if (formData.totalFloorBuilding == 0) newErrors.totalFloorBuilding = "Buildind floor cannot be zero.";
    // if (!formData.state) newErrors.state = "State is required.";
    // if (selections.investment.length == 0) newErrors.investment = "Investment Purposes is required.";
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

  const categorizedData = categorizeData(amenity);
  const ancilliaryAreas =
    categorizedData["ancilliary areas".toLowerCase()] || [];
  const cookingOptions = categorizedData["Cooking".toLowerCase()] || [];
  const environment = categorizedData["Environment".toLowerCase()] || [];
  const equipmentOptions = categorizedData["Equipment".toLowerCase()] || [];
  const leisure = categorizedData["Leisure".toLowerCase()] || [];
  const outsideOptions = categorizedData["Outside".toLowerCase()] || [];
  const servicesAndAccessibility =
    categorizedData["Services and accessibility".toLowerCase()] || [];
  const investmentPurposes = categorizedData["investment".toLowerCase()] || [];
  const [msg, setMsg] = useState("");

  const handleNext = () => {
    if (!validate()) return;
    localStorage.setItem("step1", JSON.stringify(formData));
    if (id) {
      navigate(`/property/edit/${id}/4`);
    } else {
      navigate("/property/add/4");
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
  };

  const handleBackNext = () => {
    if (id) {
      navigate(`/property/edit/${id}/2`);
    } else {
      navigate("/property/add/2");
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex - 1, 7));
  };

  const save = () => {
    if (!validate()) return;
    step1.surface = formData.surface;
    step1.rooms = formData.rooms;
    step1.bathroom = formData.bathroom;
    step1.bedrooms = formData.bedrooms;
    step1.totalFloorBuilding = formData.totalFloorBuilding;
    step1.toilets = formData.toilets;
    step1.livingRoom = formData.livingRoom;
    step1.propertyFloor = formData.propertyFloor;
    step1.building = formData.building;
    step1.propertyState = formData.propertyState;
    step1.situation = formData.situation;
    step1.cooking = formData.cooking;
    step1.equipment = formData.equipment;
    step1.outside = formData.outside;
    step1.serviceAccessibility = formData.serviceAccessibility;
    step1.ancilliary = formData.ancilliary;
    step1.environment = formData.environment;
    step1.leisure = formData.leisure;
    step1.investment = formData.investment;
    localStorage.setItem("step1", JSON.stringify(step1));
    saveChanges(step1);
  };

  const draftsave = () => {
    const payload = {
      ...formData,
      step: 2,
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

  return (
    <>
      <div className=" flex justify-between flex-col h-full relative ">
        <PropertyCheck />
        <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <div className="flex justify-between items-center gap-3 xl:mb-[50px] lg:mb-[50px] mb-[40px]">
            <h4
              ref={scrollRef}
              className="text-[#47525E] md:text-[24px] text-[21px] font-[600] text-left "
            >
              What are the main characteristics of your property?
              <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                *Mandatory information
              </span>
            </h4>
          </div>
          <div>
            <div>
              <h4 className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
                {" "}
                Key information
              </h4>
            </div>
            <div className="my-9">
              <div>
                <label className="mb-1 block text-[16px] text-[#47525E] mb-[10px] font-[600] block">
                  Surface*{" "}
                  <span className="block font-[400] mt-2 mb-2">
                    You must respect Carrez Law
                  </span>
                </label>
                <div className="relative lg:w-[500px] w-[100%] z-[1]">
                  <input
                    type="text"
                    value={formatCurrency(formData?.surface)}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, surface: value });
                      setErrors({ ...errors, surface: "" });
                    }}
                    className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                    placeholder="Surface"
                  />
                  <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                    m²
                  </span>
                </div>
              </div>
              {errors.surface && (
                <span className="text-[#ff0000] text-sm">{errors.surface}</span>
              )}

              <ul className="flex flex-wrap mt-10">
                {/* Number of Rooms */}
                <li className="md:w-[48%] w-[100%] my-5">
                  <label className="mb-1 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of rooms*
                    <span className="block font-[400] mt-2 mb-2 h-[50px] max-w-[300px] text-[14px]">
                      Kitchen, bathrooms, and toilets are not considered as
                      rooms.
                    </span>
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        handleDecrement("rooms");
                        setErrors({ ...errors, ["rooms"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/minus.png"
                        alt="minus"
                        className="w-[20px] mx-auto"
                      />
                    </button>
                    <input
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.rooms}
                      readOnly
                    />
                    <button
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center "
                      onClick={() => {
                        handleIncrement("rooms");
                        setErrors({ ...errors, ["rooms"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/plus.png"
                        alt="plus"
                        className="w-[25px]"
                      />
                    </button>
                  </div>
                  {errors.rooms && (
                    <span className="text-[#ff0000] text-sm">
                      {errors.rooms}
                    </span>
                  )}
                </li>

                {/* Number of Bathrooms */}
                <li className="md:w-[48%] w-[100%] my-5">
                  <label className="mb-1 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of bathrooms{" "}
                    <span className="font-[400] ms-1"> (Optional)</span>
                    <span className="block font-[400] mt-2 mb-2 h-[50px] max-w-[300px] text-[14px]">
                      A room with a bath.
                    </span>
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        handleDecrement("bathroom");
                        setErrors({ ...errors, ["bathroom"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/minus.png"
                        alt="minus"
                        className="w-[20px] mx-auto"
                      />
                    </button>
                    <input
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.bathroom}
                      readOnly
                    />
                    <button
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        handleIncrement("bathroom");
                        setErrors({ ...errors, ["bathroom"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/plus.png"
                        alt="plus"
                        className="w-[25px]"
                      />
                    </button>
                  </div>
                </li>

                {/* Number of Bedrooms */}
                <li className="md:w-[48%] w-[100%] my-5">
                  <label className="mb-1 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of bedrooms
                    <span className="font-[400] ms-1"> (Optional)</span>
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        handleDecrement("bedrooms");
                        // setErrors({ ...errors, ['bedrooms']: "" })
                      }}
                    >
                      <img
                        src="/assets/icons/minus.png"
                        alt="minus"
                        className="w-[20px] mx-auto"
                      />
                    </button>
                    <input
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.bedrooms}
                      readOnly
                    />
                    <button
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        handleIncrement("bedrooms");
                        // setErrors({ ...errors, ['bedrooms']: "" })
                      }}
                    >
                      <img
                        src="/assets/icons/plus.png"
                        alt="plus"
                        className="w-[25px]"
                      />
                    </button>
                  </div>
                  {/* {errors.bedrooms && <span className="text-[#ff0000] text-sm">{errors.bedrooms}</span>} */}
                </li>

                {/* Floor of the Property */}
                <li className="md:w-[48%] w-[100%] my-5">
                  <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Floor of the property*
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        handleDecrement("propertyFloor");
                        setErrors({ ...errors, ["propertyFloor"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/minus.png"
                        alt="minus"
                        className="w-[20px] mx-auto"
                      />
                    </button>
                    <input
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.propertyFloor}
                      readOnly
                    />
                    <button
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        handleIncrement("propertyFloor");
                        setErrors({ ...errors, ["propertyFloor"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/plus.png"
                        alt="plus"
                        className="w-[25px]"
                      />
                    </button>
                  </div>
                  {errors.propertyFloor && (
                    <span className="text-[#ff0000] text-sm">
                      {errors.propertyFloor}
                    </span>
                  )}
                </li>

                {/* Number of Toilets */}
                <li className="md:w-[48%] w-[100%] my-5">
                  <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of toilets
                    <span className="font-[400] ms-1"> (Optional)</span>
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        handleDecrement("toilets");
                        setErrors({ ...errors, ["toilets"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/minus.png"
                        alt="minus"
                        className="w-[20px] mx-auto"
                      />
                    </button>
                    <input
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.toilets}
                      readOnly
                    />
                    <button
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        handleIncrement("toilets");
                        setErrors({ ...errors, ["toilets"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/plus.png"
                        alt="plus"
                        className="w-[25px]"
                      />
                    </button>
                  </div>
                  {/* {errors.toilets && <span className="text-[#ff0000] text-sm">{errors.toilets}</span>} */}
                </li>

                {/* Number of Living Rooms */}
                <li className="md:w-[48%] w-[100%] my-5">
                  <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of living rooms
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        handleDecrement("livingRoom");
                        setErrors({ ...errors, ["livingRoom"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/minus.png"
                        alt="minus"
                        className="w-[20px] mx-auto"
                      />
                    </button>
                    <input
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.livingRoom}
                      readOnly
                    />
                    <button
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        handleIncrement("livingRoom");
                        setErrors({ ...errors, ["livingRoom"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/plus.png"
                        alt="plus"
                        className="w-[25px]"
                      />
                    </button>
                  </div>
                  {/* {errors.livingRoom && <span className="text-[#ff0000] text-sm">{errors.livingRoom}</span>} */}
                </li>

                {/* Number of Floors in the Building */}
                <li className="md:w-[48%] w-[100%] my-5">
                  <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of floors in the building
                    {/* {+formData.propertyFloor >= 1 ? "*" : ""} */}
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        handleDecrement("totalFloorBuilding");
                        setErrors({ ...errors, ["totalFloorBuilding"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/minus.png"
                        alt="minus"
                        className="w-[20px] mx-auto"
                      />
                    </button>
                    <input
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.totalFloorBuilding}
                      readOnly
                    />
                    <button
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        handleIncrement("totalFloorBuilding");
                        setErrors({ ...errors, ["totalFloorBuilding"]: "" });
                      }}
                    >
                      <img
                        src="/assets/icons/plus.png"
                        alt="plus"
                        className="w-[25px]"
                      />
                    </button>
                  </div>
                  {/* {errors.totalFloorBuilding && <span className="text-[#ff0000] text-sm">{errors.totalFloorBuilding}</span>} */}
                </li>
              </ul>
              <div className="mt-5">
                <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                  Situation
                  <span className="font-[400] ms-1"> (Optional)</span>
                </label>
                <div className="flex items-center flex-wrap">
                  {situation?.map((option) => (
                    <div
                      key={option.id ?? option.label}
                      className="flex items-center me-4"
                    >
                      <Checkbox
                        checked={formData.situation?.includes(option.label)}
                        onChange={() =>
                          handleCheckboxChange(option.label, "situation")
                        }
                        className="group block size-4 me-2 my-1 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0] "
                      >
                        {/* Checkmark icon */}
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
                      <label className="text-[#47525E] capitalize">
                        {option?.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <label className="mb-1 block text-[16px] text-[#47525E] mb-5 font-[600] block">
                  Building
                  <span className="font-[400] ms-1"> (Optional)</span>
                </label>
              </div>
              <div className=" lg:w-[500px] w-[100%]">
                <label>Year of construction</label>
                <div className="font-[400] mt-2 text-[14px] text-[#47525E]">
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9]/g, "")?.slice(0, 4);
                      setFormData({ ...formData, building: value });
                    }}
                    className={`bg-white rounded-[7px] h-11 border p-2 px-3 xl:max-w-[500px] w-[100%] mb-4 border border-[#976DD0]`}
                    placeholder="Enter Year of construction"
                  />
                </div>
              </div>

              {dropdownOptions?.filter((itm) => itm?.type === "State")?.length >
                0 && (
                  <>
                    <div className="lg:w-[500px] w-[100%]">
                      <label>State</label>
                      <SelectDropdown
                        placeholder="Select State"
                        displayValue="name"
                        className="mt-2 capitalize"
                        intialValue={formData?.propertyState}
                        theme="search"
                        result={(e) => {
                          setFormData({ ...formData, propertyState: e.value });
                          setErrors({ ...errors, propertyState: "" });
                        }}
                        options={dropdownOptions?.filter(
                          (itm) => itm?.type === "State"
                        )}
                        isClearable={false}
                        required
                      />
                    </div>
                    {errors.propertyState && (
                      <span className="text-[#ff0000] text-sm">
                        {errors.propertyState}
                      </span>
                    )}
                  </>
                )}

              <div className="mt-10">
                <h4 className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
                  {" "}
                  Increase your property attractivity by giving more details.
                </h4>
              </div>

              {/* cooking */}
              {cookingOptions?.length > 0 && (
                <div>
                  <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                    Cooking <span className="font-[400] ms-1">(Optional)</span>
                  </label>
                  <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                    {cookingOptions.map((option) => (
                      <li
                        key={option.id}
                        className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] xl:my-0 my-2 relative"
                      >
                        <Checkbox
                          checked={formData.cooking?.includes(
                            option.id || option._id
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              option.id || option._id,
                              "cooking"
                            )
                          }
                          className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0"
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
                        <p className="text-[#606264] mt-3 capitalize">
                          {option.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Equipment */}
              {equipmentOptions?.length > 0 && (
                <div>
                  <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                    Equipment{" "}
                    <span className="font-[400] ms-1">(Optional)</span>
                  </label>
                  <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                    {equipmentOptions.map((option) => (
                      <li
                        key={option.id}
                        className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] xl:my-0 my-2 relative"
                      >
                        <Checkbox
                          checked={formData.equipment?.includes(option.id)}
                          onChange={() =>
                            handleCheckboxChange(option.id, "equipment")
                          }
                          className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                        >
                          {/* Checkmark icon */}
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
                        <p className="text-[#606264] mt-3 capitalize">
                          {option.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outside */}
              {outsideOptions?.length > 0 && (
                <div>
                  <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                    Outside <span className="font-[400] ms-1">(Optional)</span>
                  </label>
                  <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                    {outsideOptions.map((option) => (
                      <li
                        key={option.id}
                        className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] xl:my-0 my-2 relative"
                      >
                        <Checkbox
                          checked={formData.outside?.includes(option.id)}
                          onChange={() =>
                            handleCheckboxChange(option.id, "outside")
                          }
                          className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                        >
                          {/* Checkmark icon */}
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
                        <p className="text-[#606264] mt-3 capitalize">
                          {option.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Services and accessibility */}
              {servicesAndAccessibility?.length > 0 && (
                <div>
                  <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                    Services and accessibility{" "}
                    <span className="font-[400] ms-1">(Optional)</span>
                  </label>
                  <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                    {servicesAndAccessibility.map((option) => (
                      <li
                        key={option.id}
                        className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] xl:my-0 my-2 relative"
                      >
                        <Checkbox
                          checked={formData.serviceAccessibility?.includes(
                            option.id
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              option.id,
                              "serviceAccessibility"
                            )
                          }
                          className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                        >
                          {/* Checkmark icon */}
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
                        <p className="text-[#606264] mt-3 capitalize">
                          {option.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ancilliary areas */}
              {ancilliaryAreas?.length > 0 && (
                <div>
                  <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                    Ancilliary areas{" "}
                    <span className="font-[400] ms-1">(Optional)</span>
                  </label>
                  <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                    {ancilliaryAreas.map((option) => (
                      <li
                        key={option.id}
                        className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] xl:my-0 my-2 relative"
                      >
                        <Checkbox
                          checked={formData.ancilliary?.includes(option.id)}
                          onChange={() =>
                            handleCheckboxChange(option.id, "ancilliary")
                          }
                          className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                        >
                          {/* Checkmark icon */}
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
                        <p className="text-[#606264] mt-3 capitalize">
                          {option.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Environment */}
              {environment?.length > 0 && (
                <div>
                  <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                    Environment{" "}
                    <span className="font-[400] ms-1">(Optional)</span>
                  </label>
                  <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                    {environment.map((option) => (
                      <li
                        key={option.id}
                        className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] xl:my-0 my-2 relative"
                      >
                        <Checkbox
                          checked={formData.environment?.includes(option.id)}
                          onChange={() =>
                            handleCheckboxChange(option.id, "environment")
                          }
                          className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                        >
                          {/* Checkmark icon */}
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
                        <p className="text-[#606264] mt-3 capitalize">
                          {option.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Leisure */}
              {leisure?.length > 0 && (
                <div>
                  <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                    Leisure <span className="font-[400] ms-1">(Optional)</span>
                  </label>
                  <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                    {leisure.map((option) => (
                      <li
                        key={option.id}
                        className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer sm:w-[180px] w-[100%] sm:h-[140px] h-[120px] xl:my-0 my-2 relative"
                      >
                        <Checkbox
                          checked={formData.leisure?.includes(option.id)}
                          onChange={() =>
                            handleCheckboxChange(option.id, "leisure")
                          }
                          className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                        >
                          {/* Checkmark icon */}
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
                        <p className="text-[#606264] mt-3 capitalize">
                          {option.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* investment */}
              {investmentPurposes?.length > 0 && (
                <>
                  {" "}
                  <div className="mt-10">
                    <h4 className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
                      {" "}
                      Is your property qualified for investment purposes?
                    </h4>
                  </div>
                  <div className="flex items-center flex-wrap mt-5 xl:w-[500px] w-[100%] ">
                    {investmentPurposes.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center  my-2 w-1/2 "
                      >
                        <Checkbox
                          checked={formData.investment?.includes(option.id)}
                          onChange={() => {
                            handleCheckboxChange(option.id, "investment");
                            // setErrors({ ...errors, investment: "" })
                          }}
                          className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                        >
                          {/* Checkmark icon */}
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
                        <label className="text-[#47525E]">
                          {capLetter(option?.name)}
                        </label>
                      </div>
                    ))}
                  </div>
                  {/* {errors.investment && <span className="text-[#ff0000] text-sm">{errors.investment}</span>} */}
                </>
              )}
            </div>
          </div>
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
              onClick={handleBackNext}
              className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4  submit-btn  "
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn "
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
            step={2}
          />
        )}
      </div>
    </>
  );
};

export default Step4;
