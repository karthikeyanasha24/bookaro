import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowRightLong } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoMdMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import socket from "../../../config/ChatSocket/socket";
import { notificationListener } from "../../../config/Firebase/FirebaseAuth";
import { removePropData } from "../../../models/string.model";
import LoginModal from "../../common/Modal/LoginModal";
import "./style.scss";
import ApiClient from "../../../methods/api/apiClient";
import UpgradePlan from "../../common/Modal/UpgradePlan";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { login_success, logout } from "../../../actions/user";
import Sidebar from "../sidebar";
import LanguageSwitcher from "../../../LanguageSwitcher";

const PageLayout = ({ children }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [projectData, setProjectData] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const activePlan = useSelector((state) => state.activePlan);
  const [propertyTotal, setpropertyTotal] = useState(0);
  const [propertyLoader, setpropertyLoader] = useState(false);
  const [planModal, setplanModal] = useState(false);
  const pathname = location.pathname;
  const user = useSelector((state) => state.user);
  const [loginModal, setloginModal] = useState(false);
  const [notLength, setNotLength] = useState(0);
  const [chatLength, setChatLength] = useState(0);
  const [isInChatPage, setIsInChatPage] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef("");

  // Check if user is logged in
  const isLoggedIn = user?.loggedIn;

  // Check if we should exclude sidebar from current route
  const excludeSidebarRoutes = ["/login", "/signup", "/forgotpassword", "/reset-password", "/otpverify", "/change-password", "/reset-email", "/reset-new-email", "/signup/pro", "/phone-number"];
  const shouldShowSidebar = isLoggedIn && !excludeSidebarRoutes.some(route => pathname.startsWith(route));

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebar_open");
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  // Toggle sidebar and save state
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebar_open", JSON.stringify(newState));
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  const Logout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:admin-app");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const notificationRead = () => {
    navigate("/notifications");
    socket.emit("mark-as-read-noti", {
      userId: user?.id || user?._id,
    });
  };

  const projectMenus = [
    {
      head: "",
      sub: [{ name: t("project.myProject"), url: "/project" }],
    },
    {
      head: t("project.searcherSpace"),
      sub: [
        { name: t("project.searchAlert"), url: "/serach-alert" },
        { name: t("project.propertiesFollowed"), url: "/followed-properties" },
        { name: t("project.interactedProperties"), url: "/properties?favourites=true" },
        { name: t("project.renterApplicationFile"), url: "/renter-file" },
        { name: t("project.buyerFile"), url: "/buyer-file" },
        {
          name: t("project.manageTransaction"),
          url: "/real-estate-transaction-searcher",
        },
        {
          name: t("project.p2pEstimation"),
          url: "/estimation",
        },
      ],
    },
    {
      head: t("project.ownerSpace"),
      sub: [
        { name: t("project.myProperty"), url: "/my-properties" },
        { name: t("buttons.listProperty"), url: "/property1" },
        { name: t("project.sellerFile"), url: "/seller-file" },
        {
          name: t("project.manageTransaction"),
          url: "/real-estate-transaction-owner",
        },
        {
          name: t("project.manageP2pEstimation"),
          url: "/social-estimation",
        },
      ],
    },
  ];

  const accountMenu = [
    {
      name: t('header.account'),
      title: t('header.account'),
      image: (
        <img src="/assets/img/header/account.png" className="w-[20px]" alt="" />
      ),
      url: "/profile/Account",
      menu: (
        <>
          <ul className="bg-white py-4 pe-4 ps-2 right-0 rounded-[10px] absolute w-[200px] shadow-md border-0 border-[#00000024]">
            <>
              <li
                onClick={() => {
                  navigate("/profile/Account");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t('header.personalInformation')}
              </li>
              {user?.accountType == "pro" && <li
                onClick={() => {
                  navigate("/profile");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t('header.companyProfile')}
              </li>}

              <li
                onClick={() => {
                  navigate("/profile/manage-notifications");
                  setProjectData("");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t('header.notifications')}
              </li>
              <li
                onClick={() => {
                  navigate("/change-password");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t('header.password')}
              </li>
              <li
                onClick={() => {
                  navigate("/phone-number");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t('header.phoneNumber')}
              </li>
              <li
                onClick={() => {
                  navigate("/contact-us");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t('header.helpCenter')}
              </li>
              <li
                onClick={() => {
                  Logout()
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t('header.logout')}
              </li>
            </>
          </ul>
        </>
      ),
    },
  ]

  const menus = [];  // Menus supprimés quand sidebar est affiché - À gérer via conditionalité


  const mobMenus = [
    {
      name: t("header.plans"),
      link: "/plan",
      img: "/assets/img/header/bulb.png",
    },
    {
      name: t("header.marketInsights"),
      img: "/assets/img/header/home.png",
      menu: [
        {
          name: t("header.transactions"),
          link: "/past-transactions",
        },
        {
          name: t("header.realEstatePros"),
          link: "/real-estate-pros",
        },
        {
          name: t("header.buildingPermits"),
          link: "/building-permit",
        },
      ],
    },
    {
      name: t("header.innovativeServices"),
      link: "/real-estate-pros",
      img: "/assets/img/header/hands.png",
      menu: [
        {
          name: t("home.tabs.directory"),
          link: "/real-estate-transaction-owner",
        },
        {
          name: t("home.tabs.offMarket"),
          link: "/real-estate-transaction-owner",
        },
        {
          name: t("project.p2pEstimation"),
          link: "/real-estate-transaction-owner",
        },
        {
          name: t("header.transactionTool"),
          link: "/real-estate-transaction-owner",
        },
      ],
    },
    {
      name: t("header.realEstatePros"),
      link: "/real-estate-pros",
      img: "/assets/img/header/home.png",
    },
    {
      key: "myProject",
      name: t("project.myProject"),
      img: "/assets/img/header/home.png",
      menu: [
        {
          head: "",
          sub: [{ name: t("project.myProject"), url: "/project" }],
        },
        {
          head: t("project.searcherSpace"),
          sub: [
            { name: t("project.searchAlert"), url: "/serach-alert" },
            { name: t("project.propertiesFollowed"), url: "/followed-properties" },
            {
              name: t("project.interactedProperties"),
              url: "/properties?favourites=true",
            },
            { name: t("project.renterApplicationFile"), url: "/renter-file" },
            { name: t("project.buyerFile"), url: "/buyer-file" },
            {
              name: t("project.manageTransaction"),
              url: "/real-estate-transaction-searcher",
            },
          ],
        },
        {
          head: t("project.ownerSpace"),
          sub: [
            { name: t("project.myProperty"), url: "/my-properties" },
            { name: t("buttons.listProperty"), url: "/property1" },
            { name: t("project.sellerFile"), url: "/seller-file" },
            {
              name: t("project.manageTransaction"),
              url: "/real-estate-transaction-owner",
            },
          ],
        },
      ],
    },
  ];
  // const getNotifications = () => {
  //   const dto = {
  //     sendToId: user?._id,
  //   };
  //   loader(true);
  //   ApiClient.get("notification/list", dto).then((res) => {
  //     if (res.success) {
  //       let unreadLen =
  //         res?.data?.filter((ee) => ee.status != "read")?.length || "";
  //       setNotLength(unreadLen);
  //     }
  //     loader(false);
  //   });
  // };
  // useEffect(() => {
  //   if (user?.loggedIn) getNotifications();
  // }, []);
  useEffect(() => {
    // Ne jamais faire d'appel réseau en mode autonome (mock user)
    if (process.env.REACT_APP_DEBUG_MOCK_USER !== 'true' && user.loggedIn) {
      ApiClient.get(`user/detail`, { id: user?._id }).then((res) => {
        if (res.success) {
          dispatch(login_success(res?.data));
        }
      });
    }
  }, []);
  useEffect(() => {
    if (pathname === "/chat") {
      setIsInChatPage(true);
    } else {
      setIsInChatPage(false);
    }
    if (user.loggedIn) {
      notificationListener(navigate, setNotLength);
    }
  }, [location]);
  // Listen for the 'notify-message' event from socket
  useEffect(() => {
    const onMessageNotification = (res) => {
      if (res.status === 200) {
        const newmsg = res.data.count_room_chat;
        if (!isInChatPage) {
          setChatLength((prev) => newmsg);
          // setChatLength((prev) => (prev < 9 ? prev + 1 : 9));
        }
      }
    };
    socket.on("notify-message", onMessageNotification);
    return () => {
      socket.off("notify-message", onMessageNotification);
    };
  }, [isInChatPage, socket]);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTimeout(() => {
          setProjectData("");
        }, 100);
      }
    };
    socket.emit("un-noti", {
      user_id: user?.id || user?._id,
    });
    socket.on("un-noti", (res) => {
      setNotLength(res?.data?.unread_count);
    });

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
      <UpgradePlan planModal={planModal} setplanModal={setplanModal} />
      <div component="page-layout">
        <header className="sticky top-0 z-[99] border-b">
          <nav className="bg-white border-gray-200 px-6 lg:px-10 py-2.5 dark:bg-gray-800">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xxl relative">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img
                    src="/assets/img/logo.png"
                    className="mr-3  xl:w-[140px] lg:w-[100px] w-[120px]"
                    alt="Logo"
                  />
                </Link>
                <button
                  onClick={() => {
                    if (user.loggedIn) {
                      removePropData();
                      return navigate("/property1");
                    } else setloginModal(true);
                  }}
                  className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold md:block hidden"
                >
                  {propertyLoader ? t("messages.loading") : t("buttons.listProperty")}
                </button>
              </div>

              {/* only for mobile */}
              <div className="flex items-center lg:hidden ">
                <div className="">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={openModal}
                      className="rounded-md   text-sm font-medium text-black"
                    >
                      <IoMdMenu />
                    </button>
                  </div>

                  <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={closeModal}
                    >
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-black/25" />
                      </Transition.Child>

                      <div className="fixed inset-0 overflow-y-auto !top-[45px]">
                        <div className="flex min-h-full items-center justify-start text-center">
                          <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-out duration-300"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in duration-200"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                          >
                            <Dialog.Panel className="w-[300px] overflow-y-scroll transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all h-screen">
                              <div className="">
                                <button
                                  type="button"
                                  className="block ml-auto"
                                  onClick={closeModal}
                                >
                                  <RxCross2 />
                                </button>
                              </div>

                              <div className="mt-2">
                                <ul className="">
                                  <li className="flex items-center border-b py-3">
                                    {/* <img
                                      src="/assets/img/header/bulb.png"
                                      className="w-[20px] me-2"
                                      alt=""
                                    /> */}
                                    <p
                                      onClick={() => {
                                        if (user.loggedIn) {
                                          removePropData();
                                          return navigate("/property1");
                                        } else setloginModal(true);
                                      }}
                                      className={`text-left ${pathname === "/property1"
                                        ? "text-primary"
                                        : "text-[#47525E]"
                                        }`}
                                    >
                                      {t("buttons.listProperty")}
                                    </p>
                                  </li>
                                  {/* {mobMenus.map((itm, i) => (
                                    <li className="flex items-center border-b py-3">
                                      <img
                                        src={itm.img}
                                        className="w-[20px] me-2"
                                        alt=""
                                      />
                                      <p
                                        onClick={() => navigate(itm.link)}
                                        className="text-[#47525E]"
                                      >
                                        {itm.name}
                                      </p>
                                    </li>
                                  ))} */}
                                </ul>
                              </div>
                              {/* collpasible sidebar */}
                              {mobMenus.map((itm, i) => (
                                <div
                                  key={i}
                                  className="w-full max-w-md mx-auto bg-white border-b py-3"
                                >
                                  {itm.menu ? (
                                    <Disclosure>
                                      {({ open }) => (
                                        <>
                                          <Disclosure.Button className="flex justify-between w-full font-medium text-left focus:outline-none ">
                                            <div className="flex items-center">
                                              <img
                                                src={itm.img}
                                                className="w-[20px] me-2"
                                                alt=""
                                              />
                                              <p
                                                onClick={() =>
                                                  navigate(itm.link)
                                                }
                                                className="text-[#47525E]"
                                              >
                                                {itm.name}
                                              </p>
                                            </div>
                                            <ChevronUpIcon
                                              className={`${open
                                                ? "transform rotate-180"
                                                : ""
                                                } w-5 h-5 `}
                                            />
                                          </Disclosure.Button>
                                          <Disclosure.Panel className="px-2 text-sm text-gray-500">
                                            {itm.key === "myProject" ? (
                                              <ul>
                                                {itm.menu.map((res, index) => (
                                                  <li
                                                    key={index}
                                                    className="pt-3"
                                                  >
                                                    {res.head && (
                                                      <p
                                                        onClick={() =>
                                                          navigate(res.link)
                                                        }
                                                        className="text-primary font-bold mb-1 "
                                                      >
                                                        {res.head}
                                                      </p>
                                                    )}
                                                    <ul className=" space-y-1 pt-1">
                                                      {res?.sub?.map(
                                                        (subItem, subIndex) => (
                                                          <li
                                                            key={subIndex}
                                                            onClick={() =>
                                                              navigate(
                                                                subItem.url
                                                              )
                                                            }
                                                            className="cursor-pointer text-[#47525E] hover:text-blue-600"
                                                          >
                                                            {subItem.name}
                                                          </li>
                                                        )
                                                      )}
                                                    </ul>
                                                  </li>
                                                ))}
                                              </ul>
                                            ) : (
                                              <ul>
                                                {itm.menu.map((res, index) => (
                                                  <li className="flex items-center pt-3">
                                                    <p
                                                      onClick={() =>
                                                        navigate(res.link)
                                                      }
                                                      className="text-[#47525E]"
                                                    >
                                                      {res.name}
                                                    </p>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </Disclosure.Panel>
                                        </>
                                      )}
                                    </Disclosure>
                                  ) : (
                                    <>
                                      <Link
                                        to={"/"}
                                        className="flex items-center "
                                      >
                                        <img
                                          src={itm.img}
                                          className="w-[20px] me-2"
                                          alt=""
                                        />
                                        <p
                                          onClick={() => navigate(itm.link)}
                                          className="text-[#47525E]"
                                        >
                                          {itm.name}
                                        </p>
                                      </Link>
                                    </>
                                  )}
                                </div>
                              ))}
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                </div>

                {user?.loggedIn ? (
                  <div key={"Account"}>
                    <Link
                      to={"/profile/Account"}
                      className="block text-center justify-center flex flex-col items-center xl:text-[14px] lg:text-[12px] text-[#47525E] xl:ps-5 lg:ps-2 ps-2"
                    >
                      <img
                        src="/assets/img/header/account.png"
                        className="w-[18px]"
                        alt=""
                      />
                    </Link>
                  </div>
                ) : (
                  <div
                    key={"Account"}
                    className="flex items-center justify-center"
                  >
                    <Link
                      to="/login"
                      className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold ms-2 inline-block"
                    >
                      {t("buttons.login")}
                    </Link>

                    <Link
                      to="/Signup"
                      className="bg-white border border-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-[#47525E] font-bold ms-2 inline-block"
                    >
                      {t("buttons.signup")}
                    </Link>
                  </div>
                )}
              </div>
              {/* for web  */}
              <div
                className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                id="mobile-menu-2"
              >
                {user?.loggedIn && (
                  <div>
                    <ul className="flex items-center">
                      <li className="xl:px-5 lg:px-2 px-2 ">
                        <Link to="/chat" className="relative">
                          <img
                            alt=""
                            src="/assets/img/header/message.svg"
                            className="w-[25px] text-[#976DD0]"
                          />
                          {!isInChatPage && chatLength > 0 && (
                            <div>
                              <p className="bg-[#ccd6ff] w-[16px] h-[16px] flex items-center justify-center border border-white shadow rounded-full absolute -top-1 -right-1 text-[9px] p-1 font-[600] circle-b">
                                {chatLength > 9 ? "9" : chatLength}
                                {chatLength > 9 && (
                                  <sup className="font-[600]">+</sup>
                                )}
                              </p>
                            </div>
                          )}
                        </Link>
                      </li>
                      <li className="xl:px-5 px-3">
                        <button
                          onClick={() => notificationRead()}
                          className="relative"
                        >
                          <img
                            alt=""
                            src="/assets/img/header/bell.svg"
                            className="w-[20px] h-[20px] text-[#976DD0]"
                          />
                          {notLength > 0 && (
                            <div>
                              <p className="bg-[#ccd6ff] w-[16px] h-[16px] flex items-center justify-center border border-white shadow rounded-full absolute -top-2 -right-1 text-[9px] p-1 font-[600] circle-b">
                                {notLength > 9 ? "9" : notLength}
                                {notLength > 9 && (
                                  <sup className="font-[600]">+</sup>
                                )}
                              </p>
                            </div>
                          )}
                        </button>
                      </li>
                      <li className="xl:px-5 px-3">
                        <LanguageSwitcher />
                      </li>
                    </ul>
                  </div>
                )}
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 ">
                  {menus.map((itm) => {
                    return (
                      <li title={itm?.title} key={itm.name} className="relative">
                        <p
                          onClick={() => {
                            if (itm?.menu) {
                              setProjectData((prev) => {
                                // let menu=(prev==itm.name)?'':itm.name
                                let menu = itm.name;
                                return menu;
                              });
                            } else {
                              navigate(itm.url);
                            }
                          }}
                          className={`cursor-pointer block text-center justify-center flex flex-col items-center xl:text-[14px] lg:text-[12px] border-r border-[#C9C9C9] text-[#47525E] xl:px-5 lg:px-2 px-2
                          ${pathname === itm.url
                              ? "text-[#976DD0] font-semibold"
                              : ""
                            }`}
                        >
                          {itm.image}
                          {itm.name}
                        </p>
                        {itm?.menu && projectData == itm.name ? (
                          <div ref={dropdownRef}>
                            {projectData == itm.name ? <>{itm?.menu}</> : <></>}
                          </div>
                        ) : (
                          <></>
                        )}
                      </li>
                    );
                  })}
                  {user?.loggedIn ? (

                    // <li key={"Account"}>
                    //   <Link
                    //     to={"/profile/Account"}
                    //     className={`block text-center justify-center flex flex-col items-center xl:text-[14px] lg:text-[12px] text-[#47525E] xl:ps-5 lg:ps-2 ps-2
                    //     ${pathname === "/profile/Account"
                    //         ? "text-[#976DD0] font-semibold"
                    //         : ""
                    //       }`}
                    //   >
                    //     <img
                    //       src="/assets/img/header/account.png"
                    //       className="w-[18px]"
                    //       alt=""
                    //     />
                    //     Account
                    //   </Link>
                    // </li>
                    <>{accountMenu.map((itm) => {
                      return (
                        <li title={itm?.title} key={itm.name} className="relative">
                          <p
                            onClick={() => {
                              if (itm?.menu) {
                                setProjectData((prev) => {
                                  // let menu=(prev==itm.name)?'':itm.name
                                  let menu = itm.name;
                                  return menu;
                                });
                              } else {
                                navigate(itm.url);
                              }
                            }}
                            className={`cursor-pointer block text-center justify-center flex flex-col items-center xl:text-[14px] lg:text-[12px]  border-[#C9C9C9] text-[#47525E] xl:px-5 lg:px-2 px-2
                          ${pathname === itm.url
                                ? "text-[#976DD0] font-semibold"
                                : ""
                              }`}
                          >
                            {itm.image}
                            {itm.name}
                          </p>
                          {itm?.menu && projectData == itm.name ? (
                            <div ref={dropdownRef}>
                              {projectData == itm.name ? <>{itm?.menu}</> : <></>}
                            </div>
                          ) : (
                            <></>
                          )}
                        </li>
                      );
                    })}</>
                  ) : (
                    <li
                      key={"Account"}
                      className="flex items-center justify-center"
                    >
                      <Link
                        to="/login"
                        className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold ms-2 inline-block"
                      >
                          {t("buttons.login")}
                      </Link>

                      <Link
                        to="/Signup"
                        className="bg-white border border-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-[#47525E] font-bold ms-2 inline-block"
                      >
                          {t("buttons.signup")}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </header>

        {/* Sidebar + Main Content Container */}
        <div className="page-layout-wrapper">
          {/* Desktop Sidebar */}
          {shouldShowSidebar && (
            <aside className={`sidebar-container hidden md:block ${!isSidebarOpen ? 'collapsed' : ''}`}>
              <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            </aside>
          )}

          {/* Mobile Sidebar Overlay */}
          {shouldShowSidebar && (
            <Transition show={isMobileSidebarOpen} as={Fragment}>
              <Dialog as="div" className="relative md:hidden z-40" onClose={() => setIsMobileSidebarOpen(false)}>
                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                      <Dialog.Panel className="relative w-full max-w-xs h-full bg-white shadow-xl">
                        <Sidebar isOpen={false} onToggle={() => {}} />
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          )}

          {/* Main Content Area */}
          <main
            className={`page-content-wrapper ${shouldShowSidebar ? "with-sidebar" : "full-width"} ${
              shouldShowSidebar ? (isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed") : ""
            }`}
          >
            <div className="pageContent pb-24">{children}</div>
          </main>
        </div>

        {/* Mobile Sidebar Toggle Button */}
        {shouldShowSidebar && (
          <button 
            className="md:hidden fixed bottom-6 right-6 z-30 bg-[#976DD0] text-white rounded-full p-3 shadow-lg"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <IoMdMenu className="text-xl" />
          </button>
        )}

        {/* Footer suppressed */}
      </div>
    </>
  );
};
export default PageLayout;
