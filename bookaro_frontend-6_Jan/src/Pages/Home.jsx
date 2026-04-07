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
          <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid  2xl:ps-[120px] xl:ps-[90px] md:ps-[40px] ps-[20px]">
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  mb-[40px]">
                  <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
                    Pourquoi Bookaroo
                    <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                  </h2>
                  <p className="text-[#969FAA] max-w-2xl mt-3">
                    Faire du temps un allié pour acheteur et vendeur dans le
                    cadre d'un projet immobilier et simplifier le processus de
                    vente d'un bien de particulier à particulier.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  ">
                  <div className="flex gap-10 items-center xl:flex-row flex-col">
                    <div className="xl:w-[20%] w-[100%] ps-0">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        Acheteurs
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        Anticipez votre projet immobilier
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x] xl:max-w-[200px] w-full">
                        Parce que le temps ne devrait plus être un facteur de
                        stress dans votre projet immobilier mais un allié.
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        Voir les biens
                      </button>
                    </div>
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tl-[400px] md:rounded-bl-[400px] rounded-tl-[100px] rounded-bl-[100px]  xl:pl-[150px] py-[100px] md:pl-[80px] pl-[50px] pe-[40px] md:h-[500px] h-[100%] ">
                      <p className="text-[#47525E] mb-10 font-[600] ms-8">
                        Votre nouvelle plateforme fait entrer le marché de
                        l'immobilier dans un nouveau paradigme : celui de
                        l'anticipation
                      </p>
                      <ul className=" flex flex-wrap ">
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/calendar.png"
                            className="w-[22px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className=" text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Anticiper votre projet d'achat
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] max-w-[300px] ">
                              N'achetez plus un bien simplement parce qu'il est
                              disponible et correspond plus ou moins à vos
                              critères. En anticipant votre projet, vous pourrez
                              trouver le biens de vos rêves dans notre annuaire
                              exhaustif.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/arrow.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className=" text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Plus de flexibilité dans la transaction
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] max-w-[300px] ">
                              Anticiper vous permet de négocier avec le
                              propriétaire afin de définir une date et les
                              conditions de la transaction dans les mois ou
                              années à venir.
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/hand.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className=" text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Préparer sereinement votre financement
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] max-w-[300px] ">
                              Vous avez maintenant plusieurs mois ou années pour
                              travailler avec votre banque, pour épargner afin
                              de sécuriser l'obtention de votre financement à la
                              date fixée avec le vendeur.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid    md:pe-[30px] xl:pe-[40px] pe-[20px]">
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  ">
                  <div className="flex gap-10 items-center xl:flex-row flex-col-reverse">
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tr-[400px] md:rounded-br-[400px] rounded-tr-[100px] rounded-br-[100px]  xl:pl-[60px] py-[40px] pl-[50px] pe-[40px] md:md:h-[500px] h-[100%] h-[100%]">
                      <p className="text-[#47525E] mb-10 font-[600] xl:max-w-[100%] max-w-[600px]">
                        Votre plateforme réinvente et simplifie le cycle de la
                        possession puis de la mise en vente d'un bien immobilier
                      </p>
                      <div className="flex ">
                        <ul className=" flex flex-col lg:hidden">
                          <li className="flex items-start h-1/5 w-[22px]  pe-2 after:block after:h-full after:w-[7px] after:content-[''] after:bg-[#DBD7E7] after:absolute after:-bottom-[20px] relative after:left-1/2 after:-translate-x-1/2 after:z-[0]  ">
                            <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                              <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                            </p>
                          </li>
                          <li className="flex items-start h-1/5 w-[22px]  pe-2 after:block after:h-full after:w-[7px] after:content-[''] after:bg-[#DBD7E7] after:absolute after:-bottom-[20px] relative after:left-1/2 after:-translate-x-1/2 after:z-[0]   ">
                            <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                              <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                            </p>
                          </li>
                          <li className="flex items-start h-1/5 w-[22px]  pe-2 after:block after:h-full after:w-[7px] after:content-[''] after:bg-[#DBD7E7] after:absolute after:-bottom-[20px] relative after:left-1/2 after:-translate-x-1/2 after:z-[0]   ">
                            <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                              <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                            </p>
                          </li>
                          <li className="flex items-start h-1/5 w-[22px]  pe-2 after:block after:h-full after:w-[7px] after:content-[''] after:bg-[#DBD7E7] after:absolute after:-bottom-[20px] relative after:left-1/2 after:-translate-x-1/2 after:z-[0]   ">
                            <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                              <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                            </p>
                          </li>
                          <li className="flex items-start h-1/5 w-[22px]  pe-2  relative   ">
                            <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                              <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                            </p>
                          </li>
                        </ul>
                        <div className="lg:flex-col flex flex-row ">
                          <ul className=" sm:flex flex-wrap hidden ">
                            <li className="flex lg:justify-start justify-center items-start lg:w-1/5 w-full lg:my-4 my-0 pe-2">
                              <img
                                src="assets/img/icons/home_one.png"
                                className="w-[30px] lg:mt-[3px] mt-0 lg:me-3 me-0"
                              />
                            </li>
                            <li className="flex lg:justify-start justify-center items-start lg:w-1/5 w-full lg:my-4 my-0 pe-2">
                              <img
                                src="assets/img/icons/home_two.png"
                                className="w-[30px] lg:mt-[3px] mt-0 lg:me-3 me-0"
                              />
                            </li>
                            <li className="flex lg:justify-start justify-center items-start lg:w-1/5 w-full lg:my-4 my-0 pe-2">
                              <img
                                src="assets/img/icons/home_three.png"
                                className="w-[30px] lg:mt-[3px] mt-0 lg:me-3 me-0"
                              />
                            </li>
                            <li className="flex lg:justify-start justify-center items-start lg:w-1/5 w-full lg:my-4 my-0 pe-2">
                              <img
                                src="assets/img/icons/home_four.png"
                                className="w-[30px] lg:mt-[3px] mt-0 lg:me-3 me-0"
                              />
                            </li>
                            <li className="flex lg:justify-start justify-center items-start lg:w-1/5 w-full lg:my-4 my-0 pe-2">
                              <img
                                src="assets/img/icons/hand.png"
                                className="w-[30px] lg:mt-[3px] mt-0 lg:me-3 me-0"
                              />
                            </li>
                          </ul>
                          <ul className=" lg:flex flex-wrap  hidden">
                            <li className="flex items-start md:w-1/5 w-full my-4 pe-2 after:block after:h-[7px] after:w-full after:content-[''] after:bg-[#DBD7E7] after:absolute after:top-1/2 relative after:left-[15px] after:-translate-y-1/2 after:z-[0]  ">
                              <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                                <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                              </p>
                            </li>
                            <li className="flex items-start md:w-1/5 w-full my-4 pe-2 after:block after:h-[7px] after:w-full after:content-[''] after:bg-[#DBD7E7] after:absolute after:top-1/2 relative after:left-[15px] after:-translate-y-1/2 after:z-[0] ">
                              <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                                <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                              </p>
                            </li>
                            <li className="flex items-start md:w-1/5 w-full my-4 pe-2 after:block after:h-[7px] after:w-full after:content-[''] after:bg-[#DBD7E7] after:absolute after:top-1/2 relative after:left-[15px] after:-translate-y-1/2 after:z-[0] ">
                              <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                                <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                              </p>
                            </li>
                            <li className="flex items-start md:w-1/5 w-full my-4 pe-2 after:block after:h-[7px] after:w-full after:content-[''] after:bg-[#DBD7E7] after:absolute after:top-1/2 relative after:left-[15px] after:-translate-y-1/2 after:z-[0] ">
                              <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                                <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                              </p>
                            </li>
                            <li className="flex items-start md:w-1/5 w-full my-4 pe-2  relative  ">
                              <p className=" bg-[#D0C3E1] shrink-0 w-[22px] h-[22px] rounded-[50px] flex items-center justify-center z-[1]">
                                <span className="rounded-[50px] flex items-center justify-center  p-1 w-[12px] bg-[#976DD0] h-[12px] block"></span>
                              </p>
                            </li>
                          </ul>
                          <ul className=" flex flex-wrap sm:ms-0 ms-3">
                            <li className="flex items-start lg:w-1/5 w-full lg:h-unset h-1/5 lg:my-4 my-0 lg:mb-0 mb-2 xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  Publiez votre bien sur notre annuaire
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  Créez le profil Bookaroo de votre bien
                                  immobilier pour accroitre sa visibilité et
                                  générer des leads acheteurs.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start lg:w-1/5 w-full lg:h-unset h-1/5 lg:my-4 lg:mb-0 mb-2 my-0 xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  Testez votre bien avec le Off-Market
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  Vendez votre bien immobilier au plus offrant
                                  et sans les conraintes du marché public.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start lg:w-1/5 w-full lg:h-unset h-1/5 lg:my-4 lg:mb-0 mb-2 my-0 xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  Publiez votre bien sur le marché public
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  Publiez d'un simple clic votre bien sur de
                                  nombreuses plateformes d'annonces
                                  immobilières.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start lg:w-1/5 w-full lg:my-4 lg:h-unset h-1/5 lg:mb-0 mb-2 my-0 xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  Réalisez la vente grâce à notre outil
                                  transactionnel
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  Vendez votre bien immobilier seul et en toute
                                  simplicité ou accompagné mais sans commission
                                  onéreuse.
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start lg:w-1/5 w-full lg:my-4 lg:h-unset h-1/5 my-0 lg:mb-0  xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  Transférez la propriété du profil Bookaroo du
                                  bien
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  Transferez la propriété du profil Bookaroo à
                                  son nouveau propriétaire après la vente.
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="xl:w-[20%] w-[100%] 2xl:ps-[70px] xl:ps-[40px] lg:ps-[40px] ps-[40px] ">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        Vendeurs
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        Vendez votre bien au meilleur prix sans commissions.
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x]  xl:max-w-[200px] w-full">
                        Parce qu'avec notre plateforme vous disposez de
                        multiples possibilités pour vendre votre bien par vous
                        même et sans complexité.
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        Mettre en vente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid  2xl:ps-[120px] xl:ps-[90px] md:ps-[40px] ps-[20px]">
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  mb-[40px]">
                  <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
                    Pourquoi Bookaroo est indispensable pour les acheteurs et
                    les vendeurs
                    <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                  </h2>
                  <p className="text-[#969FAA] max-w-2xl mt-3">
                    Une plateforme unique qui offre une multitude d'outils et de
                    services pour aider les particuliers à réaliser sereinement
                    leur transaction immobilière.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  ">
                  <div className="flex gap-10 items-center xl:flex-row flex-col">
                    <div className="xl:w-[20%] w-[100%]">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        Un large choix
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        Annuaire exhaustif des biens immobiliers
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x]  w-full">
                        Nous avons vocation à référencer 100% des biens
                        immobiliers existant pour un marché donné.
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        Voir les biens
                      </button>
                    </div>
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tl-[400px] md:rounded-bl-[400px] rounded-tl-[100px] rounded-bl-[100px]  xl:pl-[150px] py-[60px] md:pl-[80px] pl-[50px] pe-[40px] md:h-[500px] h-[100%] ">
                      <p className="text-[#47525E] mb-10 font-[600] ms-8">
                        Bookaroo propose la base de données de biens immobiliers
                        la plus complète du marché
                      </p>
                      <ul className=" flex flex-wrap ">
                        <li className="flex items-start md:w-1/2 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/home-c.png"
                            className="w-[22px] mt-[3px] me-3 shrink-0"
                          />
                          <div className="">
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Profil social d'un bien
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full ">
                              Le profil d'un bien a été pensé pour générer des
                              interactions entre le propriétaire et les
                              acheteurs potentiels (messages directs, like,
                              follow).
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start md:w-1/2 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/infinity.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Une large sélection de biens
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              En anticipant votre projet, vous pourrez choisir
                              le bien qui correspond à l'ensemble de vos
                              critères dans notre large base de données de
                              biens.
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start md:w-1/2 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/wallet.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Information accrue
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              Le contenu partagé sur le profil du bien contribue
                              à accroitre sa valeur (travaux réalisés, budget
                              mensuel, attractivité, rating social, revenus
                              générés…).
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start md:w-1/2 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/cart.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Information accrue
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              Le contenu partagé sur le profil du bien contribue
                              à accroitre sa valeur (travaux réalisés, budget
                              mensuel, attractivité, rating social, revenus
                              générés…).
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid md:pe-[30px] xl:pe-[40px] pe-[20px]">
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  ">
                  <div className="flex gap-10 items-center xl:flex-row flex-col-reverse">
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tr-[400px] md:rounded-br-[400px] rounded-tr-[100px] rounded-br-[100px]  xl:pl-[60px] py-[60px] pl-[50px] pe-[40px] lg:h-[500px] h-[100%]">
                      <p className="text-[#47525E] mb-10 font-[600] xl:max-w-[100%] max-w-[600px]">
                        Un outil de pilotage de votre transaction immobilière
                        depuis la publication jusqu'à la signature de la vente
                      </p>
                      <div className="flex lg:gap-4 gap-0 lg:flex-nowrap flex-wrap">
                        <div className="md:w-1/3 w-full">
                          <p className="text-[#47525E] text-[14px] font-[600] mb-4">
                            Vendez seul, mais bien accompagné grâce à notre
                            plateforme qui intègre tout ce dont vous avez besoin
                            pour travailler comme un pro !
                          </p>
                          <ul>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Contenu éducatif et formation à la vente{" "}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Parcours de vente orchestré
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Partage automatique de documents
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Plannification de visites
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Messagerie interne{" "}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Critère de selection des candidats{" "}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Multi-diffusion de votre annonce
                            </li>
                          </ul>
                        </div>
                        <div className="md:w-1/3 w-full">
                          <p className="text-[#47525E] text-[14px] font-[600] mb-4">
                            Vous voulez vendre sans payer une commission
                            d'intermédiation tout en bébéficiant des mêmes
                            services ? Optez pour nos services à la carte.{" "}
                          </p>
                          <ul>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Estimation gratuite de la valeur de votre bien
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>{" "}
                              Rédaction de vos annonces
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Prises de vue professionnelles de votre bien
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Analyse de la solidité financière des candidats
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Réalisation des visites{" "}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Constitution du dossier legal vendeur{" "}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              Réalisation de l'état des lieux
                            </li>
                          </ul>
                        </div>
                        <div className="md:w-1/3 w-full">
                          <img
                            src="assets/img/image_card.png"
                            className="xl:max-w-[300px] lg:max-w-[200px] max-w-[200px] "
                          />
                        </div>
                      </div>
                    </div>
                    <div className="xl:w-[20%] w-[100%] 2xl:ps-[70px] xl:ps-[40px] lg:ps-[40px] ps-[40px] ">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        Transaction simplifiée
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        Outil de pilotage de transaction immobilière
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x]  w-full">
                        Parce que vendre son bien immobilier seul ne devrait pas
                        être un parcours du combattant générateur de stress.
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        En savoir plus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid  2xl:ps-[120px] xl:ps-[90px] md:ps-[70px] ps-[40px]">
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  ">
                  <div className="flex gap-10 items-center xl:flex-row flex-col">
                    <div className="xl:w-[20%] w-[100%]">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        Définir le prix juste
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        Historique des transactions immobilières
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x] w-full">
                        Consulter l'historiques des transactions immobilières
                        pour définir la meilleure stratégie
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        Parcourir les transactions
                      </button>
                    </div>
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tl-[400px] md:rounded-bl-[400px] rounded-tl-[100px] rounded-bl-[100px]  xl:pl-[150px] py-[60px] md:pl-[80px] pl-[50px] pe-[40px] md:h-[500px] h-[100%]">
                      <p className="text-[#47525E] mb-10 font-[600] ms-8 ">
                        Retrouvez le prix de toutes les transactions
                        immobilières des 15 dernières années en France
                      </p>
                      <ul className=" flex flex-wrap ">
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/pin.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Définir votre prix de vente
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full ">
                              Vous souhaitez mettre en vente votre bien
                              immobilier au bon prix ? N'hésitez pas à consulter
                              l'historique des transactions aux caractéristiques
                              similaires.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/spiral.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Acheter au juste prix
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              En consultant l'historiques des transactions
                              similaires vous pourrez mettre en perspective le
                              prix de vente proposé par le vendeur.
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/hand.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Recherches multi-critères
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              Parcourez les transactions historiques en filtrant
                              selon l'année de la transaction, la localisation,
                              la taille et le type de bien, le nombre de pièces
                              et le prix de vente.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-14 lg:py-16 bg-white">
            <div className="container-fluid md:pe-[30px] xl:pe-[40px] pe-[20px]">
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  ">
                  <div className="flex gap-10 items-center xl:flex-row flex-col-reverse">
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tr-[400px] md:rounded-br-[400px] rounded-tr-[100px] rounded-br-[100px]  xl:pl-[60px] py-[60px] pl-[50px] pe-[40px] md:h-[500px] h-[100%]">
                      <p className="text-[#47525E] mb-10 font-[600] xl:max-w-[100%] max-w-[600px]">
                        Votre plateforme réinvente et simplifie le cycle de la
                        possession puis de la mise en vente d'un bien immobilier
                      </p>
                      <ul className=" flex flex-wrap ">
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/pin.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Agence immobilières
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full ">
                              Faites-vous accompagner par une agence locale pour
                              la vente de votre bien immobilier.
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/spiral.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Chasseurs d'appartement
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              Gagnez du temps en confiant la recherche de votre
                              bien à un professionnel de la chasse immobilière.
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/hand.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              Courtier
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              Grâce à nos partenaires courtier, trouver les
                              meilleurs taux pour financer votre projet
                              immobilier.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="xl:w-[20%] w-[100%] 2xl:ps-[70px] xl:ps-[40px] lg:ps-[40px] ps-[40px] ">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        Se faire accompagner
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        Annuaire des professionnels de l'immo
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x]  w-full">
                        Retrouvez des partenaires de confiance pour vous
                        accompagner dans votre projet immobilier.
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        Trouver un professionnel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="bg-[#976DD0] py-14 lg:py-16">
            <div className="container-fluid  2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px]">
              <h2 className="text-white lg:text-[23px] text-[20px] font-[600] mx-auto  max-w-[600px] w-full">
                Pourquoi devrais-je référencer mon bien sur Bookaroo ?
                <span className="bg-white w-[35px] h-[6px] rounded-[10px] block "></span>
              </h2>
              <div className="grid grid-cols-12 md:gap-10 gap-0 mt-20">
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/stars.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">Gagner en visibilité</h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      En étant référencé sur Bookaroo, votre bien immobilier
                      sera reconnu et répertorié par les algorithmes des moteurs
                      de recherche. Ainsi votre bien sera plus facilement
                      trouvable par les personnes recherchant un bien
                      correspondnat au votre
                    </p>
                  </div>
                </div>
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/user.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">Générer des leads</h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      A travers le profil Bookaroo de votre bien, vous recevrez
                      de nombreuses sollicitations de la part de personne
                      interessées par votre bien. Vous constituerez ainsi une
                      base d'acheteurs potentiels pour une vente future.
                    </p>
                  </div>
                </div>
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/dollar-bill.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">
                      Accroitre la valeur de votre bien
                    </h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      Les informations que vous partagerez sur le profil de
                      votre bien ainsi que les données de traffic sur le profil
                      (like, visites, follower, messages) vont accroitre la
                      désirabilité de votre bien et donc sa valeur.
                    </p>
                  </div>
                </div>
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/right-arrow.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">
                      Mise en vente/location simplifiée
                    </h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      En créant le profil Bookaroo de votre bien immobilier vous
                      pourrez par la suite publier en un clic une annonce d
                      emise en vente ou location sur des centaines de
                      plateformes de petites annonces.
                    </p>
                  </div>
                </div>
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/mask.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">Tester le Off-market</h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      Avoir un profil Bookaroo pour votre bien vous donne la
                      possibilité de tester le Off-Market et ainsi recevoir des
                      propositions spontanées d'achat de votre bien.
                    </p>
                  </div>
                </div>
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/fast-forward.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">Vendre plus vite</h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      Un bien référencé sur Bookaroo se vend plus vite car sa
                      présence sur la plateforme à permis de générer une demande
                      continue dans le temps et non satisfaite.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-14">
                <p className="text-white text-center font-[600]">
                  C'est 100% gratuit et ça le restera !
                </p>
                <button className="bg-[#343F4B] text-white px-4 py-2 rounded-[50px] mx-auto flex items-center justify-center mt-3">
                  Référencer mon bien
                </button>
              </div>
            </div>
          </section>

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
        </div>
      </PageLayout>
    </>
  );
};

export default Home;
