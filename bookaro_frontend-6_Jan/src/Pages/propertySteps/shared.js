import { toast } from "react-toastify";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";

const shared = {
  title: "Properties",
  addTitle: "Property",
  url: "property",
  addApi: "property/add",
  editApi: "property/editProperty",
  detailApi: "property/detail",
  listApi: "property/listing",
  statusApi: "property/statusChange",
  deleteApi: "property/deleteProperty",
  getRevenueApi: "revenue/listing",
  addRevenueApi: "revenue/add",
  addTimeline: "timeline/add",
};
// export const investmentPurposes = [
//   { id: 1, label: 'Viager' },
//   { id: 2, label: 'DigiLoi De Normandiecode' },
//   { id: 3, label: 'Bare ownership' },
//   { id: 4, label: 'Loi Pinel' },
//   { id: 5, label: 'Managed residence' },
//   { id: 6, label: 'Student residence' },
// ]
export const situation = [
  { id: 1, label: 'Duplex' },
  { id: 2, label: 'Souplex' },
  { id: 3, label: 'single-storey' },
  { id: 4, label: 'Ground floor' },
]
export const diagnosisType = [
  { id: 1, label: 'Yes, I know the results' },
  { id: 2, label: 'No, I will add them later' },
  { id: 3, label: 'Diagnosis does not apply to my property' },
]
export const dateOfDiagnosis = [
  { id: 1, label: 'Before July 1, 2021' },
  { id: 2, label: 'Between July 1, 2021 and December 31, 2022' },
  { id: 3, label: 'From January 1, 2023' },
]
export const userLeadOption = [
  { name: "Any", value: "Any" },
  { name: "Financial background analyzed", value: "Financial background analyzed" },
]
export const rateLeadOption = [
  { name: "Any", value: "Any" },
  { name: "A", value: "A" },
  { name: "B", value: "B" },
  { name: "C", value: "C" },
  { name: "D", value: "D" },
  { name: "E", value: "E" },
]
export const proposalData = [
  { name: "Open for purchase proposals", value: "purchase" },
  { name: "Open for rental proposals", value: "rental" },
  { name: "Both", value: "both" },
]
export const goalTypes = [
  { label: "For sale", name: "sale", icon: "/assets/img/img_5.png" },
  { label: "For rent", name: "rent", icon: "/assets/img/cash.png" },
  // { label: "Off-Market", name: "offmarket", icon: "/assets/img/img_3.png" },
  { label: "List in Directory", name: "directory", icon: "/assets/img/directory.png" },
];
export const propertyTypes = [
  { name: "Apartment", icon: "/assets/icons/apartment.png" },
  { name: "House", icon: "/assets/icons/home.png" },
  { name: "Castle", icon: "/assets/icons/castle.png" },
  { name: "Building", icon: "/assets/icons/building.png" },
  { name: "Farm", icon: "/assets/icons/farm.png" },
];
export const sellTypes = [
  { name: "A real estate pro", value: "real-estate-pro", icon: "/assets/icons/apartment.png", },
  { name: "Own my own", value: "own", icon: "/assets/icons/apartment.png" },
];

export const saveChanges = (dto) => {
  let url = shared.editApi, method = "put";
  loader(true);
  // return console.log("dto", dto)
  ApiClient.allApi(url, dto, method).then((res) => {
    if (res.success) {
      toast.success(res.message)
    }
    loader(false);
  });
};

export const addToTimeline = (timeline, setTimeline, id, step1) => {
  let url = shared.addTimeline, method = "post";
  loader(true);
  ApiClient.allApi(url, timeline, method).then((res) => {
    if (res.success) {
      setTimeline({ propertyId: id })
      // toast.success(res.message);
      saveChanges(step1)
    }
    loader(false);
  });
};
const currentYear = new Date().getFullYear();
export const generateYears = (from, to) => {
  const years = [];
  for (let year = from || +currentYear; year >= +to; year--) {
    years.push({ id: `${year}`, name: `${year}` });
  }
  return years;
};

export const categorizeData = (amenities) => {
  if (!Array.isArray(amenities)) {
    console.error("The amenities variable is not an array.");
    return {}; // Return empty object if not an array
  }
  return amenities.reduce((acc, amenity) => {
    const category = amenity.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {});
};


export default shared;
