import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import Html from "./html";
import shared from "./shared";

const ScoreInterests = () => {
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData({ page: 1 });
  }, []);

  const getData = (p = {}) => {
    setLoading(true);
    const filter = { ...filters, ...p };
    ApiClient.get(shared.listApi, filter).then((res) => {
      if (res.success) {
        setData(
          res.data.interests?.map((itm) => ({ ...itm, id: itm._id || itm.id })) || []
        );
        setTotal(res.data?.total || 0);
      }
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
      filters={filters}
      setFilter={setFilter}
      filter={filter}
      pageChange={pageChange}
      count={countChange}
    />
  );
};

export default ScoreInterests;
