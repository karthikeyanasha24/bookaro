import { Switch } from "@headlessui/react";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormControl from "../../components/common/FormControl";
import SelectDropdown from "../../components/common/SelectDropdown";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import AddEditFeatures from "../Features/AddEdit";
import shared from "./shared";

const AddEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setform] = useState({
    name: "",
    role: "monthly",
    planType: "",
    numberOfProperty: "",
    numberOfInterest: "",
    pricing: [
      {
        unit_amount: 0,
        currency: "eur",
        interval: "month",
        interval_count: 1,
      },
      {
        unit_amount: 0,
        currency: "eur",
        interval: "year",
        interval_count: 1,
      },
    ],
    description: "",
    feature: [],
    otherDetails: {
      msgToDirectory: { key: "unlimited", value: "" },
      msgToSaleRent: { key: "unlimited", value: "" },
      accessToOffMarketProps: { key: "unlimited", value: "" },
      browsePastTrans: { key: "unlimited", value: "" },
      browseBuildingPermits: { key: "", value: "" },
      trainingOnBuying: { key: "", value: "" },
      createPropProfileSaleRentDirectory: { key: "unlimited", value: "" },
      listPropAsOffMarket: { key: "", value: "" },
      msgBox: { key: "", value: "" },
      leadFilter: { key: "", value: "" },
      realEstateMinitoring: { key: "", value: "" },
      trainingOnSelling: { key: "", value: "" },
      profileSection: { key: "", value: "" },
      leadsLevel: { key: "unlimited", value: "" },
    },
  });
  const [features, setFeatures] = useState([]);
  const homeFeature = features?.filter((itm) => itm?.featureType === "home");
  const ownerFeature = features?.filter((itm) => itm?.featureType === "owner");
  const salesFeature = features?.filter(
    (itm) => itm?.featureType === "sales-mandats"
  );
  const realFeature = features?.filter(
    (itm) => itm?.featureType === "real-estate"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [featureForm, setFeatureForm] = useState({ data: [""] });

  const roleOptions = [
    { id: "monthly", name: "Monthly" },
    { id: "annually", name: "Annually" },
  ];
  const planTypeOptions = [
    { id: "free", name: "Free" },
    { id: "paid", name: "Paid" },
  ];

  useEffect(() => {
    getAllFeatures();
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          setform({
            ...form,
            id: res?.data?.id || res?.data?._id,
            name: res?.data?.name,
            role: res?.data?.role,
            planType: res?.data?.planType,
            pricing: res?.data?.pricing,
            feature: res?.data?.feature?.map((item) => item?.id || item?._id),
            description: res?.data?.description,
            otherDetails: res?.data?.otherDetails,
            numberOfProperty: res?.data?.numberOfProperty,
            numberOfInterest: res?.data?.numberOfInterest,
          });
        }
        loader(false);
      });
    }
  }, []);

  const getAllFeatures = () => {
    ApiClient.get(`feature/get-feature-list?status=active`)?.then((res) => {
      if (res.success) {
        setFeatures(
          res?.data?.map((item) => {
            return { id: item?._id || item?.id, ...item };
          })
        );
      }
    });
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};
    if (!form?.name?.trim()) err.name = "Enter plan name";
    if (!form?.role?.trim()) err.role = "Select role";
    if (!form?.planType?.trim()) err.planType = "Select plan type";
    if (
      form?.planType !== "free" &&
      (!form?.pricing?.[0]?.unit_amount ||
        Number(form?.pricing?.[0]?.unit_amount) == 0)
    ) {
      err.monthly = "Enter plan monthly price";
    }
    if (
      form?.planType !== "free" &&
      (!form?.pricing?.[1]?.unit_amount ||
        Number(form?.pricing?.[1]?.unit_amount) == 0)
    ) {
      err.annually = "Enter plan annually price";
    }
    if (!form?.description) err.description = "Enter plan description";
    if (form?.feature?.length === 0) err.feature = "Select atleast a feature";

    // Validate custom fields in otherDetails
    const otherDetails = form?.otherDetails || {};

    // Check each custom field
    if (otherDetails?.msgToDirectory?.key === 'custom' && !otherDetails?.msgToDirectory?.value) {
      err.msgToDirectory = "Please enter value for messages to directory";
    }

    if (otherDetails?.msgToSaleRent?.key === 'custom' && !otherDetails?.msgToSaleRent?.value) {
      err.msgToSaleRent = "Please enter value for messages to sale/rent";
    }

    if (otherDetails?.accessToOffMarketProps?.key === 'custom' && !otherDetails?.accessToOffMarketProps?.value) {
      err.accessToOffMarketProps = "Please enter value for off-market properties";
    }

    if (otherDetails?.browsePastTrans?.key === 'custom' && !otherDetails?.browsePastTrans?.value) {
      err.browsePastTrans = "Please enter value for past transactions";
    }

    if (otherDetails?.createPropProfileSaleRentDirectory?.key === 'custom' && !otherDetails?.createPropProfileSaleRentDirectory?.value) {
      err.createPropProfileSaleRentDirectory = "Please enter value for property profiles";
    }

    if (otherDetails?.leadsLevel?.key === 'custom' && !otherDetails?.leadsLevel?.value) {
      err.leadsLevel = "Please enter value for leads level";
    }

    setErrors(err);
    return Object.entries(err)?.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    let method = "post";
    let url = shared.addApi;
    let value = { ...form };
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
    }
    loader(true);
    ApiClient.allApi(url, value, method)
      .then((res) => {
        if (res.success) {
          navigate(`/${shared.url}`);
        }
      })
      .catch(() => { })
      .finally(() => {
        loader(false);
      });
  };

  const handleFeatures = (item, checked) => {
    let data = form?.feature;
    if (checked) {
      data.push(item);
    } else {
      data = data.filter((itm) => itm !== item);
    }
    setform((prev) => ({ ...prev, feature: data }));
    setErrors({ ...errors, feature: "" });
  };

  const handleAddFeatures = () => {
    setFeatureForm({ data: [""] });
    setIsOpen(true);
  };

  const handleChange = (key, val) => {
    setform({ ...form, [key]: val });
    setErrors({ ...errors, [key]: "" });
  };

  const changeOtherDetails = (key, isChecked, option) => {
    setform((prevForm) => ({
      ...prevForm,
      otherDetails: {
        ...prevForm.otherDetails,
        [key]: isChecked
          ? {
            key: option,
            value:
              option === "custom"
                ? prevForm.otherDetails[key].value || ""
                : "",
          }
          : { key: "", value: "" },
      },
    }));
    // Clear error for this field when changing options
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  const updateCustomValue = (key, value) => {
    setform((prevForm) => ({
      ...prevForm,
      otherDetails: {
        ...prevForm.otherDetails,
        [key]: {
          key: "custom",
          value: value,
        },
      },
    }));
    // Clear error for this field
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  return (
    <>
      <Layout>
        <AddEditFeatures
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          form={featureForm}
          setForm={setFeatureForm}
          getFeaturesListing={getAllFeatures}
        />
        <form onSubmit={handleSubmit}>
          <div className="pprofile1">
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
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="lg:col-span-6 col-span-full mb-3">
                <FormControl
                  type="text"
                  name="name"
                  label="Name"
                  value={form?.name}
                  onChange={(e) => handleChange("name", e)}
                // required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>
              <div className="lg:col-span-6 col-span-full mb-3">
                <label>
                  Role <span className="text-red-600">*</span>
                </label>
                <SelectDropdown
                  placeholder="Select Role"
                  id="statusDropdown"
                  displayValue="name"
                  className="mt-1"
                  theme="search"
                  intialValue={form?.role}
                  result={(e) => handleChange("role", e?.value)}
                  options={roleOptions}
                  isClearable={false}
                // required
                />
                {errors.role && (
                  <p className="text-red-500 text-xs">{errors.role}</p>
                )}
              </div>
              <div className="lg:col-span-6 col-span-full mb-3">
                <label>
                  Plan Type <span className="text-red-600">*</span>
                </label>
                <SelectDropdown
                  placeholder="Select Plan Type"
                  id="statusDropdown"
                  displayValue="name"
                  className="mt-1"
                  theme="search"
                  intialValue={form?.planType}
                  result={(e) => {
                    if (!e?.value) return;
                    setform((prevForm) => ({
                      ...prevForm,
                      planType: e.value,
                      pricing: prevForm.pricing.map((p) => ({
                        ...p,
                        unit_amount: e.value === "free" ? 0 : p.unit_amount,
                      })),
                    }));
                    setErrors({
                      ...errors,
                      planType: "",
                      monthly: e.value === "free" ? "" : errors.monthly,
                      annually: e.value === "free" ? "" : errors.annually,
                    });
                  }}
                  options={planTypeOptions}
                  isClearable={false}
                  disabled={form?.id}
                />
                {errors.planType && (
                  <p className="text-red-500 text-xs">{errors.planType}</p>
                )}
              </div>
              <div className="lg:col-span-6 col-span-full mb-3">
                <FormControl
                  type="number"
                  label="Monthly price"
                  value={form?.pricing?.[0]?.unit_amount}
                  onChange={(e) => {
                    if (!e) return;
                    setform((prevForm) => ({
                      ...prevForm,
                      pricing: prevForm.pricing?.map((p, i) =>
                        i === 0 ? { ...p, unit_amount: Number(e) } : p
                      ),
                    }));
                    setErrors({ ...errors, monthly: "" });
                  }}
                  disabled={form?.id || form?.planType === "free"}
                  className={
                    form?.id || form?.planType === "free"
                      ? "cursor-not-allowed"
                      : ""
                  }
                  maxlength={10}
                />
                {errors.monthly && (
                  <p className="text-red-500 text-xs">{errors.monthly}</p>
                )}
              </div>
              <div className="lg:col-span-6 col-span-full mb-3">
                <FormControl
                  type="number"
                  label="Annually price"
                  value={form?.pricing?.[1]?.unit_amount}
                  onChange={(e) => {
                    if (!e) return;
                    setform((prevForm) => ({
                      ...prevForm,
                      pricing: prevForm.pricing?.map((p, i) =>
                        i === 1 ? { ...p, unit_amount: Number(e) } : p
                      ),
                    }));
                    setErrors({ ...errors, annually: "" });
                  }}
                  disabled={form?.id || form?.planType === "free"}
                  className={
                    form?.id || form?.planType === "free"
                      ? "cursor-not-allowed"
                      : ""
                  }
                  maxlength={10}
                />
                {errors.annually && (
                  <p className="text-red-500 text-xs">{errors.annually}</p>
                )}
              </div>
              <div className="lg:col-span-6 col-span-full mb-3">
                <FormControl
                  type="number"
                  label="No. of Interest"
                  value={form?.numberOfInterest}
                  onChange={(e) => handleChange("numberOfInterest", e)}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-full mb-3">
                <FormControl
                  type="number"
                  label="No. of Property"
                  value={form?.numberOfProperty}
                  onChange={(e) => handleChange("numberOfProperty", e)}
                  required
                />
              </div>
              <div className=" col-span-full mb-10">
                <FormControl
                  type="editor"
                  name="description"
                  label="Description"
                  required
                  value={form?.description}
                  onChange={(e) => handleChange("description", e)}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">{errors.description}</p>
                )}
              </div>

              <div className=" col-span-full mb-10">
                <h2>Features</h2>
              </div>
              <div className=" col-span-full mb-10">
                {homeFeature?.length > 0 && (
                  <div className="">
                    <label className="text-sm mb-2 block border-b pb-3">
                      Home seeker innovative features:
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                      {homeFeature?.map((item, index) => {
                        return (
                          <div className="">
                            <label
                              className="flex items-center cursor-pointer h-full "
                              key={index}
                            >
                              <input
                                type="checkbox"
                                checked={form?.feature.includes(item?.id)}
                                onChange={(e) =>
                                  handleFeatures(item?.id, e.target.checked)
                                }
                                className="mr-2 h-4 w-4 cursor-pointer"
                                style={{ accentColor: "#976DD0" }}
                              />
                              <span className="text-[14px] font-normal text-[#333]">
                                {item?.name}
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className=" col-span-full mb-10">
                {ownerFeature?.length > 0 && (
                  <div className="">
                    <label className="text-sm mb-2 block border-b pb-3">
                      Owner unique features:
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                      {ownerFeature?.map((item, index) => {
                        return (
                          <label
                            className="flex items-center cursor-pointer"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              checked={form?.feature.includes(item?.id)}
                              onChange={(e) =>
                                handleFeatures(item?.id, e.target.checked)
                              }
                              className="mr-2 h-4 w-4 cursor-pointer"
                              style={{ accentColor: "#976DD0" }}
                            />
                            <span className="text-[14px] font-normal text-[#333]">
                              {item?.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className=" col-span-full mb-10">
                {salesFeature?.length > 0 && (
                  <div className="">
                    <label className="text-sm mb-2 block border-b pb-3">
                      Sales mandats acquisition :
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                      {salesFeature?.map((item, index) => {
                        return (
                          <label
                            className="flex items-center cursor-pointer"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              checked={form?.feature.includes(item?.id)}
                              onChange={(e) =>
                                handleFeatures(item?.id, e.target.checked)
                              }
                              className="mr-2 h-4 w-4 cursor-pointer"
                              style={{ accentColor: "#976DD0" }}
                            />
                            <span className="text-[14px] font-normal text-[#333]">
                              {item?.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className=" col-span-full mb-10">
                {realFeature?.length > 0 && (
                  <div className="">
                    <label className="text-sm mb-2 block border-b pb-3">
                      Real estate services :
                    </label>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                      {realFeature?.map((item, index) => {
                        return (
                          <label
                            className="flex items-center cursor-pointer"
                            key={index}
                          >
                            <input
                              type="checkbox"
                              checked={form?.feature.includes(item?.id)}
                              onChange={(e) =>
                                handleFeatures(item?.id, e.target.checked)
                              }
                              className="mr-2 h-4 w-4 cursor-pointer"
                              style={{ accentColor: "#976DD0" }}
                            />
                            <span className="text-[14px] font-normal text-[#333]">
                              {item?.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {errors.feature && (
              <p className="text-red-500 text-xs">{errors.feature}</p>
            )}

            <div className="mb-14">
              <label className="text-sm mb-2 block border-b pb-3">
                Property seeker innovative features:
              </label>
              <div className="mb-5 mt-5">
                <p className="text-[14px] font-normal text-[#333] mb-2">
                  Send message to owners of properties listed in Directory
                </p>
                <div className="grid grid-cols-12">
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.msgToDirectory?.key == "unlimited"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "msgToDirectory",
                            e.target.checked,
                            "unlimited"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Unlimited
                    </label>
                  </div>
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.msgToDirectory?.key == "custom"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "msgToDirectory",
                            e.target.checked,
                            "custom"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Custom
                    </label>
                  </div>
                  <div className=" col-span-full">
                    {form?.otherDetails?.msgToDirectory?.key == "custom" && (
                      <>
                        <input
                          type="number"
                          placeholder="messages/day"
                          value={form?.otherDetails?.msgToDirectory?.value}
                          onChange={(e) =>
                            updateCustomValue("msgToDirectory", e?.target?.value)
                          }
                          maxLength={10}
                          className={`border p-2 rounded w-full ${errors.msgToDirectory ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.msgToDirectory && (
                          <p className="text-red-500 text-xs mt-1">{errors.msgToDirectory}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[14px] font-normal text-[#333] mb-2 ">
                  Send message to owner of property listed for sale or rent / day
                </p>
                <div className="grid grid-cols-12">
                  <div className="lg:col-span-6 col-span-full">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.msgToSaleRent?.key == "unlimited"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "msgToSaleRent",
                            e.target.checked,
                            "unlimited"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Unlimited
                    </label>
                  </div>
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.msgToSaleRent?.key == "custom"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "msgToSaleRent",
                            e.target.checked,
                            "custom"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Custom
                    </label>
                  </div>
                  <div className="col-span-full">
                    {form?.otherDetails?.msgToSaleRent?.key == "custom" && (
                      <>
                        <input
                          type="number"
                          placeholder="messages/day"
                          value={form?.otherDetails?.msgToSaleRent?.value}
                          onChange={(e) =>
                            updateCustomValue("msgToSaleRent", e?.target?.value)
                          }
                          maxLength={10}
                          className={`border p-2 rounded w-full ${errors.msgToSaleRent ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.msgToSaleRent && (
                          <p className="text-red-500 text-xs mt-1">{errors.msgToSaleRent}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[14px] font-normal text-[#333] mb-2 ">
                  Access to Off-Market properties
                </p>
                <div className="grid grid-cols-12">
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.accessToOffMarketProps?.key ==
                          "unlimited"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "accessToOffMarketProps",
                            e.target.checked,
                            "unlimited"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Unlimited
                    </label>
                  </div>
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.accessToOffMarketProps?.key ==
                          "custom"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "accessToOffMarketProps",
                            e.target.checked,
                            "custom"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Limited
                    </label>
                  </div>
                  <div className="col-span-full">
                    {form?.otherDetails?.accessToOffMarketProps?.key ==
                      "custom" && (
                        <>
                          <input
                            type="number"
                            placeholder="Price"
                            value={
                              form?.otherDetails?.accessToOffMarketProps?.value
                            }
                            onChange={(e) =>
                              updateCustomValue(
                                "accessToOffMarketProps",
                                e?.target?.value
                              )
                            }
                            maxLength={10}
                            className={`border p-2 rounded w-full ${errors.accessToOffMarketProps ? 'border-red-500' : ''
                              }`}
                          />
                          {errors.accessToOffMarketProps && (
                            <p className="text-red-500 text-xs mt-1">{errors.accessToOffMarketProps}</p>
                          )}
                        </>
                      )}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[14px] font-normal text-[#333] mb-2 ">
                  Browse past transaction database
                </p>
                <div className="grid grid-cols-12">
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.browsePastTrans?.key ==
                          "unlimited"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "browsePastTrans",
                            e.target.checked,
                            "unlimited"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Unlimited
                    </label>
                  </div>
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.browsePastTrans?.key == "custom"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "browsePastTrans",
                            e.target.checked,
                            "custom"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Limited
                    </label>
                  </div>
                  <div className=" col-span-full">
                    {form?.otherDetails?.browsePastTrans?.key == "custom" && (
                      <>
                        <input
                          type="number"
                          placeholder="Number of searches"
                          value={form?.otherDetails?.browsePastTrans?.value}
                          onChange={(e) =>
                            updateCustomValue("browsePastTrans", e?.target?.value)
                          }
                          maxLength={10}
                          className={`border p-2 rounded w-full ${errors.browsePastTrans ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.browsePastTrans && (
                          <p className="text-red-500 text-xs mt-1">{errors.browsePastTrans}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-12">
                <div className="lg:col-span-6 col-span-full">
                  <p className="text-[14px] font-normal text-[#333]  me-10">
                    Browse building permits
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <Switch
                    checked={
                      form?.otherDetails?.browseBuildingPermits?.key ==
                      "unlimited"
                    }
                    onChange={(checked) =>
                      changeOtherDetails(
                        "browseBuildingPermits",
                        checked,
                        "unlimited"
                      )
                    }
                    className="group inline-flex h-4 w-8 items-center rounded-full bg-gray-400 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-5" />
                  </Switch>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-12">
                <div className="lg:col-span-6 col-span-full">
                  <p className="text-[14px] font-normal text-[#333]  me-10">
                    Training on buying a property
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <Switch
                    checked={
                      form?.otherDetails?.trainingOnBuying?.key == "unlimited"
                    }
                    onChange={(checked) =>
                      changeOtherDetails(
                        "trainingOnBuying",
                        checked,
                        "unlimited"
                      )
                    }
                    className="group inline-flex h-4 w-8 items-center rounded-full bg-gray-400 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-5" />
                  </Switch>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <label className="text-sm mb-2 block border-b pb-3">
                Property seller innovative features:
              </label>

              <div className="mb-5 mt-5">
                <p className="text-[14px] font-normal text-[#333] mb-2">
                  Create property profiles under Sale, rental or Directory
                </p>
                <div className="grid grid-cols-12">
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.createPropProfileSaleRentDirectory
                            ?.key == "unlimited"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "createPropProfileSaleRentDirectory",
                            e.target.checked,
                            "unlimited"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Unlimited
                    </label>
                  </div>
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.createPropProfileSaleRentDirectory
                            ?.key == "custom"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "createPropProfileSaleRentDirectory",
                            e.target.checked,
                            "custom"
                          )
                        }
                        className="mr-2 h-4 w-4 cursor-pointer"
                      />
                      Custom
                    </label>
                  </div>
                  <div className=" col-span-full">
                    {form?.otherDetails?.createPropProfileSaleRentDirectory
                      ?.key == "custom" && (
                        <>
                          <input
                            type="number"
                            placeholder="Count of profiles"
                            value={
                              form?.otherDetails?.createPropProfileSaleRentDirectory
                                ?.value
                            }
                            onChange={(e) =>
                              updateCustomValue(
                                "createPropProfileSaleRentDirectory",
                                e?.target?.value
                              )
                            }
                            maxLength={10}
                            className={`border p-2 rounded w-full ${errors.createPropProfileSaleRentDirectory ? 'border-red-500' : ''
                              }`}
                          />
                          {errors.createPropProfileSaleRentDirectory && (
                            <p className="text-red-500 text-xs mt-1">{errors.createPropProfileSaleRentDirectory}</p>
                          )}
                        </>
                      )}
                  </div>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-12">
                <div className="lg:col-span-6 col-span-full">
                  <p className="text-[14px] font-normal text-[#333]  me-10">
                    List properties under Off-Market section
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <Switch
                    checked={
                      form?.otherDetails?.listPropAsOffMarket?.key ==
                      "unlimited"
                    }
                    onChange={(checked) =>
                      changeOtherDetails(
                        "listPropAsOffMarket",
                        checked,
                        "unlimited"
                      )
                    }
                    className="group inline-flex h-4 w-8 items-center rounded-full bg-gray-400 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-5" />
                  </Switch>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-12">
                <div className="lg:col-span-6 col-span-full">
                  <p className="text-[14px] font-normal text-[#333]  me-10">
                    Message box
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <Switch
                    checked={form?.otherDetails?.msgBox?.key == "unlimited"}
                    onChange={(checked) =>
                      changeOtherDetails("msgBox", checked, "unlimited")
                    }
                    className="group inline-flex h-4 w-8 items-center rounded-full bg-gray-400 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-5" />
                  </Switch>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-12">
                <div className="lg:col-span-6 col-span-full">
                  <p className="text-[14px] font-normal text-[#333]  me-10">
                    Lead filtering
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <Switch
                    checked={form?.otherDetails?.leadFilter?.key == "unlimited"}
                    onChange={(checked) =>
                      changeOtherDetails("leadFilter", checked, "unlimited")
                    }
                    className="group inline-flex h-4 w-8 items-center rounded-full bg-gray-400 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-5" />
                  </Switch>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-12">
                <div className="lg:col-span-6 col-span-full">
                  <p className="text-[14px] font-normal text-[#333]  me-10">
                    Real-estate transaction monitoring tool
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <Switch
                    checked={
                      form?.otherDetails?.realEstateMinitoring?.key ==
                      "unlimited"
                    }
                    onChange={(checked) =>
                      changeOtherDetails(
                        "realEstateMinitoring",
                        checked,
                        "unlimited"
                      )
                    }
                    className="group inline-flex h-4 w-8 items-center rounded-full bg-gray-400 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-5" />
                  </Switch>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-12">
                <div className="lg:col-span-6 col-span-full">
                  <p className="text-[14px] font-normal text-[#333]  me-10">
                    Training on selling your property
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <Switch
                    checked={
                      form?.otherDetails?.trainingOnSelling?.key == "unlimited"
                    }
                    onChange={(checked) =>
                      changeOtherDetails(
                        "trainingOnSelling",
                        checked,
                        "unlimited"
                      )
                    }
                    className="group inline-flex h-4 w-8 items-center rounded-full bg-gray-400 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-5" />
                  </Switch>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-12">
                <div className="lg:col-span-6 col-span-full">
                  <p className="text-[14px] font-normal text-[#333]  me-10">
                    Profile section
                  </p>
                </div>
                <div className="lg:col-span-6 col-span-full">
                  <Switch
                    checked={
                      form?.otherDetails?.profileSection?.key == "unlimited"
                    }
                    onChange={(checked) =>
                      changeOtherDetails("profileSection", checked, "unlimited")
                    }
                    className="group inline-flex h-4 w-8 items-center rounded-full bg-gray-400 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-2 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-5" />
                  </Switch>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[14px] font-normal text-[#333] mb-2">
                  Leads level of financiability check
                </p>
                <div className="grid grid-cols-12">
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.leadsLevel?.key == "unlimited"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "leadsLevel",
                            e.target.checked,
                            "unlimited"
                          )
                        }
                        className="mr-2"
                      />
                      Unlimited
                    </label>
                  </div>
                  <div className="lg:col-span-6 col-span-full">
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          form?.otherDetails?.leadsLevel?.key == "custom"
                        }
                        onChange={(e) =>
                          changeOtherDetails(
                            "leadsLevel",
                            e.target.checked,
                            "custom"
                          )
                        }
                        className="mr-2"
                      />
                      Custom
                    </label>
                  </div>
                  <div className=" col-span-full">
                    {form?.otherDetails?.leadsLevel?.key == "custom" && (
                      <>
                        <input
                          type="text"
                          placeholder="Count of profiles"
                          value={form?.otherDetails?.leadsLevel?.value}
                          onChange={(e) =>
                            updateCustomValue("leadsLevel", e?.target?.value)
                          }
                          className={`border p-2 rounded w-full ${errors.leadsLevel ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.leadsLevel && (
                          <p className="text-red-500 text-xs mt-1">{errors.leadsLevel}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="text-white bg-[#976DD0] bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
              >
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