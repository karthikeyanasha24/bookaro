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
import { useEffect, useRef, useState } from "react";
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
import axios, { all } from "axios";
import ApiClient from "../../../methods/api/apiClient";
import Select from "react-select";
import environment from "../../../environment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


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
  const { t } = useTranslation();
  const ancilliaryAreas =
    categorizedData["Ancilliary areas".toLowerCase()] || [];
  const cookingOptions = categorizedData["cooking".toLowerCase()] || [];
  let [isOpenn, setIsOpenn] = useState(false)
  const navigate = useNavigate();
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
  const schoolStatus = [
    { id: "Private", name: t("filtersCommon.private") },
    { id: "Public", name: t("filtersCommon.public") },
  ];
  const [inputKey, setInputKey] = useState(0);
  const [rating, setRating] = useState(0);
  const [schoolType, setSchoolType] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const locBtnStr = allfilters?.search?.split(",")?.slice(0, 1)[0];
  const trueLocs = locations?.filter((itm) => itm?.added);
  const allowedValues = [0, 5, 10, 20, 50, 100, 200];
  const [selectedValue, setSelectedValue] = useState(0);

  const tabValues = {
    sale: t("propertyTypes.buy", { defaultValue: "Buy" }),
    rent: t("propertyTypes.rent", { defaultValue: "Rent" }),
    offmarket: t("propertyTypes.offMarket", { defaultValue: "Off-Market" }),
    directory: t("propertyTypes.directory", { defaultValue: "Directory" }),
  };
  const propertyTypes = [
    {
      id: "Apartment",
      name: t("home.propertyTypes.apartment"),
      icon: "/assets/img/prop/apartment.png",
    },
    { id: "House", name: t("home.propertyTypes.house"), icon: "/assets/img/prop/home.png" },
    { id: "Castle", name: t("home.propertyTypes.castle"), icon: "/assets/img/prop/castle.png" },
    { id: "Building", name: t("home.propertyTypes.building"), icon: "/assets/img/prop/building.png" },
    { id: "Farm", name: t("home.propertyTypes.farm"), icon: "/assets/img/prop/farm.png" },
  ];

  const handleRating = (rate) => {
    setRating(rate);
    setIndFilter({ ...allfilters, rating: rate });
    setError({ ...error, rating: "" });
  };

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);
  const filterBarRef = useRef(null);
  const lastScrollTopRef = useRef(0);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const contentScrollContainer =
      filterBarRef.current?.closest(".page-content-wrapper") || window;

    const handleScroll = () => {
      const currentScrollTop =
        contentScrollContainer === window
          ? window.scrollY || document.documentElement.scrollTop
          : contentScrollContainer.scrollTop;

      const delta = currentScrollTop - lastScrollTopRef.current;
      if (Math.abs(delta) < 4) return;

      if (currentScrollTop <= 20) {
        setIsFilterBarVisible(true);
      } else if (delta > 0) {
        setIsFilterBarVisible(false);
      } else {
        setIsFilterBarVisible(true);
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    contentScrollContainer.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      contentScrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    ApiClient.get('school-types/list', { count: 100 }).then((res) => {
      if (res.success) {
        setSchoolType(res.data.map((itm) => ({ id: itm._id, name: itm.name })));
      }
    });
  }, []);

  useEffect(() => {
    const addedLocs = locations.filter((l) => l.added);
    const zipcode = addedLocs[0]?.zipcode;
    if (!zipcode) {
      setSchoolList([]);
      return;
    }
    const payload = {
      postalCode: zipcode,
      page: 1,
      count: 1000,
      ...(indFilter?.schoolType && { schoolType: indFilter.schoolType }),
    };
    setSchoolsLoading(true);
    const token = window.localStorage.getItem('token') || window.localStorage.getItem('access_token');
    const baseUrl = environment.api || 'http://localhost:6089';
    const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    axios.get(`${baseUrl}/schools/list`, { params: payload, headers, withCredentials: true })
      .then((r) => {
        setSchoolsLoading(false);
        const res = r.data;
        if (res.success) {
          setSchoolList(
            res.data.map((itm) => ({
              value: itm._id || itm.id,
              label: itm.EstablishmentName,
            }))
          );
        }
      })
      .catch((e) => {
        setSchoolsLoading(false);
        console.error('[Schools] ERROR:', e?.response?.status, e?.response?.data);
      });
  }, [locations, indFilter?.schoolType]);

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
    // e.place = { city, postalCode, formatted, lat, lng } from CityAutocomplete
    const name = `${e.value}`;
    let zipcode = e.place?.postalCode;
    // Fallback: extract 5-digit code from address string if postalCode not set
    if (!zipcode) {
      const match = name.match(/\b(\d{5})\b/);
      if (match) zipcode = match[1];
    }
    const newLocation = {
      name: name,
      added: true,
      userLat: e.place?.lat,
      userLng: e.place?.lng,
      city: e.place?.city,
      zipcode: zipcode,
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
      name: t("alerts.principalResidence"),
    },
    {
      id: "searching for secondary residence",
      name: t("alerts.secondaryResidence"),
    },
    { id: "searching for an investment", name: t("alerts.investment") },
    {
      id: "get update on price evolution",
      name: t("alerts.priceEvolution"),
    },
    { id: "other", name: t("common.other") },
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
      <div
        ref={filterBarRef}
        className="bg-white sticky top-0 z-[9] border-b transition-all duration-300"
        style={{
          transform: isFilterBarVisible
            ? "translateY(0)"
            : "translateY(calc(-100% - 10px))",
          opacity: isFilterBarVisible ? 1 : 0,
          pointerEvents: isFilterBarVisible ? "auto" : "none",
        }}
      >
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
                        {t("filtersCommon.filters")}
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
                                  : (allfilters?.offMarket == "true" || allfilters?.offMarket == true) ? t("propertyTypes.offMarket", { defaultValue: "Off-Market" }) : t("filtersCommon.propertyType")}
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              className="block data-[focus]:bg-blue-100 p-2"
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
                                : t("filtersCommon.location")}
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
                                    ? `${allfilters?.proposal} ${t("filtersCommon.proposals")}`
                                    : t("filtersCommon.offMarketStatus")}
                                </>
                              ) : allfilters?.propertyType === "directory" ? (
                                <>
                                  {allfilters?.proposal
                                    ? `${allfilters?.proposal} ${t("filtersCommon.proposals")}`
                                    : t("filtersCommon.directoryStatus")}
                                </>
                              ) : (
                                <>
                                  {allfilters?.price
                                    ? allfilters?.price?.split("-")[0] +
                                    " € - " +
                                    allfilters?.price?.split("-")[1] +
                                    " € "
                                    : t("filtersCommon.budget")}
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
                                : t("filtersCommon.surface")}
                            </p>
                          </MenuItem>
                          <MenuItem>
                            <p
                              className="capitalize block data-[focus]:bg-blue-100 p-2"
                              onClick={() => {
                                setIsOpen5(true);
                              }}
                            >
                              {t("filtersCommon.rooms")}{" "}
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
                                : t("filtersCommon.attractivity")}
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
                              {t("filtersCommon.extraFilters")}
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
                            : allfilters?.offMarket == "true" || allfilters?.offMarket == true ? t("propertyTypes.offMarket", { defaultValue: "Off-Market" }) : t("filtersCommon.propertyType")}
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
                                    title={!activePlan?.activePlan?.[0]?.offMarket && tab == "offmarket" ? "Please upgrade your plan" : ""}
                                    className={`text-[#389D93] font-[400] w-[22%] me-2 text-left pb-1 ${!activePlan?.activePlan?.[0]?.offMarket && tab == "offmarket" ? "" : ""}
                                      ${selectedTab === tab
                                        ? "font-[600] border-[#868389] border-b-[4px]"
                                        : ""
                                      }`}
                                    onClick={() => {
                                      let updatedFilters = {}
                                      if (tab == "offmarket" && !activePlan?.activePlan?.[0]?.offMarket) {
                                        setIsOpen(false) 
                                        setIsOpenn(true)
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
                                        removeParams("propertyType");
                                        removeParams("offMarket");
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
                                        border border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                  >
                    <IoLocationOutline className=" me-1 text-[15px]" />
                    {allfilters?.search
                      ? `${stringSeprator(locBtnStr, 20)}
                         ${allfilters?.search?.split(",")?.length > 1
                        ? `(+${allfilters?.search?.split(",")?.length - 1
                        })`
                        : ""
                      }`
                        : t("filtersCommon.location")}
                  </button>
                  <Dialog
                    open={isOpen1}
                    onClose={() =>
                      closeFilter(setIsOpen1, setLocations, "search")
                    }
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center px-4">
                      <DialogPanel className="max-w-xl w-full bg-white rounded-[20px]">
                        <DialogTitle className="p-6">
                          <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                            {t("filtersCommon.whereAreYouLooking")}
                          </p>
                          <div className="pt-10 google_address">
                            <label htmlFor="address" className="mb-2 block text-sm font-medium text-[#47525E]">
                              {t("filtersCommon.location")}
                            </label>
                            <GooglePlaceAutoComplete
                              key={inputKey}
                              value={currentLocation}
                              onChange={setCurrentLocation}
                              result={addressResult}
                              placeholder={t("filtersCommon.enterLocationSearch")}
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

                          <div className="flex items-center gap-2 mt-3 mb-1">
                            <label className="text-sm font-medium text-[#47525E]">
                              Chercher en fonction d'une école
                            </label>
                            <div className="relative group">
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#976DD0] text-[#976DD0] text-[10px] font-bold cursor-pointer select-none">i</span>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#2d3748] text-white text-xs rounded-[8px] px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                                Chercher un bien immobilier en fonction de son école de rattachement tel que déclaré par le propriétaire.
                                <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2d3748]"></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                            <SelectDropdown
                              id="statusDropdown"
                              displayValue="name"
                              placeholder={t("filtersCommon.allSchoolTypes")}
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
                            <div className="w-full">
                              <Select
                                isMulti
                                options={schoolList}
                                value={selectedSchools}
                                isLoading={schoolsLoading}
                                isDisabled={schoolsLoading}
                                onChange={(selected) => {
                                  setSelectedSchools(selected || []);
                                  setIndFilter({
                                    ...indFilter,
                                    schoolIds: (selected || []).map((s) => s.value).join(','),
                                  });
                                }}
                                placeholder="Choisir école(s)"
                                noOptionsMessage={() =>
                                  locations.filter((l) => l.added)[0]?.zipcode
                                    ? "Aucun établissement trouvé"
                                    : "Sélectionnez d'abord une ville"
                                }
                                classNamePrefix="school-select"
                              />
                            </div>
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
                              {t("filtersCommon.results")}
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
                                    schoolIds: "",
                                  });
                                  setSelectedValue(0);
                                  setSelectedSchools([]);
                                  setSchoolList([]);
                                  setIndFilter({
                                    ...allfilters,
                                    search: "",
                                    maxDistance: 0,
                                    userLat: "",
                                    userLng: "",
                                    schoolStatus: "",
                                    schoolType: "",
                                    schoolIds: "",
                                  });
                                  setError({ ...error, location: "" });
                                  setcitySearch("");
                                  setZipcodeSearch("")
                                }}
                              >
                                {t("common.reset")}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (locations?.length === 0)
                                  return setError({
                                    ...error,
                                    location: t("filtersCommon.enterAtLeastOneLocation"),
                                  });
                                let locs = locations?.filter(
                                  (itm) => itm?.added
                                );

                                if (locs?.length === 0)
                                  return setError({
                                    ...error,
                                    location: t("filtersCommon.selectAtLeastOneLocation"),
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
                                  schoolIds: indFilter?.schoolIds || "",
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
                              {t("common.apply")}
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
                          ? `${allfilters?.proposal} ${t("filtersCommon.proposals")}`
                          : t("filtersCommon.offMarketStatus")}
                      </>
                    ) : allfilters?.propertyType === "directory" ? (
                      <>
                        {allfilters?.proposal
                          ? `${allfilters?.proposal} ${t("filtersCommon.proposals")}`
                          : t("filtersCommon.directoryStatus")}
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
                              : t("filtersCommon.budget")}
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
                              ? t("filtersCommon.offMarketStatus")
                              : allfilters?.propertyType === "directory"
                                ? t("filtersCommon.directoryStatus")
                                : t("pastTransactionsGrid.whatIsYourBudget")}
                          </p>
                          {allfilters?.propertyType === "offmarket" ||
                            allfilters?.propertyType === "directory" ? (
                            <>
                              <h2 className="mb-2 text-[#47525E] pt-4">
                                {t("filtersCommon.showPropertiesThatAre")}
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
                                    {t("filtersCommon.openToPurchaseProposals")}
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
                                    {t("filtersCommon.openToRentalProposals")}
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
                                  placeholder={t("filtersCommon.min")}
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
                                  placeholder={t("filtersCommon.max")}
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
                              {t("filtersCommon.results")}
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
                                  {t("common.reset")}
                                </button>
                              )}
                            <button
                              onClick={handleApply}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              {t("common.apply")}
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
                            : t("filtersCommon.revenue")}
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
                            {t("filtersCommon.yearlyRevenueQuestion")}
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
                              placeholder={t("filtersCommon.min")}
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
                              placeholder={t("filtersCommon.max")}
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
                              {t("filtersCommon.results")}
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
                                  {t("common.reset")}
                                </button>
                              )}
                            <button
                              onClick={handleApplyRevenues}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              {t("common.apply")}
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
                            : t("filtersCommon.surface")}
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
                            {t("pastTransactionsGrid.whatSurface")}
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
                              placeholder={t("filtersCommon.surfaceMin")}
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
                              placeholder={t("filtersCommon.surfaceMax")}
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
                              {t("filtersCommon.results")}
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
                                  {t("common.reset")}
                                </button>
                              )}
                            <button
                              onClick={handleApplySurface}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              {t("common.apply")}
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
                    {t("filtersCommon.rooms")} {allfilters.rooms && `(${allfilters.rooms})`}
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
                            {t("pastTransactionsGrid.whatNumberOfRooms")}
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
                              {t("filtersCommon.results")}
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
                                  {t("common.reset")}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (selectedRooms.length === 0)
                                  return setError({
                                    ...error,
                                    rooms: t("pastTransactionsGrid.selectAtLeastOneRoom"),
                                  });
                                applyRoomsFilters();
                              }}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              {t("common.apply")}
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
                        : t("filtersCommon.attractivity")}
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
                            {t("filtersCommon.attractivityLevelQuestion")}
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
                              {t("filtersCommon.results")}
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
                                  {t("common.reset")}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (!rating)
                                  return setError({
                                    ...error,
                                    rating: t("filtersCommon.selectRating"),
                                  });
                                setAllFilters({ ...allfilters, rating });
                                setIsOpen6(false);
                              }}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              {t("common.apply")}
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
                    {otherFilterCount > 0 && `${otherFilterCount}`} {t("filtersCommon.extraFilters")}
                  </button>
                  <Dialog
                    open={isOpen7}
                    onClose={() => setIsOpen7(false)}
                    className="relative z-[9999]"
                  >
                    <DialogBackdrop className="fixed inset-0 bg-black/50" />
                    <div className="fixed inset-0 flex w-screen items-center justify-center px-4">
                      <DialogPanel className="max-w-md w-full max-h-[45vh] bg-white rounded-[20px] overflow-hidden flex flex-col">
                        <div className="p-6 border-b">
                          <DialogTitle>
                            <p className="text-[#389D93] text-[18px] text-center pb-4">
                              {t("filtersCommon.moreCriteria")}
                            </p>
                          </DialogTitle>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto pt-4 px-6">
                            <ul className="py-4">
                              <li>
                                <h4 className="text-black font-[600] text-[16px] mb-4">
                                  {t("property.bedrooms")}
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
                                  {t("filtersCommon.floors")}
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
                                  {t("filtersCommon.cooking")}
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
                                  {t("filtersCommon.equipment")}
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
                                  {t("filtersCommon.outside")}
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
                                  {t("filtersCommon.servicesAndAccessibility")}
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
                                  {t("filtersCommon.ancilliaryAreas")}
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
                                  {t("filtersCommon.environment")}
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
                                  {t("filtersCommon.leisure")}
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
                                  {t("filtersCommon.investment")}
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
                                  {t("filtersCommon.energyPerformanceDiagnostics")}
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
                                              <div
                                                className="h-[28px] rounded-tl-[4px] rounded-bl-[4px] rounded-br-[1px] rounded-tr-[1px] block ms-3"
                                                style={{ width: option.size, backgroundColor: option.color }}
                                              />
                                              <p className={`traingle_shape${i}`} />
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
                        <div className="flex border-t p-4 justify-between shrink-0 bg-white">
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
                              {t("filtersCommon.results")}
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
                                {t("common.reset")}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleCreteriaApply();
                                setIsOpen7(false);
                              }}
                              className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                              {t("common.apply")}
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
                    {t("buttons.activateAlerts")}
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
                            {t("searchAlert.dontMiss")}
                            <span className="text-[#47525E] text-center font-[400] text-[16px] block">
                              {t("searchAlert.meetRequirements")}
                            </span>
                          </p>
                          <p className="text-[#47525E] my-3">
                            {generateDynamicString(allfilters)}
                          </p>
                          <label className="text-[#47525E] text-[16px] font-[400] mb-1 block">
                            {t("searchAlert.creatingAlertCause")}
                          </label>
                          <SelectDropdown
                            placeholder={t("filtersCommon.selectReason")}
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
                              {t("searchAlert.receiveAlerts")}
                            </button>
                          </div>
                          <p className="text-[#47525E] font-[400] text-center text-[14px]">
                            {t("searchAlert.dataPrivacyNote")}
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
                      {t("filtersCommon.resetFilters")}
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
                      {t("filtersCommon.map")}
                    </a>
                  </li>
                  <li onClick={() => setView("list")}>
                    <a
                      className={`${view === "list" ? "font-[600]" : ""
                        } text-[#47525E] text-[14px] px-3`}
                    >
                      {t("filtersCommon.list")}
                    </a>
                  </li>
                  <li onClick={() => setView("grid")}>
                    <a
                      className={`${view === "grid" ? "font-[600]" : ""
                        } text-[#47525E] text-[14px] px-3`}
                    >
                      {t("filtersCommon.grid")}
                    </a>
                  </li>
                </ul>
              </div>

              <Dialog open={isOpenn} onClose={() => setIsOpenn(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50 z-[9] flex w-screen items-center justify-center p-4">
                  <DialogPanel className="max-w-lg rounded-[12px] space-y-4 text-center border bg-white p-12">
                    <DialogTitle className="xl:text-[26px] lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000] font-semibold text-center">{t("home.upgrade.title")}</DialogTitle>
                    <p>{t("home.upgrade.description")}</p>
                    <div className="flex gap-2 justify-center items-center ">
                      <button onClick={() => setIsOpenn(false)} className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">{t("common.cancel")}</button>
                      <button onClick={() => navigate("/plan")} className="bg-[#986AB8] rounded-full px-8 py-2 text-white text-[14px] flex items-center justify-center">{t("home.upgrade.cta")}</button>
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonFilter;
