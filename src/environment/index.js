// Version autonome : pas d'API backend
const environment = {
  api: '',
  map_api_key: process.env.REACT_APP_MAP_API_KEY,
  stripe_public_key: process.env.REACT_APP_STRIPE_PUBLIC_KEY
};

export default environment;