function About() {
    return (
        <div className="about">
            <h2>What is this website?</h2>
            <p>This website visualizes the air quality data provided by <a href="https://docs.openaq.org/">Openaq API</a>. Search a country's air quality data by the two-letter country code to receive the latest 100 or optional user-based limit geological coordinates representation of the data on a map </p>
            <p>Each coordinate is visually represented by the type of location such as [government, research, or community], and has a tooltip to access further details.</p>
            <p>When you click on a point it redirects you to another page to view further measurement details of that location and showcases two further visualizations:</p>
            <li><b>Bar Chart:</b> showcases the average value of each measurements parameters</li>
            <li><b>Scatter Plot:</b> showcases the latest 100 measurement recordings from that location</li>
            <br/>
            <h2>Interactivity</h2>
            <p>Country Map: Has a tooltip that shows further information on a location, a zoom tool to zoom in closer in the map to better click and see the data points, and a filter tool to filter what type of location you want to see</p>
            <p>Scatter Plot: Has a tooltip that shows further information on a measurement, zoom tool to zoom in closer in the graph to better click and see the data points, and filter tool to filter what type of measurement parameter you want to see</p>
            <br/>
            <h2>DATA</h2>
            <p>Air quality data: <a href="https://openaq.org/">Openaq</a></p>
            <p>Country's GeoJSON <a href="https://datahub.io/core/geo-countries#resource-countries">Country Polygons as GeoJSON </a></p>
            <p>Country codes <a href="https://datahub.io/core/country-codes">Comprehensive country codes </a></p>
        
        </div>
    );
}
export default About;