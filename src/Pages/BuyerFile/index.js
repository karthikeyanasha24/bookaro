import { useEffect, useState } from "react";
import { BsFiletypePdf } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login_success } from "../../actions/user";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { imagePath, stringSeprator } from "../../models/string.model";

const BuyerFile = () => {
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
      toast.error(`Maximum ${maxLimit} files allowed to add`);
      return (e.target.value = ""); // Clear file input
    }
    // validate max size
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`Each file must be smaller than ${maxSize}MB`);
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
            return toast.error(`Maximum ${maxLimit} files allowed to add`);
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
      { name: "Alone", value: "alone" },
      { name: "Two", value: "two" },
      { name: "SCI", value: "sci" },
    ]

  const InvestOption =
    [
      { name: "Primary residence", value: "primary" },
      { name: "Secondary residence", value: "secondary" },
      { name: "Rental property", value: "rentalProperty" },
      { name: "Business", value: "business" },
      { name: "Mix", value: "mix" },
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
              My Project
              <span className="mx-[4px]">|</span>
            </li>
            <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
              Buyer file
            </li>
          </ul>

          <div className="w-full ">
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
                Buyer file
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                Save time and find your next home quicker
              </h2>
              <div className="max-w-2xl mx-auto bg-[#976dd0b5]  p-5 rounded-[12px] flex mt-7">
                <p className=" text-white w-[90%]">
                  {" "}
                  None of these documents will be shared publicly. Our real
                  estate credit broker will use them to analyze the financing
                  capacity of your real estate project.
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
                  Document based
                </button>
                <button
                  onClick={() => setDocument("declarative")}
                  className={`rounded-full border-2 border-[#a177d6]  ${document === 'declarative' ? 'bg-primary hover:opacity-90 text-white' : 'text-[#a177d6]'}  font-semibold px-6 py-2`}
                >
                  Declarative
                </button>
              </div>

              {/* Right Content */}
              <div className="flex-1 space-y-8 md:border-[#a177d6] md:border-l-[5px] md:ps-6">
                {document === "document" && (
                  <>
                    <div>
                      <h2 className="text-[#000000] font-[600] text-[22px] mb-5">
                        Personal information
                      </h2>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              Proof of identity
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              Legal document required to visit a property and
                              also bring trust to seller.
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              Could be an identity card or passport.
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
                                    Preview
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
                                    Delete
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.identityProof?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full cursor-pointer">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold  absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 pointer">
                                  Upload document
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
                              Proof of family situation
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              This document will help better understand your
                              situation
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              Could be marriage certificate, civil partnership
                              certificate (issued by your local Mairie), family
                              record book.
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
                                    Preview
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
                                    Delete
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.familySituation?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full group">
                                <p className="text-[#976DD0]  text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 border-b border-transparent group-hover:border-[#976DD0]">
                                  Upload document
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
                              Proof of current address
                            </h4>
                            <p className="text-[#47525E] my-2 text-[13px]">
                              This document will help better understand your
                              situation
                            </p>
                            <p className="text-[#47525E] italic text-[13px] h-[36px]">
                              Could be a less than 3 months old telephone, water
                              or electricity bill.
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
                                    Preview
                                  </p>
                                  <p className="cursor-pointer text-[#383A3D] text-[14px] mx-3">
                                    {/* Edit */}
                                  </p>
                                  <p
                                    onClick={() => deleteDoc(i, "addressProof")}
                                    className="cursor-pointer text-[#383A3D] text-[14px]"
                                  >
                                    Delete
                                  </p>
                                </div>
                              </div>
                            ))}
                          {form?.addressProof?.length < 1 && (
                            <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                              <label className="relative  h-full w-full">
                                <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                                  Upload document
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
                        Resources and income
                      </h2>
                      <p className="text-black mb-5 text-[12px] max-w-2xl">
                        These documents must be provided for each co-borrower
                        and enable to check that your accounts are properly kept
                        and that you are in good financial health overall.
                      </p>

                      <h3 className="text-black underline font-semibold mb-5">
                        Your financial situation
                      </h3>
                      <div className="grid grid-cols-12 md:gap-10 gap-0">
                        <div className="2xl:col-span-4 lg:col-span-6 col-span-12 bg-white rounded-[10px] md:mb-0 mb-3">
                          <div className="p-5 border-b border-[#D5D5D5]">
                            <h4 className="text-[#47525E] text-[19px] font-semibold">
                              Last 3 Salary slips
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
                                        Preview
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
                                        Delete
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
                                  Upload document
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
                              Last 3 bank statements
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
                                        Preview
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
                                        Delete
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
                                  Upload document
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
                              Last 2 tax notices
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
                                        Preview
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
                                        Delete
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
                                  Upload document
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
                              Personal contribution
                            </h4>
                            <p className="text-[#47525E] mt-2 text-[12px]">
                              Proof of any personal contribution: home savings
                              plan (PEL), family loan/donation, inheritance,
                              etc.
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
                                        Preview
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
                                        Delete
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
                                  Upload document
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
                        You want to buy <span className="text-red-600">*</span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {BuyOption?.map((item) => {
                          return <button className={`${item?.value === declartiveForm?.BuyOption ? 'bg-primary hover:opacity-90 text-white' : 'text-[#4b3869] bg-white'} rounded-md border border-[#a177d6] px-4 py-2 `} onClick={(e) => setdeclartiveForm({ ...declartiveForm, BuyOption: item?.value })}>
                            {item?.name}
                          </button>
                        })}
                      </div>
                      {submited && declartiveForm?.BuyOption == "" && <span className="text-red-600">Please select any buy option</span>}
                    </div>

                    <div>
                      <p className="font-medium text-[#4b3869] mb-3">
                        You want to invest in <span className="text-red-600">*</span>
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {InvestOption?.map((item, index) => {
                          return <button className={`${item?.value === declartiveForm?.InvestOption ? 'bg-primary hover:opacity-90 text-white' : 'text-[#4b3869] bg-white'} rounded-md border border-[#a177d6] px-4 py-2 `} onClick={(e) => setdeclartiveForm({ ...declartiveForm, InvestOption: item?.value })}>
                            {item?.name}
                          </button>
                        })}
                      </div>
                      {submited && declartiveForm?.InvestOption == "" && <span className="text-red-600	">Please select any Invest option</span>}
                    </div>

                    <div>
                      <p className="font-medium text-[#4b3869] mb-3">
                        In the city of <span className="text-red-600">*</span>
                      </p>
                      <input
                        type="text"
                        value={declartiveForm?.postalCode}
                        placeholder="City or postal code"
                        className="w-full max-w-md rounded-md border border-[#a177d6] px-4 py-2 outline-none"
                        onChange={(e) => setdeclartiveForm({ ...declartiveForm, postalCode: e.target.value })}
                      />
                    </div>
                    {submited && declartiveForm?.postalCode == "" && <span className="text-red-600">City or postal code is required</span>}
                    <div className="mt-20 flex items-center justify-end">
                      <button
                        onClick={() => handleSubmit(form, "declarative")}
                        className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                      >
                        Save
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
