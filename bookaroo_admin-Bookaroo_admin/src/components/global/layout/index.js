import { memo, useEffect, useRef, useState } from "react";
import { AiOutlinePullRequest } from "react-icons/ai";
import { BsHouseDoor } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaBlogger, FaFile, FaRegDotCircle, FaRegFile, FaRegQuestionCircle, FaRegStar, FaUserAlt, FaVideo } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";
import { FiLock } from "react-icons/fi";
import { GoDuplicate } from "react-icons/go";
import { LuCircleDotDashed, LuLogOut, LuUser2 } from "react-icons/lu";
import { MdCategory, MdContentPaste, MdDashboard, MdDomainVerification, MdFeaturedPlayList, MdHomeRepairService, MdOutlineFeaturedPlayList, MdOutlineHomeRepairService, MdOutlinePayments, MdOutlineRealEstateAgent, MdReviews } from "react-icons/md";
import { PiHouse, PiToolbox, PiToolboxFill } from "react-icons/pi";
import { RiBloggerLine, RiContactsBook3Fill, RiContactsBook3Line, RiHomeWifiFill, RiUser2Fill } from "react-icons/ri";
import { SiExpensify } from "react-icons/si";
import { BiSolidSchool } from "react-icons/bi";
import { TbCircleDotFilled, TbCreditCardPay } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../actions/user";
import methodModel from "../../../methods/methods";
import { globalLogout } from "../../../models/string.models";
import Header from "../header";
import Sidebar from "../sidebar";
import "./style.scss";
import { IoSearchSharp } from "react-icons/io5";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Layout = memo(function Layout({ children }) {
  const user = useSelector((state) => state.user);
  const history = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);
  const [isOpen, setIsopen] = useState(false);
  const dispatch = useDispatch()
  // const [reviewPropCount, setReviewPropCount] = useState(0);
  const Logout = () => {
    dispatch(logout());
    globalLogout()
    history("/login");
  };
  // const getProps = () => {
  //   let filter = {
  //     add_more_step: true,
  //     maxDistance: 0,
  //     userLat: "",
  //     userLng: "",
  //     request_status: "",
  //   }

  //   ApiClient.get("property/listing", filter).then((res) => {
  //     if (res.success) {
  //       setReviewPropCount(res.data?.length);
  //     }
  //   });
  // };

  const menus = [
    {
      name: "Dashboard",
      icon: <MdDashboard className="text-white text-[16px]" />,
      url: "/dashboard",
      key: "",
    },
    {
      name: "Staff",
      icon: <RiUser2Fill className="text-white text-[16px]" />,
      url: "/staff",
      key: "readstaff",
      menu: [
        {
          name: "Staff",
          icon: <LuUser2 className=" text-[14px] me-2 text-[16px]" />,
          url: "/staff",
          key: "readstaff",
        },
      ],
    },
    {
      name: "Users",
      icon: <FaUserAlt className="text-white text-[16px]" />,
      url: "/user",
      key: "readuser",
      menu: [
        {
          name: "Users",
          icon: <LuUser2 className=" text-[14px] me-2 text-[16px]" />,
          url: "/user",
          key: "",
        },
        {
          name: "Reported Users",
          icon: <LuUser2 className=" text-[14px] me-2 text-[16px]" />,
          url: "/user-report",
        },
      ],
    },

    {
      name: "School",
      icon: <BiSolidSchool className="text-white text-[16px]" />,
      url: "/schoolproperty",
      tab: "school-property",
      key: "readschoolproperty",
      menu: [
        {
          name: "School",
          icon: <BiSolidSchool className="me-2 text-[16px]" />,
          url: "/schoolproperty",
          // key: "readCategory",
        },

      ],
    },
    {
      name: "Document Verification",
      icon: <MdDomainVerification className="text-white text-[16px]" />,
      url: "/verification",
      tab: "user-verification",
      key: "readverification",
      menu: [
        {
          name: "Document Verification",
          icon: <MdDomainVerification className="me-2 text-[16px]" />,
          url: "/verification",
          // key: "readCategory",
        },

      ],
    },
    {
      name: "Funnel Videos",
      icon: <FaVideo className="text-white text-[16px]" />,
      url: "/funnelvideo",
      tab: "funnel-video",
      key: "readvideos",
      menu: [
        {
          name: "Funnel Videos",
          icon: <FaVideo className="me-2 text-[16px]" />,
          url: "/funnelvideo",
          // key: "readCategory",
        },

      ],
    },
    {
      name: "Company",
      icon: <PiToolboxFill className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/company",
      key: "readcompany",
      menu: [
        {
          name: "Company",
          icon: <PiToolbox className="me-2 text-[16px]" />,
          url: "/company",
          key: "",
        },
      ]
    },
    {
      name: "Amenities",
      icon: <MdFeaturedPlayList className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/amenities",
      key: "readamenities",
      menu: [
        {
          name: "Amenities",
          icon: <MdOutlineFeaturedPlayList className="me-2 text-[16px]" />,
          url: "/amenities",
          key: "",
        },
      ]
    },
    {
      name: "Forms",
      icon: <MdFeaturedPlayList className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/category-form",
      key: "readform",
      menu: [
        {
          name: "Forms",
          icon: <GoDuplicate className="me-2 text-[16px]" />,
          url: "/category-form",
          key: "readreadform",
        },
      ]
    },

    {
      name: "Blogs",
      icon: <FaBlogger className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/blog",
      key: "readblogs",
      menu: [
        {
          name: "Blogs",
          icon: <RiBloggerLine className="me-2 text-[16px]" />,
          url: "/blog",
          key: "",
        },
        {
          name: "Category",
          icon: <GoDuplicate className="me-2 text-[16px]" />,
          url: "/blog-category-type",
          // key: "readCategory",
        },
        {
          name: "Sub Category",
          icon: <MdContentPaste className="me-2 text-[16px]" />,
          url: "/blog-category",
          // key: "readcategory",
        },

      ]
    },
    {
      name: "Content Management",
      icon: <FaFile className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/contentmanagement",
      key: "readcontentmanagement",
      menu: [
        {
          name: "Content Management",
          icon: <FaRegFile className="me-2 text-[16px]" />,
          url: "/contentmanagement",
          key: "",
        },
      ]
    },
    {
      name: "Properties",
      icon: <RiHomeWifiFill className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/property",
      // key: "readproperties",
      menu: [
        {
          name: "Properties",
          icon: <PiHouse className="me-2 text-[16px]" />,
          url: "/property",
        },
        // ...(reviewPropCount > 0
        //   ? [
        {
          name: "Claim Ownership Request",
          icon: <MdOutlineHomeRepairService className="me-2 text-[16px]" />,
          url: "/property-claim-ownership",
        },
        {
          name: "Property Removal",
          icon: <AiOutlinePullRequest className="me-2 text-[16px]" />,
          url: "/property-requests",
        },
        // ] : []),
        {
          name: "State Type",
          icon: <MdOutlineRealEstateAgent className="me-2 text-[16px]" />,
          url: "/property-state",
        },
        {
          name: "Revenue Type",
          icon: <MdOutlinePayments className="me-2 text-[16px]" />,
          url: "/property-revenue",
          // key: "",
        },
        {
          name: "Revenue Source",
          icon: <TbCreditCardPay className="me-2 text-[16px]" />,
          url: "/property-revenue-source",
          // key: "",
        },
        {
          name: "Expense Type",
          icon: <SiExpensify className="me-2 text-[16px]" />,
          url: "/property-expense",
          // key: "",
        },
        {
          name: "Renovation Type",
          icon: <BsHouseDoor className="me-2 text-[16px]" />,
          url: "/property-renovation",
          // key: "",
        },
        {
          name: "Ratings Type",
          icon: <FaRegStar className="me-2 text-[16px]" />,
          url: "/property-ratings",
          // key: "",
        },
        {
          name: "Preset Searches",
          icon: <IoSearchSharp className="me-2 text-[16px]" />,
          url: "/property-quick-search",
          // key: "",
        },
      ]
    },
    {
      name: "Enquiry",
      icon: <RiContactsBook3Fill className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/enquiry",
      // key: "readfaq",
      menu: [
        {
          name: "Enquiry",
          icon: <RiContactsBook3Line className="me-2 text-[16px]" />,
          url: "/enquiry",
          key: "",
        },
      ]
    },
    // {
    //   name: "Preset Searches",
    //   icon: <RiContactsBook3Fill className="text-[#fff] shrink-0 text-[16px]" />,
    //   url: "/presetSearch",
    //   // key: "readfaq",
    //   menu: [
    //     {
    //       name: "Preset Searches",
    //       icon: <RiContactsBook3Line className="me-2 text-[16px]" />,
    //       url: "/presetSearch",
    //       key: "",
    //     },
    //   ]
    // },
    {
      name: "Reviews",
      icon: <MdReviews className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/review",
      // key: "readfaq",
      menu: [
        {
          name: "Reviews",
          icon: <MdReviews className="me-2 text-[16px]" />,
          url: "/review",
          key: "",
        },
        {
          name: "Company Reviews",
          icon: <MdReviews className="me-2 text-[16px]" />,
          url: "/review-company",
          key: "",
        },
      ]
    },

    {
      name: "Services",
      icon: <MdHomeRepairService className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/service",
      // key: "readfaq",
      menu: [
        {
          name: "Services",
          icon: <MdOutlineHomeRepairService className="me-2 text-[16px]" />,
          url: "/service",
          key: "",
        },
      ]
    },
    {
      name: "Setting",
      icon: <MdHomeRepairService className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/admin-setting",
      // key: "readfaq",
      menu: [
        {
          name: "Admin Setting",
          icon: <MdOutlineHomeRepairService className="me-2 text-[16px]" />,
          url: "/admin-setting",
          key: "",
        },
      ]
    },
    {
      name: "FAQ",
      icon: <FaCircleQuestion className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/faq",
      // key: "readfaq",
      menu: [
        {
          name: "FAQ",
          icon: <FaRegQuestionCircle className="me-2 text-[16px]" />,
          url: "/faq",
          key: "",
        },
      ]
    },
    {
      name: "Plans",
      icon: <TbCircleDotFilled className="text-[#fff] shrink-0 text-[16px]" />,
      url: "/plan",
      menu: [
        {
          name: "Plans",
          icon: <FaRegDotCircle className="me-2 text-[16px]" />,
          url: "/plan",
        },
        {
          name: "Plan Features",
          icon: <LuCircleDotDashed className="me-2 text-[16px]" />,
          url: "/plan-feature",
        },
      ]
    }
  ];

  const particularData = menus.filter((data) => {
    return location?.pathname?.includes(data?.url);
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history("/login");
    }
    // getProps()
  }, []);

  const logowhite = () => {
    let value = "/assets/img/logo.png";
    return value;
  };

  const logos = () => {
    let value = "/assets/img/logo.png";
    return value;
  };

  const router = () => {
    let route = localStorage.getItem("route");
    history(route);
  };
  const { pathname } = useLocation();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <>
      <div component="layout">
        {/* <div onClick={(e) => router()} id="routerDiv"></div> */}
        <Header isOpen={isOpen} setIsOpen={setIsopen} particularData={particularData} />
        <div className={`main-wrapper flex ${isOpen ? "active-sidebar" : ""}`}>
          <div
            className={
              location.pathname != "/dashboard"
                ? "main-sidebar  transition-[width] duration-300 flex"
                : "main-sidebar  transition-[width] duration-300 flex sidebar-minimize"
            }
          >
            <div className="w-[50px] h-screen bg-[#976DD0] fixed ">
              {/* <img src={logos()} className="" /> */}

              <Sidebar isOpen={isOpen} menus={menus} />
            </div>
            {location.pathname != "/dashboard" && (
              <div className={isOpen ? "sidebar-hide d-none" : "bg-white ml-[49px] sidebar-brand text-center  w-[230px] h-full"} >


                <div className="h-[71px]  border-b p-[9px] flex justify-between">
                  <img src={logos()} className="" />
                  {/* <h4 className="ms-2 text-[22px] font-medium">{particularData?.[0]?.name}</h4> */}
                </div>

                {particularData.map((data) => (
                  <>
                    <ul>
                      {data?.menu?.map((tab) => {
                        return (
                          <li className="m-2 ">
                            <NavLink
                              to={tab.url}
                              className={
                                location.pathname != tab.url
                                  ? "flex items-center py-2 px-3 block text-[#413e3e] text-[14px] text-left rounded-md"
                                  : "bg-[#7bbeb82e] flex items-center py-2 px-3 block text-[#413e3e] text-[14px] text-left rounded-md"
                              }
                            >
                              {tab?.icon}
                              {tab?.name}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ))}

                {location.pathname.includes("/profile") && (
                  <ul>
                    <li className="m-2 ">
                      <NavLink
                        to={"/profile"}
                        className={
                          location.pathname != "/profile"
                            ? "flex items-center py-2 px-3 block text-[#413e3e] text-[14px] text-left rounded-md"
                            : "bg-[#7bbeb82e] flex items-center py-2 px-3 block text-[#413e3e] text-[14px] text-left rounded-md"
                        }
                      >
                        <CgProfile className="me-2" />
                        Profile
                      </NavLink>
                    </li>
                    <li className="m-2 ">
                      <NavLink
                        to={"/profile/change-password"}
                        className={
                          location.pathname != "/profile/change-password"
                            ? "flex items-center py-2 px-3 block text-[#413e3e] text-[14px] text-left rounded-md"
                            : "bg-[#7bbeb82e] flex items-center py-2 px-3 block text-[#413e3e] text-[14px] text-left rounded-md"
                        }
                      >
                        <FiLock className="me-2" />

                        Change Password
                      </NavLink>
                    </li>
                    <li className="m-2 ">
                      <span
                        // id="logoutBtn"
                        onClick={() => Logout()}
                        className={classNames(
                          "block w-full px-3 py-2 text-left text-sm  flex items-center gap-2 cursor-pointer text-[#976DD0]"
                        )}
                      >
                        <LuLogOut /> Logout
                      </span>
                    </li>

                  </ul>
                )}

                {user?.logo ? (
                  <div
                    className="flex justify-center"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={methodModel.userImg(user?.logo || "")}
                      alt="photo"
                      width="40"
                      height="40"
                      style={{
                        width: "40px",
                        marginBottom: "2px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <main
            className={
              location.pathname != "/dashboard" ? "main" : "main-add main"
            }
          >
            <div ref={scrollRef} className="mainarea">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
});
export default Layout;
