Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

$(document).ready(function() {
    create_graph();

    $("#create_histogram").click(function() {
        create_graph();
    });

    $( window ).on( "orientationchange", function( event ) {
        create_graph();
    });

});

d3.select(window).on('resize', create_graph);

function create_graph() {


    d3.select("svg").remove();

    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30};
    var width = parseInt(d3.select('#chart').style('width'), 10);
    width = width - margin.left - margin.right;
    var height = parseInt(d3.select('#chart').style('height'), 10);
    height = 200 - margin.top - margin.bottom;

    var values = $("#input_data").val().split(",") || [1,2,3,3,4,4,4,5,5,6,7];
    var min = values.min() - 1;
    var max = values.max() + 1;

    var x = d3.scale.linear()
        .domain([min, max])
        .range([0, width]);

    var data = d3.layout.histogram()
        .bins(x.ticks(20))
        (values);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", (x.range()[1] - x.range()[0]) / data.length - 2)
        .attr("height", function(d) { return height - y(d.y); });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}

