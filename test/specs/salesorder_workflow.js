/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true,
require:true, assert:true, setTimeout:true, clearTimeout:true, exports:true,
it:true, describe:true, beforeEach:true, before:true, enyo:true */

(function () {
  "use strict";
  var async = require("async"),
    _ = require("underscore"),
    smoke = require("../lib/smoke"),
    assert = require("chai").assert;
  var additionalTests = function () {
    describe.skip("Sales Order Workflow", function () {
      it("Add Activities' list to the Sales module.", function () {
      });
      it("Implement workflow in Sales Order similar to how it exists in Project.", function () {
      });
      it("Add support for characteristics to Sales Order", function () {
      });
      it("Add support for workflow items on Sales Order", function () {
      });
      it("Add Sales Order Email Profile", function () {
      });
      it("Default Hold Status", function () {
      });
      it("Extend Sales Type", function () {
      });
      it("Add default characteristics that are copied to the Sales Order", function () {
      });
      it("Add selection for email profile to use with Sales Type", function () {
      });
      it("Add default 'Order Workflow' panel for workflow items " +
          "that are copied to Sales Order ", function () {
      });
      describe("Sales Order workflows should", function () {
        it("Map the Sales Order as the 'parent'", function () {
        });
        it("Map Order Credit status as status", function () {
        });
        it(" In addition to existng workflow properties, include support for a workflow 'type," +
            "which in the case of SalesOrder can be 'Credit Check', 'Pack', 'Ship', or 'Other'" +
            "The default is 'Other'", function () {
        });
        it("The due date for 'Pack' workflow items will default to the 'Packdate' on the order" +
            "Changing the Pack Date will update 'Pack' workflow item's due date", function () {
        });
        it("The due date for 'Ship' workflow items will default to the schedule date on the" +
            " header. If that date changes, 'Ship' workflow items will be updated", function () {
        });
        it("When hold status of an order is changed to 'None', all credit ." +
            "check type workflow items will be marked completed", function () {
        });
        it("When all materials have been issued to a work order, all 'Pack' " +
            "workflow items will be marked completed.", function () {
        });
        describe("When an order is shipped", function () {
          it("If all materials were issued all 'Ship' workflow items will " +
              "be marked completed ", function () {
          });
          it("If outstanding line items exist, any 'Ship' workflow items will be updated " +
              "to be due on the next minum scheduled date remaining ", function () {
          });
        });
      });
    });
  };
  //exports.additionalTests = additionalTests;
}());
