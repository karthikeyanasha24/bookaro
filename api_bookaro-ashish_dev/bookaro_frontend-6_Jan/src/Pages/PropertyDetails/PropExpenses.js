import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { formatCurrency } from "../../models/string.model";

const PropExpenses = ({ detail, dropdownOptions, acrArr, handleAccordionChange, }) => {
    // expanse graph data
    const typeMap = dropdownOptions?.reduce((map, option) => {
        if (option.type === "Expense") {
            map[option.name] = option.id;
        }
        return map;
    }, {});
    const graphTabs = ["All", ...dropdownOptions?.filter(itm => itm?.type === "Expense")?.map(sman => sman?.name) || []];
    const [TabIndex, setTabIndex] = useState(0);
    const tabChange = (index) => {
        setTabIndex(index);
    };
    const [xExpanseData, setxExpanseData] = useState([])
    const [yExpanseData, setyExpanseData] = useState([])
    const [startIndex, setStartIndex] = useState(0);
    const tabsToShow = 4;

    const handleLeftArrowClick = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const handleRightArrowClick = () => {
        if (startIndex < graphTabs.length - tabsToShow) {
            setStartIndex(startIndex + 1);
        }
    };

    useEffect(() => {
        if (detail?.Expenses?.length > 0) {
            const data = detail?.Expenses;
            const filteredData = (TabIndex === 0)
                ? data : data?.filter(item => item?.type === typeMap?.[graphTabs?.[TabIndex]]);

            const yearMap = {};
            filteredData?.forEach(item => {
                const year = item?.year;
                const price = parseFloat(item?.price);
                if (yearMap[year]) {
                    yearMap[year] += price;
                } else {
                    yearMap[year] = price;
                }
            });

            const arrx = Object.keys(yearMap);
            const arry = Object.values(yearMap);
            setxExpanseData(arrx);
            setyExpanseData(arry);
        }
    }, [detail?.Expenses, TabIndex])
    const chartExpenseData = {
        title: {
            text: 'Global average yearly expense',
            left: 'center',
            top: 20,
            bottom: 20,

            textStyle: {
                color: '#6E6B6B',
                fontSize: 16,
                fontWeight: 'bold',

            },
        },
        grid: {
            top: 80, // Adds spacing between the title and the chart content
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            // formatter: '{b}: {c} €',
            formatter: function (params) {
                return `${params[0].name}: ${formatCurrency(params[0].value)} €`;
            },
        },
        xAxis: {
            data: xExpanseData,
        },
        yAxis: {
            type: 'value',
            axisLabel: { show: false },
            axisLine: { show: false },
            splitLine: { show: false },
        },
        series: [
            {
                type: 'bar',
                data: yExpanseData,
                itemStyle: {
                    borderRadius: [5],
                    color: function (params) {
                        return params.dataIndex % 2 === 0 ? '#7B54AF' : '#7B54AF';
                    },
                },

                label: {  // bar top text
                    show: true,
                    position: 'top',
                    // formatter: '{c} €',
                    formatter: function (params) {
                        return formatCurrency(params.value) + ' €';
                    },
                    color: '#6E6B6B',
                },
            },
        ],
    };

    return (
        <Accordion
            expanded={acrArr?.includes(3)}
            onChange={() => handleAccordionChange(3)}
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
                        Living expenses
                    </span>
                </Typography>
            </AccordionSummary>
            <AccordionDetails className="text-gray-500 p-4">
                {graphTabs?.length > 1 && (
                    <div className="bg-gray rounded-[5px]">
                        <TabGroup defaultIndex={TabIndex} onChange={tabChange}>
                            <TabList className="flex-prop bg-[#F9F9F9] p-3 py-6 justify-center flex">
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={handleLeftArrowClick}
                                        className="px-4 py-2 bg-gray-300 text-white rounded-l-lg hover:bg-gray-400 disabled:opacity-50"
                                        disabled={startIndex === 0}
                                    >
                                        &lt;
                                    </button>

                                    <div className="flex overflow-hidden">
                                        {graphTabs.slice(startIndex, startIndex + tabsToShow).map((label, index) => {
                                            const currentIndex = startIndex + index;
                                            return (
                                                <div
                                                    onClick={() => setTabIndex(startIndex + index)}
                                                    key={index}
                                                    className={`tab ${TabIndex === currentIndex ? "font-semibold text-[#976DD0]" : "text-[#47525E]"} mx-3 text-center text-[14px] cursor-pointer`}
                                                >
                                                    {label}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <button
                                        onClick={handleRightArrowClick}
                                        className="px-4 py-2 bg-gray-300 text-white rounded-r-lg hover:bg-gray-400 disabled:opacity-50"
                                        disabled={startIndex >= graphTabs.length - tabsToShow}
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </TabList>
                            <TabPanels className="h-full">
                                {graphTabs.map((tabLabel, index) => (
                                    <TabPanel key={index} className="h-full">
                                        <div style={{ backgroundColor: '#F9F9F9' }} className="rounded-bl-[12px] rounded-br-[12px]">
                                            {yExpanseData && yExpanseData?.length > 0 ? (
                                                <ReactECharts
                                                    option={chartExpenseData}
                                                    style={{ height: 400 }}
                                                    opts={{ renderer: 'svg' }}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center flex-col max-w-[300px] mx-auto p-[35px] rounded-[5px]">
                                                    <img
                                                        src="/assets/img/no-data.png"
                                                        className="w-[100px]"
                                                        alt=""
                                                    />
                                                    <p className="mt-1">No Data Yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </TabGroup>
                    </div>
                )}
            </AccordionDetails>
        </Accordion>
    )
}

export default PropExpenses
