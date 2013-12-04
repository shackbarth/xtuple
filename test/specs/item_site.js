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
    @class
    @alias Item
  */
  var spec = {
    recordType: "XM.ItemSite",
    skipCrud: true, // TODO: we have to make a new item to attach, because all pre-existing items already
    // have a WH1 itemsite
    skipSmoke: true,
    collectionType: "XM.ItemSiteListItemCollection",
    cacheName: null,
    listKind: "XV.ItemSiteList",
    instanceOf: "XM.Model",
    isLockable: true,
    idAttribute: "uuid",
    enforceUpperKey: false,
    attributes: ["uuid"],
    extensions: ["sales"],
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
            common.initializeModel(alias, XM.ItemAlias, function (err, model) {
              alias = model;
              done();
            });
          },
          function (done) {
            var itemSaved = function () {
              if (item.isReady()) {
                item.off("statusChange", itemSaved);
                console.log(item.get("aliases"));
                done();
              }
            };
            alias.set({aliasNumber: "ABC123"});
            item.get("aliases").add(alias);
            console.log(item.get("aliases"));
            item.on("statusChange", itemSaved);
            item.save();
          }
        ], done);
      });
      it.skip("Selecting to enter the item alias manually in the Item relation widget" +
          "should display the related item for selection", function (done) {
        var widget = new XV.ItemSiteWidget(),
          mockReturn = function (results) {
            assert.equal(results[0].item.number, "BTRUCK1");
            done();
          };

        widget.$.privateItemSiteWidget.mockReturn = mockReturn;
        widget.$.privateItemSiteWidget.fetchCollection("BTR", 10, "mockReturn");
      });
      it("Aliases option should be available on the Item widget which displays " +
          "Active Alias Items on selection", function (done) {
        var widget = new XV.ItemSiteWidget(),
          mockReturn = function (results) {
            assert.equal(results[0].item.number, "BPAINT1");
            done();
          };

        widget.$.privateItemSiteWidget.mockReturn = mockReturn;
        widget.$.privateItemSiteWidget.fetchCollection("Alias123", 10, "mockReturn");
      });
      it("Should be able to search the Item through Bar Code", function (done) {
        var widget = new XV.ItemSiteWidget(),
          mockReturn = function (results) {
            assert.include(_.map(results, function (result) {
              return result.item.number;
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


