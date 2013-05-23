/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../../mocha/lib/zombie_auth"),
    crud = require('../lib/crud');

  var data = {},
    deleteData = {};

  data.createHash = {
    number: "SHOWERBEER",
    name: "They are delicious"
  };

  data.updateHash = {
    name: "!!"
  };

  vows.describe('XM.Prospect CRUD test').addBatch({
    'We can INITIALIZE a Prospect Model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Prospect();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.Prospect': function (data) {
        assert.equal(data.model.recordType, "XM.Prospect");
      }
    }
  }).addBatch({
    'We can CREATE a Prospect Model': crud.create(data, {
      '-> Set values to the Prospect': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Prospect': crud.save(data)
      }
    })
  }).addBatch({
    'We can READ the Prospect Model': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      }
    }
  }).addBatch({
    'We can UPDATE a Prospect Model ': crud.update(data, {
      '-> Set values to the Prospect': {
        topic: function () {
          data.model.set(data.updateHash);
          deleteData.accntId = data.model.get("account");
          deleteData.accountModel = new XM.Account();
          return data;
        },
        '-> Commit the Prospect': crud.save(data)
      }
    })
  }).addBatch({
    'DESTROY': crud.destroy(data, {
      '-> Destroy the Prospect': {
        //Destroy the propect.  When that is successful, destroy the account
        'Prospect destroyed': function (data) {
          assert.equal(data.model.getStatusString(), 'DESTROYED_CLEAN');
        },
        '-> Destroy the Account': {
          topic: function () {
            var that = this,
              account = deleteData.accountModel,
              fetchOptionsAccnt = {},
              destroyAccount;

            fetchOptionsAccnt.id = deleteData.accntId;

            destroyAccount = function () {
              if (account.getStatus() === XM.Model.READY_CLEAN) {
                var accountDestroyed = function () {
                    if (account.getStatus() === XM.Model.DESTROYED_CLEAN) {
                      account.off("statusChange", accountDestroyed);
                      that.callback(null, account);
                    }
                  };

                account.off("statusChange", destroyAccount);
                account.on("statusChange", accountDestroyed);
                account.destroy();
              }
            };
            account.on("statusChange", destroyAccount);
            account.fetch(fetchOptionsAccnt);
          },
          'Account destroyed': function (account) {
            assert.equal(account.getStatusString(), 'DESTROYED_CLEAN');
          }
        }
      }
    })
  }).export(module);

}());
