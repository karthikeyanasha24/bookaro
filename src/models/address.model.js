import axios from "axios";
import environment from "../environment";

const getAddress=(address)=>{
    let lat = address.geometry.location.lat()
      let lng = address.geometry.location.lng()
      let aArray = address.address_components;
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

  const gettimeZone= async(place)=>{
   return await axios.get(`${environment.api}api/timezone`,{params:{
      // location:`${place.geometry.location.lat()},${place.geometry.location.lng()}`,
      lat:place.geometry.location.lat(),
      lng:place.geometry.location.lng(),
      key:environment.map_api_key,
      // timestamp:'1331161200',

  }}).then(res=>{
      return res.data
  }).catch(err=>{
      console.error("gettimeZone err",err)
  })
  }

  const addressModel={getAddress,gettimeZone}
  export default addressModel