/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global _:true, console:true, XM:true, XT:true, require:true, assert:true,
setTimeout:true, clearTimeout:true, exports:true, it:true */

var _ = require("underscore"),
  zombieAuth = require("./zombie_auth"),
  assert = require("chai").assert,
  async = require("async");

(function () {
  "use strict";

  exports.accountBeforeDeleteActions = [{it: 'saves the account id', action: function (data, done) {
    data.deleteData = {
      accntId: data.model.get("account").id || data.model.get("account"),
      accountModel: new XM.Account()
    };
    done();
  }}];

  exports.accountAfterDeleteActions = [{it: 'deletes the related account', action: function (data, done) {
    var account = data.deleteData.accountModel,
      fetchOptionsAccnt = {},
      destroyAccount;
    fetchOptionsAccnt.id = data.deleteData.accntId;
    destroyAccount = function () {
      if (account.getStatus() === XM.Model.READY_CLEAN) {
        var accountDestroyed = function () {
          if (account.getStatus() === XM.Model.DESTROYED_CLEAN) {
            account.off("statusChange", accountDestroyed);
            done();
          }
        };

        account.off("statusChange", destroyAccount);
        account.on("statusChange", accountDestroyed);
        account.destroy();
      }
    };
    account.on("statusChange", destroyAccount);
    account.fetch(fetchOptionsAccnt);
  }}];


  var waitTime = exports.waitTime = 10000;

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

      } else if (key === data.model.documentKey && data.model.enforceUpperKey === true) {
          // this is the document key, so it should have been made upper case
        assert.equal(data.model.get(key), value.toUpperCase());

      } else if (typeof (data.model.get(key)) === 'object' && typeof value === 'number') {
        // if the data is a model and the test hash looks like {contact: 7}
        assert.equal(data.model.get(key).id, value);

      } else if (_.isDate(data.model.get(key))) {
        // comparing dates requires a bit of finesse
        // TODO: get this to work with timezoneoffset
        // date comparison is disabled until we do
        //assert.equal(Globalize.format(new Date(data.model.get(key)), "d"), Globalize.format(new Date(value), "d"));

      } else {
        // default case, such as comparing strings to strings etc.
        assert.equal(data.model.get(key), value, "attribute is " + key);
      }
    });
  };

  /**
    For the models that have comments, we can test adding and saving
    a mock comment. Here we create and initialize the specified comment
    type for this model, set a commentType to pass validation, and
    set this in the current model.
   */
  var setComments = function (data, callback) {
    var comment = new XM[data.commentType.substring(3)](),
      comments = [];
    comment.on('change:' + comment.idAttribute, function () {
      // comment was initialized, set commentType
      comment.set("commentType", "General");
      // add mock comment to array
      comments.push(comment);
      data.model.on('change:comments', function () {
        // verify that comments were changed and exit
        callback();
      });
      data.model.set({comments: comments});
    });
    // initialize the new comment
    comment.initialize(null, {isNew: true});
  };

  /**
    Test that the comments collection is not empty.
  */
  var testComments = function (data) {
    var comments = data.model.get("comments");
    // verify that there is a comment
    assert.isTrue(comments.length > 0);
  };

  /**
    We allow the test to use a shorthand mock for these submodels, and
    flesh them out here. This is very very clever. If no mocks are
    specified, we just do a simple model.set.
   */
  var setModel = function (data, done) {
    var timeoutId,
      invalid = function (model, error) {
        assert.fail(0, 1, error.message() || JSON.stringify(error) || "Unspecified invalidity in " + data.recordType);
      },
      setAttribute = function (attribute, asyncCallback) {
        var value = attribute.value,
          key = attribute.key,
          fetchSuccess = function (model, response, options) {
            // swap in this model for the mock
            model.off('invalid', invalid);
            data.model.set(options.key, model);
            asyncCallback();
          };

        if (typeof value === 'object' && !_.isDate(value)) {
          // if it's an object we want to set on the model, flesh it out
          var fetchObject = {
              success: fetchSuccess,
              error: asyncCallback,
              key: key
            },
            relatedModelName = _.find(data.model.relations, function (relation) {
              return relation.key === key;
            }).relatedModel,
            Klass = XT.getObjectByName(relatedModelName),
            relatedModel = new Klass();

          fetchObject.id = value[relatedModel.idAttribute];
          relatedModel.once('invalid', invalid);
          relatedModel.fetch(fetchObject);
        } else {
          // otherwise it's easy to set the value on the model
          data.model.set(key, value);
          asyncCallback();
        }
      },
      // put the hash in a form that async is comfortable with
      hashAsArray = _.map(data.createHash, function (value, key) {
        return {key: key, value: value};
      });

    data.model.once('invalid', invalid);

    async.map(hashAsArray, setAttribute, function (err, results) {
      if (err) {
        assert.fail(err);
      } else {
        data.model.off('invalid', invalid);
        done();
      }
    });
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
    var timeoutId,
      model = data.model,
      auto_regex = XM.Document.AUTO_NUMBER + "|" + XM.Document.AUTO_OVERRIDE_NUMBER,
      assertAndCallback = function () {
        assert.equal(data.model.getStatusString(), 'READY_NEW');
        assert.isNotNull(data.model.id);
        callback();
      },
      modelCallback = function (model) {
        if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
          // Check that the AUTO...NUMBER property has been set.
          if (model.get(model.documentKey)) {
            clearTimeout(timeoutId);
            model.off('change:' + model.documentKey, modelCallback);
            assertAndCallback();
          }
        } else if (model instanceof XM.Document) {
          clearTimeout(timeoutId);
          model.off('statusChange', modelCallback);
          assertAndCallback();
        } else {
          clearTimeout(timeoutId);
          model.off('change:id', modelCallback);
          model.off('change:' + model.idAttribute, modelCallback);
          assertAndCallback();
        }
      };

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on create " + data.recordType, "");
      callback();
    }, waitTime);

    if (model instanceof XM.Document && model.numberPolicy.match(auto_regex)) {
      // Add an event handler when using a model with an AUTO...NUMBER.
      model.on('change:' + model.documentKey, modelCallback);
    } else if (model instanceof XM.Document) {
      // Add an event handler when using a model with an MANUAL policy.
      model.on('statusChange', modelCallback);
    } else {
      model.on('change:id', modelCallback);
      if (model.idAttribute !== 'id') {
        model.on('change:' + model.idAttribute, modelCallback);
      }
    }
    model.initialize(null, {isNew: true});
  };

  /**
    Saves the working model and automatically checks state
    is `READY_CLEAN` immediately afterward. Used by the Create and
    the Update parts of CRUD.

    @param {Object} data
    @param {Function} callback
  */
  var save = exports.save = function (data, callback) {
    var timeoutId,
      model = data.model,
      invalid = function (model, error) {
        console.log(JSON.stringify(model.toJSON()));
        assert.fail(JSON.stringify(error) || "Unspecified error", "");
        clearTimeout(timeoutId);
        model.off('statusChange', modelCallback);
        model.off('invalid', invalid);
        model.off('notify', notify);
        callback();
      },
      notify = function () {
        console.log("notify", JSON.stringify(arguments));
      },
      modelCallback = function () {
        var status = model.getStatus(),
          K = XM.Model,
          options = {};
        if (status === K.ERROR) {
          clearTimeout(timeoutId);
          model.off('statusChange', modelCallback);
          model.off('invalid', invalid);
          model.off('notify', notify);
          assert.fail("Error status reached on model save: " + model.recordType, "");
          callback();
        } else if (status === K.READY_CLEAN) {
          clearTimeout(timeoutId);
          model.off('statusChange', modelCallback);
          model.off('invalid', invalid);
          model.off('notify', notify);

          assert.equal(data.model.getStatusString(), 'READY_CLEAN');

          testAttributes(data);
          if (data.commentType && data.testComments) {
            testComments(data);
          }

          // Model should not be used at this point
          options.success = function (used) {
            assert.equal(used, 0, "Model is used but shouldn't be");
            callback();
          };
          model.used(options);
        }
      };

    assert.equal(JSON.stringify(model.validate(model.attributes)), undefined);

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on save " + data.recordType, "");
      clearTimeout(timeoutId);
      model.off('statusChange', modelCallback);
      model.off('invalid', invalid);
      model.off('notify', notify);
      callback();
    }, waitTime);

    model.on('statusChange', modelCallback);
    model.on('invalid', invalid);
    model.on('notify', notify);
    if (data.verbose) {
      model.on('all', function () {
        console.log("Model event", model.getStatusString(), arguments);
      });
    }
    console.log(data.updated ? "About to update" : "About to save", model.recordType, model.id);
    model.save(null, {});
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
    var timeoutId,
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

    // If we don't hear back, keep going
    timeoutId = setTimeout(function () {
      assert.fail("timeout was reached on delete " + data.recordType, "");
      callback();
    }, waitTime);

    model.on('statusChange', modelCallback);
    model.destroy();
  };

  /**
    String all CRUD tests together so that simple models can be
    tested with a single function
   */
  var runAllCrud = exports.runAllCrud = function (data) {
    //
    // Step 1: load the environment with Zombie
    //
    it('can be loaded with a zombie session', function (done) {
      this.timeout(60 * 1000);
      zombieAuth.loadApp({callback: done, verbose: data.verbose,
        loginDataPath: data.loginDataPath});
    });

    //
    // Step 2: create the model per the record type specified
    //
    it('can be created', function () {
      data.model = new XM[data.recordType.substring(3)]();
      assert.equal(data.model.recordType, data.recordType);
    });

    //
    // Step 3: initialize the model to get the ID from the database
    //
    it('can be initialized by fetching an id from the server', function (done) {
      this.timeout(60 * 1000);
      init(data, done);
    });

    //
    // Step 4: set the model with our createData hash
    //
    _.each(data.beforeSetActions || [], function (spec) {
      it(spec.it, function (done) {
        this.timeout(60 * 1000);
        spec.action(data, done);
      });
    });

    it('can have its values set', function (done) {
      this.timeout(60 * 1000);
      data.updated = false;
      setModel(data, done);
    });

    // if this model has comments, set them on the model
    if (data.commentType) {
      it('can have its comments set', function (done) {
        this.timeout(60 * 1000);
        setComments(data, done);
      });
    }

    _.each(data.beforeSaveActions || [], function (spec) {
      it(spec.it, function (done) {
        this.timeout(60 * 1000);
        spec.action(data, done);
      });
    });

    //
    // Step 5: save the data to the database
    //
    if (!data.skipSave) {
      it('can be saved to the database', function (done) {
        this.timeout(60 * 1000);
        save(data, done);
      });
      _.each(data.afterSaveActions || [], function (spec) {
        it(spec.it, function (done) {
          this.timeout(60 * 1000);
          spec.action(data, done);
        });
      });
    }

    if (!data.skipUpdate) {
      //
      // Step 6: set the model with updated data
      //
      it('can be updated', function () {
        update(data);
      });

      //
      // Step 7: save the updated model to the database
      //
      it('can be re-saved to the database', function (done) {
        this.timeout(60 * 1000);
        save(data, done);
      });
    }

    //
    // Step 8: delete the model from the database
    //
    _.each(data.beforeDeleteActions || [], function (spec) {
      it(spec.it, function (done) {
        this.timeout(60 * 1000);
        spec.action(data, done);
      });
    });

    if (!data.skipDelete) {
      it('can be deleted from the database', function (done) {
        this.timeout(60 * 1000);
        destroy(data, done);
      });
    }

    _.each(data.afterDeleteActions || [], function (spec) {
      it(spec.it, function (done) {
        this.timeout(60 * 1000);
        spec.action(data, done);
      });
    });
  };
}());
