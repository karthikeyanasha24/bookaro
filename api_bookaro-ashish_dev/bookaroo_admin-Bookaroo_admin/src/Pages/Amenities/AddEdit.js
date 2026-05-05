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
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import SelectDropdown from "../../components/common/SelectDropdown";

const AddEdit = () => {
  const { id } = useParams();
  const [forms, setForms] = useState([
    { title: "", image: "", categoryId: "" },
  ]);
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const formValidation = [
    { key: "title", required: true },
    { key: "image", required: true },
  ];

  const getAllCategories = () => {
    ApiClient.get("category/listing?status=active&sortBy=name asc").then(
      (res) => {
        if (res.success) {
          setCategoryOptions(
            res?.data?.map((item) => ({
              id: item?.id || item?._id,
              name: item?.name,
            }))
          );
        }
      }
    );
  };

  useEffect(() => {
    getAllCategories();
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          setForms([
            {
              id: res?.data?.id || res?.data?._id,
              title: res?.data?.title,
              image: res?.data?.image,
              categoryId:
                res?.data?.categoryId?._id || res?.data?.categoryId?.id,
            },
          ]);
        }
        loader(false);
      });
    }
  }, [id]);

  const handleFormChange = (index, key, value) => {
    const newForms = [...forms];
    newForms[index][key] = value;
    setForms(newForms);
  };

  const handleAddForm = () => {
    setForms([...forms, { title: "", image: "", categoryId: "" }]);
  };

  const handleRemoveForm = (index) => {
    const newForms = forms.filter((_, i) => i !== index);
    setForms(newForms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const invalid = forms.some((form) =>
      methodModel.getFormError(formValidation, form)
    );
    if (invalid) return;

    const method = id ? "put" : "post";
    const url = id ? shared.editApi : shared.addApi;
    let payload;
    if (id) {
      payload = {
        id: forms?.[0]?.id,
        title: forms?.[0]?.title,
        image: forms?.[0]?.image,
        categoryId: forms?.[0]?.categoryId,
      };
    } else {
      payload = { amenities: forms };
    }

    loader(true);
    ApiClient.allApi(url, payload, method).then((res) => {
      if (res.success) {
        history(`/${shared.url}`);
      }
      loader(false);
    });
  };

  const ImageUpload = (index, e) => {
    let files = e.target.files;
    let file = files.item(0);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return toast.error("Only JPG and PNG images are allowed.");
    }
    loader(true);
    ApiClient.postFormData("upload/image", { file: file }).then((res) => {
      if (res.success) {
        handleFormChange(index, "image", res.fileName);
      }
      loader(false);
    });
  };

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <Link
                to={`/${shared.url}`}
                className="!px-4 py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all mr-3"
              >
                <i className="fa fa-angle-left text-lg"></i>
              </Link>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {id ? "Edit" : "Add"} {shared.addTitle}
              </h3>
              <p className="text-xs lg:text-sm font-normal text-[#75757A]">
                Here you can see all about your {shared.addTitle}
              </p>
            </div>
          </div>

          {forms.map((form, index) => (
            <div key={index} className="pprofile1 relative mb-5 grid grid-cols-12 gap-5">
              <div className="mb-3 lg:col-span-6 col-span-12">
                <FormControl
                  type="text"
                  name={`title-${index}`}
                  label="Title"
                  value={form.title}
                  onChange={(e) => handleFormChange(index, "title", e)}
                // required
                />
                {submitted && !form.title && (
                  <div className="d-block text-red-600">Title is required</div>
                )}
              </div>
              <div className="mb-3 lg:col-span-6 col-span-12">
                <label>
                  Category <span className="text-red-600">*</span>
                </label>
                <SelectDropdown
                  id={`category-${index}`}
                  displayValue="name"
                  className="mt-1 capitalize"
                  intialValue={form.categoryId}
                  theme="search"
                  result={(e) => handleFormChange(index, "categoryId", e.value)}
                  options={categoryOptions}
                  isClearable={false}
                // required
                />
              </div>
              <div className="mb-3 lg:col-span-6 col-span-12">
                <label className="mb-2 block">
                  Icon (JPG/PNG) <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto">
                  {form.image ? (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <div className="relative">
                        <img
                          src={methodModel.userImg(form.image)}
                          className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain"
                        />
                        <IoCloseOutline
                          className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]"
                          onClick={() => handleFormChange(index, "image", "")}
                          size={25}
                        />
                      </div>
                    </div>
                  ) : (
                    <label
                      className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2 border-2 border-dashed border-gray-200 w-full`}
                      style={{ gap: "8px" }}
                    >
                      <FiPlus />
                      <input
                        id={`dropzone-file-${index}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => ImageUpload(index, e)}
                      />
                      Upload Image
                    </label>
                  )}
                  {submitted && !form.image && (
                    <div className="d-block text-red-600 text-sm">
                      Image is required
                    </div>
                  )}
                </div>
              </div>

              {forms?.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveForm(index)}
                  className="bg-red-500 p-2 rounded-lg absolute top-0 right-2 text-white mt-2"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}

          <div className="flex items-center justify-end gap-4 mt-8">
            {!id && (
              <button
                type="button"
                onClick={handleAddForm}
                className="text-black hover:shadow-md hover:bg-[#976DD0] hover:text-white flex gap-2 items-center  border border-primary rounded-lg px-4 py-2 "
              >
                <FiPlus /> Add More
              </button>
            )}
            <button
              type="submit"
              className="text-white bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              {id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;
