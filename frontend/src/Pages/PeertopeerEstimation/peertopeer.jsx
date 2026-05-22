import { useEffect, useState } from "react";
import PageLayout from "../../components/global/PageLayout";
import { FaRegStar, FaRegUser } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import socket from "../../config/ChatSocket/socket";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { useSelector } from "react-redux";

const PeerToPeer = () => {
  const [value, setValue] = useState(10000);
  const { user } = useSelector((state) => state);
  const [data, setdata] = useState();
  const history = useNavigate();
  const formatNumberWithSpaces = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0";

    let str = parseInt(num, 10).toString();

    // First, take out last 3 digits
    let lastThree = str.slice(-3);
    let otherNumbers = str.slice(0, -3);

    if (otherNumbers !== "") {
      lastThree = " " + lastThree;
    }
    console.log(
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, " ") + lastThree,
      "datanumber"
    );
    // Add spaces after every 2 digits in the remaining part
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, " ") + lastThree;
  };

  useEffect(() => {
    if (user?.loggedIn) {
      ApiClient.get("peerCampaign/analytics").then((res) => {
        if (res.success) {
          setdata(res?.data);
        }
        loader(false);
      });
    }

  }, [user?.loggedIn]);

  return (
    <PageLayout>
      <section className="py-10 bg-[#976DD0]/40">
        <div className="container mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-10  items-center">
            <div className="lg:col-span-2 lg:pe-10">
              <h5 className="text-[16px] text-[#976DD0] font-[600]">
                PeerToPeer Property estimation
              </h5>
              <h3 className="text-[28px] leading-tight font-[600] mt-1">
                The right price for a real estate property is the one someone
                else is ready to pay.
              </h3>
              <p className="text-[16px] leading-tight mt-3">
                With Social real-estate estimation Bookaroo community tells you
                how much and why they value your property.{" "}
              </p>
              <div className="flex gap-5 items-center justify-center mt-10">
                <button
                  className="border border-[#976DD0] text-[#976DD0] rounded-full px-4 py-1.5"
                  onClick={(e) => history("/social-estimation")}
                >
                  Submit your property
                </button>
                <button
                  className="border border-[#976DD0] text-[#976DD0] rounded-full px-4 py-1.5"
                  onClick={(e) => history("/estimation")}
                >
                  Estimate properties
                </button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="relative w-full min-h-[450px] rounded-[20px] bg-cover bg-center bg-[url('/assets/img/peertopeer-banner.jpg')]">
                <div className="sm:w-[320px] h-full bg-[#fff] rounded-[20px] ml-auto p-4">
                  <h4 className="text-center text-[18px] leading-tight text-[#5A5A5A]">
                    What do you think about this property?
                  </h4>
                  <h5 className="text-[16px] text-[#47525E] mb-2">
                    You think reference price is:
                  </h5>
                  <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-3 mb-2">
                    {["underestimated", "appropriate", "expensive"].map(
                      (type, i) => (
                        <button
                          key={type}
                          className={`${i == 0
                            ? "bg-[#976DD0] text-[#fff]"
                            : "bg-[#E6E6E6] text-[#000]"
                            } rounded-[6px] px-3 py-1 text-[12px] `}
                        // onClick={() =>
                        //   setForm({ ...form, referencePrice: type })
                        // }
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                  <h5 className="text-[15px] text-[#47525E]">
                    What would be a reasonable price?
                  </h5>
                  <h5 className="text-[16px] text-[#47525E] mb-0 text-center font-[600]">
                    8 00 000 €
                  </h5>

                  <div className="w-full max-w-md mx-auto mb-1">
                    <div className="flex justify-between items-center px-2 mb-2 text-gray-600 font-bold select-none">
                      <p
                        // onClick={() => setValue((v) => Math.max(0, v - 1000))}
                        aria-label="Decrease"
                        className=" border rounded-full  leading-none flex justify-center items-center w-[25px] h-[25px] text-gray-400"
                      >
                        &minus;
                      </p>
                      <div className="text-center mt-2 text-gray-600 font-medium">
                        {/* {value.toLocaleString()} */}
                        {formatNumberWithSpaces(value)} €
                      </div>
                      <p
                        // onClick={() =>
                        //   // setValue((v) => Math.min(20000, v + 1000))
                        // }
                        aria-label="Increase"
                        className=" border rounded-full leading-none flex justify-center items-center w-[25px] h-[25px] text-gray-400"
                      >
                        +
                      </p>
                    </div>

                    {/* Slider */}
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="1000"
                      value={value}
                      // onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full h-4 rounded-full 
                   bg-[#9b51e0]
                   appearance-none
                focus:outline-none
                accent-[#fff]
                   "
                    />
                  </div>
                  <h5 className="text-[16px] text-[#47525E] mb-1">
                    How would you rate:
                  </h5>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <p className="text-[#47525E] opacity-[0.8] text-[14px]">
                      Property title
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                    </div>
                    <p className="text-[#47525E] opacity-[0.8] text-[14px]">
                      Property pictures
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                    </div>
                    <p className="text-[#47525E] opacity-[0.8] text-[14px]">
                      Property interior design
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                    </div>
                    <p className="text-[#47525E] opacity-[0.8] text-[14px]">
                      Property location
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                    </div>
                    <p className="text-[#47525E] opacity-[0.8] text-[14px]">
                      Could you live in?
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                      <FaRegStar size={19} />
                    </div>
                  </div>
                  <div className="mt-3">

                    <textarea
                      className="bg-white rounded-[7px] border-gray-300 border-[1px] outline-none focus:border-[#976DD0] p-2 px-3  md:w-[500px] w-full text-[#5A5A5A]"
                      placeholder="Advice/Comment for owner"
                      rows={2}
                      type="text"
                      disabled
                    // value={form.comment}
                    // onChange={(e) => {
                    //   setForm({
                    //     ...form,
                    //     comment: e.target.value,
                    //   });
                    // }}
                    ></textarea>
                  </div>
                  <div className="text-center my-2">
                    <p className="bg-[#976DD0] rounded-full hover:opacity-80 px-10 py-1.5 pointer-events-none text-[#fff]">
                      Submit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-5">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-[24px] font-[600] mb-1">How it works?</h3>
            <p className="text-[#5A6978] text-[16px]">
              Social estimation let you know what are the strengh of your
              property and what improvement can be done to sale your property
              quicker and at a better price.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row flex-wrap justify-center xl:justify-between gap-10">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="sm:w-[120px] sm:text-start ">
                <h3 className="bg-gray-300 mx-auto w-[35px] h-[35px] rounded-full flex items-center justify-center font-[600] mb-2">
                  1
                </h3>
                <h3 className="font-[600] leading-tight">
                  Create your property profile
                </h3>
                <p className="text-[#5A6978] text-[14px]">
                  It takes no more than 5 minutes.
                </p>
              </div>
              <div>
                <img
                  src="/assets/img/img-1.png"
                  alt="img"
                  className="border rounded-[20px] h-[350px] sm:h-[260px] sm:w-[200px]"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="sm:w-[150px] sm:text-start">
                <h3 className="bg-gray-300 mx-auto w-[35px] h-[35px] rounded-full flex items-center justify-center font-[600] mb-2">
                  2
                </h3>
                <h3 className="font-[600] leading-tight">
                  Our local members estimate it
                </h3>
                <p className="text-[#5A6978] text-[14px]">
                  During one week our community estimate your property value and
                  earn Bookaroo coins.
                </p>
              </div>
              <div className="">
                <img
                  src="/assets/img/multi-images.png"
                  alt="img"
                  className="rounded-[20px] h-[250px] w-[200px]"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="sm:w-[150px] sm:text-start">
                <h3 className="bg-gray-300 mx-auto w-[35px] h-[35px] rounded-full flex items-center justify-center font-[600] mb-2">
                  3
                </h3>
                <h3 className="font-[600] leading-tight">
                  You get an assessment report
                </h3>
                <p className="text-[#5A6978] text-[14px]">
                  Report shows social estimated price and details on what they
                  value.
                </p>
              </div>
              <div className="">
                <img
                  src="/assets/img/img-2.png"
                  alt="img"
                  className="border rounded-[20px] h-[350px] sm:h-[260px] sm:w-[200px]"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-10 items-center justify-center mt-10">
            <button
              className="border border-[#976DD0] text-[#976DD0] rounded-full px-4 py-1.5"
              onClick={(e) => history("/social-estimation")}
            >
              Submit your property
            </button>
            <button
              className="bg-[#976DD0] text-[#fff] rounded-full px-4 py-1.5"
              onClick={(e) => history("/estimation")}
            >
              Estimate properties
            </button>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="container mx-auto px-5 lg:px-10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-[24px] font-[600] mb-1">
              Our community in action !
            </h3>
            <p className="text-[#5A6978] text-[16px]">
              Everyday our members help each other defining the right price for
              their property
            </p>
          </div>

          {data?.topEstimators?.map((item) => {
            return (
              <>
                {" "}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <img
                      src="/assets/img/person.jpg"
                      alt="img"
                      className="rounded-full w-[50px] h-[50px] object-cover"
                    />
                    <div>
                      <h5 className="text-[#000] text-[13px] leading-tight">
                        {item?.fullName}
                      </h5>
                      {/* <h5 className="text-[#5A6978] text-[13px] leading-tight">
                      Web developer <br />
                      Lille, France
                    </h5> */}
                    </div>
                  </div>
                  <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* <h3 className="text-[#5A6978] text-[20px] font-[600]">#1</h3> */}
                    <div className="bg-[#976DD0] rounded-full h-[8px] w-[100%]"></div>
                    <h3 className="text-[#5A6978] text-[20px] font-[600]">
                      {item?.totalEstimations}{" "}
                      <span className="text-[18px] font-[500]">
                        Properties estimated
                      </span>
                    </h3>
                  </div>
                </div>
              </>
            );
          })}

          <div className="flex  justify-center mt-10">
            <button
              className="bg-[#976DD0] text-[#fff] rounded-full px-4 py-1.5"
              onClick={(e) => history("/estimation")}
            >
              Estimate properties
            </button>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="container mx-auto px-5 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-4">
            <div className="text-center w-[200px] mx-auto">
              <FaRegUser size={26} className="mx-auto" />
              <h4 className="text-[18px] leading-tight font-[600] mt-3">
                {data?.activeEstimators} active estimators
              </h4>
            </div>
            <div className="text-center w-[250px] mx-auto">
              <FaRegStar size={26} className="mx-auto" />
              <h4 className="text-[18px] leading-tight font-[600] mt-3">
                {data?.totalEstimationsPerformed} peer to peer estimations
                performed
              </h4>
            </div>
            <div className="text-center w-[250px] mx-auto">
              <AiOutlineYoutube size={26} className="mx-auto" />
              <h4 className="text-[18px] leading-tight font-[600] mt-3">
                {data?.totalPropertiesPerformed} Properties estimated
              </h4>
            </div>
          </div>
          <div className="flex  justify-center mt-10">
            <button
              className="border border-[#976DD0] text-[#976DD0] rounded-full px-4 py-1.5"
              onClick={(e) => history("/social-estimation")}
            >
              Estimate your property
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};
export default PeerToPeer;
