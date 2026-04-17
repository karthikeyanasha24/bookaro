import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import FacebookLogin from 'react-facebook-login';
import { useTranslation } from "react-i18next";
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
  // Hooks toujours en haut
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const googleClientId: string = process.env.REACT_APP_CLINT_ID as string;
  const fbAppId: string = process.env.REACT_APP_FACEBOOK_APP_ID as string;
  const [social, setSocial] = useState<any>({ google: "", fb: "" });
  const propertyId = methodModel.getPrams('propertyId');
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

  // 1. Force le mock user si mode autonome et pas loggé
  useEffect(() => {
    if (process.env.REACT_APP_DEBUG_MOCK_USER === 'true' && (!user || !user.loggedIn)) {
      dispatch(login_success({
        ...user,
        loggedIn: true,
        email: user?.email || 'test@example.com',
        fullName: user?.fullName || 'Test User',
        token: 'mock-token',
      }));
    }
  }, []);

  // 2. Redirection immédiate si loggé (mock ou réel)
  useEffect(() => {
    if (user && user.loggedIn) {
      navigate("/dashboard");
    }
  }, [user, navigate]);


  // 3. Attendre l'init Redux avant d'afficher le formulaire (sinon return null)
  // On ne retourne plus null ici pour éviter les hooks conditionnels

  // ...le reste du composant (formulaire, handlers, etc.)...


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
        // checkEmail neutralisé en mode autonome
      }
    } catch (error) {
      console.error(t("messages.errorDecodingToken"), error);
    }
  };
  const onFacebookSuccess = (res: any) => {
    if (res.status !== 'unknown') {
      console.log(t("messages.facebookLoginSuccess"), res);
      setSocial({ ...social, fb: res });
      // checkEmail neutralisé en mode autonome
    } else {
      console.error(t("messages.facebookLoginFailed"), res);
    }
  };


  // Mode autonome : simule la vérification d'email sans appel réseau
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Simule un login réussi pour le front autonome
    setTimeout(() => {
      dispatch(login_success({
        email: form.email,
        fullName: form.fullName || "Utilisateur",
        isVerified: "Y",
        token: "mock-token",
      }));
      toast.success("Connexion réussie (mode autonome)");
      navigate("/dashboard");
    }, 500);
  };

  // Handler pour le bouton signup
  const signup = () => {
    let url = '/signup';
    if (propertyId) url = `/signup?propertyId=${propertyId}`;
    navigate(url);
  };

  return (
    <>
      <AuthLayout>
        <form className="flex items-center justify-center login flex-col w-full"
            onSubmit={handleSubmit} autoComplete="off">
          <Link to="/">
            <img src="assets/img/logo.png" className="w-[150px] mx-auto mb-12" />
          </Link>
          <div className="2xl:w-7/12 xl:w-9/12 lg:w-11/12 w-full p-[30px] mx-auto border border-[#976DD0] rounded-[8px] bg-white">
            <div className="mt-5">
              <h1 className="text-[22px] font-semibold text-[#47525E] text-center mb-5 tracking-[.67px] ">
                {t("authentication.login")}
              </h1>
              <div className="mb-4">
                <input
                  type="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  value={form.email}
                  className="block w-full h-11 px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md border-[#976DD0] mb-3"
                  placeholder={t("forms.emailAddress")}
                  autoComplete="off"
                  disabled={methodModel.getPrams("attended") ? true : false}
                  required
                />
                <div className="relative ">
                  <input
                    type={eyes.password ? "text" : "password"}
                    className="block w-full h-11 px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md border-[#976DD0] "
                    placeholder={t("forms.password")}
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
                  {t("authentication.forgotPassword")}
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <button
                  type="submit"
                  className="h-11 !bg-[#48464a] w-[200px] px-7  rounded-full font-medium text-center text-white hover:opacity-80 transition-all"
                >
                  {t("buttons.login")}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center my-6">
              <p className="w-[45%] bg-[#ddd] h-[1px] "></p>
              <p className="mx-3">{t("buttons.or")}</p>
              <p className="w-[45%] bg-[#ddd] h-[1px] "></p>
            </div>
            <div className="sm:flex ">
              <div className=" sm:w-1/2">
                <GoogleOAuthProvider clientId={googleClientId}>
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => {
                      console.log(t("messages.googleLoginFailed"));
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
            {t("authentication.dontHaveAccount")}{" "}
            <span onClick={() => signup()} className="text-[#976DD0] text-sm cursor-pointer">
              {t("buttons.signup")}
            </span>
          </p>
        </form>
      </AuthLayout>
    </>
  );
};

export default Login;
