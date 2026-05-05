import DashboardSection from "./DashboardSection";
import { FiEye, FiHeart, FiMessageSquare, FiShare2 } from "react-icons/fi";

const formatDelta = (delta) => `${delta > 0 ? "+" : ""}${delta}%`;

const formatCompactMetric = (value) => {
  const amount = Number(value || 0);
  if (amount < 1000) return `${amount}`;

  const compact = Math.round((amount / 1000) * 10) / 10;
  return `${compact % 1 === 0 ? compact.toFixed(0) : compact}K`;
};

const METRIC_CONFIG = [
  { key: "views", labelKey: "dashboard.metrics.views", defaultLabel: "Views", Icon: FiEye },
  { key: "followers", labelKey: "dashboard.metrics.followers", defaultLabel: "Followers", Icon: FiHeart },
  { key: "shares", labelKey: "dashboard.metrics.shares", defaultLabel: "Shares", Icon: FiShare2 },
  { key: "messages", labelKey: "dashboard.metrics.messages", defaultLabel: "Messages", Icon: FiMessageSquare },
];

const PropertyAttractivitySection = ({ section, loading, error, period, onPeriodChange, t }) => {
  const cards = section?.cards || [];

  const resolvePropertyId = (card) => {
    return card?.property?._id || card?.property?.id || card?.propertyId;
  };

  const toOwnerPropertyUrl = (card) => {
    const propertyId = resolvePropertyId(card);
    const directRoute = card?.property?.route;

    if (directRoute) {
      return `${directRoute}${directRoute.includes("?") ? "&" : "?"}mode=owner`;
    }

    if (!propertyId) return "/property-details?mode=owner";
    return `/property-details?id=${encodeURIComponent(propertyId)}&mode=owner`;
  };

  return (
    <DashboardSection
      className="dashboard-section-attractivity"
      title={t("dashboard.sections.propertyAttractivity", "Your properties attractivity")}
      subtitle={t("dashboard.sections.propertyAttractivitySub", "Property attractivity metrics")}
      loading={loading}
      error={error}
      headerRight={
        <select className="section-period-select" value={period} onChange={(e) => onPeriodChange(e.target.value)}>
          <option value="day">{t("dashboard.periods.day", "Day")}</option>
          <option value="week">{t("dashboard.periods.week", "Week")}</option>
          <option value="month">{t("dashboard.periods.month", "Month")}</option>
          <option value="year">{t("dashboard.periods.year", "Year")}</option>
        </select>
      }
    >
      {cards.length === 0 ? (
        <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280" }}>{t("dashboard.empty.noProperties", "No property available yet.")}</p>
      ) : (
        <>
          <div className="attractivity-grid">
            {cards.map((card, index) => (
              <div key={`${card?.propertyId || card?.property?.title || "property"}-${index}`} className="attractivity-item">
                <a
                  href={toOwnerPropertyUrl(card)}
                  className="attractivity-item-title attractivity-item-title-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {card?.property?.title}
                </a>
                <a
                  href={toOwnerPropertyUrl(card)}
                  className="attractivity-card attractivity-card-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="attractivity-body">
                    <img
                      className="attractivity-property-image"
                      src={card?.property?.coverUrl || "/assets/img/placeholder.png"}
                      alt={card?.property?.title || "property"}
                    />
                    <ul className="attractivity-metrics">
                      {METRIC_CONFIG.map(({ key, labelKey, defaultLabel, Icon }) => (
                        <li key={key} className="attractivity-metric-row">
                          <span className="attractivity-metric-main">
                            <span className="attractivity-metric-icon-wrap" title={t(labelKey, defaultLabel)} aria-label={t(labelKey, defaultLabel)}>
                              <Icon className="attractivity-metric-icon" aria-hidden="true" />
                              <span className="attractivity-metric-tooltip" role="tooltip">{t(labelKey, defaultLabel)}</span>
                            </span>
                          </span>
                          <span className="attractivity-metric-number">{formatCompactMetric(card?.metrics?.[key]?.value)}</span>
                          <span className="attractivity-metric-delta">{formatDelta(card?.metrics?.[key]?.deltaPct || 0)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </a>
              </div>
            ))}
          </div>
          <div className="dashboard-button-center attractivity-button-center">
            <a href="/property1" className="dashboard-button">
              {t("dashboard.cta.createProperty", "Creer un bien")}
            </a>
          </div>
        </>
      )}
    </DashboardSection>
  );
};

export default PropertyAttractivitySection;
