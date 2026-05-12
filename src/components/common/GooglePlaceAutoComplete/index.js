import CityAutocomplete from "../CityAutocomplete";

const GooglePlaceAutoComplete = ({ placeholder, value, id, disabled = false, result, onChange, className = "" }) => {
  const handleChange = (text) => {
    if (typeof onChange === "function") onChange(text);
  };

  const handleSelect = (place) => {
    const valueFromPlace = place?.formatted || place?.city || place?.description || "";
    if (typeof onChange === "function") onChange(valueFromPlace);
    if (typeof result === "function") result({ value: valueFromPlace, place });
  };

  const inputClassName = `w-full rounded-[12px] border border-[#dfe4ec] bg-white px-4 py-3 text-sm text-[#47525e] outline-none focus:border-[#976DD0] focus:ring-1 focus:ring-[#976DD0] ${className}`.trim();

  return (
    <CityAutocomplete
      id={id}
      value={value}
      placeholder={placeholder}
      className={inputClassName}
      onChange={handleChange}
      onSelect={handleSelect}
      disabled={disabled}
    />
  );
};

export default GooglePlaceAutoComplete;
