/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true, XT:true */

(function () {
  "use strict";

  var vows = require('vows'),
    assert = require('assert');
  require('../main.js');

  vows.describe('Check user').addBatch({
    'when we clear out all the users': {
      topic: function () {
        var that = this,
          schemaLoaded = false,
          privsLoaded = false,
          username = "user" + Math.random(),
          fetchUsers = function () {
            if (schemaLoaded && privsLoaded) {
              var userCollection = new XM.UserCollection(),
                fetchSuccess = function (coll, result) {
                  var i, model,
                    createUser = function () {
                      var m = new XM.User({id: username, password: '123'}, {isNew: true}),
                        createError = function (model, error) {
                          X.log("create error ", error);
                        };

                      m.save(null, {force: true, success: that.callback, error: createError});
                    },
                    totalModels = coll.models.length,
                    destroyedModels = 0,
                    destroySuccess = function (model, result) {
                      destroyedModels++;
                      if (destroyedModels === totalModels) {
                        createUser();
                      }
                    },
                    destroyError = function () {
                      X.log("destroy error");
                    };

                  if (totalModels === 0) {
                    createUser();
                    return;
                  }
                  for (i = 0; i < totalModels; i++) {
                    model = coll.models[i];
                    model.destroy({success: destroySuccess, error: destroyError});
                  }
                },
                fetchError = function (coll, error) {
                  X.log("error", coll);
                };
              userCollection.fetch({success: fetchSuccess, error: fetchError});
            }
          },
          schemaOpts = {
            success: function () {
              X.log('Schema Loaded');
              schemaLoaded = true;
              fetchUsers();
            }
          },
          privOpts = {
            success: function () {
              X.log('Privileges Loaded');
              privsLoaded = true;
              fetchUsers();
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
