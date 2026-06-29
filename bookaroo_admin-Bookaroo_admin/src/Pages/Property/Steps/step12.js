import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Tooltip } from "antd";
import ReactECharts from "echarts-for-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ImageSlider from "../../../components/common/ImageSlider";
import SelectDropdown from "../../../components/common/SelectDropdown";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { capLetter, formatCurrency } from "../../../models/string.models";
import { saveChanges } from "../shared";

const Step12 = ({
  step1,
  setActiveTabIndex,
  formData,
  setFormData,
  editMode = true,
  page,
  backTo,
  dropdownOptions,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scrollRef = useRef(null);
  const [addRenovation, setAddRenovation] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [renovation, setrenovation] = useState({
    title: "",
    description: "",
    price: "",
    status: false,
    images: [],
    document: [],
  });

  const validate = () => {
    if (!formData?.renovation_work || formData?.renovation_work?.length === 0) {
      toast.error("Add renovation work details");
      return false;
    }
    let haserror = false;
    formData?.renovation_work?.map((itm) => {
      if (
        !itm.title?.trim() ||
        !itm.description?.trim() ||
        !itm.price?.trim()
      ) {
        haserror = true;
      }
    });
    if (haserror) {
      toast.error("Enter all mandatory fields");
      return false;
    }
    return true;
  };
  const handleNext = () => {
    // if (!validate()) return
    localStorage.setItem("step1", JSON.stringify(formData));
    if (page) {
      navigate(`/property/${page}/${id}`, {
        state: backTo ? { backTo: "property-requests" } : undefined,
      });
    } else if (id) {
      navigate(`/property/add/${id}/12`);
    } else {
      navigate("/property/add/12");
    }
    setActiveTabIndex(11);
  };
  const handleBack = () => {
    if (page) {
      navigate(`/property/${page}/${id}`, {
        state: backTo ? { backTo: "property-requests" } : undefined,
      });
    } else if (id) {
      navigate(`/property/add/${id}/10`);
    } else {
      navigate("/property/add/10");
    }
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const applyRenovation = (saveAndNew = true) => {
    if (
      !renovation.title?.trim() ||
      !renovation.description?.trim() ||
      !renovation.price?.trim()
    ) {
      return toast.error("Enter all mandatory fields");
    }
    // else if (renovation.images?.length === 0) {
    //   return toast.error("Upload images");
    // }

    if (formData?.renovation_work) {
      setFormData({
        ...formData,
        renovation_work: [...formData?.renovation_work, renovation],
      });
    } else {
      setFormData({
        ...formData,
        renovation_work: [renovation],
      });
    }
    setrenovation({
      title: "",
      description: "",
      price: "",
      status: true,
      images: [],
      document: [],
    });
    if (saveAndNew) {
      setAddRenovation(false);
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
  const applyEditRenovation = () => {
    if (
      !renovation.title?.trim() ||
      !renovation.description?.trim() ||
      !renovation.price?.trim()
    ) {
      return toast.error("Enter all mandatory fields");
    }
    // else if (renovation.images?.length === 0) {
    //   return toast.error("Upload images")
    // }
    let data = [...formData?.renovation_work];
    data[editIndex] = { ...renovation };
    setFormData({
      ...formData,
      renovation_work: data,
    });
    setrenovation({
      title: "",
      description: "",
      price: "",
      status: true,
      images: [],
      document: [],
    });
    setEdit(false);
    setAddRenovation(false);
    setEditIndex(null);
  };
  const removeRenovation = (i) => {
    let data = formData?.renovation_work?.filter((itm, ind) => ind !== i);
    setFormData({
      ...formData,
      renovation_work: data,
    });
  };
  const editRenovation = (itm, i) => {
    setEdit(true);
    setAddRenovation(true);
    setEditIndex(i);
    setrenovation({
      ...itm, document: itm.document || [],
    });
  };
  const ImageUpload = (e) => {
    let files = Array.from(e.target.files);
    // Check total number of files (existing + new)
    if (files.length + renovation.images?.length > 10) {
      toast.error("Maximum 10 images allowed to add");
      return (e.target.value = ""); // Clear file input
    }

    // Check if any file exceeds 10MB
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error("Each image must be smaller than 10MB");
      return (e.target.value = ""); // Clear file input
    }
    const acceptedTypes = ["image/jpeg", "image/png"];
    const filteredFiles = files.filter((file) =>
      acceptedTypes.includes(file.type)
    );
    let invalidFiles = files.filter(
      (file) => !acceptedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0 && files?.length > 1) {
      toast.error(
        "Some files are not valid format and will be ignored.Only JPG and PNG images are allowed."
      );
    }
    if (filteredFiles.length !== files.length && files?.length === 1) {
      toast.error("Only JPG and PNG images are allowed.");
    }
    if (filteredFiles?.length === 0) return;

    loader(true);
    ApiClient.multiImageUpload(
      "upload/multiple-images",
      filteredFiles,
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
        if (data?.length + renovation.images?.length > 10)
          return toast.error("Maximum 10 images allowed to add");
        setrenovation({
          ...renovation,
          images: [...renovation.images, ...data],
        });
      }
      loader(false);
    });
  };
  const docUpload = (e) => {
    let files = Array.from(e.target.files);
    if (files.length + renovation.document.length > 5) {
      toast.error("Maximum 5 documents allowed to add");
      return (e.target.value = ""); // Clear file input
    }
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error("Each document must be smaller than 10MB");
      return (e.target.value = ""); // Clear file input
    }
    loader(true);
    ApiClient.multiImageUpload("upload/multiple-images",
      files, {}, "files").then((res) => {
        if (res.success) {
          const data = res?.files?.map((item) => {
            return {
              fileName: item?.fileName,
              originalname: item?.originalname,
            };
          });
          if (data.length + renovation.document.length > 5) {
            toast.error("Maximum 5 documents allowed to add");
            return (e.target.value = ""); // Clear file input
          }
          setrenovation({
            ...renovation,
            document: [...renovation.document, ...data],
          });
        }
        loader(false);
      });
  };
  const removeDocument = (i, key) => {
    let data = renovation[key]?.filter((_, ind) => ind !== i);
    setrenovation({
      ...renovation,
      [key]: data,
    });
  };
  const closeModal = () => {
    setAddRenovation(false);
    setEdit(false);
    setEditIndex(null);
    setrenovation({
      title: "",
      description: "",
      price: "",
      status: true,
      images: [],
      document: [],
    });
  };

  const [xData, setxData] = useState([]);
  const [yData, setyData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (formData?.renovation_work?.length > 0) {
      const data = formData?.renovation_work;
      const titleMap = {};
      let priceOfAll = 0;

      data.forEach((item) => {
        const title = dropdownOptions?.find(
          (dd) => dd._id === item?.title
        )?.name;
        const price = parseFloat(item.price);
        priceOfAll += price;
        if (titleMap[title]) {
          titleMap[title] += price;
        } else {
          titleMap[title] = price;
        }
      });
      const arrx = Object.values(titleMap);
      const arry = Object.keys(titleMap);
      setxData(arrx);
      setyData(arry);
      setTotal(priceOfAll);
    }
  }, [formData?.renovation_work]);

  const chartData = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: "{b}: {c} €",
    },
    xAxis: {
      type: "value",
      axisLabel: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: "category",
      data: yData,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#6E6B6B",
        fontWeight: 600,
        formatter: function (value) {
          return capLetter(value);
        },
      },
    },
    series: [
      {
        type: "bar",
        data: xData,
        itemStyle: {
          color: function (params) {
            const colors = ["#E2576E", "#76DED9", "#D88C58", "#76DED9"];
            return colors[params.dataIndex];
          },
          borderRadius: [4],
        },
        barWidth: "50%",
        label: {
          show: true,
          position: "right",
          formatter: "{c} €",
          color: "#5A5A5A",
          fontWeight: "600",
        },
      },
    ],
    grid: {
      left: "20%",
      right: "10%",
      top: "20%",
      bottom: "10%",
    },
  };

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

  const save = () => {
    if (!validate()) return
    step1.renovation_work = formData.renovation_work;
    step1.add_more_step = true;
        if (step1?.energymode == "") {
      delete step1.energymode;
    }
    if (step1?.heatingType == "") {
      delete step1.heatingType;
    }
    if (step1?.emission_efficient == "") {
      delete step1.emission_efficient;
    }
    if (step1?.energy_efficient == "") {
      delete step1.energy_efficient;
    }
    if (step1?.usedAs == "") {
      delete step1.usedAs;
    }
    if (step1?.investment?.length == 0 || step1?.investment[0] == "") {
      delete step1.investment
    }
    localStorage.setItem("step1", JSON.stringify(step1));
    saveChanges(step1);
  };

  return (
    <div className=" relative ">
      <div className=" lg:overflow-auto lg:h-[580px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
        {addRenovation ? (
          <div className="">
            <div className="flex justify-between items-start">
              <h4 ref={scrollRef} className="text-[#47525E] text-[24px] font-[600] text-left xl:mb-[50px] lg:mb-[50px] mb-[40px] ">
                Add New Renovation
                <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                  *Mandatory information
                </span>
              </h4>
              <button
                onClick={() => closeModal()}
                className=" ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center "
              >
                <RxCross2 />
              </button>
            </div>
            <div className="md:max-w-[500px] w-[100%]">
              <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                Renovation details
              </label>
              <div className="mb-3">
                <SelectDropdown
                  displayValue="name"
                  placeholder="Select Renovation Type"
                  isClearable={false}
                  intialValue={renovation.title}
                  result={(e) => {
                    setrenovation({
                      ...renovation,
                      title: e.value,
                    });
                  }}
                  options={dropdownOptions?.filter(
                    (itm) => itm?.type === "Renovation"
                  )}
                />
              </div>
              <div className="">
                <h4 className="text-[#47525E] text-[24px] font-[600] text-left xl:mb-[50px] lg:mb-[50px] mb-[40px] ">
                  Add New Renovation
                  <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                    *Mandatory information
                  </span>
                </h4>

                <div className="md:max-w-[500px] w-[100%]">
                  <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                    Renovation details
                  </label>
                  <div className="mb-3">
                    <SelectDropdown
                      displayValue="name"
                      placeholder="Select Renovation Type"
                      isClearable={false}
                      intialValue={renovation.title}
                      result={(e) => {
                        setrenovation({
                          ...renovation,
                          title: e.value,
                        });
                      }}
                      options={dropdownOptions?.filter(itm => (
                        itm?.type === "Renovation"
                      ))}
                    />
                  </div>
                  <div className="">
                    <textarea className="bg-white rounded-[7px] border border-[#976DD0] 
                     p-2 px-3  md:w-[500px] w-full mb-3 text-[#5A5A5A]"
                      placeholder="Description" type="text"
                      value={renovation.description}
                      onChange={(e) => {
                        setrenovation({
                          ...renovation,
                          description: e.target.value,
                        });
                      }}>
                    </textarea>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formatCurrency(renovation.price)}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, '');
                        setrenovation({
                          ...renovation,
                          price: value,
                        });
                      }}
                      className="bg-white rounded-[7px] border border-[#976DD0] 
                     p-2 px-3 h-[44px] md:w-[500px] w-full mb-8 text-[#5A5A5A] pr-14"
                      placeholder="Price"
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500 border-l border-[#976DD0] pl-2">
                      €
                    </span>
                  </div>

                  <div>
                    <div>
                      <label className="text-[#5A5A5A] mb-2 text-[16px] mt-4">
                        Add Images
                      </label>
                      <p className="text-[#000000] font-[600] mt-3  mb-5">
                        Any Image you submit are only used by Bookaroo to certificate
                        the accuracy of the property declared and will never be shared
                        with a thirdparty.
                      </p>
                    </div>
                    {renovation?.images?.length < 10 && (
                      <div className="relative cursor-pointer mb-6">
                        <input multiple
                          type="file"
                          name="file"
                          className="placeholder-set opacity-0	z-[1] w-[100%] h-[150px] relative "
                          accept="image/*"
                          onChange={ImageUpload}
                        />
                        <label className="bg-[#E7E6E4] lg:max-w-[500px] w-[100%] h-[150px] block flex items-center justify-center absolute top-0">
                          <FiPlusCircle className="flex items-center justify-center w-[60px] h-full mx-auto text-[#bd63c3] font-[600]" />{" "}
                        </label>
                      </div>
                    )}
                    {renovation?.images?.map((itm, i) => (
                      <div className="relative mb-6">
                        <img src={`${process.env.REACT_APP_API_URL}img/${itm?.fileName}`} alt="" className="h-[200px] object-contain bg-[#e7e6e4] w-full mb-2 p-3 " />
                        <p>{itm?.originalname}</p>
                        <Link onClick={() => removeDocument(i, "images")} className="absolute -top-[10px] -right-[13px]  rounded-full">
                          <AiOutlineDelete className="text-[20px] p-[6px] w-[30px] h-[30px] text-white rounded-[50px] bg-[#c2a8df]" />
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div>
                      <label className="mt-4 text-[#5A5A5A] mb-2 text-[16px] mt-4">
                        Add proofing documents
                      </label>
                      <p className="text-[#000000] font-[600] mt-3  mb-5">
                        Any document you submit are only used by Bookaroo to certificate
                        the accuracy of the revenus declared and will never be shared
                        with a thirdparty.
                      </p>
                    </div>
                    {renovation?.document?.length < 5 && (
                      <div className="relative cursor-pointer">
                        <input
                          multiple
                          type="file"
                          name="file"
                          className="placeholder-set opacity-0 z-[1] w-[100%] h-[150px] relative "
                          onChange={docUpload}
                        />
                        <label className="bg-[#E7E6E4] lg:max-w-[500px] w-[100%] h-[150px] block flex items-center justify-center absolute top-0">
                          <FiPlusCircle className="flex items-center justify-center w-[60px] h-full mx-auto text-[#bd63c3] font-[600]" />{" "}
                        </label>
                      </div>
                    )}

                    <div className="flex items-start mt-3">
                      {renovation?.document?.map((itm, i) => (
                        <div className="relative cursor-pointer w-[40px] me-5">
                          <img
                            src="/assets/img/dummy_doc.png"
                            alt="doc"
                            className="w-[40px]"
                          />
                          <Tooltip placement="bottom" title={<>{itm?.originalname}</>}>
                            <p className="ellipses text-[14px]">{itm?.originalname}</p>
                          </Tooltip>
                          <Link
                            onClick={() => removeDocument(i, "document")}
                            className="absolute -top-[8px] -right-[2px] rounded-full"
                          >
                            <AiOutlineDelete className="text-[20px] p-[5px] w-[25px] h-[25px] text-white rounded-[50px] bg-[#c2a8df]" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:max-w-[500px] w-[100%] mx-auto mt-8 pb-8">
                    <div className="flex flex-col items-center justify-center">
                      <button
                        onClick={() => edit ? applyEditRenovation() : applyRenovation()}
                        className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn "
                      >
                        {edit ? "Update" : "Save And Close"}
                      </button>
                      {edit ? ("") : (
                        <Link
                          className="text-[#976DD0] text-[15px] font-[600] mt-3 mb-10"
                          onClick={() => applyRenovation(false)}
                        >
                          Save and create new renovation
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <h4 className="text-[#47525E] text-[24px] font-[600] xl:mb-[50px] lg:mb-[50px] mb-[40px] md:max-w-[500px] w-[100%] leading-[29px]">
                What improvement have you made to your property?
                <span className="text-[#47525E] font-[400] block text-[14px] mt-1 block">
                  *Mandatory information
                </span>
                <p className="font-[400]  text-[16px] text-[#5A5A5A] mb-7 mt-5  xl:w-[500px] w-[100%]">
                  Providing this information will increase trust, value and
                  attractivity of your property
                </p>
              </h4>
              {addRenovation ? (
                <button
                  onClick={() => closeModal()}
                  className="absolute right-0 top-0 ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center "
                >
                  <RxCross2 />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (editMode) setAddRenovation(true);
                  }}
                  className="rounded-[50px] border border-[#976DD0] p-2 text-[#787878] w-[200px] text-[14px] "
                >
                  Add New Renovation
                </button>
              )}
            </div>

            {formData?.renovation_work &&
              formData?.renovation_work?.length > 0 ? (
              <>
                <div className="md:max-w-[500px] w-[100%] mb-10">
                  <div className="bg-white rounded-[5px] p-3">
                    <h4 className="text-center text-[#28B3AD] text-[25px] font-bold leading-[35px] mb-4">
                      {formatCurrency(formData?.renovation_work?.length) || 0}{" "}
                      Renovation works
                    </h4>
                    <p className="text-[#5A5A5A] text-[17px] text-center">
                      <span className="text-[#5A5A5A] font-[600] ms-1">
                        {formatCurrency(total)} €{" "}
                      </span>
                      of investment made for the property
                    </p>
                    <div>
                      <ReactECharts
                        option={chartData}
                        style={{ height: 200, width: "100%" }}
                        opts={{ renderer: "canvas" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="md:max-w-[500px] w-[100%]">
                  {formData?.renovation_work &&
                    formData?.renovation_work?.map((itm, i) => {
                      let images = itm?.images?.map((dd) => dd?.fileName);
                      return (
                        <div className="bg-white rounded-[5px] mb-10">
                          <ImageSlider images={images} />
                          <div className="p-4">
                            <h4 className="text-[#31373E] font-[600] text-[20px] mb-2">
                              {capLetter(dropdownOptions?.find((dd) => dd._id === itm?.title)?.name)}
                            </h4>
                            <p className="text-[#31373E] mb-2 ellipses max-w-unset">
                              {capLetter(itm?.description)}
                            </p>
                            <h5 className="mb-2">
                              Status:{" "}
                              <span className="font-[600] ms-2 font-italic capitalize">
                                {editMode && !formData?.add_more_step
                                  ? "Invoice Bookaroo verified"
                                  : formData?.request_status === "accepted"
                                    ? "Invoice Bookaroo verified"
                                    : `${formData?.request_status ||
                                    "Invoice Bookaroo verified"
                                    }`}
                              </span>
                            </h5>
                            <h5>
                              <span>
                                {moment(formData?.createdAt || new Date()).format("MMMM YYYY")}
                              </span>
                            </h5>

                            <div className="flex items-center justify-between mt-4">
                              <p className="text-[#31373E] text-[25px] font-[600]">
                                {formatCurrency(itm?.price)} €
                              </p>
                              {itm?.document?.length > 0 && (
                              <div
                                key={i}
                                className="w-[15%] bg-white rounded-[7px] border p-2 px-3  text-[#5A5A5A] h-[44px]"
                              >
                                <Link onClick={() => openDialog(itm)}>View</Link>
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
                                          You can check the documents by click on
                                          them
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
                              </div>
                            )}
                              {!page && (
                                <div className="flex items-center justify-end">
                                  <Link
                                    onClick={() => {
                                      if (editMode) editRenovation(itm, i);
                                    }}
                                  >
                                    <FiEdit className="text-[20px] me-3" />
                                  </Link>
                                  <Link
                                    onClick={() => {
                                      if (editMode) removeRenovation(i);
                                    }}
                                  >
                                    <AiOutlineDelete className="text-[20px] " />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
          </>
        )}
      </div>

      {!addRenovation && (
        <>
          {page === "detail" ? (
            ""
          ) : id ? (
            <div className="text-end  bg-[#f7f4fb] p-5 w-full ">
              <button
                onClick={save}
                className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
              >
                Save change
              </button>
            </div>
          ) : (
            <div className="text-end  bg-[#f7f4fb] p-5 w-full flex justify-end">
              <button
                onClick={handleBack}
                className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 me-4"
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
        </>
      )}
    </div>
  );
};

export default Step12;
