/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
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
  XV.EditorMixin = {
    controlValueChanged: function (inSender, inEvent) {
      var attrs = {},
        attr = inEvent.originator.attr;

      if (this.value) {
        // If the value is an object, then the object is already mapped
        if (attr instanceof Object) {
          attrs = inEvent.value;

        // Otherwise map a basic value to its attribute
        } else {
          attrs[attr] = inEvent.value;
        }

        this.value.set(attrs);
      }
    },
    /**
      Updates all child controls on the editor where the name of
      the control matches the name of an attribute on the model.

      @param {XM.Model} model
      @param {Object} options
    */
    attributesChanged: function (model, options) {
      options = options || {};
      var value,
        K = XM.Model,
        status = model.getStatus(),
        changes = {}, // = options.changes
        canView = true,
        canUpdate = (status === K.READY_NEW) ||
          ((status & K.READY) && model.canUpdate()),
        isReadOnly = false,
        isRequired,
        prop,
        modelPropName,
        attribute,
        effective,
        obj,
        attrs = this.value ? this.value.getAttributeNames() : [],
        ctrls = this.$;

      // loop through each of the controls and set the value using the
      // attribute on the control
      _.each(ctrls, function (control) {
        if (control.attr) {
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
      attr,
      i;
    ws.value[action]("change", ws.attributesChanged, ws);
    ws.value[action]("lockChange", ws.lockChanged, ws);
    ws.value[action]("readOnlyChange", ws.attributesChanged, ws);
    ws.value[action]("statusChange", ws.statusChanged, ws);
    ws.value[action]("invalid", ws.error, ws);
    ws.value[action]("error", ws.error, ws);
    ws.value[action]("notify", ws.notify, ws);
    if (headerAttrs.length) {
      for (i = 0; i < headerAttrs.length; i++) {
        attr = headerAttrs[i];
        if (_.contains(ws.value.getAttributeNames(), attr)) {
          observers = observers ? observers + " change:" + attr : "change:" + attr;
        }
      }
      ws.value[action](observers, ws.headerValuesChanged, ws);
    }
  };

  /**
    @name XV.Workspace
    @class Contains a set of fittable rows which are laid out
    using the carousel arranger and fitted to the size of the viewport.<br />
    Its components can be extended via {@link XV.ExtensionsMixin}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.FittableRows">enyo.FittableRows</a>.
    @extends enyo.FittableRows
    @extends XV.EditorMixin
    @extends XV.ExtensionsMixin
    @see XV.WorkspaceContainer
   */
  var workspaceHash = enyo.mixin(XV.EditorMixin, /** @lends XV.Workspace# */{
    name: "XV.Workspace",
    kind: "FittableRows",
    published: {
      title: "_none".loc(),
      headerAttrs: null,
      model: "",
      callback: null,
      allowPrint: false,
      modelAmnesty: false, // do we keep the model even if the workspace is destroyed?
      // typically no, but yes for child workspaces
      printOnSaveSetting: "", // some workspaces have a setting that cause them to be
      // automatically printed upon saving
      biAvailable: false,
      value: null,
      recordId: null
    },
    extensions: null,
    events: {
      onError: "",
      onHeaderChange: "",
      onModelChange: "",
      onStatusChange: "",
      onTitleChange: "",
      onHistoryChange: "",
      onLockChange: "",
      onMenuChange: "",
      onNotify: ""
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    components: [
      {kind: "Panels", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", name: "mainPanel", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.ScrollableGroupbox", name: "mainGroup",
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "name"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
      ]}
    ],
    /**
     @todo Document the create method.
     */
    create: function () {
      this.inherited(arguments);
      this.processExtensions();
      this.titleChanged();
      this.setBiAvailable(XT.reporting);
    },
    /**
     @todo Document the destroy method.
     */
    destroy: function () {
      var model = this.getValue(),
        wasNew = model.isNew();
      this.setRecordId(null);
      // If we never saved a new model, make the callback
      // so the caller can deal with that and destroy it.
      if (wasNew) {
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
      if (!this.value) { return; }
      this.value.fetch(options);
    },
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
          if (_.contains(model.getAttributeNames(), attr)) {
            value = model.get(headerAttrs[i]) || "";
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
      _setBindings(this, 'on');
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
    /**
     Handle clearing and reseting of model if the record id changes.
     */
    recordIdChanged: function () {
      var model = this.getModel(),
        Klass = model ? XT.getObjectByName(model) : null,
        recordId = this.getRecordId(),
        attrs = {};

      // Clean up
      if (this.value) { _setBindings(this, 'off'); }

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
      attrs[Klass.prototype.idAttribute] = recordId;
      this.value = Klass.findOrCreate(attrs);
      _setBindings(this, 'on');
      this.value.fetch();
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
      if (model.id) {
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
  });

  workspaceHash = enyo.mixin(workspaceHash, XV.ExtensionsMixin);
  enyo.kind(workspaceHash);

  /**
    @name XV.WorkspaceContainer
    @class Contains the navigation and content panels which wrap around a workspace.<br />
    See also {@link XV.Workspace}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Panels">enyo.Panels</a>.
    @extends enyo.Panels
   */
  enyo.kind(/** @lends XV.WorkspaceContainer# */{
    name: "XV.WorkspaceContainer",
    kind: "Panels",
    arrangerKind: "CollapsingArranger",
    classes: "app enyo-unselectable",
    published: {
      menuItems: [],
      allowNew: true
    },
    events: {
      onPrevious: "",
      onNotify: ""
    },
    handlers: {
      onError: "errorNotify",
      onHeaderChange: "headerChanged",
      onLockChange: "lockChanged",
      onStatusChange: "statusChanged",
      onTitleChange: "titleChanged",
      onMenuChange: "menuChanged",
      onNotify: "notify"
    },
    components: [
      {kind: "FittableRows", name: "navigationPanel", classes: "left", components: [
        {kind: "onyx.Toolbar", name: "menuToolbar", components: [
          {kind: "onyx.Button", name: "backButton",
            content: "_back".loc(), onclick: "close"}
        ]},
        {name: "loginInfo", content: "", classes: "xv-navigator-header"},
        {name: "menu", kind: "List", fit: true, touch: true,
           onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", name: "contentPanel", components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "title", style: "width: 200px"},
					// The MoreToolbar is a FittableColumnsLayout, so this spacer takes up all available space
          {name: "space", fit: true},
          {kind: "Image", showing: false, name: "lockImage", ontap: "lockTapped",
            src: "/assets/menu-icon-lock.png"},
          {kind: "onyx.Button", name: "printButton", showing: false,
            content: "_print".loc(), onclick: "print"},
          {kind: "onyx.Button", name: "refreshButton", disabled: false,
            content: "_refresh".loc(), onclick: "requery"},
          {kind: "onyx.Button", name: "applyButton", disabled: true,
            content: "_apply".loc(), onclick: "apply"},
          {kind: "onyx.Button", name: "saveAndNewButton",
            content: "_new".loc(), onclick: "saveAndNew"},
          {kind: "onyx.Button", name: "saveButton",
            disabled: true, classes: "save",
            content: "_save".loc(), onclick: "saveAndClose"}
        ]},
        {name: "header", content: "_loading".loc(), classes: "xv-workspace-header"},
        {kind: "onyx.Popup", name: "spinnerPopup", centered: true,
          modal: true, floating: true, scrim: true,
          onHide: "popupHidden", components: [
          {kind: "onyx.Spinner"},
          {name: "spinnerMessage", content: "_loading".loc() + "..."}
        ]},
        // TODO: we could run this through our XV.ModuleContainer notify process
        {kind: "onyx.Popup", name: "unsavedPopup", centered: true,
          modal: true, floating: true, scrim: true,
          onHide: "popupHidden", components: [
          {content: "_unsavedChanges".loc() },
          {content: "_saveYourWork?".loc() },
          {tag: "br"},
          {kind: "onyx.Button", content: "_discard".loc(), ontap: "unsavedDiscard",
            classes: "xv-popup-button"},
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "unsavedCancel",
            classes: "xv-popup-button"},
          {kind: "onyx.Button", content: "_save".loc(), ontap: "unsavedSave",
            classes: "onyx-blue xv-popup-button"}
        ]},
        {kind: "onyx.Popup", name: "lockPopup", centered: true,
          modal: true, floating: true, components: [
          {name: "lockMessage", content: ""},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "lockOk",
            classes: "onyx-blue xv-popup-button"}
        ]}
      ]}
    ],
    allowNewChanged: function (allowNew) {
      if (allowNew) {
        this.$.saveAndNewButton.show();
      } else {
        this.$.saveAndNewButton.hide();
      }
    },
    create: function () {
      this.inherited(arguments);
      this.setLoginInfo();
    },
    /**
     @todo Document the apply method.
     */
    apply: function () {
      this._saveState = SAVE_APPLY;
      this.save();
    },
    /**
     Backs out of the workspace. This can be done using the back button, or
     during the end of the save-and-close process.
     */
    close: function (options) {
      var that = this,
        model = this.$.workspace.getValue();

      options = options || {};
      if (!options.force) {
        if (this.$.workspace.isDirty()) {
          this.$.unsavedPopup.close = true;
          this._popupDone = false;
          this.$.unsavedPopup.show();
          return;
        }
      }

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
      var message = inEvent.error.message ? inEvent.error.message() : "Messageless error";
      inEvent.message = message;
      inEvent.type = XM.Model.CRITICAL;
      this.doNotify(inEvent);
    },
    setLoginInfo: function () {
      var details = XT.session.details;
      this.$.loginInfo.setContent(details.username + " · " + details.organization);
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
    lockTapped: function (inSender, inEvent) {
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
    notify: function (inSender, inEvent) {
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
     Calls the report route to print the model's data
     */
    print: function (inSender, inEvent) {
      var model = this.$.workspace.getValue();

      // sending the locale information back over the wire saves a call to the db
      window.open(XT.getOrganizationPath() +
        '/report?details={"nameSpace":"%@","type":"%@","id":"%@","locale":%@}'
        .f(model.recordType.prefix(), model.recordType.suffix(),
        model.id, JSON.stringify(XT.session.locale.toJSON())), '_newtab');
    },
    /**
     Refreshes the workspace.
     */
    requery: function (options) {
      options = options || {};
      if (!options.force) {
        if (this.$.workspace.isDirty()) {
          this.$.unsavedPopup.close = false;
          this.$.unsavedPopup.show();
          return;
        }
      }
      this.$.workspace.requery();
    },
    /**
      All the other save functions flow through here.
     */
    save: function (options) {
      if (!this._saveState) { this._saveState = SAVE_APPLY; }
      this.$.workspace.save(options);

      // some workspaces are set up with a setting to have them automatically
      // print when they're saved.
      if (this.$.workspace.printOnSaveSetting && this.$.workspace.getBiAvailable() &&
          XT.session.settings.get(this.$.workspace.printOnSaveSetting)) {
        this.print();
      }
    },
    /**
      Save the model and close out the workspace.
     */
    saveAndClose: function () {
      this._saveState = SAVE_CLOSE;
      this.save();
    },
    /**
      Handles the save-and-new button click. Note that this button displays "new"
      if the model is clean, and we want it exhibit that conditional behavior.
     */
    saveAndNew: function () {
      if (this.$.workspace.getValue().isDirty()) {
        this._saveState = SAVE_NEW;
        this.save();
      } else {
        this.newRecord();
      }
    },
    /**
     This is called for each row in the menu List.
     The menu text is derived from the corresponding panel index.
     If the panel is not visible, then the menu item is also not visible.
     */
    // menu
    setupItem: function (inSender, inEvent) {
      var box = this.getMenuItems()[inEvent.index],
        defaultTitle =  "_menu".loc() + inEvent.index,
        title = box.getTitle ? box.getTitle() ||
         defaultTitle : box.title ? box.title || defaultTitle : defaultTitle,
        visible = box.showing;
      this.$.item.setContent(title);
      this.$.item.box = box;
      this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
      this.$.item.setShowing(visible);
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
      var menuItems = [],
        prop,
        headerAttrs,
        workspace = options.workspace,
        id = options.id,
        callback = options.callback,
        // if the options do not specify allowNew, default it to true
        allowNew = options.allowNew === false ? false : true,
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
        this.setAllowNew(allowNew);
        workspace = this.createComponent(workspace);
        headerAttrs = workspace.getHeaderAttrs() || [];
        if (headerAttrs.length) {
          this.$.header.show();
        } else {
          this.$.header.hide();
        }

        //
        // Show the print button if this workspace is set up to have it
        //
        this.$.printButton.setShowing(workspace.allowPrint && workspace.biAvailable);

        this.render();
        if (id || id === false) {
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
      message = message || "_loading".loc() + '...';
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
      if (canCreate && this.getAllowNew()) {
        this.$.saveAndNewButton.show();
      } else {
        this.$.saveAndNewButton.hide();
      }

      if (model.isDirty()) {
        this.$.saveAndNewButton.setContent("_saveAndNew".loc());
      } else {
        // if the model is clean, then this will just pull up a fresh workspace
        this.$.saveAndNewButton.setContent("_new".loc());
      }
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
    menuChanged: function (inSender, inEvent) {
      this.$.menu.render();
    },

    /**
     @todo Document unsavedCancel method.
     */
    unsavedCancel: function () {
      this._popupDone = true;
      this.$.unsavedPopup.hide();
    },
    /**
     @todo Document unsavedDiscard method.
     */
    unsavedDiscard: function () {
      this._popupDone = true;
      var options = {force: true};
      this.$.unsavedPopup.hide();
      if (this.$.unsavedPopup.close) {
        this.close(options);
      } else {
        this.$.workspace.requery();
      }
    },
    /**
     @todo Dcoument unsavedSave method.
     */
    unsavedSave: function () {
      this._popupDone = true;
      this.$.unsavedPopup.hide();
      if (this.$.unsavedPopup.close) {
        this.saveAndClose();
      } else {
        this.save();
      }
    }
  });

}());
