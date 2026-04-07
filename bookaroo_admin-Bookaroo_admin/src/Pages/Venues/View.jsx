import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import methodModel from "../../methods/methods";
import moment from "moment";
import { IoDocument } from "react-icons/io5";

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
    loader(true);
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false);
      if (res.success) {
        setData(res?.data)
      }
    });
  }

  const handleRequest = (key) => {
    const payload = {
      id: id,
      type: key
    }
    ApiClient.put(`users/verify/document`, payload).then(res => {
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
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0">
                <div className="flex items-center p-4 bg-[#976DD01a] font-medium justify-between">
                  <h4 className="">Basic Information</h4>
                  <div className="flex items-center gap-2">
                    <div className={`capitalize ${data?.doc_status === "rejected" ? "text-red-600" : data?.doc_status === "verified" ? "text-green-600" : "text-yellow-600"}`}>Document Verification: {data?.doc_status ? data?.doc_status : "Pending"}</div>
                    {data?.docVerified === "N" && data?.doc_status === "pending" ?
                      <div className="flex items-center gap-2">
                        <button onClick={e => handleRequest("unverify")} className="!px-4 py-2 cursor-pointer flex items-center justify-center rounded-lg shadow-btn border transition-all mr-3 bg-[#05388fed] text-white">Reject</button>
                        <button onClick={e => handleRequest("verify")} className="!px-4 py-2 cursor-pointer flex items-center justify-center rounded-lg shadow-btn border transition-all mr-3 bg-[#05388fed] text-white">Accept</button>
                      </div>
                      : null}
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-5 p-4">
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Venue Name:</label>
                    <p className="text-sm font-normal">
                      {data?.venue_name || "--"}
                    </p>
                  </div>
                  {data?.locations?.map((item, index) => {
                    return <div className="col-span-12 border border-[1px] p-5 rounded-md" key={index}>
                      <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-12 md:col-span-6">
                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Location:</label>
                        <p className="text-sm font-normal">
                          {item?.location || "--"}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Country:</label>
                        <p className="text-sm font-normal">
                          {item?.country || "--"}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">State:</label>
                        <p className="text-sm font-normal">
                          {item?.state || "--"}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">City:</label>
                        <p className="text-sm font-normal">
                          {item?.city || "--"}
                        </p>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Zip Code:</label>
                        <p className="text-sm font-normal">
                          {item?.zipCode || "--"}
                        </p>
                      </div>
                      </div>
                    </div>
                  })}
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Name:</label>
                    <p className="text-sm font-normal">
                      {data?.name || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Email:</label>
                    <p className="text-[13px] text-black bg-[#f5f5f5] min-h-[35px] rounded-md items-center px-3 py-2 leading-[18px]">
                      {data?.email || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Mobile Number:</label>
                    <p className="text-sm font-normal">
                      {data?.mobileNo ? `+${data?.mobileNo}` : "--"}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Amenities:</label>
                    <p className="text-[13px] flex flex-wrap gap-2 text-black capitalize min-h-[35px] rounded-md items-center capitalize py-2 leading-[18px]">
                      {data?.amenities?.map((item, index) => {
                        return <span key={index} className="bg-[#976DD0] p-2 rounded-lg text-white">{item?.title}</span>
                      })}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Website Link:</label>
                    <p className="text-sm font-normal">
                      {data?.website_link || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Instagram Link:</label>
                    <p className="text-sm font-normal">
                      {data?.instagram_link || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">FaceBook Link:</label>
                    <p className="text-sm font-normal">
                      {data?.facebook_link || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">TikTok Link:</label>
                    <p className="text-sm font-normal">
                      {data?.tiktok_link || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">YouTube Link:</label>
                    <p className="text-sm font-normal">
                      {data?.youtube_link || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Description:</label>
                    <p className="text-sm font-normal" dangerouslySetInnerHTML={{ __html: data?.description || "--" }}></p>
                  </div>
                  <div className="col-span-12 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Time Schedule:</label>
                    <p className="bg-white shadow-box px-3 rounded-md">
                      <table className="table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <tr>
                          <th className="px-2 py-3 cursor-pointer whitespace-nowrap">Weekly</th>
                          <th className="px-2 py-3 cursor-pointer whitespace-nowrap">Start Time</th>
                          <th className="px-2 py-3 cursor-pointer whitespace-nowrap">End Time</th>
                          <th className="px-2 py-3 cursor-pointer whitespace-nowrap">Best Time To Visit </th>
                        </tr>
                        {data?.time_schedule?.map((item, index) => {
                          return <tr key={index}>
                            <td className="px-2 py-4 whitespace-nowrap undefined capitalize">{item?.day}</td>
                            <td className="px-2 py-4 whitespace-nowrap undefined">
                              <p>{moment(item?.start_time).format("hh:mm A")}</p>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap undefined">
                              <p>{moment(item?.end_time).format("hh:mm A")}</p>
                            </td>
                            <td className="px-2 py-4 whitespace-nowrap undefined">
                              <p>{moment(item?.best_time_to_visit).format("hh:mm A")}</p>
                            </td>
                          </tr>
                        })}
                      </table>
                    </p>
                  </div>
                  {data?.images?.length > 0 ?
                    <div className="col-span-12 flex flex-col">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Venue Images:</label>
                      <div className="flex flex-wrap gap-3">
                        {data?.images?.map((item, index) => {
                          return <Tooltip position="top" title="Click to open">
                            <img src={methodModel.noImg(item)} onClick={e => { window.open(methodModel.noImg(item), "_blank") }} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain cursor-pointer" key={index} />
                          </Tooltip>
                        })}
                      </div>
                    </div>
                    : null}
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Menu Items Format:</label>
                    <p className="text-sm font-normal">
                      {data?.menu_item_format || "--"}
                    </p>
                  </div>
                  {data?.foodImages?.length > 0 && data?.menu_item_format === "upload" ?
                    <div className="col-span-12 flex flex-col">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Food Images:</label>
                      <div className="flex gap-3">
                        {data?.foodImages?.map((item, index) => {
                          return <Tooltip position="top" title="Click to open">
                            <img src={methodModel.noImg(item)} onClick={e => { window.open(methodModel.noImg(item), "_blank") }} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain cursor-pointer" key={index} />
                          </Tooltip>
                        })}
                      </div>
                    </div>
                    : null}
                  {data?.menu_item_format === "manual" && data?.foods?.length > 0 ?
                    <div className="col-span-12 flex flex-col">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Foods:</label>
                      <div className="grid grid-cols-12 gap-5 mt-3">
                        {data?.foods?.map((item, index) => {
                          return <span key={index} className="col-span-12 lg:col-span-6 shadow-box border border-[1px] rounded-md p-5">
                            <div className="grid grid-cols-12 gap-5 mb-3">
                              <div className="col-span-12 sm:col-span-6">
                                <labe>Item Name:</labe>
                                <p className="text-sm font-normal">{item?.item || "--"}</p>
                              </div>
                              <div className="col-span-12 sm:col-span-6">
                                <labe>Price:</labe>
                                <p className="text-sm font-normal">${item?.price || 0}</p>
                              </div>
                            </div>
                            {item?.image && <>
                              <labe>Image:</labe>
                              <Tooltip position="top" title="Click to open">
                                <img src={methodModel.noImg(item?.image)} onClick={e => { window.open(methodModel.noImg(item?.image), "_blank") }} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain cursor-pointer" />
                              </Tooltip>
                            </>
                            }
                          </span>
                        })}
                      </div>
                    </div>
                    : null}
                  {data?.menu_item_format === "manual" && data?.drinks?.length > 0 ?
                    <div className="col-span-12 flex flex-col">
                      <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Drinks:</label>
                      <div className="grid grid-cols-12 gap-5 mt-3">
                        {data?.drinks?.map((item, index) => {
                          return <span key={index} className="col-span-12 lg:col-span-6 shadow-box border border-[1px] rounded-md p-5">
                            <div className="grid grid-cols-12 gap-5 mb-3">
                              <div className="col-span-12 sm:col-span-6">
                                <labe>Item Name:</labe>
                                <p className="text-sm font-normal">{item?.item || "--"}</p>
                              </div>
                              <div className="col-span-12 sm:col-span-6">
                                <labe>Price:</labe>
                                <p className="text-sm font-normal">${item?.price || 0}</p>
                              </div>
                            </div>
                            {item?.image && <>
                              <labe>Image:</labe>
                              <Tooltip position="top" title="Click to open">
                                <img src={methodModel.noImg(item?.image)} onClick={e => { window.open(methodModel.noImg(item?.image), "_blank") }} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain cursor-pointer" />
                              </Tooltip>
                            </>
                            }
                          </span>
                        })}
                      </div>
                    </div>
                    : null}
                  <div className="col-span-12 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">Company EIN:</label>
                    <p className="text-sm font-normal">
                      {data?.company_ein || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 flex flex-col">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1">EIN Document:</label>
                    <p className="text-sm font-normal">
                      {data?.ein_image ?
                        <Tooltip position="top" title="Click To Open">
                          <IoDocument size={40} className="cursor-pointer" onClick={() => { window.open(methodModel.document(data?.ein_image), "_blank") }} />
                        </Tooltip>
                        :
                        <span>Document Not Uploaded</span>
                      }
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
