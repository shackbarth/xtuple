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

            if (!_.contains(['OpportunityWorkspace'], key)) {
              // these ones doesn't need to be backed by a collection
              return;
            }

            // create the list
            child = master.createComponent({
              kind: "XV." + key,
              name: key
            });
            assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);
            recordType = child.getModel();

            _.each(child.$, function (component) {
              if (typeof component.attr === 'string' && endsWith(component.attr, 'Relations')) {
                // There must be a way to get the superkind name of a kind. We want all instances
                // of listrelationseditorbox

                //console.log(component.attr);
                var modelSchema = XT.session.schemas[XT.String.prefix(recordType)].attributes[XT.String.suffix(recordType)];
                //console.log(JSON.stringify(modelSchema.relations));
                var boxRelation = _.find(modelSchema.relations, function (relation) {
                  return relation.key === component.attr;
                });
                assert.isDefined(boxRelation.reverseRelation.key);
              }
            });

          }
        });

      });
    });

  });

}());
