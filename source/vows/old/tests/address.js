/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var createHash,
    updateHash,
    model = new XM.Address();

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
    'CHECK CLASS METHODS ': {
      topic: function () {
        return model;
      },
      'Last Error is null': function (model) {
        assert.isNull(model.lastError);
      },
      '-> `findExisting`': {
        topic: function () {
          var callback = this.callback,
            timeoutId,
            success = function (response) {
              clearTimeout(timeoutId);
              callback(null, response);
            };
          XM.Address.findExisting("Tremendous Toys Inc.", "101 Toys Place", "",
            "Walnut Hills", "VA", "22209", "United States", {success: success});

          // If we don't hear back, keep going
          timeoutId = setTimeout(function () {
            callback(null, 0);
          }, XVOWS.wait);
        },
        'Address found': function (response) {
          assert.isTrue(response > 0);
        },
        '-> get Address from ID': {
          topic: function (addr_id) {
            var that = this,
              timeoutId,
              model = new XM.Address(),
              callback = function () {
                var status = model.getStatus(),
                  K = XM.Model;
                if (status === K.READY_CLEAN) {
                  clearTimeout(timeoutId);
                  model.off('statusChange', callback);
                  that.callback(null, model);
                }
              };

            model.on('statusChange', callback);

            model.fetch({id: addr_id});

            // If we don't hear back, keep going
            timeoutId = setTimeout(function () {
              callback(null, 0);
            }, XVOWS.wait);
          },
          '-> `useCount`': {
            topic: function (addr) {
              var callback = this.callback,
                timeoutId,
                success = function (response) {
                  clearTimeout(timeoutId);
                  callback(null, response);
                };

              addr.useCount({success: success});

              // If we don't hear back, keep going
              timeoutId = setTimeout(function () {
                callback(null, 0);
              }, XVOWS.wait);
            },
            'Address useCount is a Number': function (response) {
              assert.isNumber(response);
            },
            'Address loaded is used twice': function (response) {
              assert.isTrue(response > 0);
            }
          }
        }
      },
      '-> `format`': {
        topic: function () {
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        '-> `format(strings, ..., false)`': {
          topic: function () {
            var response = XM.Address.format("Name", "Tremendous Toys Inc.", "101 Toys Place", "",
              "Walnut Hills", "VA", "22209", "United States", false);

            return response;
          },
          'XM.Address.format(strings, ..., false) returns ASCII new lines': function (response) {
            assert.include(response, '\n');
          }
        },
        '-> `format(strings, ..., true)`': {
          topic: function () {
            var response = XM.Address.format("Name", "Tremendous Toys Inc.", "101 Toys Place", "",
              "Walnut Hills", "VA", "22209", "United States", true);

            return response;
          },
          'XM.Address.format(strings, ..., true) returns HTML line breaks': function (response) {
            assert.include(response, '<br />');
          }
        },
        '-> `format(object, false)`': {
          // XM.Address.format(object, false) is tested below after
          // the model is created.
        },
        '-> `format(object, true)`': {
          // XM.Address.format(object, true) is tested below after
          // the model is created.
        }
      },
      '-> `formatShort`': {
        // XM.Address.formatShort is tested below after the model is created.
      }
    }
  }).addBatch({
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
    'CHECK METHODS ': {
      topic: function () {
        return model;
      },
      'Last Error is null': function (model) {
        assert.isNull(model.lastError);
      },
      '-> `format`': {
        topic: function () {
          return model;
        },
        'Address format returns a string': function (model) {
          assert.isString(model.format(false));
        },
        'Address format(false) returns ASCII new lines': function (model) {
          assert.include(model.format(false), '\n');
        },
        'Address format(true) returns HTML line breaks': function (model) {
          assert.include(model.format(true), '<br />');
        }
      },
      '-> `formatShort`': {
        topic: function () {
          return model;
        },
        'Address formatShort returns a string': function (model) {
          assert.isString(model.formatShort());
        }
      },
      '-> `useCount`': {
        topic: function () {
          var callback = this.callback,
            timeoutId,
            success = function (response) {
              clearTimeout(timeoutId);
              callback(null, response);
            };
          model.useCount({success: success});

          // If we don't hear back, keep going
          timeoutId = setTimeout(function () {
            callback(null, 0);
          }, XVOWS.wait);
        },
        'Address useCount is a Number': function (response) {
          assert.isNumber(response);
        },
        'Address created is used zero times': function (response) {
          assert.isTrue(response === 0);
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
        'Line1 is `123 Four St.`': function (model) {
          assert.equal(model.get('line1'), updateHash.line1);
        },
        'Status is `READY_DIRTY`': function (model) {
          assert.equal(model.getStatusString(), 'READY_DIRTY');
        },
        '-> Commit': XVOWS.save(model)
      }
    })
  }).addBatch({
    'DESTROY': XVOWS.destroy(model, {
      'FINISH XM.Address': function () {
        XVOWS.next();
      }
    })
  }).run();
}());
