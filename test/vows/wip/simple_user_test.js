/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true, XT:true */

(function () {
  "use strict";

  var vows = require('vows'),
    assert = require('assert');
  require('../main.js');

  vows.describe('Check user').addBatch({

    'when we create a user': {
      topic: function () {
        var that = this,
          schemaLoaded = false,
          privsLoaded = false,
          username = "user" + Math.random(),
          tryUser = function () {
            if (schemaLoaded && privsLoaded) {
              var m = new XM.User({id: username, password: '123'}, {isNew: true}),
                error = function (model, error) {
                  console.log("error! ", error);
                };

              m.save(null, {force: true, success: that.callback, error: error});
            }
          },
          schemaOpts = {
            success: function () {
              X.log('Schema Loaded');
              schemaLoaded = true;
              tryUser();
            }
          },
          privOpts = {
            success: function () {
              X.log('Privileges Loaded');
              privsLoaded = true;
              tryUser();
            }
          };

        XT.session = Object.create(XT.Session);
        XT.session.loadSessionObjects(XT.session.SCHEMA, schemaOpts);
        XT.session.loadSessionObjects(XT.session.PRIVILEGES, privOpts);
      },
      'the user is saved successfully': function (model, result) {
        assert.isNotNull(result);
        assert.equal('123', result.get('password'));
      }
    }
  }).export(module);

}());
