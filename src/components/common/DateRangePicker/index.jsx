import React, { useEffect, useMemo, useState } from "react";
import { DateRange } from 'react-date-range';
import { useSelector } from 'react-redux';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "./style.scss";
import { Fragment } from 'react';
import { getCompareRange, getRange, rangeList as rangeL } from "./daterange.shared";
import datepipeModel from "../../../models/datepipemodel";
import { DatePicker } from "antd";

const DateRangePicker = ({ value, onChange, dynamicStyle = false, className = null, disabled = false, title = '', placeholder = '', isCompare = false, showcustom = true, rangeOutside = false, ranges }) => {
  const user = useSelector((state) => state.user);
  const [toggle, setToggle] = useState(false);
  const [range, setRange] = useState(value?.range || '');
  
  const rangeList = useMemo(() => {
    return [...(ranges || rangeL)];
  }, [ranges]);

  const [finaldata, setFinaldata] = useState(value);  // Start with the current value

  // Function to handle date range selection
  const blockDateChange = (e) => {
  
    // Convert the start and end date to IST (Indian Standard Time) manually
    const convertToIST = (date) => {
      const localDate = new Date(date);
      // Force the date to IST by adjusting to +5:30 offset (IST is UTC +5:30)
      const istOffset = 5.5 * 60; // IST offset in minutes (5 hours 30 minutes)
      const localOffset = localDate.getTimezoneOffset(); // Get system's timezone offset
  
      // Adjust the local time to IST time zone
      localDate.setMinutes(localDate.getMinutes() + (localOffset + istOffset));
  
      return localDate;
    };
  
    const startDateLocal = convertToIST(e.startDate); // Convert to IST
    const endDateLocal = convertToIST(e.endDate); // Convert to IST
  
    // Now, convert the local IST time to UTC
    const startDateUTC = new Date(Date.UTC(
      startDateLocal.getFullYear(),
      startDateLocal.getMonth(),
      startDateLocal.getDate(),
      startDateLocal.getHours(),
      startDateLocal.getMinutes(),
      startDateLocal.getSeconds()
    ));
  
    const endDateUTC = new Date(Date.UTC(
      endDateLocal.getFullYear(),
      endDateLocal.getMonth(),
      endDateLocal.getDate(),
      endDateLocal.getHours(),
      endDateLocal.getMinutes(),
      endDateLocal.getSeconds()
    ));
  
    // Now we create the payload using these UTC dates
    let payload = {
      ...finaldata,  // Preserve the current state
      startDate: startDateUTC.toISOString(),  // UTC format without shifting
      endDate: endDateUTC.toISOString(),      // UTC format without shifting
    };
    setFinaldata(payload);  // Update the state with the new payload
  };
  
  

  const toggleChange = () => {
    setToggle(!toggle);
  };

  const getBlockValue = () => {
    let v = {
      startDate: finaldata?.startDate ? new Date(finaldata.startDate).toISOString() : new Date().toISOString(), // Ensure UTC
      endDate: finaldata?.endDate ? new Date(finaldata.endDate).toISOString() : new Date().toISOString(), // Ensure UTC
      key: 'selection',
    };
    return [v];
  };

  const rangeClick = (e) => {
    let range = getRange(e);
    let startDate = new Date(range.startDate).toISOString();  // Convert to UTC
    let endDate = new Date(range.endDate).toISOString();  // Convert to UTC

    setRange(e);
    setFinaldata({ ...finaldata, startDate, endDate, compare: '', range: e });

    if (e !== '') {
      setToggle(false);  // Close the dropdown when a range is selected
    }
    if (onChange) {
        onChange({ ...finaldata, startDate, endDate, range: e });
    }
  };

  const previousYear = () => {
    let range = getCompareRange('Previous Year', finaldata);
    return { start: range.compareStart, end: range.compareEnd };
  };

  const previousPeriod = () => {
    let range = getCompareRange('Previous Period', finaldata);
    return { start: range.compareStart, end: range.compareEnd };
  };

  const previousMonth = () => {
    let range = getCompareRange('Previous Month', finaldata);
    return { start: range.compareStart, end: range.compareEnd };
  };

  const compareChange = (e) => {
    let range = getCompareRange(e, finaldata);

    let v = {
      ...finaldata,
      compareStart: range.compareStart,
      compareEnd: range.compareEnd,
      compare: e,
    };
    setFinaldata(v); 
    if (onChange) {
        onChange(v);
    }
    setToggle(false);
  };

  useEffect(() => {
    setRange(finaldata?.range || '');
  }, [finaldata?.range]);

  // Handle submit button click to trigger the main update
  const handleSubmitClick = () => {
    setToggle(false); // Close the dropdown when the submit button is clicked
    if (finaldata) {
      onChange(finaldata);  // Only call onChange when "OK" is clicked
    }
  };

  return (
    <div className="flex gap-2 flex-wrap max-w-[280px] w-full rounded-lg justify-start relative">
      <div className="shrink-0 w-full">
        <div className="w-full">
          <button
            id="dropdown-btn"
            onClick={toggleChange}
            disabled={disabled}
            className="inline-flex items-center mb-0 bg-white justify-center border border-[#C1BFBF] gap-x-1.5 rounded-md px-5 py-2 text-sm font-normal shadow-sm ring-0"
            title={title}
          >
            {!finaldata?.startDate || !finaldata?.endDate ? (
            <>{placeholder || 'Start Date - End Date'}</>
          ) : (
            <>
              {datepipeModel.date(finaldata?.startDate)} - {datepipeModel.date(finaldata?.endDate)}
            </>
          )}

            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </button>
        </div>

        {toggle && (
          <div>
            <div
              className={`${
                dynamicStyle ? '' : ''
              } focus:!outline-none ring-0 shadow-lg border text-sm absolute top-[32px] z-40 ${className ? className : 'w-full max-w-[300px] right-0 lg:min-w-[360px]'} right-0 shadow-lg !py-2 !mt-3 overflow-auto bg-white rounded-lg scrollbar`}
            >
              <div className="fffff">
                <div>
                  {!rangeOutside ? (
                    <div className="flex-wrap flex gap-1 p-2 mb-0">
                      {rangeList.map((itm) => {
                        return showcustom === false && itm.name === 'Custom' ? null : (
                          <button
                            key={itm.id}
                            className={`px-2 py-1 bg-[#000] text-[10px] rounded-lg ${range === itm.id ? 'bg-primary text-white' : 'bg-white border border-gray-100 gap-2 text-[10px] hover:bg-[#000] hover:text-white transition-all border-1 border-gray-400'}`}
                            type="button"
                            onClick={(e) => rangeClick(itm.id)}
                          >
                            {itm.name}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="w-full customcalender">
                    <DateRange
                      editableDateInputs={true}
                      onChange={(e) => {blockDateChange({
                        startDate: new Date(e.selection.startDate).toISOString(),
                        endDate: new Date(e.selection.endDate).toISOString()
                      })}}
                      shouldCloseOnSelect={false}
                      moveRangeOnFirstSelection={false}
                      ranges={getBlockValue()}
                      maxDate={new Date()}
                    />
                  </div>
                  <div className="pb-3">
                    <button className="px-5 py-2 text-[13px] rounded-lg bg-[#000] flex text-white hover:opacity-[80%] mx-auto transition duration-300" type="button" onClick={(e) => {
                      e.preventDefault();
                      onChange(finaldata);
                      setToggle(!toggle);
                    }}>OK</button>
                  </div>

                  {isCompare && (
                    <div className="relative">
                      <div className="text-center">
                        <button
                          className="inline-flex w-full justify-center border gap-x-1.5 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={toggleChange}
                        >
                          Compare
                          <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </button>
                      </div>
                      <div className="absolute right-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1">
                          <a
                            className={`dropdown-item ${finaldata.compare === 'Previous Month' ? 'active' : ''}`}
                            onClick={(e) => compareChange('Previous Month')}
                          >
                            Previous Month ({datepipeModel.date(previousMonth().start, user.companyDateFormat)} - {datepipeModel.date(previousMonth().end, user.companyDateFormat)})
                          </a>
                          <a
                            className={`dropdown-item ${finaldata.compare === 'Previous Year' ? 'active' : ''}`}
                            onClick={(e) => compareChange('Previous Year')}
                          >
                            Previous Year(Same Date) ({datepipeModel.date(previousYear().start, user.companyDateFormat)} - {datepipeModel.date(previousYear().end, user.companyDateFormat)})
                          </a>
                          <a
                            className={`dropdown-item ${finaldata.compare === 'Previous Period' ? 'active' : ''}`}
                            onClick={(e) => compareChange('Previous Period')}
                          >
                            Previous Period(Custom Dates) ({datepipeModel.date(previousPeriod().start, user.companyDateFormat)} - {datepipeModel.date(previousPeriod().end, user.companyDateFormat)})
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
