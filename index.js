import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import "./index.css";

const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

window.onload = async () => {
  const response = await fetch(dataUrl);
  const json = await response.json();
  init(json.data);
}

const init = (exData) => {
  const App = () => (
    <div>
      <h1 id="title">United States GDP</h1>
      <div id="chartWrapper">
        <div id="chart"></div>
      </div>
      <p id="info">For more info please visit the &nbsp;
        <a target="_blank" href="https://en.wikipedia.org/wiki/Economy_of_the_United_States">
          link
        </a>
      </p>
    </div>
  );
  ReactDOM.render(<App/>, document.getElementById("root"));
  
  const data = [...exData.map(a => ({"data-date": a[0], "data-gdp":a[1]}))];
  
  //CONSTANTS ↓
  const w = 850, h = 450, hpad = 50, vpad= 20;
  //CONSTANTS ↑
  d3
    .select("#chart")
    .style("position", "relative")
    .style("width", w)
    .style("height", h);
  
  const chartSvg = d3
                    .select("#chart")
                    .append("svg")
                    .classed("chartSvg", true)
                    .attr("width", w)
                    .attr("height", h);
  
  const xScale = d3
                  .scaleBand()
                  .domain(data.map(d=>d["data-date"]))
                  .range([hpad, w-hpad])
                  .paddingInner([.1]);
  
  const firstDate = new Date(data[0]["data-date"]);
  const lastDate = new Date(data[data.length-1]["data-date"]);
  const xaxisScale = d3
                      .scaleTime()
                      .domain([firstDate, lastDate])
                      .range([hpad, w-hpad]);
  
  const yScale = d3
                  .scaleLinear()
                  .domain([0, d3.max(data, d=>d["data-gdp"])])
                  .range([h-vpad, vpad]);
  
  // Axis ↓
  chartSvg
          .append("g")
          .attr("id", "x-axis")
          .attr("transform", `translate(0, ${h-vpad})`)
          .call(d3.axisBottom(xaxisScale));
  chartSvg
          .append("g")
          .attr("id", "y-axis")
          .attr("transform", `translate(${hpad}, 0)`)
          .call(d3.axisLeft(yScale));
  // Axis ↑
  
  const handleMouseOver = (e, d) => {
    
    let offset, direction;
    const lO = 15; // labelOffset
    if (xScale(d["data-date"]) > w/2) {
      direction= "right";
      offset = w-xScale(d["data-date"])+lO;
    } else {
      direction= "left";
      offset = xScale(d["data-date"])+lO;
    }
    
    const text = `date: ${d["data-date"]}<br/>gdp: ${d["data-gdp"]}`;
  
    d3.select("#chart")
      .append("div")
      .attr("id", "tooltip")// id
      .classed("d3-tip", true)// class
      .attr("data-date", d["data-date"])
      .attr("data-gdp", d["data-gdp"])
      .style("position", "absolute")
      .style("top", h/2+50)
      .style(direction, offset)
      .html(text);
  }
  const handleMouseOut = () => {
    d3.select("#tooltip").remove();
  }
  
  chartSvg
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .classed("bar", true)
          .attr("data-date", d=>d["data-date"])
          .attr("data-gdp", d=>d["data-gdp"])
          .attr("x", d=>xScale(d["data-date"]))
          .attr("width", xScale.bandwidth())
          .attr("y", d=>yScale(d["data-gdp"]))
          .attr("height", d=>h-vpad-yScale(d["data-gdp"]))
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);
}
