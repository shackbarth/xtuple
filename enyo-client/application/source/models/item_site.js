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
  XM.CostCategory = XM.Document.extend({
    /** @scope XM.CostCategory.prototype */

    recordType: 'XM.CostCategory',

    documentKey: "code"

  });

  /**
    @class

    @extends XM.Document
  */
  XM.PlannerCode = XM.Document.extend({
    /** @scope XM.PlannerCode.prototype */

    recordType: 'XM.PlannerCode',

    documentKey: "code"

  });


  /**
    @class

    @extends XM.Document
  */
  XM.ItemSite = XM.Document.extend({
    /** @scope XM.ItemSite.prototype */

    recordType: 'XM.ItemSite',

    defaults: {
      isActive: true
    }

  });
  
  /**
    @class

    @extends XM.Comments
  */
  XM.ItemSiteComment = XM.Comment.extend({
    /** @scope XM.ItemSiteComment.prototype */

    recordType: 'XM.ItemSiteComment',

    sourceName: 'IS'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ItemSiteRelation = XM.Info.extend({
    /** @scope XM.ItemSiteRelation.prototype */

    recordType: 'XM.ItemSiteRelation',

    editableModel: 'XM.ItemSite'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.CostCategoryCollection = XM.Collection.extend({
    /** @scope XM.CostCategoryCollection.prototype */

    model: XM.CostCategory

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.PlannerCodeCollection = XM.Collection.extend({
    /** @scope XM.PlannerCodeCollection.prototype */

    model: XM.PlannerCode

  });

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
  XM.ItemSiteListItemCollection = XM.Collection.extend({
    /** @scope XM.ItemSiteListItemCollection.prototype */

    model: XM.ItemSiteListItem

  });

}());
