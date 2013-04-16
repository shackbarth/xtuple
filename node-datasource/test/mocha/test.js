/**
  Usage:
  cd node-datasource/test/mocha
  mocha -R spec
*/

var crud = require("./crud"),
  assert = require("chai").assert,
  data = {
    recordType: "XM.Honorific",
    autoTestAttributes: true,
    createHash: {
      code: "Herr" + Math.random()
    },
    updateHash: {
      code: "Dame" + Math.random()
    }
  };

describe('Zombie authentication', function (){
  this.timeout(20 * 1000);
  it('should load the app', function (done) {
    data.done = done;
    crud.runAllCrud(data);
  });

})
