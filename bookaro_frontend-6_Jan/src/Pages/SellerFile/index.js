import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../../components/global/PageLayout";
import { useTranslation } from "react-i18next";
import ApiClient from "../../methods/api/apiClient";
import { isGuestMode } from "../../methods/guestMode";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";
import methodModel from "../../methods/methods";
import { getRandomCode } from "../../models/shared.units";

const SellerFile = () => {
  const { t } = useTranslation();
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
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const isGuest = isGuestMode() || user?.isGuest || !user?.loggedIn;

  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    if (isGuest) return;
    if (!property?.length) {
      toast.warn(t("sellerFile.listPropertyFirstToast"));
      e.target.value = "";
      return;
    }
    if (!selectProperty) {
      toast.warn(t("sellerFile.selectPropertyForUpload"));
      e.target.value = "";
      return;
    }
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
      toast.error(t("renterFile.eachFileMaxSize", { max: maxSize }));
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
    if (isGuest) return;
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
    if (isGuest) return;
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
            toast.success(t("sellerFile.updatedSuccessfully"));
          }
        })
        .catch((err) => { })
        .finally(() => {
          loader(false);
        });

  };

  useEffect(() => {
    const fetchProperties = async () => {
      const params = {
        count: 1000,
      };
      if (!isGuest) {
        params.userId = user?.id || user?._id;
      } else {
        params.guest = "true";
      }

      loader(true);
      try {
        const res = await ApiClient.get("property/myProperties", params);
        if (res.success !== false) {
          const data = (res.data || res.Data || []).map((itm) => ({
            ...itm,
            id: itm.id || itm._id,
          }));
          setProperty(data);
          if (!data.length) return;
          if (!id) {
            setSelectedProperty(data[0].id);
          } else if (data.some((itm) => itm.id === id)) {
            setSelectedProperty(id);
          } else {
            setSelectedProperty(data[0].id);
          }
        }
      } catch (err) {
        console.error("SellerFile property listing error:", err);
      } finally {
        loader(false);
      }
    };

    if (isGuest || (user && (user.id || user._id))) {
      fetchProperties();
    }
  }, [isGuest, user, id]);

  useEffect(() => {
    if (selectProperty) {
      setPropertyLoader(true);
      const params = {
        id: selectProperty,
      };
      if (!isGuest) {
        params.userId = user?.id || user?._id;
      } else {
        params.guest = "true";
      }
      ApiClient.get("property/detail", params)
        .then((res) => {
          if (res.success) {
            const data = res.data?.propertyDetail || {};
            setPropertyDetail(data);
            const sellerFiles = data.sellerFiles || {};
            setForm({
              identityProof: sellerFiles.identityProof || [],
              familySituation: sellerFiles.familySituation || [],
              addressProof: sellerFiles.addressProof || [],
              carrezLaw: sellerFiles.carrezLaw || [],
              technicalDiagnostic: sellerFiles.technicalDiagnostic || [],
              coOwnership: sellerFiles.coOwnership || [],
              personalContribution: sellerFiles.personalContribution || [],
              condominiumBooklet: sellerFiles.condominiumBooklet || [],
              minutesOfGeneral: sellerFiles.minutesOfGeneral || [],
              titleDeed: sellerFiles.titleDeed || [],
              otherDocs: sellerFiles.otherDocs || [],
            });
          }
        })
        .catch((err) => {
          console.error("SellerFile property detail error:", err);
        })
        .finally(() => {
          setPropertyLoader(false);
        });
    }
  }, [selectProperty, isGuest, user?.id, user?._id]);



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
      nameKey: "renterFile.proofOfIdentity",
      descriptionKey: "sellerFile.personalInfo.identityProof.description",
      description2Key: "renterFile.identityProofExamples",
      key: "identityProof",
      maxLimit: 1,
    },
    {
      nameKey: "sellerFile.personalInfo.familySituation.title",
      descriptionKey: "sellerFile.personalInfo.familySituation.description",
      description2Key: "sellerFile.personalInfo.familySituation.examples",
      key: "familySituation",
      maxLimit: 1,
    },
    {
      nameKey: "renterFile.proofOfCurrentAddress",
      descriptionKey: "renterFile.addressProofDescription",
      description2Key: "renterFile.addressProofExamples",
      key: "addressProof",
      maxLimit: 1,
    },
  ];

  const propertyInfo = [
    {
      nameKey: "sellerFile.propertyInfo.carrezLaw.title",
      descriptionKey: "sellerFile.propertyInfo.common.mandatory",
      key: "carrezLaw",
      maxLimit: 10,
    },
    {
      nameKey: "sellerFile.propertyInfo.technicalDiagnostic.title",
      descriptionKey: "sellerFile.propertyInfo.technicalDiagnostic.description",
      key: "technicalDiagnostic",
      maxLimit: 1,
    },
    {
      nameKey: "sellerFile.propertyInfo.coOwnership.title",
      descriptionKey: "sellerFile.propertyInfo.coOwnership.description",
      key: "coOwnership",
      maxLimit: 10,
    },
    {
      nameKey: "sellerFile.propertyInfo.personalContribution.title",
      descriptionKey: "sellerFile.propertyInfo.personalContribution.description",
      key: "personalContribution",
      maxLimit: 10,
    },
    {
      nameKey: "sellerFile.propertyInfo.condominiumBooklet.title",
      descriptionKey: "sellerFile.propertyInfo.condominiumBooklet.description",
      key: "condominiumBooklet",
      maxLimit: 10,
    },
    {
      nameKey: "sellerFile.propertyInfo.minutesOfGeneral.title",
      descriptionKey: "sellerFile.propertyInfo.minutesOfGeneral.description",
      key: "minutesOfGeneral",
      maxLimit: 10,
    },
    {
      nameKey: "sellerFile.propertyInfo.titleDeed.title",
      descriptionKey: "sellerFile.propertyInfo.common.mandatory",
      key: "titleDeed",
      maxLimit: 10,
    },
    {
      nameKey: "sellerFile.propertyInfo.otherDocs.title",
      descriptionKey: "sellerFile.propertyInfo.otherDocs.description",
      key: "otherDocs",
      maxLimit: 10,
    },
  ];


  return (
    <PageLayout>
      <section className="pt-14 lg:pt-16 pb-[100px] min-h-screen bg-[#f3f5f9] relative">
        <div className="container   px-8 mx-auto xl:px-10  h-full flex justify-between flex-col ">


          <div className="w-full ">
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
                {t("project.sellerFile")}
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                {t("sellerFile.heroTitle")}
              </h2>
              {isGuest && (
                <div className="flex justify-center mt-4">
                  <span className="dashboard-section-mock-badge inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold text-[#7c4b00] bg-[#fff4dd] shadow-[0_4px_12px_rgba(249,179,71,0.18)] border border-[rgba(249,179,71,0.35)]">
                    Données fictives
                  </span>
                </div>
              )}
              <div className="grid grid-cols-12 gap-10">
                <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-[#8f3ead14] p-3 rounded-[12px] mt-7 relative">
                  {property?.length ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-[#47525E] text-[14px] font-semibold mb-2">
                          {t("sellerFile.selectProperty")}
                        </label>
                        <button
                          type="button"
                          onClick={() => setPropertyDropdownOpen((open) => !open)}
                          className="w-full rounded-lg border border-[#d3c4e8] px-4 py-3 bg-white text-left text-[#47525E] flex items-center justify-between"
                        >
                          <span className="flex items-center gap-3">
                            <img
                              src={methodModel.noImg(property.find((itm) => itm.id === selectProperty)?.images?.[0]?.file)}
                              alt="Property"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span>
                              {property.find((itm) => itm.id === selectProperty)?.propertyTitle ||
                                property.find((itm) => itm.id === selectProperty)?.address ||
                                t("sellerFile.chooseProperty")}
                            </span>
                          </span>
                          <ChevronDownIcon className={`size-8 transition-transform ${propertyDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {propertyDropdownOpen && (
                          <div className="mt-2 text-black absolute left-0 top-full w-full max-h-[300px] overflow-y-auto bg-white z-10 rounded-md shadow-lg">
                            <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                              {property.map((item) => (
                                <li
                                  key={item.id}
                                  onClick={() => {
                                    setSelectedProperty(item.id);
                                    setPropertyDropdownOpen(false);
                                  }}
                                  className={`p-3 cursor-pointer ${item.id === selectProperty ? "bg-[#976dd09c]" : ""}`}
                                >
                                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="shrink-0">
                                      <img
                                        className="w-8 h-8 rounded-full object-cover"
                                        src={methodModel.noImg(item?.images?.[0]?.file)}
                                        alt="Property"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-medium truncate ${item.id === selectProperty ? "text-white" : ""}`}>
                                        {item.propertyTitle}
                                      </p>
                                      <p className={`text-sm truncate ${item.id === selectProperty ? "text-white" : "text-gray-500"}`}>
                                        {item?.address}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {!selectProperty ? (
                        <div className="text-red-500 mt-2 text-center">
                          {t("sellerFile.selectPropertyForUpload")}
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <div className="mb-1">
                      <label className="block text-[#47525E] text-[14px] font-semibold mb-2">
                        {t("sellerFile.selectProperty")}
                      </label>
                      <button
                        type="button"
                        disabled
                        className="w-full rounded-lg border border-[#d3c4e8] px-4 py-3 bg-white text-left text-[#9b9b9b] flex items-center justify-between cursor-not-allowed opacity-80"
                        title={t("sellerFile.noPropertyYet")}
                      >
                        <span>{t("sellerFile.noPropertyYet")}</span>
                        <ChevronDownIcon className="size-8 text-[#bdbdbd]" />
                      </button>
                      <div className="text-red-500 mt-3 text-center text-[13px]">
                        {t("sellerFile.addPropertyForUpload")}
                      </div>
                      <div className="flex justify-center mt-3">
                        <button
                          type="button"
                          onClick={() => navigate('/property1')}
                          className="bg-[#976DD0] hover:bg-[#7d55b5] text-white text-[13px] font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                          {t("sellerFile.createPropertyCta")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-[#976dd0b5] p-5 rounded-[12px] flex mt-7">
                  <p className="text-white w-[90%]">
                    {t("sellerFile.privacyNote")}
                  </p>
                  <FaCircleInfo className="w-[50px] text-[35px] ms-5" />
                </div>
              </div>



            </div>
          </div>
          <div className="bg-[#f3ebf9] p-4 md:p-10 ">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-8 md:border-[#a177d6] md:border-l-[5px] md:ps-6">
                <>
                  <div>
                      <h2 className="text-[#000000] font-[600] text-[22px]  mb-5">
                        {t("sellerFile.personalInformation")}
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
                                      {t(item.nameKey)}
                                    </h4>
                                    <p className="text-[#47525E] my-2 text-[13px]">
                                      {t(item.descriptionKey)}
                                    </p>
                                    <p className="text-[#47525E] italic text-[12px] ">
                                      {item.description2Key ? t(item.description2Key) : ""}
                                    </p>
                                  </div>
                                  {fileList(item.key).map((itm) => (
                                    <div key={itm.id} className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
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
                                          {t("common.preview")}
                                        </p>
                                        <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                          {/* Edit */}
                                        </p>
                                        <p
                                          onClick={() => deleteDoc(itm.id, item.key)}
                                          className="cursor-pointer text-[#383A3D] text-[14px]"
                                        >
                                          {t("common.delete")}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {fileList(item.key)?.length < item.maxLimit && (
                                    <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                                      {property?.length ? (
                                        <label className="relative  h-full w-full">
                                          <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                            {t("renterFile.uploadDocument")}
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
                                      ) : (
                                        <button
                                          type="button"
                                          disabled
                                          onClick={() => toast.warn(t("sellerFile.listPropertyFirstToast"))}
                                          title={t("sellerFile.listPropertyFirstToast")}
                                          className="relative h-full w-full text-[#bfb1d3] text-[14px] text-center font-semibold cursor-not-allowed opacity-60"
                                        >
                                          {t("renterFile.uploadDocument")}
                                        </button>
                                      )}
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
                        {t("sellerFile.propertyLegalInformation")}
                      </h2>
                      <p className="text-black mb-5 text-[12px] max-w-2xl">
                        {t("sellerFile.propertyLegalDescription")}
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
                                      {t(item.nameKey)}
                                    </h4>
                                    <p className="text-[#47525E] mt-2 text-[12px]">
                                      {t(item.descriptionKey)}
                                    </p>
                                  </div>
                                  {fileList(item.key)?.length > 0 && (
                                    <ul className="p-5">
                                      {fileList(item.key)?.map((itm) => (
                                        <li key={itm.id} className="mb-3 ">
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
                                                {t("common.preview")}
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
                                                {t("common.delete")}
                                              </p>
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  {fileList(item.key)?.length < item.maxLimit && (
                                    <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                                      {property?.length ? (
                                        <label className="relative  h-full w-full">
                                          <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                            {t("renterFile.uploadDocument")}
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
                                      ) : (
                                        <button
                                          type="button"
                                          disabled
                                          onClick={() => toast.warn(t("sellerFile.listPropertyFirstToast"))}
                                          title={t("sellerFile.listPropertyFirstToast")}
                                          className="relative h-full w-full text-[#bfb1d3] text-[14px] text-center font-semibold cursor-not-allowed opacity-60"
                                        >
                                          {t("renterFile.uploadDocument")}
                                        </button>
                                      )}
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
