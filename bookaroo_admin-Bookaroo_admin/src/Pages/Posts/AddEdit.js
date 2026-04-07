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
import SelectDropdown from "../../components/common/SelectDropdown";
import { toast } from "react-toastify";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    title: "",
    description: "",
    image: [],
    video: [],
    link: "",
    venue_id: ""
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [venuesOption, setVenuesOption] = useState([])
  const formValidation = [
    { key: "title", required: true },
    { key: "venue_id", required: true },
    { key: "description", required: true },
  ]

  useEffect(() => {
    const venueId = methodModel.getPrams("venueId")
    if (venueId) {
      setform({ ...form, venue_id: venueId })
    }
    getVanues()
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          setform({
            title: res?.payload?.title || "",
            description: res?.payload?.description || "",
            image: res?.payload?.image || "",
            video: res?.payload?.video || "",
            link: res?.payload?.link || "",
            venue_id: res?.payload?.venue_id?._id || res?.payload?.venue_id?.id,
            id: res?.payload?.id || res?.payload?._id
          })
        }
        loader(false);
      });
    }
  }, [])

  const getVanues = () => {
    ApiClient.get(`user/listing?status=active&role=venue&sortBy=venue_name asc`).then(res => {
      if (res.success) {
        setVenuesOption(res?.data?.map((item) => {
          return ({ id: item?._id || item?.id, name: item?.venue_name })
        }))
      }
    })
  }

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
    let images = form?.image || []
    ApiClient.multiImageUpload('upload/multiple-images', filteredFiles, {}, "files").then(res => {
      if (res.success) {
        const data = res?.files?.map((item) => item?.fileName)
        images.push(...data)
        setform({ ...form, image: images })
      }
      loader(false)
    })
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
    let videos = form?.video || []
    loader(true)
    ApiClient.multiImageUpload('upload/multiple-videos', files, {}, "files").then(res => {
      if (res.success) {
        const data = res?.files?.map((item) => item?.fileName)
        videos.push(...data)
        setform({ ...form, video: videos })
      }
      loader(false)
    })
  }

  const handleDelete = (index, key) => {
    let data = [...form?.[key]]
    data.splice(index, 1)
    setform({ ...form, [key]: data })
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
                    name="title"
                    label="Title"
                    value={form?.title}
                    onChange={(e) => setform({ ...form, title: e })}
                    // placeholder="Enter Title"
                    required
                  />
                  {submitted && !form.title && (
                    <div className="d-block text-red-600">Title is required</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Venue <span className="text-red-600">*</span></label>
                  <SelectDropdown
                    id="statusDropdown"
                    displayValue="name"
                    className="mt-1 capitalize"
                    // placeholder="Select Venue"
                    theme="search"
                    intialValue={form?.venue_id}
                    result={(e) => setform({ ...form, venue_id: e?.value })}
                    options={venuesOption}
                    required
                  />
                  {submitted && !form.venue_id && (
                    <div className="d-block text-red-600">Venue is required</div>
                  )}
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="link"
                    label="Link"
                    value={form?.link}
                    onChange={(e) => setform({ ...form, link: e })}
                    // placeholder="Enter Link"
                  />
                </div>
              </div>
              <div className="mb-3">
                <FormControl
                  type="editor"
                  name="description"
                  label="Description"
                  value={form?.description}
                  onChange={(e) => setform((prev) => ({ ...prev, description: e }))}
                  required
                />
                {submitted && !form.description && (
                  <div className="d-block text-red-600">Description is required</div>
                )}
              </div>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Gallery</h2>
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
                      onChange={ImageUpload}
                    />
                    Upload Images
                  </label>
                  {form?.image?.length > 0 ?
                    <span className="flex flex-wrap gap-3">
                      {form?.image?.map((item, index) => {
                        return <div className="relative" key={index}>
                          <img src={methodModel.userImg(item)} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain" />
                          <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => handleDelete(index, "image")} size={25} />
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
                  {form?.video?.length > 0 ?
                    <span className="flex flex-wrap gap-3">
                      {form?.video?.map((item, index) => {
                        return <div className="relative mt-2 w-[200px] rounded-lg" key={index}>
                          <video width="320" height="240" controls>
                            <source src={methodModel.video(item)} type="video/mp4" />
                            <source src={methodModel.video(item)} type="video/ogg" />
                            Your browser does not support the video tag.
                          </video>
                          <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => handleDelete(index, "video")} size={25} />
                        </div>
                      })}
                    </span>
                    : null}
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
