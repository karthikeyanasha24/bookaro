import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { IoMdMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
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

const PageLayout = ({ children }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(220);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
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

  const projectMenus = useMemo(
    () => [
      {
        head: "",
        sub: [{ name: t("pageLayout.myProject"), url: "/project" }],
      },
      {
        head: t("pageLayout.homeSeeker"),
        sub: [
          { name: t("sidebar.searchAlerts"), url: "/serach-alert" },
          { name: t("sidebar.propertiesFollowed"), url: "/followed-properties" },
          { name: t("pageLayout.interactedProperties"), url: "/properties?favourites=true" },
          { name: t("pageLayout.renterApplicationFile"), url: "/renter-file" },
          { name: t("sidebar.buyerFile"), url: "/buyer-file" },
          {
            name: t("pageLayout.manageRealEstateTransaction"),
            url: "/real-estate-transaction-searcher",
          },
          {
            name: t("sidebar.p2pEstimation"),
            url: "/estimation",
          },
        ],
      },
      {
        head: t("pageLayout.ownerSpace"),
        sub: [
          { name: t("pageLayout.myPropertySingular"), url: "/my-properties" },
          { name: t("pageLayout.listProperty"), url: "/property1" },
          { name: t("sidebar.sellerFile"), url: "/seller-file" },
          {
            name: t("pageLayout.manageRealEstateTransaction"),
            url: "/real-estate-transaction-owner",
          },
          {
            name: t("pageLayout.manageP2pEstimation"),
            url: "/social-estimation",
          },
        ],
      },
    ],
    [t]
  );

  const accountMenu = useMemo(
    () => [
    {
      name: t("pageLayout.account"),
      title: t("pageLayout.account"),
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
                {t("pageLayout.personalInformation")}
              </li>
              {user?.accountType == "pro" && <li
                onClick={() => {
                  navigate("/profile");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("settings.companyProfile")}
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
                {t("pageLayout.notifications")}
              </li>
              <li
                onClick={() => {
                  navigate("/change-password");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.password")}
              </li>
              <li
                onClick={() => {
                  navigate("/phone-number");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.phoneNumber")}
              </li>
              <li
                onClick={() => {
                  navigate("/help");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.helpCenter")}
              </li>
              <li
                onClick={() => {
                  Logout()
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.logout")}
              </li>
            </>
          </ul>
        </>
      ),
    },
  ],
    [t, user?.accountType]
  );

  const menus = useMemo(
    () => [
    {
      name: t("pageLayout.plans"),
      title: t("pageLayout.plans"),
      image: (
        <img src="/assets/img/header/bulb.png" className="w-[20px]" alt="" />
      ),
      url: "/plan",
    },
    {
      name: t("pageLayout.marketInsight"),
      title: t("pageLayout.marketInsight"),
      image: (
        <img src="/assets/img/header/home.png" className="w-[20px]" alt="" />
      ),
      url: "/real-estate-pros",
      menu: (
        <>
          <ul className="bg-white py-4 pe-4 ps-2 rounded-[10px] absolute w-[200px] shadow-md border border-[#00000024]  ">
            <>
              <li
                onClick={() => {
                  navigate("/past-transactions");
                  setProjectData("");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.historicalTransaction")}
              </li>
              <li
                onClick={() => {
                  navigate("/real-estate-pros");
                  setProjectData("");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.professionalRepository")}
              </li>
              <li
                onClick={() => {
                  navigate("/building-permit");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("sidebar.buildingPermits")}
              </li>
            </>
          </ul>
        </>
      ),
    },

    {
      name: t("pageLayout.learningCenter"),
      title: t("sidebar.learningCenter"),
      image: (
        <img src="/assets/img/header/bulb.png" className="w-[20px]" alt="" />
      ),
      url: "/blog-detail",
      menu: (
        <>
          <ul className="bg-white py-4 pe-4 ps-2 rounded-[10px] absolute w-[200px] shadow-md border border-[#00000024]">
            <>
              <li
                onClick={() => {
                  navigate("/blog-detail");
                  setProjectData("");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("sidebar.writtenTraining")}
              </li>
              <li
                onClick={() => {
                  navigate("/training");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("sidebar.videoTraining")}
              </li>
            </>
          </ul>
        </>
      ),
    },
    {
      name: t("pageLayout.innovativeServices"),
      title: t("pageLayout.innovativeServices"),
      image: (
        <img src="/assets/img/header/hands.png" className="w-[20px]" alt="" />
      ),
      url: "/past-transactions",
      menu: (
        <>
          <ul className="bg-white py-4 pe-4 ps-2 rounded-[10px] absolute w-[200px] shadow-md border border-[#00000024]">
            <>
              <li
                onClick={() => {
                  navigate("/directory");
                  setProjectData("");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.directory")}
              </li>
              <li
                onClick={() => {
                  navigate("/offmarket");
                  setProjectData("");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.offMarket")}
              </li>
              <li
                onClick={() => {
                  navigate("/peertopeer");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("sidebar.p2pEstimation")}
              </li>
              <li
                onClick={() => {
                  navigate("/transaction-tool");
                }}
                className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
              >
                <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                {t("pageLayout.transactionTool")}
              </li>
            </>
          </ul>
        </>
      ),
    },
    ...(user?.loggedIn
      ? [
        {
          name: t("pageLayout.myProject"),
          title: t("pageLayout.myProject"),
          image: (
            <img src="/assets/img/header/home.png" className="w-[20px]" alt="" />
          ),
          menu: (
            <>
              <ul className="bg-white py-4 pe-4 ps-2 rounded-[10px] absolute w-[200px] shadow-md border border-[#00000024] right-0">
                {projectMenus.map((head, i) => (
                  <Fragment key={`project-group-${i}`}>
                    {head.head && (
                      <li
                        key={i}
                        className="text-[#47525E] font-[600] border-b pb-1 border-[#dcdcdc] text-left text-[#976DD0] my-2 text-[14px]"
                      >
                        {head.head}
                      </li>
                    )}
                    {head.sub.map((itm, ii) => (
                      <li
                        key={`project-item-${i}-${ii}-${itm.url || itm.name}`}
                        onClick={() => {
                          navigate(itm.url);
                          setProjectData("");
                        }}
                        className="text-[#47525E] text-left font-normal cursor-pointer my-1 hover:text-[#976DD0] transition-all duration-500 ease-in-out flex items-center group text-[14px]"
                      >
                        <GoDotFill className="flex group-hover:hidden me-2 w-[15px] transition-all duration-500 ease-in-out" />
                        <FaArrowRightLong className="w-[15px] hidden group-hover:flex me-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" />
                        {itm.name}
                      </li>
                    ))}
                  </Fragment>
                ))}
              </ul>
            </>
          ),
          url: "/project",
        },
      ]
      : []),

  ],
    [t, user?.loggedIn, projectMenus]
  );

  const mobMenus = useMemo(
    () => [
    {
      name: t("pageLayout.plans"),
      link: "/plan",
      img: "/assets/img/header/bulb.png",
    },
    {
      name: t("pageLayout.marketInsightsMobile"),
      img: "/assets/img/header/home.png",
      menu: [
        {
          name: t("pageLayout.historicalTransaction"),
          link: "/past-transactions",
        },
        {
          name: t("pageLayout.professionalRepository"),
          link: "/real-estate-pros",
        },
        {
          name: t("sidebar.buildingPermits"),
          link: "/building-permit",
        },
      ],
    },
    {
      name: t("pageLayout.innovativeServices"),
      link: "/real-estate-pros",
      img: "/assets/img/header/hands.png",
      menu: [
        {
          name: t("pageLayout.directory"),
          link: "/real-estate-transaction-owner",
        },
        {
          name: t("pageLayout.offMarket"),
          link: "/real-estate-transaction-owner",
        },
        {
          name: t("sidebar.p2pEstimation"),
          link: "/real-estate-transaction-owner",
        },
        {
          name: t("pageLayout.transactionTool"),
          link: "/real-estate-transaction-owner",
        },
      ],
    },
    {
      name: t("pageLayout.realEstatePros"),
      link: "/real-estate-pros",
      img: "/assets/img/header/home.png",
    },
    {
      menuKey: "myProject",
      name: t("pageLayout.myProject"),
      link: "/project",
      img: "/assets/img/header/home.png",
      menu: [
        {
          head: "",
          sub: [{ name: t("pageLayout.myProject"), url: "/project" }],
        },
        {
          head: t("pageLayout.homeSeeker"),
          sub: [
            { name: t("sidebar.searchAlerts"), url: "/serach-alert" },
            { name: t("sidebar.propertiesFollowed"), url: "/followed-properties" },
            {
              name: t("pageLayout.interactedProperties"),
              url: "/properties?favourites=true",
            },
            { name: t("pageLayout.renterApplicationFile"), url: "/renter-file" },
            { name: t("sidebar.buyerFile"), url: "/buyer-file" },
            {
              name: t("pageLayout.manageRealEstateTransaction"),
              url: "/real-estate-transaction-searcher",
            },
          ],
        },
        {
          head: t("pageLayout.ownerSpace"),
          sub: [
            { name: t("pageLayout.myPropertySingular"), url: "/my-properties" },
            { name: t("pageLayout.listProperty"), url: "/property1" },
            { name: t("sidebar.sellerFile"), url: "/seller-file" },
            {
              name: t("pageLayout.manageRealEstateTransaction"),
              url: "/real-estate-transaction-owner",
            },
          ],
        },
      ],
    },
  ],
    [t]
  );
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
    if (user.loggedIn) {
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

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const contentOffset = user?.loggedIn && isDesktop ? sidebarWidth : 0;

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
      <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
      <UpgradePlan planModal={planModal} setplanModal={setplanModal} />
      <div component="page-layout">
        <header className="sticky top-0 z-[9] border-b">
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
                  {propertyLoader ? t("common.loading") : t("pageLayout.listProperty")}
                </button>
              </div>

              {/* only for mobile */}
              <div className="flex items-center lg:hidden ">
                <div className="flex items-center gap-2">
                  {user?.loggedIn && (
                    <button
                      type="button"
                      onClick={() => setIsMobileSidebarOpen(true)}
                      className="rounded-md px-2 py-1 text-sm font-medium text-black border border-[#E6E6E6]"
                      aria-label="Open app sidebar"
                    >
                      <IoMdMenu />
                    </button>
                  )}
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
                                      {t("pageLayout.listProperty")}
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
                                            {itm.menuKey === "myProject" ? (
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
                      {t("pageLayout.login")}
                    </Link>

                    <Link
                      to="/Signup"
                      className="bg-white border border-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-[#47525E] font-bold ms-2 inline-block"
                    >
                      {t("pageLayout.signup")}
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
                        {t("pageLayout.login")}
                      </Link>

                      <Link
                        to="/Signup"
                        className="bg-white border border-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-[#47525E] font-bold ms-2 inline-block"
                      >
                        {t("pageLayout.signup")}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </header>

        {/* Sidebar — visible only for logged-in users on desktop */}
        {user?.loggedIn && (
          <Sidebar
            mobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
            onWidthChange={setSidebarWidth}
          />
        )}

        <main
          className="pageContent pb-24 transition-all duration-300"
          style={{ marginLeft: contentOffset }}
        >
          {children}
        </main>

        <footer
          className={`transition-all duration-300 ${user?.loggedIn ? "bg-white border-t border-[#EDE8F5] py-4 px-4 lg:px-8" : "bg-black xl:py-12 xl:px-20 px-8 py-6"}`}
          style={{ marginLeft: contentOffset }}
        >
          {user?.loggedIn ? (
            <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-between">
              <p className="text-[#47525E] text-[13px] font-[500]">
                Bookaroo SAS - 2024
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-[12px] text-[#6B7280]">
                <span className="hover:text-[#976DD0] cursor-pointer">{t("pageLayout.cookies")}</span>
                <span className="text-[#D1D5DB]">|</span>
                <span className="hover:text-[#976DD0] cursor-pointer">{t("pageLayout.terms")}</span>
                <span className="text-[#D1D5DB]">|</span>
                <span className="hover:text-[#976DD0] cursor-pointer">{t("pageLayout.privacy")}</span>
              </div>
            </div>
          ) : (
            <div className="container items-center mx-auto">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 text-center flex items-center justify-center flex-col">
                  <h4 className="text-white font-[600] mb-5 text-[18px]">
                    Find us on:
                  </h4>
                  <ul className="flex items-center mb-5">
                    <li className=" text-center cursor-pointer lg:px-7 px-2">
                      <a href="#" className="">
                        <img
                          src="assets/img/footer/ins.png"
                          alt=""
                          className="text-white w-[25px]"
                        />
                      </a>
                    </li>
                    <li className="  text-center cursor-pointer lg:px-7 px-2  ">
                      <a href="#">
                        <img
                          src="assets/img/footer/fb.png"
                          alt=""
                          className="text-white w-[25px]"
                        />
                      </a>
                    </li>
                    <li className="  text-center cursor-pointer lg:px-7 px-2  ">
                      <a href="#">
                        <img
                          src="assets/img/footer/twitter.png"
                          alt=""
                          className="text-white w-[20px]"
                        />
                      </a>
                    </li>
                    <li className="  text-center cursor-pointer lg:px-7 px-2  ">
                      <a href="#">
                        <img
                          src="assets/img/footer/linkedin.png"
                          alt=""
                          className="text-white w-[25px]"
                        />
                      </a>
                    </li>
                    <li className="  text-center cursor-pointer lg:px-7 px-2  ">
                      <a href="#">
                        <img
                          src="assets/img/footer/youtube.png"
                          alt=""
                          className="text-white w-[25px]"
                        />
                      </a>
                    </li>
                  </ul>
                  <p className="h-[1px] bg-white w-full block mt-5"></p>
                </div>

                <div className="col-span-12 mt-3   ">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 lg:col-span-3">
                      <h2 className="text-white font-bold text-lg mb-2">
                        COMPANY
                      </h2>
                      <ul>
                        <li className=" text-gray-300 group">
                          <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
                            Who are we?
                          </p>
                        </li>
                        <li className=" text-gray-300 group">
                          <p
                            onClick={() =>
                              window.open(
                                "/contact-us",
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]"
                          >
                            Contact us
                          </p>
                        </li>
                        <li className=" text-gray-300 group">
                          <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
                            We are hiring
                          </p>
                        </li>
                        <li className=" text-gray-300 group">
                          <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
                            Press
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="col-span-12 lg:col-span-3">
                      <h2 className="text-white font-bold text-lg mb-2">
                        OUR APPS
                      </h2>
                      <ul>
                        <li className=" text-gray-300 group">
                          <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
                            Discover our apps
                          </p>
                        </li>
                        <li className="flex items-center">
                          <a href="#">
                            <img
                              src="assets/img/footer/apple.png"
                              alt=""
                              className="text-white w-[25px]"
                            />
                          </a>
                          <a href="#" className="ms-5">
                            <img
                              src="assets/img/footer/android.png"
                              alt=""
                              className="text-white w-[24px]"
                            />
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-span-12 lg:col-span-3">
                      <h2 className="text-white font-bold text-lg mb-2">
                        PRO SERVICES
                      </h2>
                      <ul>
                        <li className=" text-gray-300 group">
                          <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
                            Services for pros
                          </p>
                        </li>
                        <li className=" text-gray-300 group">
                          <p className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]">
                            Client access
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="col-span-12 lg:col-span-3">
                      <h2 className="text-white font-bold text-lg mb-2">
                        MORE SERVICES
                      </h2>
                      <ul>
                        <li className=" text-gray-300 group">
                          <p
                            onClick={() => navigate("/prolist")}
                            className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]"
                          >
                            Real estate pro repository
                          </p>
                        </li>
                        <li className=" text-gray-300 group">
                          <p
                            onClick={() => navigate("/past-transation-list")}
                            className="text-gray-300 group-hover:text-white cursor-pointer mb-2 xl:text-[16px] text-[14px]"
                          >
                            Past transaction repository
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 ">
                  <p className="h-[1px] bg-white w-full block mt-5"></p>
                  <h5 className="text-white font-normal text-center w-full block font-bold  mt-10">
                    Bookaroo SAS - 2024
                  </h5>
                  <p className="text-gray-300 font-normal text-center w-full block xl:text-[16px] text-[14px] my-2">
                    Cookies setting
                  </p>
                  <p className="text-gray-300 font-normal text-center w-full block xl:text-[16px] text-[14px] my-2">
                    Terms and conditions of use
                  </p>
                  <p className="text-gray-300 font-normal text-center w-full block xl:text-[16px] text-[14px] my-2">
                    General Data Protection Policy
                  </p>
                  <p className="text-gray-300 font-normal text-center w-full block xl:text-[16px] text-[14px] my-2">
                    How our site works
                  </p>
                </div>
              </div>
            </div>
          )}
        </footer>
      </div>
    </>
  );
};
export default PageLayout;
