// @TODO: YOUR CODE HERE!
function makeResponsive() {

    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 100,
        bottom: 60,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
    d3.csv("assets/data/data.csv").then(function (data) {

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        data.forEach(function (datas) {
            datas.poverty = +datas.poverty;
            datas.healthcare = +datas.healthcare;
        });

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([9, d3.max(data, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([4, d3.max(data, d => d.healthcare)])
            .range([height, 0]);

        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // Source: http://www.d3noob.org/2016/08/changing-number-of-ticks-on-axis-in.html
        // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call((bottomAxis)
            .ticks(5));

        chartGroup.append("g")
            .call((leftAxis)
            .ticks(10));

        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "12")
            .attr("fill", "blue")
            .attr("opacity", ".6");

        // Step 6: Create Bubble text
        // =============================
        // Source: https://observablehq.com/@minminyu/d3-bubble-chart
        // Source: https://multimedia.report/classes/coding/2018/exercises/basicbubblepackchart/
        // Source: https://bl.ocks.org/officeofjane/a70f4b44013d06b9c0a973f163d8ab7a
        // Source: https://observablehq.com/@d3/bubble-chart
        // Source: https://stackoverflow.com/questions/46138371/d3-js-v4-adding-text-labels-to-bubbles-on-a-bubble-chart
        chartGroup
        .selectAll(null)
           .data(data)
           .enter()
           .append("text")
           .attr("font-size", "10px",)
           .attr("text-anchor", "middle")
           .attr("fill", "white")
           .text(d => d.abbr)
           .attr("x", function (d) {
               return xLinearScale(d.poverty)
           })
           .attr("y", function (d) {
               return yLinearScale(d.healthcare)
           });

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height - 140))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)")
            .attr("font-weight", "bold");

        chartGroup.append("text")
            .attr("transform", `translate(${width - 430}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("In Poverty (%)")
            .attr("font-weight", "bold");
    }).catch(function (error) {
        console.log(error);
    });
}

makeResponsive();
