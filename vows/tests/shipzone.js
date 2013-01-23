/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var createHash,
    updateHash,
    model = new XM.ShipZone();

  createHash = {
    name: "TESTSHIPZONE",
    description: "iAmAShipZone"
  };

  updateHash = {
    name: "UPDATETESTSHIPZONE"
  };

  vows.describe('XM.ShipZone CRUD test').addBatch({
    'CREATE ': XVOWS.create(model, {
      '-> Set values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        '-> Save': XVOWS.save(model)
      }
    })
  }).addBatch({
    'READ': {
      topic: function () {
        return model;
      },
      'ID is a number': function (model) {
        assert.isNumber(model.id);
      },
      'Name is `TESTSHIPZONE`': function (model) {
        assert.equal(model.get('name'), createHash.name);
      },
      'Description is `iAmAShipZone`': function (model) {
        assert.equal(model.get('description'), createHash.description);
      }
    }
  }).addBatch({
    'UPDATE ': XVOWS.update(model, {
      '-> Set values': {
        topic: function () {
          model.set(updateHash);
          return model;
        },
        'Name is `UPDATETESTSHIPZONE`': function (model) {
          assert.equal(model.get('name'), updateHash.name);
        },
        '-> Commit': XVOWS.save(model)
      }
    })
  }).addBatch({
    'DESTROY': XVOWS.destroy(model, {
      'FINISH XM.ShipZone': function () {
        XVOWS.next();
      }
    })
  }).run();
}());
