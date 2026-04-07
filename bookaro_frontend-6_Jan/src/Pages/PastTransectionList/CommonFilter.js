import {
    Checkbox,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild
} from "@headlessui/react";
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { useState } from "react";
import { BsTextareaResize } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import MultiSelectDropdown from "../../components/common/MultiSelectDropdown";
import addressModel from "../../models/address.model";
import { formatCurrency, stringSeprator } from "../../models/string.model";
import { generateYears } from "../propertySteps/shared";

import { Fragment} from 'react'
const CommonFilter = ({
    isOpen1,
    setIsOpen1,
    isOpen2,
    setIsOpen2,
    isOpen3,
    setIsOpen3,
    isOpen4,
    setIsOpen4,
    isOpen5,
    setIsOpen5,
    isOpen6,
    setIsOpen6,
    removeParams,
    view,
    setView,
    allfilters,
    setAllFilters,
    currentLocation,
    setCurrentLocation,
    location,
    setLocation,
    priceRange,
    setPriceRange,
    surface,
    setSurface,
    resetData,
    showReset,
    indFilter,
    setIndFilter,
    error,
    setError,
    upcomingCount,
    selectedRooms,
    setSelectedRooms,
    toggleRoomSelection,
    applyRoomsFilters,
    resetIndividual
}) => {
    const [inputKey, setInputKey] = useState(0);
    const locBtnStr = allfilters?.search?.split(",")?.slice(0, 1)[0];
    const yearBtnStr = allfilters?.year?.split(",")?.slice(0, 1)[0];
    const trueLocs = location?.filter(itm => itm?.added);
    const allowedValues = [0, 5, 10, 20, 50, 100, 200];
    const [selectedValue, setSelectedValue] = useState(0);
    const [selectedYears, setSelectedYears] = useState([]);
    let [isOpen, setIsOpen] = useState(true)
    function closeModal() {
        setIsOpen(false)
      }

      function openModal() {
        setIsOpen(true)
      }
    const addressResult = async (e) => {
        let address = {};
        if (e.place) {
            address = await addressModel.getAddress(e.place);
        }
        const name = `${e.value?.split(",")[0]}${address?.zipcode && ` (${address?.zipcode})`}`;
        const newLocation = {
            name: name,
            added: true,
            userLat: address?.lat,
            userLng: address?.lng,
        };
        setLocation([...location, newLocation]);
        setCurrentLocation('');
        setInputKey((prevKey) => prevKey + 1);
        setError({ ...error, location: "" })

        let data = { ...allfilters, ...indFilter };
        let locs = [...location?.filter((itm) => itm?.added), newLocation];
        const cities = data.search ? data.search.split(",") : [];
        data.search = [...cities, name].join(",");
        setIndFilter({
            ...data,
            maxDistance: locs?.length === 1 ? selectedValue : 0,
            userLat: locs?.length === 1 ? locs?.[0]?.userLat : "",
            userLng: locs?.length === 1 ? locs?.[0]?.userLng : "",
        });
    };

    const handleChange = (event, newValue) => {
        const closestValue = allowedValues.reduce((prev, curr) =>
            Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
        );
        setSelectedValue(closestValue);
        let locs = location?.filter((itm) => itm?.added);
        let data = {
            ...allfilters,
            search: locs?.map((data) => data?.name).join(","),
            maxDistance: locs?.length > 1 ? 0 : closestValue || selectedValue,
            userLat: locs?.length > 1 ? "" : locs[0]?.userLat,
            userLng: locs?.length > 1 ? "" : locs[0]?.userLng,
        };
        setTimeout(() => {
            setIndFilter({ ...data })
        }, 2000);
    };

    const applyBudget = () => {
        if (!priceRange?.min && !priceRange?.max) return setError({ ...error, price: "Enter range" })
        if (priceRange?.max) {
            if (+priceRange?.min >= +priceRange?.max) return setError({ ...error, price: "Enter correct range" })
        }
        setAllFilters({ ...allfilters, minPrice: priceRange?.min, maxPrice: priceRange?.max, });
        setIsOpen3(false)
    }

    const applySurface = () => {
        if (!surface?.min && !surface?.max) return setError({ ...error, surface: "Enter range" })
        if (surface?.max) {
            if (+surface?.min >= +surface?.max) return setError({ ...error, surface: "Enter correct range" })
        }
        setAllFilters({ ...allfilters, minSurface: surface?.min, maxSurface: surface?.max, });
        setIsOpen4(false)
    }
    // const toggleYearSelection = (key, value) => {
    //     setSelectedYears((prev) => {
    //         if (prev.includes(value)) {
    //             return prev?.filter((year) => year !== value);
    //         } else {
    //             return [...prev, value];
    //         }
    //     });
    // };

    return (
        <div className="bg-white sticky top-[59px] xl:top-[68px] z-[7]">
            <div className=" items-center  mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-12 py-4 ">
                    <div className="col-span-12 flex items-center justify-between">
                    <div className=" md:hidden block">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
         Filter
        </button>
      </div>

      {/* <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent
                      you an email with all of the details of your order.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition> */}
                        <ul className="md:flex items-center flex-wrap hidden">

                            {/* Location tab */}
                            <li className="me-2 xl:mb-0 ">
                                <button onClick={() => setIsOpen2(true)}
                                    className={`${allfilters?.search ? "bg-[#986dcd1f]" : ""}
                                    border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <IoLocationOutline className=" me-1 text-[15px]" />
                                    {allfilters?.search ? `${stringSeprator(locBtnStr, 20)}
                                     ${allfilters?.search?.split(",")?.length > 1
                                            ? `(+${allfilters?.search?.split(",")?.length - 1})`
                                            : ""}` : "Location"}
                                </button>
                                <Dialog open={isOpen2}
                                    onClose={() => {
                                        setIsOpen2(false)
                                        setError({ ...error, location: "" })
                                    }}
                                    className="relative z-[9999]"
                                >
                                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                                        <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                                            <DialogTitle className="p-6">
                                                <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                                                    Where are you looking?
                                                </p>
                                                <div className="pt-10 flex items-center google_address">
                                                    <GooglePlaceAutoComplete
                                                        key={inputKey}
                                                        value={currentLocation}
                                                        result={addressResult}
                                                        placeholder="Enter location you want to search..."
                                                        id="address"
                                                    />
                                                </div>
                                                <div className="flex items-center mt-2 flex-wrap">
                                                    {location.map((loc, index) => (
                                                        <div key={index} className={`flex pointer items-center py-1 px-2 me-2  rounded-[4px] text-white
                                                                ${loc?.added ? "bg-[#73339B]" : "bg-[#976DD0]"}`}
                                                        >
                                                            <p className="text-white text-[14px] me-2 cursor-pointer"
                                                                onClick={() => {
                                                                    let data = [...location];
                                                                    data[index] = { ...loc, added: !loc.added };
                                                                    setLocation(data);
                                                                    setError({ ...error, location: "" })
                                                                    // click on card
                                                                    let data2 = { ...allfilters, ...indFilter };
                                                                    const cities = data2.search ? data2.search.split(",") : [];
                                                                    if (cities.includes(loc.name)) {
                                                                        data2.search = cities.filter((addr) => addr !== loc.name).join(",");
                                                                    } else {
                                                                        data2.search = [...cities, loc.name].join(",");
                                                                    }
                                                                    let locs = data?.filter((itm) => itm?.added);
                                                                    setIndFilter({
                                                                        ...data2,
                                                                        maxDistance: locs?.length === 1 ? selectedValue : 0,
                                                                        userLat: locs?.length === 1 ? locs?.[0]?.userLat : "",
                                                                        userLng: locs?.length === 1 ? locs?.[0]?.userLng : "",
                                                                    });
                                                                }}
                                                            >{loc?.name}</p>
                                                            <button
                                                                onClick={() => {
                                                                    let locs = [...location];
                                                                    let data = locs.filter((_, i) => i !== index);
                                                                    setLocation(data);
                                                                    setError({ ...error, location: "" })
                                                                    // click for cross
                                                                    let data2 = { ...allfilters, ...indFilter };
                                                                    const cities = data2.search ? data2.search.split(",") : [];
                                                                    data2.search = cities.filter((addr) => addr !== loc.name).join(",");
                                                                    let truelocs = data?.filter((itm) => itm?.added);
                                                                    setIndFilter({
                                                                        ...data2,
                                                                        maxDistance: truelocs?.length === 1 ? selectedValue : 0,
                                                                        userLat: truelocs?.length === 1 ? truelocs?.[0]?.userLat : "",
                                                                        userLng: truelocs?.length === 1 ? truelocs?.[0]?.userLng : "",
                                                                    });
                                                                }}
                                                                className=" text-white"
                                                            >
                                                                <i className="fa fa-times text-[12px] "></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                {trueLocs?.length < 2 && (
                                                    <>
                                                        <label className="mb-1 text-[14px] text-[#656565] mt-3 block">Select maximum range radius to find the property</label>
                                                        <div className="mb-4 range_slider  border bg-[#986dcd0f">
                                                            <div className="flex justify-between bg-[#986dcd]  px-3 py-2 text-white">
                                                                <label className="text-white">Range</label>
                                                                <p> {selectedValue} Km</p>
                                                            </div>
                                                            <div className="px-4 py-2">
                                                                <Stack spacing={2} direction="row" sx={{ alignItems: "center", mb: 2 }}>
                                                                    <Slider
                                                                        value={selectedValue}
                                                                        onChange={handleChange}
                                                                        step={1} // Normal step, just used for mouse movement, not to restrict values
                                                                        min={Math.min(...allowedValues)}
                                                                        max={Math.max(...allowedValues)}
                                                                        valueLabelDisplay="auto" // Optional: Display the value when sliding
                                                                        marks={allowedValues.map(value => ({ value }))}
                                                                    // marks={allowedValues.map((value) => ({ value, label: `${value}` }))}
                                                                    />
                                                                </Stack>
                                                                {/* <p>Search Area range in km: {selectedValue}</p> */}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {error?.location && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.location}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex border-t p-4 justify-between">
                                                <button onClick={() => {
                                                    setIsOpen2(false)
                                                    setError({ ...error, location: "" })
                                                }} className="text-[#868389] text-[18px] underline">
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">{upcomingCount}</span> results
                                                    </button>
                                                    {(allfilters?.city) && (
                                                        <button className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                removeParams("search")
                                                                setLocation([]);
                                                                setIsOpen2(false);
                                                                setAllFilters({
                                                                    ...allfilters,
                                                                    city: "",
                                                                    maxDistance: 0,
                                                                    userLat: "",
                                                                    userLng: ""
                                                                })
                                                                setIndFilter({ ...allfilters, city: "" });
                                                                setSelectedValue(0)
                                                                // setIndFilter({ ...indFilter, city: "", });
                                                                setError({ ...error, location: "" })
                                                            }}
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            if (location?.length === 0) return setError({ ...error, location: "Enter atleast a location" })
                                                            let locs = location?.filter(itm => itm?.added);
                                                            if (locs?.length === 0) return setError({ ...error, location: "Select atleast a location" })
                                                            setIsOpen2(false);
                                                            let data = { ...allfilters };
                                                            data = {
                                                                ...data,
                                                                search: locs?.map((data) => data?.name).join(","),
                                                                maxDistance: locs?.length > 1 ? 0 : selectedValue,
                                                                userLat: locs?.length > 1 ? "" : locs[0]?.userLat,
                                                                userLng: locs?.length > 1 ? "" : locs[0]?.userLng,
                                                            }
                                                            setAllFilters(data);
                                                        }}
                                                        className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogPanel>
                                    </div>
                                </Dialog>
                            </li>

                            {/* Budget tab */}
                            <li className="me-2 xl:mb-0 ">
                                <button onClick={() => setIsOpen3(true)}
                                    className={`${allfilters?.minPrice || allfilters?.maxPrice ? "bg-[#986dcd1f]" : ""}
                                        border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <img src="assets/img/prop/price.svg" alt="" className="w-[15px] me-1" />
                                    {(allfilters?.minPrice && allfilters?.maxPrice)
                                        ? `${formatCurrency(allfilters?.minPrice)} - ${formatCurrency(allfilters?.maxPrice)} €`
                                        : allfilters?.maxPrice
                                            ? `max ${formatCurrency(allfilters?.maxPrice)} €`
                                            : allfilters?.minPrice
                                                ? `min ${formatCurrency(allfilters?.minPrice)} €`
                                                : "Budget"
                                    }
                                </button>
                                <Dialog
                                    open={isOpen3}
                                    onClose={() => {
                                        setIsOpen3(false)
                                        setError({ ...error, price: "" })
                                    }}
                                    className="relative z-[9999]"
                                >
                                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                                        <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                                            <DialogTitle className="p-6">
                                                <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                                                    What is your budget?
                                                </p>
                                                <div className="flex items-center justify-center pt-12 py-6">
                                                    <input
                                                        type="text"
                                                        value={priceRange.min}
                                                        onChange={(e) => {
                                                            let value = e.target.value;
                                                            value = value.replace(/[^0-9]/g, "");
                                                            if (value.length > 10)
                                                                value = value?.slice(0, 10);
                                                            setPriceRange({
                                                                ...priceRange,
                                                                min: value,
                                                            });
                                                            setError({
                                                                ...error,
                                                                price: "",
                                                            });
                                                            setIndFilter({
                                                                ...allfilters,
                                                                minPrice: value,
                                                                maxPrice: priceRange.max,
                                                            });
                                                        }}
                                                        className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                                                        placeholder="min"
                                                    />
                                                    <p className="mx-3">-</p>
                                                    <input
                                                        type="text"
                                                        value={priceRange.max}
                                                        onChange={(e) => {
                                                            let value = e.target.value;
                                                            value = value.replace(/[^0-9]/g, "");
                                                            if (value.length > 10)
                                                                value = value.slice(0, 10);
                                                            setPriceRange({
                                                                ...priceRange,
                                                                max: value,
                                                            });
                                                            setError({
                                                                ...error,
                                                                price: "",
                                                            });
                                                            setIndFilter({
                                                                ...allfilters,
                                                                minPrice: priceRange.min,
                                                                maxPrice: value,
                                                            });
                                                        }}
                                                        className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                                                        placeholder="max"
                                                    />
                                                    <p className="text-[#5A5A5A] ms-3">€</p>
                                                </div>
                                                {error?.price && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.price}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex border-t p-4 justify-between">
                                                <button onClick={() => {
                                                    setIsOpen3(false)
                                                    setError({ ...error, price: "" })
                                                }} className="text-[#868389] text-[18px] underline"
                                                >
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">{upcomingCount}</span> results
                                                    </button>
                                                    {(allfilters?.minPrice || allfilters?.maxPrice) && (
                                                        <button
                                                            className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                setError({ ...error, price: "", });
                                                                removeParams("minPrice");
                                                                removeParams("maxPrice");
                                                                setPriceRange({ min: "", max: "" });
                                                                resetIndividual(setIsOpen3, "minPrice", "maxPrice");
                                                                setIndFilter({ ...allfilters, minPrice: "", maxPrice: "" })
                                                            }}
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => { applyBudget() }}
                                                        className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogPanel>
                                    </div>
                                </Dialog>
                            </li>

                            {/* Surface tab */}
                            <li className="me-2 xl:mb-0 mProperty is used as:">
                                <button onClick={() => setIsOpen4(true)}
                                    className={`${(allfilters?.minSurface || allfilters?.maxSurface) ? "bg-[#986dcd1f]" : ""}
                                        border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <BsTextareaResize className="w-[15px] me-1" />
                                    {(allfilters?.minSurface && allfilters?.maxSurface)
                                        ? `${formatCurrency(allfilters?.minSurface)} - ${formatCurrency(allfilters?.maxSurface)} m2`
                                        : allfilters?.maxSurface
                                            ? `max ${formatCurrency(allfilters?.maxSurface)} m2`
                                            : allfilters?.minSurface
                                                ? `min ${formatCurrency(allfilters?.minSurface)} m2`
                                                : "Surface"}
                                </button>
                                <Dialog open={isOpen4}
                                    onClose={() => {
                                        setIsOpen4(false)
                                        setError({ ...error, surface: "" })
                                    }}
                                    className="relative z-[9999]"
                                >
                                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                                        <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                                            <DialogTitle className="p-6">
                                                <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                                                    What surface?
                                                </p>
                                                <div className="flex items-center justify-center pt-12 py-6">
                                                    <input
                                                        type="text"
                                                        value={surface.min}
                                                        onChange={(e) => {
                                                            let value = e.target.value;
                                                            value = value.replace(/[^0-9]/g, "");
                                                            if (value.length > 10)
                                                                value = value.slice(0, 10);
                                                            setSurface({ ...surface, min: value });
                                                            setError({ ...error, surface: "", });
                                                            setIndFilter({
                                                                ...allfilters,
                                                                maxSurface: surface.max,
                                                                minSurface: value,
                                                            });
                                                        }}
                                                        className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                                                        placeholder="min"
                                                    />
                                                    <p className="mx-3">-</p>
                                                    <input
                                                        type="test"
                                                        value={surface.max}
                                                        onChange={(e) => {
                                                            let value = e.target.value;
                                                            value = value.replace(/[^0-9]/g, "");
                                                            if (value.length > 10)
                                                                value = value.slice(0, 10);
                                                            setSurface({ ...surface, max: value });
                                                            setError({ ...error, surface: "" });
                                                            setIndFilter({
                                                                ...allfilters,
                                                                minSurface: surface.min,
                                                                maxSurface: value,
                                                            });
                                                        }}
                                                        className="border border-[#976DD0] rounded-[7px] p-2 w-[130px]"
                                                        placeholder="max"
                                                    />
                                                    <p className="text-[#5A5A5A] ms-3">€</p>
                                                </div>
                                                {error?.surface && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.surface}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex border-t p-4 justify-between">
                                                <button
                                                    onClick={() => {
                                                        setIsOpen4(false)
                                                        setError({ ...error, surface: "" })
                                                    }}
                                                    className="text-[#868389] text-[18px] underline"
                                                >
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">{upcomingCount}</span> results
                                                    </button>
                                                    {(allfilters?.minSurface || allfilters?.maxSurface) && (
                                                        <button
                                                            className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                removeParams("minSurface")
                                                                removeParams("maxSurface")
                                                                setSurface({ min: "", max: "" });
                                                                resetIndividual(setIsOpen4, "minSurface", "maxSurface");
                                                                setIndFilter({ ...allfilters, minSurface: "", maxSurface: "", });
                                                            }}
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => { applySurface() }}
                                                        className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogPanel>
                                    </div>
                                </Dialog>
                            </li>

                            {/* rooms tab */}
                            <li className="me-2 xl:mb-0 mb-2 ">
                                <button
                                    onClick={() => setIsOpen5(true)}
                                    className={`${allfilters.number_of_main_pieces ? "bg-[#986dcd1f]" : ""}
                                                                     border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <img
                                        src="assets/img/prop/bed.png"
                                        alt=""
                                        className="w-[15px] me-1"
                                    />
                                    Rooms {allfilters.number_of_main_pieces && `(${allfilters.number_of_main_pieces})`}
                                </button>
                                <Dialog
                                    open={isOpen5}
                                    onClose={() => {
                                        setIsOpen5(false);
                                        setSelectedRooms([]);
                                        setError({ ...error, number_of_main_pieces: "" });
                                    }}
                                    className="relative z-[9999]"
                                >
                                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                    <div className="fixed inset-0 flex w-screen items-center justify-center ">
                                        <DialogPanel className="max-w-md  w-full bg-white rounded-[20px]  ">
                                            <DialogTitle className=" p-6 ">
                                                <p className="border-b  text-[#389D93] text-[18px] text-center pb-4">
                                                    {" "}
                                                    What number of rooms?
                                                </p>
                                                <ul className="flex items-center flex-wrap  justify-center py-14">
                                                    {[
                                                        { name: "Studio", value: 1 },
                                                        { name: "2", value: 2 },
                                                        { name: "3", value: 3 },
                                                        { name: "4", value: 4 },
                                                        { name: "5+", value: 5 },
                                                    ].map((item) => (
                                                        <li className="text-center font-[400] flex items-center justify-center flex-col text-[12px] me-4  my-2 cursor-pointer">
                                                            <Checkbox
                                                                onClick={() => {
                                                                    toggleRoomSelection("rooms", item.value);
                                                                    setError({ ...error, number_of_main_pieces: "" });
                                                                    let data = { ...allfilters, number_of_main_pieces: indFilter.number_of_main_pieces };
                                                                    const number_of_main_pieces = data.number_of_main_pieces ? data.number_of_main_pieces.split(",")?.map(Number) : [];
                                                                    if (number_of_main_pieces?.includes(item.value)) {
                                                                        data.number_of_main_pieces = number_of_main_pieces.filter((room) => room !== item.value).join(",");
                                                                    } else {
                                                                        data.number_of_main_pieces = [...number_of_main_pieces, item.value].join(",");
                                                                    }
                                                                    setIndFilter({ ...data });
                                                                }}
                                                                className={`${selectedRooms.includes(item.value)
                                                                    ? "bg-[#986AB8] text-white border-[#986AB8]"
                                                                    : ""
                                                                    } group block rounded-[50px] py-[4px] flex items-center justify-center border border-[#986AB8] h-[40px] px-3.5 mb-2 text-black font-[600] text-[18px]`}
                                                            >
                                                                {item.name}
                                                            </Checkbox>
                                                        </li>
                                                    ))}
                                                    {error?.number_of_main_pieces && (
                                                        <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                            {error?.number_of_main_pieces}
                                                        </span>
                                                    )}
                                                </ul>
                                            </DialogTitle>
                                            <div className="flex  border-t p-4 justify-between">
                                                <button
                                                    onClick={() => {
                                                        setIsOpen5(false);
                                                    }}
                                                    className="text-[#868389] text-[18px] underline"
                                                >
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">
                                                            {upcomingCount}
                                                        </span>{" "}
                                                        results
                                                    </button>
                                                    {allfilters?.number_of_main_pieces && (
                                                        <button
                                                            className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                setSelectedRooms([]);
                                                                resetIndividual(setIsOpen5, "number_of_main_pieces");
                                                                setIndFilter({ ...allfilters, number_of_main_pieces: "" });
                                                            }}
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            if (selectedRooms.length === 0) return setError({ ...error, number_of_main_pieces: "Select atleast a room" });
                                                            applyRoomsFilters()
                                                        }}
                                                        className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogPanel>
                                    </div>
                                </Dialog>
                            </li>

                            {/* year tab */}
                            <li className="me-2 xl:mb-0 mb-2 ">
                                <button
                                    onClick={() => setIsOpen6(true)}
                                    className={`${allfilters.year ? "bg-[#986dcd1f]" : ""}
                                                                     border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <img
                                        src="assets/img/prop/bed.png"
                                        alt=""
                                        className="w-[15px] me-1"
                                    />
                                    {/* {allfilters.year && `(${stringSeprator(allfilters.year)})`} */}

                                    {allfilters?.year ? `Year ${yearBtnStr}
                                     ${allfilters?.year?.split(",")?.length > 1
                                            ? `(+${allfilters?.year?.split(",")?.length - 1})`
                                            : ""}` : "Year"}
                                </button>
                                <Dialog
                                    open={isOpen6}
                                    onClose={() => {
                                        setIsOpen6(false);
                                        setSelectedYears([]);
                                        setError({ ...error, year: "" })
                                    }}
                                    className="relative z-[9999]"
                                >
                                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                    <div className="fixed inset-0 flex w-screen items-center justify-center ">
                                        <DialogPanel className="max-w-md  w-full bg-white rounded-[20px]  ">
                                            <DialogTitle className=" p-6 ">
                                                <p className="border-b  text-[#389D93] text-[18px] text-center pb-4">
                                                    {" "}
                                                    Which year?
                                                </p>
                                                <div class="xl:max-w-[500px] w-[100%] mb-3">
                                                    {/* <SelectDropdown
                                                        displayValue="name"
                                                        placeholder="Select year"
                                                        isClearable={false}
                                                        intialValue={selectedYears}
                                                        result={(e) => {
                                                            setSelectedYears(e.value);
                                                            setIndFilter({ ...allfilters, year: e.value });
                                                            setError({ ...error, year: "" })
                                                        }}
                                                        options={generateYears(null, 1950)}
                                                    /> */}
                                                    <MultiSelectDropdown
                                                        intialValue={selectedYears}
                                                        result={(e) => {
                                                            setSelectedYears(e.value);
                                                            setIndFilter({ ...allfilters, year: e.value?.join() });
                                                            setError({ ...error, year: "" })
                                                        }}
                                                        options={generateYears(null, 1950)}
                                                        selectAll={false}
                                                    />
                                                </div>
                                                {/* <ul className="flex items-center flex-wrap  justify-center py-14">
                                                    {[
                                                        { name: "2024", value: 2024 },
                                                        { name: "2023", value: 2023 },
                                                        { name: "2022", value: 2022 },
                                                        { name: "2021", value: 2021 },
                                                        { name: "2020", value: 2020 },
                                                        { name: "2019", value: 2019 },
                                                        { name: "2018", value: 2018 },
                                                        { name: "2017", value: 2017 },
                                                        { name: "2016", value: 2016 },

                                                    ].map((item) => (
                                                        <li className="text-center font-[400] flex items-center justify-center flex-col text-[12px] me-4  my-2 cursor-pointer">
                                                            <Checkbox
                                                                onClick={() => {
                                                                    toggleYearSelection("year", item.value);
                                                                    let data = { ...allfilters, year: indFilter.year };
                                                                    const sman = data.year ? data.year.split(",")?.map(Number) : [];
                                                                    if (sman?.includes(item.value)) {
                                                                        data.year = sman.filter((room) => room !== item.value).join(",");
                                                                    } else {
                                                                        data.year = [...sman, item.value].join(",");
                                                                    }
                                                                    setIndFilter({ ...data });
                                                                }}
                                                                className={`${selectedYears.includes(item.value)
                                                                    ? "bg-[#986AB8] text-white border-[#986AB8]"
                                                                    : ""
                                                                    } group block rounded-[50px] py-[4px] flex items-center justify-center border border-[#986AB8] h-[40px] px-3.5 mb-2 text-black font-[600] text-[18px]`}
                                                            >
                                                                {item.name}
                                                            </Checkbox>
                                                        </li>
                                                    ))}
                                                </ul> */}
                                                {error?.year && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.year}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex  border-t p-4 justify-between">
                                                <button
                                                    onClick={() => {
                                                        setIsOpen6(false);
                                                    }}
                                                    className="text-[#868389] text-[18px] underline"
                                                >
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">
                                                            {upcomingCount}
                                                        </span>{" "}
                                                        results
                                                    </button>
                                                    {allfilters?.year && (
                                                        <button
                                                            className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                setIsOpen6(false);
                                                                setSelectedYears([]);
                                                                resetIndividual(setIsOpen6, "year");
                                                                setIndFilter({ ...allfilters, year: "" });
                                                            }}
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            if (selectedYears?.length === 0) return setError({ ...error, year: "Select atleast a year" });
                                                            setAllFilters({ ...allfilters, year: selectedYears?.join() });
                                                            setIsOpen6(false);
                                                        }}
                                                        className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogPanel>
                                    </div>
                                </Dialog>
                            </li>

                            {showReset && (
                                <li className="me-2 xl:mb-0 mb-2">
                                    <button onClick={resetData}
                                        className="bg-[#48464a]  border border-[#48464a] rounded-[50px] py-[6px] text-[12px] text-white px-3 font-[600] flex items-center"
                                    >
                                        Reset Filters
                                    </button>

                                </li>
                            )}
                        </ul>
                        <div>
                            <ul className="flex items-center">
                                <li onClick={() => setView("map")}>
                                    <a className={`${view === "map" ? "font-[600]" : ""} text-[#47525E] text-[14px] px-3`}>
                                        Map
                                    </a>
                                </li>
                                <li onClick={() => setView("grid")}>
                                    <a className={`${view === "grid" ? "font-[600]" : ""} text-[#47525E] text-[14px] px-3`}>
                                        Grid
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default CommonFilter
