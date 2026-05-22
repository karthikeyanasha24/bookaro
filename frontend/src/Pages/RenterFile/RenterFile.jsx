import { useEffect, useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { login_success } from "../../actions/user";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";

const RenterFile = ({ isModal = false, result = (_) => { } }) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const [selectall, setSelectAll] = useState(true);
  const [document, setDocument] = useState("document");
  const [submited, setsubmited] = useState(false);
  const [declartiveForm, setdeclartiveForm] = useState({ BuyOption: "", InvestOption: "", postalCode: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identityProof: [],
    addressProof: [],
    salarySlips: [],
    otherDocs: [],
  });

  useEffect(() => {
    if (user?.renterFiles) {
      setForm({
        ...form,
        identityProof: user.renterFiles?.identityProof || [],
        addressProof: user.renterFiles?.addressProof || [],
        salarySlips: user.renterFiles?.salarySlips || [],
        otherDocs: user.renterFiles?.otherDocs || [],
      });
    }
  }, [user?.renterFiles]);

  useEffect(() => {
    if (user?.declarativeRenterFiles) {
      setdeclartiveForm({
        ...declartiveForm,
        BuyOption: user?.declarativeRenterFiles?.BuyOption,
        InvestOption: user?.declarativeRenterFiles?.InvestOption,
        postalCode: user?.declarativeRenterFiles?.postalCode,
      });
    }
  }, [user?.declarativeRenterFiles]);

  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    let files = Array.from(e.target.files);
    // validate max limit files
    if (files.length + form[key]?.length > maxLimit) {
      toast.error(t("renterFile.maxFilesAllowed", { max: maxLimit }));
      return (e.target.value = ""); // Clear file input
    }
    // validate max size
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(t("renterFile.eachFileMaxSize", { max: maxSize }));
      return (e.target.value = "");
    }
    // // validate extentions
    // const acceptedTypes = ["image/jpeg", "image/png"];
    // const filteredFiles = files.filter((file) => acceptedTypes.includes(file.type));
    // let invalidFiles = files.filter((file) => !acceptedTypes.includes(file.type));
    // if (invalidFiles.length > 0 && files?.length > 1) {
    //   toast.error("Some files are not valid format and will be ignored.Only JPG and PNG images are allowed.");
    // }
    // if (filteredFiles.length !== files.length && files?.length === 1) {
    //   toast.error("Only JPG and PNG images are allowed.");
    // }
    // if (filteredFiles?.length === 0) return e.target.value = "";

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
              checked: true,
            };
          });
          if (data?.length + form[key]?.length > maxLimit)
            return toast.error(t("renterFile.maxFilesAllowed", { max: maxLimit }));
          // setForm((prev) => ({
          //   ...prev,
          //   [key]: [...prev[key], ...data],
          // }));
          let sman = { ...form };
          sman = {
            ...sman,
            [key]: [...sman[key], ...data],
          };
          setForm(sman);
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
    let data = form[key]?.filter((_, ind) => ind !== i);
    // setForm((prev) => ({
    //   ...prev,
    //   [key]: data,
    // }));
    let sman = { ...form };
    sman = {
      ...sman,
      [key]: data,
    };
    setForm(sman);
    handleSubmit(sman);
  };
  const handleSubmit = (form, key = "document") => {
    // const isFormEmpty = Object.values(form).every(arr => Array.isArray(arr) && arr.length === 0);
    // if (isFormEmpty) {
    //   return toast.error("Please upload at least one document before submitting.");
    // }
    let payload = {};
    if (key == "declarative") {
      setsubmited(true)
      payload = {
        userId: user?.id || user?._id,
        declarativeRenterFiles: declartiveForm
      }
      if (declartiveForm?.BuyOption == "" || declartiveForm?.InvestOption == "" || declartiveForm?.postalCode == "") {
        return
      }
    }
    else {
      payload = {
        userId: user?.id || user?._id,
        renterFiles: form,
      };
    }
    loader(true);
    ApiClient.put("user/editUserDetails", payload)
      .then((res) => {
        if (res.success) {
          toast.success(res?.message);
          dispatch(login_success({ renterFiles: form, declarativeRenterFiles: declartiveForm }));
          // setdeclartiveForm({ postalCode: "", BuyOption: "", InvestOption: "" })
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
    result({ event: "values", value: { ...form } });
  }, [form]);

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

  const BuyOption =
    [
      { name: t("renterFile.buyOptions.alone"), value: "alone" },
      { name: t("renterFile.buyOptions.two"), value: "two" },
      { name: t("renterFile.buyOptions.sci"), value: "sci" },
    ]

  const InvestOption =
    [
      { name: t("renterFile.investOptions.primaryResidence"), value: "primary" },
      { name: t("renterFile.investOptions.secondaryResidence"), value: "secondary" },
      { name: t("renterFile.investOptions.rentalProperty"), value: "rentalProperty" },
      { name: t("renterFile.investOptions.business"), value: "business" },
      { name: t("renterFile.investOptions.mix"), value: "mix" },
    ]


  return (
    <>
      <section className="pt-14 lg:pt-16 pb-5 h-[80vh] overflow-y-auto bg-[#f2ecf8] relative ">
        <div className="container   px-8 mx-auto xl:px-10  flex justify-between flex-col ">
          {isModal ? (
            <></>
          ) : (
            <>
              <ul className="flex items-center pb-[50px]">
                <li
                  onClick={() => navigate("/project")}
                  className="text-[#47525E] cursor-pointer after"
                >
                  {t("project.myProject")}
                  <span className="mx-[4px]">|</span>
                </li>
                <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                  {" "}
                  {t("renterFile.renterFile")}
                </li>
              </ul>
            </>
          )}

          <div className="w-full ">
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
                {t("renterFile.renterFile")}
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                {t("renterFile.saveTimeFindHome")}
              </h2>
              <div className="max-w-2xl mx-auto bg-[#976dd0b5]  p-5 rounded-[12px] flex mt-7">
                <p className=" text-white w-[90%]">
                  {t("renterFile.documentsPrivacyNote")}
                </p>
                <FaCircleInfo className="w-[50px] text-[35px] ms-5" />
              </div>
            </div>
          </div>
          <div className="bg-[#f3ebf9] p-4 md:p-10 ">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Sidebar */}
              {!isModal && <div className="flex md:flex-col gap-4  md:w-[220px] ">
                <button
                  onClick={() => setDocument("document")}
                  className={`rounded-full border-2 border-[#a177d6]  ${document === 'document' ? 'bg-primary hover:opacity-90 text-white' : 'text-[#a177d6]'}  font-semibold px-6 py-2`}
                >
                  {t("renterFile.documentBased")}
                </button>
                <button
                  onClick={() => setDocument("declarative")}
                  className={`rounded-full border-2 border-[#a177d6]  ${document === 'declarative' ? 'bg-primary hover:opacity-90 text-white' : 'text-[#a177d6]'}  font-semibold px-6 py-2`}
                >
                  {t("renterFile.declarative")}
                </button>
              </div>
              }
              {/* Right Content */}
              <div className="flex-1 space-y-8 md:border-[#a177d6] md:border-l-[5px] md:ps-6">
                {document === "document" && (
                  <>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mb-5   inline-block">
                        {t("renterFile.personalInformation")}
                      </h2>
                      {isModal &&
                        <div className="inline-flex justify-end items-center ml-5">
                          <input
                            type="checkbox"
                            checked={selectall ? true : false}
                            onChange={(e) => selectAllDocs(e.target.checked)}
                            id="selectAll"
                            className="mr-2"
                          />
                          <label htmlFor="selectAll">{t("common.selectAll")}</label>
                        </div>}

                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className=" lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("renterFile.proofOfIdentity")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("renterFile.identityProofDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[12px] ">
                              {t("renterFile.identityProofExamples")}
                            </p>
                          </div>
                          {form?.identityProof?.length > 0 &&
                            form?.identityProof?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                <div className="flex items-center gap-2">
                                  {isModal &&
                                    <input
                                      id="default-checkbox"
                                      checked={itm?.checked || false}
                                      onChange={() => updateCheckbox("identityProof", i)}
                                      type="checkbox"
                                      value=""
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />}
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
                                    onClick={() => deleteDoc(i, "identityProof")}
                                    className="cursor-pointer text-[#383A3D] text-[14px]"
                                  >
                                    {t("common.delete")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.identityProof?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center fFont-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("renterFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  // multiple
                                  onChange={(e) => ImageUpload(e, "identityProof", 1)}
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <div className=" lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("renterFile.proofOfCurrentAddress")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("renterFile.addressProofDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[12px] ">
                              {t("renterFile.addressProofExamples")}
                            </p>
                          </div>
                          {form?.addressProof?.length > 0 &&
                            form?.addressProof?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
                                <div className="flex items-center gap-2">
                                  {isModal &&
                                    <input
                                      id="default-checkbox"
                                      checked={itm?.checked || false}
                                      onChange={() => updateCheckbox("addressProof", i)}
                                      type="checkbox"
                                      value=""
                                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />}
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
                                    onClick={() => deleteDoc(i, "addressProof")}
                                    className="cursor-pointer text-[#383A3D] text-[14px]"
                                  >
                                    {t("common.delete")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.addressProof?.length < 1 && (
                            <div className="flex justify-center h-[64px]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("renterFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  // multiple
                                  onChange={(e) => ImageUpload(e, "addressProof", 1)}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mt-5 ">
                        {t("renterFile.resourcesAndIncome")}
                      </h2>
                      <p className="text-black mb-5 text-[12px] max-w-2xl">
                        {t("renterFile.resourcesAndIncomeDescription")}
                      </p>
                      <h3 className="text-black underline font-semibold mb-5">
                        {t("renterFile.yourFinancialSituation")}
                      </h3>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className="  col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("renterFile.lastThreeSalarySlips")}
                            </h4>
                          </div>
                          {form?.salarySlips?.length > 0 && (
                            <ul className="p-5">
                              {form?.salarySlips?.map((itm, i) => (
                                <li className="mb-3 ">
                                  <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                    <div className="flex items-center gap-2">
                                      {isModal &&
                                        <input
                                          id="default-checkbox"
                                          checked={itm?.checked || false}
                                          onChange={() => updateCheckbox("salarySlips", i)}
                                          type="checkbox"
                                          value=""
                                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />}
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
                                        onClick={() => deleteDoc(i, "salarySlips")}
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
                          {form?.salarySlips?.length < 3 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("renterFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) => ImageUpload(e, "salarySlips", 3)}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mt-5 ">
                        {t("renterFile.optionalDocuments")}
                      </h2>
                      <p className="text-black mb-5 text-[12px] max-w-2xl">
                        {t("renterFile.optionalDocumentsDescription")}
                      </p>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className=" col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("renterFile.makeCandidacyStandOut")}
                            </h4>
                            <p className="text-[#47525E] mt-2 text-[12px]">
                              {t("renterFile.optionalDocsNote1")}
                            </p>
                            <p className="text-[#47525E] mb-2 text-[12px]">
                              {t("renterFile.optionalDocsNote2")}
                            </p>
                          </div>
                          {form?.otherDocs?.length > 0 && (
                            <ul className="p-5 border-b border-[#D5D5D5]">
                              {form?.otherDocs?.map((itm, i) => (
                                <li className="mb-3 ">
                                  <div className=" flex justify-between md:flex-row flex-col md:items-center items-start md:mb-0 mb-5">
                                    <div className="flex items-center gap-2">
                                      {isModal &&
                                        <input
                                          id="default-checkbox"
                                          checked={itm?.checked || false}
                                          onChange={() => updateCheckbox("otherDocs", i)}
                                          type="checkbox"
                                          value=""
                                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />}
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
                                        onClick={() => deleteDoc(i, "otherDocs")}
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
                          {form?.otherDocs?.length < 10 && (
                            <div className="flex justify-center h-[64px]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("renterFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) => ImageUpload(e, "otherDocs", 10)}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {document === "declarative" && !isModal && (
                  <>
                    <div>
                      <p className="font-medium text-[#4b3869] mb-3">
                        {t("renterFile.youWantToBuy")} <span className="text-red-600">*</span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {BuyOption?.map((item) => {
                          return <button className={`${item?.value === declartiveForm?.BuyOption ? 'bg-primary hover:opacity-90 text-white' : 'text-[#4b3869] bg-white'} rounded-md border border-[#a177d6] px-4 py-2 `} onClick={(e) => setdeclartiveForm({ ...declartiveForm, BuyOption: item?.value })}>
                            {item?.name}
                          </button>
                        })}
                      </div>
                      {submited && declartiveForm?.BuyOption == "" && <span className="text-red-600">{t("renterFile.selectBuyOption")}</span>}
                    </div>

                    <div>
                      <p className="font-medium text-[#4b3869] mb-3">
                        {t("renterFile.youWantToInvestIn")} <span className="text-red-600">*</span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {InvestOption?.map((item, index) => {
                          return <button className={`${item?.value === declartiveForm?.InvestOption ? 'bg-primary hover:opacity-90 text-white' : 'text-[#4b3869] bg-white'} rounded-md border border-[#a177d6] px-4 py-2 `} onClick={(e) => setdeclartiveForm({ ...declartiveForm, InvestOption: item?.value })}>
                            {item?.name}
                          </button>
                        })}
                      </div>
                      {submited && declartiveForm?.InvestOption == "" && <span className="text-red-600\t">{t("renterFile.selectInvestOption")}</span>}
                    </div>

                    <div>
                      <p className="font-medium text-[#4b3869] mb-3">
                        {t("renterFile.inTheCityOf")} <span className="text-red-600">*</span>
                      </p>
                      <input
                        type="text"
                        value={declartiveForm?.postalCode}
                        placeholder={t("renterFile.cityOrPostalCode")}
                        className="w-full max-w-md rounded-md border border-[#a177d6] px-4 py-2 outline-none"
                        onChange={(e) => setdeclartiveForm({ ...declartiveForm, postalCode: e.target.value })}
                      />
                    </div>
                    {submited && declartiveForm?.postalCode == "" && <span className="text-red-600">{t("renterFile.cityOrPostalRequired")}</span>}
                    <div className="mt-20 flex items-center justify-end">
                      <button
                        onClick={() => handleSubmit(form, "declarative")}
                        className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                      >
                        {t("common.save")}
                      </button>
                    </div>
                  </>
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
    </>
  );
};

export default RenterFile;
