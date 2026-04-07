import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import FacebookLogin from 'react-facebook-login';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login_success } from "../../actions/user";
import AuthLayout from "../../components/AuthLayout";
import { requestForToken } from "../../config/Firebase/FirebaseAuth";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import "./style.scss";


const Login = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state);
  const dispatch = useDispatch();
  const googleClientId: string = process.env.REACT_APP_CLINT_ID as string;
  const fbAppId: string = process.env.REACT_APP_FACEBOOK_APP_ID as string;
  const [social, setSocial] = useState<any>({
    google: "", fb: "",
  });
  const propertyId = methodModel.getPrams('propertyId')

  const [form, setForm]: any = useState({
    email: "",
    password: "",
    fullName: "",
    loginId: "",
  });
  const [eyes, setEyes] = useState({
    password: false,
    confirmPassword: false,
    currentPassword: false,
  });

  const deviceInfo = {
    deviceToken: localStorage.getItem("deviceToken"),
    deviceID: `${navigator.product}_${navigator.productSub}`,
    deviceName: navigator.platform,
  };
  const hendleSubmit = (e: any) => {
    e.preventDefault();
    let url = "user/login";
    let data: any = {
      ...form,
      deviceToken: deviceInfo?.deviceToken,
      deviceId: deviceInfo?.deviceID,
      deviceName: deviceInfo?.deviceName,
    };
    loader(true);
    ApiClient.post(url, data).then(async (res) => {
      if (res.success) {
        if (res?.data?.isVerified == "Y") {
          let url = "/";
          setTimeout(() => {
            toast.success(res?.message);
          }, 400);
          localStorage.setItem("token", res?.data.access_token);

          let renterFiles: any = res.data.renterFiles
          if (renterFiles) {
            Object.keys(renterFiles).map(key => {
              let arr = (renterFiles?.[key]?.length ? renterFiles[key] : []) || []
              renterFiles[key] = arr?.map((itm: any) => ({ ...itm, checked: true })) || []
            })
            res.data.renterFiles = renterFiles
          }
          dispatch(login_success(res?.data));

          if (propertyId) url = `/property-details?id=${propertyId}`
          navigate(url);
        } else {
          setTimeout(() => {
            toast.success("Verify Otp");
          }, 400);
          navigate(`/otpverify?email=${form?.email}&propertyId=${propertyId}`);
        }
      }
      loader(false);
    });
  };

  useEffect(() => {
    let email = methodModel.getPrams("email");
    if (user && user?.loggedIn) {
      navigate("/");
    }

    if (email) {
      setForm({
        ...form,
        email: email,
        fullName: methodModel.getPrams("name"),
      });
    }
  }, []);

  useEffect(() => {
    const fcmToken = async () => {
      const deviceToken = await requestForToken();
      if (deviceToken) {
        localStorage.setItem("deviceToken", deviceToken);
      }
    };
    fcmToken();
  }, []);

  const onGoogleSuccess = (res: any) => {
    try {
      const decodedToken: any = jwtDecode(res.credential);
      if (decodedToken) {
        setSocial({ ...social, google: decodedToken });
        checkEmail(decodedToken.email);
      }
    } catch (error) {
      console.error("Error decoding token", error);
    }
  };
  const onFacebookSuccess = (res: any) => {
    if (res.status !== 'unknown') {
      console.log('Facebook login success:', res);
      setSocial({ ...social, fb: res });
      checkEmail(res.email)
    } else {
      console.error('Facebook login failed:', res);
    }
  };

  const checkEmail = (email: string) => {
    let url = "user/checkAccount";
    let dto = { email };
    loader(true);
    ApiClient.post(url, dto)
      ?.then((res) => {
        if (res.success) {
          toast.success(res?.message);
          localStorage.setItem("token", res?.data.access_token);
          dispatch(login_success(res?.data));
          let url = '/'
          if (propertyId) url = `/signup?propertyId=${propertyId}`
          navigate(url);
        } else {
          navigate(`/signup?email=${email}&propertyId=${propertyId}`)
        }
      })
      ?.catch((err) => { console.log("err", err) })
      ?.finally(() => {
        loader(false);
      })
  }

  const signup = () => {
    let url = '/signup'
    if (propertyId) url = `/signup?propertyId=${propertyId}`
    navigate(url)
  }

  return (
    <>
      <AuthLayout>
        <form className="flex items-center justify-center login flex-col w-full"
          onSubmit={hendleSubmit} autoComplete="off">
          <Link to="/">
            <img src="assets/img/logo.png" className="w-[150px] mx-auto mb-12" />
          </Link>
          <div className="2xl:w-7/12 xl:w-9/12 lg:w-11/12 w-full p-[30px] mx-auto border border-[#976DD0] rounded-[8px] bg-white">
            <div className="mt-5">
              <h1 className="text-[22px] font-semibold text-[#47525E] text-center mb-5 tracking-[.67px] ">
                Sign In
              </h1>
              <div className="mb-4">
                <input
                  type="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  value={form.email}
                  className="block w-full h-11 px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md border-[#976DD0] mb-3"
                  placeholder="Email address"
                  autoComplete="off"
                  disabled={methodModel.getPrams("attended") ? true : false}
                  required
                />
                <div className="relative ">
                  <input
                    type={eyes.password ? "text" : "password"}
                    className="block w-full h-11 px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md border-[#976DD0] "
                    placeholder="Password"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    value={form.password}
                    minLength={8}
                    autoComplete="off"
                    required
                  />
                  <div className="absolute right-2 inset-y-0 flex items-center text-gray-500 text-sm">
                    <i
                      className={
                        eyes.password ? "fa fa-eye" : "fa fa-eye-slash"
                      }
                      onClick={() =>
                        setEyes({ ...eyes, password: !eyes.password })
                      }
                    ></i>
                  </div>
                </div>
                <Link to="/forgotpassword" className="text-[#976DD0] text-sm text-end ml-auto block mt-[4px]" >
                  Forgot Password ?
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <button
                  type="submit"
                  className="h-11 !bg-[#48464a] w-[200px] px-7  rounded-full font-medium text-center text-white hover:opacity-80 transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center my-6">
              <p className="w-[45%] bg-[#ddd] h-[1px] "></p>
              <p className="mx-3">OR</p>
              <p className="w-[45%] bg-[#ddd] h-[1px] "></p>
            </div>
            <div className="sm:flex ">
              <div className=" sm:w-1/2">
                <GoogleOAuthProvider clientId={googleClientId}>
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => {
                      console.log("Google Login Failed");
                    }}
                    theme="outline"
                  />
                </GoogleOAuthProvider>
              </div>
              <div className="sm:w-1/2 border p-[9px] mt-3 sm:mt-0 sm:ms-3 relative bg-[#1877F2] rounded-[5px]">
                <FacebookLogin
                  appId={fbAppId}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={onFacebookSuccess}
                  icon="fa-facebook"
                  size="small"
                  textButton=" Facebook" // Updated button text
                  cssClass="custom-facebook-button"
                />
              </div>
            </div>
          </div>

          <p className="text-sm mt-3 text-center">
            Don't have an account?{" "}
            <span onClick={() => signup()} className="text-[#976DD0] text-sm cursor-pointer">
              Sign Up
            </span>
          </p>
        </form>
      </AuthLayout>
    </>
  );
};

export default Login;
