import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { MdCategory } from "react-icons/md";

const View = () => {
  const [data, setData] = useState();
  const locationn = useLocation();
  const params = new URLSearchParams(locationn.search);
  const Form = params.get("Form");
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = () => {
    loader(true);
    let url = shared.detailApi
    if (Form == "Contact") {
      url = "contactTeam/detail"
    }
    ApiClient.get(url, { id: id }).then((res) => {
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
                {Form} Form Details
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                <div>
                  <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                    <div className=" me-3 bg-[#996dca21] p-3 rounded-md">
                      <MdCategory className="text-[18px]" />
                    </div>
                    {Form} Form Information
                  </h4>
                </div>
                {Form == "Contact" ?    <div className="grid grid-cols-12 p-4 gap-4">
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                       Name:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.name || "--"}
                    </p>
                  </div>
            
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Email:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.email}
                    </p>
                  </div>
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Source:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.type}
                    </p>
                  </div>
                  {data?.subSubject && <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Sub Title:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.subSubject || "--"}
                    </p>
                  </div>}
                  {data?.message &&      <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Message:
                    </label>
                    <p className="text-sm font-normal">
                      {data?.message || "--"}
                    </p>
                  </div>}
             
                </div>:  <div className="grid grid-cols-12 p-4 gap-4">
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      First Name:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.firstName || "--"}
                    </p>
                  </div>
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Last Name:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.lastName || "--"}
                    </p>
                  </div>
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Email:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.emailAddress}
                    </p>
                  </div>
                  {data?.phoneNumber && <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Phone Number:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.phoneNumber || "--"}
                    </p>
                  </div>}
                  {data?.categoryId?.CategoryName &&  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Category:
                    </label>
                    <p className="text-sm font-normal">
                      {data && data?.categoryId?.CategoryName || "--"}
                    </p>
                  </div>}
                 
                  <div className="lg:col-span-6 col-span-full flex flex-col">
                    <label className="font-medium text-md  text-[#676767] mb-1 block">
                      Status:
                    </label>
                    <p className="text-sm font-normal">
                      {data?.status == "active" ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>}
              
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default View;
