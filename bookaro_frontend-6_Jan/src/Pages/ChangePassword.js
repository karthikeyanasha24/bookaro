import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../components/global/PageLayout";
import ApiClient from "../methods/api/apiClient";
import loader from "../methods/loader";
import methodModel from "../methods/methods";
import AcountSidebar from "./Settings/AcountSidebar";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const formValidation = [
    // {
    //   key: "confirmPassword",
    //   minLength: 8,
    //   confirmMatch: ["confirmPassword", "newPassword"],
    // },
    // { key: "currentPassword", minLength: 8 },
    { key: "newPassword", minLength: 8 },
  ];
  const [eyes, setEyes] = useState({
    newPassword: false,
    confirmPassword: false,
    currentPassword: false,
  });

  const getError = (key) => {
    return methodModel.getError(key, form, formValidation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (form.currentPassword?.trim() === "") return toast.error("Enter current password");
    if (form.newPassword?.trim() === "") return toast.error("Enter new password");
    if (form.newPassword !== form.confirmPassword) return toast.error("Confirm password must match")
    let invalid = methodModel.getFormError(formValidation, form);
    if (invalid) return;
    loader(true);
    let payload = {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    };
    let url = "user/change/password";
    ApiClient.put(url, payload).then((res) => {
      if (res.success) {
        toast.success(res?.message)
        navigate("/profile/Account")
      }
      loader(false);
    });
  };

  return (
    <PageLayout>
      <section className="py-14   lg:py-16 bg-[#f2ecf8]">
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
            <div className="grid grid-cols-12 lg:gap-12  gap-0">
              <AcountSidebar />
              <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8">
                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                  Manage your account
                </h2>
                <div className="p-10 md:px-14 px-8  flex flex-col justify-between  border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0">
                  <div>
                    <h4 className="text-black font-bold text-[19px]  mb-0">
                      Password
                    </h4>
                    <p className="text-black text-[18px]  mb-2 ">
                      Set a new strong password you are using nowhere else
                      already.
                    </p>

                    <div className="mt-10">
                      <div className="mb-5  max-w-[100%] ">
                        <div className="relative">
                          <input
                            type={eyes.currentPassword ? "text" : "password"}
                            className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[2px] border-[#976DD0] rounded-md placeholder-gray-400  "
                            value={form.currentPassword}
                            maxLength={16}
                            onChange={(e) =>
                              setForm({ ...form, currentPassword: e.target.value })
                            }
                            placeholder="Current Password"
                            required
                          />
                          {eyes.currentPassword ? (
                            <FiEye
                              className="top-4 right-3 absolute text-[#333] cursor-pointer"
                              onClick={() =>
                                setEyes({
                                  ...eyes,
                                  currentPassword: !eyes.currentPassword,
                                })
                              }
                            />
                          ) : (
                            <FiEyeOff
                              className="top-4 right-3 absolute text-[#333] cursor-pointer"
                              onClick={() =>
                                setEyes({
                                  ...eyes,
                                  currentPassword: !eyes.currentPassword,
                                })
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div className="mb-5  max-w-[100%] ">
                        <div className="relative">
                          <input
                            type={eyes.newPassword ? "text" : "password"}
                            className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[2px] border-[#976DD0] rounded-md placeholder-gray-400  "
                            value={form.newPassword}
                            maxLength={16}
                            onChange={(e) =>
                              setForm({ ...form, newPassword: e.target.value })
                            }
                            placeholder="New Password"
                            required
                          />
                          {eyes.newPassword ? (
                            <FiEye
                              className="top-4 right-3 absolute text-[#333] cursor-pointer"
                              onClick={() =>
                                setEyes({ ...eyes, newPassword: !eyes.newPassword })
                              }
                            />
                          ) : (
                            <FiEyeOff
                              className="top-4 right-3 absolute text-[#333] cursor-pointer"
                              onClick={() =>
                                setEyes({ ...eyes, newPassword: !eyes.newPassword })
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div className="relative mb-5  max-w-[100%] ">
                        <input
                          type={eyes.confirmPassword ? "text" : "password"}
                          className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[2px] border-[#976DD0] rounded-md placeholder-gray-400  "
                          value={form.confirmPassword}
                          maxLength={16}
                          onChange={(e) =>
                            setForm({ ...form, confirmPassword: e.target.value })
                          }
                          placeholder="Confirm Password"
                          required
                        />
                        {eyes.confirmPassword ? (
                          <FiEye
                            className="top-4 right-3 absolute text-[#333] cursor-pointer"
                            onClick={() =>
                              setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })
                            }
                          />
                        ) : (
                          <FiEyeOff
                            className="top-4 right-3 absolute text-[#333] cursor-pointer"
                            onClick={() =>
                              setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })
                            }
                          />
                        )}
                      </div>
                      {submitted && getError("newPassword").invalid && (
                        <div className="d-block text-red-600 text-[13px]">
                          Min Length must be 8 characters long
                        </div>
                      )}

                    </div></div>

                  <div className="mt-20 flex items-center justify-end">
                    <button
                      onClick={handleSubmit}
                      className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ChangePassword;
