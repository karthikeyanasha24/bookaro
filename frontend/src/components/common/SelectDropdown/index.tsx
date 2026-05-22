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
  additionalClass,
  noDefault=false,
  buttonClass='capitalize flex w-full  justify-between border border-[#929292] gap-x-1.5 rounded-[4px] bg-white px-3 py-2.5 text-sm font-normal text-gray-900',
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
        noDefault={noDefault}
        buttonClass={buttonClass}
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
        additionalClass={additionalClass}
      />
    </>
  );
};

export default SelectDropdown;
