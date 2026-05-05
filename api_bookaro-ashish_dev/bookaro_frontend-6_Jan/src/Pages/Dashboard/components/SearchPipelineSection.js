import DashboardSection from "./DashboardSection";
import {
  FaEye,
  FaHeart,
  FaRoute,
  FaHouse,
  FaClipboardCheck,
  FaPaperPlane,
  FaStar,
  FaBinoculars,
} from "react-icons/fa6";

const SearchPipelineSection = ({ section, loading, error, t }) => {
  const metrics = section?.metrics;

  const metricItems = metrics
    ? [
        ["propertyProfileViewed", t("dashboard.searchPipeline.metrics.propertyProfileViewed", "Profils de bien consultes"), FaEye],
        ["propertiesFollowed", t("dashboard.searchPipeline.metrics.propertiesFollowed", "Biens suivis"), FaHouse],
        ["propertiesInTransactionFlow", t("dashboard.searchPipeline.metrics.propertiesInTransactionFlow", "Biens visites"), FaRoute],
        ["propertiesVisited", t("dashboard.searchPipeline.metrics.propertiesVisited", "Evaluations de visite"), FaStar],
        ["visitReviewsReceived", t("dashboard.searchPipeline.metrics.visitReviewsReceived", "Dossiers envoyes"), FaClipboardCheck],
        ["applicationSentToOwners", t("dashboard.searchPipeline.metrics.applicationSentToOwners", "Propositions d'achat envoyees"), FaPaperPlane],
        ["purchaseProposalsSentToOwners", t("dashboard.searchPipeline.metrics.purchaseProposalsSentToOwners", "Biens surveilles"), FaBinoculars],
      ]
    : [];

  return (
    <DashboardSection
      title={t("dashboard.sections.searchPipeline", "Property search pipeline overview")}
      loading={loading}
      error={error}
    >
      {!metrics ? (
        <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280" }}>
          {section?.emptyState?.message || t("dashboard.searchPipeline.empty", "Aucune donnee de pipeline pour le moment.")}
        </p>
      ) : (
        <div className="search-pipeline-grid">
          {metricItems.map(([key, label, Icon]) => (
            <article key={key} className="metric-box">
              <span className="search-pipeline-icon" aria-hidden="true">
                <Icon />
              </span>
              <p className="value">{metrics[key] || 0}</p>
              <p className="label">{label}</p>
            </article>
          ))}
        </div>
      )}
    </DashboardSection>
  );
};

export default SearchPipelineSection;
