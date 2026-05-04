import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  LuRocket,
  LuHouse,
  LuSearch,
  LuMail,
  LuCircle,
  LuLightbulb,
  LuSchool,
  LuChartLine,
  LuWrench,
  LuGlasses,
  LuBuilding2,
  LuBuilding,
} from "react-icons/lu";

const HEADER_HEIGHT = 72;

const Sidebar = ({ mobileOpen = false, onMobileClose = () => {}, onWidthChange = () => {} }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const iconCls = "text-[18px] flex-shrink-0";

  const navItems = [
    { label: t("sidebar.onboarding"), icon: <LuRocket className={iconCls} />, path: "/onboarding" },
    { label: t("sidebar.dashboard"), icon: <LuHouse className={iconCls} />, path: "/dashboard" },
    { label: t("sidebar.searchProperties"), icon: <LuSearch className={iconCls} />, path: "/properties" },
    { label: t("sidebar.messages"), icon: <LuMail className={iconCls} />, path: "/chat" },
    {
      label: t("sidebar.onDemandPros"),
      icon: <LuCircle className={iconCls} />,
      children: [
        { label: t("sidebar.findService"), path: "/directory" },
        { label: t("sidebar.favoriteProfessionals"), path: "/real-estate-pros" },
        { label: t("sidebar.myPurchases"), path: "/past-transactions?tab=purchases" },
      ],
    },
    {
      label: t("sidebar.marketInsights"),
      icon: <LuLightbulb className={iconCls} />,
      children: [
        { label: t("sidebar.historicalTransactions"), path: "/past-transactions?tab=history" },
        { label: t("sidebar.buildingPermits"), path: "/building-permit" },
        { label: t("sidebar.realEstateAgency"), path: "/prolist" },
      ],
    },
    {
      label: t("sidebar.learningCenter"),
      icon: <LuSchool className={iconCls} />,
      children: [
        { label: t("sidebar.writtenTraining"), path: "/blog-detail" },
        { label: t("sidebar.videoTraining"), path: "/training" },
      ],
    },
    {
      label: t("sidebar.p2pEstimation"),
      icon: <LuChartLine className={iconCls} />,
      children: [
        { label: t("sidebar.estimateProperties"), path: "/estimation" },
        { label: t("sidebar.campaignManager"), path: "/social-estimation" },
      ],
    },
    {
      label: t("sidebar.transactionTool"),
      icon: <LuWrench className={iconCls} />,
      children: [
        { label: t("sidebar.searcher"), path: "/real-estate-transaction-searcher" },
        { label: t("sidebar.owner"), path: "/real-estate-transaction-owner" },
      ],
    },
    {
      label: t("sidebar.propertySeeker"),
      icon: <LuGlasses className={iconCls} />,
      children: [
        { label: t("sidebar.searchAlerts"), path: "/serach-alert" },
        { label: t("sidebar.propertiesFollowed"), path: "/followed-properties" },
        { label: t("sidebar.propertiesInteracted"), path: "/properties?favourites=true" },
        { label: t("sidebar.renterFile"), path: "/renter-file" },
        { label: t("sidebar.buyerFile"), path: "/buyer-file" },
      ],
    },
    {
      label: t("sidebar.propertyManager"),
      icon: <LuBuilding2 className={iconCls} />,
      children: [
        { label: t("sidebar.myProperties"), path: "/my-properties" },
        { label: t("sidebar.propertyQrCode"), path: "/my-properties" },
        { label: t("sidebar.sellerFile"), path: "/seller-file" },
      ],
    },
    {
      label: t("sidebar.companyProfile"),
      icon: <LuBuilding className={iconCls} />,
      children: [
        { label: t("sidebar.logoCoverImage"), path: "/profile/company-logo" },
        { label: t("sidebar.companyDetails"), path: "/profile/company-details" },
        { label: t("sidebar.contactDetails"), path: "/profile/contact-details" },
        { label: t("sidebar.aboutCompany"), path: "/profile/about" },
        { label: t("sidebar.services"), path: "/profile/services" },
        { label: t("sidebar.openingHours"), path: "/settings/work-hour" },
        { label: t("sidebar.onDemandService"), path: "/profile/services?tab=ondemand" },
      ],
    },
  ];

  useEffect(() => {
    onWidthChange(collapsed ? 68 : 300);
  }, [collapsed, onWidthChange]);

  const widthClass = collapsed ? "w-[68px]" : "w-[300px]";
  const isActivePath = (path) => {
    if (!path) return false;
    const [basePath, query] = path.split("?");
    if (location.pathname !== basePath) return false;
    if (!query) return true;

    const currentParams = new URLSearchParams(location.search);
    const targetParams = new URLSearchParams(query);
    for (const [key, value] of targetParams.entries()) {
      if (currentParams.get(key) !== value) return false;
    }
    return true;
  };

  useEffect(() => {
    // Auto-open a parent section when one of its children is active
    const next = {};
    navItems.forEach((item) => {
      if (item.children?.some((child) => isActivePath(child.path))) {
        next[item.label] = true;
      }
    });
    setOpenSections((prev) => ({ ...next, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`
          fixed left-0 z-[60] bg-white border-r border-[#EDE8F5]
          flex-col transition-all duration-300 shadow-md
          ${widthClass} overflow-visible
          hidden lg:flex
        `}
        style={{ top: HEADER_HEIGHT, height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
      >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 -right-[16px] w-[32px] h-[32px] rounded-full bg-[#976DD0] text-white flex items-center justify-center shadow-md text-[14px] z-20 border-2 border-white"
      >
        {collapsed ? "›" : "‹"}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => {
          const activeChildIndex = item.children?.findIndex((child) => isActivePath(child.path)) ?? -1;
          const isParentActive =
            item.path && isActivePath(item.path)
              ? true
              : activeChildIndex >= 0;
          return (
            <div key={item.label} className="mb-1">
              <button
                onClick={() => {
                  if (item.children?.length) {
                    setOpenSections((prev) => ({
                      ...prev,
                      [item.label]: !prev[item.label],
                    }));
                    return;
                  }
                  if (item.path) navigate(item.path);
                }}
                title={collapsed ? item.label : ""}
                className={`
                  w-full flex items-center gap-3 px-3 py-[10px] rounded-[10px]
                  text-left transition-all duration-200
                  ${isParentActive
                    ? "bg-[#976DD0] text-white font-[600]"
                    : "text-[#47525E] hover:bg-[#F3EEF9] hover:text-[#976DD0]"
                  }
                `}
              >
                <span className="text-[18px] flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="text-[14px] leading-[18px] flex-1 break-words">{item.label}</span>
                    {item.children?.length ? (
                      <span className={`text-[13px] transition-transform ${openSections[item.label] ? "rotate-180" : ""}`}>
                        ▾
                      </span>
                    ) : null}
                  </>
                )}
              </button>
              {!collapsed && item.children?.length && openSections[item.label] ? (
                <ul className="ml-4 mt-1 mb-2 border-l border-[#E7DDF6] pl-3 space-y-1">
                  {item.children.map((child, childIndex) => (
                    <li key={`${item.label}-${child.label}`}>
                      <button
                        onClick={() => navigate(child.path)}
                        className={`w-full text-left text-[13px] py-[7px] px-3 rounded-[8px] flex items-center gap-2 transition-all duration-200 ${
                          childIndex === activeChildIndex
                            ? "text-[#7F56C6] font-[600] bg-[#F1EAFE] shadow-[inset_0_0_0_1px_#E6DAF7]"
                            : "text-[#5B6472] hover:text-[#7F56C6] hover:bg-[#F7F2FC]"
                        }`}
                      >
                        <span
                          className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                            childIndex === activeChildIndex ? "bg-[#976DD0]" : "bg-[#CDB8EA]"
                          }`}
                        />
                        <span className="leading-[18px]">{child.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>

      {/* User Info at bottom */}
      {!collapsed && user?.loggedIn && (
        <div className="border-t border-[#EDE8F5] p-3">
          <div className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-full bg-[#976DD0] flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0">
              {(user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[12px] font-[600] text-[#47525E] truncate">
                {user?.firstName || user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-[11px] text-[#976DD0] capitalize">
                {(() => {
                  const raw = (user?.accountType || "standard").toLowerCase();
                  const key = ["pro", "individual", "standard"].includes(raw)
                    ? raw
                    : "standard";
                  return t(`accountTypes.${key}`);
                })()}
              </p>
            </div>
          </div>
        </div>
      )}
      </aside>

      {/* Mobile drawer sidebar */}
      {mobileOpen && (
        <>
          <button
            aria-label="Close sidebar overlay"
            onClick={onMobileClose}
            className="fixed inset-0 z-[70] bg-black/40 lg:hidden"
          />
          <aside
            className="fixed top-[72px] left-0 z-[80] h-[calc(100vh-72px)] w-[320px] max-w-[92vw] bg-white border-r border-[#EDE8F5] shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-3 py-3 border-b border-[#EDE8F5]">
              <p className="text-[14px] font-[600] text-[#47525E]">{t("pageLayout.menu")}</p>
              <button
                onClick={onMobileClose}
                className="text-[#47525E] text-[20px] leading-none"
                aria-label="Close sidebar"
              >
                ×
              </button>
            </div>
            <nav className="h-[calc(100%-56px)] overflow-y-auto py-3 px-2">
              {navItems.map((item) => {
                const activeChildIndex = item.children?.findIndex((child) => isActivePath(child.path)) ?? -1;
                const isParentActive =
                  item.path && isActivePath(item.path)
                    ? true
                    : activeChildIndex >= 0;
                return (
                  <div key={`mobile-${item.label}`} className="mb-1">
                    <button
                      onClick={() => {
                        if (item.children?.length) {
                          setOpenSections((prev) => ({
                            ...prev,
                            [item.label]: !prev[item.label],
                          }));
                          return;
                        }
                        if (item.path) {
                          navigate(item.path);
                          onMobileClose();
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-[10px] rounded-[10px] text-left transition-all duration-200
                        ${isParentActive
                          ? "bg-[#976DD0] text-white font-[600]"
                          : "text-[#47525E] hover:bg-[#F3EEF9] hover:text-[#976DD0]"
                        }
                      `}
                    >
                      <span className="text-[18px] flex-shrink-0">{item.icon}</span>
                      <span className="text-[14px] leading-[18px] flex-1 break-words">{item.label}</span>
                      {item.children?.length ? (
                        <span className={`text-[13px] transition-transform ${openSections[item.label] ? "rotate-180" : ""}`}>
                          ▾
                        </span>
                      ) : null}
                    </button>
                    {item.children?.length && openSections[item.label] ? (
                      <ul className="ml-4 mt-1 mb-2 border-l border-[#E7DDF6] pl-3 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <li key={`mobile-${item.label}-${child.label}`}>
                            <button
                              onClick={() => {
                                navigate(child.path);
                                onMobileClose();
                              }}
                              className={`w-full text-left text-[13px] py-[7px] px-3 rounded-[8px] flex items-center gap-2 transition-all duration-200 ${
                                childIndex === activeChildIndex
                                  ? "text-[#7F56C6] font-[600] bg-[#F1EAFE] shadow-[inset_0_0_0_1px_#E6DAF7]"
                                  : "text-[#5B6472] hover:text-[#7F56C6] hover:bg-[#F7F2FC]"
                              }`}
                            >
                              <span
                                className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                                  childIndex === activeChildIndex ? "bg-[#976DD0]" : "bg-[#CDB8EA]"
                                }`}
                              />
                              <span className="leading-[18px]">{child.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
