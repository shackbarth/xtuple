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
    @property {String} id
    @property {String} number
    @property {Boolean} isActive
    @property {String} description1 
    @property {String} description2
    @property {String} itemType
    @property {ClassCode} classCode
    @property {Unit} inventoryUnit
    @property {Boolean} isFractional
    @property {Boolean} isConfigured
    @property {String} notes
    @property {String} extendedDescription
    @property {Boolean} isSold
    @property {ProductCategory} productCategory
    @property {FreightClass} freightClass
    @property {String} barcode
    @property {Number} listPrice
    @property {Number} wholesalePrice
    @property {Unit} priceUnit
    @property {Number} productWeight
    @property {Number} packageWeight
    @property {String} aliases
    @property {ItemComment} comments
    @property {ItemCharacteristic} characteristics
    @property {ItemAccount} accounts
    @property {ItemContact} contacts
    @property {ItemItem} items
    @property {ItemFile} files
    @property {ItemUrl} urls
    @property {Number} maximumDesiredcost
    @property {ItemCustomer} customers
  */
  var spec = {
    recordType: "XM.Item",
    collectionType: "XM.ItemListItemCollection",
    /**
      @member -
      @memberof Item.prototype
      @description The Items collection is not cached.
    */
    cacheName: null,
    listKind: "XV.ItemList",
    instanceOf: "XM.Document",
    /**
      @member -
      @memberof Item.prototype
      @description Items are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof Item.prototype
      @description The ID attribute is "number", which will be automatically uppercased.
    */
    idAttribute: "number",
    enforceUpperKey: true,
    attributes: ["id", "number", "isActive", "description1", "description2", "itemType",
    "classCode", "inventoryUnit", "isFractional", "isConfigured", "notes", "extendedDescription",
    "isSold", "productCategory", "freightClass", "barcode", "listPrice", "wholesalePrice",
    "priceUnit", "productWeight", "packageWeight", "aliases", "comments", "characteristics",
    "accounts", "contacts", "items", "files", "urls", "maximumDesiredCost", "customers"],
    /**
      @member -
      @memberof Item.prototype
      @description Used in the Billing, crm, sales and project modules
    */
    extensions: ["billing", "crm", "sales", "project"],
    /**
      @member -
      @memberof Item.prototype
      @description Items can be read by users with "ViewItemMasters" privilege
      , can be created or updated by users with the "MaintainItemMasters" privilege
      and can be deleted by users with "DeleteItemMasters" privilege
    */
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
    /**
      @class ItemAlias
      @memberof Item
    */
    describe("Item Alias", function () {
      var itemAlias;
      before(function (done) {
        common.initializeModel(itemAlias, XM.ItemAlias, function (err, model) {
          itemAlias = model;
          done();
        });
      });
      /**
      @member -
      @memberof ItemAlias.prototype
      @description Item Alias should contain the following fields - Item Number,Alias Number,
          Associated CRMAccount, 'Use Description' checkbox, Description,
          Comments
      */
      it("Item Alias should contain the following fields - Item Number,Alias Number," +
          "Associated CRMAccount, 'Use Description' checkbox, Description, " +
          "Comments", function () {
        var aliasFields = ["item", "aliasNumber", "useDescription", "description1",
          "account"];//, "comments"]; TODO
        assert.equal(_.difference(aliasFields, itemAlias.getAttributeNames()).length, 0);
      });
      /**
      @member -
      @memberof ItemAlias.prototype
      @description Use a description option should be unchecked and Description field
          should be inactive by default
      */
      it("Use a description option should be unchecked and Description field " +
          "should be inactive by default", function () {
        assert.isFalse(itemAlias.get("useDescription"));
        assert.isTrue(itemAlias.isReadOnly("description1"));
      });
      /**
      @member -
      @memberof ItemAlias.prototype
      @description Description field should be enabled when 'Use Description' 
          option is selected
      */
      it("Description field should be enabled when 'Use Description' " +
          "option is selected", function () {
        itemAlias.set({useDescription: true});
        assert.isFalse(itemAlias.isReadOnly("description1"));
      });
      /**
      @member -
      @memberof ItemAlias.prototype
      @description Description field should be disabled and content wiped when 'Use Description'
          option is unselected
      */
      it("Description field should be disabled and content wiped when 'Use Description' " +
          "option is unselected", function () {
        itemAlias.set({description1: "should get wiped"});
        itemAlias.set({useDescription: false});
        assert.isTrue(itemAlias.isReadOnly("description1"));
        assert.equal(itemAlias.get("description1"), "");
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());

