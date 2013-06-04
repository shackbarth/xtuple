/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true,
  describe:true, before:true, enyo:true, it:true, _:true, console:true */

(function () {
  "use strict";

  var zombieAuth = require("../lib/zombie_auth"),
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

    describe('Enyo lists', function () {
      it('should be backed by a collection', function () {
        var child,
          collName,
          Coll,
          coll,
          recordType,
          relations,
          master = new enyo.Control();

        // look at all the lists in XV
        _.each(XV, function (value, key) {
          if (key.substring(0, 1) === key.toUpperCase().substring(0, 1) &&
              typeof value === 'function' &&
              key.indexOf('List', key.length - 4) !== -1) {

            if (_.contains(['List', 'ConfigurationsList', 'AbbreviationList', 'NameDescriptionList'], key)) {
              // these ones doesn't need to be backed by a collection
              return;
            }

            // create the list
            child = master.createComponent({
              kind: "XV." + key,
              name: key
            });
            assert.equal(master.$[key].kind, 'XV.' + key, "Error instantiating XV." + key);

            // get the relations for the backing model
            collName = child.getCollection();
            assert.isNotNull(collName, 'XV.' + key + ' has no collection behind it');
            Coll = XM.Model.getObjectByName(collName);
            coll = new Coll();
            recordType = coll.model.prototype.recordType;
            relations = XT.session.schemas.XM.get(XT.String.suffix(recordType)).relations;

            // get the attributes
            var attrs = _.map(child.$, function (component) {
              return component.attr;
            });
            attrs = _.filter(attrs, function (attr) {
              return attr;
            });

            // make sure that attrs with paths are for nested relations
            _.each(attrs, function (attr) {
              var prefix, relation;

              if (attr.indexOf('.') >= 0) {
                prefix = XT.String.prefix(attr);

                relation = _.find(relations, function (rel) {
                  return rel.key === prefix;
                });
                assert.isDefined(relation, "The " + recordType +
                  " schema needs the relation " + prefix);
                assert.isTrue(relation.isNested, "The " + recordType +
                  " schema needs the relation " + prefix + " to be nested");
              }
            });

          }
        });

      });
    });

  });

}());
