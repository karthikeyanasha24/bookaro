import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../../methods/api/apiClient';
import './style.scss';
import { ToastsStore } from 'react-toasts';
import loader from '../../../methods/loader';
import { useHistory } from 'react-router-dom';
import rescheduleTimeModel from '../../../models/rescheduleTime.model';
import methodModel from '../../../methods/methods';



const AppointmentReminder = (p) => {
    const history = useHistory()
    let user = useSelector(state => state.user)
    const [form, setForm] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        let value = {
            hours: form.hours
        }
        let method = 'post'

        loader(true)
        ApiClient.allApi('add/update/remindertime', value, method).then(res => {
            if (res.success) {
                // ToastsStore.success(res.message)
            }
            loader(false)
        })
    }

    const getData = () => {
        ApiClient.get('admin/reminder/time').then(res => {
            if (res.success) {
                setForm(res.data)
            }
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center flex-wrap mt-3">
                <h3 className="usershedding mb-0">
                    Appointment Reminder
                </h3>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-row roleForm">
                    <div className="col-md-12 mb-3">
                        <label className="lableclss">Hours <span className='text-danger'>*</span></label><br />
                        <p className='small'>Set the number of hours before the appointment time for users to receive reminders through SMS & emails</p>

                        <input
                            type="number"
                            className="relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 mt-2"
                            value={form && form.hours}
                            maxLength={2}
                            onChange={e => { setForm({ ...form, hours: methodModel.isNumber(e) }) }}
                            required
                        />

                    </div>
                    <div className="col-md-12 mb-3 text-right">
                        <button className='text-white bg-[#976DD0] bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>Update</button>
                    </div>
                </div>
            </form>
        </>
    );
};
export default AppointmentReminder;
