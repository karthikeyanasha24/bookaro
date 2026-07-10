import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import shared from "./shared";

const MoteurImmoRuns = () => {
  const [filters, setFilter] = useState({ page: 1, count: 10 });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);

  useEffect(() => {
    getData({ page: 1 });
  }, []);

  const getData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...p };
    ApiClient.get(shared.listApi, filter).then((res) => {
      if (res.success) {
        setData(
          res.data.map((itm) => {
            itm.id = itm._id;
            return itm;
          })
        );
        setTotal(res.total);
      }
      setLoader(false);
    });
  };

  const pageChange = (e) => {
    setFilter({ ...filters, page: e });
    getData({ page: e });
  };

  const count = (e) => {
    setFilter({ ...filters, count: e });
    getData({ ...filters, count: e });
  };

  return (
    <>
      <Html
        pageChange={pageChange}
        count={count}
        filters={filters}
        loaging={loaging}
        data={data}
        total={total}
      />
    </>
  );
};

export default MoteurImmoRuns;
