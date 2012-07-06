/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, 
  plusplus:true, immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, assert:true */

(function () {
  "use strict";

  var createHash, updateHash;

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
    'CREATE': XVOWS.create('XM.Country', {
      '-> Set values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        // Validation tests
        'Abbreviation must be 2 letters': function (model) {
          var err = model.validate({ abbreviation: 'TOO_LONG'});
          assert.equal(err.code, 'xt1006'); // Error code for invalid length
          assert.equal(err.params.length, 2); // The length it should be
        },
        'Currency Abbreviation must be 3 letters': function (model) {
          var err = model.validate({ currencyAbbreviation: 'TOO_LONG'});
          assert.equal(err.code, 'xt1006'); // Error code for invalid length
          assert.equal(err.params.length, 3); // The length it should be
        },
        '-> Save and READ': XVOWS.save({
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
          },
          '-> UPDATE': {
            topic: function (model) {
              model.set(updateHash);
              return model;
            },
            'Last Error is null': function (model) {
              assert.isNull(model.lastError);
            },
            'Abbreviation is EB': function (model) {
              assert.equal(model.get('abbreviation'), updateHash.abbreviation);
            },
            'Status is READY_DIRTY': function (model) {
              assert.equal(model.getStatusString(), 'READY_DIRTY');
            },
            '-> Commit': XVOWS.save({
              'Abbreviation is EB' : function (model) {
                assert.equal(model.get('abbreviation'),
                  updateHash.abbreviation);
              },
              '-> DESTROY': XVOWS.destroy({
                'FINISH XM.Country': function () {
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