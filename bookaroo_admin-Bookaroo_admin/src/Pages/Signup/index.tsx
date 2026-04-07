import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { Link } from "react-router-dom";
import "./style.scss";
import AuthLayout from "../../components/AuthLayout";
import environment from "../../environment";
import { toast } from "react-toastify";
import methodModel from "../../methods/methods";
import FormControl from "../../components/common/FormControl";
import { useDispatch, useSelector } from "react-redux";
import { login_success } from "../../actions/user";

const Signup = () => {
  const history = useNavigate();
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [form, setForm]: any = useState({
    email: "",
    password: "",
    fullName: "",
    loginId: "",
  });
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [groups, setGroups] = useState([]);
  const [eyes, setEyes] = useState({
    password: false,
    confirmPassword: false,
    currentPassword: false,
  });

  const setLogin = async (data: any) => {
    let url = "/profile";
    let eventId = methodModel.getPrams("eventId");
    if (eventId) {
      if (methodModel.getPrams("attended")) {
        try {
          const res = await ApiClient.get(
            `api/attandance?email=${data?.email}&eventId=${eventId}`
          );
          if (res.success === true) {
            url = `/thanku`;
          }
        } catch (error) {
          console.error("Error fetching attendance:", error);
        }
      } else {
        url = `/event/detail/${eventId}`;
      }
    }
    localStorage.setItem("token", data.access_token);
    dispatch(login_success(data));
    history(url);
  };

  const getGroups = () => {
    ApiClient.get("api/group/list", { status: "active" }).then((res: any) => {
      if (res.success) {
        setGroups(res.data);
      }
    });
  };

  const hendleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);

    let url = "api/user/register";
    let eventId = methodModel.getPrams("eventId");
    let groupId = methodModel.getPrams("groupId");

    if (!remember) return;

    let data: any = {
      role: "",
      ...form,
    };

    if (groupId) data.groupId = groupId;

    loader(true);

    ApiClient.post(url, data).then(async (res) => {
      if (res.success) {
        if (eventId || groupId) {
          await ApiClient.post("api/auto/login", { id: res.data._id }).then(
            async (res) => {
              setLogin(res.data);
            }
          );
        } else {
          let url = "/login";
          setTimeout(() => {
            toast.success("Please verify your email");
          }, 400);
          history(url);
        }
      }
      loader(false);
    });
  };

  useEffect(() => {
    let email = methodModel.getPrams("email");
    if (user && user?.loggedIn) {
      history("/dashboard");
    }

    if (email) {
      setForm({
        ...form,
        email: email,
        fullName: methodModel.getPrams("name"),
      });
    }

    getGroups();
  }, []);

  const [loginIdExists, setLoginIdExists] = useState(true);

  const getLoginId = (loginId: any) => {
    ApiClient.get(`api/check/login-id?loginId=${loginId ? loginId : null}`)
      .then((res) => {
        if (res.success) {
          setLoginIdExists(true);
        } else {
          setLoginIdExists(false);
        }
      })
      .catch((error) => {
        console.error("Error checking login ID:", error);
        setLoginIdExists(true);
      });
  };

  const handleLoginIdChange = (e: any) => {
    const { value } = e.target;
    setForm({ ...form, loginId: value });
    getLoginId(value);
  };
  return (
    <>
      <AuthLayout>
        <form
          className="w-11/12 md:w-7/12	mx-auto"
          onSubmit={hendleSubmit}
          autoComplete="off"
        >
          <h4 className="text-typo mb-6 text-2xl font-bold">Sign Up</h4>
          {/* <input type="text"
            onChange={e => setForm({ ...form, loginId: e.target.value })}
            value={form.loginId}
            className="shadow-box border-1 border-gray-300 relative bg-gray-100 mb-3 w-full text-sm placeholder:text-gray-500 rounded-lg h-12 flex items-center gap-2 overflow-hidden px-2 hover:ring-orange-500 focus:border-orange-500"
            // placeholder="Login Id"
            autoComplete='off'
            disabled={methodModel.getPrams('attended')?true:false}
            required /> */}
          <input
            type="text"
            onChange={handleLoginIdChange}
            value={form.loginId}
            className={`shadow-box border-1 border-gray-300 relative bg-gray-100 mb-3 w-full text-sm placeholder:text-gray-500 rounded-lg h-12 flex items-center gap-2 overflow-hidden px-2 hover:ring-orange-500 focus:border-[#976DD0]${
              loginIdExists ? "" : "border-red-500"
            }`}
            // placeholder="Login Id"
            autoComplete="off"
            maxLength={8}
            disabled={methodModel.getPrams("attended") ? true : false}
            required
          />
          {loginIdExists ? null : (
            <p className="text-red-500">Login ID already exists.</p>
          )}

          <input
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            value={form.email}
            className="shadow-box border-1 border-gray-300 relative bg-gray-100 mb-3 w-full text-sm placeholder:text-gray-500 rounded-lg h-12 flex items-center gap-2 overflow-hidden px-2 hover:ring-orange-500 focus:border-orange-500"
            // placeholder="Email address"
            autoComplete="off"
            disabled={methodModel.getPrams("attended") ? true : false}
            required
          />
          <input
            type="text"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            value={form.fullName}
            className="shadow-box border-1 border-gray-300 relative bg-gray-100 mb-3 w-full text-sm placeholder:text-gray-500 rounded-lg h-12 flex items-center gap-2 overflow-hidden px-2 hover:ring-orange-500 focus:border-orange-500"
            // placeholder="Enter Name"
            autoComplete="off"
            required
          />
          <div className="relative mb-6">
            <input
              type={eyes.password ? "text" : "password"}
              className="shadow-box border-1 border-gray-300 relative bg-gray-100 w-full text-sm placeholder:text-gray-500 rounded-lg h-12 flex items-center gap-2 overflow-hidden px-2 hover:ring-orange-500 focus:border-orange-500"
              // placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              value={form.password}
              minLength={8}
              autoComplete="off"
              required
            />

            <div className="absolute right-2 inset-y-0 flex items-center text-gray-500 text-sm">
              <i
                className={eyes.password ? "fa fa-eye" : "fa fa-eye-slash"}
                onClick={() => setEyes({ ...eyes, password: !eyes.password })}
              ></i>
            </div>
          </div>


          <div className="flex">
            <label className="flex items-center pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2 h-4 w-4"
              />{" "}
              <span className="text-xs text-gray-600">
                By clicking Create account, I agree that I have read and
                accepted the Terms of Use and Privacy Policy.
              </span>
            </label>
            {/* <Link className="sign_up ml-auto text-primary" to="/forgotpassword"> Forgot Password</Link> */}
          </div>

          {submitted && !remember ? (
            <>
              <div className="text-[#976DD0] text-sm capitalize mt-3">
                Please agree our Terms Of Use And Privacy Policy
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="mt-8">
            <button
              type="submit"
              className="px-4 w-full text-sm font-normal text-white h-12 flex items-center justify-center gap-2 !bg-[#976DD0] rounded-lg shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </div>

          <p className="text-sm mt-3 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[#976DD0] text-sm">
              Sign In
            </Link>
          </p>
        </form>
      </AuthLayout>
    </>
  );
};

export default Signup;
