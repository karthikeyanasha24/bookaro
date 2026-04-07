import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const Enquiry = () => {
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
        propertyList()
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
                let data = res.data
                    ?.map((itm) => {
                        itm.id = itm._id;
                        return itm;
                    })
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

    const loadOptions = debounce((inputValue, callback) => {
        if (inputValue.trim() !== "") {
            propertyList({ search: inputValue }).then(callback);
        } else {
            callback([]);
        }
    }, 1000);

    const propertyList = async (p) => {
        try {
            const filter={...p}
            const res = await ApiClient.get(`property/listing`,filter)
            if (res.success) {
                setproperty(
                    res?.data?.map((item) => ({
                        value: item?._id,
                        label: item?.propertyTitle,
                    }))
                );
                return res?.data?.map((item) => ({
                    value: item?._id,
                    label: item?.propertyTitle,
                }));
            }
        } catch (error) {
            console.error("Error fetching part numbers:", error);
        }
        return [];
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
                loadOptions={loadOptions}
                property={property}
                selectedproperty={selectedproperty}
                setselectedproperty={setselectedproperty}

            />
        </>
    );
};

export default Enquiry;
