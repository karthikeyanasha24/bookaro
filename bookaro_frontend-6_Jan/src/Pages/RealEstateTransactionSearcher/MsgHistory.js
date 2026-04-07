import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import {
  dateFormate,
  downloadFile,
  formatCurrency,
  imagePath,
  stringSeprator,
} from "../../models/string.model";
import ApiClient from "../../methods/api/apiClient";
import datepipeModel from "../../models/datepipemodel";
import { useSelector } from "react-redux";
import { ownerNextStatus, userCurrentStatus } from "../../utils/shared.utils";
import { BsFiletypePdf } from "react-icons/bs";
import loader from "../../methods/loader";
import environment from "../../environment";
import { FaEye, FaRegEye } from "react-icons/fa6";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import moment from "moment";

const MsgHistory = ({ isOpenMsg, closeModal, card,i, actions }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
      const activePlan = useSelector((state) => state.activePlan);
  useEffect(() => {
    ApiClient.get("interests/interestMessages", { interestId: card._id })
      .then((res) => {
        if (res.success) {
          setHistory(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const downloadAll = async (e, allDocs) => {
    e.preventDefault();
    loader(true);
    const token = localStorage.getItem("token");
    const filesToDownload = Object.values(allDocs)
      .flat()
      .filter((doc) => doc?.checked)
      .map((doc) => doc.fileName);

    try {
      const response = await fetch(`${environment?.api}upload/zip-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in Authorization header
        },
        body: JSON.stringify({ files: filesToDownload }),
      });

      if (!response.ok) throw new Error("Failed to download zip");
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "documents.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading zip file:", error);
    }

    loader(false);
  };
  return (
    <Transition appear show={isOpenMsg} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="mt-2 flex border-b border-[#969FAA] pb-3 relative">
                  <div>
                    <img
                      alt=""
                      src={imagePath(
                        card?.propertyId?.addedBy?.image,
                        "assets/img/man.jpg"
                      )}
                      className="w-[60px] h-[60px] rounded-full object-cover"
                    />
                  </div>
                  <div className="ms-4">
                    <h3 className="text-[#47525E] font-[600] text-[17px]">
                      {card.propertyId?.addedBy?.fullName}
                    </h3>
                    {card.propertyId?.addedBy?.city && (
                      <p className="text-[#47525E]">
                        {card.propertyId?.addedBy?.city},{" "}
                        {card.propertyId?.addedBy?.country}
                      </p>
                    )}

                       {(activePlan?.[0]?.otherDetails?.leadsLevel?.key == "custom" && (activePlan?.[0]?.otherDetails?.leadsLevel?.value >= i + 1) || activePlan?.[0]?.otherDetails?.leadsLevel?.key == "unlimited") && (
                      <div className="flex items-center">
                        <p className="text-[#47525E]">
                          Financial credibility score:
                        </p>
                        <h4 className="text-white bg-[#21C6BE] rounded-full p-1 w-[30px] h-[30px] flex items-center justify-center ms-2">
                          {`${card?.buyerId?.documentGrade} `}
                        </h4>
                      </div>
                    )}
                    {+card?.finalPrice > 0 && (
                      <div className="flex items-center">
                        <p className="text-[#47525E]">Offer:</p>
                        <h4 className="text-[#21C6BE] font-bold ms-2">
                          {`${formatCurrency(card?.finalPrice)} €`}
                        </h4>
                      </div>
                    )}
                    <div className="flex items-center">
                      <p className="text-[#47525E]">Funding:</p>
                      <h4 className="text-[#47525E] font-[600] ms-2">
                        Property {card.propertyId?.propertyType}
                      </h4>
                    </div>
                    <div className="flex items-center">
                      <p className="text-[#47525E]">Suspensive conditions:</p>
                      <h4 className="text-[#47525E] font-[600] ms-2">2</h4>
                    </div>
                    <p className="text-[#47525E] text-[14px]">
                      Member since{" "}
                      {dateFormate(
                        card?.propertyId?.addedBy?.createdAt,
                        "MMMM YYYY"
                      )}
                    </p>
                  </div>
                  <div
                    className="ms-auto p-1 border cursor-pointer rounded-full w-[30px] flex justify-center items-center absolute right-0 -top-3 h-[30px]"
                    onClick={closeModal}
                  >
                    <RxCross2 />
                  </div>
                </div>
                <div>
                  <h4 className="text-[#47525E] font-[600] pt-5 text-center text-[18px] mb-5">
                    Transaction history
                  </h4>

                  <div className="h-[300px] overflow-auto pe-3">
                    {loading ? (
                      <>
                        <div className="shine mb-2 h-[40px]"></div>
                        <div className="shine mb-2 h-[40px]"></div>
                        <div className="shine mb-2 h-[40px]"></div>
                        <div className="shine mb-2 h-[40px]"></div>
                      </>
                    ) : (
                      <>
                        {history.map((item) => {
                          return (
                            <Fragment key={item._id}>
                              {item.addedBy == (user._id || user?.id) ? (
                                <>
                                  <div className="mb-5">
                                    <div>
                                      <p className="text-[#47525E] text-sm text-center mb-4">
                                        {/* {datepipeModel.datetime(item.createdAt)} */}
                                        {moment(item.createdAt).format("lll")}
                                      </p>
                                    </div>
                                    <div className="bg-[#E9E9E9] rounded-[10px] p-2 max-w-[300px] ms-auto">
                                      <p className="text-[#47525E]">
                                        {userCurrentStatus({
                                          ...card,
                                          ...item,
                                          funnelStatus: item?.funnelStatus,
                                        })}
                                        <>
                                          {" "}
                                          {(item?.applicationFile?.addressProof
                                            ?.length > 0 ||
                                            item?.applicationFile?.identityProof
                                              ?.length > 0 ||
                                            item?.applicationFile?.otherDocs
                                              ?.length > 0 ||
                                            item?.applicationFile?.salarySlips
                                              ?.length > 0) && (
                                              <button
                                                onClick={(e) =>
                                                  downloadAll(
                                                    e,
                                                    item?.applicationFile
                                                  )
                                                }
                                                className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                              >
                                                Download All
                                              </button>
                                            )}
                                        </>

                                        {item?.applicationFile && (
                                          <>
                                            {item?.applicationFile?.addressProof
                                              ?.length > 0 && (
                                                <>
                                                  <p className="text-black font-bold mt-3 mb-1">
                                                    Proof of current address
                                                  </p>
                                                  {item?.applicationFile?.addressProof?.map(
                                                    (item) => {
                                                      return (
                                                        <>
                                                          <div className="flex items-center gap-2 mb-4">
                                                            <BsFiletypePdf className="text-[24px] text-black" />
                                                            <span className="text-black text-[12px]">
                                                              {stringSeprator(
                                                                item?.originalname,
                                                                30
                                                              )}
                                                            </span>{" "}
                                                            <p
                                                              onClick={() =>
                                                                downloadFile(
                                                                  item?.fileName
                                                                )
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
                                            {item?.applicationFile?.identityProof
                                              ?.length > 0 && (
                                                <>
                                                  <p className="text-black font-bold mb-1">
                                                    Proof of identity
                                                  </p>
                                                  {item?.applicationFile?.identityProof?.map(
                                                    (item) => {
                                                      return (
                                                        <>
                                                          <div className="flex items-center gap-2 mb-4">
                                                            <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                                            <span className="text-black text-[12px]">
                                                              {stringSeprator(
                                                                item?.originalname,
                                                                30
                                                              )}
                                                            </span>{" "}
                                                            <p
                                                              onClick={() =>
                                                                downloadFile(
                                                                  item?.fileName
                                                                )
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

                                            {item?.applicationFile?.salarySlips
                                              ?.length > 0 && (
                                                <>
                                                  <p className="text-black font-bold mb-1">
                                                    Salary Slips
                                                  </p>
                                                  {item?.applicationFile?.salarySlips?.map(
                                                    (item) => {
                                                      return (
                                                        <>
                                                          <div className="flex items-center gap-2 mb-4">
                                                            <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                                            <span className="text-black text-[12px]">
                                                              {stringSeprator(
                                                                item?.originalname,
                                                                30
                                                              )}
                                                            </span>{" "}
                                                            <p
                                                              onClick={() =>
                                                                downloadFile(
                                                                  item?.fileName
                                                                )
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
                                            {item?.applicationFile?.otherDocs
                                              ?.length > 0 && (
                                                <>
                                                  <p className="text-black font-bold mb-1">
                                                    Other Document
                                                  </p>
                                                  {item?.applicationFile?.otherDocs?.map(
                                                    (item) => {
                                                      return (
                                                        <>
                                                          <div className="flex items-center gap-2 mb-4">
                                                            <BsFiletypePdf className="text-[24px] me-3 text-black" />
                                                            <span className="text-black text-[12px]">
                                                              {stringSeprator(
                                                                item?.originalname,
                                                                30
                                                              )}
                                                            </span>{" "}
                                                            <p
                                                              onClick={() =>
                                                                downloadFile(
                                                                  item?.fileName
                                                                )
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
                                          </>
                                        )}

                                        {item?.buyerPrice && <>
                                          {item?.buyerPrice?.amount && <div className="flex items-center justify-between mt-5 px-4">
                                            <span className="text-[#47525E] font-[600]">
                                              Offer amount:
                                            </span>
                                            <span className="text-[#47525E] font-[500]">
                                              {` ${formatCurrency(
                                                item?.buyerPrice?.amount
                                              )} €`}
                                            </span>
                                          </div>}

                                          {item?.buyerPrice?.validity_date && <div className="flex items-center justify-between mt-3 px-4">
                                            <span className="text-[#47525E] font-[600]">
                                              Validity date:
                                            </span>
                                            <span className="text-[#47525E] font-[500]">
                                              {` ${dateFormate(
                                                item?.buyerPrice?.validity_date
                                              )}`}
                                            </span>
                                          </div>}

                                          {item?.buyerPrice?.move_in && <div className="flex items-center justify-between mt-3 px-4">
                                            <span className="text-[#47525E] font-[600]">
                                              Move In date:
                                            </span>
                                            <span className="text-[#47525E] font-[500]">
                                              {` ${dateFormate(item?.buyerPrice?.move_in)}`}
                                            </span>
                                          </div>}

                                          {item?.buyerPrice?.conditions?.length > 0 && <div className="flex items-center justify-between mt-3 px-4">
                                            <span className="block text-[#47525E] font-[600] mb-2">
                                              Suspensive condition count:
                                            </span>
                                            <span className="text-[#47525E] font-[500]">
                                              {item?.buyerPrice?.conditions?.length || 0}
                                            </span>
                                          </div>}

                                          {item?.buyerPrice?.fundingType?.length > 0 && <div className="px-4 mt-3 ">
                                            <span className="block text-[#47525E] font-[600] mb-2">
                                              Funding types:
                                            </span>
                                            {item?.buyerPrice?.fundingType?.length > 0 ? (
                                              <ul className="space-y-2 ">
                                                {item?.buyerPrice?.fundingType?.map(
                                                  (funding, index) => (
                                                    <li
                                                      key={index}
                                                      className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center"
                                                    >
                                                      <FaRegArrowAltCircleRight className="me-2" />

                                                      {funding}
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            ) : (
                                              <span className="text-[#47525E] font-[500]">
                                                No funding types available.
                                              </span>
                                            )}
                                          </div>}

                                          {item?.buyerPrice?.conditions?.length > 0 && <div className="px-4 mt-3 ">
                                            <span className="block text-[#47525E] font-[600] mb-2">
                                              Suspensive condition:
                                            </span>
                                            {item?.buyerPrice?.conditions?.length > 0 ? (
                                              <ul className="space-y-2 ">
                                                {item?.buyerPrice?.conditions?.map(
                                                  (condition, index) => (
                                                    <li
                                                      key={index}
                                                      className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center"
                                                    >
                                                      <FaRegArrowAltCircleRight className="me-2" />

                                                      {condition}
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            ) : (
                                              <span className="text-[#47525E] font-[500]">
                                                No funding types available.
                                              </span>
                                            )}
                                          </div>}

                                          {card?.buyerPrice?.bank?.amount > 0 && (
                                            <div className="px-4 mt-3 ">
                                              <span className="block text-[#47525E] font-[600] mb-2">
                                                Bank Loan:
                                              </span>
                                              <ul className="space-y-2 ">
                                                <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">Amount:{card?.buyerPrice?.bank?.amount} €</p>
                                                <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">Duration:{card?.buyerPrice?.bank?.duration} Year</p>
                                                <p className="text-[#47525E] font-[500]  py-[1px] rounded-md flex items-center">Rate:{card?.buyerPrice?.bank?.rate} %</p>
                                              </ul>
                                            </div>
                                          )}

                                        </>}


                                        {item?.buyerPrice && (
                                          <>
                                            {item?.buyerPrice?.documents
                                              ?.length > 0 && (
                                                <>
                                                  <p className="text-black font-bold">
                                                    Document
                                                  </p>
                                                  {item?.buyerPrice?.documents?.map(
                                                    (item) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] me-3" />
                                                          <span className="text-[#383A3D] text-[12px]">
                                                            {stringSeprator(
                                                              item?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                item?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-[#383A3D] text-[14px]"
                                                          >
                                                            Preview
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </>
                                              )}
                                          </>
                                        )}


                                      </p>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="mb-5">
                                    <div>
                                      <p className="text-[#47525E] text-sm text-center mb-4">
                                        {/* {datepipeModel.datetime(item.createdAt)} */}
                                        {moment(item.createdAt).format("lll")}
                                      </p>
                                    </div>
                                    <div className="bg-[#8F3EAD] rounded-[10px] p-2 max-w-[300px] me-auto ">
                                      <p className="text-white mb-2">
                                        {userCurrentStatus({
                                          ...card,
                                          ...item,
                                          funnelStatus: item?.funnelStatus,
                                        })}
                                      </p>
                                      <>
                                        {" "}
                                        {(item?.documents?.addressProof
                                          ?.length > 0 ||
                                          item?.documents?.carrezLaw?.length >
                                          0 ||
                                          item?.documents?.coOwnership?.length >
                                          0 ||
                                          item?.documents?.condominiumBooklet
                                            ?.length > 0 ||
                                          item?.documents?.familySituation
                                            ?.length > 0 ||
                                          item?.documents?.identityProof
                                            ?.length > 0 ||
                                          item?.documents?.minutesOfGeneral
                                            ?.length > 0 ||
                                          item?.documents?.otherDocs?.length >
                                          0 ||
                                          item?.documents?.personalContribution
                                            ?.length > 0 ||
                                          item?.documents?.technicalDiagnostic
                                            ?.length > 0 ||
                                          item?.documents?.titleDeed?.length >
                                          0) && (
                                            <button
                                              onClick={(e) =>
                                                downloadAll(e, item?.documents)
                                              }
                                              className="bg-[#976DD0] mb-3 px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                            >
                                              Download All
                                            </button>
                                          )}
                                      </>
                                      {item?.documents && (
                                        <>
                                          {item?.documents?.addressProof
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Address Proof
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.addressProof?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          {item?.documents?.carrezLaw
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Carrez Law
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.carrezLaw?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          {item?.documents?.coOwnership
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Co Ownership
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.coOwnership?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          {item?.documents?.condominiumBooklet
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Condominium Booklet
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.condominiumBooklet?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          {item?.documents?.familySituation
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Family Situation
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.familySituation?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          {item?.documents?.identityProof
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Identity Proof
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.identityProof?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}

                                          {item?.documents?.minutesOfGeneral
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Minutes Of General
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.minutesOfGeneral?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}

                                          {item?.documents
                                            ?.personalContribution?.length >
                                            0 && (
                                              <>
                                                <p className="text-white">
                                                  Personal Contribution
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.personalContribution?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          {item?.documents
                                            ?.technicalDiagnostic?.length >
                                            0 && (
                                              <>
                                                <p className="text-white">
                                                  Technical Diagnostic
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.technicalDiagnostic?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          {item?.documents?.titleDeed
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Title Deed
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.titleDeed?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          {item?.documents?.otherDocs
                                            ?.length > 0 && (
                                              <>
                                                <p className="text-white">
                                                  Other Relevant Docs
                                                </p>
                                                <div className="flex flex-wrap gap-5 mt-4 mb-6">
                                                  {item?.documents?.otherDocs?.map(
                                                    (itm) => {
                                                      return (
                                                        <>
                                                          <BsFiletypePdf className="text-[24px] text-white" />
                                                          <span className="text-white text-[12px]">
                                                            {stringSeprator(
                                                              itm?.originalname,
                                                              30
                                                            )}
                                                          </span>{" "}
                                                          <p
                                                            onClick={() =>
                                                              downloadFile(
                                                                itm?.fileName
                                                              )
                                                            }
                                                            className="cursor-pointer text-white text-[14px]"
                                                          >
                                                            <FaRegEye />
                                                          </p>
                                                        </>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </>
                                            )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </Fragment>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="border-t pt-4 border-[#5A6978] text-[#47525E] text-center my-4">
                    Next step: {ownerNextStatus(card)}
                  </p>
                  <div className="mx-auto flex justify-center gap-3">
                    {/* <button
                                                                           type="button"
                                                                           className="flex justify-center  border-[2px] border-[#976DD0]  px-4 py-2 text-sm font-medium text-[#47525E]  rounded-[35px] hover:bg-[#976DD0] hover:text-white transition"
                                                                           onClick={closeModal}
                                                                       >
                                                                           Propose dates
                                                                       </button> */}
                    {actions}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MsgHistory;
