(function () {
  "use strict";

/**
  mocha test/lib/coverage.js

  Tells you how many business objects are navigable in our lists and how many of those
  are under spec test
*/

  var _ = require("underscore"),
    assert = require("chai").assert,
    fs = require('fs'),
    path = require('path'),
    zombieAuth = require('../lib/zombie_auth');

  var checkListCoverage = function () {
    var navigator = XT.app.$.postbooks.$.navigator,
      objectCount = 0,
      coverageCount = 0,
      specFiles = _.filter(fs.readdirSync(path.join(__dirname, "../specs")), function (fileName) {
        // filter out .swp files, etc.
        return path.extname(fileName) === '.js';
      }),
      // TODO: consider tests in xtuple-extensions and private-extensions
      coverageArray = _.compact(_.map(specFiles, function (specFile) {
        return require(path.join(__dirname, "../specs", specFile)).spec.recordType;
      }));

    //
    // Look through all the lists for business objects
    //
    _.each(navigator.modules, function (module, moduleIndex) {
      _.each(module.panels, function (panel, panelIndex) {
        var kind,
          collName,
          Coll,
          proto,
          recordType;

        if (!panel.kind) {
          return;
        }
        kind = XV[XT.String.suffix(panel.kind)];
        if (!kind) {
          return;
        }
        collName = kind.prototype.collection;
        if (!collName) {
          return;
        }
        Coll = XT.getObjectByName(collName);
        if (!Coll || !Coll.prototype) {
          return;
        }
        proto = Coll.prototype.model.prototype;
        recordType = proto.editableModel || proto.recordType;
        objectCount++;
        if (_.contains(coverageArray, recordType)) {
          coverageCount ++;
        } //else {
          // TODO: something like this would be nice someday
          // assert.fail(recordType + " is not under spec test coverage");
        //}
      });
    });
    console.log("Coverage is ", coverageCount + " / " + objectCount);
  };

  describe('Business object coverage coverage', function () {
    it('should log in first', function (done) {
      this.timeout(10 * 60 * 1000);
      zombieAuth.loadApp({refreshLogin: true, callback: done});
    });
    it('should be respectable', function () {
      checkListCoverage();
    });
  });

}());

