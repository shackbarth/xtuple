/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    crud = require('../lib/crud'),
    data = {
      recordType: "XM.SalesOrder",
      autoTestAttributes: true,
      createHash: {
        number: "Milky Way"
        //["id", "number", "customer", "orderDate", "packDate", "scheduleDate", "terms", "salesRep", "commission", "taxZone", "site", "saleType", "status", "billtoName", "billtoAddress1", "billtoAddress2", "billtoAddress3", "billtoCity", "billtoState", "billtoCountry", "billtoPostalCode", "billtoContact", "billtoContactHonorific", "billtoContactFirstName", "billtoContactMiddleName", "billtoContactLastName", "billtoContactSuffix", "billtoContactPhone", "billtoContactTitle", "billtoContactFax", "billtoContactEmail", "shipto", "shiptoName", "shiptoAddress1", "shiptoAddress2", "shiptoAddress3", "shiptoCity", "shiptoState", "shiptoCountry", "shiptoPostalCode", "shiptoContact", "shiptoContactHonorific", "shiptoContactFirstName", "shiptoContactMiddleName", "shiptoContactLastName", "shiptoContactSuffix", "shiptoContactPhone", "shiptoContactTitle", "shiptoContactFax", "shiptoContactEmail", "orderNotes", "shipNotes", "fob", "shipVia", "currency", "calculateFreight", "shipZone", "margin", "freightWeight", "subtotal", "taxTotal", "miscCharge", "freight", "total", "lineItems", "comments", "files", "accounts", "contacts", "urls", "items", "type", "dataState", "lock"]
      },
      updateHash: {
        number: "Milky Way"
      }
    };

  vows.describe('XM.SalesOrder CRUD test').addBatch({
    'We can run the XM.SalesOrder CRUD tests ': crud.runAllCrud(data)
  }).export(module);

}());