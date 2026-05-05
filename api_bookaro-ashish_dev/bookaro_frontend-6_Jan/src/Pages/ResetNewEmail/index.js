import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login_success } from '../../actions/user';
import AuthLayout from "../../components/AuthLayout";
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';

const ResetNewEmail = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const location = useLocation();

  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  const newEmail = getQueryParams().get('email');
  const currentEmail = getQueryParams().get('currentEmail');
  useEffect(() => {
    const queryParams = getQueryParams();
    const otpFromUrl = queryParams.get('otp'); // Get OTP from query param
    if (otpFromUrl && otpFromUrl.length === 6) { // Check if OTP length matches expected input
      setOtp(otpFromUrl.split('')); // Set OTP in state as an array
    }
  }, [location]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ApiClient.post("user/verifyOtpOnNewEmail", {
      newEmail,
      currentEmail,
      otp: otp.join('')
    }).then((res) => {
      if (res?.success) {
        toast.success("Email has been changed");
        dispatch(login_success({ "email": newEmail }));
        navigate("/profile/Account")
      } else { toast.error(res?.message); }
      loader(false);
    });
  };

  const handleResend = (e) => {
    e.preventDefault();
    // ApiClient.post("user/resend-otp", { "email": "email" }).then(async (res) => {
    //   if (res?.success) {
    //     toast.success(res?.message);
    //   }
    // });
  };



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

export default ResetNewEmail;
