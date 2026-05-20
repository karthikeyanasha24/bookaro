import { useCallback, useEffect, useState } from "react";
import { getDashboardOverview } from "./dashboard.api";
import { mockDashboardOverview } from "./dashboard.mocks";
import { isGuestMode } from "../../methods/guestMode";

const IS_NON_PRODUCTION = process.env.NODE_ENV !== "production";
const DISABLE_MOCK_FALLBACK = process.env.REACT_APP_DASHBOARD_DISABLE_MOCK_FALLBACK === "true";
const isMockFallbackDisabled = () => {
  if (DISABLE_MOCK_FALLBACK) return true;
  if (IS_NON_PRODUCTION && typeof window !== "undefined") {
    return window.localStorage?.getItem("disableDashboardMockFallback") === "true";
  }
  return false;
};

const REQUIRED_SECTIONS = [
  "todoList",
  "propertyAttractivity",
  "savedSearchResults",
  "pastTransactions",
  "p2pEstimation",
  "p2pReport",
  "trainingCenter",
  "propertySearchPipeline",
  "ownerPipeline",
  "followedPropertyNews",
];

const getMissingSections = (payload) => {
  if (!payload?.sections) return [...REQUIRED_SECTIONS];
  return REQUIRED_SECTIONS.filter((sectionKey) => payload.sections?.[sectionKey] == null);
};

const isValidDashboardPayload = (payload) => {
  const missingSections = getMissingSections(payload);
  return Boolean(
    payload &&
      payload.user &&
      payload.meta &&
      payload.sections &&
      missingSections.length === 0
  );
};

const hasBackendSectionContent = (backendSection) => {
  if (!backendSection || typeof backendSection !== "object") return false;
  if (Array.isArray(backendSection.items) && backendSection.items.length > 0) return true;
  if (Array.isArray(backendSection.cards) && backendSection.cards.length > 0) return true;
  if (Array.isArray(backendSection.properties) && backendSection.properties.length > 0) return true;
  if (backendSection.metrics && Object.keys(backendSection.metrics).length > 0) return true;
  return Object.keys(backendSection).length > 1;
};

export const useDashboardOverview = (period) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // On tente d'appeler le backend
      const response = await getDashboardOverview(period);
      const backendData = response?.data;
      const guestMode = isGuestMode();
      const disableFallback = isMockFallbackDisabled();
      const shouldFallback = !disableFallback;

      // Si le backend répond avec succès et que la réponse est du type attendu (pas HTML, pas cache), on utilise le backend
      if (
        response?.success &&
        backendData &&
        typeof backendData === "object" &&
        backendData.sections &&
        Object.keys(backendData.sections).length > 0 &&
        !/<!DOCTYPE html>/i.test(JSON.stringify(backendData))
      ) {
        // On fusionne section par section comme avant
        const mockSections = mockDashboardOverview.sections;
        const mergedSections = { ...mockSections };
        const usingMock = [];
        Object.keys(mockSections).forEach((sectionKey) => {
          const backendSection = backendData.sections?.[sectionKey];
          const shouldShowBackendSection = hasBackendSectionContent(backendSection);
          if (shouldShowBackendSection) {
            mergedSections[sectionKey] = {
              ...backendSection,
              _isMock: backendSection._isMock === true ? true : false,
            };
          } else {
            mergedSections[sectionKey] = { ...mockSections[sectionKey], _isMock: true };
            usingMock.push(sectionKey);
          }
        });
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.log("[DASHBOARD][MOCK] Sections utilisant le mock:", usingMock);
        }
        setData({
          ...backendData,
          sections: mergedSections,
        });
        setError(null);
      } else if (shouldFallback) {
        // Si la réponse backend est absente, invalide ou HTML, on force tout mock uniquement
        // lorsque le mock fallback est activé et que nous ne sommes pas en mode invité.
        setData(mockDashboardOverview);
        setError(null);
      } else {
        setData(null);
        setError(new Error("Invalid dashboard payload"));
      }
    } catch (err) {
      const guestMode = isGuestMode();
      const disableFallback = isMockFallbackDisabled();
      const shouldFallback = !disableFallback;
      if (shouldFallback) {
        setData(mockDashboardOverview);
        setError(null);
      } else {
        setData(null);
        setError(err || new Error("Dashboard request failed"));
      }
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
