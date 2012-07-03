/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
  
    @extends XM.AccountDocument
  */
  XM.TaxAuthority = XM.AccountDocument.extend({
    /** @scope XM.TaxAuthority.prototype */

    recordType: 'XM.TaxAuthority',

    privileges: {
      "all": {
        "create": "MaintainTaxAuthorities",
        "read": "ViewTaxAuthorities",
        "update": "MaintainTaxAuthorities",
        "delete": "MaintainTaxAuthorities"
      }
    },

    relations: [{
      type: Backbone.HasOne,
      key: 'address',
      relatedModel: 'XM.AddressInfo'
    }, {
      type: Backbone.HasOne,
      key: 'currency',
      relatedModel: 'XM.Currency',
      includeInJSON: 'guid'
    }]

  });

}());
