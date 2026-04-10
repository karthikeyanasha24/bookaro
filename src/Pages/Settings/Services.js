import { Checkbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import CompanySidebar from "./CompanySidebar";
import { login_success } from "../../actions/user";

const Services = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const handleChange = (itm, isChecked) => {
    setSelectedServices((prev) => {
      if (isChecked) {
        return [...prev, { name: itm.name, id: itm.id }];
      } else {
        return prev.filter((service) => service.id !== itm.id);
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    loader(true);
    const payload = {
      userId: user?.id || user?._id,
      servicesYouOffer: selectedServices, //service?.filter((item) => item.key)?.map((item) => item.value),
    };
    ApiClient.put("user/editUserDetails", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        dispatch(login_success({ ...payload }));
      }
      loader(false);
    });
  };
  const getDetails = () => {
    loader(true);
    ApiClient.get(`user/detail`, { id: user?._id }).then((res) => {
      if (res.success) {
        setSelectedServices(res?.data?.servicesYouOffer)
      }
      loader(false);
    });
  };
  const getServices = () => {
    loader(true);
    ApiClient.get("service/list", {}).then((res) => {
      if (res.success) {
        let data = res.data?.filter(dd => dd?.status === "active")
          ?.map((itm) => {
            itm.id = itm._id;
            return itm;
          })
        setServices(data);
      }
      loader(false);
    });
  };

  useEffect(() => {
    getDetails();
    getServices();
  }, []);

  return (
    <PageLayout>
      <section className="py-14   lg:py-16 bg-[#f2ecf8]">
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
            <div className="grid grid-cols-12 lg:gap-12  gap-0">
              <CompanySidebar />
              <div className="xl:col-span-8 lg:col-span-7 col-span-12 lg:mt-0 mt-8 h-full">
                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                  Manage your company profile
                </h2>
                <div className="p-6 md:px-14 px-6 border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0 lg:h-[92%] ">
                  <form
                    onSubmit={handleSubmit}
                    className="flex  flex-col h-full"
                  >
                    <div>
                      <div className="mb-8">
                        <h4 className="text-black font-bold text-[19px]  mb-0">
                          Services You Offer
                        </h4>
                        <p className="text-black text-[18px]  mb-2 ">
                          Services You Offer shown below
                        </p>
                      </div>
                      <div className=" max-w-[100%]">
                        <ul className="grid grid-cols-12 md:gap-10 gap-0">
                          {services?.map((itm, i) => (
                            <li key={i} class=" xl:col-span-4 md:col-span-6 col-span-12 p-4 rounded-[10px] border border-[#976DD0] flex items-center md:mb-0 mb-4 bg-white">
                              <Checkbox
                                checked={selectedServices?.some(service => service.id === itm.id)}
                                value={itm.key}
                                onChange={(e) => handleChange(itm, e)}
                                className="group shrink-0 block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1"
                              >
                                <svg
                                  className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Checkbox>
                              <div class="">
                                <h1 className="text-[#343F4B] font-[600] text-[14px]">
                                  {itm.name}
                                </h1>
                              </div>
                            </li>
                          ))}
                        </ul>
                        {/* <ul className="grid grid-cols-12 gap-10">
                          {service?.map((itm) => (
                            <li class=" col-span-4 p-4 rounded-[10px] border border-[#976DD0] flex items-center">
                              <Checkbox
                                checked={itm.key}
                                value={itm.key}
                                onChange={(e) => handleChange(itm.value, e)}
                                className="group block size-7 me-2 rounded-[50px] border-[1px] border-[#976DD0] data-[checked]:bg-[#73339B] p-1"
                              >
                                <svg
                                  className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Checkbox>
                              <div class="">
                                <h1 className="text-[#343F4B] font-[600] text-[14px]">
                                  {itm.name}
                                </h1>
                              </div>
                            </li>
                          ))}
                        </ul> */}
                      </div>
                    </div>
                    <div className="mt-20 flex items-center justify-end">
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

export default Services;
