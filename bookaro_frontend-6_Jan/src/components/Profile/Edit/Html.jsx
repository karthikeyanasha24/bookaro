import "./style.scss";
import PhoneInput from "react-phone-input-2";
import FormControl from "../../common/FormControl";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import methodModel from "../../../methods/methods";
import { BsUpload } from "react-icons/bs";

const Html = ({ handleSubmit, setForm, form, ImageUpload }) => {
  const history = useNavigate();

  return (
    <>
      <div className="wrapper_section">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-[#111827]">
            Edit Profile
          </h3>
        </div>

        <div className="inner_part sm:mt-3 md:mt-8 ">
          <form name="profileForm" onSubmit={handleSubmit}>
            <div className="grid  grid-cols-12 gap-4 mb-5 ">
              <div className="col-span-12  xl:col-span-3 lg:col-span-4">
                <div className="shadow-box  rounded-lg bg-[#f1e9fb]  p-5   border-white border-[3px] h-full">
                  <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto h-full">
                    {form?.image ? (
                      <>
                        <span className="flex flex-wrap justify-center">
                          <div className="relative ">
                            <img
                              src={methodModel.userImg(form?.image)}
                              className=" thumbnail w-full h-[154px] rounded-lg shadow-lg border-[2px] border-white object-contain p-2"
                            />
                            <IoCloseOutline
                              className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]"
                              onClick={(e) => setForm({ ...form, image: "" })}
                              size={25}
                            />
                          </div>
                        </span>
                      </>
                    ) : (
                      <label
                        className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 border-2 border-dashed border-gray-200 h-full`}
                        style={{ gap: "8px" }}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <BsUpload className="text-[30px] mb-5" />
                          <div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              onChange={ImageUpload}
                            />
                            Upload Image
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-12  xl:col-span-9 lg:col-span-8">
                <div className="grid grid-cols-12  gap-4 shadow p-6  gap-4 bg-white rounded-[10px]">
                  <div className="col-span-12 md:col-span-6">
                    <FormControl
                      type="text"
                      label="First Name"
                      value={form?.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e })}
                      required
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormControl
                      type="text"
                      label="Last Name"
                      value={form?.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e })}
                      // required
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-sm mb-2 block">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      className="relative  bg-white w-full rounded-lg h-10  overflow-hidden px-2 border border-[#00000036]  disabled:cursor-not-allowed text-[14px]"
                      value={form?.email}
                      autoComplete="false"
                      disabled
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-sm mb-2 block">Mobile No </label>
                    <PhoneInput
                      country={""}
                      value={form.mobileNo}
                      enableSearch={true}
                      onChange={(e) => setForm({ ...form, mobileNo: e })}
                      inputProps={{ required: true }}
                      countryCodeEditable={true}
                    />
                  </div>
                </div>
              </div>
              
            </div>
          
                <div className="text-right mt-3">
                  <button
                    type="button"
                    onClick={() => history("/profile")}
                    className="text-white bg-gray-400 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-3"
                  >
                    Cancel
                  </button>
                  <button className="text-white bg-[#976DD0] bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Save
                  </button>
                </div>
             
          </form>
        </div>
      </div>
    </>
  );
};

export default Html;
