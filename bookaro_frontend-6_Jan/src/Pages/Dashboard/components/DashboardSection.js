import { useTranslation } from "react-i18next";

const DashboardSection = ({ title, subtitle, loading, error, children, alwaysVisible = true, headerRight = null, className = "" }) => {
  const { t } = useTranslation();

  if (!alwaysVisible && !loading && !error && !children) return null;

  return (
    <section className={`dashboard-section ${className}`.trim()}>
      {(title || headerRight) && (
        <div className="dashboard-section-header">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
          </div>
          {headerRight}
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
