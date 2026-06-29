import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";
import Swal from "sweetalert2";

const ClaimOwnerShip = () => {
  const searchState = { data: "" };
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const history = useNavigate();

  const requestStatusOptions = [
    { id: "pending", name: "Pending" },
    { id: "reject", name: "Rejected" },
    { id: "accept", name: "Accepted" },
  ]

  useEffect(() => {
    setFilter({ ...filters, search: searchState.data });
    getData({ search: searchState.data, page: 1 });
  }, []);

  const sortClass = (key) => {
    let cls = "fa-sort";
    if (filters.key == key && filters.sorder == "asc") cls = "fa-sort-up";
    else if (filters.key == key && filters.sorder == "desc")
      cls = "fa-sort-down";
    return "fa " + cls;
  };

  const sorting = (key) => {
    let sorder = "asc";
    if (filters.key == key) {
      if (filters.sorder == "asc") {
        sorder = "desc";
      } else {
        sorder = "asc";
      }
    }
    let sortBy = `${key} ${sorder}`;
    setFilter({ ...filters, sortBy, key, sorder });
    getData({ sortBy, key, sorder });
  };

  const getData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...p };
    ApiClient.get(shared.listApi, filter).then((res) => {
      if (res.success) {
        setData(res.data.map((itm) => {
          itm.id = itm._id || itm?.id;
          return itm;
        })
        );
        setTotal(res.total);
      }
      setLoader(false);
    });
  };

  const clear = () => {
    let f = {
      groupId: "",
      search: "",
      status: "",
      page: 1,
    };
    setFilter({ ...filters, ...f });
    getData({ ...f });
  };

  const changestatus = (e) => {
    setFilter({ ...filters, status: e, page: 1 });
    getData({ status: e, page: 1 });
  };

  const filter = (p = {}) => {
    let f = { page: 1, ...p }
    setFilter({ ...filters, ...f });
    getData({ ...f });
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
    let url = `/${shared.url}/detail/${id}`;
    history(url);
  };

  const acceptRequest = (itm) => {
    let dto = { id:itm?.id || itm?._id, status: "accept",userId:itm?.userId?._id }
    Swal.fire({
      title: "Property Verification",
      text: `Do you want to accept the request ?`,
      iconHtml: '<img src="/assets/img/svgs/lightbulb.svg" alt="verification-icon" style="width: 50px; height: 50px; padding:4px; " />',
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      customClass: {
        popup: 'custom-alert-popup',  // Custom class for the alert popup
        icon: 'custom-alert-icon'     // Custom class for the icon
      }
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.allApi(shared.statusChange, dto, "put")
          .then((res) => {
            if (res.success) {
              getData();
            }
            loader(false);
          });
      }
    });
  }
  const rejectRequest = (itm) => {
    let dto = { id:itm?.id || itm?._id, status: "reject",userId:itm?.userId?._id }
    Swal.fire({
      title: "Property Verification",
      text: `Do you want to reject the request ?`,
      iconHtml: '<img src="/assets/img/svgs/reject-request.png" alt="verification-icon" style="width: 60px; height: 60px;  " />',
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.allApi(shared.statusChange, dto, "put")
          .then((res) => {
            if (res.success) {
              getData();
            }
            loader(false);
          });
      }
    });
  }

  return (
    <>
      <Html
        view={view}
        clear={clear}
        sortClass={sortClass}
        sorting={sorting}
        count={count}
        pageChange={pageChange}
        filters={filters}
        setFilter={setFilter}
        filter={filter}
        loaging={loaging}
        data={data}
        total={total}
        rejectRequest={rejectRequest}
        acceptRequest={acceptRequest}
        changestatus={changestatus}
        requestStatusOptions={requestStatusOptions}
      />
    </>
  );
};

export default ClaimOwnerShip;
