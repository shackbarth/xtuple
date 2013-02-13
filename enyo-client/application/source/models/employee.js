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
  XM.Employee = XM.AccountDocument.extend({
    /** @scope XM.Employee.prototype */

    recordType: 'XM.Employee',

    defaults: {
      isActive: true
    },

    requiredAttributes: [
      "isActive"
    ]

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.EmployeeComment = XM.Comment.extend({
    /** @scope XM.EmployeeComment.prototype */

    recordType: 'XM.EmployeeComment',

    sourceName: 'EMP'

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.EmployeeCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.EmployeeCharacteristic.prototype */

    recordType: 'XM.EmployeeCharacteristic'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.EmployeeRelation = XM.Info.extend({
    /** @scope XM.EmployeeRelation.prototype */

    recordType: 'XM.EmployeeRelation',

    editableModel: 'XM.Employee',

    descriptionKey: "name"

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.EmployeeRelationCollection = XM.Collection.extend({
    /** @scope XM.EmployeeRelationCollection.prototype */

    model: XM.EmployeeRelation

  });

}());
