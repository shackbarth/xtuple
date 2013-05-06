/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
assert = require('chai').assert,
expect = require('chai').expect,
zombieAuth = require('../lib/zombie_auth'),

data = {
      recordType : "XM.IncidentSeverity",
      autoTestAttributes : true,
      createHash : {
        name: 'Top',
        description: 'Top'
      },
      updateHash : {
        description : 'Update Description'
      }
};

timeout = 20*1000;

describe('IncidentSeverity CRUD Test', function(){
  before(function (done){
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });

  it('should be able to Initialize an XM.IncidentSeverity Model', function(){
    data.model = new XM.IncidentSeverity();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.IncidentSeverity', 'INIT Value should be XM.IncidentSeverity');
  });

  it('should create an XM.IncidentSeverity Model', function(){
    data.model.set(data.createHash);
    crud.save(data)
  });

  it('should read an XM.IncidentSeverity Model', function(){
    assert.equal(data.model.get('name'), data.createHash.name, 'Model Name READ Value is equal')
    assert.equal(data.model.get('description'), data.createHash.description, 'Model Description READ Value is equal')
  });

  it('should update an XM.IncidentSeverity Model', function(){
    data.model.set(data.updateHash);
    crud.save(data)
    assert.equal(data.model.get('description'), data.updateHash.description, 'Model Description UPDATE Value is equal')
  });

  it('should delete an XM.IncidentSeverity Model', function(){
    crud.destroy(data)
  });


});

