import { useEffect, useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { login_success } from "../../actions/user";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";

const BuyerFile = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const [document, setDocument] = useState("document");
  const [submited, setsubmited] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identityProof: [],
    familySituation: [],
    addressProof: [],
    salarySlips: [],
    bankStatement: [],
    taxNotice: [],
    personalContribution: [],
  });
  const [declartiveForm, setdeclartiveForm] = useState({ BuyOption: "", InvestOption: "", postalCode: "" });

  useEffect(() => {
    if (user?.buyerFiles) {
      setForm({
        ...form,
        identityProof: user.buyerFiles?.identityProof || [],
        familySituation: user.buyerFiles?.familySituation || [],
        addressProof: user.buyerFiles?.addressProof || [],
        salarySlips: user.buyerFiles?.salarySlips || [],
        bankStatement: user.buyerFiles?.bankStatement || [],
        taxNotice: user.buyerFiles?.taxNotice || [],
        personalContribution: user.buyerFiles?.personalContribution || [],
      });
    }
  }, [user?.buyerFiles]);

  useEffect(() => {
    if (user?.declarativeBuyerFiles) {
      setdeclartiveForm({
        ...declartiveForm,
        BuyOption: user?.declarativeBuyerFiles?.BuyOption,
        InvestOption: user?.declarativeBuyerFiles?.InvestOption,
        postalCode: user?.declarativeBuyerFiles?.postalCode,
      });
    }
  }, [user?.declarativeBuyerFiles]);

  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    let files = Array.from(e.target.files);
    // validate max limit files
    if (files.length + form[key]?.length > maxLimit) {
      toast.error(t("validation.maxFiles", { max: maxLimit }));
      return (e.target.value = ""); // Clear file input
    }
    // validate max size
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(t("validation.fileSizeLimit", { size: maxSize }));
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
            };
          });
          if (data?.length + form[key]?.length > maxLimit)
            return toast.error(t("validation.maxFiles", { max: maxLimit }));
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
        declarativeBuyerFiles: declartiveForm
      }
      if (declartiveForm?.BuyOption == "" || declartiveForm?.InvestOption == "" || declartiveForm?.postalCode == "") {
        return
      }
    }
    else {
      payload = {
        userId: user?.id || user?._id,
        buyerFiles: form,
      };
    }
    loader(true);
    ApiClient.put("user/editUserDetails", payload)
      .then((res) => {
        if (res.success) {
          toast.success(res?.message);
          dispatch(login_success({ buyerFiles: form, declarativeBuyerFiles: declartiveForm }));
          // setdeclartiveForm({ postalCode: "", BuyOption: "", InvestOption: "" })
        }
      })
      .catch((err) => { })
      .finally(() => {
        loader(false);
      });
  };

  const BuyOption =
    [
      { name: t("buyerFile.buyOptions.alone"), value: "alone" },
      { name: t("buyerFile.buyOptions.two"), value: "two" },
      { name: t("buyerFile.buyOptions.sci"), value: "sci" },
    ]

  const InvestOption =
    [
      { name: t("buyerFile.investOptions.primaryResidence"), value: "primary" },
      { name: t("buyerFile.investOptions.secondaryResidence"), value: "secondary" },
      { name: t("buyerFile.investOptions.rentalProperty"), value: "rentalProperty" },
      { name: t("buyerFile.investOptions.business"), value: "business" },
      { name: t("buyerFile.investOptions.mix"), value: "mix" },
    ]

  return (
    <PageLayout>
      <section className="  pt-14 lg:pt-16 pb-[100px]  bg-[#f2ecf8] relative">
        <div className="container   px-8 mx-auto xl:px-10  h-full ">
          <ul className="flex items-center pb-[50px]">
            <li
              onClick={() => navigate("/project")}
              className="text-[#47525E] cursor-pointer after"
            >
              {t("project.myProject")}
              <span className="mx-[4px]">|</span>
            </li>
            <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
              {t("project.buyerFile")}
            </li>
          </ul>

          <div className="w-full ">
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
                {t("project.buyerFile")}
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                {t("buyerFile.saveTimeFindHome")}
              </h2>
              <div className="max-w-2xl mx-auto bg-[#976dd0b5]  p-5 rounded-[12px] flex mt-7">
                <p className=" text-white w-[90%]">
                  {t("buyerFile.documentsPrivacyNote")}
                </p>
                <FaCircleInfo className="w-[50px] text-[35px] ms-5" />
              </div>
            </div>
          </div>
          {/* tabs */}
          <div className="bg-[#f3ebf9] p-4 md:p-10 ">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Sidebar */}
              <div className="flex md:flex-col gap-4  md:w-[220px] ">
                <button
                  onClick={() => setDocument("document")}
                  className={`rounded-full border-2 border-[#a177d6]  ${document === 'document' ? 'bg-primary hover:opacity-90 text-white' : 'text-[#a177d6]'}  font-semibold px-6 py-2`}
                >
                  {t("buyerFile.documentBased")}
                </button>
                <button
                  onClick={() => setDocument("declarative")}
                  className={`rounded-full border-2 border-[#a177d6]  ${document === 'declarative' ? 'bg-primary hover:opacity-90 text-white' : 'text-[#a177d6]'}  font-semibold px-6 py-2`}
                >
                  {t("buyerFile.declarative")}
                </button>
              </div>

              {/* Right Content */}
              <div className="flex-1 space-y-8 md:border-[#a177d6] md:border-l-[5px] md:ps-6">
                {document === "document" && (
                  <>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mb-5">
                        {t("buyerFile.personalInformation")}
                      </h2>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.proofOfIdentity")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("buyerFile.identityProofDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              {t("buyerFile.identityProofExamples")}
                            </p>
                          </div>
                          {form?.identityProof?.length > 0 &&
                            form?.identityProof?.map((itm, i) => (
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
                                    {t("buttons.preview")}
                                  </p>
                                  <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                    {/* Edit */}
                                  </p>
                                  <p
                                    onClick={() =>
                                      deleteDoc(i, "identityProof")
                                    }
                                    className="cursor-pointer text-[#383A3D] text-[14px]"
                                  >
                                    {t("common.delete")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.identityProof?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full cursor-pointer">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 pointer">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px] cursor-pointer"
                                  // multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "identityProof", 1)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.proofOfFamilySituation")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("buyerFile.familySituationDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              {t("buyerFile.familySituationExamples")}
                            </p>
                          </div>
                          {form?.familySituation?.length > 0 &&
                            form?.familySituation?.map((itm, i) => (
                              <div className="p-5 flex justify-between md:flex-row flex-col md:items-center items-start">
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
                                    {t("buttons.preview")}
                                  </p>
                                  <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                    {/* Edit */}
                                  </p>
                                  <p
                                    onClick={() =>
                                      deleteDoc(i, "familySituation")
                                    }
                                    className="cursor-pointer text-[#383A3D] text-[14px]"
                                  >
                                    {t("common.delete")}
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.familySituation?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full group">
                                <p className="text-[#976DD0]  text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 border-b border-transparent group-hover:border-[#976DD0]">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px] cursor-pointer"
                                  // multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "familySituation", 1)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.proofOfCurrentAddress")}
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              {t("buyerFile.addressProofDescription")}
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              {t("buyerFile.addressProofExamples")}
                            </p>
                          </div>
                          {form?.addressProof?.length > 0 &&
                            form?.addressProof?.map((itm, i) => (
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
                                    {t("buttons.preview")}
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
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  // multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "addressProof", 1)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mt-10">
                        {t("buyerFile.resourcesAndIncome")}
                      </h2>
                      <p className="text-black mb-5 text-[12px] max-w-2xl">
                        {t("buyerFile.resourcesAndIncomeDescription")}
                      </p>

                      <h3 className="text-black underline font-semibold mb-5">
                        {t("buyerFile.yourFinancialSituation")}
                      </h3>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.lastThreeSalarySlips")}
                            </h4>
                          </div>
                          {form?.salarySlips?.length > 0 && (
                            <ul className="p-5">
                              {form?.salarySlips?.map((itm, i) => (
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
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "salarySlips")
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
                          {form?.salarySlips?.length < 3 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "salarySlips", 3)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.lastThreeBankStatements")}
                            </h4>
                          </div>
                          {form?.bankStatement?.length > 0 && (
                            <ul className="p-5">
                              {form?.bankStatement?.map((itm, i) => (
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
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "bankStatement")
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
                          {form?.bankStatement?.length < 3 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "bankStatement", 3)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.lastTwoTaxNotices")}
                            </h4>
                          </div>
                          {form?.taxNotice?.length > 0 && (
                            <ul className="p-5">
                              {form?.taxNotice?.map((itm, i) => (
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
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "taxNotice")
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
                          {form?.taxNotice?.length < 2 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "taxNotice", 2)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              {t("buyerFile.personalContribution")}
                            </h4>
                            <p className="text-[#47525E] mt-2 text-[12px]">
                              {t("buyerFile.personalContributionDescription")}
                            </p>
                          </div>
                          {form?.personalContribution?.length > 0 && (
                            <ul className="p-5">
                              {form?.personalContribution?.map((itm, i) => (
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
                                        {t("buttons.preview")}
                                      </p>
                                      <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                        {/* Edit */}
                                      </p>
                                      <p
                                        onClick={() =>
                                          deleteDoc(i, "personalContribution")
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
                          {form?.personalContribution?.length < 10 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  {t("buyerFile.uploadDocument")}
                                </p>
                                <input
                                  type="file"
                                  name="file"
                                  className="opacity-0 w-full h-[64px]"
                                  multiple
                                  onChange={(e) =>
                                    ImageUpload(e, "personalContribution", 10)
                                  }
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {document === "declarative" && (
                  <>
                    <div>
                      <p className="font-medium text-[#4b3869] mb-3">
                        {t("buyerFile.youWantToBuy")} <span className="text-red-600">*</span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {BuyOption?.map((item) => {
                          return <button className={`${item?.value === declartiveForm?.BuyOption ? 'bg-primary hover:opacity-90 text-white' : 'text-[#4b3869] bg-white'} rounded-md border border-[#a177d6] px-4 py-2 `} onClick={(e) => setdeclartiveForm({ ...declartiveForm, BuyOption: item?.value })}>
                            {item?.name}
                          </button>
                        })}
                      </div>
                      {submited && declartiveForm?.BuyOption == "" && <span className="text-red-600">{t("buyerFile.selectBuyOption")}</span>}
                    </div>

                    <div>
                      <p className="font-medium text-[#4b3869] mb-3">
                        {t("buyerFile.youWantToInvestIn")} <span className="text-red-600">*</span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {InvestOption?.map((item, index) => {
                          return <button className={`${item?.value === declartiveForm?.InvestOption ? 'bg-primary hover:opacity-90 text-white' : 'text-[#4b3869] bg-white'} rounded-md border border-[#a177d6] px-4 py-2 `} onClick={(e) => setdeclartiveForm({ ...declartiveForm, InvestOption: item?.value })}>
                            {item?.name}
                          </button>
                        })}
                      </div>
                      {submited && declartiveForm?.InvestOption == "" && <span className="text-red-600	">{t("buyerFile.selectInvestOption")}</span>}
                    </div>

                    <div>
                      <p className="font-medium text-[#4b3869] mb-3">
                        {t("buyerFile.inTheCityOf")} <span className="text-red-600">*</span>
                      </p>
                      <input
                        type="text"
                        value={declartiveForm?.postalCode}
                        placeholder={t("buyerFile.cityOrPostalCode")}
                        className="w-full max-w-md rounded-md border border-[#a177d6] px-4 py-2 outline-none"
                        onChange={(e) => setdeclartiveForm({ ...declartiveForm, postalCode: e.target.value })}
                      />
                    </div>
                    {submited && declartiveForm?.postalCode == "" && <span className="text-red-600">{t("buyerFile.cityOrPostalRequired")}</span>}
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
    </PageLayout>
  );
};

export default BuyerFile;
