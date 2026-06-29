import ReactPaginate from 'react-paginate';
import { capLetter, imagePath, stringSeprator } from '../../models/string.model';
import methodModel from '../../methods/methods';

const PropSidebar = ({
    handleClickProperty,
    selectedProperty,
    filters,
    type,
    setType,
    filteredData,
    name,
    total,
    data,
    textChange,
    handlePageChange,
}) => {
    const tabs = [
        { name: "All", value: "" },
        { name: "Off-Market", value: true },
        { name: "Sale", value: "sale" },
        { name: "Rent", value: "rent" },
        { name: "Directory", value: "directory" },
    ];

    return (
        <div className="lg:col-span-4 md:col-span-6 col-span-12 md:border-r border-[#C9C9C9] md:pe-8 md:h-full overflow-auto">
            <div className="bg-white py-3 rounded-[8px] px-5">
                <input
                    value={name}
                    onChange={(e) => textChange("name", e.target.value)}
                    type="search"
                    placeholder="Search property"
                />
            </div>
            <ul className="flex items-center mt-5 flex-wrap gap-6">
                {tabs.map((itm, i) => (
                    <li
                        onClick={() => setType(itm.value)}
                        key={i}
                        className={`${itm.value === type ? "" : "text-[#343F4B]"
                            } text-[14px] cursor-pointer`}
                    >
                        {itm.name}
                    </li>
                ))}
            </ul>
            <div>
                <ul className="mt-5">
                    {filteredData?.length > 0
                        ? filteredData?.map((item, i) => {
                            return (
                                <li key={i}
                                    className={`relative bg-white p-2 rounded-[8px] grid grid-cols-12 w-full gap-3 mb-3 cursor-pointer
                                      ${item?._id == selectedProperty?._id ? " border border-[#976DD0]" : ""}`}
                                    onClick={() =>
                                        handleClickProperty(item)
                                    }
                                >
                                    <div className="absolute top-2 right-2">
                                        <span className="relative flex h-[10px] w-[10px]">
                                            <span className={`${item?.activityIndicatorCount > 0?"custom-ping":""} absolute inline-flex h-full w-full rounded-full bg-[#976DD0] opacity-75`}></span>
                                            <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-[#976DD0]"></span>
                                        </span>
                                    </div>

                                    <div className="lg:col-span-5 col-span-full">
                                        <img
                                            src={imagePath(
                                                item?.images?.[0]?.file,
                                                "assets/img/transaction/property-leads.jpg"
                                            )}
                                            alt=""
                                            className="w-full h-[110px] rounded-[7px] object-cover"
                                        />
                                    </div>
                                    <div className="lg:col-span-7 col-span-full">
                                        <p className="text-[#6B6B6B] text-[13px]">
                                            {capLetter(stringSeprator(item?.propertyTitle, 25) || "House title")}
                                        </p>
                                        <p className="text-[#343F4B] text-[12px] my-1">
                                            {stringSeprator(item?.address, 25) || "Address not available"}
                                        </p>
                                      
                                   
                                        <p className="text-[#47525E] text-[12px]">
                                            {item?.surface || 0} sqm
                                        </p> <p className="text-[#47525E] text-[12px] capitalize">
                                            {item?.propertyType } 
                                        </p>
                                    </div>
                                </li>
                            )
                        }) : (
                            <p className="text-center text-gray-500">
                                No properties available
                            </p>
                        )}

                    <div className={`paginationWrapper ${total > filters?.count ? "" : "d-none"}`}                    >
                        <span>
                            Show {data?.length} from {total} Properties
                        </span>
                        <ReactPaginate
                            previousLabel="<Pre"
                            nextLabel="Next>"
                            breakLabel="..."
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={1}
                            pageCount={Math.ceil(total / filters.count)}
                            onPageChange={handlePageChange}
                            forcePage={filters.page - 1}
                            containerClassName={"pagination flex"}
                            pageClassName={"pagination-item"}
                            activeClassName={"pagination-item-active"}
                        />
                    </div>
                </ul>
            </div>
        </div>
    )
}

export default PropSidebar
