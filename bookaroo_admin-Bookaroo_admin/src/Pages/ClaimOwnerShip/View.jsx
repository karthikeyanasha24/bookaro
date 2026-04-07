import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import methodModel from "../../methods/methods";
import { IoDocument } from "react-icons/io5";
import moment from "moment";
import { BsFiletypePdf } from "react-icons/bs";

const View = () => {
  const [data, setData] = useState();
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getDetail();
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

  const handleRequest = (key) => {
    const payload = {
      claimId: data?.claim_venue_data?._id || data?.claim_venue_data?.id,
      userId: data?._id || data?.id,
      type: key
    }
    ApiClient.post(shared?.claimVenueApi, payload).then(res => {
      if (res.success) {
        getDetail()
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
              <div className="shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0">
                <div className="grid grid-cols-12 gap-5 p-4">
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Name:</label>
                    <p className="text-sm font-normal">
                      {data?.name || "--"}
                    </p>
                  </div>

                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Email:</label>
                    <p className="text-[13px] text-black bg-[#f5f5f5] min-h-[35px] rounded-md items-center px-3 py-2 leading-[18px]">
                      {data?.email || "--"}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Mobile Number:</label>
                    <p className="text-sm font-normal">
                      {data?.mobileNo ? `+${data?.mobileNo}` : "--"}
                    </p>
                  </div>          
                  <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">property:</label>
                    <p className="text-sm font-normal">
                      {data?.propertyId?.propertyTitle || "--"}
                    </p>
                  </div>
                   <div className="col-span-6 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Claim Message:</label>
                    <p className="text-sm font-normal">
                      {data?.claimMessage || "--"}
                    </p>
                  </div>
                   {data?.docs?.length > 0 ?
                    <div className="col-span-12 flex flex-col">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Documents:</label>
                      <div className="flex flex-wrap gap-3">
                        {data?.docs?.map((item, index) => {
                          return <Tooltip position="top" title="Click to open">
                             <BsFiletypePdf className="text-[24px] me-3 cursor-pointer"  onClick={e => { window.open(methodModel.noImg(item?.fileName), "_blank") }}  key={index} />
                          </Tooltip>
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
