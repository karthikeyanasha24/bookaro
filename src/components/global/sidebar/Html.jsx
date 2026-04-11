import styles from "./index.module.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { logout } from "../../../actions/user";
import { useDispatch } from "react-redux";
import methodModel from "../../../methods/methods";
import { LuLogOut } from "react-icons/lu";
import { HiChevronLeft, HiChevronRight, HiChevronDown } from "react-icons/hi2";
import { MdDashboard, MdSearch, MdEmail, MdFavorite, MdPerson, MdTrendingUp, MdBook, MdCalculate, MdLocalOffer, MdBusiness, MdHome, MdWarning, MdSettings, MdHelpCenter } from "react-icons/md";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Html = ({
  ListItemLink,
  tabclass,
  isAllow,
  route,
  isOpen = true,
  onToggle = () => {},
  user,
  menus,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useNavigate();
  const [expandedSections, setExpandedSections] = useState({});

  const activecls = (tab) => {
    const url = window.location.href;
    let value = false;
    tab?.forEach((itm) => {
      if (url.includes(itm)) {
        value = true;
      }
    });
    return value;
  };

  const Logout = () => {
    dispatch(logout());
    localStorage.removeItem("persist:admin-app");
    localStorage.removeItem("token");
    history("/login");
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Menu item component
  const MenuItem = ({ icon: Icon, label, url, isCollapsed }) => (
    <NavLink
      to={url || "#"}
      className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
    >
      <Icon className="menu-icon" size={20} />
      {!isCollapsed && <span className="menu-label">{label}</span>}
    </NavLink>
  );

  // Section header with toggle
  const SectionHeader = ({ icon: Icon, label, sectionId, isCollapsed, hasSubitems = true }) => (
    <div 
      className="section-header"
      onClick={() => hasSubitems && toggleSection(sectionId)}
      style={{ cursor: hasSubitems ? 'pointer' : 'default' }}
    >
      {isCollapsed ? (
        <Icon className="section-icon" size={24} />
      ) : (
        <>
          <div className="section-title-wrapper">
            <Icon className="section-icon" size={20} />
            <span className="section-title">{label}</span>
          </div>
          {hasSubitems && (
            <HiChevronDown 
              className={`section-chevron ${expandedSections[sectionId] ? 'expanded' : ''}`}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <div className={`sidebar-wrapper ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      {/* Sidebar Header with Logo and Toggle */}
      <div className="sidebar-header">
        <div className="logo-section">
          {isOpen && (
            <>
              <img 
                src="/assets/img/logo.png" 
                alt="Logo" 
                className="sidebar-logo"
              />
              <p className="sidebar-tagline">Your tagline</p>
            </>
          )}
        </div>
        
        {/* Toggle Button - for Desktop, shown inside sidebar */}
        <button 
          onClick={onToggle}
          className="toggle-btn hidden md:block"
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <HiChevronLeft /> : <HiChevronRight />}
        </button>
      </div>

      {/* Sidebar Menu - Complete Navigation */}
      <nav className="sidebar-menu">
        {/* Main Items */}
        <div className="menu-section">
          <MenuItem icon={MdHome} label={t('navigation.onboarding')} url="#" isCollapsed={!isOpen} />
          <MenuItem icon={MdHome} label={t('navigation.dashboard')} url="/dashboard" isCollapsed={!isOpen} />
          <MenuItem icon={MdSearch} label={t('navigation.searchProperties')} url="/properties?search=true" isCollapsed={!isOpen} />
          <MenuItem icon={MdEmail} label={t('navigation.messages')} url="/chat" isCollapsed={!isOpen} />
          <MenuItem icon={MdBusiness} label={t('navigation.onDemandRealtors')} url="#" isCollapsed={!isOpen} />
        </div>

        <div className="menu-divider"></div>

        {/* Market Insights Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdTrendingUp}
            label={t('navigation.marketInsights')}
            sectionId="marketInsights"
            isCollapsed={!isOpen}
          />
          {(expandedSections.marketInsights || !isOpen) && (
            <div className="section-items">
              <MenuItem icon={MdWarning} label={t('navigation.transactions')} url="/past-transactions" isCollapsed={!isOpen} />
              <MenuItem icon={MdHome} label={t('navigation.buildingPermits')} url="/building-permit" isCollapsed={!isOpen} />
              <MenuItem icon={MdBusiness} label={t('navigation.realEstatePros')} url="/real-estate-pros" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* Learning Center Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdBook}
            label={t('navigation.learningCenter')}
            sectionId="learning"
            isCollapsed={!isOpen}
          />
          {(expandedSections.learning || !isOpen) && (
            <div className="section-items">
              <MenuItem icon={MdBook} label={t('navigation.writtenTraining')} url="/blog-detail" isCollapsed={!isOpen} />
              <MenuItem icon={MdBook} label={t('navigation.videoTraining')} url="/training" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* P2P Estimation Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdCalculate}
            label={t('navigation.p2pEstimation')}
            sectionId="estimation"
            isCollapsed={!isOpen}
          />
          {(expandedSections.estimation || !isOpen) && (
            <div className="section-items">
              <MenuItem icon={MdCalculate} label={t('navigation.estimateProperties')} url="/estimation" isCollapsed={!isOpen} />
              <MenuItem icon={MdLocalOffer} label={t('navigation.campaignManager')} url="/social-estimation" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* Transaction Management Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdSearch}
            label={t('navigation.transactionManagement')}
            sectionId="transactionMgmt"
            isCollapsed={!isOpen}
          />
          {(expandedSections.transactionMgmt || !isOpen) && (
            <div className="section-items">
              <MenuItem icon={MdSearch} label={t('navigation.searcher')} url="/real-estate-transaction-searcher" isCollapsed={!isOpen} />
              <MenuItem icon={MdPerson} label={t('navigation.owner')} url="/real-estate-transaction-owner" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* Property Seeker Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdSearch}
            label={t('navigation.propertySeeker')}
            sectionId="propertySeeker"
            isCollapsed={!isOpen}
          />
          {(expandedSections.propertySeeker || !isOpen) && (
            <div className="section-items">
              <MenuItem icon={MdWarning} label={t('navigation.searchAlerts')} url="/serach-alert" isCollapsed={!isOpen} />
              <MenuItem icon={MdFavorite} label={t('navigation.followedProperties')} url="/followed-properties" isCollapsed={!isOpen} />
              <MenuItem icon={MdFavorite} label={t('navigation.interactedProperties')} url="/properties?favourites=true" isCollapsed={!isOpen} />
              <MenuItem icon={MdHome} label={t('navigation.renterFile')} url="/renter-file" isCollapsed={!isOpen} />
              <MenuItem icon={MdHome} label={t('navigation.buyerFile')} url="/buyer-file" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* Property Manager Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdHome}
            label={t('navigation.propertyManager')}
            sectionId="properties"
            isCollapsed={!isOpen}
          />
          {(expandedSections.properties || !isOpen) && (
            <div className="section-items">
              <MenuItem icon={MdHome} label={t('navigation.myProperties')} url="/my-properties" isCollapsed={!isOpen} />
              <MenuItem icon={MdHome} label={t('navigation.sellerFile')} url="/seller-file" isCollapsed={!isOpen} />
              <MenuItem icon={MdHome} label={t('navigation.qrCode')} url="#" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* Company Profile Item */}
        <div className="menu-section">
          <MenuItem icon={MdBusiness} label={t('navigation.companyProfile')} url="https://app.anyhomes.fr/profile/" isCollapsed={!isOpen} />
        </div>
      </nav>

      {/* Sidebar Footer - User Profile */}
      <div className="sidebar-footer">
        <button 
          onClick={() => Logout()}
          className="logout-btn"
          title={t('header.logout')}
        >
          <LuLogOut className="menu-icon" />
          {isOpen && <span>{t('header.logout')}</span>}
        </button>
        
        <NavLink
          to={"/profile/Account"}
          className="profile-link"
        >
          <img
            alt="profile"
            src={methodModel.userImg(user?.image)}
            className="profile-avatar"
          />
          {isOpen && <span className="profile-name">{user?.fullName || "User"}</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Html;
