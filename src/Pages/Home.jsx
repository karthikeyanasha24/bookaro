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
import { enableGuestMode, disableDebugMockUser } from "../methods/guestMode";
import { login_success, logout } from "../actions/user";
import loader from "../methods/loader";
import addressModel from "../models/address.model";
import {
  objToQueryParam,
  queryParamToObj,
  removePropData,
} from "../models/string.model";
import BlogSection from "./Blogs/BlogSection";
import PropertyCardHome from "./Property/PropertyCardHome";
import UpgradePlan from "../components/common/Modal/UpgradePlan";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
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
    offMarket: activePlan?.activePlan?.[0]?.offMarket ? true : false,
    offMarketUsage: false,
    apartment: false,
    castle: false,
    house: false,
    building: false,
    farm: false,
  });
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
    if (!more && !form.search) return setErrors(t("validation.setSearchParams"));
    if (form.propertyType === "sale" || form.propertyType === "rent") {
      if (form.maxPrice) {
        if (Number(form.minPrice) >= Number(form.maxPrice))
          return setErrors(t("validation.correctRange"));
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
      title: t("modals.confirmTitle"),
      text: t("home.deletePropertyConfirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: t("buttons.yes"),
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
    { labelKey: "home.tabs.offMarket", value: true },
    { labelKey: "home.tabs.rentNow", value: "rent" },
    { labelKey: "home.tabs.buyNow", value: "sale" },
    { labelKey: "home.tabs.directory", value: "directory" },
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
    const userId = user?.id || user?._id;
    if (!userId) {
      setpropertyLoader(false);
      return;
    }

    setpropertyLoader(true);
    ApiClient.get(
      `property/listing?page=1&count=1000&status=active&addedBy=${userId
      }&maxDistance=&userLat=&userLng=&propertyType=&userId=${user?.id || user?._id
      }&loggedInUser=${user?.id || user?._id}`
    )
      .then((res) => {
        if (res.success) {
          setpropertyTotal(res.total);
        }
      })
      .catch(() => {
        setpropertyTotal(0);
      })
      .finally(() => {
        setpropertyLoader(false);
      });
  };

  useEffect(() => {
    if (user.loggedIn) {
      getAllProperty();
    } else {

    }
  }, []);

  const handleGuestAccess = () => {
    dispatch(logout());
    localStorage.removeItem("persist:admin-app");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    disableDebugMockUser();
    enableGuestMode();
    dispatch(login_success({
      loggedIn: true,
      isGuest: true,
      _id: 'guest-user-000',
      id: 'guest-user-000',
      fullName: 'Bookaroo Guest',
      email: 'guest@bookaroo.local',
      accountType: 'guest',
      customerRole: { name: 'Guest' },
      notifications: [],
    }));
    navigate('/properties');
  };

  const handleProperty = () => {
    if (user.loggedIn) {
      if (propertyTotal >= activePlan?.activePlan?.[0]?.numberOfProperty) {
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
                    {t("home.heroTitle")}
                  </h2>
                  <h4 className="text-white 2xl:text-[28px] lg:text-[14px] text-[16px] font-bold  mb-2 2xl:max-w-[320px] xl:max-w-[240px] max-w-[400px] my-3 mb-4">
                    {t("home.heroSubtitle")}
                  </h4>
                  <button
                    disabled={propertyLoader}
                    className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit"
                    onClick={() => handleProperty()}
                  >
                    {propertyLoader ? t("messages.loading") : t("buttons.listProperty")}
                  </button>
                  {!user?.loggedIn && (
                    <button
                      className="bg-white text-black border border-white px-10 py-1.5 rounded-[50px] ml-4 w-fit mt-4 lg:mt-0"
                      onClick={handleGuestAccess}
                    >
                      {t("buttons.browseAsGuest") || "Browse as guest"}
                    </button>
                  )}
                </div>
                <div className="lg:absolute position-set relative 2xl:w-[700px] xl:w-[650px] lg:w-[500px] w-[100%] lg:col-span-6 col-span-full lg:mt-0 mt-5 ">
                  <div className="">
                    <ul className="flex items-center w-full sm:gap-1 gap-0 sm:flex-nowrap flex-wrap">
                      {tabs.map((itm, i) => (
                        <li
                          key={i}
                          // title={itm?.name == "Off-Market" && !activePlan?.[0]?.offMarket ? "Pleadse upgrade your plan" : ""}
                          onClick={() => {
                            if (itm?.value === true && !activePlan?.activePlan?.[0]?.offMarket) {
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
                          {t(itm.labelKey)}
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
                              {t("home.filters.selectPropertyTypes")}
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
                                    {t("home.propertyTypes.house")}
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
                                    {t("home.propertyTypes.apartment")}
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
                                    {t("home.propertyTypes.castle")}
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
                                    {t("home.propertyTypes.building")}
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
                                    {t("home.propertyTypes.farm")}
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
                              {t("buttons.cancel")}
                            </button>
                            <div className="flex items-center">
                              <button
                                onClick={() => setAdditionalFilter(false)}
                                className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                              >
                                {t("buttons.apply")}
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
                            ? t("home.search.directoryHeadline")
                            : t("home.search.offMarketHeadline")}
                        </h2>
                        {form.propertyType === "directory" ? (
                          <p className="text-[#7BBEB8] text-center sm:text-[16px] text-[14px]">
                            {t("home.search.directorySubheadline")}
                          </p>
                        ) : (
                          <p className="text-[#47525E] font-bold text-center sm:text-[16px] text-[14px]">
                            {t("home.search.offMarketSubheadline")}
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

                              {form.propertyType === "directory" ? t("home.search.openToRentalProposal") : t("home.search.rental")
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
                              {form.propertyType === "directory" ? t("home.search.openToPurchaseProposal") : t("home.search.purchase")
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
                              placeholder={t("forms.whichCity")}
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
                                    {t("home.propertyTypes.house")}
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
                                    {t("home.propertyTypes.apartment")}
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
                                {t("home.search.moreCriteria")}
                              </p>
                            </div>
                          </div>
                          <p
                            className="text-[#7BBEB8] text-[14px] underline text-center 2xl:ms-4 md:ms-2 ms-0 cursor-pointer block sm:hidden"
                            onClick={() => handleSearch(true)}
                          >
                            {t("home.search.moreCriteria")}
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
                          {t("home.search.ownerListProperty")}
                        </p>

                        <button
                          onClick={() => handleSearch()}
                          className="bg-[#986AB8] rounded-[50px] px-8 py-2 text-white text-[14px] flex items-center justify-center mx-auto"
                        >
                          {t("home.search.seeResults")}
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
                            <label className="mb-1">{t("home.search.location")}</label>
                            <div className="relative">
                              <GooglePlaceAutoComplete
                                key={inputKey}
                                value={form.search}
                                result={addressResult}
                                placeholder={t("forms.whichCity")}
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
                                ? t("home.search.rental")
                                : t("home.search.price")}{" "}
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
                                placeholder={t("home.search.minPrice")}
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
                                placeholder={t("home.search.maxPrice")}
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
                                  {t("home.propertyTypes.house")}
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
                                  {t("home.propertyTypes.apartment")}
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
                              {t("home.search.moreCriteria")}
                            </p>
                          </div>
                          <p
                            className="text-[#7BBEB8] text-[14px] underline text-center 2xl:ms-4 md:ms-2 mt-2 ms-0 cursor-pointer block sm:hidden"
                            onClick={() => handleSearch(true)}
                          >
                            {t("home.search.moreCriteria")}
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
                          {t("home.search.ownerListProperty")}
                        </p>
                        <button
                          onClick={() => {
                            handleSearch();
                          }}
                          className="bg-[#986AB8] rounded-[50px] px-8 py-2 text-white text-[14px] flex items-center justify-center mx-auto"
                        >
                          {t("home.search.seeResults")}
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
                      {t("home.lastSearch.resultsTitle")}
                      <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                    </h2>
                    <p
                      onClick={() => navigate("/serach-alert")}
                      className="underline font-bold text-[#47525E]  text-[18px] cursor-pointer"
                    >
                      {t("home.lastSearch.savedSearches")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-12 ">
                  <div className="col-span-12 mb-5  ">
                    <h4 className="text-[#47525E] font-bold text-[17px]">
                      {lastSearchObj?.search || t("home.lastSearch.searchName")}
                    </h4>
                    <p className="text-[#47525E] capitalize">
                      {`${lastSearchObj?.propertyType}, ${lastSearchObj?.type ? `${lastSearchObj?.type},` : ""
                        } ${lastSearchObj?.search}`}
                    </p>
                    <h5 className="text-[#383A3D] font-bold mt-3 text-[17px]">
                      {t("home.lastSearch.newResults", { count: properties?.length || 0 })}
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
                            <p className="text-[#6D6E6D] text-[12px] font-[600]">{t("property.forSale")}</p>
                            {item?.propertyType == "offmarket" ? (
                              <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                                {t("home.tabs.offMarket")}
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
                      {t("home.lastSearch.seeAllResults")}
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
                    {t("home.whyBookaroo.title")}
                    <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                  </h2>
                  <p className="text-[#969FAA] max-w-2xl mt-3">
                    {t("home.whyBookaroo.subtitle")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  ">
                  <div className="flex gap-10 items-center xl:flex-row flex-col">
                    <div className="xl:w-[20%] w-[100%] ps-0">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        {t("home.buyers.label")}
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        {t("home.buyers.title")}
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x] xl:max-w-[200px] w-full">
                        {t("home.buyers.description")}
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        {t("home.buyers.cta")}
                      </button>
                    </div>
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tl-[400px] md:rounded-bl-[400px] rounded-tl-[100px] rounded-bl-[100px]  xl:pl-[150px] py-[100px] md:pl-[80px] pl-[50px] pe-[40px] md:h-[500px] h-[100%] ">
                      <p className="text-[#47525E] mb-10 font-[600] ms-8">
                        {t("home.buyers.paradigm")}
                      </p>
                      <ul className=" flex flex-wrap ">
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/calendar.png"
                            className="w-[22px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className=" text-[#7542B9] font-bold text-[15px] mb-1 ">
                              {t("home.buyers.cards.planAhead.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] max-w-[300px] ">
                              {t("home.buyers.cards.planAhead.description")}
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
                              {t("home.buyers.cards.flexibility.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] max-w-[300px] ">
                              {t("home.buyers.cards.flexibility.description")}
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
                              {t("home.buyers.cards.financing.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] max-w-[300px] ">
                              {t("home.buyers.cards.financing.description")}
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
                        {t("home.sellers.timelineIntro")}
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
                                  {t("home.sellers.steps.publishDirectory.title")}
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  {t("home.sellers.steps.publishDirectory.description")}
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start lg:w-1/5 w-full lg:h-unset h-1/5 lg:my-4 lg:mb-0 mb-2 my-0 xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  {t("home.sellers.steps.testOffMarket.title")}
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  {t("home.sellers.steps.testOffMarket.description")}
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start lg:w-1/5 w-full lg:h-unset h-1/5 lg:my-4 lg:mb-0 mb-2 my-0 xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  {t("home.sellers.steps.publishPublicMarket.title")}
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  {t("home.sellers.steps.publishPublicMarket.description")}
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start lg:w-1/5 w-full lg:my-4 lg:h-unset h-1/5 lg:mb-0 mb-2 my-0 xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  {t("home.sellers.steps.transactionTool.title")}
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  {t("home.sellers.steps.transactionTool.description")}
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start lg:w-1/5 w-full lg:my-4 lg:h-unset h-1/5 my-0 lg:mb-0  xl:pe-10 lg:pe-5">
                              <div>
                                <h4 className="text-[#7542B9] font-bold text-[15px]">
                                  {t("home.sellers.steps.transferProfile.title")}
                                </h4>
                                <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                                  {t("home.sellers.steps.transferProfile.description")}
                                </p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="xl:w-[20%] w-[100%] 2xl:ps-[70px] xl:ps-[40px] lg:ps-[40px] ps-[40px] ">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        {t("home.sellers.label")}
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        {t("home.sellers.title")}
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x]  xl:max-w-[200px] w-full">
                        {t("home.sellers.description")}
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        {t("home.sellers.cta")}
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
                    {t("home.whyIndispensable.title")}
                    <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                  </h2>
                  <p className="text-[#969FAA] max-w-2xl mt-3">
                    {t("home.whyIndispensable.subtitle")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-12 ">
                <div className="col-span-12  ">
                  <div className="flex gap-10 items-center xl:flex-row flex-col">
                    <div className="xl:w-[20%] w-[100%]">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        {t("home.wideChoice.label")}
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        {t("home.wideChoice.title")}
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x]  w-full">
                        {t("home.wideChoice.description")}
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        {t("home.buyers.cta")}
                      </button>
                    </div>
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tl-[400px] md:rounded-bl-[400px] rounded-tl-[100px] rounded-bl-[100px]  xl:pl-[150px] py-[60px] md:pl-[80px] pl-[50px] pe-[40px] md:h-[500px] h-[100%] ">
                      <p className="text-[#47525E] mb-10 font-[600] ms-8">
                        {t("home.wideChoice.intro")}
                      </p>
                      <ul className=" flex flex-wrap ">
                        <li className="flex items-start md:w-1/2 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/home-c.png"
                            className="w-[22px] mt-[3px] me-3 shrink-0"
                          />
                          <div className="">
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              {t("home.wideChoice.cards.socialProfile.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full ">
                              {t("home.wideChoice.cards.socialProfile.description")}
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
                              {t("home.wideChoice.cards.largeSelection.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              {t("home.wideChoice.cards.largeSelection.description")}
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
                              {t("home.wideChoice.cards.richData.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              {t("home.wideChoice.cards.richData.description")}
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
                              {t("home.wideChoice.cards.marketSignals.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              {t("home.wideChoice.cards.marketSignals.description")}
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
                        {t("home.transactionTool.intro")}
                      </p>
                      <div className="flex lg:gap-4 gap-0 lg:flex-nowrap flex-wrap">
                        <div className="md:w-1/3 w-full">
                          <p className="text-[#47525E] text-[14px] font-[600] mb-4">
                            {t("home.transactionTool.column1Intro")}
                          </p>
                          <ul>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column1Items.education")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column1Items.orchestratedFlow")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column1Items.documentSharing")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column1Items.visitScheduling")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column1Items.messaging")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column1Items.candidateCriteria")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] lg:mb-3 mb-2 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column1Items.multichannelPosting")}
                            </li>
                          </ul>
                        </div>
                        <div className="md:w-1/3 w-full">
                          <p className="text-[#47525E] text-[14px] font-[600] mb-4">
                            {t("home.transactionTool.column2Intro")}
                          </p>
                          <ul>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column2Items.freeValuation")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>{" "}
                              {t("home.transactionTool.column2Items.adWriting")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column2Items.professionalPhotos")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column2Items.financialScreening")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column2Items.visitManagement")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column2Items.legalFile")}
                            </li>
                            <li className="text-[#47525E] font-[400] lg:text-[14px] text-[13px] mb-3 flex items-center">
                              <span className="w-[7px] h-[7px] block bg-[#976DD0] rounded-[50px] me-2"></span>
                              {t("home.transactionTool.column2Items.inventoryReport")}
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
                        {t("home.transactionTool.label")}
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        {t("home.transactionTool.title")}
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x]  w-full">
                        {t("home.transactionTool.description")}
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        {t("home.transactionTool.cta")}
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
                        {t("home.fairPrice.label")}
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        {t("home.fairPrice.title")}
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x] w-full">
                        {t("home.fairPrice.description")}
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        {t("home.fairPrice.cta")}
                      </button>
                    </div>
                    <div className="bg-[#ECE3F2] xl:w-[80%] w-[100%] md:rounded-tl-[400px] md:rounded-bl-[400px] rounded-tl-[100px] rounded-bl-[100px]  xl:pl-[150px] py-[60px] md:pl-[80px] pl-[50px] pe-[40px] md:h-[500px] h-[100%]">
                      <p className="text-[#47525E] mb-10 font-[600] ms-8 ">
                        {t("home.fairPrice.intro")}
                      </p>
                      <ul className=" flex flex-wrap ">
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/pin.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              {t("home.fairPrice.cards.sellPrice.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full ">
                              {t("home.fairPrice.cards.sellPrice.description")}
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
                              {t("home.fairPrice.cards.buyFairPrice.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              {t("home.fairPrice.cards.buyFairPrice.description")}
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
                              {t("home.fairPrice.cards.multiCriteria.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              {t("home.fairPrice.cards.multiCriteria.description")}
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
                        {t("home.proNetwork.intro")}
                      </p>
                      <ul className=" flex flex-wrap ">
                        <li className="flex items-start md:w-1/3 w-full my-4 pe-2">
                          <img
                            src="assets/img/icons/pin.png"
                            className="w-[30px] mt-[3px] me-3"
                          />
                          <div>
                            <h4 className="text-[#7542B9] font-bold text-[15px] mb-1 ">
                              {t("home.proNetwork.cards.agency.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full ">
                              {t("home.proNetwork.cards.agency.description")}
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
                              {t("home.proNetwork.cards.hunter.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              {t("home.proNetwork.cards.hunter.description")}
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
                              {t("home.proNetwork.cards.broker.title")}
                            </h4>
                            <p className="text-[#47525E] lg:text-[14px] text-[14px] lg:max-w-[300px] w-full">
                              {t("home.proNetwork.cards.broker.description")}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="xl:w-[20%] w-[100%] 2xl:ps-[70px] xl:ps-[40px] lg:ps-[40px] ps-[40px] ">
                      <p className="text-[#7BBEB8] text-[22px] mb-3  font-[600]">
                        {t("home.proNetwork.label")}
                      </p>
                      <p className="text-[#976DD0] font-[600] text-[20px] mb-3 xl:max-w-[200px] w-full">
                        {t("home.proNetwork.title")}
                      </p>
                      <p className="text-[#47525E] font-bold mb-3 text-[16x]  w-full">
                        {t("home.proNetwork.description")}
                      </p>
                      <button className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">
                        {t("home.proNetwork.cta")}
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
                {t("home.whyList.title")}
                <span className="bg-white w-[35px] h-[6px] rounded-[10px] block "></span>
              </h2>
              <div className="grid grid-cols-12 md:gap-10 gap-0 mt-20">
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/stars.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">{t("home.whyList.cards.visibility.title")}</h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      {t("home.whyList.cards.visibility.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/user.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">{t("home.whyList.cards.leads.title")}</h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      {t("home.whyList.cards.leads.description")}
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
                      {t("home.whyList.cards.value.title")}
                    </h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      {t("home.whyList.cards.value.description")}
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
                      {t("home.whyList.cards.simplifiedListing.title")}
                    </h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      {t("home.whyList.cards.simplifiedListing.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/mask.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">{t("home.whyList.cards.testOffMarket.title")}</h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      {t("home.whyList.cards.testOffMarket.description")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start lg:col-span-4 md:col-span-6 col-span-12 my-5">
                  <img
                    src="assets/img/icons/fast-forward.png"
                    className="w-[20px] me-2 mt-[2px]"
                  />
                  <div className="text-white">
                    <h4 className="font-[600] mb-1">{t("home.whyList.cards.sellFaster.title")}</h4>
                    <p className="font-[400] text-[14px] md:max-w-[300px] w-full">
                      {t("home.whyList.cards.sellFaster.description")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-14">
                <p className="text-white text-center font-[600]">
                  {t("home.whyList.freeForever")}
                </p>
                <button className="bg-[#343F4B] text-white px-4 py-2 rounded-[50px] mx-auto flex items-center justify-center mt-3">
                  {t("home.whyList.listCta")}
                </button>
              </div>
            </div>
          </section>

          {/* <button onClick={() => setIsOpen(true)} className="hidden">Open dialog</button> */}
          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/50 z-[9] flex w-screen items-center justify-center p-4">
              <DialogPanel className="max-w-lg rounded-[12px] space-y-4 text-center border bg-white p-12">
                <DialogTitle className="xl:text-[26px] lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#000] font-semibold text-center">{t("home.upgrade.title")}</DialogTitle>
                <Description></Description>
                <p>{t("home.upgrade.description")}</p>
                <div className="flex gap-2 justify-center items-center ">
                  <button onClick={() => setIsOpen(false)} className="bg-black px-10 py-1.5 rounded-[50px] text-white w-fit">{t("buttons.cancel")}</button>
                  <button onClick={() => navigate("/plan")} className="bg-[#986AB8] rounded-full px-8 py-2 text-white text-[14px] flex items-center justify-center">{t("home.upgrade.cta")}</button>
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
