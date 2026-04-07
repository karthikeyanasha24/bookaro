import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaFolderOpen } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import PageLayout from "../../components/global/PageLayout";
import Table from "../../components/Table";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { shared } from "./shared";

const FollowedProperty = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state);
  const [openPopup, setOpenPopup] = useState(false);
  const [data, setData] = useState([]);
  const [folders, setFolders] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [editFolder, setEditFolder] = useState(null);

  const handleCheckboxChange = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = data.map((row) => row._id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };
  const columns = [
    {
      key: "checkbox",
      name: (
        <input
          type="checkbox"
          checked={selected.length === data.length && data.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      render: (row) => {
        return (
          <input
            type="checkbox"
            checked={selected?.includes(row?._id)}
            onChange={() => handleCheckboxChange(row?._id)}
          />
        );
      },
    },
    {
      key: "username",
      name: "User Name",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.username || "---"}</span>;
      },
    },
    {
      key: "propertyTitle",
      name: "Property Title",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.propertyTitle || "---"}</span>;
      },
    },
    {
      key: "propertyType",
      name: "Property Type",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.type || "---"}</span>;
        // return <span className="capitalize">{`${row?.propertyType && row?.type ?
        //   `${row.propertyType === "offmarket" ? "Off-Market" : row.propertyType}, ${row.type}` :
        //   `${row.propertyType === "offmarket" ? "Off-Market" : row.propertyType || row.type || "---"}`
        //   }`}</span>;
      },
    },
    {
      key: "price",
      name: "Price",
      sort: true,
      render: (row) => <span>{row?.price && row?.price + ` €` || "---"}</span>,
    },
    {
      key: "address",
      name: "Location",
      sort: true,
      render: (row) => <span>{row?.address || "---"}</span>,
    },
  ];
  const [filters, setFilters] = useState({
    page: 1,
    count: 10,
    search: "",
    userId: user?._id,
    follow_unfollow: true,
    maxDistance: 0,
    userLat: "",
    userLng: "",
  });
  const closePopup = () => {
    setOpenPopup(false);
    setSelected([]);
    setName("");
    setEditFolder(null)
  };
  const pageChange = (e) => {
    setFilters({ ...filters, page: e });
    getProperties({ page: e });
  };
  const count = (e) => {
    setFilters({ ...filters, count: e });
    getProperties({ ...filters, count: e });
  };
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
    setFilters({ ...filters, sortBy, key, sorder });
    getProperties({ sortBy, key, sorder });
  };
  const getProperties = (p = {}) => {
    let dto = { ...filters, ...p };
    loader(true);
    ApiClient.get("property/listing", dto).then((res) => {
      if (res.success) {
        setData(res?.data);
        setTotal(res?.total);
      }
      loader(false);
    });
  };
  const addItem = () => {
    if (!name?.trim()) return toast.error("Enter folder name");
    // if (selected?.length == 0) return toast.error("Select atleast a property");
    let dto = { name: name, property_id: selected };
    loader(true);
    ApiClient.post(shared.add, dto).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setOpenPopup(false);
        setSelected([]);
        setName("");
        getItems();
      }
      loader(false);
    });
  };
  const getItems = (p = {}) => {
    ApiClient.get(shared.get).then((res) => {
      loader(true);
      if (res.success) {
        setFolders(res?.data);
      }
      loader(false);
    });
  };
  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this ${shared?.title}`,
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
            getItems();
          }
          loader(false);
        });
      }
    });
  };
  const viewItem = (itm) => {
    navigate(`/followed-properties-list?id=${itm?.id}`)
  };
  const editItem = (itm) => {
    setOpenPopup(true);
    setEditFolder(itm);
    setName(itm?.name);
    setSelected(itm?.property_id);
  };
  const submitEditItem = () => {
    if (!name?.trim()) return toast.error("Enter folder name");
    // if (selected?.length == 0) return toast.error("Select atleast a property");

    let dto = { id: editFolder?.id, name: name, property_id: selected };
    ApiClient.put(shared.edit, dto).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setOpenPopup(false);
        setSelected([]);
        setEditFolder(null);
        setName("");
        setSelected([]);
        getItems();
      }
    });
  };

  useEffect(() => {
    getProperties();
    getItems();
  }, []);

  return (
    <PageLayout>
      <section className="  pt-14 lg:pt-16 pb-[100px]  bg-[#f2ecf8] relative">
        <div className="container   px-8 mx-auto xl:px-5 h-full flex justify-between flex-col ">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%] w-[100%]">
          <ul className="flex items-center pb-[50px]">
            <li onClick={() => navigate("/project")} className="text-[#47525E] cursor-pointer after">
              My Project
              <span className="mx-[4px]">|</span></li>
            <li className="text-[#47525E] cursor-pointer capitalize font-[600]"> Followed properties</li>
          </ul>
          {openPopup && (
            <button onClick={() => closePopup()} className="absolute right-10 top-10 ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center ">
              <RxCross2 />
            </button>
          )}
          <div className="w-full ">
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
              Followed properties
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                Plan your project
              </h2>
            </div>
            {openPopup ? (
              <>
                <div className=" p-6 ">
                  <div className="flex items-center flex-col max-w-[600px] mx-auto bg-white p-5 my-5 rounded-[5px]">
                    <div className="bg-[#976DD0] rounded-[50px]">
                      <FaFolderOpen className="mx-auto text-center text-[50px] text-white  p-3" />
                    </div>

                    <label className="  py-3 px-4  text-black text-center text-[20px] w-full flex items-center justify-center">
                      Enter Folder Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length <= 200 || newValue.length < name.length) {
                          setName(newValue)
                        }
                      }}
                      type="text"
                      className="bg-[#efefef] px-4 py-4  text-[#47525E] text-[14px] w-full"
                      placeholder="Enter Folder Name"
                    />
                    <span className="text-end text-[12px] mt-1 text-[#c10707] ml-auto">
                      Maximum {name.length}/200 words
                    </span>
                  </div>
                  <Table
                    className="mb-3 p-4 pt-2 mt-4"
                    data={data}
                    columns={columns}
                    page={filters.page}
                    count={filters.count}
                    filters={filters}
                    total={total}
                    result={(e) => {
                      if (e.event == "page") pageChange(e.value);
                      if (e.event == "sort") {
                        sorting(e.value);
                        sortClass(e.value);
                      }
                      if (e.event == "count") count(e.value);
                    }}
                    sorderfilter={filters.sorder}
                    sortKey={filters.key}
                  />
                </div>
                <div className="flex justify-center pt-20">
                  <button
                    onClick={() => {
                      if (editFolder?.name) submitEditItem();
                      else addItem();
                    }}
                    className="h-12 bg-[#48464a] rounded-full w-[300px] px-10 text-[18px] font-medium text-center text-white hover:opacity-80 transition-all signup-btn"
                  >
                    {editFolder?.name ? "Update" : "Create"} Folder
                  </button>
                </div>
              </>
            ) : (
              <>
                {folders?.length > 0 ? (
                  <ul className="flex items-center flex-wrap justify-between mt-12">
                    {folders?.map((itm, i) => (
                      <li
                        key={i}
                        className=" lg:w-[48%]   w-[100%] mb-5 flex justify-between items-center"
                      >
                        <div
                          onClick={() => viewItem(itm)}
                          className="bg-white rounded-[7px] p-4 w-[75%] cursor-pointer"
                        >
                          <h3 className="text-[#47525E] font-[600] text-[18px] ellipses">
                            {itm?.name}
                          </h3>
                          <p className="text-[#47525E] my-2 mt-3 ">
                            {itm?.property_id?.length} propert{itm?.property_id?.length>1 ?"ies":"y"} followed
                          </p>
                        </div>
                        <div className="w-[20%] flex">
                          <div className=" w-[30px] h-[30px] rounded-[50px] bg-[#c2a8df] flex items-center justify-center me-2">
                            <FiEdit
                              className="text-[20px] p-[1px]  text-white  cursor-pointer"
                              onClick={() => editItem(itm)}
                            />
                          </div>
                          <div className=" w-[30px] h-[30px] rounded-[50px] bg-[#c2a8df] flex items-center justify-center me-2">
                            <AiOutlineDelete
                              className="text-[20px] p-[1px]  text-white  cursor-pointer"
                              onClick={() => deleteItem(itm.id)}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <><div className="flex items-center justify-center flex-col mt-10">
                    <div className="bg-[#976DD0] rounded-[50px]">
                      <img src="assets/img/folder.gif" className="w-[50px] p-3" />
                      {/* <FaFolderOpen className="mx-auto text-center text-[50px] text-white  p-3  " /> */}
                    </div>
                    <p className="mt-2">No Folder Exist</p>
                  </div></>
                )}

                <div className="flex justify-center pt-20">
                  <button
                    onClick={() => setOpenPopup(true)}
                    className="h-12 bg-[#48464a] rounded-full w-[300px] px-10 text-[18px] font-medium text-center text-white hover:opacity-80 transition-all signup-btn"
                  >
                    Create new folder
                  </button>
                </div>
              </>
            )}
          </div>
          </div>

        </div>
      </section>
    </PageLayout>
  );
};

export default FollowedProperty;
