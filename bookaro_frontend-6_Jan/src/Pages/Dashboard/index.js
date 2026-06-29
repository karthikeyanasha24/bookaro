import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaGripLinesVertical } from "react-icons/fa6";
import PageLayout from "../../components/global/PageLayout";
import "./dashboard.css";
import { useDashboardOverview } from "./useDashboardOverview";
import DashboardHeader from "./components/DashboardHeader";
import TodoListSection from "./components/TodoListSection";
import PropertyAttractivitySection from "./components/PropertyAttractivitySection";
import SavedSearchSection from "./components/SavedSearchSection";
import PastTransactionsSection from "./components/PastTransactionsSection";
import P2PEstimationSection from "./components/P2PEstimationSection";
import P2PReportSection from "./components/P2PReportSection";
import TrainingCenterSection from "./components/TrainingCenterSection";
import SearchPipelineSection from "./components/SearchPipelineSection";
import OwnerPipelineSection from "./components/OwnerPipelineSection";
import FollowedPropertyNewsSection from "./components/FollowedPropertyNewsSection";

const SECTION_ORDERS_BY_MODE = {
  seller: [
    "todoList",
    "trainingCenter",
    "propertyAttractivity",
    "ownerPipeline",
    "p2pReport",
    "pastTransactions",
    "p2pEstimation",
    "savedSearchResults",
    "followedPropertyNews",
    "propertySearchPipeline",
  ],
  buyer: [
    "todoList",
    "trainingCenter",
    "savedSearchResults",
    "followedPropertyNews",
    "propertySearchPipeline",
    "pastTransactions",
    "p2pEstimation",
    "p2pReport",
    "propertyAttractivity",
    "ownerPipeline",
  ],
  owner: [
    "todoList",
    "propertyAttractivity",
    "p2pReport",
    "pastTransactions",
    "followedPropertyNews",
    "trainingCenter",
    "p2pEstimation",
    "ownerPipeline",
    "savedSearchResults",
    "propertySearchPipeline",
  ],
};

const DEFAULT_SECTION_ORDER = SECTION_ORDERS_BY_MODE.buyer;

const DASHBOARD_SECTION_ORDER_STORAGE_KEY_PREFIX = "dashboard.sectionOrder.v2";
const DASHBOARD_DISPLAY_MODE_STORAGE_KEY = "dashboard.displayMode.v1";

const sanitizeDisplayMode = (value) => {
  const allowedModes = new Set(["buyer", "seller", "owner"]);
  return allowedModes.has(value) ? value : "buyer";
};

const getDefaultSectionOrderForMode = (mode) => {
  const safeMode = sanitizeDisplayMode(mode);
  return SECTION_ORDERS_BY_MODE[safeMode] || DEFAULT_SECTION_ORDER;
};

const getSectionOrderStorageKey = (mode) => {
  const safeMode = sanitizeDisplayMode(mode);
  return `${DASHBOARD_SECTION_ORDER_STORAGE_KEY_PREFIX}.${safeMode}`;
};

const enforceFollowedPropertyNewsPosition = (order, mode) => {
  if (!Array.isArray(order) || !order.includes("followedPropertyNews")) return order;

  const safeMode = sanitizeDisplayMode(mode);
  const targetAnchorByMode = {
    buyer: { anchor: "savedSearchResults", place: "after" },
    seller: { anchor: "savedSearchResults", place: "after" },
    owner: { anchor: "trainingCenter", place: "before" },
  };

  const placementRule = targetAnchorByMode[safeMode];
  if (!placementRule) return order;

  const nextOrder = order.filter((item) => item !== "followedPropertyNews");
  const anchorIndex = nextOrder.indexOf(placementRule.anchor);

  if (anchorIndex === -1) {
    nextOrder.push("followedPropertyNews");
    return nextOrder;
  }

  const insertIndex = placementRule.place === "before" ? anchorIndex : anchorIndex + 1;
  nextOrder.splice(insertIndex, 0, "followedPropertyNews");
  return nextOrder;
};

const sanitizeSectionOrder = (value, mode) => {
  const defaultOrder = getDefaultSectionOrderForMode(mode);
  if (!Array.isArray(value)) return defaultOrder;

  const allowed = new Set(defaultOrder);
  const fromStorage = value.filter((item) => typeof item === "string" && allowed.has(item));
  const ordered = [...fromStorage];

  defaultOrder.forEach((item) => {
    if (ordered.includes(item)) return;

    const itemDefaultIndex = defaultOrder.indexOf(item);
    const insertBeforeIndex = ordered.findIndex(
      (existing) => defaultOrder.indexOf(existing) > itemDefaultIndex
    );

    if (insertBeforeIndex === -1) {
      ordered.push(item);
    } else {
      ordered.splice(insertBeforeIndex, 0, item);
    }
  });

  return enforceFollowedPropertyNewsPosition(ordered, mode);
};

const loadPersistedSectionOrder = (mode) => {
  try {
    const rawValue = window.localStorage.getItem(getSectionOrderStorageKey(mode));
    if (!rawValue) return getDefaultSectionOrderForMode(mode);

    const parsedValue = JSON.parse(rawValue);
    return sanitizeSectionOrder(parsedValue, mode);
  } catch (error) {
    return getDefaultSectionOrderForMode(mode);
  }
};

const loadPersistedDisplayMode = () => {
  try {
    const rawValue = window.localStorage.getItem(DASHBOARD_DISPLAY_MODE_STORAGE_KEY);
    return sanitizeDisplayMode(rawValue);
  } catch (error) {
    return "buyer";
  }
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("day");
  const [displayMode, setDisplayMode] = useState("buyer");
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);
  const [isOrderHydrated, setIsOrderHydrated] = useState(false);
  const [draggedSectionId, setDraggedSectionId] = useState(null);
  const [draggedSectionHeight, setDraggedSectionHeight] = useState(0);
  const [dragOverSectionId, setDragOverSectionId] = useState(null);
  const [activeGripSectionId, setActiveGripSectionId] = useState(null);
  const [isResettingOrder, setIsResettingOrder] = useState(false);
  const sectionRefs = useRef({});
  const dragPreviewNodeRef = useRef(null);
  const { data, loading, error } = useDashboardOverview(period);
  const user = useSelector((state) => state.user);

  const sections = data?.sections || {};

  useEffect(() => {
    const initialDisplayMode = loadPersistedDisplayMode();
    setDisplayMode(initialDisplayMode);
    setSectionOrder(loadPersistedSectionOrder(initialDisplayMode));
    setIsOrderHydrated(true);
  }, []);

  useEffect(() => {
    if (!isOrderHydrated) return;

    try {
      window.localStorage.setItem(
        getSectionOrderStorageKey(displayMode),
        JSON.stringify(sanitizeSectionOrder(sectionOrder, displayMode))
      );
    } catch (error) {
      // Ignore storage errors to avoid blocking dashboard rendering.
    }
  }, [displayMode, isOrderHydrated, sectionOrder]);

  useEffect(() => {
    if (!isOrderHydrated) return;

    try {
      window.localStorage.setItem(DASHBOARD_DISPLAY_MODE_STORAGE_KEY, sanitizeDisplayMode(displayMode));
    } catch (error) {
      // Ignore storage errors to avoid blocking dashboard rendering.
    }
  }, [displayMode, isOrderHydrated]);

  const clearDragPreviewNode = () => {
    if (!dragPreviewNodeRef.current) return;
    dragPreviewNodeRef.current.remove();
    dragPreviewNodeRef.current = null;
  };

  const handleSectionDragStart = (event, sectionId) => {
    setDraggedSectionId(sectionId);
    setDragOverSectionId(sectionId);
    setActiveGripSectionId(sectionId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sectionId);

    const wrapper = event.currentTarget?.closest(".dashboard-section-dnd-wrapper");
    if (wrapper && event.dataTransfer?.setDragImage) {
      const sectionElement = wrapper.querySelector(".dashboard-section") || wrapper;
      const previewRect = sectionElement.getBoundingClientRect();
      setDraggedSectionHeight(previewRect.height);

      clearDragPreviewNode();
      const previewNode = sectionElement.cloneNode(true);
      previewNode.style.position = "fixed";
      previewNode.style.top = "0";
      previewNode.style.left = "0";
      previewNode.style.width = `${previewRect.width}px`;
      previewNode.style.margin = "0";
      previewNode.style.pointerEvents = "none";
      previewNode.style.opacity = "0.96";
      previewNode.style.boxShadow = "0 20px 36px rgba(16, 24, 40, 0.22)";
      previewNode.style.transform = "translate(-200vw, -200vh)";
      previewNode.style.zIndex = "9999";
      document.body.appendChild(previewNode);
      dragPreviewNodeRef.current = previewNode;

      const offsetX = Math.max(0, Math.min(previewRect.width, event.clientX - previewRect.left));
      const offsetY = Math.max(0, Math.min(previewRect.height, event.clientY - previewRect.top));
      event.dataTransfer.setDragImage(previewNode, offsetX, offsetY);
    }
  };

  const handleSectionDragOver = (event, sectionId) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (dragOverSectionId !== sectionId) {
      setDragOverSectionId(sectionId);
    }
  };

  const handleSectionDrop = (event, targetSectionId) => {
    event.preventDefault();
    const sourceSectionId = draggedSectionId || event.dataTransfer.getData("text/plain");

    if (!sourceSectionId || sourceSectionId === targetSectionId) {
      setDragOverSectionId(null);
      setActiveGripSectionId(null);
      setDraggedSectionHeight(0);
      clearDragPreviewNode();
      return;
    }

    setSectionOrder((prev) => {
      const sourceIndex = prev.indexOf(sourceSectionId);
      const targetIndex = prev.indexOf(targetSectionId);

      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const next = [...prev];
      const [movedSection] = next.splice(sourceIndex, 1);
      // Drop behavior: dragging down inserts after target, dragging up inserts before target.
      next.splice(targetIndex, 0, movedSection);
      return next;
    });

    setDragOverSectionId(null);
    setDraggedSectionId(null);
    setActiveGripSectionId(null);
    setDraggedSectionHeight(0);
    clearDragPreviewNode();
  };

  const handleSectionDragEnd = () => {
    setDragOverSectionId(null);
    setDraggedSectionId(null);
    setActiveGripSectionId(null);
    setDraggedSectionHeight(0);
    clearDragPreviewNode();
  };

  const handleDisplayModeChange = (nextMode) => {
    const safeMode = sanitizeDisplayMode(nextMode);
    setDisplayMode(safeMode);
    setSectionOrder(loadPersistedSectionOrder(safeMode));
  };

  const handleResetSectionOrder = () => {
    // FLIP animation: capture positions before
    const prevRects = {};
    sectionOrder.forEach((sectionId) => {
      const el = sectionRefs.current[sectionId];
      if (el) prevRects[sectionId] = el.getBoundingClientRect();
    });

    setIsResettingOrder(true);
    setSectionOrder(getDefaultSectionOrderForMode(displayMode));

    setTimeout(() => {
      // After DOM update, measure new positions and animate
      const newRects = {};
      Object.keys(sectionRefs.current).forEach((sectionId) => {
        const el = sectionRefs.current[sectionId];
        if (el) newRects[sectionId] = el.getBoundingClientRect();
      });
      Object.keys(newRects).forEach((sectionId) => {
        const el = sectionRefs.current[sectionId];
        if (!el || !prevRects[sectionId]) return;
        const dy = prevRects[sectionId].top - newRects[sectionId].top;
        if (dy !== 0) {
          el.style.transition = 'none';
          el.style.transform = `translateY(${dy}px)`;
          // Force reflow
          void el.offsetWidth;
          el.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
          el.style.transform = 'translateY(0)';
        }
      });
      // Nettoyage après l'animation
      setTimeout(() => {
        Object.values(sectionRefs.current).forEach((el) => {
          if (el) {
            el.style.transition = '';
            el.style.transform = '';
          }
        });
        setIsResettingOrder(false);
      }, 500);
    }, 30); // Laisse le temps au DOM de se mettre à jour
  };

  const sectionComponents = {
    todoList: (
      <TodoListSection section={sections.todoList} loading={loading} error={error} t={t} />
    ),
    propertyAttractivity: (
      <PropertyAttractivitySection
        section={sections.propertyAttractivity}
        loading={loading}
        error={error}
        period={period}
        onPeriodChange={setPeriod}
        t={t}
      />
    ),
    savedSearchResults: (
      <SavedSearchSection section={sections.savedSearchResults} loading={loading} error={error} t={t} />
    ),
    followedPropertyNews: (
      <FollowedPropertyNewsSection
        section={sections.followedPropertyNews}
        loading={loading}
        error={error}
        t={t}
      />
    ),
    pastTransactions: (
      <PastTransactionsSection section={sections.pastTransactions} loading={loading} error={error} t={t} />
    ),
    p2pEstimation: (
      <P2PEstimationSection section={sections.p2pEstimation} loading={loading} error={error} t={t} />
    ),
    p2pReport: (
      <P2PReportSection section={sections.p2pReport} loading={loading} error={error} t={t} />
    ),
    trainingCenter: (
      <TrainingCenterSection section={sections.trainingCenter} loading={loading} error={error} t={t} />
    ),
    propertySearchPipeline: (
      <SearchPipelineSection section={sections.propertySearchPipeline} loading={loading} error={error} t={t} />
    ),
    ownerPipeline: (
      <OwnerPipelineSection section={sections.ownerPipeline} loading={loading} error={error} t={t} />
    ),
  };

  return (
    <PageLayout>
      <section className="dashboard-page">
        <div className="dashboard-container">
          <DashboardHeader
            firstName={
              user?.firstName
                ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
                : (data?.user?.firstName
                  ? data.user.firstName.charAt(0).toUpperCase() + data.user.firstName.slice(1).toLowerCase()
                  : "User")
            }
            t={t}
            displayMode={displayMode}
            onDisplayModeChange={handleDisplayModeChange}
            onResetSectionOrder={handleResetSectionOrder}
          />

          {sectionOrder.map((sectionId) => {
            const sectionComponent = sectionComponents[sectionId];
            if (!sectionComponent) return null;

            const isDragOver =
              Boolean(draggedSectionId) &&
              draggedSectionId !== sectionId &&
              dragOverSectionId === sectionId;
            const isDragging = draggedSectionId === sectionId;
            const isGripActive = activeGripSectionId === sectionId;

            // Animation lors du reset
            const animateClass = isResettingOrder ? "dashboard-section-reset-animate" : "";

            return (
              <div
                key={sectionId}
                data-section-id={sectionId}
                ref={el => (sectionRefs.current[sectionId] = el)}
                className={`dashboard-section-dnd-wrapper ${
                  isDragOver ? "dashboard-section-drop-target" : ""
                } ${isDragging ? "dashboard-section-dragging" : ""} ${
                  isGripActive ? "dashboard-section-grip-active" : ""
                } ${animateClass}`.trim()}
                onDragOver={(event) => handleSectionDragOver(event, sectionId)}
                onDrop={(event) => handleSectionDrop(event, sectionId)}
              >
                <div className="dashboard-section-dnd-control">
                  <button
                    type="button"
                    className="dashboard-section-drag-handle"
                    draggable
                    onMouseDown={() => setActiveGripSectionId(sectionId)}
                    onMouseUp={() => setActiveGripSectionId(null)}
                    onMouseLeave={() => {
                      if (!draggedSectionId) setActiveGripSectionId(null);
                    }}
                    onDragStart={(event) => handleSectionDragStart(event, sectionId)}
                    onDragEnd={handleSectionDragEnd}
                    aria-label={t("dashboard.dragHandle", "Glisser la section")}
                    title={t("dashboard.dragHandle", "Glisser la section")}
                  >
                    <FaGripLinesVertical />
                  </button>
                </div>
                {isDragging ? (
                  <div
                    className="dashboard-section-drag-placeholder"
                    style={{ height: `${Math.max(120, Math.round(draggedSectionHeight))}px` }}
                    aria-hidden="true"
                  />
                ) : (
                  sectionComponent
                )}
              </div>
            );
          })}
        </div>
      </section>
    </PageLayout>
  );
};

export default DashboardPage;
