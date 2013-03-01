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
  
  /**
    @class

    @extends XM.Info
  */
  XM.ItemSiteRelation = XM.Info.extend({
    /** @scope XM.ItemSiteRelation.prototype */

    recordType: 'XM.ItemSiteRelation',

    editableModel: 'XM.ItemSite',

    descriptionKey: "number"

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
  
  /**
    @class

    @extends XM.Collection
  */
  XM.ItemSiteRelationCollection = XM.Collection.extend({
    /** @scope XM.ItemSiteRelationCollection.prototype */

    model: XM.ItemRelationSite

  });

}());
