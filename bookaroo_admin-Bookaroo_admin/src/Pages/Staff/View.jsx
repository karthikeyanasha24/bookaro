import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import {
  rolePermission,
  rolePermissions,
  roleType,
} from "../../models/type.model";
import shared from "./shared";
import PhoneInput from "react-phone-input-2";
import { FaUserTie } from "react-icons/fa";

const View = () => {
  const user = useSelector((state) => state.user);
  const [form1, setForm1] = useState({ ...roleType });
  const [data, setData] = useState();
  const [questions, setQuestions] = useState([]);
  const permissions = rolePermissions;
  const permission = rolePermission;

  const history = useNavigate();
  const { id } = useParams();

  const getDetail = () => {
    loader(true);
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false);
      if (res.success) {
        setData(res.data);
        let value = res.data;
        let payload1 = form1;
        let permissions = value.permissions?.[0] || [];

        Object.keys(payload1).map((itm) => {
          if (itm != "permissions") payload1[itm] = value[itm];
        });

        Object.keys(roleType.permissions).map((itm) => {
          payload1.permissions[itm] = permissions[itm] || false;
        });

        setForm1({
          ...payload1,
        });

        Object.keys(payload1).map((itm) => {
          payload1[itm] = value[itm];
        });
      }
    });
  };

  useEffect(() => {
    getDetail();
  }, []);

  const isAllChecked = () => {
    let value = true;
    let permissions = form1.permissions;
    Object.keys(permissions).map((itm) => {
      if (!permissions[itm]) value = false;
    });
    return value;
  };

  const HandleAllRead = (check, key = "read") => {
    let value = check ? true : false;

    let keys = {};
    permissions.map((itm) => {
      keys = { ...keys, [`${key}${itm.key}`]: value };
    });

    setForm1({
      ...form1,
      permissions: {
        ...form1.permissions,
        ...keys,
      },
    });
  };
  const isAllPCheck = (key = "read") => {
    let value = true;
    permissions.map((itm) => {
      if (!form1.permissions[`${key}${itm.key}`]) value = false;
    });
    return value;
  };

  const handleAllPermission = (e) => {
    let key = e.name;
    let checked = e.checked;

    let keys = {};
    permission.map((itm) => {
      keys = { ...keys, [`${itm.key}${key}`]: checked };
    });

    setForm1({
      ...form1,
      permissions: {
        ...form1.permissions,
        ...keys,
      },
    });
  };

  const isCheckAll = (key) => {
    let value = true;
    permission.map((itm) => {
      if (!form1.permissions[`${itm.key}${key}`]) value = false;
    });
    return value;
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

          <div className="shadow-box overflow-hidden rounded-lg bg-white  gap-4 ">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                <div className=" me-3 bg-[#996dca21] p-3 rounded-md">
               
                  <FaUserTie className="text-[18px]"/>
                </div>
                Basic Information
              </h4>
            </div>
            <div className="grid grid-cols-12 p-4">
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <label className="font-medium text-md  text-[#676767] mb-1 block">
                  {" "}
                  Full Name
                </label>
                <div className="text-sm font-normal capitalize">
                  {" "}
                  {data && data.fullName.charAt(0)?.toUpperCase() + data.fullName.slice(1)}
                </div>
              </div>

              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <label className="font-medium text-md  text-[#676767] mb-1 block">
                  {" "}
                  Email
                </label>
                <div className="text-sm font-normal  ">
                  {" "}
                  {data && data.email}
                </div>
              </div>

              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <label className="font-medium text-md  text-[#676767] mb-1 block">
                  {" "}
                  Mobile No.
                </label>
                <div className="text-sm font-normal  ">
                {user?.mobileNo}
                </div>
              </div>

              {/* <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <label className="font-medium text-md  text-[#676767] mb-1 block">
                  {" "}
                  Role
                </label>
                <div className="text-sm font-normal  ">
                  {" "}
                  {data?.role || "--"}
                </div>
              </div> */}
            </div>
          </div>
          <div className="shadow-box overflow-hidden rounded-lg bg-white  gap-4 mt-8">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                <div className=" me-3 bg-[#996dca21] p-3 rounded-md">
                <FaUserTie className="text-[18px]"/>
                </div>
                Permissions
              </h4>
            </div>
            <table class="w-full disabled ">
              <thead class="table_head roleTable">
                <tr class="border-b border-[#EAECF0]">
                  <th
                    scope="col"
                    class="cursor-pointer text-[#82838B] !border-l-0 font-normal text-sm !border border-[#EAECF0] px-4 text-left bg-[#F7FAFF] !py-3 ' onClick={e => sorting('name')}"
                  ></th>
                  <th
                    scope="col"
                    class="cursor-pointer text-[#82838B] !border-l-0 font-normal text-sm !border border-[#EAECF0] px-4 text-left bg-[#F7FAFF] !py-3 ' onClick={e => sorting('name')}"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        // onChange={(e) => HandleAll(e.target.checked)}
                        checked={isAllChecked()}
                        className="h-4 w-4 me-2 "
                      />
                      <p> All</p>
                    </div>
                  </th>
                  {permission.map((itm) => {
                    return (
                      <>
                        <th
                          scope="col"
                          class="cursor-pointer text-[#82838B] !border-l-0 font-normal text-sm !border border-[#EAECF0] px-4 text-left bg-[#F7FAFF] !py-3 ' onClick={e => sorting('name')}"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 me-2"
                              onChange={(e) =>
                                HandleAllRead(e.target.checked, itm.key)
                              }
                              checked={isAllPCheck(itm.key)}
                            />
                            <p> {itm.name}</p>
                          </div>
                        </th>
                      </>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="roleTable">
                {permissions.map((itm) => {
                  return (
                    <>
                      <tr>
                        <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                          {itm.name}
                        </td>
                        <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                          {isCheckAll(itm.key) ?
                            <input
                              type="checkbox"
                              className="h-4 w-4 green_check cursor-pointer shrink-0 rounded-[4px] !border !border-[#3C3E49A3] !text-white"
                              name={itm.key}
                              onChange={(e) => handleAllPermission(e.target)}
                              checked={isCheckAll(itm.key)}
                            />
                            : '❌'}
                        </td>
                        {permission.map((pitm) => {
                          return (
                            <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                              <div Name="checkList">
                                <label className="mb-0">
                                  {form1.permissions[`${pitm.key}${itm.key}`] ?
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 green_check cursor-pointer shrink-0 rounded-[4px] !border !border-[#3C3E49A3] !text-white"
                                      checked={
                                        form1.permissions[`${pitm.key}${itm.key}`]
                                      }
                                    // onChange={(e) =>
                                    //   setpermission(
                                    //     `${pitm.key}${itm.key}`,
                                    //     e.target.checked
                                    //   )
                                    // }
                                    />
                                    : '❌'}
                                </label>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default View;
