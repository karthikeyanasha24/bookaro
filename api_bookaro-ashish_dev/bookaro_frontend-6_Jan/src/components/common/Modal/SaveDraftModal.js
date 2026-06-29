import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const SaveDraftModal = ({ draftModal, setdraftModal, propertyId = '', data ,step}) => {
    const user = useSelector((state) => state.user)
    const navigate = useNavigate();

    const deleteDraft = () => {
        loader(true)
        ApiClient.delete(`draft/delete?userId=${user?.id || user?._id}&propertyType=${data?.propertyType}`).then((res) => {
            if (res.success) {
                // toast.success(res?.message)
                draftsave()
                setdraftModal(false)
            }
            loader(false);
        });
    }

    const draftsave = () => {
    const payload = {
      ...data,
      step: step
    }
    loader(true)
    ApiClient.post(`draft/add`, payload, {}, "", true).then((res) => {
      if (res.success) {
        toast.success(res?.message)
        navigate("/")
      } else {
        setdraftModal(true)
      }
      loader(false);
    });
  }

    return (
        <>
            <Dialog
                open={draftModal}
                onClose={() => setdraftModal(false)}
                className="relative z-[9999]"
            >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                        <DialogTitle className="p-6">
                            <img src="assets/img/question.png" alt="" className="w-[100px] mx-auto" />
                            <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-5">

                                A draft for a {data?.propertyType} property already exists. Please delete it before creating a new one.
                            </p>
                            <div className="pt-8  flex items-center justify-center">
                                <Button onClick={deleteDraft} className="btn btn-primary">
                                    Remove And Save Draft
                                </Button>
                            </div>
                        </DialogTitle>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default SaveDraftModal
