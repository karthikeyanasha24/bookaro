import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { FaUserAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormControl from "../../components/common/FormControl";
import Layout from "../../components/global/layout";
import environment from "../../environment";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import {
  roleType
} from "../../models/type.model";
import shared from "./shared";

const AddEdit = () => {
  const { id } = useParams();
  const [images, setImages] = useState({ image: "" });
  const [form1, setForm1] = useState({ ...roleType });
  const [form, setform] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    role: "agency",
    loginPannel: "",
    companyRole: "",
    companyName: "",
    registrationNumber: "",
    street: "",
    pinCode: "",
    city: "",
    country: "",
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);
  const inValidEmail = methodModel.emailvalidation(form?.email);
  const formValidation = [
    { key: "mobileNo", required: true },
    { key: "email", required: true, message: "Email is required", email: true },
    { key: "role", required: true },
  ];
  const roleOptions = [{ id: "agency", name: "agency" }, { id: "agent", name: "Agent" }, { id: "hunter", name: "hunter" }];
  // const companyOptions = [{id: "hunter", name: "Hunter"},{id: "agent", name: "Agent"}];


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
        address.pinCode = component.long_name;
      }
    }

    address.street = place?.formatted_address
    address.location = {
      "lng": place.geometry.location.lng(),
      "lat": place.geometry.location.lat()
    }
    setform((prev) => ({ ...prev, ...address }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);

    if (invalid) return;
    let method = "post";
    let url = shared.addApi;

    let value = {
      ...form,
      // ...form1,
      companyId: id,
    }
    if (id) {
      method = "put";
      url = shared.editApi;
      delete value.addedBy;
      delete value.permissions;

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
          let payload = value;

          setform({
            companyId: payload?.id || payload?._id,
            ...payload,
          });
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
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                <div className=" me-3 bg-[#996dca21] p-3 rounded-md">

                  <FaUserAlt className="text-[18px]" />
                </div>
                Basic Information
              </h4>
            </div>
            <div className="grid grid-cols-12 p-4 gap-4">
              <div className="lg:col-span-6 col-span-12 flex mb-5 flex-col">
                <FormControl
                  type="text"
                  name="companyName"
                  label="Company Name"
                  value={form.companyName}
                  onChange={(e) => setform({ ...form, companyName: e })}
                  required
                />
              </div>

              <div className="lg:col-span-6 col-span-12 flex mb-5 flex-col">
                <FormControl
                  type="text"
                  name="registrationNumber"
                  label="Company Registration Number"
                  value={form.registrationNumber}
                  onChange={(e) => {
                    const value = e;
                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                      setform({...form, registrationNumber: value })
                    }
                  } }
                required
              />
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="select"
                  name="role"
                  label="Role"
                  value={form.role}
                  options={roleOptions}
                  onChange={(e) => {
                    setform({ ...form, role: e });
                  }}
                  required
                  theme="search"
                  disabled={form.companyId ? true : false}
                />
                {submitted && !form.role && (
                  <div className="text-red-600 text-[13px] block">
                    Role is required
                  </div>
                )}
              </div>
              <div className="lg:col-span-6 col-span-12 flex mb-5 flex-col">
                <FormControl
                  type="text"
                  name="companyRole"
                  label="Job Title"
                  value={form.companyRole}
                  onChange={(e) => setform({ ...form, companyRole: e })}
                  required
                />
                {/* <FormControl
                  type="select"
                  name="companyRole"
                  label="Company Role"
                  value={form.companyRole}
                  options={companyOptions}
                  onChange={(e) => {
                    setform({ ...form, companyRole: e });
                  }}
                  required
                  theme="search"
                  disabled = {form.companyId ? true : false}
                /> */}
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="full_name"
                  label="Full Name"
                  value={form.fullName}
                  onChange={(e) => setform({ ...form, fullName: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="phone"
                  name="mobileNo"
                  label="Mobile No"
                  value={form.mobileNo}
                  onChange={(e) => setform({ ...form, mobileNo: e })}
                  required
                />
                {submitted && !form.mobileNo && (
                  <div className="text-red-600 text-[13px] block">
                    Mobile is required
                  </div>
                )}
              </div>
              <div className="lg:col-span-6 col-span-12 flex  mb-5  flex-col ">
                <FormControl
                  type="text"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={(e) => setform({ ...form, email: e })}
                  required
                  disabled={id ? true : false}
                />
                {form.email && submitted && !inValidEmail && (
                  <div className="text-red-600 text-[13px] block">
                    Please enter valid email
                  </div>
                )}
              </div>

            </div>
          </div>
          <div className="shadow-box rounded-lg bg-white  gap-4 mt-5">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#976DD0] ">
                <div className=" me-3 bg-[#996dca21] p-3 rounded-md">
                  <FaLocationDot className="text-[18px]" />
                </div>
                Address
              </h4>
            </div>
            <div className="grid grid-cols-12 p-4 gap-4">
              <div className="lg:col-span-6 col-span-12 flex mb-5 flex-col">
                {/* <FormControl
                type="text"
                name="Address"
                label="Address"
                value={form.street}
                onChange={(e) => setform({ ...form, street: e })}
                required
              /> */}
                <div className="mb-3">
                  <label> Location <span className="text-red-600">*</span></label>
                  <ReactGoogleAutocomplete
                    apiKey={environment?.map_api_key}
                    onPlaceSelected={(place) => { handleLocation(place) }}
                    onChange={e => setform({ ...form, street: e.target.value })}
                    value={form?.street}
                    types={['(regions)']}
                    key="venueLocation"
                    // placeholder="Enter Location"
                    required
                    className="bg-white w-full rounded-lg h-11 overflow-hidden px-2 mt-1 border border-[#00000036]"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 col-span-12 flex mb-5 flex-col">
                <FormControl
                  type="number"
                  name="ZipCode"
                  label="ZipCode"
                  value={form.pinCode}
                  onChange={(e) => setform({ ...form, pinCode: e })}
                  required
                />
              </div>

              <div className="lg:col-span-6 col-span-12 flex mb-5 flex-col">
                <FormControl
                  type="text"
                  name="city"
                  label="City"
                  value={form.city}
                  onChange={(e) => setform({ ...form, city: e })}
                  required
                />
              </div>

              <div className="lg:col-span-6 col-span-12 flex mb-5 flex-col">
                <FormControl
                  type="text"
                  name="country"
                  label="Country"
                  value={form.country}
                  onChange={(e) => setform({ ...form, country: e })}
                  required
                />
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
