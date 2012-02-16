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
    "Load User Account": {
      topic: function() {
        var timeoutId,
            callback = this.callback,
            record = XM.store.find('XM.UserAccount', 'admin');
        
        record.addObserver('status', record, function observer() {
          if (record.get('status') === SC.Record.READY_CLEAN) {
            clearTimeout(timeoutId);
            record.removeObserver('status', record, observer);
            callback(null, record); // return the record
          }
        })

        timeoutId = setTimeout(function() {
          callback(null, record);
        }, 5000) // five seconds
      },
      'status is READY_CLEAN': XV.callback.assert.status(SC.Record.READY_CLEAN),
      'id matches':  XV.callback.assert.property('id', 'admin')
    },
    "Test CRUD-> CREATE" : XV.record.create(XM.Country, 
                                            XV.country.createHash,
                                            XV.country.createHashResult,
                                            XV.country.updateHash, 
                                            XV.country.updateHashResult)
  }
});


module.exports = countrySuite;
