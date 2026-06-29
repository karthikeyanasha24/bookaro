import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import DatePicker from 'react-datepicker';

const SlotModal = ({
    openSlotModal,
    closeSlotFunc,
    card,
    bookSlot,
    setBookSlot,
    actionSlotFunc,
}) => {
    return (
        <Dialog
            open={openSlotModal?true:false}
            onClose={closeSlotFunc}
            className="relative z-[9999]"
        >
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <DialogPanel className="max-w-md w-full bg-white rounded-[20px] shadow-lg">
                    <DialogTitle className="p-3">
                        <div className="react-custom">
                            <p className="border-b text-[#389D93] text-[18px] text-center pb-5 mt-3">
                                You can select a date
                            </p>
                            <div className="py-5">
                                <DatePicker
                                    selected={bookSlot}
                                    onChange={(date) => setBookSlot(date)}
                                    minDate={new Date()}
                                    inline
                                />
                            </div>
                            <div className="flex border-t p-2 justify-between">
                                <button
                                    onClick={closeSlotFunc}
                                    className="text-[#868389] text-[18px] underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => actionSlotFunc(card)}
                                    className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                >
                                    Book
                                </button>

                            </div>
                        </div>
                    </DialogTitle>
                </DialogPanel>
            </div>
        </Dialog>
    )
}

export default SlotModal
