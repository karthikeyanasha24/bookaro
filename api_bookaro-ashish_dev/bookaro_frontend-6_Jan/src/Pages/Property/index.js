import { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Swal from "sweetalert2";
import FlwModal from "../../components/common/Modal/FlwModal";
import LoginModal from "../../components/common/Modal/LoginModal";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { removePropData } from "../../models/string.model";
import { categorizeData } from "../propertySteps/shared";
import { CommonCreteria } from "./commonCreteria/commonCreteria";
import CommonFilter from "./commonFilters/CommonFilters";
import CustomMap from "./CustomMap";
import PropertyCard from "./PropertyCard";
import PropertiesGrid from "./Propertygrid";
import PropertiesList from "./Propertylist";

const PropertyPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const params = new URLSearchParams(window.location.search);
  const favourites = params.get("favourites");
  const renter = params.get("renter");
  const buyer = params.get("buyer");
  const followed = params.get("followed");
  const search = params.get("search");
  const zipcode = params.get("zipcode")
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const type = params.get("type");
  const propertyType = params.get("propertyType");
  const offMarket = params.get("offMarket");
  const criteria = params.get("criteria");
  const prop = params.get("proposal");
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);
  const [isOpen7, setIsOpen7] = useState(false);
  const [isOpen9, setIsOpen9] = useState(false);
  const [selectedTab, setSelectedTab] = useState(propertyType || "");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [error, setError] = useState({ price: "", revenue: "", surface: "", proposal: "", alert: "", location: "" })
  const [priceRange, setPriceRange] = useState({ min: minPrice || "", max: maxPrice || "" })
  const [revenues, setRevenues] = useState({ min: "", max: "" });
  const [surface, setSurface] = useState({ min: "", max: "" });
  const [proposal, setProposal] = useState(prop || "");
  const [location, setLocation] = useState(search ? [{ name: search, added: true }] : []);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [ZipcodeSearch, setZipcodeSearch] = useState(zipcode);
  const [allfilters, setAllFilters] = useState({
    propertyType: selectedTab || propertyType,
    offMarket: offMarket,
    type: type || selectedTypes.map((data) => data).join(","),
    search: search,
    zipcode: zipcode,
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
    minRevenues: "",
    maxRevenues: "",
    minSurface: "",
    maxSurface: "",
    rooms: selectedRooms?.join(),
    proposal: prop || "",
    rating: "",
    maxDistance: 0,
    userLat: "",
    userLng: "",
    sortBy: "",
  });

  const [filters, setFilters] = useState({
    page: 1,
    count: 12,
    status: "active",
  });
  const [indFilter, setIndFilter] = useState({
    maxDistance: 0,
    userLat: "",
    userLng: "",
    propertyType: propertyType || "",
    offMarket: offMarket || false,
    type: type || "",
    zipcode: zipcode || "",
    search: search || "",
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
    proposal: prop || "",
  })

  const [alert, setAlert] = useState({
    reason: "",
    email: user?.email,
    name: "",
  })
  const addAlert = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!alert.reason) return setError({ ...error, alert: "Select reason" })
    if (!alert.email) return setError({ ...error, alert: "Enter email address" })
    if (!emailRegex.test(alert.email)) return setError({ ...error, alert: "Enter a valid email address" })

    // if (!alert.name) return setError({ ...error, alert: "Enter name" })
    const filteredData = Object.fromEntries(
      Object.entries(allfilters).filter(([key, value]) =>
        value !== "" && value !== 0 && value !== null && value !== undefined && (Array.isArray(value) ? value.length > 0 : true)
      )
    );
    let dto = {
      ...alert,
      filteredData,
      user_id: user?._id,
    }
    ApiClient.post("alerts/add", dto).then((res) => {
      if (res.success) {
        setIsOpen9(false);
        toast.success(res.message)
      }
    });
  }
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [showReset, setShowReset] = useState(false);
  console.log(showReset,"=-=-=-=-=-=-=-=")
  const [view, setView] = useState("map");
  const [amenities, setAmenities] = useState({});
  const [accountType, setAccountType] = useState("");
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const dropdownRefs = useRef([]);
  const [loginModal, setloginModal] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [flwModal, setflwModal] = useState(false);
  const [flwItem, setflwItem] = useState(null);

  useEffect(() => {
    if (type) {
      const typeArray = type?.split(",")?.map((item) => item.trim());
      setSelectedTypes(typeArray);
    }
  }, [type]);

  useEffect(() => {
    if (zipcode) {
      setZipcodeSearch(zipcode)
    }
  }, [zipcode]);

  const handleLetterChange = (event) => {
    const letter = event;
    setSelectedLetters((prevState) =>
      prevState.includes(letter)
        ? prevState.filter((item) => item !== letter)
        : [...prevState, letter]
    );
  };

  const categorizedData = categorizeData(amenities) || {};

  const toggleDropdown = (index) => {
    setDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownIndex !== null &&
        dropdownRefs.current[dropdownIndex] &&
        !dropdownRefs.current[dropdownIndex].contains(event.target)
      ) {
        setDropdownIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownIndex]);

  const editItem = (item) => {
    setDropdownIndex(null);
    navigate(`/property/edit/${item?.id || item?._id}`);
  };

  const deleteItem = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this Property`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.delete("property/deleteProperty", {
          id: item?._id || item?.id,
        }).then((res) => {
          if (res.success) {
            getData({ ...filters, ...allfilters });
            setDropdownIndex(null);
          }
          loader(false);
        });
      }
    });
  };

  const handleAccountTypeChange = (index) => {
    setAccountType(index);
    setAllFilters({ ...allfilters, accountType: index });
  };

  const resetData = () => {
    setAllFilters({
      propertyType: allfilters.propertyType,
      offMarket: (allfilters?.offMarket === "true" || allfilters?.offMarket === true) ? true : false,
      type: allfilters.type,
      search: allfilters.search,
      maxDistance: allfilters.maxDistance,
      userLat: allfilters.userLat,
      userLng: allfilters.userLng,
      minPrice: "",
      maxPrice: "",
      revenues: "",
      surface: "",
      rooms: "",
      amenities: "",
      accountType: "",
      rating: "",
      energy_efficient: "",
      sortBy: "",
      proposal: "",
    });
    setIndFilter({
      propertyType: indFilter.propertyType,
      offMarket: indFilter.offMarket == "true" ? true : false,
      type: indFilter.type,
      search: indFilter.search,
      maxDistance: indFilter.maxDistance,
      userLat: indFilter.userLat,
      userLng: indFilter.userLng,
      minPrice: "",
      maxPrice: "",
      revenues: "",
      surface: "",
      rooms: "",
      rating: "",
      proposal: "",
    })
    setSelectedLetters([]);
    setPriceRange({ min: "", max: "" });
    setProposal("");
    setRevenues({ min: "", max: "" });
    setSurface({ min: "", max: "" });
    setSelectedRooms([]);
    setAccountType("");
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
    setcitySearch("");
    setZipcodeSearch("")
    setShowReset(false);
    if (
      minPrice ||
      maxPrice ||
      followed ||
      favourites ||
      renter ||
      buyer ||
      criteria ||
      prop
    ) {
      const params = new URLSearchParams(window.location.search);
      if (type || propertyType || search) {
        for (const key of params.keys()) {
          if (key !== 'type' && key !== 'propertyType' && key !== 'search') {
            params.delete(key);
          }
        }
      } else {
        return navigate("/properties");
      }
      const newUrl = `${window.location.pathname}${params.toString()
        ? `?${params.toString()}` : ""}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  const handleApply = () => {
    if (indFilter?.propertyType === "offmarket" || indFilter?.propertyType === "directory") {
      if (!proposal) return setError({ ...error, proposal: "Mark checked atleast a proposal" })
      setAllFilters({ ...allfilters, proposal: proposal, minPrice: "", maxPrice: "" });
    } else {
      if (!priceRange?.min && !priceRange?.max) return setError({ ...error, price: "Enter range" })
      if (priceRange?.max) {
        if (+priceRange?.min >= +priceRange?.max) return setError({ ...error, price: "Enter correct range" })
      }
      setAllFilters({ ...allfilters, minPrice: priceRange?.min, maxPrice: priceRange?.max, proposal: "" });
    }
    setIsOpen2(false);
  };
  const handleApplyRevenues = () => {
    if (!revenues?.min && !revenues?.max) return setError({ ...error, revenue: "Enter range" })
    if (revenues?.max) {
      if (+revenues?.min >= +revenues?.max) return setError({ ...error, revenue: "Enter correct range" })
    }
    setAllFilters({ ...allfilters, minRevenues: revenues?.min, maxRevenues: revenues?.max, });
    setIsOpen3(false);
  };
  const handleApplySurface = () => {
    if (!surface?.min && !surface?.max) return setError({ ...error, surface: "Enter range" })
    if (surface?.max) {
      if (+surface?.min >= +surface?.max) return setError({ ...error, surface: "Enter correct range" })
    }
    setAllFilters({ ...allfilters, minSurface: surface?.min, maxSurface: surface?.max, });
    setIsOpen4(false);
  };

  // useEffect(() => {
  //   if (search) {
  //     setLocation([{ name: search, added: true }]);
  //   }
  // }, [search]);

  const handleCheckboxChange = (id) => {
    setSelectedTypes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    getData({ ...filters, ...allfilters });
  }, [filters]);

  const closeFilter = (attr) => {
    attr(false);
  };

  useEffect(() => {
    getData(allfilters);
    let fill = { ...allfilters }
    delete fill.propertyType;
    // delete fill.offMarket;
    delete fill.type;
    delete fill.search;
    delete fill.zipcode;
    delete fill.offMarket;
    delete fill.maxDistance;
    delete fill.userLat;
    delete fill.userLng;
    const validValueCount = Object.values(fill).filter(value => {
      return value !== "" && value !== null && value !== undefined && value !== 0 && value !== false && !(Array.isArray(value) && value.length === 0);
    }).length;
    setShowReset(validValueCount !== 0);
  }, [allfilters]);

  const getData = (f = {}) => {
    const filter = {
      ...filters,
      ...f,
      propertyType: (selectedTab == "offmarket" ? "" : selectedTab) || (propertyType == "offmarket" ? "" : propertyType),
      offMarket: (selectedTab == "offmarket" ? true : false) || (propertyType == "offmarket" ? true : false) || offMarket,
      loggedInUser: user?.id || user?._id
    };
    let dto = filter;
    if (followed == "true") dto.follow_unfollow = true;
    if (favourites == "true") dto.favourites = true;
    if (user?.loggedIn) dto.userId = user?._id;
    if (dto?.propertyType == "rent" || dto?.propertyType == "sale" || dto?.propertyType == "directory") {
      delete dto.loggedInUser;
    }
    loader(true);
    ApiClient.get("property/listing", dto).then((res) => {
      if (res.success) {
        setData(res?.data);
        setTotal(res?.total);
        let locations = [];
        res?.data?.map((item) => {
          if (item?.location?.lat || item?.location?.lng) {
            const isExact = item.exactLocation;
            locations.push({
              lat: isExact ? parseFloat(item?.location?.lat) : parseFloat(item?.randomLocation?.lat || item?.location?.lat),
              lng: isExact ? parseFloat(item?.location?.lng) : parseFloat(item?.randomLocation?.lng || item?.location?.lng),
              info: item?.city || item?.propertyTitle,
              exactLocation: true,
              icon: "/assets/img/prop/placeholder.png",
              // lng: parseFloat(item?.location?.lng),
              // exactLocation: isExact,
              // icon: isExact ? "/assets/img/prop/placeholder.png" :
              //   "/assets/img/banner-one.png",
            });
          }
        });
        setLocations(locations);
      }
      loader(false);
    });
  };

  const isLiked = (itm) => {
    if (!user?.loggedIn) return setloginModal(true);
    let method = "put";
    let url = `favorites/edit`;
    let value = {
      user_id: user?._id,
      property_id: itm?._id,
      like: true,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getData(allfilters);
      } else toast.error(res.message);
      loader(false);
    });
  };

  const isFollow = (itm) => {
    if (!user?.loggedIn) return setloginModal(true);
    if (!itm?.followunfollows_details) {
      setflwItem(itm)
      return setflwModal(true);
    }
    const isliked = itm?.followunfollows_details ? false : true;
    let method = "put";
    let url = `followUnfollow/update`;
    let value = {
      user_id: user?._id,
      property_id: itm?._id || itm?.id,
      follow_unfollow: isliked,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getData(allfilters);
      } else toast.error(res.message);
      loader(false);
    });
  };

  const disLiked = (itm) => {
    let method = "put";
    let url = `favorites/edit`;
    let value = {
      user_id: user?._id,
      property_id: itm?._id,
      like: false,
    };
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        getData(allfilters);
      } else toast.error(res.message);
      loader(false);
    });
  };

  const getAmenities = () => {
    ApiClient.get("amenity/listing").then((res) => {
      if (res.success) {
        setAmenities(
          res.data.map((itm) => {
            return {
              name: itm?.title,
              id: itm?.id || itm?._id,
              category: itm?.categoryId?.name,
            };
          })
        );
      }
    });
  };

  useEffect(() => {
    getAmenities();
    if (criteria) {
      setIsOpen7(true);
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has("criteria")) {
          params.delete("criteria");
          const newQuery = params.toString();
          navigate(`/properties${newQuery ? `?${newQuery}` : ""}`);
        }
      }, 2000);
    }
    removePropData();
  }, []);

  const [selections, setSelections] = useState({
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

  const handleCreteriaApply = () => {
    setAllFilters({
      ...allfilters,
      energy_efficient: selectedLetters.map((data) => data).join(","),
      cooking: selections.cooking.join(","),
      equipment: selections.equipment.join(","),
      serviceAccessibility: selections.serviceAccessibility.join(","),
      outside: selections.outside.join(","),
      environment: selections.environment.join(","),
      leisure: selections.leisure.join(","),
      ancilliary: selections.ancilliary.join(","),
      investment: selections.investment.join(","),
      situation: selections.situation.join(","),
      bedrooms: selections.bedrooms.join(","),
      propertyFloor: selections.propertyFloor.join(","),
    });
  };

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setFilters((prev) => ({ ...prev, ...allfilters, page: newPage }));
  };

  const navigateToDetail = (itm) => {
    navigate(`/property-details?id=${itm?._id}`);
    saveSearch(itm?._id)
  };

  const resetIndividual = (attr, key1, key2, key3) => {
    attr(false);
    setAllFilters({
      ...allfilters,
      [key1]: "",
      ...(key2 && { [key2]: "" }),
      ...(key3 && { [key3]: "" }),
    });
    if (key1 === "type") setSelectedTypes([]);
  };
  const removeParams = (type) => {
    const params = new URLSearchParams(window.location.search);
    if (params.has([type])) {
      params.delete([type]);
    }
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""
      }`;
    // Update the URL without reloading the page
    window.history.pushState({}, "", newUrl);
  };
  const handleSortBy = (one, two) => {
    setAllFilters({
      ...allfilters,
      sortBy: `${one} ${two}`,
    });
  };

  const toggleCriteriaCheckbox = (key, value) => {
    setSelections((prev) => {
      const updatedList = prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value];
      return {
        ...prev,
        [key]: updatedList,
      };
    });
  }

  const getFilterResult = () => {
    let dto = { ...filters, ...indFilter, loggedInUser: user?._id }
    if (user?.loggedIn) dto.userId = user?._id;
    if (dto?.propertyType == "rent" || dto?.propertyType == "sale" || dto?.propertyType == "directory") {
      delete dto.loggedInUser;
    }
    ApiClient.get("property/listing", dto).then((res) => {
      if (res.success) {
        setUpcomingCount(res?.total);
      }
    });
  }
  useEffect(() => {
    getFilterResult()
  }, [indFilter])

  const saveSearch = (id) => {
    // let dto = {
    //   searchBy: user?._id,
    //   propertyId: id,
    //   // propertyType: allfilters.propertyType,
    //   ...(allfilters.propertyType && { propertyType: allfilters.propertyType }),
    //   ...(citySearch && (ZipcodeSearch || zipcode) && { searchLocation: citySearch, zipcode: zipcode || ZipcodeSearch }),
    // }
    const finalZipcode = zipcode || ZipcodeSearch;
    let dto = {
      searchBy: user?._id,
      propertyId: id,
      ...(allfilters.propertyType && { propertyType: allfilters.propertyType }),
      ...(citySearch && { searchLocation: citySearch }),
      ...(finalZipcode && { zipcode: finalZipcode }),
    };
    ApiClient.post("savesearch/add", dto).then((res) => { });
  }
  useEffect(() => {
    if (user?.loggedIn && allfilters.propertyType) saveSearch()
  }, [allfilters.propertyType])
  // useEffect(() => {
  //   if (user?.loggedIn && citySearch && (ZipcodeSearch || zipcode)) saveSearch()
  // }, [citySearch, ZipcodeSearch, zipcode])

  useEffect(() => {
    if (user?.loggedIn && (zipcode || ZipcodeSearch || citySearch)) {
      saveSearch();
    }
  }, [citySearch, ZipcodeSearch, zipcode]);



  return (
    <>
      <PageLayout>
        <div className="">
          <LoginModal
            loginModal={loginModal}
            setloginModal={setloginModal}
          />
          <FlwModal
            flwModal={flwModal}
            setflwModal={setflwModal}
            flwItem={flwItem}
            refetch={getData}
            allfilters={allfilters}
            existData={false}
          />

          <CommonFilter
            allfilters={allfilters}
            setAllFilters={setAllFilters}
            locations={location}
            setLocations={setLocation}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            revenues={revenues}
            setRevenues={setRevenues}
            surface={surface}
            setSurface={setSurface}
            handleApplyRevenues={handleApplyRevenues}
            handleApplySurface={handleApplySurface}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isOpen1={isOpen1}
            setIsOpen1={setIsOpen1}
            isOpen2={isOpen2}
            setIsOpen2={setIsOpen2}
            isOpen3={isOpen3}
            setIsOpen3={setIsOpen3}
            isOpen4={isOpen4}
            setIsOpen4={setIsOpen4}
            isOpen5={isOpen5}
            setIsOpen5={setIsOpen5}
            isOpen6={isOpen6}
            setIsOpen6={setIsOpen6}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            handleCheckboxChange={handleCheckboxChange}
            closeFilter={closeFilter}
            handleApply={handleApply}
            resetData={resetData}
            view={view}
            setView={setView}
            showReset={showReset}
            selections={selections}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            resetIndividual={resetIndividual}
            removeParams={removeParams}
            // new extra filter props
            isOpen7={isOpen7}
            setIsOpen7={setIsOpen7}
            setSelections={setSelections}
            categorizedData={categorizedData}
            selectedLetters={selectedLetters}
            setSelectedLetters={setSelectedLetters}
            handleLetterChange={handleLetterChange}
            handleCreteriaApply={handleCreteriaApply}
            isOpen9={isOpen9}
            setIsOpen9={setIsOpen9}
            selectedRooms={selectedRooms}
            setSelectedRooms={setSelectedRooms}
            toggleCriteriaCheckbox={toggleCriteriaCheckbox}
            indFilter={indFilter}
            setIndFilter={setIndFilter}
            error={error}
            setError={setError}
            upcomingCount={upcomingCount}
            proposal={proposal}
            setProposal={setProposal}
            alert={alert}
            setAlert={setAlert}
            addAlert={addAlert}
            setcitySearch={setcitySearch}
            setZipcodeSearch={setZipcodeSearch}
          />

          {view === "map" && (
            <div className="bg-[#f9f9f9] py-10">
              <div className=" items-center  mx-auto container lg:px-10 px-6">
                {favourites && (
                  <ul className="flex items-center pb-[30px]">
                    <li onClick={() => navigate("/project")} className="text-[#47525E] cursor-pointer after">
                      My Project
                      <span className="mx-[4px]">|</span></li>

                    <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                      Interacted Properties</li>
                  </ul>
                )}
                <div className="grid grid-cols-12 md:gap-8 gap-0">
                  <CommonCreteria
                    total={total}
                    accountType={accountType}
                    handleAccountTypeChange={handleAccountTypeChange}
                    allfilters={allfilters}
                    handleSortBy={handleSortBy}
                  />
                  <div className="xl:col-span-8 lg:col-span-8 md:col-span-6  col-span-12 lg:mb-0 mb-4 h-[700px] overflow-auto pe-3 md:mt-0 mt-5 ">
                    <div className="grid grid-cols-12 bg-[#f9f9f9] md:gap-4 gap-0 md:mt-0 mt-5">
                      {data?.length > 0 ? (
                        data.map((item, index) => {
                          let price = parseInt(item?.price || 0);
                          let sur = parseInt(item?.surface || 0);
                          let perSqr;
                          if (sur > 0) {
                            perSqr = price / sur;
                          }
                          const isExact = item.exactLocation;
                          return (
                            <div className="xl:col-span-4 lg:col-span-6 md:col-span-12 col-span-12 relative my-10"
                              key={index}
                              onMouseEnter={() => setHoveredLocation({
                                lat: isExact ? parseFloat(item?.location?.lat) : parseFloat(item?.randomLocation?.lat || item?.location?.lat),
                                lng: isExact ? parseFloat(item?.location?.lng) : parseFloat(item?.randomLocation?.lng || item?.location?.lng),
                              })}
                              onMouseLeave={() => setHoveredLocation(null)}
                            >
                              <PropertyCard
                                item={item}
                                navigateToDetail={navigateToDetail}
                                toggleDropdown={toggleDropdown}
                                editItem={editItem}
                                deleteItem={deleteItem}
                                price={price}
                                perSqr={perSqr}
                                isFollow={isFollow}
                                disLiked={disLiked}
                                isLiked={isLiked}
                                dropdownRefs={dropdownRefs}
                                index={index}
                                dropdownIndex={dropdownIndex}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center col-span-12 my-8">
                          <img src="assets/img/no-data.svg" className="w-[400px] mx-auto " />
                          No Records Found
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center my-4 pe-3">
                      <h4 className="text-[#47525E] font-[600] xl:text-[20px] text-[16px] w-[60%]">Be informed when new properties are listed</h4>
                      <button className="bg-[#976DD0] text-white px-3 py-2 rounded-[50px] text-[12px] font-[600]  w-fit"
                        onClick={() => setIsOpen9(true)}>Activate alerts</button>
                    </div>
                    <div className={`paginationWrapper xl:flex-row flex-col ${total > filters?.count ? "" : "d-none"}`} >
                      <span className="xl:mb-0 mb-2 block">
                        Show {data?.length} from {total} Properties
                      </span>
                      <ReactPaginate
                        previousLabel="<Pre"
                        nextLabel="Next>"
                        breakLabel="..."
                        pageRangeDisplayed={2}
                        marginPagesDisplayed={1}
                        pageCount={Math.ceil(total / filters.count)}
                        onPageChange={handlePageChange}
                        forcePage={filters.page - 1}
                        containerClassName={"pagination flex"}
                        pageClassName={"pagination-item"}
                        activeClassName={"pagination-item-active"}
                      />
                    </div>
                  </div>
                  <div className="xl:col-span-4  lg:col-span-4 md:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 custom-map">
                    <CustomMap
                      locations={locations}
                      hoveredLocation={hoveredLocation} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {view === "grid" && (
            <PropertiesGrid
              data={data}
              isLiked={isLiked}
              total={total}
              filters={filters}
              handlePageChange={handlePageChange}
              handleAccountTypeChange={handleAccountTypeChange}
              accountType={accountType}
              disLiked={disLiked}
              allfilters={allfilters}
              isFollow={isFollow}
              navigateToDetail={navigateToDetail}
              toggleDropdown={toggleDropdown}
              dropdownIndex={dropdownIndex}
              editItem={editItem}
              deleteItem={deleteItem}
              dropdownRefs={dropdownRefs}
              favourites={favourites}
            />
          )}
          {view === "list" && (
            <PropertiesList
              data={data}
              isLiked={isLiked}
              total={total}
              filters={filters}
              handlePageChange={handlePageChange}
              handleAccountTypeChange={handleAccountTypeChange}
              accountType={accountType}
              disLiked={disLiked}
              allfilters={allfilters}
              isFollow={isFollow}
              navigateToDetail={navigateToDetail}
              handleSortBy={handleSortBy}
              toggleDropdown={toggleDropdown}
              dropdownIndex={dropdownIndex}
              editItem={editItem}
              deleteItem={deleteItem}
              dropdownRefs={dropdownRefs}
              favourites={favourites}
            />
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default PropertyPage;
