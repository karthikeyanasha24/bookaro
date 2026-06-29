import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import FacebookLogin from 'react-facebook-login';
import PhoneInput from "react-phone-input-2";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthLayout from "../../components/AuthLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";

const Signup = () => {
  const navigate = useNavigate();
  const googleClientId = process.env.REACT_APP_CLINT_ID;
  const fbAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
  const propertyId = methodModel.getPrams('propertyId') || ''
  const email = methodModel.getPrams('email')
  const scrollRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [social, setSocial] = useState({
    google: "", fb: "",
  });
  const [form, setForm] = useState({
    property: "",
    firstName: "",
    lastName: "",
    email: email,
    mobileNo: "",
  })

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) {
      newErrors.firstName = "First name is required.";
    } else if (form.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters.";
    }
    if (!form.lastName) {
      newErrors.lastName = "Last name is required.";
    } else if (form.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters.";
    }

    if (!form.email) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email address is required.";
    }
    if (!/^\+?\d{10,15}$/.test(form.mobileNo) && form.mobileNo) {
      newErrors.mobileNo = "Mobile No is invalid.";
    }
    if (!form.property) {
      newErrors.property = "Please select how you want to manage your property.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    if (!remember) return;
    const url = "user/registerUser";
    const data = {
      accountType: "individual",
      property: form.property,
      firstName: form.firstName,
      lastName: form.lastName,
      fullName: `${form.firstName} ${form.lastName}`,
      email: form.email,
      mobileNo: form.mobileNo,
    };
    loader(true);
    ApiClient.post(url, data).then(async (res) => {
      if (res.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Please verify your email.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate(`/otpverify?email=${form.email}&propertyId=${propertyId}`, { state: { propertyType: form.property } });
        });
      }
    })
      .catch((err) => { })
      .finally(() => {
        loader(false);
      })
  };
  const handlechange = (key, val) => {
    setForm({
      ...form, [key]: val
    })
    setErrors({ ...errors, [key]: "" })
  }

  // social logins
  const onGoogleSuccess = (res) => {
    const decodedToken = jwtDecode(res.credential);
    if (decodedToken) {
      setSocial({ ...social, google: decodedToken });
      setForm({
        ...form,
        email: decodedToken.email,
        firstName: decodedToken.name,
      })
      setErrors({ ...errors, email: "", firstName: "", });
    }
  };
  const onFacebookSuccess = (res) => {
    if (res.status !== 'unknown') {
      console.log('Facebook login success:', res);
      setSocial({ ...social, fb: res });
      setForm({
        ...form,
        email: res.email,
        firstName: res.name,
      })
      setErrors({ ...errors, email: "", firstName: "", });
    } else {
      console.error('Facebook login failed:', res);
    }
  };


  const roleType = (url = '') => {
    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (propertyId) params.append("propertyId", propertyId);
    navigate(`${url}${params.toString() ? '?' : ''}${params.toString()}`);
  }


  return (
    <AuthLayout>
      <div className="xl:w-8/12 lg:w-11/12 w-full p-[24px] login">
        <h1 className="text-[24px] font-semibold text-[#47525E] text-center tracking-[.67px] ">
          Create an account
        </h1>
        <p className="text-center text-[14px]  mb-5">Already have an account ? <Link to={`/login${propertyId ? `?propertyId=${propertyId}` : ''}`} className="text-[#976DD0] font-bold">Sign In</Link> </p>
        <div ref={scrollRef} className="flex items-center justify-center gap-6 mb-10 mt-7">
          <button onClick={() => { roleType(`/signup`) }} className={`h-9 bg-[#976DD0] text-white border-[2px] border-[#976DD0] px-6 py-1 rounded-md  w-[130px] hover:opacity-[90%] text-[16px]`}>Individual</button>
          <button onClick={() => { roleType(`/signup/pro`) }} className={`h-9 text-[#47525E] border-[2px] border-[#976DD0] px-6 py-1 rounded-md w-[130px] hover:opacity-[90%] bg-tranparent text-[#47525E] text-[16px]`}>Pro</button>
        </div>

        <form onSubmit={handleSubmit} >
          <input type="text" disabled={social.google.email} value={form.firstName} onChange={(e) => handlechange("firstName", e.target.value)} className={`block w-full h-11 px-3 py-2.5 text-[#5A5A5A] mb-3 bg-white border-[2px] ${errors.firstName ? 'border-red-500' : 'border-[#976DD0]'} rounded-md placeholder-gray-400`} placeholder="First Name*" />
          {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}

          <input type="text" value={form.lastName} onChange={(e) => handlechange("lastName", e.target.value)} className={`block w-full h-11 px-3 py-2.5 mb-3 bg-white text-[#5A5A5A] border-[2px] ${errors.lastName ? 'border-red-500' : 'border-[#976DD0]'} rounded-md placeholder-gray-400`} placeholder="Last Name*" />
          {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}

          <input type="email" disabled={social.google.email} value={form.email} onChange={(e) => handlechange("email", e.target.value)} className={`block w-full text-[#5A5A5A] h-11 px-3 py-2.5 mb-3 bg-white border-[2px] ${errors.email ? 'border-red-500' : 'border-[#976DD0]'} rounded-md placeholder-gray-400`} placeholder="Email address*" />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

          <div className="w-full signup-input">
            <PhoneInput
              country={"fr"}
              value={form.mobileNo}
              enableSearch={true}
              onChange={(e) => handlechange("mobileNo", e)}
              // inputProps={{ required: true }}
              countryCodeEditable={true}
            />
          </div>
          {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo}</p>}

          <div className="mt-5">
            <div className="text-center mb-8">
              <h2 className="text-[18px] font-[600] ">Tell us a bit more</h2>
              <p className="text-[14px]">About your project</p>
            </div>
            <div className="text-center mb-8">
              <p className="text-[18px] font-[500] mb-5">Looking for a property?</p>
              <div className="grid grid-cols-3 gap-5 text-center mb-8">
                <div onClick={() => {
                  handlechange("property", 'buy')
                }} className={`p-5 border-[2px] ${form.property === "buy" ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer flex justify-center items-start`}>
                  <div>
                    <img src="/assets/img/img_1.png" className="w-[35px] mx-auto" alt="Buy" />
                    <p className="text-[16px]">Buy</p>
                  </div>
                </div>
                <div onClick={() => {
                  handlechange("property", 'rent')
                }} className={`p-5 border-[2px] ${form.property === "rent" ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer flex justify-center items-start`}>
                  <div>
                    <img src="/assets/img/img_2.png" className="w-[35px] mx-auto" alt="Rent" />
                    <p className="text-[16px]">Rent</p>
                  </div>
                </div>
                <div onClick={() => {
                  handlechange("property", 'plan')
                }} className={`p-5 border-[2px] ${form.property === "plan" ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer flex justify-center items-start`}>
                  <div>
                    <img src="/assets/img/img_6.png" className="w-[35px] mx-auto" alt="Plan my project" />
                    <p className="text-[16px]">Plan my project</p>
                  </div>
                </div>
                <div onClick={() => {
                  handlechange("property", 'off-market')
                }} className={`p-5 border-[2px] ${form.property === "off-market" ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer flex justify-center items-start`}>
                  <div>
                    <img src="/assets/img/offmarket.png" className="w-[35px] mx-auto" alt="Off-market opportunities" />
                    <p className="text-[16px]">Off-market opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-5">
            <p className="text-[18px] font-[500] mb-5">You own a property?</p>
            <div className="grid grid-cols-2 gap-5 text-center mb-8">
              <div onClick={() => {
                handlechange("property", 'sell my property')
              }} className={`p-5 border-[2px] ${form.property === "sell my property" ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer w-[120px] mx-auto flex justify-center items-center`}>
                <div>
                  <img src="/assets/img/img_5.png" className="w-[35px] mx-auto" alt="Sell my property" />
                  <p className="text-[16px]">Sell my property</p>
                </div>
              </div>
              <div onClick={() => {
                handlechange("property", 'rent my property')
              }} className={`p-5 border-[2px] ${form.property === "rent my property" ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer w-[120px] mx-auto flex justify-center items-center`}>
                <div>
                  <img src="/assets/img/img_4.png" className="w-[35px] mx-auto" alt="Rent my property" />
                  <p className="text-[16px]">Rent my property</p>
                </div>
              </div>
              <div onClick={() => {
                handlechange("property", 'quote my property')
              }} className={`p-5 border-[2px] ${form.property === "quote my property" ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer w-[120px] mx-auto flex justify-center items-center`}>
                <div>
                  <img src="/assets/img/img_5.png" className="w-[35px] mx-auto" alt="Quote my property" />
                  <p className="text-[16px]">Quote my property</p>
                </div>
              </div>
              <div onClick={() => {
                handlechange("property", 'prepare future sale')
              }} className={`p-5 border-[2px] ${form.property === "prepare future sale" ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer w-[120px] mx-auto flex justify-center items-center`}>
                <div>
                  <img src="/assets/img/img_3.png" className="w-[35px] mx-auto" alt="Prepare future sale" />
                  <p className="text-[16px]">Prepare future sale</p>
                </div>
              </div>
            </div>
            {errors.property && <p className="text-red-500 text-xs">{errors.property}</p>}
          </div>

          <div className="mt-10 flex items-center justify-center ">
            <button type="submit" className="h-11 bg-[#48464a] rounded-full w-52 font-medium text-center text-white hover:opacity-80 transition-all signup-btn">
              Create my account
            </button>
          </div>
        </form>
        {/* <div>
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => {
                console.log("Google Login Failed");
              }}
            />
          </GoogleOAuthProvider>
        </div>
        <div>
          <FacebookLogin
            appId={fbAppId}
            autoLoad={false} // Set to `true` if you want the login to be triggered on page load
            fields="name,email,picture" // Specify the fields you want to retrieve from Facebook
            callback={onFacebookSuccess}
            icon="fa-facebook" // You can add an icon from FontAwesome
            size="small"
          />
        </div> */}

        {/* <p className="text-[14px] text-[#5A5A5A] mt-5 pb-10 text-center">By creating my account I accept the privacy policy, CGU, and diffusion rules of Bookaroo</p> */}
        <div className="flex mt-5">
          <label className="flex items-start pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2 h-4 w-4 mt-[2px]"
            />{" "}
            <span className="text-[12px] text-[#5A5A5A]">
              By creating my account I accept privacy policy, CGU and diffusion rules of Bookaroo
            </span>
          </label>
        </div>
        <div className="text-red-500 text-xs pb-10">
          {submitted && !remember &&
            "Please agree our Terms Of Use And Privacy Policy"
          }
        </div>
      </div>
    </AuthLayout >
  );
};

export default Signup;
