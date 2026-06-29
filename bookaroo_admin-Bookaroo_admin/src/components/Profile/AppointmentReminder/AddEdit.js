import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastsStore } from "react-toasts";
import ApiClient from '../../../methods/api/apiClient';
import loader from '../../../methods/loader';
import rescheduleTimeModel from '../../../models/rescheduleTime.model';


const AddEdit = ({ form, setForm, modalClosed }) => {
    const user = useSelector(state => state.user)

    const handleSubmit = (e) => {
        e.preventDefault()

        let value = {
            id: form.id,
            clinicId: user.id,
            hours: form.hours
        }
        let method = 'post'
        if (value.id) {
            method = 'put'
        } else {
            delete value.id
        }

        loader(true)
        ApiClient.allApi('reminder/time', value, method).then(res => {
            if (res.success) {
                // ToastsStore.success(res.message)
                document.getElementById('closeEditModal').click()
                modalClosed()
            }
            loader(false)
        })
    }


    useEffect(() => {
        if (user && user.loggedIn) {
        }
    }, [])

    return <>
        <a id="openEditModal" data-toggle="modal" data-target="#editModal"></a>
        <div className="modal fade" id="editModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{form && form.id ? 'Edit' : 'Add'} Reminder</h5>
                        <button type="button" id="closeEditModal" className="close" data-dismiss="modal" aria-label="Close" title='Close'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row roleForm">
                                <div className="col-md-12 mb-3">
                                    <label className="lableclss">Hours</label>
                                    <select className='relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2' value={form && form.hours ? form.hours : ''} onChange={e => setForm({ ...form, hours: e.target.value })} required>
                                        <option value="" >Select option</option>
                                        {rescheduleTimeModel.list.map(itm => {
                                            return <option value={itm.hr}>{itm.value}</option>
                                        })}

                                    </select>

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="text-white bg-primary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-block">{form && form.id ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEdit