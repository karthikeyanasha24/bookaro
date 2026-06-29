import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormControl from "../../components/common/FormControl";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import {
  roleGetAllKeys,
  rolePermission,
  rolePermissions,
  roleType,
} from "../../models/type.model";
import shared from "./shared";
import { FaUserTie } from "react-icons/fa";

const AddEdit = () => {
  const { id } = useParams();
  const [images, setImages] = useState({ image: "" });
  const [form1, setForm1] = useState({ ...roleType });
  
  const permissions = rolePermissions;
  const permission = rolePermission;
  const [form, setform] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    role: "staff",
    loginPannel: "",
  });

  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);
  const inValidEmail = methodModel.emailvalidation(form?.email);
  const formValidation = [
    { key: "firstName", required: true },
    { key: "lastName", required: true },
    { key: "mobileNo", required: true },
    { key: "email", required: true, message: "Email is required", email: true },
    { key: "role", required: true },
  ];
  const roleOptions = [{ id: "staff", name: "staff" }];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);
    if (invalid) return;
    let method = "post";
    let url = shared.addApi;
    let value = {
      ...form,
      ...form1,
      id: id,
    };
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
      delete value.addedBy
      delete value.loginPannel
    }
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        history(`/${shared.url}`);
        setform({
          firstName: "",
          lastName: "",
          email: "",
          mobileNo: "",
          role: "staff",
          loginPannel: "",
        });
        setForm1({ ...roleType });

      }
      loader(false);
    });
  };
  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          let payload = form;
          let payload1 = form1;
          let permissions = value.permissions?.[0] || [];

          Object.keys(payload1).map((itm) => {
            if (itm != "permissions") payload1[itm] = value[itm];
          });

          Object.keys(roleType.permissions)
            // ?.filter((item) => item.key !== "staff")
            ?.map((itm) => {
              payload1.permissions[itm] = permissions[itm] || false;
            });

          payload.id = id;
          setForm1({
            ...payload1,
          });

          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });

          if (payload.role?._id) payload.role = payload.role._id;
          payload.id = id;
          setform({
            ...payload,
          });
          let img = images;
          Object.keys(img).map((itm) => {
            img[itm] = value[itm];
          });
          setImages({ ...img });
        }
        loader(false);
      });
    } else {
      setform({
        firstName: "",
        lastName: "",
        email: "",
        mobileNo: "",
        role: "staff",
        loginPannel: "",
      });
      setForm1({ ...roleType });
    }
  }, [id]);

  const setpermission = (key1, key2, value) => {
    let data = {
      ...form1.permissions, [key1 + key2]: value
    }
    if ((key1.startsWith("add") || key1.startsWith("edit") || key1.startsWith("delete")) && value) {
      data = {
        ...data, [`read${key2}`]: value
      }
    }
    setForm1({
      ...form1,
      permissions: data
    });
  }

  const HandleAll = (check) => {
    let value = check ? true : false;
    let permissions = form1.permissions;
    Object.keys(permissions).map((itm) => {
      permissions[itm] = value;
    });
    setForm1({ ...form1, permissions: permissions });
  };
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
    permissions
      // ?.filter((item) => item.key !== "staff")
      ?.map((itm) => {
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
  const specialCharRegex = /^[A-Za-z0-9 ]*$/;

  const handleNameValidation = (value, key) => {
    if (specialCharRegex.test(value) || value === '') {
      setform({ ...form, [key]: value });
    }
  }

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <Link
                to={`/${shared.url}`}
                className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
              >
                <i className="fa fa-angle-left text-lg"></i>
              </Link>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {form && form.id ? "Edit" : "Add"} {shared.addTitle}
              </h3>
              <p class="text-xs lg:text-sm font-normal text-[#75757A]">
                Here you can see all about your {shared.addTitle}
              </p>
            </div>
          </div>
          <div className="shadow-box rounded-lg bg-white  gap-4">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                <div className=" me-3 bg-[#996dca21] p-3 rounded-md">
                <FaUserTie className="text-[18px]"/>
                </div>
                Basic Information
              </h4>
            </div>
            <div className="grid grid-cols-12 p-4 gap-4">
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="first_name"
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => handleNameValidation(e, "firstName")}
                  required
                />
                 {submitted && !form.firstName && (
                  <div className="text-red-600 text-[13px] block">
                    First Name is required
                  </div>
                )}
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="last_name"
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) => handleNameValidation(e, "lastName")}
                  required
                />
                {submitted && !form.lastName && (
                  <div className="text-red-600 text-[13px] block">
                    Last Name is required
                  </div>
                )}
              </div>
              {/* {!id && (
                <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="select"
                  name="role"
                  label="Role"
                  value={form.role}
                  options={roleOptions}
                  onChange={(e) => {
                    setform({ ...form, role: e });
                  }}
                  required
                  theme="search"
                  disabled
                />
                {submitted && !form.role && (
                  <div className="text-red-600 text-[13px] block">
                    Role is required
                  </div>
                )}
              </div>
              )} */}
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="phone"
                  name="mobileNo"
                  label="Mobile No"
                  value={form.mobileNo}
                  onChange={(e) => setform({ ...form, mobileNo: e })}
                  required
                />
                {submitted && !form.mobileNo && (
                  <div className="text-red-600 text-[13px] block">
                    Mobile is required
                  </div>
                )}
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={(e) => setform({ ...form, email: e })}
                  required
                  disabled={id ? true : false}
                />
               
                {submitted  && (!form.email || !inValidEmail) && (
                  <div className="text-red-600 text-[13px] block">
                    Please enter {!form.email ? "":"valid"} email
                  </div>
                )}
              </div>
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
            <div className="scrollbar w-full overflow-auto">
              <div class="table_section tablepadding">
                <table class="w-full">
                  <thead class="table_head roleTable">
                    <tr class="border-b border-[#EAECF0]">
                      <th scope="col" class="cursor-pointer text-[#82838B] !border-l-0 font-normal text-sm !border border-[#EAECF0] px-4 text-left bg-[#F7FAFF] !py-3 ' onClick={e => sorting('name')}">
                      </th>
                      <th scope="col"
                        class="cursor-pointer text-[#82838B] !border-l-0 font-normal text-sm !border border-[#EAECF0] px-4 text-left bg-[#F7FAFF] !py-3 ' onClick={e => sorting('name')}"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            onChange={(e) => HandleAll(e.target.checked)}
                            checked={isAllChecked()}
                            className="h-4 w-4 me-2"
                          />
                          All
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
                                {itm.name}
                              </div>
                            </th>
                          </>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="roleTable">
                    {permissions
                      ?.filter((item) => item.key !== "staff")
                      ?.map((itm) => {
                        return (
                          <>
                            <tr>
                              <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                                {itm.name}
                              </td>
                              <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 green_check cursor-pointer shrink-0 rounded-[4px] !border !border-[#3C3E49A3] !text-white"
                                  name={itm.key}
                                  onChange={(e) =>
                                    handleAllPermission(e.target)
                                  }
                                  checked={isCheckAll(itm.key)}
                                />
                              </td>
                              {permission.map((pitm) => {
                                return (
                                  <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                                    <div Name="checkList">
                                      <label className="mb-0">
                                        <input
                                          type="checkbox"
                                          className="h-4 w-4 green_check cursor-pointer shrink-0 rounded-[4px] !border !border-[#3C3E49A3] !text-white"
                                          checked={
                                            form1.permissions[
                                            `${pitm.key}${itm.key}`
                                            ]
                                          }
                                          onChange={(e) =>
                                            setpermission(
                                              pitm.key,
                                              itm.key,
                                              e.target.checked
                                            )
                                          }
                                        />
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
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="text-white bg-[#EB6A59] bg-[#EB6A59] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5 mb-2"
            >
              Save
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;
