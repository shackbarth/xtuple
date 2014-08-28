/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XV:true, XM:true, _:true, enyo:true, XT:true, Globalize:true, window:true */

(function () {
  var SAVE_APPLY = 1;
  var SAVE_CLOSE = 2;
  var SAVE_NEW = 3;

  /**
    @name XV.EditorMixin
    @class A mixin that contains functionality common to {@link XV.Workspace}
     and {@link XV.ListRelationsEditorBox}.
   */
 /**
    @name XV.EditorMixin
    @class A mixin that contains functionality common to {@link XV.Workspace}
     and {@link XV.ListRelationsEditorBox}.
   */
  XV.EditorMixin = {
    controlValueChanged: function (inSender, inEvent) {
      var attrs = {},
        attr = inEvent.originator.attr;

      if (this.value && attr) {
        // If the value is an object, then the object is already mapped
        if (attr instanceof Object) {
          attrs = inEvent.value;

        // Otherwise map a basic value to its attribute
        } else {
          attrs[attr] = inEvent.value;
        }
        this.value.setValue(attrs);
        return true;
      } else if (XT.session.config.debugging) {
        XT.log("Ignoring content-less model update event", this.value, attr);
      }
    },
    /**
      Updates all child controls on the editor where the name of
      the control matches the name of an attribute on the model.

      @param {XM.Model} model
      @param {Object} options
    */
    attributesChanged: function (model, options) {
      // If the model is meta, then move up to the workspace model
      if (!(model instanceof XM.Model)) { model = this.value; }

      options = options || {};
      var value,
        K = XM.Model,
        status = model.getStatus(),
        canView = true,
        canUpdate = (status === K.READY_NEW) ||
          ((status & K.READY) && model.canUpdate()),
        isReadOnly = false,
        isRequired,
        prop,
        modelPropName,
        attribute,
        obj,
        ctrls = this.$;

      // loop through each of the controls and set the value using the
      // attribute on the control
      _.each(ctrls, function (control) {
        if (control.attr) {
          if (!control.getAttr) {
            XT.log("Warning: " + control.kind + " is not a valid XV control");
          }
          attribute = control.getAttr();

          // for compound controls, the attribute is an object with key/value pairs.
          if (_.isObject(attribute)) {
            obj = _.clone(attribute);
            // replace the current values in the object (attribute names)
            // with the values from the model
            for (var attr in obj) {
              if (obj.hasOwnProperty(attr)) {
                prop = model.attributeDelegates && model.attributeDelegates[attr] ?
                  model.attributeDelegates[attr] : attr;
                // replace the current value of the property name with the value from the model
                modelPropName = obj[prop];
                obj[prop] = model.getValue(modelPropName);
              }
            }
            value = obj;

            // only worry about the one mapping to isEditableProperty
            if (control.isEditableProperty) {
              attribute = attribute[control.isEditableProperty];

            // If not isEditableProperty defined one is as good as another, just pick one
            } else {
              attribute = attribute[_.first(_.keys(attribute))];
            }
          }

          prop = model.attributeDelegates && model.attributeDelegates[attribute] ?
            model.attributeDelegates[attribute] : attribute;

          if (!obj) { value = model.getValue(prop); }

          canView = model.canView(prop);
          isReadOnly = model.isReadOnly(prop) || !model.canEdit(prop);
          isRequired = model.isRequired(prop);

          if (canView) {
            control.setShowing(true);
            if (control.setPlaceholder && isRequired && !control.getPlaceholder()) {
              control.setPlaceholder("_required".loc());
            }
            if (control.setValue && !(status & K.BUSY)) {
              control.setValue(value, {silent: true});
            }
            if (control.setDisabled) {
              control.setDisabled(!canUpdate || isReadOnly);
            }
          } else {
            control.setShowing(false);
          }
          isReadOnly = false;
          canView = true;
          obj = undefined;
        }
      }, this);
    },
    /**
     @todo Document the clear method.
     */
    clear: function () {
      var attrs = this.value ? this.value.getAttributeNames() : [],
        attr,
        control,
        i;
      for (i = 0; i < attrs.length; i++) {
        attr = attrs[i];
        control = this.findControl(attr);
        if (control && control.clear) {
          control.clear({silent: true});
        }
      }
    },
    /**
     Returns the control that contains the attribute string.
     */
    findControl: function (attr) {
      return _.find(this.$, function (ctl) {
        if (_.isObject(ctl.attr)) {
          return _.find(ctl.attr, function (str) {
            return str === attr;
          });
        }
        return ctl.attr === attr;
      });
    },
    /**
      Bubble up an event to ask a question to the user. The user interaction
      is handled by XV.ModuleContainer.
     */
    notify: function (model, message, options) {
      var inEvent = _.extend(options, {
        originator: this,
        model: model,
        message: message
      });
      this.doNotify(inEvent);
    }
  };

  /**
    Set model bindings on a workspace
    @private
    @param{Object} Workspace
    @param{String} Action: 'on' or 'off'
  */
  var _setBindings = function (ws, action) {
    var headerAttrs = ws.getHeaderAttrs() || [],
      observers = "",
      model = ws.value,
      attr,
      i;

    model[action]("change", ws.attributesChanged, ws);
    model[action]("lockChange", ws.lockChanged, ws);
    model[action]("readOnlyChange", ws.attributesChanged, ws);
    model[action]("statusChange", ws.statusChanged, ws);
    model[action]("invalid", ws.error, ws);
    model[action]("error", ws.error, ws);
    model[action]("notify", ws.notify, ws);
    if (headerAttrs.length) {
      for (i = 0; i < headerAttrs.length; i++) {
        attr = headerAttrs[i];
        if (attr.indexOf('.') !== -1 ||
            _.contains(model.getAttributeNames(), attr)) {
          observers = observers ? observers + " change:" + attr : "change:" + attr;
        }
      }
      model[action](observers, ws.headerValuesChanged, ws);
    }
    // If meta data exists, handle that too.
    if (model.meta) {
      model.meta[action]("change", ws.attributesChanged, ws);
    }
  };

  XV.WorkspacePanelsRefactor = {

    rendered: function () {
      if (!this.$.panels || !this.$.panels.hasClass('xv-workspace-panel')) {
        this.inherited(arguments);
        return;
      }

      _.each(this.$.panels.getClientControls(), function (control) {
        control.addClass('xv-workspace-panel');
      });
      this.$.panels.removeClass('xv-workspace-panel');
      this.inherited(arguments);
    }
  };

  /**
    @name XV.Workspace
    @class Contains a set of fittable rows which are laid out
    using a collapsing arranger and fitted to the size of the viewport.<br />
    Its components can be extended via {@link XV.ExtensionsMixin}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.FittableRows">enyo.FittableRows</a>.

    Supported properties on the action array are:
      * name
      * label: Menu label. Defaults to name if not present.
      * privilege: The privilege required by the user to enable the menu. Defaults enabled if not present.
      * prerequisite: A function on the model that returns a boolean dictating whether to show the menu item or not.
      * method: The function to call. Defaults to name if not present.
      * isViewMethod: Boolean value dictates whether method is called on the view or the view's model. Default false.

    @extends XV.WorkspacePanels
    @extends XV.EditorMixin
    @extends XV.ExtensionsMixin
    @see XV.WorkspaceContainer
  */
  enyo.kind(_.extend({ },
      XV.EditorMixin, XV.ExtensionsMixin,
      XV.WorkspacePanelsRefactor, {
    name: "XV.Workspace",
    kind: "XV.WorkspacePanels",
    classes: 'xv-workspace',
    published: {
      actions: null,
      actionButtons: null,
      title: "_none".loc(),
      headerAttrs: null,
      success: null,
      callback: null,
      modelAmnesty: false, // do we keep the model even if the workspace is destroyed?
      // typically no, but yes for child workspaces
      printOnSaveSetting: "", // some workspaces have a setting that cause them to be
      // automatically printed upon saving
      reportName: null,
      reportModel: null,
      recordId: null,
      saveText: "_save".loc(),
      backText: "_back".loc(),
      hideSaveAndNew: false,
      hideApply: false,
      hideRefresh: false,
      dirtyWarn: true,

      /**
       * The type of the backing model.
       */
      model: null,

      /**
       * The backing model for this component.
       * @see XM.EnyoView#model
       */
      value: null,

      /**
       * @see XM.View#workspace.template
       */
      template: null
    },
    extensions: null,
    events: {
      onClose: "",
      onError: "",
      onHeaderChange: "",
      onModelChange: "",
      onStatusChange: "",
      onTitleChange: "",
      onHistoryChange: "",
      onLockChange: "",
      onMenuChange: "",
      onNotify: "",
      onSaveTextChange: "",
      onTransactionList: "",
      onWorkspace: ""
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },

    components: [
      {kind: "XV.Groupbox", name: "mainPanel",
        components: [
        {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
        {kind: "XV.ScrollableGroupbox", name: "mainGroup",
          classes: "in-panel", fit: true, components: [
          {kind: "XV.InputWidget", attr: "name"},
          {kind: "XV.InputWidget", attr: "description"}
        ]}
      ]}
    ],

    create: function () {
      this.inherited(arguments);
      XM.View.setPresenter(this, 'workspace');
      this.processExtensions();
      this.titleChanged();
    },

    /**
     @todo Document the destroy method.
     */
    destroy: function () {
      var model = this.getValue(),
        modelAmnesty = this.getModelAmnesty(),
        wasNew = model.isNew();
      this.setRecordId(null);
      // If we never saved a new model, make the callback
      // so the caller can deal with that and destroy it.
      if (wasNew || modelAmnesty) {
        if (this.callback) { this.callback(false); }
      }
      this.inherited(arguments);
    },
    /**
     @todo Document the error method.
     */
    error: function (model, error) {
      var inEvent = {
        originator: this,
        model: model,
        error: error
      };
      this.doError(inEvent);
      this.attributesChanged(this.getValue());
    },
    /**
     @todo Document the fetch method.
     */
    fetch: function (options) {
      options = options || {};
      var wsSuccess = this.getSuccess(),
        success = options.success;

      if (wsSuccess) {
        wsSuccess = _.bind(wsSuccess, this);
      }

      options.success = function (model, resp, options) {
        if (wsSuccess) { wsSuccess(model, resp, options); }
        if (success) { success(model, resp, options); }
      };
      if (!this.value) { return; }
      this.value.fetch(options);
    },
    /**
      Implementation is up to subkinds
     */
    handleHotKey: function (keyValue) {},
    /**
     @todo Document the headerValuesChanged method.
     */
    headerValuesChanged: function () {
      var headerAttrs = this.getHeaderAttrs() || [],
        model = this.value,
        header = "",
        value,
        attr,
        i;
      if (headerAttrs.length && model) {
        for (i = 0; i < headerAttrs.length; i++) {
          attr = headerAttrs[i];
          if (attr.indexOf('.') !== -1 ||
              _.contains(model.getAttributeNames(), attr)) {
            value = model.getValue(headerAttrs[i]) || "";
            header = header ? header + " " + value : value;
          } else {
            header = header ? header + " " + attr : attr;
          }
        }
      }
      this.doHeaderChange({originator: this, header: header });
    },
    /**
     @todo Document the isDirty method.
     */
    isDirty: function () {
      return this.value ? this.value.isDirty() : false;
    },
    lockChanged: function () {
      this.doLockChange({hasKey: this.getValue().hasLockKey()});
    },
    /**
     @todo Document the newRecord method.
     */
    newRecord: function (attributes, options) {
      options = options || {};
      var model = this.getModel(),
        Klass = XT.getObjectByName(model),
        attr,
        changes = {},
        that = this,
        relOptions = {
          success: function () {
            that.attributesChanged(that.value);
          }
        },
        // Update record id directly when we get it, but don't trigger changes
        updateRecordId = function (model) {
          that.recordId = model.id;
          that.value.off("change:" + that.value.idAttribute, updateRecordId, that);
        };
      this.setRecordId(null);
      this.value = new Klass();
      _setBindings(this, "on");
      this.value.on("change:" + this.value.idAttribute, updateRecordId, this);
      this.clear();
      this.headerValuesChanged();
      this.value.initialize(null, {isNew: true});
      if (options.success) { options.success.call(this); }
      this.value.set(attributes, {force: true});
      for (attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
          this.value.setReadOnly(attr);
          if (this.value.getRelation(attr)) {
            this.value.fetchRelated(attr, relOptions);
          } else {
            changes[attr] = true;
            this.attributesChanged(this.value, {changes: changes});
          }
        }
      }
    },
    // TODO: in 1.8.0 make this the default, move the buttons into a gear
    // menu, and follow the same option convention as in the list
    download: function () {
      this.openReport(XT.getOrganizationPath() + this.getValue().getReportUrl("download"));
    },
    /**
      Email the model's data, either silently or by opening a tab
     */
    email: function () {
      if (XT.session.config.emailAvailable) {
        // send it to be printed silently by the server
        this.getValue().doEmail();
      } else {
        this.openReport(XT.getOrganizationPath() + this.getValue().getReportUrl());
      }
    },
    /**
      Print the model's data, either silently or by opening a tab
    */
    print: function () {
      if (XT.session.config.printAvailable) {
        // send it to be printed silently by the server
        this.getValue().doPrint();
      } else {
        this.openReport(XT.getOrganizationPath() + this.getValue().getReportUrl());
      }
    },
    /**
      Open the report pdf in a new tab
     */
    openReport: function (path) {
      window.open(path, "_newtab");
    },
    /**
     Handle clearing and reseting of model if the record id changes.
     */
    recordIdChanged: function () {
      var model = this.getModel(),
        Klass = model ? XT.getObjectByName(model) : null,
        recordId = this.getRecordId(),
        attrs = {};

      // Clean up
      if (this.value) {
        _setBindings(this, "off");
        this.value.releaseLock();
      }

      // the configuration workspaces, notably, need to be fetched despite
      // having an id of false. It works because the XM.Settings models use
      // a dispatch for fetch.
      if (recordId === undefined || recordId === null) {
        if (this.value.isNew() && !this.modelAmnesty) {
          this.value.destroy();
        }
        this.value = null;
        return;
      }

      // Create new instance and bindings
      if (recordId === false && this.singletonModel) {
        this.setValue(XT.getObjectByName(this.singletonModel));
      } else {
        attrs[Klass.prototype.idAttribute] = recordId;
        this.setValue(Klass.findOrCreate(attrs));
        XM.backboneRouter.navigate("workspace/" +
          this.value.recordType.substring(3).decamelize().replace(/_/g, "-") +
          "/" + recordId);
      }
      _setBindings(this, "on");
      this.fetch();
    },
    /**
      Refresh the model behind this workspace. Note that we
      have to release the lock first.

      If this is being called on a new model, it means we
      want to throw away the data in the model and start with
      a new record. We don't worry about the lock in this case.
     */
    requery: function () {
      if (this.getValue().isNew()) {
        this.newRecord();
        return;
      }

      // model has already been saved
      var that = this,
        options = {
          success: function () {
            that.fetch();
          },
          error: function () {
            XT.log("Error releasing lock.");
            // fetch anyway. Why not!?
            that.fetch();
          }
        };

      // first we want to release the lock we have on this record
      // TODO #refactor move this into model layer
      this.value.releaseLock(options);
    },
    /**
     @todo Document the save method.
     */
    save: function (options) {
      options = options || {};
      var that = this,
        success = options.success,
        inEvent = {
          originator: this,
          model: this.getModel(),
          id: this.value.id,
          done: options.modelChangeDone
        };
      options.success = function (model, resp, options) {
        that.doModelChange(inEvent);
        that.parent.parent.modelSaved();
        if (that.callback) { that.callback(model); }
        if (success) { success(model, resp, options); }
      };
      this.value.save(null, options);
    },
    /**
      Set save text when it is changed
    */
    saveTextChanged: function () {
      var inEvent = {
        content: this.getSaveText()
      };
      this.doSaveTextChange(inEvent);
    },
    /**
     @todo Document the statusChanged method.
     */
    statusChanged: function (model, status, options) {
      options = options || {};
      var inEvent = {model: model, status: status},
        attrs = model.getAttributeNames(),
        changes = {},
        i,
        dbName;

      // Add to history if appropriate.
      if (model.id && model.keepInHistory) {
        XT.addToHistory(this.kind, model, function (historyArray) {
          dbName = XT.session.details.organization;
          enyo.setCookie("history_" + dbName, JSON.stringify(historyArray));
        });
        this.doHistoryChange(this);
      }

      // Update attributes
      for (i = 0; i < attrs.length; i++) {
        changes[attrs[i]] = true;
      }
      options.changes = changes;

      // Update header if applicable
      if (model.isReady()) {
        this.headerValuesChanged();
        this.attributesChanged(model, options);
      }

      this.doStatusChange(inEvent);
    },
    /**
     This function sets the title widget in the workspace Toolbar to the title
      specified in the Workspace specification. If one is not specified, then "_none" is used.
     */
    titleChanged: function () {
      var inEvent = { title: this.getTitle(), originator: this };
      this.doTitleChange(inEvent);
    }
  }));

  /**
    @name XV.WorkspaceContainer
    @class Contains the navigation and content panels which wrap around a workspace.<br />
    See also {@link XV.Workspace}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Panels">enyo.Panels</a>.
    @extends enyo.Panels
    @extends XV.ListMenuManagerMixin
   */
  enyo.kind(/** @lends XV.WorkspaceContainer# */_.extend({
    name: "XV.WorkspaceContainer",
    kind: "XV.ContainerPanels",
    classes: "xv-workspace-container",
    published: {
      menuItems: [],
      allowNew: true
    },
    events: {
      onPrevious: "",
      onNotify: ""
    },
    handlers: {
      onClose: "closed",
      onError: "errorNotify",
      onHeaderChange: "headerChanged",
      onHotKey: "handleHotKey",
      onListItemMenuTap: "showListItemMenu",
      onLockChange: "lockChanged",
      onMenuChange: "menuChanged",
      onNotify: "notify",
      onPrint: "print",
      onReport: "report",
      onStatusChange: "statusChanged",
      onTitleChange: "titleChanged",
      onSaveTextChange: "saveTextChanged",
      onExportAttr:     "exportAttr"
    },
    components: [
      {kind: "FittableRows", name: "navigationPanel", classes: "xv-menu-container", components: [
        {kind: "onyx.Toolbar", name: "menuToolbar", components: [
          {kind: "font.TextIcon", name: "backButton",
            content: "_back".loc(), ontap: "close", icon: "chevron-left"},
          {kind: "onyx.MenuDecorator", onSelect: "actionSelected", components: [
            {kind: "font.TextIcon", icon: "cog",
              content: "_actions".loc(), name: "actionButton"},
            {kind: "onyx.Menu", name: "actionMenu", floating: true}
          ]}
        ]},
        {name: "loginInfo", classes: "xv-header"},
        {name: "menu", kind: "List", fit: true, touch: true, classes: 'xv-navigator-menu',
           onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box xv-list-item", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", name: "contentPanel", classes: 'xv-content-panel', components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber", classes: "spacer", unmoveable: true,},
          {name: "title", classes: "xv-toolbar-label", unmoveable: true,},
          {name: "space", classes: "spacer", fit: true},
          {kind: "font.TextIcon", name: "lockImage", showing: false,
            content: "Locked", ontap: "lockTapped", icon: "lock", classes: "lock"},
          {kind: "font.TextIcon", name: "backPanelButton", unmoveable: true,
            content: "_back".loc(), ontap: "close", icon: "chevron-left"},
          {kind: "font.TextIcon", name: "refreshButton",
            content: "_refresh".loc(), onclick: "requery", icon: "rotate-right"},
          {kind: "font.TextIcon", name: "saveAndNewButton", disabled: false,
            content: "_new".loc(), ontap: "saveAndNew", icon: "plus"},
          {kind: "font.TextIcon", name: "applyButton", disabled: true,
            content: "_apply".loc(), ontap: "apply", icon: "ok"},
          {kind: "font.TextIcon", name: "saveButton",
            disabled: true, icon: "save", classes: "save",
            content: "_save".loc(), ontap: "saveAndClose"}
        ]},
        {name: "header", content: "_loading".loc(), classes: "xv-header"},
        {kind: "onyx.Popup", name: "spinnerPopup", centered: true,
          modal: true, floating: true, scrim: true,
          onHide: "popupHidden", components: [
          {kind: "onyx.Spinner"},
          {name: "spinnerMessage", content: "_loading".loc() + "..."}
        ]},
        {kind: "onyx.Popup", name: "lockPopup", centered: true,
          modal: true, floating: true, components: [
          {name: "lockMessage", content: ""},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "lockOk",
            classes: "onyx-blue xv-popup-button"}
        ]},
        {name: "listItemMenu", kind: "onyx.Menu", floating: true, onSelect: "listActionSelected",
          maxHeight: 500, components: []
        }
      ]}
    ],
    actionSelected: function (inSender, inEvent) {
      // Could have come from an action, or a an action button
      var selected = inEvent.selected || inEvent.originator;

      // If it's a view method then call function on the workspace.
      if (selected.isViewMethod || selected.container.isViewMethod) {
        this.$.workspace[selected.method || selected.container.method](inEvent);

      // Otherwise call it on the workspace's model.
      } else {
        this.$.workspace.getValue()[selected.method]();
      }
    },
    allowNewChanged: function () {
      var allowNew = this.getAllowNew();
      this.$.saveAndNewButton.setShowing(allowNew);
    },
    /**
     @todo Document the apply method.
     */
    apply: function () {
      this._saveState = SAVE_APPLY;
      this.save();
    },
    askAboutUnsaved: function (shouldClose) {
      var that = this,
        message = "_unsavedChanges".loc() + " " + "_saveYourWork?".loc(),
        callback = function (response) {
          var answer = response.answer;

          if (answer === true && shouldClose) {
            that.saveAndClose({force: true});
          } else if (answer === true) {
            that.save();
          } else if (answer === false && shouldClose) {
            that.close({force: true});
          } else if (answer === false) {
            that.$.workspace.requery();
          } // else answer === undefined means cancel, so do nothing
        };
      this.doNotify({
        type: XM.Model.YES_NO_CANCEL,
        message: message,
        yesLabel: "_save".loc(),
        noLabel: "_discard".loc(),
        callback: callback
      });
    },
    buildMenus: function () {
      var actionMenu = this.$.actionMenu,
        workspace = this.$.workspace,
        actions = workspace.getActions(),
        actionButtons = workspace.getActionButtons(),
        model = workspace.getValue(),
        that = this,
        count = 0;

      // Handle menu actions
      if (actions) {

        // Reset the menu
        actionMenu.destroyClientControls();

        // Add whatever actions are applicable to the current context.
        _.each(actions, function (action) {
          var name = action.name,
            prerequisite = action.prerequisite,
            privilege = action.privilege,
            isDisabled = privilege ? !XT.session.privileges.get(privilege) : false;

          // Only create menu item if prerequisites are met.
          if (!prerequisite || model[prerequisite]()) {
            actionMenu.createComponent({
              name: name,
              kind: XV.MenuItem,
              content: action.label || ("_" + name).loc(),
              method: action.method || action.action || name,
              disabled: isDisabled,
              isViewMethod: action.isViewMethod
            });
            count++;
          }

        });

        if (actions.length && !count) {
          actionMenu.createComponent({
            name: "noActions",
            kind: XV.MenuItem,
            content: "_noEligibleActions".loc(),
            disabled: true
          });
        }

        actionMenu.render();
      }
      this.$.actionButton.setShowing(actions && actions.length);

      // Handle button actions
      if (actionButtons) {
        _.each(actionButtons, function (action) {
          var privs =  XT.session.privileges,
            noPriv = action.privilege ? !privs.get(action.privilege): false,
            noCanDo = action.prerequisite ? !model[action.prerequisite]() : false;

          that.$[action.name].setDisabled(noPriv || noCanDo);
        });
      }
    },
    create: function () {
      this.inherited(arguments);
      this.setLoginInfo();
    },
    closed: function (inSender, inEvent) {
      this.close(inEvent);
    },
    /**
     Backs out of the workspace. This can be done using the back button, or
     during the end of the save-and-close process.
     */
    close: function (options) {
      var that = this,
        workspace = this.$.workspace,
        model = this.$.workspace.getValue();

      options = options || {};
      if (!options.force) {
        if (workspace.getDirtyWarn() && workspace.isDirty()) {
          this.askAboutUnsaved(true);
          return;
        }
      }

      if (workspace.value.getStatus() === XM.Model.READY_DIRTY &&
         !workspace.getModelAmnesty()) {
        // Revert because this model may be referenced elsewhere
        _setBindings(this.$.workspace, "off");
        model.revert();
      }

      XM.backboneRouter.navigate("");
      if (model && model.hasLockKey && model.hasLockKey()) {
        model.releaseLock({
          success: function () {
            that.doPrevious();
          },
          error: function () {
            XT.log("Error releasing lock");
            that.doPrevious();
          }
        });
      } else {
        that.doPrevious();
      }
    },
    /**
     @todo Document the destroyWorkspace method.
     */
    destroyWorkspace: function () {
      var workspace = this.$.workspace;
      if (workspace) {
        this.removeComponent(workspace);
        workspace.destroy();
      }
    },
    /**
      Legacy case for notify() function
     */
    errorNotify: function (inSender, inEvent) {
      var message = inEvent.error.message ? inEvent.error.message() : "Error";
      inEvent.message = message;
      inEvent.type = XM.Model.CRITICAL;
      this.doNotify(inEvent);
    },
    setLoginInfo: function () {
      var details = XT.session.details;
      this.$.loginInfo.setContent(details.username + " · " + details.organization);
    },
    handleHotKey: function (inSender, inEvent) {
      var keyCode = inEvent.keyCode;

      switch (String.fromCharCode(keyCode)) {
      case 'A':
        this.apply();
        return;
      case 'B':
        this.close();
        return;
      case 'R':
        this.requery();
        return;
      case 'S':
        this.saveAndClose();
        return;
      }

      // else see if the workspace has a specific implementation
      this.$.workspace.handleHotKey(keyCode);
    },
    /**
     @todo Document the headerChanged method.
     */
    headerChanged: function (inSender, inEvent) {
      this.$.header.setContent(inEvent.header);
      return true;
    },
    /**
     @todo Document the itemTap method.
     */
    itemTap: function (inSender, inEvent) {
      var workspace = this.$.workspace,
        panel = this.getMenuItems()[inEvent.index],
        prop,
        i,
        panels;
      // Find the panel in the workspace and set it to current
      // XXX let's find a better way to keep track of this
      for (prop in workspace.$) {
        if (workspace.$.hasOwnProperty(prop) &&
            workspace.$[prop] instanceof enyo.Panels) {
          panels = workspace.$[prop].getPanels();
          for (i = 0; i < panels.length; i++) {
            if (panels[i] === panel) {
              workspace.$[prop].setIndex(i);
              break;
            }
          }
        }
      }

      // Mobile device view
      if (enyo.Panels.isScreenNarrow()) {
        this.next();
      }
    },
    lockChanged: function (inSender, inEvent) {
      this.$.lockImage.setShowing(!inEvent.hasKey);
    },
    lockOk: function () {
      this.$.lockPopup.hide();
    },
    /**
      If the user clicks on the lock icon, we tell them who got the lock and when
     */
    lockTapped: function () {
      var lock = this.$.workspace.getValue().lock,
        effective = Globalize.format(new Date(lock.effective), "t");
      this.$.lockMessage.setContent("_lockInfo".loc()
                                               .replace("{user}", lock.username)
                                               .replace("{effective}", effective));
      this.$.lockPopup.render();
      this.$.lockPopup.show();
    },
    /**
     Once a model has been saved we take our next action depending on
     which of the save-and-X actions were actually requested. This
     is part of the callback of the save operation.
     */
    modelSaved: function () {
      if (this._saveState === SAVE_CLOSE) {
        this.close();
      } else if (this._saveState === SAVE_NEW) {
        this.newRecord();
      }
    },
    /**
     @todo Document the newRecord method.
     */
    newRecord: function () {
      this.$.workspace.newRecord();
    },
    /**
      Although the main processing of the notify request happens
      in XV.ModuleContainer, we do want to make sure that the spinner
      goes away if it's present.
     */
    notify: function () {
      this.spinnerHide();
    },
    /**
     @todo Document the popupHidden method.
     */
    popupHidden: function (inSender, inEvent) {
      if (!this._popupDone) {
        inEvent.originator.show();
      }
    },
    /**
     Refreshes the workspace.
     */
    requery: function (options) {
      options = options || {};
      if (!options.force) {
        if (this.$.workspace.isDirty()) {
          this.askAboutUnsaved(false);
          return;
        }
      }
      this.$.workspace.requery();
    },
    /**
      All the other save functions flow through here.
     */
    save: function (options) {
      var workspace = this.$.workspace,
        print = workspace.printOnSaveSetting &&
          XT.session.config.printAvailable &&
          XT.session.settings.get(workspace.printOnSaveSetting);
      if (!this._saveState) { this._saveState = SAVE_APPLY; }
      workspace.save(options);

      // some workspaces are set up with a setting to have them automatically
      // print when they're saved.
      if (print) {
        this.$.workspace.print();
      }
    },
    /**
      Save the model and close out the workspace.
     */
    saveAndClose: function () {
      this._saveState = SAVE_CLOSE;
      this.save({requery: false});
    },
    /**
      Handles the save-and-new button click. Note that this button displays "new"
      if the model is clean, and we want it exhibit that conditional behavior.
     */
    saveAndNew: function () {
      if (this.$.workspace.getValue().isDirty()) {
        this._saveState = SAVE_NEW;
        this.save({requery: false});
      } else {
        this.newRecord();
      }
    },

    saveTextChanged: function (inSender, inEvent) {
      this.$.saveButton.setContent(inEvent.content);
    },

    exportAttr: function (inSender, inEvent) {
      this.openExportTab('export', inEvent.attr);
      return true;
    },

    // export just one attribute of the model displayed by the workspace
    openExportTab: function (routeName, attr) {
      var recordType = this.$.workspace.value.recordType,
          id         = this.$.workspace.value.id,
          idAttr     = this.$.workspace.value.idAttribute,
          query = { parameters: [{ attribute: idAttr, value: id }],
                    details: { attr: attr, id: id }
      };
      // sending the locale information back over the wire saves a call to the db
      window.open(XT.getOrganizationPath() +
        '/%@?details={"nameSpace":"%@","type":"%@","query":%@,"culture":%@,"print":%@}'
        .f(routeName,
          recordType.prefix(),
          recordType.suffix(),
          JSON.stringify(query),
          JSON.stringify(XT.locale.culture),
          "false"),
        '_newtab');
    },
    /**
     This is called for each row in the menu List.
     The menu text is derived from the corresponding panel index.
     If the panel is not visible, then the menu item is also not visible.
     */
    // menu
    setupItem: function (inSender, inEvent) {
      var box = this.getMenuItems()[inEvent.index],
        defaultTitle = "_overview".loc(),
        title = box.getTitle ? box.getTitle() ||
         defaultTitle : box.title ? box.title || defaultTitle : defaultTitle,
        visible = box.showing;
      this.$.item.setContent(title);
      this.$.item.box = box;
      this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
      this.$.item.setShowing(visible);

      return true;
    },

    /**
      Loads a workspace into the workspace container.
      Accepts the following options:
        * workspace: class name (required)
        * id: record id to load. If none, a new record will be created.
        * allowNew: boolean indicating whether Save and New button is shown.
        * attributes: default attribute values for a new record.
        * success: function to call from the workspace when the workspace
          has either succefully fetched or created a model.
        * callback: function to call on either a successful save, or the user
          leaves the workspace without saving a new record. Passes the new or
          updated model as an argument.
    */
    setWorkspace: function (options) {
      var that = this,
        menuItems = [],
        prop,
        headerAttrs,
        workspace = options.workspace,
        id = options.id,
        callback = options.callback,
        // if the options do not specify allowNew, default it to true
        allowNew,
        attributes = options.attributes;

      if (workspace) {
        this.destroyWorkspace();
        workspace = {
          name: "workspace",
          container: this.$.contentPanel,
          kind: workspace,
          fit: true,
          callback: callback
        };

        workspace = this.createComponent(workspace);

        // Handle save and new button
        allowNew = _.isBoolean(options.allowNew) ?
          options.allowNew : !workspace.getHideSaveAndNew();
        this.setAllowNew(allowNew);

        headerAttrs = workspace.getHeaderAttrs() || [];

        // Set the button texts
        this.$.saveButton.setContent(workspace.getSaveText());
        this.$.backButton.setContent(workspace.getBackText());
        this.$.backPanelButton.setContent(workspace.getBackText());
        this.$.backPanelButton.setShowing(enyo.Panels.isScreenNarrow());

        // Hide buttons if applicable
        this.$.applyButton.setShowing(!workspace.getHideApply());
        this.$.refreshButton.setShowing(!workspace.getHideRefresh());

        // Add any extra action buttons to the toolbar
        _.each(this.$.workspace.actionButtons, function (action) {
          var actionIcon = {kind: "font.TextIcon",
            name: action.name,
            content: action.label || ("_" + action.name).loc(),
            icon: action.icon,
            method: action.method || action.name,
            isViewMethod: action.isViewMethod,
            ontap: "actionSelected"};
          this.$.contentToolbar.createComponent(
            actionIcon, {owner: this});
        }, this);
        this.$.contentToolbar.resized();

        this.render();
        if (id || id === false) {
          workspace.setSuccess(options.success);
          workspace.setRecordId(id);
        } else {
          workspace.newRecord(attributes, options);
        }
      }

      // Build menu by finding all panels
      this.$.menu.setCount(0);
      for (prop in workspace.$) {
        if (workspace.$.hasOwnProperty(prop) &&
            workspace.$[prop] instanceof enyo.Panels) {
          menuItems = menuItems.concat(workspace.$[prop].getPanels());
        }
      }
      this.setMenuItems(menuItems);
      this.$.menu.setCount(menuItems.length);
      this.$.menu.render();

      // Mobile device view
      if (enyo.Panels.isScreenNarrow()) {
        this.next();
      }
    },
    /**
     Hides the spinner popup
     */
    spinnerHide: function () {
      this._popupDone = true;
      this.$.spinnerPopup.hide();
    },
    /**
     Show the modal spinner popup when the model
     is busy.
     */
    spinnerShow: function (message) {
      message = message || "_loading".loc() + "...";
      this._popupDone = false;
      this.$.spinnerMessage.setContent(message);
      this.$.spinnerPopup.show();
    },
    /**
      This function is called by the statusChange handler and
      controls button and spinner functions based on the changed
      status of the backing model of the workspace.
     */
    statusChanged: function (inSender, inEvent) {
      var model = inEvent.model,
        K = XM.Model,
        status = inEvent.status,
        canCreate = model.getClass().canCreate(),
        canUpdate = model.canUpdate() || status === K.READY_NEW,
        isEditable = canUpdate && !model.isReadOnly(),
        canNotSave = !model.isDirty() || !isEditable,
        message;

      // Status dictates whether buttons are actionable
      this.$.saveAndNewButton.setShowing(canCreate && this.getAllowNew());
      this.$.saveAndNewButton.setContent("_new".loc());

      // XXX we really only have to do this if there's a *change* to the button content
      this.$.contentToolbar.render();

      this.$.applyButton.setDisabled(canNotSave);
      this.$.saveAndNewButton.setDisabled(!isEditable);
      this.$.saveButton.setDisabled(canNotSave);

      // Toggle spinner popup
      if (status & K.BUSY) {
        if (status === K.BUSY_COMMITTING) {
          message = "_saving".loc() + "...";
        }
        this.spinnerShow(message);
      } else {
        this.spinnerHide();
      }

      this.buildMenus();
    },
    /**
     @todo Document titleChanged method.
     */
    titleChanged: function (inSender, inEvent) {
      var title = inEvent.title || "";
      this.$.title.setContent(title);
      return true;
    },

    /**
    This function forces the menu to render and call
    its setup function for the List.
     */
    menuChanged: function () {
      this.$.menu.render();
    }
  }, XV.ListMenuManagerMixin));

}());
