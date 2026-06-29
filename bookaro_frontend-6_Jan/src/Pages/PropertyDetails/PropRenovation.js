import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ReactECharts from 'echarts-for-react';
import moment from "moment";
import { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import ImageSlider from "../../components/common/ImageSlider";
import { formatCurrency } from "../../models/string.model";

const PropRenovation = ({ detail, dropdownOptions, acrArr, handleAccordionChange, }) => {
    // renovation graph data
    const [xRenoData, setxRenoData] = useState([])
    const [yRenoData, setyRenoData] = useState([])
    const [totalReno, setTotalReno] = useState(0)
    useEffect(() => {
        if (detail?.renovation_work?.length > 0) {
            const data = detail?.renovation_work;
            const titleMap = {};
            let priceOfAll = 0;

            data.forEach(item => {
                const title = dropdownOptions?.find(dd => dd._id === item?.title)?.name || "Unknown"
                const price = parseFloat(item.price);
                priceOfAll += price;
                if (titleMap[title]) {
                    titleMap[title] += price;
                } else {
                    titleMap[title] = price;
                }
            });
            const arrx = Object.values(titleMap);
            const arry = Object.keys(titleMap);
            setxRenoData(arrx);
            setyRenoData(arry);
            setTotalReno(priceOfAll)
        }
    }, [detail?.renovation_work])

    const chartRenoData = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            // formatter: '{b}: {c} €',
            formatter: function (params) {
                return `${params[0].name}: ${formatCurrency(params[0].value)} €`;
            },
        },
        xAxis: {
            type: 'value',
            axisLabel: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
        },
        yAxis: {
            type: 'category',
            data: yRenoData,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
                color: '#6E6B6B', fontWeight: 600,
            },
        },
        series: [
            {
                type: 'bar',
                data: xRenoData,
                itemStyle: {
                    color: function (params) {
                        const colors = ['#5E4284', '#7A6893', '#7C55B1', '#CAB4E7'];
                        return colors[params.dataIndex];
                    },
                    borderRadius: [4],
                },
                barWidth: '50%',
                label: {
                    show: true,
                    position: 'right',
                    // formatter: '{c} €',
                    formatter: function (params) {
                        return formatCurrency(params.value) + ' €';
                    },
                    color: '#000',
                    fontWeight: '600',
                    fontSize: 20,
                },
            },
        ],
        grid: {
            left: '10%',
            right: '20%',
            top: '10%',
            bottom: '10%',
        },
    };

    const graphTabsReno = ["All", ...dropdownOptions?.filter(itm => itm?.type === "Renovation")?.map(sman => sman?.name) || []];
    const [TabIndexReno, setTabIndexReno] = useState(0);
    const [filteredData, setFilteredData] = useState(detail?.renovation_work || []);
    const tabChangeReno = (index) => {
        setTabIndexReno(index);
    };
    useEffect(() => {
        if (TabIndexReno === 0) {
            setFilteredData(detail?.renovation_work || []);
        } else {
            const selectedTab = graphTabsReno[TabIndexReno];
            const filtered = detail?.renovation_work?.filter((itm) => {
                const dropdownItem = dropdownOptions?.find((dd) => dd.name === selectedTab);
                return dropdownItem ? itm?.title === dropdownItem?.id : false;
            }) || [];
            setFilteredData(filtered);
        }
    }, [TabIndexReno, detail?.renovation_work,]);

    return (
        <Accordion
            expanded={acrArr?.includes(4)}
            onChange={() => handleAccordionChange(4)}
            className="mb-5 border border-[#eaeaea] shadow-none "
        >
            <AccordionSummary
                expandIcon={<MdOutlineKeyboardArrowDown />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-3"
            >
                <Typography>
                <span className="py-0 text-[#976DD0] font-[600] text-[17px] p-4 w-full text-left flex items-center justify-between">
                        Renovation works
                    </span>
                </Typography>
            </AccordionSummary>
            <AccordionDetails className="text-gray-500 p-4">
                <div className=" mb-10">
                    <div className="bg-white rounded-[5px] p-3">
                        <p className="text-[#5A5A5A] text-[17px] text-left mb-3">
                            <span className="text-[#5A5A5A] font-[600] ms-1">
                                {formatCurrency(totalReno)} €{" "}
                            </span>
                            of investment made for the property
                        </p>
                        <div className="bg-[#F9F9F9] p-4">
                            <ReactECharts
                                option={chartRenoData}
                                style={{ height: 300, width: '100%' }}
                                opts={{ renderer: 'canvas' }}
                            />
                        </div>
                    </div>
                    {graphTabsReno?.length > 1 && (
                        <div className="bg-gray rounded-[5px] mt-5 mb-5 p-3">
                            <TabGroup defaultIndex={TabIndexReno} onChange={tabChangeReno}>
                                <TabList className="flex-prop  p-3 justify-center flex">
                                    {graphTabsReno.map((label, index) => (
                                        <Tab
                                            key={index}
                                            className={`${TabIndexReno === index
                                                ? "font-[600] text-[#976DD0]"
                                                : "text-[#47525E]"
                                                } mx-3 mb-5 text-center text-[14px] cursor-pointer capitalize`}
                                        >
                                            {label}
                                        </Tab>
                                    ))}
                                </TabList>
                                <TabPanels className="h-full">
                                    {graphTabsReno.map((tabLabel, index) => (
                                        <TabPanel key={index} className="h-full">
                                            <div className="grid grid-cols-12 gap-5">
                                                {
                                                    filteredData?.length > 0 ? filteredData?.map((itm, i) => {
                                                        let images = itm?.images?.map(dd => dd?.fileName);
                                                        return (
                                                            <div className="lg:col-span-6 col-span-full border border-[#D2D2D2] rounded-[5px] mb-10">
                                                                <div key={i} className="bg-white rounded-[5px] ">
                                                                    <ImageSlider images={images} />
                                                                    <div className="p-4">
                                                                        <h4 className="text-[#31373E] font-[600] text-[20px] mb-2 ellipses ellipses-h h-[40px]">
                                                                            {dropdownOptions?.find((dd) => dd._id === itm?.title)?.name}
                                                                        </h4>
                                                                        <p className="text-[#31373E] mb-2 ellipses max-w-unset">
                                                                            {itm?.description}
                                                                        </p>
                                                                        <h5 className="mb-2">
                                                                            Status: <span className="font-[600] ms-2 font-italic capitalize">
                                                                                {detail?.request_status === "accepted" ?
                                                                                    `Invoice Bookaroo verified` : `${detail?.request_status}`}
                                                                            </span>
                                                                        </h5>
                                                                        <h5>
                                                                            <span>{moment(detail?.createdAt || new Date()).format("MMMM YYYY")}</span>
                                                                        </h5>
                                                                        <h5 className="font-[600] mt-2 text-[#000] text-[20px]">
                                                                            {itm?.price} €
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }) : (
                                                        <div className="col-span-12">
                                                        <div className="flex items-center justify-center flex-col max-w-[300px] mx-auto p-[35px] rounded-[5px]">
                                                            <img
                                                                src="/assets/img/no-data.png"
                                                                className="w-[100px]"
                                                                alt=""
                                                            />
                                                            <p className="mt-1">No Data Yet</p>
                                                        </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </TabPanel>
                                    ))}
                                </TabPanels>
                            </TabGroup>
                        </div>
                    )}
                </div>
            </AccordionDetails>
        </Accordion>
    )
}

export default PropRenovation
