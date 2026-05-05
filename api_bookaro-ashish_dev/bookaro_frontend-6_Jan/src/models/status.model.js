const list = [
  { id: "active", name: "Active" },
  { id: "deactive", name: "Inactive" },
];

const find = (key) => {
  let ext = list.find((itm) => itm.id == key);
  return ext;
};

const name = (key) => {
  let ext = list.find((itm) => itm.id == key);
  return ext ? ext.name : key;
};

const statusModel = { list, find, name };
export default statusModel;
