import { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import shared from "./shared";
import { IoCloseOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

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
            firstName: res?.data?.firstName || "",
            lastName: res?.data?.lastName || "",
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

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="pprofile1">
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
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="mb-3">
                <FormControl
                  type="text"
                  name="firstName"
                  label="First Name"
                  // placeholder="Enter First Name"
                  value={form?.firstName}
                  onChange={(e) => setform({ ...form, firstName: e })}
                  required
                />
                {submitted && !form.firstName && (
                  <div className="d-block text-red-600">First Name is required</div>
                )}
              </div>
              <div className="mb-3">
                <FormControl
                  type="text"
                  name="lastName"
                  label="Last Name"
                  // placeholder="Enter Last Name"
                  value={form?.lastName}
                  onChange={(e) => setform({ ...form, lastName: e })}
                  required
                />
                {submitted && !form.lastName && (
                  <div className="d-block text-red-600">Last Name is required</div>
                )}
              </div>
              <div className="mb-3">
                <FormControl
                  type="text"
                  name="email"
                  label="Email"
                  // placeholder="Enter Email"
                  value={form.email}
                  onChange={(e) => setform({ ...form, email: e })}
                  className={id?"cursor-not-allowed":""}
                  required
                  disabled={id ? true : false}
                />
                {form?.email && submitted && !inValidEmail && (
                  <div className="d-block text-red-600">Please enter valid email</div>
                )}
              </div>
              <div className="mobile_number mb-3">
                <FormControl
                  type="phone"
                  name="mobileNo"
                  label="Mobile Number"
                  value={form.mobileNo}
                  onChange={(e) => setform({ ...form, mobileNo: e })}
                />
              </div>
            </div>
            <div className="mb-3">
                <label>Image (JPG/PNG)</label>
                <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto">
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
                    <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 border-2 border-dashed border-gray-200 sm:max-w-[200px]`} style={{ gap: '8px' }}>
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
            <div className="text-right">
              <button type="submit" className="text-white bg-[#976DD0] bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
                {form && form?.id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;
