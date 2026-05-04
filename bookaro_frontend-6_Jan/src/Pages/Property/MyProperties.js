import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { LuDownload, LuQrCode, LuSearch, LuTrash2 } from "react-icons/lu";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Swal from "sweetalert2";
import ImageSlider from "../../components/common/ImageSlider";
import FlwModal from "../../components/common/Modal/FlwModal";
import LoginModal from "../../components/common/Modal/LoginModal";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { removeHTMLTags, removePropData } from "../../models/string.model";
import CustomMap from "./CustomMap";
import PropertyCard from "./PropertyCard";

const MyProperties = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [type, setType] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        count: 10,
        status: "active",
        addedBy: user?._id,
        maxDistance: "",
        userLat: "",
        userLng: "",
    });
    const tabs = [
        { name: "All", value: "" },
        { name: "For sale", value: "sale" },
        { name: "For rent", value: "rent" },
        { name: "Off-Market", value: true },
        { name: "Directory", value: "directory" },
    ]
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState("map");
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const dropdownRefs = useRef([]);
    const [hoveredLocation, setHoveredLocation] = useState(null);
    const [fil, setFil] = useState({ location: "", name: "" })
    const [loginModal, setloginModal] = useState(false);
    const [flwModal, setflwModal] = useState(false);
    const [flwItem, setflwItem] = useState(null);


    useEffect(() => {
        if (!user?.loggedIn) return navigate(-1);
        removePropData();
    }, [])

    const getData = (f = {}) => {
        const filter = {
            ...filters,
            ...f,
            propertyType: (type === true || type ==="true")?"":type,
            // offMarket:(type === true || type ==="true")?true:false
        };
        let dto = filter;
        if (user?.loggedIn) dto.userId = user?._id;
        loader(true);
        ApiClient.get("property/listing", dto).then((res) => {
            if (res.success) {
                setData(res?.data);
                setFilteredData(res?.data);
                setTotal(res?.total);
                let locations = [];
                res?.data?.map((item) => {
                    if (item?.location?.lat || item?.location?.lng) {
                        const isExact = item.exactLocation;
                        locations.push({
                            lat: isExact ? parseFloat(item?.location?.lat) : parseFloat(item?.randomLocation?.lat || item?.location?.lat),
                            lng: isExact ? parseFloat(item?.location?.lng) : parseFloat(item?.randomLocation?.lng || item?.location?.lng),
                            info: item?.city || item?.propertyTitle,
                            exactLocation: true,
                            icon: "/assets/img/prop/placeholder.png",
                        });
                    }
                });
                setLocations(locations);
            }
            loader(false);
        });
    };

    useEffect(() => {
        getData();
    }, [type, filters])

    const isLiked = (itm) => {
        let method = "put";
        let url = `favorites/edit`;
        let value = {
            user_id: user?._id,
            property_id: itm?._id,
            like: true,
        };
        loader(true);
        ApiClient.allApi(url, value, method).then((res) => {
            if (res.success) {
                getData();
            } else toast.error(res.message);
            loader(false);
        });
    };

    const isFollow = (itm) => {
        if (!user?.loggedIn) return setloginModal(true);
        if (!itm?.followunfollows_details) {
            setflwItem(itm)
            return setflwModal(true);
        }
        const isliked = itm?.followunfollows_details ? false : true;
        let method = "put";
        let url = `followUnfollow/update`;
        let value = {
            user_id: user?._id,
            property_id: itm?._id || itm?.id,
            follow_unfollow: isliked,
        };
        loader(true);
        ApiClient.allApi(url, value, method).then((res) => {
            if (res.success) {
                getData();
            } else toast.error(res.message);
            loader(false);
        });
    };

    const disLiked = (itm) => {
        let method = "put";
        let url = `favorites/edit`;
        let value = {
            user_id: user?._id,
            property_id: itm?._id,
            like: false,
        };
        loader(true);
        ApiClient.allApi(url, value, method).then((res) => {
            if (res.success) {
                getData();
            } else toast.error(res.message);
            loader(false);
        });
    };

    const editItem = (item) => {
        setDropdownIndex(null);
        navigate(`/property/edit/${item?.id || item?._id}`);
    };

    const deleteItem = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete this Property`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#976DD0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                loader(true);
                ApiClient.delete("property/deleteProperty", {
                    id: item?._id || item?.id,
                }).then((res) => {
                    if (res.success) {
                        getData({ ...filters, });
                        setDropdownIndex(null);
                    }
                    loader(false);
                });
            }
        });
    };

    const handlePageChange = ({ selected }) => {
        const newPage = selected + 1;
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const navigateToDetail = (itm) => {
        navigate(`/property-details?id=${itm?._id}`)
    };

    const generateQr = async (item) => {
        loader(true);
        const res = await ApiClient.post("property/qr/generate", { propertyId: item?._id || item?.id });
        loader(false);
        if (res?.success) {
            toast.success("QR code generated.");
            getData({ ...filters });
        }
    };

    const removeQr = async (item) => {
        loader(true);
        const res = await ApiClient.delete("property/qr/remove", { propertyId: item?._id || item?.id });
        loader(false);
        if (res?.success) {
            toast.success("QR code removed.");
            getData({ ...filters });
        }
    };

    const downloadQr = (item) => {
        const qrImage = item?.qrCode?.imageDataUrl;
        if (!qrImage) {
            toast.info("Generate QR code first.");
            return;
        }
        const a = document.createElement("a");
        a.href = qrImage;
        a.download = `${(item?.propertyTitle || "property").replace(/\s+/g, "-").toLowerCase()}-qr.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const toggleDropdown = (index) => {
        setDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const textChange = (key, val) => {
        setFil({ ...fil, [key]: val })
        if (key === "location") {
            const filterr = data.filter((item) =>
                item?.address?.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredData(filterr);
        }
        if (key === "name") {
            const filterr = data.filter((item) =>
                item?.propertyTitle?.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredData(filterr);
        }
    }

    return (
        <>
            <PageLayout>
                <LoginModal
                    loginModal={loginModal}
                    setloginModal={setloginModal}
                />
                <FlwModal
                    flwModal={flwModal}
                    setflwModal={setflwModal}
                    flwItem={flwItem}
                    refetch={getData}
                    existData={false}
                />
                <div className="bg-white sticky top-[59px] xl:top-[68px] z-[7] ">
                    <div className=" items-center  mx-auto  px-6 lg:px-10 ">
                        <div className="grid grid-cols-12 py-4 ">
                            <div className="col-span-12 flex items-center justify-between">
                                <div>
                                    <ul className="flex items-center">
                                        {tabs.map((itm, i) => (
                                            <li onClick={() => setType(itm.value)} key={i}>
                                                <a className={`${itm.value === type ? "font-[600] text-[#7BBEB8]" : "text-[#47525E]"} text-[14px] px-3`}>
                                                    {itm.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <ul className="flex items-center">
                                        <li onClick={() => setView("map")}>
                                            <a className={`${view === "map" ? "font-[600]" : ""} text-[#47525E] text-[14px] px-3`}>
                                                Map
                                            </a>
                                        </li>
                                        <li onClick={() => setView("grid")}>
                                            <a className={`${view === "grid" ? "font-[600]" : ""} text-[#47525E] text-[14px] px-3`}>
                                                Grid
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-6">
                    <div className=" items-center container  mx-auto px-6 lg:px-10">
                        <ul className="flex items-center pb-[30px]">
                            <li onClick={() => navigate("/project")} className="text-[#47525E] cursor-pointer after">
                                My Project
                                <span className="mx-[4px]">|</span></li>
                            <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                                My Properties</li>
                        </ul>
                        <div className="grid grid-cols-12 md:gap-8 gap-0">
                            <div className="col-span-12">
                                <div className="border border-[#EDE8F5] rounded-[14px] p-5 mb-6 bg-[#FCFBFF]">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-[20px] font-[700] text-[#2D1B4E]">QR Code management</h3>
                                        <span className="text-[#9A8CB4] text-[12px]">How it works</span>
                                    </div>
                                    <p className="text-[13px] text-[#6B7280] max-w-[920px] mt-1 mb-4">
                                        Generate QR code posters for your properties and share them on external platforms.
                                        Scans redirect users to the correct property profile in your transaction journey.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="bg-white border border-[#EEE8F8] rounded-[12px] p-4">
                                            <span className="w-6 h-6 rounded-full bg-[#EEE5FC] text-[#7F56C6] text-[12px] font-[700] inline-flex items-center justify-center mb-2">1</span>
                                            <h4 className="text-[14px] font-[600] text-[#4B5563]">Create your QR code</h4>
                                            <p className="text-[12px] text-[#7C8798] mt-1">Generate a poster from your property cover image.</p>
                                        </div>
                                        <div className="bg-white border border-[#EEE8F8] rounded-[12px] p-4">
                                            <span className="w-6 h-6 rounded-full bg-[#EEE5FC] text-[#7F56C6] text-[12px] font-[700] inline-flex items-center justify-center mb-2">2</span>
                                            <h4 className="text-[14px] font-[600] text-[#4B5563]">Share externally</h4>
                                            <p className="text-[12px] text-[#7C8798] mt-1">Publish on portals, social media, or print material.</p>
                                        </div>
                                        <div className="bg-white border border-[#EEE8F8] rounded-[12px] p-4">
                                            <span className="w-6 h-6 rounded-full bg-[#EEE5FC] text-[#7F56C6] text-[12px] font-[700] inline-flex items-center justify-center mb-2">3</span>
                                            <h4 className="text-[14px] font-[600] text-[#4B5563]">Track engagement</h4>
                                            <p className="text-[12px] text-[#7C8798] mt-1">Monitor scan activity and update listings quickly.</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[#47525E]">
                                    <span className="text-[#47525E] font-bold text-[20px]">
                                        {total}{` Propert${total > 1 ? "ies" : "y"} `}
                                    </span>
                                    in your portfolio
                                </p>
                                <div className="flex flex-wrap gap-5 mt-5 mb-6">
                                    <div>
                                        <label className="text-[#8492A6] mb-1 block text-[13px]">Search a property</label>
                                        <div className="relative">
                                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]" />
                                            <input
                                                type="text"
                                                value={fil.name}
                                                onChange={(e) => textChange("name", e.target.value)}
                                                placeholder="Type property title"
                                                className="bg-[#F7F8FA] border border-[#E6E8EC] p-2 pl-9 pr-3 rounded-[8px] h-[42px] min-w-[260px]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[#8492A6] mb-1 block text-[13px]">Location</label>
                                        <input
                                            type="text"
                                            value={fil.location}
                                            onChange={(e) => textChange("location", e.target.value)}
                                            placeholder="Enter city / area"
                                            className="bg-[#F7F8FA] border border-[#E6E8EC] p-2 px-3 rounded-[8px] h-[42px] min-w-[240px]"
                                        />
                                    </div>
                                </div>
                            </div>
                            {view === "map" && (
                                <>
                                    <div className="xl:col-span-8 lg:col-span-8 md:col-span-6  col-span-12 lg:mb-0 mb-4 h-[700px] overflow-auto pe-3 md:mt-0 mt-5 ">
                                        <div className="grid grid-cols-12  md:gap-4 gap-0">
                                            {filteredData?.length > 0 ? (
                                                filteredData.map((item, index) => {
                                                    let price = parseInt(item?.price || 0);
                                                    let sur = parseInt(item?.surface || 0);
                                                    let perSqr;
                                                    if (sur > 0) {
                                                        perSqr = price / sur;
                                                    }
                                                    const isExact = item.exactLocation;
                                                    return (
                                                        <div className="xl:col-span-4 lg:col-span-6 md:col-span-12 col-span-12 relative my-10 "
                                                            key={index}
                                                            onMouseEnter={() => setHoveredLocation({
                                                                lat: isExact ? parseFloat(item?.location?.lat) : parseFloat(item?.randomLocation?.lat || item?.location?.lat),
                                                                lng: isExact ? parseFloat(item?.location?.lng) : parseFloat(item?.randomLocation?.lng || item?.location?.lng),
                                                            })}
                                                            onMouseLeave={() => setHoveredLocation(null)}
                                                        >
                                                            <PropertyCard
                                                                item={item}
                                                                navigateToDetail={navigateToDetail}
                                                                toggleDropdown={toggleDropdown}
                                                                editItem={editItem}
                                                                deleteItem={deleteItem}
                                                                price={price}
                                                                perSqr={perSqr}
                                                                isFollow={isFollow}
                                                                disLiked={disLiked}
                                                                isLiked={isLiked}
                                                                dropdownRefs={dropdownRefs}
                                                                index={index}
                                                                dropdownIndex={dropdownIndex}
                                                            />
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center col-span-12 my-8">
                                                <img src="assets/img/no-data.svg" className="w-[400px] mx-auto "/>
                                                No Records Found
                                              </div>
                                            )}
                                        </div>
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
                                    </div>
                                    <div className="xl:col-span-4  lg:col-span-4 md:col-span-6 col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 custom-map">
                                        <CustomMap locations={locations} hoveredLocation={hoveredLocation} />
                                    </div>
                                </>
                            )}
                            {view === "grid" && (
                                <div className="col-span-12 lg:mb-0 mb-4  pe-3">
                                    <div className="grid grid-cols-12 bg-[#f9f9f9] gap-4">
                                        {filteredData?.length > 0 ? filteredData.map((item, index) => {
                                            let price = parseInt(item?.price || 0);
                                            let sur = parseInt(item?.surface || 0);
                                            let perSqr;
                                            if (sur > 0) {
                                                perSqr = price / sur;
                                            }
                                            return (
                                                <div key={index} className=" col-span-12 border border-[#D2D2D2] rounded-[12px] lg:mb-0 mb-4 bg-white property_list" >
                                                    <div className="flex flex-wrap">
                                                        <div className="lg:w-[30%] w-[100%]">
                                                            <ImageSlider images={item?.images} />
                                                        </div>
                                                        <div className="lg:w-[70%] w-[100%] ">
                                                            <div className="p-3 flex justify-between flex-wrap relative">
                                                                <div className="md:w-[20%] w-[100%]">
                                                                    <div className=" mb-0 ">
                                                                        {(item?.propertyType === "offmarket" || item?.propertyType === "directory") ? (
                                                                            <h5 className="text-[#6D6E6D] text-[20px] font-bold capitalize">
                                                                                {item?.propertyType === "offmarket" ? "Off-Market" : `${item?.propertyType}`}
                                                                                <span className="text-[#47525E] text-[13px] ms-2 capitalize">
                                                                                    {item?.proposal === "both" ? "Rental/Purchase" : `${item?.proposal}`} compliance
                                                                                </span>
                                                                            </h5>
                                                                        ) : (item?.propertyType == "rent" && item?.propertyMonthlyCharges) ? (
                                                                            <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                                                                                {item?.propertyMonthlyCharges} €
                                                                                <span className="text-[#47525E] text-[13px] "> / month</span>
                                                                            </h5>
                                                                        ) : (
                                                                            <>
                                                                                {item?.price ? (
                                                                                    <h5 className="text-[#6D6E6D] text-[20px] font-bold">
                                                                                        {item?.price} €
                                                                                        {perSqr > 0 && <span className="text-[#47525E] text-[13px] ms-2 ">
                                                                                            {perSqr?.toFixed(2)} {" €/sqm"}
                                                                                        </span>}
                                                                                    </h5>) : null}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <div className=" mt-10 mx-auto block">
                                                                        <ul className="flex flex-wrap justify-center items-center mx-auto block">
                                                                            <li className="flex items-center w-1/2 mx-auto md:justify-center mb-3 justify-start">
                                                                                <img
                                                                                    src="/assets/img/icons/heart-blue.png"
                                                                                    alt=""
                                                                                    className="w-[27px] h-[27px] me-[4px]"
                                                                                />
                                                                                <p className="text-[#343F4B] text-[16px] ms-2">
                                                                                    {item?.likeCount || 0}
                                                                                </p>
                                                                            </li>
                                                                            <li className="flex items-center   w-1/2 mx-auto md:justify-center mb-3 justify-start">
                                                                                <img
                                                                                    src="/assets/img/icons/user-blue.png"
                                                                                    alt=""
                                                                                    className="w-[27px] h-[27px] me-[4px]"
                                                                                />
                                                                                <p className="text-[#343F4B] text-[16px] ms-2 ">
                                                                                    {item?.followerCount || 0}
                                                                                </p>
                                                                            </li>
                                                                            <li className="flex items-center   w-1/2 mx-auto  md:justify-center mb-3 justify-start">
                                                                                <img
                                                                                    src="/assets/img/icons/eye-blue.png"
                                                                                    alt=""
                                                                                    className="w-[27px] h-[27px] me-[4px]"
                                                                                />
                                                                                <p className="text-[#343F4B] text-[16px] ms-2 ">
                                                                                    3K
                                                                                </p>
                                                                            </li>
                                                                            <li className="flex items-center   w-1/2 mx-auto md:justify-center mb-3 justify-start">
                                                                                <img
                                                                                    src="/assets/img/icons/share-blue.png"
                                                                                    alt=""
                                                                                    className="w-[27px] h-[27px] me-[4px]"
                                                                                />
                                                                                <p className="text-[#343F4B] text-[16px] ms-2">
                                                                                    2
                                                                                </p>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div onClick={() => navigateToDetail(item)} className="lg:w-[65%] md:w-[75%] w-[100%]">
                                                                    {item?.propertyTitle && (
                                                                        <h2 className="text-[#47525E] text-[20px] font-bold mt-2 capitalize">
                                                                            {item?.propertyTitle}
                                                                        </h2>)}
                                                                    {(item?.city || item?.country) && (
                                                                        <p className="text-[#47525E] text-[14px]">
                                                                            {item?.city || item?.country} {item?.zipcode ? ", " + item?.zipcode : ""}
                                                                        </p>)}
                                                                    <ul className="flex items-center mt-3">
                                                                        {item?.surface && (
                                                                            <li className="flex items-center me-5">
                                                                                <img
                                                                                    src="/assets/img/prop/home.png"
                                                                                    alt=""
                                                                                    className="w-[17px] h-[17px] me-1"
                                                                                />
                                                                                <p className="text-[#47525E] text-[14px]">
                                                                                    {item?.surface}
                                                                                </p>
                                                                            </li>)}
                                                                        {item?.rooms && (
                                                                            <li className="flex items-center me-5">
                                                                                <img
                                                                                    src="/assets/img/prop/bed.png"
                                                                                    alt=""
                                                                                    className="w-[17px] h-[17px] me-1"
                                                                                />
                                                                                <p className="text-[#47525E] text-[14px]">
                                                                                    {item?.rooms}
                                                                                </p>
                                                                            </li>)}
                                                                        {item?.toilets && (
                                                                            <li className="flex items-center">
                                                                                <img
                                                                                    src="/assets/img/prop/tub.png"
                                                                                    alt=""
                                                                                    className="w-[17px] h-[17px] me-1"
                                                                                />
                                                                                <p className="text-[#47525E] text-[14px]">
                                                                                    {item?.toilets}
                                                                                </p>
                                                                            </li>)}
                                                                    </ul>
                                                                    {/* {item?.content && (
                                                                        <p className="text-[#47525E] mt-3 ellipses-two">
                                                                            {item?.content?.length > 300 ? item?.content?.slice(0, 300) + "..." : item?.content}
                                                                        </p>)} */}
                                                                    {removeHTMLTags(item?.content) && (
                                                                        <p className="text-[#47525E] mt-3 ellipses-two">
                                                                            {item?.content?.length > 300
                                                                                ? new DOMParser().parseFromString(item.content, 'text/html').body.textContent.slice(0, 300) + "..."
                                                                                : new DOMParser().parseFromString(item.content, 'text/html').body.textContent
                                                                            }                                                                        </p>)}
                                                                </div>
                                                                <div className="lg:w-[10%] w-[100%]">
                                                                    <ul className="flex items-center justify-center p-3 lg:flex-col flex-row h-full">
                                                                        <li className="my-3">
                                                                            <a onClick={() => item?.favourite_details ? disLiked(item) : isLiked(item)} >
                                                                                <img src={`assets/img/${item?.favourite_details ? "fill-heart" : "lined-heart"}.svg`} alt="" className="w-[30px]" />

                                                                            </a>
                                                                        </li>
                                                                        <li className="my-3">
                                                                            <a onClick={() => isFollow(item)}>
                                                                                <img src={`assets/img/${item?.followunfollows_details ? "fill-house" : "lined-house"}.svg`} alt="" className="w-[30px]" />
                                                                            </a>
                                                                        </li>
                                                                        <li className="my-3">
                                                                            <button
                                                                                onClick={() => generateQr(item)}
                                                                                className="w-[30px] h-[30px] rounded-full border border-[#E5E7EB] text-[#7F56C6] flex items-center justify-center"
                                                                            >
                                                                                <LuQrCode size={16} />
                                                                            </button>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                {/* Three-dot menu */}
                                                                {(user?._id === item?.addedBy) &&
                                                                    <div ref={(el) => (dropdownRefs.current[index] = el)} className="absolute top-2 right-2">
                                                                        <button onClick={() => toggleDropdown(index)} className="focus:outline-none">
                                                                            <img src="assets/img/dots.png" alt="Options" className="w-[20px] h-[20px]" />
                                                                        </button>
                                                                        {dropdownIndex === index && (
                                                                            <div className="absolute bg-white  rounded-[7px] shadow-lg mt-1 -left-[70px]">
                                                                                <ul>
                                                                                    <li onClick={() => editItem(item)} className="p-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center"> <FiEdit className="me-2 text-[15px]" />
                                                                                        <span className="text-[14px] text-[#333]">
                                                                                            Edit
                                                                                        </span></li>
                                                                                    <li onClick={() => deleteItem(item)} className="p-2 px-4 cursor-pointer hover:bg-gray-100 flex items-center"> <AiOutlineDelete className="me-2" />
                                                                                        <span className="text-[14px] text-[#333]">
                                                                                            Delete
                                                                                        </span></li>
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </div>}
                                                                <div className="w-full mt-2 border-t border-[#EEF0F3] pt-3 flex items-center justify-end gap-2">
                                                                    <span className="text-[12px] text-[#7C8798] mr-auto">
                                                                        {`Scans: ${item?.qrCode?.scanCount || 0}`}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => downloadQr(item)}
                                                                        className="inline-flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-full border border-[#E4D9F5] text-[#7F56C6] hover:bg-[#F6F2FC] transition"
                                                                    >
                                                                        <LuDownload size={14} />
                                                                        Download QR
                                                                    </button>
                                                                    <button
                                                                        onClick={() => removeQr(item)}
                                                                        disabled={!item?.qrCode?.token}
                                                                        className="inline-flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-full border border-[#EFE3F3] text-[#A46477] hover:bg-[#FBF3F6] transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                                    >
                                                                        <LuTrash2 size={14} />
                                                                        Remove QR
                                                                    </button>
                                                                    <button
                                                                        onClick={() => generateQr(item)}
                                                                        className="inline-flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-full bg-[#976DD0] text-white hover:opacity-90 transition"
                                                                    >
                                                                        <LuQrCode size={14} />
                                                                        {item?.qrCode?.token ? "Regenerate QR Code" : "Generate QR Code"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }) : <div className="text-center col-span-12">No Records Found</div>}
                                    </div>
                                    <div className={`paginationWrapper ${total > filters?.count ? '' : 'd-none'}`}>
                                        <span>Show {data?.length} from {total} Properties</span>
                                        <ReactPaginate
                                            previousLabel="< Previous"
                                            nextLabel="Next >"
                                            breakLabel="..."
                                            pageRangeDisplayed={2}
                                            marginPagesDisplayed={1}
                                            pageCount={Math.ceil(total / filters?.count)}
                                            onPageChange={handlePageChange}
                                            forcePage={filters?.page - 1}
                                            containerClassName={"pagination flex"}
                                            pageClassName={"pagination-item"}
                                            activeClassName={"pagination-item-active"}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


            </PageLayout>
        </>
    )
}

export default MyProperties
