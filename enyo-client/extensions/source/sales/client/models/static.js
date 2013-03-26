/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  // These are hard coded collections that may be turned into tables at a later date
  var i;

  // Invoice Date Sources
  var invoiceDateSourceJson = [
    { id: "currentdate???", name: "_currentDate".loc() },
    { id: "shipdate", name: "_shipDate".loc() },
    { id: "scheduleddate???", name: "_scheduledDate".loc() }
  ];
  XM.InvoiceDateSourceModel = Backbone.Model.extend({
  });
  XM.InvoiceDateSourceCollection = Backbone.Collection.extend({
    model: XM.InvoiceDateSourceModel
  });
  XM.invoiceDateSources = new XM.InvoiceDateSourceCollection();
  for (i = 0; i < invoiceDateSourceJson.length; i++) {
    var invoiceDateSource = new XM.InvoiceDateSourceModel(invoiceDateSourceJson[i]);
    XM.invoiceDateSources.add(invoiceDateSource);
  }

}());
