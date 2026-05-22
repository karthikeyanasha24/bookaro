import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login_success } from "../../actions/user";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import CompanySidebar from "./CompanySidebar";
import { removeHTMLTags } from "../../models/string.model";

const About = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    about: "",
  });

  const handleChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      about: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!removeHTMLTags(formData?.about)) {
      return toast.error("Enter mandatory fields")
    }
    const payload = {
      userId: formData?.id || formData?._id,
      ...formData,
    };

    loader(true);
    ApiClient.put("user/editUserDetails", payload).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        dispatch(login_success({ ...formData }));
      }
      loader(false);
    });
  };

  const getDetails = () => {
    loader(true);
    ApiClient.get(`user/detail`, { id: user?._id }).then((res) => {
      if (res.success) {
        setFormData({
          id: res?.data?.id || res?.data?._id,
          about: res?.data?.about,
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
              <div className="xl:col-span-8 lg:col-span-7 col-span-12 md:mt-0 mt-8 ">
                <h2 className=" text-[#47525E] text-[26px] font-bold mb-6">
                  Manage your company profile
                </h2>
                <div className="p-6 md:px-14 px-6 border border-[#976DD0] rounded-[10px] mt-10 lg:mt-0 h-[92%]">
                  <form
                    onSubmit={handleSubmit}
                    className="flex  flex-col h-full"
                  >
                    <div>
                      <div className="mb-8">
                        <h4 className="text-black font-bold text-[19px]  mb-0">
                          About
                        </h4>
                        <p className="text-black text-[18px]  mb-2 ">
                          Tell us about your Company
                        </p>
                      </div>
                      <div className=" max-w-[100%] mx-auto">
                        <div className="bg-white rounded-[7px] border border-[#976DD0]  md:w-[500px] w-full textarea-border about-us-editor">
                          <ReactQuill
                            theme="snow"
                            value={formData.about}
                            onChange={handleChange}
                            style={{ height: "600px" }}
                          />
                        </div>
                        <p className="text-[#5A5A5A] mt-2 ms-2">
                          *Required field
                        </p>
                      </div>
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

export default About;
