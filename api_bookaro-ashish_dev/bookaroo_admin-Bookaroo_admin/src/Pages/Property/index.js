import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared, { removePropData } from "./shared";
import Swal from "sweetalert2";
import axios from "axios";
import environment from "../../environment";
import { toast, ToastContainer } from "react-toastify";
import Sample from "../../assets/PropertiesSample.csv"
import { useSelector } from "react-redux";
import Amenities from "../Amenities";

const Events = () => {
  const searchState = { data: "" };
  const [filters, setFilter] = useState({
    page: 1, count: 10, search: "",
    maxDistance: 0,
    userLat: "",
    userLng: "",
  });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState([])
  const [venueOptions, setVenueOptions] = useState([])
  const [hostOptions, setHostOptions] = useState([])
  const [amentiesOptions, setAmentiesOptions] = useState([])

  const history = useNavigate();

  const typeOptions = [
    { id: "paid", name: "Paid" },
    { id: "free", name: "Free" },
  ]

  useEffect(() => {
    getAllCategories()
    getAllVenues()
    getAllHost()
    setFilter({ ...filters, search: searchState.data });
    removePropData()
    // getData({ search: searchState.data, page: 1 });
  }, []);

  useEffect(() => {
    getData({ search: searchState.data, page: 1, amenities: amentiesOptions ? amentiesOptions?.map((data) => data).join(",") : [] });
  }, [amentiesOptions]);

  const getAllCategories = () => {
    ApiClient.get('amenity/listing').then(res => {
      if (res.success) {
        setCategoryOptions(res?.data?.map((item) => {
          return ({ id: item?.id || item?._id, name: item?.title })
        }))
      }
    })
  }
  const getAllVenues = () => {
    ApiClient.get('user/listing?role=venue&sortBy=venue_name asc').then(res => {
      if (res.success) {
        setVenueOptions(res?.data?.map((item) => {
          return ({ id: item?.id || item?._id, name: item?.venue_name })
        }))
      }
    })
  }
  const getAllHost = () => {
    ApiClient.get('user/listing?role=host&sortBy=fullName asc').then(res => {
      if (res.success) {
        setHostOptions(res?.data?.map((item) => {
          return ({ id: item?.id || item?._id, name: item?.fullName || item?.firstName })
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
    getData({ sortBy, key, sorder });
  };

  const getData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...p, role: shared?.role };
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
        status: "",
        categories: "",
        venue: "",
        host: "",
        type: "",
      };
      setAmentiesOptions([])
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
  const handleFilter = (e, key) => {
    setFilter({ ...filters, [key]: e });
    getData({ [key]: e });
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
        ApiClient.put(shared.statusApi, { id: itm.id }).then((res) => {
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
    window.location.href = `https://book.jcsoftwaresolution.in/property-details?id=${id}`;
  };

  const uploadFile = (e) => {
    let files = e.target.files;
    let file = files?.item(0);
    let url = "user/import-users";
    if (!file) return;
    loader(true);
    ApiClient.postFormFileData(url, { file }).then((res) => {
      if (res.success) {
      }
      loader(false);
    });
  };

  const exportfun = async () => {
    const token = await localStorage.getItem("token");
    const req = await axios({
      method: "get",
      url: `${environment.api}property/exportProperty`,
      responseType: "blob",
      body: { token: token },
    });
    var blob = new Blob([req.data], {
      type: req.headers["content-type"],
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${shared.title}.csv`;
    link.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];

    ApiClient.postFormData('property/importProperty', { file: file }).then(res => {
      if (res.success) {
        toast.success(res?.message)
        getData()
      }
      loader(false)
    })
  }

  const HandleSampleCsv = () => {
    const link = document.createElement('a');
    link.href = Sample;
    link.setAttribute('download', 'propertiesSample');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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
        handleFilter={handleFilter}
        categoryOptions={categoryOptions}
        venueOptions={venueOptions}
        hostOptions={hostOptions}
        typeOptions={typeOptions}
        sorderfilter={filters.sorder}
        sortKey={filters.key}
        exportfun={exportfun}
        uploadFile={uploadFile}
        handleImport={handleImport}
        HandleSampleCsv={HandleSampleCsv}
        isAllow={isAllow}
        amentiesOptions={amentiesOptions}
        setAmentiesOptions={setAmentiesOptions}
      />
    </>
  );
};

export default Events;
