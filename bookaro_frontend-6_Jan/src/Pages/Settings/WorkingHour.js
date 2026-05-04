import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import CompanySidebar from './CompanySidebar';
import { login_success } from '../../actions/user';

const WorkingHourDetails = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const [workingHours, setWorkingHours] = useState([
        { day: 'Monday', startTime: '', endTime: '', isDayOff: false, is24Hour: false, isCustom: false },
        { day: 'Tuesday', startTime: '', endTime: '', isDayOff: false, is24Hour: false, isCustom: false },
        { day: 'Wednesday', startTime: '', endTime: '', isDayOff: false, is24Hour: false, isCustom: false },
        { day: 'Thursday', startTime: '', endTime: '', isDayOff: false, is24Hour: false, isCustom: false },
        { day: 'Friday', startTime: '', endTime: '', isDayOff: false, is24Hour: false, isCustom: false },
        { day: 'Saturday', startTime: '', endTime: '', isDayOff: false, is24Hour: false, isCustom: false },
        { day: 'Sunday', startTime: '', endTime: '', isDayOff: false, is24Hour: false, isCustom: false },
    ]);

    const handleWorkingHourChange = (index, field, value) => {
        const updatedHours = [...workingHours];
        updatedHours[index][field] = value;
        setWorkingHours(updatedHours);
    };

    const handleToggleDayOff = (i) => {
        const updatedHours = [...workingHours];
        updatedHours[i].isDayOff = !updatedHours[i].isDayOff;
        if (updatedHours[i].isDayOff) {
            updatedHours[i].startTime = '';
            updatedHours[i].endTime = '';
            updatedHours[i].is24Hour = false;
            updatedHours[i].isCustom = false;
        }
        setWorkingHours(updatedHours);
    };

    const handleToggle24Hour = (i) => {
        const updatedHours = [...workingHours];
        updatedHours[i].is24Hour = !updatedHours[i].is24Hour;
        if (updatedHours[i].is24Hour) {
            updatedHours[i].startTime = '';
            updatedHours[i].endTime = '';
            updatedHours[i].isDayOff = false;
            updatedHours[i].isCustom = false;
        }
        // else if (!updatedHours[i].isDayOff) {
        //     updatedHours[i].startTime = updatedHours[i].startTime || '00:00';
        //     updatedHours[i].endTime = updatedHours[i].endTime || '23:59';
        // }
        setWorkingHours(updatedHours);
    };
    const handleToggleCustom = (i) => {
        const updatedHours = [...workingHours];
        updatedHours[i].isCustom = !updatedHours[i].isCustom;
        if (updatedHours[i].isCustom) {
            updatedHours[i].startTime = '';
            updatedHours[i].endTime = '';
            updatedHours[i].isDayOff = false;
            updatedHours[i].is24Hour = false;
        }
        setWorkingHours(updatedHours);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        loader(true);
        for (const hour of workingHours) {
            if (!hour.isDayOff && !hour.is24Hour) {
                if (!hour.startTime || !hour.endTime) {
                    toast.error(`Please fill in start and end times for ${hour.day}`);
                    return loader(false);
                }
            }
        }
        const payload = {
            userId: user?._id,
            openingHours: workingHours,
        };
        ApiClient.put("user/editUserDetails", payload).then((res) => {
            if (res.success) {
                toast.success("Working Hour Updated");
                dispatch(login_success({ ...payload }));
            }
            loader(false);
        });
    };

    const getDetails = () => {
        ApiClient.get(`user/detail`, { id: user?._id }).then((res) => {
            if (res.success) {
                if (res?.data?.openingHours?.length > 0) {
                    setWorkingHours(res?.data?.openingHours);
                }
            }
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
                            <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8 ">
                                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                                    Opening hours
                                </h2>
                                <p className="text-[#6B7280] text-[14px] mb-4">
                                    Configure availability and working time rules shown to your clients.
                                </p>
                                <div className="p-10 md:px-14 px-8  border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0">
                                    <form onSubmit={handleSubmit} className="flex    flex-col ">
                                        <div className="">
                                            <h4 className="text-black  font-bold text-[19px] mb-4">Working Hours</h4>
                                            {workingHours.map((hour, i) => (
                                                <>
                                                    <span className="w-1/4 text-left underline text-[#48464a] font-[600] mb-2 inline-block">{hour.day}</span>
                                                    <div key={i} className="flex  mb-4 flex-col">
                                                        <div className='flex md:items-center mb-3 md:flex-row flex-col items-start'>
                                                            <div className='me-3'>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={hour.isDayOff}
                                                                    onChange={() => handleToggleDayOff(i)}
                                                                    className="mr-2"
                                                                />
                                                                <span className="mr-2">Day Off</span>
                                                            </div>
                                                            <div className='me-3'>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={hour.is24Hour}
                                                                    onChange={() => handleToggle24Hour(i)}
                                                                    className="mr-2"
                                                                />
                                                                <span className="mr-4">24 Hour</span>
                                                            </div>
                                                            <div className='me-3'>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={hour.isCustom}
                                                                    onChange={() => handleToggleCustom(i)}
                                                                    className="mr-2"
                                                                />
                                                                <span className="mr-4">Custom</span>
                                                            </div>
                                                        </div>

                                                        {hour.isCustom && (
                                                            <div className='flex'>
                                                                <input
                                                                    type="time"
                                                                    className={`block h-11 px-3 py-2.5 bg-white border-[2px] border-[#976DD0] rounded-md ${!hour.isCustom ? 'hidden' : ''}`}
                                                                    value={hour.startTime}
                                                                    onChange={(e) => handleWorkingHourChange(i, 'startTime', e.target.value)}
                                                                    disabled={!hour.isCustom}
                                                                />
                                                                <input
                                                                    type="time"
                                                                    className={`block ms-3  h-11 px-3 py-2.5 bg-white border-[2px] border-[#976DD0] rounded-md ${!hour.isCustom ? 'hidden' : ''}`}
                                                                    value={hour.endTime}
                                                                    onChange={(e) => handleWorkingHourChange(i, 'endTime', e.target.value)}
                                                                    disabled={!hour.isCustom}
                                                                />
                                                            </div>
                                                        )}

                                                    </div></>
                                            ))}
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
};

export default WorkingHourDetails;
