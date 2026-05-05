import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DocumentVerificatio = () => {
    const searchState = { data: "" };
    const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
    const [data, setData] = useState([]);
    const [ratingpopup, setratingpopup] = useState(false);
    const [submited, setsubmited] = useState(false);
    const [total, setTotal] = useState(0);
    const [loaging, setLoader] = useState(true);
    const history = useNavigate();

    useEffect(() => {
        setsubmited(false)
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
        ApiClient.get(`funnelUrl/getAll`, filter).then((res) => {
            if (res.success) {
                setData(res?.data);
                setTotal(res.total);
            }
            setLoader(false);
        });
    };



    const clear = () => {
        let f = {
         search:""
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
            text: `Do you want to delete this Video`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#976DD0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                loader(true);
                ApiClient.delete(`funnelUrl/delete`, { id: id }).then((res) => {
                    if (res?.success) {
                        getData();
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
                } this ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#976DD0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                loader(true);
                ApiClient.put(`funnelUrl/statusChange`, { id: itm._id, status }).then((res) => {
                    if (res.success) {
                        getData();
                    }
                    loader(false);
                });
            }
        });
    };

    const edit = (id) => {
    history(`/funnelvideo/edit/${id}`);
  };

    const view = (id) => {
        let url = `/funnelvideo/detail/${id}`;
        history(url);
    };

    const DocumentVerification = [
        { id: "true", name: "true" },
        { id: "false", name: "false" },
    ];

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
                setratingpopup={setratingpopup}
                ratingpopup={ratingpopup}
                statusChange={statusChange}
                handleFilters={handleFilters}
                DocumentVerification={DocumentVerification}
                document={document}
                submited={submited}
            />
        </>
    );
};

export default DocumentVerificatio;
