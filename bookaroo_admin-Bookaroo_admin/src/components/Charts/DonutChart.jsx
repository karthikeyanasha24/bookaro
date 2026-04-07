import React from "react";
import ReactEcharts from "echarts-for-react";

const DoughnutChart = () => {
  const data = [
    { value: 20, name: "Multiple" },
    { value: 15, name: "Single" },
    { value: 25, name: "Yes/No" },
    { value: 10, name: "Comment" },
    { value: 30, name: "Radio" },
  ];

  // Options for the doughnut chart
  const options = {
    // title: {
    //   text: "",
    //   left: "center",
    // },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    series: [
      {
        name: "Questions",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };

  return <ReactEcharts option={options} style={{ height: "400px" }} />;
};

export default DoughnutChart;
