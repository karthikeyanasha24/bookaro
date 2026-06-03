import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import shared from "./shared";
import Pagination from "react-pagination-js";
import Layout from "../../components/global/layout";

const Html = ({
    edit, filter, pageChange, deleteItem,
    filters, setFilter, loaging, data, total, history,
}) => {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        filter({ search });
    };

    return (
        <Layout>
        <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">School Types</h1>
                <button
                    onClick={() => history(`/${shared.url}/add`)}
                    className="flex items-center gap-2 bg-[#976DD0] text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                    <FaPlus /> Add School Type
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="border rounded-lg px-3 py-2 text-sm w-64"
                />
                <button type="submit" className="bg-[#976DD0] text-white px-4 py-2 rounded-lg text-sm">
                    Search
                </button>
                {filters.search && (
                    <button
                        type="button"
                        onClick={() => { setSearch(""); filter({ search: "" }); }}
                        className="border px-4 py-2 rounded-lg text-sm"
                    >
                        Clear
                    </button>
                )}
            </form>

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#976DD0] text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loaging ? (
                            <tr>
                                <td colSpan={3} className="text-center py-8 text-gray-400">Loading...</td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-8 text-gray-400">No school types found</td>
                            </tr>
                        ) : (
                            data.map((itm, i) => (
                                <tr key={itm.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{(filters.page - 1) * filters.count + i + 1}</td>
                                    <td className="px-4 py-3 font-medium">{itm.name}</td>
                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => edit(itm.id)}
                                            className="text-[#976DD0] hover:text-purple-800 p-1"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(itm.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loaging && total > filters.count && (
                <div className="mt-4">
                    <Pagination
                        currentPage={filters.page}
                        totalSize={total}
                        sizePerPage={filters.count}
                        changeCurrentPage={pageChange}
                        theme="border-bottom"
                    />
                </div>
            )}
        </div>
        </Layout>
    );
};

export default Html;
