/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  var crud = require('../lib/crud');

  /**
  Customer Group is used to categorize customers.
  TIP: Create your customer groups using a logical, hierarchical structure.
  This will make it easier to retrieve customer group information in the future.
  @class
  @alias CustomerGroup
  @property {String} Name
  @property {String} Description
  @property {List} Customers
  **/

  var spec = {
      recordType: "XM.CustomerGroup",
      enforceUpperKey: true,
      collectionType: "XM.CustomerGroupCollection",
      listKind: "XV.CustomerGroupList",
      instanceOf: "XM.Document",
      attributes: ["name", "description", "customers"],
      /**
      @member -
      @memberof CustomerGroup.prototype
      @description The ID attribute is "name", which will be automatically uppercased
    */
      idAttribute: "name",
      /**
      @member -
      @memberof CustomerGroup.prototype
      @description Used in the Billing and Sales modules
    */
      extensions: ["billing", "sales"],
      /**
      @member -
      @memberof CustomerGroup.prototype
      @description Customer Groups are lockable
    */
      isLockable: true,
      cacheName: null,
      /**
      @member -
      @memberof CustomerGroup.prototype
      @description Customer Groups can be read by users with the "ViewCustomerGroups" privilege
      and can be created, updated and deleted by users with the "MaintainCustomerGroups" privilege.
      */
      privileges: {
        createUpdateDelete: "MaintainCustomerGroups",
        read: "ViewCustomerGroups"
      },
      createHash: {
        name: "CupGrp" + Math.random()
      },
      updatableField: "name",
      defaults: {
      }
    };

  exports.spec = spec;

}());