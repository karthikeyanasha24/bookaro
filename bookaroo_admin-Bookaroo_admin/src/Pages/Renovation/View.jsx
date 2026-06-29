import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import shared from "./shared";
import { RiBuildingFill } from "react-icons/ri";

const View = () => {
  const [data, setData] = useState();
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = () => {
    loader(true);
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false);
      if (res.success) {
        setData(res.data);
      }
    });
  };

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
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                <div>
                  <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                    <div className=" me-3 bg-[#996dca21] p-3 rounded-md">
                    <RiBuildingFill className="text-[18px]"/>
                    </div>
                    {shared.title} Information
                  </h4>
                </div>
                <div className="grid grid-cols-12 p-4 gap-4">
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Name:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.name}
                    </p>
                  </div>
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Status:
                    </label>
                    <p className="text-sm font-normal">
                      {data?.status == "active" ? "Active" : "Inactive"}
                    </p>
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
