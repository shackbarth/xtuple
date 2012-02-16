/*global XM global require */

var vows = require('vows'),
    assert = require('assert');

XV = new Object;

/** Add some generic topics **/

XV.record = {};

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

XV.record.create = function (recordType, 
                             createdDataHash, 
                             createHashResult, 
                             updateHash, 
                             updateHashResult,
                             destroy) {
  var context = {
    topic: function() {
      var record = XM.store.createRecord(recordType, createdDataHash).normalize();
    
      record.validate();
    
      this.callback(null, record);    
    }
  }

  context['status is READY_NEW'] = XV.callback.assert.status(SC.Record.READY_NEW);
  context['guid is number'] =  XV.callback.assert.propertyIsNumber('guid');
  context['validate properties'] =  XV.callback.assert.properties(XV.createHashResult);
  context['-> commit'] = XV.record.createdCommit(createHashResult,
                                                 updateHash, 
                                                 updateHashResult,
                                                 destroy);
 
  return context;
}

XV.record.createdCommit = function(createHashResult, updateHash, updateHashResult, destroy) {
  var context = {
    topic: XV.record.commit()
  }

  context['status is READY_CLEAN'] = XV.callback.assert.status(SC.Record.READY_CLEAN);
  context['-> READ'] = XV.record.createdRefresh(createHashResult,
                                                updateHash, 
                                                updateHashResult,
                                                destroy);

  return context;
}

XV.record.createdRefresh = function(createHashResult, updateHash, updateHashResult, destroy) {
  var context = {
    topic:  XV.record.refresh()
  }

  context['status is READY_CLEAN'] = XV.callback.assert.status(SC.Record.READY_CLEAN);
  context['validate properties'] = XV.callback.assert.properties(createHashResult);
  context['-> UPDATE'] = XV.record.update(updateHash, updateHashResult, destroy);

  return context;
}

XV.record.update = function (dataHash, dataHashResult, destroy) {
  var context = {
    topic: function(record) {
      for(var prop in dataHash) {
        record.set(prop, dataHash[prop]);
      }

      this.callback(null, record);  
    }
  }

  context['status is READY_DIRTY'] = XV.callback.assert.status(SC.Record.READY_DIRTY);
  context['validate properties'] = XV.callback.assert.properties(dataHashResult);
  context['-> commit'] = XV.record.updatedCommit(dataHashResult, destroy);

  return context;

};

XV.record.updatedCommit = function(dataHashResult, destroy) {
  var context = {
    topic: XV.record.commit()
  }

  context['status is READY_CLEAN'] = XV.callback.assert.status(SC.Record.READY_CLEAN);
  context['-> READ'] = XV.record.updatedRefresh(dataHashResult, destroy);

  return context;
}

XV.record.updatedRefresh = function(dataHashResult, destroy) {
  var context = {
    topic:  XV.record.refresh()
  },
  destroy = destroy !== false ? true : false;

  context['status is READY_CLEAN'] = XV.callback.assert.status(SC.Record.READY_CLEAN);
  context['validate properties'] = XV.callback.assert.properties(dataHashResult);
  if(destroy) context['-> DELETE'] = XV.record.destroy();

  return context;
}

XV.record.destroy = function() {
  var context = {
    topic: function(record) {
      record.destroy()
      
      this.callback(null, record);
    }
  }

  context['status is DESTROYED_DIRTY'] = XV.callback.assert.status(SC.Record.DESTROYED_DIRTY);
  context['-> commit'] = XV.record.destroyedCommit();

  return context;
}

XV.record.destroyedCommit = function() {
  var context = {
    topic: XV.record.commit(SC.Record.DESTROYED_CLEAN)
  }

  context['status is DESTROYED_CLEAN'] = XV.callback.assert.status(SC.Record.DESTROYED_CLEAN);

  return context;
}

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

XV.record.validateClass = function(recordType) {
  var context = {
    topic: function () {
      this.callback(null, recordType);
    }
  };

  context['is not null'] = XV.callback.assert.isNotNull();
  context['is type of SC.Record'] = XV.callback.assert.isKindOf(SC.Record);

  return context;
}

/** Add some SC specific tests */

assert.isKindOf = function (actual, expected, message) {
  if (! SC.kindOf(actual, expected)) {
    assert.fail(actual, expected, message || "expected {actual} to be a {expected}", "kindOf", assert.isKindOf);
  }
};

XV.callback = {};
XV.callback.assert = {};

XV.callback.assert.status = function (status) {
  return function (err, record) {
    assert.equal (record.get('status'), status);
  }
};

XV.callback.assert.propertyIsNumber = function (property) {
  return function (err, record) {
    var value = record.get(property);

    assert.isNumber (isNaN(value - 0) ? value : value - 0);
  }
};

XV.callback.assert.property = function (prop, value) {
  return function (err, record) {
    assert.equal (record.get(prop), value);
  }
};

XV.callback.assert.properties = function (dataHash, message) {
  return function (err, record) {
    for(var prop in dataHash) {
      var actual = record.get(prop),
          expected = dataHash[prop];
        
      if(actual !== expected) {
        assert.fail(actual, expected, message || "expected " + prop + " {actual} to be {expected}", 
                    "properties", assert.properties);
      }
    }
  }
};

XV.callback.assert.isNotNull = function() {
  return function (err, recordType) {
    assert.isNotNull(recordType);
  }
};

XV.callback.assert.isKindOf = function(expected) {
  return function (err, actual) {
    assert.isKindOf(actual, expected);
  }
};




