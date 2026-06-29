import React from "react";
import ReactEcharts from "echarts-for-react";

const Chart = ({totalAmounts,dates,names,type}) => {
  const getOption = () => {
    return {
      // title: {
      //   text: "Categories",
      // },
      tooltip: {},
      xAxis: {
        type:  type ? type :"category",
         data: dates ? dates :  [
          "Candies",
          "Gummies",
          "Capsules",
          "Drinks",
          "Functional",
          "Therapeutic",
        ],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: names ? names :  "Category",
          type: "bar",
          data: totalAmounts ? totalAmounts :  [120, 200, 150, 80, 30, 60],
        },
      ],
    };
  };

  return (
    <div>
      <ReactEcharts option={getOption()} style={{ height: "400px" }} />
    </div>
  );
};

export default Chart;
