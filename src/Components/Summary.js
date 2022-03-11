import * as d3 from "d3";
// import axios from 'axios';
import { Card, ListGroup  } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Summary(props) {

const { state } = useLocation();
const [filter, setfilter] = useState("")
const [flag, setFlag] = useState(true)
const margin = {top: 10, right: 30, bottom: 50, left: 60},
width = 1200 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;

const zoom = d3.zoom()
  .scaleExtent([1, 5])
  .translateExtent([[0 - margin.left, 0-margin.top], [ width + margin.right,  height + margin.bottom]])
  .on('zoom', handleZoom);

const parameterlabel = state.parameters.map(item => item.parameter)
  .filter((value, index, self) => self.indexOf(value) === index)

const color = d3.scaleOrdinal()
  .range(d3.schemeCategory10)
  .domain(parameterlabel);

function handleZoom(e) {
  d3.select('svg g')
    .attr('transform', e.transform);
}

const handleSearchChanges = (evt) => {
  const { name, value } = evt.target;
  setfilter(value);
}

useEffect(() =>{
  d3.select("#vis2").selectAll("*").remove();
  const svg = d3.select("#vis2").attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(zoom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let filterArr = state.points;

    if (filter !== '') {
      filterArr = state.points.filter(d => { return d.parameter===filter})
    }

    const x = d3.scaleTime()
      .domain([d3.min(filterArr, (d) => new Date(d.date.local)), d3.max(state.points, (d) => new Date(d.date.local))])
      .range([ 0, width])
      .nice();

      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
      }

      function wrap(text, wrapWidth, yAxisAdjustment = 0) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")) - yAxisAdjustment,
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", `${dy}em`);
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > wrapWidth) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
        return 0;
      }

   const axisbottom = d3.axisBottom(x).tickFormat(d3.timeFormat("%b%d,%y %I:%m"))
   svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(axisbottom).selectAll(".tick text")
      .call(wrap, axisbottom.tickSize(), 1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filterArr, (d) => d.value)])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
    svg.append('g')
      .selectAll("dot")
      .data(filterArr)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(new Date(d.date.local)); } )
        .attr("cy", function (d) { return y(d.value); } )
        .attr("r", 3)
        .style("fill", function(d) { return color(d.parameter) })
        .on("mouseover", function(d,i) {
          const x = d3.pointer(d)

          svg.selectAll("circle")
            .select( function(d) { return d===i?this:null;})
            .transition()
            .style('stroke', '#222222')
            .attr("r", 6)
    

          tooltip.transition()		
          .duration(200)	
          .style("opacity", 1);
    
          tooltip.html(`<b>Name: ${i.parameter}</b><br/>
                      value: ${i.value} (${i.unit})<br/>
                      Last Updated: ${new Date(i.date.local).toLocaleString()}
                      `)
          .style("stroke", "black")
          .style("top", (x[1] + 100)+"px")
          .style("left", (x[0]+ 100)+"px");
        })
        .on("mouseout", function(d,i) {
          svg.selectAll("circle")
            .select( function(d) { return d===i?this:null;})
            .transition()
            .style('stroke',"none")
            .attr("r", 3)	

          tooltip.transition()		
              .duration(500)		
              .style("opacity", 0);	
        })
    
    const tooltip = d3.select("body").append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("width", "100px")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

      svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 500)
        .attr("y", height + margin.bottom - margin.top + 5)
        .text("Latest Time of Update");
      
      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -200)
        .attr("y",-margin.left + margin.right -20)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("value");
        
    if (flag) {
      setFlag(false)
      const svg2 = d3.select("#vis3")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
      const barX = d3.scaleBand()
        .range([ 0, width ])
        .domain(state.parameters.map((d) => d.displayName))
        .padding(0.2);
      svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(barX))
        .selectAll("text")
          .attr("transform", "translate(10,0)rotate(0)")
          .style("text-anchor", "end");

      const barY = d3.scaleLinear()
        .domain([d3.min(state.parameters, (d) => d.average), d3.max(state.parameters, (d) => d.average)])
        .range([ height, 0])
        .nice();
      svg2.append("g")
        .call(d3.axisLeft(barY));

      svg2.selectAll("bar")
      .data(state.parameters)
      .join("rect")
        .attr("x", d => barX(d.displayName))
        .attr("y", d => barY(d.average))
        .attr("width", barX.bandwidth())
        .attr("height", d => height - barY(d.average))
        .style("stroke", "black")
        .style("fill", function(d) { return color(d.parameter) })
      
      svg2.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 500)
        .attr("y", height + margin.bottom - 10 )
        .text("Type of Parameter");
    
      svg2.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -200)
        .attr("y",-margin.left + margin.right -20)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Average");
        
    }
},[filter]);

return (
  <div className='Summary'>
      <Card style={{ height: '10em', backgroundColor: state.headerColor }} className="text-black">
        <Card.Title style={{fontSize:"60px"}}> Location: {state.name}, {state.country}</Card.Title>
        <Card.Subtitle style={{fontSize:"20px"}} className="mb-2  mx-2">Last Update: {new Date(state.lastUpdated).toLocaleString()}</Card.Subtitle>
        <div>
          <button type="button" className="btn btn-outline-dark mx-2">Measurements: {state.measurements.toLocaleString()}</button>
          <button type="button" className="btn btn-outline-dark">Entity: { (state.entity == null) ?  "undefined" :  state.entity}</button>
          <button type="button" className="btn btn-outline-dark mx-2">SensorType: { (state.sensorType == null) ?  "undefined" :  state.sensorType}</button>
          <button type="button" className="btn btn-outline-dark mx-2">SensorType: { (state.sensorType == null) ?  "undefined" :  state.sensorType}</button>
          {state.isAnalysis ? <button type="button" className="btn btn-outline-dark mx-2">IsAnalysis</button> : null}
          {state.isMobile ?  <button type="button" className="btn btn-outline-dark mx-2">IsMobile</button>: null}
        </div>
      </Card>
      <br/>
      {
        state.parameters.map((item) => (
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="radio" id={item.id} value={item.parameter} onChange={handleSearchChanges}/>
            <label style={{color: color(item.parameter)}} className="form-check-label">
            {item.displayName}
            </label>
          </div>
        ))
      }
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="radio" name="radio" id="all" value="" onChange={handleSearchChanges} defaultChecked/>
        <label className="form-check-label">
          All
        </label>
      </div>
      <div className="ibox-content">
        <div className="row">
          <div className="col-md-6">
            <svg id="vis2"></svg>
          </div>
          <div className="col-md-6">
            <svg id="vis3"></svg>
          </div>
       </div>
      </div>
      <br/>
      {/* <svg id="vis2"></svg>
      <svg id="vis3"></svg> */}
      <table style={{ width: '100%' }} className="table table-striped ">
        <thead>
          <tr>
            <th scope="col">Parameter</th>
            <th scope="col">Average</th>
            <th scope="col">Count</th>
            <th scope="col">Last Updated</th>
          </tr>
        </thead>
        <tbody>
        {
          state.parameters.map((item) => (
            <tr key={item.id}>
              <td>{item.displayName} ({item.parameter})</td>
              <td>{item.average} {item.unit}</td>
              <td>{item.count.toLocaleString()}</td>
              <td>{new Date(item.lastUpdated).toLocaleString()}</td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  );
}

export default Summary;