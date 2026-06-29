import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import methodModel from "../../methods/methods";
import { BsFiletypePdf } from "react-icons/bs";
import { downloadFile, stringSeprator } from "../../models/string.models";
import { FaEye } from "react-icons/fa6";

const View = () => {
  const [data, setData] = useState();
  const history = useNavigate();
  const { id } = useParams();
  const [document, setDocument] = useState("document");

  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, []);

  const getDetail = () => {
    loader(true);
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false);
      if (res.success) {
        setData(res?.data);
      }
    });
  };

  return (
    <>
      <Layout>
        <div className="wrapper_section">
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <span
                onClick={() => history(-1)}
                className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
              >
                <i className="fa fa-angle-left text-lg"></i>
              </span>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {shared.addTitle} Details
              </h3>
            </div>
          </div>
          <div className="flex gap-4  md:w-[220px] mb-4">
            <button
              onClick={() => setDocument("document")}
              className={`rounded-full border-2 border-[#a177d6]  ${
                document === "document"
                  ? "bg-primary hover:opacity-90 text-white"
                  : "text-[#a177d6]"
              }  font-semibold px-6 py-2`}
            >
              Documents
            </button>
            <button
              onClick={() => setDocument("declarative")}
              className={`rounded-full border-2 border-[#a177d6]  ${
                document === "declarative"
                  ? "bg-primary hover:opacity-90 text-white"
                  : "text-[#a177d6]"
              }  font-semibold px-6 py-2`}
            >
              Declarative
            </button>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                {document == "document" && (
                  <div className="grid md:grid-cols-2  gap-4 p-5">
                    <div className=" bg-white  border p-4 shadow rounded-lg">
                      <h4 className="text-[22px] font-[600]">Renter File</h4>
                      {data?.renterFiles &&
                      (data?.renterFiles?.addressProof?.length > 0 ||
                        data?.renterFiles?.identityProof?.length > 0 ||
                        data?.renterFiles?.salarySlips?.length > 0 ||
                        data?.renterFiles?.otherDocs?.length > 0) ? (
                        <>
                          {data?.renterFiles?.addressProof?.length > 0 && (
                            <>
                              <p className="text-black text-[16px] font-semibold mt-3 mb-1">
                                Proof of current address
                              </p>
                              {data?.renterFiles?.addressProof?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                          {data?.renterFiles?.identityProof?.length > 0 && (
                            <>
                              <p className="text-black text-[16px] font-semibold mb-1">
                                Proof of identity
                              </p>
                              {data?.renterFiles?.identityProof?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}

                          {data?.renterFiles?.salarySlips?.length > 0 && (
                            <>
                              <p className="text-black text-[16px] font-semibold mb-1">
                                Salary Slips
                              </p>
                              {data?.renterFiles?.salarySlips?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                          {data?.renterFiles?.otherDocs?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Other Document
                              </p>
                              {data?.renterFiles?.otherDocs?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                        </>
                      ) : (
                        <>No Document</>
                      )}
                    </div>
                    <div className=" bg-white border p-4 shadow rounded-lg">
                      <h4 className="text-[22px] font-[600]">Buyer File</h4>
                      {data?.buyerFiles &&
                      (data?.buyerFiles?.addressProof?.length > 0 ||
                        data?.buyerFiles?.identityProof?.length > 0 ||
                        data?.buyerFiles?.salarySlips?.length > 0 ||
                        data?.buyerFiles?.bankStatement?.length > 0 ||
                        data?.buyerFiles?.familySituation?.length > 0 ||
                        data?.buyerFiles?.personalContribution?.length > 0 ||
                        data?.buyerFiles?.taxNotice?.length > 0) ? (
                        <>
                          {data?.buyerFiles?.addressProof?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mt-3 mb-1">
                                Proof of current address
                              </p>
                              {data?.buyerFiles?.addressProof?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                          {data?.buyerFiles?.identityProof?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Proof of identity
                              </p>
                              {data?.buyerFiles?.identityProof?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}

                          {data?.buyerFiles?.salarySlips?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Salary Slips
                              </p>
                              {data?.buyerFiles?.salarySlips?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}

                          {data?.buyerFiles?.bankStatement?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Bank Statement
                              </p>
                              {data?.buyerFiles?.bankStatement?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}

                          {data?.buyerFiles?.familySituation?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Family Situation
                              </p>
                              {data?.buyerFiles?.familySituation?.map(
                                (item) => {
                                  return (
                                    <>
                                      <div className="flex items-center gap-2 mt-2">
                                        <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                        <span className="text-black text-[12px]">
                                          {stringSeprator(
                                            item?.originalname,
                                            30
                                          )}
                                        </span>{" "}
                                        <p
                                          onClick={() =>
                                            downloadFile(item?.fileName)
                                          }
                                          title="preview"
                                          className="cursor-pointer text-black text-[14px]"
                                        >
                                          <FaEye />
                                        </p>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </>
                          )}

                          {data?.buyerFiles?.personalContribution?.length >
                            0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Personal Contribution
                              </p>
                              {data?.buyerFiles?.personalContribution?.map(
                                (item) => {
                                  return (
                                    <>
                                      <div className="flex items-center gap-2 mt-2">
                                        <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                        <span className="text-black text-[12px]">
                                          {stringSeprator(
                                            item?.originalname,
                                            30
                                          )}
                                        </span>{" "}
                                        <p
                                          onClick={() =>
                                            downloadFile(item?.fileName)
                                          }
                                          title="preview"
                                          className="cursor-pointer text-black text-[14px]"
                                        >
                                          <FaEye />
                                        </p>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </>
                          )}

                          {data?.buyerFiles?.taxNotice?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Tax Notice
                              </p>
                              {data?.buyerFiles?.taxNotice?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                        </>
                      ) : (
                        <>No Document</>
                      )}
                    </div>
                    {/* <div className=" bg-white border p-4 shadow rounded-lg">
                      <h4 className="text-[22px] font-[600]">Seller File</h4>
                      {data?.sellerFiles &&
                      (data?.buyerFiles?.addressProof?.length > 0 ||
                        data?.buyerFiles?.identityProof?.length > 0 ||
                        data?.buyerFiles?.carrezLaw?.length > 0 ||
                        data?.buyerFiles?.coOwnership?.length > 0 ||
                        data?.buyerFiles?.familySituation?.length > 0 ||
                        data?.buyerFiles?.condominiumBooklet?.length > 0 ||
                        data?.buyerFiles?.personalContribution?.length > 0 ||
                        data?.buyerFiles?.otherDocs?.length > 0 ||
                        data?.buyerFiles?.minutesOfGeneral?.length > 0 ||
                        data?.buyerFiles?.technicalDiagnostic?.length > 0 ||
                        data?.buyerFiles?.titleDeed?.length > 0) ? (
                        <>
                          {data?.sellerFiles?.addressProof?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mt-3 mb-1">
                                Proof of current address
                              </p>
                              {data?.sellerFiles?.addressProof?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                          {data?.sellerFiles?.identityProof?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Proof of identity
                              </p>
                              {data?.sellerFiles?.identityProof?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                          {data?.sellerFiles?.carrezLaw?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Carrez Law
                              </p>
                              {data?.sellerFiles?.carrezLaw?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}

                          {data?.sellerFiles?.coOwnership?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Co Ownership
                              </p>
                              {data?.sellerFiles?.coOwnership?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}

                          {data?.sellerFiles?.condominiumBooklet?.length >
                            0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Condominium Booklet
                              </p>
                              {data?.sellerFiles?.condominiumBooklet?.map(
                                (item) => {
                                  return (
                                    <>
                                      <div className="flex items-center gap-2 mt-2">
                                        <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                        <span className="text-black text-[12px]">
                                          {stringSeprator(
                                            item?.originalname,
                                            30
                                          )}
                                        </span>{" "}
                                        <p
                                          onClick={() =>
                                            downloadFile(item?.fileName)
                                          }
                                          title="preview"
                                          className="cursor-pointer text-black text-[14px]"
                                        >
                                          <FaEye />
                                        </p>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </>
                          )}
                          {data?.sellerFiles?.familySituation?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Family Situation
                              </p>
                              {data?.sellerFiles?.familySituation?.map(
                                (item) => {
                                  return (
                                    <>
                                      <div className="flex items-center gap-2 mt-2">
                                        <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                        <span className="text-black text-[12px]">
                                          {stringSeprator(
                                            item?.originalname,
                                            30
                                          )}
                                        </span>{" "}
                                        <p
                                          onClick={() =>
                                            downloadFile(item?.fileName)
                                          }
                                          title="preview"
                                          className="cursor-pointer text-black text-[14px]"
                                        >
                                          <FaEye />
                                        </p>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </>
                          )}

                          {data?.sellerFiles?.personalContribution?.length >
                            0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Personal Contribution
                              </p>
                              {data?.sellerFiles?.personalContribution?.map(
                                (item) => {
                                  return (
                                    <>
                                      <div className="flex items-center gap-2 mt-2">
                                        <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                        <span className="text-black text-[12px]">
                                          {stringSeprator(
                                            item?.originalname,
                                            30
                                          )}
                                        </span>{" "}
                                        <p
                                          onClick={() =>
                                            downloadFile(item?.fileName)
                                          }
                                          title="preview"
                                          className="cursor-pointer text-black text-[14px]"
                                        >
                                          <FaEye />
                                        </p>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </>
                          )}

                          {data?.sellerFiles?.otherDocs?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Other Document
                              </p>
                              {data?.sellerFiles?.otherDocs?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}

                          {data?.sellerFiles?.minutesOfGeneral?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Minutes Of General
                              </p>
                              {data?.sellerFiles?.minutesOfGeneral?.map(
                                (item) => {
                                  return (
                                    <>
                                      <div className="flex items-center gap-2 mt-2">
                                        <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                        <span className="text-black text-[12px]">
                                          {stringSeprator(
                                            item?.originalname,
                                            30
                                          )}
                                        </span>{" "}
                                        <p
                                          onClick={() =>
                                            downloadFile(item?.fileName)
                                          }
                                          title="preview"
                                          className="cursor-pointer text-black text-[14px]"
                                        >
                                          <FaEye />
                                        </p>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </>
                          )}

                          {data?.sellerFiles?.technicalDiagnostic?.length >
                            0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Technical Diagnostic
                              </p>
                              {data?.sellerFiles?.technicalDiagnostic?.map(
                                (item) => {
                                  return (
                                    <>
                                      <div className="flex items-center gap-2 mt-2">
                                        <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                        <span className="text-black text-[12px]">
                                          {stringSeprator(
                                            item?.originalname,
                                            30
                                          )}
                                        </span>{" "}
                                        <p
                                          onClick={() =>
                                            downloadFile(item?.fileName)
                                          }
                                          title="preview"
                                          className="cursor-pointer text-black text-[14px]"
                                        >
                                          <FaEye />
                                        </p>
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </>
                          )}

                          {data?.sellerFiles?.titleDeed?.length > 0 && (
                            <>
                              <p className="text-black font-semibold mb-1">
                                Title Deed
                              </p>
                              {data?.sellerFiles?.titleDeed?.map((item) => {
                                return (
                                  <>
                                    <div className="flex items-center gap-2 mt-2">
                                      <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                      <span className="text-black text-[12px]">
                                        {stringSeprator(item?.originalname, 30)}
                                      </span>{" "}
                                      <p
                                        onClick={() =>
                                          downloadFile(item?.fileName)
                                        }
                                        title="preview"
                                        className="cursor-pointer text-black text-[14px]"
                                      >
                                        <FaEye />
                                      </p>
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          )}
                        </>
                      ) : (
                        <>No Document</>
                      )}
                    </div> */}
                  </div>
                )}

                {document == "declarative" && (
                  <div className="grid md:grid-cols-2 gap-4 p-5">
                    <div className=" bg-white border rounded-lg shadow p-4">
                      <h4 className="text-[18px] font-[600]">Renter Declarative From</h4>
                      {data?.declarativeRenterFiles?.BuyOption ||
                      data?.declarativeRenterFiles?.BuyOption ||
                      data?.declarativeRenterFiles?.BuyOption ? (
                        <>
                          {" "}
                          {data?.declarativeRenterFiles?.BuyOption && (
                            <p>
                              BuyOption :{" "}
                              {data?.declarativeRenterFiles?.BuyOption}
                            </p>
                          )}
                          {data?.declarativeRenterFiles?.InvestOption && (
                            <p>
                              InvestOption :{" "}
                              {data?.declarativeRenterFiles?.InvestOption}
                            </p>
                          )}
                          {data?.declarativeRenterFiles?.postalCode && (
                            <p>
                              postalCode/city :{" "}
                              {data?.declarativeRenterFiles?.postalCode}
                            </p>
                          )}
                        </>
                      ) : (
                        <>No Data</>
                      )}
                    </div>
                    <div className=" bg-white border rounded-lg shadow p-4">
                      <h4 className="text-[18px] font-[600]">Buyer Declarative From</h4>
                      {data?.declarativeBuyerFiles?.BuyOption ||
                      data?.declarativeBuyerFiles?.BuyOption ||
                      data?.declarativeBuyerFiles?.BuyOption ? (
                        <>
                          {" "}
                          {data?.declarativeRenterFiles?.BuyOption && (
                            <p>
                              BuyOption :{" "}
                              {data?.declarativeRenterFiles?.BuyOption}
                            </p>
                          )}
                          {data?.declarativeBuyerFiles?.InvestOption && (
                            <p>
                              InvestOption :{" "}
                              {data?.declarativeBuyerFiles?.InvestOption}
                            </p>
                          )}
                          {data?.declarativeBuyerFiles?.postalCode && (
                            <p>
                              postalCode/city :{" "}
                              {data?.declarativeBuyerFiles?.postalCode}
                            </p>
                          )}
                        </>
                      ) : (
                        <>No Data</>
                      )}
                    </div>
                    {/* <div className=" bg-white border rounded-lg shadow p-4">
                      <h4 className="text-[18px] font-[600]">Seller Declarative From</h4>
                      {data?.declarativeSellerFiles?.BuyOption ||
                      data?.declarativeSellerFiles?.BuyOption ||
                      data?.declarativeSellerFiles?.BuyOption ? (
                        <>
                          {" "}
                          {data?.declarativeRenterFiles?.BuyOption && (
                            <p>
                              BuyOption :{" "}
                              {data?.declarativeRenterFiles?.BuyOption}
                            </p>
                          )}
                          {data?.declarativeSellerFiles?.InvestOption && (
                            <p>
                              InvestOption :{" "}
                              {data?.declarativeSellerFiles?.InvestOption}
                            </p>
                          )}
                          {data?.declarativeSellerFiles?.postalCode && (
                            <p>
                              postalCode/city :{" "}
                              {data?.declarativeSellerFiles?.postalCode}
                            </p>
                          )}
                        </>
                      ) : (
                        <>No Data</>
                      )}
                    </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default View;
