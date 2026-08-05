import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import Html from "./usersHtml";
import shared from "./usersShared";

const WhiteLabelUsers = () => {
  const [params] = useSearchParams();
  const agencyId = params.get("agencyId") || "";
  const [agencyName, setAgencyName] = useState("");
  const [filters, setFilter] = useState({ page: 1, count: 10 });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);

  useEffect(() => {
    if (agencyId) {
      ApiClient.get("user/detail", { id: agencyId }).then((res) => {
        if (res?.success)
          setAgencyName(res.data.agencyName || res.data.fullName);
      });
    }
    getData({ page: 1 });
  }, [agencyId]);

  const getData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...p };
    if (agencyId) filter.whiteLabelAgencyId = agencyId;
    else filter.whiteLabel = "true";
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
        agencyName={agencyName}
        shared={shared}
      />
    </>
  );
};
export default WhiteLabelUsers;
