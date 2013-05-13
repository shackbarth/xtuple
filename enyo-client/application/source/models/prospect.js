/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XT.AccountDocument
  */
  XM.Prospect = XM.AccountDocument.extend({
    /** @scope XM.Prospect.prototype */

    recordType: 'XM.Prospect',

    conversionMap: {
      name: "name",
      primaryContact: "contact"
    },

    defaults: {
      isActive: true
    },

    requiredAttributes: [
      "isActive"
    ]

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ProspectRelation = XM.Info.extend({
    /** @scope XM.ProspectRelation.prototype */

    recordType: 'XM.ProspectRelation',

    editableModel: 'XM.Prospect',

    descriptionKey: "name"

  });


  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.ProspectRelationCollection = XM.Collection.extend({
    /** @scope XM.ProspectRelationCollection.prototype */

    model: XM.ProspectRelation

  });

}());
