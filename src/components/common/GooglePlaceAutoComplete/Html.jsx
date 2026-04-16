import React from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
} from "react-google-places-autocomplete";
import environment from "../../../environment";

class PlacesErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const Html = ({ searchText, search, placeholder, id, value, placeChange, disabled = false }) => {
  const fallbackInput = (
    <input
      component="GooglePlaceAutoCompleteFallback"
      autoComplete="off"
      type="text"
      id={"pac_input_" + id}
      value={searchText || value || ""}
      placeholder={searchText || placeholder || ""}
      onChange={(e) => {
        if (typeof search === "function") search(e.target.value);
      }}
      disabled={disabled}
      className="mt-2 shadow-box bg-white w-full text-sm placeholder:text-gray-500 rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary disabled:!bg-gray-200"
    />
  );

  const hasMapKey =
    Boolean(environment.map_api_key) &&
    environment.map_api_key !== "YOUR_GOOGLE_MAPS_API_KEY";

  return (
    <>
      {hasMapKey ? (
        <PlacesErrorBoundary fallback={fallbackInput}>
          <GooglePlacesAutocomplete
            apiKey={environment.map_api_key}
            selectProps={{
              placeholder: searchText || placeholder,
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
              isDisabled: disabled,
              styles: {
                menu: (provided) => ({
                  ...provided,
                }),
                control: (provided) => ({
                  ...provided,
                  background: "white",
                  border: "1px solid #ccc",
                  boxShadow: "none",
                  "&:hover": {
                    border: "1px solid #aaa",
                  },
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  display: "none",
                }),
              },
            }}
          />
        </PlacesErrorBoundary>
      ) : (
        fallbackInput
      )}
    </>
  );
};

export default Html;
