/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
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
    
    documentKey: 'number',
    
    defaults: function () {
      return {
        currency: XT.baseCurrency()
      };
    }

  });
  
  XM.TaxAuthority = XM.TaxAuthority.extend(XM.AddressCheckMixin);

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.TaxAuthorityRelation = XM.Info.extend({
    /** @scope XM.TaxAuthorityRelation.prototype */

    recordType: 'XM.TaxAuthorityRelation',
    
    editableModel: 'XM.TaxAuthority'

  });
  
  /**
    @class

    @extends XM.Document
  */
  XM.TaxZone = XM.Document.extend({
    /** @scope XM.TaxZone.prototype */

    recordType: 'XM.TaxZone'

  });
  
  /**
    @class
    
    @extends XM.Model
  */
  XM.TaxRegistration = XM.Document.extend({
    /** @scope XM.TaxRegistration */
    
    recordType: 'XM.TaxRegistration',
    
    documentKey: 'number'
    
  });
  
  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.TaxZoneCollection = XM.Collection.extend({
    /** @scope XM.TaxZoneCollection.prototype */

    model: XM.TaxZone

  });
  
  /**
    @class

    @extends XM.Collection
  */
  XM.TaxAuthorityCollection = XM.Collection.extend({
    /** @scope XM.TaxAuthorityCollection.prototype */

    model: XM.TaxAuthorityRelation

  });

}());
