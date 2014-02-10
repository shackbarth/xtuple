/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";
   /**
  Planner Codes are used to identify Items that fall under the jurisdiction of planners -
  that is, Employees responsible for planning, scheduling, or procurement
  @class
  @alias PlannerCode
  @property {String} Code
  @property {String} Name
  **/
  var spec = {
    recordType: "XM.PlannerCode",
    enforceUpperKey: true,
    collectionType: "XM.PlannerCodeCollection",
    listKind: "XV.PlannerCodeList",
    instanceOf: "XM.Document",
    attributes: ["id", "code", "name"],
    /**
      @member -
      @memberof PlannerCode.prototype
      @description The ID attribute is "name, which will not be automatically uppercased.
    */
    idAttribute: "code",
    /**
      @member -
      @memberof PlannerCode.prototype
      @description PlannerCodes are lockable.
    */
    isLockable: true,
    cacheName: "XM.plannerCodes",
    createHash: {
      code: "10" + Math.random(),
      name: "Ten"
    },
    updatableField: "name"
  };
  exports.spec = spec;
}());
