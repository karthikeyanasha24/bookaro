import {
  Checkbox,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import loader from "../../methods/loader";
import ApiClient from "../../methods/api/apiClient";
import { toast } from "react-toastify";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const ContactAgencyModal = ({ open, setOpen, paramId, setloginModal }) => {
  const user = useSelector((state) => state.user);
  const [contactSent, setcontactSent] = useState(false);
  const [agency, setagency] = useState({
    fName: "",
    lName: "",
    phone: "",
    email: "",
    likeToBuy: "Now",
    alreadyOwnProperty: false,
    message: false,
  });
  const agencyChange = (atr, value) => {
    setagency({ ...agency, [atr]: value });
  };
  const validateForm = () => {
    if (!/^[A-Za-z ]{2,50}$/.test(agency.fName.trim())) {
      toast.error(
        "First name must be alphabetic, can include spaces, and be between 2 to 50 characters."
      );
      return false;
    } else if (!/^[A-Za-z ]{2,50}$/.test(agency.lName.trim())) {
      toast.error(
        "Last name must be alphabetic, can include spaces, and be between 2 to 50 characters."
      );
      return false;
    }
    if (!/^\d{10,}$/.test(agency.phone.trim())) {
      toast.error("Phone number must be at least 10 digits.");
      return false;
    } else if (
      !/^\S+@\S+\.\S+$/.test(agency.email.trim()) ||
      agency.email.length < 5 ||
      agency.email.length > 50
    ) {
      toast.error("Email must be a valid format");
      return false;
    }
    // else if (!agency.propertyToSell) {
    //     toast.error("Please indicate if you have a property to sell.");
    //     return false;
    // }
    return true;
  };
  const contactAgency = () => {
    if (!user.loggedIn) return setloginModal(true);
    if (validateForm()) {
      let dto = {
        firstName: agency.fName,
        lastName: agency.lName,
        email: agency.email,
        mobileNo: agency.phone,
        property_to_sell: agency.alreadyOwnProperty,
        not_want_to_receive_advices: agency?.message,
        property_id: paramId,
      };
      loader(true);
      ApiClient.post("contactUs/add", dto).then((res) => {
        if (res.success) {
          // toast.success(res.message)
          setOpen(false);
          setagency({
            fName: "",
            lName: "",
            phone: "",
            email: "",
            likeToBuy: "Now",
            alreadyOwnProperty: false,
            message: false,
          });
          setcontactSent(true);
        }
        loader(false);
      });
    }
  };
  const closeModal = () => {
    setOpen(false);
    setagency({
      fName: "",
      lName: "",
      phone: "",
      email: "",
      likeToBuy: "Now",
      alreadyOwnProperty: false,
      message: false,
    });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-[99] ">
        <DialogPanel className=" max-w-lg w-full space-y-4 border bg-white p-5 rounded-[7px]">
          <div className="flex items-center justify-between">
            <div className="">
              <h4 className="text-[#47525E] font-[600] text-[15px]">
                REAL ESTATE AGENCY NAME
              </h4>
            </div>
            <p
              className="text-[22px] cursor-pointer"
              onClick={() => closeModal()}
            >
              <RxCross2 className="ml-auto cursor-pointer" />{" "}
            </p>
          </div>
          <div className="bg-[#F1EDF6] p-4 rounded-[8px] h-[400px] overflow-auto">
            <div className="">
              <input
                value={agency?.fName}
                onChange={(e) => agencyChange("fName", e.target.value)}
                type="text"
                placeholder="First name*"
                className="border border-[#976DD0] rounded-[7px] px-3 py-2 w-full my-3"
              />
              <input
                value={agency?.lName}
                onChange={(e) => agencyChange("lName", e.target.value)}
                type="text"
                placeholder="Last name*"
                className="border border-[#976DD0] rounded-[7px] px-3 py-2 w-full my-3"
              />
              <PhoneInput
                country={"fr"}
                value={agency?.phone}
                enableSearch={true}
                onChange={(e) => agencyChange("phone", e)}
                inputProps={{ required: true }}
                countryCodeEditable={true}
              />
              <input
                value={agency?.email}
                onChange={(e) => agencyChange("email", e.target.value)}
                type="email"
                placeholder="Email address*"
                className="border border-[#976DD0] rounded-[7px] px-3 py-2 w-full my-3"
              />
              <div>
                <label className="text-[#5A5A5A]">
                  When would you like to buy?*
                </label>
                <div>
                  <Menu>
                    <MenuButton className="bg-white border border-[#976DD0] rounded-[7px] px-3 py-2 w-full my-3 text-left text-[#5A5A5A] flex justify-between">
                      {agency?.likeToBuy}
                      <img
                        alt=""
                        src="/assets/img/black-arrow.png"
                        className="w-[20px]"
                      />
                    </MenuButton>
                    <MenuItems anchor="bottom">
                      <div className="w-full bg-white">
                        <MenuItem
                          onClick={() => agencyChange("likeToBuy", "Now")}
                          className=" bg-white"
                        >
                          <p className="block data-[focus]:bg-blue-100 px-3 py-2 max-w-[320px] w-[100%] text-left">
                            Now
                          </p>
                        </MenuItem>
                        <MenuItem
                          onClick={() => agencyChange("likeToBuy", "Later")}
                          className=" bg-white"
                        >
                          <p className="block data-[focus]:bg-blue-100  px-3 py-2 max-w-[320px] w-[100%] text-left">
                            Later
                          </p>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                  <div className="flex items-center justify-between">
                    <p className="text-[#5A5A5A]">I already own a property</p>
                    <div className="flex border border-[#976DD0] p-[2px] rounded-[7px] bg-white">
                      <Checkbox
                        checked={agency?.alreadyOwnProperty}
                        onChange={() =>
                          agencyChange("alreadyOwnProperty", true)
                        }
                        className="group block text-[14px] text-black rounded-[5px]  border-r bg-white data-[checked]:text-white data-[checked]:bg-[#976DD0] px-2 py-1 cursor-pointer"
                      >
                        Yes
                      </Checkbox>
                      <Checkbox
                        checked={!agency?.alreadyOwnProperty}
                        onChange={() =>
                          agencyChange("alreadyOwnProperty", false)
                        }
                        className="group block text-[14px] text-black rounded-[5px] bg-white data-[checked]:text-white data-[checked]:bg-[#976DD0] px-2 py-1 cursor-pointer"
                      >
                        No
                      </Checkbox>
                    </div>
                  </div>

                  <div>
                    <p className="text-[#47525E] underline mb-3 mt-4">
                      Add a message (optional)
                    </p>
                    <div className="flex items-start">
                      <div>
                        <Checkbox
                          value={agency?.message}
                          checked={agency?.message}
                          onChange={(e) => {

                            agencyChange("message", e);
                          }}
                          className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500 me-2 p-[1px] mt-1"
                        >
                          {/* Checkmark icon */}
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
                      </div>
                      <label className="text-[#5A5A5A]">
                        I do not wish to receive similar property proiles and
                        personalized suggestions from Bookaroo.
                      </label>
                    </div>
                    <a className="underline text-[#47525E] text-[14px]">
                      Learn more
                    </a>
                  </div>

                  <div className="flex items-center justify-center my-8">
                    <button
                      onClick={() => contactAgency()}
                      className="bg-[#976DD0] text-white rounded-[50px] text-[14px] px-5 py-3 font-[600]"
                    >
                      Contact agency
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-8">
                    <p className="text-[#5A5A5A]">Profile XV429</p>
                    <a className="underline text-[#47525E] text-[14px] font-[600]">
                      Report this profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ContactAgencyModal;
