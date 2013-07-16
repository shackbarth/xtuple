/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initStaticModels = function () {

    // These are hard coded collections that may be turned into tables at a later date
    var i;

    // Invoice Date Sources
    var invoiceDateSourceJson = [
      { id: "currdate", name: "_currentDate".loc() },
      { id: "shipdate", name: "_shipDate".loc() },
      { id: "scheddate", name: "_scheduledDate".loc() }
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

    // Line Item Edit Behaviors
    var lineItemEditBehaviorJson = [
      { id: 3, name: "_update".loc() },
      { id: 1, name: "_doNotUpdate".loc() },
      { id: 2, name: "_prompt".loc() }
    ];
    XM.LineItemEditBehaviorModel = Backbone.Model.extend({
    });
    XM.LineItemEditBehaviorCollection = Backbone.Collection.extend({
      model: XM.LineItemEditBehaviorModel
    });
    XM.lineItemEditBehaviors = new XM.LineItemEditBehaviorCollection();
    for (i = 0; i < lineItemEditBehaviorJson.length; i++) {
      var lineItemEditBehavior = new XM.LineItemEditBehaviorModel(lineItemEditBehaviorJson[i]);
      XM.lineItemEditBehaviors.add(lineItemEditBehavior);
    }

    // Price Effective Dates
    var priceEffectiveDateJson = [
      { id: "CurrentDate", name: "_current".loc() },
      { id: "OrderDate", name: "_order".loc() },
      { id: "ScheduleDate", name: "_scheduled".loc() }
    ];
    XM.PriceEffectiveDateModel = Backbone.Model.extend({
    });
    XM.PriceEffectiveDateCollection = Backbone.Collection.extend({
      model: XM.PriceEffectiveDateModel
    });
    XM.priceEffectiveDates = new XM.PriceEffectiveDateCollection();
    for (i = 0; i < priceEffectiveDateJson.length; i++) {
      var priceEffectiveDate = new XM.PriceEffectiveDateModel(priceEffectiveDateJson[i]);
      XM.priceEffectiveDates.add(priceEffectiveDate);
    }
  };

}());
