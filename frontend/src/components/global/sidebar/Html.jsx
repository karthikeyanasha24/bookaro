import { NavLink, useLocation } from "react-router-dom";
import { HiChevronLeft, HiChevronRight, HiChevronDown } from "react-icons/hi2";
import { MdDashboard, MdSearch, MdEmail, MdFavorite, MdPerson, MdTrendingUp, MdBook, MdCalculate, MdLocalOffer, MdBusiness, MdHome, MdWarning, MdSettings, MdHelpCenter, MdTimeline, MdStorefront, MdShoppingCart, MdSpaceDashboard } from "react-icons/md";
import { FaRocket, FaHeadset, FaBullseye } from "react-icons/fa";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const SECTION_ROUTES = {
  marketInsights: ["/past-transactions", "/building-permit", "/real-estate-pros"],
  learning: ["/blog-detail", "/training"],
  estimation: ["/estimation", "/social-estimation"],
  transactionMgmt: ["/real-estate-transaction-searcher", "/real-estate-transaction-owner"],
  propertySeeker: ["/serach-alert", "/followed-properties", "/properties?favourites=true", "/renter-file", "/buyer-file"],
  properties: ["/my-properties", "/seller-file", "/property/qr-code"],
  marketplace: ["/marketplace", "/marketplace/favorites", "/marketplace/orders", "/pro/marketplace", "/pro/marketplace/sold-services"],
  
};

const Html = ({
  ListItemLink,
  tabclass,
  isAllow,
  route,
  isOpen = true,
  onToggle = () => {},
  menus,
  user,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const isRouteActive = (url) => {
    if (!url || url === "#") return false;

    const [targetPath, targetSearch] = url.split("?");
    if (location.pathname !== targetPath) return false;
    if (!targetSearch) return true;

    const currentParams = new URLSearchParams(location.search);
    const targetParams = new URLSearchParams(targetSearch);

    for (const [key, value] of targetParams.entries()) {
      if (currentParams.get(key) !== value) {
        return false;
      }
    }

    return true;
  };

  const isSectionActive = (sectionId) => {
    return (SECTION_ROUTES[sectionId] || []).some((routeUrl) => isRouteActive(routeUrl));
  };

  const isSectionExpanded = (sectionId) => {
    return isOpen && (isSectionActive(sectionId) || !!expandedSections[sectionId]);
  };

  const toggleSection = (sectionId) => {
    if (isSectionActive(sectionId)) return;

    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const shouldShowSectionItems = (sectionId) => {
    return isSectionExpanded(sectionId);
  };

  const handleSectionHeaderClick = ({ sectionId, hasSubitems = true, onClick }) => {
    if (!hasSubitems) {
      if (onClick) onClick();
      return;
    }

    if (!isOpen) {
      onToggle();
      setExpandedSections((prev) => ({
        ...prev,
        [sectionId]: true,
      }));
      return;
    }

    toggleSection(sectionId);
  };

  // Menu item component — items with url="#" never get the active class
  const MenuItem = ({ icon: Icon, label, url, isCollapsed }) => {
    const isPlaceholder = !url || url === "#";
    if (isPlaceholder) {
      return (
        <span className="menu-item">
          <Icon className="menu-icon" size={20} />
          {!isCollapsed && <span className="menu-label">{label}</span>}
        </span>
      );
    }
    return (
      <NavLink
        to={url}
        end
        className={`menu-item ${isRouteActive(url) ? "is-current" : ""}`}
      >
        <Icon className="menu-icon" size={20} />
        {!isCollapsed && <span className="menu-label">{label}</span>}
      </NavLink>
    );
  };

  // Section header with toggle
  const SectionHeader = ({ icon: Icon, label, sectionId, isCollapsed, hasSubitems = true, onClick }) => (
    <div 
      className={`section-header ${isSectionActive(sectionId) ? "section-current" : ""}`}
      onClick={() => handleSectionHeaderClick({ sectionId, hasSubitems, onClick })}
      style={{ cursor: hasSubitems || onClick ? 'pointer' : 'default' }}
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
              className={`section-chevron ${isSectionExpanded(sectionId) ? 'expanded' : ''}`}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <div className={`sidebar-wrapper ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`} style={{height: '100vh', overflowY: 'auto'}}>
      {/* Logo en haut de la sidebar */}

      <div className="sidebar-top-row">
        {isOpen && (
          <NavLink to="/" title="Retour à la vitrine AnyHomes">
            <img src="/assets/img/anyhomes-logo-white.png" alt="AnyHomes" className="sidebar-logo" style={{ width: 140, cursor: 'pointer' }} />
          </NavLink>
        )}
        <button
          onClick={onToggle}
          className="toggle-btn always-visible"
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <HiChevronLeft /> : <HiChevronRight />}
        </button>
      </div>

      {/* Sidebar Menu - Complete Navigation */}
      <nav className="sidebar-menu">
        {/* Main Items */}
        <div className="menu-section">
          <MenuItem icon={FaRocket} label={t('navigation.onboarding')} url="/onboarding" isCollapsed={!isOpen} />
          <MenuItem icon={MdDashboard} label={t('navigation.dashboard')} url="/dashboard" isCollapsed={!isOpen} />
          <MenuItem icon={MdSearch} label={t('navigation.searchProperties')} url="/properties" isCollapsed={!isOpen} />
          <MenuItem icon={MdEmail} label={t('navigation.messages')} url="/chat" isCollapsed={!isOpen} />
        </div>

        <div className="menu-divider"></div>

        {/* Services immo à la carte — Marketplace */}
        <div className="menu-section expandable">
          <SectionHeader
            icon={MdStorefront}
            label={t('navigation.proImmobilierALaCarte')}
            sectionId="marketplace"
            isCollapsed={!isOpen}
          />
          {shouldShowSectionItems("marketplace") && (
            <div className="section-items">
              <MenuItem icon={MdSearch} label={t('navigation.marketplaceList')} url="/marketplace" isCollapsed={!isOpen} />
              <MenuItem icon={MdFavorite} label={t('navigation.marketplaceFavorites')} url="/marketplace/favorites" isCollapsed={!isOpen} />
              <MenuItem icon={MdShoppingCart} label={t('navigation.marketplaceOrders')} url="/marketplace/orders" isCollapsed={!isOpen} />
              {user?.accountType === 'pro' && (
                <>
                  <MenuItem icon={MdSpaceDashboard} label={t('navigation.proDashboard')} url="/pro/marketplace" isCollapsed={!isOpen} />
                  <MenuItem icon={MdShoppingCart} label="Services vendus" url="/pro/marketplace/sold-services" isCollapsed={!isOpen} />
                </>
              )}
            </div>
          )}
        </div>

        {/* Market Insights Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdTrendingUp}
            label={t('navigation.marketInsights')}
            sectionId="marketInsights"
            isCollapsed={!isOpen}
          />
          {shouldShowSectionItems("marketInsights") && (
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
          {shouldShowSectionItems("learning") && (
            <div className="section-items">
              <MenuItem icon={MdBook} label={t('navigation.writtenTraining')} url="/blog-detail" isCollapsed={!isOpen} />
              <MenuItem icon={MdBook} label={t('navigation.videoTraining')} url="/training" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* P2P Estimation Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdPerson}
            label={t('navigation.p2pEstimation')}
            sectionId="estimation"
            isCollapsed={!isOpen}
          />
          {shouldShowSectionItems("estimation") && (
            <div className="section-items">
              <MenuItem icon={MdCalculate} label={t('navigation.estimateProperties')} url="/estimation" isCollapsed={!isOpen} />
              <MenuItem icon={MdLocalOffer} label={t('navigation.campaignManager')} url="/social-estimation" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* Transaction Management Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={MdTimeline}
            label={t('navigation.transactionManagement')}
            sectionId="transactionMgmt"
            isCollapsed={!isOpen}
          />
          {shouldShowSectionItems("transactionMgmt") && (
            <div className="section-items">
              <MenuItem icon={MdSearch} label={t('navigation.searcher')} url="/real-estate-transaction-searcher" isCollapsed={!isOpen} />
              <MenuItem icon={MdPerson} label={t('navigation.owner')} url="/real-estate-transaction-owner" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* Property Seeker Section */}
        <div className="menu-section expandable">
          <SectionHeader 
            icon={FaBullseye}
            label={t('project.searcherSpace')}
            sectionId="propertySeeker"
            isCollapsed={!isOpen}
          />
          {shouldShowSectionItems("propertySeeker") && (
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
          {shouldShowSectionItems("properties") && (
            <div className="section-items">
              <MenuItem icon={MdHome} label={t('navigation.myProperties')} url="/my-properties" isCollapsed={!isOpen} />
              <MenuItem icon={MdHome} label={t('navigation.sellerFile')} url="/seller-file" isCollapsed={!isOpen} />
              <MenuItem icon={MdHome} label={t('navigation.qrCode')} url="/property/qr-code" isCollapsed={!isOpen} />
            </div>
          )}
        </div>

        {/* Company Profile Section-style Item: Only for pro users */}
        {user?.accountType === 'pro' && (
          <div className="menu-section expandable">
            <SectionHeader
              icon={MdBusiness}
              label={t('navigation.companyProfile')}
              sectionId="companyProfile"
              isCollapsed={!isOpen}
              hasSubitems={false}
                onClick={() => {
                  window.open("https://app.anyhomes.fr/profile/", "_blank", "noopener,noreferrer");
                }}
            />
          </div>
        )}
      </nav>

    </div>
  );
};

export default Html;
