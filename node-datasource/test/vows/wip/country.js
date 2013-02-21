/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var createHash,
    updateHash,
    model = new XM.Country();

  createHash = {
    name: 'Elbonia',
    abbreviation: 'EL',
    currencyAbbreviation: 'PIC',
    currencyName: 'Pico',
    currencySymbol: '!'
  };

  updateHash = {
    abbreviation: 'EB'
  };

  vows.describe('XM.Country CRUD test').addBatch({
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
    'CHECKS PARAMETERS ': {
      topic: function () {
        return model;
      },
      'Last Error is null': function (model) {
        assert.isNull(model.lastError);
      },
      '-> `requiredAttributes`': {
        topic: function () {
          return model;
        },
        'Abbreviation is required': function (model) {
          assert.isTrue(_.contains(model.requiredAttributes, "abbreviation"));
        },
        'currencyAbbreviation is required': function (model) {
          assert.isTrue(_.contains(model.requiredAttributes, "currencyAbbreviation"));
        },
        'Name is required': function (model) {
          assert.isTrue(_.contains(model.requiredAttributes, "name"));
        }
      }
    }
  }).addBatch({
    'CHECKS METHODS ': {
      topic: function () {
        return model;
      },
      'Last Error is null': function (model) {
        assert.isNull(model.lastError);
      },
      '-> `validateEdit`': {
        topic: function () {
          return model;
        },
        'Abbreviation must be 2 letters': function (model) {
          var err = model.validate({ abbreviation: 'TOO_LONG'});
          assert.equal(err.code, 'xt1006'); // Error code for invalid length
          assert.equal(err.params.length, 2); // The length it should be
        },
        'Currency Abbreviation must be 3 letters': function (model) {
          var err = model.validate({ currencyAbbreviation: 'TOO_LONG'});
          assert.equal(err.code, 'xt1006'); // Error code for invalid length
          assert.equal(err.params.length, 3); // The length it should be
        }
      }
    }
  }).addBatch({
    'READ': {
      topic: function () {
        return model;
      },
      'ID is a number': function (model) {
        assert.isNumber(model.id);
      },
      'Name is `Elbonia`': function (model) {
        assert.equal(model.get('name'), createHash.name);
      },
      'Abbreviation is `EL`': function (model) {
        assert.equal(model.get('abbreviation'), createHash.abbreviation);
      },
      'Currency Name is `Pico`': function (model) {
        assert.equal(model.get('currencyName'), createHash.currencyName);
      },
      'Currency Abbreviation is `PIC`': function (model) {
        assert.equal(model.get('currencyAbbreviation'),
          createHash.currencyAbbreviation);
      }
    }
  }).addBatch({
    'UPDATE ': XVOWS.update(model, {
      '-> Set values': {
        topic: function () {
          model.set(updateHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        'Abbreviation is `EB`': function (model) {
          assert.equal(model.get('abbreviation'), updateHash.abbreviation);
        },
        'Status is `READY_DIRTY`': function (model) {
          assert.equal(model.getStatusString(), 'READY_DIRTY');
        },
        '-> Commit': XVOWS.save(model)
      }
    })
  }).addBatch({
    'DESTROY': XVOWS.destroy(model, {
      'FINISH XM.Country': function () {
        XVOWS.next();
      }
    })
  }).run();
}());
