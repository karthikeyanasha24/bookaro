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
import ReactGoogleAutocomplete from "react-google-autocomplete";
import environment from "../../environment";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GrSubtractCircle } from "react-icons/gr";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    image: "",
    role: shared?.role,
    short_description: "",
    description: "",
    images: [],
    videos: [],
    location: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    skills: [""],
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
            id: res?.data?.id || res?.data?._id,
            short_description: res?.data?.short_description || "",
            description: res?.data?.description || "",
            images: res?.data?.images || [],
            videos: res?.data?.videos || [],
            location: res?.data?.location || "",
            country: res?.data?.country || "",
            state: res?.data?.state || "",
            city: res?.data?.city || "",
            zipCode: res?.data?.zipCode || "",
            skills: res?.data?.skills || [""],
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

  const handleLocation = (place) => {
    const addressComponents = place?.address_components;
    const address = {};

    for (let i = 0; i < addressComponents?.length; i++) {
      const component = addressComponents[i];
      const types = component.types;
      if (types.includes('country')) {
        address.country = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        address.state = component.long_name;
      }
      if (types.includes('locality')) {
        address.city = component.long_name;
      }
      if (types.includes('postal_code')) {
        address.zipCode = component.long_name;
      }
    }

    address.location = place?.formatted_address
    address.coordinates = {
      type: "Point",
      coordinates: [place.geometry.location.lng(), place.geometry.location.lat()]
    }
    setform((prev) => ({ ...prev, ...address }))
  }

  const ImagesUpload = (e, key) => {
    let files = Array.from(e.target.files);
    const acceptedTypes = ['image/jpeg', 'image/png']; // Add more image types if needed
    const filteredFiles = files.filter(file => acceptedTypes.includes(file.type));
    let invalidFiles = files.filter(file => !acceptedTypes.includes(file.type));
    if (invalidFiles.length > 0 && files?.length > 1) {
      toast.error('Some files are not valid format and will be ignored.Only JPG and PNG images are allowed.');
    }
    if (filteredFiles.length !== files.length && files?.length === 1) {
      toast.error('Only JPG and PNG images are allowed.');
    }
    if (filteredFiles?.length === 0) {
      return;
    }
    loader(true)
    let images = form?.[key] || []
    ApiClient.multiImageUpload('upload/multiple-images', filteredFiles, {}, "files").then(res => {
      if (res.success) {
        const data = res?.files?.map((item) => item?.fileName)
        images.push(...data)
        setform({ ...form, [key]: images })
      }
      loader(false)
    })
  }
  const handleImageDelete = (index, key) => {
    const data = [...form?.[key]]
    data.splice(index, 1)
    setform({ ...form, [key]: data })
  }

  const videoUpload = (e) => {
    const acceptedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']; // Add more video types if needed
    let files = Array.from(e.target.files);
    // Filter out non-video files
    let validFiles = files.filter(file => acceptedVideoTypes.includes(file.type));
    let invalidFiles = files.filter(file => !acceptedVideoTypes.includes(file.type));
    if (invalidFiles.length > 0 && files?.length > 1) {
      toast.error('Some files are not videos and will be ignored.');
    }
    if (invalidFiles.length > 0 && files?.length === 1) {
      toast.error('Upload valid videos only mp4, webm and ogg formats allowed.');
    }
    if (validFiles.length === 0) {
      return;
    }
    let video = form?.videos || []
    loader(true)
    ApiClient.multiImageUpload('upload/multiple-videos', files, {}, "files").then(res => {
      if (res.success) {
        const data = res?.files?.map((item) => item?.fileName)
        video.push(...data)
        setform({ ...form, videos: video })
      }
      loader(false)
    })
  }
  const handleDelete = (index, key) => {
    let data = [...form?.[key]]
    data.splice(index, 1)
    setform({ ...form, [key]: data })
  }

  const handleAddMore = () => {
    const data = [...form?.skills, [""]]
    setform({ ...form, skills: data })
  }
  const handleRemoveAddMore = (index) => {
    const data = form?.skills?.filter((item, i) => i !== index)
    setform((prev) => ({ ...prev, skills: data }))
  }
  const handleAddMoreInput = (value, index) => {
    let data = [...form?.skills]
    data[index] = value
    setform({ ...form, skills: data })
  }

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="">
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
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Info</h2>
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
                    className={id ? "cursor-not-allowed" : ""}
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
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">About</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="mb-3">
                  <FormControl
                    type="editor"
                    name="short_description"
                    label="Short Description"
                    value={form?.short_description}
                    onChange={(e) => setform((prev) => ({ ...prev, short_description: e }))}
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="editor"
                    name="description"
                    label="Long Description"
                    value={form?.description}
                    onChange={(e) => setform((prev) => ({ ...prev, description: e }))}
                  />
                </div>
              </div>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Media</h2>
              <div className="mb-3">
                <label>Images (JPG/PNG)</label>
                <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto">
                  <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 border-2 border-dashed border-gray-200 sm:max-w-[200px]`} style={{ gap: '8px' }}>
                    <FiPlus />
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={e => ImagesUpload(e, "images")}
                    />
                    Upload Images
                  </label>
                  {form?.images?.length > 0 ?
                    <span className="flex flex-wrap gap-3">
                      {form?.images?.map((item, index) => {
                        return <div className="relative" key={index}>
                          <img src={methodModel.userImg(item)} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain" />
                          <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => handleImageDelete(index, "images")} size={25} />
                        </div>
                      })}
                    </span> : null
                  }
                </div>
              </div>
              <div className="mb-3">
                <label>Videos</label>
                <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto">
                  <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 border-2 border-dashed border-gray-200 sm:max-w-[200px]`} style={{ gap: '8px' }}>
                    <FiPlus />
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="video/*"
                      multiple
                      onChange={videoUpload}
                    />
                    Upload Videos
                  </label>
                  {form?.videos?.length > 0 ?
                    <span className="flex flex-wrap gap-3">
                      {form?.videos?.map((item, index) => {
                        return <div className="relative mt-2 mr-4 " key={index}>
                          <video width="320" height="240" controls className="w-[200px] rounded-lg">
                            <source src={methodModel.video(item)} type="video/mp4" />
                            <source src={methodModel.video(item)} type="video/ogg" />
                            Your browser does not support the video tag.
                          </video>
                          <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => handleDelete(index, "videos")} size={25} />
                        </div>
                      })}
                    </span>
                    : null}
                </div>
              </div>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Address</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label>Location <span className="text-red-600">*</span></label>
                  <ReactGoogleAutocomplete
                    apiKey={environment?.map_api_key}
                    onPlaceSelected={(place) => { handleLocation(place) }}
                    onChange={e => setform({ ...form, location: e.target.value })}
                    value={form?.location}
                    types={['(regions)']}
                    key="hostAddress"
                    // placeholder="Enter Location"
                    required
                    className="bg-white w-full rounded-lg h-11 overflow-hidden px-2 mt-1 border border-[#00000036]"
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="country"
                    label="Country"
                    // placeholder="Enter country"
                    autoComplete="one-time-code"
                    value={form?.country}
                    onChange={(e) => setform({ ...form, country: e })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="state"
                    label="State"
                    // placeholder="Enter State"
                    autoComplete="one-time-code"
                    value={form?.state}
                    onChange={(e) => setform({ ...form, state: e })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="city"
                    label="City"
                    // placeholder="Enter City"
                    autoComplete="one-time-code"
                    value={form?.city}
                    onChange={(e) => setform({ ...form, city: e })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="zipCode"
                    label="Zip Code"
                    // placeholder="Enter Zip Code"
                    autoComplete="one-time-code"
                    value={form?.zipCode}
                    onChange={(e) => setform({ ...form, zipCode: e })}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Skills</h2>
              <div className="grid grid-cols-12 gap-4">
                {form?.skills?.map((item, index) => {
                  return <div className="col-span-12 md:col-span-6 lg:col-span-4 flex gap-4 mb-3">
                    <FormControl
                      type="text"
                      name="skills"
                      // placeholder="Enter Skills"
                      autoComplete="one-time-code"
                      value={item}
                      onChange={(e) => handleAddMoreInput(e, index)}
                    />
                    {form?.skills?.length > 1 &&
                      <div className="bg-red-600 p-3 text-white rounded-lg cursor-pointer h-fit" onClick={e => handleRemoveAddMore(index)}><GrSubtractCircle size={20} /></div>
                    }
                  </div>
                })}
              </div>
              <div className="col-span-12 flex justify-end">
                <div className="bg-primary p-3 text-white rounded-lg cursor-pointer w-fit" onClick={e => handleAddMore()}>
                  <IoMdAddCircleOutline size={20} />
                </div>
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