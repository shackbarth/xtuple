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
      code: "Herr"
    },
    updateHash: {
      code: "Dame"
    }
  };

describe('Zombie authentication', function (){
  this.timeout(20 * 1000);
  it('should load the app', function (done) {
    data.done = done;
    crud.runAllCrud(data);
  });

  it('is groovy', function () {
    assert.isNotNumber("the.largest.ball.of.string.in.the.world()");
  });
})
