import Layout from "../../components/global/layout";
import { IoHandRightOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { IoIosArrowDown, IoIosStar } from "react-icons/io";
import { IoIosStarOutline } from "react-icons/io";
import { FaRegEye, FaRegUser } from "react-icons/fa";
import { PiHouse } from "react-icons/pi";
import ReactECharts from 'echarts-for-react';
import ApiClient from "../../methods/api/apiClient";
import { useEffect, useState } from "react";
import loader from "../../methods/loader";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { propTypeOptions } from "../QuickSearch/shared";
import DateRangePicker from "../../components/common/DateRangePicker";
import PieChart from "../../components/Charts/Piechart";

const Dashboard = () => {
  const user = useSelector(state => state.user)
  const [userCount, setuserCount] = useState({});
  const [selectedOption, setSelectedOption] = useState("Sale");
  const [propertyCount, setpropertyCount] = useState({});
  const [latestData, setlatestData] = useState({});
  const [PeerToPeer, setPeerToPeer] = useState({});
  const [userFile, setuserFile] = useState({});
  const [transactionFlow, settransactionFlow] = useState({});
  const [funnelState, setfunnelState] = useState();
  console.log("funnelState", funnelState)
  const [socialEstimation, setsocialEstimation] = useState({});
  const history = useNavigate();
  const [filters, setFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    getUserData();
    getPeerToPeerEstimationData()
    getUserFile()
    getTransactionFlow()
    getfunnelGraph()
    getSocialEstimation()
  }, []);

  useEffect(() => {
    getUserData();
    getPeerToPeerEstimationData()
    getUserFile()
    getTransactionFlow()
    getSocialEstimation()
    getfunnelGraph()
  }, [filters.startDate, filters.endDate]);

  const getUserData = () => {
    loader(true);
    ApiClient.get(`adminDashboard/users-summary`, {
      startDate: filters.startDate,
      endDate: filters.endDate
    }).then((res) => {
      if (res.success) {
        setuserCount(res?.data?.users);
        setpropertyCount(res?.data?.properties);
        setlatestData(res?.data?.latest)
      }
      loader(false);
    });
  };

  const getPeerToPeerEstimationData = () => {
    loader(true);
    ApiClient.get(`adminDashboard/peer-to-peer-summary`, {
      startDate: filters.startDate,
      endDate: filters.endDate
    }).then((res) => {
      if (res.success) {
        setPeerToPeer(res?.data);
      }
      loader(false);
    });
  };

  const getUserFile = () => {
    loader(true);
    ApiClient.get(`adminDashboard/user-files-summary`, {
      startDate: filters.startDate,
      endDate: filters.endDate
    }).then((res) => {
      if (res.success) {
        setuserFile(res?.data);
      }
      loader(false);
    });
  };

  const getTransactionFlow = () => {
    loader(true);
    ApiClient.get(`adminDashboard/transaction-flow`, {
      startDate: filters.startDate,
      endDate: filters.endDate
    }).then((res) => {
      if (res.success) {
        settransactionFlow(res?.data);
      }
      loader(false);
    });
  };

    const getfunnelGraph = () => {
    loader(true);
    ApiClient.get(`adminDashboard/property-stage-distribution`, {
      startDate: filters.startDate,
      endDate: filters.endDate
    }).then((res) => {
      if (res.success) {
        setfunnelState(res?.data);
      }
      loader(false);
    });
  };

  const getSocialEstimation = () => {
    loader(true);
    ApiClient.get(`adminDashboard/social-interactions-summary`, {
      startDate: filters.startDate,
      endDate: filters.endDate
    }).then((res) => {
      if (res.success) {
        setsocialEstimation(res?.data);
      }
      loader(false);
    });
  };

  const options = ["Sale", "Rent", "Directory"];

  const Useroption = {
    title: {
      text: 'Users Overview'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Users']
    },
    xAxis: {
      type: 'category',
      data: userCount?.graph?.labels || []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: userCount?.graph?.individual || [],
        itemStyle: {
          color: '#976DD0'
        }
      }
    ]
  };

  const Propertyoption = {
    title: {
      text: 'Users Overview'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Users']
    },
    xAxis: {
      type: 'category',
      data: userCount?.graph?.labels || []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: userCount?.graph?.pro || [],
        itemStyle: {
          color: '#976DD0'
        }
      }
    ]
  };

  const PropertyTypeoption = {
    title: { text: 'Users Overview' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Users'] },
    xAxis: {
      type: 'category',
      data: propertyCount?.graph?.labels || []
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: propertyCount?.graph?.[selectedOption.toLowerCase()] || [],
        itemStyle: { color: '#976DD0' }
      }
    ]
  };

  const NewPropertyTypeoption = {
    title: { text: 'Users Overview' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Users'] },
    xAxis: {
      type: 'category',
      data: propertyCount?.graph?.labels || []
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: propertyCount?.graph?.totalProperties || [],
        itemStyle: { color: '#976DD0' }
      }
    ]
  };

  const PropertyEstimated = {
    title: { text: 'Users Overview' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Users'] },
    xAxis: {
      type: 'category',
      data: PeerToPeer?.labels || []
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: PeerToPeer?.propertiesEstimated || [],
        itemStyle: { color: '#976DD0' }
      }
    ]
  };

  const PropertyEstimation = {
    title: { text: 'Users Overview' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Users'] },
    xAxis: {
      type: 'category',
      data: PeerToPeer?.labels || []
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: PeerToPeer?.estimations || [],
        itemStyle: { color: '#976DD0' }
      }
    ]
  };

  const SellerFile = {
    title: { text: 'Users Overview' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Users'] },
    xAxis: {
      type: 'category',
      data: userFile?.graph?.labels || []
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: userFile?.graph?.seller || [],
        itemStyle: { color: '#976DD0' }
      }
    ]
  };

  const BuyerFile = {
    title: { text: 'Users Overview' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Users'] },
    xAxis: {
      type: 'category',
      data: userFile?.graph?.labels || []
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Users',
        type: 'bar',
        data: userFile?.graph?.buyer || [],
        itemStyle: { color: '#976DD0' }
      }
    ]
  };


  const userDetail = (id) => {
    history(`/user/detail/${id}`)
  }

  const propertyDetail = (id) => {
    window.open(`https://book.jcsoftwaresolution.in/property-details?id=${id}`, '_blank');
  }

  return (
    <>
      <Layout>

        <main className="space-y-5 ">
          <div className="flex justify-between gap-2 items-center ">
            <h2 className="xl:text-[24px] lg:text-[22px] md:text-[20px] sm:text-[18px] text-[16px] text-[#47525E] font-medium ">
              Hi, Admin
            </h2>
            <div>
              {
                <DateRangePicker
                  value={{
                    startDate: filters.startDate,
                    endDate: filters.endDate,
                  }}
                  onChange={(e) => {
                    setFilter((prev) => ({
                      ...prev,
                      startDate: e.startDate,
                      endDate: e.endDate,
                      range: e.range,
                    }));
                  }}
                  maxDate={new Date()}
                />
              }
            </div>
          </div>
          <div className="bg-[#FFF] py-5 sm:px-12 px-7 rounded-[20px] ">
            <div className="flex gap-2 items-center justify-center ">
              <FaRegUser className="text-[#47525E] sm:text-[24px] text-[22px] " />
              <span className="xl:text-[20px] sm:text-[18px] text-[#47525E] ">
                Users
              </span>
            </div>
            <div className="mt-5 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Individual users</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {userCount?.counts?.individual}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Lost Individual users</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Lost Individual users</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  2000
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Lost Professional users</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Professional users</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {userCount?.counts?.pro}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Individual users</p>
                  <button className="bg-[#343F4B] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    -20%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Lost Professional users</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  2000
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Individual users</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 grid md:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <div className="flex gap-2 justify-between items-center mb-3 flex-wrap ">
                  <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold ">
                    Total new users
                  </h2>
                  {/* <div className="flex gap-1 items-center bg-[#969FAA3D] px-3 py-1 rounded-full text-[#000] ">
                    <span className=" sm:text-[12px] text-[10px]">6 Months</span>
                    <IoIosArrowDown />
                  </div> */}

                </div>
                {userCount?.graph && (
                  <ReactECharts
                    option={Useroption}
                    style={{ height: 400 }}
                    opts={{ renderer: 'svg' }}
                  />
                )}
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <div className="flex gap-2 justify-between items-center mb-3 flex-wrap ">
                  <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold ">
                    Total new pro users
                  </h2>
                  {/* <div className="flex gap-1 items-center bg-[#969FAA3D] px-3 py-1 rounded-full text-[#000] ">
                    <span className=" sm:text-[12px] text-[10px]">6 Months</span>
                    <IoIosArrowDown />
                  </div> */}
                </div>
                {userCount?.graph && (
                  <ReactECharts
                    option={Propertyoption}
                    style={{ height: 400 }}
                    opts={{ renderer: 'svg' }}
                  />
                )}
              </div>
            </div>
          </div>
          {/* <LineChart /> */}
          <div className="bg-[#FFF] py-5 sm:px-12 px-7 rounded-[20px] ">
            <div className="flex gap-2 items-center justify-center ">
              <PiHouse className="text-[#47525E] sm:text-[24px] text-[22px] " />
              <span className="xl:text-[20px] sm:text-[18px] text-[#47525E] ">
                Properties
              </span>
            </div>
            <div className="mt-5 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <PiHouse className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Total properties</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {propertyCount?.counts?.total}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">For sale properties</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {propertyCount?.counts?.sale}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Rental properties</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {propertyCount?.counts?.rent}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 days</p>
                  <button className="bg-[#343F4B] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    -20%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Directory properties</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {propertyCount?.counts?.directory}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 grid md:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <div className="flex gap-2 justify-between items-center mb-3 flex-wrap ">
                  <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold ">
                    Total new properties
                  </h2>
                  {/* <div className="flex gap-1 items-center bg-[#969FAA3D] px-3 py-1 rounded-full text-[#000] ">
                    <span className=" sm:text-[12px] text-[10px]">6 Months</span>
                    <IoIosArrowDown />
                  </div> */}
                </div>
                <ReactECharts
                  option={NewPropertyTypeoption}
                  style={{ height: 400 }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <div className="flex gap-2 justify-between items-center mb-3 flex-wrap ">
                  <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] flex gap-2 items-center font-semibold ">
                    Total
                    <div className="relative inline-block">
                      <select
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="bg-[#D4D4D4] py-2 px-3 sm:text-[14px] text-[12px] text-[#343F4B] appearance-none pr-6"
                      >
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <IoIosArrowDown className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[#343F4B]" />
                    </div>
                    properties
                  </h2>
                  {/* <div className="flex gap-1 items-center bg-[#969FAA3D] px-3 py-1 rounded-full text-[#000] ">
                    <span className=" sm:text-[12px] text-[10px]">6 Months</span>
                    <IoIosArrowDown />
                  </div> */}
                </div>
                <ReactECharts
                  option={PropertyTypeoption}
                  style={{ height: 400 }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </div>
          </div>
          <div className="bg-[#FFF] py-5 sm:px-12 px-7 rounded-[20px] ">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="bg-white border-2 border-[#976DD0] rounded-[14px] p-4 ">
                <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold mb-4">Latest user registration</h2>
                <div className="overflow-auto ">
                  <table className="w-full whitespace-nowrap">
                    <thead className="text-[#343F4B] sm:text-[14px] text-[12px] font-semibold ">
                      <tr>
                        <th className="text-left py-2 px-2">First name</th>
                        <th className="text-left py-2 px-2">Last name</th>
                        <th className="text-left py-2 px-2">Type</th>
                        <th className="text-left py-2 px-2">Goal</th>
                        <th className="text-left py-2 px-2">Reg Date</th>
                        <th className="text-left py-2 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-[#343F4B] sm:text-[12px] text-[10px] ">
                      {latestData?.users?.map((item) => {
                        return <tr>
                          <td className="text-left py-2 px-2 capitalize">{item?.firstName || "--"}</td>
                          <td className="text-left py-2 px-2 capitalize">{item?.lastName || "--"}</td>
                          <td className="text-left py-2 px-2 capitalize">{item?.accountType || "--"}</td>
                          <td className="text-left py-2 px-2 capitalize">{item?.property || "--"}</td>
                          <td className="text-left py-2 px-2 capitalize">{moment(item?.createdAt).format("DD/MM/YYYY")}</td>
                          <td className="text-left py-2 px-2 capitalize cursor-pointer" onClick={(e) => userDetail(item?.id || item?._id)}><FaRegEye /></td>
                        </tr>
                      })}

                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white border-2 border-[#976DD0] rounded-[14px] p-4 ">
                <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold mb-4">Latest properties creation</h2>
                <div className="overflow-auto ">
                  <table className="w-full whitespace-nowrap">
                    <thead className="text-[#343F4B] sm:text-[14px] text-[12px] font-semibold ">
                      <tr>
                        <th className="text-left py-2 px-2">City</th>
                        <th className="text-left py-2 px-2">Status</th>
                        <th className="text-left py-2 px-2">Price</th>
                        <th className="text-left py-2 px-2">Size</th>
                        <th className="text-left py-2 px-2">Creation</th>
                        <th className="text-left py-2 px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-[#343F4B] sm:text-[12px] text-[10px] ">
                      {latestData?.properties?.map((item) => {
                        return <tr>
                          <td className="text-left py-2 px-2 capitalize">{item?.city || "--"}</td>
                          <td className="text-left py-2 px-2 capitalize">{item?.propertyType || "--"}</td>
                          <td className="text-left py-2 px-2 capitalize">{item?.price || "0"} €</td>
                          <td className="text-left py-2 px-2 capitalize">{item?.surface || "0"}m2</td>
                          <td className="text-left py-2 px-2 capitalize">{moment(item?.createdAt).format("DD/MM/YYYY")}</td>
                          <td className="text-left py-2 px-2 capitalize cursor-pointer" onClick={(e) => propertyDetail(item?.id || item?._id)}><FaRegEye /></td>
                        </tr>
                      })}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#FFF] py-5 sm:px-12 px-7 rounded-[20px] ">
            <div className="flex gap-2 items-center justify-center ">
              <FaRegUser className="text-[#47525E] sm:text-[24px] text-[22px] " />
              <span className="xl:text-[20px] sm:text-[18px] text-[#47525E] ">
                Peer-To-Peer Estimation
              </span>
            </div>
            <div className="mt-5 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Properties estimated</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {PeerToPeer?.totals?.totalPropertiesEstimated}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Estimators</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {PeerToPeer?.totals?.totalEstimators}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Estimations</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {PeerToPeer?.totals?.totalEstimations}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#343F4B] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    -20%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Lost professional users</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {PeerToPeer?.lostProUsers}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 grid md:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <div className="flex gap-2 justify-between items-center mb-3 flex-wrap ">
                  <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold ">
                    Total new property estimated
                  </h2>
                  {/* <div className="flex gap-1 items-center bg-[#969FAA3D] px-3 py-1 rounded-full text-[#000] ">
                    <span className=" sm:text-[12px] text-[10px]">6 Months</span>
                    <IoIosArrowDown />
                  </div> */}
                </div>
                <ReactECharts
                  option={PropertyEstimated}
                  style={{ height: 400 }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <div className="flex gap-2 justify-between items-center mb-3 flex-wrap ">
                  <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold ">
                    Total new estimations
                  </h2>
                  {/* <div className="flex gap-1 items-center bg-[#969FAA3D] px-3 py-1 rounded-full text-[#000] ">
                    <span className=" sm:text-[12px] text-[10px]">6 Months</span>
                    <IoIosArrowDown />
                  </div> */}
                </div>
                <ReactECharts
                  option={PropertyEstimation}
                  style={{ height: 400 }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </div>
          </div>
          <div className="bg-[#FFF] py-5 sm:px-12 px-7 rounded-[20px] ">
            <div className="flex gap-2 items-center justify-center ">
              <PiHouse className="text-[#47525E] sm:text-[24px] text-[22px] " />
              <span className="xl:text-[20px] sm:text-[18px] text-[#47525E] ">
                User files
              </span>
            </div>
            <div className="mt-5 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <PiHouse className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Total buyer files</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {userFile?.counts?.buyerFiles || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Total renter files</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {userFile?.counts?.renterFiles || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Total seller files</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {userFile?.counts?.sellerFiles || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 days</p>
                  <button className="bg-[#343F4B] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    -20%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Directory properties</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {userFile?.counts?.directoryFiles || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 grid md:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <div className="flex gap-2 justify-between items-center mb-3 flex-wrap ">
                  <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold ">
                    Total new buyer files
                  </h2>
                  {/* <div className="flex gap-1 items-center bg-[#969FAA3D] px-3 py-1 rounded-full text-[#000] ">
                    <span className=" sm:text-[12px] text-[10px]">6 Months</span>
                    <IoIosArrowDown />
                  </div> */}
                </div>
                <ReactECharts
                  option={BuyerFile}
                  style={{ height: 400 }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <div className="flex gap-2 justify-between items-center mb-3 flex-wrap ">
                  <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] flex gap-2 items-center font-semibold ">
                    Total new seller files
                  </h2>
                  {/* <div className="flex gap-1 items-center bg-[#969FAA3D] px-3 py-1 rounded-full text-[#000] ">
                    <span className=" sm:text-[12px] text-[10px]">6 Months</span>
                    <IoIosArrowDown />
                  </div> */}
                </div>
                <ReactECharts
                  option={SellerFile}
                  style={{ height: 400 }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </div>
          </div>
          <div className="bg-[#FFF] py-5 sm:px-12 px-7 rounded-[20px] ">
            <div className="flex gap-2 items-center justify-center ">
              <PiHouse className="text-[#47525E] sm:text-[24px] text-[22px] " />
              <span className="xl:text-[20px] sm:text-[18px] text-[#47525E] ">
                Transaction Flow
              </span>
            </div>
            <div className="mt-5 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <PiHouse className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Property visits</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {transactionFlow?.current?.propertyVisits || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Visit reviews</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {transactionFlow?.current?.visitReviews || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Offer submitted</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {transactionFlow?.current?.offerSubmit || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 days</p>
                  <button className="bg-[#343F4B] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    -20%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Offer accepted</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {transactionFlow?.current?.offerAccept || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <PiHouse className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Application submitted</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {transactionFlow?.current?.applicationSubmited || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Application accepted</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {transactionFlow?.current?.applicationAccepted || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Property profile transfer</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {transactionFlow?.current?.propertyTransfers || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 days</p>
                  <button className="bg-[#343F4B] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    -20%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Interest shared</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {transactionFlow?.current?.interestSent || 0}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <h2 className="lg:text-[24px] md:text-[22px] sm:text-[20px] text-[18px] text-[#343F4B] font-semibold mb-3 ">
                  Allocation of properties based on the sales or rental funnal stage
                </h2>
                <PieChart stages={funnelState?.stages} />
              </div>
            </div>
          </div>
          <div className="bg-[#FFF] py-5 sm:px-12 px-7 rounded-[20px] ">
            <div className="flex gap-2 items-center justify-center ">
              <PiHouse className="text-[#47525E] sm:text-[24px] text-[22px] " />
              <span className="xl:text-[20px] sm:text-[18px] text-[#47525E] ">
                Social interactions
              </span>
            </div>
            <div className="mt-5 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 ">
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <PiHouse className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Property likes</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {socialEstimation?.cards?.propertyLikes}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Followers</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {socialEstimation?.cards?.followers}

                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Shares</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {socialEstimation?.cards?.shares}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 days</p>
                  <button className="bg-[#343F4B] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    -20%
                  </button>
                </div>
              </div>
              <div className="border-2 border-[#976DD0] rounded-[14px] sm:p-4 p-3 space-y-2 ">
                <FaRegUser className="text-[#976DD0] sm:text-[20px] text-[18px] " />
                <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Messages exchanged</p>
                <h2 className="sm:text-[16px] text-[14px] text-[#343F4B] font-semibold ">
                  {socialEstimation?.cards?.messagesExchanged}
                </h2>
                <div className="flex justify-between items-center gap-2 flex-wrap !mt-6 ">
                  <p className="sm:text-[14px] text-[12px] text-[#343F4B] ">Last 30 Days</p>
                  <button className="bg-[#976DD0] px-3 py-1 rounded-full text-[#FFF] sm:text-[14px] text-[12px] ">
                    +30%
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default Dashboard;
