/*global XM global require */

var vows = require('vows'),
    assert = require('assert');

require('sys');

XV = new Object;

/** Add some generic topics **/

XV.record = {};

XV.record.create = function (recordType, dataHash) {
  return function (record) {
    var record = XM.store.createRecord(recordType, dataHash).normalize();
    
    record.validate();
    
    return record;          
  };
};

XV.record.commit = function (status) {
  return function (record) {
    XV.record._handleAction(record, status, record.commitRecord, this.callback);
  };
};

XV.record.refresh = function () {
  return function (record) {
    XV.record._handleAction(record, SC.Record.READY_CLEAN, record.refresh, this.callback);
  };
};

XV.record.destroy = function () {
  return function (record) {
    return record.destroy();
  };
};

/* @private */
XV.record._handleAction = function(record, status, action, callback) {
    var timeoutId,
        sts = status ? status : SC.Record.READY_CLEAN;
    
    record.addObserver('status', record, function observer() {
      if (record.get('status') === sts) {
        clearTimeout(timeoutId);
        record.removeObserver('status', record, observer);
        callback(null, record); // return the record
      }
    });

    timeoutId = setTimeout(function() {
      callback(null, record);
    }, 5000); // five seconds

    action.call(record);
};

/** Add some SC specific tests */

assert.isKindOf = function (actual, expected, message) {
  if (! SC.kindOf(actual, expected)) {
    assert.fail(actual, expected, message || "expected {actual} to be a {expected}", "kindOf", assert.isKindOf);
  }
};

assert.status = function (status) {
  return function (err, record) {
      assert.equal (record.get('status'), status);
  };
};

assert.propertyIsNumber = function (property) {
  return function (err, record) {
      var value = record.get(property);

      assert.isNumber (isNaN(value - 0) ? value : value - 0);
  };
};

assert.property = function (prop, value) {
  return function (err, record) {
      assert.equal (record.get(prop), value);
  };
};
