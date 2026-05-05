import {
  Checkbox,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { imagePath, stringSeprator } from "../../models/string.model";
import loader from "../../methods/loader";
import ApiClient from "../../methods/api/apiClient";
import { toast } from "react-toastify";
import { getRandomCode } from "../../models/shared.units";
import { LuEye } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import { Tooltip } from "antd";
import { IoMdCheckmark } from "react-icons/io";

export default function SellerfileModal({
  value,
  onClose = () => { },
  result = (_) => { },
  card,
}) {
  const [propertyLoader, setPropertyLoader] = useState(false);
  const [form, setForm] = useState({
    identityProof: [],
    familySituation: [],
    addressProof: [],
    carrezLaw: [],
    technicalDiagnostic: [],
    coOwnership: [],
    personalContribution: [],
    condominiumBooklet: [],
    minutesOfGeneral: [],
    titleDeed: [],
    otherDocs: [],
  });

  const onSubmit = () => {
    let value = {};
    Object.keys(form).map((key) => {
      value[key] = form[key].filter((itm) => itm.checked);
    });
    loader(true);
    const filter = {
      interestId: card?._id,
      interestUpdatedTime: new Date(),
      funnelStatus:"document send by owner",
      documents:value
    };
    ApiClient.put("interests/statusChange", filter).then((res) => {
      if (res.success) {
        onClose()
        result()
      }
      loader(false)
    }
    );

  };


  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    let files = Array.from(e.target.files);
    // validate max limit files
    // if (files.length + form[key]?.length > maxLimit) {
    //   toast.error(`Maximum ${maxLimit} files allowed to add`);
    //   return e.target.value = "";
    // }
    // validate max size
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`Each file must be smaller than ${maxSize}MB`);
      return (e.target.value = "");
    }

    loader(true);
    ApiClient.multiImageUpload(
      "upload/multiple-images",
      files, // filteredFiles,
      {},
      "files"
    )
      .then((res) => {
        if (res.success) {
          const data = res?.files?.map((item) => {
            return {
              fileName: item?.fileName,
              originalname: item?.originalname,
              property: value.propertyId,
              id: getRandomCode(16),
              checked: true,
            };
          });
          // if (data?.length + form[key]?.length > maxLimit) return toast.error(`Maximum ${maxLimit} files allowed to add`);
          let sman = { ...form };
          sman = {
            ...sman,
            [key]: [...data, ...(sman[key]?.length ? sman[key] : [])],
          };
          setForm((sman) => {
            return {
              ...sman,
              [key]: [...data, ...(sman[key]?.length ? sman[key] : [])],
            };
          });
          handleSubmit(sman);
        }
      })
      .catch((er) => console.log("err in file upload", er))
      .finally(() => {
        loader(false);
        e.target.value = "";
      });
  };

  const personalInfo = [
    {
      name: "Proof of identity",
      description:
        "Legal document required to visit a property and also bring trust to seller.",
      description2: "Could be an identity card or passport.",
      key: "identityProof",
      maxLimit: 1,
    },
    {
      name: "Proof of family situation",
      description: "This document will help better understand your situation",
      description2:
        "Could be marriage certificate, civil partnership certificate (issued by your local Mairie), family record book.",
      key: "familySituation",
      maxLimit: 1,
    },
    {
      name: "Proof of current address",
      description: "This document will help better understand your situation",
      description2:
        "Could be a less than 3 months old telephone, water or electricity bill.",
      key: "addressProof",
      maxLimit: 1,
    },
  ];

  const propertyInfo = [
    {
      name: "The Carrez law surface certificate",
      description: "Mandatory document",
      key: "carrezLaw",
      maxLimit: 10,
    },
    {
      name: "Technical Diagnostic File",
      description:
        "DPE, asbestos, termites, merule, gas, lead, ERP, electricity",
      key: "technicalDiagnostic",
      maxLimit: 1,
    },
    {
      name: "Co-ownership regulations",
      description: "Documents describing the rules governing joint ownership..",
      key: "coOwnership",
      maxLimit: 10,
    },
    {
      name: "Personal contribution",
      description:
        "Proof of any personal contribution: home savings plan (PEL), family loan/donation, inheritance, etc.",
      key: "personalContribution",
      maxLimit: 10,
    },
    {
      name: "The condominium maintenance booklet",
      description: "Condominium maintenance booklet",
      key: "condominiumBooklet",
      maxLimit: 10,
    },
    {
      name: "Minutes of general meetings of co-owners",
      description: "Ideally the last 3 years of general meetings.",
      key: "minutesOfGeneral",
      maxLimit: 10,
    },
    {
      name: "Title deed",
      description: "Mandatory document",
      key: "titleDeed",
      maxLimit: 10,
    },
    {
      name: "Any other relevant document",
      description: "Rental contract for a propery sold rented...",
      key: "otherDocs",
      maxLimit: 10,
    },
  ];

  const viewDoc = (fileName) => {
    const url = imagePath(fileName);
    window.open(url, "_blank");
  };

  const fileList = useCallback(
    (key) => {
      let arr = [];
      if (form?.[key]?.length) arr = form?.[key] || [];
      return arr;
    },
    [form]
  );

  const deleteDoc = (i, key) => {
    let data = form[key]?.filter((itm) => itm.id != i);
    let sman = { ...form };
    sman = {
      ...sman,
      [key]: data,
    };
    setForm(sman);
    handleSubmit(sman);
  };

  const handleSubmit = (form) => {
    loader(true);
    const payload = {
      sellerFiles: form,
      id: value.propertyId,
    };
    ApiClient.put("property/editProperty", payload)
      .then((res) => {
        if (res.success) {
          toast.success("Seller File Updated Successfully");
        }
      })
      .catch((err) => { })
      .finally(() => {
        loader(false);
      });
  };


  const updateCheckbox = (key = "", index) => {
    const updatedItems = [...form[key]];
    updatedItems[index].checked = !updatedItems[index].checked;
    const updatedForm = {
      ...form,
      [key]: updatedItems,
    };
    setForm(updatedForm);

    const allSelected = Object.values(updatedForm).every((category) =>
      category.every((file) => file.checked)
    );
    setSelectAll(allSelected);
  };

  useEffect(() => {
    if (value.propertyId) {
      setPropertyLoader(true);
      ApiClient.get("property/detail", {
        id: value.propertyId,
      }).then((res) => {
        setPropertyLoader(false);
        if (res.success) {
          let data = res.data?.propertyDetail;

          let payload = {};
          Object.keys(form).map((key) => {
            payload[key] = (data.sellerFiles?.[key] || []).map((itm) => ({
              ...itm,
              checked: true,
            }));
          });
          setForm({
            ...payload,
          });
        }
      });
    }
  }, []);

  const [selectall, setSelectAll] = useState(true);

  const selectAllDocs = (isChecked) => {
    setSelectAll(isChecked);
    setForm((prevDocs) => {
      const updatedDocs = {};
      for (const [key, files] of Object.entries(prevDocs)) {
        updatedDocs[key] = files.map((file) => ({ ...file, checked: isChecked }));
      }
      return updatedDocs;
    });
  };


  return (
    <>
      <Dialog
        open={true}
        onClose={() => onClose()}
        className="relative z-[9999]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/10" />
        <div className="fixed inset-0 flex w-screen items-center justify-center  p-3">
          <DialogPanel className="max-w-[900px] w-full bg-white rounded-[20px] mx-5  ">
            <DialogTitle className="p-6 pb-0 flex">
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 w-full">
                Seller file
              </p>
              {/* <span class="material-symbols-outlined ml-auto cursor-pointer" onClick={()=>onClose()}>close</span> */}
            </DialogTitle>
            <div className="p-4 xl:h-[600px] max-h-[400px] overflow-auto">
              <div>
                <h2 className="text-[#000000] font-[600] text-[22px] mb-5">
                  Personal information
                </h2>
                <div className="inline-flex justify-end items-center ml-5">
                  <input
                    type="checkbox"
                    checked={selectall ? true : false}
                    onChange={(e) => selectAllDocs(e.target.checked)}
                    id="selectAll"
                    className="mr-2"
                  />
                  <label htmlFor="selectAll">Select All</label>
                </div>
                <div className="grid grid-cols-12 md:gap-10 gap-0">
                  {propertyLoader ? (
                    <>
                      {personalInfo.map((item) => {
                        return (
                          <div
                            key={item.key}
                            className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3"
                          >
                            <div className="shine h-[205px]"></div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {personalInfo.map((item) => {
                        return (
                          <div
                            key={item.key}
                            className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3 relative border"
                          >
                            <div className="p-5 border-b border-[#D5D5D5]">
                              <h4 className="text-[#47525E] text-[19px] font-semibold">
                                {item.name}
                              </h4>
                              <p className="text-[#47525E] my-2 text-[13px]">
                                {item.description}
                              </p>
                              <p className="text-[#47525E] italic text-[12px] min-h-[54px]">
                                {item.description2}
                              </p>
                            </div>
                            {fileList(item.key).map((itm, i) => (
                              <div>
                                <div className="absolute -top-2 -right-2">
                                  <Checkbox
                                    checked={itm?.checked}
                                    // value={itm?.checked}
                                    onChange={() => updateCheckbox(item.key, i)}
                                    className="group block size-6 rounded-full border bg-white data-[checked]:text-white data-[checked]:bg-[#976DD0] cursor-pointer flex items-center justify-center"

                                  >
                                    {itm?.checked ? <IoMdCheckmark className="font-[600]" /> : ""}

                                  </Checkbox>

                                  {/* <input id="default-checkbox"
                                                       checked={itm?.checked || false}
                                                        onChange={()=>updateCheckbox(item.key,i)}
                                                        type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> */}
                                </div>
                                <div className="p-5 flex justify-between items-center ">
                                  <div className="flex items-center gap-2">
                                    <BsFiletypePdf className="text-[20px] shrink-0" />
                                    <span className="text-[#383A3D] text-[12px] ellipses leading-[24px]">
                                      {stringSeprator(itm.originalname, 30)}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Tooltip placement="top" title="Preview">
                                      <span
                                        title="Preview"
                                        onClick={() => viewDoc(itm.fileName)}
                                        className="cursor-pointer text-[#383A3D] text-[16px] me-2"
                                      >
                                        <LuEye />
                                      </span>
                                    </Tooltip>

                                    <Tooltip placement="top" title="Delete">
                                      <p
                                        title="Delete"
                                        onClick={() =>
                                          deleteDoc(itm.id, item.key)
                                        }
                                        className="cursor-pointer text-[#383A3D] text-[16px]"
                                      >
                                        <AiOutlineDelete />
                                      </p>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {fileList(item.key)?.length < item.maxLimit && (
                              <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                                <label className="relative  h-full w-full">
                                  <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                    Upload document
                                  </p>
                                  <input
                                    type="file"
                                    name="file"
                                    className="opacity-0 w-full h-[64px]"
                                    multiple={item.maxLimit > 1}
                                    onChange={(e) =>
                                      ImageUpload(e, item.key, item.maxLimit)
                                    }
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-[#000000] font-[600] text-[22px] mt-5">
                  Property legal information
                </h2>
                <p className="text-black mb-5 text-[12px] max-w-2xl">
                  These documents must be provided for each co-borrower and
                  enable to check that your accounts are properly kept and that
                  you are in good financial health overall.
                </p>

                <div className="grid grid-cols-12 md:gap-10 gap-0">
                  {propertyLoader ? (
                    <>
                      {propertyInfo.map((item) => {
                        return (
                          <div
                            key={item.key}
                            className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3"
                          >
                            <div className="shine h-[205px]"></div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {propertyInfo.map((item) => {
                        return (
                          <div
                            key={item.key}
                            className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3 border relative flex justify-between flex-col  "
                          >
                            <div>
                              <div className="p-5 border-b border-[#D5D5D5]">
                                <h4 className="text-[#47525E] text-[16px] font-semibold h-[45px]">
                                  {item.name}
                                </h4>
                                <p className="text-[#47525E] mt-2 text-[12px] h-[36px]">
                                  {item.description}
                                </p>
                              </div>
                              {fileList(item.key)?.length > 0 && (
                                <div>
                                  <ul className="p-5">
                                    {fileList(item.key)?.map((itm, i) => (
                                      <li className="mb-3 ">
                                        <div className="absolute -top-2 -right-2">
                                          <Checkbox
                                            checked={itm?.checked}
                                            // value={itm?.checked}
                                            onChange={() =>
                                              updateCheckbox(item.key, i)
                                            }
                                            className="group block size-6 rounded-full border bg-white data-[checked]:text-white data-[checked]:bg-[#976DD0] cursor-pointer flex items-center justify-center"

                                          >
                                            {itm?.checked ? <IoMdCheckmark className="font-[600]" /> : ""}

                                          </Checkbox>
                                          {/* <input
                                            id="default-checkbox"
                                            checked={itm?.checked || false}
                                            onChange={() =>
                                              updateCheckbox(item.key, i)
                                            }
                                            type="checkbox"
                                            value=""
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                          /> */}
                                        </div>
                                        <div className=" flex justify-between  items-center  md:mb-0 mb-5">
                                          <div className="flex items-center gap-2">
                                            <BsFiletypePdf className="text-[20px] shrink-0" />
                                            <span className="text-[#383A3D] text-[12px] ellipses leading-[24px]">
                                              {stringSeprator(
                                                itm.originalname,
                                                30
                                              )}
                                            </span>
                                          </div>
                                          <div className="flex items-center">
                                            <Tooltip
                                              placement="top"
                                              title="Preview"
                                            >
                                              <span
                                                title="Preview"
                                                onClick={() =>
                                                  viewDoc(itm.fileName)
                                                }
                                                className="cursor-pointer text-[#383A3D] text-[16px] me-2"
                                              >
                                                <LuEye />
                                              </span>
                                            </Tooltip>
                                            <Tooltip
                                              placement="top"
                                              title="Delete"
                                            >
                                              <p
                                                title="Delete"
                                                onClick={() =>
                                                  deleteDoc(itm.id, item.key)
                                                }
                                                className="cursor-pointer text-[#383A3D] text-[16px]"
                                              >
                                                <AiOutlineDelete />
                                              </p>
                                            </Tooltip>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            {/* <div>
                                <p className="text-center text-[#333] text-[14px]">No Documents</p>
                            </div> */}
                            {fileList(item.key)?.length < item.maxLimit && (
                              <div className="flex justify-center h-[64px] border-t border-[#D5D5D5] bottom-0 cursor-pointer ">
                                <label className="relative  h-full w-full">
                                  <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                    Upload document
                                  </p>
                                  <input
                                    type="file"
                                    name="file"
                                    className="opacity-0 w-full h-[64px]"
                                    multiple={item.maxLimit > 1}
                                    onChange={(e) =>
                                      ImageUpload(e, item.key, item.maxLimit)
                                    }
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex border-t p-3 justify-between">
              <button
                onClick={() => onClose()}
                className="text-[#868389] text-[18px] underline"
              >
                Close
              </button>
              <div>
                <button
                  onClick={() => onSubmit()}
                  className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                >
                  Send Seller Files
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
