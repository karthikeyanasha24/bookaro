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
      const response = await getDashboardOverview(period);
      const disableFallback = isMockFallbackDisabled();
      if (response?.success && isValidDashboardPayload(response?.data)) {
        setData(response.data);
        setError(null);
      } else {
        const missingSections = getMissingSections(response?.data);
        console.warn("[dashboard] Invalid payload", {
          period,
          missingSections,
          responseSuccess: response?.success,
          fallbackApplied: !disableFallback,
        });
        if (disableFallback) {
          setData(null);
          setError(new Error("Invalid dashboard payload"));
        } else {
          setData(mockDashboardOverview);
          setError(null);
        }
      }
    } catch (err) {
      const disableFallback = isMockFallbackDisabled();
      console.warn("[dashboard] Request failed", {
        period,
        message: err?.message,
        fallbackApplied: !disableFallback,
      });
      if (disableFallback) {
        setData(null);
        setError(err || new Error("Dashboard request failed"));
      } else {
        setData(mockDashboardOverview);
        setError(null);
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
