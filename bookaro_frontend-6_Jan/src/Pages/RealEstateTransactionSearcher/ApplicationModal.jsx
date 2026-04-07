import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import RenterFile from "../RenterFile/RenterFile";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";

export default function ApplicationModal({onClose = () => {}, result = (_) => { }}) {
    const [form, setForm] = useState({
        identityProof: [],
        addressProof: [],
        salarySlips: [],
        otherDocs: [],
    });

    const onSubmit=()=>{

        let renterFiles=form
        Object.keys(renterFiles).map(key=>{
          renterFiles[key]=renterFiles[key]?.filter((itm)=>itm.checked)||[]
        })

        if(!renterFiles?.identityProof?.length||!renterFiles?.addressProof?.length||renterFiles?.salarySlips?.length<3){
            toast.error("Please select all required file")
            return
        }
        onClose()
        result({ event: 'submit',value:renterFiles })
    }

    return <>
        <Dialog
            open={true}
            onClose={() => {}}
            className="relative z-[9999]"
        >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed left-0 top-0 flex w-screen items-center justify-center p-3 h-full">
                <DialogPanel className="max-w-[1000px] w-full bg-white rounded-[20px] ">
                    <DialogTitle className=""></DialogTitle>
                    <div className="mt-6 px-3">
                           <RenterFile isModal result={e=>{
                            if(e.event=='values'){
                                setForm({...e.value})
                            }

                           }} />

                        </div>
                        <div className="flex border-t p-3 justify-between">
                            <button
                                onClick={() => onClose()}
                                className="text-[#868389] text-[18px] underline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onSubmit()

                                }}
                                className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                                Send Renter file
                            </button>
                        </div>
                </DialogPanel>
            </div>
        </Dialog>
    </>
}