import { Checkbox } from "@headlessui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { goalTypes, propertyTypes, saveChanges } from "../shared";

const Step0 = ({ step1, setActiveTabIndex, formData, setFormData, id,
    editMode = true, page, backTo }) => {
    const navigate = useNavigate();
    const [Error, setError] = useState({ type: "", propertyType: "" });
    const scrollRef = useRef(null);

    const validate = () => {
        if (!formData.propertyType) {
            setError({ ...Error, propertyType: "Select Property Type.." });
            return false;
        }
        if (formData.propertyType === "directory" && !formData.proposal) {
            setError({ ...Error, propertyType: "Select your choice.." });
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
            return false;
        }
        if (!formData.type) {
            setError({ ...Error, type: "Select Type.." })
            return false;
        }
        if (formData.propertyType === "directory" && !formData.usedAs) {
            setError({ ...Error, type: "Select Property used as.." });
            return false;
        }
        return true
    }

    const handleTypeSelect = (key, value) => {
        setError({ property: "", type: "" })
        let data = { ...formData }
        if (key === "propertyType") {
            if (value === "sale") {
                delete data.propertyMonthlyCharges;
                delete data.propertyInventory;
                delete data.guaranteeDeposit;
                delete data.proposal;
                delete data.userLeads;
                delete data.maxLeads;
                delete data.rateLeads;
                delete data.usedAs;
            } else if (value === "rent") {
                delete data.price;
                delete data.proposal;
                delete data.userLeads;
                delete data.maxLeads;
                delete data.rateLeads;
                delete data.usedAs;
            } else if ((value === "offmarket" || value === "directory")) {
                delete data.handleBy;
                delete data.agencyType;
                delete data.price;
                delete data.propertyAgencyFees;
                delete data.propertyCharges;
                delete data.propertyMonthlyCharges;
                delete data.propertyInventory;
                delete data.guaranteeDeposit;
                delete data.proposal;
                if (value === "directory") {
                    delete data.proposal;
                    delete data.userLeads;
                    delete data.rateLeads;
                    delete data.maxLeads;
                } else {
                    delete data.usedAs;
                }
            }
        }
        if (key === "handleBy" && value === "own") {
            delete data.agencyType;
        }
        data = { ...data, [key]: value }
        // if (key === "propertyType" && value !== "directory") {
        //     delete data?.proposal;
        //     delete data?.usedAs;
        // }
        setFormData({ ...data });
    };
    const toogleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: prev[key] === value ? "" : value,
        }))
        setError("")
    }

    const handleNext = () => {
        if (!validate()) return
        localStorage.setItem("step1", JSON.stringify(formData));
        if (page) {
            navigate(`/property/${page}/${id}`, {
                state: backTo ? { backTo: "property-requests" } : undefined,
            });
        } else if (id) {
            navigate(`/property/add/${id}/1`)
        } else {
            navigate("/property/add/1")
        }
        setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
    };
    const save = () => {
        if (!validate()) return;
        step1.propertyType = formData.propertyType;
        step1.type = formData.type;
        if (formData?.proposal) step1.proposal = formData?.usedAs;
        if (formData?.usedAs) step1.usedAs = formData?.usedAs;
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
    };

    return (
        <>
            <div className="flex justify-between flex-col h-full relative ">
                <div className=" lg:overflow-auto lg:h-[580px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
                    <div className="mb-10">
                        <h4 className="text-[#47525E] text-[24px] font-[600] text-left xl:mb-[  ] lg:mb-[40px] mb-[30px]">
                            What is your main goal ?
                        </h4>
                        <ul className="flex justify-start 2xl:gap-4 gap-0 w-full items-center xl:flex-nowrap flex-wrap">
                            {goalTypes.map((property) => (
                                <li
                                    key={property.name}
                                    onClick={() => {
                                        if (editMode) handleTypeSelect("propertyType", property.name)
                                    }}
                                    className={`capitalize text-[#606264] p-4 rounded-[10px] text-center font-medium me-3 cursor-pointer border-[2px] 
                                    ${formData?.propertyType === property.name?.toLowerCase()
                                            ? 'border-[#73339B]'
                                            : !editMode ? "border-transparent group" : 'border-transparent group hover:border-[#73339B]'
                                        } w-[130px] h-[110px] xl:my-0 my-2`}
                                >
                                    <img
                                        src={property.icon}
                                        alt={property.name}
                                        className="w-[40px] mx-auto block mb-2"
                                    />
                                    {property.name === "offmarket" ? "off-market" : property.name}
                                </li>
                            ))}
                        </ul>
                        {formData.propertyType === "directory" && (
                            // <div className="text-left md:max-w-2xl max-w-full mt-14 md:mx-24 mx-10">
                            <div ref={scrollRef} className="text-left md:max-w-2xl max-w-full mt-5">
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
                                        <Checkbox className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                                            checked={formData?.proposal === "rental"} disabled={!editMode}
                                            value={formData?.proposal}
                                            onChange={() => { if (editMode) toogleChange("proposal", "rental") }}
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
                                            Rental compatible
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                                            checked={formData?.proposal === "purchase"} disabled={!editMode}
                                            value={formData?.proposal}
                                            onChange={() => { if (editMode) toogleChange("proposal", "purchase") }}
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
                                            Purchase compatible
                                        </label>
                                    </div>
                                </div>
                                <p className="text-[#47525E] italic">This choice let us know when to display your property when user search properties in directory either for rental or for purchase opportunities.</p>
                            </div>
                        )}
                        <div style={{ color: "red" }}>{Error.propertyType}</div>
                    </div>

                    <h4 className="text-[#47525E] text-[24px] font-[600] text-left xl:mb-[50px] lg:mb-[40px] mb-[30px]">
                        Type of property
                    </h4>
                    <ul className="flex justify-start 2xl:gap-4 gap-0 w-full items-center xl:flex-nowrap flex-wrap">
                        {propertyTypes.map((property) => (
                            <li
                                key={property.value}
                                onClick={() => {
                                    if (editMode && !id) handleTypeSelect("type", property.name?.toLowerCase())
                                }}
                                className={`capitalize text-[#606264] p-4 rounded-[10px] text-center font-medium me-3 cursor-pointer border-[2px] 
                                    ${formData?.type === property.name?.toLowerCase()
                                        ? 'border-[#73339B]'
                                        : !editMode ? 'border-transparent group' : 'border-transparent group hover:border-[#73339B]'
                                    } w-[130px] h-[110px] xl:my-0 my-2`}
                            >
                                <img
                                    src={property.icon}
                                    alt={property.name}
                                    className="w-[40px] mx-auto block mb-2"
                                />
                                {property.name}
                            </li>
                        ))}
                    </ul>
                    {formData?.propertyType === "directory" && (
                        <div className="text-left max-w-2xl mt-14 mx-4">
                            <h3 className="text-[#47525E] font-[600] text-[18px]">
                                Property is used as:
                            </h3>
                            <div className="flex flex-col  mt-3 mb-7">
                                <div className="flex items-center mb-3">
                                    <Checkbox className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                                        checked={formData?.usedAs === "investment"}
                                        value={formData?.usedAs}
                                        onChange={() => { if (editMode) toogleChange("usedAs", "investment") }}
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
                                        Investment (long term rental)
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <Checkbox className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                                        checked={formData?.usedAs === "own usage"}
                                        value={formData?.usedAs}
                                        onChange={() => { if (editMode) toogleChange("usedAs", "own usage") }}
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
                                        Own usage
                                    </label>
                                </div>
                            </div>
                            <p className="text-[#47525E] italic">This choice let us know where to display your property when user search properties in directory either for rental or for purchase</p>
                        </div>
                    )}
                    <div style={{ color: "red" }}>{Error.type}</div>

                    <p className="text-[#47525E] text-[14px] xl:mt-14 lg:mt-8 mb-3 mt-5 text-start">
                        Once the property profile is published you won't
                        be able to edit this.
                    </p>
                </div>
                <div className="text-end  bg-[#f7f4fb] p-5 w-full flex justify-end">
                    {page === "detail" ? ("") : id ?
                        <button
                            onClick={save}
                            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
                        >
                            Save change
                        </button> : <button
                            onClick={handleNext}
                            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
                        >
                            Next
                        </button>}
                </div>
            </div>
        </>
    );
};

export default Step0;
