import { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import shared from "./shared";
import { toast } from "react-toastify";
import { FaLocationDot } from "react-icons/fa6";
import { FaFile } from "react-icons/fa";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    title:"",
    slug:"",
    description:"",
    metaTitle:"",
    metaKeyword:""
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const formValidation = [
    { key: "title", required: true },
    {key:"description", required: true}
  ]

  function removeHTMLTags(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
   }

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { slug:id }).then((res) => {
        if (res.success) {
          setform({
            title: res?.data?.title || "",
            slug: res?.data?.slug || "",
            id: res?.data?.id || res?.data?._id,
            description: res?.data?.description || "",
            metaTitle: res?.data?.metaTitle || "",
            metaKeyword: res?.data?.metaKeyword || "",
          })
        }
        loader(false);
      });
    }
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if(!removeHTMLTags(form?.description)){
      return 
    }
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
                <FaFile className="text-[18px]"/>
                </div>
                Content Management Information
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
                  name="slug"
                  label="Slug"
                  // placeholder="Enter slug"
                  value={form?.slug}
                  onChange={(e) => setform({ ...form, slug: e })}
                  disabled
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
                  type="text"
                  name="metaKeyword"
                  label="Meta Keyword"
                  // placeholder="Enter Meta Description"
                  value={form?.metaKeyword}
                  onChange={(e) => setform({ ...form, metaKeyword: e })}
                />

              </div>

              <div className=" col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="editor"
                  name="Description"
                  label="description"
                  // placeholder="Enter Description"
                  value={form?.description}
                  onChange={(e) => setform((pre)=>({ ...pre, description: e }))}
                  required
                />
                 {submitted && !removeHTMLTags(form?.description) && (
                  <div className="d-block text-red-600">Description is required</div>
                )}

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
