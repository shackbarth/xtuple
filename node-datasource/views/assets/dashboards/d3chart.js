var d3Chart = {};

d3Chart.create = function (el, props, state) {
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);

  svg.append('g')
      .attr('class', 'd3-points');

  this.update(el, state);
};

d3Chart.update = function (el, state) {
  // Re-compute the scales, and render the data points
  var scales = this._scales(el, state.domain);
  console.log("d3 state", state);
  this._drawPoints(el, scales, state.data, state.stuff);
};

d3Chart.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

d3Chart._scales = function (el, domain) {
  if (!domain) {
    return null;
  }
  var width = el.offsetWidth;
  var height = el.offsetHeight;
  var x = d3.scale.linear()
    .range([0, width])
    .domain(domain.x);
  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);
  var z = d3.scale.linear()
    .range([5, 20])
    .domain([1, 10]);
  return {x: x, y: y, z: z};
};

d3Chart._drawPoints = function (el, scales, data, stuff) {
  var g = d3.select(el).selectAll('.d3-points');

  var point = g.selectAll('.d3-point')
    .data(data, function (d) { return d.id; });

  // ENTER
  point.enter().append('circle')
      .attr('class', 'd3-point');

  // ENTER & UPDATE
  point.attr('cx', function (d) { return scales.x(d.x); })
      .attr('cy', function (d) { return scales.y(d.y); })
      .attr('r', function (d) { return scales.z(d.z) + 100 * stuff.length; });

  // EXIT
  point.exit()
      .remove();
};
