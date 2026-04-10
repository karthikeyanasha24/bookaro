import {
  Description,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";
import methodModel from "../../methods/methods";
import { getRandomCode } from "../../models/shared.units";

const SellerFile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [property, setProperty] = useState([]);

  const id = methodModel.getPrams("id");

  const [selectProperty, setSelectedProperty] = useState(id);
  const [propertyDetail, setPropertyDetail] = useState();
  const [propertyLoader, setPropertyLoader] = useState(false);

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
              property: selectProperty,
              id: getRandomCode(16),
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
  const viewDoc = (fileName) => {
    const url = imagePath(fileName);
    window.open(url, "_blank");
  };
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
    // const isFormEmpty = Object.values(form).every(arr => Array.isArray(arr) && arr.length === 0);
    // if (isFormEmpty) {
    //   return toast.error("Please upload at least one document before submitting.");
    // }

      const payload = {
        sellerFiles: form,
        id: selectProperty,
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

  useEffect(() => {
    let f = {
      addedBy: user.id || user._id,
      userId: user.id || user._id,
      status: "active",
    };
    loader(true);
    ApiClient.get("property/listing", f).then((res) => {
      loader(false);
      if (res.success) {
        let data = res.data.map((itm) => ({
          ...itm,
          id: itm.id || itm._id,
        }));
        setProperty(data);
        if (!id) setSelectedProperty(data?.[0]?.id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectProperty) {
      setPropertyLoader(true);
      ApiClient.get("property/detail", {
        id: selectProperty,
        userId: user?.id || user._id,
      }).then((res) => {
        setPropertyLoader(false);
        if (res.success) {
          let data = res.data?.propertyDetail;
          setPropertyDetail(data);
          setForm({
            ...form,
            identityProof: data.sellerFiles?.identityProof || [],
            familySituation: data.sellerFiles?.familySituation || [],
            addressProof: data.sellerFiles?.addressProof || [],
            carrezLaw: data.sellerFiles?.carrezLaw || [],
            technicalDiagnostic: data.sellerFiles?.technicalDiagnostic || [],
            coOwnership: data.sellerFiles?.coOwnership || [],
            personalContribution: data.sellerFiles?.personalContribution || [],
            condominiumBooklet: data.sellerFiles?.condominiumBooklet || [],
            minutesOfGeneral: data.sellerFiles?.minutesOfGeneral || [],
            titleDeed: data.sellerFiles?.titleDeed || [],
            otherDocs: data.sellerFiles?.otherDocs || [],
          });

        }
      });
    }
  }, [selectProperty]);



  const fileList = useCallback(
    (key) => {
      let arr = [];
      if (form?.[key]?.length)
        // arr = form?.[key]?.filter((itm) => itm.property == selectProperty) || [];
        arr = form?.[key] || [];
      return arr;
    },
    [form, selectProperty]
  );

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


  return (
    <PageLayout>
      <section className="pt-14 lg:pt-16 pb-[100px]  bg-[#f2ecf8] relative">
        <div className="container   px-8 mx-auto xl:px-10  h-full flex justify-between flex-col ">
          <ul className="flex items-center pb-[50px]">
            <li
              onClick={() => navigate("/project")}
              className="text-[#47525E] cursor-pointer after"
            >
              My Project
              <span className="mx-[4px]">|</span>
            </li>
            <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
              {" "}
              Seller file
            </li>
          </ul>

          <div className="w-full ">
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
                Seller file
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                Save time and find your next home quicker
              </h2>
              <div className="grid grid-cols-12 gap-10">
                <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-[#8f3ead14] p-3 rounded-[12px] mt-7 relative">
                  {property?.length ? (
                    <>
                      <Disclosure as="div">
                        <DisclosureButton className="group flex w-full items-center justify-between h-full">
                          {propertyLoader ? (
                            <>
                              <div className="shine h-[80px] w-full"></div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center">
                                <img
                                  src={methodModel.noImg(propertyDetail?.images?.[0]?.file)}
                                  alt=""
                                  className="w-[80px] h-[80px] rounded-[12px] me-2 object-contain p-[10px] bg-white"
                                />
                                <p className="text-[#6B6B6B] text-[18px] text-left">
                                  {propertyDetail?.propertyTitle}
                                  <span className="text-[15px] block font-medium text-[#343F4B] ">
                                    {propertyDetail?.address}
                                  </span>
                                </p>
                              </div>
                            </>
                          )}
                          <ChevronDownIcon className="size-8 group-data-[open]:rotate-180" />
                        </DisclosureButton>

                        {/* DisclosurePanel with adjustments for spacing and shadow */}
                        <DisclosurePanel
                          className="mt-2 text-black absolute left-0 top-full w-full max-h-[300px] overflow-y-auto bg-white z-10 rounded-md shadow-lg"
                          style={{ zIndex: 100 }}
                        >
                          <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                            {property.map((item) => {
                              return (
                                <li
                                  key={item.id}
                                  onClick={() => setSelectedProperty(item.id)}
                                  className={`p-3 cursor-pointer ${item.id === selectProperty
                                    ? "bg-[#976dd09c]" // Highlight background when selected
                                    : ""
                                    }`}
                                >
                                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="shrink-0">
                                      <img
                                        className="w-8 h-8 rounded-full object-cover"
                                        src={methodModel.noImg(item?.images?.[0]?.file)}
                                        alt="Neil image"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-sm font-medium truncate ${item.id === selectProperty ? "text-white" : ""
                                          }`}
                                      >
                                        {item.propertyTitle}
                                      </p>
                                      <p
                                        className={`text-sm truncate ${item.id === selectProperty ? "text-white" : "text-gray-500"
                                          }`}
                                      >
                                        {item?.address}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </DisclosurePanel>
                      </Disclosure>

                      {!selectProperty ? (
                        <div className="text-red-500 mt-2 text-center">
                          Select Property for uploading document
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div className="text-red-500 mt-2 text-center">
                      Add property for uploading document
                    </div>
                  )}
                </div>

                <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-[#976dd0b5] p-5 rounded-[12px] flex mt-7">
                  <p className="text-white w-[90%]">
                    None of these documents will be shared publicly. Our real estate credit broker will use them to analyze the financing
                    capacity of your real estate project.
                  </p>
                  <FaCircleInfo className="w-[50px] text-[35px] ms-5" />
                </div>
              </div>



            </div>
          </div>
          <div className="bg-[#f3ebf9] p-4 md:p-10 ">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-8 md:border-[#a177d6] md:border-l-[5px] md:ps-6">
                {selectProperty ? (
                  <>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px]  mb-5">
                        Personal information
                      </h2>
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
                                  className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3"
                                >
                                  <div className="p-5 border-b border-[#D5D5D5]">
                                    <h4 className="text-[#47525E] text-[19px] font-semibold">
                                      {item.name}
                                    </h4>
                                    <p className="text-[#47525E] my-2 text-[13px]">
                                      {item.description}
                                    </p>
                                    <p className="text-[#47525E] italic text-[12px] ">
                                      {item.description2}
                                    </p>
                                  </div>
                                  {fileList(item.key).map((itm, i) => (
                                    <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                      <div className="flex items-center">
                                        <BsFiletypePdf className="text-[24px] me-3" />
                                        <span className="text-[#383A3D] text-[12px]">
                                          {stringSeprator(itm.originalname, 30)}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <p
                                          onClick={() => viewDoc(itm.fileName)}
                                          className="cursor-pointer text-[#383A3D] text-[14px]"
                                        >
                                          Preview
                                        </p>
                                        <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                          {/* Edit */}
                                        </p>
                                        <p
                                          onClick={() => deleteDoc(itm.id, item.key)}
                                          className="cursor-pointer text-[#383A3D] text-[14px]"
                                        >
                                          Delete
                                        </p>
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
                      <h2 className="text-[#000000] font-[600] text-[22px] mt-24 ">
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
                                  className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3"
                                >
                                  <div className="p-5 border-b border-[#D5D5D5]">
                                    <h4 className="text-[#47525E] text-[19px] font-semibold">
                                      {item.name}
                                    </h4>
                                    <p className="text-[#47525E] mt-2 text-[12px]">
                                      {item.description}
                                    </p>
                                  </div>
                                  {fileList(item.key)?.length > 0 && (
                                    <ul className="p-5">
                                      {fileList(item.key)?.map((itm, i) => (
                                        <li className="mb-3 ">
                                          <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                            <div className="flex items-center">
                                              <BsFiletypePdf className="text-[24px] me-3 text-[#ff0000]" />
                                              <span className="text-[#383A3D] text-[12px]">
                                                {stringSeprator(itm.originalname, 30)}
                                              </span>
                                            </div>
                                            <div className="flex items-center">
                                              <p
                                                onClick={() => viewDoc(itm.fileName)}
                                                className="cursor-pointer text-[#383A3D] text-[14px]"
                                              >
                                                Preview
                                              </p>
                                              <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                                {/* Edit */}
                                              </p>
                                              <p
                                                onClick={() =>
                                                  deleteDoc(itm.id, item.key)
                                                }
                                                className="cursor-pointer text-[#383A3D] text-[14px]"
                                              >
                                                Delete
                                              </p>
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
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
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          {/* <div className="mt-20 flex items-center justify-end">
            <button
              onClick={() => handleSubmit()}
              className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
            >
              Save
            </button>
          </div> */}
        </div>
      </section>
    </PageLayout>
  );
};

export default SellerFile;
