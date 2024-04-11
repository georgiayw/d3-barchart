import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

import './App.css';

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
      const jsonData = await response.json();
      setData(jsonData.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const sortedData = data.sort((a, b) => new Date(a[0]) - new Date(b[0]));

      const dataDate = sortedData.map(d => d[0]);
      const gdpValues = sortedData.map(d => d[1]);

      const svg = d3.select("svg");
      const margin = { top: 20, right: 20, bottom: 60, left: 40 };
      const width = +svg.attr("width") - margin.left - margin.right;
      const height = +svg.attr("height") - margin.top -  margin.bottom; 

      //define scales
      const xScale = d3.scaleBand()
                        .range([0, width])
                        .padding(0.1)
                        .domain(dataDate);

      const yScale = d3.scaleLinear()
                        .range([height, 0])
                        .domain([0, d3.max(gdpValues)]);

      const g = svg.append("g")
                    .attr
                    ("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

      //x-axis 
      g.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", "1px");

      //y-axis 
      g.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale));

      var Tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("padding", "5px")
      .attr("data-date", "");


      var mouseover = function(d) {
      Tooltip
      .style("opacity", 1)
      d3.select(this)
      .style("stroke", "white")
      .style("opacity", 1)
      }
      var mousemove = function(event, d) {
        var Tooltip = d3.select("#tooltip");
        var barDataDate = d3.select(this).attr("data-date");
        var xScaleDate = xScale(d[0]);
        console.log("data-date attribute:", barDataDate);
        console.log("xScale date:", d[0], "->", xScaleDate);
        
        Tooltip
          .html("<strong>Date: </strong>" + barDataDate + 
          "<br><strong>GDP: </strong> $" + d[1] + " Billion")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .style("opacity", 0.9)
          .attr("data-date", d[0]);

          console.log("data-date attribute:", barDataDate);
      }
      var mouseleave = function(d) {
      Tooltip
      .style("opacity", 0)
      d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
      }

      g.selectAll(".bar")
        .data(sortedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d[0])) // Use xScale to position bars based on date
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d[1]))
        .attr("data-date", d => d[0]) // Set data-date attribute to the date associated with each bar
        .attr("data-gdp", d => d[1])
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }
  }, [data])

  return (
    <div className="App">
      <div id="title">United States GDP</div>
      <svg width="800" height="500"></svg>
      
    </div>
  );
}

export default App;
