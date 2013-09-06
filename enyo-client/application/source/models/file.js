/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.File = XM.Model.extend({
    /** @scope XM.File.prototype */

    recordType: 'XM.File',

    binaryField: 'data' // see issue 18661

  });

  /**
    @class

    @extends XM.Model
  */
  XM.FileRelation = XM.Info.extend({
    /** @scope XM.FileRelation.prototype */

    recordType: 'XM.FileRelation',

    editableModel: 'XM.File',

    numberKey: 'name'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.FileRelationCollection = XM.Collection.extend({
    /** @scope XM.FileCollection.prototype */

    model: XM.FileRelation

  });

}());
