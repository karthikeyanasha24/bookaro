import {
  Checkbox,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { TbRulerMeasure } from "react-icons/tb";
import ReactStars from "react-rating-stars-component";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import GooglePlaceAutoComplete from "../../../components/common/GooglePlaceAutoComplete";
import SelectDropdown from "../../../components/common/SelectDropdown";
import addressModel from "../../../models/address.model";
import {
  formatCurrency,
  generateDynamicString,
  stringSeprator,
} from "../../../models/string.model";
import { all } from "axios";
import { useSelector } from "react-redux";

const CommonFilter = ({
  allfilters,
  setAllFilters,
  priceRange,
  setPriceRange,
  revenues,
  setRevenues,
  surface,
  setSurface,
  handleApplyRevenues,
  handleApplySurface,
  selectedTypes,
  setSelectedTypes,
  isOpen,
  setIsOpen,
  isOpen1,
  setIsOpen1,
  isOpen2,
  setIsOpen2,
  isOpen3,
  setIsOpen3,
  isOpen4,
  setIsOpen4,
  isOpen5,
  setIsOpen5,
  isOpen6,
  setIsOpen6,
  selectedTab,
  setSelectedTab,
  handleCheckboxChange,
  closeFilter,
  handleApply,
  resetData,
  view,
  setView,
  showReset,
  currentLocation,
  setCurrentLocation,
  locations,
  setLocations,
  resetIndividual,
  removeParams,
  isOpen7,
  setIsOpen7,
  selections,
  setSelections,
  categorizedData,
  selectedLetters,
  setSelectedLetters,
  handleLetterChange,
  handleCreteriaApply,
  isOpen9,
  setIsOpen9,
  selectedRooms,
  setSelectedRooms,
  toggleCriteriaCheckbox,
  indFilter,
  setIndFilter,
  error,
  setError,
  upcomingCount,
  proposal,
  setProposal,
  alert,
  setAlert,
  addAlert,
  setcitySearch,
  setZipcodeSearch,
}) => {
  const ancilliaryAreas =
    categorizedData["Ancilliary areas".toLowerCase()] || [];
  const cookingOptions = categorizedData["cooking".toLowerCase()] || [];
  const activePlan = useSelector((state) => state.activePlan);
  const environment = categorizedData["Environment".toLowerCase()] || [];
  const equipmentOptions = categorizedData["Equipment".toLowerCase()] || [];
  const leisure = categorizedData["Leisure".toLowerCase()] || [];
  const outsideOptions = categorizedData["Outside".toLowerCase()] || [];
  const investmentPurposes = categorizedData["investment".toLowerCase()] || [];
  const servicesAndAccessibility =
    categorizedData["Services and accessibility".toLowerCase()] || [];
  const energyPerformance = [
    { type: "A", unit: "moin de 71kwh", color: "#00a577", size: "10px" },
    { type: "B", unit: "71KWh a 110KWh", color: "#00b961", size: "20px" },
    { type: "C", unit: "111KWh a 180KWh", color: "#91c45f", size: "30px" },
    { type: "D", unit: "181KWh a 260KWh", color: "#ffea55", size: "40px" },
    { type: "E", unit: "261KWh a 360KWh", color: "#ffbc48", size: "50px" },
    { type: "F", unit: "361KWh a 410KWh", color: "#ff894b", size: "60px" },
    { type: "G", unit: "de + 411KWh+", color: "#f71a32", size: "70px" },
  ];
  const schoolType = [
    { id: "elementarySchool", name: "Elementary School" },
    { id: "college", name: "College" },
    { id: "kindergarten", name: "Kindergarten" },
    { id: "elementaryPrimary", name: "Elementary Primary" },
    { id: "highschool", name: "High School" },
  ];

  const schoolStatus = [
    { id: "Private", name: "Private" },
    { id: "Public", name: "Public" },
  ];
  const [inputKey, setInputKey] = useState(0);
  const [rating, setRating] = useState(0);
  const locBtnStr = allfilters?.search?.split(",")?.slice(0, 1)[0];
  const trueLocs = locations?.filter((itm) => itm?.added);
  const allowedValues = [0, 5, 10, 20, 50, 100, 200];
  const [selectedValue, setSelectedValue] = useState(0);

  const tabValues = {
    sale: "Buy",
    rent: "Rent",
    offmarket: "Off-Market",
    directory: "Directory",
  };
  const propertyTypes = [
    {
      id: "Apartment",
      name: "Apartment",
      icon: "/assets/img/prop/apartment.png",
    },
    { id: "House", name: "House", icon: "/assets/img/prop/home.png" },
    { id: "Castle", name: "Castle", icon: "/assets/img/prop/castle.png" },
    { id: "Building", name: "Building", icon: "/assets/img/prop/building.png" },
    { id: "Farm", name: "Farm", icon: "/assets/img/prop/farm.png" },
  ];

  const handleRating = (rate) => {
    setRating(rate);
    setIndFilter({ ...allfilters, rating: rate });
    setError({ ...error, rating: "" });
  };

  const [isMenuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    if (allfilters?.rating) {
      setRating(allfilters?.rating);
    }
  }, [allfilters]);

  const applyBuyFilter = () => {
    removeParams("propertyType");
    removeParams("offMarket");
    setIsOpen(false);
    const updatedFilters = {
      ...allfilters,
      type: selectedTypes?.map((data) => data)?.join(","),
      // propertyType: selectedTab ? selectedTab : "sale",
      propertyType: (selectedTab == "offmarket") ? "" : selectedTab,
    };
    if (selectedTab === "offmarket") {
      updatedFilters.price = "";
      updatedFilters.offMarket = true;
    } else {
      updatedFilters.proposal = "";
    }
    setAllFilters(updatedFilters);
  };

  const addressResult = async (e) => {
    let address = {};
    if (e.place) {
      address = await addressModel.getAddress(e.place);
    }
    const name = `${e.value}`;
    const newLocation = {
      name: name,
      added: true,
      userLat: address?.lat,
      userLng: address?.lng,
      city: address?.city,
      zipcode: address?.zipcode
    };
    setLocations([...locations, newLocation]);
    setCurrentLocation("");
    setInputKey((prevKey) => prevKey + 1);
    setError({ ...error, location: "" });

    let data = { ...allfilters, ...indFilter };
    let locs = [...locations?.filter((itm) => itm?.added), newLocation];
    data.search = locs.map((itm) => itm.name).join(" / ");
    setIndFilter({
      ...data,
      maxDistance: locs?.length === 1 ? selectedValue : 0,
      userLat: locs?.length === 1 ? locs?.[0]?.userLat : "",
      userLng: locs?.length === 1 ? locs?.[0]?.userLng : "",
    });
  };

  const handleChange = (event, newValue) => {
    const closestValue = allowedValues.reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
    );
    setSelectedValue(closestValue);
    let locs = locations?.filter((itm) => itm?.added);
    let data = {
      ...allfilters,
      search: locs?.map((data) => data?.name).join(","),
      maxDistance: locs?.length > 1 ? 0 : closestValue || selectedValue,
      userLat: locs?.length > 1 ? "" : locs[0]?.userLat,
      userLng: locs?.length > 1 ? "" : locs[0]?.userLng,
    };
    setTimeout(() => {
      setIndFilter({ ...data });
    }, 2000);
  };
  const otherFilterKeys = [
    "bedrooms",
    "propertyFloor",
    "cooking",
    "equipment",
    "outside",
    "serviceAccessibility",
    "ancilliary",
    "environment",
    "leisure",
    "investment",
    "energy_efficient",
  ];
  const otherFilterCount = otherFilterKeys.reduce((count, key) => {
    const value = allfilters[key];
    if (value && (Array.isArray(value) ? value.length > 0 : true)) {
      count += 1;
    }
    return count;
  }, 0);

  const alertReasons = [
    {
      id: "searching for principal residence",
      name: "searching for principal residence",
    },
    {
      id: "searching for secondary residence",
      name: "searching for secondary residence",
    },
    { id: "searching for an investment", name: "searching for an investment" },
    {
      id: "get update on price evolution",
      name: "get update on price evolution",
    },
    { id: "other", name: "other" },
  ];

  const toggleRoomSelection = (key, value) => {
    setSelectedRooms((prev) => {
      if (prev.includes(value)) {
        return prev?.filter((room) => room !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  const applyRoomsFilters = () => {
    setIsOpen5(false);
    let data = { ...allfilters };
    data = {
      ...data,
      rooms: selectedRooms.join(),
    };
    setAllFilters(data);
  };

  return (
    <>
      <div className="bg-white sticky top-[59px] xl:top-[68px] z-[7] border-b">
        <div className=" items-center  mx-auto  lg:px-10 px-6">
          <div className="grid grid-cols-12 py-4 ">
            <div className="col-span-12 flex xl:items-center items-center lg:items-start xl:flex-row lg:flex-col md:flex-row flex-col justify-between">
              <ul className="flex items-center flex-wrap md:mb-0 mb-1">
                {/* for mobile only  */}
                <li className="me-2  lg:hidden block">
                  <Menu>
                    <MenuButton>
                      <button className="border  mb-2 capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center">
                        <HiOutlineBars3BottomLeft className="me-2 text-[16px]" />
                        Filters
                      </button>
                    </MenuButton>
                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 bg-black bg-opacity-50 z-10"
                          onClick={closeMenu}
                        ></div>
                        <MenuItems
                          className={`fixed top-0 left-0 z-20 h-full bg-white w-[80%] max-w-sm rounded-r-[5px] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                        >
                          <MenuItem>
                            <p
                              className="capitalize block data-[focus]:bg-blue-100 p-2"
                              onClick={() => {
                                setIsOpen(true);
                              }}
                            >
                              {/* Property Type */}
                              {allfilters?.propertyType && allfilters?.type
                                ? `${allfilters?.propertyType == "sale"
                                  ? "Buy"
                                  : (allfilters?.propertyType == "offmarket" || allfilters?.offMarket == "true")
                                    ? "Off-Market"
                                    : allfilters?.propertyType
                                }, ${allfilters?.type?.split(",")?.length > 1
                                  ? `${allfilters?.type?.split(",")[0]} (+${allfilters?.type?.split(",")?.length -
                                  1
                                  })`
                                  : allfilters?.type
                                }`
                                : allfilters?.propertyType
                                  ? `${allfilters?.propertyType == "offmarket" || allfilters?.offMarket == "true"
                                    ? "Off-Market"
                                    : allfilters?.propertyType == "sale"
                                      ? "Buy"
                                      : allfilters?.propertyType
                                  }`
                                  : (allfilters?.offMarket == "true" || allfilters?.offMarket == true) ? "Off-Market" : "Property Type"}
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              className="capitalize block data-[focus]:bg-blue-100 p-2"
                              onClick={() => {
                                setIsOpen1(true);
                              }}
                            >
                              {/* Location */}
                              {allfilters?.search
                                ? `${stringSeprator(locBtnStr, 20)}
                                            ${allfilters?.search?.split(",")
                                  ?.length > 1
                                  ? `(+${allfilters?.search?.split(
                                    ","
                                  )?.length - 1
                                  })`
                                  : ""
                                }`
                                : "Location"}
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              className="capitalize block data-[focus]:bg-blue-100 p-2"
                              onClick={() => {
                                setIsOpen2(true);
                              }}
                            >
                              {allfilters?.propertyType === "offmarket" ? (
                                <>
                                  {allfilters?.proposal
                                    ? `${allfilters?.proposal} proposals`
                                    : "Off Market Status"}
                                </>
                              ) : allfilters?.propertyType === "directory" ? (
                                <>
                                  {allfilters?.proposal
                                    ? `${allfilters?.proposal} proposals`
                                    : "Directory Status"}
                                </>
                              ) : (
                                <>
                                  {allfilters?.price
                                    ? allfilters?.price?.split("-")[0] +
                                    " € - " +
                                    allfilters?.price?.split("-")[1] +
                                    " € "
                                    : "Budget"}
                                </>
                              )}
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              className="capitalize block data-[focus]:bg-blue-100 p-2"
                              onClick={() => {
                                setIsOpen4(true);
                              }}
                            >
                              {/* Surface */}
                              {allfilters?.surface
                                ? allfilters?.surface?.split("-")[0] +
                                " - " +
                                allfilters?.surface?.split("-")[1] +
                                " m2"
                                : "Surface"}
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              className="capitalize block data-[focus]:bg-blue-100 p-2"
                              onClick={() => {
                                setIsOpen5(true);
                              }}
                            >
                              Rooms{" "}
                              {allfilters.rooms && `(${allfilters.rooms})`}
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              className="capitalize block data-[focus]:bg-blue-100 p-2"
                              onClick={() => {
                                setIsOpen6(true);
                              }}
                            >
                              {allfilters?.rating
                                ? `Rating ${allfilters?.rating
                                  ? `(${allfilters?.rating})`
                                  : ""
                                }`
                                : "Attractivity"}
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              className="capitalize block data-[focus]:bg-blue-100 p-2"
                              onClick={() => {
                                setIsOpen7(true);
                              }}
                            >
                              {otherFilterCount > 0 && `${otherFilterCount}`}{" "}
                              Extra filters
                            </p>
                          </MenuItem>
                        </MenuItems>
                      </>
                    )}
                  </Menu>
                </li>

                {/* Buy Tab */}
                <li className="me-2  mb-2 lg:block hidden">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    className={`${allfilters?.propertyType || allfilters?.type || allfilters?.offMarket == "true" || allfilters?.offMarket == true
                      ? "bg-[#986dcd1f]"
                      : ""
                      } border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    <img
                      src="assets/img/prop/home.png"
                      alt=""
                      className="w-[15px] me-1"
                    />
                    {allfilters?.propertyType && allfilters?.type
                      ? `${allfilters?.propertyType == "sale"
                        ? "Buy"
                        : allfilters?.propertyType == "offmarket"
                          ? "Off-Market"
                          : allfilters?.propertyType
                      }, ${allfilters?.type?.split(",")?.length > 1
                        ? `${allfilters?.type?.split(",")[0]} (+${allfilters?.type?.split(",")?.length - 1
                        })`
                        : allfilters?.type
                      }`
                      : allfilters?.propertyType
                        ? `${allfilters?.propertyType == "offmarket"
                          ? "Off-Market"
                          : allfilters?.propertyType == "sale"
                            ? "Buy"
                            : allfilters?.propertyType
                        }`
                        : allfilters?.type
                          ? `${allfilters?.type?.split(",")?.length > 1
                            ? `${allfilters?.type?.split(",")[0]} (+${allfilters?.type?.split(",")?.length - 1
                            })`
                            : `${allfilters?.type}`
                          }`
                          : allfilters?.offMarket == "true" || allfilters?.offMarket == true ? "Off-Market" : "Property Type"}
                  </button>
                  <Dialog
                    open={isOpen}
                    onClose={() => {
                      setIsOpen(false);
                      // setSelectedTypes([]);
                    }}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                      <DialogPanel className="max-w-md w-[100%] bg-white rounded-[20px]">
                        <DialogTitle className="font-bold p-6">
                          <TabGroup>
                            <TabList className="border-b flex flex-wrap">
                              {Object.keys(tabValues).map((tab, i) => {
                                return (
                                  <Tab
                                    key={i}
                                    title={!activePlan?.[0]?.offMarket && tab == "offmarket"?"Please upgrade your plan":""}
                                    className={`text-[#389D93] font-[400] w-[22%] me-2 text-left pb-1 ${!activePlan?.[0]?.offMarket && tab == "offmarket" ? "cursor-not-allowed" : ""}
                                      ${selectedTab === tab
                                        ? "font-[600] border-[#868389] border-b-[4px]"
                                        : ""
                                      }`}
                                    onClick={() => {
                                      let updatedFilters = {}
                                      if (tab == "offmarket" && !activePlan?.[0]?.offMarket) {

                                      } else {
                                        setSelectedTab(tab);
                                        updatedFilters = {
                                          ...allfilters,
                                          propertyType: tab == "offmarket" ? "" : tab,
                                          offmarket: tab == "offmarket" ? true : false,
                                          type: indFilter.type,
                                        };
                                        if (
                                          tab === "offmarket" ||
                                          tab === "directory"
                                        ) {
                                          updatedFilters.minPrice = "";
                                          updatedFilters.maxPrice = "";
                                        } else {
                                          updatedFilters.proposal = "";
                                        }
                                        setIndFilter(updatedFilters);
                                      }

                                    }}
                                  >
                                    {tabValues[tab]}
                                  </Tab>
                                );
                              })}
                            </TabList>
                            <TabPanels>
                              {Object.keys(tabValues).map((tab, index) => (
                                <TabPanel key={index}>
                                  <ul className="flex items-center flex-wrap pt-6 gap-2 justify-between">
                                    {propertyTypes.map(({ id, name, icon }) => (
                                      <li
                                        key={id}
                                        className="text-center font-[400] flex items-center justify-center flex-col text-[12px] w-[18%] my-2 cursor-pointer"
                                      >
                                        <Checkbox
                                          checked={selectedTypes.includes(id)}
                                          onChange={() => {
                                            handleCheckboxChange(id);
                                            debugger;
                                            let data = {
                                              ...allfilters,
                                              type: indFilter.type,
                                              propertyType:
                                                indFilter.propertyType == "offmarket" ? "" : indFilter.propertyType,
                                              offMarket: indFilter.offMarket == "true" ? true : false,
                                            };

                                            const types = data.type
                                              ? data.type.split(",")
                                              : [];
                                            if (types.includes(id)) {
                                              data.type = types
                                                .filter((type) => type !== id)
                                                .join(",");
                                            } else {
                                              data.type = [...types, id].join(
                                                ","
                                              );
                                            }
                                            // if (!selectedTab) {
                                            //   setSelectedTab("sale");
                                            //   data.propertyType = "sale";
                                            // }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block border bg-white data-[checked]:bg-[#976DD0] data-[checked]:text-white border border-[#389D93] data-[checked]:border-[#976DD0] rounded-full mb-2 checkbox-checked"
                                        >
                                          <div className="w-[40px] p-[7px] rounded-full h-[40px] flex items-center justify-center">
                                            <img
                                              src={icon}
                                              alt=""
                                              className="w-[30px] p-[2px] "
                                            />
                                          </div>
                                        </Checkbox>
                                        {name}
                                      </li>
                                    ))}
                                  </ul>
                                </TabPanel>
                              ))}
                            </TabPanels>
                          </TabGroup>
                        </DialogTitle>

                        <div className="flex border-t p-4 justify-between">
                          <button
                            onClick={() => setIsOpen(false)}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center">
                            <button className="text-[#868389] me-3">
                              <span className="text-[#976DD0] font-[600]">
                                {upcomingCount}
                              </span>{" "}
                              results
                            </button>
                            {(allfilters?.propertyType || allfilters?.offMarket || allfilters?.type) && (
                              <button
                                className="text-[#868389] me-3"
                                onClick={() => {
                                  removeParams("type");
                                  removeParams("propertyType");
                                  removeParams("offMarket");
                                  setSelectedTab("");
                                  resetIndividual(
                                    setIsOpen,
                                    "type",
                                    "propertyType",
                                    "offMarket"
                                  );
                                  setIndFilter({
                                    ...allfilters,
                                    type: "",
                                    propertyType: "",
                                    offMarket: false,
                                  });
                                }}
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => applyBuyFilter()}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                {/* Search tab */}
                <li className="me-2  mb-2 lg:block hidden">
                  <button
                    onClick={() => setIsOpen1(true)}
                    className={`${allfilters?.search ? "bg-[#986dcd1f]" : ""}
                                        border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    <IoLocationOutline className=" me-1 text-[15px]" />
                    {allfilters?.search
                      ? `${stringSeprator(locBtnStr, 20)}
                         ${allfilters?.search?.split(",")?.length > 1
                        ? `(+${allfilters?.search?.split(",")?.length - 1
                        })`
                        : ""
                      }`
                      : "Location"}
                  </button>
                  <Dialog
                    open={isOpen1}
                    onClose={() =>
                      closeFilter(setIsOpen1, setLocations, "search")
                    }
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                      <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                        <DialogTitle className="p-6">
                          <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                            Where are you looking?
                          </p>
                          <div className="pt-10 flex items-center google_address">
                            <GooglePlaceAutoComplete
                              key={inputKey}
                              value={currentLocation}
                              result={addressResult}
                              placeholder="Enter location you want to search..."
                              id="address"
                            />
                          </div>
                          <div className="flex items-center mt-2 flex-wrap">
                            {locations.map((loc, index) => (
                              <div
                                key={index}
                                className={`flex pointer items-center py-1 px-2 me-2 mb-2 rounded-[4px] text-white
                                  ${loc?.added ? "bg-[#73339B]" : "bg-[#976DD0]"
                                  }`}
                              >
                                <p
                                  className="text-white text-[14px] me-2 cursor-pointer"
                                  onClick={() => {
                                    let data = [...locations];
                                    data[index] = { ...loc, added: !loc.added };
                                    setLocations(data);
                                    // click on card
                                    let data2 = { ...allfilters, ...indFilter };
                                    const cities = data2.search
                                      ? data2.search.split(",")
                                      : [];
                                    if (cities.includes(loc.name)) {
                                      data2.search = cities
                                        .filter((addr) => addr !== loc.name)
                                        .join(",");
                                    } else {
                                      data2.search = [...cities, loc.name].join(
                                        ","
                                      );
                                    }
                                    let locs = data?.filter(
                                      (itm) => itm?.added
                                    );
                                    setIndFilter({
                                      ...data2,
                                      maxDistance:
                                        locs?.length === 1 ? selectedValue : 0,
                                      userLat:
                                        locs?.length === 1
                                          ? locs?.[0]?.userLat
                                          : "",
                                      userLng:
                                        locs?.length === 1
                                          ? locs?.[0]?.userLng
                                          : "",
                                    });
                                  }}
                                >
                                  {loc?.name}
                                </p>
                                <button
                                  onClick={() => {
                                    let locs = [...locations];
                                    let data = locs.filter(
                                      (_, i) => i !== index
                                    );
                                    setLocations(data);
                                    // click for cross
                                    let data2 = { ...allfilters, ...indFilter };
                                    const cities = data2.search
                                      ? data2.search.split(",")
                                      : [];
                                    data2.search = cities
                                      .filter((addr) => addr !== loc.name)
                                      .join(",");
                                    let truelocs = data?.filter(
                                      (itm) => itm?.added
                                    );
                                    setIndFilter({
                                      ...data2,
                                      maxDistance:
                                        truelocs?.length === 1
                                          ? selectedValue
                                          : 0,
                                      userLat:
                                        truelocs?.length === 1
                                          ? truelocs?.[0]?.userLat
                                          : "",
                                      userLng:
                                        truelocs?.length === 1
                                          ? truelocs?.[0]?.userLng
                                          : "",
                                    });
                                  }}
                                  className=" text-white"
                                >
                                  <i className="fa fa-times text-[12px] "></i>
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                            <SelectDropdown
                              id="statusDropdown"
                              displayValue="name"
                              placeholder="All School Types"
                              className="capitalize w-full"
                              theme="search"
                              isClearable={false}
                              intialValue={indFilter?.schoolType}
                              result={(e) =>
                                setIndFilter({
                                  ...indFilter,
                                  schoolType: e.value,
                                })
                              }
                              options={schoolType}
                            />
                            <SelectDropdown
                              id="statusDropdown"
                              displayValue="name"
                              placeholder="All School Status"
                              theme="search"
                              className='w-full'
                              isClearable={false}
                              intialValue={indFilter?.schoolStatus}
                              result={(e) =>
                                setIndFilter({
                                  ...indFilter,
                                  schoolStatus: e.value,
                                })
                              }
                              options={schoolStatus}
                            />
                          </div>

                          {/* {trueLocs?.length < 2 && (
                            <>
                              <label className="mb-1 text-[14px] text-[#656565] mt-3 block">
                                Select maximum range radius to find the property
                              </label>
                              <div className="mb-4 range_slider  border bg-[#986dcd0f">
                                <div className="flex justify-between bg-[#986dcd]  px-3 py-2 text-white">
                                  <label className="text-white">Range</label>
                                  <p> {selectedValue} Km</p>
                                </div>
                                <div className="px-4 py-2">
                                  <Stack
                                    spacing={2}
                                    direction="row"
                                    sx={{ alignItems: "center", mb: 2 }}
                                  >
                                    <Slider
                                      value={selectedValue}
                                      onChange={handleChange}
                                      step={1}
                                      min={Math.min(...allowedValues)}
                                      max={Math.max(...allowedValues)}
                                      valueLabelDisplay="auto"
                                      marks={allowedValues.map((value) => ({ value, }))}
                                    marks={allowedValues.map((value) => ({ value, label: `${value}` }))} commenet****
                                    />
                                  </Stack>
                                <p>Search Area range in km: {selectedValue}</p> commenet****
                                </div>
                              </div>
                            </>
                          )} */}
                          {error?.location && (
                            <span className="text-[#ff0000] text-sm text-center mx-auto block">
                              {error?.location}
                            </span>
                          )}
                        </DialogTitle>

                        <div className="flex border-t p-4 justify-between">
                          <button
                            onClick={() => {
                              closeFilter(setIsOpen1, setLocations, "search");
                              setError({ ...error, location: "" });
                            }}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center">
                            <button className="text-[#868389] me-3">
                              <span className="text-[#976DD0] font-[600]">
                                {upcomingCount}
                              </span>{" "}
                              results
                            </button>
                            {allfilters?.search && (
                              <button
                                className="text-[#868389] me-3"
                                onClick={() => {
                                  removeParams("search");
                                  setLocations([]);
                                  setIsOpen1(false);
                                  setAllFilters({
                                    ...allfilters,
                                    search: "",
                                    maxDistance: 0,
                                    userLat: "",
                                    userLng: "",
                                    schoolStatus: "",
                                    schoolType: "",
                                  });
                                  setSelectedValue(0);
                                  setIndFilter({
                                    ...allfilters,
                                    search: "",
                                    maxDistance: 0,
                                    userLat: "",
                                    userLng: "",
                                    schoolStatus: "",
                                    schoolType: "",
                                  });
                                  setError({ ...error, location: "" });
                                  setcitySearch("");
                                  setZipcodeSearch("")
                                }}
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (locations?.length === 0)
                                  return setError({
                                    ...error,
                                    location: "Enter atleast a location",
                                  });
                                let locs = locations?.filter(
                                  (itm) => itm?.added
                                );

                                if (locs?.length === 0)
                                  return setError({
                                    ...error,
                                    location: "Select atleast a location",
                                  });
                                setIsOpen1(false);
                                let data = { ...allfilters };
                                data = {
                                  ...data,
                                  search: locs
                                    ?.map((data) => data?.name)
                                    .join(" / "),
                                  maxDistance:
                                    locs?.length > 1 ? 0 : selectedValue,
                                  userLat:
                                    locs?.length > 1 ? "" : locs[0]?.userLat,
                                  userLng:
                                    locs?.length > 1 ? "" : locs[0]?.userLng,
                                  schoolStatus: indFilter?.schoolStatus,
                                  schoolType: indFilter?.schoolType,
                                };
                                setAllFilters(data);
                                let allCity = locs
                                  .filter((loc) => loc.city)
                                  ?.map((itm) => itm?.city)
                                  ?.join();
                                let allZipcode = locs
                                  .filter((loc) => loc.zipcode)
                                  ?.map((itm) => itm?.zipcode)
                                  ?.join();

                                setcitySearch(allCity);
                                setZipcodeSearch(allZipcode)
                              }}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                {/* Budget/Proposal tab */}
                <li className="me-2  mb-2 lg:block hidden">
                  <button
                    onClick={() => setIsOpen2(true)}
                    className={`${allfilters?.minPrice ||
                      allfilters?.maxPrice ||
                      allfilters?.proposal
                      ? "bg-[#986dcd1f]"
                      : ""
                      }
                                        border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    <img
                      src="assets/img/prop/price.svg"
                      alt=""
                      className="w-[15px] me-1"
                    />
                    {allfilters?.propertyType === "offmarket" ? (
                      <>
                        {allfilters?.proposal
                          ? `${allfilters?.proposal} proposals`
                          : "Off Market Status"}
                      </>
                    ) : allfilters?.propertyType === "directory" ? (
                      <>
                        {allfilters?.proposal
                          ? `${allfilters?.proposal} proposals`
                          : "Directory Status"}
                      </>
                    ) : (
                      <>
                        {allfilters?.minPrice && allfilters?.maxPrice
                          ? `${formatCurrency(
                            allfilters?.minPrice
                          )} - ${formatCurrency(allfilters?.maxPrice)} €`
                          : allfilters?.maxPrice
                            ? `max ${formatCurrency(allfilters?.maxPrice)} €`
                            : allfilters?.minPrice
                              ? `min ${formatCurrency(allfilters?.minPrice)} €`
                              : "Budget"}
                      </>
                    )}
                  </button>
                  <Dialog
                    open={isOpen2}
                    onClose={() => {
                      setIsOpen2(false);
                      setError({ ...error, proposal: "", price: "" });
                    }}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                      <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                        <DialogTitle className="p-6">
                          <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                            {allfilters?.propertyType === "offmarket"
                              ? "Off Market Status"
                              : allfilters?.propertyType === "directory"
                                ? "Directory Status"
                                : "What is your budget?"}
                          </p>
                          {allfilters?.propertyType === "offmarket" ||
                            allfilters?.propertyType === "directory" ? (
                            <>
                              <h2 className="mb-2 text-[#47525E] pt-4">
                                Show properties that are:
                              </h2>
                              <div className="flex items-center  justify-between py-1 rounded-[5px] mb-3">
                                <div className="flex items-center">
                                  <Checkbox
                                    checked={proposal === "purchase"}
                                    onChange={() => {
                                      setError({
                                        ...error,
                                        proposal: "",
                                        price: "",
                                      });
                                      setProposal(
                                        proposal === "purchase"
                                          ? ""
                                          : "purchase"
                                      );
                                      setIndFilter({
                                        ...allfilters,
                                        minPrice: "",
                                        maxPrice: "",
                                        proposal:
                                          indFilter.proposal === "purchase"
                                            ? ""
                                            : "purchase",
                                      });
                                      setPriceRange({ min: "", max: "" });
                                    }}
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
                                  <label className="text-[#47525E]">
                                    Open to purchase proposals
                                  </label>
                                </div>
                              </div>
                              <div className="flex items-center  justify-between py-1 rounded-[5px] ">
                                <div className="flex items-center">
                                  <Checkbox
                                    checked={proposal === "rental"}
                                    onChange={() => {
                                      setError({
                                        ...error,
                                        proposal: "",
                                        price: "",
                                      });
                                      setProposal(
                                        proposal === "rental" ? "" : "rental"
                                      );
                                      setIndFilter({
                                        ...allfilters,
                                        minPrice: "",
                                        maxPrice: "",
                                        proposal:
                                          indFilter.proposal === "rental"
                                            ? ""
                                            : "rental",
                                      });
                                      setPriceRange({ min: "", max: "" });
                                    }}
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
                                  <label className="text-[#47525E]">
                                    Open to rental proposals
                                  </label>
                                </div>
                              </div>

                              {error?.proposal && (
                                <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                  {error?.proposal}
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-center pt-12 py-6">
                                <input
                                  type="text"
                                  value={priceRange.min}
                                  onChange={(e) => {
                                    let value = e.target.value;
                                    value = value.replace(/[^0-9]/g, "");
                                    if (value.length > 10)
                                      value = value?.slice(0, 10);
                                    setPriceRange({
                                      ...priceRange,
                                      min: value,
                                    });
                                    setError({
                                      ...error,
                                      price: "",
                                      proposal: "",
                                    });
                                    // if (+value < +priceRange?.max) {
                                    setIndFilter({
                                      ...allfilters,
                                      minPrice: value,
                                      maxPrice: priceRange.max,
                                      proposal: "",
                                    });
                                    // }
                                    setProposal("");
                                  }}
                                  className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                                  placeholder="min"
                                />
                                <p className="mx-3">-</p>
                                <input
                                  type="text"
                                  value={priceRange.max}
                                  onChange={(e) => {
                                    let value = e.target.value;
                                    value = value.replace(/[^0-9]/g, "");
                                    if (value.length > 10)
                                      value = value.slice(0, 10);
                                    setPriceRange({
                                      ...priceRange,
                                      max: value,
                                    });
                                    setError({
                                      ...error,
                                      price: "",
                                      proposal: "",
                                    });
                                    // if (+priceRange?.min < +value) {
                                    setIndFilter({
                                      ...allfilters,
                                      minPrice: priceRange.min,
                                      maxPrice: value,
                                      proposal: "",
                                    });
                                    // }
                                    setProposal("");
                                  }}
                                  className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                                  placeholder="max"
                                />
                                <p className="text-[#5A5A5A] ms-3">€</p>
                              </div>
                              {error?.price && (
                                <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                  {error?.price}
                                </span>
                              )}
                            </>
                          )}
                        </DialogTitle>
                        <div className="flex border-t p-4 justify-between">
                          <button
                            onClick={() => {
                              setIsOpen2(false);
                              setError({ ...error, proposal: "", price: "" });
                            }}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center">
                            <button className="text-[#868389] me-3">
                              <span className="text-[#976DD0] font-[600]">
                                {upcomingCount}
                              </span>{" "}
                              results
                            </button>
                            {(allfilters?.proposal ||
                              allfilters?.minPrice ||
                              allfilters?.maxPrice) && (
                                <button
                                  className="text-[#868389] me-3"
                                  onClick={() => {
                                    removeParams("minPrice");
                                    removeParams("maxPrice");
                                    removeParams("proposal");
                                    setPriceRange({ min: "", max: "" });
                                    setProposal("");
                                    resetIndividual(
                                      setIsOpen2,
                                      "minPrice",
                                      "maxPrice",
                                      "proposal"
                                    );
                                    setIndFilter({
                                      ...allfilters,
                                      proposal: "",
                                      minPrice: "",
                                      maxPrice: "",
                                    });
                                  }}
                                >
                                  Reset
                                </button>
                              )}
                            <button
                              onClick={handleApply}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                {/* Revenues tab */}
                <li className="me-2  mb-2 lg:block hidden">
                  <button
                    onClick={() => setIsOpen3(true)}
                    className={`${allfilters?.minRevenues || allfilters?.maxRevenues
                      ? "bg-[#986dcd1f]"
                      : ""
                      }
                                         border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    <img
                      src="assets/img/prop/wallet.png"
                      alt=""
                      className="w-[12px] me-1"
                    />
                    {allfilters?.minRevenues && allfilters?.maxRevenues
                      ? `${formatCurrency(
                        allfilters?.minRevenues
                      )} - ${formatCurrency(allfilters?.maxRevenues)} €`
                      : allfilters?.maxRevenues
                        ? `max ${formatCurrency(allfilters?.maxRevenues)} €`
                        : allfilters?.minRevenues
                          ? `min ${formatCurrency(allfilters?.minRevenues)} €`
                          : "Revenue"}
                  </button>
                  <Dialog
                    open={isOpen3}
                    onClose={() => setIsOpen3(false)}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                      <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                        <DialogTitle className="p-6">
                          <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                            What amount of yearly revenues?
                          </p>
                          <div className="flex items-center justify-center pt-12 py-6">
                            <input
                              type="text"
                              value={revenues.min}
                              onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9]/g, "");
                                if (value.length > 10)
                                  value = value.slice(0, 10);
                                setRevenues({ ...revenues, min: value });
                                setError({ ...error, revenue: "" });
                                // if (+value < +revenues?.max) {
                                setIndFilter({
                                  ...allfilters,
                                  minRevenues: value,
                                  maxRevenues: revenues.max,
                                });
                                // }
                              }}
                              className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                              placeholder="min"
                            />
                            <p className="mx-3">-</p>
                            <input
                              type="test"
                              value={revenues.max}
                              onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9]/g, "");
                                if (value.length > 10)
                                  value = value.slice(0, 10);
                                setRevenues({ ...revenues, max: value }); // setErrors("");
                                setError({ ...error, revenue: "" });
                                // if (+revenues?.min < +value) {
                                setIndFilter({
                                  ...allfilters,
                                  maxRevenues: value,
                                  minRevenues: revenues.min,
                                });
                                // }
                              }}
                              className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                              placeholder="max"
                            />
                            <p className="text-[#5A5A5A] ms-3">€</p>
                          </div>
                          {error?.revenue && (
                            <span className="text-[#ff0000] text-sm text-center mx-auto block">
                              {error?.revenue}
                            </span>
                          )}
                        </DialogTitle>
                        <div className="flex border-t p-4 justify-between">
                          <button
                            onClick={() => setIsOpen3(false)}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center">
                            <button className="text-[#868389] me-3">
                              <span className="text-[#976DD0] font-[600]">
                                {upcomingCount}
                              </span>{" "}
                              results
                            </button>
                            {(allfilters?.minRevenues ||
                              allfilters?.maxRevenues) && (
                                <button
                                  className="text-[#868389] me-3"
                                  onClick={() => {
                                    setRevenues({ min: "", max: "" });
                                    resetIndividual(
                                      setIsOpen3,
                                      "minRevenues",
                                      "maxRevenues"
                                    );
                                    setIndFilter({
                                      ...allfilters,
                                      minRevenues: "",
                                      maxRevenues: "",
                                    });
                                  }}
                                >
                                  Reset
                                </button>
                              )}
                            <button
                              onClick={handleApplyRevenues}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                {/* surface tab */}
                <li className="me-2  mb-2 lg:block hidden">
                  <button
                    onClick={() => setIsOpen4(true)}
                    className={`${allfilters?.minSurface || allfilters?.maxSurface
                      ? "bg-[#986dcd1f]"
                      : ""
                      }
                                         border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    <TbRulerMeasure className="w-[15px] text-[15px] me-1" />
                    {allfilters?.minSurface && allfilters?.maxSurface
                      ? `${formatCurrency(
                        allfilters?.minSurface
                      )} - ${formatCurrency(allfilters?.maxSurface)} m2`
                      : allfilters?.maxSurface
                        ? `max ${formatCurrency(allfilters?.maxSurface)} m2`
                        : allfilters?.minSurface
                          ? `min ${formatCurrency(allfilters?.minSurface)} m2`
                          : "Surface"}
                  </button>
                  <Dialog
                    open={isOpen4}
                    onClose={() => setIsOpen4(false)}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                      <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                        <DialogTitle className="p-6 ">
                          <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                            What surface?
                          </p>
                          <div className="flex items-center justify-center p-6 py-14">
                            <input
                              type="number"
                              value={surface.min}
                              onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9]/g, "");
                                if (value.length > 10)
                                  value = value.slice(0, 10);
                                setSurface({ ...surface, min: value });
                                setError({ ...error, surface: "" });
                                setIndFilter({
                                  ...allfilters,
                                  maxSurface: surface.max,
                                  minSurface: value,
                                });
                              }}
                              className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                              placeholder="Surface min"
                            />
                            <p className="mx-3">-</p>
                            <input
                              type="number"
                              value={surface.max}
                              onChange={(e) => {
                                let value = e.target.value;
                                value = value.replace(/[^0-9]/g, "");
                                if (value.length > 10)
                                  value = value.slice(0, 10);
                                setSurface({ ...surface, max: value });
                                setError({ ...error, surface: "" });
                                setIndFilter({
                                  ...allfilters,
                                  minSurface: surface.min,
                                  maxSurface: value,
                                });
                              }}
                              className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                              placeholder="Surface max"
                            />
                            <p className="text-[#5A5A5A] ms-3">m2</p>
                          </div>
                          {error?.surface && (
                            <span className="text-[#ff0000] text-sm text-center mx-auto block">
                              {error?.surface}
                            </span>
                          )}
                        </DialogTitle>
                        <div className="flex border-t p-4 justify-between">
                          <button
                            onClick={() => setIsOpen4(false)}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center">
                            <button className="text-[#868389] me-3">
                              <span className="text-[#976DD0] font-[600]">
                                {upcomingCount}
                              </span>{" "}
                              results
                            </button>
                            {(allfilters?.minSurface ||
                              allfilters?.maxSurface) && (
                                <button
                                  className="text-[#868389] me-3"
                                  onClick={() => {
                                    setSurface({ min: "", max: "" });
                                    resetIndividual(
                                      setIsOpen4,
                                      "minSurface",
                                      "maxSurface"
                                    );
                                    setIndFilter({
                                      ...allfilters,
                                      minSurface: "",
                                      maxSurface: "",
                                    });
                                  }}
                                >
                                  Reset
                                </button>
                              )}
                            <button
                              onClick={handleApplySurface}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                {/* rooms tab */}
                <li className="me-2  mb-2 lg:block hidden">
                  <button
                    onClick={() => setIsOpen5(true)}
                    className={`${allfilters.rooms ? "bg-[#986dcd1f]" : ""}
                                         border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    <img
                      src="assets/img/prop/bed.png"
                      alt=""
                      className="w-[15px] me-1"
                    />
                    Rooms {allfilters.rooms && `(${allfilters.rooms})`}
                  </button>
                  <Dialog
                    open={isOpen5}
                    onClose={() => {
                      setIsOpen5(false);
                      setSelectedRooms([]);
                      setError({ ...error, rooms: "" });
                    }}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center ">
                      <DialogPanel className="max-w-md  w-full bg-white rounded-[20px]  ">
                        <DialogTitle className=" p-6 ">
                          <p className="border-b  text-[#389D93] text-[18px] text-center pb-4">
                            {" "}
                            What number of rooms?
                          </p>
                          <ul className="flex items-center flex-wrap  justify-center py-14">
                            {[
                              { name: "Studio", value: 1 },
                              { name: "2", value: 2 },
                              { name: "3", value: 3 },
                              { name: "4", value: 4 },
                              { name: "5+", value: 5 },
                            ].map((item) => (
                              <li className="text-center font-[400] flex items-center justify-center flex-col text-[12px] me-4  my-2 cursor-pointer">
                                <Checkbox
                                  onClick={() => {
                                    toggleRoomSelection("rooms", item.value);
                                    setError({ ...error, rooms: "" });
                                    let data = {
                                      ...allfilters,
                                      rooms: indFilter.rooms,
                                    };
                                    const rooms = data.rooms
                                      ? data.rooms.split(",")?.map(Number)
                                      : [];
                                    if (rooms.includes(item.value)) {
                                      data.rooms = rooms
                                        .filter((room) => room !== item.value)
                                        .join(",");
                                    } else {
                                      data.rooms = [...rooms, item.value].join(
                                        ","
                                      );
                                    }
                                    setIndFilter({ ...data });
                                  }}
                                  className={`${selectedRooms.includes(item.value)
                                    ? "bg-[#986AB8] text-white border-[#986AB8]"
                                    : ""
                                    } group block rounded-[50px] py-[4px] flex items-center justify-center border border-[#986AB8] h-[40px] px-3.5 mb-2 text-black font-[600] text-[18px]`}
                                >
                                  {item.name}
                                </Checkbox>
                              </li>
                            ))}
                            {error?.rooms && (
                              <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                {error?.rooms}
                              </span>
                            )}
                          </ul>
                        </DialogTitle>

                        <div className="flex  border-t p-4 justify-between">
                          <button
                            onClick={() => {
                              setIsOpen5(false);
                            }}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center">
                            <button className="text-[#868389] me-3">
                              <span className="text-[#976DD0] font-[600]">
                                {upcomingCount}
                              </span>{" "}
                              results
                            </button>
                            {allfilters?.rooms && (
                              <button
                                className="text-[#868389] me-3"
                                onClick={() => {
                                  setSelectedRooms([]);
                                  resetIndividual(setIsOpen5, "rooms");
                                  setIndFilter({ ...allfilters, rooms: "" });
                                }}
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (selectedRooms.length === 0)
                                  return setError({
                                    ...error,
                                    rooms: "Select atleast a room",
                                  });
                                applyRoomsFilters();
                              }}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                {/* rating tab */}
                <li className="me-2  mb-2 lg:block hidden">
                  <button
                    onClick={() => setIsOpen6(true)}
                    className={`${allfilters?.rating ? "bg-[#986dcd1f]" : ""}
                                        border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    <img
                      src="assets/img/prop/star.png"
                      alt=""
                      className="w-[15px] me-1"
                    />
                    {allfilters?.rating
                      ? `Rating ${allfilters?.rating ? `(${allfilters?.rating})` : ""
                      }`
                      : "Attractivity"}
                  </button>
                  <Dialog
                    open={isOpen6}
                    onClose={() => {
                      setIsOpen6(false);
                      setError({ ...error, rating: "" });
                    }}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                      <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                        <DialogTitle className="p-6">
                          <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                            What level of attractivity?
                          </p>
                          <div className="pt-10  pb-10">
                            <div className="flex items-center justify-center">
                              <ReactStars
                                count={5}
                                onChange={handleRating}
                                size={64}
                                value={rating}
                                isHalf={true}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={
                                  <i className="fa fa-star-half-alt"></i>
                                }
                                fullIcon={<i className="fa fa-star"></i>}
                                activeColor="#976DD0"
                              />
                            </div>
                            {error?.rating && (
                              <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                {error?.rating}
                              </span>
                            )}
                          </div>
                        </DialogTitle>
                        <div className="flex border-t p-4 justify-between">
                          <button
                            onClick={() => setIsOpen6(false)}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center">
                            <button className="text-[#868389] me-3">
                              <span className="text-[#976DD0] font-[600]">
                                {upcomingCount}
                              </span>{" "}
                              results
                            </button>
                            {allfilters?.rating && (
                              <button
                                className="text-[#868389] me-3"
                                onClick={() => {
                                  setRating(0);
                                  resetIndividual(setIsOpen6, "rating");
                                  setIndFilter({ ...allfilters, rating: "" });
                                }}
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (!rating)
                                  return setError({
                                    ...error,
                                    rating: "Select rating",
                                  });
                                setAllFilters({ ...allfilters, rating });
                                setIsOpen6(false);
                              }}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                {/* extra filters tab */}
                <li className="me-2  mb-2 lg:block hidden">
                  <button
                    onClick={() => setIsOpen7(true)}
                    className={`${otherFilterCount > 0 ? "bg-[#986dcd1f]" : ""}
                                        border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    {otherFilterCount > 0 && `${otherFilterCount}`} Extra
                    filters
                  </button>
                  <Dialog
                    open={isOpen7}
                    onClose={() => setIsOpen7(false)}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-[#976DD0]/70" />
                    <div className="fixed inset-0 flex w-screen items-start justify-start h-screen ">
                      <DialogPanel className="max-w-md w-full  bg-white rounded-tr-[20px] rounded-br-[20px] h-full">
                        <DialogTitle className=" p-6 h-[90%] ">
                          <p className="border-b  text-[#389D93] text-[18px] text-center pb-4 h-[7%]">
                            More criteria
                          </p>
                          <div className="h-[93%] overflow-auto">
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Bedrooms
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {[
                                    { name: "Studio", value: 1 },
                                    { name: "2", value: 2 },
                                    { name: "3", value: 3 },
                                    { name: "4", value: 4 },
                                    { name: "5+", value: 5 },
                                  ]?.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.bedrooms?.includes(
                                            option.value
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "bedrooms",
                                              option.value
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.bedrooms
                                              ? data.bedrooms.split(",")
                                              : [];
                                            if (
                                              beds.includes(
                                                String(option.value)
                                              )
                                            ) {
                                              data.bedrooms = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.value)
                                                )
                                                .join(",");
                                            } else {
                                              data.bedrooms = [
                                                ...beds,
                                                String(option.value),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Floors
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {[
                                    { name: "1", value: 1 },
                                    { name: "2", value: 2 },
                                    { name: "3", value: 3 },
                                    { name: "4", value: 4 },
                                    { name: "5+", value: 5 },
                                  ]?.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.propertyFloor?.includes(
                                            option.value
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "propertyFloor",
                                              option.value
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.propertyFloor
                                              ? data.propertyFloor.split(",")
                                              : [];
                                            if (
                                              beds.includes(
                                                String(option.value)
                                              )
                                            ) {
                                              data.propertyFloor = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.value)
                                                )
                                                .join(",");
                                            } else {
                                              data.propertyFloor = [
                                                ...beds,
                                                String(option.value),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Cooking
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {cookingOptions?.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.cooking?.includes(
                                            option.id
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "cooking",
                                              option.id
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.cooking
                                              ? data.cooking.split(",")
                                              : [];
                                            if (
                                              beds.includes(String(option.id))
                                            ) {
                                              data.cooking = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.id)
                                                )
                                                .join(",");
                                            } else {
                                              data.cooking = [
                                                ...beds,
                                                String(option.id),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Equipment
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {equipmentOptions.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.equipment?.includes(
                                            option.id
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "equipment",
                                              option.id
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.equipment
                                              ? data.equipment.split(",")
                                              : [];
                                            if (
                                              beds.includes(String(option.id))
                                            ) {
                                              data.equipment = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.id)
                                                )
                                                .join(",");
                                            } else {
                                              data.equipment = [
                                                ...beds,
                                                String(option.id),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Outside
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {outsideOptions.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.outside?.includes(
                                            option.id
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "outside",
                                              option.id
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.outside
                                              ? data.outside.split(",")
                                              : [];
                                            if (
                                              beds.includes(String(option.id))
                                            ) {
                                              data.outside = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.id)
                                                )
                                                .join(",");
                                            } else {
                                              data.outside = [
                                                ...beds,
                                                String(option.id),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Services and accessibility
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {servicesAndAccessibility.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.serviceAccessibility?.includes(
                                            option.id
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "serviceAccessibility",
                                              option.id
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds =
                                              data.serviceAccessibility
                                                ? data.serviceAccessibility.split(
                                                  ","
                                                )
                                                : [];
                                            if (
                                              beds.includes(String(option.id))
                                            ) {
                                              data.serviceAccessibility = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.id)
                                                )
                                                .join(",");
                                            } else {
                                              data.serviceAccessibility = [
                                                ...beds,
                                                String(option.id),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Ancilliary areas
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {ancilliaryAreas.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.ancilliary?.includes(
                                            option.id
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "ancilliary",
                                              option.id
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.ancilliary
                                              ? data.ancilliary.split(",")
                                              : [];
                                            if (
                                              beds.includes(String(option.id))
                                            ) {
                                              data.ancilliary = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.id)
                                                )
                                                .join(",");
                                            } else {
                                              data.ancilliary = [
                                                ...beds,
                                                String(option.id),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Environment
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {environment.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.environment?.includes(
                                            option.id
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "environment",
                                              option.id
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.environment
                                              ? data.environment.split(",")
                                              : [];
                                            if (
                                              beds.includes(String(option.id))
                                            ) {
                                              data.environment = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.id)
                                                )
                                                .join(",");
                                            } else {
                                              data.environment = [
                                                ...beds,
                                                String(option.id),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Leisure
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {leisure.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.leisure?.includes(
                                            option.id
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "leisure",
                                              option.id
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.leisure
                                              ? data.leisure.split(",")
                                              : [];
                                            if (
                                              beds.includes(String(option.id))
                                            ) {
                                              data.leisure = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.id)
                                                )
                                                .join(",");
                                            } else {
                                              data.leisure = [
                                                ...beds,
                                                String(option.id),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Investment
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex flex-wrap">
                                  {investmentPurposes.map((option, i) => (
                                    <li className="w-1/2 mb-3" key={i}>
                                      <div className="flex items-center ">
                                        <Checkbox
                                          checked={selections.investment?.includes(
                                            option.id
                                          )}
                                          onClick={() => {
                                            toggleCriteriaCheckbox(
                                              "investment",
                                              option.id
                                            );
                                            let data = {
                                              ...allfilters,
                                              energy_efficient: selectedLetters
                                                .map((data) => data)
                                                .join(","),
                                              cooking:
                                                selections.cooking.join(","),
                                              equipment:
                                                selections.equipment.join(","),
                                              serviceAccessibility:
                                                selections.serviceAccessibility.join(
                                                  ","
                                                ),
                                              outside:
                                                selections.outside.join(","),
                                              environment:
                                                selections.environment.join(
                                                  ","
                                                ),
                                              leisure:
                                                selections.leisure.join(","),
                                              ancilliary:
                                                selections.ancilliary.join(","),
                                              investment:
                                                selections.investment.join(","),
                                              situation:
                                                selections.situation.join(","),
                                              bedrooms:
                                                selections.bedrooms.join(","),
                                              propertyFloor:
                                                selections.propertyFloor.join(
                                                  ","
                                                ),
                                            };
                                            const beds = data.investment
                                              ? data.investment.split(",")
                                              : [];
                                            if (
                                              beds.includes(String(option.id))
                                            ) {
                                              data.investment = beds
                                                .filter(
                                                  (bed) =>
                                                    bed !== String(option.id)
                                                )
                                                .join(",");
                                            } else {
                                              data.investment = [
                                                ...beds,
                                                String(option.id),
                                              ].join(",");
                                            }
                                            setIndFilter({ ...data });
                                          }}
                                          className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                        >
                                          <svg
                                            className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option.name}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  Energy performance diagnostics
                                  <span className="bg-[#976DD0] block h-[5px] w-[30px] rounded-[8px] mt-1"></span>
                                </h4>
                                <ul className="flex-wrap">
                                  {energyPerformance.map((option, i) => (
                                    <li className=" mb-3 pe-5" key={i}>
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="flex items-center">
                                            <div className="flex items-center w-[32px]">
                                              <Checkbox
                                                checked={selectedLetters.includes(
                                                  option?.type
                                                )}
                                                onChange={() => {
                                                  handleLetterChange(
                                                    option?.type
                                                  );
                                                  let data = {
                                                    ...allfilters,
                                                    energy_efficient:
                                                      selectedLetters
                                                        .map((data) => data)
                                                        .join(","),
                                                    cooking:
                                                      selections.cooking.join(
                                                        ","
                                                      ),
                                                    equipment:
                                                      selections.equipment.join(
                                                        ","
                                                      ),
                                                    serviceAccessibility:
                                                      selections.serviceAccessibility.join(
                                                        ","
                                                      ),
                                                    outside:
                                                      selections.outside.join(
                                                        ","
                                                      ),
                                                    environment:
                                                      selections.environment.join(
                                                        ","
                                                      ),
                                                    leisure:
                                                      selections.leisure.join(
                                                        ","
                                                      ),
                                                    ancilliary:
                                                      selections.ancilliary.join(
                                                        ","
                                                      ),
                                                    investment:
                                                      selections.investment.join(
                                                        ","
                                                      ),
                                                    situation:
                                                      selections.situation.join(
                                                        ","
                                                      ),
                                                    bedrooms:
                                                      selections.bedrooms.join(
                                                        ","
                                                      ),
                                                    propertyFloor:
                                                      selections.propertyFloor.join(
                                                        ","
                                                      ),
                                                  };
                                                  const beds =
                                                    data.energy_efficient
                                                      ? data.energy_efficient.split(
                                                        ","
                                                      )
                                                      : [];
                                                  if (
                                                    beds.includes(
                                                      String(option?.type)
                                                    )
                                                  ) {
                                                    data.energy_efficient = beds
                                                      .filter(
                                                        (bed) =>
                                                          bed !==
                                                          String(option?.type)
                                                      )
                                                      .join(",");
                                                  } else {
                                                    data.energy_efficient = [
                                                      ...beds,
                                                      String(option?.type),
                                                    ].join(",");
                                                  }
                                                  setIndFilter({ ...data });
                                                }}
                                                className="group block size-3.5  rounded-[4px] border border-[#976DD0] bg-white data-[checked]:bg-[#73339B]  "
                                              >
                                                <svg
                                                  className="stroke-white opacity-0 group-data-[checked]:opacity-100 "
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
                                              <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                                {option?.type}
                                              </p>
                                            </div>
                                            <div className="flex">
                                              <p
                                                className={`w-[${option.size}] h-[28px] bg-[${option.color}] rounded-tl-[4px] rounded-bl-[4px] rounded-br-[1px] rounded-tr-[1px] block ms-3`}
                                              ></p>
                                              <p
                                                className={`traingle_shape${i}`}
                                              ></p>
                                            </div>
                                          </div>
                                        </div>
                                        <p className="text-[#868389] ms-2 text-[13px] capitalize">
                                          {option?.unit}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                          </div>
                        </DialogTitle>
                        <div className="flex  border-t p-4 justify-between h-[10%]">
                          <button
                            onClick={() => setIsOpen7(false)}
                            className="text-[#868389] text-[18px] underline"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center">
                            <button className="text-[#868389] me-3">
                              <span className="text-[#976DD0] font-[600]">
                                {upcomingCount}
                              </span>{" "}
                              results
                            </button>
                            {otherFilterCount > 0 && (
                              <button
                                className="text-[#868389] me-3"
                                onClick={() => {
                                  setSelections({
                                    cooking: [],
                                    equipment: [],
                                    serviceAccessibility: [],
                                    outside: [],
                                    environment: [],
                                    leisure: [],
                                    ancilliary: [],
                                    investment: [],
                                    situation: [],
                                    bedrooms: [],
                                    propertyFloor: [],
                                  });
                                  setSelectedLetters([]);
                                  setAllFilters({
                                    ...allfilters,
                                    cooking: [],
                                    equipment: [],
                                    serviceAccessibility: [],
                                    outside: [],
                                    environment: [],
                                    leisure: [],
                                    ancilliary: [],
                                    investment: [],
                                    situation: [],
                                    bedrooms: [],
                                    propertyFloor: [],
                                    energy_efficient: "",
                                  });
                                  setIsOpen7(false);
                                  setIndFilter({
                                    ...allfilters,
                                    bedrooms: "",
                                    propertyFloor: "",
                                    cooking: "",
                                    equipment: "",
                                    outside: "",
                                    serviceAccessibility: "",
                                    ancilliary: "",
                                    environment: "",
                                    leisure: "",
                                    investment: "",
                                    energy_efficient: "",
                                  });
                                }}
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleCreteriaApply();
                                setIsOpen7(false);
                              }}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                <li className="me-2 ">
                  <button
                    onClick={() => setIsOpen9(true)}
                    className="bg-[#976DD0]  mb-2 border border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-white px-3 font-[600] flex items-center"
                  >
                    Activate alerts
                  </button>
                  <Dialog
                    open={isOpen9}
                    onClose={() => setIsOpen9(false)}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                      <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                        <DialogTitle className="p-6">
                          <p className="border-b text-[#976DD0] font-[600] text-[18px] text-center pb-4">
                            Don't miss a property
                            <span className="text-[#47525E] text-center font-[400] text-[16px] block">
                              That meet your requirements
                            </span>
                          </p>
                          <p className="text-[#47525E] my-3">
                            {generateDynamicString(allfilters)}
                          </p>
                          <label className="text-[#47525E] text-[16px] font-[400] mb-1 block">
                            I'm creating this alert cause
                          </label>
                          <SelectDropdown
                            placeholder="Select reason"
                            displayValue="name"
                            className="capitalize mb-4"
                            intialValue={alert?.reason}
                            result={(e) => {
                              setAlert({ ...alert, reason: e.value });
                              setError({ ...error, alert: "" });
                            }}
                            options={alertReasons}
                          />

                          <input
                            type="email"
                            value={alert?.email}
                            onChange={(e) => {
                              setAlert({ ...alert, email: e.target.value });
                              setError({ ...error, alert: "" });
                            }}
                            className={`bg-white rounded-[7px] h-11 border border-[#976DD0] p-2 px-3 xl:max-w-[500px] w-[100%] mb-4`}
                            placeholder="youremailaddress@gmail.com"
                          />
                          <input
                            type="text"
                            value={alert?.name}
                            onChange={(e) => {
                              setAlert({ ...alert, name: e.target.value });
                              setError({ ...error, alert: "" });
                            }}
                            className={`bg-white rounded-[7px] h-11 border border-[#976DD0] p-2 px-3 xl:max-w-[500px] w-[100%] mb-4`}
                            placeholder="Name you search"
                          />
                          {error?.alert && (
                            <span className="text-[#ff0000] text-sm text-center mx-auto block">
                              {error?.alert}
                            </span>
                          )}
                          <div className="mx-auto flex justify-center my-3">
                            <button
                              onClick={addAlert}
                              className="bg-[#48464a] px-4 text-[14px] py-2 rounded-[50px] text-white"
                            >
                              Receive alerts
                            </button>
                          </div>
                          <p className="text-[#47525E] font-[400] text-center text-[14px]">
                            Bookaroo processes your data in order to manage your
                            request for new real estate ad alerts by e-mail. To
                            find out more and exercise your rights, click here.
                          </p>
                        </DialogTitle>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </li>

                {showReset && (
                  <li className="me-2  mb-2">
                    <button
                      onClick={resetData}
                      className="bg-[#48464a]  border border-[#48464a] rounded-[50px] py-[6px] text-[12px] text-white px-3 font-[600] flex items-center"
                    >
                      Reset Filters
                    </button>
                  </li>
                )}
              </ul>
              <div className="md:mb-2 lg:mt-[-5px] xl:mt-0">
                <ul className="flex items-center ">
                  <li onClick={() => setView("map")}>
                    <a
                      className={`${view === "map" ? "font-[600]" : ""
                        } text-[#47525E] text-[14px] px-3`}
                    >
                      Map
                    </a>
                  </li>
                  <li onClick={() => setView("list")}>
                    <a
                      className={`${view === "list" ? "font-[600]" : ""
                        } text-[#47525E] text-[14px] px-3`}
                    >
                      List
                    </a>
                  </li>
                  <li onClick={() => setView("grid")}>
                    <a
                      className={`${view === "grid" ? "font-[600]" : ""
                        } text-[#47525E] text-[14px] px-3`}
                    >
                      Grid
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonFilter;
