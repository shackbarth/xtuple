/**  @jsx React.DOM */

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
      url: "/demo_dev/discovery/v1alpha1/apis/v1alpha1/rest",
      dataType: "json",
      success: function (data) {
        console.log(data);
        this.setState({schema: data});
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
      <div className="App container">
        <Chart
          data={this.state.data}
          stuff={this.state.stuff}
          domain={this.state.domain} />
        <Pagination
          schema={this.state.schema}
          fetchList={this.fetchList} />
      </div>
    );
  },

  fetchList: function (options) {
    console.log("fetch list", options.path, options.groupBy);
    var path = options.path.substring(0, options.path.lastIndexOf("/"));
    $.ajax({
      url: "/demo_dev/browser-api/v1/" + path,
      dataType: "json",
      success: function (data) {
        console.log("success", data);
        //this.setState({stuff: this.getStuff(data.data.data)});
      }.bind(this)
    });
  }
});

React.renderComponent(App(), document.body);
