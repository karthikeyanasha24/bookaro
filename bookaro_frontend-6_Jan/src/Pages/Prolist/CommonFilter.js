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
    selectedRoles,
    setSelectedRoles,
    resetData,
    showReset,
    indFilter,
    setIndFilter,
    error,
    setError,
    upcomingCount,
    services,
    selectedServices,
    setSelectedServices,
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
            userLat: address?.lat,
            userLng: address?.lng,
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
            userLat: locs?.length === 1 ? locs?.[0]?.userLat : "",
            userLng: locs?.length === 1 ? locs?.[0]?.userLng : "",
        });
    };

    const locBtnStr = allfilters?.city?.split(",")?.slice(0, 1)?.[0];
    const roleBtnStr = allfilters?.role?.split(",")?.slice(0, 1)?.[0];
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
    };
    const toggleTypeSelection = (value) => {
        setSelectedRoles((prevSelected) => {
            if (prevSelected.includes(value)) {
                return prevSelected?.filter((role) => role !== value);
            } else {
                return [...prevSelected, value];
            }
        });
    };
    const toggleService = (item) => {
        setSelectedServices((prev) => {
            const exists = prev.some(service => service.id === item._id);
            if (exists) {
                return prev.filter(service => service.id !== item._id);
            } else {
                return [...prev, { id: item._id, name: item.name }];
            }
        });
    };

    return (
        <div className="bg-white sticky top-[59px] xl:top-[68px] z-[7]">
            <div className=" items-center  mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-12 py-4 ">
                    <div className="col-span-12 flex items-center justify-between">
                        <ul className="flex items-center flex-wrap gap-1">
                            <li className="me-2 xl:mb-0">
                                <button
                                    onClick={() => setIsOpen1(true)}
                                    className={`${allfilters?.service ? "bg-[#986dcd1f]" : ""}  
                                    border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <GoHome className="me-1 text-[15px]" />
                                    {allfilters?.service
                                        ? `${firstServiceName || "Service Not Found"}${remainingCount > 0 ? ` (+${remainingCount})` : ""}`
                                        : "Services"}
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
                                                    Services you are looking for?
                                                </p>
                                                <ul className="flex items-center flex-wrap  justify-center py-14">
                                                    {services?.map((item, ii) => (
                                                        <li className="text-center font-[400] flex items-center justify-center flex-col text-[12px] me-4  my-2 cursor-pointer">
                                                            <Checkbox
                                                                onClick={() => {
                                                                    setError({ ...error, service: "" })
                                                                    toggleService(item);
                                                                    let data = { ...allfilters, service: indFilter.service };
                                                                    const services = data.service ? data.service.split(",") : [];
                                                                    if (services.includes(item?._id)) {
                                                                        data.service = services.filter((ser) => ser !== item?._id).join(",");
                                                                    } else {
                                                                        data.service = [...services, item?._id].join(",");
                                                                    }
                                                                    setIndFilter({ ...data });
                                                                    setError({ ...error, service: "" })
                                                                }}
                                                                className={`${selectedServices.some(service => service.id === item._id)
                                                                    ? "bg-[#986AB8] text-white border-[#986AB8]"
                                                                    : ""
                                                                    } capitalize group block rounded-[50px] py-[4px] flex items-center justify-center border border-[#986AB8] h-[40px] px-3.5  text-black font-[600] text-[18px]`}
                                                            >
                                                                {item?.name}
                                                            </Checkbox>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {error?.service && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.service}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex border-t p-4 justify-between">
                                                <button onClick={() => {
                                                    setIsOpen1(false)
                                                    setError({ ...error, service: "" })
                                                }}
                                                    className="text-[#868389] text-[18px] underline">
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">{upcomingCount}</span> results
                                                    </button>
                                                    {(allfilters?.service) && (
                                                        <button className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                setIsOpen1(false);
                                                                setAllFilters({
                                                                    ...allfilters,
                                                                    service: ""
                                                                })
                                                                setIndFilter({ ...indFilter, service: "", });
                                                                setSelectedServices([])
                                                            }} >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                        onClick={() => {
                                                            if (selectedServices?.length === 0) return setError({ ...error, service: "Select atleast a service" })
                                                            setIsOpen1(false);
                                                            setAllFilters({
                                                                ...allfilters,
                                                                service: selectedServices.map((ser) => ser?.id).join()
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
                            <li className="me-2 xl:mb-0 ">
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
                                                                    const cities = data2.city ? data2.city.split(",") : [];
                                                                    data2.city = cities.filter((city) => city !== loc.name).join(",");
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
                                                                    userLat: "",
                                                                    userLng: ""
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
                                                                // userLat: locs?.length > 1 ? "" : locs[0]?.userLat,
                                                                // userLng: locs?.length > 1 ? "" : locs[0]?.userLng,
                                                            }
                                                            if (locs?.length === 1) {
                                                                data = {
                                                                    ...data,
                                                                    userLat: locs[0]?.userLat,
                                                                    userLng: locs[0]?.userLng,
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
                            <li className="me-2 xl:mb-0">
                                <button onClick={() => setIsOpen3(true)}
                                    className={`${allfilters?.role ? "bg-[#986dcd1f]" : ""}  
                                   border capitalize border-[#976DD0] rounded-[50px] py-[6px] text-[12px] text-[#343F4B] px-3 font-[600] flex items-center`}
                                >
                                    <HiOutlineUser className=" me-1 text-[15px]" />
                                    {allfilters?.role ? `${stringSeprator(roleBtnStr, 20)}
                                            ${allfilters?.role?.split(",")?.length > 1 ? `(+${allfilters?.role?.split(",")?.length - 1})` : ""}`
                                        : "Role"}
                                </button>
                                <Dialog
                                    open={isOpen3}
                                    onClose={() => {
                                        setIsOpen3(false)
                                        setError({ ...error, role: "" })
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
                                                <ul className="flex items-center flex-wrap  justify-center py-4">
                                                    {[
                                                        { name: "agency", img: "assets/img/agency.svg" },
                                                        { name: "agent", img: "assets/img/agent.svg" },
                                                        { name: "hunter", img: "assets/img/hunter.svg" },
                                                    ].map(item => (
                                                        <li className="text-center font-[400] flex items-center justify-center flex-col text-[12px] mx-1  my-2 cursor-pointer ">
                                                            <Checkbox
                                                                onClick={() => {
                                                                    setError({ ...error, role: "" })
                                                                    toggleTypeSelection(item.name);
                                                                    let data = { ...allfilters, role: indFilter.role };
                                                                    const roles = data.role ? data.role.split(",") : [];
                                                                    if (roles.includes(item.name)) {
                                                                        data.role = roles.filter((type) => type !== item.name).join(",");
                                                                    } else {
                                                                        data.role = [...roles, item.name].join(",");
                                                                    }
                                                                    setIndFilter({ ...data });
                                                                    setError({ ...error, role: "" })
                                                                }}
                                                                className={`${selectedRoles.includes(item.name)
                                                                    ? "bg-[#986ab824]  border-[#986AB8]"
                                                                    : ""
                                                                    } capitalize group block rounded-[5px]  flex items-center justify-center border border-[#986AB8]  px-3.5 mb-2 text-black font-[600] text-[16px] w-[120px] h-[100px] flex flex-col hover:bg-[#986ab824] transition`}
                                                            >
                                                                <img src={item.img} alt="" className="w-[40px]" />
                                                                <p className="mt-2">{item.name}</p>
                                                            </Checkbox>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {error?.role && (
                                                    <span className="text-[#ff0000] text-sm text-center mx-auto block">
                                                        {error?.role}
                                                    </span>
                                                )}
                                            </DialogTitle>
                                            <div className="flex border-t p-4 justify-between">
                                                <button onClick={() => {
                                                    setIsOpen3(false)
                                                    setError({ ...error, role: "" })
                                                }}
                                                    className="text-[#868389] text-[18px] underline">
                                                    Cancel
                                                </button>
                                                <div className="flex items-center">
                                                    <button className="text-[#868389] me-3">
                                                        <span className="text-[#976DD0] font-[600]">{upcomingCount}</span> results
                                                    </button>
                                                    {(allfilters?.role) && (
                                                        <button className="text-[#868389] me-3"
                                                            onClick={() => {
                                                                removeParams("role")
                                                                setIsOpen3(false);
                                                                setAllFilters({
                                                                    ...allfilters,
                                                                    role: ""
                                                                })
                                                                setIndFilter({ ...indFilter, role: "", });
                                                            }} >
                                                            Reset
                                                        </button>
                                                    )}
                                                    <button className="bg-[#976DD0] px-4 py-[7px] text-white rounded-full font-[600] text-[14px]"
                                                        onClick={() => {
                                                            if (selectedRoles?.length === 0) return setError({ ...error, role: "Select atleast a role" })
                                                            setIsOpen3(false);
                                                            setAllFilters({
                                                                ...allfilters,
                                                                role: selectedRoles.join()
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
                                <li className="me-2 xl:mb-0 ">
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
