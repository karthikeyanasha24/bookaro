import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import methodModel from "../../methods/methods";
import { FaMapLocationDot, FaUserLarge } from "react-icons/fa6";

const View = () => {
    const [data, setData] = useState();
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getDetail();
    }, []);

    const getDetail = () => {
        loader(true);
        ApiClient.get(`funnelUrl/get`, { id: id }).then((res) => {
            if (res?.success) {
                setData(res?.data);
            }
        });
        loader(false);
    };

    const openImage = (image) => {
        if (image) window.open(methodModel.noImg(image), "_blank")
        else return
    }

    return (
        <>
            <Layout>
                <div className="wrapper_section">
                    <div className="flex items-center mb-8">
                        <Tooltip placement="top" title="Back">
                            <span
                                onClick={() => history(-1)}
                                className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
                            >
                                <i className="fa fa-angle-left text-lg"></i>
                            </span>
                        </Tooltip>
                        <div>
                            <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                                Video Details
                            </h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                            <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                                <div>
                                    <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                                        <div className=" me-3 bg-[#996dca21] p-3 rounded-md">

                                            <FaUserLarge className="text-[18px]" />
                                        </div>
                                        Basic Information
                                    </h4>
                                </div>
                                <div className="grid grid-cols-12  p-4">
                                    <div className="lg:col-span-6 col-span-12 mb-5 flex flex-col">
                                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Video Title</label>
                                        <p className="text-sm font-normal">
                                            {data && data?.title}
                                        </p>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12 mb-5 flex flex-col">
                                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Video Owner</label>
                                        <p className="text-sm font-normal">
                                            {data && data?.videoOwner}
                                        </p>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12 mb-5 flex flex-col">
                                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Tags</label>
                                        <p className="text-sm font-normal">
                                            {data && data?.tags?.map((item) => <span>{item?.title}</span>)}
                                        </p>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12 mb-5 flex flex-col">
                                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Persona</label>
                                        <p className="text-sm font-normal">
                                            {data && data?.type == "owner_for_rent" ? "Owner For Rent" : data?.type == "owner_for_seller" ? "Owner For Rent" : data?.type}
                                        </p>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12 mb-5 flex flex-col">
                                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Traning Topic</label>
                                        <p className="text-sm font-normal">
                                            {data && data?.topic}
                                        </p>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12 mb-5 flex flex-col">
                                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Funnel Status</label>
                                        <p className="text-sm font-normal">
                                            {data && data.funnelStatus}
                                        </p>
                                    </div>
                                    <div className="lg:col-span-6 col-span-12 mb-5 flex flex-col">
                                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Url</label>
                                        <p className="text-sm font-normal">
                                            {data?.youtubeUrl}
                                        </p>
                                    </div>
                                    {data?.image &&
                                        <div className="col-span-12 mb-5 flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Image</label>
                                            <div className="flex flex-wrap gap-3 mt-3">
                                                <Tooltip position="top" title="Click to open">
                                                    <img src={methodModel.noImg(data?.image)} className={`bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain p-2 ${data?.image ? "cursor-pointer" : ""}`} onClick={() => openImage(data?.image)} />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    }
                                    {data?.description && <div className="lg:col-span-6 col-span-12 mb-5 flex flex-col">
                                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Description</label>
                                        <p className="text-sm font-normal">
                                            {data?.description}
                                        </p>
                                    </div>}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default View;
