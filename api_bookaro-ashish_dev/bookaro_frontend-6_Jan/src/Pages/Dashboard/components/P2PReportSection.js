import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSection from "./DashboardSection";
import { FiChevronDown, FiChevronUp, FiUser } from "react-icons/fi";

const formatNumberWithSpaces = (value) => {
  const amount = Math.round(Number(value || 0));
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const formatCurrency = (value) => `${formatNumberWithSpaces(value)} €`;

const formatCompactUsers = (value) => {
  const amount = Number(value || 0);
  if (amount < 1000) return `${amount}`;

  const compact = Math.round((amount / 1000) * 10) / 10;
  return `${compact % 1 === 0 ? compact.toFixed(0) : compact}K`;
};

const PRICE_CHART_COLORS = {
  appropriate: "#6f43b5",
  underEstimated: "#976dd0",
  overEstimated: "#cfb8ee",
};

const buildPieChartStyle = (appropriate, underEstimated, overEstimated) => {
  const a = Number(appropriate || 0);
  const u = Number(underEstimated || 0);
  const o = Number(overEstimated || 0);
  const total = a + u + o;

  if (total <= 0) {
    return {
      total: 0,
      style: { background: "#e5e7eb" },
    };
  }

  const aDeg = (a / total) * 360;
  const uDeg = (u / total) * 360;
  const oDeg = 360 - aDeg - uDeg;

  return {
    total,
    style: {
      background: `conic-gradient(${PRICE_CHART_COLORS.appropriate} 0deg ${aDeg}deg, ${PRICE_CHART_COLORS.underEstimated} ${aDeg}deg ${aDeg + uDeg}deg, ${PRICE_CHART_COLORS.overEstimated} ${aDeg + uDeg}deg ${aDeg + uDeg + oDeg}deg)`,
    },
  };
};

const getLifetimePeopleCount = (pricing, key) => {
  const byKey = {
    max: [
      pricing?.maxPeople,
      pricing?.maxUsers,
      pricing?.maxUserCount,
      pricing?.maxVoters,
      pricing?.maxVotesCount,
    ],
    avg: [
      pricing?.avgPeople,
      pricing?.avgUsers,
      pricing?.avgUserCount,
      pricing?.avgVoters,
      pricing?.avgVotesCount,
    ],
    min: [
      pricing?.minPeople,
      pricing?.minUsers,
      pricing?.minUserCount,
      pricing?.minVoters,
      pricing?.minVotesCount,
    ],
  };

  const candidates = byKey[key] || [];
  const found = candidates.find((value) => value !== undefined && value !== null);

  return Number(found || 0);
};

const getQualitativePeopleCount = (qualitative, key) => {
  const byKey = {
    title: [qualitative?.titleUsers, qualitative?.titleUserCount, qualitative?.titleVoters, qualitative?.titleVotesCount],
    pictures: [qualitative?.picturesUsers, qualitative?.picturesUserCount, qualitative?.picturesVoters, qualitative?.picturesVotesCount],
    interiorDesign: [qualitative?.interiorUsers, qualitative?.interiorUserCount, qualitative?.interiorVoters, qualitative?.interiorVotesCount, qualitative?.interiorDesignUsers, qualitative?.interiorDesignUserCount, qualitative?.interiorDesignVoters, qualitative?.interiorDesignVotesCount],
    location: [qualitative?.locationUsers, qualitative?.locationUserCount, qualitative?.locationVoters, qualitative?.locationVotesCount],
    couldLiveIn: [qualitative?.desirabilityUsers, qualitative?.desirabilityUserCount, qualitative?.desirabilityVoters, qualitative?.desirabilityVotesCount, qualitative?.couldLiveInUsers, qualitative?.couldLiveInUserCount, qualitative?.couldLiveInVoters, qualitative?.couldLiveInVotesCount],
  };

  const candidates = byKey[key] || [];
  const found = candidates.find((value) => value !== undefined && value !== null);
  return Number(found || 0);
};

const formatScore = (value) => {
  const numeric = Number(value || 0);
  if (Number.isNaN(numeric)) return "-";
  return numeric.toFixed(1);
};

const P2PReportSection = ({ section, loading, error, t }) => {
  const properties = section?.properties || [];
  const [expandedById, setExpandedById] = useState({});
  const navigate = useNavigate();

  const getRowId = (entry, index) => entry?.propertyId || `row-${index}`;

  const isRowExpanded = (entry, index) => {
    const rowId = getRowId(entry, index);
    const explicit = expandedById[rowId];
    if (typeof explicit === "boolean") return explicit;
    return index === 0;
  };

  const toggleRow = (entry, index) => {
    setExpandedById((prev) => {
      const rowId = getRowId(entry, index);
      const currentValue = typeof prev[rowId] === "boolean" ? prev[rowId] : index === 0;

      return {
        ...prev,
        [rowId]: !currentValue,
      };
    });
  };

  const resolvePropertyId = (entry) => {
    return entry?.property?._id || entry?.property?.id || entry?.propertyId;
  };

  const openP2PManagement = (entry) => {
    const route = entry?.action?.route || "/social-estimation";
    const propertyId = resolvePropertyId(entry);
    const target = propertyId ? `${route}?propertyId=${encodeURIComponent(propertyId)}` : route;
    navigate(target);
  };

  const getOwnerPropertyUrl = (entry) => {
    const directRoute = entry?.property?.route;
    if (directRoute) {
      return `${directRoute}${directRoute.includes("?") ? "&" : "?"}mode=owner`;
    }

    const propertyId = resolvePropertyId(entry);
    if (!propertyId) return "/property-details?mode=owner";
    return `/property-details?id=${encodeURIComponent(propertyId)}&mode=owner`;
  };

  const handleEstimateMyProperty = () => {
    if (properties.length === 0) {
      navigate("/property1");
      return;
    }

    navigate("/social-estimation?startCampaign=1");
  };

  return (
    <DashboardSection
      title={t("dashboard.sections.p2pReport", "Your properties Peer 2 Peer estimation global metrics")}
      subtitle={t(
        "dashboard.sections.p2pReportSub",
        "Leverage these insights to understand how people in your area value your property and how to increase its attractivity"
      )}
      loading={loading}
      error={error}
    >
      {properties.length === 0 ? (
        <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280" }}>{section?.emptyState?.message || t("dashboard.empty.noP2PReport", "No P2P report available yet.")}</p>
      ) : (
        <div className="p2p-report-list">
          {properties.map((entry, index) => {
            const rowId = getRowId(entry, index);
            const isExpanded = isRowExpanded(entry, index);
            const property = entry?.property || {};
            const pricing = entry?.pricing || {};
            const qualitative = entry?.qualitativeAssessment || {};
            const pie = buildPieChartStyle(pricing.appropriate, pricing.underEstimated, pricing.overEstimated);
            const maxPriceValue = Number(pricing.maxPrice || 0);
            const avgPriceValue = Number(pricing.avgPrice || 0);
            const minPriceValue = Number(pricing.minPrice || 0);
            const lifetimeMax = Math.max(maxPriceValue, avgPriceValue, minPriceValue, 1);
            const legendItems = [
              {
                key: "appropriate",
                label: t("dashboard.p2pReport.appropriate", "Appropriate"),
                value: Number(pricing.appropriate || 0),
                color: PRICE_CHART_COLORS.appropriate,
              },
              {
                key: "underEstimated",
                label: t("dashboard.p2pReport.underEstimated", "Under estimated"),
                value: Number(pricing.underEstimated || 0),
                color: PRICE_CHART_COLORS.underEstimated,
              },
              {
                key: "overEstimated",
                label: t("dashboard.p2pReport.overEstimated", "Over estimated"),
                value: Number(pricing.overEstimated || 0),
                color: PRICE_CHART_COLORS.overEstimated,
              },
            ];
            const lifetimeBars = [
              {
                key: "max",
                label: t("dashboard.p2pReport.max", "Max"),
                value: maxPriceValue,
                color: "#6f43b5",
                peopleCount: getLifetimePeopleCount(pricing, "max"),
              },
              {
                key: "avg",
                label: t("dashboard.p2pReport.avg", "Avg"),
                value: avgPriceValue,
                color: "#976dd0",
                peopleCount: getLifetimePeopleCount(pricing, "avg"),
              },
              {
                key: "min",
                label: t("dashboard.p2pReport.min", "Min"),
                value: minPriceValue,
                color: "#cfb8ee",
                peopleCount: getLifetimePeopleCount(pricing, "min"),
              },
            ];
            const totalPeopleCount = lifetimeBars.reduce((sum, bar) => sum + Number(bar.peopleCount || 0), 0);

            return (
              <article key={rowId} className="p2p-report-row-card">
                <div className="p2p-report-row-head">
                  <div className="p2p-report-row-head-main">
                    <a
                      href={getOwnerPropertyUrl(entry)}
                      className="p2p-report-row-image-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={property.imageUrl || "/assets/img/dashboard/attractivity/attractivity-1.jpg"}
                        alt={property.title || "property"}
                        className="p2p-report-row-image"
                      />
                    </a>
                    <div className="p2p-report-row-meta">
                      <a
                        href={getOwnerPropertyUrl(entry)}
                        className="p2p-report-row-title p2p-report-row-title-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {property.title || "-"}
                      </a>
                      <p className="p2p-report-row-features">
                        {`${property.rooms || 0} ${t("dashboard.p2pReport.rooms", "rooms")} • ${property.surface || 0} m2 • ${property.postalCode || "-"} ${property.city || "-"}, ${property.country || "-"}`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p2p-report-toggle-btn"
                    aria-label={
                      isExpanded
                        ? t("dashboard.common.collapseStatistics", "Replier les statistiques")
                        : t("dashboard.common.expandStatistics", "Deplier les statistiques")
                    }
                    aria-expanded={isExpanded}
                    onClick={() => toggleRow(entry, index)}
                  >
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
                {isExpanded && (
                  <>
                    <div className="p2p-report-row-divider" />

                    <div className="p2p-report-metrics-grid">
                  <article
                    className="p2p-report-metric-panel p2p-report-metric-panel-price p2p-report-metric-panel-clickable"
                    role="button"
                    tabIndex={0}
                    onClick={() => openP2PManagement(entry)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openP2PManagement(entry);
                      }
                    }}
                  >
                    <p className="p2p-report-metric-title">{t("dashboard.p2pReport.propertyPriceTitle", "Property price is")}</p>
                    <div className="p2p-price-content">
                      <div className="p2p-price-chart-wrap">
                        <div
                          className="p2p-price-chart"
                          style={pie.style}
                          role="img"
                          aria-label={`${t("dashboard.p2pReport.propertyPriceTitle", "Property price is")}: ${t("dashboard.p2pReport.appropriate", "Appropriate")} ${pricing.appropriate || 0}, ${t("dashboard.p2pReport.underEstimated", "Under estimated")} ${pricing.underEstimated || 0}, ${t("dashboard.p2pReport.overEstimated", "Over estimated")} ${pricing.overEstimated || 0}`}
                        >
                          <span className="p2p-price-chart-center">{pie.total}</span>
                        </div>
                      </div>
                      <div className="p2p-price-legend-wrap">
                        <div className="p2p-price-legend" aria-label={t("dashboard.p2pReport.legend", "Chart legend")}>
                          {legendItems.map((item) => {
                            const percent = pie.total > 0 ? Math.round((item.value / pie.total) * 100) : 0;

                            return (
                              <p key={item.key} className="p2p-report-metric-line p2p-price-legend-item">
                                <span className="p2p-price-legend-left">
                                  <span className="p2p-price-legend-dot" style={{ backgroundColor: item.color }} />
                                  <span className="p2p-price-legend-label">{item.label}</span>
                                </span>
                                <span className="p2p-price-legend-value">
                                  <FiUser className="p2p-price-legend-user-icon" aria-hidden="true" />
                                  <span className="p2p-price-legend-count">{formatCompactUsers(item.value)}</span>
                                  <span className="p2p-price-legend-separator" aria-hidden="true" />
                                  <span className="p2p-price-legend-percent">{`${percent}%`}</span>
                                </span>
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </article>

                  <article
                    className="p2p-report-metric-panel p2p-report-metric-panel-lifetime p2p-report-metric-panel-clickable"
                    role="button"
                    tabIndex={0}
                    onClick={() => openP2PManagement(entry)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openP2PManagement(entry);
                      }
                    }}
                  >
                    <p className="p2p-report-metric-title">{t("dashboard.p2pReport.lifetimeTitle", "Lifetime price estimation")}</p>
                    <div className="p2p-lifetime-bars p2p-lifetime-bars-vertical" aria-label={t("dashboard.p2pReport.lifetimeTitle", "Lifetime price estimation")}>
                      {lifetimeBars.map((bar) => {
                        const heightPercent = Math.max(8, Math.round((bar.value / lifetimeMax) * 100));
                        const peoplePct = totalPeopleCount > 0 ? Math.round((Number(bar.peopleCount || 0) / totalPeopleCount) * 100) : 0;

                        return (
                          <div key={bar.key} className="p2p-lifetime-bar-col">
                            <p className="p2p-report-metric-line p2p-lifetime-bar-value">{formatCurrency(bar.value)}</p>
                            <div className="p2p-lifetime-bar-track p2p-lifetime-bar-track-vertical">
                              <div
                                className="p2p-lifetime-bar-fill"
                                style={{ height: `${heightPercent}%`, backgroundColor: bar.color }}
                              />
                            </div>
                            <p className="p2p-report-metric-line p2p-lifetime-bar-label">{bar.label}</p>
                            <p className="p2p-report-metric-line p2p-lifetime-people-line" aria-label={t("dashboard.p2pReport.peopleCount", "People count")}> 
                              <FiUser className="p2p-lifetime-people-icon" aria-hidden="true" />
                              <span>{formatCompactUsers(bar.peopleCount)}</span>
                            </p>
                            <p className="p2p-report-metric-line p2p-lifetime-people-percent">{`${peoplePct}%`}</p>
                          </div>
                        );
                      })}
                    </div>
                  </article>

                  <article
                    className="p2p-report-metric-panel p2p-report-metric-panel-qualitative p2p-report-metric-panel-clickable"
                    role="button"
                    tabIndex={0}
                    onClick={() => openP2PManagement(entry)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openP2PManagement(entry);
                      }
                    }}
                  >
                    <p className="p2p-report-metric-title">{t("dashboard.p2pReport.qualitativeTitle", "Property profile qualitative assessment")}</p>
                    <div className="p2p-qualitative-content">
                      <div className="p2p-qualitative-bars" aria-label={t("dashboard.p2pReport.qualitativeTitle", "Property profile qualitative assessment")}>
                        {[
                          { key: "title", label: t("dashboard.p2pReport.title", "Title"), value: Number(qualitative.title || 0), voters: getQualitativePeopleCount(qualitative, "title") },
                          { key: "pictures", label: t("dashboard.p2pReport.image", "Image"), value: Number(qualitative.pictures || 0), voters: getQualitativePeopleCount(qualitative, "pictures") },
                          { key: "interiorDesign", label: t("dashboard.p2pReport.decoration", "Decoration"), value: Number(qualitative.interiorDesign || 0), voters: getQualitativePeopleCount(qualitative, "interiorDesign") },
                          { key: "location", label: t("dashboard.p2pReport.location", "Location"), value: Number(qualitative.location || 0), voters: getQualitativePeopleCount(qualitative, "location") },
                          { key: "couldLiveIn", label: t("dashboard.p2pReport.desirability", "Desirability"), value: Number(qualitative.couldLiveIn || 0), voters: getQualitativePeopleCount(qualitative, "couldLiveIn") },
                        ].map((metric) => {
                          const widthPercent = Math.max(6, Math.min(100, Math.round((Number(metric.value || 0) / 5) * 100)));

                          return (
                            <div key={metric.key} className="p2p-qualitative-item">
                              <p className="p2p-report-metric-line p2p-qualitative-label">{metric.label}</p>
                              <div className="p2p-qualitative-row">
                                <div className="p2p-qualitative-track">
                                  <div className="p2p-qualitative-fill" style={{ width: `${widthPercent}%` }} />
                                </div>
                                <div className="p2p-qualitative-meta">
                                  <span className="p2p-qualitative-score">{formatScore(metric.value)}</span>
                                  <span className="p2p-qualitative-separator" aria-hidden="true" />
                                  <span className="p2p-qualitative-user-icon" aria-hidden="true">
                                    <FiUser />
                                  </span>
                                  <span className="p2p-qualitative-voters">{formatCompactUsers(metric.voters)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}
      <div className="dashboard-button-center p2p-report-button-center">
        <button type="button" className="dashboard-button" onClick={handleEstimateMyProperty}>
          {t("dashboard.cta.estimateMyProperty", "Estimer mon bien")}
        </button>
      </div>
    </DashboardSection>
  );
};

export default P2PReportSection;
