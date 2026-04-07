import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { shared } from "./shared";
import { capLetter, generateDynamicString } from "../../models/string.model";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import SelectDropdown from "../../components/common/SelectDropdown";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SearchAlert = () => {

  const { user } = useSelector((state) => state);
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [openPopup, setOpenPopup] = useState(false)
  const [alert, setAlert] = useState({
      reason: "",
      email: user?.email,
      name: "",
  });
  const [error, setError] = useState({
    price: "",
    revenue: "",
    surface: "",
    proposal: "",
    alert: "",
    location: "",
  });

    const addAlert = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // if (!alert.reason) return setError({ ...error, alert: "Select reason" })
        if (!alert.email) return setError({ ...error, alert: "Enter email address" })
        if (!emailRegex.test(alert.email)) return setError({ ...error, alert: "Enter a valid email address" })

        let dto = {
          ...alert,
          user_id: user?._id,
        }
        ApiClient.post("alerts/add", dto).then((res) => {
          if (res.success) {
            setOpenPopup(false);
            toast.success(res.message)
          }
        });
      }


  const getAlerts = (p = {}) => {
    ApiClient.get(shared.get).then((res) => {
      loader(true);
      if (res.success) {
        setAlerts(res?.data.alerts);
      }
      loader(false);
    });
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this ${shared?.title}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.delete(shared.deleteApi, { id: id }).then((res) => {
          if (res.success) {
            getAlerts();
          }
          loader(false);
        });
      }
    });
  };

    const alertReasons = [
      {
        id: "searching for principal residence",
        name: "searching for principal residence",
      },
      {
        id: "searching for secondary residence",
        name: "searching for secondary residence",
      },
      {
        id: "searching for an investment",
        name: "searching for an investment",
      },
      {
        id: "get update on price evolution",
        name: "get update on price evolution",
      },
      { id: "other", name: "other" },
    ];

  useEffect(() => {
    getAlerts();
  }, []);

  return (
    <PageLayout>
      <section className="  pt-14 lg:pt-16 pb-[100px]  bg-[#f2ecf8] relative">
        <div className="container   px-8 mx-auto xl:px-5 h-full flex justify-between flex-col ">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%] w-[100%]">
            <ul className="flex items-center pb-[50px]">
              <li
                onClick={() => navigate("/project")}
                className="text-[#47525E] cursor-pointer after"
              >
                My Project
                <span className="mx-[4px]">|</span>
              </li>
              <li className="text-[#47525E] cursor-pointer capitalize font-[600]">
                {" "}
                Search alerts
              </li>
            </ul>
            <div>
              <h4 className="text-[#47525E] text-center mb-0 text-[17px]">
                Search alerts
              </h4>
              <h2 className="text-[#47525E] font-[600] text-[24px] mt-1 text-center">
                Be informed first
              </h2>
            </div>
            <ul className="flex items-center flex-wrap justify-between mt-12">
              {alerts?.length > 0 ? (
                alerts.map((itm, i) => (
                  <li
                    key={i}
                    className="lg:w-[48%] w-[100%] mb-5 flex justify-between items-center"
                  >
                    <div className="bg-white rounded-[7px] p-4 w-[85%]">
                      <h3 className="text-[#47525E] font-[600] text-[18px] ellipses">
                        {/* Search name */}
                        {itm?.name
                          ? `${capLetter(itm?.name)}`
                          : `Search alert ${i + 1}`}
                      </h3>
                      <p className="text-[#47525E] my-2 mt-3 ellipses">
                        {generateDynamicString(itm?.filteredData || {}) ||
                          "No data available"}
                      </p>
                      <h5 className="text-[#47525E] font-[600] text-[17px] ellipses">
                        {/* Search Total Count */}
                        {`${itm?.totalcount || 0} new result${
                          itm?.totalcount > 1 ? "s" : ""
                        }`}
                      </h5>
                    </div>
                    <div className="w-[10%]">
                      <AiOutlineDelete
                        onClick={() => deleteItem(itm.id || itm._id)}
                        className="text-[20px] p-[6px] w-[30px] h-[30px] text-white rounded-[50px] bg-[#c2a8df] cursor-pointer"
                      />
                    </div>
                  </li>
                ))
              ) : (
                <li className="w-full text-center text-gray-500 mt-4">
                  <img
                    src="assets/img/no-data.svg"
                    className="max-w-[300px] w-full mx-auto"
                  />
                  No alerts available
                </li>
              )}
            </ul>
          </div>
          <div className="flex justify-center pt-10">
            <button
              onClick={() => setOpenPopup(true)}
              className="h-12 bg-[#48464a] rounded-full w-[300px] px-10 text-[18px] font-medium text-center text-white hover:opacity-80 transition-all signup-btn"
            >
              Create new alert
            </button>
          </div>
        </div>
        {
            <Dialog
              open={openPopup}
              onClose={() => setOpenPopup(false)}
              className="relative z-[9999]"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/30" />
              <div className="fixed inset-0 flex w-screen items-center justify-center">
                <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                  <DialogTitle className="p-6">
                    <p className="border-b text-[#976DD0] font-[600] text-[18px] text-center pb-4">
                      Don't miss a property
                      <span className="text-[#47525E] text-center font-[400] text-[16px] block">
                        That meet your requirements
                      </span>
                    </p>

                    <label className="my-3 text-[#47525E] text-[16px] font-[400] mb-1 block">
                      I'm creating this alert cause
                    </label>
                    <SelectDropdown
                      placeholder="Select reason"
                      displayValue="name"
                      className="capitalize mb-4"
                      intialValue={alert?.reason}
                      result={(e) => {
                        setAlert({ ...alert, reason: e.value });
                        setError({ ...error, alert: "" });
                      }}
                      options={alertReasons}
                    />

                    <input
                      type="email"
                      value={alert?.email}
                      onChange={(e) => {
                        setAlert({ ...alert, email: e.target.value });
                        setError({ ...error, alert: "" });
                      }}
                      className={`bg-white rounded-[7px] h-11 border border-[#976DD0] p-2 px-3 xl:max-w-[500px] w-[100%] mb-4`}
                      placeholder="youremailaddress@gmail.com"
                    />
                    <input
                      type="text"
                      value={alert?.name}
                      onChange={(e) => {
                        setAlert({ ...alert, name: e.target.value });
                        setError({ ...error, alert: "" });
                      }}
                      className={`bg-white rounded-[7px] h-11 border border-[#976DD0] p-2 px-3 xl:max-w-[500px] w-[100%] mb-4`}
                      placeholder="Name you search"
                    />
                    {error?.alert && (
                      <span className="text-[#ff0000] text-sm text-center mx-auto block">
                        {error?.alert}
                      </span>
                    )}
                    <div className="mx-auto flex justify-center my-3">
                      <button
                        onClick={addAlert}
                        className="bg-[#48464a] px-4 text-[14px] py-2 rounded-[50px] text-white"
                      >
                        Receive alerts
                      </button>
                    </div>
                    <p className="text-[#47525E] font-[400] text-center text-[14px]">
                      Bookaroo processes your data in order to manage your
                      request for new real estate ad alerts by e-mail. To find
                      out more and exercise your rights, click here.
                    </p>
                  </DialogTitle>
                </DialogPanel>
              </div>
            </Dialog>
        }
      </section>
    </PageLayout>
  );
};

export default SearchAlert;
