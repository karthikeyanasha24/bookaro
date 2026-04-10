import { useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { login_success } from '../../actions/user';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import methodModel from '../../methods/methods';
import CompanySidebar from './CompanySidebar';

const CompanyLogo = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        companyLogo: user?.companyLogo || "",
        coverImage: user?.coverImage || "",
    });
    const logoRef = useRef(null);
    const handleLogo = () => {
        logoRef.current.click();
    };
    const coverRef = useRef(null);
    const handleCover = () => {
        coverRef.current.click();
    };

    const ImageUpload = (e, name) => {
        let files = e.target.files;
        let file = files.item(0);
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            return toast.error("Only JPG and PNG images are allowed.");
        }
        loader(true);
        ApiClient.postFormData('upload/image', { file: file }).then(res => {
            if (res.success) {
                setFormData({ ...formData, [name]: res?.fileName });
            }
        }).catch(error => {
            console.error("Upload failed:", error);
        }).finally(() => {
            loader(false);
            e.target.value = "";
        });
    };

    const handleRemoveImage = (name) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: "" // Set the image field to an empty string to remove it
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    companyLogo: res?.data?.companyLogo,
                    coverImage: res?.data?.coverImage,
                });
            }
            loader(false);
        });
    };

    useEffect(() => {
        getDetails();
    }, []);

    return (
        <PageLayout>
            <section className="py-14 lg:py-16 bg-[#f2ecf8]">
                <div className="container items-center px-8 mx-auto xl:px-5">
                    <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
                        <div className="grid grid-cols-12 lg:gap-12 gap-0">
                            <CompanySidebar />
                            <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8">
                                <h2 className="text-[#47525E] text-[26px] font-bold mb-6">
                                    Manage your company profile
                                </h2>
                                <div className="p-10 xl:px-14 lg:px-8 px-8 h-[92%] border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0">
                                    <div className='flex  flex-col h-full'>
                                        <div>
                                            <div className="flex items-center relative">
                                                {formData?.companyLogo ? (
                                                    <img
                                                        src={methodModel.userImg(formData?.companyLogo)}
                                                        className="w-[100px] h-[100px] object-cover rounded-full me-1"
                                                        alt="Company Logo"
                                                    />
                                                ) : (
                                                    <img
                                                        src={'/assets/img/id.png'}
                                                        className="w-[100px] h-[100px] object-cover rounded-full me-1"
                                                        alt="Company Logo"
                                                    />
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    ref={logoRef}
                                                    onChange={(e) => ImageUpload(e, "companyLogo")}
                                                />
                                                <span
                                                    className="underline text-[#47525E] text-[16px] ms-2"
                                                    onClick={handleLogo}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    Edit Logo
                                                </span>
                                                {formData?.companyLogo && (
                                                    <button
                                                        className="ml-4 text-red-500 absolute left-14 top-0 bg-white rounded-[50px] p-1"
                                                        onClick={() => handleRemoveImage("companyLogo")}
                                                    >
                                                        <RxCross2 />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center mt-6 relative">
                                                {formData?.coverImage ? (
                                                    <img
                                                        src={methodModel.userImg(formData?.coverImage)}
                                                        className="w-[100px] h-[100px] object-cover rounded-full me-1"
                                                        alt="Cover "
                                                    />
                                                ) : (
                                                    <img
                                                        src={'/assets/img/id.png'}
                                                        className="w-[100px] h-[100px] object-cover rounded-full me-1"
                                                        alt="Coverr"
                                                    />
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    ref={coverRef}
                                                    onChange={(e) => ImageUpload(e, "coverImage")}
                                                />
                                                <span
                                                    className="underline text-[#47525E] text-[16px] ms-2"
                                                    onClick={handleCover}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    Edit Cover Image
                                                </span>
                                                {formData?.coverImage && (
                                                    <button
                                                        className="ml-4 text-red-500 absolute left-14 top-0 bg-white rounded-[50px] p-1"
                                                        onClick={() => handleRemoveImage("coverImage")}
                                                    >
                                                        <RxCross2 />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <form onSubmit={handleSubmit} className="">
                                            <div className="mt-20 flex items-center justify-end">
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
                </div>
            </section>
        </PageLayout>
    );
};

export default CompanyLogo;
