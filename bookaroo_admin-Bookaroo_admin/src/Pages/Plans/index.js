import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const Plans = () => {
  const searchState = { data: "" };
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const history = useNavigate();

  const planTypeOptions = [
    { id: "free", name: "Free" },
    { id: "paid", name: "Paid" }
  ]
  // Add more role if needed
  const roleOptions = [
    { id: "monthly", name: "Monthly" },
    { id: "annually", name: "Annually" }
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
        page: 1,
      };
    } else {
      f = {
        search: "",
        page: 1,
        status: "",
        role: "",
        planType: "",
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

  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this ${shared?.addTitle}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.delete(shared.deleteApi, { id: id }).then((res) => {
          if (res.success) {
            clear();
          }
          loader(false);
        });
      }
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
  const handleFilters = (e, key) => {
    setFilter({ ...filters, [key]: e, page: 1 });
    getData({ [key]: e, page: 1 });
  };

  const statusChange = (itm) => {
    let status = "active";
    if (itm.status == "active") status = "deactive";
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${status == "active" ? "Active" : "Inactive"
        } this ${shared?.addTitle}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.put(shared.statusApi, { id: itm.id, status }).then((res) => {
          if (res.success) {
            getData();
          }
          loader(false);
        });
      }
    });
  };

  const edit = (id) => {
    history(`/${shared.url}/edit/${id}`);
  };

  const view = (id) => {
    let url = `/${shared.url}/detail/${id}`;
    history(url);
  };

  const user = useSelector((state) => state.user);
  const isAllow = (key = "") => {

    let permissions = user.permissions?.[0];
    let value = permissions?.[key];
    // return true;
    if (user.role == 'admin') value = true
    return value;
  };

  return (
    <>
      <Html
        edit={edit}
        view={view}
        clear={clear}
        sortClass={sortClass}
        sorting={sorting}
        count={count}
        pageChange={pageChange}
        deleteItem={deleteItem}
        filters={filters}
        setFilter={setFilter}
        filter={filter}
        loaging={loaging}
        data={data}
        total={total}
        statusChange={statusChange}
        handleFilters={handleFilters}
        planTypeOptions={planTypeOptions}
        roleOptions={roleOptions}
        isAllow={isAllow}
      />
    </>
  );
};

export default Plans;
