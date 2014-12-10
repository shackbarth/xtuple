/**  @jsx React.DOM */
var Pagination = React.createClass({
  propTypes: {
    schema: React.PropTypes.object,
    getData: React.PropTypes.func,
    fetchList: React.PropTypes.func
  },

  render: function () {
    return (<div className="bg-info form form-inline">
      <form className="form form-inline" role="form">
        <div className="form-group col-md-12 bg-info">
          <label for="businessObject" className="col-md-2">Business Object: </label>
          <select onChange={this.handleResourceChange} id="businessObject" className="form-control col-md-10">
            <option value=""></option>
            {this.props.schema && _.map(this.props.schema.resources, function(value, key) {
              return <option value={key}>{key}</option>;
            })}
          </select>
        </div>
      </form>
      <form className="form form-inline" role="form">
        <div className="form-group col-md-12 bg-info">
          <label for="groupBy" className="col-md-2">Group By Field: </label>
          <select onChange={this.handleGroupbyChange} id="groupBy" className="form-control col-md-10">
            <option value=""></option>
            {_.map(this.state && this.state.fields, function(value, key) {
              return <option value={key}>{value.title}</option>;
            })}
          </select>
        </div>
      </form>
      <form className="form form-inline" role="form">
        <div className="form-group col-md-12 bg-info">
          <label for="totalBy" className="col-md-2">Total By Field: </label>
          <select onChange={this.handleTotalbyChange} id="totalBy" className="form-control col-md-10">
            <option value=""></option>
            <option value="_count">Count</option>
            {_.map(this.state && _.omit(this.state.fields, function (value) {
              return value.type !== "number";
            }), function(value, key) {
              return <option value={key}>{value.title}</option>;
            })}
          </select>
        </div>
      </form>
    </div>);
  },

  componentDidUpdate: function() {
    if(this.state && this.state.groupBy && this.state.totalBy) {
      this.props.fetchList({
        path: this.state.path,
        groupBy: this.state.groupBy,
        totalBy: this.state.totalBy
      });
    }
  },

  handleResourceChange: function (event) {
    var recordType = event.target.value;
    this.setState({
      recordType: recordType,
      path: this.props.schema.resources[recordType].methods.get.path,
      fields: this.props.schema.schemas[recordType].properties
    });
  },

  handleGroupbyChange: function (event) {
    var fieldName = event.target.value;
    this.setState({
      groupBy: fieldName
    });
  },

  handleTotalbyChange: function (event) {
    var fieldName = event.target.value;
    this.setState({
      totalBy: fieldName
    });
  }
});


