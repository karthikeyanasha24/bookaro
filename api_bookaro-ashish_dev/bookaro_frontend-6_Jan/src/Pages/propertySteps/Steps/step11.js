import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Tooltip } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SelectDropdown from "../../../components/common/SelectDropdown";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { addToTimeline, generateYears, saveChanges } from "../shared";
import { formatCurrency } from "../../../models/string.model";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import { useSelector } from "react-redux";
import { RiDraftFill } from "react-icons/ri";
import PropertyCheck from "../propertyCheck";

const Step11 = ({
  step1,
  setActiveTabIndex,
  formData,
  setFormData,
  editMode = true,
  page,
  dropdownOptions,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scrollRef = useRef(null);
  const [addRevenue, setAddRevenue] = useState(false);
  const user = useSelector((state) => state.user)
  const [draftModal, setdraftModal] = useState(false)
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [msg, setMsg] = useState("");
  const [revenue, setrevenue] = useState({
    type: "",
    source: "",
    year: "",
    price: "",
    status: false,
    document: [],
  });

  const validate = () => {
    if (!formData?.revenue_detail || formData?.revenue_detail?.length === 0) {
      toast.error("Add Revenue details");
      return false;
    }
    let haserror = false;
    formData?.revenue_detail?.map((itm) => {
      if (
        !itm.type?.trim() ||
        !itm.source?.trim() ||
        !itm.year ||
        !itm.price?.trim()
      ) {
        haserror = true;
      }
    });
    if (haserror) {
      toast.error("Enter all mandatory fields");
      return false;
    }
    return true
  }
  const draftsave = () => {
    const payload = {
      ...formData,
      step: 9
    }
    loader(true)
    ApiClient.post(`draft/add`, payload, {}, "", true).then((res) => {
      if (res.success) {
        toast.success(res?.message)
        navigate("/")
      } else {
        setdraftModal(true)
        setMsg(res?.message);
      }
      loader(false);
    });
  }

  const handleNext = () => {
    // if (!validate()) return
    localStorage.setItem("step1", JSON.stringify(formData));
    if (page) {
      navigate(`/property/${page}/${id}?step=11`);
    } else if (id) {
      navigate(`/property/edit/${id}/12`);
    } else {
      navigate("/property/add/12");
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 13));
  };

  const handleBack = () => {
    if (page) {
      navigate(`/property/${page}/${id}`);
    } else if (id) {
      navigate(`/property/edit/${id}/9`);
    } else {
      navigate("/property/add/9");
    }
    setActiveTabIndex(9);
  };

  const applyRevenue = (saveAndNew = true) => {
    if (
      !revenue.type?.trim() ||
      !revenue.source?.trim() ||
      !revenue.year ||
      !revenue.price?.trim()
    ) {
      return toast.error("Enter all mandatory fields");
    }
    // else if (revenue.document?.length === 0) {
    //   return toast.error("Upload document")
    // }
    if (formData?.revenue_detail) {
      setFormData({
        ...formData,
        revenue_detail: [...formData?.revenue_detail, revenue],
      });
    } else {
      setFormData({
        ...formData,
        revenue_detail: [revenue],
      });
    }
    setrevenue({
      type: "",
      source: "",
      year: "",
      price: "",
      status: false,
      document: [],
    });
    if (saveAndNew) {
      setAddRevenue(false);
    } else {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
    toast.success("Record Added.")
  };
  const applyEditRevenue = () => {
    if (
      !revenue.type?.trim() ||
      !revenue.source?.trim() ||
      !revenue.year ||
      !revenue.price?.trim()
    ) {
      return toast.error("Enter all mandatory fields");
    }
    // else if (revenue.document?.length === 0) {
    //   return toast.error("Upload document")
    // }
    let data = [...formData?.revenue_detail];
    data[editIndex] = { ...revenue };
    setFormData({
      ...formData,
      revenue_detail: data,
    });
    setrevenue({
      type: "",
      source: "",
      year: "",
      price: "",
      status: false,
      document: [],
    });
    setEdit(false);
    setAddRevenue(false);
    setEditIndex(null);
  };
  const removeRevenue = (i) => {
    let data = formData?.revenue_detail?.filter((itm, ind) => ind !== i);
    setFormData({
      ...formData,
      revenue_detail: data,
    });
  };
  const editRevenue = (itm, i) => {
    setEdit(true);
    setAddRevenue(true);
    setEditIndex(i);
    setrevenue({
      ...itm,
    });
  };

  const ImageUpload = (e) => {
    let files = Array.from(e.target.files);
    // Check total number of files (existing + new)
    if (files.length + revenue.document.length > 5) {
      toast.error("Maximum 5 documents allowed to add");
      return (e.target.value = ""); // Clear file input
    }

    // Check if any file exceeds 10MB
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error("Each document must be smaller than 10MB");
      return (e.target.value = ""); // Clear file input
    }
    loader(true);
    ApiClient.multiImageUpload(
      "upload/multiple-images",
      files,
      {},
      "files"
    ).then((res) => {
      if (res.success) {
        const data = res?.files?.map((item) => {
          return {
            fileName: item?.fileName,
            originalname: item?.originalname,
          };
        });
        if (data.length + revenue.document.length > 5) {
          toast.error("Maximum 5 documents allowed to add");
          return (e.target.value = ""); // Clear file input
        }
        setrevenue({
          ...revenue,
          document: [...revenue.document, ...data],
        });
      }
      loader(false);
    });
  };
  const removeDocument = (ind) => {
    let data = revenue.document?.filter((_, i) => i !== ind);
    setrevenue({
      ...revenue,
      document: data,
    });
  };
  const closeModal = () => {
    setAddRevenue(false);
    setEdit(false);
    setEditIndex(null);
    setrevenue({
      type: "",
      source: "",
      year: "",
      price: "",
      status: false,
      document: [],
    });
  };

  const [xData, setxData] = useState([]);
  const [yData, setyData] = useState([]);
  useEffect(() => {
    if (formData?.revenue_detail?.length > 0) {
      const data = formData.revenue_detail;
      const yearMap = {};
      data.forEach((item) => {
        const year = item.year;
        const price = parseFloat(item.price);

        if (yearMap[year]) {
          yearMap[year] += price;
        } else {
          yearMap[year] = price;
        }
      });

      const arrx = Object.keys(yearMap);
      const arry = Object.values(yearMap);
      setxData(arrx);
      setyData(arry);
    }
  }, [formData?.revenue_detail]);
  const chartData = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      // formatter: "{b}: {c} €",
      formatter: function (params) {
        return `${params[0].name}: ${formatCurrency(params[0].value)} €`;
      },
    },
    xAxis: {
      data: xData,
    },
    yAxis: {
      type: "value",
      axisLabel: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
    },
    series: [
      {
        type: "bar",
        data: yData,
        itemStyle: {
          borderRadius: [12],
          color: function (params) {
            return params.dataIndex % 2 === 0 ? "#3FCEAB" : "#409781";
          },
        },
        barWidth: "50%",
        label: {
          // bar top text
          show: true,
          position: "top",
          // formatter: "{c} €",
          formatter: function (params) {
            return formatCurrency(params.value) + ' €';
          },
          color: "#6E6B6B",
        },
      },
    ],
  };
  const revenueResult = Object.values(
    (formData?.revenue_detail || []).reduce((acc, item) => {
      const price = parseFloat(item?.price);
      const dropdownItem = dropdownOptions?.find(
        (option) => option?._id === item?.type
      );
      if (acc[item?.type]) {
        acc[item?.type].price += price;
      } else {
        acc[item?.type] = {
          type: item?.type,
          price: price,
          name: dropdownItem ? dropdownItem?.name : "Unknown",
        };
      }
      return acc;
    }, {})
  );
  const totalRevenue = revenueResult?.reduce(
    (sum, item) => sum + item?.price,
    0
  );
  const [isOpenDoc, setIsOpenDoc] = useState(false);
  const [dialogDocs, setDialogDocs] = useState([]);
  const openDialog = (itm) => {
    setIsOpenDoc(true);
    setDialogDocs(itm?.document);
  };
  const closeDialog = () => {
    setIsOpenDoc(false);
    setDialogDocs([]);
  };

  // const getDifferences = (step1, formData) => {
  //   let stepDifferences = step1.revenue_detail
  //     .filter(stepItem => {
  //       const matchingFormItem = formData.revenue_detail.find(
  //         formItem => formItem.type === stepItem.type && formItem.source === stepItem.source
  //       );

  //       return (
  //         !matchingFormItem ||
  //         matchingFormItem.year !== stepItem.year ||
  //         matchingFormItem.price !== stepItem.price
  //       );
  //     })
  //     .map(item => ({
  //       year: item.year,
  //       price: item.price,
  //       // type: item.type,
  //       // source: item.source
  //     }));

  //   // Find newly added entries (present in formData but not in step1)
  //   let newEntries = formData.revenue_detail
  //     .filter(formItem => {
  //       return !step1.revenue_detail.some(
  //         stepItem => stepItem.type === formItem.type && stepItem.source === formItem.source
  //       );
  //     })
  //     .map(item => ({
  //       year: item.year,
  //       price: item.price,
  //       // type: item.type,
  //       // source: item.source
  //     }));

  //   return [...stepDifferences, ...newEntries];
  // };
  // const differences = getDifferences(step1, formData);
  // console.log("differences", differences);
  const [timeline, setTimeline] = useState({ propertyId: id, revenue_detail: formData?.revenue_detail });
  const save = () => {
    if (!validate()) return
    step1.revenue_detail = formData.revenue_detail;
    step1.add_more_step = true;
    step1.request_status = "pending";
    localStorage.setItem("step1", JSON.stringify(step1))

    // if (differences?.length) {
    //   let data = {
    //     ...timeline,
    //     revenue_detail: differences
    //   };
    //   setTimeline(data);
    //   addToTimeline(data, setTimeline, id, step1)
    // }
    //   else saveChanges(step1)
    let dto = { propertyId: id, revenue_detail: formData?.revenue_detail }
    addToTimeline(dto, setTimeline, id, step1)
  }



  return (
    <>
      <div className="flex justify-between flex-col h-full relative ">
        <PropertyCheck />
        {addRevenue ? (
          <>
            <div className="lg:overflow-auto lg:h-[640px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10 text-[#47525E] text-[24px] font-[600] ">
              <div>
                <div className="flex justify-between items-start">
                  <h4 ref={scrollRef} className="text-[#47525E] text-[24px] font-[600] text-left ">
                    Add new revenue to your property
                    <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                      *Mandatory information
                    </span>
                    <p className="font-[400]  text-[16px] text-[#5A5A5A]  mt-5  xl:w-[500px] w-[100%]">
                      Adding and getting your revenues verified by Bookaroo
                      increases trust and add more value to your property{" "}
                    </p>
                  </h4>
                  <button
                    onClick={() => closeModal()}
                    className="  ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center "
                  >
                    <RxCross2 />
                  </button>
                </div>

                <div className="lg:max-w-[500px] w-[100%]">
                  <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                    Revenue details
                  </label>
                  <div className="flex items-center flex-wrap  justify-center">
                    <div class="lg:max-w-[500px] w-[100%] mb-3">
                      <SelectDropdown
                        displayValue="name"
                        placeholder="Select Revenue type"
                        isClearable={false}
                        intialValue={revenue.type}
                        result={(e) => {
                          setrevenue({
                            ...revenue,
                            type: e.value,
                          });
                        }}
                        options={dropdownOptions?.filter(
                          (itm) => itm?.type === "Revenue"
                        )}
                      />
                    </div>
                    <div class="lg:max-w-[500px] w-[100%] mb-3">
                      <SelectDropdown
                        displayValue="name"
                        placeholder="Select Revenue Source"
                        isClearable={false}
                        intialValue={revenue.source}
                        result={(e) => {
                          setrevenue({
                            ...revenue,
                            source: e.value,
                          });
                        }}
                        options={dropdownOptions?.filter(
                          (itm) => itm?.type === "Revenue-Source"
                        )}
                      />
                    </div>
                    <div class="lg:max-w-[500px] w-[100%] mb-3">
                      <SelectDropdown
                        displayValue="name"
                        placeholder="Select year"
                        isClearable={false}
                        intialValue={revenue.year}
                        result={(e) => {
                          setrevenue({
                            ...revenue,
                            year: e.value,
                          });
                        }}
                        options={generateYears(null, 1950)}
                      />
                    </div>
                    <div class="lg:max-w-[500px] w-[100%] mb-3 relative">
                      <input
                        type="text"
                        value={formatCurrency(revenue.price)}
                        onChange={(e) => {
                          let value = e.target.value;
                          value = value.replace(/[^0-9]/g, "");
                          setrevenue({
                            ...revenue,
                            price: value,
                          });
                        }}
                        className={`bg-white rounded-[7px] border border-[#976DD0]
                    p-2 px-3 h-[44px] md:w-[500px] font-normal w-full mb-4 text-[#5A5A5A] pr-14 text-[16px]`}
                        placeholder="Yearly amount"
                      />
                      <span className="absolute right-3 top-3 text-gray-500 border-l border-[#976DD0] pl-2 text-[16px]">
                        €
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[#5A5A5A] mb-2 text-[16px]">
                      Add proofing documents
                    </label>
                    <p className="text-[#000000] text-[16px] font-[600] mt-3  mb-5">
                      Any document you submit are only used by Bookaroo to
                      certificate the accuracy of the revenus declared and will
                      never be shared with a thirdparty.
                    </p>
                  </div>
                  {revenue?.document?.length < 5 && (
                    <div className="relative cursor-pointer">
                      <input
                        multiple
                        type="file"
                        name="file"
                        className="placeholder-set opacity-0	z-[1] w-[100%] h-[150px] relative "
                        onChange={ImageUpload}
                      />
                      <label className="bg-[#E7E6E4] lg:max-w-[500px] w-[100%] h-[150px] block flex items-center justify-center absolute top-0">
                        <FiPlusCircle className="flex items-center justify-center w-[60px] h-full mx-auto text-[#bd63c3] font-[600]" />{" "}
                      </label>
                    </div>
                  )}

                  <div className="flex items-start mt-3">
                    {revenue?.document?.map((itm, i) => (
                      <div>
                        <div
                          key={i}
                          className="relative cursor-pointer w-[40px] me-5"
                        >
                          <img
                            src="/assets/img/dummy_doc.png"
                            alt="doc"
                            className="w-[40px]"
                          />
                          <Tooltip
                            placement="bottom"
                            title={<>{itm?.originalname}</>}
                          >
                            <p className="ellipses text-[14px]">
                              {itm?.originalname}
                            </p>
                          </Tooltip>
                          <Link
                            onClick={() => removeDocument(i)}
                            className="absolute -top-[8px] -right-[2px] rounded-full"
                          >
                            <AiOutlineDelete className="text-[20px] p-[5px] w-[25px] h-[25px] text-white rounded-[50px] bg-[#c2a8df]" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-end  bg-[#f2ecf8] p-5 lg:max-w-[500px] w-[100%] ">
                  <div className="flex flex-col items-center justify-center">
                    <button
                      onClick={() => (edit ? applyEditRevenue() : applyRevenue())}
                      className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn "
                    >
                      {edit ? "Update" : "Save and close"}
                    </button>
                    {edit ? ("") : (
                      <Link
                        className="text-[#976DD0] text-[15px] font-[600] mt-3 mb-10"
                        onClick={() => applyRevenue(false)}
                      >
                        Save and create new revenue
                      </Link>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : (
          <>
            <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
              <div className="flex justify-between items-start">
                <h4 className="text-[#47525E] text-[24px] font-[600] text-left  leading-[30px] xl:max-w-[500px] lg:max-w-[400px] md:max-w-[300px] w-[100%] md:mt-[-4px]  ">
                  How much revenues your property generated over the years?
                  <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                    *Mandatory information
                  </span>
                  <p className="font-[400]  text-[16px] text-[#5A5A5A] mb-7 mt-5 leading-[24px] lg:w-[500px] w-[100%]">
                    Providing this information will increase both the value and
                    the attractivity of your property
                  </p>
                </h4>
                {addRevenue ? (
                  <button
                    onClick={() => closeModal()}
                    className="  ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center "
                  >
                    <RxCross2 />
                  </button>
                ) : (
                  <button
                    disabled={!editMode}
                    onClick={() => {
                      if (editMode) setAddRevenue(true);
                    }}
                    className="rounded-[50px] border border-[#976DD0] p-2 text-[#787878] w-[200px] text-[14px]"
                  >
                    Add New Revenues
                  </button>
                )}
              </div>

              {formData?.revenue_detail &&
                formData?.revenue_detail?.length > 0 ? (
                <>
                  <div className="md:max-w-[500px] w-[100%]">
                    <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                      Lifetime Global Revenues
                    </label>
                    <div className="flex items-center gap-5 flex-wrap">
                      <div className="bg-[#409781]  py-4 px-3 rounded-[12px] w-[150px] h-[130px]">
                        <h4 className="text-white font-[600] text-[26px] text-center mb-2">
                          {formatCurrency(totalRevenue)} €
                        </h4>
                        <p className="text-white text-[16px] text-center capitalize">
                          Total <br /> Revenues
                        </p>
                      </div>

                      {revenueResult?.map((itm) => (
                        <div className="bg-[#3FCEAB]  py-4 px-3 rounded-[12px] w-[150px] h-[130px] ">
                          <h4 className="text-white font-[600] text-[26px] text-center mb-2">
                            {formatCurrency(itm?.price)} €
                          </h4>
                          <p className="text-white text-[16px] text-center capitalize max-w-[100px] mx-auto">
                            {itm?.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* graph */}
                  <div className="md:max-w-[500px] w-[100%]">
                    <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                      Yearly Revenues
                    </label>
                    <div className="bg-white rounded-[5px]">
                      <ReactECharts
                        option={chartData}
                        style={{ height: 400 }}
                        opts={{ renderer: "svg" }}
                      />
                    </div>
                  </div>
                  <div className="md:max-w-[500px] w-[100%]">
                    <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                      Revenue Details
                    </label>
                    <div>
                      {formData?.revenue_detail?.map((itm, i) => (
                        <div className="border border-[#CECECE] bg-white p-5 rounded-[10px] flex justify-between mb-4">
                          <ul>
                            <li className="text-[#5A5A5A] text-[17px] mb-2 flex">
                              <span className="w-[100px]">Type:</span>{" "}
                              {
                                dropdownOptions?.find(
                                  (dd) => dd._id === itm?.type
                                )?.name
                              }
                            </li>
                            <li className="text-[#5A5A5A] text-[17px] mb-2 flex">
                              <span className="w-[100px]">Source:</span>{" "}
                              {
                                dropdownOptions?.find(
                                  (dd) => dd._id === itm?.source
                                )?.name
                              }
                            </li>
                            <li className="text-[#5A5A5A] text-[17px] mb-2 flex">
                              <span className="w-[100px]"> Year:</span>{" "}
                              {itm?.year}{" "}
                            </li>
                            <li className="text-[#5A5A5A] text-[17px]  mb-2 flex">
                              <span className="w-[100px]"> Status:</span>
                              <span className="text-[#5A5A5A] font-[600] ms-1 capitalize">
                                {formData?.request_status === "accepted"
                                  ? "Bookaroo verified"
                                  : `${formData?.request_status || "pending"}`}
                              </span>
                            </li>
                            {itm?.document?.length > 0 && (
                              <li className="text-[#5A5A5A] text-[17px] flex">
                                <span className="w-[100px]"> Documents:</span>
                                <span
                                  onClick={() => openDialog(itm)}
                                  className="cursor-pointer text-[#fff]  ms-1 bg-[#976DD0] px-3 py-[3px] rounded-[5px] text-[14px]"
                                >
                                  View
                                </span>
                                <Dialog
                                  open={isOpenDoc}
                                  onClose={() => closeDialog()}
                                  className="relative z-[9999]"
                                >
                                  <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                  <div className="fixed inset-0 flex w-screen items-center justify-center">
                                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                                      <DialogTitle className="p-6">
                                        <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3">
                                          You can check the documents by click
                                          on them
                                        </p>

                                        <div className="mt-6">
                                          <div className="flex  justify-start mt-3 flex-col ">
                                            {dialogDocs?.length > 0 &&
                                              dialogDocs?.map((data, i) => (
                                                <div
                                                  onClick={() => {
                                                    const url = `${process.env.REACT_APP_API_URL}img/${data?.fileName}`;
                                                    window.open(url, "_blank");
                                                  }}
                                                  className="relative cursor-pointer rounded-[5px] bg-[#ebf5ff]  p-3  flex tems-center mb-3"
                                                >
                                                  <img
                                                    src="/assets/img/dummy_doc.png"
                                                    alt="doc"
                                                    className="w-[20px] me-2"
                                                  />
                                                  <p className="text-[14px]">
                                                    {data?.originalname}
                                                  </p>
                                                </div>
                                              ))}
                                          </div>
                                        </div>
                                        <div className="pt-8  flex items-center justify-center">
                                          <button
                                            onClick={() => closeDialog()}
                                            className="bg-primary text-white px-3 py-2  rounded-[7px]"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </DialogTitle>
                                    </DialogPanel>
                                  </div>
                                </Dialog>
                              </li>
                            )}
                          </ul>
                          <div className="flex items-end justify-between flex-col">
                            <h4 className="text-[#28B3AD] text-[25px] font-bold leading-[25px]">
                              {formatCurrency(itm?.price)} €
                            </h4>
                            {!page && (
                              <div className="flex items-center justify-end">
                                <Link
                                  onClick={() => {
                                    if (editMode) editRevenue(itm, i);
                                  }}
                                >
                                  <FiEdit className="text-[20px] me-3" />
                                </Link>
                                <Link
                                  onClick={() => {
                                    if (editMode) removeRevenue(i);
                                  }}
                                >
                                  <AiOutlineDelete className="text-[22px]" />
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center flex-col bg-[#c2a8df4a] max-w-[300px] mx-auto p-[35px] rounded-[5px]">
                  <img
                    src="/assets/img/no-data.png"
                    className="w-[100px]"
                    alt=""
                  />
                  <p className="mt-1">No Data Yet</p>
                </div>
              )}
            </div>
            {id ? (
              <div className="text-end bg-[#f2ecf8] p-5 w-full ">
                <button
                  onClick={save}
                  className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
                >
                  Save change
                </button>
              </div>
            ) : (
              <div className="text-end flex gap-2 justify-end bg-[#f7f4fb] p-5 w-full ">
                <button
                  onClick={draftsave}
                  className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
                >
                  Save As Draft
                </button>
                <button
                  onClick={handleBack}
                  className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn "
                >
                  Next
                </button>
              </div>
            )}
            {msg === `You already have a draft for ${formData?.propertyType} type of property.` ? (
              <SaveDraftModal
                draftModal={draftModal} setdraftModal={setdraftModal} data={formData} step={9} />) : <></>}
          </>
        )}
      </div>
    </>
  );
};

export default Step11;
