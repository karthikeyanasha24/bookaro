import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import { FaCalendar } from 'react-icons/fa6';
import { GoCheckCircleFill } from 'react-icons/go';
import { dateFormate } from '../../models/string.model';

const AnsSlotModal = ({
    openAnsSlotModal,
    closeAnsSlotFunc,
    card,
    activeTab,
    setActiveTab,
    bookSlot,
    setBookSlot,
    actionAnsSlotFunc,
    actionAnsAcceptSlotFunc,
    acceptDate,
}) => {
    return (
        <Dialog
            open={openAnsSlotModal}
            onClose={closeAnsSlotFunc}
            className="relative z-[9999]"
        >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <DialogPanel className="max-w-md w-full bg-white rounded-[20px] shadow-lg">
                    <DialogTitle className="p-3">
                        <div className="react-custom">
                            <div className="flex space-x-4 border-b border-gray-200">
                                <button
                                    onClick={() =>
                                        setActiveTab("accept")
                                    }
                                    className={`flex-1 py-3 text-center text-[14px] font-medium ${activeTab === "accept"
                                        ? "border-b-4 border-[#976DD0] text-[#976DD0] bg-[#e6f9f4] transition-all duration-200"
                                        : "text-[#47525E] hover:bg-[#f0f0f0] transition-all duration-200"
                                        } flex justify-center items-center space-x-2`}
                                >
                                    <GoCheckCircleFill className="text-[#976DD0] text-lg" />
                                    <span>Accept the offer</span>
                                </button>
                                <button
                                    onClick={() =>
                                        setActiveTab("tryAnother")
                                    }
                                    className={`flex-1 py-3 text-center text-[14px] font-medium ${activeTab === "tryAnother"
                                        ? "border-b-4 border-[#976DD0] text-[#976DD0] bg-[#e6f9f4] transition-all duration-200"
                                        : "text-[#47525E] hover:bg-[#f0f0f0] transition-all duration-200"
                                        } flex justify-center items-center space-x-2`}
                                >
                                    <FaCalendar className="text-[#976DD0] text-lg" />
                                    <span>Try Another Slot</span>
                                </button>
                            </div>

                            {activeTab === "accept" && (
                                <div className=" h-[315px]">
                                   
                                    <h3 className="text-center text-[#47525E]  px-6 h-full flex items-center justify-center flex-col">
                                    <GoCheckCircleFill className="text-[#976DD0] text-[60px] mb-4" />
                                        By accepting, you confirm your
                                        availability and agreement on{" "}
                                        <span className="block font-[600] mt-3 bg-[#efefef] px-[20px] py-[10px] rounded-[4px]">
                                            {dateFormate(acceptDate)}
                                        </span>
                                    </h3>
                                </div>
                            )}

                            {activeTab === "tryAnother" && (
                                <div className="py-5 ">
                                    <DatePicker
                                        selected={bookSlot}
                                        onChange={(date) => setBookSlot(date)}
                                        minDate={new Date()}
                                        inline
                                    />
                                </div>
                            )}

                            <div className="flex border-t p-2 justify-between">
                                <button
                                    onClick={closeAnsSlotFunc}
                                    className="text-[#868389] text-[18px] underline"
                                >
                                    Cancel
                                </button>
                                {activeTab === "accept" ? (
                                    <button
                                        onClick={() => actionAnsAcceptSlotFunc(card)}
                                        className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                    >
                                        Accept
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => actionAnsSlotFunc(card)}
                                        className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                    >
                                        Book
                                    </button>
                                )}
                            </div>
                        </div>
                    </DialogTitle>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default AnsSlotModal
