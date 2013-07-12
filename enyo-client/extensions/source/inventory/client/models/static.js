/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initStaticModels = function () {
    // These are hard coded collections that may be turned into tables at a later date
    var i;

    // Cost Method for Avg Cost Count Tags
    var countAvgCostMethodJson = [
      { id: "stdcost", name: "_standardCost".loc() },
      { id: "avgcost", name: "_averageCost".loc() }
    ];
    XM.CountAvgCostMethodModel = Backbone.Model.extend({
    });
    XM.CountAvgCostMethodCollection = Backbone.Collection.extend({
      model: XM.CountAvgCostMethodModel
    });
    XM.countAvgCostMethod = new XM.CountAvgCostMethodCollection();
    for (i = 0; i < countAvgCostMethodJson.length; i++) {
      var countAvgCostMethod = new XM.CountAvgCostMethodModel(countAvgCostMethodJson[i]);
      XM.countAvgCostMethod.add(countAvgCostMethod);
    }

    // When Count Tag Qty Exceeds Slip Qty 
    var postCountTagToDefaultJson = [
      { id: "default", name: "_postToDefaultLocation".loc() },
      { id: "dontPost", name: "_dontPost".loc() }
    ];
    XM.PostCountTagToDefaultModel = Backbone.Model.extend({
    });
    XM.PostCountTagToDefaultCollection = Backbone.Collection.extend({
      model: XM.PostCountTagToDefaultModel
    });
    XM.postCountTagToDefault = new XM.PostCountTagToDefaultCollection();
    for (i = 0; i < postCountTagToDefaultJson.length; i++) {
      var postCountTagToDefault = new XM.PostCountTagToDefaultModel(postCountTagToDefaultJson[i]);
      XM.postCountTagToDefault.add(postCountTagToDefault);
    }

    // Cost Slip Auditing
    var countSlipAuditingJson = [
      { id: "allowDups", name: "_allowDups".loc() },
      { id: "noUnpostedDupsSite", name: "_noUnpostedSlipDupsSite".loc() },
      { id: "noUnpostedDups", name: "_noUnpostedSlipDups".loc() },
      { id: "noSlipDupsSite", name: "_noSlipDupsSite".loc() },
      { id: "noSlipDups", name: "_noSlipDups".loc() }
    ];
    XM.CountSlipAuditingModel = Backbone.Model.extend({
    });
    XM.CountSlipAuditingCollection = Backbone.Collection.extend({
      model: XM.CountSlipAuditingModel
    });
    XM.countSlipAuditing = new XM.CountSlipAuditingCollection();
    for (i = 0; i < countSlipAuditingJson.length; i++) {
      var countSlipAuditing = new XM.CountSlipAuditingModel(countSlipAuditingJson[i]);
      XM.countSlipAuditing.add(countSlipAuditing);
    }
  };

}());
