/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true, beforeEach:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert,
    async = require("async"),
    common = require("../lib/common");

  /**
    Item Sites identify and define the methods and controls used when maintaining a given Item within a given Site.
    @class
    @alias ItemSite
    @property {Item} item
    @property {Site} site
    @property {Boolean} isActive
    @property {Boolean} isSold
    @property {PlannerCode} plannerCode
    @property {CostCategory} costCategory
    @property {String} notes
    @property {ItemSiteComment} comments
    @property {Number} quantityOnHand
    @property {Boolean} isPurchased
    @property {Number} soldRanking
  */
  var spec = {
    recordType: "XM.ItemSite",
    skipCrud: true, // TODO: we have to make a new item to attach, because all pre-existing items already
    // have a WH1 itemsite
    skipSmoke: true,
    collectionType: "XM.ItemSiteListItemCollection",
    /**
      @member -
      @memberof ItemSite.prototype
      @description The Item Sites collection is not cached.
    */
    cacheName: null,
    listKind: "XV.ItemSiteList",
    instanceOf: "XM.Model",
    /**
      @member -
      @memberof ItemSite.prototype
      @description Item Sites are lockable.
    */
    isLockable: true,
    /**
      @member -
      @memberof ItemSite.prototype
      @description The ID attribute is "uuid", which will not be automatically uppercased.
    */
    idAttribute: "uuid",
    enforceUpperKey: false,
    attributes: ["id", "uuid", "item", "site", "isActive", "isSold", "plannerCode", "costCategory",
    "notes", "comments", "quantityOnHand", "isPurchased", "soldRanking"],
    /**
      @member -
      @memberof ItemSite.prototype
      @description Used in the sales module
    */
    extensions: ["sales"],
    /**
      @member -
      @memberof ItemSite.prototype
      @description Item Sites can be read by users with "ViewItemSites" privilege
      , can be created or updated by users with the "MaintainItemSites" privilege
      and can be deleted by users with "DeleteItemSites" privilege
    */
    privileges: {
      createUpdate: "MaintainItemSites",
      read: "ViewItemSites",
      delete: "DeleteItemSites"
    },
    createHash: {
      uuid: "NEWTEST" + Math.random(),
      item: {number: "CBODY1"},
      site: {code: "WH1"},
      isActive: true,
      plannerCode: {code: "MRP"},
      costCategory: {code: "MATERIALS"},
      notes: ""
    },
    updatableField: "notes"
  };
  var additionalTests = function () {
    describe("Item site relation widget", function () {
      var item,
        alias;
      before(function (done) {
        async.series([
          function (done) {
            common.fetchModel(item, XM.Item, {number: "BPAINT1"}, function (err, model) {
              item = model;
              done();
            });
          },
          function (done) {
            var initialized = function () {
              alias.off("change:uuid", initialized);
              alias.set({aliasNumber: "ABC123"});
              assert.isUndefined(JSON.stringify(alias.validate(alias.attributes)));
              done();
            };

            alias = new XM.ItemAlias();
            alias.on("change:uuid", initialized);
            alias.initialize(null, {isNew: true});
          },
          function (done) {
            var itemSaved = function () {
              if (item.getStatus() === XM.Model.READY_CLEAN) {
                item.off("statusChange", itemSaved);
                done();
              }
            };

            if (item.get("aliases").length > 0) {
              // alias is already set up
              done();
              return;
            }

            item.get("aliases").add(alias);
            item.on("statusChange", itemSaved);
            assert.isUndefined(JSON.stringify(item.validate(item.attributes)));
            item.save();
          }
        ], done);
      });
      /**
      @member -
      @memberof ItemAlias.prototype
      @description Selecting to enter the item alias manually in the Item relation widget
          should display the related item for selection
      */
      it("Selecting to enter the item alias manually in the Item relation widget" +
          "should display the related item for selection", function (done) {
        var widget = new XV.ItemSiteWidget(),
          mockReturn = function (results) {
            assert.equal(results.models[0].getValue("item.number"), "BTRUCK1");
            done();
          };

        widget.$.privateItemSiteWidget.mockReturn = mockReturn;
        widget.$.privateItemSiteWidget.fetchCollection("BTR", 10, "mockReturn");
      });
      /**
      @member -
      @memberof ItemAlias.prototype
      @description Aliases option should be available on the Item widget which displays
          Active Alias Items on selection
      */
      it("Aliases option should be available on the Item widget which displays " +
          "Active Alias Items on selection", function (done) {
        var widget = new XV.ItemSiteWidget(),
          mockReturn = function (results) {
            assert.equal(results.models[0].getValue("item.number"), "BPAINT1");
            done();
          };

        widget.$.privateItemSiteWidget.mockReturn = mockReturn;
        widget.$.privateItemSiteWidget.fetchCollection("ABC123", 10, "mockReturn");
      });
      /**
      @member -
      @memberof ItemAlias.prototype
      @description Search should filter by customer-specific aliases where appropriate
      */
      it.skip("Search should filter by customer-specific aliases where appropriate",
          function () {
        // TODO
      });
      /**
      @member -
      @memberof ItemAlias.prototype
      @description Should be able to search the Item through Bar Code
      */
      it("Should be able to search the Item through Bar Code", function (done) {
        var widget = new XV.ItemSiteWidget(),
          mockReturn = function (results) {
            assert.include(_.map(results.models, function (result) {
              return result.getValue("item.number");
            }), "BTRUCK1");
            done();
          };

        widget.$.privateItemSiteWidget.mockReturn = mockReturn;
        widget.$.privateItemSiteWidget.fetchCollection("1234", 10, "mockReturn");
      });
    });
  };

  exports.spec = spec;
  exports.additionalTests = additionalTests;
}());


