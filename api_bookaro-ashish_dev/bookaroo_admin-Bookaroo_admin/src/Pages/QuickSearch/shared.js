
const shared = {
  check: "properties",
  title: "Quick Search",
  addTitle: "Quick Search",
  url: "property-quick-search",
  addApi: "quicksearch/add",
  editApi: "quicksearch/edit",
  listApi: "quicksearch/list",
  deleteApi: "quicksearch/delete",
  detailApi: "quicksearch/details",
  // statusApi: "quick-search/edit",
};

export default shared;

export const goalOptions = [
  { name: "For sale", id: "sale", },
  { name: "For rent", id: "rent", },
  // { name: "Off-Market", id: "offmarket", },
  { name: "List in Directory", id: "directory", },
  { name: "Past Transaction", id: "transaction", },
]
export const propTypeOptions = [
  { name: "Apartment", id: "apartment", },
  { name: "House", id: "house", },
  { name: "Castle", id: "castle", },
  { name: "Building", id: "building", },
  { name: "Farm", id: "farm", },
]