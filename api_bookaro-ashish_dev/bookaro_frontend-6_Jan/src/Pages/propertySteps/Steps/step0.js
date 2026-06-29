import { Checkbox, Switch } from "@headlessui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SelectDropdown from "../../../components/common/SelectDropdown";
import {
  addToTimeline,
  goalTypes,
  proposalData,
  rateLeadOption,
  saveChanges,
  sellTypes,
  userLeadOption,
} from "../shared";
import { formatCurrency } from "../../../models/string.model";
import PropertyCheck from "../propertyCheck";
import { useSelector } from "react-redux";

const Step0 = ({ step1, formData, setFormData, id }) => {
  const [timeline, setTimeline] = useState({ propertyId: id });
  const [error, setError] = useState({ type: "", price: "" });
  const activePlan = useSelector((state) => state.activePlan);

  const RatingValue = [
    // { id: "Any", name: "Any user with access to off-market can see it" },
    { id: "A", name: "A" },
    { id: "B", name: "B" },
    { id: "C", name: "C" },
    { id: "D", name: "D" },
    { id: "E", name: "E" },
  ];

  const grades = ["A", "B", "C", "D", "E"];

  const handleCheckboxChange = (id) => {
    const current = formData.chooseDocumentGrade;
    if (current === id) {
      setFormData({
        ...formData,
        chooseDocumentGrade: "",
      });
      return;
    }
    if (id === "Any") {
      setFormData({
        ...formData,
        chooseDocumentGrade: "Any",
        isChoosedDeclDocumentVerified: false,
        isChoosedDocumentVerified: false,
      });
      return;
    }
    setFormData({
      ...formData,
      chooseDocumentGrade: id,
    });
  };


  const isChecked = (id) => {
    const selected = formData.chooseDocumentGrade;
    if (selected === "Any") return id === "Any";
    if (
      selected === "" ||
      !(formData?.isChoosedDeclDocumentVerified || formData?.isChoosedDocumentVerified)
    )
      return false;
    const index = grades.indexOf(selected);
    const checkedGrades = grades.slice(0, index + 1);
    return checkedGrades.includes(id);
  };


  const checkDisabled = (item) => {
    if (formData?.offMarket) {
      if (formData?.isChoosedDeclDocumentVerified || formData?.isChoosedDocumentVerified) {
        return item === "Any";
      } else {
        return item !== "Any";
      }
    }
    return true;
  };

  const handleTypeSelect = (key, value) => {
    setError({ ...error, value: "" });
    let data = { ...formData };
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
      } else if (value === "offmarket" || value === "directory") {
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
    data = { ...data, [key]: value };
    setFormData({ ...data });
    // timeline
    if (key === "propertyType") {
      setTimeline((prev) => {
        const newState = { ...prev };
        newState[key] = value;
        if (value === "sale") {
          delete newState?.propertyMonthlyCharges;
          delete newState?.proposal;
        } else if (value === "rent") {
          delete newState?.price;
          delete newState?.proposal;
        } else if (value === "offmarket" || value === "directory") {
          delete newState?.propertyMonthlyCharges;
          delete newState?.price;
        }
        return newState;
      });
    }
  };

  const validate = () => {
    // if (
    //   formData?.propertyType === "sale" ||
    //   formData?.propertyType === "rent"
    // ) {
    //   if (!formData?.handleBy) {
    //     setError({ ...error, type: "Select Type.." });
    //     return false;
    //   }
    // }
    const typeValidations = {
      sale: [
        // "handleBy", 
        "price", "propertyCharges"],
      rent: [
        // "handleBy",
        "propertyCharges",
        "propertyMonthlyCharges",
        "guaranteeDeposit",
      ],
      offmarket: ["proposal", "userLeads", "rateLeads"],
      directory: ["proposal"],
    };
    const currentType = formData?.propertyType;
    const requiredFields = typeValidations[currentType] || [];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    console.log(missingFields, "missingFields")
    if (missingFields.length > 0) {
      setError({ ...error, price: "Enter mandetory fields.." });
      return false;
    }
    setError({ price: "" });
    return true;
  };

  const proList = [
    { name: "option 1", id: 1 },
    { name: "option 2", id: 2 },
    { name: "option 3", id: 3 },
    { name: "option 4", id: 4 },
  ];
  const handleChange = (field) => (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    const updatedFormData = { ...formData, [field]: value };

    if (
      field === "price" &&
      parseInt(updatedFormData.propertyAgencyFees) >= parseInt(value)
    ) {
      return setError({
        type: "",
        price: "Property price must be greater than agency fees",
      });
    }
    if (
      field === "propertyAgencyFees" &&
      parseInt(value) >= parseInt(updatedFormData.price)
    ) {
      return setError({
        type: "",
        price: "Agency fees must be less than the property price",
      });
    }
    setFormData(updatedFormData);
    // timeline
    if (field === "price" || field === "propertyMonthlyCharges") {
      setTimeline((time) => ({
        ...time,
        [field]: value,
      }));
    }
    if (step1?.propertyType === "sale") {
      if (formData.price !== "" && formData.propertyCharges !== "") {
        setError({ ...error, price: "" });
      }
    } else if (step1?.propertyType === "rent") {
      if (
        formData.propertyCharges !== "" &&
        formData.propertyMonthlyCharges !== "" &&
        formData.guaranteeDeposit !== ""
      ) {
        setError({ ...error, price: "" });
      }
    } else if (step1?.propertyType === "offmarket") {
      if (formData.searchType !== "" && formData.proposal !== "") {
        setError({ ...error, price: "" });
      }
    }
  };
  const toogleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
    setError("");
    // timeline
    if (key === "proposal") {
      setTimeline((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };
  const save = () => {
    if (!validate()) return;
    step1.propertyType = formData.propertyType;
    step1.isChoosedDocumentVerified = formData?.isChoosedDocumentVerified;
    step1.isChoosedDeclDocumentVerified = formData?.isChoosedDeclDocumentVerified;
    step1.chooseDocumentGrade = formData?.chooseDocumentGrade;
    step1.maximumLead = formData?.maximumLead;
    if (formData?.propertyType === "sale") {
      if (formData.handleBy) step1.handleBy = formData.handleBy;
      else delete step1.handleBy;
      if (formData?.agencyType) step1.agencyType = formData?.agencyType;
      else delete step1.agencyType;
      step1.price = formData.price;
      if (formData?.propertyAgencyFees)
        step1.propertyAgencyFees = formData?.propertyAgencyFees;
      else delete step1.propertyAgencyFees;
      step1.propertyCharges = formData.propertyCharges;
      delete step1.propertyMonthlyCharges;
      delete step1.propertyInventory;
      delete step1.guaranteeDeposit;
      delete step1.proposal;
      delete step1.userLeads;
      delete step1.maxLeads;
      delete step1.rateLeads;
    } else if (formData?.propertyType === "rent") {
      if (formData.handleBy) step1.handleBy = formData.handleBy;
      else delete step1.handleBy;
      if (formData?.agencyType) step1.agencyType = formData?.agencyType;
      else delete step1.agencyType;
      step1.propertyCharges = formData.propertyCharges;
      step1.propertyMonthlyCharges = formData.propertyMonthlyCharges;
      if (formData?.propertyAgencyFees)
        step1.propertyAgencyFees = formData?.propertyAgencyFees;
      else delete step1.propertyAgencyFees;
      if (formData?.propertyInventory)
        step1.propertyInventory = formData?.propertyInventory;
      else delete step1.propertyInventory;
      step1.guaranteeDeposit = formData.guaranteeDeposit;
      delete step1.price;
      delete step1.proposal;
      delete step1.userLeads;
      delete step1.maxLeads;
      delete step1.rateLeads;
    } else if (
      formData?.propertyType === "offmarket" ||
      formData?.propertyType === "directory"
    ) {
      step1.proposal = formData.proposal;
      step1.userLeads = formData.userLeads;
      step1.rateLeads = formData.rateLeads;
      if (formData?.maxLeads) step1.maxLeads = formData?.maxLeads;
      else delete step1.maxLeads;
      if (formData?.usedAs) step1.usedAs = formData?.usedAs;
      delete step1.handleBy;
      delete step1.agencyType;
      delete step1.price;
      delete step1.propertyAgencyFees;
      delete step1.propertyCharges;
      delete step1.propertyMonthlyCharges;
      delete step1.propertyInventory;
      delete step1.guaranteeDeposit;
      if (formData?.propertyType === "directory") {
        delete step1.userLeads;
        delete step1.rateLeads;
        delete step1.maxLeads;
      } else delete step1.usedAs;
    }
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
    localStorage.setItem("step1", JSON.stringify(step1));
    if (Object.keys(timeline)?.length >= 2)
      addToTimeline(timeline, setTimeline, id, step1);
    else saveChanges(step1);
  };

  return (
    <>
      <div className="flex justify-between flex-col h-full relative ">
        <PropertyCheck />
        <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <h4 className="text-[#47525E] md:text-[24px] text-[21px] font-[600] text-left xl:mb-[50px] lg:mb-[50px] mb-[40px]">
            Property Status and price
            <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left  ">
              *Mandatories information
            </span>
          </h4>

          <h2 className="text-[#47525E] font-[600] text-[20px] mb-2">
            What is the current status of your property?*
          </h2>
          <p className="text-[#47525E] mb-5">
            People following your property will be informed instantanately of
            any change
          </p>
          <ul className="flex md:flex-nowrap flex-wrap items-center">
            {goalTypes.map((property) => (
              <li
                key={property.name}
                onClick={() =>
                  handleTypeSelect("propertyType", property.name?.toLowerCase())
                }
                className={`text-[#606264]  rounded-[10px] w-[130px] h-[120px] xl:my-0 my-2 text-center flex items-center justify-center  flex-col font-medium me-6 cursor-pointer border-[2px]
                          ${formData?.propertyType === property.name
                    ? "border-[#73339B]"
                    : "border-transparent group hover:border-[#73339B]"
                  }  xl:my-0 my-2`}
              >
                <img
                  src={property.icon}
                  alt={property.name}
                  className="w-[40px] mx-auto block mb-2"
                />
                {property.label}
              </li>
            ))}
          </ul>

          {/* {formData?.propertyType === "directory" && (
            <div className="text-left md:max-w-2xl max-w-full mt-14 ">
              <h2 className="text-[#47525E] font-[600] text-[20px]">
                How do you want your property to be listed?
              </h2>
              <p className="text-[#47525E] my-4">
                People following your property will be informed instantanately
                of any change
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
                    Rental compatible
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                    checked={formData?.proposal === "purchase"}
                    value={formData?.proposal}
                    onChange={() => toogleChange("proposal", "purchase")}
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
              <p className="text-[#47525E] italic">
                This choice let us know when to display your property when user
                search properties in directory either for rental or for purchase
                opportunities.
              </p>
            </div>
          )} */}

          {formData?.propertyType === "directory" && (
            <div className="mt-10 lg:max-w-[700px] w-[100%]">
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
                      alt=""
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {(formData?.propertyType === "sale" ||
            formData?.propertyType === "rent") && (
              <>
                {/* <h4 className="text-[#47525E] font-[600] text-[20px] text-left  mb-[30px] mt-10">
                  How do you plan to{" "}
                  {formData?.propertyType === "sale" ? "sell" : "rent"} it?*
                </h4>
                <ul className="flex justify-start 2xl:gap-4 gap-0 w-full items-center xl:flex-nowrap flex-wrap">
                  {sellTypes.map((type) => (
                    <li
                      key={type.value}
                      onClick={() => {
                        handleTypeSelect("handleBy", type.value?.toLowerCase());
                        setError({ ...error, type: "" });
                      }}
                      className={`text-[#606264] p-4 rounded-[10px] text-center font-medium mb-6 cursor-pointer border-[2px]
                                     ${formData?.handleBy === type.value
                          ? "border-[#73339B]"
                          : "border-transparent group hover:border-[#73339B]"
                        } w-[130px] h-[120px] xl:my-0 my-2`}
                    >
                      <img
                        src={type.icon}
                        alt={type.name}
                        className="w-[40px] mx-auto block mb-2"
                      />
                      {type.name}
                    </li>
                  ))}
                </ul> */}

                {/* {error.type && (
                  <div className="mt-2 text-sm text-[#ff0000]">{error.type}</div>
                )} */}

                <div className="px-5 mt-8 mb-5">
                  <h4 className="text-[20px] mb-3">
                    Make sure to get only qualified leads
                  </h4>
                  <div className="lg:col-span-2">
                    <div className="flex gap-2">
                      <h5 className="text-[20px]">Activate Off-Market</h5>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formData.offMarket}
                          disabled={activePlan?.[0]?.otherDetails?.accessToOffMarketProps?.key == "custom" && (activePlan?.[0]?.otherDetails?.accessToOffMarketProps?.value <= activePlan?.[0]?.offMarketPropertyCount)}
                          onChange={(e) => {
                            if (e.target.checked == false) {
                              setFormData({ ...formData, offMarket: e.target.checked, chooseDocumentGrade: "", isChoosedDocumentVerified: false, isChoosedDeclDocumentVerified: false })
                            } else {
                              setFormData({ ...formData, offMarket: e.target.checked })
                            }
                          }
                          }
                        />
                        <div className="w-10 h-5 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:bg-[#976DD0] transition-all duration-300"></div>
                        <div className="absolute left-0.5 -translate-y-1/2 top-1/2 bg-white w-3.5 h-3.5 rounded-full transition-transform duration-300 peer-checked:translate-x-[20px]"></div>
                      </label>
                    </div>
                    {/* <Link className="text-primary text-[18px]" to={"/plan"}>
                      Upgrade plan
                    </Link> */}
                  </div>
                  <h5 className="text-[18px] mb-3">
                    Only following user can see my property under Off-market:
                  </h5>
                  <ul className="mb-8">

                    <li>
                      <div className="flex gap-2 items-center mb-2">
                        <input
                          type="checkbox"
                          className="accent-[#976DD0] w-4 h-4"
                          checked={formData.isChoosedDocumentVerified}
                          disabled={!formData.offMarket || formData.chooseDocumentGrade === "Any"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isChoosedDocumentVerified: e.target.checked,
                            })
                          }
                        />{" "}
                        <p>Document based financial background checked.</p>
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-2 items-center mb-2">
                        <input
                          type="checkbox"
                          className="accent-[#976DD0] w-4 h-4"
                          checked={formData.isChoosedDeclDocumentVerified}
                          disabled={!formData.offMarket || formData.chooseDocumentGrade === "Any"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isChoosedDeclDocumentVerified: e.target.checked,
                            })
                          }
                        />{" "}
                        <p>Declarative based financial background checked.</p>
                      </div>
                    </li>
                    <li>
                      <div className="flex gap-2 items-center mb-2">
                        <input
                          type="checkbox"
                          className="accent-[#976DD0] w-4 h-4"
                          checked={isChecked("Any")}
                          disabled={checkDisabled("Any")}
                          onChange={() => handleCheckboxChange("Any")}
                        />{" "}
                        <p>Any user with access to off-market can see it</p>
                      </div>
                    </li>
                  </ul>
                  <h5 className="text-[18px] mb-3">
                    Only following rates will see my property
                  </h5>
                  <ul className="mb-5">
                    {RatingValue.map((item, index) => {
                      return <li key={item.id}>
                        <div className="flex gap-2 items-center mb-2">
                          <input
                            type="checkbox"
                            className="accent-[#976DD0] w-4 h-4"
                            checked={isChecked(item.id)}
                            onChange={(e) => {
                              handleCheckboxChange(item.id)
                            }}
                            disabled={checkDisabled(item.id)}
                          />
                          <p className="text-[15px]">{item?.name}</p>
                        </div>
                      </li>
                    })}
                  </ul>
                </div>
                <div className="px-5 mb-5">
                  <h4 className="text-[20px] mb-1">
                    Don't get overwelmed by requests
                  </h4>
                  <p className="text-[16px] text-[#47525E]">
                    Once we react that maximum number of leads we will block
                    ability to contact you.
                  </p>
                  <div className="inline-flex gap-3 items-center bg-[#fff] p-2 rounded-md border border-[#976DD0] mt-4">
                    <input
                      type="number"
                      value={formData?.maximumLead}
                      className="bg-gray-200 p-1 px-3 w-[80px] rounded-md"
                      onChange={(e) =>
                        setFormData({ ...formData, maximumLead: e.target.value })
                      }
                    />
                    <h5 className="text-[16px] font-[500]">Maximum Leads</h5>
                  </div>
                </div>
                {formData?.handleBy === "real-estate-pro" && (
                  <>
                    <div className="xl:w-[500px] w-[100%]">
                      <label className="mb-1 mt-8 block text-[15px] text-[#47525E] font-[600]">
                        Select in the list or type Real esate pro name (Optional)
                      </label>
                      <SelectDropdown
                        placeholder="Select agency"
                        displayValue="name"
                        className="mt-2 capitalize mb-8"
                        intialValue={formData?.agencyType}
                        theme="search"
                        result={(e) => {
                          setFormData({ ...formData, agencyType: e.value });
                          setTimeline((prev) => ({
                            ...prev,
                            agencyType: e.value,
                          }));
                          // setError({ ...error, price: "" })
                        }}
                        options={proList}
                        // isClearable={false}
                        required
                      />
                    </div>
                    <div className="mt-10 bg-white p-5 rounded-md lg:w-[500px] w-[100%] shadow_new border  border-[#986dcd7d] mb-10 flex ">
                      <div className="me-4 w-[20%]">
                        <img
                          src="/assets/img/info-g.svg"
                          className="sm:w-[60px] w-[50px] mb-4  -mt-[2px] shadow_new rounded-[50px] p-1 border"
                          alt="Info"
                        />
                      </div>

                      <div className="flex items-start flex-col w-[75%]">
                        <h5 className="text-[#47525E] text-[16px] font-[600]  mb-2 border-b border-dashed border-[#47525E]  ">
                          Find your best local partner
                        </h5>
                        <label className="text-[#47525E] text-[14px] ">
                          Browse our Real estate pro repository to find the local
                          partner that specializes on your local market. This will
                          increase your chance to sell at the right price.
                        </label>
                        <Link
                          to={"/real-estate-pros"}
                          className="text-[#976DD0] underline font-[600] mt-2"
                        >
                          Real estate pro directory
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

          {formData?.propertyType === "sale" && (
            <div className="mt-4 lg:max-w-[500px] w-[100%] ">
              <p className="text-[#47525E] font-[600] text-[20px] mb-[30px]">
                {" "}
                What is your property price?
              </p>
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Property price without fees*
              </label>
              <div className="relative  w-[100%] mb-8">
                <input
                  // disabled={!editMode}
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
              <div className="relative  w-[100%] mb-8">
                <input
                  // disabled={!editMode}
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
                  // disabled={!editMode}
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

          {formData?.propertyType === "rent" && (
            <div className="mt-4 lg:max-w-[500px] w-[100%]">
              <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                Monthly rent*
              </label>
              <div className="relative  w-[100%] mb-4">
                <input
                  // disabled={!editMode}
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
                  // disabled={!editMode}
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
                  // disabled={!editMode}
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
                  // disabled={!editMode}
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
                  // disabled={!editMode}
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
          <div className="mt-2 text-sm text-[#ff0000]">{error.price}</div>
        </div>
        <div className="text-end bg-[#f2ecf8] p-5 w-full ">
          <button
            onClick={save}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
          >
            Save change
          </button>
        </div>
      </div>
    </>
  );
};

export default Step0;
