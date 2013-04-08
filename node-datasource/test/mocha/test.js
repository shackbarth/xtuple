/**
  Usage:
  cd node-datasource/test/mocha
  mocha -R spec
*/

var zombieAuth = require("../vows/lib/zombie_auth");

describe('Zombie authentication', function (){
  this.timeout(20 * 1000);
  it('should load the app', function (done){
    zombieAuth.loadApp(done);
  })
})
