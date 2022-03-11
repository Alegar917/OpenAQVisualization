import * as d3 from "d3";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate  } from "react-router-dom";

function Geo(props) {

const {data, map} = props
const navigate = useNavigate();
const [filter, setfilter] = useState("")
const [loading, setLoading] = useState(false)
const margin = {top: 10, right: 30, bottom: 50, left: 60},
width = 1200 - margin.left - margin.right,
height = 800 - margin.top - margin.bottom;

const zoom = d3.zoom()
  .scaleExtent([1, 5])
  .translateExtent([[0, 0], [ width ,  height]])
  .on('zoom', handleZoom);

function handleZoom(e) {
  d3.select('svg g')
    .attr('transform', e.transform);
}
const entity = ['government', 'research', 'community', 'undefined']

const handleSearchChanges = (evt) => {
  const { name, value } = evt.target;
  setfilter(value);
}


const color = d3.scaleOrdinal()
  .range(d3.schemeSet1)
  .domain(entity);
useEffect(() =>{
    d3.select("#vis").selectAll("*").remove();
    const svg = d3.select("svg").attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(zoom)
    .append("g")
    // .attr("transform", `translate(${margin.left}, ${margin.top})`);
    const projection = d3.geoConicEqualArea();
    projection.parallels([37.692514, 37.840699]);
    projection.rotate([122, 0]);
    const path = d3.geoPath().projection(projection);
    
    projection.fitSize([width, height], map);

    svg.selectAll("path")
    .data(map.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "land")
    .style("fill", "grey");

    let filterArr = data.results;

    if (filter !== '') {
      filterArr = data.results.filter(d => { return d.entity===filter})
    }


    svg.selectAll("circle")
    .data(filterArr)	
    .enter()
    .append("circle")
    .style("fill", function(d) { return color(d.entity) })
    .attr("class", "cities")
    .attr("r", 3)
    .attr("cx", function(d) { return (d.coordinates) ? projection([d.coordinates.longitude,d.coordinates.latitude])[0]: null})	
    .attr("cy", function(d) {return (d.coordinates) ? projection([d.coordinates.longitude,d.coordinates.latitude])[1]: null})
    .on("mouseover", function(d,i) {

      svg.selectAll("circle")
      .select( function(d) { return d===i?this:null;})
      .transition()
      .style('stroke', '#222222')
      .attr("r", 6)

      const x = d3.pointer(d)

      const parameters = [];
      i.parameters.forEach(function(element) {
        if (element.unit === "µg/m³") {
          parameters.push(`${element.displayName}: ${element.average} ${element.unit}<br/>`);
        }
      });
    
      tooltip.transition()		
      .duration(200)	
      .style("opacity", 1);

      tooltip.html(`<b>Name: ${i.name}</b><br/>
                  SensorType: ${i.sensorType}<br/>
                  <b>Average:</b><br/>
                  ${parameters.join("")}
                  Last Updated: ${new Date(i.lastUpdated).toLocaleString()}<br/>
                  `)
      .style("stroke", "black")
      .style("top", (x[1]+60)+"px")
      .style("left", (x[0]+15)+"px");
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
    .on("click", function(d, i) {
      setLoading(true)
      axios.get(`https://docs.openaq.org/v2/measurements?date_from=2000-01-01T00%3A00%3A00%2B00%3A00&date_to=2022-03-08T04%3A45%3A00%2B00%3A00&location_id=${i.id}`)
      .then(res => {
        console.log(res.data)
        navigate('/summary',{state: {...i, headerColor: color(i.entity), points: res.data.results}});
      });
      tooltip.transition()		
          .duration(500)		
          .style("opacity", 0);	
      });
    
  
    const tooltip = d3.select("body").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  //     //Initialize legend
  // var legendItemSize = 12;
  // var legendSpacing = 4;
  // var xOffset = 50;
  // var yOffset = 50;
  // var legend = d3
  //   .select('#legend')
  //   .append('svg')
  //         .selectAll('.legendItem')
  //         .data(color.domain());

  //   legend
  //     .enter()
  //     .append('rect')
  //     .attr('class', 'legendItem')
  //     .attr('width', legendItemSize)
  //     .attr('height', legendItemSize)
  //     .style('fill', d => color(d))
  //     .attr('transform',
  //               (d, i) => {
  //                   var x = xOffset;
  //                   var y = yOffset + (legendItemSize + legendSpacing) * i;
  //                   return `translate(${x}, ${y})`;
  //               });

  //   legend
  //     .enter()
  //     .append('text')
  //     .attr('x', xOffset + legendItemSize + 5)
  //     .attr('y', (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
  //     .text(d => (d == null) ?  "undefined" :  d);  

},[filter])
return (
  <div className='Map'>
    <div className="d-flex align-items-center">
        {loading ? <strong>Loading...</strong>: null}
    </div>
    <div id="legend">
    {
      entity.map((item) => (
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="radio"  value={item} onChange={handleSearchChanges} />
            <label style={{color: color(item)}} className="form-check-label">
            {item}
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
    </div>
    <svg id="vis"></svg>
    </div>
  );
}

export default Geo;