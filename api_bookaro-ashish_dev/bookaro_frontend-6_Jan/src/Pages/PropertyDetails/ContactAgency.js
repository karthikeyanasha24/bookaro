import {
  Button,
  Checkbox,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Textarea,
} from "@headlessui/react";
import { useCallback, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import clsx from "clsx";
import { TiDocument } from "react-icons/ti";
import { BsFiletypePdf } from "react-icons/bs";
import { imagePath, stringSeprator } from "../../models/string.model";

const ContactAgency = ({
  paramId,
  claimProperty,
  setloginModal,
  detail,
  setshowNumber,
  cId,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [contactSent, setcontactSent] = useState(false);
  const [isOpenTextArea, setIsOpenTextArea] = useState(false);
  const [agency, setagency] = useState({
    fName: user?.firstName || "",
    lName: user?.lastName || "",
    phone: user?.mobileNo || "",
    email: user?.email || "",
    claimMessage: user?.claimMessage || "",
    likeToBuy: "Now",
    alreadyOwnProperty: false,
    message: false,
  });
  const [errors, setErrors] = useState({});

  const agencyChange = (atr, value) => {
    setagency({ ...agency, [atr]: value });
    setErrors({ ...errors, [atr]: "" });
  };
  const validate = () => {
    const newErrors = {};
    const fName = String(agency.fName ?? "").trim();
    const lName = String(agency.lName ?? "").trim();
    const claimMessage = String(agency.claimMessage ?? "").trim();
    const phone = String(agency.phone ?? "").trim();
    const email = String(agency.email ?? "").trim();
    if (!fName) {
      newErrors.fName = "First name is required.";
    } else if (!/^[A-Za-z ]{2,50}$/.test(fName)) {
      newErrors.fName =
        "First name must be alphabetic, can include spaces, and be between 2 to 50 characters.";
    }
    if (!lName) {
      newErrors.lName = "Last name is required.";
    } else if (!/^[A-Za-z ]{2,50}$/.test(lName)) {
      newErrors.lName =
        "Last name must be alphabetic, can include spaces, and be between 2 to 50 characters.";
    }
    if (!claimMessage) {
      newErrors.claimMessage = "Message is required.";
    }
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10,}$/.test(phone)) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^\S+@\S+\.\S+$/.test(email) ||
      email.length < 5 ||
      email.length > 50
    ) {
      newErrors.email = "Email must be a valid format";
    }
    // else if (!agency.propertyToSell) {
    //     toast.error("Please indicate if you have a property to sell.");
    //     return false;
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const contactAgency = () => {
    if (!user.loggedIn) return setloginModal(true);
    if (!validate()) return;
    let dto = {}
    let url = "contactUs/add"
    if (claimProperty) {
      url = "property/claimOwnership"
      dto = {
        name: agency.fName,
        email: agency.email,
        mobileNo: agency.phone,
        userId: user?.id || user?._id,
        propertyId: paramId,
        docs: agency?.docs,
        claimMessage: agency?.claimMessage,
      };
    } else {
      dto = {
        firstName: agency.fName,
        lastName: agency.lName,
        email: agency.email,
        mobileNo: agency.phone,
        property_to_sell: agency.alreadyOwnProperty,
        not_want_to_receive_advices: agency?.message,
        property_id: paramId,
      };
    }

    loader(true);
    ApiClient.post(url, dto).then((res) => {
      if (res.success) {
        // toast.success(res.message)
        setagency({
          fName: "",
          lName: "",
          phone: "",
          email: "",
          likeToBuy: "Now",
          alreadyOwnProperty: false,
          message: false,
        });
        setcontactSent(true);
      }
      loader(false);
    });
  };

  const fileList = useCallback(
    (key) => {
      let arr = [];
      if (agency?.[key]?.length)
        // arr = form?.[key]?.filter((itm) => itm.property == selectProperty) || [];
        arr = agency?.[key] || [];
      return arr;
    },
    [agency]
  );
  const viewDoc = (fileName) => {
    const url = imagePath(fileName);
    window.open(url, "_blank");
  };
  const deleteDoc = (i, key) => {
    let data = agency[key]?.filter((itm) => itm.id != i);
    let sman = { ...agency };
    sman = {
      ...sman,
      [key]: data,
    };
    setagency(sman);
  };



  const ImageUpload = (e, key, maxLimit = 10, maxSize = 10) => {
    let files = Array.from(e.target.files);
    const maxSizeInBytes = maxSize * 1024 * 1024; // 10MB
    const oversizedFiles = files.filter((file) => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      toast.error(`Each file must be smaller than ${maxSize}MB`);
      return (e.target.value = "");
    }
    setErrors({ ...errors, docs: "" });

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
          // if (data?.length + form[key]?.length > maxLimit) return toast.error(`Maximum ${maxLimit} files allowed to add`);
          let sman = { ...agency };
          sman = {
            ...sman,
            [key]: [...data, ...(sman[key]?.length ? sman[key] : [])],
          };
          setagency((sman) => {
            return {
              ...sman,
              [key]: [...data, ...(sman[key]?.length ? sman[key] : [])],
            };
          });
        }
      })
      .catch((er) => console.log("err in file upload", er))
      .finally(() => {
        loader(false);
        e.target.value = "";
      });
  };

  const report = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to report this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, report it!",
      input: 'textarea',
      inputPlaceholder: 'Enter reason for reporting...',
      inputAttributes: {
        'aria-label': 'Type your reason'
      },
      showLoaderOnConfirm: true,
      preConfirm: (reason) => {
        if (!String(reason ?? "").trim()) {
          Swal.showValidationMessage("Please provide a reason for the report");
          return false;
        }
        return reason;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        let dto = {
          reason: result?.value,
          addedBy: user?._id,
          reportTo: cId,
        }

        loader(true);
        ApiClient.post("reports/add", dto)
          ?.then((res) => {
            if (res.success) {
              toast.success(res.message);
            }
            loader(false);
          });
      }
    });
  };

  return (
    <>
      <Dialog
        open={contactSent}
        onClose={() => setcontactSent(false)}
        className="relative z-[9999]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
            <DialogTitle className="p-6">
              <img
                src="assets/img/request-sent.svg"
                className="w-[100px] mx-auto"
                alt=""
              />
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-5">
                Your request has been sent to the {claimProperty?"Admin":"agency"}
              </p>
              <div className="pt-8  flex items-center justify-center">
                <Button
                  onClick={() => setcontactSent(false)}
                  className="btn btn-primary"
                >
                  OK
                </Button>
              </div>
            </DialogTitle>
          </DialogPanel>
        </div>
      </Dialog>
      <div>
        <div className="bg-[#F1EDF6] p-4 rounded-[8px]">
          <div className="">
            {claimProperty ? (
              <h4 className="text-[#47525E] font-[600] text-[18px]">
                {/* CONTACT THE AGENCY */}
                CLAIM OWNERSHIP
              </h4>
            ) :
              (<h4 className="text-[#47525E] font-[600] text-[18px]">
                {/* CONTACT THE AGENCY */}
                {detail?.role == "agency" ? "CONTACT AGENCY" : detail?.role == "agent" ? "CONTACT AGENT" : detail?.role == "hunter" ? "CONTACT HUNTER" : ""}
              </h4>)
            }

            {!detail?.sale_my_property && detail?.phoneNumber && (
              <span
                onClick={() => setshowNumber(true)}
                className="underline mt-4 inline-block text-[#47525E]"
              >
                Show phone number
              </span>
            )}
          </div>
          <div className="mt-6">
            <input
              value={agency?.fName}
              onChange={(e) => agencyChange("fName", e.target.value)}
              type="text"
              placeholder="First name*"
              className="border border-[#976DD0] rounded-[7px] px-3 py-2 w-full my-3"
            />
            {errors.fName && (
              <p className="text-red-500 text-xs">{errors.fName}</p>
            )}
            <input
              value={agency?.lName}
              onChange={(e) => agencyChange("lName", e.target.value)}
              type="text"
              placeholder="Last name*"
              className="border border-[#976DD0] rounded-[7px] px-3 py-2 w-full my-3"
            />
            {errors.lName && (
              <p className="text-red-500 text-xs">{errors.lName}</p>
            )}
            <PhoneInput
              country={"fr"}
              value={agency?.phone}
              onChange={(e) => agencyChange("phone", e)}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
            <input
              value={agency?.email}
              onChange={(e) => agencyChange("email", e.target.value)}
              type="email"
              placeholder="Email address*"
              className="border border-[#976DD0] rounded-[7px] px-3 py-2 w-full my-3"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
            <div>
              {!claimProperty && <label className="text-[#5A5A5A]">
                When would you like to buy?*
              </label>}

              <div>

                {claimProperty ? <>
                  <Textarea
                    className={clsx(
                      "mt-3 bg-white block w-full resize-none rounded-lg border border-[#976DD0] bg-white/5 px-3 py-1.5 text-sm/6 ",
                      "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
                    )}
                    onChange={(e) => {
                      agencyChange("claimMessage", e.target.value);
                    }}
                    rows={3}
                  />
                  {errors.claimMessage && (
                    <p className="text-red-500 text-xs">{errors.claimMessage}</p>
                  )}

                  {fileList("docs").map((itm, i) => (
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
                          onClick={() => deleteDoc(itm.id, "docs")}
                          className="cursor-pointer text-[#383A3D] text-[14px]"
                        >
                          Delete
                        </p>
                      </div>
                    </div>
                  ))}
                  {fileList("docs")?.length < 1 && (
                    <div className="flex justify-center h-[64px] border-t border-[#D5D5D5]">
                      <label className="relative  h-full w-full">
                        <p className="text-[#976DD0] w-full text-[14px] text-center font-semibold cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5">
                          Upload document
                        </p>
                        <input
                          type="file"
                          name="file"
                          className="opacity-0 w-full h-[64px]"
                          onChange={(e) => ImageUpload(e, "docs")}
                        />
                      </label>
                    </div>
                  )}
                  {errors?.docs && (
                    <p className="text-red-500 text-center mt-3">
                      {errors?.docs}
                    </p>
                  )}
                </> : <><Menu>
                  <MenuButton className="bg-white border border-[#976DD0] rounded-[7px] px-3 py-2 w-full my-3 text-left text-[#5A5A5A] flex justify-between">
                    {agency?.likeToBuy}
                    <img
                      alt=""
                      src="/assets/img/black-arrow.png"
                      className="w-[20px]"
                    />
                  </MenuButton>
                  <MenuItems anchor="bottom">
                    <div className="w-full bg-white">
                      <MenuItem
                        onClick={() => agencyChange("likeToBuy", "Now")}
                        className=" bg-white"
                      >
                        <p className="block data-[focus]:bg-blue-100 px-3 py-2 max-w-[320px] w-[100%] text-left">
                          Now
                        </p>
                      </MenuItem>
                      <MenuItem
                        onClick={() => agencyChange("likeToBuy", "Later")}
                        className=" bg-white"
                      >
                        <p className="block data-[focus]:bg-blue-100  px-3 py-2 max-w-[320px] w-[100%] text-left">
                          Later
                        </p>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu> <div className="flex items-center justify-between">
                    <p className="text-[#5A5A5A]">I already own a property</p>
                    <div className="flex border border-[#976DD0] p-[2px] rounded-[7px] bg-white">
                      <Checkbox
                        checked={agency?.alreadyOwnProperty}
                        onChange={() =>
                          agencyChange("alreadyOwnProperty", true)
                        }
                        className="group block text-[14px] text-black rounded-[5px]  border-r bg-white data-[checked]:text-white data-[checked]:bg-[#976DD0] px-2 py-1 cursor-pointer"
                      >
                        Yes
                      </Checkbox>
                      <Checkbox
                        checked={!agency?.alreadyOwnProperty}
                        onChange={() =>
                          agencyChange("alreadyOwnProperty", false)
                        }
                        className="group block text-[14px] text-black rounded-[5px] bg-white data-[checked]:text-white data-[checked]:bg-[#976DD0] px-2 py-1 cursor-pointer"
                      >
                        No
                      </Checkbox>
                    </div>
                  </div> <div>
                    <div className="my-2">
                      <p
                        onClick={() => setIsOpenTextArea((prev) => !prev)}
                        className="cursor-pointer underline text-[#47525E] text-[16px] inline-block"
                      >
                        Add a message (optional)
                      </p>
                    </div>
                    {isOpenTextArea && (
                      <Textarea
                        className={clsx(
                          "mt-3 bg-white block w-full resize-none rounded-lg border border-[#976DD0] bg-white/5 px-3 py-1.5 text-sm/6 ",
                          "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
                        )}

                        rows={3}
                      />
                    )}
                    <div className="flex items-start">
                      <div>
                        <Checkbox
                          value={agency?.message}
                          checked={agency?.message}
                          onChange={(e) => {
                            agencyChange("message", e);
                          }}
                          className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500 me-2 p-[1px] mt-1"
                        >
                          {/* Checkmark icon */}
                          <svg
                            className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M3 8L6 11L11 3.5"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Checkbox>
                      </div>
                      <label className="text-[#5A5A5A]">
                        I do not wish to receive similar property proiles and
                        personalized suggestions from Bookaroo.
                      </label>
                    </div>
                    <a className="underline text-[#47525E] text-[14px]">
                      Learn more
                    </a>
                  </div></>}

                <div className="flex items-center justify-center my-8">
                  <button
                    onClick={() => contactAgency()}
                    className="bg-[#976DD0] text-white rounded-[50px] text-[14px] px-5 py-3 font-[600]"
                  >
                    {claimProperty ? "Claim Property" : "Contact agency"}
                  </button>
                </div>
                {!claimProperty && <div className="flex items-center justify-between mt-8">
                  <p className="text-[#5A5A5A]">Profile XV429</p>
                  <p
                    onClick={() => report()}
                    className="underline text-[#47525E] text-[14px] font-[600]"
                  >
                    Report this profile
                  </p>
                </div>}

              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default ContactAgency;
