/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../../lib/zombie_auth"),
    _ = require("underscore"),
    assert = require("chai").assert,
    endsWith = function (s, key) {
      return s.indexOf(key, s.length - key.length) !== -1;
    };

  describe('ListRelationsBoxes', function () {
    this.timeout(20 * 1000);
    it('should log in first', function (done) {
      zombieAuth.loadApp(done);
    });

    it('should be set up right', function () {
      var child,
        collName,
        Coll,
        coll,
        recordType,
        relations,
        master = new enyo.Control();

      // look at all the workspaces in XV
      _.each(XV, function (value, key) {
        if (!XV.inheritsFrom(value.prototype, "XV.Workspace") || key === 'SalesOrderBase') {
          // exclude abstract classes
          return;
        }
        describe('XV.' + key, function () {
          it('should have attributes that point backwards appropriately', function () {

            // create the workspace
            try {
              child = master.createComponent({
                kind: "XV." + key,
                name: key
              });
            } catch (error) {
              //assert.fail(1, 0, "XV." + key + " cannot be created");
              console.log("XV." + key + " cannot be created with the extensions you have installed (probably none).");
              return;
            }
            assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);
            recordType = child.getModel(); // the recordType of the model backing the workspace

            _.each(child.$, function (component) {
              if (XV.inheritsFrom(component, 'XV.ListRelationsBox') &&
                  !XV.inheritsFrom(component, 'XV.DocumentsBox')) {
                if (!component.canOpen) {
                  //we're not testing these corner-case objects
                  return;
                }

                if (component.attr.indexOf('.') >= 0) {
                  // TODO: test these nested attributes
                  return;
                }

                //
                // By now we're looking at every ListRelationsBox in any Workspace, to make
                // sure that they're hooked up right. Most of the problems we're guarding against
                // here are problems with the ORMs, so this should be considered an integration
                // test. We'll be looking extensively at the schemas (i.e. XT.session.schemas.XM)
                // of the model that backs the workspace, as well as the model that backs the box.
                //

                var modelSchema = XT.session.schemas[XT.String.prefix(recordType)].attributes[XT.String.suffix(recordType)];
                var boxRelation = _.find(modelSchema.relations, function (relation) {
                  return relation.key === component.attr;
                });
                assert.isDefined(boxRelation, component.attr + " isn't mapped to an object");
                assert.isDefined(boxRelation.reverseRelation.key,
                  component.attr + " isn't mapped to an object with a reverse relation");

                var relatedModelName = boxRelation.relatedModel; // the recordType of the model backing the ListRelationsBox
                // actually we want the editableModel
                var editableRelatedModelName = XT.getObjectByName(relatedModelName).prototype.editableModel ||
                  relatedModelName;
                var findModelAttribute = function (recordTypeToSearch, recordTypeToFind) {
                  var modelSchema = XT.session.schemas[XT.String.prefix(recordTypeToSearch)]
                    .attributes[XT.String.suffix(recordTypeToSearch)];
                  var reverseModel = _.find(modelSchema.relations, function (reverseRelation) {
                    var originalModel = reverseRelation.relatedModel,
                      editableModel = XT.getObjectByName(originalModel).prototype.editableModel || originalModel,
                      accountModels = ['XM.Account', 'XM.Customer', 'XM.SalesCustomer', 'XM.Prospect'];

                    return recordTypeToFind === originalModel ||
                       recordTypeToFind === editableModel ||
                       _.contains(accountModels, editableModel) && _.contains(accountModels, recordTypeToFind);
                  });
                  return reverseModel;
                };
                var reverseModel = findModelAttribute(editableRelatedModelName, recordType);
                // XXX nerf for InvoiceAllocation. I don't think this is actually important.
                //assert.isDefined(reverseModel, component.attr + " isn't mapped to an object with a reverse relation");

                //
                // Want to be able to select a related model from the list? The list's model also needs to have
                // the original model as an attribute
                //
                var relatedListName = component.getSearchList();
                var relatedModelReqAttrs = XT.getObjectByName(editableRelatedModelName).prototype.requiredAttributes;
                var parentModelIsRequired = _.contains(relatedModelReqAttrs, component.getParentKey());
                if (!relatedListName) {
                  // XXX nerf for InvoiceAllocation
                  //assert.isTrue(parentModelIsRequired, "The only reason for " + component.kind +
                  //  " to be missing a searchList is if " + component.getParentKey() + " were required on " +
                  //  editableRelatedModelName + ", which it is not");

                  // for now, we just don't worry about the ones that have no search capability
                  return;
                }
                assert.isFalse(parentModelIsRequired, component.kind +
                  " has a searchList, which should mean that " + component.getParentKey() + " is not required on " +
                  editableRelatedModelName + ", but it is required!");
                var listChild;
                try {
                  listChild = master.createComponent({
                    kind: relatedListName
                  });
                } catch (error) {
                  assert.fail(1, 0, relatedListName + " cannot be created");
                }

                // we check the schema columns here, because the value sometimes isn't
                // in the schema relations. Above, we check the schema relations. Not
                // sure if this inconsistency is necessary, but it works.
                var listModelName = listChild.value.model.prototype.recordType;
                modelSchema = XT.session.schemas[XT.String.prefix(listModelName)]
                  .attributes[XT.String.suffix(listModelName)];
                var reverseAttr = _.find(modelSchema.columns, function (column) {
                  return column.name === component.getParentKey();
                });

                assert.isDefined(reverseAttr, listModelName + " must have " + component.getParentKey() +
                  " as an attribute if " + component.kind + " searching is to work.");
              }
            });
          });
        });
      });
    });
  });
}());
