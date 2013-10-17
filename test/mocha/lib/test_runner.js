/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */


// TODO: test "used"
// i.e.: A XM.ShipVia object can not be deleted if it has been assigned as the default customer ship via in sales settings.

// TODO: test defaults

(function () {
  "use strict";

  var crud = require('./crud'),
    smoke = require('./smoke'),
    specs = require('./specs'),
    assert = require("chai").assert,
    _ = require("underscore");

  _.each(specs, function (spec) {
    describe(spec.recordType, function () {
      if (_.isString(spec.updatableField)) {
        spec.updateHash = {};
        spec.updateHash[spec.updatableField] = "Test" + Math.random();
      }


      //
      // Run CRUD model tests
      //
      crud.runAllCrud(spec);

      //
      // Smoke Crud
      //
      //smoke.runUICrud(spec); XXX

      //
      // Verify lockability
      //
      it(spec.isLockable ? "is lockable" : "is not lockable", function () {
        assert.equal(spec.isLockable, spec.model.lockable);
      });

      //
      // Verify inheritance
      //
      if (spec.instanceOf === "XM.Document") {
        it("inherits from XM.Document", function () {
          assert.isTrue(spec.model instanceof XM.Document);
        });
      } else if (spec.instanceOf === "XM.Model") {
        it("inherits from XM.Model but not XM.Document", function () {
          assert.isTrue(spec.model instanceof XM.Model);
          assert.isFalse(spec.model instanceof XM.Document);
        });
      } else {
        it("has its inheritance defined in the test spec", function () {
          assert.fail();
        });
      }

      //
      // Verify ID attribute
      //
      if (spec.idAttribute) {
        it("has " + spec.idAttribute + " as its idAttribute", function () {
          assert.equal(spec.idAttribute, spec.model.idAttribute);
          if (spec.instanceOf === "XM.Document") {
            // Documents have the same value as their document key
            assert.equal(spec.idAttribute, spec.model.documentKey);
          }
        });
      } else {
        it("has its id attribute defined in the test spec", function () {
          assert.fail();
        });
      }

      //
      // Make sure we're testing the enforceUpperCase (the asserts themselves are in CRUD)
      //
      it((spec.enforceUpperKey ? "Enforces" : "Does not enforce") + " uppercasing the key", function () {
        assert.equal(spec.model.enforceUpperKey, spec.enforceUpperKey);
      });
      if (!_.isBoolean(spec.enforceUpperKey)) {
        it("has its enforceUpperKey convention defined in the test spec", function () {
          assert.fail();
        });
      }

      //
      // Verify attributes
      //
      _.each(spec.attributes, function (attr) {
        it("contains the " + attr + " attribute", function () {
          assert.include(spec.model.getAttributeNames(), attr);
        });
      });
      if (!spec.attributes || spec.attributes.length === 0) {
        it("has some attributes defined in the test spec", function () {
          assert.fail();
        });
      }

      //
      // Verify privileges are declared correctly by the extensions
      //
      _.each(spec.privileges, function (priv) {
        if (typeof priv === 'string') {
          _.each(spec.extensions, function (extension) {
            it("has privilege " + priv + " declared by the " + extension + " extension", function () {
              assert.isDefined(_.findWhere(XT.session.relevantPrivileges,
                {privilege: priv, module: extension}));
            });
          });
          /*
          XXX this could get tripped up by non-core extensions
          it("has privilege " + priv + " not declared by any other extensions", function () {
            var matchedPriv = _.filter(XT.session.relevantPrivileges, function (sessionPriv) {
              return sessionPriv.privilege === priv && !_.contains(spec.extensions, sessionPriv.module);
            });
            assert.equal(0, matchedPriv.length);
          });
          */
          //
          // Make sure the privilege is translated
          //
          it("has privilege " + priv + " that is translated in the strings file", function () {
            var privLoc = "_" + XT.String.camelize(priv);
            assert.notEqual(XT.String.loc(privLoc), privLoc);
          });
        }
      });

      //
      // Verify Privileges
      //
      _.each(spec.privileges, function (priv, key) {
        var methodMap = {
            createUpdateDelete: ["canCreate", "canUpdate", "canDelete"],
            createUpdate: ["canCreate", "canUpdate"],
            create: ["canCreate"],
            read: ["canRead"],
            update: ["canUpdate"],
            delete: ["canDelete"]
          },
          pertinentMethods = methodMap[key];

        var updatePriv = spec.privileges.update ||
          spec.privileges.createUpdate ||
          spec.privileges.createUpdateDelete;

        it("needs " + priv + " privilege to perform action " + key, function () {
          var Klass = XT.getObjectByName(spec.recordType);

          if (_.isString(priv)) {
            assert.isDefined(pertinentMethods); // make sure we're testing for the priv
            XT.session.privileges.attributes[priv] = false;
            if (key === "read" && updatePriv) {
              // update privs are sufficient for read, so we have to toggle those too
              XT.session.privileges.attributes[updatePriv] = false;
            }
            _.each(pertinentMethods, function (pertinentMethod) {
              assert.isFalse(Klass[pertinentMethod]());
            });
            XT.session.privileges.attributes[priv] = true;
            if (key === "read" && updatePriv) {
              // update privs are sufficient for read, so we have to toggle those too
              XT.session.privileges.attributes[updatePriv] = true;
            }
            _.each(pertinentMethods, function (pertinentMethod) {
              assert.isTrue(Klass[pertinentMethod]());
            });

          } else if (_.isBoolean(priv)) {
            _.each(pertinentMethods, function (pertinentMethod) {
              assert.equal(Klass[pertinentMethod](), priv);
            });

          } else {
            it("has privilege " + priv + " that's a string or boolean in the test spec", function () {
              assert.fail();
            });
          }
        });
      });

      //
      // Test that the collection exists
      //
      it("backs the " + spec.collectionType + " collection", function () {
        var Collection = XT.getObjectByName(spec.collectionType),
          modelPrototype = Collection.prototype.model.prototype,
          editableModel = modelPrototype.editableModel || modelPrototype.recordType;

        assert.isFunction(Collection);
        assert.equal(editableModel, spec.recordType);
      });

      //
      // Test that the cache exists
      //
      if (spec.cacheName) {
        it("is cached as " + spec.cacheName, function () {
          var cache = XT.getObjectByName(spec.cacheName);
          assert.isObject(cache);
          assert.equal(cache.model.prototype.recordType, spec.recordType);
        });

      } else if (spec.cacheName === null) {
        /*
        TODO: probably the best thing to do is to loop through the caches and make sure
        that none of them are backed by spec.recordType
        it("is not cached", function () {

        });
        */
      } else {
        it("has a cache (or null for no cache) specified in the test spec", function () {
          assert.fail();
        });
      }
      // TODO: verify that the cache is made available by certain extensions and not others
      // TODO: verify that the list is made available by certain extensions and not others


      if (spec.additionalTests) {
        spec.additionalTests();
      }


    });
  });
}());
