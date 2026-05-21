import ReactPaginate from 'react-paginate';
import { useTranslation } from 'react-i18next';
import { capLetter, imagePath, stringSeprator, formatCurrency } from '../../models/string.model';
import methodModel from '../../methods/methods';
import { FaBed } from 'react-icons/fa6';

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
    isGuest,
}) => {
    const { t } = useTranslation();
    const tabs = [
        { label: t("buttons.all"), value: "" },
        { label: t("property.forSale"), value: "sale" },
        { label: t("property.forRent"), value: "rent" },
        { label: t("home.tabs.directory"), value: "directory" },
        // In guest mode Off-Market and Transferred filters are hidden.
        // TODO: in prod connected mode, remove these filters entirely and
        // ensure Off-Market properties are still displayed inside the
        // sale/rent tabs according to the actual property status.
    ];

    if (!isGuest) {
        tabs.splice(1, 0, { label: t("home.tabs.offMarket"), value: true });
        tabs.push({ label: t("transactionSidebar.transferred"), value: "transferred" });
    }

    const getLeadAvatars = (item) => {
        const userImages = item?.userImages?.length > 0 && item?.userImages?.[0] != "User must be deleted"
            ? item.userImages
            : [];
        const userLeads = item?.userLeads?.map((lead) => lead.profileImage || "/assets/img/default-user.jpg") || [];
        return [...userImages, ...userLeads].slice(0, 5);
    };

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
                            const property = item?.property || item?.propertyId || item || {};
                            const getValue = (field) =>
                                item?.[field] ??
                                property?.[field] ??
                                item?.property?.[field] ??
                                item?.propertyId?.[field] ??
                                null;
                            const surface = getValue("surface");
                            const rooms = getValue("rooms");
                            const bedrooms = getValue("bedrooms");
                            const rawPrice = getValue("price");
                            const rawMonthlyCharges = getValue("propertyMonthlyCharges");
                            const price = rawPrice !== undefined && rawPrice !== null ? rawPrice : null;
                            const monthlyCharges = rawMonthlyCharges !== undefined && rawMonthlyCharges !== null ? rawMonthlyCharges : null;
                            const rawPropertyType = getValue("propertyType");
                            const propertyType = typeof rawPropertyType === "string" ? rawPropertyType.toLowerCase() : rawPropertyType;
                            const title = getValue("propertyTitle");
                            const address = getValue("address");
                            const images = getValue("images") || [];
                            const surfaceValue = Number(surface);
                            const badgeStyles = {
                                sale: "bg-[#E0F2FE] text-[#0369A1]",
                                rent: "bg-[#FEF3C7] text-[#92400E]",
                                directory: "bg-[#EEF2FF] text-[#3730A3]",
                                offmarket: "bg-[#F3F4F6] text-[#52525B]",
                                default: "bg-[#E5E7EB] text-[#374151]",
                            };
                            const badgeClass = badgeStyles[propertyType] || badgeStyles.default;
                            const badgeLabel = propertyType === "offmarket" ? "Off-Market" : capLetter(propertyType) || "Type not available";
                            const salePerM2 = propertyType === "sale" && price != null && surfaceValue > 0 ? Math.round(Number(price) / surfaceValue) : null;
                            const rentPerM2 = propertyType === "rent" && monthlyCharges != null && surfaceValue > 0 ? Math.round(Number(monthlyCharges) / surfaceValue) : null;
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
                                                images?.[0]?.file,
                                                "assets/img/transaction/property-leads.jpg"
                                            )}
                                            alt=""
                                            className="w-full h-[160px] rounded-[7px] object-cover"
                                        />
                                    </div>
                                    <div className="lg:col-span-7 col-span-full flex flex-col justify-between h-full">
                                        <p className="text-[#6B6B6B] text-[13px]">
                                            {capLetter(stringSeprator(title, 25) || "House title")}
                                        </p>
                                        <p className="text-[#343F4B] text-[12px] my-1">
                                            {stringSeprator(address, 25) || "Address not available"}
                                        </p>
                                        <ul className="flex flex-wrap items-center gap-3 text-[#47525E] text-[12px] mb-2">
                                            {+surface > 0 && (
                                                <li className="flex items-center gap-1">
                                                    <img
                                                        src="assets/img/prop/home.png"
                                                        className="h-[14px] w-[14px]"
                                                        alt="Surface"
                                                    />
                                                    {surface} m2
                                                </li>
                                            )}
                                            {+rooms > 0 && (
                                                <li className="flex items-center gap-1">
                                                    <img
                                                        src="assets/img/prop/bed.png"
                                                        className="h-[12px] w-[14px]"
                                                        alt="Rooms"
                                                    />
                                                    {rooms}
                                                </li>
                                            )}
                                            {+bedrooms > 0 && (
                                                <li className="flex items-center gap-1">
                                                    <FaBed className="text-[#47525E] h-[14px] w-[14px]" />
                                                    {bedrooms}
                                                </li>
                                            )}
                                        </ul>
                                        <p className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-[11px] font-[600] text-center ${badgeClass}`}>
                                            {badgeLabel}
                                        </p>
                                        {(propertyType === "sale" || propertyType === "rent") && (
                                            <div className="mt-1">
                                                {propertyType === "sale" ? (
                                                    <div className="flex items-center gap-2">
                                                        {price != null ? (
                                                            <h3 className="text-[#343F4B] text-[14px] font-semibold">
                                                                {formatCurrency(price)} €
                                                            </h3>
                                                        ) : (
                                                            <h3 className="text-[#343F4B] text-[14px] font-semibold">
                                                                -
                                                            </h3>
                                                        )}
                                                        {salePerM2 != null && (
                                                            <span className="text-[#47525E] text-[12px]">
                                                                {formatCurrency(salePerM2)} € /m2
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        {monthlyCharges != null ? (
                                                            <h3 className="text-[#343F4B] text-[14px] font-semibold">
                                                                {formatCurrency(monthlyCharges)} €
                                                            </h3>
                                                        ) : (
                                                            <h3 className="text-[#343F4B] text-[14px] font-semibold">
                                                                -
                                                            </h3>
                                                        )}
                                                        {rentPerM2 != null && (
                                                            <span className="text-[#47525E] text-[12px]">
                                                                {formatCurrency(rentPerM2)} € /m2
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between w-full">
                                            <div className='flex gap-2 items-center '>
                                                <p className="text-[#8492A6] text-[12px] w-[50%]">
                                                    <span className="text-[#343F4B] text-[12px] font-[600] me-1">
                                                        {item?.totalLeads || 0}
                                                    </span>
                                                    {t(+item?.totalLeads > 1 ? "transactionSidebar.leads" : "transactionSidebar.lead")}
                                                </p>
                                                <div className="relative w-[100px] h-[25px] flex-shrink-0 overflow-hidden">
                                                    {getLeadAvatars(item).map((itm, idx) => (
                                                        <img
                                                          key={idx}
                                                          src={methodModel.noImg(itm)}
                                                          alt="Profile"
                                                          className="w-[25px] h-[25px] object-cover rounded-full border border-white"
                                                          style={{
                                                            position: "absolute",
                                                            left: `${idx * 18}px`,
                                                            zIndex: 10 - idx,
                                                          }}
                                                        />
                                                    ))}
                                                    {getLeadAvatars(item).length === 0 && (
                                                      <div className="w-[25px] h-[25px] bg-[#976DD0] flex justify-center items-center text-[#FFF] rounded-full"
                                                        style={{ position: "absolute", left: "0" }}>
                                                        <span className='sm:text-[14px] text-[12px] '>{item?.firstName?.[0]?.trim().charAt(0).toUpperCase()}{item?.lastName?.[0]?.trim().charAt(0).toUpperCase()}</span>
                                                      </div>
                                                    )}
                                                </div>
                                            </div>
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
