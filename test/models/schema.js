/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    common = require("../lib/common"),
    assert = require("chai").assert;

  // PurchaseOrder fails. We need to reimplement the EnterReceipt list and workspace
  // on an XM.EnterReceipt quasi-orm.
  // Item->ItemSite also fails. Not sure about this one.
  describe.skip('The schema', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    it('should be set up right', function () {
      // look at all the workspaces in XV
      _.each(XT.session.schemas.XM.attributes, function (value, key) {
        var recordType = "XM." + key;
        describe(recordType, function () {
          it('toMany relations should not have a relation back', function () {
            _.each(value.relations, function (relation) {
              var relationKey = relation.key;

              // reverseRelation ensures toMany
              // this "source" screens out doc relations like XM.ItemItem
              if (relation.reverseRelation && relation.reverseRelation.key !== 'source') {
                var relatedSchema = XT.session.schemas.XM.attributes[XT.String.suffix(relation.relatedModel)];
                _.each(relatedSchema.relations, function (secondCousin) {
                  var secondRelatedModel = secondCousin.relatedModel,
                    editableModel = XM[XT.String.suffix(secondRelatedModel)].prototype.editableModel;
                  if (secondRelatedModel === recordType || editableModel === recordType) {
                    assert.equal(relationKey, null);
                  }
                  //assert.notStrictEqual(secondRelatedModel, recordType, "on test");
                  //assert.notStrictEqual(editableModel, recordType, "on test");
                });
              }
            });
          });
        });
      });
    });
  });
}());
