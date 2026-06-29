import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { MdCategory } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormControl from "../../components/common/FormControl";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import shared from "./shared";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    SubCategoryName: "",
    categoryId: ""
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const formValidation = [
    { key: "SubCategoryName", required: true },
    { key: "categoryId", required: true },
  ]
  const [categoryTypeOptions, setcategoryTypeOptions] = useState([])

  const getData = (p = {}) => {
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

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
        setform({id:res?.data?.id || res?.data?._id,SubCategoryName:res?.data?.SubCategoryName,categoryId:res?.data?.categoryId?.id})
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
      delete value?.status
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

  useEffect(() => {
    getData()
  }, [])

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
          <div className="shadow-box  rounded-lg bg-white  gap-4">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                <div className=" me-3 bg-[#996dca21] p-3 rounded-md">

                  <MdCategory className="text-[18px]" />
                </div>
                Category Information
              </h4>
            </div>

            <div className="grid grid-cols-12 p-4 gap-4">
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="name"
                  label="Name"
                  // placeholder="Enter Name"
                  value={form?.SubCategoryName}
                  onChange={(e) => setform({ ...form, SubCategoryName: e?.toLowerCase() })}
                  required
                />
                {submitted && !form.SubCategoryName && (
                  <div className="d-block text-red-600">Sub Category Name is required</div>
                )}
              </div>

              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="select"
                  name="name"
                  label="Category"
                  value={form.categoryId}  // should be a value like "123"
                  options={categoryTypeOptions}  // should be [{ value, label }]
                  onChange={(e) => {
                    setform({ ...form, categoryId: e }); // e = selected value
                  }}
                  required
                  theme="search"
                />

                {submitted && !form.categoryId && (
                  <div className="text-red-600 text-[13px] block">
                    category type is required
                  </div>
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
