/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var createHash,
    updateHash,
    model = new XM.State();

  // Get the country id from it's name.
  var cid = function (cname) {
    var iterator = function (country) {
        return country.get('name') === cname;
      },
      found = _.find(XM.countries.models, iterator);

    if (found && found.hasOwnProperty('id')) {
      return found.id;
    }
    else {
      return null;
    }
  };

  createHash = {
    name: 'Plasma',
    abbreviation: 'PL',
    country: cid('United States')
  };

  updateHash = {
    name: 'Gas',
    abbreviation: 'GS',
    country: cid('Australia')
  };

  vows.describe('XM.State CRUD test').addBatch({
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
        'Country is required': function (model) {
          assert.isTrue(_.contains(model.requiredAttributes, "country"));
        },
        'Name is required': function (model) {
          assert.isTrue(_.contains(model.requiredAttributes, "name"));
        }
      }
    }
  }).addBatch({
    'READ': {
      topic: function () {
        return model;
      },
      'Name is `Plasma`': function (model) {
        assert.equal(model.get('name'), createHash.name);
      },
      'Abbreviation is `PL`': function (model) {
        assert.equal(model.get('abbreviation'), createHash.abbreviation);
      },
      'ID is a number': function (model) {
        assert.isNumber(model.get('id'));
      },
      'Country is an object': function (model) {
        assert.isObject(model.get('country'));
      },
      'Country ID is `United States\'s`': function (model) {
        assert.equal(model.get('country').get('id'), createHash.country);
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
        'Name is `Gas`': function (model) {
          assert.equal(model.get('name'), updateHash.name);
        },
        'Abbreviation is `GS`': function (model) {
          assert.equal(model.get('abbreviation'), updateHash.abbreviation);
        },
        'Country is an object': function (model) {
          assert.isObject(model.get('country'));
        },
        'Country ID is `Australia\'s`': function (model) {
          assert.equal(model.get('country').get('id'),
            updateHash.country);
        },
        'Status is `READY_DIRTY`': function (model) {
          assert.equal(model.getStatusString(), 'READY_DIRTY');
        },
        '-> Commit': XVOWS.save(model)
      }
    })
  }).addBatch({
    'DESTROY': XVOWS.destroy(model, {
      'FINISH XM.State': function () {
        XVOWS.next();
      }
    })
  }).run();
}());
