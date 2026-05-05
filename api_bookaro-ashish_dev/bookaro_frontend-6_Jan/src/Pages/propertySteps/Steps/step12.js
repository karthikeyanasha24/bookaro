import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { Tooltip } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiPlusCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SelectDropdown from "../../../components/common/SelectDropdown";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { formatCurrency } from "../../../models/string.model";
import { generateYears, saveChanges } from "../shared";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import { useSelector } from "react-redux";
import { RiDraftFill } from "react-icons/ri";
import PropertyCheck from "../propertyCheck";

const Step12 = ({
  step1,
  setActiveTabIndex,
  formData,
  setFormData,
  editMode = true,
  page,
  dropdownOptions,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user)
  const { id } = useParams();
  const scrollRef = useRef(null);
  const [addExpenses, setAddExpenses] = useState(false);
  const [draftModal, setdraftModal] = useState(false)
  const [msg, setMsg] = useState("");
  const [expense, setexpense] = useState({
    type: "",
    year: "",
    price: "",
    document: [],
  });

  const validate = () => {
    if (!formData?.Expenses || formData?.Expenses?.length === 0) {
      toast.error("Add Expenses details");
      return false;
    }
    let haserror = false;
    formData?.Expenses?.map((itm) => {
      if (!itm.type?.trim() || !itm.year?.trim() || !itm.price?.trim()) {
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
      step: 10
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
      navigate(`/property/${page}/${id}?step=13`);
    } else if (id) {
      navigate(`/property/edit/${id}/13`);
    } else {
      navigate("/property/add/13");
    }
    setActiveTabIndex(12);
  };

  const handleBack = () => {
    if (page) {
      navigate(`/property/${page}/${id}`);
    } else if (id) {
      navigate(`/property/edit/${id}/9`);
    } else {
      navigate("/property/add/9");
    }
    setActiveTabIndex(10);
  };

  const applyExpenses = (saveAndNew = true) => {
    if (
      !expense.type?.trim() ||
      !expense.year?.trim() ||
      !expense.price?.trim()
    ) {
      return toast.error("Enter all mandatory fields");
    }
    // else if (expense.document?.length === 0) {
    //   return toast.error("Upload document");
    // }

    if (formData?.Expenses) {
      setFormData({
        ...formData,
        Expenses: [...formData?.Expenses, expense],
      });
    } else {
      setFormData({
        ...formData,
        Expenses: [expense],
      });
    }
    setexpense({
      type: "",
      year: "",
      price: "",
      document: [],
    });
    if (saveAndNew) {
      setAddExpenses(false);
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
  const removeExpense = (i) => {
    let data = formData?.Expenses?.filter((itm, ind) => ind !== i);
    setFormData({
      ...formData,
      Expenses: data,
    });
  };

  const ImageUpload = (e) => {
    let files = Array.from(e.target.files);
    if (files.length + expense.document.length > 5) {
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
          if (data.length + expense.document.length > 5) {
            toast.error("Maximum 5 documents allowed to add");
            return (e.target.value = ""); // Clear file input
          }
          setexpense({
            ...expense,
            document: [...expense.document, ...data],
          });
        }
        loader(false);
      });
  };
  const removeDocument = (ind) => {
    let data = expense.document?.filter((_, i) => i !== ind);
    setexpense({
      ...expense,
      document: data,
    });
  };
  const closeModal = () => {
    setAddExpenses(false);
    setexpense({
      type: "",
      year: "",
      price: "",
      document: [],
    });
  };

  const typeMap = dropdownOptions?.reduce((map, option) => {
    if (option.type === "Expense") {
      map[option.name] = option.id;
    }
    return map;
  }, {});
  const graphTabs = [
    "All",
    ...(dropdownOptions
      ?.filter((itm) => itm?.type === "Expense")
      ?.map((sman) => sman?.name) || []),
  ];
  const [TabIndex, setTabIndex] = useState(0);
  const tabChange = (index) => {
    setTabIndex(index);
  };
  const [xData, setxData] = useState([]);
  const [yData, setyData] = useState([]);
  useEffect(() => {
    if (formData?.Expenses?.length > 0) {
      const data = formData?.Expenses;
      const filteredData =
        TabIndex === 0
          ? data
          : data?.filter(
            (item) => item?.type === typeMap?.[graphTabs?.[TabIndex]]
          );

      const yearMap = {};
      filteredData?.forEach((item) => {
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
  }, [formData?.Expenses, TabIndex]);
  const chartData = {
    title: {
      // text: 'Global average monthly expense over the year',
      text: "Global average yearly expense",
      left: "center",
      top: 0,
      textStyle: {
        color: "#6E6B6B",
        fontSize: 16,
        fontWeight: "bold",
      },
    },
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
  const [startIndex, setStartIndex] = useState(0);
  const tabsToShow = 4;
  const handleLeftArrowClick = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
  const handleRightArrowClick = () => {
    if (startIndex < graphTabs.length - tabsToShow) {
      setStartIndex(startIndex + 1);
    }
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
    step1.Expenses = formData.Expenses;
    step1.add_more_step = true;
    step1.request_status = "pending";
    localStorage.setItem("step1", JSON.stringify(step1))
    saveChanges(step1)
  }

  return (
    <div className=" relative ">
      <PropertyCheck />
      {addExpenses ? (
        <div className=" lg:overflow-auto lg:h-[740px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <div className="flex justify-between items-start">
            <h4 ref={scrollRef} className="text-[#47525E] text-[24px] font-[600] text-left  ">
              Add new Expenses to your property
              <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                *Mandatory information
              </span>
              <p className="font-[400]  text-[16px] text-[#5A5A5A]  mt-5  lg:w-[500px] w-[100%]">
                Adding and getting your revenues verified by Bookaroo increases
                trust and add more value to your property{" "}
              </p>
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
              Expense details
            </label>
            <div className="flex items-center flex-wrap  justify-center">
              <div class="xl:max-w-[500px] w-[100%] mb-3">
                <SelectDropdown
                  displayValue="name"
                  placeholder="Select expense type"
                  isClearable={false}
                  intialValue={expense.type}
                  result={(e) => {
                    setexpense({
                      ...expense,
                      type: e.value,
                    });
                  }}
                  options={dropdownOptions?.filter(
                    (itm) => itm?.type === "Expense"
                  )}
                />
              </div>
              <div class="xl:max-w-[500px] w-[100%] mb-3">
                <SelectDropdown
                  displayValue="name"
                  placeholder="Select expense year"
                  isClearable={false}
                  intialValue={expense.year}
                  result={(e) => {
                    setexpense({
                      ...expense,
                      year: e.value,
                    });
                  }}
                  options={generateYears(null, 1950)}
                />
              </div>
              <div class="xl:max-w-[500px] w-[100%] mb-3 relative">
                <input
                  type="text"
                  value={formatCurrency(expense.price)}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = value.replace(/[^0-9]/g, "");
                    setexpense({
                      ...expense,
                      price: value,
                    });
                  }}
                  className={`bg-white rounded-[7px] border border-[#976DD0]
                  p-2 px-3 md:w-[500px] w-full mb-4 pr-14`}
                  placeholder="Expense price"
                />
                <span className="absolute right-3 top-2 text-gray-500 border-l border-[#976DD0] pl-2">
                  €
                </span>
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
            {expense?.document?.length < 5 && (
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
              {expense?.document?.map((itm, i) => (
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
                    onClick={() => removeDocument(i)}
                    className="absolute -top-[8px] -right-[2px] rounded-full"
                  >
                    <AiOutlineDelete className="text-[20px] p-[5px] w-[25px] h-[25px] text-white rounded-[50px] bg-[#c2a8df]" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-end block mt-10">
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={applyExpenses}
                  className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn "
                >
                  Save and close
                </button>
                <Link
                  className="text-[#976DD0] font-[600] mt-3 mb-10"
                  onClick={() => applyExpenses(false)}
                >
                  Save and create new expanse
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
            <div className="flex justify-between items-start">
              <h4 className="text-[#47525E] text-[24px] font-[600] xl:mb-[50px] lg:mb-[50px] mb-[40px]">
                What is the budget for living in your property?
                <span className="text-[#47525E] font-[400] block text-[14px] mt-1 block">
                  *Mandatory information
                </span>
                <p className="font-[400]  text-[16px] text-[#5A5A5A] mb-7 mt-5  xl:w-[500px] w-[100%]">
                  Providing this information will help potential buyer or
                  renters to estimate their living budget
                </p>
              </h4>
              {addExpenses ? (
                <button
                  onClick={() => closeModal()}
                  className=" ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center "
                >
                  <RxCross2 />
                </button>
              ) : (
                <button
                  disabled={!editMode}
                  onClick={() => {
                    if (editMode) setAddExpenses(true);
                  }}
                  className="rounded-[50px] border border-[#976DD0] p-2 text-[#787878] w-[200px] text-[14px] "
                >
                  Add New Expenses
                </button>
              )}
            </div>
            {formData?.Expenses?.length > 0 ? (
              <>
                {graphTabs?.length > 1 && (
                  <div className="border border-[#8492A6] rounded-[12px] bg-[#F9F9F9] md:max-w-[500px] w-[100%]">
                    <div className="md:max-w-[500px] w-[100%] bg-[#F9F9F9] p-3 rounded-tl-[12px] rounded-tr-[12px]">
                      <h4 className="text-[#39A097] font-[600] text-[20px] text-center">
                        Living Expenses
                      </h4>
                    </div>
                    <TabGroup defaultIndex={TabIndex} onChange={tabChange}>
                      <TabList className="flex-prop bg-[#F9F9F9] p-3 py-6 justify-center flex">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={handleLeftArrowClick}
                            className="px-4 py-2 bg-gray-300 text-white rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
                            disabled={startIndex === 0}
                          >
                            &lt;
                          </button>

                          <div className="flex overflow-hidden">
                            {graphTabs.slice(startIndex, startIndex + tabsToShow)
                              .map((label, index) => {
                                const currentIndex = startIndex + index;
                                return (
                                  <div
                                    onClick={() =>
                                      setTabIndex(startIndex + index)
                                    }
                                    key={index}
                                    className={`tab ${TabIndex === currentIndex
                                      ? "font-semibold text-[#976DD0]"
                                      : "text-[#47525E]"
                                      } mx-3 text-center text-[14px] cursor-pointer`}
                                  >
                                    {label}
                                  </div>
                                );
                              })}
                          </div>

                          <button
                            onClick={handleRightArrowClick}
                            className="px-4 py-2 bg-gray-300 text-white rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
                            disabled={
                              startIndex >= graphTabs.length - tabsToShow
                            }
                          >
                            &gt;
                          </button>
                        </div>
                      </TabList>
                      <TabPanels className="h-full">
                        {graphTabs.map((tabLabel, index) => (
                          <TabPanel key={index} className="h-full">
                            <div
                              style={{ backgroundColor: "#F9F9F9" }}
                              className="rounded-bl-[12px] rounded-br-[12px]"
                            >
                              <ReactECharts
                                option={chartData}
                                style={{ height: 400 }}
                                opts={{ renderer: "svg" }}
                              />
                            </div>
                          </TabPanel>
                        ))}
                      </TabPanels>
                    </TabGroup>
                  </div>
                )}
                <div className="md:max-w-[500px] w-[100%]">
                  <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                    Details
                  </label>
                  <div>
                    {formData?.Expenses?.map((itm, i) => (
                      <ul>
                        <li className="flex gap-3 items-center w-full mb-4">
                          <input
                            disabled={!editMode}
                            type="text"
                            value={formatCurrency(itm.price)}
                            onChange={(e) => {
                              let value = e.target.value;
                              value = value.replace(/[^0-9]/g, "");
                              let data = [...formData.Expenses];
                              data[i] = { ...data[i], price: value };
                              setFormData({
                                ...formData,
                                Expenses: data,
                              });
                            }}
                            className={`bg-white rounded-[7px] border
                            p-2 px-3 w-[20%]  text-[#5A5A5A] h-[44px]`}
                            placeholder="Price"
                          />
                          <div className="w-[20%]">
                            <SelectDropdown
                              disabled={!editMode}
                              displayValue="name"
                              placeholder="Select expense year"
                              isClearable={false}
                              intialValue={itm.year}
                              result={(e) => {
                                let data = [...formData.Expenses];
                                data[i] = { ...data[i], year: e.value };
                                setFormData({
                                  ...formData,
                                  Expenses: data,
                                });
                              }}
                              options={generateYears(null, 1950)}
                              additionalClass={"right_unset left-0 "}
                            />
                          </div>

                          <div className="w-[30%]">
                            <SelectDropdown
                              disabled={!editMode}
                              displayValue="name"
                              placeholder="Select expense type"
                              isClearable={false}
                              intialValue={itm.type}
                              result={(e) => {
                                let data = [...formData.Expenses];
                                data[i] = { ...data[i], type: e.value };
                                setFormData({
                                  ...formData,
                                  Expenses: data,
                                });
                              }}
                              options={dropdownOptions?.filter(
                                (itm) => itm?.type === "Expense"
                              )}
                              additionalClass={"right_unset"}
                            />
                          </div>
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
                            <div>
                              <Link
                                onClick={() => {
                                  if (editMode) removeExpense(i);
                                }}
                              >
                                <AiOutlineDelete className="text-[20px] p-[6px] w-[30px] h-[30px] text-white rounded-[50px] bg-[#c2a8df]" />
                              </Link>
                            </div>
                          )}
                        </li>
                      </ul>
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
                className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 "
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
            <SaveDraftModal draftModal={draftModal} setdraftModal={setdraftModal} data={formData} step={10} />) : <></>}
        </>
      )}
    </div>
  );
};

export default Step12;
