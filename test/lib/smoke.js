(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert;

  var navigateToList = exports.navigateToList = function (app, listKind) {
    var navigator = app.$.postbooks.$.navigator,
      myModuleIndex,
      myPanelIndex;

    //
    // Drill down into the appropriate module
    //
    _.each(navigator.modules, function (module, moduleIndex) {
      _.each(module.panels, function (panel, panelIndex) {
        if (listKind && panel.kind === listKind) {
          myModuleIndex = moduleIndex;
          myPanelIndex = panelIndex;
        }
      });
    });
    assert.isDefined(myPanelIndex, "Cannot find " + listKind + " in any module panels");
    navigator.setModule(myModuleIndex);
    navigator.setContentPanel(myPanelIndex);
    return navigator;
  };

  /**
    Finds the list in the panels and opens up a new workspace from that list.
  */
  var navigateToNewWorkspace = exports.navigateToNewWorkspace = function (app, listKind, done) {
    var navigator, workspaceContainer, model, autoRegex, eventName, idChanged;

    navigator = navigateToList(app, listKind);
    //
    // Create a new record
    //
    navigator.newRecord({}, {originator: {}});
    workspaceContainer = app.$.postbooks.getActive();
    assert.isDefined(workspaceContainer);
    assert.equal(workspaceContainer.kind, "XV.WorkspaceContainer");
    model = workspaceContainer.$.workspace.value;

    autoRegex = XM.Document.AUTO_NUMBER + "|" + XM.Document.AUTO_OVERRIDE_NUMBER;
    if (model instanceof XM.Document && model.numberPolicy.match(autoRegex)) {
      // wait for the model to fetch its id if appropriate
      if (model.id) {
        // the id is already defined? No need to wait for it from the server, then.
        done(workspaceContainer);
        return;
      }
      eventName = "change:" + model.idAttribute;
      idChanged = function () {
        if (model.id) {
          model.off(eventName, idChanged);
          done(workspaceContainer);
        }
      };
      model.on(eventName, idChanged);
    } else {
      done(workspaceContainer);
    }
  };

  var navigateToExistingWorkspace = exports.navigateToExistingWorkspace = function (app, listKind, done) {
    var workspaceContainer,
      workspace,
      navigator = navigateToList(app, listKind),
      list = navigator.$.contentPanels.getActive(),
      collection = list.value,

      /**
       * Open workspace backed by the given model.
       * @param model
       */
      navigate = function (model, status, options) {
        /**
         * This lets us begin listening for events from workspace.value before
         * that value exists.
         * @listens lock:obtain
         */
        XM.Tuplespace.once('lock:obtain', function (_model, lock) {
          // console.log('\na ' + _model.recordType + ' obtained lock!');

          workspaceContainer = app.$.postbooks.getActive();
          assert.isDefined(workspaceContainer);

          workspace = workspaceContainer.$.workspace;
          assert.isDefined(workspace);
          assert.isDefined(workspace.value);

          if (_model.id !== workspace.value.id) {
            return;
          }

          done(workspaceContainer);
        });

        /**
         * Create workspace.
         * @fires onWorkspace
         */
        navigator.doWorkspace({
          workspace: list.getWorkspace(),
          id: model.id
        });
      };

    /**
     * Navigate to workspace of first model in the list.
     */
    if (collection.getStatus() === XM.Model.READY_CLEAN) {
      navigate(collection.at(0));
    } else {
      collection.once('status:READY_CLEAN', navigate);
    }
  };

  /**
    Applies the attributes to the model by bubbling up the values
    from the widgets in the workspace.
   */
  var setWorkspaceAttributes = exports.setWorkspaceAttributes = function (workspace, createHash) {
    _.each(createHash, function (value, key) {
      var widgetFound = false,
        attribute;

      _.each(workspace.$, function (widget) {
        if (widget.attr === key) {
          widgetFound = true;
          widget.doValueChange({value: value});
        }
      });
      assert.isTrue(widgetFound, "Cannot find widget for attr " + key + " in workspace " + workspace.kind);
      attribute = workspace.value.get(key);
      if (attribute.idAttribute && !value.idAttribute) {
        // the attribute has been turned into a model
        assert.equal(attribute.id, value[attribute.idAttribute]);

      } else if (key === workspace.value.idAttribute && workspace.value.enforceUpperKey) {
        // the model uppercases the key
        assert.equal(workspace.value.get(key), value.toUpperCase());

      } else {
        assert.equal(workspace.value.get(key), value);
      }
    });
  };

  /**
    Save the model through the workspace and make sure it saved ok.
   */
  var saveWorkspace = exports.saveWorkspace = function (workspace, done, skipValidation) {
    var invalid = function (model, err) {
      workspace.value.off('invalid', invalid);
      done(err);
    };

    assert.isTrue(workspace.value.hasLockKey(), "Cannot acquire lock key");

    if (!skipValidation) {
      var validation = workspace.value.validate(workspace.value.attributes);
      assert.isUndefined(validation, "Failed validation with error: " + JSON.stringify(validation));
    }

    workspace.value.on('invalid', invalid);
    //workspace.value.on('all', function (event, model, err) {
    //  console.log("save event", event, model && model.id);
    //});
    workspace.save({
      // wait until the list has been refreshed with this model before we return control
      modelChangeDone: function () {
        var lockChange = function () {
          workspace.value.off("lockChange", lockChange);
          done(null, workspace.value);
        };
        workspace.value.on("lockChange", lockChange);
        workspace.value.releaseLock();
      },
      error: function (err) {
        assert.fail(JSON.stringify(err));
      }
    });
  };

  var deleteFromList = exports.deleteFromList = function (app, model, done) {
    var statusChange;

    // back up to list
    app.$.postbooks.previous();
    if (app.$.postbooks.getActive().kind === "XV.WorkspaceContainer") {
      console.log("Ok, we want to be in the navigator by now");
      console.log("Model status is", model.getStatusString());
      console.log("Notify popup showing?", XT.app.$.postbooks.$.notifyPopup.showing);
      console.log("Notify popup message", XT.app.$.postbooks.$.notifyMessage.getContent());
    }
    assert.equal(app.$.postbooks.getActive().kind, "XV.Navigator");

    // here's the list
    var list = app.$.postbooks.getActive().$.contentPanels.getActive(),
      // find the new model by id
      // TODO: what if the new model is off the page and cannot be found?
      listModel = _.find(list.value.models, function (m) {
        return m.get(m.idAttribute) === model.id;
      });

    statusChange = function (model, status) {
      if (status === XM.Model.DESTROYED_DIRTY) {
        model.off("statusChange", statusChange);
        assert.equal(XT.app.$.postbooks.getActive().kind, "XV.Navigator");
        // XXX we have to wait for the list to know the model is gone,
        // or else the next test might pick it up in BUSY_FETCHING status
        setTimeout(function () {
          done();
        }, 3000);
      }
    };
    model.on("statusChange", statusChange);

    // delete it, by calling the function that gets called when the user ok's the delete popup
    list.deleteItem({model: listModel});
  };

  exports.updateFirstModel = function (test) {
    it('should allow a trivial update to the first model of ' + test.kind, function (done) {
      this.timeout(60 * 1000);
      navigateToExistingWorkspace(XT.app, test.kind, function (workspaceContainer) {
        var updateObj,
          statusChanged,
          workspace = workspaceContainer.$.workspace;

        assert.equal(workspace.value.recordType, test.model);
        if (typeof test.update === 'string') {
          updateObj = {};
          updateObj[test.update] = "Test" + Math.random();
        } else if (typeof test.update === 'object') {
          updateObj = test.update;
        }
        statusChanged = function () {
          if (workspace.value.getStatus() === XM.Model.READY_CLEAN) {
            workspace.value.off("statusChange", statusChanged);
            setWorkspaceAttributes(workspace, updateObj);
            saveWorkspace(workspace, function () {
              XT.app.$.postbooks.previous();
              assert.equal(XT.app.$.postbooks.getActive().kind, "XV.Navigator");
              done();
            });
          }
        };
        workspace.value.on("statusChange", statusChanged);
      });
    });
  };

  exports.runUICrud = function (spec) {
    var workspaceContainer,
      workspace;
    it('can get to a new workspace', function (done) {
      this.timeout(60 * 1000);
      navigateToNewWorkspace(XT.app, spec.listKind, function (_workspaceContainer) {
        workspaceContainer = _workspaceContainer;
        done();
      });
    });
    it('can set the workspace attributes', function () {
      workspace = workspaceContainer.$.workspace;
      assert.equal(workspace.value.recordType, spec.recordType);
      setWorkspaceAttributes(workspace, spec.createHash);
    });
    _.each(spec.beforeSaveUIActions || [], function (spec) {
      it(spec.it, function (done) {
        this.timeout(60 * 1000);
        spec.action(workspace, done);
      });
    });
    it('can save the workspace', function (done) {
      this.timeout(60 * 1000);
      if (spec.captureObject) {
        XG = XG || {};
        XG.capturedId = workspace.value.id;
      }
      saveWorkspace(workspace, done);
    });
    _.each(spec.afterSaveUIActions || [], function (spec) {
      it(spec.it, function (done) {
        this.timeout(60 * 1000);
        spec.action(workspace, done);
      });
    });
    if (spec.captureObject) {
      return;
    }
    it('can delete the item from the list', function (done) {
      this.timeout(60 * 1000);
      deleteFromList(XT.app, workspace.value, done);
    });
  };
}());
