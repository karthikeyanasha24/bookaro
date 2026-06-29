import { Checkbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { propertyTypes, saveChanges } from "../shared";
import PropertyCheck from "../propertyCheck";

const Step2 = ({ step1, setActiveTabIndex, formData, setFormData, id }) => {
  const navigate = useNavigate();
  const [Error, setError] = useState("");

  useEffect(() => {
    if (step1) setFormData({ ...formData, ...step1 })
  }, [])

  const handleTypeSelect = (type) => {
    // if (id) return // user can't edit type
    setError("")
    setFormData((prev) => ({
      ...prev,
      type: type?.toLowerCase()
    }))
  };

  const validate = () => {
    if (!formData?.type) {
      setError("Select Property Type..")
      return false;
    }
    if (formData?.propertyType === "directory") {
      if (!formData?.usedAs) {
        setError("Select Property used for..")
        return false;
      }
    }
    return true;
  }

  const handleNext = () => {
    if (!validate()) return;
    localStorage.setItem("step1", JSON.stringify(formData))
    if (id) {
      navigate(`/property/edit/${id}/2`)
    } else {
      navigate("/property/add/2")
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 7));
  };

    const handleBackNext = () => {
    if (id) {
      navigate(`/property/edit/${id}`)
    } else {
      navigate("/property/add")
    }
    setActiveTabIndex((prevIndex) => Math.min(prevIndex - 1, 7));
  };


  const toogleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }))
    setError("")
  }

  const save = () => {
    if (!validate()) return;
    step1.type = formData.type;
    if (formData?.usedAs) step1.usedAs = formData?.usedAs;
    localStorage.setItem("step1", JSON.stringify(step1))
    saveChanges(step1)
  };

  return (
    <>
      <div className="flex justify-between flex-col h-full relative ">
          <PropertyCheck/>
        <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
          <h4 className="text-[#47525E] text-[24px] font-[600] text-left  mb-[50px] ">
            Type of property
          </h4>
          <ul className="flex justify-start 2xl:gap-4 gap-0 w-full items-center xl:flex-nowrap flex-wrap">
            {propertyTypes.map((property) => (
              <li
                key={property.name}
                onClick={() => {
                  if (!id) handleTypeSelect(property.name)
                }}
                className={`text-[#606264] p-4 rounded-[10px] text-center font-medium mx-3 cursor-pointer border-[2px]
                                    ${formData?.type === property.name?.toLowerCase()
                    ? 'border-[#73339B]'
                    : 'border-transparent group hover:border-[#73339B]'
                  } w-[125px] h-[110px] xl:my-0 my-2`}
              >
                <img
                  src={property.icon}
                  alt={property.name}
                  className="w-[40px] mx-auto block mb-2"
                />
                {property.name}
              </li>
            ))}
          </ul>
          {formData?.propertyType?.toLowerCase() === "directory" && (
            <div className="text-left max-w-2xl mt-14 ">
              <h3 className="text-[#47525E] font-[600] text-[18px]">
                Property is used as:
              </h3>
              <div className="flex flex-col  mt-3 mb-7">
                <div className="flex items-center mb-3">
                  <Checkbox className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                    checked={formData?.usedAs === "investment"}
                    value={formData?.usedAs}
                    onChange={() => toogleChange("usedAs", "investment")}
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

                  <label className="text-[#47525E] sm:text-[16px] text-[13px]">
                    Investment (long term rental)
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox className="group block size-4 me-2 rounded-[5px] border border-[#976DD0]  data-[checked]:bg-[#976DD0]"
                    checked={formData?.usedAs === "own usage"}
                    value={formData?.usedAs}
                    onChange={() => toogleChange("usedAs", "own usage")}
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
                  <label className="text-[#47525E] sm:text-[16px] text-[13px]">
                    Own usage
                  </label>
                </div>
              </div>
              <p className="text-[#47525E] italic">This choice let us know where to display your property when user search properties in directory either for rental or for purchase</p>
            </div>
          )}

          <div className="mt-2 text-left text-sm text-[#ff0000]">{Error}</div>
          <p className="text-[#47525E] text-[14px] xl:mt-16 lg:mt-8 mb-3 mt-5 text-start">
            Once the property profile is published you won't
            be able to edit this property type.
          </p>
        </div>

        {id ? (
          // <>{formData?.propertyType === "directory" ? (
            <div className="text-end bg-[#f2ecf8] p-5 w-full ">
              <button
                onClick={save}
                className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
              >
                Save change
              </button>
            </div>
          // ) : ("")}</>
        ) : (
          <div className="text-end  bg-[#f7f4fb] flex gap-2 justify-end flex-wrap p-5 w-full ">
            <button onClick={handleBackNext} className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4">
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn text-white bg-[#48464a] rounded-full px-10 py-4 submit-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Step2;
