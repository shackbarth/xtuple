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
  /**
  Ship Shipment screen is used to ship the stock issued to an order
  @class
  @alias ShipShipment
  @property {String} number
  @property {String} order
  @property {ShipVia} shipVia
  @property {Money} freight
  @property {Currency} currency
  @property {Date} shipDate
  @property {String} trackingNumber
  @property {Money} value
  @property {ShipShipmentLine} lineItems
  **/
  var spec = {
    skipAll: true,
    recordType: "XM.ShipShipment",
    cacheName: null,
    instanceOf: "XM.Model",
    isLockable: true,
    idAttribute: "number",
    attributes: ["id", "number", "order", "shipVia", "freight", "currency",
    "shipDate", "trackingNumber", "value", "lineItems"],
    extensions: ["inventory"],
    privileges: {
      createDelete: false,
      updateRead: ["ShipOrders"]
    },
    skipSmoke: true,
    skipCrud: true
  };
  var additionalTests = function () {
    describe.skip("Approve for billing, Create and Print Invoice options", function () {
      /**
        @member -
        @memberof ShipShipment.prototype
        @description 'Approve for Billing', 'Create and Print Invoice' options should be enabled when
        'SelectBilling' privilege is enabled for the user"
      */
      it("'Approve for Billing', 'Create and Print Invoice' options should be enabled when" +
          "'SelectBilling' privilege is enabled for the user", function () {
      });
      /**
        @member -
        @memberof ShipShipment.prototype
        @description 'Approve for Billing' should be automatically checked when the metric
        'AutoSelectForBilling' is set to true
      */
      it("'Approve for Billing' should be automatically checked when the metric '" +
          "'AutoSelectForBilling' is set to true", function () {
      });
      it("'Approve for Billing' option should be automatically checked when " +
          "'Create and Print Invoice' option is checked by the user", function () {
      });
      it("'Create and Print Invoice' option should be unchecked automatically when " +
          "'Approve for Billing' option is unchecked by ther user", function () {
      });
      /**
        @member -
        @memberof ShipShipment.prototype
        @description Related Sales order should be selected for billing on selecting to
        Ship the Shipment with 'Approve for billing' ooption checked
      */
      it("Related Sales order should be selected for Billing on selecting to Ship the" +
          "Shipment with 'Approve for Billing' option checked in the " +
          "Ship Shipment screen", function () {
      });
      /**
        @member -
        @memberof ShipShipment.prototype
        @description Invoice should be created and printed for the Selected Sales order
        on selecting to Ship the Shipment with 'Create and Print Invoice' option checked
      */
      it("When 'Create and Print Invoice' option is checked, selecting to Ship the" +
          "Shipment should create a Invoice and display the print report", function () {
      });
    });
  };
  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());
