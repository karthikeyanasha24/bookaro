import React, { useState } from "react";
import environment from "../../../environment";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
} from "react-google-places-autocomplete";

const Html = ({ searchText, search, placeholder, id, value, placeChange,disabled=false }) => {
  const [options, setOptions] = useState([]);
  return (
    <>
      <GooglePlacesAutocomplete
        apiKey={environment.map_api_key}
        selectProps={{
          isDisabled: disabled,
          placeholder: searchText ? searchText : placeholder,
          onChange: (e) => {
            geocodeByAddress(e.label)
              .then((results) => {
                if (results.length) {
                  placeChange(results[0]);
                }
              })
              .catch((err) => {
                let arr = e.value.terms.map((itm, i) => {
                  return {
                    long_name: itm.value,
                    types: [e.value.types[i]],
                  };
                });
                placeChange({ formatted_address: e.label, address_components: arr });
                console.error("error2", arr);
              });
          },
          isClearable: false,
          styles: {
            menu: (provided) => ({
              ...provided,
              // You can customize the menu styles here
            }),
            control: (provided) => ({
              ...provided,
              // Hide the dropdown arrow
              background: 'white',
              border: '1px solid #ccc',
              boxShadow: 'none',
              '&:hover': {
                border: '1px solid #aaa',
              },
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              display: 'none',
            }),
          },
        }}
      />

      {/* <input compoment="GooglePlaceAutoComplete" autoComplete="off" type="text" id={'pac_input_' + id} value={searchText||''} placeholder={placeholder || ''} onChange={e => search(e.target.value)} className=" mt-2 shadow-box bg-white w-full text-sm placeholder:text-gray-500 rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary disabled:!bg-gray-200" /> */}
    </>
  );
};

export default Html;
