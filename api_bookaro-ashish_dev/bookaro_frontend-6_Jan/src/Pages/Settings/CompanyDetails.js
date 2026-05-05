import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import methodModel from '../../methods/methods';
import CompanySidebar from './CompanySidebar';
import { login_success } from '../../actions/user';

const CompanyDetails = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        companyName: "",
        registrationNumber: "",
        address: "",
        postalCode: "",
        city: "",
        country: "",
        companyLogo: "",
    });
    const fileInputRef = useRef(null);
    const handleEditPictureClick = () => {
        fileInputRef.current.click();
    };
    const ImageUpload = (e) => {
        let files = e.target.files
        let file = files.item(0)
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            return toast.error("Only JPG and PNG images are allowed.");
        }
        loader(true)
        ApiClient.postFormData('upload/image', { file: file }).then(res => {
            if (res.success) {
                setFormData({ ...formData, companyLogo: res?.fileName })
            }
            loader(false)
        })
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
        if (user?.role !== "hunter" && !formData.companyName) {
            errors.companyName = "Company Name is required";
        }
        if (user?.role !== "hunter" && user?.role !== "agent" && !formData.registrationNumber) {
            errors.registrationNumber = "Registration Number is required";
        }
        if (!formData.address) {
            errors.address = "Address is required";
        }
        if (!formData.postalCode) {
            errors.postalCode = "Postal Code is required";
        }
        if (!formData.city) {
            errors.city = "City is required";
        }
        if (!formData.country) {
            errors.country = "country is required";
        }
        if (Object.keys(errors).length > 0) {
            return toast.error("Enter all mandatory fields")
        }


        loader(true);
        const payload = {
            userId: user?.id || user?._id,
            ...formData,
        };
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
                    companyName: res?.data?.companyName,
                    registrationNumber: res?.data?.registrationNumber,
                    address: res?.data?.street,
                    postalCode: res?.data?.pinCode,
                    city: res?.data?.city,
                    country: res?.data?.country,
                    companyLogo: res?.data?.companyLogo,
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
                            <div className="xl:col-span-8 lg:col-span-7 col-span-12">
                                <h2 class=" text-[#47525E] text-[26px] font-bold mb-6">Company details
                                </h2>
                                <p className="text-[#6B7280] text-[14px] mb-4">
                                    Set legal and address details used for directory visibility and trust checks.
                                </p>
                                <div className="p-10 xl:px-14 lg:px-8 px-8 h-[92%] border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0 ">
                                    <div className="flex items-center">
                                        {formData?.companyLogo ?
                                            <img src={methodModel.userImg(formData?.companyLogo)} className="w-[100px] h-[100px] object-cover rounded-full me-1" alt="Profile" />
                                            :
                                            <img src={'/assets/img/id.png'} className="w-[100px] h-[100px] object-cover rounded-full me-1" alt="Profile" />
                                            }
                                        <input
                                            type="file"
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={ImageUpload}
                                        />
                                        <span
                                            className="underline text-[#47525E] text-[16px] ms-2"
                                            onClick={handleEditPictureClick}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Edit picture
                                        </span>
                                    </div>
                                    <form onSubmit={handleSubmit} className="flex justify-between flex-col h-full">
                                        <div>
                                            <div className="mb-8 mt-4   ">
                                                <h4 className="text-black font-bold text-[19px]  mb-0">
                                                    Company details
                                                </h4>
                                                <p className="text-black text-[18px]  mb-2  mx-auto">
                                                    Will make you searchable in directory
                                                </p>
                                            </div>
                                            <div className=" max-w-[100%] ">
                                                {user.accountType === "pro" &&
                                                    (<>
                                                        {user?.role === "hunter" ? null : (
                                                            <input
                                                                name="companyName"
                                                                type="text"
                                                                className=" block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 "
                                                                placeholder={`CompanyName*`}
                                                                value={formData?.companyName}
                                                                onChange={handleChange}
                                                            />
                                                        )}
                                                        {user?.role !== "hunter" && user?.role !== "agent" && (
                                                            <input
                                                                name="registrationNumber"
                                                                type="text"
                                                                className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 "
                                                                placeholder={`registrationNumber*`}
                                                                value={formData?.registrationNumber}
                                                                onChange={handleChange}
                                                            />
                                                        )}
                                                    </>)}
                                                {["address", "postalCode", "city", "country"].map(
                                                    (field) => (
                                                        <input
                                                            key={field}
                                                            name={field}
                                                            type="text"
                                                            className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 "
                                                            placeholder={`${field.replace(
                                                                /([A-Z])/g,
                                                                " $1"
                                                            )}*`}
                                                            value={formData[field]}
                                                            onChange={handleChange}
                                                        />
                                                    )
                                                )}
                                                <p className="text-[#5A5A5A] mt-2 ms-2">
                                                    *Required field
                                                </p>
                                            </div>
                                            <div className="mt-8 mx-auto flex items-center justify-end">
                                                <button
                                                    type="submit"
                                                    className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                                                >
                                                    Save
                                                </button>
                                            </div>
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

export default CompanyDetails
