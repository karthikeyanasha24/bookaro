import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import Html from "./html";
import shared from "./shared";

const WhiteLabel = () => {
  const [filters, setFilter] = useState({ page: 1, count: 10 });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);

  useEffect(() => {
    getData({ page: 1 });
  }, []);

  const getData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...p, accountType: "pro", whiteLabelActive: "true" };
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

  const view = (id) => {
    window.open(`/user/detail/${id}`, "_blank");
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
        view={view}
      />
    </>
  );
};
export default WhiteLabel;
