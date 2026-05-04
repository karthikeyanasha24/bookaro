import {
  Checkbox,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Description,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import GooglePlaceAutoComplete from "../components/common/GooglePlaceAutoComplete";
import FlwModal from "../components/common/Modal/FlwModal";
import LoginModal from "../components/common/Modal/LoginModal";
import PageLayout from "../components/global/PageLayout";
import QuickSearch from "../components/QuickSearch/QuickSearch";
import ApiClient from "../methods/api/apiClient";
import loader from "../methods/loader";
import addressModel from "../models/address.model";
import {
  objToQueryParam,
  queryParamToObj,
  removePropData,
} from "../models/string.model";
import BlogSection from "./Blogs/BlogSection";
import PropertyCardHome from "./Property/PropertyCardHome";
import { login_success } from "../actions/user";
import UpgradePlan from "../components/common/Modal/UpgradePlan";

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#ddd] rounded-[12px] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 flex items-center justify-between font-[600] text-[16px] transition ${
          isOpen
            ? "bg-[#976DD0] text-white"
            : "bg-[#f0f0f0] text-[#47525E] hover:bg-[#e8e8e8]"
        }`}
      >
        <span>{question}</span>
        <span className="text-[20px]">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white text-[#47525E] text-[14px] border-t border-[#ddd]">
          {answer}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { user } = useSelector((state) => state);
  const activePlan = useSelector((state) => state.activePlan);
  const [propertyTotal, setpropertyTotal] = useState(0);
  const [propertyLoader, setpropertyLoader] = useState(false);
  const [planModal, setplanModal] = useState(false);
  let [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [properties, setproperties] = useState([]);
  const [form, setForm] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    proposal: "",
    offMarket: activePlan?.[0]?.offMarket ? true : false,
    offMarketUsage: false,
    apartment: false,
    castle: false,
    house: false,
    building: false,
    farm: false,
  });
  console.log(form, "form")
  const [citySearch, setcitySearch] = useState("");
  const [cityZipcode, setcityZipcode] = useState("");
  const [errors, setErrors] = useState("");
  const [additionalFilter, setAdditionalFilter] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [loginModal, setloginModal] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const dropdownRefs = useRef([]);
  const [lastSearchObj, setLastSearchObj] = useState(
    queryParamToObj(user?.url)
  );
  const [flwModal, setflwModal] = useState(false);
  const [flwItem, setflwItem] = useState(null);

  useEffect(() => {
    if (user?._id) getProperties();
    removePropData();
  }, []);

  const getProperties = () => {
    if (!user?.url) return;
    loader(true);
    ApiClient.get("property/listing", {
      ...queryParamToObj(user?.url),
      page: 1,
      status: "active",
      userId: user?._id,
      maxDistance: "",
      userLat: "",
      userLng: "",
    })?.then((res) => {
      if (res.success) {
        setproperties(res?.data);
      }
      loader(false);
    });
  };

  const handleChange = (key, value) => {
    if (key === "price" && value < 0) return;
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleSearch = (more) => {
    const { apartment, castle, house, building, farm, ...otherFields } = form;
    let types = [];
    if (apartment) types.push("Apartment");
    if (castle) types.push("Castle");
    if (house) types.push("House");
    if (building) types.push("Building");
    if (farm) types.push("Farm");
    // validations
    if (!more && !form.search) return setErrors("Set your search parameters");
    if (form.propertyType === "sale" || form.propertyType === "rent") {
      if (form.maxPrice) {
        if (Number(form.minPrice) >= Number(form.maxPrice))
          return setErrors("Enter correct range");
      }
    }
    // add to saved searches
    if (citySearch && cityZipcode && user?.loggedIn) saveSearch(citySearch, cityZipcode);
    const queryParams = objToQueryParam(otherFields);
    if (types.length > 0) {
      queryParams?.set("type", types.join(","));
    }
    const query = queryParams.toString();
    if (!more && user?._id) lastSearch(query);
    if (query) {
      // const url = more
      //   ? `/properties?${query}&criteria=true`
      //   : `/properties?${query}`;
      // navigate(url);

      // more criteria removed
      const url = `/properties?${query}&zipcode=${cityZipcode}`;
      navigate(url);
    } else {
      navigate(`/properties`);
    }
  };

  const seeAllLastSearchRecords = () => {
    if (user?.url) {
      const url = `/properties?${user?.url}`;
      navigate(url);
    } else {
      navigate(`/properties`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lastSearch = (params) => {
    const payload = {
      userId: user?.id || user?._id,
      url: params,
    };
    ApiClient.put("user/editUserDetails", payload).then((res) => {
      if (res.success) {
        dispatch(login_success({ url: params }));
      }
    });
  };

  const closeAdditionalFilter = () => {
    setAdditionalFilter(false);
    setForm({
      ...form,
      apartment: false,
      castle: false,
      house: false,
      building: false,
      farm: false,
    });
  };

  const navigateToDetail = (itm) => {
    navigate(`/property-details?id=${itm?._id}`, {
      state: { paramId: itm?._id },
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
        getProperties();
      } else toast.error(res.message);
      loader(false);
    });
  };

  const isFollow = (itm) => {
    if (!user?.loggedIn) return setloginModal(true);
    if (!itm?.followunfollows_details) {
      setflwItem(itm);
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
        getProperties();
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
        getProperties();
      } else toast.error(res.message);
      loader(false);
    });
  };

  const clearLocation = () => {
    setInputKey((prevKey) => prevKey + 1);
    setForm({ ...form, search: "" });
    setcitySearch("");
    setcityZipcode("")
  };

  const addressResult = async (e) => {
    let address = {};
    if (e.place) {
      address = await addressModel.getAddress(e.place);
    }
    console.log(address, "address")
    // const newLocation = `${e.value?.split(",")[0]}${address?.zipcode && ` (${address?.zipcode})`}`;
    const newLocation = `${e.value?.split(",")[0]}`;
    setForm({ ...form, search: newLocation });
    setcitySearch(address?.city);
    setcityZipcode(address?.zipcode)
    setErrors("");
  };

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
            getProperties();
            setDropdownIndex(null);
          }
          loader(false);
        });
      }
    });
  };

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

  const changeTab = (tab) => {
    setForm({
      ...form,
      propertyType: tab,
      offMarket: tab == true ? true : false,
      minPrice: "",
      maxPrice: "",
      proposal: "",
    });
    setErrors("");
  };

  const tabs = [
    { name: "Off-Market", value: true },
    { name: "Rent now", value: "rent" },
    { name: "Buy now", value: "sale" },
    { name: "Directory", value: "directory" },
  ];

  const saveSearch = (search) => {
    if (!search) return;
    let dto = {
      searchBy: user?._id,
      searchLocation: search,
      propertyType: form?.propertyType == "" ? "offmarket" : form?.propertyType
    };
    ApiClient.post("savesearch/add", dto).then((res) => { });
  };

  const getAllProperty = () => {
    setpropertyLoader(true);
    ApiClient.get(
      `property/listing?page=1&count=1000&status=active&addedBy=${user?.id || user?._id
      }&maxDistance=&userLat=&userLng=&propertyType=&userId=${user?.id || user?._id
      }&loggedInUser=${user?.id || user?._id}`
    ).then((res) => {
      if (res.success) {
        setpropertyTotal(res.total);
      }
      setpropertyLoader(false);
    });
  };

  useEffect(() => {
    if (user.loggedIn) {
      getAllProperty();
    } else {

    }
  }, []);

  const handleProperty = () => {
    if (user.loggedIn) {
      if (propertyTotal >= activePlan?.[0]?.numberOfProperty) {
        setplanModal(true);
        return;
      }
      removePropData();
      return navigate("/property1");
    } else {
      setloginModal(true);
    }
  };


  return (
    <>
      <UpgradePlan planModal={planModal} setplanModal={setplanModal} />
      <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
      <FlwModal
        flwModal={flwModal}
        setflwModal={setflwModal}
        flwItem={flwItem}
        refetch={getProperties}
        allfilters={lastSearchObj}
        existData={false}
      />
      <PageLayout>
        <div className="">
          <section className="py-14   lg:py-16  bg-img relative">
            <div className="container-fluid  2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px]  items-center   mx-auto  h-full">
              <div className="grid grid-cols-12 h-full">
                <div className="lg:col-span-3 col-span-full justify-center flex  flex-col">
                  <h2 className="text-white 2xl:text-[38px] xl:text-[20px] lg:text-[19px] text-[20px] font-bold mb-0">
                    The LinkedIn of real estate
                  </h2>
                  <h4 className="text-white 2xl:text-[28px] lg:text-[14px] text-[16px] font-bold  mb-2 2xl:max-w-[320px] xl:max-w-[240px] max-w-[400px] my-3 mb-4">
                    The All-in-one real estate marketplace with Offmarket
                    properties, public opportunities and the largest real estate
                    properties directory.
                  </h4>
                  <button
                    disabled={propertyLoader}
                    className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit"
                    onClick={() => handleProperty()}
                  >
                    {propertyLoader ? "Loading..." : "List my property"}
                  </button>
                </div>
                <div className="lg:absolute position-set relative 2xl:w-[700px] xl:w-[650px] lg:w-[500px] w-[100%] lg:col-span-6 col-span-full lg:mt-0 mt-5 ">
                  <div className="">
                    <ul className="flex items-center w-full sm:gap-1 gap-0 sm:flex-nowrap flex-wrap">
                      {tabs.map((itm, i) => (
                        <li
                          key={i}
                          // title={itm?.name == "Off-Market" && !activePlan?.[0]?.offMarket ? "Pleadse upgrade your plan" : ""}
                          onClick={() => {
                            if (itm?.name == "Off-Market" && !activePlan?.[0]?.offMarket) {
                              setIsOpen(true)
                              changeTab("");
                            } else {
                              changeTab(itm.value);
                            }

                          }}
                          className={`${(form.propertyType === itm.value || (form?.offMarket === itm.value))
                            ? "bg-[#7BBEB8] text-white"
                            : "bg-white text-[#B2B2B2]"
                            } xl:py-3 xl:px-3 px-1  py-3 font-bold sm:w-1/3 w-1/2 text-center sm:rounded-tl-[10px]  rounded-tl-[0px] rounded-tr-[0px] sm:rounded-tr-[10px]  text-[14px] cursor-pointer`}
                        >
                          {itm.name}
                        </li>
                      ))}
                    </ul>

                    <Dialog
                      open={additionalFilter}
                      onClose={() => {
                        setAdditionalFilter(false);
                      }}
                      className="relative z-[9999]"
                    >
                      <DialogBackdrop className="fixed inset-0 bg-black/30" />
                      <div className="fixed inset-0 flex w-screen items-center justify-center ">
                        <DialogPanel className="max-w-md  w-full bg-white rounded-[20px]  ">
                          <DialogTitle className=" p-6 ">
                            <p className="border-b  text-[#389D93] text-[18px] text-center pb-4">
                              {" "}
                              Select property type's
                            </p>
                            <ul className="flex items-center flex-wrap pt-6 justify-center">
                              <div class="flex items-center  rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0]">
                                <Checkbox
                                  checked={form.house}
                                  value={form.house}
                                  onChange={(e) => {
                                    handleChange("house", e);
                                    setErrors("");
                                  }}
                                  className="group block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1"
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
                                <div class="flex flex-col">
                                  <h1 className="text-[#343F4B] font-medium text-[14px]">
                                    House
                                  </h1>
                                </div>
                              </div>
                              <div class="flex items-center rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0] ms-2 mb-2">
                                <Checkbox
                                  checked={form.apartment}
                                  value={form.apartment}
                                  onChange={(e) => {
                                    handleChange("apartment", e);
                                    setErrors("");
                                  }}
                                  className="group block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1 "
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

                                <div class="flex flex-col">
                                  <h1 class="text-[#343F4B] font-medium text-[14px]">
                                    Apartment
                                  </h1>
                                </div>
                              </div>
                              <div class="flex items-center rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0] ms-2 mb-2">
                                <Checkbox
                                  checked={form.castle}
                                  value={form.castle}
                                  onChange={(e) => {
                                    handleChange("castle", e);
                                    setErrors("");
                                  }}
                                  className="group block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1 "
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
                                <div class="flex flex-col">
                                  <h1 class="text-[#343F4B] font-medium text-[14px]">
                                    Castle
                                  </h1>
                                </div>
                              </div>
                              <div class="flex items-center rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0] ms-2 mb-2">
                                <Checkbox
                                  checked={form.building}
                                  value={form.building}
                                  onChange={(e) => {
                                    handleChange("building", e);
                                    setErrors("");
                                  }}
                                  className="group block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1 "
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
                                <div class="flex flex-col">
                                  <h1 class="text-[#343F4B] font-medium text-[14px]">
                                    Building
                                  </h1>
                                </div>
                              </div>
                              <div class="flex items-center rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0] ms-2 mb-2">
                                <Checkbox
                                  checked={form.farm}
                                  value={form.farm}
                                  onChange={(e) => {
                                    handleChange("farm", e);
                                    setErrors("");
                                  }}
                                  className="group block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1 "
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
                                <div class="flex flex-col">
                                  <h1 class="text-[#343F4B] font-medium text-[14px]">
                                    Farm
                                  </h1>
                                </div>
                              </div>
                            </ul>
                          </DialogTitle>

                          <div className="flex border-t p-4 justify-between">
                            <button
                              onClick={closeAdditionalFilter}
                              className="text-[#868389] text-[18px] underline"
                            >
                              Cancel
                            </button>
                            <div className="flex items-center">
                              <button
                                onClick={() => setAdditionalFilter(false)}
                                className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </DialogPanel>
                      </div>
                    </Dialog>

                    {form.propertyType === "directory" ||
                      form.propertyType === "offmarket" ? (
                      <div className="sm:p-10 py-5 2xl:px-8 xl:px-7 px-4  bg-white rounded-bl-[10px] rounded-br-[10px] home_search xl:h-[357px] sm:h-[400px] h-[410px]">
                        <h2 className="text-[#47525E] text-center sm:text-[16px] text-[14px]">
                          {form.propertyType === "directory"
                            ? `Your real estate project starts here! And your dreamed
                          home is probably here!`
                            : `The Off-Market gives you access to exclusive properties
                           and opportunities`}
                        </h2>
                        {form.propertyType === "directory" ? (
                          <p className="text-[#7BBEB8] text-center sm:text-[16px] text-[14px]">
                            Find now the property you will buy/rent in months or
                            years and contact owner now
                          </p>
                        ) : (
                          <p className="text-[#47525E] font-bold text-center sm:text-[16px] text-[14px]">
                            while negociating freely purchase or rental
                            conditions with owner.
                          </p>
                        )}

                        <div className="flex items-center justify-center sm:my-8 my-6">
                          <div className="flex items-center">
                            <Checkbox
                              checked={form.proposal === "rental"}
                              onChange={() => {
                                setErrors("");
                                setForm({
                                  ...form,
                                  proposal:
                                    form.proposal === "rental" ? "" : "rental",
                                });
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
                            <label className="text-[#47525E] sm:text-[14px] text-[13px]">

                              {form.propertyType === "directory" ? "Open to rental proposal" : "Rental "
                              }
                            </label>
                          </div>
                          <div className="flex items-center sm:ms-6 ms-3">
                            <Checkbox
                              checked={form.proposal === "purchase"}
                              onChange={() => {
                                setErrors("");
                                setForm({
                                  ...form,
                                  proposal:
                                    form.proposal === "purchase"
                                      ? ""
                                      : "purchase",
                                });
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
                            <label className="text-[#47525E] sm:text-[14px] text-[13px]">
                              {form.propertyType === "directory" ? "Open to purchase proposal" : "Purchase "
                              }
                              {" "}

                            </label>
                          </div>
                        </div>
                        <div className="flex sm:items-center sm:flex-row flex-col flex-start gap-2 lg:justify-between justify-center">
                          <div className="relative 2xl:w-[230px] xl:w-[200px] lg:w-[180px]  sm:w-[180px] w-[100%]">
                            <GooglePlaceAutoComplete
                              key={inputKey}
                              value={form.search}
                              result={addressResult}
                              placeholder="In which city?"
                              id="address"
                            />
                            {form.search?.trim() && (
                              <button
                                onClick={() => clearLocation()}
                                className="absolute right-[4px] top-3"
                              >
                                <RxCross2 className="cursor-pointer" />
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col   sm:mt-0  mt-2">
                            <div className="flex items-center sm:justify-start justify-center ">
                              <div class="flex items-center  rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0] xl:w-[110px] w-fit">
                                <Checkbox
                                  checked={form.house}
                                  value={form.house}
                                  onChange={(e) => {
                                    handleChange("house", e);
                                    setErrors("");
                                  }}
                                  className="group block size-7 shrink-0 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1"
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
                                <div class="flex flex-col">
                                  <h1 className="text-[#343F4B] font-medium text-[14px]">
                                    House
                                  </h1>
                                </div>
                              </div>

                              <div class="flex items-center rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0] ms-2 xl:w-[130px] w-fit xl:flex lg:hidden ">
                                <Checkbox
                                  checked={form.apartment}
                                  value={form.apartment}
                                  onChange={(e) => {
                                    handleChange("apartment", e);
                                    setErrors("");
                                  }}
                                  className="group block size-7 me-2 shrink-0 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1 "
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

                                <div class="flex flex-col">
                                  <h1 class="text-[#343F4B] font-medium text-[14px]">
                                    Appartment
                                  </h1>
                                </div>
                              </div>
                              <div className="ms-3">
                                <img
                                  onClick={() => setAdditionalFilter(true)}
                                  src="assets/img/plus.png"
                                  alt=""
                                  className="cursor-pointer w-[37px]  rounded-full border p-2 border-dashed border-[#8492A6]"
                                />
                              </div>
                              <p
                                className="text-[#7BBEB8] 2xl:text-[14px]  text-[13px] underline text-end 2xl:ms-4 ms-2 cursor-pointer sm:inline-block hidden"
                                onClick={() => handleSearch(true)}
                              >
                                More criteria
                              </p>
                            </div>
                          </div>
                          <p
                            className="text-[#7BBEB8] text-[14px] underline text-center 2xl:ms-4 md:ms-2 ms-0 cursor-pointer block sm:hidden"
                            onClick={() => handleSearch(true)}
                          >
                            More criteria
                          </p>
                        </div>
                        <p
                          onClick={() => {
                            if (user.loggedIn) return navigate("/property1");
                            else {
                              setloginModal(true);
                            }
                          }}
                          className="cursor-pointer text-[#986AB8] underline text-center text-[14px] my-5 mt-6"
                        >
                          Owner? List your property
                        </p>

                        <button
                          onClick={() => handleSearch()}
                          className="bg-[#986AB8] rounded-[50px] px-8 py-2 text-white text-[14px] flex items-center justify-center mx-auto"
                        >
                          See results
                        </button>
                        {errors && (
                          <span className="text-[#ff0000] text-sm text-center mx-auto block mt-1">
                            {errors}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="sm:p-10 py-5 2xl:px-8 xl:px-7 px-4  bg-white rounded-bl-[10px] rounded-br-[10px] home_search xl:h-[357px] sm:h-[400px] h-[410px]">
                        <div className="flex sm:items-center sm:flex-row flex-col flex-start gap-2 mt-2">
                          <div className="flex flex-col  sm:w-1/2 w-full">
                            <label className="mb-1">Location</label>
                            <div className="relative">
                              <GooglePlaceAutoComplete
                                key={inputKey}
                                value={form.search}
                                result={addressResult}
                                placeholder="In which city?"
                                id="address"
                              />
                              {form.search?.trim() && (
                                <button
                                  onClick={() => clearLocation()}
                                  className="absolute right-[4px] top-3"
                                >
                                  <RxCross2 className="cursor-pointer" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col  sm:w-1/2 w-full sm:ms-2 sm:mt-0 ms-0 mt-2">
                            <label className="mb-1">
                              {form.propertyType === "rent"
                                ? "Rental"
                                : "Price"}{" "}
                              (€)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={form.minPrice}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  value = value.replace(/[^0-9]/g, "");
                                  if (value.length > 10)
                                    value = value.slice(0, 10);
                                  setForm({
                                    ...form,
                                    minPrice: value,
                                  });
                                  setErrors("");
                                }}
                                className="bg-[#F0F0F0] px-4 py-1 rounded-[8px] text-[#47525E] text-[14px]   w-full h-[40px] flex items-center"
                                placeholder="Min €"
                              />
                              <input
                                type="text"
                                value={form.maxPrice}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  value = value.replace(/[^0-9]/g, "");
                                  if (value.length > 10)
                                    value = value.slice(0, 10);
                                  setForm({
                                    ...form,
                                    maxPrice: value,
                                  });
                                  setErrors("");
                                }}
                                className="bg-[#F0F0F0] px-4 py-1 rounded-[8px] text-[#47525E] text-[14px]   w-full h-[40px] flex items-center"
                                placeholder="Max €"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-8">
                          <div className="flex items-center ">
                            <div class="flex items-center  rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0] w-[130px]">
                              <Checkbox
                                checked={form.house}
                                value={form.house}
                                onChange={(e) => {
                                  handleChange("house", e);
                                  setErrors("");
                                }}
                                className="group block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1"
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
                              <div class="flex flex-col">
                                <h1 className="text-[#343F4B] font-medium text-[14px]">
                                  House
                                </h1>
                              </div>
                            </div>

                            <div class="flex items-center rounded-full ps-1 pe-4 py-[4px] border border-[#976DD0] ms-2 w-[130px]">
                              <Checkbox
                                checked={form.apartment}
                                value={form.apartment}
                                onChange={(e) => {
                                  handleChange("apartment", e);
                                  setErrors("");
                                }}
                                className="group block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1 "
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

                              <div class="flex flex-col">
                                <h1 class="text-[#343F4B] font-medium text-[14px]">
                                  Apartment
                                </h1>
                              </div>
                            </div>
                            <div className="ms-3">
                              <img
                                onClick={() => setAdditionalFilter(true)}
                                src="assets/img/plus.png"
                                alt=""
                                className="cursor-pointer w-[37px]  rounded-full border p-2 border-dashed border-[#8492A6]"
                              />
                            </div>
                            <p
                              className="text-[#7BBEB8] 2xl:text-[14px]  text-[13px] underline text-end 2xl:ms-4 ms-2 cursor-pointer sm:inline-block hidden"
                              onClick={() => handleSearch(true)}
                            >
                              More criteria
                            </p>
                          </div>
                          <p
                            className="text-[#7BBEB8] text-[14px] underline text-center 2xl:ms-4 md:ms-2 mt-2 ms-0 cursor-pointer block sm:hidden"
                            onClick={() => handleSearch(true)}
                          >
                            More criteria
                          </p>
                        </div>
                        <p
                          onClick={() => {
                            if (user.loggedIn) return navigate("/property1");
                            else {
                              setloginModal(true);
                            }
                          }}
                          className="cursor-pointer text-[#986AB8] underline text-center text-[14px] my-5 mt-6"
                        >
                          Owner? List your property
                        </p>
                        <button
                          onClick={() => {
                            handleSearch();
                          }}
                          className="bg-[#986AB8] rounded-[50px] px-8 py-2 text-white text-[14px] flex items-center justify-center mx-auto"
                        >
                          See results
                        </button>
                        {errors && (
                          <span className="text-[#ff0000] text-sm text-center mx-auto block mt-1">
                            {errors}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works - Seller Journey Section */}
          <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid 2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px] mx-auto">
              <div className="grid grid-cols-12">
                <div className="col-span-12 mb-[40px]">
                  <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600]">
                    How It Works - For Sellers
                    <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                  </h2>
                </div>
              </div>

              {/* Horizontal Timeline - Desktop/Tablet */}
              <div className="hidden md:grid grid-cols-12 items-center mb-10">
                {[
                  { step: 1, title: "List in Directory", icon: "📋" },
                  { step: 2, title: "Test with Off-Market", icon: "🔍" },
                  { step: 3, title: "Publish on Market", icon: "📢" },
                  { step: 4, title: "Transaction Tool", icon: "✓" },
                  { step: 5, title: "Transfer Ownership", icon: "📝" },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center col-span-12 md:col-span-2">
                    <div className="flex flex-col items-center flex-1 w-full">
                      <div className="w-[60px] h-[60px] rounded-full bg-[#976DD0] text-white flex items-center justify-center font-bold text-[24px] mb-3">
                        {item.step}
                      </div>
                      <p className="text-[#47525E] font-[600] text-center text-[14px]">{item.title}</p>
                    </div>
                    {idx < 4 && (
                      <div className="hidden md:block w-full h-[2px] bg-[#976DD0] mt-3 flex-1"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Vertical Timeline - Mobile */}
              <div className="md:hidden grid grid-cols-12 gap-4 mb-10">
                {[
                  { step: 1, title: "List in Directory" },
                  { step: 2, title: "Test with Off-Market" },
                  { step: 3, title: "Publish on Market" },
                  { step: 4, title: "Transaction Tool" },
                  { step: 5, title: "Transfer Ownership" },
                ].map((item, idx) => (
                  <div key={idx} className="col-span-12 flex items-center">
                    <div className="w-[45px] h-[45px] rounded-full bg-[#976DD0] text-white flex items-center justify-center font-bold text-[18px] flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-[#47525E] font-[600] text-[14px]">{item.title}</p>
                    </div>
                    {idx < 4 && (
                      <div className="absolute left-[22px] w-[2px] h-[40px] bg-[#976DD0] mt-[50px]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works - Buyer Journey Section */}
          <section className="py-14 lg:py-16 bg-[#f9f9f9]">
            <div className="container-fluid 2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px] mx-auto">
              <div className="grid grid-cols-12 gap-8">
                {/* Left: Steps */}
                <div className="col-span-12 md:col-span-6">
                  <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] mb-[40px]">
                    How It Works - For Buyers
                    <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                  </h2>

                  <div className="space-y-6">
                    {[
                      { step: 1, title: "Browse Directory", desc: "Explore thousands of properties in our comprehensive directory" },
                      { step: 2, title: "Create Opportunity", desc: "Submit your interest and connect with property owners" },
                      { step: 3, title: "Plan Transaction", desc: "Use our tools to negotiate and finalize the deal" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex">
                        <div className="w-[50px] h-[50px] rounded-full bg-[#976DD0] text-white flex items-center justify-center font-bold text-[20px] flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="ml-6">
                          <h4 className="text-[#47525E] font-[600] text-[16px] mb-2">{item.title}</h4>
                          <p className="text-[#47525E] text-[14px]">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Value Proposition */}
                <div className="col-span-12 md:col-span-6 flex flex-col justify-center">
                  <div className="bg-white p-8 rounded-[12px] shadow-md">
                    <h3 className="text-[#47525E] font-[600] text-[20px] mb-4">
                      Why Choose Bookaroo?
                    </h3>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <span className="text-[#976DD0] font-bold mr-3">✓</span>
                        <span className="text-[#47525E] text-[14px]">Access exclusive off-market properties</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#976DD0] font-bold mr-3">✓</span>
                        <span className="text-[#47525E] text-[14px]">Connect directly with property owners</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#976DD0] font-bold mr-3">✓</span>
                        <span className="text-[#47525E] text-[14px]">Transparent and secure transactions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#976DD0] font-bold mr-3">✓</span>
                        <span className="text-[#47525E] text-[14px]">Save time with integrated tools</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => {
                        if (user.loggedIn) {
                          navigate("/serach-alert");
                        } else {
                          setloginModal(true);
                        }
                      }}
                      className="w-full bg-[#976DD0] text-white py-3 rounded-[50px] font-[600] hover:bg-[#7a5ba6] transition"
                    >
                      {user.loggedIn ? "Start Browsing" : "Sign Up to Browse"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid 2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px] mx-auto">
              <div className="grid grid-cols-12">
                <div className="col-span-12 mb-[40px]">
                  <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600]">
                    What Our Users Say
                    <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {[
                  {
                    name: "Marie Dubois",
                    quote: "Bookaroo made selling my property incredibly easy. I found the perfect buyer in just 3 weeks!",
                    role: "Property Seller",
                  },
                  {
                    name: "Jean Martin",
                    quote: "The off-market feature gave me access to properties I couldn't find anywhere else. Highly recommend!",
                    role: "Home Buyer",
                  },
                  {
                    name: "Sophie Lambert",
                    quote: "Best platform for real estate professionals. The transaction tools saved us so much time and confusion.",
                    role: "Real Estate Agent",
                  },
                ].map((testimonial, idx) => (
                  <div key={idx} className="col-span-12 md:col-span-4 bg-[#f9f9f9] p-6 rounded-[12px]">
                    <div className="flex items-center mb-4">
                      <div className="w-[50px] h-[50px] rounded-full bg-[#976DD0] text-white flex items-center justify-center font-bold">
                        {testimonial.name[0]}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-[#47525E] font-[600] text-[14px]">{testimonial.name}</h4>
                        <p className="text-[#7BBEB8] text-[12px]">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-[#47525E] text-[14px] italic">"{testimonial.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-14 lg:py-16 bg-[#f9f9f9]">
            <div className="container-fluid 2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px] mx-auto">
              <div className="grid grid-cols-12">
                <div className="col-span-12 mb-[40px]">
                  <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600]">
                    Frequently Asked Questions
                    <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <div className="space-y-3">
                    {[
                      {
                        question: "How do I list my property on Bookaroo?",
                        answer: "Simply create an account, click 'List my property' and fill in your property details. You can add photos, pricing, and specify if you're open to off-market proposals.",
                      },
                      {
                        question: "Is it really free to list?",
                        answer: "Yes! Listing your property is completely free. We only charge when you complete a transaction, and our fees are transparent.",
                      },
                      {
                        question: "What is the Off-Market feature?",
                        answer: "Off-Market allows property owners to test buyer interest before officially listing. Potential buyers can make offers, and you can negotiate privately.",
                      },
                      {
                        question: "How safe are transactions on Bookaroo?",
                        answer: "We use industry-standard encryption and secure payment processing. Our transaction tools include escrow options and legal document management.",
                      },
                      {
                        question: "Can I use Bookaroo as a buyer without listing?",
                        answer: "Absolutely! You can browse our directory, create opportunities, and connect with sellers without ever listing a property.",
                      },
                    ].map((faq, idx) => (
                      <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {properties?.length > 0 && (
            <section className="py-14 lg:py-16 bg-white">
              <div className="container-fluid  2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px]">
                <div className="grid grid-cols-12 ">
                  <div className="col-span-12  mb-[40px] flex items-center justify-between">
                    <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
                      Results of my last search
                      <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                    </h2>
                    <p
                      onClick={() => navigate("/serach-alert")}
                      className="underline font-bold text-[#47525E]  text-[18px] cursor-pointer"
                    >
                      See my saved searches
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-12 ">
                  <div className="col-span-12 mb-5  ">
                    <h4 className="text-[#47525E] font-bold text-[17px]">
                      {lastSearchObj?.search || "Search name"}
                    </h4>
                    <p className="text-[#47525E] capitalize">
                      {`${lastSearchObj?.propertyType}, ${lastSearchObj?.type ? `${lastSearchObj?.type},` : ""
                        } ${lastSearchObj?.search}`}
                    </p>
                    <h5 className="text-[#383A3D] font-bold mt-3 text-[17px]">
                      {properties?.length} new result
                      {properties?.length === 1 ? "" : "s"}
                    </h5>
                  </div>
                </div>
                <div className="grid grid-cols-12 md:gap-10 gap-0 ">
                  {properties?.slice(0, 4)?.map((item, index) => {
                    let price = Number(item?.price) || 0;
                    let sur = Number(item?.surface) || 0;
                    let perSqr;
                    if (sur > 0) {
                      perSqr = price / sur;
                    }
                    return (
                      <div
                        key={index}
                        className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 property_list"
                      >
                        <PropertyCardHome
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
                        {/* <ImageSlider images={item?.images} />
                        <div className="relative">
                          <div
                            onClick={() => navigateToDetail(item)}
                            className="p-3 relative cursor-pointer border-b "
                          >
                            {item?.propertyTitle && (
                              <h2 className="text-[#47525E] text-[16px] font-bold mt-2 capitalize ellipses mb-1">
                                {item?.propertyTitle}
                              </h2>
                            )}
                            {item?.address && (
                              <p className="text-[#47525E] text-[14px] ellipses">
                                {item?.address}
                              </p>
                            )}
                            <ul className="flex items-center mt-5">
                              {+item?.surface > 0 && (
                                <li className="flex items-center me-5">
                                  <img
                                    src="assets/img/prop/home.png"
                                    alt=""
                                    className="w-[17px] h-[17px] me-1"
                                  />
                                  <p className="text-[#47525E] text-[14px]">
                                    {item?.surface}
                                  </p>
                                </li>
                              )}
                              {+item?.rooms > 0 && (
                                <li className="flex items-center me-5">
                                  <img
                                    src="assets/img/prop/bed.png"
                                    alt=""
                                    className="w-[15px]  me-1"
                                  />
                                  <p className="text-[#47525E] text-[14px]">
                                    {item?.rooms}
                                  </p>
                                </li>
                              )}
                              {+item?.toilets > 0 && (
                                <li className="flex items-center">
                                  <img
                                    src="assets/img/prop/tub.png"
                                    alt=""
                                    className="w-[17px] h-[17px] me-1"
                                  />
                                  <p className="text-[#47525E] text-[14px]">
                                    {item?.toilets}
                                  </p>
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="mb-0 p-3 ">
                            <p className="text-[#6D6E6D] text-[12px] font-[600]">For Sale</p>
                            {item?.propertyType == "offmarket" ? (
                              <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                                Off-Market
                                {item?.propertyType === "offmarket" &&
                                  item?.proposal && (
                                    <div className=" flex items-center mb-3">
                                      <div className="bg-[#976DD0] mx-auto py-[6px] ps-2 rounded-xl text-[13px] pe-4 text-white  font-[600] relative">
                                        <p>{`#Opento${item?.proposal}proposals`}</p>
                                      </div>
                                    </div>
                                  )}
                              </h5>
                            ) : item?.propertyType == "rent" &&
                              item?.propertyMonthlyCharges ? (
                              <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                                {item?.propertyMonthlyCharges} €
                                <span className="text-[#47525E] text-[13px] ">
                                  {" "}
                                  / month
                                </span>
                              </h5>
                            ) : (
                              <>
                                {item?.price ? (
                                  <h5 className="text-[#6D6E6D] text-[17px] font-bold flex justify-between items-center">
                                    {item?.price} €
                                    {perSqr > 0 && (
                                      <span className="text-[#47525E] text-[13px] ms-2 ">
                                        {perSqr?.toFixed(2)} {" €/sqm"}
                                      </span>
                                    )}
                                  </h5>
                                ) : null}
                              </>
                            )}
                          </div>
                          {user?._id === item?.addedBy && (
                            <div
                              ref={(el) => (dropdownRefs.current[index] = el)}
                              className="absolute top-2 right-2"
                            >
                              <button
                                onClick={() => toggleDropdown(index)}
                                className="focus:outline-none"
                              >
                                <img
                                  src="assets/img/dots.png"
                                  alt="Options"
                                  className="w-[20px] h-[20px]"
                                />
                              </button>
                              {dropdownIndex === index && (
                                <div className="absolute bg-white  rounded-[7px] shadow-lg mt-1 -left-[70px]">
                                  <ul>
                                    <li
                                      onClick={() => editItem(item)}
                                      className="p-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center"
                                    >
                                      {" "}
                                      <FiEdit className="me-2 text-[15px]" />
                                      <span className="text-[14px] text-[#333]">
                                        Edit
                                      </span>
                                    </li>
                                    <li
                                      onClick={() => deleteItem(item)}
                                      className="p-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center"
                                    >
                                      {" "}
                                      <AiOutlineDelete className="me-2" />
                                      <span className="text-[14px] text-[#333]">
                                        Delete
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="bg-black p-3">
                          <p className="text-white text-center text-[14px] mb-1">
                            Property Attractivity
                          </p>
                          <ul className="flex items-center mt-3 justify-center">
                            <li className="flex items-center mx-5">
                              <img
                                src="assets/img/prop/heart-w.png"
                                alt=""
                                className="w-[17px] h-[17px] me-[6px] "
                              />
                              <p className="text-white  lg:text-[16px] text-[14px]">
                                {item?.likeCount || 0}
                              </p>
                            </li>
                            <li className="flex items-center mx-5">
                              <img
                                src="assets/img/prop/eye.png"
                                alt=""
                                className="w-[17px] h-[17px] me-[6px]"
                              />
                              <p className="text-white  lg:text-[16px] text-[14px] ">
                                3K
                              </p>
                            </li>
                            <li className="flex items-center mx-5">
                              <img
                                src="assets/img/prop/share.png"
                                alt=""
                                className="w-[17px] h-[17px] me-[6px]"
                              />
                              <p className="text-white  lg:text-[16px] text-[14px]">
                                2
                              </p>
                            </li>
                            <li className="flex items-center mx-5">
                              <img
                                src="assets/img/prop/user.png"
                                alt=""
                                className="w-[17px] h-[17px] me-[6px]"
                              />
                              <p className="text-white  lg:text-[16px] text-[14px]">
                                {item?.followerCount || 0}
                              </p>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <ul className="flex items-center justify-center p-3">
                            <li className="mx-3">
                              <a onClick={() => isFollow(item)}>
                                <img
                                  src={`assets/img/${item?.followunfollows_details
                                    ? "fill-house"
                                    : "lined-house"
                                    }.svg`}
                                  alt=""
                                  className="w-[25px]"
                                />
                              </a>
                            </li>
                            <li className="mx-3">
                              <a
                                onClick={() =>
                                  item?.favourite_details
                                    ? disLiked(item)
                                    : isLiked(item)
                                }
                              >
                                <img
                                  src={`assets/img/${item?.favourite_details
                                    ? "fill-heart"
                                    : "lined-heart"
                                    }.svg`}
                                  alt=""
                                  className="w-[25px]"
                                />
                              </a>
                            </li>
                          </ul>
                        </div> */}
                      </div>
                    );
                  })}
                </div>
                {/* {properties?.length > 3 && ( */}
                <div className="grid grid-cols-12 ">
                  <div className="col-span-12 flex items-center justify-center">
                    <p
                      onClick={() => seeAllLastSearchRecords()}
                      className="cursor-pointer text-[ #47525E] border border-[#976DD0] rounded-[50px] py-[8px] font-bold px-[45px]  text-center mt-10 mx-auto inline-block hover:bg-[#976DD0] hover:text-white transition delay duration-300 ease-in-out"
                    >
                      See all Results
                    </p>
                  </div>
                </div>
                {/* )} */}
              </div>
            </section>
          )}

          {/* <button onClick={() => setIsOpen(true)} className="hidden">Open dialog</button> */}
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/50 z-[9] flex w-screen items-center justify-center p-4">
              <DialogPanel className="max-w-lg rounded-[12px] space-y-4 text-center border bg-white p-12">
                <DialogTitle className="xl:text-[26px] lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000] font-semibold text-center">Upgrade your plan</DialogTitle>
                <Description></Description>
                <p>This feature is not available on your current plan. Please upgrade your plan to access it.</p>
                <div className="flex gap-2 justify-center items-center ">
                  <button onClick={() => setIsOpen(false)} className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">Cancel</button>
                  <button onClick={() => navigate("/plan")} className="bg-[#986AB8] rounded-full px-8 py-2 text-white text-[14px] flex items-center justify-center">Upgrade plan</button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
          <BlogSection />
          <QuickSearch />

          {/* ===== FOOTER ===== */}
          <footer className="bg-[#2D1B4E] text-white pt-14 pb-6">
            <div className="container-fluid 2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px] mx-auto">
              <div className="grid grid-cols-12 gap-8 mb-10">

                {/* Brand Column */}
                <div className="col-span-12 md:col-span-4">
                  <h3 className="text-[22px] font-bold mb-3">
                    <span className="text-[#976DD0]">Book</span>aroo
                  </h3>
                  <p className="text-[#C4B5D9] text-[14px] leading-relaxed max-w-[280px] mb-5">
                    The LinkedIn of Real Estate. Connect buyers, sellers and agents in one transparent marketplace.
                  </p>
                  <div className="flex gap-3">
                    <a href="#" className="w-[36px] h-[36px] rounded-full bg-[#976DD0] flex items-center justify-center hover:bg-[#7a5ba6] transition text-[14px]">f</a>
                    <a href="#" className="w-[36px] h-[36px] rounded-full bg-[#976DD0] flex items-center justify-center hover:bg-[#7a5ba6] transition text-[14px]">in</a>
                    <a href="#" className="w-[36px] h-[36px] rounded-full bg-[#976DD0] flex items-center justify-center hover:bg-[#7a5ba6] transition text-[14px]">tw</a>
                  </div>
                </div>

                {/* Platform Links */}
                <div className="col-span-6 md:col-span-2">
                  <h4 className="text-[15px] font-[600] mb-4 text-[#976DD0]">Platform</h4>
                  <ul className="space-y-2">
                    {[
                      { label: "Browse Properties", path: "/properties" },
                      { label: "Off-Market", path: "/" },
                      { label: "List My Property", path: "/property1" },
                      { label: "Renter File", path: "/renter-file" },
                      { label: "Buyer File", path: "/buyer-file" },
                    ].map((link, i) => (
                      <li key={i}>
                        <a
                          onClick={() => navigate(link.path)}
                          className="text-[#C4B5D9] text-[13px] hover:text-white cursor-pointer transition"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Links */}
                <div className="col-span-6 md:col-span-2">
                  <h4 className="text-[15px] font-[600] mb-4 text-[#976DD0]">Company</h4>
                  <ul className="space-y-2">
                    {[
                      { label: "About Bookaroo", path: "/" },
                      { label: "Plans & Pricing", path: "/plan" },
                      { label: "Market Insights", path: "/market-insight" },
                      { label: "Blog", path: "/blogs" },
                      { label: "Help Center", path: "/help" },
                    ].map((link, i) => (
                      <li key={i}>
                        <a
                          onClick={() => navigate(link.path)}
                          className="text-[#C4B5D9] text-[13px] hover:text-white cursor-pointer transition"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact / Newsletter */}
                <div className="col-span-12 md:col-span-4">
                  <h4 className="text-[15px] font-[600] mb-4 text-[#976DD0]">Stay Informed</h4>
                  <p className="text-[#C4B5D9] text-[13px] mb-4">
                    Get the latest real estate news and Bookaroo updates in your inbox.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-1 bg-[#3D2A60] border border-[#5A4080] rounded-[50px] px-4 py-2 text-white text-[13px] placeholder-[#8E7AB0] outline-none focus:border-[#976DD0]"
                    />
                    <button className="bg-[#976DD0] hover:bg-[#7a5ba6] transition text-white rounded-[50px] px-4 py-2 text-[13px] font-[600] whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>
                  <p className="text-[#8E7AB0] text-[12px] mt-3">
                    📍 France &nbsp;|&nbsp; 📧 contact@bookaroo.fr
                  </p>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-[#3D2A60] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="text-[#8E7AB0] text-[12px]">
                  © {new Date().getFullYear()} Bookaroo — All rights reserved.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-[#8E7AB0] text-[12px] hover:text-white transition">Privacy Policy</a>
                  <a href="#" className="text-[#8E7AB0] text-[12px] hover:text-white transition">Terms of Use</a>
                  <a href="#" className="text-[#8E7AB0] text-[12px] hover:text-white transition">Cookie Settings</a>
                </div>
              </div>
            </div>
          </footer>
          {/* ===== END FOOTER ===== */}

        </div>
      </PageLayout>
    </>
  );
};

export default Home;
