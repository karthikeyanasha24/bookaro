import { Dialog, Tab, TabGroup, TabList, TabPanel, TabPanels, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useLocation, useParams } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import shared, { categorizeData } from "./shared";
import Step0 from "./Steps/step0";
import Step1 from "./Steps/step1";
import Step10 from "./Steps/step10";
import Step11 from "./Steps/step11";
import Step12 from "./Steps/step12";
import Step2 from "./Steps/step2";
import Step3 from "./Steps/step3";
import Step4 from "./Steps/step4";
import Step5 from "./Steps/step5";
import Step6 from "./Steps/step6";
import Step7 from "./Steps/step7";
import Step8 from "./Steps/step8";
import Step9 from "./Steps/step9";
import Step14 from "./Steps/step14";
import { capLetter } from "../../models/string.model";
import Step13 from "./Steps/step13";

const Edit = () => {
  const step1 = JSON.parse(localStorage.getItem("step1"));
  const { id, step } = useParams();
  const [amenity, setAmenity] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    propertyType: "",
    // usedAs: "",
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
    linkedSchools: [],
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
    username: "",
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
    "Status & Price",
    "Off-Market",
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
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (step1) setFormData({ ...formData, ...step1 })
  }, [])

  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }
  useEffect(() => {
    const addMore = JSON.parse(localStorage.getItem("addMore"));
    setaddSteps(addMore);
    const updatedSteps = addSteps
      ? [
        "Status & Price",
        "Off-Market",
        "Type of property",
        "Address",
        "Characteristics",
        "Energy performance",
        "Photos",
        "Description",
        "School",
        step1?.propertyType === "offmarket" || step1?.propertyType === "directory"
          ? "Off-market Status"
          : "Price",
        "Contact",
        "Revenues",
        "Expenses",
        "Renovation Works",
        "External Ratings",
      ]
      : [
        "Status & Price",
        "Off-Market",
        "Type of property",
        "Address",
        "Characteristics",
        "Energy performance",
        "Photos",
        "Description",
        "School",
        step1?.propertyType === "offmarket" || step1?.propertyType === "directory"
          ? "Off-market Status"
          : "Price",
        "Contact",
      ];
    setSteps(updatedSteps);
  }, [addSteps]);
  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  useEffect(() => {
    setActiveTabIndex(activeTabIndex);
  }, [step]);

  const categorizedData = categorizeData(amenity);
  const cookingOptions = categorizedData["Cooking".toLowerCase()] || []
  const outsideOptions = categorizedData["Outside".toLowerCase()] || []
  const ancilliaryAreas = categorizedData["ancilliary areas".toLowerCase()] || []
  const leisure = categorizedData["Leisure".toLowerCase()] || []

  const amenityData = {
    rooms: formData.rooms,
    bathroom: formData.bathroom,
    bedrooms: formData.bedrooms,
    livingRoom: formData.livingRoom,
    toilets: formData.toilets,
  }
  const generateAmenityArray = () => {
    const fields = [
      { value: "Room", name: "rooms", label: "rooms" },
      { value: "Bath Room", name: "bathroom", label: "bathrooms" },
      { value: "Bed Room", name: "bedrooms", label: "bedrooms" },
      { value: "Toilet", name: "toilets", label: "toilets" },
      { value: "Living Room", name: "livingRoom", label: "livingRoom" },
      // { value: "Floor", name: "floor", label: "floor" },
      // { value: "Property Floor", name: "propertyFloor", label: "propertyFloor", },
    ];
    let jsonArray = [];
    // let id = 1;

    fields.forEach((field) => {
      for (let i = 1; i <= amenityData[field.name]; i++) {
        jsonArray.push({
          value: `${field.value} ${i}`,
          name: `${capLetter(field.label)} ${i}`,
          // id: id++
        });
      }
    });
    // Add checked cooking options to the jsonArray
    cookingOptions.forEach((option) => {
      if (formData.cooking.includes(option.id || option._id)) {
        jsonArray.push({
          value: `${option.name}`,
          name: `${capLetter(option.name)}`,
        });
      }
    });
    // Add checked outside options to the jsonArray
    outsideOptions.forEach((option) => {
      if (formData.outside.includes(option.id || option._id)) {
        jsonArray.push({
          value: `${option.name}`,
          name: `${capLetter(option.name)}`,
        });
      }
    });
    // Add checked ancilliaryAreas options to the jsonArray
    ancilliaryAreas.forEach((option) => {
      if (formData.ancilliary.includes(option.id || option._id)) {
        jsonArray.push({
          value: `${option.name}`,
          name: `${capLetter(option.name)}`,
        });
      }
    });
    // Add checked leisure options to the jsonArray
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
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let data = res?.data?.propertyDetail;
          const filterSchool1data = data?.linkedSchools?.find((item) => item?.type == "highschool")
          const filterSchool2data = data?.linkedSchools?.find((item) => item?.type == "college")
          const filterSchool3data = data?.linkedSchools?.find((item) => item?.type == "elementaryPrimary")
          const filterSchool4data = data?.linkedSchools?.find((item) => item?.type == "elementarySchool")
          const newCooking = data?.cooking?.length>0? data?.cooking?.map((item) => { return item?.id }):[]
          const newExpenses = data?.Expenses?.length>0? data?.Expenses?.map((item) => { return item?.id }):[]
          const newancilliary = data?.ancilliary?.length>0? data?.ancilliary?.map((item) => { return item?.id }):[]
          const newenvironment = data?.environment?.length>0? data?.environment?.map((item) => { return item?.id }):[]
          const newserviceAccessibility = data?.serviceAccessibility?.length>0? data?.serviceAccessibility?.map((item) => { return item?.id }):[]
          const newleisure = data?.leisure?.length>0? data?.leisure?.map((item) => { return item?.id }):[]
          const newequipment = data?.equipment?.length>0? data?.equipment?.map((item) => { return item?.id }):[]
          setFormData({
            ...data,
            id: data?.id || data?._id,
            cooking: newCooking,
            Expenses: newExpenses,
            ancilliary: newancilliary,
            environment: newenvironment,
            leisure: newleisure,
            equipment: newequipment,
            propertyState: data?.propertyState?.id || data?.propertyState?._id,
            serviceAccessibility: newserviceAccessibility,
            school1: { schoolId: { value: filterSchool1data?.schoolId, label: filterSchool1data?.EstablishmentName } },
            school2: { schoolId: { value: filterSchool2data?.schoolId, label: filterSchool2data?.EstablishmentName } },
            school3: { schoolId: { value: filterSchool3data?.schoolId, label: filterSchool3data?.EstablishmentName } },
            school4: { schoolId: { value: filterSchool4data?.schoolId, label: filterSchool4data?.EstablishmentName } },
          })
          localStorage.setItem("step1", JSON.stringify({
            ...data,
            id: data?.id || data?._id,
            cooking: newCooking,
            Expenses: newExpenses,
            ancilliary: newancilliary,
            environment: newenvironment,
            leisure: newleisure,
            equipment: newequipment,
            serviceAccessibility: newserviceAccessibility,
            propertyState: data?.propertyState?.id || data?.propertyState?._id,
            school1: { schoolId: { value: filterSchool1data?.schoolId, label: filterSchool1data?.EstablishmentName } },
            school2: { schoolId: { value: filterSchool2data?.schoolId, label: filterSchool2data?.EstablishmentName } },
            school3: { schoolId: { value: filterSchool3data?.schoolId, label: filterSchool3data?.EstablishmentName } },
            school4: { schoolId: { value: filterSchool4data?.schoolId, label: filterSchool4data?.EstablishmentName } },
          })
          );
          localStorage.setItem("addMore", true);
          setaddSteps(true);
        }
        loader(false);
      });
    }
  }, [id])

  const getAdditionalOptions = () => {
    loader(true);
    ApiClient.get(shared.getRevenueApi, { status: "active" }).then((res) => {
      loader(false);
      if (res.success) {
        setdropdownOptions(res.data);
      }
    });
  };

  useEffect(() => {
    getAmenities();
    getAdditionalOptions();
    const step1 = JSON.parse(localStorage.getItem("step1"));
    if (step1?.proposal) {
      setFormData({ ...formData, proposal: step1?.proposal });
    }
  }, []);

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
      <PageLayout>
        <div className="">
          <div className="property-steps  border-t">
            <TabGroup selectedIndex={activeTabIndex}>
              <div className="grid grid-cols-12">
                <div className="xl:col-span-3 md:col-span-4 col-span-full bg-[#f7f4fb] 2xl:p-20 2xl:py-10 lg:p-16 p-4 lg:py-10 sticky md:top-0 top-[60px] md:overflow-auto md:h-[600px] h-[100%] overflow-unset md:z-[0] z-[9]">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={openModal}
                      className="rounded-md bg-[#976DD0] px-4 py-2 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 md:hidden block"
                    >
                      Filter
                    </button>
                  </div>

                  <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={closeModal}
                    >

                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-black/25" />
                      </Transition.Child>

                      <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-start h-full text-center">
                          <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                          >
                            <Dialog.Panel className="w-[300px] transform overflow-hidden rounded-tr-2xl rounded-br-2xl bg-white p-6 text-left align-middle shadow-xl transition-all h-screen">

                              <div className="">
                                <div className="">
                                  <button
                                    type="button"
                                    className="ml-auto block"
                                    onClick={closeModal}
                                  >
                                    <RxCross2 />
                                  </button>
                                  <h4 className="text-[#47525E] text-[18px] mb-4 mt-4">
                                    Listing steps
                                  </h4>
                                </div>
                                <TabList
                                  className="flex-prop"
                                  onSelect={handleTabChange}
                                >
                                  {steps.map((label, index) => {
                                    if (
                                      index === 6 &&
                                      (formData?.type === "directory" ||
                                        (step1?.type &&
                                          step1.type.toLowerCase() ===
                                          "directory"))
                                    )
                                      return (
                                        <Tab
                                          key={index}
                                          className={`hidden border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1 w-full  text-[14px] lg:text-[16px] cursor-pointer
                            ${index <= activeTabIndex && index != activeTabIndex
                                              ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                                              : index == activeTabIndex
                                                ? "bg-[#976DD0] text-white"
                                                : "hover:bg-[#c1a8e1] hover:text-white"
                                            }`}
                                        // onClick={() => setActiveTabIndex(index)}
                                        >
                                          {label}
                                        </Tab>
                                      );
                                    return (
                                      <Tab
                                        key={index}
                                        className={`border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1  w-full  text-[14px] lg:text-[16px] cursor-pointer
                          ${index <= activeTabIndex && index != activeTabIndex
                                            ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                                            : index == activeTabIndex
                                              ? "bg-[#976DD0] text-white"
                                              : "hover:bg-[#c1a8e1] hover:text-white"
                                          }`}
                                        // onClick={() => setActiveTabIndex(index)}
                                        onClick={() =>
                                          console.log("index=- ", index)
                                        }
                                      >
                                        {label}
                                      </Tab>
                                    );
                                  })}
                                </TabList>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition>
                  <TabList
                    className="flex-prop md:flex hidden md:flex-col"
                    onSelect={handleTabChange}
                  >
                    {/* <h4 className="text-[#47525E] text-[18px] mb-4 mt-4">
                      Listing steps
                    </h4> */}
                    {steps.map((label, index) => {
                      return (
                        <Tab
                          key={index}
                          className={`${(index === 9 || index === 1) ? "hidden" : ""} border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center mb-6 lg:mx-0 mx-1 md:w-full w-[160px] text-[14px] lg:text-[16px] cursor-pointer
                          ${index <= activeTabIndex && index != activeTabIndex
                              ? "bg-[#c1a8e1] text-white border-[#c1a8e1]"
                              : index == activeTabIndex
                                ? "bg-[#976DD0] text-white"
                                : "hover:bg-[#c1a8e1] hover:text-white"
                            }`}
                          onClick={() => setActiveTabIndex(index)}
                        >
                          {label}
                        </Tab>
                      );
                    })}
                  </TabList>
                </div>
                <div
                  ref={scrollRef}
                  className="xl:col-span-9 md:col-span-8 col-span-full bg-[#f2ecf8]   "
                >

                  <TabPanels className="h-full">
                    <TabPanel className="h-full">
                      <Step0
                        step1={step1}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                      />
                    </TabPanel>
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
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step3
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step4
                        step1={step1}
                        formData={formData}
                        amenity={amenity}
                        setFormData={setFormData}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                        handleCheckboxChange={handleCheckboxChange}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        id={id}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step5
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                        amenity={amenity}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step6
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        amenitiesOptions={amenitiesOptions}
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
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step9
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step10
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
                      <Step11
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step12
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step13
                        step1={step1}
                        activeTabIndex={activeTabIndex}
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                      />

                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step14
                        step1={step1}
                        activeTabIndex={activeTabIndex}
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
      </PageLayout>
    </>
  );
};

export default Edit;
