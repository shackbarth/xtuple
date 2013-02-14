/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.ItemSite = XM.Document.extend({
    /** @scope XM.ItemSite.prototype */

    recordType: 'XM.ItemSite',

    defaults: {
      isActive: true
    },
    
    requiredAttributes: [
      "id"
    ]

  });
  
  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteCollection = XM.Collection.extend({
    /** @scope XM.ItemSiteCollection.prototype */

    model: XM.ItemSite

  });

}());
