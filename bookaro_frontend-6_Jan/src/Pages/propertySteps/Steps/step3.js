import { Checkbox } from "@headlessui/react";
import { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import GooglePlaceAutoComplete from "../../../components/common/GooglePlaceAutoComplete";
import addressModel from "../../../models/address.model";
import { saveChanges } from "../shared";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { toast } from "react-toastify";
import SaveDraftModal from "../../../components/common/Modal/SaveDraftModal";
import { useSelector } from "react-redux";
import { RiDraftFill } from "react-icons/ri";
import PropertyCheck from "../propertyCheck";

const Step3 = ({ step1, setActiveTabIndex, formData, setFormData, id }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [Error, setError] = useState("");
  const [draftModal, setdraftModal] = useState(false);

  const [searchParams] = useSearchParams();
  const sale = searchParams.get("sale");
  const rent = searchParams.get("rent");
  const directory = searchParams.get("directory");
  const [msg, setMsg] = useState("")

  const validate = () => {
    if (!formData?.address) {
      setError("Select Location First .");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (
      !formData.country ||
      !formData.city ||
      !formData.state ||
      !formData.zipcode
    ) {
      setError("City, State, Zipcode and Country is required");
      return;
    }
    if (!validate()) return;
    localStorage.setItem("step1", JSON.stringify(formData));
    if (id) {
      navigate(`/property/edit/${id}/3`);
    } else {
      navigate(`/property/add/3`);
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
  };

  const handleBackNext = () => {
    if (id) {
      navigate(`/property/edit/${id}/1`);
    } else {
      navigate("/property/add/1");
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex - 1, 7));
  };

  const modifyCoordinate = (coordinate) => {
    const [integerPart, decimalPart] = coordinate.toString().split(".");
    let thirdDigit = decimalPart ? parseInt(decimalPart[2], 10) : null;
    if (thirdDigit === 9) {
      thirdDigit = 8;
    } else if (thirdDigit === 0) {
      thirdDigit = 1;
    } else if (thirdDigit !== null) {
      thirdDigit = (thirdDigit + 1) % 10; // Adds 1, but wraps around at 10 (e.g., 9 -> 0)
    }
    if (decimalPart && thirdDigit !== null) {
      const modifiedDecimalPart =
        decimalPart.slice(0, 2) + thirdDigit + decimalPart.slice(3);
      return parseFloat(`${integerPart}.${modifiedDecimalPart}`);
    }
    return coordinate;
  };

  const addressResult = async (e) => {
    let address = {};
    if (e.place) {
      address = await addressModel.getAddress(e.place);
    }
    if (!id) {
      const random = Math.random() < 0.5 ? "lat" : "lng";
      setFormData((prev) => ({
        ...prev,
        address: e.value,
        city: address?.city,
        zipcode: address?.zipcode,
        country: address?.country,
        state: address?.state,
        newlocation: {
          type: "Point",
          coordinates: [address?.lng, address?.lat],
        },
        location: {
          lng: address?.lng,
          lat: address?.lat,
        },
        randomLocation: {
          [random]: modifyCoordinate(address[random]), // Modify the randomly chosen key
          [random === "lat" ? "lng" : "lat"]:
            address?.[random === "lat" ? "lng" : "lat"], // Keep the other key unchanged
        },
      }));
    }
    setError("");
  };

  const save = () => {
    if (!validate()) return;
    step1.address = formData.address;
    step1.city = formData?.city;
    step1.zipcode = formData?.zipcode;
    step1.country = formData?.country;
    step1.location = formData?.location;
    step1.newlocation = formData?.newlocation;
    step1.randomLocation = formData?.randomLocation;
    step1.exactLocation = formData?.exactLocation;
    localStorage.setItem("step1", JSON.stringify(step1));
    saveChanges(step1);
  };

  const draftsave = () => {
    if (!validate()) return;
    const payload = {
      ...formData,
      step: 1,
    };
    loader(true);
    ApiClient.post(`draft/add`, payload, {}, "", true).then((res) => {
      if (res.success) {
        toast.success(res?.message);
        navigate("/");
      } else {
        setdraftModal(true);
        setMsg(res?.message)
        // toast.error(res?.message);
      }
      loader(false);
    });
  };

  return (
    <>
      <div className=" flex justify-between flex-col h-full relative ">
          <PropertyCheck/>
        <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <div className="flex justify-between gap-5 flex-wrap items-center mb-8">
            <h4 className="text-[#47525E] text-[24px] font-[600] ">
              Where is your property located?
            </h4>
          </div>
          <div>
            <div>
              <h4 className="text-[#47525E] font-[600] text-[20px] mb-[4px]">
                {" "}
                Your property exact location is hidden
              </h4>
              <p className="text-[#47525E]">
                No worries, we only use it to place your property on our map in
                the right neigborhood.
              </p>
            </div>

            <div className="my-9 md:max-w-[500px] w-[100%]">
              <label className="mb-1 block text-[16px] text-[#47525E] mb-[4px]">
                Address*
              </label>
              <div className="relative bg-white border border-[#ccc] google_location flex items-center rounded-[5px]">
                <span className="text-gray-500 border-r border-[#ccc] p-2 px-3">
                  {" "}
                  <IoLocationOutline className="text-[18px]" />
                </span>
                <GooglePlaceAutoComplete
                  value={formData.address}
                  result={addressResult}
                  placeholder="Enter address..."
                  id="address"
                  disabled={id}
                />
              </div>
              <div style={{ color: "red" }}>{Error}</div>

              <div className="flex items-center flex-wrap mt-5">
                <div className="flex items-center ">
                  <Checkbox
                    checked={formData.exactLocation}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        exactLocation: !formData.exactLocation,
                      }))
                    }
                    className="group block size-4 me-2 my-1 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0] "
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
                </div>
                <label className=" block text-[16px] text-[#47525E] mt-[2px]">
                  Show exact location
                </label>
              </div>
            </div>
          </div>
          <p className="text-[#47525E] text-[14px] xl:mt-16 lg:mt-8 mb-3 mt-5 text-start">
            Once the property profile is published you won't be able to edit
            this.
          </p>
        </div>
        {id ? (
          <div className="text-end bg-[#f2ecf8] p-5 w-full ">
            <button
              onClick={save}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              Save change
            </button>
          </div>
        ) : (
          <div className="text-end flex gap-2 justify-end  bg-[#f7f4fb] p-5 w-full ">
            <button
              onClick={draftsave}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              Save As Draft
            </button>
            <button
              onClick={handleBackNext}
              className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 "
            >
              Next
            </button>
          </div>
        )}
        {msg === `You already have a draft for ${formData?.propertyType} type of property.` ? (
          <SaveDraftModal
            draftModal={draftModal}
            setdraftModal={setdraftModal}
            data={formData}
            step={1}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Step3;
