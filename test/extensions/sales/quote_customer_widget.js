/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, describe:true, it:true,
  setTimeout:true, console:true, before:true, after:true, module:true, require:true */

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    _ = require("underscore"),
    smoke = require("../../lib/smoke"),
    assert = require("chai").assert;

  describe('Quote Workspace', function () {
    this.timeout(20 * 1000);

    before(function (done) {
      zombieAuth.loadApp(done);
    });

    describe('Customer Prospect Widget', function () {
      it.skip('should allow users to create a new customer', function (done) {
        smoke.navigateToNewWorkspace(XT.app, "XV.QuoteList", function (workspaceContainer) {

          var quoteWorkspace = workspaceContainer.$.workspace,
            customerWorkspace;

          assert.equal(quoteWorkspace.value.recordType, "XM.Quote");

          //quoteWorkspace.$.customerWidget.$.customerButton.tap({});
          quoteWorkspace.$.customerWidget.popupTapped({}, {originator: {name: "customerButton"}});
          customerWorkspace = XT.app.$.postbooks.getActive().$.workspace;
          assert.equal(customerWorkspace.kind, "XV.CustomerWorkspace");

          smoke.setWorkspaceAttributes(customerWorkspace, require("../../lib/model_data").customer);
          assert.isUndefined(customerWorkspace.value.validate(customerWorkspace.value.attributes));
          XT.app.$.postbooks.getActive().saveAndClose();
          setTimeout(function () { // yeah yeah yeah
            assert.equal(XT.app.$.postbooks.getActive().$.workspace.kind, "XV.QuoteWorkspace");
            assert.equal(quoteWorkspace.value.getValue("customer.name"), "TestCust");
            XT.app.$.postbooks.getActive().close({force: true});
            setTimeout(function () {
              done();
            }, 3000);
          }, 7000);
        });
      });
    });
  });
}());

