import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import "./style.scss";
import AuthLayout from "../../components/AuthLayout";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Resetpassword = () => {
  const history = useNavigate();
  const [form, setForm]: any = useState({
    confirmPassword: "",
    newPassword: "",
    verificationCode: "",
    id: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [eyes, setEyes] = useState({ newPassword: false, confirmPassword: false });
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
      history("/dashboard");
    }
    let prm = {
      id: methodModel.getPrams("id"),
      verificationCode: methodModel.getPrams("code"),
    };
    setForm({ ...form, ...prm });
  }, []);

  const getError = (key: any) => {
    return methodModel.getError(key, form, formValidation);
  };

  const hendleSubmit = (e: any) => {
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
    ApiClient.put("user/admin/reset/password", payload).then((res) => {
      if (res.success) {
        history("/login");
      }
      loader(false);
    });
  };

  return (
    <>
      <AuthLayout>
        <form onSubmit={hendleSubmit} className="xl:w-8/12 lg:w-11/12 w-full bg-white  border border-[#976DD04f] p-[24px]  shadow-c">
          <div className="mb-4">
            <h3 className="text-[22px] font-semibold text-[#976DD0] text-center mb-4 tracking-[.67px]">New Password</h3>
          
            <p className="text-[14px] font-normal text-[#333]  mb-5 text-center">Please create a new password that you don’t use on any other site.</p>
          </div>
          <div className="mb-3">
            <div className="relative">
             
              <input
                type={eyes.newPassword ? "text" : "password"}
                className="mb-5 relative bg-white w-full rounded-lg h-12 flex items-center gap-2 overflow-hidden mb-0 bginput w-full pl-[15px]"
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
            {submitted && getError("newPassword").invalid ? (
              <div className="d-block text-red-600 text-[13px]">
                Min Length must be 8 characters long
              </div>
            ) : (
              <></>
            )}
            <div className="mb-3">
              <div className="relative">
               
                <input
                  type={eyes.confirmPassword ? "text" : "password"}
                  className="mb-5 relative bg-white w-full rounded-lg h-12 flex items-center gap-2 overflow-hidden mb-0 bginput w-full pl-[15px]"
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
              {submitted && getError("confirmPassword").err.confirmMatch ? (
                <div className="d-block text-red-600">
                  Confirm Password is not matched with New Password
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="mt-10 flex items-center justify-center">
            <button type="submit" className="h-11 rounded-full w-52 font-medium text-center text-white hover:opacity-80 transition-all">
              Save
            </button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
};

export default Resetpassword;
