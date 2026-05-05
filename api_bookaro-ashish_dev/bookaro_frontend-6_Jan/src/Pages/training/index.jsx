import { FaChevronDown, FaCircleArrowDown, FaHashtag, FaRegEye, FaRegThumbsUp, FaUser } from "react-icons/fa6";
import PageLayout from "../../components/global/PageLayout";
import { FaRegUserCircle, FaSyncAlt } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import methodModel from "../../methods/methods";
import TrainingComponent from "./TraningComponent";
import { useSelector } from "react-redux";
import SelectDropdown from "../../components/common/SelectDropdown";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";

const Training = () => {
    const [data, setdata] = useState([])
    const [total, settotal] = useState([])
    const user = useSelector((state) => state.user)
    const [showDropdown, setShowDropdown] = useState(false);
    const history = useNavigate()
    const [filters, setFilters] = useState({ type: "", funnelStatus: "" })
    const [topics, setTopics] = useState([]);
    const [tags, settags] = useState([]);
    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        const handleFullscreenChange = () => {
            getData()
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            getData()
        };
    }, []);

    const getData = (f = {}) => {
        const payload = {
            ...filters,
            ...f,
            loggedInUser: user?.id || user?._id
        }
        loader(true)
        ApiClient.get(`funnelUrl/getAll`, payload).then((res) => {
            if (res.success) {
                const filteredData = res?.data?.filter((item) => item?.duration != "")
                if (user?.loggedIn) {
                    setdata(filteredData)
                } else {
                    setdata([filteredData[0]])
                }
                settotal(res?.total)
            }
            loader(false)
        });
    }

    const getVideoId = (url) => {
        try {
            const parsed = new URL(url);
            // Handle youtu.be links (e.g., https://youtu.be/VIDEO_ID)
            if (parsed.hostname === "youtu.be") {
                return parsed.pathname.slice(1);
            }
            // Handle full YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
            if (parsed.hostname.includes("youtube.com")) {
                // Priority: get v param from URL
                const v = parsed.searchParams.get("v");
                if (v) return v;
                // If v is missing, try pathname parsing for embed or /v/VIDEO_ID
                const pathParts = parsed.pathname.split("/");
                const idFromPath = pathParts.find((part) => /^[a-zA-Z0-9_-]{11}$/.test(part));
                if (idFromPath) return idFromPath;
            }
            return null;
        } catch {
            return null;
        }
    }

    const LikeDislike = (item) => {
        const payload = {
            funnelUrlId: item?._id,
            addedBy: user?.id || user?._id
        }
        ApiClient.post(`funnelVideoLike/likeDislike`, payload).then((res) => {
            if (res.success) {
                getData()
            }
        });
    }

    const handleFilters = (value, key) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        getData({ [key]: value });
        setShowDropdown(false);
    }

    useEffect(() => {
        loader(true);
        ApiClient.get(`funnelUrl/getAll`).then((res) => {
            if (res.success) {
                const filtered = res.data.filter((item) => item?.topic);
                const mapped = filtered.map((item) => ({
                    id: item.topic,
                    name: item.topic,
                }));
                const uniqueTopics = Array.from(
                    new Map(mapped.map((topic) => [topic.id, topic])).values()
                );
                setTopics(uniqueTopics);
            }
            loader(false);
        });

    }, [loader]);


    const getStatusOptions = () => {
        if (filters?.type === "owner_for_seller" || filters?.type === "owner_for_rent") return shared.ownerStatusOptions
        else if (filters?.type === "seller") return shared.renterStatusOption
        else if (filters?.type === "buyer") return shared.byerStatusOption
        else return shared.uniqueStatusOptions
    }

    const clear = () => {
        let f = {
            search: ""
        };
        setFilters({ ...filters, ...f });
        getData({ ...f });
        Listtags()
    };
    const Listtags = (search = "") => {
        ApiClient.get(`tags/list?search=${search}`).then((res) => {
            if (res.success) {
                const mapped = res?.data.map((item) => ({
                    id: item._id,
                    name: item.title,
                }));
                settags(mapped);
            }
            loader(false);
        });
    }


    return (
        <PageLayout>
            <section className="py-5 ">
                <div className="container px-5 xl:px-10 mx-auto">
                    <h3 className="font-[600] text-[24px] text-center">Real Estate like a pro training for individuals</h3>
                    <p className="text-[#8e8d97] text-center mb-4">Get prepared, sell on your own, no commission fees, no mandats, no exclusivity, and no complexities.</p>


                    <div className=" pb-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                        {/* Filters */}

                        <div className="flex w-full flex-col sm:flex-row justify-center md:justify-start flex-wrap gap-4 sm:gap-6">


                            {/* Transaction stage */}
                            <div className="flex flex-col">

                                <label className="text-sm mb-2">Choose your persona</label>
                                {/* <div className="flex items-center gap-2 border border-[#976dd0] rounded-full ps-4 pe-2 py-2 bg-white text-sm w-[100%] sm:w-[150px]">
                                    <FaSyncAlt className="text-primary" />
                                    <span>All</span>
                                    <FaCircleArrowDown size={20} className="ml-auto text-black" />
                                </div> */}
                                <SelectDropdown
                                    className="custom_drop capitalize"
                                    displayValue="name"
                                    placeholder="All Types"
                                    theme="search"
                                    isClearable={true}
                                    intialValue={filters?.type}
                                    result={(e) => handleFilters(e.value, "type")}
                                    options={[
                                        { id: "owner_for_seller", name: "Owner for Sell" },
                                        { id: "owner_for_rent", name: "Owner for Rent" },
                                        { id: "seller", name: "Seller" },
                                        { id: "buyer", name: "Buyer" },
                                    ]}
                                />
                            </div>

                            {/* Training topic */}

                            <div className="flex flex-col">
                                <label className="text-sm mb-2"> Transaction stage</label>
                                {/* <div className="flex items-center gap-2 border border-[#976dd0] rounded-full ps-4 pe-2 py-2 bg-white text-sm w-[100%] sm:w-[350px]">
                                        <FaHashtag className="text-primary" />
                                        <span>All</span>
                                        <FaCircleArrowDown size={20} className="ml-auto text-black" />
                                    </div> */}
                                <SelectDropdown
                                    className="custom_drop capitalize"
                                    displayValue="name"
                                    placeholder="All Funnel Status"
                                    theme="search"
                                    isClearable={true}
                                    intialValue={filters?.funnelStatus}
                                    result={(e) => handleFilters(e.value, "funnelStatus")}
                                    options={getStatusOptions()}
                                />
                            </div>


                            {/* Persona */}
                            <div className="flex flex-col">
                                <label className="text-sm mb-2">Training topic</label>
                                <div className="">
                                    <SelectDropdown
                                        className="custom_drop capitalize"
                                        displayValue="name"
                                        placeholder="All Training topic"
                                        theme="search"
                                        isClearable={true}
                                        intialValue={filters?.topic}
                                        result={(e) => handleFilters(e.value, "topic")}
                                        options={topics}
                                    />
                                </div>
                            </div>

                            <div className="flex items-end gap-3">
                                <form
                                    className="flex items-end max-w-sm gap-2 relative"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleFilters(filters?.search, "search");
                                    }}
                                >
                                    <label htmlFor="simple-search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            id="simple-search"
                                            value={filters.search}
                                            onChange={(e) => {
                                                setFilters({ ...filters, search: e.target.value });
                                                Listtags(e.target.value);
                                                setShowDropdown(true); // show dropdown when typing
                                            }}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#976DD0] block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                                            placeholder="Search"
                                        />
                                        {filters?.search && (
                                            <i
                                                className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm cursor-pointer"
                                                aria-hidden="true"
                                                onClick={() => clear()}
                                            ></i>
                                        )}

                                        {(filters.search && showDropdown) && (
                                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-1 w-full max-h-48 overflow-y-auto dark:bg-gray-700 dark:border-gray-600">
                                                {tags && tags.length > 0 ? (
                                                    tags.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                                            onClick={() => {
                                                                setFilters({ ...filters, search: item?.name });
                                                                Listtags(item?.name);
                                                                setShowDropdown(false);
                                                            }}
                                                        >
                                                            {item.name}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="px-4 py-2 text-gray-500 dark:text-gray-300">
                                                        No data
                                                    </li>
                                                )}
                                            </ul>
                                        )}



                                    </div>

                                    <button
                                        type="submit"
                                        className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
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
                                <span className="text-[#976DD0]">{total} results</span>
                            </div>
                        </div>

                        {/* Partnership Box */}
                        <div className="flex flex-col md:min-w-[200px] items-center md:items-end text-center md:text-right">
                            <h4 className="text-[#52a8a1] text-[20px] font-semibold">Partnership</h4>
                            <span className="font-[600]">Want to submit your own<br />training video ?</span>
                            <button className="mt-2 bg-primary text-white font-[600] rounded-full px-5 py-1.5 text-sm hover:opacity-80"
                                onClick={() =>
                                    // window.open(
                                    //     "/contact-us",
                                    //     "_blank",
                                    //     "noopener,noreferrer"
                                    // )
                                    history("/contact-us?traningVideo")
                                }
                            >
                                Contact-us
                            </button>
                        </div>
                    </div>
                    {data?.length > 0 ? <> <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-7 mb-5 md:mb-10">
                        {/* Image Section */}
                        <div className="lg:col-span-4 ">
                            <TrainingComponent
                                index={0}
                                item={data[0]}
                                title={data[0]?.title}
                                duration={data[0]?.duration}
                                videoId={getVideoId(data[0]?.youtubeUrl)}
                                thumbnail={methodModel.userImg(data[0]?.image)}
                            />
                        </div>

                        {/* Content Section */}

                        <div className="lg:col-span-3 py-6 md:p-6 flex flex-col ">
                            <div className="flex flex-col gap-2">
                                <span className="bg-black text-white text-sm px-3 py-1.5 rounded-[8px] w-fit">
                                    Featured
                                </span>

                                <h3 className="text-lg font-semibold">
                                    {data[0]?.title}
                                </h3>
                                <Tooltip title={data[0]?.description}>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {data[0]?.description}
                                    </p>
                                </Tooltip>

                                <div className="">
                                    {/* <span>3 min</span> */}
                                    <div className="flex items-center gap-2 mt-1">
                                        <img src={methodModel.userImg(data[0]?.addedBy?.image)} alt="img" className="w-[30px] h-[30px] rounded-full object-cover" />
                                        <span className="text-black font-medium capitalize">{data[0]?.addedBy?.fullName}</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex gap-2 flex-wrap mt-2">
                                    <span className="bg-[#976dd0]/60 text-black text-sm px-3 py-1 rounded-[4px] capitalize">
                                        {data[0]?.type == "owner_for_seller" ? "Owner Selling" : data[0]?.type == "owner_for_rent" ? "Owner Renting" : data[0]?.type}
                                    </span>
                                    {data[0]?.tags?.length > 0 && <>
                                        {data[0]?.tags?.map((item) => {
                                            return <span className="bg-[#976dd0]/30 text-black text-sm px-3 py-1 rounded-[4px]">
                                                {item}
                                            </span>
                                        })}</>
                                    }
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 text-sm">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex text-black items-center gap-1"
                                        onClick={(e) => LikeDislike(data[0])}
                                    >
                                        {data[0]?.isLiked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
                                        <span>
                                            {data[0]?.totalLikes || 0}
                                        </span>
                                    </div>
                                    <div className="flex text-black items-center gap-1">
                                        <MdOutlineRemoveRedEye className={`${data[0]?.isviewed ? "text-green-600" : ""}`} size={20} />
                                        <span>{data[0]?.viewCount || 0}</span>
                                    </div>
                                    {/* <div className="text-primary font-semibold">
                                        B<span className="text-black">coins:</span> 1000
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6 mt-6">
                            {data?.map((item, i) => {
                                const videoId = getVideoId(item?.youtubeUrl)
                                return <>
                                    {i > 0 && <div key={i} className=" mb-2">
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src={methodModel.userImg(item?.addedBy?.image)} alt="img" className="w-[25px] h-[25px] rounded-full object-cover" />
                                            <span className="text-black font-medium capitalize">{item?.addedBy?.fullName}</span>
                                        </div>

                                        {/* Image section */}
                                        <div className="relative  rounded-xl overflow-hidden">
                                            <TrainingComponent
                                                index={i}
                                                item={item}
                                                title={item?.title}
                                                duration={item?.duration}
                                                videoId={videoId}
                                                thumbnail={methodModel.userImg(item?.image)}
                                            />

                                            {/* Duration tag */}
                                            {/* <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[12px] px-3 py-1.5 rounded-[8px]">
                                        3min
                                    </div> */}
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-semibold mb-2 text-gray-900 mt-2">
                                            {item?.title}
                                        </h3>
                                        <Tooltip title={item?.description}>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item?.description}
                                            </p>
                                        </Tooltip>
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            <span className="bg-[#976dd0]/60 text-black text-sm px-3 py-1 rounded-[4px] capitalize">
                                                {item?.type == "owner_for_seller" ? "Owner Selling" : item?.type == "owner_for_rent" ? "Owner Renting" : item?.type}
                                            </span>
                                            {item?.tags?.length > 0 && <>
                                                {item?.tags?.map((itm) => {
                                                    return <span className="bg-[#976dd0]/30 text-black text-sm px-3 py-1 rounded-[4px]">
                                                        {itm}
                                                    </span>
                                                })}</>
                                            }
                                        </div>

                                        <div className="flex items-center justify-between mt-3 text-sm">
                                            <div className="flex items-center gap-4 text-gray-600">
                                                <div className="flex text-black items-center gap-1"
                                                    onClick={(e) => LikeDislike(item)}
                                                >
                                                    {item?.isLiked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
                                                    <span>{item.totalLikes || 0}</span>
                                                </div>
                                                <div className="flex text-black items-center gap-1">
                                                    <MdOutlineRemoveRedEye className={`${item?.isviewed ? "text-green-600" : ""}`} size={20} />
                                                    <span>{item?.viewCount || 0}</span>
                                                </div>
                                                {/* <div className="text-primary font-semibold">
                                            B<span className="text-black">coins:</span> 1000
                                        </div> */}
                                            </div>
                                        </div>
                                    </div>}

                                </>
                            }
                            )}

                        </div></> : <p className="text-center my-10">
                        <img src="/assets/img/no-data.png" className="w-[100px] mx-auto" />
                        No data found
                    </p>}
                    {!user?.loggedIn && <p className="text-center my-10">
                        {/* <img src="/assets/img/no-data.png" className="w-[100px] mx-auto" /> */}
                       Want to see more videos? <spna onClick={(e)=>history("/login")} className="text-bold text-[#976DD0] cursor-pointer">Just log in first!</spna>
                    </p>}

                </div>
            </section>
        </PageLayout>
    )
}
export default Training;