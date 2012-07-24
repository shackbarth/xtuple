/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
  
    @extends XT.Model
  */
  XM.Priority = XT.Model.extend({
    /** @scope XM.Priority.prototype */

    recordType: 'XM.Priority',

    privileges: {
      "all": {
        "create": "MaintainIncidentPriorities",
        "read": true,
        "update": "MaintainIncidentPriorities",
        "delete": "MaintainIncidentPriorities"
      }
    },

    defaults: {
      order: 0
    },

    requiredAttributes: [
      "name"
    ]

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.PriorityCollection = XT.Collection.extend({
    /** @scope XM.PriorityCollection.prototype */

    model: XM.Priority

  });

}());