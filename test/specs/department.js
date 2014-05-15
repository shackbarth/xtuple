/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true,
 beforeEach:true */

(function () {
  "use strict";
 /**
    Department
	@class
    @alias Department
    @property {String} id
    @property {String} number [is the idAttribute, required] (Enter a number of the Department you want to create.)
    @property {Item} name (Enter the name of the Department that you want to create.)
        
    */
  var spec = {
      recordType: "XM.Department",
      skipSmoke: true,
      skipCrud: true,
      enforceUpperKey: true,
    /**
      @member Other
      @memberof Department
      @description Department Collection is not cached.
    */
      collectionType: "XM.DepartmentCollection",
      listKind: "XV.DepartmentList",
      instanceOf: "XM.Document",
      cacheName: "XM.departments",
    /**
      @member Settings
      @memberof Department
      @description Department is lockable.
    */
      isLockable: true,
    /**
      @member Settings
      @memberof Department
      @description The ID attribute is "uuid"
    */
      attributes: ["id", "number", "name"],
      requiredAttributes: ["number"],
      idAttribute: "number",
    /**
      @member Setup
      @memberof Department
      @description Used in Products, Manufacture, Accounting and System modules
    */
      extensions: ["Products"],
       /**
      @member Privileges
      @memberof Department
      @description Users can create, update, and delete Departments if they have the
      'MaintainDepartments' privilege.
    */
      privileges: {
        createUpdateDelete: ["MaintainDepartments"],
        read: true
      }
      
    };
  var additionalTests =  function () {
   /**
      @member Navigation
      @memberof Department
      @description An Action gear exists in the 'Departments' work space  with 'Delete' option:
      */
      it.skip("Action gear should exist in the Departments work space with 'Delete' option if" +
      "the user has 'MaintainDepartments privilege'", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
