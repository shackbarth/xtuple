/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var XVOWS = XVOWS || {};
(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    zombieAuth = require("../lib/zombie_auth"),
    crud = require('../lib/crud');

  var data = {},
    extra = {};

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
        extra.accountId = data.model.get('account');
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
          extra.accountId = data.model.get('account');
          return data;
        },
        '-> Commit the Prospect': crud.save(data)
      }
    })
  }).addBatch({
    'We can DESTROY a Prospect Model': crud.destroy(data, {
      '-> Destroy the Prospect account': {
        //Destroy the prospect.  When that is successful, destroy the account
        'When the prospect is destroyed': function (data) {
          assert.isTrue(data.model.getStatus() === XM.Model.DESTROYED_CLEAN);
        },
        topic: function () {
          var that = this,
            fetchOptions = {};
            
          extra.accountModel = new XM.Account();
            
          fetchOptions.id = extra.accountId;
          
          fetchOptions.success = function () {
            var destroyOptions = {};
            destroyOptions.success = function () {
              that.callback(null, data);
            };
            destroyOptions.error = function () {
              that.callback("Error destroying the newly created account.");
            };
            extra.accountModel.destroy(destroyOptions);
          };
          fetchOptions.error = function () {
            that.callback("Error fetching the newly created account.");
          };
          extra.accountModel.fetch(fetchOptions);
        },
        'We will account destroyed': function (data) {
          assert.isTrue(extra.accountModel.getStatus() === XM.Model.DESTROYED_CLEAN);
        }
      }
    })
  }).export(module);
  
}());
