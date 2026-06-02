import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import Html from "./html";
import shared from "./shared";

const ConfidenceLeads = () => {
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "", propertyType: "rent" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getData({ page: 1 });
  }, []);

  const getData = (p = {}) => {
    setError("");
    setLoading(true);
    const filter = { ...filters, ...p };
    ApiClient.get(shared.listApi, filter, "", true).then((res) => {
      if (res.success) {
        setData(res.data.interests?.map((itm) => ({ ...itm, id: itm._id || itm.id })) || []);
        setTotal(res.data?.total || 0);
      } else {
        setError(res.message || "Server Error");
      }
      setLoading(false);
    }).catch(() => {
      setError("Server Error");
      setLoading(false);
    });
  };

  const filter = (p = {}) => {
    const f = { page: 1, ...p };
    setFilter({ ...filters, ...f });
    getData({ ...f });
  };

  const pageChange = (e) => {
    setFilter({ ...filters, page: e });
    getData({ page: e });
  };

  const countChange = (e) => {
    setFilter({ ...filters, count: e });
    getData({ ...filters, count: e });
  };

  return (
    <Html
      loading={loading}
      data={data}
      total={total}
      error={error}
      filters={filters}
      setFilter={setFilter}
      filter={filter}
      pageChange={pageChange}
      count={countChange}
    />
  );
};

export default ConfidenceLeads;
