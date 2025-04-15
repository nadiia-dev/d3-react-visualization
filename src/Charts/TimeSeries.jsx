import * as d3 from "d3";
import { useEffect, useState } from "react";

const TimeSeries = (props) => {
  let csvURL =
    "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv";
  const { width, height } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      getUrlData();
    }
  }, [data]);

  async function getUrlData() {
    let tempData = [];
    await d3.csv(
      csvURL,
      () => {},
      function (d) {
        tempData.push({
          date: d3.timeParse("%Y-%m-%d")(d.date),
          value: parseFloat(d.value),
        });
      }
    );
    setData(tempData);
  }

  function drawChart() {
    const margin = { top: 10, right: 50, bottom: 50, left: 50 };

    const svg = d3
      .select("#time_series")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      )
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    let y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.value;
        }),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    const line = d3
      .line()
      .x(function (d) {
        return x(d.date);
      })
      .y(function (d) {
        return y(d.value);
      });

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  }

  return <div id="time_series"></div>;
};

export default TimeSeries;
