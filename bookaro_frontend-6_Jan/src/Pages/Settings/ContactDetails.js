import { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import CompanySidebar from './CompanySidebar';
import { login_success } from '../../actions/user';

const ContactDetails = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        mobileNo: "",
        website: "",
        companyEmail: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value?.toLowerCase(),
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData?.companyEmail?.trim() ||
            !formData?.mobileNo?.trim() ||
            !formData?.website?.trim()
        ) {
            return toast.error("Enter all mandatory fields")
        }
        loader(true);
        const payload = {
            userId: user?.id || user?._id,
            ...formData,
        };
        loader(true);
        ApiClient.put("user/editUserDetails", payload).then((res) => {
            if (res.success) {
                toast.success(res?.message);
                dispatch(login_success({ ...formData }));
            }
            loader(false);
        });
    };
    const getDetails = () => {
        loader(true);
        ApiClient.get(`user/detail`, { id: user?._id }).then((res) => {
            if (res.success) {
                setFormData({
                    mobileNo: res?.data?.mobileNo,
                    website: res?.data?.website,
                    companyEmail: res?.data?.companyEmail,
                });
            }
            loader(false);
        });
    }
    useEffect(() => {
        getDetails();
    }, []);

    return (
        <PageLayout>
            <section className="py-14   lg:py-16 bg-[#f2ecf8]">
                <div className="container items-center  px-8 mx-auto xl:px-5">
                    <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
                        <div className="grid grid-cols-12 lg:gap-12  gap-0">
                            <CompanySidebar />
                            <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8">
                                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                                    Manage your company profile
                                </h2>
                                <div className="p-10 xl:px-14 lg:px-8 px-8 h-[92%] border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0 ">
                                    <form onSubmit={handleSubmit} className="flex  flex-col h-full">
                                        <div>
                                            <div className="mb-8">
                                                <h4 className="text-black font-bold text-[19px] mb-0">
                                                    Company Contact details
                                                </h4>
                                                <p className="text-black text-[18px] mb-2">
                                                    Will make you searchable in directory
                                                </p>
                                            </div>
                                            <div className=" max-w-[100%] mx-auto">
                                                <input
                                                    name="companyEmail"
                                                    type="email"
                                                    className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border border-[#CACACA] rounded-md placeholder-gray-400"
                                                    placeholder={`Company Email*`}
                                                    value={formData?.companyEmail}
                                                    onChange={handleChange}
                                                />
                                                <div className='mb-3'>
                                                    <PhoneInput
                                                        country={"fr"}
                                                        value={formData?.mobileNo}
                                                        enableSearch={true}
                                                        onChange={(e) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData, mobileNo: e,
                                                            }));
                                                        }}
                                                        inputProps={{ required: true }}
                                                        countryCodeEditable={true}
                                                    />
                                                </div>
                                                <input
                                                    name="website"
                                                    type="text"
                                                    className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border border-[#CACACA] rounded-md placeholder-gray-400"
                                                    placeholder={`Website*`}
                                                    value={formData?.website}
                                                    onChange={handleChange}
                                                />
                                                <p className="text-[#5A5A5A] mt-2 ">
                                                    *Required field
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-20  flex items-center justify-end">
                                            <button
                                                type="submit"
                                                className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
}

export default ContactDetails
