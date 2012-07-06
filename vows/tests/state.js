(function () {
  "use strict";

  var createHash, updateHash;

  createHash = {
    name: 'Plasma',
    abbreviation: 'PL',
    country: 230
  };

  updateHash = {
    abbreviation: 'PM',
    country: 13
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
          'Country is `230`': function (model) {
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
            'Abbreviation is PM': function (model) {
              assert.equal(model.get('abbreviation'), updateHash.abbreviation);
            },
            'Country is `13`': function (model) {
              assert.equal(model.get('country').get('guid'), updateHash.country);
            },
            'Status is READY_DIRTY': function (model) {
              assert.equal(model.getStatusString(), 'READY_DIRTY');
            },
            '-> Commit': XVOWS.save({
              'Abbreviation is PM': function (model) {
                assert.equal(model.get('abbreviation'), updateHash.abbreviation);
              },
              'Country is `13`': function (model) {
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
