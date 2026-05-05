import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { formatCurrency } from "../../models/string.model";


const PropRevenues = ({ detail, dropdownOptions, acrArr, handleAccordionChange }) => {
    const [xRevenueData, setxRevenueData] = useState([])
    const [yRevenueData, setyRevenueData] = useState([])
    useEffect(() => {
        if (detail?.revenue_detail?.length > 0) {
            const data = detail?.revenue_detail;
            const yearMap = {};
            data.forEach(item => {
                const year = item.year;
                const price = parseFloat(item.price);

                if (yearMap[year]) {
                    yearMap[year] += price;
                } else {
                    yearMap[year] = price;
                }
            });

            const arrx = Object.keys(yearMap);
            const arry = Object.values(yearMap);
            setxRevenueData(arrx);
            setyRevenueData(arry);
        }
    }, [detail?.revenue_detail])
    const chartRevenueData = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            // formatter: '{b}: {c} €',
            formatter: function (params) {
                return `${params[0].name}: ${formatCurrency(params[0].value)} €`;
            },
        },
        xAxis: {
            data: xRevenueData,
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
                data: yRevenueData,
                itemStyle: {
                    borderRadius: [7],
                    color: function (params) {
                        return params.dataIndex % 2 === 0 ? '#9F84C4' : '#5E3C8C';
                    },
                },
                barWidth: '30%',
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
    const revenueResult = Object.values(
        (detail?.revenue_detail || []).reduce((acc, item) => {
            const price = parseFloat(item?.price);
            const dropdownItem = dropdownOptions?.find(option => option?._id === item?.type);
            if (acc[item?.type]) {
                acc[item?.type].price += price;
            } else {
                acc[item?.type] = {
                    type: item?.type,
                    price: price,
                    name: dropdownItem ? dropdownItem?.name : "Unknown"
                };
            }
            return acc;
        }, {})
    );
    const totalRevenue = revenueResult?.reduce((sum, item) => sum + item?.price, 0);

    return (
        <Accordion
            expanded={acrArr?.includes(2)}
            onChange={() => handleAccordionChange(2)}
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
                        Rental revenues
                    </span>
                </Typography>
            </AccordionSummary>
            <AccordionDetails className="text-gray-500 p-4">
                <div>
                    <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2">
                        Lifetime Global Revenues
                    </h4>
                    <div className="flex items-center gap-5 mt-6 mb-6">
                        <div className="bg-[#8965BB] py-4 px-3 rounded-[12px] w-[170px] h-[130px]">
                            <h4 className="text-white font-[600] text-[26px] text-center mb-2">
                                {formatCurrency(totalRevenue)} €
                            </h4>
                            <p className="text-white text-[16px] text-center capitalize">
                                Total <br /> revenues
                            </p>
                        </div>
                        {revenueResult?.map(itm => (
                            <div className="bg-[#AF8EDC] py-4 px-3 rounded-[12px] w-[170px] h-[130px]">
                                <h4 className="text-white font-[600] text-[26px] text-center mb-2">
                                    {formatCurrency(itm?.price)} €
                                </h4>
                                <p className="text-white text-[16px] text-center capitalize">
                                    {itm?.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-[#47525E] font-[600] text-[20px] border-b border-[#D5D5D5] pb-2 mb-5">
                        Yearly Revenues
                    </h4>
                    <div className=" rounded-[5px] bg-[#F9F9F9] p-4">
                        <ReactECharts
                            option={chartRevenueData}
                            style={{ height: 400 }}
                            opts={{ renderer: 'svg' }}
                        />
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    )
}

export default PropRevenues
