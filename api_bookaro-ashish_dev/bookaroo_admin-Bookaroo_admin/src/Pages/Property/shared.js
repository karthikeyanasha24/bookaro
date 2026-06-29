import { toast } from "react-toastify";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { removeLocal } from "../../models/string.models";

const shared = {
  check: "properties",
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
};
export const cookingOptions = [
  { id: 1, label: 'Furnished kitchen' },
  { id: 2, label: 'American Kitchen' },
  { id: 3, label: 'Separated Kitchen' },
  { id: 4, label: 'External Kitchen' },
];
export const equipmentOptions = [
  { id: 1, label: 'Equipment' },
  { id: 2, label: 'Double-glazed' },
  { id: 3, label: 'Chimney' },
  { id: 4, label: 'Electric vehicle charging station' },
  { id: 5, label: 'Fiber deployed' },
];
export const outsideOptions = [
  { id: 1, label: 'Garden' },
  { id: 2, label: 'Terrace' },
  { id: 3, label: 'Balcony' },
];
export const servicesAndAccessibility = [
  { id: 1, label: 'Door keeper' },
  { id: 2, label: 'Digicode' },
  { id: 3, label: 'Visiophone' },
  { id: 4, label: 'Alarm' },
  { id: 5, label: 'Handicapped acces' },
  { id: 6, label: 'Elevator' },
];
export const ancilliaryAreas = [
  { id: 1, label: 'Parking' },
  { id: 2, label: 'Attic' },
  { id: 3, label: 'Basement' },
  { id: 4, label: 'Garage' },
];
export const environment = [
  { id: 1, label: 'Nice view' },
  { id: 2, label: 'Quiet' },
  { id: 3, label: 'No facing' },
  { id: 4, label: 'south exposure' },
];
export const leisure = [
  { id: 1, label: 'Pool' },
  { id: 2, label: 'Tennis' },
  { id: 3, label: 'Basket' },
];
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
  { label: "For sale", name: "sale", icon: "/assets/img/icons/img_5.png" },
  { label: "For rent", name: "rent", icon: "/assets/img/icons/img_4.png" },
  // { label: "Off-Market", name: "offmarket", icon: "/assets/img/icons/img_3.png" },
  { label: "List in Directory", name: "directory", icon: "/assets/img/directory.png" },
];
export const propertyTypes = [
  { name: "Apartment", icon: "/assets/img/icons/apartment.png" },
  { name: "House", icon: "/assets/img/icons/home.png" },
  { name: "Castle", icon: "/assets/img/icons/castle.png" },
  { name: "Building", icon: "/assets/img/icons/building.png" },
  { name: "Farm", icon: "/assets/img/icons/farm.png" },
];
export const removePropData = () => {
  removeLocal('step1');
  removeLocal('addMore');
  removeLocal('companyDetail');
}
export const saveChanges = (dto, func) => {
  let url = shared.editApi, method = "put";
  loader(true);
  ApiClient.allApi(url, dto, method).then((res) => {
    if (res.success) {
      toast.success(res.message)
    }
    loader(false);
  });
};
export const categorizeData = (amenities) => {
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
