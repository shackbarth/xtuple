/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.Department = XM.Document.extend({
    /** @scope XM.Department.prototype */

    recordType: 'XM.Department'

  });

  /**
    @class

    @extends XM.Document
  */
  XM.Shift = XM.Document.extend({
    /** @scope XM.Shift.prototype */

    recordType: 'XM.Shift'

  });

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.Employee = XM.AccountDocument.extend({
    /** @scope XM.Employee.prototype */

    recordType: 'XM.Employee',

    idAttribute: "code",

    documentKey: "code",

    conversionMap: {
      name: "name",
      primaryContact: "contact"
    },

    defaults: function () {
      var hourly = XM.Wage.HOURLY;
      return {
        isActive: true,
        wage: 0,
        wageType: hourly,
        wagePeriod: hourly,
        billingPeriod: hourly,
        billingRate: 0
      };
    }

  });

  /** @class

  A hash of constants related to wage types and periods.

  */
  XM.Wage = {
    /** @scope XM.Wage */

    /**
      Salaried type.

      @static
      @constant
      @type String
      @default S
    */
    SALARIED: 'S',

    /**
      Hourly period or type.

      @static
      @constant
      @type String
      @default H
    */
    HOURLY: 'H',

    /**
      Daily period.

      @static
      @constant
      @type String
      @default D
    */
    DAILY: 'D',

    /**
      Weekly period.

      @static
      @constant
      @type String
      @default W
    */
    WEEKLY: 'W',

    /**
      Bi-weekly period.

      @static
      @constant
      @type String
      @default BW
    */
    BI_WEEKLY: 'BW',

    /**
      Monthly period.

      @static
      @constant
      @type String
      @default M
    */
    MONTHLY: 'M',

    /**
      Annually period.

      @static
      @constant
      @type String
      @default L
    */
    ANNUALLY: 'Y'

  };

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

    recordType: 'XM.EmployeeCharacteristic',

    which: 'isEmployees'

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

  /**
    @class
    Used inside employee relation as reference to prevent recursion.

    @extends XM.Info
  */
  XM.EmployeeEmployeeRelation = XM.Info.extend({
    /** @scope XM.EmployeeRelation.prototype */

    recordType: 'XM.EmployeeEmployeeRelation',

    editableModel: 'XM.Employee',

    descriptionKey: "name"

  });


  /**
    @class

    @extends XM.Document
  */
  XM.EmployeeGroup = XM.Document.extend({
    /** @scope XM.EmployeeGroup.prototype */

    recordType: 'XM.EmployeeGroup',

    documentKey: 'name'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.EmployeeGroupEmployee = XM.Model.extend({
    /** @scope XM.EmployeeGroupEmployee.prototype */

    recordType: 'XM.EmployeeGroupEmployee'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.EmployeeGroupGroup = XM.Model.extend({
    /** @scope XM.EmployeeGroupGroup.prototype */

    recordType: 'XM.EmployeeGroupGroup'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.DepartmentCollection = XM.Collection.extend({
    /** @scope XM.DepartmentCollection.prototype */

    model: XM.Department

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ShiftCollection = XM.Collection.extend({
    /** @scope XM.ShiftCollection.prototype */

    model: XM.Shift

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.EmployeeRelationCollection = XM.Collection.extend({
    /** @scope XM.EmployeeRelationCollection.prototype */

    model: XM.EmployeeRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.EmployeeGroupCollection = XM.Collection.extend({
    /** @scope XM.EmployeeGroupCollection.prototype */

    model: XM.EmployeeGroup

  });

}());
