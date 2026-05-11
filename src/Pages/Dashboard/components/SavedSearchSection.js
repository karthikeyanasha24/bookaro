import { useEffect, useMemo, useState } from "react";
import { Link } from 'react-router-dom';
import { FiTrash2 } from "react-icons/fi";
import ApiClient from "../../../methods/api/apiClient";
import DashboardSection from "./DashboardSection";

const withFreshnessSort = (route) => {
  const baseRoute = route || "/properties";
  const sep = baseRoute.includes("?") ? "&" : "?";
  return `${baseRoute}${sep}sort=createdAt&order=desc`;
};

const SavedSearchSection = ({ section, loading, error, t }) => {
  let cards = section?.cards || [];
  let isMockData = false;
  // Inject mock data if no backend data
  if (!cards.length) {
    try {
      // eslint-disable-next-line global-require
      const { mockDashboardOverview } = require("../dashboard.mocks");
      cards = mockDashboardOverview.sections.savedSearchResults.cards || [];
      isMockData = true;
    } catch (e) {
      // fallback: rien
    }
  }
  const [localCards, setLocalCards] = useState(cards);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setLocalCards(cards);
  }, [cards]);

  const cardsWithNewResults = localCards.filter((card) => Number(card?.newResultsCount || 0) > 0);
  const hasNewResults = cardsWithNewResults.length > 0;

  const resolveSavedSearchId = (card) => {
    return card?.savedSearchId || card?.id || card?._id || null;
  };

  const handleDeleteSavedSearch = async (event, card) => {
    event.preventDefault();
    event.stopPropagation();

    const savedSearchId = resolveSavedSearchId(card);
    if (!savedSearchId) return;

    const isConfirmed = window.confirm(
      t(
        "dashboard.savedSearch.deleteConfirm",
        "Confirmer la suppression de cette recherche sauvegardee ?"
      )
    );

    if (!isConfirmed) return;

    setDeletingId(savedSearchId);
    try {
      const response = await ApiClient.delete("alerts/delete", { id: savedSearchId });
      if (response?.success) {
        setLocalCards((prev) => prev.filter((item) => resolveSavedSearchId(item) !== savedSearchId));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardSection
      title={t("dashboard.sections.savedSearch", "Saved searches new results")}
      subtitle={t("dashboard.sections.savedSearchSub", "Discover new properties matching your saved searches")}
      loading={loading}
      error={error}
      headerRight={isMockData ? (
        <span style={{
          background: '#f3e8ff',
          color: '#7c3aed',
          borderRadius: '12px',
          padding: '2px 10px',
          fontSize: '13px',
          fontWeight: 500,
          marginLeft: 12,
          alignSelf: 'center',
          border: '1px solid #e9d5ff',
        }}>Données fictives</span>
      ) : undefined}
    >
      {!hasNewResults ? (
        <>
          <p className="dashboard-subtitle" style={{ fontSize: "14px", color: "#6b7280" }}>
            {t(
              "dashboard.empty.noSavedSearchResults",
              "You will find here the new results of your saved searches."
            )}
          </p>
          <div className="dashboard-button-center">
            <Link to="/properties" className="dashboard-button">{t("dashboard.cta.newSearch", "New search")}</Link>
          </div>
        </>
      ) : (
        <div className="saved-search-list">
          {cardsWithNewResults.map((card) => {
            const newResultsRoute = withFreshnessSort(card?.action?.route);
            const savedSearchId = resolveSavedSearchId(card);

            return (
            <div key={savedSearchId || card?.name || "saved-search-row"} className="saved-search-row">
              <div className="saved-search-summary">
                  <button
                    type="button"
                    className="saved-search-delete-btn"
                    onClick={(event) => handleDeleteSavedSearch(event, card)}
                    disabled={deletingId === savedSearchId}
                    aria-label={t("dashboard.savedSearch.delete", "Supprimer la recherche sauvegardée")}
                    title={t("dashboard.savedSearch.delete", "Supprimer la recherche sauvegardée")}
                  >
                    <FiTrash2 />
                  </button>
                  <p className="saved-search-name">{card.name}</p>
                  <p className="saved-search-criteria">{card.criteriaLabel}</p>
                  <Link to={newResultsRoute} className="saved-search-new-results">
                    {t("dashboard.savedSearch.newResults", "{{count}} nouveaux résultats", { count: card.newResultsCount })}
                  </Link>
              </div>
              <div className="saved-search-preview-grid">
                  {(card.previewProperties || []).slice(0, 5).map((preview) => (
                    <Link key={preview.id} to={preview.route || "/property-details"} className="saved-search-preview-item">
                      <img
                        src={preview.coverUrl}
                        alt={t("dashboard.savedSearch.previewAlt", "aperçu")}
                        className="saved-search-preview-image"
                      />
                    </Link>
                  ))}
              </div>
            </div>
          );
          })}
          <div className="dashboard-button-center">
            <Link to="/properties" className="dashboard-button">{t("dashboard.cta.newSearch", "New search")}</Link>
          </div>
        </div>
      )}
    </DashboardSection>
  );
};

export default SavedSearchSection;
