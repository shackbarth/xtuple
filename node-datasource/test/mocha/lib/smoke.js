/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, require:true */

(function () {
  "use strict";

  var _ = require("underscore"),
    assert = require("chai").assert;

  /**
    Finds the list in the panels and opens up a new workspace from that list.
  */
  exports.navigateToNewWorkspace = function (app, listKind) {
    var navigator = app.$.postbooks.$.navigator,
      myModuleIndex,
      myPanelIndex,
      workspace;

    //
    // Drill down into the sales module
    //
    _.each(navigator.modules, function (module, moduleIndex) {
      _.each(module.panels, function (panel, panelIndex) {
        if (panel.kind === listKind) {
          myModuleIndex = moduleIndex;
          myPanelIndex = panelIndex;
        }
      });
    });
    assert.isDefined(myPanelIndex, "Cannot find " + listKind + " in any module panels");
    navigator.setModule(myModuleIndex);
    navigator.setContentPanel(myPanelIndex);

    //
    // Create a new record
    //
    navigator.newRecord();
    assert.isDefined(app.$.postbooks.$.workspaceContainer);
    workspace = app.$.postbooks.$.workspaceContainer.$.workspace;
    assert.isDefined(workspace);
    return workspace;
  };

  /**
    Applies the attributes to the model by bubbling up the values
    from the widgets in the workspace.
   */
  exports.setWorkspaceAttributes = function (workspace, createHash) {
    _.each(createHash, function (value, key) {
      var widgetFound = false;
      _.each(workspace.$, function (widget) {
        if (widget.attr === key) {
          widgetFound = true;
          widget.doValueChange({value: value});
        }
      });
      assert.isTrue(widgetFound, "Cannot find widget for attr " + key + " in workspace " + workspace.kind);
      assert.equal(workspace.value.get(key), value);
    });
  };

  /**
    Save the model through the workspace and make sure it saved ok.
   */
  exports.saveAndVerify = function (workspace, done) {
    var doneIfClean,
      validation = workspace.value.validate(workspace.value.attributes);
    assert.isUndefined(validation, "Failed validation with error: " + JSON.stringify(validation));

    doneIfClean = function (model, status) {
      if (status === XM.Model.READY_CLEAN) {
        workspace.value.off("statusChange", doneIfClean);
        done();
      }
    };
    workspace.value.on("statusChange", doneIfClean);
    workspace.save();
  };

}());
