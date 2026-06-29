import { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import shared from "./shared";
import { IoCloseOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import MultiSelectDropdown from "../../components/common/MultiSelectDropdown";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import environment from "../../environment";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GrSubtractCircle } from "react-icons/gr";
import SelectDropdown from "../../components/common/SelectDropdown";
import moment from "moment";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    venue_name: "",
    name: "",
    email: "",
    mobileNo: "",
    amenities: [],
    images: [],
    role: shared?.role,
    description: "",
    locations: [{ location: "", country: "", state: "", city: "", zipCode: "" }],
    // location: "",
    // country: "",
    // state: "",
    // city: "",
    // zipCode: "",
    website_link: "",
    instagram_link: "",
    facebook_link: "",
    tiktok_link: "",
    youtube_link: "",
    applyAll: true,
    time_schedule: [
      { day: "monday", start_time: "", end_time: "", best_time_to_visit: "" },
      { day: "tuesday", start_time: "", end_time: "", best_time_to_visit: "" },
      { day: "wednesday", start_time: "", end_time: "", best_time_to_visit: "" },
      { day: "thursday", start_time: "", end_time: "", best_time_to_visit: "" },
      { day: "friday", start_time: "", end_time: "", best_time_to_visit: "" },
      { day: "saturday", start_time: "", end_time: "", best_time_to_visit: "" },
      { day: "sunday", start_time: "", end_time: "", best_time_to_visit: "" },
    ],
    menu_item_format: "",
    foods: [{ item: "", price: "", image: "" }],
    drinks: [{ item: "", price: "", image: "" }],
    foodImages: [],
  });
  const history = useNavigate();
  const [amenities, setAmenities] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const inValidEmail = methodModel.emailvalidation(form?.email);

  const foodFormatOptions = [
    { id: "manual", name: "Manual" },
    { id: "upload", name: "Upload" },
  ]

  useEffect(() => {
    getAmenities()
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          setform({
            venue_name: res?.data?.venue_name,
            name: res?.data?.name || "",
            email: res?.data?.email || "",
            mobileNo: res?.data?.mobileNo || "",
            amenities: res?.data?.amenities?.map((item) => item?.id || item?._id),
            images: res?.data?.images || "",
            role: res?.data?.role || "",
            description: res?.data?.description || "",
            locations: res?.data?.locations,
            // location: res?.data?.location || "",
            // country: res?.data?.country || "",
            // state: res?.data?.state || "",
            // city: res?.data?.city || "",
            // zipCode: res?.data?.zipCode || "",
            hasFood: res?.data?.hasFood || "",
            hours: res?.data?.hours || "",
            best_time_to_visit: res?.data?.best_time_to_visit || "",
            website_link: res?.data?.website_link || "",
            instagram_link: res?.data?.instagram_link || "",
            facebook_link: res?.data?.facebook_link || "",
            tiktok_link: res?.data?.tiktok_link || "",
            youtube_link: res?.data?.youtube_link || "",
            applyAll: res?.data?.applyAll,
            time_schedule: res?.data?.time_schedule?.map(item => {
              return ({ ...item, start_time: new Date(item?.start_time), end_time: new Date(item?.end_time), best_time_to_visit: item?.best_time_to_visit ? new Date(item?.best_time_to_visit) : "" })
            }),
            menu_item_format: res?.data?.menu_item_format,
            foods: res?.data?.foods,
            drinks: res?.data?.drinks,
            foodImages: res?.data?.foodImages,
            id: res?.data?.id || res?.data?._id
          })
        }
        loader(false);
      });
    }
  }, [])

  const getAmenities = () => {
    ApiClient.get(`amenity/listing?status=active&sortBy=title asc`).then(res => {
      if (res.success) {
        setAmenities(res?.data?.map((item) => {
          return ({ id: item?._id, name: item?.title })
        }))
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let method = "post";
    let url = shared.addApi;
    let value = { ...form }
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
    }
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        history(`/${shared.url}`);
      }
      loader(false);
    });
  }

  const ImagesUpload = (e, key) => {
    let files = Array.from(e.target.files);
    const acceptedTypes = ['image/jpeg', 'image/png']; // Add more image types if needed
    const filteredFiles = files.filter(file => acceptedTypes.includes(file.type));
    let invalidFiles = files.filter(file => !acceptedTypes.includes(file.type));
    if (invalidFiles.length > 0 && files?.length > 1) {
      toast.error('Some files are not valid format and will be ignored.Only JPG and PNG images are allowed.');
    }
    if (filteredFiles.length !== files.length && files?.length === 1) {
      toast.error('Only JPG and PNG images are allowed.');
    }
    if (filteredFiles?.length === 0) {
      return;
    }
    loader(true)
    let images = form?.[key] || []
    ApiClient.multiImageUpload('upload/multiple-images', filteredFiles, {}, "files").then(res => {
      if (res.success) {
        const data = res?.files?.map((item) => item?.fileName)
        images.push(...data)
        setform({ ...form, [key]: images })
      }
      loader(false)
    })
  }

  const handleImageDelete = (index, key) => {
    const data = [...form?.[key]]
    data.splice(index, 1)
    setform({ ...form, [key]: data })
  }

  // const handleLocation = (place) => {
  //   const addressComponents = place?.address_components;
  //   const address = {};

  //   for (let i = 0; i < addressComponents.length; i++) {
  //     const component = addressComponents[i];
  //     const types = component.types;
  //     if (types.includes('country')) {
  //       address.country = component.long_name;
  //     }
  //     if (types.includes('administrative_area_level_1')) {
  //       address.state = component.long_name;
  //     }
  //     if (types.includes('locality')) {
  //       address.city = component.long_name;
  //     }
  //     if (types.includes('postal_code')) {
  //       address.zipCode = component.long_name;
  //     }
  //   }

  //   address.location = place?.formatted_address
  //   address.coordinates = {
  //     type: "Point",
  //     coordinates: [place.geometry.location.lng(), place.geometry.location.lat()]
  //   }
  //   setform((prev) => ({ ...prev, ...address }))
  // }

  const handleTimeSchedule = (date, index, key) => {
    let data = form?.time_schedule
    if (form?.applyAll) {
      data = data.map((item, i) => {
        return { ...item, [key]: date }
      })
    } else {
      data[index][key] = date
    }
    setform((prev) => ({ ...prev, time_schedule: data }))
  }

  const handleApplyAll = (checked) => {
    const data = form?.time_schedule[0]
    const timeSchedule = [
      { day: "monday", start_time: data?.start_time, end_time: data?.end_time, best_time_to_visit: data?.best_time_to_visit },
      { day: "tuesday", start_time: data?.start_time, end_time: data?.end_time, best_time_to_visit: data?.best_time_to_visit },
      { day: "wednesday", start_time: data?.start_time, end_time: data?.end_time, best_time_to_visit: data?.best_time_to_visit },
      { day: "thursday", start_time: data?.start_time, end_time: data?.end_time, best_time_to_visit: data?.best_time_to_visit },
      { day: "friday", start_time: data?.start_time, end_time: data?.end_time, best_time_to_visit: data?.best_time_to_visit },
      { day: "saturday", start_time: data?.start_time, end_time: data?.end_time, best_time_to_visit: data?.best_time_to_visit },
      { day: "sunday", start_time: data?.start_time, end_time: data?.end_time, best_time_to_visit: data?.best_time_to_visit },
    ]
    if (checked) {
      setform((prev) => ({ ...prev, applyAll: checked, time_schedule: timeSchedule }))
    } else {
      setform((prev) => ({ ...prev, applyAll: checked }))
    }
  }

  const handleAddMoreInput = (e, index, key, object) => {
    let data = form?.[object]
    data[index][key] = e
    setform((prev) => ({ ...prev, [object]: data }))
  }
  const handleAddMore = (key) => {
    const data = [...form?.[key], { item: "", price: "", image: "" }]
    setform((prev) => ({ ...prev, [key]: data }))
  }
  const handleRemoveAddMore = (index, key) => {
    const data = form?.[key]?.filter((item, i) => i !== index)
    setform((prev) => ({ ...prev, [key]: data }))
  }

  const ImageUpload = (e, index, key, object) => {
    let files = e.target.files
    let file = files.item(0)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']; // Add more image types if needed
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }
    let data = form?.[object]
    loader(true)
    ApiClient.postFormData('upload/image', { file: file }).then(res => {
      if (res.success) {
        data[index][key] = res?.fileName
        setform((prev) => ({ ...prev, [object]: data }))
      }
      loader(false)
    })
  }

  const handleMenuImage = (index, key, object) => {
    let data = form?.[object]
    data[index][key] = ""
    setform((prev) => ({ ...prev, [object]: data }))
  }

  const handleLocationsAutoComplete = (place, index) => {
    const addressComponents = place?.address_components;
    const address = {};
    for (let i = 0; i < addressComponents.length; i++) {
      const component = addressComponents[i];
      const types = component.types;
      if (types.includes('country')) {
        address.country = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        address.state = component.long_name;
      }
      if (types.includes('locality')) {
        address.city = component.long_name;
      }
      if (types.includes('postal_code')) {
        address.zipCode = component.long_name;
      }
    }
    address.location = place?.formatted_address
    address.coordinates = {
      type: "Point",
      coordinates: [place.geometry.location.lng(), place.geometry.location.lat()]
    }
    let data = [...form?.locations]
    data[index] = address
    setform((prev) => ({ ...prev, locations: data }))
  }
  const handleAddMoreLocations = () => {
    const data = [...form?.locations, { location: "", country: "", state: "", city: "", zipCode: "" }]
    setform((prev) => ({ ...prev, locations: data }))
  }

  const getEndTime = (hours, min) => {
    // Get the current date
    let now = new Date();
    // Extract the current date parts (year, month, and day)
    let year = now.getFullYear();
    let month = now.getMonth(); // Note: January is 0, December is 11
    let day = now.getDate();
    // Create a new Date object for hours min on the current date
    let dateWithTime = new Date(year, month, day, hours, min, 0);
    return dateWithTime;
  }
  const addTenMinutes = (date) => {
    // Ensure the argument is a Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    // Create a new Date object to avoid mutating the original date
    let newDate = new Date(date);
    // Add 10 minutes to the new date
    newDate.setMinutes(newDate.getMinutes() + 10);
    return newDate;
  }

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit} autoComplete="one-time-code">
          <div className="">
            <div className="flex items-center mb-8">
              <Tooltip placement="top" title="Back">
                <Link to={`/${shared.url}`} className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3">
                  <i className="fa fa-angle-left text-lg"></i>
                </Link>
              </Tooltip>
              <div>
                <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                  {form && form.id ? "Edit" : "Add"} {shared.addTitle}
                </h3>
              </div>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Venue Details</h2>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <FormControl
                    type="text"
                    name="venue_name"
                    label="Venue Name"
                    // placeholder="Enter Venue Name"
                    autoComplete="one-time-code"
                    value={form?.venue_name}
                    onChange={(e) => setform({ ...form, venue_name: e })}
                    required
                  />
                </div>
                {form?.locations?.map((item, index) => {
                  return <>
                    <div className="col-span-12 border border-[1px] p-5 rounded-md bg-[#f6faff]">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                          <label>Location <span className="text-red-600">*</span></label>
                          <ReactGoogleAutocomplete
                            apiKey={environment?.map_api_key}
                            onPlaceSelected={(place) => { handleLocationsAutoComplete(place, index) }}
                            onChange={e => handleAddMoreInput(e.target.value, index, "location", "locations")}
                            value={item?.location}
                            types={['(regions)']}  
                            key={`venueLocation${index}`}
                            // placeholder="Enter Location"
                            required
                            className="bg-white w-full h-10 rounded-lg overflow-hidden px-2 mt-1 border border-[#00000036]"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <FormControl
                            type="text"
                            name="country"
                            label="Country"
                            // placeholder="Enter country"
                            autoComplete="one-time-code"
                            value={item?.country}
                            onChange={(e) => handleAddMoreInput(e, index, "country", "locations")}
                            required
                          />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <FormControl
                            type="text"
                            name="state"
                            label="State"
                            // placeholder="Enter State"
                            autoComplete="one-time-code"
                            value={item?.state}
                            onChange={(e) => handleAddMoreInput(e, index, "state", "locations")}
                            required
                          />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <FormControl
                            type="text"
                            name="city"
                            label="City"
                            // placeholder="Enter City"
                            autoComplete="one-time-code"
                            value={item?.city}
                            onChange={(e) => handleAddMoreInput(e, index, "city", "locations")}
                            required
                          />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <FormControl
                            type="text"
                            name="zipCode"
                            label="Zip Code"
                            // placeholder="Enter Zip Code"
                            autoComplete="one-time-code"
                            value={item?.zipCode}
                            onChange={(e) => handleAddMoreInput(e, index, "zipCode", "locations")}
                            required
                          />
                        </div>
                        <div className="col-span-12 gap-4 flex justify-end">
                          {form?.locations?.length > 1 &&
                              <div className="bg-red-600 p-2 text-white rounded-lg cursor-pointer w-fit h-fit" onClick={e => handleRemoveAddMore(index, "locations")}><GrSubtractCircle size={20} /></div>
                          }
                        </div>
                      </div>
                    </div>
                  </>
                })}
                <div className="col-span-12 gap-4 flex ml-auto">
                  <div className="bg-primary p-2 text-white rounded-lg cursor-pointer w-fit h-fit" onClick={e => handleAddMoreLocations()}>
                    <IoMdAddCircleOutline size={20} />
                  </div>
                </div>

                {/* <div className="mb-3">
                  <label>Location <span className="text-red-600">*</span></label>
                  <ReactGoogleAutocomplete
                    apiKey={environment?.map_api_key}
                    onPlaceSelected={(place) => { handleLocation(place) }}
                    onChange={e => setform({ ...form, location: e.target.value })}
                    value={form?.location}
                    types={['(regions)']}
                    key="venueLocation"
                    // placeholder="Enter Location"
                    required
                    className="bg-white w-full h-10 rounded-lg overflow-hidden px-2 mt-1 border border-[#00000036]"
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="country"
                    label="Country"
                    // placeholder="Enter country"
                    autoComplete="one-time-code"
                    value={form?.country}
                    onChange={(e) => setform({ ...form, country: e })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="state"
                    label="State"
                    // placeholder="Enter State"
                    autoComplete="one-time-code"
                    value={form?.state}
                    onChange={(e) => setform({ ...form, state: e })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="city"
                    label="City"
                    // placeholder="Enter City"
                    autoComplete="one-time-code"
                    value={form?.city}
                    onChange={(e) => setform({ ...form, city: e })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="zipCode"
                    label="Zip Code"
                    // placeholder="Enter Zip Code"
                    autoComplete="one-time-code"
                    value={form?.zipCode}
                    onChange={(e) => setform({ ...form, zipCode: e })}
                    required
                  />
                </div> */}
              </div>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Contact Info</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="name"
                    label="Name"
                    // placeholder="Enter Name"
                    autoComplete="one-time-code"
                    value={form?.name}
                    onChange={(e) => setform({ ...form, name: e })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="email"
                    label="Email"
                    // placeholder="Enter Email"
                    autoComplete="one-time-code"
                    className={id ? "cursor-not-allowed" : ""}
                    value={form.email}
                    onChange={(e) => setform({ ...form, email: e })}
                    required
                    disabled={id ? true : false}
                  />
                  {form?.email && !inValidEmail && submitted && (
                    <div className="d-block text-red-600">Please enter valid email</div>
                  )}
                </div>
                <div className="mobile_number mb-3">
                  <FormControl
                    type="phone"
                    name="mobileNo"
                    autoComplete="one-time-code"
                    label="Mobile Number"
                    value={form?.mobileNo}
                    onChange={(e) => setform({ ...form, mobileNo: e })}
                  />
                </div>
              </div>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Gallery</h2>
              <div className="mb-3">
                <label>Venue Images (JPG/PNG)</label>
                <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto">
                  <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 border-2 border-dashed border-gray-200 sm:max-w-[200px]`} style={{ gap: '8px' }}>
                    <FiPlus />
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={e => ImagesUpload(e, "images")}
                    />
                    Upload Images
                  </label>
                  {form?.images?.length > 0 ?
                    <span className="flex flex-wrap gap-3">
                      {form?.images?.map((item, index) => {
                        return <div className="relative" key={index}>
                          <img src={methodModel.userImg(item)} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain" />
                          <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => handleImageDelete(index, 'images')} size={25} />
                        </div>
                      })}
                    </span> : null
                  }
                </div>
              </div>
              <div className="mb-3">
                <FormControl
                  type="editor"
                  name="description"
                  label="Description"
                  value={form?.description}
                  onChange={(e) => setform((prev) => ({ ...prev, description: e }))}
                />
              </div>
            </div>
            <div className="relative table-responsive shadow-md overflow-x-auto border border-[#eee] sm:rounded-lg bg-white mt-3 mb-3 p-5">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Time Schedule</h2>
              <table className="table w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-2 py-3 cursor-pointer whitespace-nowrap">
                    <label className="flex items-cneter gap-2 cursor-pointer">
                      <input type="checkbox" onChange={e => handleApplyAll(e.target.checked)} checked={form?.applyAll} className="h-5 w-5" />Apply for all
                    </label>
                  </th>
                  <th className="px-2 py-3 cursor-pointer whitespace-nowrap">Start Time <span className="text-red-600">*</span></th>
                  <th className="px-2 py-3 cursor-pointer whitespace-nowrap">End Time <span className="text-red-600">*</span></th>
                  <th className="px-2 py-3 cursor-pointer whitespace-nowrap">Best Time To Visit </th>
                </tr>
                {form?.time_schedule?.map((item, index) => {
                  return <tr key={index}>
                    <td className="px-2 py-4 whitespace-nowrap undefined capitalize">{item?.day}</td>
                    <td className="px-2 py-4 whitespace-nowrap undefined">
                      <DatePicker
                        selected={item?.start_time}
                        onChange={(date) => handleTimeSchedule(date, index, 'start_time')}
                        className={`border border-[#00000036] rounded-md h-8 p-2 ${index !== 0 && form?.applyAll && "cursor-not-allowed"}`}
                        dateFormat="hh:mm a"
                        placeholderText="Start Time"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Start Time"
                        disabled={index !== 0 && form?.applyAll}
                        required
                      />
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap undefined">
                      <DatePicker
                        selected={item?.end_time}
                        onChange={(date) => handleTimeSchedule(date, index, 'end_time')}
                        className={`border border-[#00000036] rounded-md h-8 p-2 ${index !== 0 && form?.applyAll && "cursor-not-allowed"}`}
                        dateFormat="hh:mm a"
                        placeholderText="End Time"
                        minTime={item?.start_time ? addTenMinutes(item?.start_time) : getEndTime(0, 0)}
                        maxTime={getEndTime(23, 50)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="End Time"
                        disabled={index !== 0 && form?.applyAll}
                        required
                      />
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap undefined">
                      <DatePicker
                        selected={item?.best_time_to_visit}
                        onChange={(date) => handleTimeSchedule(date, index, 'best_time_to_visit')}
                        className={`border border-[#00000036] rounded-md h-8 p-2 ${index !== 0 && form?.applyAll && "cursor-not-allowed"}`}
                        dateFormat="hh:mm a"
                        minTime={item?.start_time ? getEndTime(moment(item?.start_time).format("HH"), moment(item?.start_time).format("mm")) : getEndTime(0, 0)}
                        maxTime={item?.end_time ? getEndTime(moment(item?.end_time).format("HH"), moment(item?.end_time).format("mm")) : getEndTime(23, 50)}
                        placeholderText="Best Time To Visit"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Best Time"
                        disabled={index !== 0 && form?.applyAll}
                      />
                    </td>
                  </tr>
                })}
              </table>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Social Media</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="website_link"
                    label="Website Link"
                    // placeholder="Enter Website Link"
                    autoComplete="one-time-code"
                    value={form?.website_link}
                    onChange={(e) => setform({ ...form, website_link: e })}
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="instagram_link"
                    label="Instagram Link"
                    // placeholder="Enter Instagram Link"
                    autoComplete="one-time-code"
                    value={form?.instagram_link}
                    onChange={(e) => setform({ ...form, instagram_link: e })}
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="facebook_link"
                    label="FaceBook Link"
                    // placeholder="Enter FaceBook Link"
                    autoComplete="one-time-code"
                    value={form?.facebook_link}
                    onChange={(e) => setform({ ...form, facebook_link: e })}
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="tiktok_link"
                    label="TikTok Link"
                    // placeholder="Enter TikTok Link"
                    autoComplete="one-time-code"
                    value={form?.tiktok_link}
                    onChange={(e) => setform({ ...form, tiktok_link: e })}
                  />
                </div>
                <div className="mb-3">
                  <FormControl
                    type="text"
                    name="youtube_link"
                    label="YouTube Link"
                    // placeholder="Enter YouTube Link"
                    autoComplete="one-time-code"
                    value={form?.youtube_link}
                    onChange={(e) => setform({ ...form, youtube_link: e })}
                  />
                </div>
              </div>
            </div>
            <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
              <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Menu Items & Amenities</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label>Amenities <span className="text-red-600">*</span></label>
                  <MultiSelectDropdown
                    id="statusDropdown"
                    // placeholder="Select Amenities"
                    intialValue={form?.amenities}
                    className="mt-1 capitalize"
                    result={(e) => setform({ ...form, amenities: e?.value })}
                    options={amenities}
                    required={true}
                  />
                </div>
                <div className="mb-3">
                  <label>Menu Items Format <span className="text-red-600">*</span></label>
                  <SelectDropdown
                    id="statusDropdown"
                    displayValue="name"
                    className="mt-1"
                    // placeholder="Select Choose Format"
                    theme="search"
                    intialValue={form?.menu_item_format}
                    result={(e) => setform({ ...form, menu_item_format: e?.value })}
                    options={foodFormatOptions}
                    isClearable={false}
                    required
                  />
                </div>
              </div>
              {form?.menu_item_format === "manual" &&
                <>
                  <div className="mb-3">
                    <label>Foods</label>
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-12">
                        {form?.foods?.map((itm, index) => {
                          return <div key={index} className="flex gap-4 mb-3">
                            <FormControl
                              type="text"
                              name="foods"
                              // placeholder="Enter Item"
                              autoComplete="one-time-code"
                              value={itm?.item}
                              onChange={(e) => handleAddMoreInput(e, index, "item", "foods")}
                              required
                            />
                            <FormControl
                              type="number"
                              name="price"
                              // placeholder="Enter Price ($)"
                              autoComplete="one-time-code"
                              className=""
                              value={itm?.price}
                              onChange={(e) => handleAddMoreInput(e, index, "price", "foods")}
                              maxlength={10}
                              required
                            />
                            <div className="flex gap-4">
                              <div className="flex flex-col rounded-lg cursor-pointer w-[180px] gap-6 max-sm:mx-auto">
                                {itm?.image ? (
                                  <>
                                    <div className="relative flex flex-wrap gap-3 mt-3">
                                      <img src={methodModel.userImg(itm?.image)} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain ml-auto" />
                                      <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => handleMenuImage(index, "image", "foods")} size={25} />
                                    </div>
                                  </>
                                ) : (
                                  <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] h-10 focus:outline-none font-medium rounded-lg text-sm px-5 border-2 border-dashed border-gray-200`} style={{ gap: '8px' }}>
                                    <FiPlus />
                                    <input
                                      id="dropzone-file"
                                      type="file"
                                      className="hidden"
                                      onChange={e => ImageUpload(e, index, "image", "foods")}
                                    />
                                    Upload Image
                                  </label>
                                )}
                              </div>
                              {form?.foods?.length > 1 &&
                                <div className="bg-red-600 p-3 text-white rounded-lg cursor-pointer h-fit" onClick={e => handleRemoveAddMore(index, "foods")}><GrSubtractCircle size={20} /></div>
                              }
                            </div>
                          </div>
                        })}
                      </div>
                      <div className="col-span-12 flex justify-end">
                        <div className="bg-primary p-3 text-white rounded-lg cursor-pointer w-fit" onClick={e => handleAddMore("foods")}>
                          <IoMdAddCircleOutline size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>Drinks</label>
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-12">
                        {form?.drinks?.map((itm, index) => {
                          return <div key={index} className="flex gap-4 mb-3">
                            <FormControl
                              type="text"
                              name="drinks"
                              // placeholder="Enter Item"
                              autoComplete="one-time-code"
                              value={itm?.item}
                              onChange={(e) => handleAddMoreInput(e, index, "item", "drinks")}
                              required
                            />
                            <FormControl
                              type="number"
                              name="price"
                              // placeholder="Enter Price ($)"
                              autoComplete="one-time-code"
                              className=""
                              value={itm?.price}
                              onChange={(e) => handleAddMoreInput(e, index, "price", "drinks")}
                              maxlength={10}
                              required
                            />
                            <div className="flex gap-4">
                              <div className="flex flex-col rounded-lg cursor-pointer w-[180px] gap-6 max-sm:mx-auto ">
                                {itm?.image ? (
                                  <>
                                    <div className="relative flex flex-wrap gap-3 mt-3">
                                      <img src={methodModel.userImg(itm?.image)} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain ml-auto" />
                                      <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => handleMenuImage(index, "image", "drinks")} size={25} />
                                    </div>
                                  </>
                                ) : (
                                  <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] h-10 focus:outline-none font-medium rounded-lg text-sm px-5 border-2 border-dashed border-gray-200`} style={{ gap: '8px' }}>
                                    <FiPlus />
                                    <input
                                      id="dropzone-file"
                                      type="file"
                                      className="hidden"
                                      onChange={e => ImageUpload(e, index, "image", "drinks")}
                                    />
                                    Upload Image
                                  </label>
                                )}
                              </div>
                              {form?.drinks?.length > 1 &&
                                <div className="bg-red-600 p-3 text-white rounded-lg cursor-pointer h-fit" onClick={e => handleRemoveAddMore(index, "drinks")}><GrSubtractCircle size={20} /></div>
                              }
                            </div>
                          </div>
                        })}
                      </div>
                      <div className="col-span-12 flex justify-end">
                        <div className="bg-primary p-3 text-white rounded-lg cursor-pointer w-fit" onClick={e => handleAddMore("drinks")}>
                          <IoMdAddCircleOutline size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
              {form?.menu_item_format === "upload" &&
                <>
                  <label>Upload Food Images (JPG/PNG)</label>
                  <div className="flex flex-col rounded-lg cursor-pointer gap-6 max-sm:mx-auto">
                    <label className={`flex items-center justify-center cursor-pointer text-black-800 bg-[#fff] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 border-2 border-dashed border-gray-200 sm:max-w-[200px] `} style={{ gap: '8px' }}>
                      <FiPlus />
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={e => ImagesUpload(e, 'foodImages')}
                      />
                      Upload Images
                    </label>
                    {form?.foodImages?.length > 0 ?
                      <span className="flex flex-wrap gap-3">
                        {form?.foodImages?.map((item, index) => {
                          return <div className="relative" key={index}>
                            <img src={methodModel.userImg(item)} className="bg-white thumbnail !w-[100px] !h-[100px] rounded-lg shadow-lg border-[2px] border-white object-contain" />
                            <IoCloseOutline className="absolute -top-2 -right-2 pointer hover:text-red-600 w-5 h-5 border bg-white shadow-md rounded-[50%]" onClick={e => handleImageDelete(index, "foodImages")} size={25} />
                          </div>
                        })}
                      </span> : null
                    }
                  </div>
                </>
              }
            </div>
            <div className="text-right">
              <button type="submit" className="text-white bg-[#976DD0] bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
                {form && form?.id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;
