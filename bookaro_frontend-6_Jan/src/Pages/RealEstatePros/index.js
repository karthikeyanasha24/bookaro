import { useEffect, useState } from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import LoginModal from "../../components/common/Modal/LoginModal";
import SelectDropdown from "../../components/common/SelectDropdown";
import PageLayout from "../../components/global/PageLayout";
import addressModel from "../../models/address.model";

const RealEstatePros = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loginModal, setloginModal] = useState(false);
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const [form, setForm] = useState({
    location: "",
    role: "",
    city: "",
  })

  useEffect(() => {
    scrollToTop()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearLocation = () => {
    setInputKey((prevKey) => prevKey + 1);
    setForm({
      ...form, location: "",
      street: "",
      pinCode: "",
      city: "",
      country: "",
    });
  };

  const addressResult = async (e) => {
    let address = {};
    if (e.place) {
      address = await addressModel.getAddress(e.place);
    }
    setForm({
      ...form,
      location: address?.address,
      street: address?.locality,
      pinCode: address?.zipcode,
      city: address?.city,
      country: address?.country,
    })
    setError("")
  };

  const navigateToList = () => {
    // if (!user?.loggedIn) return setloginModal(true);
    if (!form?.location) return setError("Enter location")
    const query = [];
    if (form.city) query.push(`search=${encodeURIComponent(form.city)}`);
    if (form.role) query.push(`role=${encodeURIComponent(form.role?.toLowerCase())}`);
    const str = query.length > 0 ? `?${query.join("&")}` : "";
    navigate(`/prolist${str}`);
  }

  return (
    <PageLayout>
      <div>
        <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
        <div className="py-14   lg:py-16  bg-img bg-img-new relative">
          <div className="container px-8 mx-auto xl:px-5">
            <h1 className="text-white font-[600] text-[30px] text-center mb-8">
              Find your real estate professional
            </h1>
            <div className="border border-[#8492A6] rounded-[12px] bg-white p-5  lg:max-w-[800px] md:max-w-[600px] w-[80%] mx-auto absolute md:-bottom-10 md:bottom-0 left-set ">
              <label className="text-[#8492A6] mb-1 block">Location</label>
              <div className="flex flex-wrap justify-between md:flex-row flex-col">
                <div className="md:w-[40%] w-[100%]">
                  <div className="flex items-center w-full custom-loc relative">
                    <MdOutlineLocationOn className="me-2 absolute z-[1] left-[10px]" />
                    <div className="relative w-full">
                      <GooglePlaceAutoComplete
                        key={inputKey}
                        value={form?.location}
                        result={addressResult}
                        placeholder="Enter your location"
                        id="address"
                        className="pe-1"
                      />
                      {form.location?.trim() && (
                        <button
                          onClick={() => clearLocation()}
                          className="absolute right-[4px] top-4 ps-1"
                        >
                          <RxCross2 className="cursor-pointer " />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:w-[36%] w-[100%] md:my-0 my-5">
                  <SelectDropdown
                    className="custom_drop"
                    displayValue="name"
                    placeholder="Select Role"
                    isClearable={false}
                    intialValue={form.role}
                    result={(e) => {
                      setForm({
                        ...form,
                        role: e.value,
                      });
                    }}
                    options={[
                      { id: "Agency", name: "Agency" },
                      { id: "Agent", name: "Agent" },
                      { id: "Hunter", name: "Hunter" },
                    ]}
                  />
                </div>
                <div className="md:w-[20%]  w-[100%]">
                  <button
                    className="bg-[#976DD0] text-[14px] rounded-[50px] py-[8px] px-[18px] text-white font-bold w-full h-[40px] flex items-center justify-center"
                    onClick={() => navigateToList()}
                  >
                    See results
                  </button>
                </div>
                {error && (
                  <span className="mt-2 text-[#ff0000] text-sm text-center mx-auto block">
                    {error}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white md:py-24 pt-40 pb-24">
          <div className="container px-8 mx-auto xl:px-5 ">
            <div className="max-w-[800px] w-[100%]  mx-auto">
              <h2 className="text-[#47525E] font-[600] md:text-[24px] text-[20px] mb-0 mt-0 md:mt-5 pb-0 flex flex-col">
                Real Estate professionals in few words
                <span className="bg-[#976DD0] w-[40px] h-[7px] rounded-[20px] inline-block"></span>
              </h2>
              <ul className="mt-8">
                <li className="text-[#47525E] mb-4 text-[16px]">
                  Why work with a real estate agency to sell my property ?
                </li>
                <li className="text-[#47525E]  mb-4 text-[16px]">
                  Why work with a real estate hunter to find my dream home ?
                </li>
                <li className="text-[#47525E]  mb-4 text-[16px]">
                  Why work with an architect to renew my property ?
                </li>
                <li className="text-[#47525E]  mb-4 text-[16px]">
                  Why list my property on Bookaroo ?
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-[#ebebeb4d] py-16 ">
          <div className="container px-8 mx-auto xl:px-5 ">
            <div className="max-w-[800px] w-[100%]  mx-auto">
              <h2 className="text-[#47525E] text-[28px] mb-0 pb-0  text-center">
                You own a property?
              </h2>
              <div className="flex items-center justify-center mt-4">
                <button className="bg-[#976DD0] text-[14px] rounded-[50px] py-[8px] px-[20px] text-white font-bold "
                  onClick={(e) => navigate("/getquote-form?type=Professional Repository")}
                >
                  Get a free quote
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="py-14   lg:py-16 bg-white">
          <div className="container items-center  px-8 mx-auto xl:px-5">
            <div className="grid grid-cols-12 max-w-[800px] w-[100%]  mx-auto">
              <div className="col-span-12  mb-[40px]">
                <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
                  Historical transactions in biggest French cities
                  <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                </h2>
              </div>
              <div className="col-span-12  ">
                <div className="grid grid-cols-12 gap-4">
                  <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Paris
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Lille
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Marseille
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Lyon
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Rennes
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Nancy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Bordeaux
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Dieppe
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Toulouse
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Annecy
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Paris
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Lille
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Marseille
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Lyon
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Rennes
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Nancy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Bordeaux
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Dieppe
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Toulouse
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Annecy
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-14   lg:py-16 bg-white">
          <div className="container items-center  px-8 mx-auto xl:px-5">
            <div className="grid grid-cols-12 max-w-[800px] w-[100%]  mx-auto">
              <div className="col-span-12  mb-[40px]">
                <h2 className="text-[#47525E] lg:text-[25px] text-[20px] font-[600] ">
                  Historical transactions in biggest French regions{" "}
                  <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                </h2>
              </div>
              <div className="col-span-12">
                <div className="grid grid-cols-12 gap-4">
                  <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Paris
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Lille
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Marseille
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Lyon
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Rennes
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Nancy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Bordeaux
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Dieppe
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Toulouse
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Annecy
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Paris
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Lille
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Marseille
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Lyon
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Rennes
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="lg:col-span-3 md:col-span-6 col-span-12 ">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Nancy
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Bordeaux
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Dieppe
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Toulouse
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-[#47525E] underline lg:text-[16px] text-[14px] mb-3 inline-block"
                        >
                          Annecy
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="flex items-center justify-center mx-auto mt-10">
                  <button className="border border-[#976DD0] text-[#47525E] font-[600] rounded-[50px] py-[8px] px-10">
                    See more regions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RealEstatePros;
