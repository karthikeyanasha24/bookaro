import Layout from "../../components/global/layout";
import { IoHandRightOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { IoIosStar } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";

const Dashboard = () => {
  const user=useSelector(state=>state.user)

  return (
    <>
      <Layout>
        <h4 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <IoHandRightOutline className="text-3xl slow-shake text-[#976DD0]" />
          <span className="">Hi,</span> {user?.fullName}
        </h4>

        <main className="space-y-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          {/* <h1 className="text-[25px] font-semibold leading-[28px]">Dashboard</h1> */}
          <h2 className="text-[14px] text-[#838383]">This is an example dashboard created using build-in elements and components.</h2>
        </div>
     
      </div>
      <section className="grid grid-cols-12 gap-6">
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://assets.codepen.io/3685267/mock_faces_0.jpg" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Esther Howard</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
             {/* <div className='text-[12px] text-[#838383] mt-2'>3 from 5 tasks completed</div> */}
             <svg className="w-44 mt-3" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="6" rx="3" fill="#976DD0"></rect><rect width="120" height="6" rx="3" fill="url(#paint0_linear)"></rect><rect x="38" width="2" height="6" fill="#a884d9"></rect><rect x="78" width="2" height="6" fill="#a884d9"></rect><rect x="118" width="2" height="6" fill="#a884d9"></rect><rect x="158" width="2" height="6" fill="#a884d9"></rect><defs><linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8E76EF"></stop><stop offset="1" stop-color="#3912D2"></stop></linearGradient></defs></svg>
            </div>
            <div className='flex flex-col items-center'>
            {/* <HiMiniArrowTrendingUp className='text-[#00b785] text-[28px]'/> */}
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            <div className="text-[12px] text-[#838383]">Last 6 month</div>
            </div>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://assets.codepen.io/3685267/mock_faces_2.jpg" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Eleanor Pena</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
             {/* <div className='text-[12px] text-[#838383] mt-2'>3 from 5 tasks completed</div> */}
             <svg className="w-44 mt-3" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="6" rx="3" fill="#976DD0"></rect><rect width="120" height="6" rx="3" fill="url(#paint0_linear)"></rect><rect x="38" width="2" height="6" fill="#a884d9"></rect><rect x="78" width="2" height="6" fill="#a884d9"></rect><rect x="118" width="2" height="6" fill="#a884d9"></rect><rect x="158" width="2" height="6" fill="#a884d9"></rect><defs><linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8E76EF"></stop><stop offset="1" stop-color="#3912D2"></stop></linearGradient></defs></svg>
            </div>
            <div className='flex flex-col items-center'>
            {/* <HiMiniArrowTrendingDown className='text-[#A42238] text-[28px]'/> */}
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            <div className="text-[12px] text-[#838383]">Last 6 month</div>
            </div>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw=" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Robert Fox</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
             {/* <div className='text-[12px] text-[#838383] mt-2'>3 from 5 tasks completed</div> */}
             <svg className="w-44 mt-3" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="6" rx="3" fill="#976DD0"></rect><rect width="120" height="6" rx="3" fill="url(#paint0_linear)"></rect><rect x="38" width="2" height="6" fill="#a884d9"></rect><rect x="78" width="2" height="6" fill="#a884d9"></rect><rect x="118" width="2" height="6" fill="#a884d9"></rect><rect x="158" width="2" height="6" fill="#a884d9"></rect><defs><linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8E76EF"></stop><stop offset="1" stop-color="#3912D2"></stop></linearGradient></defs></svg>
            </div>
            <div className='flex flex-col items-center'>
            {/* <HiMiniArrowTrendingUp className='text-[#00b785] text-[28px]'/> */}
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            <div className="text-[12px] text-[#838383]">Last 6 month</div>
            </div>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH2uf_wifKp7Sy76i0OUlzVp2JlWz7LXYRLQ&s" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Jerry Wilson</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
             {/* <div className='text-[12px] text-[#838383] mt-2'>3 from 5 tasks completed</div> */}
             <svg className="w-44 mt-3" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="6" rx="3" fill="#976DD0"></rect><rect width="120" height="6" rx="3" fill="url(#paint0_linear)"></rect><rect x="38" width="2" height="6" fill="#a884d9"></rect><rect x="78" width="2" height="6" fill="#a884d9"></rect><rect x="118" width="2" height="6" fill="#a884d9"></rect><rect x="158" width="2" height="6" fill="#a884d9"></rect><defs><linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8E76EF"></stop><stop offset="1" stop-color="#3912D2"></stop></linearGradient></defs></svg>
            </div>
            <div className='flex flex-col items-center'>
            {/* <HiMiniArrowTrendingUp className='text-[#00b785] text-[28px]'/> */}
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            <div className="text-[12px] text-[#838383]">Last 6 month</div>
            </div>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb3MNPgAEEjF2phJFIgyTwRBQFZmn9VNKVaA&s" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Bernard Murphy</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
             {/* <div className='text-[12px] text-[#838383] mt-2'>3 from 5 tasks completed</div> */}
             <svg className="w-44 mt-3" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="6" rx="3" fill="#976DD0"></rect><rect width="120" height="6" rx="3" fill="url(#paint0_linear)"></rect><rect x="38" width="2" height="6" fill="#a884d9"></rect><rect x="78" width="2" height="6" fill="#a884d9"></rect><rect x="118" width="2" height="6" fill="#a884d9"></rect><rect x="158" width="2" height="6" fill="#a884d9"></rect><defs><linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8E76EF"></stop><stop offset="1" stop-color="#3912D2"></stop></linearGradient></defs></svg>
            </div>
            <div className='flex flex-col items-center'>
            {/* <HiMiniArrowTrendingUp className='text-[#00b785] text-[28px]'/> */}
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            <div className="text-[12px] text-[#838383]">Last 6 month</div>
            </div>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRij6dtiHizH96qpCOe8WeXXP3yLyQJkPdGVg&s" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Norman Walters</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
             {/* <div className='text-[12px] text-[#838383] mt-2'>3 from 5 tasks completed</div> */}
             <svg className="w-44 mt-3" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="6" rx="3" fill="#976DD0"></rect><rect width="120" height="6" rx="3" fill="url(#paint0_linear)"></rect><rect x="38" width="2" height="6" fill="#a884d9"></rect><rect x="78" width="2" height="6" fill="#a884d9"></rect><rect x="118" width="2" height="6" fill="#a884d9"></rect><rect x="158" width="2" height="6" fill="#a884d9"></rect><defs><linearGradient id="paint0_linear" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8E76EF"></stop><stop offset="1" stop-color="#3912D2"></stop></linearGradient></defs></svg>
            </div>
            <div className='flex flex-col items-center'>
            {/* <HiMiniArrowTrendingDown className='text-[#A42238] text-[28px]'/> */}
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            <div className="text-[12px] text-[#838383]">Last 6 month</div>
            </div>
          </div>
        </div>

      </section>
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 bg-white shadow rounded-lg">
          <div className="px-6 py-5 font-semibold border-b border-gray-100">Chart</div>
          <div className="p-4 flex-grow h-[25rem]">
            <div className="flex items-center justify-center h-full px-4 py-16 text-gray-400 text-3xl font-semibold bg-gray-100 border-2 border-gray-200 border-dashed rounded-md">Chart</div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 bg-white shadow rounded-lg">
          <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
            <span>Lorem Ipsum is simply dummy text</span>
     
          </div>
          <div className='py-3'>
          <div className="overflow-y-auto max-h-[24rem]">
            <ul className="p-4 space-y-6">
              <li className="flex items-center">
                <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/561/542/small_2x/check-in-location-icon-in-black-circle-png.png" alt="Annette Watson profile picture object-cover"/>
                </div>
                <span className="text-gray-600">Dummy Text</span>
                <span className="ml-auto font-semibold">9.3</span>
              </li>
              <li className="flex items-center !mt-3">
                <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/561/542/small_2x/check-in-location-icon-in-black-circle-png.png" alt="Calvin Steward profile picture object-cover"/>
                </div>
                <span className="text-gray-600">Dummy Text</span>
                <span className="ml-auto font-semibold">8.9</span>
              </li>
              <li className="flex items-center !mt-3">
                <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/561/542/small_2x/check-in-location-icon-in-black-circle-png.png" alt="Ralph Richards profile picture object-cover"/>
                </div>
                <span className="text-gray-600">Dummy Text</span>
                <span className="ml-auto font-semibold text-[14px]">8.7</span>
              </li>
              <li className="flex items-center !mt-3">
                <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/561/542/small_2x/check-in-location-icon-in-black-circle-png.png" alt="Bernard Murphy profile picture object-cover"/>
                </div>
                <span className="text-gray-600">Dummy Text</span>
                <span className="ml-auto font-semibold text-[14px]">8.2</span>
              </li>
              <li className="flex items-center !mt-3">
                <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/561/542/small_2x/check-in-location-icon-in-black-circle-png.png" alt="Arlene Robertson profile picture object-cover"/>
                </div>
                <span className="text-gray-600">Dummy Text</span>
                <span className="ml-auto font-semibold text-[14px]">8.2</span>
              </li>
              <li className="flex items-center !mt-3">
                <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/561/542/small_2x/check-in-location-icon-in-black-circle-png.png" alt="Jane Lane profile picture object-cover"/>
                </div>
                <span className="text-gray-600">Dummy Text</span>
                <span className="ml-auto font-semibold text-[14px]">8.1</span>
              </li>
              <li className="flex items-center !mt-3">
                <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/561/542/small_2x/check-in-location-icon-in-black-circle-png.png" alt="Pat Mckinney profile picture object-cover"/>
                </div>
                <span className="text-gray-600">Dummy Text</span>
                <span className="ml-auto font-semibold text-[14px]">7.9</span>
              </li>
              <li className="flex items-center !mt-3">
                <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/561/542/small_2x/check-in-location-icon-in-black-circle-png.png" alt="Norman Walters profile picture object-cover"/>
                </div>
                <span className="text-gray-600">Dummy Text</span>
                <span className="ml-auto font-semibold text-[14px]">7.7</span>
              </li>
            </ul>
          </div>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://assets.codepen.io/3685267/mock_faces_2.jpg" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Eleanor Pena</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
            </div>
            <div className='flex flex-col items-center'>
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            </div>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw=" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Robert Fox</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
            </div>
            <div className='flex flex-col items-center'>
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            </div>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-white shadow rounded-lg'>
          <div className='rounded-lg bg-card flex justify-between items-center p-3'>
            <div>
             <div className='flex items-center'>
             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH2uf_wifKp7Sy76i0OUlzVp2JlWz7LXYRLQ&s" alt="" className="w-10 h-10 rounded-full object-cover"/>
             <div className='ml-2'>
              <div className='flex items-center text-[15px] font-[500] leading-[16px]'>Jerry Wilson</div>
              <div className='text-[12px] text-[#838383]'>USA</div>
             </div>
             </div>
            </div>
            <div className='flex flex-col items-center'>
            <div className="text-[#8DC641] flex gap-1 mb-2">
            <IoIosStar />
            <IoIosStar />
            <IoIosStar />
            <IoIosStarOutline />
            <IoIosStarOutline />
            </div>
            </div>
          </div>
        </div>
      </section>
    </main>
      </Layout>
    </>
  );
};

export default Dashboard;
