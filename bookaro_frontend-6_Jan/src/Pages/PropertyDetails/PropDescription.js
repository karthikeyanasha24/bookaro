import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from "@headlessui/react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { Fragment, useState } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import methodModel from "../../methods/methods";
import { capLetter, formatCurrency } from "../../models/string.model";


const PropDescription = ({
  detail,
  categorizeData,
  amenities,
  handleAccordionChange,
  acrArr,
  kwh,
}) => {
  const categorizedData = categorizeData(amenities);
  const ancilliaryAreas =
    categorizedData["ancilliary areas".toLowerCase()]?.filter((itm) =>
      detail?.ancilliary?.includes(itm.id)
    ) || [];
  const cookingOptions =
    categorizedData["cooking".toLowerCase()]?.filter((itm) =>
      detail?.cooking?.includes(itm.id)
    ) || [];
  const environment =
    categorizedData["environment".toLowerCase()]?.filter((itm) =>
      detail?.environment?.includes(itm.id)
    ) || [];
  const equipmentOptions =
    categorizedData["equipment".toLowerCase()]?.filter((itm) =>
      detail?.equipment?.includes(itm.id)
    ) || [];
  const leisure =
    categorizedData["leisure".toLowerCase()]?.filter((itm) =>
      detail?.leisure?.includes(itm.id)
    ) || [];
  const outsideOptions =
    categorizedData["outside".toLowerCase()]?.filter((itm) =>
      detail?.outside?.includes(itm.id)
    ) || [];
  const servicesAndAccessibility =
    categorizedData["services and accessibility".toLowerCase()]?.filter((itm) =>
      detail?.serviceAccessibility?.includes(itm.id)
    ) || [];
  const investmentOptions =
    categorizedData["investment".toLowerCase()]?.filter((itm) =>
      detail?.investment?.includes(itm.id)
    ) || [];
  // const bathroom = categorizedData["bathroom"] || []
  // const livingAreas = categorizedData[["properties "]] || []
  const consumption =
    categorizedData["Consumption mode".toLowerCase()]?.filter(
      (itm) => detail?.heatingType === itm.id
    ) || [];
  const ratingColors = {
    A: "bg-green-500",
    B: "bg-green-400",
    C: "bg-yellow-300",
    D: "bg-yellow-200",
    E: "bg-orange-300",
    F: "bg-red-300",
    G: "bg-red-500",
  };
  const energyPerformance = [
    { type: "A", unit: "moin de 71kwh", color: "#00a577", size: "10px" },
    { type: "B", unit: "71KWh a 110KWh", color: "#00b961", size: "20px" },
    { type: "C", unit: "111KWh a 180KWh", color: "#91c45f", size: "30px" },
    { type: "D", unit: "181KWh a 260KWh", color: "#ffea55", size: "40px" },
    { type: "E", unit: "261KWh a 360KWh", color: "#ffbc48", size: "50px" },
    { type: "F", unit: "361KWh a 410KWh", color: "#ff894b", size: "60px" },
    { type: "G", unit: "de + 411KWh+", color: "#f71a32", size: "70px" },
  ];


  const [openResult, setOpenResult] = useState(false);
  const estimateBill = (surface, energy, cls) => {
    const price = +kwh || 0.2516;
    const ranges = {
      A: { min: 0, max: 50 },
      B: { min: 51, max: 90 },
      C: { min: 91, max: 150 },
      D: { min: 151, max: 230 },
      E: { min: 231, max: 330 },
      F: { min: 331, max: 450 },
      G: { min: 451, max: Infinity },
    };
    // let selectedClass;
    // if (energy <= 50) {
    //   selectedClass = ranges.A;
    // } else if (energy <= 90) {
    //   selectedClass = ranges.B;
    // } else if (energy <= 150) {
    //   selectedClass = ranges.C;
    // } else if (energy <= 230) {
    //   selectedClass = ranges.D;
    // } else if (energy <= 330) {
    //   selectedClass = ranges.E;
    // } else if (energy <= 450) {
    //   selectedClass = ranges.F;
    // } else {
    //   selectedClass = ranges.G;
    // }

    let selectedClass = ranges[cls];
    if (!selectedClass) {
      return "Invalid class type.";
    }
    const minC = Math.floor(selectedClass.min * +surface * price);
    const maxC = Math.floor(selectedClass.max * +surface * price);
    const min = formatCurrency(minC);
    const max = formatCurrency(maxC);
    if (cls === 'A') {
      return `Maximum ${max} €/year`
    } else if (cls === 'G') {
      return `Minimum ${min} €/year`
    } else {
      return `Between ${min} and ${max} €/year`;
    }
  };

  const getpricesqm = () => {
    let price = detail?.price || 0;
    let sur = parseInt(detail?.surface || 0);
    let perSqr;
    if (sur > 0) {
      perSqr = Number(price) / Number(sur);
    }
    return perSqr.toFixed(2);
  };

  return (
    <>
      <Accordion
        expanded={acrArr?.includes(0)}
        onChange={() => handleAccordionChange(0)}
        className="mb-5 border border-[#eaeaea] shadow-none "
      >
        <AccordionSummary
          expandIcon={<MdOutlineKeyboardArrowDown />}
          aria-controls="panel1-content"
          id="panel1-header"
          className="p-3"
        >
          <Typography>
            <span className="py-0 text-[#976DD0] font-[600] text-[17px] p-4 w-full text-left flex items-center justify-between">
              Property description
            </span>
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="text-gray-500 p-4">
          <div>
            <h4 className="capitalize text-[#47525E] font-[600] text-[18px] border-b border-[#D5D5D5] pb-2">
              {detail?.propertyTitle}
            </h4>
            <p className="text-[#47525E] text-[16px] py-4" dangerouslySetInnerHTML={{ __html: detail?.content }}></p>
          </div>
          <div className="mt-7">
            <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
              Characterstics
            </h4>
            <div className="flex gap-4 mt-6">
              {Number(detail?.price) > 0 && (
                <div className="bg-[#F0F0F0] p-4 rounded-[5px] text-[#47525E]">
                  Price: {formatCurrency(detail?.price) || 0} €
                </div>
              )}
              <div className="bg-[#F0F0F0] p-4 rounded-[5px] text-[#976DD0] underline capitalize">
                <p className="cursor-pointer">Estimate your monthly payment</p>
              </div>
              {Number(detail?.price) > 0 && (
                <div className="bg-[#F0F0F0] p-4 rounded-[5px] text-[#47525E]">
                  Price/sqm: {getpricesqm()} €
                </div>
              )}
              {detail?.building && (
                <div className="bg-[#F0F0F0] p-4 rounded-[5px] text-[#47525E]">
                  Built in {detail?.building}
                </div>
              )}
              {detail?.propertyState?.name && (
                <div className="bg-[#F0F0F0] p-4 rounded-[5px] text-[#47525E]">
                  State: {detail?.propertyState?.name}
                </div>
              )}
            </div>
            <ul className="flex items-start  mt-8 flex-wrap">
              {environment?.length > 0 && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">Environment</h5>
                  <ul>
                    {environment?.map((itm, i) => (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src={methodModel.noImg(itm?.icon, "img")}
                          alt="no-facing"
                          className="w-[25px] me-2 "
                        />
                        {itm?.name}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {ancilliaryAreas?.length > 0 && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">Ancilliary areas</h5>
                  <ul>
                    {ancilliaryAreas?.map((itm, i) => (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src={methodModel.noImg(itm?.icon, "img")}
                          alt="no-facing"
                          className="w-[25px] me-2 "
                        />
                        {itm?.name}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {servicesAndAccessibility?.length > 0 && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">
                    Services and accessibility
                  </h5>
                  <ul>
                    {servicesAndAccessibility?.map((itm, i) => (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src={methodModel.noImg(itm?.icon, "img")}
                          alt="no-facing"
                          className="w-[25px] me-2 "
                        />
                        {itm?.name}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {cookingOptions?.length > 0 && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">Cooking</h5>
                  <ul>
                    {cookingOptions?.map((itm, i) => (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src={methodModel.noImg(itm?.icon, "img")}
                          alt="no-facing"
                          className="w-[25px] me-2 "
                        />
                        {itm?.name}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {(+detail?.livingRoom > 0 || +detail?.bedrooms > 0) && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">Living areas</h5>
                  <ul>
                    {+detail?.livingRoom > 0 && (
                      <li className="flex items-center text-[#47525E] my-3">
                        <img
                          src="assets/img/property/ancillary/basement.png"
                          alt="basement"
                          className="w-[25px] me-2 "
                        />
                        {detail?.livingRoom} Living Room
                        {`${Number(detail?.livingRoom) > 1 ? "s" : ""}`}
                        {detail?.surface && (
                          <>
                            /{formatCurrency(detail?.surface)}{" "}
                            <span className="ms-1">
                              m<sup>2</sup>
                            </span>
                          </>
                        )}
                      </li>
                    )}
                    {+detail?.bedrooms > 0 && (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src="assets/img/property/ancillary/parking.png"
                          alt="parking"
                          className="w-[25px] me-2 "
                        />
                        {detail?.bedrooms} bedroom
                        {`${Number(detail?.bedrooms) > 1 ? "s" : ""}`}
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {(+detail?.toilets > 0 || +detail?.bathroom > 0) && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">Water room</h5>
                  <ul>
                    {+detail?.toilets > 0 && (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src="assets/img/property/ancillary/parking.png"
                          alt="parking"
                          className="w-[25px] me-2 "
                        />
                        {detail?.toilets} toilet
                        {`${Number(detail?.toilets) > 1 ? "s" : ""}`}
                      </li>
                    )}
                    {+detail?.bathroom > 0 && (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src="assets/img/property/services/handicapped-access.png"
                          alt="handicapped-access"
                          className="w-[25px] me-2 "
                        />
                        {detail?.bathroom} bathroom
                        {`${Number(detail?.bedrooms) > 1 ? "s" : ""}`}
                      </li>
                    )}
                  </ul>
                </li>
              )}

              {outsideOptions?.length > 0 && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">Outside</h5>
                  <ul>
                    {outsideOptions?.map((itm, i) => (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src={methodModel.noImg(itm?.icon, "img")}
                          alt="no-facing"
                          className="w-[25px] me-2 "
                        />
                        {itm?.name}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {leisure?.length > 0 && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">Leisure</h5>
                  <ul>
                    {leisure?.map((itm, i) => (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src={methodModel.noImg(itm?.icon, "img")}
                          alt="no-facing"
                          className="w-[25px] me-2 "
                        />
                        {itm?.name}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {equipmentOptions?.length > 0 && (
                <li className="xl:w-1/3 lg:w-1/2 mb-8">
                  <h5 className="text-[#47525E] font-[600]">Equipment</h5>
                  <ul>
                    {equipmentOptions?.map((itm, i) => (
                      <li className="flex items-center text-[#47525E] my-3 capitalize">
                        <img
                          src={methodModel.noImg(itm?.icon, "img")}
                          alt="no-facing"
                          className="w-[25px] me-2 "
                        />
                        {itm?.name}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
          <div className="mt-7">
            <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
              Heating and Diagnosis
            </h4>
            <ul className="flex gap-10">
              {consumption?.map((itm, i) => (
                <li className="my-3">
                  <div className="flex items-center text-[#47525E] capitalize">
                    <img
                      src={methodModel.noImg(itm?.icon, "img")}
                      alt=" Individual"
                      className="w-[25px] me-2 "
                    />
                    {itm?.name}
                  </div>
                </li>
              ))}
            </ul>
            <ul className="flex xl:flex-row flex-col md:gap-10 gap-0">
              <li className="xl:w-1/2 w-full my-3">
                <div className="flex items-center justify-between  mt-3">
                  <h4 className="text-[#47525E] font-[600] ">
                    Energy performance{" "}
                    <span className="2xl:inline-block hidden">diagnostics</span>
                  </h4>
                  {(detail?.diagnosisType?.toLowerCase()?.includes("later") ||
                    detail?.diagnosisType
                      ?.toLowerCase()
                      ?.includes("does not")) && (
                      <span className={`${detail?.diagnosisType?.toLowerCase()?.includes("later")
                        ? "text-[#52b31b]"
                        : ""
                        } bg-[#efefef] p-1 font-[600] px-3 rounded-[5px] text-[12px] text-[#976DD0]`}>
                        {detail?.diagnosisType?.toLowerCase()?.includes("later")
                          ? "Pending"
                          : detail?.diagnosisType
                            ?.toLowerCase()
                            ?.includes("does not")
                            ? "Not Applicable"
                            : ""}
                      </span>
                    )}
                </div>

                <div>
                  <div
                    className={` bg-white mb-4 rounded-[7px] mt-5 relative group 
                                     ${detail?.diagnosisType
                        ?.toLowerCase()
                        ?.includes("yes")
                        ? "show_gray_layer"
                        : ""
                      }`}
                  >
                    <div className="flex flex-col items-start  bg-white relative border rounded-[7px] h-[44px] steps-main-design ">
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
                            className={`flex-1 py-2 text-center   transition duration-300  ${detail?.energy_efficient === rating
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
                  <div className="flex items-center justify-between  ">
                    <p className="text-[#878889] text-[12px] ">
                      Energy-efficient home
                    </p>
                    <p className="text-[#878889] text-[12px] ">
                      Energy-intensive housing
                    </p>
                  </div>
                </div>
              </li>

              <li className="xl:w-1/2 w-full my-3">
                <div className="flex items-center justify-between  mt-3 ">
                  <h4 className="text-[#47525E] font-[600] ">
                    Greenhouse gas{" "}
                    <span className="2xl:inline-block hidden">emissions</span>
                  </h4>
                  {(detail?.diagnosisType?.toLowerCase()?.includes("later") ||
                    detail?.diagnosisType
                      ?.toLowerCase()
                      ?.includes("does not")) && (
                      <span
                        className={`${detail?.diagnosisType?.toLowerCase()?.includes("later")
                          ? "text-[#52b31b]"
                          : ""
                          } bg-[#efefef] p-1  px-3 rounded-[5px] text-[12px] text-[#976DD0] font-[600]`}
                      >
                        {detail?.diagnosisType?.toLowerCase()?.includes("later")
                          ? "Pending"
                          : detail?.diagnosisType
                            ?.toLowerCase()
                            ?.includes("does not")
                            ? "Not Applicable"
                            : ""}
                      </span>
                    )}
                </div>
                <div>
                  <div
                    className={`bg-white  mb-4 rounded-[7px] mt-5 relative group 
                                    ${detail?.diagnosisType
                        ?.toLowerCase()
                        ?.includes("yes")
                        ? "show_gray_layer"
                        : ""
                      }`}
                  >
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
                            className={`flex-1 py-2 text-center transition duration-300  ${detail?.emission_efficient === rating
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
                  <div className="flex items-center justify-between  ">
                    <p className="text-[#878889] text-[12px] ">Low emissions</p>
                    <p className="text-[#878889] text-[12px] ">High emisisons</p>
                  </div>
                </div>
              </li>
            </ul>
            {detail?.diagnosisType?.toLowerCase()?.includes("yes") && (
              <button
                type="button"
                onClick={() => setOpenResult(true)}
                className=" underline cursor-pointer"
              >
                See Details
              </button>
            )}
            <Transition appear show={openResult} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={() => {
                  setOpenResult(false);
                }}
              >
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/25" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all ">

                        <div className="overflow-auto h-[500px] p-6">
                          <DialogTitle
                            as="h3"
                            className="text-2xl font-bold leading-6 text-[#47525E]"
                          >
                            Detail of energy diagnostics
                          </DialogTitle>
                          <div className="mt-4">
                            <p className="text-[#47525E] font-[600]">
                              Estimated energy bill
                            </p>
                          </div>
                          <div className="bg-[#f4f4ff] rounded-[8px] px-[8px] py-[16px] mb-[16px] font-[700] text-[16px] my-4">
                            <p>
                              {estimateBill(
                                +detail?.surface,
                                +detail?.energyConsumption,
                                detail?.energy_efficient,
                              )}
                            </p>
                          </div>
                          <p className="text-[#47525E] text-[13px]">
                            Estimated annual energy expenditure for standard use:
                            {" "}{estimateBill(
                              +detail?.surface,
                              +detail?.energyConsumption,
                              detail?.energy_efficient,
                            )}.
                          </p>
                          <p className="text-[#47525E] text-[13px]">
                            Average energy prices indexed as of January 1, 2020
                            (subscription included).
                          </p>
                          <p className="py-2 border-b border-[#eaeaea] block"></p>

                          <div>
                            <div className="mt-4">
                              <p className="text-[#47525E] font-[600] text-[18px] mb-4">
                                Energy performance diagnosis (EPD)
                              </p>
                            </div>
                            <p className="text-[12px] text-[#2b2b2b]">
                              High-performance housing
                            </p>
                            <div
                              className={`flex ${detail?.energy_efficient == "A" ||
                                detail?.energy_efficient == "B"
                                ? `items-start`
                                : detail?.energy_efficient == "f" ||
                                  detail?.energy_efficient == "g"
                                  ? `items-end`
                                  : `items-center`
                                }`}
                            >
                              <ul className="flex-wrap">
                                {energyPerformance.map((option, i) => (
                                  <li className=" mb-1  " key={i}>
                                    <div className="relative flex items-center  ">
                                      <div className="flex items-center">
                                        <div className="flex items-center w-[16px]">
                                          <p className="text-[#868389] text-[13px] capitalize">
                                            {option?.type}
                                          </p>
                                        </div>
                                        <div className="flex  ">
                                          <p
                                            className={`w-[${option.size}] h-[28px] bg-[${option.color}] rounded-tl-[4px] rounded-bl-[4px] rounded-br-[1px] rounded-tr-[1px] block `}
                                          ></p>
                                          <p className={`traingle_shape${i}`}></p>
                                        </div>
                                      </div>
                                      {option?.type == detail?.energy_efficient && (
                                        <p className=" w-full h-[1px] bg-[#ffbc00]  block"></p>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>

                              {
                                <div className="border border-[#ffbc00] p-3 rounded-[7px]">
                                  <h4 className="font-bold text-[20px] text-[#2b2b2b]">
                                    {detail?.energy_efficient}
                                  </h4>
                                  <p className="text-[12px]">
                                    Consumption (primary energy)
                                  </p>
                                  <h3 className="text-[14px] font-bold">
                                    {formatCurrency(detail?.energyConsumption)} kWh/m².year
                                  </h3>
                                  <p className="text-[12px] mt-2">Emissions</p>
                                  <h3 className="text-[14px] font-bold">
                                    {formatCurrency(detail?.emissions)} kg
                                  </h3>
                                  <h3 className="text-[14px] font-bold">
                                    kg CO₂/m².year
                                  </h3>
                                </div>
                              }
                            </div>
                            <p className="text-[12px]">
                              Extremely energy-intensive housing
                            </p>
                            <p className="text-[12px]">
                              Diagnosis carried out {detail?.dateOfDiagnosis}
                              {/* after July 1, 2021 */}
                            </p>
                          </div>
                          <div>
                            <div className="mt-4">
                              <p className="text-[#47525E] font-[600] text-[18px] mb-4">
                                Greenhouse gas (GHG) emission index
                              </p>
                            </div>
                            <p className="text-[12px] text-[#2b2b2b]">
                              Low CO₂ emissions
                            </p>
                            <div
                              className={`flex ${detail?.emission_efficient == "A" ||
                                detail?.emission_efficient == "B"
                                ? `items-start`
                                : detail?.emission_efficient == "f" ||
                                  detail?.emission_efficient == "g"
                                  ? `items-end`
                                  : `items-center`
                                }`}
                            >
                              <ul className="flex-wrap">
                                {energyPerformance.map((option, i) => (
                                  <li className=" mb-1  " key={i}>
                                    <div className="relative flex items-center  ">
                                      <div className="flex items-center">
                                        <div className="flex items-center w-[16px]">
                                          <p className="text-[#868389] text-[13px] capitalize">
                                            {option?.type}
                                          </p>
                                        </div>
                                        <div className="flex  ">
                                          <p
                                            className={`w-[${option.size}] h-[28px] bg-[${option.color}] rounded-tl-[4px] rounded-bl-[4px] rounded-br-[1px] rounded-tr-[1px] block `}
                                          ></p>
                                          <p className={`traingle_shape${i}`}></p>
                                        </div>
                                      </div>
                                      {option?.type ==
                                        detail?.emission_efficient && (
                                          <p className=" w-full h-[1px] bg-[#ffbc00]  block"></p>
                                        )}
                                    </div>
                                  </li>
                                ))}
                              </ul>

                              <div className="border border-[#ffbc00] p-3 rounded-[7px]">
                                <h4 className="font-bold text-[20px] text-[#2b2b2b]">
                                  {detail?.emission_efficient}
                                </h4>
                                <p className="text-[12px]">Emissions</p>
                                <h3 className="text-[14px] font-bold">
                                  {formatCurrency(detail?.emissions)} kg
                                </h3>

                                <h3 className="text-[14px] font-bold">
                                  CO₂/m².year
                                </h3>
                              </div>
                            </div>
                            <p className="text-[12px]">Very high CO₂ emissions</p>
                          </div>
                        </div>

                      </DialogPanel>
                    </TransitionChild>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
          {(detail?.propertyType === "sale" ||
            detail?.propertyType === "rent") && (
              <div className="mt-7">
                <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2 mt-4">
                  Pricing details
                </h4>
                {detail?.propertyType === "sale" ? (
                  <div className="">
                    {detail?.propertyAgencyFees ? (
                      <>
                        <div className="mt-4">
                          <div className="flex items-start justify-between ">
                            <h5>Price without agency fees</h5>
                            <p>{formatCurrency(+detail?.price)} €</p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>
                              Agency fees
                              {/* (10% of seller price) */}
                            </p>
                            <p>
                              {formatCurrency(+detail?.propertyAgencyFees)} €
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-start justify-between ">
                            <h5 className="text-[#47525E] font-[600] ">
                              Price for buyer
                            </h5>
                            <p className="text-[#47525E] font-[600]">
                              {formatCurrency(Math.floor(+detail?.price + +detail?.propertyAgencyFees))} €
                            </p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>Estimated notary fees (8%) </p>
                            <p>{formatCurrency(Math.floor(+detail?.price * 0.08))} €</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-between mt-5">
                          <div className="w-[80%]">
                            <h5 className="text-[#47525E] font-[600]">
                              Global project amount
                            </h5>
                          </div>
                          <p className="text-[#47525E] font-[600]">
                            {formatCurrency(Math.floor((
                              +detail?.price +
                              +detail?.propertyAgencyFees +
                              +detail?.price * 0.08
                            )))}{" "}
                            €
                          </p>
                        </div>
                        {/* <div className="flex items-start justify-between mt-5">
                          <div className="w-[80%]">
                            <h5 className="text-[#47525E] font-[600]">
                           Price per squre meter
                            </h5>
                          </div>
                          <p className="text-[#47525E] font-[600]">
                           {detail?.pricePerSqm}{" "}
                            €
                          </p>
                        </div> */}

                        <div className="flex items-start justify-between">
                          <div className="w-[80%]">
                            <h5 className="text-[#47525E] font-[600]">
                              Property annual building charges
                            </h5>
                          </div>
                          <p className="text-[#47525E] font-[600]">
                            {formatCurrency(+detail?.propertyCharges)} €
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-4">
                          <div className="flex items-start justify-between ">
                            <h5 className="text-[#47525E] font-[600] ">
                              Price for buyer
                            </h5>
                            <p className="text-[#47525E] font-[600]">
                              {+detail?.price} €
                            </p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>Estimated notary fees (8%) </p>
                            <p> {formatCurrency(Math.floor(+detail?.price * 0.08))} €</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-between mt-5">
                          <div className="w-[80%]">
                            <h5 className="text-[#47525E] font-[600]">
                              Global project amount
                            </h5>
                          </div>
                          <p className="text-[#47525E] font-[600]">
                            {formatCurrency(Math.floor(+detail?.price + +detail?.price * 0.08))} €
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ) : detail?.propertyType === "rent" ? (
                  <div className="">
                    {detail?.propertyAgencyFees ? (
                      <>
                        <div className="mt-4">
                          <div className="flex items-start justify-between ">
                            <h5 className="text-[#47525E] font-[600] ">
                              Total monthly rent including charges
                            </h5>
                            <p className="text-[#47525E] font-[600]">
                              {formatCurrency(Math.floor(
                                (+detail.propertyCharges || 0) +
                                (+detail?.propertyMonthlyCharges || 0)
                              ))}{" "}
                              €
                            </p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>Monthly rent</p>
                            <p>{formatCurrency(detail?.propertyMonthlyCharges || 0)} €</p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>Building provisional charges</p>
                            <p>{formatCurrency(detail?.propertyCharges || 0)} €</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-start justify-between ">
                            <h5 className="text-[#47525E] font-[600] ">
                              One time fees paid by renter
                            </h5>
                            <p className="text-[#47525E] font-[600]">
                              {formatCurrency(Math.floor(
                                (+detail.propertyAgencyFees || 0) +
                                (+detail?.propertyInventory || 0)))}{" "}
                              €
                            </p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>Agency fees</p>
                            <p>{formatCurrency(detail.propertyAgencyFees || 0)} €</p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>Inventory of property</p>
                            <p>{formatCurrency(detail.propertyInventory || 0)} €</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-between mt-5">
                          <div className="w-[80%]">
                            <h5 className="text-[#47525E] font-[600]">
                              Guarantee deposit
                            </h5>
                          </div>
                          <p className="text-[#47525E] font-[600]">
                            {formatCurrency(detail.guaranteeDeposit || 0)} €
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mt-4">
                          <div className="flex items-start justify-between ">
                            <h5 className="text-[#47525E] font-[600] ">
                              Total monthly rent including charges
                            </h5>
                            <p className="text-[#47525E] font-[600]">
                              {formatCurrency((+detail.propertyCharges || 0) +
                                (+detail?.propertyMonthlyCharges || 0))}{" "}
                              €
                            </p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>Monthly rent</p>
                            <p>{formatCurrency(detail?.propertyMonthlyCharges || 0)} €</p>
                          </div>
                          <div className="flex items-start justify-between ">
                            <p>Building provisional charges</p>
                            <p>{formatCurrency(detail?.propertyCharges || 0)} €</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-between mt-5">
                          <div className="w-[80%]">
                            <h5 className="text-[#47525E] font-[600]">
                              Guarantee deposit
                            </h5>
                          </div>
                          <p className="text-[#47525E] font-[600]">
                            {formatCurrency(detail.guaranteeDeposit || 0)} €
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          <div className="mt-7">
            <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
              Georisques
            </h4>
            <p className="text-[#47525E] text-[16px] py-4">
              Information on the risks to which this property is exposed is
              available on the Géorisques website:
              <a
                href="https://www.georisques.gouv.fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.georisques.gouv.fr
              </a>
            </p>
          </div>
          {investmentOptions?.length > 0 && (
            <div className="mt-7">
              <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                Investment
              </h4>
              <ul className="flex flex-wrap">
                {investmentOptions?.map((itm) => (
                  <li className="flex items-center md:w-1/2 w-full my-2">
                    <IoMdCheckmark className="me-2 text-black" />
                    {capLetter(itm.name)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default PropDescription;
