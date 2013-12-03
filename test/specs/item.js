/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    common = require("../lib/common");

  /**
    @class
    @alias Item
  */
  var spec = {
    recordType: "XM.Item",
    collectionType: "XM.ItemListItemCollection",
    cacheName: null,
    listKind: "XV.ItemList",
    instanceOf: "XM.Document",
    isLockable: true,
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["number", "description1", "barcode", "aliases"],
    extensions: ["billing", "crm", "sales", "project"],
    privileges: {
      createUpdate: "MaintainItemMasters",
      read: "ViewItemMasters",
      delete: "DeleteItemMasters"
    },
    createHash: {
      number: "ATEST" + Math.random(),
      description1: "Item description1",
      isActive: true,
      itemType: "P",
      classCode: {code: "TOYS-COMP"},
      productCategory: {code: "CLASSIC-WOOD"},
      inventoryUnit: {name: "WSET"},
      isFractional: true,
      isSold: true,
      listPrice: 0.00,
      priceUnit: {name: "CS"}
    },
    updatableField: "description1",
    beforeSaveActions: [{it: "should be able to add an item alias", action: function (data, next) {
      var itemAlias = new XM.ItemAlias(),
        statusChanged = function () {
          if (itemAlias.isReady()) {
            itemAlias.off("statusChange", statusChanged);
            itemAlias.set({aliasNumber: "Alias123"});
            data.model.get("aliases").add(itemAlias);
            next();
          }
        };

      itemAlias.on("statusChange", statusChanged);
      itemAlias.initialize(null, {isNew: true});
    }}],
    beforeDeleteActions: [{it: "should be able to delete the item alias", action: function (data, next) {
      data.model.get("aliases").remove(data.model.get("aliases").models[0]);
      next();
    }}]
  };
  var additionalTests = function () {
    describe("Item Alias", function () {
      var itemAlias;
      before(function (done) {
        common.initializeModel(itemAlias, XM.ItemAlias, function (err, model) {
          itemAlias = model;
          done();
        });
      });
      it("Item Alias should contain the following fields - Item Number,Alias Number," +
          "Associated CRMAccount, 'Use Description' checkbox, Description, " +
          "Comments", function () {
        var aliasFields = ["item", "aliasNumber", "useDescription", "description1"];//
          // "account", "comments"]; TODO
        assert.equal(_.difference(aliasFields, itemAlias.getAttributeNames()).length, 0);
      });
      it("Use a description option should be unchecked and Description field " +
          "should be inactive by default", function () {
        assert.isFalse(itemAlias.get("useDescription"));
        assert.isTrue(itemAlias.isReadOnly("description1"));
      });
      it("Description field should be enabled when 'Use Description' " +
          "option is selected", function () {
        itemAlias.set({useDescription: true});
        assert.isFalse(itemAlias.isReadOnly("description1"));
      });
      it("Description field should be disabled and content wiped when 'Use Description' " +
          "option is unselected", function () {
        itemAlias.set({description1: "should get wiped"});
        itemAlias.set({useDescription: false});
        assert.isTrue(itemAlias.isReadOnly("description1"));
        assert.equal(itemAlias.get("description1"), "");
      });
    });
    describe("Item relation widget", function () {
      it("Selecting to enter the item alias manually in the Item relation widget" +
          "should display the related item for selection", function () {
      });
      it("Aliases option should be available on the Item widget which displays " +
          "Active Alias Items on selection", function () {
      });
      it("Selecting the Alias in the Item relation widget should populate the Item" +
          "Number in the item Number field and Alias Name in the" +
          "Customer P/N field", function () {
      });
      it("Should be able to search the Item through Bar Code", function () {
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

