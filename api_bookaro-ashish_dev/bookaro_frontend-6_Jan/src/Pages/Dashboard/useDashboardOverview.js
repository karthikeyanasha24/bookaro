import { useCallback, useEffect, useState } from "react";
import { getDashboardOverview } from "./dashboard.api";
import { mockDashboardOverview } from "./dashboard.mocks";

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
      const disableFallback = isMockFallbackDisabled();
      // Si le backend répond avec succès et que la réponse est du type attendu (pas HTML, pas cache), on utilise le backend
      if (
        response?.success &&
        response?.data &&
        typeof response.data === "object" &&
        response.data.sections &&
        Object.keys(response.data.sections).length > 0 &&
        !/<!DOCTYPE html>/i.test(JSON.stringify(response.data))
      ) {
        // On fusionne section par section comme avant
        const backendData = response.data;
        const mockSections = mockDashboardOverview.sections;
        const mergedSections = { ...mockSections };
        const usingMock = [];
        Object.keys(mockSections).forEach((sectionKey) => {
          const backendSection = backendData.sections?.[sectionKey];
          if (backendSection && Array.isArray(backendSection.items) && backendSection.items.length > 0) {
            mergedSections[sectionKey] = { ...backendSection, _isMock: false };
          } else if (backendSection && Array.isArray(backendSection.cards) && backendSection.cards.length > 0) {
            mergedSections[sectionKey] = { ...backendSection, _isMock: false };
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
          ...mockDashboardOverview,
          ...backendData,
          sections: mergedSections,
        });
        setError(null);
      } else {
        // Si la réponse backend est absente, invalide ou HTML, on force tout mock
        setData(mockDashboardOverview);
        setError(null);
      }
    } catch (err) {
      setData(mockDashboardOverview);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
