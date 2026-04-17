import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import "./style.scss";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { toast } from "react-toastify";

const Forgotpassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: "" });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const hendleSubmit = (e: any) => {
    e.preventDefault();
    loader(true);
    // Mode autonome : simule le succès sans appel réseau
    setTimeout(() => {
      navigate("/login");
      setTimeout(() => {
        toast.success(t("messages.forgotPasswordSuccess"));
      }, 100);
      loader(false);
    }, 500);
  };

  return (
    <>
      <AuthLayout>
        <form className="flex items-center justify-center flex-col login" onSubmit={hendleSubmit} autoComplete="off">
          <a href="#">  <img src="assets/img/logo.png" className="w-[150px] mx-auto mb-12" /></a>
          <div className="xl:w-9/12 lg:w-11/12 w-full p-[30px] mx-auto border border-[#976DD0] rounded-[8px] bg-white">
            <div className="mt-5">

              <h1 className="text-[22px] font-semibold text-[#47525E] text-center mb-5 tracking-[.67px] ">
                {t("authentication.forgotPassword")}
              </h1>
              <p className="text-[16px] font-normal text-[#333] mt-4 text-center">{t("authentication.forgotPasswordInfo")}</p>
              <div className="mb-3 mt-5">
                <input
                  type="email"
                  className="block w-full h-10 px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md border-[#976DD0] mb-2"
                  placeholder={t("forms.email")}
                  value={form.email}
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

              </div>



              <div className="flex items-center justify-center mt-6">
                <button type="submit" className="h-11 rounded-full w-52 text-center text-[#fff] bg-[#48464a] font-semibold hover:opacity-80 transition-all signup-btn">{t("buttons.sendRecoveryEmail")}</button>
              </div>
              <p className="text-[#333] text-center font-normal text-[14px] mt-4">{t("authentication.rememberPassword")}
                <Link className="text-[#976DD0] text-[14px] !font-semibold " to="/login">{" "}{t("buttons.login")}</Link>
              </p>
            </div>
          </div>
        </form>
      </AuthLayout>
    </>
  );
};

export default Forgotpassword;
