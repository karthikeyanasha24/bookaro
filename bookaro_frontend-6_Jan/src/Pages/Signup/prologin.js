import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import PhoneInput from "react-phone-input-2";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthLayout from "../../components/AuthLayout";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import addressModel from "../../models/address.model";
import "./style.scss";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { capLetter } from "../../models/string.model";
import FacebookLogin from 'react-facebook-login';
import methodModel from "../../methods/methods";

const ProLogin = () => {
  const navigate = useNavigate();
  const [social, setSocial] = useState({
    google: "", fb: "",
  });
  const googleClientId = process.env.REACT_APP_CLINT_ID;
  const fbAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
  const propertyId=methodModel.getPrams('propertyId')||''
    const email=methodModel.getPrams('email')
  const scrollRef = useRef(null);
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    streetAddress: '',
    postalCode: '',
    city: '',
    country: '',
    firstName: '',
    lastName: '',
    email: email,
    mobileNo: '',
    role: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [location, setLocation] = useState();
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    const { firstName, lastName, email, companyRole, role, mobileNo, companyName, registrationNumber, streetAddress, postalCode, city, country } = formData;
    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is not valid.";
    }
    if (!/^\+?\d{10,15}$/.test(mobileNo) && mobileNo) {
      newErrors.mobileNo = "Mobile No is invalid.";
    }
    if (!companyRole) newErrors.companyRole = "Company role is required.";
    if (!role) newErrors.role = "Select professional type";
    if (role === "Agency" || role === "Agent") {
      if (!companyName) newErrors.companyName = "Company name is required.";
      if (role === "Agency" && !registrationNumber) {
        newErrors.registrationNumber = "Registration number is required.";
      }
    }
    if (!streetAddress) newErrors.streetAddress = "Street address is required.";
    if (!postalCode) newErrors.postalCode = "Postal code is required.";
    if (!city) newErrors.city = "City is required.";
    if (!country) newErrors.country = "Country is required.";
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
      accountType: "pro",
      role: formData?.role?.toLowerCase(),
      companyRole: formData.companyRole,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      mobileNo: formData.mobileNo,
      companyName: formData.companyName,
      registrationNumber: formData.registrationNumber,
      street: formData.streetAddress,
      pinCode: formData.postalCode,
      city: formData.city,
      country: formData.country,
      location: formData.location,
    };
    loader(true);
    ApiClient.post(url, data).then((res) => {
      if (res.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Please verify your email.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate(`/otpverify?email=${formData.email}&propertyId=${propertyId}`);
        });
      } else {
        //  errors
      }
    })
      .catch((err) => { })
      .finally(() => {
        loader(false);
      })
  };
  const [inputKey, setInputKey] = useState(0);
  const clearLocation = () => {
    setInputKey((prevKey) => prevKey + 1);
    setLocation();
    setFormData({
      ...formData,
      streetAddress: "",
      postalCode: "",
      city: "",
      country: "",
    })
  }
  const addressResult = async (e) => {
    let address = {};
    if (e.place) {
      address = await addressModel.getAddress(e.place);
    }
    setLocation(address?.address)
    setFormData({
      ...formData,
      streetAddress: address?.locality,
      postalCode: address?.zipcode,
      city: address?.city,
      country: address?.country,
      location: {
        lng: address?.lng,
        lat: address?.lat,
      }
    })
    setErrors({
      ...errors,
      streetAddress: address?.locality ? "" : errors.streetAddress,
      postalCode: address?.zipcode ? "" : errors.postalCode,
      city: address?.city ? "" : errors.city,
      country: address?.country ? "" : errors.country,
    })
  };

  // social logins
  const onGoogleSuccess = (res) => {
    const decodedToken = jwtDecode(res.credential);
    if (decodedToken) {
      setSocial({ ...social, google: decodedToken });
      setFormData({
        ...formData,
        email: decodedToken.email,
        firstName: decodedToken.name,
      })
      setErrors({ ...errors, email: "", firstName: "", });
    }
  };
  const onFacebookSuccess = (res) => {
    if (res.status !== 'unknown') {
      setSocial({ ...social, fb: res });
      setFormData({
        ...formData,
        email: res.email,
        firstName: res.name,
      })
      setErrors({ ...errors, email: "", firstName: "", });
    } else {
      console.error('Facebook login failed:', res);
    }
  };

  const roleType=(url='')=>{
    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (propertyId) params.append("propertyId", propertyId);
    navigate(`${url}${params.toString()?'?':''}${params.toString()}`);
  }

  return (
    <>
      <AuthLayout>
        <div className="xl:w-8/12 lg:w-11/12 w-full p-[24px] login">
          <div className="">
            <h1 className="text-[24px] font-semibold text-[#47525E] text-center tracking-[.67px]">
              Create an account pro
            </h1>
            <p className="text-center text-[14px]">Already have an account ? <Link to={`/login${propertyId?`?propertyId=${propertyId}`:''}`} className="text-[#976DD0] font-bold">Sign In</Link> </p>
            <div className="flex items-center justify-center gap-6 mb-10 mt-7">
              <button onClick={() => { roleType(`/signup`) }} className={`h-9 text-[#47525E] border-[2px] border-[#976DD0] px-6 py-1 rounded-md w-[130px] hover:opacity-[90%] bg-tranparent text-[#47525E] text-[16px]`}>Individual</button>
              <button onClick={() => { roleType(`/signup/pro`) }} className={`h-9 bg-[#976DD0] text-white border-[2px] border-[#976DD0] px-6 py-1 rounded-md  w-[130px] hover:opacity-[90%] text-[16px]`}>Pro</button>
            </div>

            <div className="mt-8 mb-10">
              <h2 className="text-[18px] font-[600] text-center ">Your personal information</h2>
              <p className="mb-8 text-center">We will keep them safe</p>
              <div>
                {['first Name', 'last Name', 'email', 'company Role'].map((field, index) => {
                  let row = (field == "first Name") ? "firstName" :
                    (field == "last Name") ? "lastName" :
                      (field == "company Role") ? "companyRole" : field;
                  return (
                    <div key={index} className="mb-3">
                      <input
                        type={row === 'email' ? 'email' : 'text'}
                        name={row}
                        value={formData[row]}
                        onChange={handleChange}
                        disabled={social.google[field]}
                        className={`block w-full h-11 text-[#5A5A5A]  px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md ${errors[field] ? 'border-[#976DD0]' : 'border-[#976DD0]'} `}
                        placeholder={`${capLetter(field)}*`}
                        required
                      />
                      {errors[field == "first Name" ? "firstName" :
                        field == "last Name" ? "lastName" :
                          field == "company Role" ? "companyRole" : field] &&
                        <span className="text-red-500 text-xs">{errors[
                          field == "first Name" ? "firstName" :
                            field == "last Name" ? "lastName" :
                              field == "company Role" ? "companyRole" : field
                        ]}</span>}
                    </div>
                  )
                })}

                <PhoneInput
                  country={"fr"}
                  value={formData?.mobileNo}
                  enableSearch={true}
                  onChange={(e) => {
                    setFormData({ ...formData, mobileNo: e })
                    setErrors((prevErrors) => ({ ...prevErrors, mobileNo: "" }));
                  }}
                  inputProps={{ required: true }}
                  countryCodeEditable={true}
                />
                {errors["mobileNo"] && <span className="text-red-500 text-xs">{errors["mobileNo"]}</span>}
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-[18px] font-[600]">Company details</h2>
              <p className="text-[14px]">Will make you searchable in <br /> directory</p>
            </div>

            <div className="grid grid-cols-3 gap-5 text-center mb-5">
              {['Agency', 'Agent', 'Hunter'].map((role, index) => (
                <div key={role} onClick={() => {
                  setFormData({ ...formData, role: role })
                  setErrors({ ...errors, role: "" })
                }} className={`p-5 border-[2px] ${formData?.role === role ? 'border-[#976DD0]' : 'border-[#fff0]'} hover:border-[#976DD0] rounded-md cursor-pointer flex justify-center items-center`}>
                  <div>
                    <img src={`/assets/img/img_${index + 1}.png`} className="w-[35px] mx-auto" alt={role} />
                    <p className="text-[16px]">{role}</p>
                  </div>
                </div>
              ))}
            </div>
            {errors.role && <span className="text-red-500 text-xs">{errors.role}</span>}

            <div>
              {(formData?.role === "Agency" || formData?.role === "Agent") && (
                <div className="mb-3">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`block w-full h-11 text-[#5A5A5A]  px-3 py-2.5 leading-7 text-[14px] border-[2px] rounded-md ${errors.companyName ? 'border-[#976DD0]' : 'border-[#976DD0]'} `}
                    placeholder="Company name*"
                    required
                  />
                  {errors.companyName && <span className="text-red-500 text-xs">{errors.companyName}</span>}
                </div>
              )}

              {formData?.role === "Agency" && (
                <div className="mb-3">
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className={`block w-full  h-11 px-3 py-2.5 text-[#5A5A5A]  leading-7  border-[2px] rounded-md ${errors.registrationNumber ? 'border-[#976DD0]' : 'border-[#976DD0]'}`}
                    placeholder="Registration number*"
                    required
                  />
                  {errors.registrationNumber && <span className="text-red-500 text-xs">{errors.registrationNumber}</span>}
                </div>
              )}

              <div className="mb-3 relative signup-loc">
                <GooglePlaceAutoComplete
                  key={inputKey}
                  value={location}
                  result={addressResult}
                  placeholder="Address"
                  id="address"
                />
                {location?.trim() && (
                  <button onClick={() => clearLocation()} className="absolute right-[3px] top-3.5">
                    <RxCross2 className="cursor-pointer" />
                  </button>
                )}
              </div>
              {['street Address', 'postal Code', 'city', 'country'].map((field, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`block w-full h-11 px-3 py-2.5 text-[#5A5A5A] leading-7 text-[14px] border-[2px] rounded-md ${errors[field] ? 'border-[#976DD0]' : 'border-[#976DD0]'} `}
                    placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}*`}
                    required
                  />
                  {errors[field] && <span className="text-red-500 text-xs">{errors[field]}</span>}
                </div>
              ))}

              <p className="text-[#5A5A5A] text-[14px] mb-3">*Required field</p>
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
              <div className="mt-10 flex items-center justify-center pb-10">
                <button onClick={handleSubmit} className="h-11 !bg-[#48464a] px-7 rounded-full font-medium text-center text-white hover:opacity-80 transition-all">
                  Next: update company profile
                </button>
              </div>
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
              <div className="pb-10">
                <FacebookLogin
                  appId={fbAppId}
                  autoLoad={false} // Set to `true` if you want the login to be triggered on page load
                  fields="name,email,picture" // Specify the fields you want to retrieve from Facebook
                  callback={onFacebookSuccess}
                  icon="fa-facebook" // You can add an icon from FontAwesome
                  size="small"
                />
              </div> */}
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default ProLogin;
