import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import shared, { categorizeData } from "./shared";
import Step1 from "./Steps/step1";
import Step10 from "./Steps/step10";
import Step11 from "./Steps/step11";
import Step12 from "./Steps/step12";
import Step13 from "./Steps/step13";
import Step2 from "./Steps/step2";
import Step3 from "./Steps/step3";
import Step4 from "./Steps/step4";
import Step5 from "./Steps/step5";
import Step6 from "./Steps/step6";
import Step7 from "./Steps/step7";
import Step8 from "./Steps/step8";
import Step9 from "./Steps/step9";
import { capLetter } from "../../models/string.models";

const AddEdit = () => {
  const step1 = JSON.parse(localStorage.getItem("step1"));
  const { id, step } = useParams();
  const [amenity, setAmenity] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    propertyType: "",
    address: "",
    city: "",
    zipcode: "",
    country: "",
    location: {},
    randomLocation: {},
    exactLocation: true,
    surface: "",
    rooms: 0,
    bathroom: 0,
    bedrooms: 0,
    totalFloorBuilding: 0,
    toilets: 0,
    livingRoom: 0,
    propertyFloor: 0,
    building: "",
    state: "",
    situation: [],
    cooking: [],
    equipment: [],
    outside: [],
    serviceAccessibility: [],
    ancilliary: [],
    environment: [],
    leisure: [],
    investment: [],
    energymode: "",
    heatingType: "",
    diagnosisType: "",
    energyConsumption: "",
    energy_efficient: "",
    emissions: "",
    emission_efficient: "",
    dateOfDiagnosis: "",
    contact: false,
    images: [],
    propertyTitle: "",
    content: "",
    handleBy: "",
    agencyType: "",
    price: "",
    propertyAgencyFees: "",
    propertyCharges: "",
    propertyMonthlyCharges: "",
    propertyInventory: "",
    guaranteeDeposit: "",
    proposal: "",
    userLeads: "",
    rateLeads: "",
    maxLeads: "",
    email: "",
    username: "Private Owner",
    phoneNumber: "",
    real_estate_market: false,
    sale_my_property: false,
    add_more_step: false,
    revenue_detail: [],
    Expenses: [],
    renovation_work: [],
    rating: [],
  });

  const [activeTabIndex, setActiveTabIndex] = useState(parseInt(step) || 0);
  const [steps, setSteps] = useState([
    "Type of property",
    "Address",
    "Characteristics",
    "Energy performance",
    "Photos",
    "Description",
    "School",
    "Price",
    "Contact",
    "Revenues",
    "Expenses",
    "Renovation Works",
    "External Ratings",
  ]);
  const [addSteps, setaddSteps] = useState(false);
  const [dropdownOptions, setdropdownOptions] = useState([]);
  useEffect(() => {
    if (step1) setFormData({ ...formData, ...step1 });
  }, []);
  useEffect(() => {
    setActiveTabIndex(activeTabIndex);
  }, [step]);

  useEffect(() => {
    const addMore = JSON.parse(localStorage.getItem("addMore"));
    setaddSteps(addMore);
    const step1 = JSON.parse(localStorage.getItem("step1"));
    const updatedSteps = addSteps
      ? [
        "Type of property",
        "Address",
        "Characteristics",
        "Energy performance",
        "Photos",
        "Description",
        "School",
        step1?.propertyType === "offmarket" ? "Off-market Status" : "Price",
        "Contact",
        "Revenues",
        "Expenses",
        "Renovation Works",
        "External Ratings",
      ]
      : [
        "Type of property",
        "Address",
        "Characteristics",
        "Energy performance",
        "Photos",
        "Description",
        "School",
        step1?.propertyType === "offmarket" ? "Off-market Status" : "Price",
        "Contact",
      ];
    setSteps(updatedSteps);
  }, [addSteps]);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  const categorizedData = categorizeData(amenity);
  const cookingOptions = categorizedData["Cooking".toLowerCase()] || [];
  const outsideOptions = categorizedData["Outside".toLowerCase()] || [];
  const ancilliaryAreas =
    categorizedData["ancilliary areas".toLowerCase()] || [];
  const leisure = categorizedData["Leisure".toLowerCase()] || [];

  const amenityData = {
    rooms: formData.rooms,
    bathroom: formData.bathroom,
    bedrooms: formData.bedrooms,
    livingRoom: formData.livingRoom,
    toilets: formData.toilets,
  };
  const generateAmenityArray = () => {
    const fields = [
      { value: "Room", name: "rooms", label: "rooms" },
      { value: "Bath Room", name: "bathroom", label: "bathrooms" },
      { value: "Bed Room", name: "bedrooms", label: "bedrooms" },
      { value: "Toilet", name: "toilets", label: "toilets" },
      { value: "Living Room", name: "livingRoom", label: "livingRoom" },
    ];
    let jsonArray = [];

    fields.forEach((field) => {
      for (let i = 1; i <= amenityData[field.name]; i++) {
        jsonArray.push({
          value: `${field.value} ${i}`,
          name: `${capLetter(field.label)} ${i}`,
        });
      }
    });
    cookingOptions.forEach((option) => {
      if (formData.cooking.includes(option.id || option._id)) {
        jsonArray.push({
          value: `${option.name}`,
          name: `${capLetter(option.name)}`,
        });
      }
    });
    outsideOptions.forEach((option) => {
      if (formData.outside.includes(option.id || option._id)) {
        jsonArray.push({
          value: `${option.name}`,
          name: `${capLetter(option.name)}`,
        });
      }
    });
    ancilliaryAreas.forEach((option) => {
      if (formData.ancilliary.includes(option.id || option._id)) {
        jsonArray.push({
          value: `${option.name}`,
          name: `${capLetter(option.name)}`,
        });
      }
    });
    leisure.forEach((option) => {
      if (formData.leisure.includes(option.id || option._id)) {
        jsonArray.push({
          value: `${option.name}`,
          name: `${capLetter(option.name)}`,
        });
      }
    });
    return jsonArray;
  };
  const amenitiesOptions = generateAmenityArray() || [];
  console.log(amenitiesOptions, "amenitiesOptions")

  const getAmenities = () => {
    ApiClient.get("amenity/listing").then((res) => {
      if (res.success) {
        setAmenity(
          res.data.map((itm) => {
            return {
              name: itm?.title,
              id: itm?.id || itm?._id,
              category: itm?.categoryId?.name,
              icon: itm?.image,
            };
          })
        );
      }
    });
  };

  const handleCheckboxChange = (option, category) => {
    setFormData((prev) => {
      const updatedCategory = prev[category].includes(option)
        ? prev[category].filter((item) => item !== option)
        : [...prev[category], option];
      return { ...prev, [category]: updatedCategory };
    });
  };

  const handleIncrement = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: Number(prevData[field]) + 1,
    }));
  };

  const handleDecrement = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: Number(prevData[field]) > 0 ? Number(prevData[field]) - 1 : 0,
    }));
  };

  useEffect(() => {
    getAmenities();
    getAdditionalOptions();
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let data = res?.data?.propertyDetail;
          const filterSchool1data = data?.linkedSchools?.find((item) => item?.type == "highschool")
          const filterSchool2data = data?.linkedSchools?.find((item) => item?.type == "college")
          const filterSchool3data = data?.linkedSchools?.find((item) => item?.type == "elementaryPrimary")
          const filterSchool4data = data?.linkedSchools?.find((item) => item?.type == "elementarySchool")
          setFormData({
            ...data,
            id: data?.id || data?._id,
            school1: { schoolId: { value: filterSchool1data?.schoolId, label: filterSchool1data?.EstablishmentName } },
            school2: { schoolId: { value: filterSchool2data?.schoolId, label: filterSchool2data?.EstablishmentName } },
            school3: { schoolId: { value: filterSchool3data?.schoolId, label: filterSchool3data?.EstablishmentName } },
            school4: { schoolId: { value: filterSchool4data?.schoolId, label: filterSchool4data?.EstablishmentName } },
          })
          localStorage.setItem(
            "step1",
            JSON.stringify({
              ...data,
              id: data?.id || data?._id,
            })
          );
          if (id) {
            localStorage.setItem("addMore", true);
            setaddSteps(true);
          }
          if (data?.propertyType === "offmarket") {
            setSteps((prev) =>
              prev.map((step, index) =>
                index === 6 ? "Off-market Status" : step
              )
            );
          }
          if (data?.propertyType === "directory") {
            setSteps((prev) =>
              prev.map((step, index) =>
                index === 6 ? "Directory Status" : step
              )
            );
          }
        }
        loader(false);
      });
    }
  }, []);

  const getAdditionalOptions = () => {
    loader(true);
    ApiClient.get(shared.getRevenueApi, { status: "active" }).then((res) => {
      loader(false);
      if (res.success) {
        setdropdownOptions(res.data);
      }
    });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTabIndex]);
  const scrollRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [activeTabIndex, pathname]);

  return (
    <>
      <Layout>
        <div className="">
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <Link
                to={`/${shared.url}`}
                className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
              >
                <i className="fa fa-angle-left text-lg"></i>
              </Link>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {id ? "Edit" : "Add"} {shared.addTitle}
              </h3>
            </div>
          </div>

          <div className="property-steps">
            <TabGroup selectedIndex={activeTabIndex}>
              <div className="grid grid-cols-12">
                <div className="xl:col-span-3 lg:col-span-4 col-span-full bg-[#f7f4fb] lg:p-6 p-4 py-6   lg:overflow-auto lg:h-[680px] h-[100%] overflow-unset mb-5">
                  <div className="flex items-center justify-between ">
                    <h4 className="text-[#47525E] text-[18px] lg:mb-4 mb-0">
                      Listing steps
                    </h4>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="lg:hidden p-2 bg-[#976DD0] text-white rounded-md  z-10"
                    >
                      Filter
                    </button>
                  </div>
                  <TabList
                    className="flex-prop lg:flex hidden flex-col"
                    onSelect={handleTabChange}
                  >
                    {steps.map((label, index) => {
                      if (
                        index === 6 &&
                        (formData?.propertyType === "directory" ||
                          (step1?.propertyType &&
                            step1.propertyType === "directory"))
                      )
                        return (
                          <Tab
                            key={index}
                            className={`hidden border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1 w-full text-[14px] lg:text-[16px] cursor-pointer
                            ${index <= activeTabIndex &&
                                index !== activeTabIndex
                                ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                                : index == activeTabIndex
                                  ? "bg-[#976DD0] text-white"
                                  : "hover:bg-[#c1a8e1] hover:text-white"
                              }`}
                            onClick={() => {
                              if (id || index < activeTabIndex)
                                return setActiveTabIndex(index);
                            }}
                          >
                            {label}
                          </Tab>
                        );
                      return (
                        <Tab
                          key={index}
                          className={`border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1 w-full text-[14px] lg:text-[16px] cursor-pointer
                            ${index <= activeTabIndex &&
                              index !== activeTabIndex
                              ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                              : index == activeTabIndex
                                ? "bg-[#976DD0] text-white"
                                : "hover:bg-[#c1a8e1] hover:text-white"
                            }`}
                          onClick={() => {
                            if (id || index < activeTabIndex)
                              return setActiveTabIndex(index);
                          }}
                        >
                          {label}
                        </Tab>
                      );
                    })}
                  </TabList>

                  <div className="">
                    {/* Filter Button */}


                    {/* Modal */}
                    {isModalOpen && (
                      <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex justify-end items-center"
                        onClick={() => setIsModalOpen(false)}
                      >
                        <div
                          className="bg-white w-[300px] lg:w-[500px] h-full z-9 shadow-lg p-4 rounded-r-lg transform transition-transform duration-300 ease-in-out"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            transform: isModalOpen
                              ? "translateX(0)"
                              : "translateX(100%)",
                          }}
                        >
                          <TabList
                            className="flex-prop"
                            onSelect={handleTabChange}
                          >
                            {steps.map((label, index) => {
                              if (
                                index === 6 &&
                                (formData?.propertyType === "directory" ||
                                  (step1?.propertyType &&
                                    step1.propertyType === "directory"))
                              )
                                return (
                                  <Tab
                                    key={index}
                                    className={`hidden border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1 w-full text-[14px] lg:text-[16px] cursor-pointer
                      ${index <= activeTabIndex && index !== activeTabIndex
                                        ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                                        : index == activeTabIndex
                                          ? "bg-[#976DD0] text-white"
                                          : "hover:bg-[#c1a8e1] hover:text-white"
                                      }`}
                                    onClick={() => {
                                      if (id || index < activeTabIndex)
                                        return setActiveTabIndex(index);
                                    }}
                                  >
                                    {label}
                                  </Tab>
                                );
                              return (
                                <Tab
                                  key={index}
                                  className={`border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1 w-full text-[14px] lg:text-[16px] cursor-pointer
                    ${index <= activeTabIndex && index !== activeTabIndex
                                      ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                                      : index == activeTabIndex
                                        ? "bg-[#976DD0] text-white"
                                        : "hover:bg-[#c1a8e1] hover:text-white"
                                    }`}
                                  onClick={() => {
                                    if (id || index < activeTabIndex)
                                      return setActiveTabIndex(index);
                                  }}
                                >
                                  {label}
                                </Tab>
                              );
                            })}
                          </TabList>
                        </div>
                      </div>
                    )}

                    {/* Tab List (on medium screens) */}
                    <TabList
                      className="hidden lg:flex-prop"
                      onSelect={handleTabChange}
                    >
                      {steps.map((label, index) => {
                        if (
                          index === 6 &&
                          (formData?.propertyType === "directory" ||
                            (step1?.propertyType &&
                              step1.propertyType === "directory"))
                        )
                          return (
                            <Tab
                              key={index}
                              className={`hidden border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1 w-full text-[14px] lg:text-[16px] cursor-pointer
                ${index <= activeTabIndex && index !== activeTabIndex
                                  ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                                  : index == activeTabIndex
                                    ? "bg-[#976DD0] text-white"
                                    : "hover:bg-[#c1a8e1] hover:text-white"
                                }`}
                              onClick={() => {
                                if (id || index < activeTabIndex)
                                  return setActiveTabIndex(index);
                              }}
                            >
                              {label}
                            </Tab>
                          );
                        return (
                          <Tab
                            key={index}
                            className={`border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1 w-full text-[14px] lg:text-[16px] cursor-pointer
              ${index <= activeTabIndex && index !== activeTabIndex
                                ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                                : index == activeTabIndex
                                  ? "bg-[#976DD0] text-white"
                                  : "hover:bg-[#c1a8e1] hover:text-white"
                              }`}
                            onClick={() => {
                              if (id || index < activeTabIndex)
                                return setActiveTabIndex(index);
                            }}
                          >
                            {label}
                          </Tab>
                        );
                      })}
                    </TabList>
                  </div>
                </div>
                <div
                  ref={scrollRef}
                  className="xl:col-span-9 col-span-full bg-[#f2ecf8]"
                >
                  <TabPanels className="h-full">
                    <TabPanel className="h-full">
                      <Step1
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step2
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step3
                        step1={step1}
                        formData={formData}
                        amenity={amenity}
                        setFormData={setFormData}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                        handleCheckboxChange={handleCheckboxChange}
                        setActiveTabIndex={setActiveTabIndex}
                        id={id}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step4
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                        amenity={amenity}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step5
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        amenitiesOptions={amenitiesOptions}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step6
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step7
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step8
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        addSteps={addSteps}
                        setaddSteps={setaddSteps}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step9
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step10
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step11
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step12
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step13
                        step1={step1}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                  </TabPanels>
                </div>
              </div>
            </TabGroup>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AddEdit;
