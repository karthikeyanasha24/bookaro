import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import shared from "./shared";

const View = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
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
        setData(res.data)
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
                onClick={() => navigate(-1)}
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
                  {data?.name && <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Name:</label>
                    <p className="text-sm font-normal">
                      {data && data?.name}
                    </p>
                  </div>}

                  {data?.role && <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Role:</label>
                    <p className="text-sm font-normal">
                      {data?.role}
                    </p>
                  </div>}

                  {data?.planType && <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Plan Type:</label>
                    <p className="text-sm font-normal">
                      {data?.planType}
                    </p>
                  </div>}

                  {data?.pricing?.[0]?.unit_amount && <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">price:</label>
                    <p className="text-sm font-normal">
                      {data?.pricing?.[0]?.unit_amount}
                    </p>
                  </div>}

                  {data?.numberOfInterest && <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">No. of Interest:</label>
                    <p className="text-sm font-normal">
                      {data?.numberOfInterest || "--"}
                    </p>
                  </div>}

                  {data?.numberOfProperty && <div className="lg:col-span-6   col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">No. of Property:</label>
                    <p className="text-sm font-normal">
                      {data?.numberOfProperty || "--"}
                    </p>
                  </div>}

                  {data?.feature?.length > 0 && <div className="col-span-full flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Features:</label>
                    <p className="text-[13px] flex flex-wrap gap-2 text-black capitalize min-h-[35px] rounded-md items-center capitalize py-2 leading-[18px]">
                      {data?.feature?.map((item, index) => {
                        return <span key={index} className="bg-[#976DD0] p-2 rounded-lg text-white">{item?.name}</span>
                      })}
                    </p>
                  </div>}

                  {data?.description && <div className="col-span-12 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Description:</label>
                    <p className="text-sm font-normal"
                      dangerouslySetInnerHTML={{ __html: data?.description }}></p>
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
