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
  XM.Site = XM.Document.extend(/** @lends XM.Site.prototype */{
    // TODO: this needs to be fleshed out
    recordType: 'XM.Site',

    requiredAttributes: [
      "id"
    ]

  });

  XM.SiteRelation = XM.Info.extend(/** @lends XM.SiteRelation.prototype */{

    recordType: 'XM.SiteRelation',

    editableModel: 'XM.Site'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.SiteCollection = XM.Collection.extend(/** @lends XM.SiteCollection.prototype */{

    model: XM.Site
  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SiteRelationCollection = XM.Collection.extend(/** @lends XM.SiteRelationCollection.prototype */{

    model: XM.SiteRelation
  });

}());
