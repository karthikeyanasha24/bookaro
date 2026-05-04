import GooglePlacesAutocomplete, {
  geocodeByAddress,
} from "react-google-places-autocomplete";
import environment from "../../../environment";

const inputClass =
  "mt-2 shadow-box bg-white w-full text-sm placeholder:text-gray-500 rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary disabled:!bg-gray-200";

const Html = ({
  searchText,
  search,
  placeholder,
  id,
  placeChange,
  disabled = false,
}) => {
  const apiKey = environment.map_api_key;

  if (!apiKey) {
    return (
      <input
        autoComplete="off"
        type="text"
        id={id != null ? `pac_input_${id}` : undefined}
        value={searchText || ""}
        placeholder={placeholder || ""}
        disabled={disabled}
        onChange={(e) => search(e.target.value)}
        onBlur={(e) =>
          placeChange({
            formatted_address: e.target.value,
            address_components: [],
          })
        }
        className={inputClass}
      />
    );
  }

  return (
    <>
      <GooglePlacesAutocomplete
        apiKey={apiKey}
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
    </>
  );
};

export default Html;
