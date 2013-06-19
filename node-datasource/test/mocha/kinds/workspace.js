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

  describe('XV', function () {
    this.timeout(45 * 1000);

    before(function (done) {
      var appLoaded = function () {
        done();
      };

      zombieAuth.loadApp(appLoaded);
    });

    describe('ListRelationsBox', function () {
      // XXX This test works best on an app with all the extensions!
      it('should have attributes that point backwards appropriately', function () {
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

            //if (key !== 'OpportunityWorkspace') {
              // FIXME temp
              //return;
            //}

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
            recordType = child.getModel(); // the recordType of the model backing the workspace

            _.each(child.$, function (component) {
              if (typeof component.attr === 'string' && endsWith(component.attr, 'Relations')) {
                // There must be a way to get the superkind name of a kind. We want all instances
                // of ListRelationsBox

                var modelSchema = XT.session.schemas[XT.String.prefix(recordType)].attributes[XT.String.suffix(recordType)];
                var boxRelation = _.find(modelSchema.relations, function (relation) {
                  return relation.key === component.attr;
                });
                assert.isDefined(boxRelation, key + " " + component.attr + " isn't mapped to an object");
                assert.isDefined(boxRelation.reverseRelation.key, key + " " + component.attr + " isn't mapped to an object with a reverse relation");


                var relatedModelName = boxRelation.relatedModel; // the recordType of the model backing the ListRelationsBox
                // actually we want the editableModel
                var editableRelatedModelName = XT.getObjectByName(relatedModelName).prototype.editableModel || relatedModelName;
                var findModelAttribute = function (recordTypeToSearch, recordTypeToFind) {
                  var modelSchema = XT.session.schemas[XT.String.prefix(recordTypeToSearch)]
                    .attributes[XT.String.suffix(recordTypeToSearch)];
                  var reverseModel = _.find(modelSchema.relations, function (reverseRelation) {
                    var originalModel = reverseRelation.relatedModel,
                      editableModel = XT.getObjectByName(originalModel).prototype.editableModel || originalModel,
                      accountModels = ['XM.Account', 'XM.Customer', 'XM.Prospect'];

                    return recordTypeToFind === originalModel ||
                       recordTypeToFind === editableModel ||
                       _.contains(accountModels, editableModel) && _.contains(accountModels, recordTypeToFind);
                  });
                  return reverseModel;
                };
                var reverseModel = findModelAttribute(editableRelatedModelName, recordType);
                assert.isDefined(reverseModel, key + " " + component.attr + " isn't mapped to an object with a reverse relation");


                //
                // Want to be able to select a related model from the list? The list's model also needs to have
                // the original model as an attribute
                //
                var relatedListName = component.getSearchList();
                var relatedModelReqAttrs = XT.getObjectByName(editableRelatedModelName).prototype.requiredAttributes;
                var parentModelIsRequired = _.contains(relatedModelReqAttrs, component.getParentKey());
                if (!relatedListName) {
                  assert.isTrue(parentModelIsRequired, "The only reason for " + component.kind +
                    " to be missing a searchList is if " + component.getParentKey() + " were required on " +
                    editableRelatedModelName + ", which it is not");
                  /*
                    TODO: verify that the search list has been properly included, or omitted
                  shackbarth 04:23:29 PM
                  johnrogelstad: what logic governs which ListRelationsBoxes have New/Attach/Open/Detatch buttons and which have only New/Open buttons?
                  It doesn't look like we're mimicking qt exactly. 04:23:40 PM
                  and why wouldn't we allow you to attach an object if you can create one? 04:23:59 PM
                  e.g. Contact->ToDo has 4 buttons, but Contact->Opportunities has 2. 04:24:35 PM
                  Which is just driven by the fact that some of these kinds have to searchList defined. 04:24:52 PM
                  https://github.com/xtuple/xtuple/blob/master/enyo-client/extensions/source/crm/client/views/list_relations_box.js#L51-L65 04:26:10 PM
                  is this on purpose or an oversight? 04:26:16 PM

                  johnrogelstad 04:28:42 PM
                  Both.
                  In the case of Contact -> Incidents, you can not create an incident without a contact 04:30:36 PM
                  So if you pulled up a list of eligible incidents to attach to a contact, you would get no results every time. 04:30:52 PM
                  I believe I was thinking the same was true for opportunity, but is not 04:31:48 PM
                  On opportunity Account is required, but contact is not. 04:31:57 PM
                  So you should be able to attach an opportunity to a contact, but not an incident
                  neither account nor contact is required on to do, so you can attach a to do from a contact or from an account 04:32:58 PM
                  In the Qt client you can not do any of these things from contact. In that sense, the mobile client offers improvements. 04:33:33 PM
                  Anyway, there is some flag on the relations box you can flip to switch between canAttach or not. 04:34:32 PM
                  */

                  // for now, we just don't worry about the ones that have so search capability
                  return;
                }
                // I have doubts about this requirement:
                //assert.isFalse(parentModelIsRequired, "The only reason for " + component.kind +
                //  " to have a searchList is if " + component.getParentKey() + " were not required on " +
                //  editableRelatedModelName + ", but it is required!");
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

          }
        });

      });
    });

  });

}());
