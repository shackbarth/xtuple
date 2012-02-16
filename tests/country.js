/*global XM global require */

var vows = require('vows'),
    assert = require('assert');

require('../xv-core');

XV.country = {};

XV.country.createHash  = { 
  guid: 1999, 
  abbreviation: 'EB',
  name: 'Elbonia',
  currencyName: 'Chit',
  currencySymbol: '!',
  currencyAbbreviation: 'CHT',
  currencyNumber: 666
};

XV.country.createHashResult = { 
  guid: 1999, 
  abbreviation: 'EB',
  name: 'Elbonia',
  currencyName: 'Chit',
  currencySymbol: '!',
  currencyAbbreviation: 'CHT',
  currencyNumber: 666
};

XV.country.updateHash  = {  
  name: 'Ebania'
};

XV.country.updateHashResult  = {  
  name: 'Ebania'
};

var countrySuite = vows.describe('XT Core Country Tests');

countrySuite.addBatch({
  "XM.Country": {
    "Validate Class" : XV.record.validateClass(XM.Country),
    "SetUserPrivs": XV.record.setUserPrivs('XM.UserAccount','admin'),
    "Test CRUD-> CREATE" : XV.record.create(XM.Country, 
                                            XV.country.createHash,
                                            XV.country.createHashResult,
                                            XV.country.updateHash, 
                                            XV.country.updateHashResult)
  }
});


module.exports = countrySuite;
