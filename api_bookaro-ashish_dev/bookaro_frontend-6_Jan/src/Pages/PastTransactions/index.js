import { MdOutlineLocationOn } from "react-icons/md";
// import Layout from "../../components/global/layout";
import addressModel from "../../models/address.model";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GooglePlaceAutoComplete from "../../components/common/GooglePlaceAutoComplete";
import { RxCross2 } from "react-icons/rx";
import LoginModal from "../../components/common/Modal/LoginModal";
import { useSelector } from "react-redux";
import PageLayout from "../../components/global/PageLayout";

const PastTransactions = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  const isPurchasesTab = tab === "purchases";
  const [form, setForm] = useState({
    location: "",
    role: "",
    search: "",
  })
  // const [price, setPrice] = useState({ min: "", max: "" })
  // const [surface, setSurface] = useState({ min: "", max: "" })
  const [error, setError] = useState("");
  const [inputKey, setInputKey] = useState(0);
  const [loginModal, setloginModal] = useState(false);

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
      search: "",
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
      search: address?.city,
      country: address?.country,
    })
    setError("");
  };

  const navigateToList = () => {
    // if (!user?.loggedIn) return setloginModal(true);
    if(!form?.location) return setError("Enter location")
    if (form.maxSurface) {
      if (+form.minSurface >= +form.maxSurface) return setError("Enter correct range of surface")
    }
    if (form.maxPrice) {
      if (+form.minPrice >= +form.maxPrice) return setError("Enter correct range of price")
    }
    const query = [];
    if (form.search) query.push(`search=${encodeURIComponent(form.search)}`);
    if (form.role) query.push(`role=${encodeURIComponent(form.role?.toLowerCase())}`);
    if (form.minSurface) query.push(`minSurface=${encodeURIComponent(form.minSurface)}`);
    if (form.maxSurface) query.push(`maxSurface=${encodeURIComponent(form.maxSurface)}`);
    if (form.rooms) query.push(`rooms=${encodeURIComponent(form.rooms)}`);
    if (form.minPrice) query.push(`minPrice=${encodeURIComponent(form.minPrice)}`);
    if (form.maxPrice) query.push(`maxPrice=${encodeURIComponent(form.maxPrice)}`);


    // if (Number(price?.min) !== 0 && Number(price.max) !== 0) {
    //   if (+price?.min >= +price.max) return setError("Enter correct price range")
    //   query.push(`price=${price?.min}-${price?.max}`)
    // }
    // if (Number(surface?.min) !== 0 && Number(surface.max) !== 0) {
    //   if (+surface?.min >= +surface.max) return setError("Enter correct surface range")
    //   query.push(`surface=${surface?.min}-${surface?.max}`)
    // }
    const str = query.length > 0 ? `?${query.join("&")}` : "";
    navigate(`/past-transation-list${str}`);
  }

  return (
    <PageLayout>
      <div>
        <LoginModal loginModal={loginModal} setloginModal={setloginModal} />
        <div className="py-14 lg:py-16 relative bg-white">
          <div className="container px-8 mx-auto xl:px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
              <div>
                <p className="inline-flex items-center border border-[#E8E0F4] rounded-full px-3 py-1 text-[12px] font-semibold text-[#976DD0] mb-3">
                  Discover features
                </p>
                {isPurchasesTab ? (
                  <>
                    <h1 className="font-[700] text-[#1F2937] md:text-[46px] text-[30px] leading-[1.1]">
                      My purchased services
                    </h1>
                    <p className="text-[#4B5563] text-[15px] mt-3 leading-[24px] max-w-[520px]">
                      Track all services you purchased from on-demand professionals and monitor upcoming deliveries.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="font-[700] text-[#1F2937] md:text-[46px] text-[30px] leading-[1.1]">
                      Consult property transaction history in France for the last 15 years
                    </h1>
                    <p className="text-[#4B5563] text-[15px] mt-3 leading-[24px] max-w-[520px]">
                      Compare your property with recent sales and understand price trends with location-aware filters.
                    </p>
                  </>
                )}
              </div>
              <div className="flex justify-center">
                <img src="/assets/img/blog-one.jpg" alt="Transaction history" className="w-[420px] h-[420px] rounded-full object-cover" />
              </div>
            </div>
            {!isPurchasesTab ? (
              <div className="border border-[#E6E8EC] rounded-[12px] bg-white p-5 lg:max-w-[1000px] md:max-w-[700px] md:w-[100%] w-[90%] mx-auto">
              <div className="flex flex-wrap md:justify-between  items-end md:flex-row flex-col ">
                <div className=" md:w-[30%] lg:w-[22%] w-[100%] md:mb-0 mb-3">
                  <label className="text-[#8492A6] mb-1 block">Location</label>
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
                <div className="md:w-[26%] lg:w-[22%] w-[100%] md:mb-0 mb-3">
                  <label className="text-[#8492A6] mb-1 block">Surface</label>
                  <div className="flex items-center    gap-2">
                    <input
                      type="text"
                      value={form.minSurface}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, "");
                        if (value.length > 10) value = value.slice(0, 10);
                        setForm({
                          ...form, minSurface: value
                        })
                        setError("");
                      }}
                      placeholder="Min"
                      className="bg-[#F0F0F0] w-full p-2 px-3 rounded-[5px] h-[44px]"
                    />
                    <input
                      type="text"
                      value={form.maxSurface}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, "");
                        if (value.length > 10)
                          value = value.slice(0, 10);
                        setForm({
                          ...form, maxSurface: value
                        })
                        setError("");
                      }}
                      placeholder="Max"
                      className="bg-[#F0F0F0] w-full p-2 px-3 rounded-[5px] h-[44px]"
                    />
                  </div>
                </div>
                <div className="md:w-[15%] lg:w-[15%] w-[100%] md:mb-0 mb-3">
                  <label className="text-[#8492A6] mb-1 block">Rooms</label>
                  <div className="flex items-center bg-[#F0F0F0] rounded-[5px] p-2 px-3 w-full h-[44px]">
                    <img
                      src="assets/img/prop/bed.png"
                      alt=""
                      className="w-[14px] me-2"
                    />
                    <input
                      type="text"
                      value={form.rooms}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, "");
                        if (value.length > 10) value = value.slice(0, 10);
                        if (parseInt(value) > 5) {
                          value = "5";
                          setError("Max rooms can be 5");
                        } else {
                          setError("");
                        }
                        setForm({
                          ...form, rooms: value
                        })
                      }}
                      placeholder="Enter rooms"
                      className="bg-[#F0F0F0] w-full "
                    />
                  </div>
                </div>
                <div className="md:w-[26%] lg:w-[22%] w-[100%] md:mb-0 mb-3">
                  <label className="text-[#8492A6] mb-1 block">Price</label>
                  <div className="flex items-center w-full gap-2">
                    <input
                      type="text"
                      value={form.minPrice}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, "");
                        if (value.length > 10) value = value.slice(0, 10);
                        setForm({
                          ...form, minPrice: value
                        })
                        setError("");
                      }}
                      placeholder="Min"
                      className="bg-[#F0F0F0] w-full p-2 px-3 rounded-[5px] h-[44px]"
                    />
                    <input
                      type="text"
                      value={form.maxPrice}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9]/g, "");
                        if (value.length > 10)
                          value = value.slice(0, 10);
                        setForm({
                          ...form, maxPrice: value
                        })
                        setError("");
                      }}
                      placeholder="Max"
                      className="bg-[#F0F0F0] w-full p-2 px-3 rounded-[5px] h-[44px]"
                    />
                  </div>
                </div>
                <div className="md:w-[30%] lg:w-[12%]  w-[100%] lg:mx-0 lg:mt-0 md:mx-auto md:mt-5 ">
                  <button className="bg-[#976DD0] text-[14px] rounded-[50px] py-[8px] px-[18px]  text-white font-bold w-full h-[40px] flex items-center justify-center"
                    onClick={() => navigateToList()}>
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Property visit package", agent: "Pauline Dupont", status: "Scheduled", amount: "300 EUR" },
                  { name: "Photo pack 12", agent: "Jean Martin", status: "In progress", amount: "100 EUR" },
                  { name: "Seller file assistance", agent: "Claire Bernard", status: "Completed", amount: "300 EUR" },
                ].map((purchase, idx) => (
                  <div key={idx} className="border border-[#E6E8EC] rounded-[12px] bg-white p-4">
                    <p className="text-[12px] text-[#8B93A1]">Purchased service</p>
                    <h3 className="text-[18px] font-[700] text-[#2D1B4E] mt-1">{purchase.name}</h3>
                    <p className="text-[13px] text-[#4B5563] mt-1">Agent: {purchase.agent}</p>
                    <p className="text-[13px] text-[#4B5563]">Amount: {purchase.amount}</p>
                    <span className="inline-block mt-3 text-[12px] px-3 py-1 rounded-full bg-[#EEE5FC] text-[#7F56C6]">
                      {purchase.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isPurchasesTab && (
        <div className="bg-white md:pb-24 md:pt-16 pt-8">
          <div className="container px-8 mx-auto xl:px-5 ">
            <div className="max-w-[800px] w-[100%]  mx-auto md:mt-0 mt-[320px] sm:mt-[300px]">
              <h2 className="text-[#47525E] font-[600]  md:text-[24px] text-[20px] mb-0 pb-0 flex flex-col">
                Real Estate professionals tips for defining a price
                <span className="bg-[#976DD0] w-[40px] h-[7px] rounded-[20px] inline-block"></span>
              </h2>
              <ul className="mt-10">
                <li className="text-[#47525E] mb-4 text-[16px]">
                  Should I lower my starting price to attract more leads?
                </li>
                <li className="text-[#47525E]  mb-4 text-[16px]">
                  How to define the price of my property?
                </li>
                <li className="text-[#47525E]  mb-4 text-[16px]">
                  Why should I work with a real estate professional for selling
                  my property?
                </li>
                <li className="text-[#47525E]  mb-4 text-[16px]">
                  Why list my property on Bookaroo ?
                </li>
              </ul>
            </div>
          </div>
        </div>
        )}
        <div className="bg-[#ebebeb4d] py-16 ">
          <div className="container px-8 mx-auto xl:px-5 ">
            <div className="max-w-[800px] w-[100%]  mx-auto">
              <h2 className="text-[#47525E] text-[28px] mb-0 pb-0  text-center">
                Planning to sell your property?
              </h2>
              <div className="flex items-center justify-center mt-4">
                <button className="bg-[#976DD0] text-[14px] rounded-[50px] py-[8px] px-[20px] text-white font-bold "
                onClick={(e)=>navigate("/getquote-form?type=Historical Transaction")}
                >
                  Get a free quote
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 lg:py-16 bg-white">
          <div className="container items-center  px-8 mx-auto xl:px-5">
            <div className="grid grid-cols-12 max-w-[800px] w-[100%]  mx-auto">
              <div className="col-span-12  mb-[40px]">
                <h2 className="text-[#47525E]  sm:text-start lg:text-[25px] text-[20px] font-[600] ">
                  Historical transactions in biggest French cities
                  <span className="bg-[#976DD0] w-[35px] h-[6px] rounded-[10px] block"></span>
                </h2>
              </div>
              <div className="col-span-12  ">
                <div className="grid grid-cols-12 gap-4">
                  <div className="lg:col-span-3 col-span-6 ">
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
                  <div className="lg:col-span-3 col-span-6 ">
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
                  <div className="lg:col-span-3 col-span-6 ">
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
                  <div className="lg:col-span-3 col-span-6 ">
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
        <div className="py-10 lg:py-16 bg-white">
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
                  <div className="lg:col-span-3 col-span-6 ">
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
                  <div className="lg:col-span-3 col-span-6 ">
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
                  <div className="lg:col-span-3 col-span-6 ">
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
                  <div className="lg:col-span-3 col-span-6 ">
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

export default PastTransactions;
