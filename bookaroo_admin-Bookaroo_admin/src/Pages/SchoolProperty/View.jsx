import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import methodModel from "../../methods/methods";

const View = () => {
    const [data, setData] = useState();
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getDetail();
        }
    }, [])

    const getDetail = () => {
        loader(true)
        ApiClient.get(shared.detailApi, { schoolId: id }).then((res) => {
            loader(false)
            if (res.success) {
                setData(res?.data)
            }
        })
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
                                {shared.addTitle} Details
                            </h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                            <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                                <div>
                                    <h4 className="p-4 bg-[#976DD01a] font-medium">Basic Information</h4>
                                </div>
                                <div className=" bg-white p-5">
                                    <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Info</h2>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">School Id:</label>
                                            <p className="text-sm font-normal">
                                                {data && data?.schoolId || "--"}
                                            </p>
                                        </div>
                                        <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Email:</label>
                                            <p className="text-sm font-normal">
                                                {data?.email || "--"}
                                            </p>
                                        </div>

                                        <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Establishment Name:</label>
                                            <p className="text-sm font-normal">
                                                {data && data?.EstablishmentName || "--"}
                                            </p>
                                        </div>

                                        <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Address:</label>
                                            <p className="text-sm font-normal">
                                                {data?.address || "--"}
                                            </p>
                                        </div>

                                        <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Postal code:</label>
                                            <p className="text-sm font-normal">
                                                {data?.postalCode || "--"}
                                            </p>
                                        </div>

                                        {/* <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Establishment Type:</label>
                                            <p className="text-sm font-normal">
                                                {data?.establishmentType || "--"}
                                            </p>
                                        </div> */}

                                        <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">School Type:</label>
                                            <p className="text-sm font-normal">
                                                {data?.schoolType || "--"}
                                            </p>
                                        </div>

                                        <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">School Status:</label>
                                            <p className="text-sm font-normal">
                                                {data?.schoolStatus || "--"}
                                            </p>
                                        </div>
                                        {data?.phone && <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Phone:</label>
                                            <p className="text-sm font-normal">
                                                {data?.phone || "--"}
                                            </p>
                                        </div>}
                                        {data?.numberOfStudents && <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Number Of Student:</label>
                                            <p className="text-sm font-normal">
                                                {data?.numberOfStudents || "--"}
                                            </p>
                                        </div>}
                                        {data?.website && <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Website:</label>
                                            <p className="text-sm font-normal">
                                                {data?.website || "--"}
                                            </p>
                                        </div>}
                                        {data?.successRate && <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Success Rate:</label>
                                            <p className="text-sm font-normal">
                                                {data?.successRate || "--"}
                                            </p>
                                        </div>}
                                        {data?.examGrade && <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Exam Grade:</label>
                                            <p className="text-sm font-normal">
                                                {data?.examGrade || "--"}
                                            </p>
                                        </div>}
                                        {data?.distinctionRate &&  <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Distinction Rate:</label>
                                            <p className="text-sm font-normal">
                                                {data?.distinctionRate || "--"}
                                            </p>
                                        </div>}
                                       {data?.SPI &&    <div className=" flex flex-col">
                                            <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">SPI:</label>
                                            <p className="text-sm font-normal">
                                                {data?.SPI || "--"}
                                            </p>
                                        </div>}
                                     
                                    </div>
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
