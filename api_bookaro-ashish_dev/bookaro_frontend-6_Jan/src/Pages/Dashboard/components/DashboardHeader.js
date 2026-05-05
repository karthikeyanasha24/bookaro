const DashboardHeader = ({
  firstName,
  t,
  displayMode = "buyer",
  onDisplayModeChange,
  onResetSectionOrder,
}) => {
  const displayModeOptions = [
    { value: "buyer", label: t("dashboard.displayMode.buyer", "Acheteur") },
    { value: "seller", label: t("dashboard.displayMode.seller", "Vendeur") },
    { value: "owner", label: t("dashboard.displayMode.owner", "Propriétaire") },
  ];

  return (
    <>
      <div className="dashboard-welcome">
        <h1>
          {t("dashboard.welcome", "Welcome")} {firstName}
        </h1>
        <p>{t("dashboard.subtitle", "Here is your real-estate project cockpit")}</p>
        <div className="dashboard-display-mode-wrap">
          <p className="dashboard-display-mode-label">
            {t("dashboard.displayMode.label", "Personnalisez l'affichage de votre tableau de board")}
          </p>
          <div className="dashboard-display-mode-toggle" role="tablist" aria-label={t("dashboard.displayMode.label", "Personnalisez l'affichage de votre tableau de board")}>
            {displayModeOptions.map((option) => {
              const isActive = displayMode === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`dashboard-display-mode-option ${isActive ? "active" : ""}`.trim()}
                  onClick={() => onDisplayModeChange && onDisplayModeChange(option.value)}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="dashboard-reset-order-btn"
            onClick={() => onResetSectionOrder && onResetSectionOrder()}
          >
            {t("dashboard.displayMode.resetOrder", "Réinitialiser ordre")}
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
