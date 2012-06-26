/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
  
    @extends XT.Model
  */
  XM.ToDoInfo = XT.Model.extend({
    /** @scope XM.ToDoInfo.prototype */

    recordType: 'XM.ToDoInfo',

    relations: [{
      type: Backbone.HasOne,
      key: 'contact',
      relatedModel: 'XM.ContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'assignedTo',
      relatedModel: 'XM.UserAccountInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.ToDoInfoCollection = XT.Collection.extend({
    /** @scope XM.ToDoInfoCollection.prototype */

    model: XM.ToDoInfo

  });

}());