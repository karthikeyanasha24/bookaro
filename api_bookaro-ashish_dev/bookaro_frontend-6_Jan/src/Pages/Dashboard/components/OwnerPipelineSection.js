import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  FaEye,
  FaHeart,
  FaClipboardCheck,
  FaHouse,
  FaStar,
  FaFileCircleCheck,
} from "react-icons/fa6";
import DashboardSection from "./DashboardSection";

const ownerFallbackImages = [
  "/assets/img/dashboard/attractivity/attractivity-1.jpg",
  "/assets/img/dashboard/attractivity/attractivity-2.jpg",
  "/assets/img/dashboard/attractivity/attractivity-3.jpg",
  "/assets/img/dashboard/attractivity/attractivity-4.webp",
  "/assets/img/dashboard/attractivity/attractivity-5.jpg",
];

const formatNumberWithSpaces = (value) => {
  const amount = Math.round(Number(value || 0));
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const formatCurrency = (value) => `${formatNumberWithSpaces(value)} €`;

const OwnerPipelineSection = ({ section, loading, error, t }) => {
  const properties = section?.properties || [];
  const [collapsedById, setCollapsedById] = useState({});

  const getRowId = (entry, index) => entry?.propertyId || `owner-row-${index}`;

  const isExpanded = (entry, index) => {
    const rowId = getRowId(entry, index);
    if (typeof collapsedById[rowId] === "boolean") {
      return !collapsedById[rowId];
    }

    return index === 0;
  };

  const toggleRow = (entry, index) => {
    const rowId = getRowId(entry, index);
    setCollapsedById((prev) => ({
      ...prev,
      [rowId]: isExpanded(entry, index),
    }));
  };

  const getOwnerPropertyUrl = (entry) => {
    const directRoute = entry?.property?.route;
    if (directRoute) {
      return `${directRoute}${directRoute.includes("?") ? "&" : "?"}mode=owner`;
    }

    const propertyId =
      entry?.property?._id || entry?.property?.id || entry?.propertyId || null;
    if (!propertyId) return "/property-details?mode=owner";
    return `/property-details?id=${encodeURIComponent(propertyId)}&mode=owner`;
  };

  return (
    <DashboardSection
      title={t("dashboard.sections.ownerPipeline", "Seller or landlord pipeline overview")}
      loading={loading}
      error={error}
    >
      {properties.length === 0 ? (
        <div>
          <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280", marginBottom: 8 }}>
            {section?.emptyState?.message || t("dashboard.ownerPipeline.empty", "Aucun bien dans le pipeline proprietaire pour le moment.")}
          </p>
          {section?.emptyState?.ctaRoute && (
            <a href={section.emptyState.ctaRoute} className="inline-block text-[#976DD0] underline text-[14px]">
              {section?.emptyState?.ctaLabel || t("dashboard.ownerPipeline.listMyProperty", "Creer mon bien")}
            </a>
          )}
        </div>
      ) : (
        <div className="owner-list">
          {properties.map((entry, index) => {
            const m = entry.metrics || {};
            const rowExpanded = isExpanded(entry, index);
            const rowId = getRowId(entry, index);
            const fallbackImage = ownerFallbackImages[index % ownerFallbackImages.length];
            const imageUrl = entry?.property?.imageUrl || entry?.property?.image || entry?.property?.photoUrl || fallbackImage;
            const transactionType = (entry?.property?.transactionType || "sale").toLowerCase();
            const transactionTypeLabel = transactionType === "rent"
              ? t("dashboard.ownerPipeline.transactionTypeRent", "Location")
              : t("dashboard.ownerPipeline.transactionTypeSale", "Vente");
            const priceLabel = transactionType === "rent"
              ? t("dashboard.ownerPipeline.priceRent", "Prix location")
              : t("dashboard.ownerPipeline.priceSale", "Prix de vente");
            const computedPricePerSqm = Number(entry?.property?.surface || 0) > 0
              ? Number(entry?.property?.price || 0) / Number(entry?.property?.surface || 1)
              : 0;
            const pricePerSqm = Number(entry?.property?.pricePerSqm || 0) || computedPricePerSqm;
            const offerOrApplicationCount = Number(m.offerReceived || m.applicationReceived || 0);
            const offerOrApplicationLabel = transactionType === "rent"
              ? (offerOrApplicationCount > 1
                ? t("dashboard.ownerPipeline.metrics.applicationReceivedPlural", "Dossiers reçus")
                : t("dashboard.ownerPipeline.metrics.applicationReceivedSingular", "Dossier reçu"))
              : (offerOrApplicationCount > 1
                ? t("dashboard.ownerPipeline.metrics.offerReceivedPlural", "Offres reçues")
                : t("dashboard.ownerPipeline.metrics.offerReceivedSingular", "Offre reçue"));
            const metricCards = [
              [m.propertyProfileViews, t("dashboard.ownerPipeline.metrics.propertyProfileViews", "Vues du profil du bien"), FaEye],
              [m.interestsReceived, t("dashboard.ownerPipeline.metrics.interestsReceived", "Intérêts reçus"), FaHeart],
              [m.buyerFinancialProfileAnalyzed || m.renterFinancialProfileAnalyzed, t("dashboard.ownerPipeline.metrics.profileAnalyzed", "Profils analysés"), FaClipboardCheck],
              [m.visitsHosted, t("dashboard.ownerPipeline.metrics.visitsHosted", "Visites réalisées"), FaHouse],
              [m.visitReviewsReceived, t("dashboard.ownerPipeline.metrics.visitEvaluation", "Evaluation de visite"), FaStar],
              [offerOrApplicationCount, offerOrApplicationLabel, FaFileCircleCheck],
            ];

            return (
              <article key={rowId} className="p2p-report-row-card owner-row-card">
                <div className="p2p-report-row-head owner-row-head">
                  <div className="p2p-report-row-head-main owner-row-head-main">
                    <a
                      href={getOwnerPropertyUrl(entry)}
                      className="p2p-report-row-image-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={imageUrl}
                        alt="property"
                        className="p2p-report-row-image"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </a>
                    <div className="p2p-report-row-meta">
                      <a
                        href={getOwnerPropertyUrl(entry)}
                        className="p2p-report-row-title p2p-report-row-title-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {entry?.property?.title || "-"}
                      </a>
                      <p className="p2p-report-row-features">
                        {`${transactionTypeLabel} • ${entry?.property?.rooms || 0} ${t("dashboard.units.roomPlural", "pieces")} • ${entry?.property?.surface || 0} ${t("dashboard.units.sqm", "m2")} • ${entry?.property?.postalCode || "-"} ${entry?.property?.city || "-"}, ${entry?.property?.country || "-"}`}
                      </p>
                    </div>
                  </div>

                  <div className="owner-row-price-block">
                    <p className="owner-row-price-line">
                      <span className="owner-row-price-label">{priceLabel}</span>
                      <span className="owner-row-price-value">{formatCurrency(entry?.property?.price || 0)}</span>
                    </p>
                    <p className="owner-row-price-line">
                      <span className="owner-row-price-label">{t("dashboard.ownerPipeline.pricePerSqm", "Prix/m2")}</span>
                      <span className="owner-row-price-value">{formatCurrency(pricePerSqm)}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="p2p-report-toggle-btn"
                    aria-label={
                      rowExpanded
                        ? t("dashboard.common.collapseStatistics", "Replier les statistiques")
                        : t("dashboard.common.expandStatistics", "Deplier les statistiques")
                    }
                    aria-expanded={rowExpanded}
                    onClick={() => toggleRow(entry, index)}
                  >
                    {rowExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>

                {rowExpanded && (
                  <>
                    <div className="p2p-report-row-divider" />
                    <div className="owner-pipeline-metrics-grid">
                      {metricCards.map(([value, label, Icon], idx) => (
                        <div key={idx} className="metric-box">
                          <span className="owner-pipeline-icon" aria-hidden="true">
                            <Icon />
                          </span>
                          <p className="value">{value || 0}</p>
                          <p className="label">{label}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}
    </DashboardSection>
  );
};

export default OwnerPipelineSection;
