/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.SaleType = XM.Document.extend({
    /** @scope XM.SaleType.prototype */

    recordType: 'XM.SaleType'
    
  });
  
  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.SaleTypeCollection = XM.Collection.extend({
    /** @scope XM.SaleTypeCollection.prototype */

    model: XM.SaleType

  });

}());
