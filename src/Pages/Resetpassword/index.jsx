import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import AuthLayout from "../../components/AuthLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import "./style.scss";

const Resetpassword = () => {
  const { t } = useTranslation();
  const history = useNavigate();
  const [form, setForm] = useState({
    confirmPassword: "",
    newPassword: "",
    verificationCode: "",
    id: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [eyes, setEyes] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const formValidation = [
    {
      key: "confirmPassword",
      minLength: 8,
      confirmMatch: ["confirmPassword", "newPassword"],
    },
    { key: "newPassword", minLength: 8 },
  ];

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history("/profile");
    }
    let prm = {
      id: methodModel.getPrams("id"),
      verificationCode: methodModel.getPrams("verificationCode"),
    };
    setForm({ ...form, ...prm });
  }, []);

  const getError = (key) => {
    return methodModel.getError(key, form, formValidation);
  };

  const hendleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);
    if (invalid) return;
    loader(true);
    let payload = {
      password: form?.newPassword,
      verificationCode: form?.verificationCode,
      id: form?.id,
    };
    ApiClient.put("user/reset/user-password", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message)
        history("/login");
      }
      loader(false);
    });
  };

  return (
    <>
      <AuthLayout>
        <form
          className="flex items-center justify-center w-full flex-col login"
          onSubmit={hendleSubmit}
          autoComplete="off"
        >
           <a href="#">  <img src = "assets/img/logo.png" className="w-[150px] mx-auto mb-12"/></a>
          <div className="xl:w-8/12 lg:w-11/12 w-full p-[30px] mx-auto border border-[#976DD0] rounded-[8px] bg-white">
            <div className="mt-5">
              <h1 className="text-[22px] font-semibold text-[#47525E] text-center mb-5 tracking-[.67px] ">
                {t("authentication.newPassword")}
              </h1>
              <p className="text-[16px] font-normal text-[#333] mt-4  text-center mb-5">
                {t("authentication.newPasswordHelp")}
              </p>

              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full h-11 px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md border-[#976DD0] "
                    value={form.verificationCode}
                    maxLength={16}
                    onChange={(e) =>
                      setForm({ ...form, verificationCode: e.target.value })
                    }
                    placeholder={t("authentication.enterVerificationCode")}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="relative">
                  <input
                    type={eyes.newPassword ? "text" : "password"}
                    className="block w-full h-11 px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md border-[#976DD0] "
                    value={form.newPassword}
                    maxLength={16}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    placeholder={t("authentication.newPasswordPlaceholder")}
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
                {submitted && getError("newPassword").invalid ? (
                  <div className="text-xs text-red-500 mt-[4px]">
                    {t("validation.passwordMinLength")}
                  </div>
                ) : (
                  <></>
                )}
               </div>
               
              </div>
              <div className="mb-4">
                  <div className="relative  ">
                    <input
                      type={eyes.confirmPassword ? "text" : "password"}
                      className="block w-full h-11 px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md border-[#976DD0]"
                      value={form.confirmPassword}
                      maxLength={16}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      placeholder={t("authentication.confirmPasswordPlaceholder")}
                      required
                    />
                    {eyes.confirmPassword ? (
                      <FiEye
                        className="top-4 right-3 absolute text-[#333] cursor-pointer"
                        onClick={() =>
                          setEyes({
                            ...eyes,
                            confirmPassword: !eyes.confirmPassword,
                          })
                        }
                      />
                    ) : (
                      <FiEyeOff
                        className="top-4 right-3 absolute text-[#333] cursor-pointer"
                        onClick={() =>
                          setEyes({
                            ...eyes,
                            confirmPassword: !eyes.confirmPassword,
                          })
                        }
                      />
                    )}
                  </div>
                  {submitted && getError("confirmPassword").err.confirmMatch ? (
                    <div className="text-xs text-red-500 mt-[4px] ">
                      {t("authentication.confirmPasswordMismatch")}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              <div className="flex items-center justify-center mt-8">
                <button
                  type="submit"
                  className="h-11 rounded-full w-52 text-center text-[#fff] bg-[#976DD0] font-semibold hover:opacity-80 transition-all signup-btn"
                >
                  {t("common.save")}
                </button>
              </div>
            </div>
        
        </form>
      </AuthLayout>
    </>
  );
};

export default Resetpassword;
