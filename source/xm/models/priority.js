/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.Priority = XM.Model.extend({
    /** @scope XM.Priority.prototype */

    recordType: 'XM.Priority',

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "name"
    ]

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.PriorityCollection = XM.Collection.extend({
    /** @scope XM.PriorityCollection.prototype */

    model: XM.Priority,

    orderAttribute: {
      orderBy: [{
        attribute: "order"
      }]
    }

  });

}());
