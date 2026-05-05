const normalizeApiUrl = (raw) => {
  const value = (raw || "").trim();
  if (!value || value === "undefined" || value === "null") {
    return "https://bookaro-api.onrender.com/";
  }
  return value.endsWith("/") ? value : `${value}/`;
};

const environment = {
  api: normalizeApiUrl(process.env.REACT_APP_API_URL),
  map_api_key: process.env.REACT_APP_MAP_API_KEY,
  stripe_public_key: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
};

export default environment;