import { Checkbox, Switch } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import shared, { saveChanges } from "../shared";
import { removePropData } from "../../../models/string.model";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import { toast } from "react-toastify";
import PropertyCheck from "../propertyCheck";

const Step10 = ({
  step1,
  setActiveTabIndex,
  formData,
  setFormData,
  editMode = true,
  page,
  addSteps,
  setaddSteps,
}) => {

  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [draftModal, setdraftModal] = useState(false)
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState({
    email: "",
    username: "",
    phoneNumber: "",
  });
  const draftsave = () => {
    const payload = {
      ...formData,
      step: 8
    }
    loader(true)
    ApiClient.post(`draft/add`, payload, {}, "", true).then((res) => {
      if (res.success) {
        toast.success(res?.message)
        navigate("/")
      } else {
        setMsg(res?.message);
        setdraftModal(true)
      }
      loader(false);
    });
  }
  const [propId, setpropId] = useState("");
  const [popup, setPopup] = useState(false);

  const validate = () => {
    const newError = { email: "", username: "", phoneNumber: "" };
    if (!formData.username || formData.username?.trim()?.length < 6) {
      newError.username =
        "Username is required and must be at least 6 characters.";
    }
    const phoneRegex = /^[0-9]+$/;
    if (
      formData.phoneNumber &&
      (!phoneRegex.test(formData.phoneNumber) ||
        formData.phoneNumber.length < 10)
    ) {
      newError.phoneNumber = "Enter valid Phone number";
    }

    if (newError.username || newError.phoneNumber) {
      setError(newError);
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      return false;
    }
    setError({ email: "", username: "", phoneNumber: "" });
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    let method = "post";
    let url = shared.addApi;
    let value = {
      ...formData,
      linkedSchools: Object.entries(formData)
        .filter(
          ([key, value]) =>
            key.startsWith("school") &&
            value?.schoolId?.value &&
            value?.schoolId?.label &&
            value?.type
        )
        .map(([_, value]) => ({
          schoolId: value.schoolId.value,
          type: value.type,
          EstablishmentName: value.schoolId.label,
        })),
      add_more_step: false,
    };
    if (value?.energymode == "") {
      delete value.energymode;
    }
    if (value?.heatingType == "") {
      delete value.heatingType;
    }
    if (value?.proposal == "") {
      delete value.proposal;
    }
    if (value?.emission_efficient == "") {
      delete value.emission_efficient;
    }
    if (value?.energy_efficient == "") {
      delete value.energy_efficient;
    }
    if (value?.usedAs == "") {
      delete value.usedAs;
    }
    if (value?.investment?.length == 0 || value?.investment[0] == "") {
      delete value.investment
    }
    delete value.Expenses;
    delete value.school1;
    delete value.school2;
    delete value.school3;
    delete value.school4;
    delete value.rating;
    delete value.renovation_work;
    delete value.revenue_detail;
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
    }

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        removePropData();
        setpropId(res?.data?._id || res?.data?.id);
        setPopup(true);
      }
      loader(false);
    });
  };

  const handleNext = () => {
    if (!validate()) return;
    localStorage.setItem("step1", JSON.stringify(formData));
    if (page) {
      navigate(`/property/${page}/${id}?step=10`);
    } else if (id) {
      navigate(`/property/edit/${id}/10`);
    } else {
      navigate("/property/add/10");
    }
    setActiveTabIndex(10);
  };

  const handleBack = () => {
    setFormData({ ...formData });
    if (step1?.propertyType === "directory") {
      if (page) {
        navigate(`/property/${page}/${id + 1}`);
      } else if (id) {
        navigate(`/property/edit/${id}/10`);
      } else {
        navigate("/property/add/10");
      }
      setActiveTabIndex((prevIndex) => Math.max(prevIndex - 2, 0));
    } else {
      if (page) {
        navigate(`/property/${page}/${id}`);
      } else if (id) {
        navigate(`/property/edit/${id}/8`);
      } else {
        navigate("/property/add/8");
      }
      setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const changeAddMore = (e) => {
    setaddSteps(e);
    setFormData({ ...formData, add_more_step: e })
    localStorage.setItem("addMore", e);
  }

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user?.email,
        username: prev.username || user?.username,
        phoneNumber: prev.phoneNumber || user?.mobileNo,
      }));
    }
  }, [user]);

  useEffect(() => {
    setaddSteps(formData?.add_more_step)
    localStorage.setItem("addMore", formData?.add_more_step);
  }, [formData?.add_more_step])

  const save = () => {
    if (!validate()) return;
    step1.email = user?.email;
    step1.username = formData.username;
    step1.phoneNumber = formData.phoneNumber;
    step1.real_estate_market = formData.real_estate_market;
    step1.sale_my_property = formData.sale_my_property;
    step1.add_more_step = addSteps;
    localStorage.setItem("step1", JSON.stringify(step1));
    saveChanges(step1);
  };

  return (
    <>
      <Dialog
        open={popup}
        onClose={() => {
          setPopup(false);
          navigate(`/properties`);
        }}
        className="relative z-[9999]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
            <DialogTitle className="p-6">
              <img
                src="/assets/img/question.png"
                className="w-[100px] mx-auto"
                alt="bolt"
              />
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-5">
                Property has been created
              </p>
              <div className="pt-8  flex items-center justify-center">
                <Button
                  onClick={() =>
                    navigate(`/property-details?id=${propId}`, {
                      state: { paramId: propId },
                    })
                  }
                  className="btn btn-primary"
                >
                  Click here to view
                </Button>
              </div>
            </DialogTitle>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="flex justify-between flex-col h-full relative">
        <PropertyCheck />
        <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <div className="flex justify-between items-center gap-3 xl:mb-[50px] lg:mb-[50px] mb-[40px]">
            <h4 className="text-[#47525E] text-[24px] font-[600] ">
              Complete your preferred contact details
              <span className="text-[#47525E] font-[400] block text-[14px] mt-1 block">
                *Mandatory information
              </span>
            </h4>
          </div>
          <div className="md:w-[500px] w-[100%]">
            <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
              Email address attached to your account
            </label>
            <div className="font-[400]  text-[14px] text-[#47525E] mb-7 ">
              {/* <input
                disabled={!editMode}
                type="email"
                value={formData.email}
                onChange={(e) => {
                  if (editMode) {
                    setFormData({ ...formData, email: e.target.value })
                    setError({ ...error, email: "" })
                  }
                }}
                className={`bg-white rounded-[7px] h-11 border ${error.email ? "border-red-500" : "border-[#976DD0]"
                  } p-2 px-3 xl:max-w-[500px] w-[100%] mb-4`}
                placeholder="Enter your Email"
              /> */}
              {user?.email}
              {/* {error.email && (
                <div className="text-[#ff0000] text-sm">{error.email}</div>
              )} */}
            </div>
          </div>

          <div
            ref={scrollRef}
            className="mt-4 bg-white p-5 rounded-md md:w-[500px] w-[100%] shadow_new border  border-[#986dcd7d] mb-8 flex "
          >
            <div className="me-4 sm:w-[12%] w-[20%]">
              <img
                src="/assets/img/info-g.svg"
                className="sm:w-[60px] w-[50px] mb-4  -mt-[2px] shadow_new rounded-[50px] p-1 border"
                alt="Info"
              />
            </div>

            <div className="flex items-start flex-col w-[75%]">
              <h5 className="text-[#47525E] text-[16px] font-[600]  mb-2 border-b border-dashed border-[#47525E]  ">
                Your email address is not displayed on property profile
              </h5>
              <label className="text-[#47525E] text-[14px] ">
                Rest assured, we only use your email to send you contact
                requests for your ad.
              </label>
            </div>
          </div>

          <div className="md:max-w-[500px] w-[100%]">
            <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
              Username*
            </label>
            <span className="block font-[400] mt-2 mb-2 text-[#47525E] text-[14px]">
              Username to be displayed on your property profile
            </span>
            <input
              disabled={!editMode}
              type="text"
              value={formData.username}
              onChange={(e) => {
                if (editMode) {
                  setFormData({ ...formData, username: e.target.value });
                  setError({ ...error, username: "" });
                }
              }}
              className={`bg-white rounded-[7px] h-11 border ${error.username ? "border-red-500" : "border-[#976DD0]"
                } p-2 px-3 xl:max-w-[500px] w-[100%] mb-4`}
              placeholder="Enter your username"
            />
            {error.username && (
              <div className="text-[#ff0000] text-sm">{error.username}</div>
            )}
          </div>

          {/* <div className="mt-4 bg-white p-4 rounded-md xl:w-[500px] w-[100%] shadow_new border  border-[#986dcd7d] my-10">
            <h5 className="text-[#47525E] text-[16px] font-[600] text-left mb-2 flex items-center justify-between underline">
              Don't use your real name unless your are a pro
              <img src="/assets/img/info.png" className="w-[20px]" alt="Info" />
            </h5>
            <div className="flex items-start">
              <label className="text-[#47525E] text-[14px]">
                We don't share identity of owner of property on Bookaroo. So
                make sure to use a username to avoid being contacted outside of
                the platform
              </label>
              <Tooltip
                id="infoTooltip1"
                place="top"
                effect="solid"
                className="!w-[300px] text-sm text-center"
              />
            </div>
          </div> */}
          <div className="mt-4 bg-white p-5 rounded-md md:w-[500px] w-[100%] shadow_new border  border-[#986dcd7d] mb-8 flex items-start">
            <div className="me-4 w-[20%]">
              <img
                src="/assets/img/info-g.svg"
                className="sm:w-[60px] w-[50px]  mb-4  -mt-[2px] shadow_new rounded-[50px] p-1 border"
                alt="Info"
              />
            </div>

            <div className="flex items-start flex-col w-[75%]">
              <h5 className="text-[#47525E] text-[16px] font-[600]  mb-2 border-b border-dashed border-[#47525E]  ">
                Don't use your real name unless your are a pro
              </h5>
              <label className="text-[#47525E] text-[14px] ">
                We don't share identity of owner of property on Bookaroo. So
                make sure to use a username to avoid being contacted outside of
                the platform
              </label>
            </div>
          </div>
          <div className="md:max-w-[500px] w-[100%]">
            <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
              Phone number
            </label>
            <span className="block font-[400] mt-2 mb-2 text-[#47525E] text-[14px]">
              Let your future buyer contact you directly
            </span>
            <PhoneInput
              disabled={!editMode}
              country={"fr"}
              value={formData.phoneNumber}
              onChange={(e) => {
                if (editMode) {
                  setFormData({ ...formData, phoneNumber: e });
                  setError({ ...error, phoneNumber: "" });
                }
              }}
              placeholder="Enter your phone number"
            />
            {error.phoneNumber && (
              <div className="text-[#ff0000] text-sm">{error.phoneNumber}</div>
            )}
          </div>

          <div className="mt-4 rounded-md md:max-w-[500px] w-[100%]">
            <div className="flex items-start">
              <Checkbox
                disabled={!editMode}
                checked={formData.real_estate_market}
                onChange={(e) => {
                  if (editMode) {
                    setFormData({ ...formData, real_estate_market: e });
                  }
                }}
                className="group me-2 rounded-[4px] border border-[#976DD0] data-[checked]:bg-[#976DD0]  h-[16px] w-[16px] shrink-0 p-[1px] flex items-center justify-center group block mt-[6px]"
              >
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
              <label className="text-[#47525E] text-[14px] font-[400] ms-4">
                I refuse to receive emails or calls from Bookaroo for advice on
                my sales project and information on the real estate market.
              </label>
            </div>
          </div>

          <div className="mt-4 rounded-md md:max-w-[500px] w-[100%]">
            <div className="flex items-start">
              <Checkbox
                disabled={!editMode}
                checked={formData.sale_my_property}
                onChange={(e) => {
                  if (editMode) {
                    setFormData({ ...formData, sale_my_property: e });
                  }
                }}
                className="group me-2 rounded-[4px] border border-[#976DD0] data-[checked]:bg-[#976DD0]  mt-[6px]  h-[16px] w-[16px] shrink-0 p-[1px] flex items-center justify-center group block size-7"
              >
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
              <label className="text-[#47525E] text-[14px] font-[400] ms-4">
                I refuse to have my telephone number transmitted to a Bookaroo
                partner agency to assist me in the sale of my property.
              </label>
            </div>



          </div>

          <div className="mt-10 lg:max-w-[800px] w-[100%]">
            <div className="bg-[#e5d9f2] rounded-[20px] p-8">
              <h2 className="text-[#47525E] font-[600] text-[18px] mb-3">
                Increase your property value and attractivity*
              </h2>

              <div className="grid grid-cols-12">
                <div className="lg:col-span-7 col-span-12 pe-14">
                  <p className="text-[#47525E] text-[14px] mb-5">
                    Share with your audience key information on your property that
                    will generate more interest for your property: rental revenues,
                    renovation works, expenses, social platforms rating.
                  </p>
                  <h4 className="text-[#47525E] text-[18px] font-[600]">
                    Ready to increase your property value?
                  </h4>
                  <ul className="w-full mt-5 flex">
                    <li className="flex items-center me-5">
                      <p className="text-[#47525E] font-[600] text-[15px] me-4   ">
                        Yes
                      </p>
                      <Switch
                        checked={formData?.add_more_step}
                        onChange={() => changeAddMore(!addSteps)}
                        className={`${addSteps ? "bg-[#986dcd]" : "bg-[#000]"
                          } relative inline-flex h-4 w-8 items-center rounded-full transition-colors`}
                      >
                        <span className="sr-only">Enable notifications</span>
                        <span
                          className={`${addSteps ? "translate-x-4" : "translate-x-1"
                            } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </li>
                    <li className="flex items-center">
                      <p className="text-[#47525E] font-[600] text-[15px] me-4   ">
                        Later
                      </p>
                      <Switch
                        checked={!formData?.add_more_step}
                        onChange={() => changeAddMore(!addSteps)}
                        className={`${!addSteps ? "bg-[#986dcd]" : "bg-[#000]"
                          } relative inline-flex h-4 w-8 items-center rounded-full transition-colors`}
                      >
                        <span className="sr-only">Enable notifications</span>
                        <span
                          className={`${!addSteps ? "translate-x-4" : "translate-x-1"
                            } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </li>
                  </ul>
                  <p className="italic text-[#47525E] text-[14px] mt-9 font-normal">Don't worry, you can add extra information anytime by udpating your property profile </p>
                </div>
                <div className="lg:col-span-5 col-span-12 lg:mt-0 mt-8">
                  <img
                    src="/assets/img/off-market.png"
                    className="rounded-[20px] lg:w-full w-[400px] xl:h-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-md md:max-w-[500px] w-[100%]">
            <p className="text-[#47525E] text-[14px] my-10 italic" >
              By validating the distribution of my profile, I accept the general
              subscription conditions and the distribution rules of the Bookaroo
              site.
            </p>
            <p className="text-[#47525E] text-[14px] italic">
              A professional seller posing as a consumer or a non-professional
              is liable to the sanctions provided for in article L.132-2 of the
              Consumer Code, namely two years' imprisonment and a fine of
              300,000 euros.
            </p>
          </div>
          {/* <div className="mt-4 rounded-md md:max-w-[500px] w-[100%] bg-white p-5 relative shadow_new">
            <div className="flex items-start">
              <img src="/assets/img/value.svg" alt="" className="w-[40px] mt-[4px] " />
              <Checkbox
                checked={addSteps}
                onChange={(e) => {
                  setaddSteps(e);
                  localStorage.setItem("addMore", e);
                }}
                className="group block size-6 me-2 rounded-[50px] border-[2px] border-[#976DD0] data-[checked]:bg-[#976DD0] absolute top-2 right-0"
              >
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
              <div>
                <label className=" text-[16px] font-[600] ms-4">
                  Add valuable information
                </label>
                <p className="ms-4 text-[#47525E] text-[14px]">
                  You can add other valuable information like Revenue, Ratings,
                  Expenses and Renovation
                </p>
              </div>
            </div>
          </div> */}
        </div>
        {id ? (
          <div className="text-end bg-[#f2ecf8] p-5 w-full ">
            <button
              onClick={save}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              Save change
            </button>
          </div>
        ) : (
          <div className="text-end flex gap-2 justify-end bg-[#f7f4fb] p-5 w-full ">
            <button
              onClick={draftsave}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              Save As Draft
            </button>
            <button
              onClick={handleBack}
              className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 "
            >
              Back
            </button>
            {addSteps || page ? (
              <button
                onClick={handleNext}
                className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn "
              >
                Next
              </button>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  className="btn text-white bg-[#48464a] rounded-full px-10 py-4"
                >
                  {id ? "Upadte" : "List"} my property
                </button>
              </>
            )}
          </div>
        )}
        {msg === `You already have a draft for ${formData?.propertyType} type of property.` ? (
          <SaveDraftModal draftModal={draftModal} setdraftModal={setdraftModal} data={formData} step={8} />) : <></>}
      </div>
    </>
  );
};

export default Step10;
