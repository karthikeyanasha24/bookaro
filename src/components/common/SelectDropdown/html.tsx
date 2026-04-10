import React, { Fragment, useMemo, useState } from "react";
import methodModel from "../../../methods/methods";
import "./style.scss";
import Select from "react-select";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Html = ({
  options,
  dynamicStyle = false,
  className = "",
  inputValue = "",
  selectedValues,
  onInputChange = (e: any) => { },
  handleChange = () => { },
  displayValue,
  id = "",
  placeholder,
  required = false,
  disabled,
  name = "",
  noDefault,
  hideDefaultPosition = false,
  theme = "normal",
  isClearable,
  additionalClass,
  buttonClass=''
}: any) => {
  const categoryVal = () => {
    let ext = options && options.find((item: any) => item.id == selectedValues);
    return ext ? { value: ext.id, label: ext[displayValue] } : "";
  };

const [isOpen,setIsOpen]=useState(false)

  const menus=useMemo(()=>{
    return <div className={`dropdown addDropdown ${className} relative list_box_active_state`}>
    <div className="">
      <button
        disabled={disabled}
        id={"dropdownMenuButton" + id}
        className={`${buttonClass}`}
        type="button"
        onClick={()=>setIsOpen(!isOpen)}
      >
        {selectedValues
          ? methodModel.find(options, selectedValues, "id")?.[
          displayValue
          ] || placeholder
          : placeholder}
        {/* <ChevronDownIcon
          className="-mr-1 h-5 w-5 text-gray-400"
          aria-hidden="true"
        /> */}
      </button>
    </div>

    {isOpen?<>
      <div
        className={`${additionalClass} ${dynamicStyle ? "" : "max-h-40 mb-5"
          }  focus:!outline-[#976DD0] focus:!outline text-sm absolute z-40 w-full border ${className ? className : " min-w-[260px]"
          }  right-0 shadow-lg !py-2 !mt-1.5 overflow-auto bg-white  rounded-lg scrollbar capitalize top-[100%] justify-start`}
      >
        <div className="mt-2">
          {hideDefaultPosition ? null :
            <>
              {noDefault ? (
                <></>
              ) : (
                <span
                className={
                  selectedValues == ""
                    ? "text-gray-700 block px-4 py-2 text-sm active cursor-pointer"
                    : "text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                }
                onClick={() =>{ handleChange("");setIsOpen(false)}}
              >
                {placeholder}
              </span>
              )}
            </>}
          {options &&
            options.map((itm: any, index: number) => {
              return (
                <span
                      className={
                        selectedValues == itm.id
                          ? "text-gray-700 block px-4 py-2 text-sm active cursor-pointer"
                          : "text-gray-700 block px-4 py-2 text-sm cursor-pointer"
                      }
                      onClick={() =>{ handleChange(itm.id);setIsOpen(false)}}
                      key={itm.id}
                    >
                      {itm[displayValue]}
                    </span>
              );
            })}
        </div>
      </div>
    </>:<></>}

    
  </div>
  },[selectedValues,options,isOpen])

  return (
    <>
      {theme == "search" ? (
        <>
          <div className={`${className || "capitalize"} ${additionalClass}`}>
            <Select
              options={
                options?.map((itm: any) => {
                  return { value: itm.id, label: itm[displayValue] };
                }) || []
              }
              placeholder={placeholder}
              value={categoryVal()}
              isClearable={isClearable}
              name={name}
              // formatOptionLabel="bordere"
              // inputValue={inputValue}
              onInputChange={onInputChange}
              onChange={(e: any) => handleChange(e?.value || "")}
              className="text-gray-700 block text-sm options_classs"
              isDisabled={disabled ? true : false}
              required={required}
            />
          </div>
        </>
      ) : (
        <>
         <input
              type="hidden"
              name={name}
              required={required}
              value={selectedValues}
            />
             {menus}
        </>
      )}
    </>
  );
};

export default Html;
