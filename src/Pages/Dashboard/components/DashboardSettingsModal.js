import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaGripLinesVertical } from "react-icons/fa6";

const SECTION_DEFINITIONS = [
  { id: "todoList", labelKey: "dashboard.settings.todoList", defaultLabel: "To-do liste", toggleDisabled: true, gripDisabled: true },
  { id: "propertyAttractivity", labelKey: "dashboard.settings.propertyAttractivity", defaultLabel: "Attractivité de votre bien", toggleDisabled: false, gripDisabled: false },
  { id: "p2pEstimation", labelKey: "dashboard.settings.p2pEstimation", defaultLabel: "Les biens à estimer", toggleDisabled: true, gripDisabled: false },
  { id: "p2pReport", labelKey: "dashboard.settings.p2pReport", defaultLabel: "Estimation de votre bien", toggleDisabled: false, gripDisabled: false },
  { id: "followedPropertyNews", labelKey: "dashboard.settings.followedPropertyNews", defaultLabel: "Actualité des biens suivis", toggleDisabled: true, gripDisabled: false },
  { id: "trainingCenter", labelKey: "dashboard.settings.trainingCenter", defaultLabel: "Formez-vous à l'immobilier", toggleDisabled: true, gripDisabled: false },
  { id: "pastTransactions", labelKey: "dashboard.settings.pastTransactions", defaultLabel: "Prix du marché", toggleDisabled: true, gripDisabled: false },
  { id: "ownerPipeline", labelKey: "dashboard.settings.ownerPipeline", defaultLabel: "Vente ou location de votre bien", toggleDisabled: false, gripDisabled: false },
  { id: "savedSearchResults", labelKey: "dashboard.settings.savedSearchResults", defaultLabel: "Derniers résultats de recherche sauvegardée", toggleDisabled: false, gripDisabled: false },
  { id: "propertySearchPipeline", labelKey: "dashboard.settings.propertySearchPipeline", defaultLabel: "Statistique de votre recherche de bien", toggleDisabled: false, gripDisabled: false },
];

const DISPLAY_MODE_OPTIONS = [
  { value: "buyer", labelKey: "dashboard.displayMode.buyer", defaultLabel: "Acheteur" },
  { value: "renter", labelKey: "dashboard.displayMode.renter", defaultLabel: "Locataire" },
  { value: "seller", labelKey: "dashboard.displayMode.seller", defaultLabel: "Vendeur" },
  { value: "owner", labelKey: "dashboard.displayMode.owner", defaultLabel: "Propriétaire" },
];

const DashboardSettingsModal = ({
  open,
  onClose,
  mode,
  sectionOrder,
  sectionVisibility,
  onModeChange,
  onSectionOrderChange,
  onSectionVisibilityChange,
  onResetProfile,
  onSavePreferences,
  t,
}) => {
  const [draggedSectionId, setDraggedSectionId] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState({ sectionId: null, position: null });
  const [localOrder, setLocalOrder] = useState(sectionOrder);
  const [localVisibility, setLocalVisibility] = useState(sectionVisibility);

  useEffect(() => {
    setLocalOrder(sectionOrder);
  }, [sectionOrder]);

  useEffect(() => {
    setLocalVisibility(sectionVisibility);
  }, [sectionVisibility]);

  const handleToggleVisibility = (sectionId, disabled) => {
    if (disabled) return;
    const nextVisibility = { ...localVisibility, [sectionId]: !localVisibility[sectionId] };
    setLocalVisibility(nextVisibility);
    onSectionVisibilityChange(nextVisibility);
    onSavePreferences({ mode, sectionOrder: localOrder, sectionVisibility: nextVisibility });
  };

  const handleDragStart = (event, sectionId) => {
    setDraggedSectionId(sectionId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sectionId);
  };

  const handleDragOver = (event, sectionId) => {
    event.preventDefault();
    if (sectionId === draggedSectionId) {
      setDragOverTarget({ sectionId: null, position: null });
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const position = event.clientY - rect.top < rect.height / 2 ? "above" : "below";
    setDragOverTarget({ sectionId, position });
  };

  const handleDrop = (event, sectionId) => {
    event.preventDefault();
    if (!draggedSectionId) return;
    const nextOrder = [...localOrder];
    const sourceIndex = nextOrder.indexOf(draggedSectionId);
    const targetIndex = nextOrder.indexOf(sectionId);
    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedSectionId(null);
      setDragOverTarget({ sectionId: null, position: null });
      return;
    }

    nextOrder.splice(sourceIndex, 1);
    let insertIndex = targetIndex;
    if (dragOverTarget.position === "below") {
      insertIndex = targetIndex + 1;
    }
    if (sourceIndex < insertIndex) insertIndex -= 1;
    nextOrder.splice(insertIndex, 0, draggedSectionId);

    setLocalOrder(nextOrder);
    onSectionOrderChange(nextOrder);
    onSavePreferences({ mode, sectionOrder: nextOrder, sectionVisibility: localVisibility });
    setDraggedSectionId(null);
    setDragOverTarget({ sectionId: null, position: null });
  };

  const handleModeChange = (nextMode) => {
    onModeChange(nextMode);
  };

  const handleResetProfile = () => {
    onResetProfile(mode);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[9999]">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl bg-white rounded-[20px] shadow-xl overflow-hidden dashboard-settings-modal-panel">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-semibold">
              {t("dashboard.settings.title", "Gérer l'affichage de votre dashboard")}
            </DialogTitle>
            <button
              type="button"
              className="text-slate-500 hover:text-slate-900"
              onClick={onClose}
              aria-label={t("dashboard.settings.close", "Fermer")}
            >
              ✕
            </button>
          </div>
          <div className="px-6 py-4 space-y-4 dashboard-settings-modal-body">
            <div>
              <p className="text-sm text-slate-500 mb-2">
                {t("dashboard.settings.selectProfile", "Sélectionnez le profil à modifier")}
              </p>
              <div className="dashboard-settings-profile-buttons">
                {DISPLAY_MODE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-full border px-3 py-2 text-sm ${mode === option.value ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"}`}
                    onClick={() => handleModeChange(option.value)}
                  >
                    {t(option.labelKey, option.defaultLabel)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold">{t("dashboard.settings.sectionsTitle", "Sections disponibles")}</p>
              <button
                type="button"
                className="text-sm text-slate-700 underline"
                onClick={handleResetProfile}
              >
                {t("dashboard.settings.resetProfile", "Réinitialiser le profil")}
              </button>
            </div>
            <div className="space-y-2">
              {localOrder.map((sectionId) => {
                const def = SECTION_DEFINITIONS.find((item) => item.id === sectionId);
                if (!def) return null;
                const isToggleDisabled = def.toggleDisabled;
                const isGrippable = !def.gripDisabled;
                const checked = localVisibility?.[sectionId] !== false;

                return (
                  <div
                    key={sectionId}
                    draggable={isGrippable}
                    onDragStart={(event) => isGrippable && handleDragStart(event, sectionId)}
                    onDragOver={(event) => isGrippable && handleDragOver(event, sectionId)}
                    onDrop={(event) => isGrippable && handleDrop(event, sectionId)}
                    className="dashboard-settings-row"
                  >
                    <div className="dashboard-settings-drag-handle-wrapper">
                      {isGrippable ? (
                        <FaGripLinesVertical className="dashboard-settings-drag-handle" />
                      ) : (
                        <div className="dashboard-settings-drag-placeholder" />
                      )}
                    </div>
                    <div className={`dashboard-settings-row-text ${dragOverTarget.sectionId === sectionId ? `dashboard-settings-drop-${dragOverTarget.position}` : ""}`}>
                      {t(def.labelKey, def.defaultLabel)}
                    </div>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isToggleDisabled}
                        onChange={() => handleToggleVisibility(sectionId, isToggleDisabled)}
                        className="dashboard-settings-checkbox"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DashboardSettingsModal;
