import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import "./style.scss";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { toast } from "react-toastify";

const Forgotpassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "" });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const hendleSubmit = (e: any) => {
    e.preventDefault();
    loader(true);
    ApiClient.post("user/admin/forgot/password", form).then((res) => {
      if (res.success) {
        navigate("/login");
        setTimeout(() => {
          toast.success(res.message);
        }, 100);
      }
      loader(false);
    });
  };

  return (
    <>
      <AuthLayout>
        <form onSubmit={hendleSubmit} className="xl:w-8/12 lg:w-11/12 w-full bg-white  border border-[#976DD04f] p-[24px]  shadow-c">
          <div>
            <h1 className="text-[22px] font-semibold text-[#976DD0]  mb-5 tracking-[.67px]">Forgot Password</h1>
          </div>
          <p className="text-[16px] font-normal text-[#333] mt-4">{" "}No worries! Just enter your email and we’ll send you a resetpassword link.</p>
          <div className="mt-5">
            <div className="relative">
              <input
                type="email"
                className="mb-5 relative bg-white w-full rounded-lg h-12 flex items-center gap-2 overflow-hidden mb-0 bginput w-full pl-[15px]"
                value={form.email}
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center justify-center mt-6">
            <button type="submit" className="h-11 rounded-full w-52 text-center text-[#fff] bg-[#976DD0] font-semibold hover:opacity-80 transition-all">Send Recovery Email</button>
          </div>
          <p className="text-[#333] text-center font-normal text-[14px] mt-4">{" "}Just Remember?
            <Link className="text-[#976DD0] text-[14px] !font-semibold" to="/login">{" "}Sign In</Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
};

export default Forgotpassword;
