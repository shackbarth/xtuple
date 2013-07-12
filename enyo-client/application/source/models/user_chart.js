/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.UserChart = XM.Document.extend({
    /** @scope XM.UserChart.prototype */

    recordType: 'XM.UserChart',

    defaults: function () {
      return {
        username: XM.currentUser.get("username"),
        filter: "all",
        order: 0
      };
    }

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.UserChartCollection = XM.Collection.extend({
    /** @scope XM.UserChartCollection.prototype */

    model: XM.UserChart,

    orderAttribute: {
      orderBy: [{
        attribute: "order"
      }]
    }

  });

}());
