import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useEffect, useState } from "react";

const PropertyPage2 = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  useEffect(() => {
    const step1 = JSON.parse(localStorage.getItem("step1"));
    if (step1) {
      setSelectedType(step1?.propertyType);
    }
  }, []);

  return (
    <>
      <PageLayout>
        <div className="pt-14 lg:pt-16 bg-[#f2ecf8] h-full">
          <div className="container items-center  px-8 mx-auto xl:px-5 h-full">
            <ul className="flex items-center">
              <li onClick={()=>navigate("/property1")} className="text-[#47525E] cursor-pointer after">List your property <span className="mx-[4px]">|</span></li>
              <li className="text-[#47525E] cursor-pointer capitalize">{selectedType === "offmarket" ? "Off-Market" : selectedType}</li>
            </ul>
            <h4 className="text-[#47525E] font-[600] text-[28px] text-center pb-16 pt-12">
              {selectedType === "offmarket" ?
                "Put your property on the Off-market on your own or get help from a pro" :
                `${selectedType === "rent" ? "Rent" : "Sell"
                } on your own or get help from a pro,`}
              <span className="text-[#8EC8C2]"> it's your choice!</span>
            </h4>

            <div className="grid grid-cols-12 lg:gap-12 gap-0 pb-20">
              <div className="lg:col-span-6 col-span-full bg-white rounded-[7px] lg:p-12 p-6 border border-[#BEBEBE] flex flex-col justify-between lg:mb-0 mb-5">
                <div>
                  <span className="text-[#339B91] text-[14px] mb-5 block">On your own</span>
                  <h4 className="text-black font-[600] text-[20px] mb-5">
                    {selectedType === "offmarket" ?
                      "Put your property on the market without the constraints of public Market" :
                      `${selectedType === "rent" ? "Rent" : "Sell"
                      } your property on your own at your own pace`}
                  </h4>
                  <p className="mb-2 text-black text-sm">Do it all yourself - from photos to signing.</p>
                  <ul>
                    <li className="flex items-center text-black text-sm my-2">
                      <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                      It's totally free for individuals
                    </li>
                    <li className="flex items-center text-black text-sm my-2">
                      <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                      Share key informations on your property profile
                    </li>
                    <li className="flex items-center text-black text-sm my-2">
                      <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                      Property profile is designed to boost your
                    </li>
                    <li className="flex items-center text-black text-sm my-2">
                      <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                      property attractivity
                    </li>
                    <li className="flex items-center text-black text-sm my-2">
                      <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                      Use internal chat to discuss with potential buyers
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center w-full mt-8">
                  <button onClick={() => navigate('/property3')} className="h-12 bg-[#48464a] rounded-full w-60 font-medium text-center text-white hover:opacity-80 transition-all signup-btn">List my Property</button>
                </div>
              </div>
              <div className="lg:col-span-6 col-span-full bg-white rounded-[7px] lg:p-12 p-6 border border-[#BEBEBE] flex flex-col justify-between">
                <div>
                  <span className="text-[#339B91] text-[14px] mb-5 block">Get valuable support</span>
                  <h4 className="text-black font-[600] text-[20px] mb-5">
                    {selectedType === "rent" ? "Rent" : "Sell"} with a real estate agency, with confidence
                  </h4>
                  <p className="mb-2 text-black text-sm">Get help from an expert at each steps of your project.</p>
                  <ul>
                    <li className="flex items-center text-black text-sm my-2">
                      <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                      Personalized estimate of {selectedType === "rent" ? "rent" : "selling"} price
                    </li>
                    {selectedType === "rent" ? (
                      <>
                        <li className="flex items-center text-black text-sm my-2">
                          <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                          Renter selection & visit management
                        </li>
                        <li className="flex items-center text-black text-sm my-2">
                          <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                          Managing contract signing
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center text-black text-sm my-2">
                          <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                          Share key Buyer selection & visit management
                        </li>
                        <li className="flex items-center text-black text-sm my-2">
                          <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                          Help with negotiating the sale price
                        </li>
                      </>
                    )}

                    <li className="flex items-center text-black text-sm my-2">
                      <span className="bg-[#C2C5C8] w-[12px] h-[12px] rounded-full me-2"></span>
                      Local expertise & advice on your project
                    </li>

                  </ul>
                </div>
                <div className="flex items-center justify-center w-full mt-8">
                  <button className="h-12 bg-[#48464a] rounded-full w-60 font-medium text-center text-white hover:opacity-80 transition-all signup-btn">Get help from local agency</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default PropertyPage2;
