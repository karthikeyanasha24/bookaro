import { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import shared from "./shared";
import SelectDropdown from "../../components/common/SelectDropdown";
import { toast } from "react-toastify";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import addressModel from "../../models/address.model";
import PhoneInput from "react-phone-input-2";

const AddEdit = () => {
    const { id } = useParams();
    const [form, setform] = useState({});
    const history = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const formValidation = [
        { key: "schoolId", required: true },
        { key: "email", required: true },
        { key: "address", required: true },
        { key: "EstablishmentName", required: true },
        { key: "schoolStatus", required: true },
        { key: "schoolType", required: true },
    ]

    useEffect(() => {
        if (id) {
            loader(true);
            ApiClient.get(shared.detailApi, { schoolId: id }).then((res) => {
                if (res.success) {
                    setform(res?.data)
                }
                loader(false);
            });
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        let invalid = methodModel.getFormError(formValidation, form);
        if (invalid || !form.postalCode) return;
        let method = "post";
        let url = shared.addApi;
        let value = { ...form, id: id }
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

    const addressResult = async (e) => {
        let address = {};
        if (e.place) {
            address = await addressModel.getAddress(e.place);
        }
        if (!id) {
            setform(prev => ({
                ...prev,
                address: e.value,
                latitude: address?.lat,
                longitude: address?.lng,
                location: {
                    type: "Point",
                    coordinates: [
                        address?.lng,
                        address?.lat
                    ]
                },
               postalCode:address?.zipcode
            }))
        }
    };

    const schoolType = [
        { id: "elementarySchool", name: "Elementary School" },
        { id: "college", name: "College" },
        { id: "kindergarten", name: "Kindergarten" },
        { id: "elementaryPrimary", name: "Primary School" },
        { id: "highschool", name: "High School" },
    ];

    const schoolStatus = [
        { id: "Private", name: "Private" },
        { id: "Public", name: "Public" },

    ];

    const establishmentType = [
        { id: "school", name: "School" },
        { id: "highschool", name: "High School" },
        { id: "college", name: "College" },
    ]

    return (
        <>
            <Layout>
                <form onSubmit={handleSubmit}>
                    <div className="">
                        <div className="flex items-center mb-8">
                            <Tooltip placement="top" title="Back">
                                <Link to={`/${shared.url}`} className="!px-4  py-2 flex items-center justify-center bg-[#976DD0] text-white rounded-lg shadow-btn hover:bg-[#976DD0] border transition-all  mr-3">
                                    <i className="fa fa-angle-left text-lg"></i>
                                </Link>
                            </Tooltip>
                            <div>
                                <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                                    {id ? "Edit" : "Add"} {shared.addTitle}
                                </h3>
                            </div>
                        </div>
                        <div className="shadow-md rounded-md border-[1px] border-[#ededed] bg-white p-5 mb-4">
                            <h2 className="text-[20px] font-[600] text-[#0063a3] mb-2">Info</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="mb-3">
                                    <FormControl
                                        type="number"
                                        name="title"
                                        label="School Id"
                                        value={form?.schoolId}
                                        onChange={(e) => setform({ ...form, schoolId: e })}
                                        required
                                        disabled={id}
                                    />
                                    {submitted && !form.schoolId && (
                                        <div className="d-block text-red-600">SchoolId is required</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <FormControl
                                        type="email"
                                        name="email"
                                        label="Email"
                                        value={form?.email}
                                        onChange={(e) => setform({ ...form, email: e })}
                                        required
                                    />
                                    {submitted && !form.email && (
                                        <div className="d-block text-red-600">Email is required</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <FormControl
                                        type="text"
                                        name="EstablishmentName"
                                        label="Establishment Name"
                                        value={form?.EstablishmentName}
                                        onChange={(e) => setform({ ...form, EstablishmentName: e })}
                                        required
                                    />
                                    {submitted && !form.email && (
                                        <div className="d-block text-red-600">Establishment Name is required</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <span className="mb-3">Address <span className="text-red-600">*</span></span>
                                    <GooglePlaceAutoComplete
                                        value={form.address}
                                        result={addressResult}
                                        placeholder="Enter address..."
                                        id="address"
                                        disabled={id}

                                    />
                                    {submitted && !form.address && (
                                        <div className="d-block text-red-600">Address is required</div>
                                    )}
                                    {submitted && !form.postalCode && (
                                        <div className="d-block text-red-600">ZipCode is required</div>
                                    )}
                                </div>

                                {/* <div className="mb-3">
                                    <span className="mb-3">Establishment Type <span className="text-red-600">*</span></span>
                                    <SelectDropdown
                                        id="statusDropdown"
                                        displayValue="name"
                                        className="mt-1 capitalize"
                                        placeholder="Select Establishment Type"
                                        theme="search"
                                        intialValue={form?.establishmentType}
                                        result={(e) => setform({ ...form, establishmentType: e?.value })}
                                        options={establishmentType}
                                        required
                                    />
                                </div> */}

                                <div className="mb-3">
                                    <span className="mb-3">School Type <span className="text-red-600">*</span></span>
                                    <SelectDropdown
                                        id="statusDropdown"
                                        displayValue="name"
                                        className="mt-1 capitalize"
                                        placeholder="Select School Type"
                                        theme="search"
                                        intialValue={form?.schoolType}
                                        result={(e) => setform({ ...form, schoolType: e?.value })}
                                        options={schoolType}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <span className="mb-3">School Status <span className="text-red-600">*</span></span>
                                    <SelectDropdown
                                        id="statusDropdown"
                                        displayValue="name"
                                        className="mt-1 capitalize"
                                        placeholder="Select School Status"
                                        theme="search"
                                        intialValue={form?.schoolStatus}
                                        result={(e) => setform({ ...form, schoolStatus: e?.value })}
                                        options={schoolStatus}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <span>Phone</span>
                                    <PhoneInput
                                        country={"fr"}
                                        value={form.phone}
                                        enableSearch={true}
                                        onChange={(e) => setform({ ...form, phone: e })}
                                        inputProps={{ required: true }}
                                        countryCodeEditable={true}
                                    />
                                </div>

                                <div className="mb-3">
                                    <FormControl
                                        type="number"
                                        name="numberOfStudents"
                                        label="Number Of Students"
                                        value={form?.numberOfStudents}
                                        onChange={(e) => setform({ ...form, numberOfStudents: e })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <FormControl
                                        type="text"
                                        name="website"
                                        label="Website"
                                        value={form?.website}
                                        onChange={(e) => setform({ ...form, website: e })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <FormControl
                                        type="number"
                                        name="successRate"
                                        label="Success Rate"
                                        value={form?.successRate}
                                        onChange={(e) => {
                                            if (e <= 100) {
                                                setform({ ...form, successRate: e })
                                            }
                                        }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <FormControl
                                        type="number"
                                        name="examGrade"
                                        label="Exam Grade"
                                        value={form?.examGrade}
                                        onChange={(e) => {
                                            if (e <= 15) {
                                                setform({ ...form, examGrade: e })
                                            }
                                        }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <FormControl
                                        type="number"
                                        name="distinctionRate"
                                        label="Distinction Rate"
                                        value={form?.distinctionRate}
                                        onChange={(e) => {
                                            if (e <= 100) {
                                                setform({ ...form, distinctionRate: e })
                                            }
                                        }}

                                    />
                                </div>

                                <div className="mb-3">
                                    <FormControl
                                        type="number"
                                        name="SPI"
                                        label="SPI"
                                        value={form?.SPI}
                                        onChange={(e) => {
                                            if (e <= 150) {
                                                setform({ ...form, SPI: e })
                                            }
                                        }}
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="text-right">
                            <button type="submit" className="text-white bg-[#976DD0] bg-[#976DD0] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
                                {id ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </Layout>
        </>
    );
};

export default AddEdit;
