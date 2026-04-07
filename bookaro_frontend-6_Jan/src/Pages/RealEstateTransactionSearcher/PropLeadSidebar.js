import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import { capLetter, imagePath, stringSeprator } from '../../models/string.model';

const PropLeadSidebar = ({
    handleClickProperty,
    selectedProperty,
}) => {
    const { user } = useSelector((state) => state);
    const tabs = [
        { name: "All", value: "" },
        { name: "Off-Market", value: "offmarket" },
        { name: "Sale", value: "sale" },
        { name: "Rent", value: "rent" },
        { name: "Directory", value: "directory" },
    ];
    const [type, setType] = useState("");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [total, setTotal] = useState(0);
    const [name, setName] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        count: 10,
    });
    const getData = (f = {}) => {
        const filter = {
            ...filters,
            ...f,
            sortBy:'updatedAt desc'
        };
        if (type) {
            filter.propertyType = type;
        }
        if (user?.loggedIn) {
            filter.userId = user?._id;
        }
        loader(true);
        ApiClient.get("interests/list", filter).then((res) => {
            if (res.success) {
                setData(res?.data);
                setFilteredData(res?.data);
                setTotal(res?.total);
            }
            loader(false);
        });
    };
    useEffect(() => {
        getData();
    }, [type]);
    const textChange = (key, val) => {
        setName(val);
        if (key === "name") {
            const filterr = data?.filter((item) =>
                item?.propertyDetails?.propertyTitle?.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredData(filterr);
        }
    };

    return (
        <div className="lg:col-span-4 md:col-span-6 col-span-12 md:border-r border-[#C9C9C9] md:pe-8 md:h-[800px] overflow-auto">
            <div className="bg-white py-3 rounded-[8px] px-5">
                <input
                    value={name}
                    onChange={(e) => textChange("name", e.target.value)}
                    type="search"
                    placeholder="Search property"
                />
            </div>
            <ul className="flex items-center mt-5">
                {tabs.map((itm, i) => (
                    <li
                        onClick={() => setType(itm.value)}
                        key={i}
                        className={`${itm.value === type ? "" : "text-[#343F4B]"
                            } text-[14px] me-3 cursor-pointer`}
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
                                    className={`bg-white p-2 rounded-[8px] grid grid-cols-12 w-full gap-3 mb-3 cursor-pointer
                                      ${item?.propertyDetails?._id == selectedProperty?._id ? " border border-[#976DD0]" : ""}`}
                                    onClick={() =>
                                        handleClickProperty(item?.propertyDetails)
                                    }
                                >
                                    <div className="lg:col-span-5 col-span-full">
                                        <img
                                            src={imagePath(
                                                item?.propertyDetails?.images?.[0]?.file,
                                                "assets/img/transaction/property-leads.jpg"
                                            )}
                                            alt=""
                                            className="w-full h-[110px] rounded-[7px] object-cover"
                                        />
                                    </div>
                                    <div className="lg:col-span-7 col-span-full">
                                        <p className="text-[#6B6B6B] text-[13px]">
                                            {stringSeprator(item?.propertyDetails?.propertyTitle, 30) || "House title"}
                                        </p>
                                        <p className="text-[#343F4B] text-[12px] my-1">
                                            {stringSeprator(item?.propertyDetails?.address, 30) || "Address not available"}
                                        </p>
                                        <p className="text-[#343F4B] text-[12px] font-[600]">
                                            {capLetter(item?.propertyDetails?.type) || "Type not available"}
                                        </p>
                                        <div className="flex items-center justify-between w-full">
                                            <p className="text-[#8492A6] text-[12px] w-[50%]">
                                                <span className="text-[#343F4B] text-[12px] font-[600] me-1">
                                                    {item?.propertyDetails?.userLeads?.length || 0}
                                                </span>
                                                Leads
                                            </p>
                                            <div className=" relative w-[50%] h-[25px]  justify-end ml-auto">
                                                <img
                                                    src="assets/img/man.jpg"
                                                    alt=""
                                                    className="w-[25px] h-[25px] object-cover rounded-full absolute left-0"
                                                />
                                                <img
                                                    src="assets/img/man.jpg"
                                                    alt=""
                                                    className="w-[25px] h-[25px] object-cover rounded-full absolute left-[15px]"
                                                />
                                                <img
                                                    src="assets/img/man.jpg"
                                                    alt=""
                                                    className="w-[25px] h-[25px] object-cover rounded-full absolute left-[30px]"
                                                />
                                                <img
                                                    src="assets/img/man.jpg"
                                                    alt=""
                                                    className="w-[25px] h-[25px] object-cover rounded-full absolute left-[45px]"
                                                />
                                            </div>
                                            <div className="relative w-[50%] h-[25px] flex">
                                                {Array.isArray(item?.propertyDetails?.userLeads) && item?.propertyDetails?.userLeads?.slice(0, 4)
                                                    .map((lead, index) => (
                                                        <img
                                                            key={index}
                                                            src={lead?.profileImage || "assets/img/default-user.jpg"}
                                                            alt="User"
                                                            className={`w-[25px] h-[25px] object-cover rounded-full absolute left-[${index * 15
                                                                }px]`}
                                                        />
                                                    ))}
                                            </div>
                                        </div>
                                        <p className="text-[#47525E] text-[12px]">
                                            {item?.propertyDetails?.visitBookedCount || 0} Visits Booked
                                        </p>
                                    </div>
                                </li>
                            )
                        }) : (
                            <p className="text-center text-gray-500">
                                No properties available
                            </p>
                        )}
                </ul>
            </div>
        </div>
    )
}

export default PropLeadSidebar
