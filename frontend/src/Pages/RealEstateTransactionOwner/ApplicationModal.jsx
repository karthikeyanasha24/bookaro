import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { BsFiletypePdf } from "react-icons/bs";
import { imagePath, stringSeprator } from "../../models/string.model";
import loader from "../../methods/loader";
import environment from "../../environment";

export default function ApplicationModal({
  answerApplication,
  onClose = () => { },
  result = (_) => { },
}) {
  const viewDoc = (fileName) => {
    const url = imagePath(fileName);
    window.open(url, "_blank");
  };

  const personalInfo = [
    {
      name: "Proof of identity",
      // description: 'Legal document required to visit a property and also bring trust to seller.',
      // description2: 'Could be an identity card or passport.',
      key: "identityProof",
    },
    {
      name: "Proof of current address",
      // description: 'This document will help better understand your situation',
      // description2: 'Could be a less than 3 months old telephone, water or electricity bill.',
      key: "addressProof",
    },
  ];

  const incomeList = [
    {
      name: "Last 3 Salary slips",
      description: "",
      description2: "",
      key: "salarySlips",
    },
  ];

  const optionList = [
    {
      name: "Make your candidacy stand out",
      description:
        "Certain documents, although optional, are so frequently requested that it is preferable to have them prepared in advance.",
      description2: `i.e: Last tax assessment (or that of the guarantor), Student card, Residence permit, Photocopy of guarantor's ID, Certificate from employer (or guarantor's employer), Photocopy of property tax (or local tax if the guarantor owns his or her own home), R.I.B., rent receipts from previous tenancy.`,
      key: "otherDocs",
    },
  ];

  // const downloadAll = async (e, allDocs) => {
  //   e.preventDefault();
  //   loader(true);
  //   const filesToDownload = Object.values(allDocs)
  //     .flat()
  //     .filter((doc) => doc?.checked);
  //   for (const file of filesToDownload) {
  //     try {
  //       const response = await fetch(`${environment.api}/img/${file.fileName}`);
  //       const blob = await response.blob();
  //       const a = document.createElement("a");
  //       a.href = URL.createObjectURL(blob);
  //       a.download = file.originalname || "document.pdf";
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //     } catch (error) {
  //       loader(false);
  //       console.error("Download failed for:", file.fileName, error);
  //     }
  //   }

  //   loader(false);
  // };


  const downloadAll = async (e, allDocs) => {
    e.preventDefault();
    loader(true);
    const token = localStorage.getItem("token");

    const filesToDownload = Object.values(allDocs)
      .flat()
      .filter((doc) => doc?.checked)
      .map((doc) => doc.fileName);

    try {
      const response = await fetch(`${environment.api}upload/zip-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Add token in Authorization header
        },
        body: JSON.stringify({ files: filesToDownload })
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
    <>
      <Dialog
        open={true}
        onClose={() => onClose()}
        className="relative z-[9999]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/10" />
        <div className="fixed inset-0 flex w-screen items-center justify-center  p-3">
          <DialogPanel className="max-w-[700px] w-full bg-white rounded-[20px] mx-5  ">
            <DialogTitle className="p-6 pb-0 flex">
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 w-full">
                View Renter Application File
              </p>
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 w-full">
                <button
                  onClick={(e) => downloadAll(e, answerApplication)}
                  className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                >
                  Download all
                </button>
              </p>
              {/* <span class="material-symbols-outlined ml-auto cursor-pointer" onClick={()=>onClose()}>close</span> */}
            </DialogTitle>
            <div className="p-4 h-[400px] overflow-auto">
              <h3 className="mb-3 font-bold">Personal information</h3>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mb-4">
                {personalInfo.map((item) => {
                  return (
                    <div
                      key={item.key}
                      className="bg-white rounded-[10px] border"
                    >
                      <div className="p-2 border-b border-[#D5D5D5] bg-[#f2f3f4] rounded-tl-[10px] rounded-tr-[10px]">
                        <h4 className="text-[#47525E] text-[16px] font-semibold">
                          {item.name}
                        </h4>
                        {/* <p className="text-[#47525E] my-2 text-[13px]">
                                            {item.description}
                                        </p> */}
                        {/* <p className="text-[#47525E] italic text-[12px] ">
                                            {item.description2}
                                        </p> */}
                      </div>
                      {answerApplication?.[item.key]?.length > 0 &&
                        answerApplication?.[item.key]?.map((itm, i) => (
                          <div className="p-3 flex justify-between md:flex-row flex-col md:items-center items-start">
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
                            </div>
                          </div>
                        ))}
                      {!answerApplication?.[item.key]?.length ? <></> : <></>}
                    </div>
                  );
                })}
              </div>

              <h3 className="mb-3 font-bold">Resources and income</h3>

              <div className="grid  grid-cols-1 gap-3 mb-4">
                {incomeList.map((item) => {
                  return (
                    <div
                      key={item.key}
                      className="bg-white rounded-[10px] border"
                    >
                      <div className="p-2 border-b border-[#D5D5D5] bg-[#f2f3f4] rounded-tl-[10px] rounded-tr-[10px]">
                        <h4 className="text-[#47525E] text-[16px] font-semibold">
                          {item.name}
                        </h4>
                        {/* <p className="text-[#47525E] my-2 text-[13px]">
                                            {item.description}
                                        </p>
                                        <p className="text-[#47525E] italic text-[12px] ">
                                            {item.description2}
                                        </p> */}
                      </div>
                      {answerApplication?.[item.key]?.length > 0 &&
                        answerApplication?.[item.key]?.map((itm, i) => (
                          <div className="p-3 flex justify-between  md:items-center items-start">
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
                            </div>
                          </div>
                        ))}
                      {!answerApplication?.[item.key]?.length ? <></> : <></>}
                    </div>
                  );
                })}
              </div>

              <h3 className="mb-3 font-bold">Optional documents</h3>
              {/* <p>These documents enable to check that your income are enough to cover montlhy rent and related charges.</p> */}
              <div className=" grid-cols-1 gap-3 mb-4">
                {optionList.map((item) => {
                  return (
                    <div
                      key={item.key}
                      className="bg-white rounded-[10px] border"
                    >
                      <div className="p-2 border-b border-[#D5D5D5] bg-[#f2f3f4] rounded-tl-[10px] rounded-tr-[10px]">
                        <h4 className="text-[#47525E] text-[16px] font-semibold">
                          {item.name}
                        </h4>
                        {/* <p className="text-[#47525E] my-2 text-[13px]">
                                            {item.description}
                                        </p>
                                        <p className="text-[#47525E] italic text-[12px] ">
                                            {item.description2}
                                        </p> */}
                      </div>
                      {answerApplication?.[item.key]?.length > 0 &&
                        answerApplication?.[item.key]?.map((itm, i) => (
                          <div className="p-5 flex justify-between  md:items-center items-start">
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
                            </div>
                          </div>
                        ))}
                      {!answerApplication?.[item.key]?.length ? <></> : <></>}
                    </div>
                  );
                })}
              </div>

              {/* <div className="flex gap-3 justify-end">
                            <button type="button" className="bg-[#919191] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold md:block hidden"
                            onClick={()=>onClose()}
                            >Close</button>
                            <button type="button" onClick={()=>result({event:'submit',value:'accept'})} className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold">Accept</button>
                            <button type="button" onClick={()=>result({event:'submit',value:'reject'})} className="bg-red-700 text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold">Reject</button>
                        </div> */}
            </div>

            <div className="flex border-t p-2 justify-between">
              <button
                onClick={() => onClose()}
                className="text-[#868389] text-[18px] underline"
              >
                Cancel
              </button>
              <div>
                <button
                  onClick={() => result({ event: "submit", value: "reject" })}
                  className="text-red-500 px-4 py-[7px] me-2 rounded-full font-[600] text-[16px]"
                >
                  Reject
                </button>
                <button
                  onClick={() => result({ event: "submit", value: "accept" })}
                  className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                >
                  Accept
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
