import React from 'react'
import PageLayout from '../../components/global/PageLayout'
import { FaRegStar } from "react-icons/fa";


const Transaction4 = () => {
  return (
    <PageLayout>
      {/* Banner html code  */}
        <div className='container-fluid h-[100%] bg-[#976dd054] 2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px]'>
          <div className='grid h-[100%] grid-cols-12'>
            <div className='col-span-12 mt-[5rem] md:col-span-6 text-left flex flex-col justify-center items-start lg:mt-0 w-[300px] xs:w-[50%] sm:w-[50%] lg:w-[80%]'>
              <h6 className='text-[#976DD0] font-semibold text-[15px] sm:text-[20px] leading-[35px]'>
                Transaction managing tool
              </h6>
              <h1 className='text-[#000] sm:text-[18px] md:text-[20px] lg:text-[25px] xl:text-[35px] font-semibold mb-4'>
                The only tool to secure and ease the transaction process both for seller and buyer
              </h1>
              <p className='text-[12px] sm:text-[16px] w-[100%] sm:w-[62%] text-left font-medium'>
                The transaction monitoring tool guides you through all steps of your transaction with customized guidance and automated actions to save your time.
              </p>
              <button className='border-2 border-[#976DD0] text-[12px] sm:text-[14px] rounded-full text-[#976DD0] px-1 sm:px-3 py-1 sm:py-2 w-[110px] sm:w-[150px] mt-6'>
                <span className='mb-[2px] inline-block'>Sell my property</span>
              </button>
            </div>
            <div className='col-span-12 md:col-span-6 py-10 flex items-center'>
              <div className='grid grid-cols-12 bg-[url(assets/img/prop-three.jpg)] rounded-[20px] bg-cover bg-left'>
                <div className='col-span-6 p-5 sm:p-7'>
                  <div className='bg-[#000] text-[#fff] px-3 py-4 rounded-[15px]'>
                    <div className='flex flex-wrap gap-2 sm:flex-nowrap justify-center items-center'>
                      <img src='assets/img/location-1.png' className='h-[20px] sm:h-[30px] w-[20px] sm:w-[40px]'></img>
                      <p className='text-[10px] sm:text-[14px]'>You were near this appartment yesterday</p>
                    </div>
                  </div>
                </div>
                <div className='col-span-6 p-3 sm:p-5 bg-[#fff] rounded-[20px]'>
                  <h2 className='text-center text-[14px] sm:text-[18px] text-[#5A5A5A] font-semibold w-[80%] mx-auto'>
                    What do you think about this property?
                  </h2>
                  <p className='mt-7 text-[#47525E] text-[13px] font-semibold sm:text-[15px]'>You think refrence price is:</p>
                  <div className='flex flex-wrap justify-between gap-3 xl:gap-0 mt-1'>
                    <button className='px-2 mx-auto xl:mx-0 w-[80px] text-[10px] sm:text-[12px] rounded-[5px] py-1 bg-[#976DD0] text-[#fff]'>
                      Cheap
                    </button>
                    <button className='px-2 mx-auto xl:mx-0 w-[80px] text-[10px] sm:text-[12px] rounded-[5px] py-1 bg-[#E6E6E6] text-[#47525E]'>
                      OK
                    </button>
                    <button className='px-2 mx-auto xl:mx-0 w-[80px] text-[10px] sm:text-[12px] rounded-[5px] py-1 bg-[#E6E6E6] text-[#47525E]'>
                      Expensive
                    </button>
                  </div>
                  <p className='mt-4 text-[#47525E] text-[14px] font-semibold sm:text-[16px]'>What would be a reasonable price?</p>
                  <div>

                  </div>
                  <p className='mt-5 mb-2 text-[#47525E] text-[12px] sm:text-[15px] font-semibold'>How would you rate:</p>
                  <div className='flex justify-between mb-2 flex-wrap sm:flex-nowrap'>
                    <span className="text-[14px] text-[#47525E]">Property title</span>
                    <div className='flex gap-1'>
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                    </div>
                  </div>
                  <div className='flex justify-between mb-2 flex-wrap sm:flex-nowrap'>
                    <span className="text-[14px] text-[#47525E]">Property pictures</span>
                    <div className='flex gap-1'>
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                    </div>
                  </div>
                  <div className='flex justify-between mb-2 flex-wrap sm:flex-nowrap'>
                    <span className="text-[14px] text-[#47525E]">Property interior design
                    </span>
                    <div className='flex gap-1'>
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                    </div>
                  </div>
                  <div className='flex justify-between mb-2 flex-wrap sm:flex-nowrap'>
                    <span className="text-[14px] text-[#47525E]">Property location
                    </span>
                    <div className='flex gap-1'>
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                    </div>
                  </div>
                  <div className='flex justify-between mb-2 flex-wrap sm:flex-nowrap'>
                    <span className="text-[14px] text-[#47525E]">Could you live in?
                    </span>
                    <div className='flex gap-1'>
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                      <FaRegStar className='cursor-pointer' />
                    </div>
                  </div>
                  <button className='bg-[#976DD0] px-[2rem] text-[10px] sm:text-[15px] sm:px-[3rem] py-2 mx-auto mt-7 mb-7 block rounded-full text-[#fff]'>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Working section html code */}
      <div className='container-fluid 2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px] bg-[#fff] py-[5rem] h-[100%] pb-[5rem]'>
        <div className='w-[100%] sm:w-[40%] mx-auto'>
          <h2 className='text-center text-[#000000] font-bold text-[20px] leading-[45px]'>
            How it works?
          </h2>
          <p className='text-[#5A6978] text-[14px] text-center'>
            Social estimation let you know what are the strengh of your property and what improvement can be done to sale your property quicker and at a better price.
          </p>
        </div>
        <div className='grid grid-cols-12 gap-5 mt-10 flex-wrap'>
          <div className='col-span-12 sm:col-span-6 lg:col-span-4'>
            <div className='grid grid-cols-12 justify-center flex-wrap lg:flex-nowrap'>
              <div className='p-5 col-span-6 mt-5 sm:mt-10'>
                <p className='mx-auto mb-4 flex items-center justify-center font-bold w-[40px] h-[40px] text-[#47525E] bg-[#DBDBDB] rounded-full'>
                  1
                </p>
                <h3 className='text-[12px] sm:text-[17px] font-semibold'>
                  Create your property profile
                </h3>
                <h4 className='text-[#5A6978] text-[10px] sm:text-[14px]'>
                  It takes no more than 5 minutes.
                </h4>
              </div>
              <div className='border col-span-6 border-[#D2D2D2] rounded-[20px]'>
                <img src='assets/img/prop-two.jpg' className='rounded-[20px] h-[130px] w-[250px] object-cover'></img>
                <div className='p-2'>
                  <h3 className='text-[#47525E] text-[12px] font-semibold'>Beautiful house in normandy</h3>
                  <p className='text-[#47525E] text-[10px]'>Dieppe, 76200
                  </p>
                  <div className='mt-2 flex gap-2'>
                    <span className='flex gap-1'><img src='assets/img/bed.png' className='w-[15px]'></img><span className='text-[10px] text-[#47525E]'>320m2</span></span>
                    <span className='flex gap-1'><img src='assets/img/bed.png' className='w-[15px]'></img><span className='text-[10px] text-[#47525E]'>4</span></span>
                    <span className='flex gap-1'><img src='assets/img/bed.png' className='w-[15px]'></img><span className='text-[10px] text-[#47525E]'>2</span></span>
                  </div>
                  <h2 className='text-[#6D6E6D] text-[14px] font-semibold mt-2'>2 500 000 € <span className='text-[#47525E] text-[10px] font-medium ml-3'>7 800€ /Sqm
                  </span>
                  </h2>
                </div>
                <div className='bg-[#000] py-1 px-3 text-[#fff]'>
                  <h2 className='text-[12px] text-center'>Property Attractivity</h2>
                  <div className='flex justify-evenly my-1'>
                    <div className='flex gap-1 items-center'>
                      <img src='assets/img/heart-1.png' className='w-[15px] h-[15px]'></img>
                      <span className='text-[12px]'>15</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                      <img src='assets/img/view-1.png' className='w-[15px] h-[15px]'></img>
                      <span className='text-[12px]'>30</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                      <img src='assets/img/share-1.png' className='w-[15px] h-[15px]'></img>
                      <span className='text-[12px]'>2</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                      <img src='assets/img/user-2.png' className='w-[15px] h-[15px]'></img>
                      <span className='text-[12px]'>50</span>
                    </div>
                  </div>
                </div>
                <div className='flex justify-center gap-2 my-3'>
                  <img src='assets/img/house_2.png' className='border border-[#8492A6] rounded-full w-[20px] p-1'></img>
                  <img src='assets/img/heart-black.png' className='w-[20px]'></img>
                </div>
              </div>
            </div>
          </div>
          <div className='col-span-12 sm:col-span-6 lg:col-span-4'>
            <div className='grid grid-cols-12 justify-center h-100 flex-wrap lg:flex-nowrap'>
              <div className='p-5 col-span-6 mt-5 sm:mt-10'>
                <p className='mx-auto mb-4 flex items-center justify-center font-bold w-[40px] h-[40px] text-[#47525E] bg-[#DBDBDB] rounded-full'>
                  2
                </p>
                <h3 className='text-[12px] sm:text-[16px] font-semibold'>
                  Our local members estimate it
                </h3>
                <h4 className='text-[#5A6978] text-[10px] sm:text-[13px]'>
                  During one week our community estimate your property value and earn Bookaroo coins.
                </h4>
              </div>
              <div className='col-span-6'>
                <img src='assets/img/frame_575.png' className='h-100 object-contain'></img>
              </div>
            </div>
          </div>
          <div className='col-span-12 sm:col-span-6 lg:col-span-4'>
            <div className='grid grid-cols-12 justify-center flex-wrap lg:flex-nowrap'>
              <div className='p-5 col-span-6 mt-5 sm:mt-10'>
                <p className='mx-auto mb-4 flex items-center justify-center font-bold w-[40px] h-[40px] text-[#47525E] bg-[#DBDBDB] rounded-full'>
                  3
                </p>
                <h3 className='text-[12px] sm:text-[16px] font-semibold'>
                  You get an assessment report
                </h3>
                <h4 className='text-[#5A6978] text-[10px] sm:text-[13px]'>
                  Report shows social estimated price and details on what they value.
                </h4>
              </div>
              <div className='border col-span-6 border-[#D2D2D2] rounded-[20px]'>
                <img src='assets/img/prop-two.jpg' className='rounded-[20px] h-[130px] w-[250px] object-cover'></img>
                <div className='p-2'>
                  <h2 className='text-[#000] text-[14px] font-bold mt-2'>844 000 €
                    <span className='text-[#000] text-[10px] font-medium ml-3'>12 000 /sqm
                    </span>
                  </h2>
                  <div className='flex justify-between mb-2 mt-2'>
                    <span className="text-[12px] text-[#47525E]">Title

                    </span>
                    <div className='flex gap-1'>
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                    </div>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <span className="text-[12px] text-[#47525E]">Pictures

                    </span>
                    <div className='flex gap-1'>
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                    </div>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <span className="text-[12px] text-[#47525E]">Interior design

                    </span>
                    <div className='flex gap-1'>
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                    </div>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <span className="text-[12px] text-[#47525E]">Location

                    </span>
                    <div className='flex gap-1'>
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                    </div>
                  </div>
                  <div className='flex justify-between mb-2'>
                    <span className="text-[12px] text-[#47525E]">Live in?

                    </span>
                    <div className='flex gap-1'>
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                      <FaRegStar className='text-[14px]' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex gap-5 justify-center mt-[4rem]'>
          <button className='border-2 border-[#976DD0] text-[9px] sm:text-[14px] rounded-full text-[#976DD0] px-1 sm:px-3 py-2 w-[110px] sm:w-[200px]'>
            Submit your property
          </button>
          <button className='border-2 border-[#976DD0] bg-[#976DD0] text-[9px] sm:text-[14px] rounded-full text-[#fff] px-1 sm:px-3 py-2 w-[110px] sm:w-[200px]'>
            Estimates properties
          </button>
        </div>
      </div>

      {/* Features section html code  */}
      <div className='container-fluid 2xl:px-[120px] xl:px-[60px] md:px-[40px] px-[20px] bg-[#fff] h-[100%] pb-[5rem]'>
        <div className='w-[100%] sm:w-[35%] mx-auto'>
          <h2 className='text-center text-[#000000] font-bold text-[20px] leading-[45px]'>
            Coins? What for?
          </h2>
          <p className='text-[#5A6978] text-[14px] text-center'>
            Coins earned while assessing properties value can be used several ways on Bookaroo
          </p>
        </div>
        <div className='grid grid-cols-12 gap-y-[2rem] sm:gap-y-[5rem] mt-10'>
          <div className='col-span-12 sm:col-span-6 md:col-span-4'>
            <div className='flex text-center flex-col items-center w-[70%] sm:w-[40%] mx-auto'>
              <img src='assets/img/eye-1.png' className='w-[40px] mb-2'></img>
              <h2 className='font-bold text-[17px]'>Unlock Off-market access
              </h2>
              <p className='text-[#5A6978]'>
                The closed Off-Market contains unique real estate opportunities.
              </p>
            </div>
          </div>
          <div className='col-span-12 sm:col-span-6 md:col-span-4'>
            <div className='flex text-center flex-col items-center w-[70%] sm:w-[40%] mx-auto'>
              <img src='assets/img/clock-1.png' className='w-[40px] mb-2'></img>
              <h2 className='font-bold text-[17px]'>Unlock Past transactions
              </h2>
              <p className='text-[#5A6978]'>
                Past transactions let you know the price of previous transactions similar to yours.
              </p>
            </div>
          </div>
          <div className='col-span-12 sm:col-span-6 md:col-span-4'>
            <div className='flex text-center flex-col items-center w-[70%] sm:w-[40%] mx-auto'>
              <img src='assets/img/machine-1.png' className='w-[40px] mb-2'></img>
              <h2 className='font-bold text-[17px]'>Unlock building permits
              </h2>
              <p className='text-[#5A6978]'>
                Before buying a property make sure that no heavy construction will happen next door.
              </p>
            </div>
          </div>
          <div className='col-span-12 sm:col-span-6 md:col-span-4'>
            <div className='flex text-center flex-col items-center w-[70%] sm:w-[40%] mx-auto'>
              <img src='assets/img/user-1.png' className='w-[40px] mb-2'></img>
              <h2 className='font-bold text-[17px]'>Contact Directory properties
              </h2>
              <p className='text-[#5A6978]'>
                Create unique opportunities buy contacting owner for properties not for sale.
              </p>
            </div>
          </div>
          <div className='col-span-12 sm:col-span-6 md:col-span-4'>
            <div className='flex text-center flex-col items-center w-[70%] sm:w-[40%] mx-auto'>
              <img src='assets/img/youtube-1.png' className='w-[40px] mb-2'></img>
              <h2 className='font-bold text-[17px]'>Unlock training content
              </h2>
              <p className='text-[#5A6978]'>
                Either your are selling or searching a property our training content ill help you secure your project.
              </p>
            </div>
          </div>
          <div className='col-span-12 sm:col-span-6 md:col-span-4'>
            <div className='flex text-center flex-col items-center w-[70%] sm:w-[40%] mx-auto'>
              <img src='assets/img/star-1.png' className='w-[40px] mb-2'></img>
              <h2 className='font-bold text-[17px]'>Real-estate Social estimation
              </h2>
              <p className='text-[#5A6978]'>
                The closed Off-Market contains unique real estate opportunities.
              </p>
            </div>
          </div>
          <div className='col-span-12'>
            <div className='flex text-center flex-col items-center w-[70%] sm:w-[13%] mx-auto'>
              <img src='assets/img/gift-1.png' className='w-[40px] mb-2'></img>
              <h2 className='font-bold text-[17px]'>Cashout against rewards
              </h2>
              <p className='text-[#5A6978]'>
                Exchanges your coins against rewards from our partners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Transaction4;
