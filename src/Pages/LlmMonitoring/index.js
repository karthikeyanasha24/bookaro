import { useEffect, useState, useCallback } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import shared from "./shared";

const LlmMonitoring = () => {
  const [filters, setFilter] = useState({ page: 1, limit: 50, errorCode: "", interactionType: "" });
  const [logs, setLogs] = useState([]);
  const [grouped, setGrouped] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorCodes, setErrorCodes] = useState({});
  const [viewMode, setViewMode] = useState("grouped");

  const getErrorCodes = useCallback(() => {
    ApiClient.get(shared.errorCodesApi).then((res) => {
      if (res.success) setErrorCodes(res.data || {});
    });
  }, []);

  const getData = useCallback((p = {}) => {
    setLoading(true);
    const filter = { ...filters, ...p };
    ApiClient.get(shared.logsApi, filter).then((res) => {
      if (res.success) {
        setLogs(res.data?.logs || []);
        setGrouped(res.data?.grouped || []);
        setTotal(res.data?.total || 0);
      }
      setLoading(false);
    });
  }, [filters]);

  useEffect(() => {
    getErrorCodes();
    getData();
  }, []);

  const pageChange = (page) => {
    setFilter({ ...filters, page });
    getData({ page });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilter(newFilters);
    getData(newFilters);
  };

  const clearFilters = () => {
    const cleared = { page: 1, limit: 50, errorCode: "", interactionType: "" };
    setFilter(cleared);
    getData(cleared);
  };

  const toggleStatus = (errorRef, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "traité" : "pending";
    loader(true);
    ApiClient.put(`admin/llm-monitoring/logs/${errorRef}/status`, { status: newStatus }).then((res) => {
      if (res.success) {
        getData();
      }
      loader(false);
    });
  };

  return (
    <Html
      shared={shared}
      logs={viewMode === "grouped" ? grouped : logs}
      loading={loading}
      filters={filters}
      total={total}
      pageChange={pageChange}
      handleFilterChange={handleFilterChange}
      clearFilters={clearFilters}
      errorCodes={errorCodes}
      viewMode={viewMode}
      setViewMode={setViewMode}
      rawLogs={logs}
      toggleStatus={toggleStatus}
    />
  );
};

export default LlmMonitoring;
