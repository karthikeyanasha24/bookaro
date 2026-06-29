import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const LoginModal = ({loginModal, setloginModal,propertyId=''}) => {
    const navigate = useNavigate();

    const login=()=>{
        let url='/login'
        if(propertyId) url=`/login?propertyId=${propertyId}`
        navigate(url)
    }

    return (
        <>
            <Dialog
                open={loginModal}
                onClose={() => setloginModal(false)}
                className="relative z-[9999]"
            >
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex w-screen items-center justify-center">
                    <DialogPanel className="max-w-md w-full bg-white rounded-[20px] mx-5">
                        <DialogTitle className="p-6">
                            <img src="assets/img/question.png" alt="" className="w-[100px] mx-auto"/>
                            <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-5">
                                You have to login first
                            </p>
                            <div className="pt-8  flex items-center justify-center">
                                <Button onClick={()=>login()} className="btn btn-primary">
                                    Click here to login
                                </Button>
                            </div>
                        </DialogTitle>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default LoginModal
