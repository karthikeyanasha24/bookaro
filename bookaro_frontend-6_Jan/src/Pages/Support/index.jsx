import React, { useEffect, useState } from 'react'
import FormControl from '../../components/common/FormControl'
import { CiMail } from "react-icons/ci";
import { MdOutlineWatchLater } from "react-icons/md";
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import methodModel from '../../methods/methods';

const Index = () => {

    const [form, setform] = useState({
        name: "",
        email: "",
        message: ""
    })
    const inValidEmail = methodModel.emailvalidation(form.email);
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inValidEmail) {
            toast.error("Enter Valid Email")
            return;
        }
        let payload = { ...form }

        loader(true);
        const res = await ApiClient.post(`support/add`, payload);
        if (res.success) {
            toast.success("Message sent successfully. Admin will get back to you within 24 hours.");
            navigate("/support-page");
            setform({
                name: "",
                email: "",
                message: "",
            });
        }
        loader(false);
    }

    return (
        <div className=''>
            <div className='bg-[#F2F2F2] h-[calc(100vh-0px)] overflow-auto py-10'>
                <form onSubmit={handleSubmit} className='max-w-[830px] mx-auto bg-white px-5 py-[2rem]'>
                    <div className='max-w-[420px] mx-auto'>
                        <div className='mb-3'>
                            <img src='assets/img/logo.png' className='w-[140px] mx-auto mb-[1.5rem]'></img>
                            <h2 className='text-[22px] font-[600] text-center mb-1'>Need Help?</h2>
                            <p className='text-[#717171] text-[12px] text-center'>We're here to assist you! Send us your questions, feedback, or report any issues you're experiencing.</p>
                        </div>
                        <div>
                            <div className="mb-3">
                                <FormControl
                                    type="text"
                                    name="name"
                                    label="Name"
                                    className='bg-[#EEEDED] !rounded-[8px] !h-9'
                                    value={form?.name}
                                    required
                                    onChange={(e) => setform(prev => ({ ...prev, name: e }))}
                                />
                            </div>
                            <div className="mb-3">
                                <FormControl
                                    type="text"
                                    name="email"
                                    label="Email"
                                    className='bg-[#EEEDED] !rounded-[8px] !h-9'
                                    value={form?.email}
                                    required
                                    onChange={(e) => setform(prev => ({ ...prev, email: e }))}
                                />
                            </div>
                            <div className="mb-3">
                                <FormControl
                                    type="text"
                                    name="message"
                                    label="Message"
                                    className='bg-[#EEEDED] !rounded-[8px] !h-9  w-full h-20'
                                    value={form?.message}
                                    required
                                    onChange={(e) => setform(prev => ({ ...prev, message: e }))}
                                />
                            </div>

                        </div>
                        <button
                            type="submit"
                            className="bg-[#000] flex gap-2 items-center justify-center text-[14px] h-10 w-[120px] m-auto text-[#fff] rounded-md font-[600] hover:opacity-80"
                        >
                            SEND
                        </button>
                        <div className='mt-[2rem]'>
                            <p className='text-[#4C4C4C] text-center font-[500]'>Other Ways to Reach Us</p>
                            <div className='flex gap-x-5 gap-2 justify-center flex-wrap mt-2'>
                                <p className='flex items-center gap-1 text-[12px] text-[#2C2B2B]'><CiMail className='text-[#666666] text-[18px]' />support@gmail.com</p>
                                <p className='flex items-center gap-1 text-[12px] text-[#2C2B2B]'><MdOutlineWatchLater className='text-[#666666] text-[18px]' />Response within 24 hours</p>
                            </div>
                        </div>


                    </div>
                </form>


            </div>
        </div>
    )
}

export default Index