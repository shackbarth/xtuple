/* global rest */

var g = require('googleapis'),
  assert = require('chai').assert,
  _ = require('underscore');

/**
 * Automated tests using the google discovery api. Hit the rest service as hard
 * as we can through automation here; augment with more specific tests by adding
 * additional spec files in this folder.
 */
describe('Discovery', function () {
  'use strict';

  var database = rest.database,
    api = rest.api,
    doc = rest.client[database],
    methods = [ 'get', 'list' ];

  // TODO validate discovery doc against a congruence template
  //
  function idAttribute (key) {
    var properties = doc.apiMeta.schemas[key].properties;
    return _.find(_.keys(properties), function (attr) {
      return _.has(properties[attr], 'isKey');
    });
  }

  function findResources (doc) {
    return _.filter(
      _.keys(doc),
      function (key) {
        return _.isObject(doc[key]) && _.intersection(_.keys(doc[key]), methods).length > 0;
      });
  }

  function can(doc, method) {
    return _.filter(
      _.keys(doc),
      function (key) {
        return _.isFunction(doc[key] && doc[key][method]);
      });
  }

  describe('#discover', function (done) {
    this.timeout(10000);
    it('is sane', function () {
      assert.ok(doc);
      assert.equal(database, doc.getName());
      assert.equal(api.version, doc.getVersion());
    });
  });
  describe('Resources', function () {
    _.each(findResources(doc), function (key) {
      var resource = doc[key],
        idAttr = idAttribute(key);

      describe(key, function () {
        it('is sane', function () {
          assert.ok(resource);
          assert.isFunction(resource.get);
        });

        (_.isFunction(resource.head) ? describe : describe.skip)('#head()', function (done) {
          var req;
          before(function () {
            req = resource.head();
          });

          /*
          it('should return headers', function (done) {
            req.execute(function (err, body, res) {
              assert.isNull(err);
              assert.ok(res.headers);
              done();
            });
          });
          */
        });

        (_.isFunction(resource.get) ? describe : describe.skip)('#get()', function (done) {
          this.timeout(20000);
          var req;
          before(function () {
            req = resource.get();
          });
          it('resource defines a key', function () {
            assert.ok(idAttr);
          });

          /*
          it('should execute query by id', function (done) {
            req.execute(function (err, body, res) {
              assert.isNull(err);
              done();
            });
          });
          */
        });

        (_.isFunction(resource.listhead) ? describe : describe.skip)('#listhead()', function (done) {
          var req;
          before(function () {
            req = resource.listhead();
          });

          it('should return list headers', function (done) {
            req.execute(function (err, body, res) {
              assert.isNull(err);
              assert.ok(res.headers);
              done();
            });
          });

        });

        (_.isFunction(resource.list) ? describe : describe.skip)('#list()', function (done) {
          var req;
          before(function () {
            req = resource.list();
          });

        });

        (_.isFunction(resource.delete) ? describe : describe.skip)('#delete()', function (done) {
          var req;
          before(function () {
            req = resource.delete();
          });

        });
          
        (_.isFunction(resource.insert) ? describe : describe.skip)('#insert()', function (done) {
          var req;
          before(function () {
            req = resource.insert();
          });

        });

        (_.isFunction(resource.patch) ? describe : describe.skip)('#patch()', function (done) {
          var req;
          before(function () {
            req = resource.patch();
          });

        });
      });
    });
  });
});
