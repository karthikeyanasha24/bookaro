import { Tooltip } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaBlogger } from "react-icons/fa";
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
import SelectDropdown from "../../components/common/SelectDropdown";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";

const AddEdit = () => {
  const { id } = useParams();

  const quillRef = useRef();
  const user = useSelector((state) => state.user);
  const [form, setform] = useState({
    title: "",
    banner: "",
    description: "",
    metaTitle: "",
    // metaDescription: "",
    subCategoryId: "",
    categoryId: "",
    images: [],
    blogOwner: user?.id || user?._id,
  });
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [users, setUsers] = useState([]);
  const [categoryTypeOptions, setcategoryTypeOptions] = useState([])
  const [subcategoryOption, setsubcateoryOption] = useState([])
  const formValidation = [
    { key: "title", required: true },
    { key: "description", required: true },
    { key: "images", required: true },
    { key: "subCategoryId", required: true },
    { key: "categoryId", required: true },
  ]

  function removeHTMLTags(html) {
    if (!html) return false;

    const text = html.replace(/<\/?[^>]+(>|$)/g, "").trim(); // Remove all tags
    const hasText = text.length > 0;

    const hasImage = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i.test(html);

    return hasText || hasImage;
  }

  const getUserData = (p = {}) => {
    ApiClient.get(`user/listing`, { role: "user" }).then((res) => {
      if (res.success) {
        const mapped = res?.data?.map((item) => ({
          id: item.id || item?._id,
          name: item.fullName,
        }));
        setUsers(mapped)
      }
    });
  };

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          const data = res.data;
          const imageData = data.images?.map(item => item) || [];
          const editor = quillRef.current?.getEditor();

          if (editor && data.description) {
            editor.clipboard.dangerouslyPasteHTML(data.description);
          }

          setform({
            title: data?.title || "",
            banner: data?.banner || "",
            blogOwner: data?.blogOwner?.id || data?.blogOwner?._id,
            id: data?.id || data?._id,
            description: data?.description || "",
            metaTitle: data?.metaTitle || "",
            categoryId: data?.categoryId?.id || data?.categoryId?._id || "",
            duration: data?.duration,
            subCategoryId: data?.subCategoryId?.id || data?.subCategoryId?._id || "",
            images: imageData
          });

          // Fetch subcategories
          getSubCategory(data?.categoryId?.id || data?.categoryId?._id);
        }
        loader(false);
      });
    }

    getUserData();
  }, [id]);


  useEffect(() => {
    getCategory()
    getUserData()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!removeHTMLTags(form?.description)) {
      return
    }
    let invalid = methodModel.getFormError(formValidation, form) || form.images?.length === 0;
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
        navigate(`/${shared.url}`);
      }
      loader(false);
    });
  }

  const getCategory = (p = {}) => {
    ApiClient.get("blogCategories/list").then((res) => {
      if (res.success) {
        const data = res?.data?.map((item) => ({
          id: item?.id || item?._id,
          name: item?.CategoryName,
        }));
        setcategoryTypeOptions(data);
      }
    });
  };
  const getSubCategory = (category) => {
    ApiClient.get("blogCategories/subCategory/list", { categoryId: category }).then((res) => {
      if (res.success) {
        const data = res?.data?.map((item) => ({
          id: item?.id || item?._id,
          name: item?.SubCategoryName,
        }));
        setsubcateoryOption(data);
      }
    });
  };
  const MultiUpload = (e) => {
    let files = e.target.files;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      let file = files.item(i);
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Only JPG and PNG images are allowed for file: ${file.name}`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    loader(true)

    ApiClient.multiImageUpload('upload/multiple-images', validFiles, '', 'files').then(res => {
      if (res.success) {
        let data = res.files.map(item => item.fileName);

        setform({ ...form, images: data });
      }



      loader(false); // Hide loader
    }).catch(err => {
      loader(false); // Hide loader on error
      toast.error("An error occurred during the upload.");
      console.error(err);
    });
  };


  const SingleImageUpload = async (files) => {
    let file = files.item(0);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed.");
      return null;
    }

    loader(true);

    try {
      const res = await ApiClient.postFormData('upload/image', { file: file });
      if (res.success) {
        return res;
      } else {
        toast.error("Image upload failed.");
        return null;
      }
    } catch (err) {
      toast.error("Image upload error.");
      console.error(err);
      return null;
    } finally {
      loader(false);
    }
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      loader(true);

      const imageUrl = await SingleImageUpload(input.files);
      let fileUrl = methodModel?.userImg(imageUrl?.fileName)
      try {
        if (imageUrl && fileUrl) {
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection(true);
          quill.insertEmbed(range.index, "image", fileUrl);
          quill.setSelection(range.index + 1);
        }
      } catch (err) {
        toast.error("An error occurred during image upload.");
        console.error(err);
      } finally {
        loader(false);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }], // ✅ Add this line
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);


  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background", // ✅ Add these formats
    "list", "bullet",
    "link", "image",
  ];

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
          <div className="shadow-box overflow-hidden rounded-lg bg-white  gap-4">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                <div className=" me-3 bg-[#996dca21] p-3 rounded-md">

                  <FaBlogger className="text-[18px]" />
                </div>
                Basic Information
              </h4>
            </div>

            <div className="grid grid-cols-12 p-4 gap-4">
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="title"
                  label="Title"
                  // placeholder="Enter Title"
                  value={form?.title}
                  onChange={(e) => setform({ ...form, title: e })}
                  required
                />
                {submitted && !form.title && (
                  <div className="d-block text-red-600">Title is required</div>
                )}
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="metaTitle"
                  label="Meta Title"
                  // placeholder="Enter Meta Title"
                  value={form?.metaTitle}
                  onChange={(e) => setform({ ...form, metaTitle: e })}

                />

              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="select"
                  name="name"
                  label="Category"
                  value={form.categoryId}
                  options={categoryTypeOptions}
                  onChange={(e) => {
                    setform({ ...form, categoryId: e });
                    getSubCategory(e)
                  }}
                  required
                  theme="search"
                />

                {submitted && !form.categoryId && (
                  <div className="text-red-600 text-[13px] block">
                    category is required
                  </div>
                )}
              </div>
              {form?.categoryId && <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="select"
                  name="name"
                  label="Sub Category"
                  value={form.subCategoryId}
                  options={subcategoryOption}
                  onChange={(e) => {
                    setform({ ...form, subCategoryId: e });
                  }}
                  required
                  theme="search"
                />

                {submitted && !form.subCategoryId && (
                  <div className="text-red-600 text-[13px] block">
                    cSub category is required
                  </div>
                )}
              </div>}
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <span className="text-[14px] mb-2 inline-block">Blog Owner <span className="star">*</span></span>
                <SelectDropdown
                  id="statusDropdown"
                  displayValue="name"
                  placeholder="Blog Owner"
                  className="capitalize w-full"
                  theme="search"
                  isClearable={false}
                  intialValue={form?.blogOwner}
                  result={(e) => {
                    setform({ ...form, blogOwner: e.value });
                  }}
                  options={[
                    { id: user?.id || user?._id, name: user?.fullName },
                    ...users,
                  ]}
                  required
                />
              </div>{" "}
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="duration"
                  label="Duration"
                  // placeholder="Enter Meta Title"
                  value={form?.duration}
                  onChange={(e) => setform({ ...form, duration: e })}

                />

                {submitted && !form.categoryId && (
                  <div className="text-red-600 text-[13px] block">
                    category is required
                  </div>
                )}
              </div>
              <div className=" col-span-12 flex  mb-5  flex-col ">
                <span className="text-[14px] mb-2 inline-block">Description</span>
                {/* <ReactQuill
                  ref={quillRef}
                  value={form?.description}
                  onChange={(e) => setform((prev) => ({ ...prev, description: e }))}
                  modules={modules}
                  theme="snow"
                /> */}
                <ReactQuill
                  ref={quillRef}
                  value={form?.description}
                  onChange={(e) => setform((prev) => ({ ...prev, description: e }))}
                  modules={modules}
                  formats={formats} // ✅ Include this
                  theme="snow"
                />
                {submitted && !removeHTMLTags(form?.description) && (
                  <div className="d-block text-red-600">Description is required</div>
                )}

              </div>

              {/* <div className=" col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="editor"
                  name="metaDescription"
                  label="Meta Description"
                  // placeholder="Enter Meta Description"
                  value={form?.metaDescription}
                  onChange={(e) => setform((prev) => ({ ...prev, metaDescription: e }))}
                />

              </div> */}

              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <label className="mb-2 block">Images (JPG/PNG)</label>

                <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto">
                  {form?.images && form.images.length > 0 ? (
                    <>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {form.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={methodModel.userImg(image)}
                              className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain"
                              alt={`Uploaded thumbnail ${index}`}
                            />
                            <IoCloseOutline
                              className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]"
                              onClick={() => {
                                // Remove the clicked image from the array
                                setform(prevForm => ({
                                  ...prevForm,
                                  images: prevForm.images.filter((_, i) => i !== index)
                                }));
                              }}
                              size={25}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 border-2 border-dashed border-gray-200 w-full`} style={{ gap: '8px' }}>
                      <FiPlus />
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={MultiUpload}
                      />
                      Upload images
                    </label>
                  )}
                </div>
                {submitted && form.images.length === 0 && (
                  <div className="d-block text-red-600">Images is required</div>
                )}

                {/* {submitted && !form.image && (
                  <div className="d-block text-red-600">Banner is required</div>
                )} */}
              </div>
              {/* <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <label className="mb-2 block">Banner (JPG/PNG) <span className="text-red-600">*</span></label>
                <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto">
                  {form?.banner ? (
                    <>
                      <div className="flex flex-wrap gap-3 mt-3">
                        <div className="relative">
                          <img src={methodModel.userImg(form?.banner)} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain" />
                          <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => setform({ ...form, banner: "" })} size={25} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 border-2 border-dashed border-gray-200 w-full`} style={{ gap: '8px' }}>
                      <FiPlus />
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={ImageUpload}
                      />
                      Upload Banner
                    </label>
                  )}
                </div>
                {submitted && !form.banner && (
                  <div className="d-block text-red-600">Banner is required</div>
                )}
              </div> */}
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
