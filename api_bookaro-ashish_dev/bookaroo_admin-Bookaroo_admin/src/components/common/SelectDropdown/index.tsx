import React from "react";
import HtmlT from "./html";

const SelectDropdown = ({
  intialValue,
  options,
  isSingle,
  valueType = "string",
  className = "",
  inputValue = "",
  onInputChange = (e: any) => {},
  result,
  displayValue = "name",
  id,
  placeholder = "Select Status",
  disabled = false,
  name,
  required = false,
  theme = "normal",
  isClearable = true,
  hideDefaultPosition,
  position,
}: any) => {
  const handleChange = (e: any) => {
    let v = e;
    if (valueType == "object") {
      v = options.find((itm: any) => itm.id == e);
    }
    result({ event: "value", value: v });
  };

  return (
    <>
      <HtmlT
        id={id}
        className={className}
        name={name}
        required={required}
        inputValue={inputValue}
        onInputChange={onInputChange}
        theme={theme}
        disabled={disabled}
        placeholder={placeholder}
        isSingle={isSingle}
        displayValue={displayValue}
        options={options}
        selectedValues={intialValue}
        handleChange={handleChange}
        hideDefaultPosition={hideDefaultPosition}
        isClearable={isClearable}
        position={position}
      />
    </>
  );
};

export default SelectDropdown;
