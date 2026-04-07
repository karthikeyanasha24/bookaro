import { Tooltip } from "antd";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";
import Table from "../../components/Table";
import Layout from "../../components/global/layout";
import shared from "./shared";
import { PiEyeLight } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import AsyncSelect from 'react-select/async';
import moment from "moment";


const Html = ({
    sorting,
    filter,
    view,
    pageChange,
    count,
    selectedproperty,
    setselectedproperty,
    getData,
    clear,
    filters,
    setFilter,
    loaging,
    data,
    property,
    sortClass,
    sorderfilter,
    total,
    expandedRows,
    toggleExpanded,
    sortKey,
    loadOptions
}) => {



    const columns = [
        {
            key: "propertyTitle",
            name: "Property Title",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize ">{row?.propertyId?.propertyTitle || "--"}</span>;
            },
        },
        {
            key: "fullName",
            name: "User Name",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize ">{row?.userId?.fullName}</span>;
            },
        },
        {
            key: "areaCondition",
            name: "Area Condition",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize flex items-baseline gap-1">{row?.areaCondition}<FaStar className="text-[#FFD700]" /></span>;
            },
        },
        {
            key: "condition",
            name: "Condition",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize flex items-baseline gap-1">{row?.condition}<FaStar className="text-[#FFD700]" /></span>;
            },
        },
        {
            key: "location",
            name: "Location",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize flex items-baseline gap-1">{row?.location}<FaStar className="text-[#FFD700]" /></span>;
            },
        },
        {
            key: "luminosity",
            name: "Luminosity",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize flex items-baseline gap-1">{row?.luminosity}<FaStar className="text-[#FFD700]" /></span>;
            },
        },
        {
            key: "peacefullSetting",
            name: "Peacefull Setting",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize flex items-baseline gap-1">{row?.peacefullSetting}<FaStar className="text-[#FFD700]" /></span>;
            },
        },
        {
            key: "propertyInformation",
            name: "Property Information",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize flex items-baseline gap-1">{row?.propertyInformation}<FaStar className="text-[#FFD700]" /></span>;
            },
        },
           {
            key: "createdAt",
            name: "Review Date",
            //   sort: true,
            render: (row) => {
                return <span className="capitalize flex items-baseline gap-1">{moment(row?.createdAt).format("YYYY-MM-DD hh:mm A")}</span>;
            },
        },

        {
            key: "note",
            name: "Note",
            //   sort: true,
            render: (row) => {
                // return <span className="capitalize flex items-baseline whitespace-normal gap-1">{row?.note || "--" }</span>;
                const isExpanded = expandedRows[row.id];
                const text = row?.note || "--";
                const displayText = isExpanded ? text : text.slice(0, 30);

                return (
                    <span   className={`capitalize flex items-end whitespace-normal gap-1 ${
                        text.length > 30 ? "w-[300px]" : ""
                    }`}>
                        {displayText}
                        {text.length > 30 && (
                            <button
                                className="text-primary underline outline-none ml-1 whitespace-nowrap font-bold"
                                onClick={() => toggleExpanded(row.id)}
                            >
                                {isExpanded ? "Read less" : "Read more"}
                            </button>
                        )}
                    </span>
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
                                <i className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true" onClick={(e) => clear("search")}></i>
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
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadOptions}
                            defaultOptions={property}
                            value={selectedproperty}
                            className="w-[260px]"
                            isClearable
                            onChange={(e) => {
                                setselectedproperty(e)
                                getData({propertyId:e?.value})
                            }}
                        />

                        {filters.property_id ? (
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
                            className="mb-3 p-4 pt-2"
                            data={data}
                            columns={columns}
                            page={filters.page}
                            total={total}
                            count={filters.count}
                            filters={filters}
                            result={(e) => {
                                if (e.event == "page") pageChange(e.value);
                                if (e.event == "sort") {
                                    sorting(e.value);
                                    sortClass(e.value);
                                }
                                if (e.event == "count") count(e.value);
                            }}
                            sorderfilter={sorderfilter}
                            sortKey={sortKey}
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
