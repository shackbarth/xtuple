/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */


// NOTE! This test will fail in an extensionless build. This failure represents
// a low-burning bug in the app, that many kinds are defined but not instantiable
// in the core itself, usually because they rely on pickers that rely on caches
// that don't exist. We don't see this problem in the app because those kinds
// are hidden without the pertinent extension.

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    common = require("../../lib/common"),
    _ = require("underscore"),
    assert = require("chai").assert;

  describe('Lists', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      // setup for the date widget
      var appLoaded = function () {
        done();
      };

      zombieAuth.loadApp(appLoaded);
    });

    describe('XV lists', function () {
      it('should be set up correctly', function () {
        // look at all the lists in XV
        _.each(XV, function (value, key) {
          var child,
            collName,
            recordType,
            abstractKinds = ['List', 'ConfigurationsList', 'AbbreviationList',
              'NameList', 'NameDescriptionList', 'TransactionList', 'EmailProfileList', 'SalesCategoryList'],
            master = new enyo.Control();

          if (XV.inheritsFrom(value.prototype, "XV.List") &&
              // don't test abstract kinds
              !_.contains(abstractKinds, key)) {

            describe('XV.' + key, function () {
              it('should have their attrs set up right', function () {
                // create the list
                child = master.createComponent({
                  kind: "XV." + key,
                  name: key
                });
                assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);

                // get the relations for the backing model
                collName = child.getCollection();
                assert.isNotNull(collName, 'XV.' + key + ' has no collection behind it');
                recordType = XM.Model.getObjectByName(collName).prototype.model.prototype.recordType;

                // get the attributes
                var attrs = _.compact(_.map(child.$, function (component) {
                  // don't bother testing attrs with formatters
                  // TODO: where are the exceptions kept now?
                  return component.formatter || component.attr === 'address' ? null : component.attr;
                }));

                // the query attribute counts as an attribute
                attrs.push(child.getQuery().orderBy[0].attribute);

                // make sure that attrs with paths are for nested relations
                _.each(attrs, function (attr) {
                  common.verifyAttr(attr, recordType, child.getQuery().orderBy[0].attribute);
                });
              });
            });
          }
        });
      });
    });
  });
}());
