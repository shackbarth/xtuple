var zombieAuth = require("../lib/zombie_auth"),
    assert = require("chai").assert;

  describe('Sales order', function (){
    this.timeout(20 * 1000);
    it('should load up the app', function (done) {
      zombieAuth.loadApp({callback: done, verbose: false});
    });

    it('should take the defaults from the customer', function (done) {
      var terms = new XM.Terms(),
        customer = new XM.CustomerProspectRelation(),
        salesOrder = new XM.SalesOrder(),
        initCallback = function () {
          terms.set({code: "COD"});
          customer.set({terms: terms, billtoContact: "Bob"});
          salesOrder.set({customer: customer});

          // customer.terms.code gets copied to terms.code
          assert.equal(salesOrder.getValue("terms.code"), "COD");
          done();
        };

      salesOrder.on('change:id', initCallback);
      salesOrder.initialize(null, {isNew: true});
    });
  })
