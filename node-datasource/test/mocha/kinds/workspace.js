/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
    _ = require("underscore"),
    assert = require("chai").assert,
    endsWith = function (s, key) {
      return s.indexOf(key, s.length - key.length) !== -1;
    };

  describe('Lists', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      var appLoaded = function () {
        done();
      };

      zombieAuth.loadApp(appLoaded);
    });

    describe('XV Workspaces', function () {
      // XXX This test catches the most on an app with all the extensions!
      it('should have their listRelationBoxes on attributes that point backwards appropriately', function () {
        var child,
          collName,
          Coll,
          coll,
          recordType,
          relations,
          master = new enyo.Control();

        // look at all the workspaces in XV
        _.each(XV, function (value, key) {
          if (key.substring(0, 1) === key.toUpperCase().substring(0, 1) &&
              typeof value === 'function' &&
              endsWith(key, 'Workspace')) {

            // create the workspace
            try {
              child = master.createComponent({
                kind: "XV." + key,
                name: key
              });
            } catch (error) {
              assert.fail(1, 0, "XV." + key + " cannot be created");
            }
            assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);
            recordType = child.getModel();

            _.each(child.$, function (component) {
              if (typeof component.attr === 'string' && endsWith(component.attr, 'Relations')) {
                // There must be a way to get the superkind name of a kind. We want all instances
                // of listrelationseditorbox

                var modelSchema = XT.session.schemas[XT.String.prefix(recordType)].attributes[XT.String.suffix(recordType)];
                var boxRelation = _.find(modelSchema.relations, function (relation) {
                  return relation.key === component.attr;
                });
                assert.isDefined(boxRelation, key + " " + component.attr + " isn't mapped to an object");
                assert.isDefined(boxRelation.reverseRelation.key, key + " " + component.attr + " isn't mapped to an object with a reverse relation");
                var relatedModel = boxRelation.relatedModel;
                // actually we want the editableModel
                relatedModel = XT.getObjectByName(relatedModel).prototype.editableModel || relatedModel;
                console.log(relatedModel);
                var relatedModelSchema = XT.session.schemas[XT.String.prefix(relatedModel)]
                  .attributes[XT.String.suffix(relatedModel)];
                console.log("find", recordType, "on XV.", key, component.attr, "from", relatedModel);
                console.log(JSON.stringify(boxRelation));
                var reverseModel = _.find(relatedModelSchema.relations, function (reverseRelation) {
                  var originalModel = reverseRelation.relatedModel;
                  console.log("against", originalModel);
                  console.log("or", XT.getObjectByName(originalModel).prototype.editableModel);
                  return originalModel === recordType ||
                    XT.getObjectByName(originalModel).prototype.editableModel === recordType;
                });
                assert.isDefined(reverseModel, key + " " + component.attr + " isn't mapped to an object with a reverse relation");
              }
            });

          }
        });

      });
    });

  });

}());
