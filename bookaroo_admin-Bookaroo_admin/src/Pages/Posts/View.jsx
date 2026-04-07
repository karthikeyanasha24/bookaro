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
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false)
      if (res.success) {
        setData(res.payload)
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
                <div className="grid grid-cols-12 gap-5 p-4">
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Title:</label>
                    <p className="text-sm font-normal">
                      {data && data?.title}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Venue:</label>
                    <p className="text-sm font-normal">
                      {data?.venue_id?.venue_name || "--"}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Link:</label>
                    <p className="text-sm font-normal">
                      {data?.link || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Description:</label>
                    <p className="text-sm font-normal" dangerouslySetInnerHTML={{ __html: data?.description }}></p>
                  </div>
                  {data?.image?.length > 0 ?
                    <div className="col-span-12 flex flex-col">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Images:</label>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {data?.image?.map((item, index) => {
                          return <Tooltip position="top" title="Click to open">
                            <img src={methodModel.noImg(item)} onClick={e => { window.open(methodModel.noImg(item), "_blank") }} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain mr-4 cursor-pointer" key={index} />
                          </Tooltip>
                        })}
                    </div>
                    </div>
                    : null}
                  {data?.video?.length > 0 ?
                    <div className="col-span-12 flex flex-col">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Video:</label>
                      <div className="flex flex-wrap gap-3">
                        {data?.video?.map((item,index)=>{
                          return <video width="320" height="240" className="w-[200px] rounded-lg" key={index} controls>
                          <source src={methodModel.video(item)} type="video/mp4" />
                          <source src={methodModel.video(item)} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                        })}
                        </div>
                    </div>
                    : null}
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
