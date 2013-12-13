/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global describe:true, it:true, XT:true, XM:true, XV:true, process:true,
  module:true, require:true, exports:true */

(function () {
  "use strict";

  var crud = require('../lib/crud');

  /**
  Customer Group...
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
      idAttribute: "name",
      extensions: ["billing", "sales"],
      isLockable: true,
      cacheName: null,
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