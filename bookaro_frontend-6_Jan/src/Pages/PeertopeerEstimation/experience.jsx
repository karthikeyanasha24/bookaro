import { useState } from "react";
import PageLayout from "../../components/global/PageLayout";
import { FaRegStar, FaRegUser } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";
import { IoLogoAndroid, IoLogoApple } from "react-icons/io";

const Experience = () => {
  const [value, setValue] = useState(10000);
  return (
    <PageLayout>
      <section className="py-10 bg-[#976DD0]/40">
        <div className="container mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-10  items-center">
            <div className="lg:col-span-2 lg:pe-10">
              <h5 className="text-[16px] text-[#976DD0] font-[600]">
                Experience based property search
              </h5>
              <h3 className="text-[28px] leading-tight font-[600] mt-1">
                Get notified when you are nearby a property that matches your
                requirements
              </h3>
              <p className="text-[16px] leading-tight mt-3">
                AroundMe reveals hidden opportunities as you walk through the
                city. Contact owners to engage conversation.
              </p>
              <h5 className="text-[14px] text-[#976DD0] font-[600] mt-4">
                Install App to activate AroundMe
              </h5>
              <div className="flex gap-4 flex-wrap items-center mt-3">
                <button>
                  <IoLogoAndroid size={40} />
                </button>
                <button>
                  <IoLogoApple size={40} />
                </button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="relative w-full min-h-[450px] rounded-[20px] bg-cover bg-center bg-[url('/assets/img/peertopeer-banner.jpg')]">
                <div className="sm:w-[320px] h-full bg-[#fff] rounded-[20px] ml-auto p-4">
                  <h4 className="text-center text-[20px] leading-tight text-[#5A5A5A] mb-4">
                    What do you think about this property?
                  </h4>
                  <h5 className="text-[16px] text-[#47525E] mb-2">
                    You think reference price is:
                  </h5>
                  <div className="flex justify-between items-center gap-3 mb-3">
                    <button className="bg-[#976DD0] rounded-[6px] px-5 py-0.5 text-[14px]  text-[#fff]">
                      Cheap
                    </button>
                    <button className="bg-[#E6E6E6] rounded-[6px] px-5 py-0.5  text-[14px] text-[#47525E]">
                      Ok
                    </button>
                    <button className="bg-[#E6E6E6] rounded-[6px] px-5 py-0.5  text-[14px] text-[#47525E]">
                      Expensive
                    </button>
                  </div>
                  <h5 className="text-[16px] text-[#47525E]">
                    What would be a reasonable price?
                  </h5>
                  <h5 className="text-[17px] text-[#47525E] mb-0 text-center font-[600]">
                    800 000 €
                  </h5>

                  <div className="w-full max-w-md mx-auto mb-2">
                    <div className="flex justify-between items-center px-2 mb-2 text-gray-600 font-bold select-none">
                      <button
                        onClick={() => setValue((v) => Math.max(0, v - 1000))}
                        aria-label="Decrease"
                        className="cursor-pointer border rounded-full  leading-none flex justify-center items-center w-[25px] h-[25px] text-gray-400"
                      >
                        &minus;
                      </button>
                      <div className="text-center mt-2 text-gray-600 font-medium">
                        {value.toLocaleString()} €
                      </div>
                      <button
                        onClick={() =>
                          setValue((v) => Math.min(20000, v + 1000))
                        }
                        aria-label="Increase"
                        className="cursor-pointer border rounded-full leading-none flex justify-center items-center w-[25px] h-[25px] text-gray-400"
                      >
                        +
                      </button>
                    </div>

                    {/* Slider */}
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="1000"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full h-4 rounded-full cursor-pointer
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
                    <p className="text-[#47525E] opacity-[0.8] text-[15px]">
                      Property title
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                    </div>
                    <p className="text-[#47525E] opacity-[0.8] text-[15px]">
                      Property pictures
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                    </div>
                    <p className="text-[#47525E] opacity-[0.8] text-[15px]">
                      Property interior design
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                    </div>
                    <p className="text-[#47525E] opacity-[0.8] text-[15px]">
                      Property location
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                    </div>
                    <p className="text-[#47525E] opacity-[0.8] text-[15px]">
                      Could you live in?
                    </p>
                    <div className="flex justify-between items-center">
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                      <FaRegStar size={20} />
                    </div>
                  </div>
                  <div className="text-center my-6">
                    <button className="bg-[#976DD0] rounded-full hover:opacity-80 px-10 py-1.5 text-[#fff]">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 md:py-20 bg-[#fff]">
        <div className="container mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-6 items-center gap-4">
            <div className="lg:col-span-4">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-12 items-start">
                <div>
                  <span className="inline-block text-[16px] border border-[#976DD0] rounded-full px-4 py-1 font-[600]">
                    More choices
                  </span>
                  <p className="text-[13px] text-[#5A6978] mt-2">
                    With AroundMe you are not limited to properties that are on
                    the market. Your future property is probably in our
                    Directory.
                  </p>
                </div>
                <div>
                  <span className="inline-block text-[16px] border border-[#976DD0] rounded-full px-4 py-1 font-[600]">
                    Experience based search
                  </span>
                  <p className="text-[13px] text-[#5A6978] mt-2">
                    Good surpises happen. You end-upin a neighborhood you did
                    not consider but finally find it enjoyable ! Around me sends
                    you matching properties
                  </p>
                </div>
                <div>
                  <span className="inline-block text-[16px] border border-[#976DD0] rounded-full px-4 py-1 font-[600]">
                    Anticipation
                  </span>
                  <p className="text-[13px] text-[#5A6978] mt-2">
                    AroundMe allows you to find the property that matches 100%
                    your criterion. Now you have time to engage conversation
                    with the owner for a direct or future sale.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 text-end ps-12">
              <h5 className="text-[16px] text-[#976DD0] font-[600]">
                A game changing feature
              </h5>
              <h3 className="text-[28px] leading-tight font-[600] mt-1">
                AroundMe is a new and unique way to search a property with
                endless opportunities
              </h3>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 bg-[#976DD0]/10 md:py-20">
        <div className="container mx-auto px-5">
          <div className="text-center w-[70%] mx-auto mb-8">
            <h3 className="text-[24px] font-[600] mb-1">How it works?</h3>
            <p className="text-[#5A6978] text-[16px]">
              With around me you get notified lively when you are near a
              property that match your search and location criterion. In order
              to increase your chances and allow unexpected surprises you also
              get notified for matching properties in your daily commute.
            </p>
          </div>
          <div className="w-[80%] mx-auto items-start flex flex-col sm:flex-row flex-wrap justify-center md:justify-between gap-10">
            <div className="">
              <div className="sm:w-[150px] sm:text-start ">
                <h3 className="bg-gray-300 mx-auto w-[35px] h-[35px] rounded-full flex items-center justify-center font-[600] mb-2">
                  1
                </h3>
                <h3 className="font-[600] leading-tight">
                  Download our mobile App
                </h3>
                <p className="text-[#5A6978] text-[14px]">
                  AroundMe requires a mobile App and an access to your location.
                </p>
              </div>
            </div>
            <div className="">
              <div className="sm:w-[150px] sm:text-start">
                <h3 className="bg-gray-300 mx-auto w-[35px] h-[35px] rounded-full flex items-center justify-center font-[600] mb-2">
                  2
                </h3>
                <h3 className="font-[600] leading-tight">
                  Activate AroundMe search
                </h3>
                <p className="text-[#5A6978] text-[14px]">
                  Set properties criterion and launch your AroundMe search.
                </p>
              </div>
            </div>
            <div className="">
              <div className="sm:w-[150px] sm:text-start">
                <h3 className="bg-gray-300 mx-auto w-[35px] h-[35px] rounded-full flex items-center justify-center font-[600] mb-2">
                  3
                </h3>
                <h3 className="font-[600] leading-tight">
                  Be alerted as you walk the city
                </h3>
                <p className="text-[#5A6978] text-[14px]">
                  Receive live alerts for unique opportunities as you cross the
                  city.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-10 ">
        <div className="container mx-auto px-5">
          <div className="text-center w-[70%] mx-auto mb-8">
            <h3 className="text-[24px] font-[600] mb-1">AroundMe</h3>
            <p className="text-[#5A6978] text-[16px]">
              Here are matching properties your were around. Older matchs gets
              removed after one month.
            </p>
          </div>
          <h4 className="text-[#5A6978] font-[600] text-[18px]">
            House (+1) for sell between 500K€ and 1 M€, from 80 to 150 sqm with
            4+ rooms and generating a revenue of at least 10 000 € per year, (+
            5 other criterion){" "}
          </h4>
        </div>
      </section>
    </PageLayout>
  );
};
export default Experience;
