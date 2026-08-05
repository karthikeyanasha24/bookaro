import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const ValorizationItem = () => {
  const searchState = { data: "" };
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const history = useNavigate();
  const user = useSelector((state) => state.user);
  const isAllow = (key = "") => {
    let permissions = user.permissions?.[0];
    let value = permissions?.[key];
    if (user.role == 'admin') value = true;
    return value;
  };

  useEffect(() => {
    setFilter({ ...filters, search: searchState.data });
    getData({ search: searchState.data, page: 1 });
  }, []);

  const sortClass = (key) => {
    let cls = "fa-sort";
    if (filters.key == key && filters.sorder == "asc") cls = "fa-sort-up";
    else if (filters.key == key && filters.sorder == "desc") cls = "fa-sort-down";
    return "fa " + cls;
  };

  const sorting = (key) => {
    let sorder = "asc";
    if (filters.key == key) {
      sorder = filters.sorder == "asc" ? "desc" : "asc";
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
        const mapped = (res.data || []).map((itm) => { itm.id = itm._id; return itm; });
        setData(mapped);
        setTotal(res.total);
      }
      setLoader(false);
    });
  };

  const clear = (search) => {
    let f = search ? { search: "", page: 1 } : { search: "", page: 1 };
    setFilter({ ...filters, ...f });
    getData({ ...f });
  };

  const pageChange = (page) => {
    setFilter({ ...filters, page });
    getData({ page });
  };

  const count = (count) => {
    setFilter({ ...filters, count, page: 1 });
    getData({ count, page: 1 });
  };

  const edit = (id) => {
    history(`/${shared.url}/edit/${id}`);
  };

  const filter = () => {
    setFilter({ ...filters, page: 1 });
    getData({ page: 1 });
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.allApi(shared.deleteApi, { id }, "delete").then((res) => {
          if (res.success) {
            getData();
            Swal.fire("Deleted!", "Item has been deleted.", "success");
          }
          loader(false);
        });
      }
    });
  };

  return (
    <Html
      sorting={sorting}
      filter={filter}
      edit={edit}
      pageChange={pageChange}
      count={count}
      deleteItem={deleteItem}
      clear={clear}
      filters={filters}
      setFilter={setFilter}
      loaging={loaging}
      data={data}
      total={total}
      sortClass={sortClass}
      sorderfilter={filters.sorder}
      sortKey={filters.key}
      isAllow={isAllow}
    />
  );
};

export default ValorizationItem;
