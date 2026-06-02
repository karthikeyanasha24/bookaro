import React from "react";
import ReactEcharts from "echarts-for-react";

const PieChart = ({ stages }) => {
  const data =
    stages?.map((item) => ({
      value: item.value,
      name: item.label,
    })) || [
      { value: 30, name: "Visits took place" },
      { value: 30, name: "Interest received" },
      { value: 30, name: "Published" },
      { value: 30, name: "Offer / application received" },
      { value: 30, name: "Offer / application accepted" },
      { value: 30, name: "Pre-sale signed" },
    ];

  const options = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c} properties ({d}%)",
    },

    series: [
      {
        name: "Properties",
        type: "pie",

        // Donut size
        radius: ["35%", "70%"],

        // Position
        center: ["50%", "50%"],

        // Gap between slices
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 4,
        },

        label: {
          show: true,
          position: "outside",

          // Label format
          formatter: function (params) {
            return `{percent|${params.percent}%}\n{value|${params.value} properties}\n{name|${params.name}}`;
          },

          rich: {
            percent: {
              fontSize: 18,
              fontWeight: "bold",
              color: "#4B5563",
              lineHeight: 28,
            },
            value: {
              fontSize: 14,
              fontWeight: 600,
              color: "#6B7280",
              lineHeight: 22,
            },
            name: {
              fontSize: 12,
              color: "#9CA3AF",
              lineHeight: 18,
            },
          },
        },

        // Label lines
        labelLine: {
          show: true,
          length: 25,
          length2: 60,
          smooth: false,
        },

        emphasis: {
          scale: true,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0,0,0,0.3)",
          },
        },

        data,

        color: [
          "#8B5CF6",
          "#A855F7",
          "#9333EA",
          "#7C3AED",
          "#C084FC",
          "#DDD6FE",
        ],
      },
    ],
  };

  return (
    <ReactEcharts
      option={options}
      style={{ height: "500px", width: "100%" }}
    />
  );
};

export default PieChart;