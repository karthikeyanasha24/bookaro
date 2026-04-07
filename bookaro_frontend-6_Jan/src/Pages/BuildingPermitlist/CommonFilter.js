import {
    Checkbox,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle
} from "@headlessui/react";
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import addressModel from "../../models/address.model";
import { stringSeprator } from "../../models/string.model";
import { GoHome } from "react-icons/go";
import { HiOutlineUser } from "react-icons/hi";

const CommonFilter = ({
    isOpen1,
    setIsOpen1,
    isOpen2,
    setIsOpen2,
    isOpen3,
    setIsOpen3,
    removeParams,
    view,
    setView,
    allfilters,
    setAllFilters,
    currentLocation,
    setCurrentLocation,
    location,
    setLocation,
    selectedType,
    setSelectedType,
    resetData,
    showReset,
    indFilter,
    setIndFilter,
    error,
    setError,
    upcomingCount,
    services,
    selectedStatus,
    setSelectedStatus,
}) => {
    const [inputKey, setInputKey] = useState(0);
    const addressResult = async (e) => {
        let address = {};
        if (e.place) {
            address = await addressModel.getAddress(e.place);
        }
        const name = `${e.value?.split(",")[0]}${address?.zipcode && ` (${address?.zipcode})`}`;
        const newLocation = {
            name: name,
            added: true,
            latitude: address?.lng,
            longitude: address?.lat,
        };
        setLocation([...location, newLocation]);
        setCurrentLocation('');
        setInputKey((prevKey) => prevKey + 1);
        setError({ ...error, location: "" })

        let data = { ...allfilters, ...indFilter };
        let locs = [...location?.filter((itm) => itm?.added), newLocation];
        const cities = data.city ? data.city.split(",") : [];
        data.city = [...cities, name].join(",");
        setIndFilter({
            ...data,
            maxDistance: locs?.length === 1 ? selectedValue : 0,
            latitude: locs?.length === 1 ? locs?.[0]?.latitude : "",
            longitude: locs?.length === 1 ? locs?.[0]?.longitude : "",
        });
    };

    const locBtnStr = allfilters?.city?.split(",")?.slice(0, 1)?.[0];
    const typeBtnStr = allfilters?.type?.split(",")?.slice(0, 1)?.[0];
    const statusBtnStr = allfilters?.status?.split(",")?.slice(0, 1)?.[0];
    const serviceIds = allfilters?.service ? allfilters.service.split(",") : [];
    const firstServiceName = serviceIds.length > 0 ? services.find((service) => service._id === serviceIds[0])?.name : null;
    const remainingCount = serviceIds.length > 1 ? serviceIds.length - 1 : 0;

    const trueLocs = location?.filter(itm => itm?.added);
    const allowedValues = [0, 5, 10, 20, 50, 100, 200];
    const [selectedValue, setSelectedValue] = useState(0);

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
            latitude: locs?.length > 1 ? "" : locs[0]?.latitude,
            longitude: locs?.length > 1 ? "" : locs[0]?.longitude,
        };
        setTimeout(() => {
            setIndFilter({ ...data })
        }, 2000);
    };
    const toggleTypeSelection = (value) => {
        setSelectedType((prev) => {
            if (prev.includes(value)) {
                return prev?.filter((type) => type !== value);
            } else {
                return [...prev, value];
            }
        });
    };
    const toggleStatus = (item) => {
        setSelectedStatus((prev) => {
            const exists = prev.some(status => status.id === item.id);
            if (exists) {
                return prev.filter(status => status.id !== item.id);
            } else {
                return [...prev, { id: item.id, name: item.name }];
            }
        });
    };

    return (
        <div className="bg-white sticky top-[59px] xl:top-[68px] z-[7]">
            <div className=" items-center  mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-12 py-4 ">
                    <div className="col-span-12 flex items-center justify-between">
                        <ul className="flex items-center flex-wrap ">

                            <li className="me-2 mb-2 xl:mb-0 ">
                                <button
                                    onClick={() => setIsOpen2(true)}
                                    className={`${allfilters?.city ? "bg-[#986dcd1f]" : ""}
                                    border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <IoLocationOutline className=" me-1 text-[15px]" />
                                    {allfilters?.city ? `${stringSeprator(locBtnStr, 20)}
                                            ${allfilters?.city?.split(",")?.length > 1 ? `(+${allfilters?.city?.split(",")?.length - 1})` : ""}`
                                        : "Location"}

                                </button>
                                <Dialog
                                    open={isOpen2}
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
                                                        <div key={index} className={`flex pointer items-center py-1 px-2 me-2 mb-2 rounded-[4px] text-white
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
                                                                    const cities = data2.city ? data2.city.split(",") : [];
                                                                    if (cities.includes(loc.name)) {
                                                                        data2.city = cities.filter((addr) => addr !== loc.name).join(",");
                                                                    } else {
                                                                        data2.city = [...cities, loc.name].join(",");
                                                                    }
                                                                    let locs = data?.filter((itm) => itm?.added);
                                                                    setIndFilter({
                                                                        ...data2,
                                                                        maxDistance: locs?.length === 1 ? selectedValue : 0,
                                                                        latitude: locs?.length === 1 ? locs?.[0]?.latitude : "",
                                                                        longitude: locs?.length === 1 ? locs?.[0]?.longitude : "",
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
                                                                    const cities = data2.city ? data2.city.split(",") : [];
                                                                    data2.city = cities.filter((city) => city !== loc.name).join(",");
                                                                    let truelocs = data?.filter((itm) => itm?.added);
                                                                    setIndFilter({
                                                                        ...data2,
                                                                        maxDistance: truelocs?.length === 1 ? selectedValue : 0,
                                                                        latitude: truelocs?.length === 1 ? truelocs?.[0]?.latitude : "",
                                                                        longitude: truelocs?.length === 1 ? truelocs?.[0]?.longitude : "",
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
                                                        </div></>
                                                )}
                                                {error?.location && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.location}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex border-t p-4 justify-between">
                                                <button onClick={() => {
                                                    setError({ ...error, location: "" })
                                                    setIsOpen2(false)
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
                                                                    latitude: "",
                                                                    longitude: ""
                                                                })
                                                                setIndFilter({ ...indFilter, city: "" });
                                                                setSelectedValue(0)
                                                                setIndFilter({ ...indFilter, city: "", });
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
                                                                city: locs?.map((data) => data?.name).join(","),
                                                                maxDistance: locs?.length > 1 ? 0 : selectedValue,
                                                                // latitude: locs?.length > 1 ? "" : locs[0]?.latitude,
                                                                // longitude: locs?.length > 1 ? "" : locs[0]?.longitude,
                                                            }
                                                            if (locs?.length === 1) {
                                                                data = {
                                                                    ...data,
                                                                    latitude: locs[0]?.latitude,
                                                                    longitude: locs[0]?.longitude,
                                                                };
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
                            <li className="me-2 mb-2 xl:mb-0 ">
                                <button onClick={() => setIsOpen3(true)}
                                    className={`${allfilters?.type ? "bg-[#986dcd1f]" : ""}
                                   border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <HiOutlineUser className=" me-1 text-[15px]" />

                                    {allfilters?.type ? `${stringSeprator(typeBtnStr, 20)}
                                            ${allfilters?.type?.split(",")?.length > 1 ? `(+${allfilters?.type?.split(",")?.length - 1})` : ""}`
                                        : "All"}
                                </button>
                                <Dialog
                                    open={isOpen3}
                                    onClose={() => {
                                        setIsOpen3(false)
                                        setError({ ...error, type: "" })
                                    }}
                                    className="relative z-[9999]"
                                >
                                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                                        <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                                            <DialogTitle className="p-6">
                                                <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                                                    Building Permit type you are looking for?
                                                </p>
                                                <ul className="flex items-center  justify-between flex-wrap pt-8">
                                                    {[
                                                        { id: "demolitionPermit", name: "Demolition Permit" },
                                                        { id: "nonResdential", name: "Non Resdential" },
                                                        { id: "residential", name: "Residential" },

                                                    ].map(item => (
                                                        <li className="text-center font-[400] flex items-center justify-center flex-col text-[12px]   my-2 cursor-pointer w-[47%] group hover:bg-[#986dcd17] rounded-[5px] transition ease-in-out">
                                                            <Checkbox
                                                                onClick={() => {
                                                                    setError({ ...error, type: "" })
                                                                    toggleTypeSelection(item.id);
                                                                    let data = { ...allfilters, type: indFilter.type };
                                                                    const types = data.type ? data.type.split(",") : [];
                                                                    if (types.includes(item.id)) {
                                                                        data.type = types.filter((type) => type !== item.id).join(",");
                                                                    } else {
                                                                        data.type = [...types, item.id].join(",");
                                                                    }
                                                                    setIndFilter({ ...data });
                                                                    setError({ ...error, type: "" })
                                                                }}
                                                                className={`${selectedType.includes(item.id)
                                                                    ? "bg-[#986AB8] text-white border-[#986AB8]"
                                                                    : ""
                                                                    } capitalize  block w-full py-[4px] flex flex-col items-center justify-center border border-[#986AB8] p-4  text-black font-[600] text-[16px] rounded-[5px] transition ease-in-out  `}
                                                            >
                                                                {selectedType.includes(item.id) ? <img src="assets/img/sale-white.svg" className="w-[40px] mb-2" /> :
                                                                    <img src="assets/img/sale.svg" className="w-[40px] mb-2" />}
                                                                {item?.name}
                                                            </Checkbox>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {error?.type && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.type}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex border-t p-4 justify-between">
                                                <button onClick={() => {
                                                    setIsOpen3(false)
                                                    setError({ ...error, type: "" })
                                                }}
                                                    className="text-[#868389] text-[18px] underline">
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">{upcomingCount}</span> results
                                                    </button>
                                                    {(allfilters?.type) && (
                                                        <button className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                removeParams("type")
                                                                setIsOpen3(false);
                                                                setSelectedType([])
                                                                setAllFilters({
                                                                    ...allfilters,
                                                                    type: ""
                                                                })
                                                                setIndFilter({ ...indFilter, type: "", });
                                                            }} >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                        onClick={() => {
                                                            if (selectedType?.length === 0) return setError({ ...error, type: "Select atleast a role" })
                                                            setIsOpen3(false);
                                                            setAllFilters({
                                                                ...allfilters,
                                                                type: selectedType.join()
                                                            })
                                                        }} >
                                                        Apply
                                                    </button>
                                                </div>
                                            </div>
                                        </DialogPanel>
                                    </div>
                                </Dialog>
                            </li>
                            <li className="me-2 mb-2 xl:mb-0 ">
                                <button
                                    onClick={() => setIsOpen1(true)}
                                    className={`${allfilters?.status ? "bg-[#986dcd1f]" : ""}
                                    border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <GoHome className="me-1 text-[15px]" />

                                    {allfilters?.status ? `${stringSeprator(statusBtnStr, 20)}
                                            ${allfilters?.status?.split(",")?.length > 1 ? `,${allfilters?.status?.split(",")?.length - 1}` : ""}`
                                        : "Status"}
                                </button>
                                <Dialog
                                    open={isOpen1}
                                    onClose={() => setIsOpen1(false)}
                                    className="relative z-[9999]"
                                >
                                    <DialogBackdrop className="fixed inset-0 bg-black/30" />
                                    <div className="fixed inset-0 flex w-screen items-center justify-center">
                                        <DialogPanel className="max-w-md w-full bg-white rounded-[20px]">
                                            <DialogTitle className="p-6">
                                                <p className="border-b text-[#389D93] text-[18px] text-center pb-4">
                                                    status you are looking for?
                                                </p>
                                                <ul className="flex items-center flex-wrap  justify-center py-14">
                                                    {[
                                                        { name: "Pending Authorization", id: 1 },
                                                        { name: "Authorized", id: 2 },
                                                        { name: "Cancelled", id: 4 },
                                                        { name: "Started", id: 5 },
                                                        { name: "Completed", id: 6 },
                                                    ].map((item) => (
                                                        <li className="text-center font-[400] flex items-center justify-center flex-col text-[12px] me-4  my-2 cursor-pointer">
                                                            <Checkbox
                                                                onClick={() => {
                                                                    setError({ ...error, status: "" })
                                                                    toggleStatus(item);
                                                                    let data = { ...allfilters, status: indFilter.status }
                                                                    const status = data.status ? data.status.split(",") : [];
                                                                    if (status.includes(item?.id)) {
                                                                        data.status = status.filter((ser) => ser !== item?.id).join(",");
                                                                    } else {
                                                                        data.status = [...status, item?.id].join(",");
                                                                    }
                                                                    setIndFilter({ ...data });
                                                                    setError({ ...error, status: "" })
                                                                }}
                                                                className={`${selectedStatus.some(status => status.id === item.id)
                                                                    ? "bg-[#986AB8] text-white border-[#986AB8]"
                                                                    : ""
                                                                    } capitalize group block rounded-[50px] py-[4px] flex items-center justify-center border border-[#986AB8] h-[40px] px-3.5 mb-2 text-black font-[600] text-[18px]`}
                                                            >
                                                                {item?.name}
                                                            </Checkbox>
                                                        </li>
                                                    ))}

                                                </ul>
                                                {error?.service && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.status}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex border-t p-4 justify-between">
                                                <button onClick={() => {
                                                    setIsOpen1(false)
                                                    setError({ ...error, status: "" })
                                                }}
                                                    className="text-[#868389] text-[18px] underline">
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">{upcomingCount}</span> results
                                                    </button>
                                                    {(allfilters?.status) && (
                                                        <button className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                setIsOpen1(false);
                                                                setAllFilters({
                                                                    ...allfilters,
                                                                    status: ""
                                                                })
                                                                setIndFilter({ ...indFilter, status: "", });
                                                                setSelectedStatus([])
                                                            }} >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                        onClick={() => {
                                                            if (selectedStatus?.length === 0) return setError({ ...error, status: "Select atleast a status" })
                                                            setIsOpen1(false);
                                                            setAllFilters({
                                                                ...allfilters,
                                                                status: selectedStatus.map((ser) => ser?.id).join()
                                                            })
                                                        }} >
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
            </div>
        </div >
    )
}

export default CommonFilter
