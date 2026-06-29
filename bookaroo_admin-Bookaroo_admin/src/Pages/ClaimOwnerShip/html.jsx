import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import Table from "../../components/Table";
import SelectDropdown from "../../components/common/SelectDropdown";
import statusModel from "../../models/status.model";
import shared from "./shared";
import { PiEyeLight } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

const Html = ({
    sorting,
    filter,
    view,
    pageChange,
    count,
    clear,
    filters,
    setFilter,
    loaging,
    data,
    changestatus,
    acceptRequest,
    rejectRequest,
    requestStatusOptions,
    total = { total },
    sortClass,
}) => {

    const columns = [
        {
            key: "name",
            name: "Name",
            sort: true,
            render: (itm) => {
                const data = itm?.name
                return <Tooltip placement="top" title="View">
                    <span className="capitalize cursor-pointer" onClick={(e) => view(itm.id)}>{data}</span>
                </Tooltip>
            },
        },
        {
            key: "email",
            name: "Email",
            //   sort: true,
            render: (itm) => {
                const data = itm?.email
                return <Tooltip placement="top">
                    <span className="capitalize cursor-pointer">{data}</span>
                </Tooltip>
            },
        },
        {
            key: "propertyId?.propertyTitle",
            name: "Property",
            //   sort: true,
            render: (itm) => {
                const data = itm?.propertyId?.propertyTitle
                return <Tooltip placement="top">
                    <span className="capitalize cursor-pointer">{data}</span>
                </Tooltip>
            },
        },

        {
            key: "status",
            name: "Claim Request",
            render: (row) => {
                return <div className="w-32">
                    <span className={`text-sm !px-3 h-[30px] w-[100px] flex items-center justify-center border border-[#EBEBEB] !rounded capitalize ${row?.status == "reject" ? " bg-red-600 text-white" : row?.status == "accept" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"}`}>
                        {row?.status == "accept" ? "Accepted" : row?.status == "reject" ? "Rejected" : "Pending"}
                    </span>
                </div>
            },
        },
        {
            key: "action",
            name: "Action",
            render: (itm) => {
                return (
                    <>
                        <div className="flex items-center justify-start gap-1.5">
                            <Tooltip placement="top" title="View">
                                <div onClick={(e) => view(itm.id)} className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]">
                                    <PiEyeLight />
                                </div>
                            </Tooltip>
                            {itm?.status == "pending" && <>   <Tooltip placement="top" title="Accept">
                                <span
                                    onClick={(e) => acceptRequest(itm)}
                                    className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
                                >
                                    <FaCheck />
                                </span>
                            </Tooltip>
                                <Tooltip placement="top" title="Reject">
                                    <span
                                        onClick={(e) => rejectRequest(itm)}
                                        className="border cursor-pointer  hover:opacity-70 rounded-[35px] bg-[#00988e1c] w-10 h-10 !text-primary flex items-center justify-center text-lg text-[#222]"
                                    >
                                        <RxCrossCircled />
                                    </span>
                                </Tooltip></>}

                        </div>
                    </>
                );
            },
        },
    ];

    return (
        <Layout>
            <div className="flex flex-wrap justify-between items-center gap-y-4">
                <div>
                    <h3 className="text-2xl font-semibold text-[#111827]">{shared.title}</h3>
                </div>
            </div>
            <div className="shadow-box w-full bg-white rounded-lg mt-6">
                <div className="flex p-4 items-center flex-wrap gap-2">
                    <form className="flex items-center max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); filter(); }}>
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="simple-search"
                                value={filters.search}
                                onChange={(e) => setFilter({ ...filters, search: e.target.value })}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#976DD0] block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                                placeholder="Search"
                            />
                            {filters?.search && (
                                <i className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true" onClick={(e) => clear()}></i>
                            )}
                        </div>
                        <button type="submit" className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                            <span className="sr-only">Search</span>
                        </button>
                    </form>
                    <div className="flex gap-2 ml-auto">
                        <SelectDropdown
                            id="statusDropdown"
                            displayValue="name"
                            // placeholder="All Claim Request"
                            theme="search"
                            isClearable={false}
                            intialValue={filters.status}
                            result={(e) => {
                                changestatus(e.value);
                            }}
                            options={requestStatusOptions}
                        />
                        {filters.status ? (
                            <>
                                <button onClick={() => clear()} className="bg-primary leading-10 h-10 inline-block shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg">
                                    Reset
                                </button>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                {!loaging ? (
                    <>
                        <Table
                            className="mb-3"
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
                        />
                    </>
                ) : (
                    <></>
                )}
                {loaging ? (
                    <div className="text-center py-4">
                        <img src="/assets/img/loader.gif" className="pageLoader" />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </Layout>
    );
};

export default Html;
