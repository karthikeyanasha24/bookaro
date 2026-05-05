import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Tooltip } from "antd";
import ReactECharts from 'echarts-for-react';
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit, FiPlusCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SelectDropdown from "../../../components/common/SelectDropdown";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { saveChanges } from "../shared";
import { formatCurrency } from "../../../models/string.models";

const Step10 = ({ step1,
  setActiveTabIndex, formData, setFormData,
  editMode = true, page, backTo, dropdownOptions,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const scrollRef = useRef(null);
  const [addRevenue, setAddRevenue] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
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
        !itm.year?.trim() ||
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

  const handleNext = () => {
    // if (!validate()) return
    localStorage.setItem("step1", JSON.stringify(formData));
    if (page) {
      navigate(`/property/${page}/${id}`, {
        state: backTo ? { backTo: "property-requests" } : undefined,
      });
    } else if (id) {
      navigate(`/property/add/${id}/11`)
    } else {
      navigate("/property/add/11")
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 10));
  };

  const handleBack = () => {
    if (page) {
      navigate(`/property/${page}/${id}`, {
        state: backTo ? { backTo: "property-requests" } : undefined,
      });
    } else if (id) {
      navigate(`/property/add/${id}/9`)
    } else {
      navigate("/property/add/9")
    }
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const applyRevenue = (saveAndNew = true) => {
    if (
      !revenue.type?.trim() ||
      !revenue.source?.trim() ||
      !revenue.year?.trim() ||
      !revenue.price?.trim()
    ) {
      return toast.error("Enter all mandatory fields");
    }
    //  else if (revenue.document?.length === 0) {
    //   return toast.error("Upload documents")
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
      status: true,
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
      !revenue.year?.trim() ||
      !revenue.price?.trim()
    ) {
      return toast.error("Enter all mandatory fields");
    }
    //  else if (revenue.document?.length === 0) {
    //   return toast.error("Upload documents")
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
      status: true,
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
  const currentYear = new Date().getFullYear();
  const generateYears = () => {
    const years = [];
    for (let year = +currentYear; year >= 1950; year--) {
      years.push({ id: `${year}`, name: `${year}` });
    }
    return years;
  };
  const ImageUpload = (e) => {
    let files = Array.from(e.target.files);
    if (files.length + revenue.document.length > 5) {
      toast.error("Maximum 5 documents allowed to add");
      return e.target.value = ""; // Clear file input
    }
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error("Each document must be smaller than 10MB");
      return e.target.value = ""; // Clear file input
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
            originalname: item?.originalname
          }
        });
        if (data.length + revenue.document.length > 5) {
          toast.error("Maximum 5 documents allowed to add");
          return e.target.value = ""; // Clear file input
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
      ...revenue, document: data,
    });
  }
  const closeModal = () => {
    setAddRevenue(false);
    setEdit(false);
    setEditIndex(null);
    setrevenue({
      type: "",
      source: "",
      year: "",
      price: "",
      status: true,
      document: [],
    });
  }

  const [xData, setxData] = useState([])
  const [yData, setyData] = useState([])
  useEffect(() => {
    if (formData?.revenue_detail?.length > 0) {
      const data = formData.revenue_detail;
      const yearMap = {};
      data.forEach(item => {
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
  }, [formData?.revenue_detail])
  const chartData = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}: {c} €',
    },
    xAxis: {
      data: xData,
    },
    yAxis: {
      type: 'value',
      axisLabel: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: yData,
        itemStyle: {
          borderRadius: [12],
          color: function (params) {
            return params.dataIndex % 2 === 0 ? '#3FCEAB' : '#409781';
          },
        },
        barWidth: '50%',
        label: {  // bar top text
          show: true,
          position: 'top',
          formatter: '{c} €',
          color: '#6E6B6B',
        },
      },
    ],
  };

  const revenueResult = Object.values(
    (formData?.revenue_detail || []).reduce((acc, item) => {
      const price = parseFloat(item?.price);
      const dropdownItem = dropdownOptions?.find(option => option?._id === item?.type);
      if (acc[item?.type]) {
        acc[item?.type].price += price;
      } else {
        acc[item?.type] = {
          type: item?.type,
          price: price,
          name: dropdownItem ? dropdownItem?.name : "Unknown"
        };
      }
      return acc;
    }, {})
  );
  const totalRevenue = revenueResult?.reduce((sum, item) => sum + item?.price, 0);
  const [isOpenDoc, setIsOpenDoc] = useState(false)
  const [dialogDocs, setDialogDocs] = useState([])
  const openDialog = (itm) => {
    setIsOpenDoc(true)
    setDialogDocs(itm?.document)
  }
  const closeDialog = () => {
    setIsOpenDoc(false)
    setDialogDocs([])
  }

  const save = () => {
    // if (!validate()) return
    step1.revenue_detail = formData.revenue_detail;
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
    localStorage.setItem("step1", JSON.stringify(step1))
    saveChanges(step1)
  }
  return (
    <>
      <div className=" flex justify-between flex-col h-full relative">
       

        {addRevenue ? (
          <div className="lg:overflow-auto lg:h-[640px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10 text-[#47525E] text-[24px] font-[600] ">
            <h4 ref={scrollRef} className="text-[#47525E] text-[24px] font-[600] text-left xl:mb-[50px] lg:mb-[50px] mb-[40px] ">
              Add new revenue to your property
              <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                *Mandatory information
              </span>
              <p className="font-[400]  text-[16px] text-[#5A5A5A] mb-7 mt-5  xl:w-[500px] w-[100%]">
                Adding and getting your revenues verified by Bookaroo increases
                trust and add more value to your property{" "}
              </p>
            </h4>
            <div className="lg:max-w-[500px] w-[100%]">
              <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                Revenue details
              </label>
              <div className="flex items-center flex-wrap  justify-center">
                <div class="xl:max-w-[500px] w-[100%] mb-3">
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
                    options={dropdownOptions?.filter(itm => (
                      itm?.type === "Revenue"
                    ))}
                  />
                </div>
                <div class="xl:max-w-[500px] w-[100%] mb-3">
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
                    options={dropdownOptions?.filter(itm => (
                      itm?.type === "Revenue-Source"
                    ))}
                  />
                </div>
                <div class="xl:max-w-[500px] w-[100%] mb-3">
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
                    options={generateYears()}
                  />
                </div>
                <div class="xl:max-w-[500px] w-[100%] mb-3 relative">
                  <input
                    type="text"
                    value={formatCurrency(revenue.price)}
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^0-9]/g, '');
                      setrevenue({
                        ...revenue,
                        price: value,
                      });
                    }}
                    className={`bg-white rounded-[7px] border border-[#976DD0] 
                     p-2 px-3 h-[44px] md:w-[500px] w-full mb-4 text-[#5A5A5A] pr-14`}
                    placeholder="Yearly amount"
                  />
                  <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">€</span>
                </div>
              </div>
              <div>
                <label className="text-[#5A5A5A] mb-2 text-[16px]">
                  Add proofing documents
                </label>
                <p className="text-[#000000] font-[600] mt-3  mb-5">
                  Any document you submit are only used by Bookaroo to certificate
                  the accuracy of the revenus declared and will never be shared
                  with a thirdparty.
                </p>
              </div>
              {revenue?.document?.length < 5 && (
                <div className="relative cursor-pointer">
                  <input multiple
                    type="file"
                    name="file"
                    className="placeholder-set opacity-0	z-[1] w-[100%] h-[150px] relative "
                    // accept=".pdf, .doc, .docx,"
                    onChange={ImageUpload}
                  />
                  <label className="bg-[#E7E6E4] lg:max-w-[500px] w-[100%] h-[150px] block flex items-center justify-center absolute top-0">
                    <FiPlusCircle className="flex items-center justify-center w-[60px] h-full mx-auto text-[#bd63c3] font-[600]" />{" "}
                  </label>
                </div>
              )}
              <div className='flex items-center mt-3'>
                {revenue?.document?.map((itm, i) => (
                  <div>
                    <div key={i} className="relative cursor-pointer w-[40px] me-5">
                      <img src="/assets/img/dummy_doc.png"
                        alt="doc" className="w-[40px]" />
                      <Tooltip placement="bottom" title={<>{itm?.originalname}</>}>
                        <p className="ellipses text-[14px]">{itm?.originalname}</p>
                      </Tooltip>
                      <Link onClick={() => removeDocument(i)} className="absolute -top-[8px] -right-[2px] rounded-full">
                        <AiOutlineDelete className="text-[20px] p-[5px] w-[25px] h-[25px] text-white rounded-[50px] bg-[#c2a8df]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mx-auto block mt-8 pb-8">
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
        ) : (
          <>
           <div className=" lg:overflow-auto lg:h-[580px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
           <div className="flex justify-between items-start lg:flex-row flex-col-reverse">
           <h4 className="text-[#47525E] text-[24px] font-[600] text-left  leading-[30px] xl:max-w-[500px] lg:max-w-[400px] md:max-w-[300px] w-[100%] md:mt-[-4px]  ">
                How much revenues your property generated over the years?
                <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                  *Mandatory information
                </span>
                <p className="font-[400]  text-[16px] text-[#5A5A5A] mb-7 mt-5  xl:w-[500px] w-[100%]">
                  Providing this information will increase both the value and the
                  attractivity of your property
                </p>
              </h4>
              {addRevenue ? (
          <button onClick={() => closeModal()} className="absolute right-0 top-0 ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center ">
            <RxCross2 /></button>
        ) : (
          <button disabled={!editMode} onClick={() => {
            if (editMode) setAddRevenue(true)
          }} className="rounded-[50px] border border-[#976DD0] p-2 text-[#787878] w-[200px] text-[14px] "
          >
            Add New Revenues
          </button>
        )}
              </div>
              {formData?.revenue_detail?.length > 0 ? (
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
                      {revenueResult?.map(itm => (
                        <div className="bg-[#3FCEAB]  py-4 px-3 rounded-[12px] w-[150px] h-[130px]">
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
                      <div className="md:max-w-[500px] w-[100%]">
                        <ReactECharts
                          option={chartData}
                          style={{ height: 400, width: 500 }}
                          opts={{ renderer: 'svg' }}
                        />
                      </div>
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
                            <li className="text-[#5A5A5A] text-[16px] mb-2 flex">
                              <span className="w-[110px]">Type:</span> {dropdownOptions?.find(dd => dd._id === itm?.type)?.name}
                            </li>
                            <li className="text-[#5A5A5A] text-[16px] mb-2 flex">
                              <span className="w-[110px]">Source:</span> {dropdownOptions?.find(dd => dd._id === itm?.source)?.name}
                            </li>
                            <li className="text-[#5A5A5A] text-[16px] mb-2 flex">
                              <span className="w-[110px]"> Year:</span> {itm?.year}{" "}
                            </li>
                            <li className="text-[#5A5A5A] text-[16px] flex  mb-2">
                              <span className="w-[110px]"> Status:</span>
                              <span className="text-[#5A5A5A] font-[600] ms-1 capitalize">
                                {(editMode && !formData?.add_more_step) ? "Bookaroo verified" :
                                  formData?.request_status === "accepted" ?
                                    "Bookaroo verified" :
                                    `${formData?.request_status || "Bookaroo verified"}`}
                              </span>
                            </li>
                            {itm?.document?.length > 0 && (
                              <li className="text-[#5A5A5A] text-[16px] flex">
                                <span className="w-[110px]"> Documents:</span>
                                <span onClick={() => openDialog(itm)} className="cursor-pointer text-[#fff]  ms-1 bg-[#976DD0] px-3 py-[3px] rounded-[5px] text-[14px]" >
                                  View
                                </span>
                                <Dialog
                                  open={isOpenDoc} onClose={() => closeDialog()}
                                  className="relative z-[9999]"
                                >
                                  <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                  <div className="fixed inset-0 flex w-screen items-center justify-center">
                                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                                      <DialogTitle className="p-6">
                                        <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3">
                                          You can check  the documents by click on them
                                        </p>

                                        <div className='mt-6'>
                                          <div className='flex  justify-start mt-3 flex-col '>
                                            {dialogDocs?.length > 0 && dialogDocs?.map((data, i) => (
                                              <div
                                                onClick={() => {
                                                  const url = `${process.env.REACT_APP_API_URL}img/${data?.fileName}`;
                                                  window.open(url, "_blank");
                                                }}
                                                className="relative cursor-pointer rounded-[5px] bg-[#ebf5ff]  p-3  flex tems-center mb-3">
                                                <img src="/assets/img/dummy_doc.png"
                                                  alt="doc" className="w-[20px] me-2" />
                                                <p className="text-[14px]">{data?.originalname}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="pt-8  flex items-center justify-center">
                                          <button onClick={() => closeDialog()} className='bg-primary text-white px-3 py-2  rounded-[7px]'>Cancel</button>
                                        </div>
                                      </DialogTitle>
                                    </DialogPanel>
                                  </div>
                                </Dialog>
                              </li>
                            )}
                          </ul>
                          <div className="flex items-end justify-between flex-col">
                            <h4 className="text-[#28B3AD] text-[20px] font-bold leading-[25px]">
                              {formatCurrency(itm?.price)} €
                            </h4>
                            {!page && (
                              <div className="flex items-center justify-end">
                                <Link onClick={() => {
                                  if (editMode) editRevenue(itm, i)
                                }}>
                                  <FiEdit className="text-[20px] me-3" />
                                </Link>
                                <Link onClick={() => {
                                  if (editMode) removeRevenue(i)
                                }}>
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
                <div className='flex items-center justify-center flex-col bg-[#c2a8df4a] max-w-[300px] mx-auto p-[35px] rounded-[5px]'>
                  <img src='/assets/img/no-data.png' className='w-[100px]' alt='' />
                  <p className='mt-1'>No Data Yet</p>
                </div>
              )}
                
            </div>
            {page === "detail" ? ("") : id ?
              <div className="text-end  bg-[#f7f4fb] p-5 w-full  ">
                <button
                  onClick={save}
                  className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
                >
                  Save change
                </button>
              </div> :
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
              </div>}
          </>
        )}
      </div>
    </>
  );
};

export default Step10;
