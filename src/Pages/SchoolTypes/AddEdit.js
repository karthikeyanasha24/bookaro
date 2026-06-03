import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { useNavigate, useParams } from "react-router-dom";
import shared from "./shared";
import { toast } from "react-toastify";
import Layout from "../../components/global/layout";

const AddEdit = () => {
    const { id } = useParams();
    const history = useNavigate();
    const [form, setForm] = useState({ name: "" });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (id) {
            loader(true);
            ApiClient.get(shared.detailApi, { id }).then((res) => {
                if (res.success) {
                    setForm({ name: res.data.name });
                }
                loader(false);
            });
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!form.name.trim()) return;

        loader(true);
        const payload = { name: form.name.trim() };
        const apiCall = id
            ? ApiClient.put(shared.editApi, { ...payload, id })
            : ApiClient.post(shared.addApi, payload);

        apiCall.then((res) => {
            if (res.success) {
                toast.success(res.message || (id ? "Updated" : "Created"));
                history(`/${shared.url}`);
            } else {
                toast.error(res.message || "Something went wrong");
            }
            loader(false);
        });
    };

    return (
        <Layout>
        <div className="p-4 max-w-lg">
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => history(`/${shared.url}`)}
                    className="text-[#976DD0] hover:underline text-sm"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold">{id ? "Edit" : "Add"} School Type</h1>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Lycée"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        {submitted && !form.name.trim() && (
                            <p className="text-red-600 text-xs mt-1">Name is required</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="bg-[#976DD0] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            {id ? "Update" : "Create"}
                        </button>
                        <button
                            type="button"
                            onClick={() => history(`/${shared.url}`)}
                            className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </Layout>
    );
};

export default AddEdit;
