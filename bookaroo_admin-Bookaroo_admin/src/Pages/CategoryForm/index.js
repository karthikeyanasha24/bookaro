import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const CategoryForm = () => {
  const searchState = { data: "" };
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [data, setData] = useState([]);
  const [contactdata, setContactData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const [showForm, setShowForm] = useState('contact')
  const history = useNavigate();

  useEffect(() => {
    setFilter({ ...filters, search: searchState.data });
    getcontactData({ search: searchState.data, page: 1 });
    getCategoryData({ search: searchState.data, page: 1 });
    getCategory()
  }, []);


  const getCategory = () => {
    ApiClient.get('blogCategories/list').then(res => {
      if (res.success) {
        setCategoryOptions(res?.data?.map((item) => {
          return ({ id: item?.id || item?._id, name: item?.CategoryName })
        }))
      }
    })
  }

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
    getCategoryData({ sortBy, key, sorder });
  };

  const getCategoryData = (p = {}) => {
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

  const getcontactData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...p };
    ApiClient.get(`contactTeam/list`, filter).then((res) => {
      if (res.success) {
        setContactData(res.data.map((itm) => {
          itm.id = itm._id || itm?.id;
          return itm;
        })
        );
        setTotal(res.total);
      }
      setLoader(false);
    });
  };

  const clear = (search) => {
    let f = {}
    if (search) {
      f = {
        search: "",
        page: 1,
      }
    } else {
      f = {
        groupId: "",
        search: "",
        categoryId: "",
        page: 1,
        role: "",
      }
    }
    setFilter({ ...filters, ...f });
    getCategoryData({ ...f });
  };

  const filter = (p = {}) => {
    let f = { page: 1, ...p }
    setFilter({ ...filters, ...f });
    getCategoryData({ ...f });
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
    getCategoryData({ page: e });
  };
  const count = (e) => {
    setFilter({ ...filters, count: e });
    getCategoryData({ ...filters, count: e });
  };
  const changestatus = (e) => {
    setFilter({ ...filters, categoryId: e, page: 1 });
    getCategoryData({ categoryId: e, page: 1 });
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
        ApiClient.put(shared.statusApi, { id: itm.id || itm._id, status }).then((res) => {
          if (res.success) {
            getCategoryData();
          }
          loader(false);
        });
      }
    });
  };

  const edit = (id) => {
    history(`/${shared.url}/edit/${id}`);
  };

  const view = (id,key="Contact") => {
    let url = `/${shared.url}/detail/${id}?Form=${key}`;
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
        contactdata={contactdata}
        setShowForm={setShowForm}
        showForm={showForm}
        total={total}
        categoryOptions={categoryOptions}
        statusChange={statusChange}
        changestatus={changestatus}
        sorderfilter={filters.sorder}
        sortKey={filters.key}
        isAllow={isAllow}
      />
    </>
  );
};

export default CategoryForm;
