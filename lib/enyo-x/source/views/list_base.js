/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, window: true*/

(function () {

  /**
    @name XV.ListBase
    @class
    XV.ListBase contains functionality shared between lists that has to do with
    formatting and action menu handling.

    @extends enyo.List
    @extends XV.FormattingMixin
  */
  enyo.kind(_.extend(
    /** @lends XV.ListBase */{
    name: "XV.ListBase",
    kind: "List",
    published: {
      actions: null,
      headerComponents: null
    },
    events: {
      onNotify: "",
      onSelectionChanged: "",
      onSearch: "",
      onTransactionList: "",
      onWorkspace: ""
    },
    handlers: {
      onActionSelected: "actionSelected",
      onListItemMenuTap: "transformListAction",
      onModelChange: "modelChanged",
      onChange: "selectionChanged",
      onSetupItem: "setupItem",
    },
    /**
      A list item has been selected. Delegate to the method cited
      in the action, and pass it an object with the relevant attributes.
    */
    actionSelected: function (inSender, inEvent) {
      var action = inEvent.action;

      this[action.method || action.name](inEvent);
    },
    create: function () {
      this.inherited(arguments);
      this._actionPermissions = [];
      this._haveAllAnswers = [];
      this._selectedIndexes = [];
    },
    /**
      Helper function for creating a callback to refresh a row after
      some custom action is completed.

      @param {Object} inEvent
      @returns Function
    */
    doneHelper: function (inEvent) {
      var model = this.getModel(inEvent.index),
        that = this,

        afterDone = function (resp) {
          // Delete the record if we should
          if (inEvent.deleteItem && resp) {
            that.deleteItem(inEvent);
          } else {
            that.refreshModel(model.id, inEvent.callback);
          }
        };

      inEvent.id = model.id;
      return afterDone;
    },
    getModel: function (index) {
      return this.value.at(index);
    },
    /**
      Returns whether all actions on the list have been determined
      to be available or not.

      @param {Number} index
      @returns {Boolean}
    */
    haveAllAnswers: function () {
      if (this._haveAllAnswers) { return true; }
      var that = this,
        permissions = that._actionPermissions,
        ret;
      if (_.isEmpty(permissions)) { return false; }
      ret = _.reduce(this.getActions(), function (memo, action) {
        return memo && _.isBoolean(permissions[action.name]);
      }, true);
      if (ret) { this._haveAllAnswers = true; }
      return ret;
    },
    /**
      When a model changes, we are notified. We check the list to see if the
      model is of the same recordType. If so, we check to see if the newly
      changed model should still be on the list, and refresh appropriately.
     */
    modelChanged: function (inSender, inEvent) {
      var that = this,
        value = this.getValue(),
        workspace = this.getWorkspace(),
        Klass = XT.getObjectByName(this.getCollection());

      // If the model that changed was related to and exists on this list
      // refresh the item. Remove the item if appropriate
      workspace = workspace ? XT.getObjectByName(workspace) : null;
      if (workspace && inEvent && workspace.prototype.model === inEvent.model &&
          value && typeof Klass === "function") {

        this.refreshModel(inEvent.id, inEvent.done);
      }
    },
    refreshModel: function (id, afterDone) {
      // Create your own code here appropriate to the context.
    },
    /**
      Reset actions permission checks will be regenerated.

      @param {Number} Index
    */
    resetActions: function () {
      this._actionPermissions = {};
      this._haveAllAnswers = undefined;
    },
    /**
      Helper fuction that returns an array of indexes based on
      the current selection.

      @returns {Array}
    */
    selectedIndexes: function () {
      return _.keys(this.getSelection().selected);
    },
    /**
     * Re-evaluates actions menu.
     */
    selectionChanged: function (inSender, inEvent) {
      var keys = this.selectedIndexes(),
        index = inEvent.index,
        actions = this.actions,
        that = this;

      this.resetActions();

      // Loop through each action
      _.each(actions, function (action) {
        var prerequisite = action.prerequisite,
          permissions = that._actionPermissions,
          name = action.name,
          len = keys.length,
          counter = 0,
          model,
          idx,
          callback,
          i;

        // Callback to let us know if we can do an action. If we have
        // all the answers, enable the action icon.
        callback = function (response) {

          // If some other model failed, forget about it
          if (permissions[name] === false) { return; }

          // If even one selected model fails, then we can't do the action
          if (response) {
            counter++;

            // If we haven't heard back from all requests yet, wait for the next
            if (counter < len) {
              return;
            }
          }
          permissions[name] = response;

          // Handle asynchronous result re-rendering
          if (that.haveAllAnswers()) {
            that.waterfallDown("onListMenuReady");
            that.renderRow(index);
          }
        };

        if (prerequisite) {
          // Loop through each selection model and check pre-requisite
          for (i = 0; i < keys.length; i++) {
            idx = keys[i] - 0;
            model = that.getModel(idx);
            if (model instanceof XM.Info && !model[prerequisite]) {
              XT.getObjectByName(model.editableModel)[prerequisite](model, callback);
            } else {
              model[prerequisite](callback);
            }
          }
        } else {
          callback(true);
        }

      });
    },
    setupItem: function (inSender, inEvent) {
      this.$.listItem.setSelected(inEvent.selected && this.toggleSelected);
      if (this.$.listItem.decorated) {
        this.$.listItem.setValue(this.getModel(inEvent.index));
        return true;
      }
    },
    transformListAction: function (inSender, inEvent) {
      var index = inEvent.index,
        model = this.getModel(index);

      if (!this.haveAllAnswers()) {
        return true;
      }

      inEvent.model = model;
      inEvent.list = this;
      inEvent.actions = this.actions;
      inEvent.actionPermissions = this._actionPermissions;
    }
  }, XV.FormattingMixin));

}());
