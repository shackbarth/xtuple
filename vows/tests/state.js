/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true, clearTimeout:true, vows:true, assert:true */

(function () {
  "use strict";

  var createHash, updateHash;

  // Get the country id from it's name.
  var cid = function (cname) {
    var iterator = function (country) {
      return country.get('name') === cname;
    };

    var found = _.find(XM.countries.models, iterator);

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
    'CREATE': XVOWS.create('XM.State', {
      '-> Set values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        '-> Save and READ': XVOWS.save({
          'Name is `Plasma`': function (model) {
            assert.equal(model.get('name'), createHash.name);
          },
          'Abbreviation is `PL`': function (model) {
            assert.equal(model.get('abbreviation'), createHash.abbreviation);
          },
          'GUID is a number': function (model) {
            assert.isNumber(model.get('guid'));
          },
          'Country is an object': function (model) {
            assert.isObject(model.get('country'));
          },
          'Country guid is United States\'s': function (model) {
            assert.equal(model.get('country').get('guid'), createHash.country);
          },
          '-> UPDATE': {
            topic: function (model) {
              model.set(updateHash);
              return model;
            },
            'Last Error is null': function (model) {
              assert.isNull(model.lastError);
            },
            'Name is Gas': function (model) {
              assert.equal(model.get('name'), updateHash.name);
            },
            'Abbreviation is GS': function (model) {
              assert.equal(model.get('abbreviation'), updateHash.abbreviation);
            },
            'Country is an object': function (model) {
              assert.isObject(model.get('country'));
            },
            'Country guid is Australia\'s': function (model) {
              assert.equal(model.get('country').get('guid'), updateHash.country);
            },
            'Status is READY_DIRTY': function (model) {
              assert.equal(model.getStatusString(), 'READY_DIRTY');
            },
            '-> Commit': XVOWS.save({
              'Name is Gas': function (model) {
                assert.equal(model.get('name'), updateHash.name);
              },
              'Abbreviation is GS': function (model) {
                assert.equal(model.get('abbreviation'), updateHash.abbreviation);
              },
              'Country is an object': function (model) {
                assert.isObject(model.get('country'));
              },
              'Country guid is Australia\'s': function (model) {
                assert.equal(model.get('country').get('guid'), updateHash.country);
              },
              '-> DESTROY': XVOWS.destroy({
                'FINISH XM.State': function () {
                  XVOWS.next();
                }
              })
            })
          }
        })
      }
    })
  }).run();
}());
