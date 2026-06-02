import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import shared from "./shared";
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
import Swal from "sweetalert2";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";


const View = () => {
  const step1 = JSON.parse(localStorage.getItem("step1"));
  const navigate = useNavigate();
  const location = useLocation();
  const locState = location.state;
  const [backTo, setbackTo] = useState();
  const [editMode, seteditMode] = useState(false);
  const { id, step } = useParams();
  const [data, setData] = useState([]);



  const [formData, setFormData] = useState({
    type: "",
    propertyType: "",
    address: "",
    city: "",
    zipcode: "",
    country: "",
    location: "",
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
    contact:false,
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
    "Price",
    "Contact",
    "Revenues",
    "Expenses",
    "Renovation Works",
    "External Ratings",
  ])
  const [addSteps, setaddSteps] = useState(false);
  const [dropdownOptions, setdropdownOptions] = useState([])

  useEffect(() => {
    if (step1) setFormData({ ...formData, ...step1 })
  }, [])
  useEffect(() => {
    setActiveTabIndex(activeTabIndex);
  }, [step]);

  useEffect(() => {
    const addMore = JSON.parse(localStorage.getItem('addMore'));
    setaddSteps(addMore);
    const step1 = JSON.parse(localStorage.getItem('step1'));
    const updatedSteps = addSteps
      ? [
        "Type of property",
        "Address",
        "Characteristics",
        "Energy performance",
        "Photos",
        "Description",
        step1?.propertyType === "offmarket"
          ? "Off-market Status"
          : "Price",
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
        step1?.propertyType === "offmarket"
          ? "Off-market Status"
          : "Price",
        "Contact",
      ];
    setSteps(updatedSteps);
  }, [addSteps])

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };
  const generateJsonArray = () => {
    const fields = [
      { value: "Bath Room", name: "bathroom", label: "bathrooms" },
      { value: "Bed Room", name: "bedrooms", label: "bedrooms" },
      { value: "Toilet", name: "toilets", label: "toilets" },
      { value: "Living Room", name: "livingRoom", label: "livingRoom" },
    ];
    let jsonArray = [];
    let id = 1;
    fields.forEach(field => {
      jsonArray.push({
        value: field.value,
        name: field.name,
        id: id++
      });
    });

    return jsonArray;
  };
  const jsonArray = generateJsonArray() || [];
  const getData = () => {
    ApiClient.get("amenity/listing").then((res) => {
      if (res.success) {
        setData(res.data.map((itm) => {
          return ({
            name: itm?.title,
            id: itm?.id || itm?._id,
            category: itm?.categoryId?.name,
            icon: itm?.image,
          })
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
      [field]: prevData[field] + 1,
    }));
  };
  const handleDecrement = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field] > 0 ? prevData[field] - 1 : 0,
    }));
  };
  useEffect(() => {
    getData()
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let data = res?.data?.propertyDetail;
          setFormData({
            ...data,
            id: data?.id || data?._id,
          });
          localStorage.setItem("step1", JSON.stringify({
            propertyType: data?.propertyType,
            type: data?.type,
          }));
          if (data?.add_more_step) {
            localStorage.setItem("addMore", true);
            setaddSteps(true);
          }
          if (data?.propertyType === "offmarket") {
            setSteps((prev) =>
              prev.map((step, index) =>
                index === 6 ? "Off-market Status" : step
              ));
          }
          if (data?.propertyType === "directory") {
            setSteps((prev) =>
              prev.map((step, index) =>
                index === 6 ? "Directory Status" : step
              ));
          }
        }
        loader(false);
      });
    }
  }, []);


  const getAdditionalOptions = () => {
    loader(true);
    ApiClient.get(shared.getRevenueApi).then((res) => {
      loader(false);
      if (res.success) {
        setdropdownOptions(res.data);
      }
    });
  }
  useEffect(() => {
    getAdditionalOptions()
  }, [])
  const scrollRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [activeTabIndex, pathname]);

  useEffect(() => {
    setbackTo(backTo || locState?.backTo)
    if (
      (formData?.add_more_step && formData?.revenue_detail?.length > 0) &&
      (backTo || locState?.backTo)
    ) {
      setActiveTabIndex(8)
    }
  }, [formData?.add_more_step])

  const [reason, setReason] = useState("");
  const acceptRequest = (itm) => {
    let dto = { ...itm, request_status: "accepted" }
    Swal.fire({
      title: "Property Verification",
      text: `Do you want to accept the request ?`,
      iconHtml: '<img src="/assets/img/svgs/lightbulb.svg" alt="verification-icon" style="width: 50px; height: 50px; padding:4px; " />',
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      customClass: {
        popup: 'custom-alert-popup',  // Custom class for the alert popup
        icon: 'custom-alert-icon'     // Custom class for the icon
      }
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.allApi(shared.editApi, dto, "put")
          .then((res) => {
            if (res.success) {
              // getData();
              navigate("/property-requests")
            }
            loader(false);
          });
      }
    });
  }
  const rejectRequest = (itm) => {
    let dto = {
      ...itm, request_status: "rejected",
      // reason
    }
    Swal.fire({
      title: "Reason for rejecting Property Verification Request",
      text: `Reason for Rejection`,
      iconHtml: '<img src="/assets/img/svgs/reject-request.png" alt="verification-icon" style="width: 60px; height: 60px;  " />',
      html: `  
      <textarea id="reason" class="swal2-textarea" placeholder="Reason for Rejection..." style="width:80%; height:100px;"></textarea>
    `,
      showCancelButton: true,
      confirmButtonColor: "#976DD0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",

      didOpen: () => {
        const textarea = Swal.getPopup().querySelector("#reason");
        textarea.addEventListener("input", (e) => setReason(e.target.value));
      },
      preConfirm: () => {
        const textarea = Swal.getPopup().querySelector("#reason");
        if (!textarea.value.trim()) {
          Swal.showValidationMessage("Please enter a reason.");
        }
        return textarea.value;
      },
      customClass: {
        popup: 'reject-alert-popup',  // Custom class for the alert popup
        icon: 'custom-alert-icon'     // Custom class for the icon
      }
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.allApi(shared.editApi, dto, "put")
          .then((res) => {
            if (res.success) {
              // getData();
              navigate("/property-requests")
            }
            loader(false);
          });
      }
    });
  }

  return (
    <>
      <Layout>
        <div className="">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center" >
              <Tooltip placement="top" title="Back">
                <Link
                  to={`/${backTo || shared.url}`}
                  className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3"
                >
                  <i className="fa fa-angle-left text-lg"></i>
                </Link>
              </Tooltip>
              <div>
                <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                  {shared.addTitle} Details
                </h3>
              </div>
            </div>
            {!editMode && !backTo && (
              <Link className="bg-primary leading-10 mr-3 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2"
                to={`/property/edit/${id}`}
              >
                Edit
              </Link>
            )}
            {(backTo || locState?.backTo) && (
              <>
                {formData?.request_status === "pending" ? (
                  <div className="flex bg-[#efefef]  p-1 rounded-[5px] items-center border border-[#d3d3d3]">
                    <div className="me-3 p-2">
                      <h3 className="text-[14px]">Property Verification Request</h3>
                    </div>
                    <div className="flex bg-[#976DD0] h-full rounded-[5px]" >
                      <Link className=" w-[36px] h-[36px] flex items-center justify-center border-r"
                        onClick={() => acceptRequest(formData)}
                      >
                        <IoMdCheckmarkCircle className="text-white  text-[24px]" />
                      </Link>
                      <Link className=" w-[36px] h-[36px] flex items-center justify-center"
                        onClick={() => rejectRequest(formData)}
                      >
                        <MdCancel className="text-white  text-[24px]" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className={`capitalize ${formData?.request_status}  `}>
                    {formData?.request_status}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="property-steps">
            <TabGroup selectedIndex={activeTabIndex}>
              <div className="grid grid-cols-12">
                <div className="xl:col-span-3 lg:col-span-4 col-span-full bg-[#f7f4fb] lg:p-6 p-4 py-6  sticky top-0 lg:overflow-auto lg:h-[680px] h-[100%] overflow-unset">
                  <h4 className="text-[#47525E] text-[18px] mb-4">
                    Listing steps
                  </h4>
                   <div>
                      <button>Filter</button>
                    </div> 
                  <TabList className="flex-prop" onSelect={handleTabChange}>
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
                          ${(index <= activeTabIndex && index !== activeTabIndex) ? 'bg-[#c1a8e1] text-white border-[#c1a8e1]' : index == activeTabIndex ? "bg-[#976DD0] text-white" : 'hover:bg-[#c1a8e1] hover:text-white'}`}
                          onClick={() => setActiveTabIndex(index)}
                          >
                            {label}
                          </Tab>
                        )
                      return (
                        <Tab
                          key={index}
                          className={`border border-[#976DD0] rounded-[50px] p-3 text-[#545757] text-center my-3 lg:mx-0 mx-1 w-full text-[14px] lg:text-[16px] cursor-pointer
                          ${(index <= activeTabIndex && index !== activeTabIndex) ? 'bg-[#c1a8e1] text-white border-[#c1a8e1]' : index == activeTabIndex ? "bg-[#976DD0] text-white" : 'hover:bg-[#c1a8e1] hover:text-white'}`}
                        onClick={() => setActiveTabIndex(index)}
                        >
                          {label}
                        </Tab>
                      )
                    })}
                  </TabList>

                 

      </div>
                <div ref={scrollRef} className="xl:col-span-9 lg:col-span-8 col-span-full bg-[#f2ecf8]  lg:overflow-auto lg:h-[680px] h-[100%] overflow-unset">
                  <TabPanels className="h-full">
                    <TabPanel className="h-full">
                      <Step1
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step2
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step3
                        formData={formData}
                        data={data}
                        setFormData={setFormData}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                        handleCheckboxChange={handleCheckboxChange}
                        setActiveTabIndex={setActiveTabIndex}
                        id={id}
                        dropdownOptions={dropdownOptions}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step4
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                        data={data}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step5
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        jsonArray={jsonArray}
                        id={id}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step6
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step7
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        id={id}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step8
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      // addSteps={addSteps}
                      // setaddSteps={setaddSteps}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step9
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step10
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step11
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
                      />
                    </TabPanel>
                    <TabPanel className="h-full">
                      <Step12
                        setActiveTabIndex={setActiveTabIndex}
                        formData={formData}
                        setFormData={setFormData}
                        dropdownOptions={dropdownOptions}
                        editMode={editMode}
                        page="detail"
                        backTo={backTo}
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

export default View;