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
    getDetail();
  }, []);

  const getDetail = () => {
    loader(true);
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false);
      if (res.success) {
        let data = res.data
        data.permissions = data.permissions?.[0]
        setData(data);
      }
    });
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
                <div className="grid grid-cols-12 gap-5 p-4">
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">First Name:</label>
                    <p className="text-sm font-normal">
                      {data && data?.firstName}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Last Name:</label>
                    <p className="text-sm font-normal">
                      {data && data?.lastName}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Email:</label>
                    <p className="text-[13px] text-black bg-[#f5f5f5] min-h-[35px] rounded-md items-center px-3 py-2 leading-[18px]">
                      {data && data.email}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Mobile Number:</label>
                    <p className="text-sm font-normal">
                      {data?.mobileNo ? `+${data?.mobileNo}` : "--"}
                    </p>
                  </div>
                  {data?.image &&
                  <div className="col-span-12 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Image:</label>
                    <div className="flex flex-wrap gap-3 mt-3">
                        <Tooltip position="top" title="Click to open">
                          <img src={methodModel.noImg(data?.image || "")} className={`bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain ${data?.image ? "cursor-pointer" : ""}`} onClick={() => openImage(data?.image || "")} />
                        </Tooltip>
                      </div>
                    </div>
                  }
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
