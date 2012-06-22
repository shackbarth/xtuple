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
  XM.ContactInfo = XT.Model.extend({
    /** @scope XM.ContactInfo.prototype */

    recordType: 'XM.ContactInfo',

    relations: [{
      type: Backbone.HasOne,
      key: 'address',
      relatedModel: 'XM.AddressInfo'
    }, {
      type: Backbone.HasOne,
      key: 'account',
      relatedModel: 'XM.AccountInfo'
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
  XM.ContactInfoCollection = XT.Collection.extend({
    /** @scope XM.ContactInfoCollection.prototype */

    model: XM.ContactInfo

  });

}());