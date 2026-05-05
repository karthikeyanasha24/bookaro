import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login_success } from "../../actions/user";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import CompanySidebar from "./CompanySidebar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../LanguageSwitcher";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData?.companyName?.trim() ||
      !formData?.address?.trim() ||
      !formData?.postalCode?.trim() ||
      !formData?.city?.trim() ||
      !formData?.country?.trim()
    ) {
      return toast.error("Enter all mandatory fields")
    }

    loader(true);
    const payload = {
      userId: user?.id || user?._id,
      companyName: formData?.companyName,
      registrationNumber: formData?.registrationNumber,
      address: formData?.address,
      postalCode: formData?.postalCode,
      city: formData?.city,
      country: formData?.country,
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
        setFormData({
          companyName: res?.data?.companyName,
          registrationNumber: res?.data?.registrationNumber,
          address: res?.data?.address || res?.data?.street,
          postalCode: res?.data?.postalCode || res?.data?.pinCode,
          city: res?.data?.city,
          country: res?.data?.country,
        });
      }
      loader(false);
    });
  }
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <PageLayout>
      <section className="py-14   lg:py-16 bg-[#f2ecf8]">
        <div className="container items-center  px-8 mx-auto xl:px-5">
          <div className="lg:max-w-[1200px] mx-auto max-w-[100%]">
            <div className="grid grid-cols-12 lg:gap-12  gap-0">
              <CompanySidebar />
              <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8">
                <h2 className=" text-[#47525E] md:text-[24px] text-[20px]  font-bold mb-6 flex justify-between md:flex-row flex-col">
                  {t("settings.manageCompanyProfile")}
                  <button onClick={() => navigate(`/company-details?id=${user?._id}`)} className="bg-[#986dcd] px-4 py-2 text-[14px] text-white rounded-md w-max md:ml-auto ml-0 mt-4 md:mt-0">
                    {t("settings.preview")}
                  </button>
                </h2>
                <div className="p-10 md:px-14 px-8  border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0">
                  <div className="mb-8 p-4 rounded-[10px] border border-[#E9DCF9] bg-[#FCFAFF]">
                    <h4 className="text-black font-bold text-[18px] mb-1">
                      {t("settings.languagePreferences")}
                    </h4>
                    <p className="text-[#5A5A5A] text-[14px] mb-3">
                      {t("settings.chooseLanguage")}
                    </p>
                    <LanguageSwitcher className="max-w-[280px]" />
                  </div>
                  <form onSubmit={handleSubmit} className="flex  flex-col h-full">
                    <div>
                      <div className="mb-8">
                        <h4 className="text-black font-bold text-[19px] mb-0">
                          {t("settings.companyProfile")}
                        </h4>
                        <p className="text-black text-[18px] mb-2 ">
                          {t("settings.searchableDirectory")}
                        </p>
                      </div>
                      <div className=" max-w-[100%] mx-auto">
                        {user?.accountType == "pro" && (
                          <div className="grid grid-cols-3 gap-10 text-center mb-10 mt-10">
                            {["Agency", "Agent", "Hunter"].map(
                              (type, index) => (
                                <div
                                  key={type}
                                  className={`p-5 border-[1px] ${user?.role === type?.toLocaleLowerCase()
                                    ? "border-[#976DD0]"
                                    : "border-[#fff0]"
                                    } rounded-md flex justify-center items-center`}
                                >
                                  <div>
                                    <img
                                      src={`/assets/img/img_${index + 1}.png`}
                                      className="w-[35px] mx-auto"
                                      alt={type}
                                    />
                                    <p className="text-[16px]">{type}</p>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {(user?.role == "agency" ||
                          user?.role == "agent") && (
                            <input
                              name="companyName"
                              type="text"
                              className=" block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 "
                              placeholder={`CompanyName*`}
                              value={formData?.companyName}
                              onChange={handleChange}
                            />
                          )}
                        {user?.role == "agency" && (
                          <input
                            name="registrationNumber"
                            type="text"
                            className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 "
                            placeholder={`registrationNumber*`}
                            value={formData?.registrationNumber}
                            onChange={handleChange}
                          />
                        )}

                        {["address", "postalCode", "city", "country"].map((field) => (
                          <input
                            key={field}
                            name={field}
                            type="text"
                            className="block w-full h-11 px-3 py-2.5 mb-3 bg-white border-[1px] border-[#976DD0] rounded-md placeholder-gray-400 "
                            placeholder={`${field.replace(/([A-Z])/g, " $1")}*`}
                            value={formData[field]}
                            onChange={handleChange}
                          />
                        )
                        )}
                        <p className="text-[#5A5A5A] mt-2 ">
                          *Required field
                        </p>
                      </div>
                    </div>
                    <div className="mt-20  flex items-center justify-end">
                      <button
                        type="submit"
                        className="bg-[#48464a] rounded-[100px] px-14 py-3 text-white signup-btn border border-transparent hover:bg-transparent hover:border-[#48464a] transition duration-300 ease-in-out"
                      >
                        {t("common.save")}
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

export default Settings;
