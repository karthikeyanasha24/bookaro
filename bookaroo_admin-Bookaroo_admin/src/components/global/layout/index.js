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
  const [isOpen, setIsopen] = useState(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    return saved === null ? false : saved === "true";
  });
  const dispatch = useDispatch()
  const sidebarWidth = isOpen ? 64 : 260;
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
      icon: <MdDashboard className="shrink-0 text-[18px]" />,
      url: "/dashboard",
      key: "",
    },
    {
      name: "Staff",
      icon: <RiUser2Fill className="shrink-0 text-[18px]" />,
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
      icon: <FaUserAlt className="shrink-0 text-[18px]" />,
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
      icon: <BiSolidSchool className="shrink-0 text-[18px]" />,
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
      icon: <MdDomainVerification className="shrink-0 text-[18px]" />,
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
      icon: <FaVideo className="shrink-0 text-[18px]" />,
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
      icon: <PiToolboxFill className="shrink-0 text-[18px]" />,
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
      icon: <MdFeaturedPlayList className="shrink-0 text-[18px]" />,
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
      icon: <MdFeaturedPlayList className="shrink-0 text-[18px]" />,
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
      icon: <FaBlogger className="shrink-0 text-[18px]" />,
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
      icon: <FaFile className="shrink-0 text-[18px]" />,
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
      icon: <RiHomeWifiFill className="shrink-0 text-[18px]" />,
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
      icon: <RiContactsBook3Fill className="shrink-0 text-[18px]" />,
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
    //   icon: <RiContactsBook3Fill className="shrink-0 text-[18px]" />,
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
      icon: <MdReviews className="shrink-0 text-[18px]" />,
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
      icon: <MdHomeRepairService className="shrink-0 text-[18px]" />,
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
      icon: <MdHomeRepairService className="shrink-0 text-[18px]" />,
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
      icon: <FaCircleQuestion className="shrink-0 text-[18px]" />,
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
      icon: <TbCircleDotFilled className="shrink-0 text-[18px]" />,
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

  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", String(isOpen));
  }, [isOpen]);

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
        {/* Fills gap above sidebar (header starts at sidebarWidth; this keeps brand column continuous) */}
        <div
          className="fixed left-0 top-0 z-[25] flex items-center justify-center border-b border-white/15 bg-[#976DD0] px-2 shadow-sm"
          style={{ width: sidebarWidth, height: 71 }}
          aria-hidden="true"
        >
          {isOpen ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 p-1 shadow-sm" title="Bookaroo">
              <img src="/assets/img/logo.png" alt="" className="h-7 w-7 object-contain" />
            </div>
          ) : (
            <div className="w-full max-w-[220px] rounded-[10px] bg-white/95 p-2 shadow-sm">
              <img src="/assets/img/logo.png" alt="Bookaroo" className="h-7 w-full max-w-[200px] object-contain object-left" />
            </div>
          )}
        </div>
        <Header isOpen={isOpen} setIsOpen={setIsopen} particularData={particularData} sidebarWidth={sidebarWidth} />
        <div className="main-wrapper">
          <aside
            className="main-sidebar transition-[width] duration-300 fixed left-0 bg-[#976DD0]"
            style={{ top: 71, height: "calc(100vh - 71px)", width: sidebarWidth, zIndex: 20 }}
          >
            <Sidebar isOpen={isOpen} menus={menus} />
          </aside>
          <main
            className="main"
            style={{ marginLeft: sidebarWidth, width: `calc(100% - ${sidebarWidth}px)` }}
          >
            <div ref={scrollRef} className="mainarea">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
});
export default Layout;
