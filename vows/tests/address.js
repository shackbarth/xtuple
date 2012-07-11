/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  plusplus:true, immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, assert:true, console:true */

(function () {
  "use strict";

  var createHash, updateHash;

  createHash = {
    line1: 'add1',
    line2: 'add2',
    line3: 'add3',
    city: 'Hometown',
    state: 'Alabama',
    postalCode: '12345',
    country: 'United States',
    notes: 'Address Note.'
  };

  updateHash = {
    line1: '123 Four St.'
  };

  vows.describe('XM.Address CRUD test').addBatch({
    'CREATE': XVOWS.create('XM.Address', {
      '-> Set values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        '-> Save and READ': XVOWS.save({
          'GUID is a number': function (model) {
            assert.isNumber(model.get('guid'));
          },
          'Number property is a string': function (model) {
            assert.isString(model.get('number'));
          },
          'Line1 is `add1`': function (model) {
            assert.equal(model.get('line1'), createHash.line1);
          },
          'Line2 is `add2`': function (model) {
            assert.equal(model.get('line2'), createHash.line2);
          },
          'Line3 is `add3`': function (model) {
            assert.equal(model.get('line3'), createHash.line3);
          },
          'City is `Hometown`': function (model) {
            assert.equal(model.get('city'), createHash.city);
          },
          'State is `Alabama`': function (model) {
            assert.equal(model.get('state'), createHash.state);
          },
          'Postal Code is `12345`': function (model) {
            assert.equal(model.get('postalCode'), createHash.postalCode);
          },
          'Country is `United States`': function (model) {
            assert.equal(model.get('country'), createHash.country);
          },
          'Address format returns a string': function (model) {
            assert.isString(model.format(false));
          },
          'Address format(false) returns ASCII new lines': function (model) {
            assert.include(model.format(false), '\n');
          },
          'Address format(true) returns HTML line breaks': function (model) {
            assert.include(model.format(true), '<br />');
          },
          'Address formatShort returns a string': function (model) {
            assert.isString(model.formatShort());
          },
          // TODO - figure out how this works.
          'Address useCount returns an object': function (model) {
            var that = this,
              options = {
                success: function (response) {
                  XVOWS.console('Address count is ' + response);
                  // TODO - Doesn't work.
                  //that.callback(response);
                },
                error: function (response) {
                  console.log('XM.Address.useCount failed.');
                }
              };
            assert.isObject(model.useCount(options));
          },
          'Address findExisting returns an object': function (model) {
            var that = this,
              options = {
                success: function (response) {
                  XVOWS.console('Address found ');
                  // TODO - Doesn't work.
                  //that.callback(response);
                },
                error: function (response) {
                  console.log('XM.Address.findExisting failed.');
                }
              };
            // TODO - Something's broken with XM.Address.findExisting.
            assert.isObject(model.findExisting(createHash.line1, createHash.line2, createHash.line3, createHash.city, createHash.state, createHash.postalCode, createHash.country, options));
          },
          '-> UPDATE': {
            topic: function (model) {
              model.set(updateHash);
              return model;
            },
            'Last Error is null': function (model) {
              assert.isNull(model.lastError);
            },
            'Line1 is `123 Four St.`': function (model) {
              assert.equal(model.get('line1'), updateHash.line1);
            },
            'Status is READY_DIRTY': function (model) {
              assert.equal(model.getStatusString(), 'READY_DIRTY');
            },
            '-> Commit': XVOWS.save({
              'Line1 is `123 Four St.`': function (model) {
                assert.equal(model.get('line1'), updateHash.line1);
              },
              '-> DESTROY': XVOWS.destroy({
                'FINISH XM.Address': function () {
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
