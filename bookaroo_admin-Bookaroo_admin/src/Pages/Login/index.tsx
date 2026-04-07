import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { Link } from "react-router-dom";
import "./style.scss";
import AuthLayout from "../../components/AuthLayout";
import { useDispatch } from "react-redux";
import { login_success } from "../../actions/user";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [password, setPassword] = useState("");
  const [eyes, setEyes] = useState({
    password: false,
    confirmPassword: false,
    currentPassword: false,
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history("/dashboard");
    }
    let r = localStorage.getItem("remember");
    if (r) {
      let data = JSON.parse(r);
      setUsername(data.email);
      setPassword(data.password);
      setRemember(true);
    }
  }, []);

  const hendleSubmit = (e: any) => {
    e.preventDefault();
    let data: any = {
      email: username,
      password,
    };
    loader(true);
    ApiClient.post(`user/admin/login`, data).then(async (res) => {
      if (res.success) {
        if (remember) {
          localStorage.setItem("remember", JSON.stringify(data));
        } else {
          localStorage.removeItem("remember");
        }
        localStorage.setItem("token", res?.data.access_token);
        dispatch(login_success(res?.data));
        history(`/dashboard`);
      }
      loader(false);
    });
  };

  return (
    <>
      <AuthLayout>
        <form
          className="xl:w-8/12 lg:w-11/12 w-full bg-white  border border-[#976DD04f] p-[24px]  shadow-c"
          onSubmit={hendleSubmit}
        >
          <span className=" xl:w-[150px] z-[99] mb-5 block mx-auto text-center">
            <img src="/assets/img/logo.png" className="w-[200px] mx-auto" alt="logo" />
          </span>

          <div className="mt-5 ">
            <div className="">
              <h1 className="text-[22px] font-semibold text-[#976DD0] text-center mb-10 tracking-[.67px] ">
                Login to your account
              </h1>
              {/* <span className="flex w-10 h-1 bg-[#976DD0] mt-1"></span> */}
            </div>
            <div className="relative">
              <label className="mb-2 block"> Email Address</label>
              {/* <div className="absolute z-[99] p-3 px-4 bg-[#00358512] text-[#0035859c] rounded-tl-[7px] rounded-bl-[7px]">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </div> */}
              <input
                type="email"
                className="mb-5 relative bg-white w-full rounded-lg h-12 flex items-center gap-2 overflow-hidden mb-0 bginput w-full pl-[15px]"
                // placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <label className="mb-2 block"> Password</label>
            <div className="relative mb-6">
              {/* <div className="absolute z-[99] p-3 px-4 bg-[#00358512] text-[#0035859c] rounded-tl-[7px] rounded-bl-[7px]">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </div> */}
              <input
                type={eyes.password ? "text" : "password"}
                className="mb-5 relative bg-white w-full rounded-lg h-12 flex items-center gap-2 overflow-hidden mb-0 bginput w-full pl-[15px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // placeholder="Password"
                required
              />
              {eyes.password ? (
                <FiEye
                  className="top-4 right-3 absolute text-[#333] cursor-pointer"
                  onClick={() =>
                    setEyes({ ...eyes, password: !eyes.password })
                  }
                />
              ) : (
                <FiEyeOff
                  className="top-4 right-3 absolute text-[#333] cursor-pointer"
                  onClick={() =>
                    setEyes({ ...eyes, password: !eyes.password })
                  }
                />
              )}
            </div>
          </div>
          <div className="flex">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2 h-4 w-4 cursor-pointer"
                style={{ accentColor: "#976DD0" }}
              />{" "}
              <span className="text-[14px] font-normal text-[#333]">
                Remember Me
              </span>
            </label>
            <Link className="font-semibold text-[14px] ml-auto text-[#976DD0]" to="/forgotpassword">
              {" "}
              Forgot Password?
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center">
            <button type="submit" className="h-11 rounded-full w-52 font-medium text-center text-white hover:opacity-80 transition-all">
              Sign in
            </button>
          </div>
        </form>
      </AuthLayout>
    </>
  );
};

export default Login;
