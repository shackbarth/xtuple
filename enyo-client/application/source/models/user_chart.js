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
  XM.UserChart = XM.Model.extend({
    /** @scope XM.UserChart.prototype */

    recordType: 'XM.UserChart'

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.UserChartCollection = XM.Collection.extend({
    /** @scope XM.UserChartCollection.prototype */

    model: XM.UserChart

  });

}());
