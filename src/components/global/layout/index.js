import { memo, useEffect, useRef, useState } from "react";
import { AiOutlinePullRequest } from "react-icons/ai";
import { BsHouseDoor } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaBlogger, FaFile, FaRegDotCircle, FaRegFile, FaRegQuestionCircle, FaRegStar, FaRocket, FaUserAlt, FaVideo, FaGraduationCap, FaUsers } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";
import { FiLock, FiActivity } from "react-icons/fi";
import { GoDuplicate } from "react-icons/go";
import { LuCircleDotDashed, LuLogOut, LuUser2 } from "react-icons/lu";
import { MdCategory, MdContentPaste, MdDashboard, MdDomainVerification, MdFeaturedPlayList, MdHomeRepairService, MdOutlineFeaturedPlayList, MdOutlineHomeRepairService, MdOutlineInbox, MdOutlinePayments, MdOutlineRealEstateAgent, MdReviews, MdSettings, MdTrendingUp } from "react-icons/md";
import { PiHouse, PiLeafFill, PiToolbox, PiToolboxFill } from "react-icons/pi";
import { RiBloggerLine, RiContactsBook3Fill, RiContactsBook3Line, RiHomeWifiFill, RiUser2Fill } from "react-icons/ri";
import { SiExpensify } from "react-icons/si";
import { BiSolidSchool } from "react-icons/bi";
import { TbCircleDotFilled, TbCreditCardPay, TbQrcode } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../actions/user";
import methodModel from "../../../methods/methods";
import { globalLogout } from "../../../models/string.models";
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
  const sidebarWidth = isOpen ? 64 : 260;
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
      // Priority order: Dashboard, Users, Company, Property, Marketplace, Financial credibility, Locative confidence, Estimations consolidées
      {
        name: "Dashboard",
        icon: <MdDashboard className="text-white text-[16px]" />,
        url: "/dashboard",
        key: "",
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
          {
            name: "Claim Ownership Request",
            icon: <MdOutlineHomeRepairService className="me-2 text-[16px]" />,
            url: "/property-claim-ownership",
          },
          {
            name: "Property Creation Validation",
            icon: <AiOutlinePullRequest className="me-2 text-[16px]" />,
            url: "/property-requests",
          },
          {
            name: "State Type",
            icon: <MdOutlineRealEstateAgent className="me-2 text-[16px]" />,
            url: "/property-state",
          },
          {
            name: "Revenue Type",
            icon: <MdOutlinePayments className="me-2 text-[16px]" />,
            url: "/property-revenue",
          },
          {
            name: "Revenue Source",
            icon: <TbCreditCardPay className="me-2 text-[16px]" />,
            url: "/property-revenue-source",
          },
          {
            name: "Expense Type",
            icon: <SiExpensify className="me-2 text-[16px]" />,
            url: "/property-expense",
          },
          {
            name: "Renovation Type",
            icon: <BsHouseDoor className="me-2 text-[16px]" />,
            url: "/property-renovation",
          },
          {
            name: "Ratings Type",
            icon: <FaRegStar className="me-2 text-[16px]" />,
            url: "/property-ratings",
          },
          {
            name: "Preset Searches",
            icon: <IoSearchSharp className="me-2 text-[16px]" />,
            url: "/property-quick-search",
          },
        ]
      },
      {
        name: "Marketplace",
        icon: <MdOutlineHomeRepairService className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/marketplace",
        key: "",
        menu: [
          {
            name: "Gestion des services",
            icon: <MdOutlineFeaturedPlayList className="me-2 text-[16px]" />,
            url: "/marketplace/services",
            key: "",
          },
          {
            name: "Partenaires",
            icon: <MdOutlineRealEstateAgent className="me-2 text-[16px]" />,
            url: "/marketplace/partners",
            key: "",
          },
          {
            name: "Services offerts",
            icon: <MdOutlineHomeRepairService className="me-2 text-[16px]" />,
            url: "/marketplace/offered-services",
            key: "",
          },
          {
            name: "Transactions",
            icon: <MdOutlinePayments className="me-2 text-[16px]" />,
            url: "/marketplace/transactions",
            key: "",
          },
          {
            name: "Litiges",
            icon: <MdReviews className="me-2 text-[16px]" />,
            url: "/marketplace/litigations",
            key: "",
          },
          {
            name: "Demandes de service",
            icon: <MdContentPaste className="me-2 text-[16px]" />,
            url: "/marketplace/requests",
            key: "",
          },
          {
            name: "Paramètres",
            icon: <MdSettings className="me-2 text-[16px]" />,
            url: "/marketplace/settings",
            key: "",
          },
        ]
      },
      {
        name: "Financial credibility",
        icon: <TbCreditCardPay className="text-white text-[16px]" />,
        url: "/score/users",
        key: "",
        menu: [
          {
            name: "General scores",
            icon: <LuUser2 className=" text-[14px] me-2 text-[16px]" />,
            url: "/score/users",
            key: "",
          },
          {
            name: "Lead scores",
            icon: <MdOutlinePayments className="me-2 text-[16px]" />,
            url: "/score/interests",
            key: "",
          },
          {
            name: "Parameters",
            icon: <MdSettings className="me-2 text-[16px]" />,
            url: "/score/parameters",
            key: "",
          },
        ],
      },
      {
        name: "Locative confidence",
        icon: <MdOutlineRealEstateAgent className="text-white text-[16px]" />,
        url: "/confidence/users",
        key: "",
        menu: [
          {
            name: "General confidence",
            icon: <LuUser2 className=" text-[14px] me-2 text-[16px]" />,
            url: "/confidence/users",
            key: "",
          },
          {
            name: "Lead confidence",
            icon: <MdOutlinePayments className="me-2 text-[16px]" />,
            url: "/confidence/leads",
            key: "",
          },
        ],
      },
      {
        name: "Lead BizDev",
        icon: <MdTrendingUp className="text-white text-[16px]" />,
        url: "/bizdev-leads",
        key: "",
      },
      {
        name: "P2P Estimations",
        icon: <MdFeaturedPlayList className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/p2p-estimation",
        key: "readEstimation",
        menu: [
          {
            name: "Estimations consolidées",
            icon: <GoDuplicate className="me-2 text-[16px]" />,
            url: "/p2p-estimation",
            key: "readEstimation",
          },
          {
            name: "Campagnes",
            icon: <GoDuplicate className="me-2 text-[16px]" />,
            url: "/p2p-estimation/campaigns",
            key: "readEstimation",
          },
          {
            name: "Price per SQM",
            icon: <GoDuplicate className="me-2 text-[16px]" />,
            url: "/p2p-estimation/price-per-sqm",
            key: "readEstimation",
          },
        ]
      },
      {
        name: "Data Import",
        icon: <MdFeaturedPlayList className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/data",
        key: "readdata",
        menu: [
          {
            name: "Import Past Transactions",
            icon: <GoDuplicate className="me-2 text-[16px]" />,
            url: "/data/import-transactions",
          },
        ],
      },
      {
        name: "MoteurImmo",
        icon: <MdOutlineRealEstateAgent className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/moteur-immo-dashboard",
        key: "",
        menu: [
          {
            name: "Dashboard",
            icon: <FiActivity className="me-2 text-[16px]" />,
            url: "/moteur-immo-dashboard",
            key: "",
          },
          {
            name: "Import report",
            icon: <MdFeaturedPlayList className="me-2 text-[16px]" />,
            url: "/moteur-immo",
            key: "",
          },
          {
            name: "Runs",
            icon: <FiActivity className="me-2 text-[16px]" />,
            url: "/moteur-immo-runs",
            key: "",
          },
          {
            name: "Agency Reveal",
            icon: <FiActivity className="me-2 text-[16px]" />,
            url: "/agency-reveal",
            key: "",
          },
        ],
      },
      {
        name: "LLM Monitoring",
        icon: <MdTrendingUp className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/llm-monitoring",
        key: "",
      },
      {
        name: "QR Codes",
        icon: <TbQrcode className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/qr-code-stats",
        key: "",
      },
      {
        name: "Referral Program",
        icon: <FaUsers className="text-white text-[16px]" />,
        url: "/referral",
        key: "",
        menu: [
          {
            name: "Analytics & Tracking",
            icon: <MdDashboard className="me-2 text-[16px]" />,
            url: "/referral",
            key: "",
          },
        ],
      },

      // Remaining menus (kept in original order)
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
        name: "Onboarding",
        icon: <FaRocket className="text-white text-[16px]" />,
        url: "/onboarding",
        key: "",
        menu: [
          {
            name: "Onboarding",
            icon: <FaRocket className="me-2 text-[16px]" />,
            url: "/onboarding",
            key: "",
          },
        ],
      },
      {
        name: "School",
        icon: <BiSolidSchool className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/schoolproperty",
        tab: "school-property",
        key: "readschoolproperty",
        menu: [
          {
            name: "School",
            icon: <BiSolidSchool className="me-2 text-[16px]" />,
            url: "/schoolproperty",
          },
          {
            name: "School Types",
            icon: <BiSolidSchool className="me-2 text-[16px]" />,
            url: "/school-types",
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
          },
        ],
      },
      {
        name: "Learning Center",
        icon: <FaGraduationCap className="text-white text-[16px]" />,
        url: "/funnelvideo",
        key: "readvideos,readblogs,readpersona",
        menu: [
          {
            name: "Video Content",
            icon: <FaVideo className="me-2 text-[16px]" />,
            url: "/funnelvideo",
          },
          {
            name: "Blogs",
            icon: <RiBloggerLine className="me-2 text-[16px]" />,
            url: "/blog",
            key: "",
          },
          {
            name: "Blog Category",
            icon: <GoDuplicate className="me-2 text-[16px]" />,
            url: "/blog-category-type",
          },
          {
            name: "Blog Sub Category",
            icon: <MdContentPaste className="me-2 text-[16px]" />,
            url: "/blog-category",
          },
          {
            name: "Persona",
            icon: <FaUsers className="me-2 text-[16px]" />,
            url: "/persona",
            key: "readpersona",
          },
          {
            name: "Training Topic",
            icon: <MdCategory className="me-2 text-[16px]" />,
            url: "/training-topic",
            key: "readtrainingtopic",
          },
          {
            name: "Featured content",
            icon: <MdOutlineFeaturedPlayList className="me-2 text-[16px]" />,
            url: "/featured-content",
          },
        ],
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
        name: "Content Management",
        icon: <FaFile className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/contentmanagement",
        key: "readcontentmanagement",
        menu: [
          {
            name: "Content Management",
            icon: <FaRegFile className="me-2 text-[16px]" />,
            url: "/contentmanagement",
          },
        ]
      },
      {
        name: "Enquiry",
        icon: <RiContactsBook3Fill className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/enquiry",
        menu: [
          {
            name: "Enquiry",
            icon: <RiContactsBook3Line className="me-2 text-[16px]" />,
            url: "/enquiry",
            key: "",
          },
        ]
      },
      {
        name: "User Requests",
        icon: <MdOutlineInbox className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/user-requests",
        menu: [
          {
            name: "User Requests",
            icon: <MdOutlineInbox className="me-2 text-[16px]" />,
            url: "/user-requests",
          },
        ]
      },
      {
        name: "Property Attractivity",
        icon: <MdTrendingUp className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/property-attractivity/profile-activity",
        menu: [
          {
            name: "Profile Activity",
            icon: <FiActivity className="me-2 text-[16px]" />,
            url: "/property-attractivity/profile-activity",
          },
          {
            name: "Attractivity Index",
            icon: <MdTrendingUp className="me-2 text-[16px]" />,
            url: "/property-attractivity/attractivity-index",
          },
        ]
      },
      {
        name: "Reviews",
        icon: <MdReviews className="text-[#fff] shrink-0 text-[16px]" />,
        url: "/review",
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

  const isActiveUrl = (url) => {
    const path = location.pathname || "";
    return url && (path === url || path.startsWith(`${url}/`));
  };

  const isActiveMenu = (data) => {
    if (isActiveUrl(data?.url)) return true;
    return (data?.menu || []).some((child) => isActiveUrl(child.url));
  };

  const particularData = menus.filter((data) => isActiveMenu(data));

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history("/login");
    }
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
        <div
          className="fixed left-0 top-0 z-[25] flex items-center justify-center border-b border-white/15 bg-[#976DD0] px-2"
          style={{ width: sidebarWidth, height: 71 }}
          aria-hidden="true"
        >
          {isOpen ? (
            <div className="flex h-14 w-14 items-center justify-center bg-transparent p-1" title="Anyhomes">
              <img src="/assets/img/anyhomes-logo-white.png" alt="Anyhomes" className="h-14 w-14 object-contain" />
            </div>
          ) : (
            <div className="w-full max-w-[220px] bg-transparent p-2">
              <img src="/assets/img/anyhomes-logo-white.png" alt="Anyhomes" className="h-14 w-full max-w-[400px] object-contain object-left" />
            </div>
          )}
        </div>
        <div className="main-wrapper">
          <aside
            className="main-sidebar transition-[width] duration-300 fixed left-0 bg-[#976DD0]"
            style={{ top: 71, height: "calc(100vh - 71px)", width: sidebarWidth, zIndex: 20 }}
          >
            <Sidebar isOpen={isOpen} menus={menus} particularData={particularData} />
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
