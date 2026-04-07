import { useRef, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SelectDropdown from "../../../components/common/SelectDropdown";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import shared, { removePropData, saveChanges } from "../shared";

const Step13 = ({ step1,
    setActiveTabIndex, formData, setFormData,
    editMode = true, page, backTo, dropdownOptions,
}) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const scrollRef = useRef(null);
    const [addrating, setAddRating] = useState(false);
    const [rat, setrat] = useState({
        type: "",
        rating_value: "",
        url: "",
    });
    const ratingName = dropdownOptions
        ?.find((dd) => dd?._id === rat?.type)
        ?.name?.toLowerCase();

    const validate = () => {
        if (!formData?.rating || formData?.rating?.length === 0) {
            toast.error("Add ratings");
            return false;
        }
        let haserror = false;
        formData?.rating?.map((itm, i) => {
            const ratingName = dropdownOptions
                ?.find((dd) => dd?._id === itm?.type)
                ?.name?.toLowerCase();
            if (!itm.type?.trim() || !itm.rating_value?.trim() || !itm.url?.trim()) {
                haserror = true;
            }
        });
        if (haserror) {
            toast.error("Enter all mandatory fields");
            return false;
        }
        return true
    }

    const handleSubmit = () => {
        if (!validate()) return;
        let method = "post";
        let url = shared.addApi;
        let value = {
            ...formData,
            linkedSchools: Object.entries(formData)
                .filter(
                    ([key, value]) =>
                        key.startsWith("school") &&
                        value?.schoolId?.value &&
                        value?.schoolId?.label &&
                        value?.type
                )
                .map(([_, value]) => ({
                    schoolId: value.schoolId.value,
                    type: value.type,
                    EstablishmentName: value.schoolId.label,
                })),
            add_more_step: false,
        };
        if (value?.energymode == "") {
            delete value.energymode;
        }
        if (value?.heatingType == "") {
            delete value.heatingType;
        }
        if (value?.investment?.length == 0 || value?.investment[0] == "") {
            delete value.investment
        }
        delete value.Expenses;
        delete value.school1;
        delete value.school2;
        delete value.school3;
        delete value.school4;
        delete value.rating;
        delete value.renovation_work;
        delete value.revenue_detail;
        if (id) {
            method = "put";
            url = shared.editApi;
        } else {
            delete value.id;
        }

        loader(true);
        ApiClient.allApi(url, value, method).then((res) => {
            if (res.success) {
                removePropData()
                navigate(`/${shared.url}`);
            }
            loader(false);
        });
    };

    const handleBack = () => {
        if (page) {
            navigate(`/property/${page}/${id}`, {
                state: backTo ? { backTo: "property-requests" } : undefined,
            });
        } else if (id) {
            navigate(`/property/add/${id}/11`);
        } else {
            navigate("/property/add/11");
        }
        setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const applyRating = (saveAndNew = true) => {
        if (!rat.type?.trim() || !rat.rating_value?.trim() || !rat.url?.trim()) {
            return toast.error("Enter all mandatory fields");
        }
        //  else if (!rat.url?.toLowerCase()?.includes(ratingName)) {
        //     return toast.error("Enter valid Url");
        // }
        if (formData?.rating) {
            setFormData({
                ...formData,
                rating: [...formData?.rating, rat],
            });
        } else {
            setFormData({
                ...formData,
                rating: [rat],
            });
        }
        setrat({
            type: "",
            rating_value: "",
            url: "",
        });
        if (saveAndNew) {
            setAddRating(false);
        } else {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
        toast.success("Record Added.")
    };
    const removeRating = (i) => {
        let data = formData?.rating?.filter((itm, ind) => ind !== i);
        setFormData({
            ...formData,
            rating: data,
        });
    };
    const closeModal = () => {
        setAddRating(false);
        setrat({
            type: "",
            rating_value: "",
            url: "",
        });
    }
    const save = () => {
        if (!validate()) return
        step1.rating = formData.rating;
        step1.add_more_step = true;
            if (step1?.energymode == "") {
      delete step1.energymode;
    }
    if (step1?.heatingType == "") {
      delete step1.heatingType;
    }
    if (step1?.emission_efficient == "") {
      delete step1.emission_efficient;
    }
    if (step1?.energy_efficient == "") {
      delete step1.energy_efficient;
    }
    if (step1?.usedAs == "") {
      delete step1.usedAs;
    }
    if (step1?.investment?.length == 0 || step1?.investment[0] == "") {
      delete step1.investment
    }
        localStorage.setItem("step1", JSON.stringify(step1))
        saveChanges(step1)
    }

    return (
        <div className=" flex justify-between flex-col h-full relative">


            {addrating ? (
                <div className=" lg:overflow-auto lg:h-[640px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
                    <div className="flex items-start justify-between">
                        <h4 ref={scrollRef} className="text-[#47525E] text-[24px] font-[600] text-left xl:mb-[50px] lg:mb-[50px] mb-[40px]">
                            Add Ratings to your property
                            <span className="text-[#47525E] mt-[5px] font-[400] block text-[14px] text-left ">
                                *Mandatory information
                            </span>
                        </h4>
                        <button
                            onClick={() => closeModal()}
                            className=" ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center ">
                            <RxCross2 />
                        </button>
                    </div>
                    <div className="md:max-w-[500px] w-[100%]">
                        <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                            Rating details
                        </label>
                        <div className="flex items-center flex-wrap  justify-center">
                            <div class="xl:max-w-[500px] w-[100%] mb-3">
                                <SelectDropdown
                                    displayValue="name"
                                    placeholder="select rating type"
                                    isClearable={false}
                                    intialValue={rat.type}
                                    result={(e) => {
                                        setrat({
                                            ...rat,
                                            type: e.value,
                                        });
                                    }}
                                    options={dropdownOptions?.filter(itm => (
                                        itm?.type === "Ratings"
                                    ))}
                                />
                            </div>
                            <div class="xl:max-w-[500px] w-[100%] mb-3">
                                <input
                                    type="text"
                                    value={rat.rating_value}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        value = value.replace(/[^0-9]/g, '');
                                        if (+value > 5) {
                                            return toast.error("Rating value cannot be more than 5!");
                                        }
                                        if (+value == 0) {
                                            return setrat({ ...rat, rating_value: "" }); // Clear state for 0
                                        }
                                        setrat({ ...rat, rating_value: value });
                                    }}
                                    className="bg-white rounded-[7px] border border-[#976DD0]
                                    p-2 px-3 h-[44px] md:w-[500px] w-full text-[#5A5A5A]"
                                    placeholder="Rating value"
                                />
                            </div>
                            <div class="xl:max-w-[500px] w-[100%] mb-3">
                                <input
                                    type="text"
                                    value={rat.url}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const trimVal = val.replace(/\s+/g, "");
                                        setrat({ ...rat, url: trimVal });
                                    }}
                                    className="bg-white rounded-[7px] border border-[#976DD0]
                                    p-2 px-3 h-[44px] md:w-[500px] w-full mb-4 text-[#5A5A5A]"
                                    placeholder={`${ratingName
                                        ? "www." + ratingName + ".com"
                                        : "Rating URL"}`}
                                />
                            </div>
                        </div>
                        <div className="mx-auto block mt-8 pb-8">
                            <div className="flex flex-col items-center justify-center">
                                <button
                                    onClick={applyRating}
                                    className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn "
                                >
                                    Save and close
                                </button>
                                <Link
                                    className="text-[#976DD0] text-[15px] font-[600] mt-3 mb-10"
                                    onClick={() => applyRating(false)}
                                >
                                    Save and create new rating
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <div className=" lg:overflow-auto lg:h-[580px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
                    <div className="flex justify-between items-start">
                        <h4 className="text-[#47525E] text-[24px] font-[600] xl:mb-[50px] lg:mb-[50px] mb-[40px] ">
                            Share your property social ratings
                            <span className="text-[#47525E] font-[400] block text-[14px] mt-1 block">
                                *Mandatory information
                            </span>
                            <p className="font-[400]  text-[16px] text-[#5A5A5A] mb-7 mt-5  xl:w-[500px] w-[100%]">
                                This information will increase value of your property for our
                                community.
                            </p>
                        </h4>
                        {addrating ? (
                            <button
                                onClick={() => closeModal()}
                                className=" ml-auto text-[20px] border-[#8492A6] border rounded-[50px] p-2 w-[40px] h-[40px] flex items-center justify-center ">
                                <RxCross2 />
                            </button>
                        ) : (
                            <button
                                onClick={() => { if (editMode) setAddRating(true) }}
                                className="rounded-[50px] border border-[#976DD0] p-2 text-[#787878] w-[200px] text-[14px]  "
                            >
                                Add New Ratings
                            </button>
                        )}
                    </div>
                    {formData?.rating && formData?.rating?.length > 0 ? (
                        <div className="md:max-w-[500px] w-[100%]">
                            <label className="text-[#47525E] font-[600] text-[20px] mb-4 block my-10">
                                Ratings
                            </label>
                            {formData?.rating?.map((itm, i) => {
                                const ratingName = dropdownOptions?.find(dd => dd?._id === itm?.type)?.name?.toLowerCase();

                                return (
                                    <>
                                        <div className="flex items-center mb-6 xl:max-w-[500px]  w-[100%]">
                                            <div className="w-[90%]">
                                                <div className=" flex items-center gap-3  mb-2">
                                                    <div class="w-1/2">
                                                        <SelectDropdown disabled={!editMode}
                                                            displayValue="name"
                                                            placeholder="Select rating type"
                                                            isClearable={false}
                                                            intialValue={itm.type}
                                                            result={(e) => {
                                                                if (editMode) {
                                                                    let data = [...formData.rating];
                                                                    data[i] = { ...data[i], type: e.value };
                                                                    setFormData({
                                                                        ...formData,
                                                                        rating: data,
                                                                    })
                                                                }
                                                            }}
                                                            options={dropdownOptions?.filter(itm => (
                                                                itm?.type === "Ratings"
                                                            ))}
                                                            position="position_right"
                                                        />
                                                    </div>
                                                    <div class="w-1/2">
                                                        <input disabled={!editMode}
                                                            type="text"
                                                            value={itm.rating_value}
                                                            onChange={(e) => {
                                                                let value = e.target.value;
                                                                value = value.replace(/[^0-9]/g, '');
                                                                if (+value > 5) {
                                                                    return toast.error("Rating value cannot be more than 5!");
                                                                }
                                                                if (+value == 0) {
                                                                    let data = [...formData.rating];
                                                                    data[i] = { ...data[i], rating_value: "" };
                                                                    return setFormData({
                                                                        ...formData,
                                                                        rating: data,
                                                                    });
                                                                }
                                                                let data = [...formData.rating];
                                                                data[i] = { ...data[i], rating_value: value };
                                                                setFormData({
                                                                    ...formData,
                                                                    rating: data,
                                                                });
                                                            }}
                                                            className={`bg-white rounded-[7px] border border-[#976DD0]  
                                                            p-2 px-3 md:w-[500px] w-full h-[46px]`}
                                                            placeholder="Rating Value"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="">
                                                    <input disabled={!editMode}
                                                        type="text"
                                                        value={itm.url}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const trimVal = val.replace(/\s+/g, "");
                                                            let data = [...formData.rating];
                                                            data[i] = { ...data[i], url: trimVal };
                                                            setFormData({
                                                                ...formData,
                                                                rating: data,
                                                            });
                                                        }}
                                                        className={`bg-white rounded-[7px] border border-[#976DD0]  h-[44px]
                                                        p-2 px-3 md:w-[500px] w-full `}
                                                        placeholder={`${ratingName
                                                            ? "www." + ratingName + ".com"
                                                            : "Rating URL"}`}
                                                    />
                                                </div>
                                            </div>
                                            {!page && (
                                                <Link onClick={() => {
                                                    if (editMode) removeRating(i)
                                                }} className="ms-5">
                                                    <AiOutlineDelete className="text-[20px] p-[6px] w-[30px] h-[30px] text-white rounded-[50px] bg-[#c2a8df]" />
                                                </Link>
                                            )}
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='flex items-center justify-center flex-col bg-[#c2a8df4a] max-w-[300px] mx-auto p-[35px] rounded-[5px]'>
                            <img src='/assets/img/no-data.png' className='w-[100px]' alt='' />
                            <p className='mt-1'>No Data Yet</p>
                        </div>
                    )}
                </div>
            )}
            {!addrating && (
                <>
                    {page === "detail" ? ("") : id ?
                        <div className="text-end  bg-[#f7f4fb] p-5 w-full ">
                            <button
                                onClick={save}
                                className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
                            >
                                Save change
                            </button>
                        </div> :
                        <div className=" flex justify-between mt-10 pb-10">
                            <button
                                onClick={handleBack}
                                className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 me-4"
                            >
                                Back
                            </button>
                            {!page && (
                                <button
                                    onClick={handleSubmit}
                                    className="btn text-white bg-[#48464a] rounded-full px-10 py-4  submit-btn "
                                >
                                    List my property
                                </button>
                            )}
                        </div>
                    }
                </>
            )}
        </div>
    );
};

export default Step13;
