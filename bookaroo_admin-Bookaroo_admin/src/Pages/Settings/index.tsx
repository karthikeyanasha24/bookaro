import { TimePicker } from 'antd';
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/global/layout";
import ChangePassword from "../../components/Profile/ChangePassword";
import EditProfile from "../../components/Profile/Edit";
import ApiClient from "../../methods/api/apiClient";
import methodModel from "../../methods/methods";

const Settings = () => {
  const [tabs, setTabs] = useState("profile");
  const [form, setForm]: any = useState({ startTime: null, endTime: null });
  const { tab }: any = useParams();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (tab == "reschedule-time") {
      let value = {
        rescheduleTime: form.rescheduleTime,
        id: form.id,
      };
      ApiClient.put("setting", value).then((res) => {
        if (res.success) {
          // ToastsStore.success(res.message)
        }
      });
    }
    else if (tab == "settings") {
      let payload = {
        availability_start: form?.startTime,
        availability_end: form?.endTime,
        id: form?._id
      }
      ApiClient.put(`admin/setting-update`, payload).then(res => {
        if (res.success) {
          toast.success("Available Time Set Successfully")
        }
      })
    } else {
      return
    }
  };

  useEffect(() => {
    if (tab) {
      if (tab == "settings") {
        // Hit api to update the admin available time
        ApiClient.get(`admin/setting-detail`).then((res: any) => {
          if (res.success) {
            setForm({
              ...res?.data,
              startTime: res?.data?.availability_start ? moment(res?.data?.availability_start) : null,
              endTime: res?.data?.availability_end ? moment(res?.data?.availability_end) : null
            })
          }
        })
      }
      setTabs(tab);
    } else {
      setTabs("profile");
    }
  }, [tab]);

  const handleTimePicker = (e: any, key: string) => {
    setForm((prev: any) => ({ ...prev, [key]: e }))
  }

  return (
    <>
      <Layout>
        {!tab ? (
          <>
            <h3 className="mb-3">Settings</h3>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={tabs == "profile" ? "nav-link active" : "nav-link"}
                  href="#"
                  onClick={() => setTabs("profile")}
                >
                  Edit Profile
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={
                    tabs == "change-pass" ? "nav-link active" : "nav-link"
                  }
                  href="#"
                  onClick={() => setTabs("change-pass")}
                >
                  Change Password
                </a>
              </li>
            </ul>{" "}
          </>
        ) : (
          <></>
        )}
        <div>
          {tabs === "edit" && <EditProfile />}
          {tabs === "change-password" && <ChangePassword />}
          {tabs === "reschedule-time" && (
            <div className="">
              <h3 className="mb-3">Reschedule Time</h3>
              <form className="form-row" onSubmit={handleSubmit}>
                <div className="col-md-12 mb-3">
                  <label>
                    Hours <span className="start">*</span>
                  </label>
                  <br />
                  <p className="small">
                    Set up a minimum number of hours that is required for an
                    appointment to be rescheduled
                  </p>
                  <input
                    type="number"
                    className="relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 mt-2"
                    value={form && form.rescheduleTime}
                    maxLength={2}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        rescheduleTime: methodModel.isNumber(e),
                      });
                    }}
                    required
                  />

                  <div className="mt-3 text-right">
                    <button
                      type="submit"
                      className="text-white bg-primary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-block"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {tabs === "settings" && (
            <>
              <h3 className="mb-5 text-2xl font-semibold text-[#111827]">Admin Available Time</h3>
              <div className="shadow-box w-full bg-white rounded-lg mt-6 p-6">
                <form className="" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-12  gap-4">
                    <div className="col-span-12 md:col-span-6">
                      <label>
                        Start Time <span className="start">*</span>
                      </label>
                      <div className="mt-1 w-full">
                        <TimePicker className="w-full h-10" onChange={(e: any) => handleTimePicker(e, 'startTime')} value={form?.startTime} onFocus={() => setForm((prev: any) => ({ ...prev, startTime: null }))} format="HH:mm"
                          // placeholder="Select Start Time" 
                          required />
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <label>
                        End Time <span className="start">*</span>
                      </label>
                      <div className="mt-1 w-full">
                        <TimePicker className="w-full h-10" onChange={(e: any) => handleTimePicker(e, 'endTime')} value={form?.endTime} onFocus={() => setForm((prev: any) => ({ ...prev, endTime: null }))} format="HH:mm"
                          // placeholder="Select End Time"
                          required />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-end">
                    <button type="submit" className="text-white bg-primary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 inline-block">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Settings;
