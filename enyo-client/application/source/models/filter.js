/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.Filter = XM.Model.extend({
    /** @scope XM.UserChart.prototype */

    recordType: 'XM.Filter',

    defaults: function () {
      return {
        createdBy: XM.currentUser.get("username")
      };
    }

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.FilterCollection = XM.Collection.extend({
    /** @scope XM.UserChartCollection.prototype */

    model: XM.Filter

  });

}());
