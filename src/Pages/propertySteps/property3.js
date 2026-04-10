import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/global/PageLayout";
import { useEffect, useState } from "react";

const PropertyPage3 = () => {
  const history = useNavigate();
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
        <div className="bg-[#f2ecf8] h-full">
          <div className="grid grid-cols-12">
            <div className="xl:col-span-3 md:col-span-4 col-span-12 ">
              <img
                src="/assets/img/auth_img.jpg"
                className="md:h-full h-[300px] w-full object-cover"
                alt=""
              />
            </div>
            <div className="xl:col-span-9 md:col-span-8 col-span-12 md:p-16 p-10">
              <div className="md:max-w-[600px] max-w-[100%] mx-auto flex justify-center flex-col h-full">
                {selectedType === "directory" ? (
                  <h3 className="text-[#47525E] text-[24px] font-[600] mb-10 ">
                    Your property profile on Bookaroo will help you increase your property value{" "}
                    <span className="text-[#319A90] font-[600]">
                      and attract future buyers
                    </span>
                  </h3>
                ) : selectedType === "offmarket" ?
                  (
                    <h3 className="text-[#47525E] text-[24px] font-[600] mb-10 ">
                      Listing your property as Off-market on Bookaroo will help you{" "}
                      <span className="text-[#319A90] font-[600]">
                        collect leads for a future transaction so that even before puting it for sale or rental you will already have buyers or renters.
                      </span>
                    </h3>
                  ) : (
                    <h3 className="text-[#47525E] text-[24px] font-[600] mb-10 ">
                      Your property profile on Bookaroo will help you {selectedType == "rent" ? "rent" : "sell"} faster{" "}
                      <span className="text-[#319A90] font-[600]">
                        at a better price
                      </span>
                    </h3>
                  )}

                <div className="md:max-w-[600px] max-w-[100%]">
                  <ul >
                    <li className="flex items-center my-4">
                      <div className="me-4 p-2 bg-[#bb9fdd] rounded-[8px] w-[60px] h-[60px] flex items-center justify-center">
                        <img
                          src="/assets/img/prop/gallery.png"
                          className="w-[50px] bg-[#976DD0] p-2 rounded-[8px]"
                          alt=""
                        />
                      </div>
                      <div className="w-[90%]">
                        <h6 className="text-[#976DD0] font-[600]">
                          General presentation
                        </h6>
                        <p className="md:text-[16px] text-[14px] text-black">
                          Present your property and it's characteristics. Give
                          maximum details to potential {selectedType === "rent" ? "renters" :
                            (selectedType === "sale" || selectedType === "directory") ? "buyers" : "buyers or renters"}.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center my-4">
                      <div className="me-4 p-2 bg-[#bb9fdd] rounded-[8px] w-[60px] h-[60px] flex items-center justify-center">
                        <img
                          src="/assets/img/prop/star-w.png"
                          className="w-[50px] bg-[#976DD0] p-2 rounded-[8px]"
                          alt=""
                        />
                      </div>
                      <div className="w-[90%]">
                        <h6 className="text-[#976DD0] font-[600]">Highlights</h6>
                        <p className="md:text-[16px] text-[14px] text-black">
                          Present your property and it's characteristics. Put the
                          light on what makes it special
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center my-4 ">
                      <div className="me-4 p-2 bg-[#bb9fdd] rounded-[8px] w-[60px] h-[60px] flex items-center justify-center">
                        <img
                          src="/assets/img/prop/euro.png"
                          className="w-[50px] bg-[#976DD0] p-2 rounded-[8px]"
                          alt=""
                        />
                      </div>
                      <div className="w-[90%]">
                        <h6 className="text-[#976DD0] font-[600] ">
                          Revenues generated
                        </h6>
                        <p className="md:text-[16px] text-[14px] text-black">
                          {selectedType === "offmarket" ?
                            `Increase your property value by sharing revenues generated through short-term or long-term rental.`
                            : (
                              `If you ${selectedType === "rent" ?
                                "are open for renters to occasionnaly do short term rental, "
                                : "rent your property long term rental or short term (airbnb...) "}
                                indicates roughtly the revenue you generate on
                          yearly basis.`
                            )}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center my-4">
                      <div className="me-4 p-2 bg-[#bb9fdd] rounded-[8px] w-[60px] h-[60px] flex items-center justify-center">
                        <img
                          src="/assets/img/prop/file.png"
                          className="w-[50px] bg-[#976DD0] p-2 rounded-[8px]"
                          alt=""
                        />
                      </div>
                      <div className="w-[90%]">
                        <h6 className="text-[#976DD0] font-[600]">
                          Living expenses
                        </h6>
                        <p className="md:text-[16px] text-[14px] text-black">
                          Indicates the living expenses related to your property to
                          help people better project themself
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center my-4">
                      <div className="me-4 p-2 bg-[#bb9fdd] rounded-[8px] w-[60px] h-[60px] flex items-center justify-center">
                        <img
                          src="/assets/img/prop/stick.png"
                          className="w-[50px]  bg-[#976DD0] xl:p-3 p-1 rounded-[8px]"
                          alt=""
                        />
                      </div>
                      <div className="w-[90%]">
                        <h6 className="text-[#976DD0] font-[600]">
                          Improvement works performed
                        </h6>
                        <p className="md:text-[16px] text-[14px] text-black">
                          You have invested money in your property to do some
                          rework, mention it {selectedType === "offmarket" ?
                            "and show the great work done" : "!"}
                        </p>
                      </div>
                    </li>
                    {selectedType === "offmarket" && (
                      <li className="flex items-center my-4">
                        <div className="me-4 p-2 bg-[#bb9fdd] rounded-[8px] w-[60px] h-[60px] flex items-center justify-center">
                          <img
                            src="/assets/img/prop/stick.png"
                            className="w-[50px]  bg-[#976DD0] xl:p-3 p-1 rounded-[8px]"
                            alt=""
                          />
                        </div>
                        <div className="w-[90%]">
                          <h6 className="text-[#976DD0] font-[600]">
                            Property lifetime events timeline
                          </h6>
                          <p className="md:text-[16px] text-[14px] text-black">
                            Your property lifetime major events will be shared in the timeline and will bring trust and confidence.
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                  <div className="mt-10 flex items-center justify-center">
                    <button onClick={() => history('/property/add')} className="h-12 bg-[#48464a] rounded-full w-[300px] px-10 text-[18px] font-medium text-center text-white hover:opacity-80 transition-all signup-btn">
                      Start
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default PropertyPage3;
