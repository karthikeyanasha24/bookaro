import DashboardSection from "./DashboardSection";

const P2PEstimationSection = ({ section, loading, error, t }) => {
  const items = section?.items || [];
  const totalToEstimate = Number(
    section?.totalPropertiesToEstimate ||
      section?.totalCount ||
      section?.count ||
      section?.propertiesCount ||
      section?.newPropertiesCount ||
      section?.itemsCount ||
      100
  );
  const isSidebarExpanded = (() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("sidebar_open");
      return saved === null ? true : JSON.parse(saved);
    } catch (_error) {
      return true;
    }
  })();
  const itemsPerRow = isSidebarExpanded ? 6 : 7;
  const totalItems = itemsPerRow;
  const fallbackImages = [
    "/assets/img/dashboard/attractivity/attractivity-1.jpg",
    "/assets/img/dashboard/attractivity/attractivity-2.jpg",
    "/assets/img/dashboard/attractivity/attractivity-3.jpg",
    "/assets/img/dashboard/attractivity/attractivity-4.webp",
    "/assets/img/dashboard/attractivity/attractivity-5.jpg",
  ];

  const getImageUrl = (item, index) => {
    const source = item?.imageUrl || item?.image || item?.photoUrl;

    // Some API payloads still point to missing blog placeholders; replace them.
    if (!source || source.includes("/assets/img/blogs/")) {
      return fallbackImages[index % fallbackImages.length];
    }

    return source;
  };
  const repeatedItems =
    items.length > 0
      ? Array.from({ length: totalItems }, (_, index) => {
          const item = items[index % items.length];
          return {
            ...item,
            propertyId: `${item.propertyId}-${index}`,
          };
        })
      : [];

  const rows = [repeatedItems.slice(0, itemsPerRow)];

  return (
    <DashboardSection
      title={t(
        "dashboard.sections.p2pEstimation",
        "P2P Estimation : aidez les membres de la communauté à estimer leur bien"
      )}
      subtitle={section?.subtitle}
      loading={loading}
      error={error}
    >
      {items.length === 0 ? (
        <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280" }}>
          {t("dashboard.p2pEstimation.empty", "Aucun bien a estimer pour le moment.")}
        </p>
      ) : (
        <>
          <p className="p2p-estimation-count-title">
            {t(
              "dashboard.p2pEstimation.countTitle",
              "{{count}} properties in your area are waiting for your peer-to-peer estimation",
              { count: totalToEstimate }
            )}
          </p>
          <div className={`p2p-strip ${isSidebarExpanded ? "p2p-strip-expanded" : "p2p-strip-collapsed"}`}>
            {rows.map((rowItems, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="p2p-strip-row"
                style={{ "--p2p-count": itemsPerRow }}
              >
                {rowItems.map((item, itemIndex) => (
                  <a
                    key={item.propertyId}
                    href={item.route || "/property-details"}
                    className={`p2p-strip-item ${itemIndex > 0 ? "p2p-strip-item-overlap" : ""}`}
                  >
                    <img
                      src={getImageUrl(item, rowIndex * itemsPerRow + itemIndex)}
                      alt={t("dashboard.p2pEstimation.imageAlt", "estimation")}
                      className="p2p-strip-image"
                      onError={(event) => {
                        if (!event.currentTarget.dataset.fallbackApplied) {
                          event.currentTarget.dataset.fallbackApplied = "true";
                          event.currentTarget.src = fallbackImages[(rowIndex * itemsPerRow + itemIndex) % fallbackImages.length];
                        }
                      }}
                    />
                  </a>
                ))}
              </div>
            ))}
          </div>
          {section?.action?.route && (
            <div className="dashboard-button-center p2p-button-center">
              <a href={section.action.route} className="dashboard-button">
                {t("dashboard.cta.estimateProperties", "Estimer des biens")}
              </a>
            </div>
          )}
        </>
      )}
    </DashboardSection>
  );
};

export default P2PEstimationSection;
