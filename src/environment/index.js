const environment = {
  // Fallback to local backend when REACT_APP_API_URL is not provided
  api: process.env.REACT_APP_API_URL || 'http://localhost:6089/',
  map_api_key: process.env.REACT_APP_MAP_API_KEY,
};
  
  export default environment;