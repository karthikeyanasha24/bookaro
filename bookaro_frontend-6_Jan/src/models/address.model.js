import axios from "axios";
import environment from "../environment";

/** Supports both Google Maps LatLng (functions) and plain { lat, lng } objects */
const readLatLng = (place) => {
  if (!place?.geometry?.location) {
    return { lat: undefined, lng: undefined };
  }
  const loc = place.geometry.location;
  const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
  const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
  return { lat, lng };
};

const parseAddressFallback = (formattedAddress = "") => {
  const parts = String(formattedAddress)
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const country = parts.length ? parts[parts.length - 1] : "";
  const regionPart = parts.length > 1 ? parts[parts.length - 2] : "";
  const zipMatch = regionPart.match(/\b\d{4,6}\b/);
  const zipcode = zipMatch ? zipMatch[0] : "";
  const city = regionPart
    .replace(/\b\d{4,6}\b/g, "")
    .trim();

  // In free-text fallback, state is often unavailable; keep city as best-effort state.
  const state = city || regionPart || "";

  return {
    country,
    state,
    city,
    zipcode,
    locality: city,
  };
};

const getAddress = (address) => {
    const { lat, lng } = readLatLng(address);
    if (lat == null || lng == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) {
      const fallback = parseAddressFallback(address?.formatted_address);
      return {
        lat: undefined,
        lng: undefined,
        address: address?.formatted_address || "",
        country: fallback.country,
        state: fallback.state,
        city: fallback.city,
        zipcode: fallback.zipcode,
        locality: fallback.locality,
      };
    }

    let aArray = address.address_components || [];
      const getCountry = ()=>{
        let value = '';
        aArray.map((item)=>{
          if(item.types[0] == "country"){
            value = item.long_name
          }
        })
            return value;
          }

      const getCity = ()=>{
        let value = '';
        aArray.map((item)=>{
          if(item.types[0] == "locality"||item.types[0] == "administrative_area_level_3"){
            value = item.long_name
          }
        })
            return value;
          }

    const getLocality = ()=>{
        let value = '';
        aArray.map((item)=>{
          if(item.types[0] == "sublocality_level_2"){
            value = item.long_name
          }
        })
            return value?value:getSubLocality();
          }

      const getSubLocality=()=>{
        let value = '';
        aArray.map((item)=>{
          if(item.types[0] == "locality"){
            value = item.long_name
          }
        })
            return value;
      }

      const getState = ()=>{
        let value = '';
        aArray.map((item)=>{
          if(item.types[0] == "administrative_area_level_1"){
            value = item.long_name
          }
        })
            return value;
          }

      const getPostalCode = () => {
              let value = '';
              aArray.map((item) => {
                  if (item.types[0] == "postal_code") {
                      value = item.long_name
                  }
              })
              return value;
          }
    let aaddress = {lat,lng, address:address.formatted_address, country:getCountry(), state:getState(), city:getCity(), zipcode:getPostalCode(), locality:getLocality()}

    return aaddress
  }

  /**
   * Free geocoding when Google Places / Maps key is missing or place has no geometry.
   * Uses OpenStreetMap Nominatim (respect their usage policy; dev-friendly fallback).
   */
  const geocodeNominatim = async (query) => {
    const q = String(query || "").trim();
    if (q.length < 4) return null;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q
      )}&limit=1&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
        },
      });
      if (!res.ok) return null;
      const arr = await res.json();
      if (!Array.isArray(arr) || !arr[0]) return null;
      const hit = arr[0];
      const a = hit.address || {};
      const city =
        a.city ||
        a.town ||
        a.village ||
        a.municipality ||
        a.hamlet ||
        a.suburb ||
        "";
      const state = a.state || a.region || a.county || "";
      const zipcode = a.postcode || "";
      const country = a.country || "";
      const lat = parseFloat(hit.lat);
      const lng = parseFloat(hit.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return {
        lat,
        lng,
        address: hit.display_name || q,
        city,
        state,
        zipcode,
        country,
      };
    } catch (err) {
      console.error("geocodeNominatim", err);
      return null;
    }
  };

  const gettimeZone= async(place)=>{
   const { lat, lng } = readLatLng(place);
   if (lat == null || lng == null) {
     return null;
   }
   return await axios.get(`${environment.api}api/timezone`,{params:{
      lat,
      lng,
      key:environment.map_api_key,
      // timestamp:'1331161200',

  }}).then(res=>{
      return res.data
  }).catch(err=>{
      console.error("gettimeZone err",err)
  })
  }

  const addressModel={getAddress,gettimeZone,geocodeNominatim}
  export default addressModel