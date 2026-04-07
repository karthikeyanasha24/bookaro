import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { CgLayoutGrid } from "react-icons/cg";

const SchoolProperty = () => {
    const searchState = { data: "" };
    const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
    const [data, setData] = useState([]);
    const [removeSchools, setremoveSchools] = useState([]);
    const [total, setTotal] = useState(0);
    const [loaging, setLoader] = useState(true);
    const history = useNavigate();

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

    const DeleteSchools = () => {
        if (removeSchools?.length < 1) {
            toast.error("Please select the School first");
            return;
        }
        loader(true)
        const payload = {
            ids: removeSchools,
        };
        ApiClient.put(`schools/bulkDelete`, payload).then((res) => {
            if (res.success) {
                getData()
                toast.success(res?.message)
                setremoveSchools([]);
            }
        });
        loader(false)
    };



    const clear = () => {
        let f = {
            search: "",
            schoolType: "",
            page: 1,
            schoolStatus: "",
            establishmentType: ""
        };
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

    const handleImport = (event) => {
        const file = event.target.files[0];
        ApiClient.postFormData('upload/importSchools', { file: file }).then(res => {
            if (res.success) {
                toast.success(res?.success)
                getData()
            }
            loader(false)
        })
    }


    const edit = (id) => {
        history(`/${shared.url}/edit/${id}`);
    };

    const view = (id) => {
        let url = `/${shared.url}/detail/${id}`;
        history(url);
    };

    const checklength = () => {

        let schoolsId = data.map((itm) => {
            return itm?.id;
        });
        if (
            removeSchools?.length == schoolsId?.length &&
            (removeSchools?.length != 0 || schoolsId?.length != 0)
        )
            return true;
        else return false;
    };
    const AllSelect = (e) => {
        if (e.target.checked) {
            let schoolsId = data.map((itm) => {
                return itm?.id;
            });
            setremoveSchools([...schoolsId]);
        } else {
            setremoveSchools([]);
        }
    };

    const handleCheck = (e, value, index) => {
        if (e.target.checked) {
            setremoveSchools([...removeSchools, value]);
        } else {
            let filterSchool = removeSchools.filter((itm) => itm != value);
            setremoveSchools(filterSchool);
        }
    };


    const schoolType = [
        { id: "elementarySchool", name: "Elementary School" },
        { id: "college", name: "College" },
        { id: "kindergarten", name: "Kindergarten" },
        { id: "elementaryPrimary", name: "Primary School" },
        { id: "highschool", name: "High School" },
    ];

    const schoolStatus = [
        { id: "Private", name: "Private" },
        { id: "Public", name: "Public" },
    ];

    const establishmentType = [
        { id: "school", name: "School" },
        { id: "highschool", name: "High School" },
        { id: "college", name: "College" },
    ]

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
                handleImport={handleImport}
                setFilter={setFilter}
                filter={filter}
                loaging={loaging}
                data={data}
                total={total}
                statusChange={statusChange}
                handleFilters={handleFilters}
                schoolType={schoolType}
                schoolStatus={schoolStatus}
                establishmentType={establishmentType}
                checklength={checklength}
                AllSelect={AllSelect}
                removeSchools={removeSchools}
                handleCheck={handleCheck}
                DeleteSchools={DeleteSchools}
            />
        </>
    );
};

export default SchoolProperty;
