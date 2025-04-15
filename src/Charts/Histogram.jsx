import * as d3 from "d3";
import { useEffect, useState } from "react";

const Histogram = (props) => {
  const { width, height } = props;

  let jsonURL = "https://api.openbrewerydb.org/v1/breweries";

  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    } else {
      getData();
    }
  }, [data]);

  const getData = async () => {
    let urlResponse = await fetch(jsonURL);
    let jsonResult = await urlResponse.json();

    let stateFreq = {};
    jsonResult.forEach((element) => {
      if (stateFreq[element.state] > 0) {
        stateFreq[element.state] = stateFreq[element.state] + 1;
      } else {
        stateFreq[element.state] = 1;
      }
    });

    let stateFreqArray = Object.keys(stateFreq).map(function (key) {
      return { state: key, frequency: stateFreq[key] };
    });

    setData(
      stateFreqArray.sort(function (a, b) {
        return b.frequency - a.frequency;
      })
    );
  };

  function drawChart() {
    d3.select("#histogram").selectAll("*").remove();
    const margin = { top: 70, right: 50, bottom: 70, left: 50 };

    const svg = d3
      .select("#histogram")
      .append("svg")
      .style("background-color", "white")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(0,-${margin.bottom - 10})`);

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.state))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency)])
      .range([height - margin.bottom, margin.top]);

    const barColors = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.frequency)])
      .range(["blue", "red"]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.state))
      .attr("y", (d) => yScale(d.frequency))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.frequency))
      .style("padding", "3px")
      .style("margin", "1px")
      .style("width", (d) => `${d * 10}px`)
      .attr("fill", function (d) {
        return barColors(d.frequency);
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1);
  }

  return (
    <div>
      <div id="histogram"></div>
    </div>
  );
};

export default Histogram;
