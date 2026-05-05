import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import loader from "../../methods/loader";

const CompanyReview = () => {
    const user = useSelector((state) => state.user);
    const searchState = { data: "" };
    const [filters, setFilter] = useState({
        page: 1, count: 10, search: ""
        //  addedBy: user?._id
    });
    const [data, setData] = useState([]);
    const [property, setproperty] = useState([]);
    const [selectedproperty, setselectedproperty] = useState();
    const [total, setTotal] = useState(0);
    const [loaging, setLoader] = useState(true);
    const history = useNavigate();
    const [expandedRows, setExpandedRows] = useState({});


    useEffect(() => {
        setFilter({ ...filters, search: searchState.data });
        getData({ search: searchState.data, page: 1 });
    }, []);

    const edit = (id) => {
        console.log(id, "==")
        history(`/${shared.url}/edit/${id}`);
    };

    const view = (id) => {
        let url = `/${shared.url}/detail/${id}`;
        history(url);
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
        setFilter({ ...filters, sortBy, key, sorder });
        getData({ sortBy, key, sorder });
    };

    const getData = (p = {}) => {
        setLoader(true);
        let filter = { ...filters, ...p };
        ApiClient.get(shared.listApi, filter).then((res) => {
            if (res.success) {
                let data = res.data

                setData(data);
                setTotal(res.total);
            }
            setLoader(false);
        });
    };

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
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
                page: 1,
                count: 10,
                search: "",
                property_id: "",
                // addedBy: user?._id
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

    const isAllow = (key = "") => {
        let permissions = user.permissions?.[0];
        let value = permissions?.[key];
        // return true;
        if (user.role == 'admin') value = true
        return value;
    };
    const toggleExpanded = (rowId) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
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


    return (
        <>
            <Html
                clear={clear}
                sortClass={sortClass}
                sorting={sorting}
                count={count}
                expandedRows={expandedRows}
                toggleExpanded={toggleExpanded}
                pageChange={pageChange}
                filters={filters}
                setFilter={setFilter}
                filter={filter}
                loaging={loaging}
                data={data}
                getData={getData}
                total={total}
                sorderfilter={filters.sorder}
                sortKey={filters.key}
                isAllow={isAllow}
                property={property}
                selectedproperty={selectedproperty}
                setselectedproperty={setselectedproperty}
                edit={edit}
                view={view}
                deleteItem={deleteItem}
            />
        </>
    );
};

export default CompanyReview;
