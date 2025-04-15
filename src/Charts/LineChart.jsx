import * as d3 from "d3";
import { useState } from "react";
import { useEffect } from "react";

const LineChart = (props) => {
  const { width, height } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    generateData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
  }, [data]);

  const generateData = () => {
    const chartData = [];
    for (let i = 0; i < 20; i++) {
      const value = Math.floor(Math.random() * i + 3);
      chartData.push({
        label: i,
        value,
      });
    }
    setData(chartData);
  };

  function drawChart() {
    const margin = { top: 10, right: 50, bottom: 50, left: 50 };
    const yMinValue = d3.min(data, (d) => d.value);
    const yMaxValue = d3.max(data, (d) => d.value);
    const xMinValue = d3.min(data, (d) => d.label);
    const xMaxValue = d3.max(data, (d) => d.label);

    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);

    const yScale = d3.scaleLinear().range([height, 0]).domain([0, yMaxValue]);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));

    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom().scale(xScale).tickSize(15));

    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    const line = d3
      .line()
      .x((d) => xScale(d.label))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f6c3d0")
      .attr("stroke-width", 4)
      .attr("class", "line")
      .attr("d", line);
  }

  return <div id="container"></div>;
};

export default LineChart;
