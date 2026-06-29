import React, { } from "react";

const ViewModal = ({ form }) => {



    return <>
        <a id="openViewModal" data-toggle="modal" data-target="#viewModal"></a>
        <div className="modal fade" id="viewModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">View Reminder</h5>
                        <button type="button" id="closeViewModal" className="close" data-dismiss="modal" aria-label="Close" title="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="form-row roleForm">
                            {/* <div className="col-md-6 mb-3">
                                <label>Id</label>
                                <p className="mb-0 text">{form && form.id}</p>
                            </div> */}
                            <div className="col-md-6">
                                <label className="lableclss">Hours </label>
                                <p className="mb-0 text">{form && form.hours && form.hours}</p>
                            </div>

                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>

                </div>
            </div>
        </div>
    </>
}

export default ViewModal