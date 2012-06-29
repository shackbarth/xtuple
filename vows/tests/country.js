// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, setTimeout:true, clearTimeout:true, vows:true, assert:true, console:true */

(function () {
  "use strict";
  
  require('../main.js');
  
  vows.describe('Country CRUD').addBatch({
    'CREATE a record': {
      topic: function () {
        var that = this,
          timeoutId,
          model = new XM.Country(),
          callback = function (model, value) {
            console.log('id:', value);
            clearTimeout(timeoutId);
            model.off('change:guid', callback);
            that.callback(null, model);
          };
        model.on('change:guid', callback);
        model.initialize(null, {isNew: true});

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          that.callback(null, model);
        }, 5000); // five seconds
      },
      'Status is READY_NEW': function (model) {
        assert.equal(model.getStatusString(), 'READY_NEW');
      },
      'id is valid': function (model) {
        assert.isNumber(model.id);
      },
      'Set values': {
        topic: function (model) {
          model.set({
            name: 'Elbonia',
            abbreviation: 'EL',
            currencyAbbreviation: 'PIC',
            currencyName: 'Pico',
            currencySymbol: '!'
          });
          return model;
        },
        'Last Error is `Empty`': function (model) {
          assert.isEmpty(model.lastError);
        },
        'Save and READ the record': {
          topic: function (model) {
            var that = this,
              timeoutId,
              callback = function (model) {
                var status = model.getStatus(),
                  K = XT.Model;
                if (status === K.READY_CLEAN) {
                  clearTimeout(timeoutId);
                  model.off('statusChange', callback);
                  return that.callback(null, model);
                }
              };
            model.on('statusChange', callback);
            model.save();
            
            // If we don't hear back, keep going
            timeoutId = setTimeout(function () {
              that.callback(null, model);
            }, 5000); // five seconds
          },
          'Status is READY_CLEAN': function (model) {
            assert.equal(model.getStatusString(), 'READY_CLEAN');
          },
          'Name is `Elbonia`': function (model) {
            assert.equal(model.get('name'), 'Elbonia');
          },
          'Abbreviation is `EL`': function (model) {
            assert.equal(model.get('abbreviation'), 'EL');
          },
          'Currency Name is `Pico`': function (model) {
            assert.equal(model.get('currencyName'), 'Pico');
          },
          'Currency Abbreviation is `!`': function (model) {
            assert.equal(model.get('currencyAbbreviation'), '!');
          },
          'UPDATE the record': {
            topic: function (model) {
              model.set('abbreviation', 'EB');
              return model;
            },
            'Last Error is Empty': function (model) {
              assert.isEmpty(model.lastError);
            },
            'Abbreviation is EB': function (model) {
              assert.equal(model.get('abbreviation'), 'EB');
            },
            'Status is READY_DIRTY': function (model) {
              assert.equal(model.getStatusString(), 'READY_DIRTY');
            },
            'Commit the Update': {
              topic: function (model) {
                var that = this,
                  timeoutId,
                  callback = function (model) {
                    var status = model.getStatus(),
                      K = XT.Model;
                    if (status === K.READY_CLEAN) {
                      clearTimeout(timeoutId);
                      model.off('statusChange', callback);
                      return that.callback(null, model);
                    }
                  };
                model.on('statusChange', callback);
                model.save();

                // If we don't hear back, keep going
                timeoutId = setTimeout(function () {
                  that.callback(null, model);
                }, 5000); // five seconds
              },
              'Abbreviation is EB': function (model) {
                assert.equal(model.get('abbreviation'), 'EB');
              },
              'Status is READY_CLEAN': function (model) {
                assert.equal(model.getStatusString(), 'READY_CLEAN');
              },
              'DESTROY the record': {
                topic: function (model) {
                  var that = this,
                    timeoutId,
                    callback = function (model) {
                      var status = model.getStatus(),
                        K = XT.Model;
                      if (status === K.DESTROYED_CLEAN) {
                        clearTimeout(timeoutId);
                        model.off('statusChange', callback);
                        return that.callback(null, model);
                      }
                    };
                  model.on('statusChange', callback);
                  model.destroy();

                  // If we don't hear back, keep going
                  timeoutId = setTimeout(function () {
                    that.callback(null, model);
                  }, 5000); // five seconds
                },
                'Status is DESTORYED_CLEAN': function (model) {
                  assert.equal(model.getStatusString(), 'DESTROYED_CLEAN');
                }
              }
            }
          }
        }
      }
    }
  }).run();
}());