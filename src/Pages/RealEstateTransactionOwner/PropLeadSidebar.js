import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import { capLetter, imagePath, stringSeprator } from '../../models/string.model';
import methodModel from '../../methods/methods';

const PropLeadSidebar = ({
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
    const { t } = useTranslation();
    const tabs = [
        { label: t("buttons.all"), value: "" },
        { label: t("home.tabs.offMarket"), value: true },
        { label: t("property.forSale"), value: "sale" },
        { label: t("property.forRent"), value: "rent" },
        { label: t("home.tabs.directory"), value: "directory" },
        { label: t("transactionSidebar.transferred"), value: "transferred" },
    ];

    return (
        <div className="lg:col-span-4 md:col-span-6 col-span-12 md:border-r border-[#C9C9C9] md:pe-8 md:h-full overflow-auto">
            <div className="bg-white py-3 rounded-[8px] px-5">
                <input
                    value={name}
                    onChange={(e) => textChange("name", e.target.value)}
                    type="search"
                    placeholder={t("properties.searchProperty")}
                />
            </div>
            <ul className="flex items-center mt-5 flex-wrap gap-3">
                {tabs.map((itm, i) => (
                    <li
                        onClick={() => setType(itm.value)}
                        key={i}
                        className={`${itm.value === type ? "" : "text-[#343F4B]"
                            } text-[14px] cursor-pointer`}
                    >
                        {itm.label}
                    </li>
                ))}
            </ul>
            <div>
                <ul className="mt-5">
                    {filteredData?.length > 0
                        ? filteredData?.map((item, i) => {
                            console.log(item, "item")
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
                                            <span className={`${item?.activityIndicatorCount > 0 ? "custom-ping" : ""} absolute inline-flex h-full w-full rounded-full bg-[#976DD0] opacity-75`}></span>
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
                                        <p className="text-[#343F4B] text-[12px] font-[600]">
                                            {capLetter(item?.propertyType == "offmarket" ? "Off-Market" : item?.propertyType) || "Type not available"}
                                        </p>
                                        <div className="flex items-center justify-between w-full">
                                            <div className='flex gap-2 items-center '>
                                                <p className="text-[#8492A6] text-[12px] w-[50%]">
                                                    <span className="text-[#343F4B] text-[12px] font-[600] me-1">
                                                        {/* {item?.userLeads?.length || 0} */}
                                                        {item?.totalLeads || 0}
                                                    </span>
                                                    {t(+item?.totalLeads > 1 ? "transactionSidebar.leads" : "transactionSidebar.lead")}
                                                </p>
                                                <div className=" relative w-[50%] h-[25px] ml-auto flex">

                                                    {/*  */}

                                                    {(item?.userImages?.[0] != "User must be deleted" && item?.userImages?.length > 0) ? <>{item.userImages?.map(itm => {
                                                        return <img
                                                            src={methodModel.noImg(itm)}
                                                            alt=""
                                                            className="w-[25px] h-[25px] object-cover rounded-full absolute left-[15px]"
                                                        />
                                                    }).slice(0, 3)}</> : <div className="w-[25px] h-[25px] bg-[#976DD0] flex justify-center items-center p-2 text-[#FFF] object-cover rounded-full absolute left-[15px]">
                                                        <span className='sm:text-[14px] text-[12px] '>{item?.firstName?.[0]?.trim().charAt(0).toUpperCase()}{item?.lastName?.[0]?.trim().charAt(0).toUpperCase()}</span></div>}

                                                    {/* <img
                                                    src="assets/img/man.jpg"
                                                    alt=""
                                                    className="w-[25px] h-[25px] object-cover rounded-full absolute left-[15px]"
                                                /> */}
                                                </div>
                                            </div>
                                            {Array.isArray(item?.userLeads) && item?.userLeads?.slice(0, 4)
                                                .map((lead, index) => (
                                                    <div className="relative w-[50%] h-[25px] flex">
                                                        <img
                                                            key={index}
                                                            src={lead?.profileImage || "assets/img/default-user.jpg"}
                                                            alt="User"
                                                            className={`w-[25px] h-[25px] object-cover rounded-full absolute left-[${index * 15
                                                                }px]`}
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                        <p className="text-[#47525E] text-[12px]">
                                            {t("transactionSidebar.visitsBooked", { count: item?.visitBookedCount || 0 })}
                                        </p>
                                    </div>
                                </li>
                            )
                        }) : (
                            <p className="text-center text-gray-500">
                                {t("transactionSidebar.noPropertiesAvailable")}
                            </p>
                        )}

                    <div className={`paginationWrapper ${total > filters?.count ? "" : "d-none"}`}                    >
                        <span>
                            {t("notifications.showFromProperties", { count: data?.length, total })}
                        </span>
                        <ReactPaginate
                            previousLabel={t("pagination.previous")}
                            nextLabel={t("pagination.next")}
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

export default PropLeadSidebar
