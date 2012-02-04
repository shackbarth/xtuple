/*global XM global require */

var vows = require('vows'),
    assert = require('assert');

require('../xv-core');

var createHash  = { 
  guid: 1999, 
  code: 'Sr'
};

var updateHash  = {  
  code: 'Sra'
};

var honorificSuite = vows.describe('XT Core Honorific Tests');

honorificSuite.addBatch({
  "XM.Honorific": {
    "Validate Class" : {
      topic: function() {
        return XM.Honorific;
      },
      'is not null': function (recordType) {
        assert.isNotNull(recordType);
      },
      'is of type SC.Record': function(recordType) {
        assert.isKindOf(recordType, SC.Record);
      }
    },
    "-> CREATE" : {
      topic: XV.record.create(XM.Honorific, createHash),
      'status is READY_NEW' : assert.status(SC.Record.READY_NEW),
      'guid is number' : assert.propertyIsNumber('guid'),
      'code is "Sr"' : assert.property('code','Sr'),
      "-> commit" : {
        topic: XV.record.commit(),
        'status is READY_CLEAN' : assert.status(SC.Record.READY_CLEAN),
        "-> READ" : {
          topic: XV.record.refresh(),
          'status is READY_CLEAN' : assert.status(SC.Record.READY_CLEAN),
          'code is "Sr"' : assert.property('code','Sr'),
          "-> UPDATE" : {
            topic: XV.record.update(updateHash),
            'status is READY_DIRTY' : assert.status(SC.Record.READY_DIRTY),
            'code is "Sra"' : assert.property('code','Sra'),
            "-> commit" : {
              topic: XV.record.commit(),
              'status is READY_CLEAN' : assert.status(SC.Record.READY_CLEAN),
              "-> READ" : {
                topic: XV.record.refresh(),
                'status is READY_CLEAN' : assert.status(SC.Record.READY_CLEAN),
                'code is "Sra"' : assert.property('code','Sra'),
                "-> DELETE" : {
                  topic: XV.record.destroy(),
                  'status is DESTROYED_DIRTY' : assert.status(SC.Record.DESTROYED_DIRTY),
                  "-> commit" : {
                    topic: XV.record.commit(SC.Record.DESTROYED_CLEAN),
                    'status is DESTROYED_CLEAN' : assert.status(SC.Record.DESTROYED_CLEAN)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});


module.exports = honorificSuite;
