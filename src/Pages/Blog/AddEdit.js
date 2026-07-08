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
  const [allTopics, setAllTopics] = useState([])
  const [unsplashOpen, setUnsplashOpen] = useState(false);
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashResults, setUnsplashResults] = useState([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const unsplashTimerRef = useRef(null);
  const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
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

          // categoryId / subCategoryId can be raw ObjectId strings (from aggregate)
          // or populated objects – handle both cases
          const personaId = data?.personaData?.id || data?.personaData?._id
            || data?.categoryId?.id || data?.categoryId?._id
            || (typeof data?.categoryId === "string" ? data.categoryId : "");
          const topicId = data?.topicData?.id || data?.topicData?._id
            || data?.subCategoryId?.id || data?.subCategoryId?._id
            || (typeof data?.subCategoryId === "string" ? data.subCategoryId : "");

          setform({
            title: data?.title || "",
            banner: data?.banner || "",
            blogOwner: data?.blogOwner?.id || data?.blogOwner?._id,
            id: data?.id || data?._id,
            description: data?.description || "",
            metaTitle: data?.metaTitle || "",
            categoryId: personaId,
            duration: data?.duration,
            subCategoryId: topicId,
            images: imageData
          });

          // Fetch subcategories filtered by persona
          getSubCategory(personaId);
        }
        loader(false);
      });
    }

    getUserData();
  }, [id]);


  useEffect(() => {
    getCategory()
    getUserData()
    // Preload all topics
    ApiClient.get("trainingTopic/list").then((res) => {
      if (res.success) {
        const data = res?.data?.map((item) => ({
          id: item?.id || item?._id,
          name: item?.name,
          personaId: item?.persona?.id || item?.persona?._id || null,
        }));
        setAllTopics(data);
      }
    });
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
    ApiClient.get("persona/list").then((res) => {
      if (res.success) {
        const data = res?.data?.map((item) => ({
          id: item?.id || item?._id,
          name: item?.name,
        }));
        setcategoryTypeOptions(data);
      }
    });
  };
  const getSubCategory = (personaId) => {
    if (!personaId) {
      setsubcateoryOption([]);
      return;
    }
    if (allTopics.length > 0) {
      const filtered = allTopics.filter(t => t.personaId === personaId);
      setsubcateoryOption(filtered);
    } else {
      ApiClient.get("trainingTopic/list").then((res) => {
        if (res.success) {
          const data = res?.data?.map((item) => ({
            id: item?.id || item?._id,
            name: item?.name,
            personaId: item?.persona?.id || item?.persona?._id || null,
          }));
          setAllTopics(data);
          const filtered = data.filter(t => t.personaId === personaId);
          setsubcateoryOption(filtered);
        }
      });
    }
  };

  const searchUnsplash = (q) => {
    if (!q.trim() || !UNSPLASH_KEY) { setUnsplashResults([]); return; }
    setUnsplashLoading(true);
    fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=21&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
      .then(r => r.json())
      .then(data => { setUnsplashResults(data.results || []); setUnsplashLoading(false); })
      .catch(() => setUnsplashLoading(false));
  };

  const handleUnsplashQueryChange = (e) => {
    const q = e.target.value;
    setUnsplashQuery(q);
    clearTimeout(unsplashTimerRef.current);
    unsplashTimerRef.current = setTimeout(() => searchUnsplash(q), 500);
  };

  const openUnsplash = () => {
    setUnsplashOpen(true);
    const defaultQ = 'real estate architecture';
    setUnsplashQuery(defaultQ);
    searchUnsplash(defaultQ);
  };

  const selectUnsplashPhoto = (photo) => {
    // Guideline: trigger a download when user selects an image
    fetch(`${photo.links.download_location}&client_id=${UNSPLASH_KEY}`).catch(() => {});
    // Guideline: hotlink the URL from photo.urls (do not re-upload)
    setform(prev => ({ ...prev, images: [...prev.images, photo.urls.regular] }));
    setUnsplashOpen(false);
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
                  name="title_fr"
                  label="Titre (FR)"
                  value={form?.title_fr}
                  onChange={(e) => setform({ ...form, title_fr: e })}
                />
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
                  label="Persona"
                  value={form.categoryId}
                  options={categoryTypeOptions}
                  onChange={(e) => {
                    setform({ ...form, categoryId: e, subCategoryId: '' });
                    getSubCategory(e)
                  }}
                  required
                  theme="search"
                />

                {submitted && !form.categoryId && (
                  <div className="text-red-600 text-[13px] block">
                    Persona is required
                  </div>
                )}
              </div>
              {form?.categoryId && <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="select"
                  name="name"
                  label="Training Topics"
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
                    Training Topic is required
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
              <div className=" col-span-12 flex  mb-5  flex-col ">
                <span className="text-[14px] mb-2 inline-block">Description (FR) <span className="text-gray-400 text-xs">— optionnel</span></span>
                <ReactQuill
                  value={form?.description_fr || ''}
                  onChange={(e) => setform((prev) => ({ ...prev, description_fr: e }))}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                />
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

                <div className="flex flex-col rounded-lg gap-3 max-sm:mx-auto">
                  {form?.images && form.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-1">
                      {form.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image && image.startsWith('http') ? image : methodModel.userImg(image)}
                            className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-cover"
                            alt={`Thumbnail ${index}`}
                          />
                          <IoCloseOutline
                            className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]"
                            onClick={() => setform(prevForm => ({ ...prevForm, images: prevForm.images.filter((_, i) => i !== index) }))}
                            size={25}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: '#fff', border: '2px dashed #d1d5db', borderRadius: 8, padding: '8px 14px', fontSize: '0.85rem', fontWeight: 500, color: '#374151', transition: 'border-color 0.2s' }}>
                      <FiPlus size={14} />
                      <input id="dropzone-file" type="file" className="hidden" multiple onChange={MultiUpload} />
                      Importer
                    </label>
                    <button
                      type="button"
                      onClick={openUnsplash}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, border: '2px dashed #976DD0', borderRadius: 8, padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600, color: '#976DD0', background: '#faf5ff', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z"/></svg>
                      Parcourir Unsplash
                    </button>
                  </div>
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

        {/* ── Unsplash Image Picker Modal ── */}
        {unsplashOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={() => setUnsplashOpen(false)}
          >
            <div
              style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 880, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#111"><path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z"/></svg>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>Choisir une image Unsplash</span>
                </div>
                <button type="button" onClick={() => setUnsplashOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 1 }}>
                  <IoCloseOutline size={24} color="#6b7280" />
                </button>
              </div>

              {/* Search */}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6' }}>
                <input
                  type="text"
                  value={unsplashQuery}
                  onChange={handleUnsplashQueryChange}
                  placeholder="Rechercher... (ex: appartement, maison, immobilier)"
                  autoFocus
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Results */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                {unsplashLoading ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: '0.9rem' }}>Chargement...</div>
                ) : unsplashResults.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#d1d5db' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="#e5e7eb" style={{ marginBottom: 12 }}><path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z"/></svg>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Tapez un mot-clé pour rechercher des images</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {unsplashResults.map(photo => (
                      <div
                        key={photo.id}
                        onClick={() => selectUnsplashPhoto(photo)}
                        onMouseEnter={e => { e.currentTarget.querySelector('.u-overlay').style.opacity = '1'; }}
                        onMouseLeave={e => { e.currentTarget.querySelector('.u-overlay').style.opacity = '0'; }}
                        style={{ position: 'relative', cursor: 'pointer', borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9', background: photo.color || '#f3f4f6' }}
                      >
                        <img
                          src={photo.urls.small}
                          alt={photo.alt_description || ''}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {/* Hover overlay */}
                        <div
                          className="u-overlay"
                          style={{ position: 'absolute', inset: 0, background: 'rgba(151,109,208,0.45)', opacity: 0, transition: 'opacity 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <span style={{ background: '#fff', color: '#976DD0', fontWeight: 700, fontSize: '0.78rem', padding: '5px 14px', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>Sélectionner</span>
                        </div>
                        {/* Attribution — guideline: link to photographer profile with UTM */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.65))', padding: '16px 8px 5px' }}>
                          <a
                            href={`${photo.user.links.html}?utm_source=bookaroo&utm_medium=referral`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.65rem', fontWeight: 500, textDecoration: 'none' }}
                          >
                            {photo.user.name}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer attribution — guideline: attribute Unsplash with UTM */}
              <div style={{ padding: '10px 20px', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Photos par{' '}
                  <a
                    href="https://unsplash.com?utm_source=bookaroo&utm_medium=referral"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#6b7280', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Unsplash
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default AddEdit;
