import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveChanges } from "../shared";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";

const Step7 = ({ step1, setActiveTabIndex, formData, setFormData, id }) => {
  // this new tab for school***********************************************

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [draftModal, setdraftModal] = useState(false);
  const [highschooldata, sethighschooldata] = useState([]);
  const [collegedata, setcollegedata] = useState([]);
  const [primarydata, setprimarydata] = useState([]);
  const [elementarySchooldata, setelementarySchooldata] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (formData?.zipcode) {
      SchoolCollegeList({ postalCode: formData?.zipcode });
      SchoolhHighschoolList({ postalCode: formData?.zipcode });
      SchoolPrimaryschoolList({ postalCode: formData?.zipcode });
      SchoolElementaryschoolList({ postalCode: formData?.zipcode });
    }
  }, [formData?.zipcode]);

  const SchoolhHighschoolList = async (p) => {
    try {
      const payload = {
        ...p,
        page: 1,
        count: 1000,
        schoolType: "highschool",
        postalCode: formData?.zipcode,
      };
      ApiClient.get(`schools/list`, payload).then((res) => {
        if (res.success) {
          sethighschooldata(
            res?.data?.map((item) => ({
              value: item?.id || item?._id,
              label: item?.EstablishmentName,
            }))
          );
          return res.data.map((item) => ({
            value: item?.id || item?._id,
            label: item?.EstablishmentName,
          }));
        }
      });
    } catch (error) {
      console.error("Error fetching part numbers:", error);
    }
    return [];
  };
  const SchoolCollegeList = async (p) => {
    try {
      const payload = {
        ...p,
        page: 1,
        count: 1000,
        schoolType: "college",
        postalCode: formData?.zipcode,
      };
      ApiClient.get(`schools/list`, payload).then((res) => {
        if (res.success) {
          setcollegedata(
            res?.data?.map((item) => ({
              value: item?.id || item?._id,
              label: item?.EstablishmentName,
            }))
          );
          return res.data.map((item) => ({
            value: item?.id || item?._id,
            label: item?.EstablishmentName,
          }));
        }
      });
    } catch (error) {
      console.error("Error fetching part numbers:", error);
    }
    return [];
  };
  const SchoolPrimaryschoolList = async (p) => {
    try {
      const payload = {
        ...p,
        page: 1,
        count: 1000,
        schoolType: `elementaryPrimary,kindergarten`,
        postalCode: formData?.zipcode,
      };
      const res = await ApiClient.get(`schools/list`, payload); // Use await for cleaner async handling
      if (res.success) {
        const options = res.data.map((item) => ({
          value: item?.id || item?._id,
          label: item?.EstablishmentName,
        }));
        setprimarydata(options); // Update state for defaultOptions
        return options; // Return options to the callback
      }
      return []; // Return empty array if API call fails or no data
    } catch (error) {
      console.error("Error fetching school list:", error);
      return [];
    }
  };
  const SchoolElementaryschoolList = async (p) => {
    try {
      const payload = {
        ...p,
        page: 1,
        count: 1000,
        schoolType:`elementarySchool,kindergarten`,
        postalCode: formData?.zipcode,
      };
      ApiClient.get(`schools/list`, payload).then((res) => {
        if (res.success) {
          const options = res.data.map((item) => ({
            value: item?.id || item?._id,
            label: item?.EstablishmentName,
          }));
          // Optionally update defaultOptions state for fallback
          setelementarySchooldata(options);
          return res.data.map((item) => ({
            value: item?.id || item?._id,
            label: item?.EstablishmentName,
          }));
        }
      });
    } catch (error) {
      console.error("Error fetching part numbers:", error);
    }
    return [];
  };


  const handleNext = () => {
    localStorage.setItem("step1", JSON.stringify(formData));
    if (formData?.propertyType === "directory") {
      if (id) {
        navigate(`/property/edit/${id}/7`);
      } else {
        navigate("/property/add/7");
      }
      setActiveTabIndex(8);
    } else {
      if (id) {
        navigate(`/property/edit/${id}/7`);
      } else {
        navigate("/property/add/7");
      }
      setActiveTabIndex((prevIndex) => Math.min(prevIndex + 1, 8));
    }
  };

  const handleBack = () => {
    if (id) {
      navigate(`/property/edit/${id}/5`);
    } else {
      navigate("/property/add/5");
    }
    setActiveTabIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const save = () => {
    const data = Object.entries(formData)
      .filter(
        ([key, value]) =>
          key.startsWith("school") &&
          value?.schoolId?.value &&
          value?.schoolId?.label &&
          value?.type
      )
      .map(([_, value]) => ({
        schoolId: value.schoolId.value,
        type: value.type,
        EstablishmentName: value.schoolId.label,
      }));
    step1.linkedSchools = data;
    delete step1.school1;
    delete step1.school2;
    delete step1.school3;
    delete step1.school4;
        if (step1?.energymode == "") {
      delete step1.energymode;
    }
    if (step1?.heatingType == "") {
      delete step1.heatingType;
    }
    if (step1?.emission_efficient == "") {
      delete step1.emission_efficient;
    }
    if (step1?.energy_efficient == "") {
      delete step1.energy_efficient;
    }
    if (step1?.usedAs == "") {
      delete step1.usedAs;
    }
    if (step1?.investment?.length == 0 || step1?.investment[0] == "") {
      delete step1.investment
    }
    localStorage.setItem("step1", JSON.stringify(step1));
    saveChanges(step1);
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const loadSchoolOptions = debounce((inputValue, callback) => {
    if (inputValue.trim() !== "") {
      SchoolhHighschoolList({ search: inputValue }).then((options) => {
        callback(options);
      });
    } else {
      callback([]);
    }
  }, 1000);
  const loadCollegeOptions = debounce((inputValue, callback) => {
    if (inputValue.trim() !== "") {
      SchoolCollegeList({ search: inputValue }).then((options) => {
        callback(options);
      });
    } else {
      callback([]);
    }
  }, 1000);
  const loadPrimaryOptions = debounce((inputValue, callback) => {
    if (inputValue.trim() !== "") {
      SchoolPrimaryschoolList({ search: inputValue }).then((options) => {
        callback(options);
      });
    } else {
      callback([]);
    }
  }, 1000);
  const loadElementryOptions = debounce((inputValue, callback) => {
    if (inputValue.trim() !== "") {
      SchoolElementaryschoolList({ search: inputValue }).then((options) => {
        callback(options);
      });
    } else {
      callback([]);
    }
  }, 1000);
  return (
    <div className=" flex justify-between flex-col h-full relative">
      <div className=" lg:overflow-auto lg:h-[500px] h-[100%] overflow-unset lg:p-8 p-4 lg:py-10">
        <div>
          <div className="flex justify-between items-center mb-6 ">
            <h4 className="text-[#47525E] text-[24px] font-[600] mx-auto lg:w-[60%] w-[100%]">
              What public schools are attached to your property ? This can help
              you sell faster
              <span className="text-[#47525E] font-[400] block text-[14px]">
                *Mandatory information
              </span>
            </h4>
          </div>
          <div className="lg:w-[60%] w-[100%] mx-auto">
            <div className="mb-4">
              <label className="text-[16px] inline-block mb-2">
                High School
              </label>
              <AsyncSelect
                cacheOptions
                isClearable
                loadOptions={loadSchoolOptions}
                defaultOptions={highschooldata}
                value={formData?.school1?.schoolId}
                placeholder={formData?.school1?.schoolId?.label}
                className="w-full"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    school1: { schoolId: e, type: "highschool" },
                  });
                }}
                // required
              />
            </div>
            <div className="mb-4">
              <label className="text-[16px] inline-block mb-2">College</label>

              <AsyncSelect
                cacheOptions
                isClearable
                loadOptions={loadCollegeOptions}
                defaultOptions={collegedata}
                value={formData?.school2?.schoolId}
                placeholder={formData?.school2?.schoolId?.label}
                className="w-full"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    school2: { schoolId: e, type: "college" },
                  });
                }}
                // required
              />
            </div>
            <div className="mb-4">
              <label className="text-[16px] inline-block mb-2">
                Primary School
              </label>

              <AsyncSelect
                cacheOptions
                isClearable
                loadOptions={loadPrimaryOptions}
                defaultOptions={primarydata}
                value={formData?.school3?.schoolId}
                placeholder={formData?.school3?.schoolId?.label}
                className="w-full"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    school3: { schoolId: e, type: "elementaryPrimary" },
                  });
                }}
                // required
              />
            </div>
            <div>
              <label className="text-[16px] inline-block mb-2">
                Elementary school
              </label>

              <AsyncSelect
                cacheOptions
                isClearable
                loadOptions={loadElementryOptions}
                defaultOptions={elementarySchooldata}
                placeholder={formData?.school4?.schoolId?.label}
                value={formData?.school4?.schoolId || null}
                className="w-full"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    school4: { schoolId: e, type: "elementarySchool" },
                  });
                }}
                // required
              />
            </div>
          </div>
        </div>
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
        <div className="text-end  flex gap-2 justify-end bg-[#f7f4fb] p-5 w-full  ">
         
          <button
            onClick={handleBack}
            className="btn text-[#48464a] border border-[#48464a] rounded-full px-10 py-4 "
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="btn text-white bg-[#48464a] rounded-full px-10 py-4"
          >
            Next
          </button>
        </div>
      )}
    
    </div>
  );
};

export default Step7;
