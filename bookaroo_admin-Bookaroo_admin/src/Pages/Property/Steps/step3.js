import {
  Checkbox,
} from "@headlessui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectDropdown from "../../../components/common/SelectDropdown";
import methodModel from "../../../methods/methods";
import { capLetter, formatCurrency } from "../../../models/string.models";
import { categorizeData, saveChanges, situation } from "../shared";

const Step3 = ({
  step1,
  formData,
  setFormData,
  handleCheckboxChange,
  handleIncrement,
  handleDecrement,
  setActiveTabIndex,
  amenity,
  id,
  editMode = true,
  page,
  backTo,
  dropdownOptions,
}) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const scrollRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.surface) newErrors.surface = "Surface is required.";
    if (formData.rooms == 0) newErrors.rooms = "Rooms cannot be zero.";
    // if (formData.bedrooms == 0) newErrors.bedrooms = "Bedrooms cannot be zero.";
    if (formData.propertyFloor == 0) newErrors.propertyFloor = "Number of Floors in Building cannot be zero..";
    // if (formData.toilets == 0) newErrors.toilets = "Toilets cannot be zero.";
    // if (formData.livingRoom == 0) newErrors.livingRoom = "Living room cannot be zero.";
    // if (formData.totalFloorBuilding == 0) newErrors.totalFloorBuilding = "Buildind floor cannot be zero.";
    // if (!formData.state) newErrors.state = "State is required.";
    // if (selections.investment.length == 0) newErrors.investment = "Investment Purposes is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
    return Object.keys(newErrors).length === 0;
  };

  const categorizedData = categorizeData(amenity);
  const ancilliaryAreas = categorizedData["ancilliary areas".toLowerCase()] || []
  const cookingOptions = categorizedData["Cooking".toLowerCase()] || []
  const environment = categorizedData["Environment".toLowerCase()] || []
  const equipmentOptions = categorizedData["Equipment".toLowerCase()] || []
  const leisure = categorizedData["Leisure".toLowerCase()] || []
  const outsideOptions = categorizedData["Outside".toLowerCase()] || []
  const servicesAndAccessibility = categorizedData["Services and accessibility".toLowerCase()] || []
  const investmentPurposes = categorizedData["investment".toLowerCase()] || []

  const handleNext = () => {
    if (!validate()) return
    localStorage.setItem("step1", JSON.stringify(formData))
    if (page) {
      navigate(`/property/${page}/${id}`, {
        state: backTo ? { backTo: "property-requests" } : undefined,
      });
    } else if (id) {
      navigate(`/property/add/${id}/3`)
    } else {
      navigate("/property/add/3")
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
  };

  const handleBackNext = () => {
    if (page) {
      navigate(`/property/${page}/${id}`, {
        state: backTo ? { backTo: "property-requests" } : undefined,
      });
    } else if (id) {
      navigate(`/property/add/${id}/2`)
    } else {
      navigate("/property/add/2")
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex - 1, 7));
  };
  const save = () => {
    if (!validate()) return
    step1.surface = formData.surface;
    step1.rooms = formData.rooms;
    step1.bathroom = formData.bathroom;
    step1.bedrooms = formData.bedrooms;
    step1.totalFloorBuilding = formData.totalFloorBuilding;
    step1.toilets = formData.toilets;
    step1.livingRoom = formData.livingRoom;
    step1.propertyFloor = formData.propertyFloor;
    step1.building = formData.building;
    step1.state = formData.state;
    step1.situation = formData.situation;
    step1.cooking = formData.cooking;
    step1.equipment = formData.equipment;
    step1.outside = formData.outside;
    step1.serviceAccessibility = formData.serviceAccessibility;
    step1.ancilliary = formData.ancilliary;
    step1.environment = formData.environment;
    step1.leisure = formData.leisure;
    step1.investment = formData.investment;
        if (step1?.energymode == "") {
      delete step1.energymode;
    }
    if (step1?.heatingType == "") {
      delete step1.heatingType;
    }
    if (step1?.emission_efficient == "") {
      delete step1.emission_efficient;
    }
    if (step1?.energy_efficient == "") {
      delete step1.energy_efficient;
    }
    if (step1?.usedAs == "") {
      delete step1.usedAs;
    }
    if (step1?.investment?.length == 0 || step1?.investment[0] == "") {
      delete step1.investment
    }
    localStorage.setItem("step1", JSON.stringify(step1))
    saveChanges(step1)
  }

  return (
    <>
      <div className="flex justify-between flex-col h-full relative ">
        <div className=" lg:overflow-auto lg:h-[580px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <h4 ref={scrollRef} className="text-[#47525E] text-[24px] font-[600] text-left xl:mb-[50px] lg:mb-[50px] mb-[40px]">
            What are the main characteristics of your property?
            <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
              *Mandatory information
            </span>
          </h4>
          <div>
            <div>
              <h4 className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
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
                <div className="relative xl:w-[500px] w-[100%]">
                  <input
                    disabled={!editMode}
                    type="text"
                    value={formatCurrency(formData?.surface)}
                    onChange={(e) => {
                      if (editMode) {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, "");
                        setFormData({ ...formData, surface: value });
                        setErrors({ ...errors, surface: "" });
                      }
                    }}
                    className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                    placeholder="Surface"
                  />
                  <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">m²</span>
                </div>
              </div>
              {errors.surface && <span className="text-[#ff0000] text-sm">{errors.surface}</span>}

              <ul className="flex flex-wrap mt-10">
                {/* Number of Rooms */}
                <li className="xl:w-[48%] w-[100%] my-5">
                  <label className="mb-1 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of rooms*
                    <span className="block font-[400] mt-2 mb-2 h-[50px] max-w-[300px] text-[14px]">
                      Kitchen, bathrooms, and toilets are not considered as rooms.
                    </span>
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        if (editMode) {
                          handleDecrement('rooms')
                          setErrors({ ...errors, ['rooms']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/minus.png" alt="minus" className="w-[20px] mx-auto" />
                    </button>
                    <input disabled={!editMode}
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.rooms}
                      readOnly
                    />
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center "
                      onClick={() => {
                        if (editMode) {
                          handleIncrement('rooms');
                          setErrors({ ...errors, ['rooms']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/plus.png" alt="plus" className="w-[25px]" />
                    </button>
                  </div>
                  {errors.rooms && <span className="text-[#ff0000] text-sm">{errors.rooms}</span>}
                </li>

                {/* Number of Bathrooms */}
                <li className="xl:w-[48%] w-[100%] my-5">
                  <label className="mb-1 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of bathrooms (Optional)
                    <span className="block font-[400] mt-2 mb-2 h-[50px] max-w-[300px] text-[14px]">A room with a bath.</span>
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        if (editMode) {
                          handleDecrement('bathroom')
                          setErrors({ ...errors, ['bathroom']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/minus.png" alt="minus" className="w-[20px] mx-auto" />
                    </button>
                    <input disabled={!editMode}
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.bathroom}
                      readOnly
                    />
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        if (editMode) {
                          handleIncrement('bathroom');
                          setErrors({ ...errors, ['bathroom']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/plus.png" alt="plus" className="w-[25px]" />
                    </button>
                  </div>
                </li>

                {/* Number of Bedrooms */}
                <li className="xl:w-[48%] w-[100%] my-5">
                  <label className=" block text-[16px] text-[#47525E] mb-[12px] font-[600] ">
                    Number of bedrooms
                    {" "}
                    (Optional)
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        if (editMode) {
                          handleDecrement('bedrooms')
                          // setErrors({ ...errors, ['bedrooms']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/minus.png" alt="minus" className="w-[20px] mx-auto" />
                    </button>
                    <input disabled={!editMode}
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.bedrooms}
                      readOnly
                    />
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        if (editMode) {
                          handleIncrement('bedrooms');
                          // setErrors({ ...errors, ['bedrooms']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/plus.png" alt="plus" className="w-[25px]" />
                    </button>
                  </div>
                  {/* {errors.bedrooms && <span className="text-[#ff0000] text-sm">{errors.bedrooms}</span>} */}
                </li>

                {/* Floor of the Property */}
                <li className="xl:w-[48%] w-[100%] my-5">
                  <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Floor of the property*
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        if (editMode) {
                          handleDecrement('propertyFloor')
                          setErrors({ ...errors, ['propertyFloor']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/minus.png" alt="minus" className="w-[20px] mx-auto" />
                    </button>
                    <input disabled={!editMode}
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.propertyFloor}
                      readOnly
                    />
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        if (editMode) {
                          handleIncrement('propertyFloor');
                          setErrors({ ...errors, ['propertyFloor']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/plus.png" alt="plus" className="w-[25px]" />
                    </button>
                  </div>
                  {errors.propertyFloor && <span className="text-[#ff0000] text-sm">{errors.propertyFloor}</span>}
                </li>

                {/* Number of Toilets */}
                <li className="xl:w-[48%] w-[100%] my-5">
                  <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of toilets
                    <span className="font-[400] ms-1">
                      {" "}
                      (Optional)
                    </span>
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        if (editMode) {
                          handleDecrement('toilets')
                          setErrors({ ...errors, ['toilets']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/minus.png" alt="minus" className="w-[20px] mx-auto" />
                    </button>
                    <input disabled={!editMode}
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.toilets}
                      readOnly
                    />
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        if (editMode) {
                          handleIncrement('toilets');
                          setErrors({ ...errors, ['toilets']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/plus.png" alt="plus" className="w-[25px]" />
                    </button>
                  </div>
                  {/* {errors.toilets && <span className="text-[#ff0000] text-sm">{errors.toilets}</span>} */}
                </li>

                {/* Number of Living Rooms */}
                <li className="xl:w-[48%] w-[100%] my-5">
                  <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                    Number of living rooms
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        if (editMode) {
                          handleDecrement('livingRoom')
                          setErrors({ ...errors, ['livingRoom']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/minus.png" alt="minus" className="w-[20px] mx-auto" />
                    </button>
                    <input disabled={!editMode}
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.livingRoom}
                      readOnly
                    />
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        if (editMode) {
                          handleIncrement('livingRoom');
                          setErrors({ ...errors, ['livingRoom']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/plus.png" alt="plus" className="w-[25px]" />
                    </button>
                  </div>
                  {/* {errors.livingRoom && <span className="text-[#ff0000] text-sm">{errors.livingRoom}</span>} */}
                </li>

                {/* Number of Floors in the Building */}
                <li className="xl:w-[500px] w-[100%] my-5">
                  <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                  Number of floors in the building
                  {/* {+formData.propertyFloor >= 1 ? "*" : ""} */}
                  </label>
                  <div className="flex items-center border border-[#976DD0] bg-white p-1 rounded-[7px] w-[200px] h-[48px]">
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#E8E8E8] rounded-[7px] p-1 w-[40px] h-[38px] text-center h-full"
                      onClick={() => {
                        if (editMode) {
                          handleDecrement('totalFloorBuilding')
                          setErrors({ ...errors, ['totalFloorBuilding']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/minus.png" alt="minus" className="w-[20px] mx-auto" />
                    </button>
                    <input disabled={!editMode}
                      type="number"
                      className="text-[#47525E] text-[20px] font-[600] w-[110px] bg-transparent text-center"
                      value={formData.totalFloorBuilding}
                      readOnly
                    />
                    <button disabled={!editMode}
                      type="button"
                      className="bg-[#976DD0] rounded-[7px] p-1 w-[40px] h-[38px] text-center cursor-pointer flex items-center justify-center"
                      onClick={() => {
                        if (editMode) {
                          handleIncrement('totalFloorBuilding');
                          setErrors({ ...errors, ['totalFloorBuilding']: "" })
                        }
                      }}
                    >
                      <img src="/assets/img/icons/plus.png" alt="plus" className="w-[25px]" />
                    </button>
                  </div>
                  {errors.totalFloorBuilding && <span className="text-[#ff0000] text-sm">{errors.totalFloorBuilding}</span>}
                </li>
              </ul>
              <div className="mt-5">
                <label className="mb-3 block text-[16px] text-[#47525E] mb-[12px] font-[600] block">
                  Situation
                  <span className="font-[400] ms-1">
                    {" "}
                    (Optional)
                  </span>
                </label>
                <div className="flex items-center flex-wrap">
                  {situation?.map((option) => <div className="flex items-center me-4">
                    <Checkbox disabled={!editMode}
                      checked={formData.situation?.includes(option.label)}
                      onChange={() => {
                        if (editMode) {
                          handleCheckboxChange(option.label, 'situation')
                        }
                      }}
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
                    <label className="text-[#47525E]">
                      {option?.label}
                    </label>
                  </div>)}
                </div>
              </div>
              <div className="mt-10">
                <label className="mb-1 block text-[16px] text-[#47525E] mb-5 font-[600] block">
                  Building
                  <span className="font-[400] ms-1">
                    {" "}
                    (Optional)
                  </span>
                </label>
              </div>
              <div className="xl:w-[500px] w-[100%]">
                <label>
                  Year of construction
                </label>
                <div className="font-[400] mt-2 text-[14px] text-[#47525E]">
                  <input
                    type="text"
                    value={formData.building}
                    disabled={!editMode}
                    onChange={(e) => {
                      if (editMode) {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, '')?.slice(0, 4);
                        setFormData({ ...formData, building: value })
                      }
                    }}
                    className={`bg-white rounded-[7px] h-11 border border-[#cdcdcd] p-2 px-3 xl:max-w-[500px] w-[100%] mb-4`}
                    placeholder="Enter Year of construction"
                  />
                </div>
              </div>
              <div className="xl:w-[500px] w-[100%]">
                <label>
                  State
                  {/* <span className="text-red-600">*</span> */}
                </label>
                <SelectDropdown
                  placeholder="Select State"
                  displayValue="name"
                  className="mt-2 capitalize"
                  intialValue={formData?.state}
                  theme="search"
                  disabled={!editMode}
                  result={(e) => {
                    if (editMode) {
                      setFormData({ ...formData, 'state': e.value })
                      setErrors({ ...errors, state: "" })
                    }
                  }}
                  options={dropdownOptions?.filter(itm => (
                    itm?.type === "State"
                  ))}
                  isClearable={false}
                  required
                />
              </div>
              {errors.state && <span className="text-[#ff0000] text-sm">{errors.state}</span>}

              <div className="mt-10">
                <h4 className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
                  {" "}
                  Increase your property attractivity by
                  giving more details.
                </h4>
              </div>
              <div>
                <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                  Cooking <span className="font-[400] ms-1">(Optional)</span>
                </label>
                <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                  {cookingOptions.map((option) => (
                    <li key={option.id} className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer w-[180px] h-[140px] xl:my-0 my-2 relative">
                      <Checkbox disabled={!editMode}
                        checked={formData.cooking.includes(option.id || option._id)}
                        onChange={() => {
                          if (editMode) {
                            handleCheckboxChange(option.id || option._id, 'cooking')
                          }
                        }}
                        className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0"
                      >
                        {/* Checkmark icon */}
                        <svg
                          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Checkbox>
                      <img src={methodModel.noImg(option?.icon, 'img')} className="w-[40px] mx-auto block mb-2 mt-3" />
                      <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                  Equipment <span className="font-[400] ms-1">(Optional)</span>
                </label>
                <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                  {equipmentOptions.map((option) => (
                    <li key={option.id} className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer w-[180px] h-[140px] xl:my-0 my-2 relative">
                      <Checkbox disabled={!editMode}
                        checked={formData.equipment.includes(option.id)}
                        onChange={() => {
                          if (editMode) {
                            handleCheckboxChange(option.id, 'equipment')
                          }
                        }} className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                      >
                        {/* Checkmark icon */}
                        <svg
                          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Checkbox>
                      <img src={methodModel.noImg(option?.icon, 'img')} className="w-[40px] mx-auto block mb-2 mt-3" />
                      <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outside */}
              <div>
                <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                  Outside <span className="font-[400] ms-1">(Optional)</span>
                </label>
                <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                  {outsideOptions.map((option) => (
                    <li key={option.id} className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer w-[180px] h-[140px] xl:my-0 my-2 relative">
                      <Checkbox disabled={!editMode}
                        checked={formData.outside.includes(option.id)}
                        onChange={() => {
                          if (editMode) { handleCheckboxChange(option.id, 'outside') }
                        }} className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                      >
                        {/* Checkmark icon */}
                        <svg
                          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Checkbox>
                      <img src={methodModel.noImg(option?.icon, 'img')} className="w-[40px] mx-auto block mb-2 mt-3" />
                      <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services and accessibility */}
              <div>
                <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                  Services and accessibility <span className="font-[400] ms-1">(Optional)</span>
                </label>
                <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                  {servicesAndAccessibility.map((option) => (
                    <li key={option.id} className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer w-[180px] h-[140px] xl:my-0 my-2 relative">
                      <Checkbox disabled={!editMode}
                        checked={formData.serviceAccessibility.includes(option.id)}
                        onChange={() => {
                          if (editMode) { handleCheckboxChange(option.id, 'serviceAccessibility') }
                        }} className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                      >
                        {/* Checkmark icon */}
                        <svg
                          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Checkbox>
                      <img src={methodModel.noImg(option?.icon, 'img')} className="w-[40px] mx-auto block mb-2 mt-3" />
                      <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ancilliary areas */}
              <div>
                <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                  Ancilliary areas <span className="font-[400] ms-1">(Optional)</span>
                </label>
                <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                  {ancilliaryAreas.map((option) => (
                    <li key={option.id} className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer w-[180px] h-[140px] xl:my-0 my-2 relative">
                      <Checkbox disabled={!editMode}
                        checked={formData.ancilliary.includes(option.id)}
                        onChange={() => {
                          if (editMode) {
                            handleCheckboxChange(option.id, 'ancilliary')
                          }
                        }} className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                      >
                        {/* Checkmark icon */}
                        <svg
                          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Checkbox>
                      <img src={methodModel.noImg(option?.icon, 'img')} className="w-[40px] mx-auto block mb-2 mt-3" />
                      <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Environment */}
              <div>
                <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                  Environment <span className="font-[400] ms-1">(Optional)</span>
                </label>
                <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                  {environment.map((option) => (
                    <li key={option.id} className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer w-[180px] h-[140px] xl:my-0 my-2 relative">
                      <Checkbox disabled={!editMode}
                        checked={formData.environment.includes(option.id)}
                        onChange={() => {
                          if (editMode) { handleCheckboxChange(option.id, 'environment') }
                        }} className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                      >
                        {/* Checkmark icon */}
                        <svg
                          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Checkbox>
                      <img src={methodModel.noImg(option?.icon, 'img')} className="w-[40px] mx-auto block mb-2 mt-3" />
                      <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Leisure */}
              <div>
                <label className="block text-[16px] text-[#47525E] font-[600] mt-10">
                  Leisure <span className="font-[400] ms-1">(Optional)</span>
                </label>
                <ul className="flex justify-start gap-4 w-full items-center flex-wrap my-5">
                  {leisure.map((option) => (
                    <li key={option.id} className="p-4 rounded-[10px] border-[2px] border-[#9C9A9D] text-center font-medium cursor-pointer w-[180px] h-[140px] xl:my-0 my-2 relative">
                      <Checkbox disabled={!editMode}
                        checked={formData.leisure.includes(option.id)}
                        onChange={() => {
                          if (editMode) { handleCheckboxChange(option.id, 'leisure') }
                        }} className="group block size-7 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-[5px] right-0 p-[3px]"
                      >
                        {/* Checkmark icon */}
                        <svg
                          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Checkbox>
                      <img src={methodModel.noImg(option?.icon, 'img')} className="w-[40px] mx-auto block mb-2 mt-3" />
                      <p className="text-[#606264] mt-3 capitalize">{option.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h4 className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
                  {" "}
                  Is your property qualified for investment purposes?
                </h4>
              </div>
              <div className="flex items-center flex-wrap mt-12 xl:w-[500px] w-[100%]">
                {investmentPurposes.map((option) =>
                  <div className="flex items-center  my-2 w-1/2">
                    <Checkbox disabled={!editMode}
                      checked={formData.investment.includes(option.id)}
                      onChange={() => {
                        if (editMode) {
                          handleCheckboxChange(option.id, 'investment')
                          // setErrors({ ...errors, investment: "" })
                        }
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
                  </div>)}
              </div>
              {/* {errors.investment && <span className="text-[#ff0000] text-sm">{errors.investment}</span>} */}
            </div>
          </div>

        </div>
        {page === "detail" ? ("") : id ?
          <div className="text-end  bg-[#f7f4fb] p-5 w-full ">
            <button
              onClick={save}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              Save change
            </button>
          </div> :
          <div className="text-end  bg-[#f7f4fb] p-5 w-full flex justify-end">
            <button onClick={handleBackNext} className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4  submit-btn  me-4">
              Back
            </button>
            <button onClick={handleNext} className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn ">
              Next
            </button>
          </div>
        }
      </div>
    </>
  );
};

export default Step3;
