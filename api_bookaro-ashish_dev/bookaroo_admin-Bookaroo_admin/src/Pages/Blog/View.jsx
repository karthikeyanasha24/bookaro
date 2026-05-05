import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import methodModel from "../../methods/methods";
import { FaLocationDot } from "react-icons/fa6";
import { FaBlogger } from "react-icons/fa";

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
        <div className="wrapper_section">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                  <div className=" me-3 bg-[#996dca21] p-3 rounded-md">
                    <FaBlogger className="text-[18px]" />
                  </div>
                  Basic Information
                </h4>

                <div className="grid grid-cols-12 gap-5 p-4">
                  {data?.title && <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Title
                    </label>
                    <p className="text-md font-normal">{data && data?.title}</p>
                  </div>}
                  {data?.categoryId?.CategoryName && <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Category
                    </label>
                    <p className="text-md font-normal">
                      {data && data?.categoryId?.CategoryName}
                    </p>
                  </div>}
                  {data?.subCategoryId?.SubCategoryName && <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Likes
                    </label>
                    <p className="text-md font-normal">
                      {data && data?.contentLikeCount || 0}
                    </p>
                  </div>}
                  {data?.contentDislikeCount && <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Dislikes
                    </label>
                    <p className="text-md font-normal">
                      {data && data?.contentDislikeCount || 0}
                    </p>
                  </div>}

                  <div className="lg:col-span-6 col-span-12 flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Status
                    </label>
                    <p className="text-md font-normal">
                      {data?.status == "active" ? "Active" : "Inactive"}
                    </p>
                  </div>
                  {data?.description && <div className="col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      description
                    </label>
                    <p
                      className="text-md font-normal"
                      dangerouslySetInnerHTML={{ __html: data?.description }}
                    ></p>
                  </div>}
                  {data?.metaDescription &&   <div className="col-span-12 flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Meta Description
                    </label>
                    <p
                      className="text-md font-normal"
                      dangerouslySetInnerHTML={{
                        __html: data?.metaDescription,
                      }}
                    ></p>
                  </div>}
                  {data?.images && data.images.length>0 &&   <div className="col-span-12 flex flex-col">
                    <label className="font-medium text-md text-[#676767] mb-1 block">
                      Images
                    </label>
                    <div className="flex flex-wrap">
                      {data?.images && data.images.length > 0 && (
                        data.images.map((images, index) => (
                          <Tooltip
                            key={index}
                            position="top"
                            title="Click to open"
                          >
                            <img
                              src={methodModel.noImg(images || "")}
                              className="bg-white thumbnail !w-[100px] h-[100px] mb-2 rounded-lg shadow-lg border-[2px] border-white p-2 object-contain cursor-pointer me-2"
                              onClick={() => {
                                window.open(
                                  methodModel.noImg(images),
                                  "_blank"
                                );
                              }}
                            />
                          </Tooltip>
                        ))
                      )
                        // : (
                        //   <div className="text-gray-500 text-[14px]">
                        //     No Images uploaded.
                        //   </div>
                        // )
                      }
                    </div>
                  </div>}
                  {data?.banner &&  <div className="col-span-12 flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Banner
                    </label>
                    <div className="flex flex-wrap  ">
                      <Tooltip position="top" title="Click to open">
                        <img
                          src={methodModel.noImg(data?.banner || "")}
                          className="bg-white thumbnail !w-[100px] h-full rounded-lg shadow-lg border-[2px] border-white p-2 object-contain cursor-pointer"
                          onClick={() => {
                            window.open(
                              methodModel.noImg(data?.banner),
                              "_blank"
                            );
                          }}
                        />
                      </Tooltip>
                    </div>
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
