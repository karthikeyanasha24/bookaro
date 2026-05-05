import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from "../../components/AuthLayout";
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import { RxCross2 } from 'react-icons/rx';

const ResetEmail = () => {
  const user = useSelector((state) => state.user);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const location = useLocation();
  const [open, setOpen] = useState(false)

  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };

  const newEmail = getQueryParams().get('email');

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
    ApiClient.put("user/sendOtpOnNewEmail", {
      currentEmail: user?.email,
      newEmail,
      otp: otp.join('')
    }).then((res) => {
      if (res?.success) {
        setOpen(true)
      } else { toast.error(res?.message); }
    });
  };

  const handleResend = (e) => {
    e.preventDefault();
    let dto = {
      currentEmail: user?.email,
      newEmail,
    }
    ApiClient.put("user/editUserEmail", dto,).then((res) => {
      if (res.success) {
        toast.success(res.message)
      } else { toast.error(res?.message); }
      loader(false);
    });
  };


  return (
    <AuthLayout>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setOtp(['', '', '', '', '', ''])
        }}
        className="relative z-[9999]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
            <DialogTitle className="p-6">
              <div onClick={() => setOpen(false)} className='flex justify-end cursor-pointer'>
                <RxCross2 />
              </div>
              <img src="/assets/img/unlock.svg" className="w-[100px] mx-auto" />
              <p className="border-t text-[#389D93] text-[18px] font-bold text-center  pt-5 mt-5">
                OTP verified successfully
              </p>
              <p className=" text-[#389D93] text-[18px] text-center pb-5 mt-2">
                Please verify otp at your new email address as well.
              </p>
            </DialogTitle>
          </DialogPanel>
        </div>
      </Dialog>
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
                className="2xl:w-16 2xl:h-16  xl:w-12 xl:h-12 w-10 h-10 text-center 2xl:text-2xl text-lg rounded-md border border-[#976DD0]  focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#976DD0] "
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

export default ResetEmail;
