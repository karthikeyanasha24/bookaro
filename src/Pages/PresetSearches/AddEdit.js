import { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import shared from "./shared";
import SelectDropdown from "../../components/common/SelectDropdown";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    title: "",
    type: "",
    link: "",
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const formValidation = [
    { key: "title", required: true },
    { key: "type", required: true },
    { key: "link", required: true },
  ]

  const venuesOption = [
    { id: "sell_property", name: " Property for sell" },
    { id: "rent_property", name: " Property for rent" },
    { id: "directiory_property", name: " Property for directiory" },
    { id: "past_transaction", name: " Past transaction" },
  ]

  useEffect(() => {

    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          setform({
            title: res?.data?.title || "",
            type: res?.data?.type || "",
            link: res?.data?.link || "",
            id: res?.data?.id || res?.data?._id
          })
        }
        loader(false);
      });
    }
  }, [])


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
      url = `${shared.editApi}?id=${id}`;
    } 
    delete value.id;
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
                  <label>Type <span className="text-red-600">*</span></label>
                  <SelectDropdown
                    id="statusDropdown"
                    displayValue="name"
                    className="mt-1 capitalize"
                    // placeholder="Select Venue"
                    theme="search"
                    intialValue={form?.type}
                    result={(e) => setform({ ...form, type: e?.value })}
                    options={venuesOption}
                    required
                  />
                  {submitted && !form.type && (
                    <div className="d-block text-red-600">Type is required</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Url <span className="text-red-600">*</span></label>
                  <FormControl
                    type="text"
                    name="link"
                    // label="Url"
                    value={form?.link}
                    onChange={(e) => setform({ ...form, link: e })}
                    // placeholder="Enter Link"
                    required
                  />
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
