import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";

const Onboarding = () => {
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    getData({ search: filters.search, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (p = {}) => {
    setLoading(true);
    const filter = { ...filters, ...p };
    ApiClient.get(shared.listApi, filter).then((res) => {
      if (res.success) {
        setData(res.data || []);
        setTotal(res.total || 0);
      }
      setLoading(false);
    });
  };

  const clear = () => {
    const f = {
      search: "",
      page: 1,
    };
    setFilter({ ...filters, ...f });
    getData(f);
  };

  const filter = () => {
    const f = { page: 1, ...filters };
    setFilter(f);
    getData(f);
  };

  const pageChange = (page) => {
    setFilter({ ...filters, page });
    getData({ page });
  };

  const count = (value) => {
    setFilter({ ...filters, count: value });
    getData({ ...filters, count: value });
  };

  const sorting = (key) => {
    let sorder = "asc";
    if (filters.key === key) {
      sorder = filters.sorder === "asc" ? "desc" : "asc";
    }
    const sortBy = `${key} ${sorder}`;
    setFilter({ ...filters, sortBy, key, sorder });
    getData({ sortBy, key, sorder });
  };

  const view = (id) => {
    history(`/${shared.url}/detail/${id}`);
  };

  return (
    <Html
      clear={clear}
      filter={filter}
      filters={filters}
      setFilter={setFilter}
      loaging={loading}
      data={data}
      total={total}
      pageChange={pageChange}
      count={count}
      sorting={sorting}
      view={view}
      sortKey={filters.key}
      sorderfilter={filters.sorder}
    />
  );
};

export default Onboarding;
