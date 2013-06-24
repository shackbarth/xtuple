/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, clearTimeout: true, exports: true */

var _ = require("underscore"),
  zombieAuth = require("./zombie_auth"),
  assert = require("chai").assert;

(function () {
  "use strict";

  var waitTime = exports.waitTime = 5000;

  var testAttributes = function (data) {
    if (!data.autoTestAttributes) {
      return;
    }
    var hashToTest = data.updated ? _.extend(JSON.parse(JSON.stringify(data.createHash)), data.updateHash) : data.createHash;
    _.each(hashToTest, function (value, key) {
      // depending on how we represent sub-objects, we want to verify them in different ways
      if (typeof (data.model.get(key)) === 'object' && typeof value === 'object') {
        // if the data is a model and the test hash looks like {account: {number: "1000"}}
        assert.equal(data.model.get(key).id, value[data.model.get(key).idAttribute]);
      } else if (key === data.model.documentKey &&
          data.model.enforceUpperKey === true) {
          // this is the document key, so it should have been made upper case
        assert.equal(data.model.get(key), value.toUpperCase());
      } else if (typeof (data.model.get(key)) === 'object' && typeof value === 'number') {
        // if the data is a model and the test hash looks like {contact: 7}
        assert.equal(data.model.get(key).id, value);
      } else {
        // default case, such as comparing strings to strings etc.
        assert.equal(data.model.get(key), value);
      }
    });
  };

  /**
    We allow the test to use a shorthand mock for these submodels, and
    flesh them out here. This is very very clever. If no mocks are
    specified, we just do a simple model.set.
   */
  var setModel = function (data, callback) {
    var objectsToFetch = 0,
      objectsFetched = 0,
      fetchSuccess = function (model, response, options) {
        // swap in this model for the mock
        data.model.set(options.key, model);
        objectsFetched++;
        if (objectsFetched === objectsToFetch) {
          callback();
        }
      },
      fetchError = function () {
        // proceed anyway.
        if (data.verbose) {
          console.log("Fetch error", arguments);
        }
        objectsFetched++;
        if (objectsFetched === objectsToFetch) {
          callback();
        }
      };
    _.each(data.createHash, function (value, key) {
      if (typeof value === 'object') {
        // if it's an object we want to set on the model, flesh it out
        var fetchObject = {
            success: fetchSuccess,
            error: fetchError,
            key: key
          },
          relatedModel,
          relatedModelName = _.find(data.model.relations, function (relation) {
            return relation.key === key;
          }).relatedModel;

        relatedModel = new XM[relatedModelName.substring(3)]();
        fetchObject.id = value[relatedModel.idAttribute];
        relatedModel.fetch(fetchObject);
        objectsToFetch++;
      } else {
        // otherwise it's easy to set the value on the model
        data.model.set(key, value);
      }
    });

    // if there are no models to substitute we won't be doing this whole fetching
    // rigamorole.
    if (objectsToFetch === 0) {
      data.model.set(data.createHash);
      callback();
    }
  };

  /**
    Initializes a working model and automatically checks state
    is `READY_NEW` and a valid `id` immediately afterward.

    Note: This function assumes the `id` is fetched automatically.
    For models with manually created ids such as 'XM.UserAccount',
    do this part manually.

    @param {Object} data
    @param {Function} callback
  */
  var init = exports.init = function (data, callback) {
    var that = this,
      timeoutId,
      model = data.model,
      auto_regex = XM.Document.AUTO_NUMBER + "|" + XM.Document.AUTO_OVERRIDE_NUMBER,
      assertAndCallback = function () {
        assert.equal(data.model.getStatusString(), 'READY_NEW');
        assert.isNotNull(data.model.id);
        callback();
      },
      modelCallback = function (model, value) {
        if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
          // Check that the AUTO...NUMBER property has been set.
          if (model.get(model.documentKey)) {
            clearTimeout(timeoutId);
            model.off('change:' + model.documentKey, modelCallback);
            assertAndCallback();
          }
        } else {
          clearTimeout(timeoutId);
          model.off('change:id', modelCallback);
          assertAndCallback();
        }
      };

    // Add an event handler when using a model with an AUTO...NUMBER.
    if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
      model.on('change:' + model.documentKey, modelCallback);
    }
    model.initialize(null, {isNew: true});

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on create " + data.recordType, "");
      callback();
    }, waitTime);

    callback(model);
  };

  /**
    Saves the working model and automatically checks state
    is `READY_CLEAN` immediately afterward. Used by the Create and
    the Update parts of CRUD.

    @param {Object} data
    @param {Function} callback
  */
  var save = exports.save = function (data, callback) {
    var that = this,
      timeoutId,
      model = data.model,
      modelCallback = function () {
        var status = model.getStatus(),
          K = XM.Model;
        if (status === K.READY_CLEAN) {
          clearTimeout(timeoutId);
          model.off('statusChange', modelCallback);

          assert.equal(data.model.getStatusString(), 'READY_CLEAN');
          testAttributes(data);

          callback();
        }
      };

    //assert.equal(JSON.stringify(model.validate(model.attributes)), undefined);
    model.on('statusChange', modelCallback);
    model.save(null, {
      error: function (model, error, options) {
        clearTimeout(timeoutId);
        assert.fail(JSON.stringify(error) || "Unspecified error", "");
        callback();
      }
    });

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on save " + data.recordType, "");
      callback();
    }, waitTime);
  };


  /**
    Set the model with the updated data and verify that they're updated.

    @param {Object} data
  */
  var update = exports.update = function (data) {
    data.model.set(data.updateHash);
    data.updated = true;
    testAttributes(data);
  };

  /**
    Destroys the working model and automatically checks state
    is `DESTROYED_CLEAN` immediately afterward.

    @param {Object} data
    @param {Object} callback
  */
  var destroy = exports.destroy = function (data, callback) {
    var that = this,
      timeoutId,
      model = data.model,
      modelCallback = function () {
        var status = model.getStatus(),
          K = XM.Model;
        if (status === K.DESTROYED_CLEAN) {
          clearTimeout(timeoutId);
          model.off('statusChange', modelCallback);
          assert.equal(data.model.getStatusString(), 'DESTROYED_CLEAN');
          callback();
        } else if (status === K.ERROR) {
          assert.fail(data.model.lastError || "Unspecified error on delete", "");
          callback();
        }
      };

    model.on('statusChange', modelCallback);
    model.destroy();

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on delete " + data.recordType, "");
      callback();
    }, waitTime);
  };

  /**
    String all CRUD tests together so that simple models can be
    tested with a single function
   */
  var runAllCrud = exports.runAllCrud = function (data, done) {

    // very clever: we allow testmakers to define their own custom
    // callbacks in their data object. If data.setCallback is set,
    // then what we do is, instead of:
    // 1. Run the set operation
    // 2: Run the default set callback (which moves on to the next step)
    //
    // it will do this instead:
    // 1. Run the set operation
    // 2. Run the user's custom set callback
    // 3: Run the default set callback (which moves on to the next step)

    var tempSetCallback, tempCreateCallback, tempInitCallback;

    var runCrud = function () {
      var initCallback = function () {
        var setCallback = function () {
          var saveCallback = function () {
            var secondSaveCallback = function () {

              // Step 8: delete the model from the database
              if (data.verbose) { console.log("destroy model", data.recordType); }
              destroy(data, done);
            };

            // Step 6: set the model with updated data
            if (data.verbose) { console.log("update model", data.recordType); }
            update(data);

            // Step 7: save the updated model to the database
            if (data.verbose) { console.log("save updated model", data.recordType); }
            save(data, secondSaveCallback);
          };

          // Step 5: save the data to the database
          if (data.verbose) { console.log("save model", data.recordType); }
          save(data, saveCallback);
        };

        // Step 4: set the model with our createData hash
        if (data.setCallback) {
          tempSetCallback = setCallback;
          setCallback = function () {
            data.setCallback(data, tempSetCallback);
          };
        }
        if (data.verbose) { console.log("set model", data.recordType); }
        data.updated = false;
        setModel(data, setCallback);
      };

      // Step 2: create the model per the record type specified
      if (data.verbose) { console.log("create model", data.recordType); }
      data.model = new XM[data.recordType.substring(3)]();
      assert.equal(data.model.recordType, data.recordType);

      // Step 3: initialize the model to get the ID from the database
      if (data.initCallback) {
        tempInitCallback = initCallback;
        initCallback = function () {
          data.initCallback(data, tempInitCallback);
        };
      }
      if (data.verbose) { console.log("init model", data.recordType); }
      init(data, initCallback);
    };

    // Step 1: load the environment with Zombie
    zombieAuth.loadApp({callback: runCrud, verbose: data.verbose});
  };

}());
