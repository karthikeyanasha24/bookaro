import { IoChevronDownOutline } from "react-icons/io5";
import FormControl from "../../../components/common/FormControl";
import PageLayout from "../../../components/global/PageLayout"
import { useEffect, useState } from "react";
import loader from "../../../methods/loader";
import ApiClient from "../../../methods/api/apiClient";
import GooglePlaceAutoComplete from "../../../components/common/GooglePlaceAutoComplete";
import addressModel from "../../../models/address.model";
import { useNavigate } from "react-router-dom";
import SelectDropdown from "../../../components/common/SelectDropdown";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";

const HunterForm = () => {
    const history = useNavigate()
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("categoryId");
    const [form, setform] = useState(
        {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            emailAddress: "",
            whenToBuy: "",
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

    const BadgetRange = [
        { id: "10k-20k", name: "10k-20k" },
        { id: "20k-30k", name: "20k-30k" },
        { id: "30k-40k", name: "30k-40k" },
        { id: "40k-50k", name: "40k-50k" },
        { id: "50k-60k", name: "50k-60k" },
        { id: "60k-70k", name: "60k-70k" },
        { id: "70k-80k", name: "70k-80k" },
        { id: "80k-90k", name: "80k-90k" },
        { id: "90k-100k", name: "90k-100k" },
    ]

    const hendleSubmit = (e) => {
        e.preventDefault();
        if (!form?.cityLooking) {
            toast.error("Please select an address from the suggestions.")
            return
        }
        loader(true);
        let url = "form/blog-form";
        let payload = {
            ...form,
            categoryId: categoryId || "68ec8f7504dfdf28d5186761",
        }
        if (categoryId == "My Project(Home Seeker)") {
            url = "contactTeam/addNew"
            payload = {
                ...form,
                email:form?.emailAddress,
                name: form?.firstName + " " + form?.lastName,
                type: categoryId
            }
            delete payload.categoryId
        }

        ApiClient.post(url, payload).then(async (res) => {
            if (res.success) {
                if (categoryId == "My Project(Home Seeker)") {
                    history(`/project`)
                } else {
                    history(`/blog-detail?categoryId=${categoryId || "68ec8f7504dfdf28d5186761"}`)
                }
            }
            loader(false);
        });
    };

    const addressResult = async (e) => {
        let address = {};
        if (e.place) {
            address = await addressModel.getAddress(e.place);
        }
        // const newLocation = `${e.value?.split(",")[0]}`;
        setform({ ...form, cityLooking: address?.city });
    };


    return (
        <PageLayout>
            <section className="py-12 bg-[#ECE4F8] min-h-[60vh]">
                <div className="container mx-auto px-5">
                    <div className="text-center max-w-xl mx-auto ">
                        <h1 className="text-xl font-semibold">Looking for your dream home?</h1>
                        <h2 className="text-xl font-medium ">Let a hunter help you</h2>
                        <h2 className="text-xl text-[#5A5A5A] font-semibold mt-5">Fill the form and we will get back to you within 24 hours</h2>
                        <form onSubmit={hendleSubmit} action="" className="mt-8">
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
                                        value={form.emailAddress}
                                        onChange={(e) =>
                                            setform({ ...form, emailAddress: e })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col-span-full">
                                    {/* <FormControl type="text"
                                        placeholder='When would you like to buy? *'
                                        className='border border-[#976DD0]'
                                        value={form.whenToBuy}
                                        onChange={(e) =>
                                            setform({ ...form, whenToBuy: e })
                                        }
                                        required
                                    /> */}
                                    <DatePicker
                                        selected={form?.whenToBuy}
                                        onChange={(e) =>
                                            setform({ ...form, whenToBuy: e })
                                        }
                                        placeholderText="When would you like to buy? *"
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
                                        value={form?.cityLooking}
                                        result={addressResult}
                                        placeholder="In which city you are looking? *"
                                        id="address"
                                        required
                                    />
                                    <IoChevronDownOutline
                                        className="text-[#5A5A5A] absolute top-1/2 transform-all -translate-y-1/2 right-2" size={24} />
                                </div>
                                <div className="col-span-full blog-select relative">

                                    <SelectDropdown
                                        placeholder="What type of property are you looking for *"
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
                                    {/* <IoChevronDownOutline */}
                                    {/* className="text-[#5A5A5A] absolute top-1/2 transform-all -translate-y-1/2 right-2" size={24} /> */}
                                </div>
                                <div className="col-span-full mb-1 blog-select relative">
                                    <SelectDropdown
                                        placeholder="What is your budget range"
                                        displayValue="name"
                                        className="mt-2 capitalize"
                                        intialValue={form.budgetRange}
                                        theme="search"
                                        result={(e) => {
                                            setform({ ...form, budgetRange: e?.value })
                                        }}
                                        options={BadgetRange}
                                        isClearable={false}
                                    // required
                                    />
                                    <IoChevronDownOutline className="text-[#5A5A5A] absolute top-1/2 transform-all -translate-y-1/2 right-2" size={24} />
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
export default HunterForm;