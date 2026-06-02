import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormControl from "../../components/common/FormControl";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import shared from "./shared";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    role: shared?.role,
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const inValidEmail = methodModel.emailvalidation(form?.email);
  const formValidation = [
    { key: "firstName", required: true },
    { key: "lastName", required: true },
    { key: "email", required: true, message: "Email is required", email: true },
  ]

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          setform({
            accountType:"individual",
            firstName: res?.data?.firstName || "",
            lastName: res?.data?.lastName || "",
            // fullName: res?.data?.fullName || "",
            // lastName: res?.data?.lastName || "",
            email: res?.data?.email || "",
            mobileNo: res?.data?.mobileNo || "",
            image: res?.data?.image || "",
            role: res?.data?.role,
            id: res?.data?.id || res?.data?._id
          })
        }
        loader(false);
      });
    }
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);
    if (invalid) return;
    let method = "post";
    let url = shared.addApi;
    let value = { ...form }
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
    }
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        history(`/${shared.url}`);
      }
      loader(false);
    });
  }

  const ImageUpload = (e) => {
    let files = e.target.files
    let file = files.item(0)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']; // Add more image types if needed
    if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG and PNG images are allowed.");
        return;
    }
    loader(true)
    ApiClient.postFormData('upload/image', { file: file }).then(res => {
      if (res.success) {
        setform({ ...form, image: res?.fileName })
      }
      loader(false)
    })
  }
  const specialCharRegex = /^[A-Za-z0-9 ]*$/; 

  const handleNameValidation = (value,key) => {
    // const value = e;
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
                <Link to={`/${shared.url}`} className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3">
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
                  <FaUserLarge className="text-[18px]"/>
                </div>
                Individual User
              </h4>
            </div>
            <div className="grid grid-cols-12 p-4 gap-4">
               <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="firstName"
                  label="First Name"
                  value={form?.firstName}
                  onChange={(e) => handleNameValidation(e,"firstName")}
                  required
                />
                {submitted && !form.firstName && (
                  <div className="d-block text-red-600">First Name is required</div>
                )}
              </div>
               <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="lastName"
                  label="Last Name"
                  value={form?.lastName}
                  onChange={(e) => handleNameValidation(e,"lastName")}
                  required
                />
                {submitted && !form.lastName && (
                  <div className="d-block text-red-600">Last Name is required</div>
                )}
              </div>
               <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="email"
                  label="Email"
                  // placeholder="Enter Email"
                  className={id?"cursor-not-allowed":""}
                  value={form.email}
                  onChange={(e) => setform({ ...form, email: e })}
                  required
                  disabled={id ? true : false}
                />
                {form?.email && submitted && !inValidEmail && (
                  <div className="d-block text-red-600">Please enter valid email</div>
                )}
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="phone"
                  name="mobileNo"
                  label="Mobile Number"
                  value={form.mobileNo}
                  onChange={(e) => setform({ ...form, mobileNo: e })}
                />
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <label className="block mb-2">Image (JPG/PNG)</label>
                <div className="flex flex-col rounded-lg cursor-pointer gap-6 ">
                  {form?.image ? (
                    <>
                   <div className="flex flex-wrap gap-3 mt-3">
                   <div className="relative">
                          <img src={methodModel.userImg(form?.image)} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain" />
                          <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => setform({ ...form, image: "" })} size={25} />
                        </div>
                        </div>
                    </>
                  ) : (
                    <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2 border-2 border-dashed border-gray-200 `} style={{ gap: '8px' }}>
                      <FiPlus />
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={ImageUpload}
                      />
                      Upload Image
                    </label>
                  )}
                </div>
              </div>
            </div>
           
           
          </div>
          <div className="text-right mt-8">
              <button type="submit" className="text-white bg-[#976DD0] bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
                {form && form?.id ? "Update" : "Save"}
              </button>
            </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;
