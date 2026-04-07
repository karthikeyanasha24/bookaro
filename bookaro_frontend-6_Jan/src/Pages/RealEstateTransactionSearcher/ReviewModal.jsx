import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";

export default function ReviewModal({onClose = () => {}, result = (_) => { }}) {
    const ratingArr = [
        { name: "Location Quality", value: "location" },
        { name: "Property luminosity", value: "luminosity" },
        { name: "Property Condition", value: "condition" },
        { name: "Common areas condition", value: "areaCondition" },
        { name: "Quality of property information shared", value: "propertyInformation" },
        { name: "Peacefull setting", value: "peacefullSetting" },
    ]

    const [rating, setRating] = useState({
        location: null,
        luminosity: null,
        condition: null,
        areaCondition: null,
        propertyInformation: null,
        peacefullSetting: null,
    });

    const handleRating = (rate, key) => {
        setRating({ ...rating, [key]: rate });
    };

    return <>
        <Dialog
            open={true}
            onClose={() => onClose()}
            className="relative z-[9999]"
        >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex w-screen items-center justify-center px-10">
                <DialogPanel className="max-w-md w-full bg-white rounded-[20px] ">
                    <DialogTitle className="">
                        <p className="border-b text-[#389D93] text-[18px] text-center py-5 px-3">
                            You can enter the review about the property
                        </p>
                        <div className="mt-6">
                            <div className="rating-section">
                                <h2 className="text-[16px] font-bold text-[#333] mb-4 ms-6">
                                    Rate the Criteria
                                </h2>
                                {ratingArr?.map((itm, i) => (
                                    <div className="flex justify-between my-4 ms-6 md:items-center items-start md:flex-row flex-col ">
                                        <div className="flex items-center md:w-[65%] md:mb-0 mb-2 w-[100%]">
                                            <FaArrowRight className="mr-2 text-[#976DD0] text-[14px]" />
                                            <label className="block text-[14px] text-[#47525E] font-[600]">
                                                {itm.name}
                                            </label>
                                        </div>
                                        <div className="relative  md:w-[32%] w-[100%] flex justify-end me-6">
                                            <div style={{ lineHeight: "23px" }}>
                                                <ReactStars
                                                    count={5}
                                                    onChange={(e) => handleRating(e, itm.value)}
                                                    size={23}
                                                    value={rating?.[itm.value] || 0}
                                                    isHalf={true}
                                                    emptyIcon={<i className="far fa-star"></i>}
                                                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                    fullIcon={<i className="fa fa-star"></i>}
                                                    activeColor="#976DD0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 border-t pt-4"></div>
                            <div className="flex justify-start mb-4 mx-6 flex-col ">
                                <label className="mb-1 block text-[15px] text-[#47525E] font-[600]">
                                    Note
                                </label>
                                <div className="relative  w-[100%] mb-3">
                                    <textarea
                                        type="text"
                                        value={rating.note}
                                        onChange={(e) => {
                                            setRating({ ...rating, note: e.target.value })
                                        }}
                                        className="bg-white rounded-[7px] border border-[#976DD0] p-2 w-full pr-14"
                                        placeholder="Type here..."
                                    />
                                </div>
                            </div>

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
                                    const isInvalid = Object.values(rating).some(value => value === null);
                                    if (isInvalid) return toast.error("Enter ratings for all")
                                    onClose()
                                    result({ event: 'submit', value: rating })
                                    // handleChange(card, "review submit by user", "icon3")
                                }}
                                className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                            >
                                Save
                            </button>
                        </div>

                    </DialogTitle>
                </DialogPanel>
            </div>
        </Dialog>
    </>
}