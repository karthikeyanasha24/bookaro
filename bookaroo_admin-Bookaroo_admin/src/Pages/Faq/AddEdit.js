import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormControl from "../../components/common/FormControl";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import {
  rolePermission,
  rolePermissions
} from "../../models/type.model";
import shared from "./shared";
import SelectDropdown from "../../components/common/SelectDropdown";

const AddEdit = () => {
  const { id } = useParams();
  const [images, setImages] = useState({ image: "" });
  const permissions = rolePermissions;
  const permission = rolePermission;
  const [form, setform] = useState({
    question: "",
    type: "",
    answer: "",
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!form?.question || !form?.answer || form?.answer === "<p><br></p>" || !form?.type) return

    let method = "post";
    let url = shared.addApi;

    let value = {
      ...form,
    };
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
    }

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        // ToastsStore.success(res.message)
        history(`/${shared.url}`);
      }
      loader(false);
    });
  };
  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          let payload = form;

          payload.id = id;

          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });

          if (payload.role?._id) payload.role = payload.role._id;
          payload.id = id;
          setform({
            ...payload,
          });

          let img = images;
          Object.keys(img).map((itm) => {
            img[itm] = value[itm];
          });
          setImages({ ...img });
        }
        loader(false);
      });
    }
  }, [id]);

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <Link
                to={`/${shared.url}`}
                className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
              >
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
            <div className="grid grid-cols-12 p-4 gap-4">
              <div className=" col-span-12 flex  flex-col ">
                <FormControl
                  type="text"
                  name="Question"
                  label="Question"
                  value={form.question}
                  onChange={(e) => setform({ ...form, question: e })}
                  required
                />
                {submitted && !form.question && (
                  <div className="d-block text-red-600">Question is required</div>
                )}
              </div>
              <div className="lg:col-span-12 col-span-12 flex   flex-col ">
                <label className="mb-2 block text-sm">Question For</label>
                <SelectDropdown
                  displayValue="name"
                  placeholder="Question for"
                  isClearable={false}
                  intialValue={form.type}
                  result={(e) => {
                    setform({
                      ...form,
                      type: e.value,
                    })
                  }}
                  options={[
                    { id: "pro", name: "Professional" },
                    { id: "individual", name: "Individual" },
                  ]}
                />
                {submitted && !form.type && (
                  <div className="d-block text-red-600">Question type is required</div>
                )}
              </div>
              <div className="lg:col-span-12 col-span-12 flex   flex-col ">
                <FormControl
                  type="editor"
                  name="Answer"
                  label="Answer"
                  value={form.answer}
                  onChange={(e) => setform((pre) => ({ ...pre, answer: e }))}
                  required
                />
                {submitted && (!form.answer || form?.answer === "<p><br></p>") && (
                  <div className="d-block text-red-600">Answer is required</div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="text-white bg-[#EB6A59] bg-[#EB6A59] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5 mb-2"
            >
              Save
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;
