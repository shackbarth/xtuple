/*global XM global require */

var vows = require('vows'),
    assert = require('assert');

require('../xv-core');

XV.honorific = new Object;

XV.honorific.createHash  = { 
  code: 'Sr'
};

XV.honorific.updateHash  = {  
  code: 'Sra'
};

var honorificSuite = vows.describe('XT Core Honorific Tests');

honorificSuite.addBatch({
  "XM.Honorific": {
    "Validate Class" : XV.record.validateClass(XM.Honorific),
    "Test CRUD-> CREATE" : XV.record.create(XM.Honorific, 
                                   XV.honorific.createHash,
                                   XV.honorific.createHashResult,
                                   XV.honorific.updateHash, 
                                   XV.honorific.updateHashResult)
  }
});


module.exports = honorificSuite;
