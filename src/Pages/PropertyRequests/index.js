import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import shared from "./shared";
import { removePropData } from "../Property/shared";

const PropertyRequests = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const searchState = { data: "" };
  const [filters, setFilter] = useState({
    page: 1, count: 10,
    search: "",
    add_more_step: true,
    maxDistance: 0,
    userLat: "",
    userLng: "",
    request_status: "",
  });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const [reason, setReason] = useState("");
  useEffect(() => {
    setFilter({ ...filters, search: searchState.data });
    getData({ search: searchState.data, page: 1 });
    removePropData()
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
          itm.id = itm._id;
          return itm;
        })
        );
        setTotal(res.total);
      }
      setLoader(false);
    });
  };
  const clear = (search) => {
    let f = {};
    if (search) {
      f = {
        search: "",
      };
    } else {
      f = {
        search: "",
        add_more_step: true,
        maxDistance: 0,
        userLat: "",
        userLng: "",
        request_status: "",
      };
    }
    setFilter({ ...filters, ...f });
    getData({ ...f });
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
  const handleFilter = (e, key) => {
    setFilter({ ...filters, [key]: e });
    getData({ [key]: e });
  };
  const view = (id) => {
    let url = `/property/detail/${id}`;
    navigate(url, { state: { backTo: "property-requests" } });
  };
  const isAllow = (key = "") => {
    let permissions = user.permissions?.[0];
    let value = permissions?.[key];
    // return true;
    if (user.role == 'admin') value = true
    return value;
  };
  const acceptRequest = (itm) => {
    let dto = { ...itm, request_status: "accepted" }
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
        ApiClient.allApi(shared.editApi, dto, "put")
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
    let dto = {
      ...itm, request_status: "rejected",
      // reason
    }
    Swal.fire({
      title: "Reason for rejecting Property Verification Request",
      text: `Reason for Rejection`,
      iconHtml: '<img src="/assets/img/svgs/reject-request.png" alt="verification-icon" style="width: 60px; height: 60px;  " />',
      html: `  
      <textarea id="reason" class="swal2-textarea" placeholder="Reason for Rejection..." style="width:80%; height:100px;"></textarea>
    `,
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      didOpen: () => {
        const textarea = Swal.getPopup().querySelector("#reason");
        textarea.addEventListener("input", (e) => setReason(e.target.value));
      },
      preConfirm: () => {
        const textarea = Swal.getPopup().querySelector("#reason");
        if (!textarea.value.trim()) {
          Swal.showValidationMessage("Please enter a reason.");
        }
        return textarea.value;
      },
      customClass: {
        popup: 'reject-alert-popup',  // Custom class for the alert popup
        icon: 'custom-alert-icon'     // Custom class for the icon
      }
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.allApi(shared.editApi, dto, "put")
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
        handleFilter={handleFilter}
        sorderfilter={filters.sorder}
        sortKey={filters.key}
        isAllow={isAllow}
        acceptRequest={acceptRequest}
        rejectRequest={rejectRequest}
      />
    </>
  );
};

export default PropertyRequests;
