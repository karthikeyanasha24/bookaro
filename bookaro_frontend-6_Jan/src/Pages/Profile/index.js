import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from "react";
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { login_success, logout } from "../../actions/user";
import PageLayout from '../../components/global/PageLayout';
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import { removePropData } from "../../models/string.model";
import AcountSidebar from '../Settings/AcountSidebar';
import "./profile.scss";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openEmail, setOpenEmail] = useState(false)
  function closeModal() {
    setOpenEmail(false)
    setNewEmail("");
    setError({ ...error, email: "" })
  }
  function openModal() {
    setOpenEmail(true)
  }

  const [formData, setFormData] = useState({
    image: "",
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    companyRole: '',
  });
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleEditPictureClick = () => {
    fileInputRef.current.click();
  };

  const deleteItem = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.delete("user/delete", { id: user?._id }).then((res) => {
          if (res.success) {
            toast.success(res.message);
            dispatch(logout());
            localStorage.removeItem("persist:admin-app");
            localStorage.removeItem("token");
            navigate("/");
          }
          loader(false);
        });
      }
    });
  };

  useEffect(() => {
    if (user) {
      ApiClient.get(`user/detail`, { id: user?._id }).then((res) => {
        if (res.success) {
          setFormData({
            image: res?.data?.image,
            firstName: res?.data?.firstName,
            lastName: res?.data?.lastName,
            email: res?.data?.email,
            username: res?.data?.username,
            companyRole: res?.data?.companyRole,
          });
        }
      });
    }
    removePropData();
  }, []);

  const ImageUpload = (e) => {
    let files = e.target.files;
    let file = files.item(0);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!file) return;
    if (!allowedTypes.includes(file?.type)) {
      return toast.error("Only JPG and PNG images are allowed.");
    }
    loader(true);
    ApiClient.postFormData("upload/image", { file: file }).then((res) => {
      if (res.success) {
        setFormData({ ...formData, image: res?.fileName });
      }
    }).catch(error => {
      console.error("Upload failed:", error);
    }).finally(() => {
      loader(false);
      e.target.value = "";
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName" || name === "lastName") return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username?.trim() ||
      (formData?.accountType == "pro" && !formData.companyRole?.trim())
    ) {
      return toast.error("Enter all mandatory fields");
    }

    loader(true);
    const payload = {
      userId: user?.id || user?._id,
      ...formData,
    };
    ApiClient.put("user/editUserDetails", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        dispatch(login_success({ ...formData }));
      }
      loader(false);
    });
  };

  const [newEmail, setNewEmail] = useState("")
  const [error, setError] = useState({ email: "" })
  const changeEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!newEmail || newEmail?.trim() === "") {
      return setError({ ...error, email: "Email address is required" })
    } else if (!emailRegex.test(newEmail)) {
      return setError({ ...error, email: "Enter a valid email address" })
    } else if (user?.email === newEmail) {
      return setError({ ...error, email: "Current eamil & new email can't be same" })
    }
    if (error.email) return
    let dto = {
      currentEmail: user?.email,
      newEmail,
    }
    loader(true);
    ApiClient.put("user/editUserEmail", dto,).then((res) => {
      if (res.success) {
        closeModal()
        // toast.success(res.message)
        toast.success("Otp has been sent to your current email")
      } else { toast.error(res?.message); }
      loader(false);
    });
  }
  const sendPersonalData = () => {
    loader(true)
    ApiClient.get(`user/sendMyPersonalData`, { id: user?._id })
      .then((res) => {
        if(res.success) toast.success(res.message)
      })
      .catch((err) => { console.log("err", err) })
      .finally(() => { loader(false) })
  }

  return (
    <PageLayout>
      <section className="py-14   lg:py-16 bg-[#f2ecf8]">
        <Transition appear show={openEmail} as={Fragment}>
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
                  <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="mt-2 mb-4">
                      <label className="text-md font-medium leading-6 text-gray-900 mb-1 block">
                        Current Email
                      </label>
                      <input
                        disabled
                        value={user?.email}
                        type="text"
                        className="block w-full h-11 px-3 py-2.5 mb-3 border-[2px] bg-white border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                      />
                    </div>
                    <div className="">
                      <label className="text-md font-medium leading-6 text-gray-900 mb-1 block">
                        New Email
                      </label>
                      <input
                        value={newEmail}
                        onChange={(e) => {
                          setError({ ...error, email: "" });
                          setNewEmail(e.target.value?.toLowerCase()?.trim());
                        }}
                        type="text"
                        className="block w-full h-11 px-3 py-2.5 mb-3 border-[2px] bg-white border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                      />
                      {error?.email && (
                        <span className="text-[#ff0000] text-sm text-left mx-auto block">
                          {error?.email}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="bg-[#976DD0] text-[14px] rounded-[50px] py-[6px] px-[14px] text-white font-bold "
                        onClick={() => changeEmail()}
                      >
                        Submit
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
            <div className="grid grid-cols-12 lg:gap-12  gap-0">
              <AcountSidebar />
              <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8">
                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                  Manage your account
                </h2>
                <div className="p-6 md:px-14 px-6 border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0">
                  <h4 className="text-black font-bold text-[19px]  mb-0">
                    Personal information
                  </h4>
                  <p className="text-black text-[18px] mb-14">
                    Manage your contact details
                  </p>
                  <div className="flex items-center ">
                    <div className="relative">
                      {formData?.image && (
                        <div className="bg-white p-1 rounded-full cursor-pointer absolute top-0 right-1 text-sm">
                          <RxCross2
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                image: "",
                              }));
                            }}
                          />
                        </div>
                      )}
                      <img
                        src={
                          formData?.image
                            ? methodModel.userImg(formData?.image)
                            : "/assets/img/id.png"
                        }
                        className="w-[100px] h-[100px] object-cover rounded-full me-1"
                        alt="Profile"
                      />
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={ImageUpload}
                      accept={".jpeg, .jpg, .png, .heic"}
                    />
                    <span
                      className="underline text-[#47525E] text-[16px] ms-2"
                      onClick={handleEditPictureClick}
                      style={{ cursor: "pointer" }}
                    >
                      Edit picture
                    </span>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div>
                      <h3 className="text-[#5A5A5A] font-bold mt-8 text-[20px] mb-2">
                        Your contact details
                      </h3>
                      <p className="text-[#5A5A5A] mb-5 md:text-[16px] text-[14px]">
                        Contact details are only shared with property owners
                        only when you contact them about a property they own.
                        this allows us to increase trust on the plateform and
                        increase chances that you get answers to your questions.
                      </p>
                    </div>

                    <div className=" max-w-[100%]">
                      <input
                        disabled
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="block w-full h-11 px-3 py-2.5 mb-3 border-[1px] bg-[#efefef] border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                        placeholder="First Name"
                      />
                      <input
                        disabled
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="block w-full h-11 px-3 py-2.5 mb-3 border-[1px] bg-[#efefef] border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                        placeholder="Last Name"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="cursor-pointer block w-full h-11 px-3 py-2.5 mb-3 border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                        placeholder="Email"
                        onClick={openModal}
                      />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="block w-full h-11 px-3 py-2.5 mb-3 border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                        placeholder="username"
                      />
                      {user?.accountType === "pro" && (
                        <input
                          type="text"
                          name="companyRole"
                          value={formData.companyRole}
                          onChange={handleInputChange}
                          className="block w-full h-11 px-3 py-2.5 mb-3 border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 text-[#6c6c6c] "
                          placeholder="Role in company"
                        />
                      )}
                    </div>

                    <div className="mt-10 mb-20">
                      <p
                        onClick={sendPersonalData}
                        className="cursor-pointer underline text-[#47525E] text-[16px] inline-block"
                      >
                        Send me my personal data
                      </p>
                    </div>

                    <div>
                      <p className="text-[#5A5A5A] text-[16px]">
                        By authorizing the listing of my property profile, I
                        accept CGU and diffusion rules of Bookaroo and I
                        authorize Bookaroo to display my property profile.
                      </p>
                      <a
                        onClick={() => deleteItem()}
                        className="text-[18px] font-bold text-[#5A5A5A] underline mt-3 block"
                      >
                        Remove my account
                      </a>
                    </div>

                    <div className="mt-20 mx-auto flex items-center justify-end">
                      <button
                        type="submit"
                        className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Profile;
