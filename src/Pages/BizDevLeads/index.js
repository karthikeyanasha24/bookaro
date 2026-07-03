import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import Html from "./html";

const BizDevLeads = () => {
  const [activeTab, setActiveTab] = useState("agencies"); // "agencies" | "anyhomes"

  const [agencyFilters, setAgencyFilters] = useState({ page: 1, count: 20, search: "" });
  const [agencyData, setAgencyData] = useState([]);
  const [agencyTotal, setAgencyTotal] = useState(0);
  const [agencyLoading, setAgencyLoading] = useState(false);

  const [anyHomesFilters, setAnyHomesFilters] = useState({ page: 1, count: 20, search: "" });
  const [anyHomesData, setAnyHomesData] = useState([]);
  const [anyHomesTotal, setAnyHomesTotal] = useState(0);
  const [anyHomesLoading, setAnyHomesLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    getAgencyData({ page: 1 });
    getAnyHomesData({ page: 1 });
  }, []);

  const getAgencyData = (p = {}) => {
    setError("");
    setAgencyLoading(true);
    const filter = { ...agencyFilters, ...p };
    ApiClient.get("admin/bizdev-leads/agencies", filter, "", true).then((res) => {
      if (res.success) {
        setAgencyData(res.data || []);
        setAgencyTotal(res.total || 0);
      } else {
        setError(res.message || "Server Error");
      }
      setAgencyLoading(false);
    }).catch(() => {
      setError("Server Error");
      setAgencyLoading(false);
    });
  };

  const getAnyHomesData = (p = {}) => {
    setError("");
    setAnyHomesLoading(true);
    const filter = { ...anyHomesFilters, ...p };
    ApiClient.get("admin/bizdev-leads/anyhomes", filter, "", true).then((res) => {
      if (res.success) {
        setAnyHomesData(res.data || []);
        setAnyHomesTotal(res.total || 0);
      } else {
        setError(res.message || "Server Error");
      }
      setAnyHomesLoading(false);
    }).catch(() => {
      setError("Server Error");
      setAnyHomesLoading(false);
    });
  };

  const agencyFilter = (p = {}) => {
    const f = { page: 1, ...p };
    setAgencyFilters((prev) => ({ ...prev, ...f }));
    getAgencyData(f);
  };

  const anyHomesFilter = (p = {}) => {
    const f = { page: 1, ...p };
    setAnyHomesFilters((prev) => ({ ...prev, ...f }));
    getAnyHomesData(f);
  };

  return (
    <Html
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      error={error}
      agencyData={agencyData}
      agencyTotal={agencyTotal}
      agencyLoading={agencyLoading}
      agencyFilters={agencyFilters}
      setAgencyFilters={setAgencyFilters}
      agencyFilter={agencyFilter}
      agencyPageChange={(e) => { setAgencyFilters((prev) => ({ ...prev, page: e })); getAgencyData({ page: e }); }}
      agencyCountChange={(e) => { setAgencyFilters((prev) => ({ ...prev, count: e })); getAgencyData({ ...agencyFilters, count: e }); }}
      anyHomesData={anyHomesData}
      anyHomesTotal={anyHomesTotal}
      anyHomesLoading={anyHomesLoading}
      anyHomesFilters={anyHomesFilters}
      setAnyHomesFilters={setAnyHomesFilters}
      anyHomesFilter={anyHomesFilter}
      anyHomesPageChange={(e) => { setAnyHomesFilters((prev) => ({ ...prev, page: e })); getAnyHomesData({ page: e }); }}
      anyHomesCountChange={(e) => { setAnyHomesFilters((prev) => ({ ...prev, count: e })); getAnyHomesData({ ...anyHomesFilters, count: e }); }}
    />
  );
};

export default BizDevLeads;
