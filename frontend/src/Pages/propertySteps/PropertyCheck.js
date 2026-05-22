import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const PropertyCheck = ({ planModal, setplanModal }) => {
  const navigate = useNavigate();

  return (
    <>
      <Dialog
        open={planModal}
        onClose={() => setplanModal(false)}
        className="relative z-[9999]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center">
          <DialogPanel className="max-w-md w-full bg-white relative rounded-[20px] mx-5">
            <DialogTitle className="p-6">
              <button
                onClick={() =>{ 
                  setplanModal(false)
                  navigate("/")}}
                className="top-[-10px] right-[-10px] absolute text-[18px] text-[#fff] bg-[#898989] rounded-full h-[30px] w-[30px] flex justify-center items-center "
              >
                <RxCross2 className="text-[18px] "/>
              </button>
              <img
                src="assets/img/question.png"
                alt=""
                className="w-[100px] mx-auto"
              />
              <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-5">
                Note: You’ve reached the maximum property limit. You can’t add a new property
                right now, but you can save it as a draft.
              </p>

              <div className="pt-8 flex items-center justify-center gap-3">
                <Button
                  onClick={() => setplanModal(false)}
                  className="btn btn-primary"
                >
                  Save As Draft
                </Button>
                <Button
                  onClick={() => navigate("/plan")}
                  className="btn btn-primary"
                >
                  Upgrade plan
                </Button>
              </div>
            </DialogTitle>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default PropertyCheck;