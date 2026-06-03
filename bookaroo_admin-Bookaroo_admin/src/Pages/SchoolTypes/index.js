import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import shared from "./shared";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const SchoolTypes = () => {
    const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loaging, setLoader] = useState(true);
    const history = useNavigate();

    useEffect(() => {
        getData();
    }, []);

    const getData = (p = {}) => {
        setLoader(true);
        const filter = { ...filters, ...p };
        ApiClient.get(shared.listApi, filter).then((res) => {
            if (res.success) {
                setData(res.data.map((itm) => { itm.id = itm._id; return itm; }));
                setTotal(res.total);
            }
            setLoader(false);
        });
    };

    const deleteItem = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete this ${shared.addTitle}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#976DD0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                loader(true);
                ApiClient.delete(shared.deleteApi, { id }).then((res) => {
                    if (res.success) {
                        toast.success(res.message || "Deleted");
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

    const filter = (p = {}) => {
        const f = { page: 1, ...p };
        setFilter({ ...filters, ...f });
        getData({ ...f });
    };

    const edit = (id) => history(`/${shared.url}/edit/${id}`);

    return (
        <Html
            edit={edit}
            filter={filter}
            pageChange={pageChange}
            deleteItem={deleteItem}
            filters={filters}
            setFilter={setFilter}
            loaging={loaging}
            data={data}
            total={total}
            history={history}
        />
    );
};

export default SchoolTypes;
