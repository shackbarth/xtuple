/**  @jsx React.DOM */
var Pagination = React.createClass({
  propTypes: {
    schema: React.PropTypes.object,
    getData: React.PropTypes.func,
    setAppState: React.PropTypes.func
  },

  render: function () {
    console.log("render controls", this.props && this.props.schema);
    return (
      <div>
      <select onChange={this.handleResourceChange}>
        <option value=""></option>
        {this.props.schema && _.map(this.props.schema.schemas, function(value, key) {
          return <option value={key}>{key}</option>;
        })}
      </select>

      <select onChange={this.handleGroupbyChange}>
        <option value=""></option>
        {_.map(this.state && this.state.fields, function(value, key) {
          return <option value={key}>{value.title}</option>;
        })}
      </select>
      </div>
    );
  },

  handleResourceChange: function (event) {
    var recordType = event.target.value;
    this.setState({
      recordType: recordType,
      fields: this.props.schema.schemas[recordType].properties
    });
    console.log("change", event.target.value);
  },

  handleGroupbyChange: function (event) {
    var fieldName = event.target.value;
    this.props.setAppState({
      query: {
        recordType: this.state.recordType,
        groupBy: fieldName
      }
    });
  }

  /*
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
  }*/
});


