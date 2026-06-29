import DashboardSection from "./DashboardSection";
import { FiCalendar, FiMapPin, FiSquare } from "react-icons/fi";
import { FaDoorOpen } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const formatNumberWithSpaces = (value) => {
  const amount = Math.round(Number(value || 0));
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const formatCurrency = (value) => `${formatNumberWithSpaces(value)} €`;

const formatPricePerSqm = (price, surface) => {
  const sqm = Number(surface || 0);
  if (!sqm) return "0 €/m2";
  return `${formatNumberWithSpaces(Number(price || 0) / sqm)} €/m2`;
};

const formatSoldDate = (dateValue, locale) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(locale || "fr-FR");
};

const formatRooms = (rooms, t) => {
  const count = Number(rooms || 0);
  return `${count} ${count === 1 ? t("dashboard.units.roomSingular", "piece") : t("dashboard.units.roomPlural", "pieces")}`;
};

const PastTransactionsSection = ({ section, loading, error, t }) => {
  const { i18n } = useTranslation();
  const items = section?.items || [];

  return (
    <DashboardSection
      title={t("dashboard.sections.pastTransactions", "Past transactions prices matching your last search criterion or property you own")}
      subtitle={t("dashboard.sections.pastTransactionsSub", "Historical transactions help you define the right price either for a purchase or for a sale")}
      loading={loading}
      error={error}
    >
      {items.length === 0 ? (
        <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280" }}>{t("dashboard.empty.noTransactions", "No historical transaction available.")}</p>
      ) : (
        <>
          <div className="past-grid">
            {items.map((tx) => (
            <article key={tx.id} className="past-card">
              <div className="past-card-left">
                <div className="past-card-left-content">
                  <p className="past-card-type">{tx.propertyType}</p>
                  <p className="past-card-price">{formatCurrency(tx.price)}</p>
                  <p className="past-card-sqm-price">{formatPricePerSqm(tx.price, tx.surface)}</p>
                </div>
              </div>
              <div className="past-card-right">
                <p className="past-card-detail-line">
                  <FiSquare className="past-card-detail-icon" aria-hidden="true" />
                  <span>{tx.surface} {t("dashboard.units.sqm", "m2")}</span>
                </p>
                <p className="past-card-detail-line">
                  <FaDoorOpen className="past-card-detail-icon" aria-hidden="true" />
                  <span>{formatRooms(tx.rooms, t)}</span>
                </p>
                <p className="past-card-detail-line">
                  <FiMapPin className="past-card-detail-icon" aria-hidden="true" />
                  <span>{tx.fullAddress || tx.locationLabel || "-"}</span>
                </p>
                <p className="past-card-detail-line">
                  <FiCalendar className="past-card-detail-icon" aria-hidden="true" />
                  <span>{formatSoldDate(tx.soldAt, i18n?.language === "fr" ? "fr-FR" : "en-GB")}</span>
                </p>
              </div>
            </article>
            ))}
          </div>
          <div className="dashboard-button-center past-transactions-button-center">
            <a href="/past-transactions" className="dashboard-button">
              {t("dashboard.cta.browseTransactions", "Parcourir les transactions")}
            </a>
          </div>
        </>
      )}
    </DashboardSection>
  );
};

export default PastTransactionsSection;
