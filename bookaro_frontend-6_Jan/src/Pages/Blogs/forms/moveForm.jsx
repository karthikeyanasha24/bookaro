import { IoChevronDownOutline } from "react-icons/io5";
import FormControl from "../../../components/common/FormControl";
import PageLayout from "../../../components/global/PageLayout"
import { useEffect, useState } from "react";
import loader from "../../../methods/loader";
import ApiClient from "../../../methods/api/apiClient";
import { useNavigate } from "react-router-dom";
import addressModel from "../../../models/address.model";
import GooglePlaceAutoComplete from "../../../components/common/GooglePlaceAutoComplete";
import SelectDropdown from "../../../components/common/SelectDropdown";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

const MoveForm = () => {
    const history = useNavigate()
    const params = new URLSearchParams(window.location.search);
    const type = params.get("categoryId");
    const [form, setform] = useState(
        {
            name: "",
            phoneNumber: "",
            email: "",
            whenToSell: "",
            propertyType: ""
        }
    )

    useEffect(() => {
        scrollToTop()
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const PropertyTypeOption = [
        { id: "apartment", name: "Apartment" },
        { id: "castle", name: "Castle" },
        { id: "farm", name: "Farm" },
        { id: "building", name: "Building" },
        { id: "house", name: "House" },
    ]

    const hendleSubmit = (e) => {
        // return
        e.preventDefault();
        if (!form?.propertyLocation) {
            toast.error("Please select an address from the suggestions.")
            return
        }
        let url = "contactTeam/addNew";
        loader(true);
        const payload = {
            ...form,
            name: form?.firstName + " " + form?.lastName,
            type: type
        }
        ApiClient.post(url, payload).then(async (res) => {
            if (res.success) {
                toast.success(res?.message)
                history(`/project`)
                loader(false);
            }
            });
    };

    const addressResult = async (e) => {
        let address = {};
        if (e.place) {
            address = await addressModel.getAddress(e.place);
        }
        // const newLocation = `${e.value?.split(",")[0]}`;
        setform({ ...form, propertyLocation: address?.city });
    };

    return (
        <PageLayout>
            <section className="py-12 bg-[#ECE4F8] min-h-[60vh]">
                <div className="container mx-auto px-5">
                    <div className="text-center max-w-xl mx-auto">
                        <h1 className="text-xl font-semibold">Is this your property?</h1>
                        <h2 className="text-xl font-medium ">Claim ownership</h2>
                        <h2 className="text-xl text-[#5A5A5A] font-semibold mt-5">Fill the form and we will get back to you within 24 hours with our prefered local partner</h2>
                        <form onSubmit={hendleSubmit} action="" className=" mx-auto mt-8">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div >
                                    <FormControl type="text"
                                        placeholder='First name *'
                                        className='border border-[#976DD0]'
                                        value={form.firstName}
                                        onChange={(e) => {
                                            setform({ ...form, firstName: e })
                                        }

                                        }
                                    />
                                </div>
                                <div >
                                    <FormControl type="text"
                                        placeholder='Last name *'
                                        className='border border-[#976DD0]'
                                        value={form.lastName}
                                        onChange={(e) =>
                                            setform({ ...form, lastName: e })
                                        }
                                        required
                                    />
                                </div>
                                <div >
                                    <FormControl type="phone"
                                        placeholder='Phone number *'
                                        className='border border-[#976DD0]'
                                        value={form.phoneNumber}
                                        onChange={(e) =>
                                            setform({ ...form, phoneNumber: e })
                                        }
                                        required
                                    />
                                </div>
                                <div >
                                    <FormControl type="email"
                                        placeholder='Email address *'
                                        className='border border-[#976DD0]'
                                        value={form.email}
                                        onChange={(e) =>
                                            setform({ ...form, email: e })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-span-full">
                                    {/* <FormControl type="text"
                                        placeholder='When would you like to sell? *'
                                        className='border border-[#976DD0]'
                                        value={form.whenToSell}
                                        onChange={(e) =>
                                            setform({ ...form, whenToSell: e })
                                        }
                                        required
                                    /> */}
                                    <DatePicker
                                        selected={form?.whenToSell}
                                        onChange={(e) =>
                                            setform({ ...form, whenToSell: e })
                                        }
                                        placeholderText="When would you like to move? *"
                                        dateFormat="dd/MM/yyyy"
                                        className="bg-white rounded-[7px] border border-[#976DD0] p-2 px-3 w-full mb-3"
                                        showYearDropdown
                                        scrollableYearDropdown
                                        minDate={new Date()}
                                        yearDropdownItemNumber={100} // number of years to show
                                        required
                                    />

                                </div>
                                <div className="col-span-full blog-select relative">
                                    <GooglePlaceAutoComplete
                                        // key={inputKey}
                                        value={form?.propertyLocation}
                                        result={addressResult}
                                        placeholder="What is your current city? *"
                                        id="address"
                                        required
                                    />
                                    <IoChevronDownOutline
                                        className="text-[#5A5A5A] absolute top-1/2 transform-all -translate-y-1/2 right-2" size={24} />
                                </div>
                                <div className="col-span-full mb-1 blog-select relative">
                                    <SelectDropdown
                                        placeholder="Where will be your new place? *"
                                        displayValue="name"
                                        className="mt-2 capitalize"
                                        intialValue={form.propertyType}
                                        theme="search"
                                        result={(e) => {
                                            setform({ ...form, propertyType: e?.value })
                                        }}
                                        options={PropertyTypeOption}
                                        isClearable={false}
                                        required
                                    />
                                    {/* <IoChevronDownOutline className="text-[#5A5A5A] absolute top-1/2 transform-all -translate-y-1/2 right-2" size={24} /> */}
                                </div>
                            </div>
                            <p className="text-[#5A5A5A] text-[15px] text-start">*Required field</p>
                            <button type="submit" className="text-[#fff] bg-[#000000]/70 hover:opacity-80 mt-10 rounded-full py-3 px-6">
                                Send request
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}
export default MoveForm;