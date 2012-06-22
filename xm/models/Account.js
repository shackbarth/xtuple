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
  XM.AccountContactInfo = XT.Model.extend({
    /** @scope XM.AccountContactInfo.prototype */

    recordType: 'XM.AccountContactInfo',

    relations: [{
      type: Backbone.HasOne,
      key: 'address',
      relatedModel: 'XM.AddressInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.AccountInfo = XT.Model.extend({
    /** @scope XM.AccountInfo.prototype */

    recordType: 'XM.AccountInfo',

    relations: [{
      type: Backbone.HasOne,
      key: 'primaryContact',
      relatedModel: 'XM.AccountContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.AccountInfoCollection = XT.Collection.extend({
    /** @scope XM.AccountInfoCollection.prototype */

    model: XM.AccountInfo

  });

}());
