/**  @jsx React.DOM */
var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    stuff: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState());
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.getChartState());
  },

  getChartState: function() {
    console.log("gcs", this.props);
    return {
      data: this.props.data,
      domain: this.props.domain,
      stuff: this.props.stuff
    };
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    d3Chart.destroy(el);
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});

// App.js

var Pagination = React.createClass({
  propTypes: {
    domain: React.PropTypes.object,
    getData: React.PropTypes.func,
    setAppState: React.PropTypes.func
  },
  
  render: function () {
    return (
      <p>
        {'Pages: '}
        <a href="#" onClick={this.handlePrevious}>Previous</a>
        <span> - </span>
        <a href="#" onClick={this.handleNext}>Next</a>
      </p>
    );
  },

  handlePrevious: function (e) {
    e.preventDefault();
    this.shiftData(-20);
  },

  handleNext: function (e) {
    e.preventDefault();
    this.shiftData(20);
  },

  shiftData: function (step) {
    var newDomain = _.cloneDeep(this.props.domain);
    newDomain.x = _.map(newDomain.x, function (x) {
      return x + step;
    });
    console.log("changing domain from to", this.props.domain, newDomain);
    newData = this.props.getData(newDomain);
    this.props.setAppState({
      data: newData,
      domain: newDomain
    });
  }
});


var sampleData = [
  {id: '5fbmzmtc', x: 7, y: 41, z: 6},
  {id: 's4f8phwm', x: 11, y: 45, z: 9},
  {id: 's4frphwm', x: 31, y: 35, z: 19}
];

var App = React.createClass({
  getInitialState: function() {
    console.log("initialstate");
    var domain = { x: [0, 30], y: [0, 100]};
    return {
      data: this.getData(domain),
      domain: domain,
      stuff: this.getStuff([])
    };
  },

  componentDidMount: function () {
    console.log("ajax request");
    $.ajax({
      url: "/demo_dev/browser-api/v1/resources/incident-list-item",
      dataType: "json",
      success: function (data) {
        console.log("ajax success");
        this.state.stuff = this.getStuff(data.data.data); // not a joke
      }.bind(this)
    });
  },

  getStuff: function (data) {
    return _.map(data, function (datum) {
      return {
        severity: datum.severity,
        priority: datum.priority,
        owner: datum.owner.propername
      };
    });
  },

  getData: function (domain) {
    console.log("about to filter", domain);
    return _.filter(sampleData, function (datum) {
      return datum.x >= domain.x[0] && datum.x <= domain.x[1];
    });
  },

  render: function() {
    console.log("render", this.state.domain, this.domain);
    return (
      <div className="App">
        <Pagination
          domain={this.state.domain}
          getData={this.getData}
          setAppState={this.setAppState} />
        <Chart
          data={this.state.data}
          stuff={this.state.stuff}
          domain={this.state.domain} />
      </div>
    );
  },

  setAppState: function (state, callback) {
    return this.setState(state, callback);
  }
});

React.renderComponent(App(), document.body);
