import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login_success } from '../../actions/user';
import AuthLayout from "../../components/AuthLayout";
import { requestForToken } from '../../config/Firebase/FirebaseAuth';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import methodModel from '../../methods/methods';

const OtpVerification = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState(['', '', '', '']);
  const location = useLocation();
  const propertyType = location.state?.propertyType;
  const propertyId = methodModel.getPrams('propertyId')
  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  const email = getQueryParams().get('email');

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };
  const deviceInfo = {
    deviceToken: localStorage.getItem("deviceToken"),
    deviceID: `${navigator.product}_${navigator.productSub}`,
    deviceName: navigator.platform,
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    ApiClient.post("user/verifyOtp", {
      deviceToken: deviceInfo?.deviceToken,
      deviceId: deviceInfo?.deviceID,
      deviceName: deviceInfo?.deviceName,
      type: "login",
      "email": email,
      "otp": otp.join('')
    }).then(async (res) => {
      if (res?.success) {
        // console.log("res",res)
        toast.success(res?.message);
        localStorage.setItem("token", res?.data?.access_token);
        dispatch(login_success(res?.data));
        let url = "/properties"
        if (res?.data?.accountType == "pro") {
          url = "/profile/company-details"
        } else {
          switch (propertyType) {
            case "buy":
              url = "/properties?propertyType=sale"
              break;
            case "rent":
              url = "/properties?propertyType=rent"
              break;
            case "plan":
              url = "/properties?propertyType=directory"
              break;
            case "off-market":
              url = "/properties?propertyType=offmarket"
              break;
            case "sell my property":
              url = "/property1?propertyType=sale"
              break;
            case "rent my property":
              url = "/property1?propertyType=rent"
              break;
            case "quote my property":
              url = "/property1?propertyType=directory"
              break;
            case "prepare future sale":
              url = "/property1?propertyType=offmarket"
              break;
            default:
              url = "/properties"
          }
        }
        setTimeout(() => {
          if (propertyId) url = `/property-details?id=${propertyId}`
          navigate(url);
        }, 1000);
      } else { toast.error(res?.message); }
      loader(false);
    });
  };

  const handleResend = (e) => {
    e.preventDefault();
    ApiClient.post("user/resend-otp", { "email": email }).then(async (res) => {
      if (res?.success) {
        toast.success(res?.message);
      }
    });
  };
  useEffect(() => {
    const fcmToken = async () => {
      const deviceToken = await requestForToken();
      if (deviceToken) {
        localStorage.setItem("deviceToken", deviceToken);
      }
    };
    fcmToken();
  }, []);

  return (
    <AuthLayout>
      <div className="flex items-center justify-center  w-full">
        <form onSubmit={handleSubmit} className="xl:w-8/12 lg:w-11/12 w-full p-[30px] mx-auto border border-[#976DD0] rounded-[8px] bg-white bg-white p-8 rounded  border border-[#976DD0]">
          <h2 className="text-2xl font-bold text-center mb-5">Enter OTP</h2>
          <div className="flex space-x-2 justify-center ">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 h-16 text-center text-2xl  rounded-md border border-[#976DD0]  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#976DD0] "
                maxLength="1"
                style={{
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
            ))}
          </div>
          <div className="mt-5">
            <p className="text-center">Don't receive OTP code?</p>
            <span onClick={handleResend} className="text-[#976DD0] text-center underline block cursor-pointer">Resend Code</span>
          </div>
          <div className="flex items-center justify-center mt-5">
            <button
              type="submit"
              className="h-11 rounded-full w-52 text-center text-[#fff] bg-[#976DD0] font-medium text-[14px] hover:opacity-80 transition-all mx-auto mt-4"
            >
              Verify & Proceed
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default OtpVerification;
