import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import "react-phone-input-2/lib/style.css";

const ShowNumberModal = ({ showNumber, setshowNumber, detail }) => {
  return (
    <div>
      <Dialog open={showNumber} onClose={() => setshowNumber(false)}>
        <DialogBackdrop className="fixed inset-0 bg-black/30 z-[10]" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-[11]">
          <DialogPanel className="max-w-lg  border bg-white p-4 w-full rounded-[8px]">
            <DialogTitle className="border-b text-[#389D93] text-[18px] text-center pb-4 relative">
              Contact Number
              <RxCross2 onClick={() => setshowNumber(false)} className="ml-auto absolute top-1 cursor-pointer right-2" />
            </DialogTitle>
            <div className="flex flex-col items-start p-6">
              <div className=" mb-2 rounded-full p-2 mx-auto">
                {/* Flag container */}
                <div className=" flex items-center justify-center flag-show ">
                  {/* The flag will automatically render here */}
                  {/* <PhoneInput
                    disabled={true}
                    country={"fr"}
                    value=""
                    inputStyle={{
                      display: "none", 
                    }}
                    buttonStyle={{
                      cursor: "default", 
                    }}
                    dropdownClass="hidden" 
                  /> */}
                  <img src="/assets/img/contact.svg" className="w-[90px] p-3"/>
                </div>
              </div>
              <p className="text-center block mx-auto text-[16px] font-[600] mt-4 bg-[#976dd014]  text-[#976dd0] p-[12px] rounded-[3px]">
                +{detail?.phoneNumber}
              </p>

            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default ShowNumberModal;
