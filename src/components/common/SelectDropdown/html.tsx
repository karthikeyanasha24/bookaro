import React, { Fragment } from "react";
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
  position,

}: any) => {
  const categoryVal = () => {
    let ext = options?.find((item: any) => item.id === selectedValues);
    return ext ? { value: ext.id, label: ext[displayValue] } : "";
  };

  return (
    <>
      {theme == "search" ? (
        <>
          <div className={`${className || "capitalize"}`}>
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
              // inputValue={selectedValues}
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
          <div className="selectDropdown">
            <input
              type="hidden"
              name={name}
              required={required}
              value={selectedValues}
            />
            <div className="dropdown addDropdown">
              <Menu as="div" className="relative list_box_active_state ml-auto">
                <div>
                  <Menu.Button
                    disabled={disabled}
                    id={"dropdownMenuButton" + id}
                    className={`capitalize inline-flex w-full border  justify-start gap-x-1.5 rounded-[7px] bg-white px-3 py-2.5 text-sm font-normal text-[#5A5A5A]  ${className}`}
                  >
                    {selectedValues
                      ? methodModel.find(options, selectedValues, "id")?.[
                      displayValue
                      ] || placeholder
                      : placeholder}
                    <ChevronDownIcon
                      className="-mr-1 h-5 w-5 text-gray-400 ml-auto"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className={`${dynamicStyle ? "" : "max-h-60"
                      }  focus:!outline-[#976DD0] focus:!outline text-sm absolute z-40 w-full ${className ? className : " min-w-[260px]"
                      }  right-0 ${position} shadow-lg !py-2 !mt-1.5 overflow-auto bg-white  rounded-lg scrollbar capitalize`}
                  >
                    <div className="mt-2">
                      {hideDefaultPosition ? null :
                        <>
                          {noDefault ? (
                            <Menu.Item disabled={disabled}>
                              {({ active }) => (
                                <a
                                  className={
                                    selectedValues == ""
                                      ? "text-gray-700 block px-4 py-2 text-sm active"
                                      : "text-gray-700 block px-4 py-2 text-sm"
                                  }
                                  onClick={() => handleChange("")}
                                >
                                  {placeholder}
                                </a>
                              )}
                            </Menu.Item>
                          ) : (
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  className={
                                    selectedValues == ""
                                      ? "text-gray-700 block px-4 py-2 text-sm active"
                                      : "text-gray-700 block px-4 py-2 text-sm"
                                  }
                                  onClick={() => handleChange("")}
                                >
                                  {placeholder}
                                </a>
                              )}
                            </Menu.Item>
                          )}
                        </>}
                      {options &&
                        options.map((itm: any, index: number) => {
                          return (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <a
                                  className={
                                    selectedValues == itm.id
                                      ? "text-gray-700 block px-4 py-2 text-sm active"
                                      : "text-gray-700 block px-4 py-2 text-sm"
                                  }
                                  onClick={() => handleChange(itm.id)}
                                  key={itm.id}
                                >
                                  {itm[displayValue]}
                                </a>
                              )}
                            </Menu.Item>
                          );
                        })}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* <button disabled={disabled} className={`text-white bg-[#976DD0] bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dropdown-toggle removeBg ${className}`} type="button" id={"dropdownMenuButton" + id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {selectedValues ? methodModel.find(options, selectedValues, 'id')?.[displayValue] || placeholder : placeholder}
                    </button>
                    <div className="dropdown-menu shadow bg_hover" aria-labelledby={"dropdownMenuButton" + id}>
                        {noDefault ? <a className={selectedValues == '' ? 'text-gray-700 block px-4 py-2 text-sm active disabled' : 'text-gray-700 block px-4 py-2 text-sm disabled'} disabled>{placeholder}</a> : <a className={selectedValues == '' ? 'text-gray-700 block px-4 py-2 text-sm active' : 'text-gray-700 block px-4 py-2 text-sm'} onClick={() => handleChange('')}>{placeholder}</a>}
                        {options && options.map(itm => {
                            return <a className={selectedValues == itm.id ? 'text-gray-700 block px-4 py-2 text-sm active' : 'text-gray-700 block px-4 py-2 text-sm'} onClick={() => handleChange(itm.id)} key={itm.id}>{itm[displayValue]}</a>
                        })}
                    </div> */}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Html;
