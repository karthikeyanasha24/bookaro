import { useTranslation } from "react-i18next";

const DashboardSection = ({ title, subtitle, loading, error, children, alwaysVisible = true, headerRight = null, className = "", isMock = false }) => {
  const { t } = useTranslation();

  if (!alwaysVisible && !loading && !error && !children) return null;

  return (
    <section className={`dashboard-section ${className}`.trim()}>
      {(title || headerRight || isMock) && (
        <div className="dashboard-section-header">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
          </div>
          <div className="dashboard-section-header-actions">
            {isMock && (
              <span className="dashboard-section-mock-badge">Données fictives</span>
            )}
            {headerRight}
          </div>
        </div>
      )}
      {loading && <p className="dashboard-subtitle">{t("dashboard.common.loading", "Chargement...")}</p>}
      {!loading && error && (
        <p className="dashboard-subtitle" style={{ color: "#b91c1c" }}>
          {t("dashboard.common.loadError", "Impossible de charger cette section pour le moment.")}
        </p>
      )}
      {!loading && !error && children}
    </section>
  );
};

export default DashboardSection;
