/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true, Globalize:true */

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
      var attrs = {};
      attrs[inEvent.originator.attr] = inEvent.value;
      if (this.value) {
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
        canUpdate = (status === K.READY_NEW /* && model.canCreate() */) ||
          ((status & K.READY) && model.canUpdate()),
        isReadOnly,
        isRequired,
        prop,
        modelPropName,
        attribute,
        effective,
        attrs = this.value ? this.value.getAttributeNames() : [],
        ctrls = this.$;

      // This wasn't the original intent. Changes was ONLY supposed to process changes,
      // but it turns out attributes changed inside triggers themselves don't
      // get included in a generic change event. So for now process all every time.
      _.each(attrs, function (a) {
        changes[a] = true;
      });

      // loop through each of the controls and set the value using the
      // attribute on the control
      _.each(ctrls, function (control) {
        if (control.attr) {
          attribute = control.getAttr();

          // for compound controls, the attribute is an object with key/value pairs
          if (_.isObject(attribute)) {
            var obj = _.clone(attribute);
            // replace the current values in the object (attribute names)
            // with the values from the model
            for (var attr in obj) {
              if (obj.hasOwnProperty(attr)) {
                prop = model.attributeDelegates && model.attributeDelegates[attr] ?
                  model.attributeDelegates[attr] : attr;
                // replace the current value of the property name with the value from the model
                modelPropName = obj[prop];
                obj[prop] = model.getValue(modelPropName);

                // if one of the attributes is readOnly, this applies to the entire control
                // if the business logic is different for a specific widget, this will need
                // to be modified
                isReadOnly = isReadOnly || model.isReadOnly(prop);
                isRequired = model.isRequired(prop);
              }
            }
            value = obj;
          } else {
            // this attribute is a string value
            prop = model.attributeDelegates && model.attributeDelegates[attribute] ?
              model.attributeDelegates[attribute] : attribute;
            value = model.getValue(prop);
            isReadOnly = model.isReadOnly(prop);
            isRequired = model.isRequired(prop);
          }

          if (control.setPlaceholder && isRequired && !control.getPlaceholder()) {
            control.setPlaceholder("_required".loc());
          }
          if (control.setValue && !(status & K.BUSY)) {
            control.setValue(value, {silent: true});
          }
          if (control.setDisabled) {
            control.setDisabled(!canUpdate || isReadOnly);
          }
        }
        if (control.effective) {
          effective = control.getEffective();
          if (effective) {
            if (_.isString(effective)) {
              control.setEffective(model.getValue(effective));
            } else {
              control.setEffective(effective);
            }
          }
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
      value: null
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
      this.modelChanged();
    },
    /**
     @todo Document the destroy method.
     */
    destroy: function () {
      var model = this.getValue(),
        wasNew = model.isNew();
      this.setModel(null);
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
    fetch: function (id, options) {
      options = options ? _.clone(options) : {};
      options.id = id;
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
     @todo Document the modelChanged method.
     */
    modelChanged: function () {
      var model = this.getModel(),
        Klass = model ? XT.getObjectByName(model) : null,
        callback,
        that = this,
        headerAttrs = this.getHeaderAttrs() || [],
        i,
        attr,
        observers = "";

      // Clean up
      if (this.value) {
        this.value.off();
        if (this.value.isNew() && !this.modelAmnesty) {
          this.value.destroy();
        }
        this.value = null;
      }
      if (!Klass) { return; }

      // If we don't have a session yet then relations won't be available
      // so wait and try again after start up tasks complete
      if (!XT.session) {
        callback = function () {
          that.modelChanged();
        };
        XT.getStartupManager().registerCallback(callback);
        return;
      }

      // Create new instance and bindings
      this.value = new Klass();
      this.value.on("change", this.attributesChanged, this);
      this.value.on("change:lock", this.lockChanged, this);
      this.value.on("readOnlyChange", this.attributesChanged, this);
      this.value.on("statusChange", this.statusChanged, this);
      this.value.on("error", this.error, this);
      this.value.on("notify", this.notify, this);
      if (headerAttrs.length) {
        for (i = 0; i < headerAttrs.length; i++) {
          attr = headerAttrs[i];
          if (_.contains(this.value.getAttributeNames(), attr)) {
            observers = observers ? observers + " change:" + attr : "change:" + attr;
          }
        }
        this.value.on(observers, this.headerValuesChanged, this);
      }
    },
    /**
     @todo Document the newRecord method.
     */
    newRecord: function (attributes, options) {
      options = options || {};
      var attr,
        changes = {},
        that = this,
        relOptions = {
          success: function () {
            that.attributesChanged(that.value);
          }
        };
      this.modelChanged();
      this.clear();
      this.headerValuesChanged();
      this.value.initialize(null, {isNew: true});
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
      if (options.success) { options.success.call(this); }
    },
    /**
     @todo Document the error method.
     */
    notify: function (model, message, options) {
      var inEvent = _.extend(options, {
        originator: this,
        model: model,
        message: message
      });
      this.doNotify(inEvent);
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
            that.fetch(that.value.id);
          },
          error: function () {
            XT.log("Error releasing lock.");
            // fetch anyway. Why not!?
            that.fetch(that.value.id);
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
          id: this.value.id
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
      this.attributesChanged(model, options);
      this.doStatusChange(inEvent);
    },
    /**
     @todo Document the titleChanged method.
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
      onPrevious: ""
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
            src: "/client/lib/enyo-x/assets/menu-icon-lock.png"},
          {kind: "onyx.Button", name: "printButton", showing: false,
            content: "_print".loc(), onclick: "print"},
          {kind: "onyx.Button", name: "refreshButton", disabled: true,
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
        // This is used by notify and could be used by other things as well.
        // We just don't want to break the api by re-naming it
        {kind: "onyx.Popup", name: "errorPopup", centered: true,
          modal: true, floating: true, scrim: true, components: [
          {name: "errorMessage", content: "_error".loc()},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), name: "errorOk", ontap: "errorOk",
            classes: "onyx-blue xv-popup-button", showing: false},
          {kind: "onyx.Button", content: "_yes".loc(), name: "errorYes", ontap: "errorOk",
            classes: "onyx-blue xv-popup-button", showing: false},
          {kind: "onyx.Button", content: "_no".loc(), name: "errorNo", ontap: "errorOk",
            classes: "onyx-blue xv-popup-button", showing: false}
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
      var model = this.$.workspace.getValue();

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
        model.releaseLock();
      }
      this.doPrevious();
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
      this.notify(inSender, inEvent);
    },
    /**
      The OK button has been clicked from the notification popup. Close the popup and call
      the callback with the appropriate parameter if the callback exists.
     */
    errorOk: function (inSender, inEvent) {
      var notifyParameter;

      if (typeof this._notifyCallback === 'function') {
        switch (inEvent.originator.name) {
        case 'errorOk':
          notifyParameter = undefined;
          break;
        case 'errorYes':
          notifyParameter = true;
          break;
        case 'errorNo':
          notifyParameter = false;
          break;
        }
        this._notifyCallback(notifyParameter);
      }
      this.$.errorPopup.hide();
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
     @todo Document the notify method.
     */
    lockTapped: function (inSender, inEvent) {
      var lock = this.$.workspace.getValue().get("lock"),
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
      The model wants to ask the user something.
     */
    notify: function (inSender, inEvent) {
      var typeToButtonMap = {};
      typeToButtonMap[String(XM.Model.NOTICE)] = ["errorOk"];
      typeToButtonMap[String(XM.Model.WARNING)] = ["errorOk"];
      typeToButtonMap[String(XM.Model.CRITICAL)] = ["errorOk"];
      typeToButtonMap[String(XM.Model.QUESTION)] = ["errorYes", "errorNo"];


      this.spinnerHide();
      this.$.errorMessage.setContent(inEvent.message);
      this._notifyCallback = inEvent.callback;

      // show the appropriate buttons
      _.each(this.$.errorPopup.children, function (component) {
        if (component.kind !== "onyx.Button") {
          // not a button: do nothing.
        } else if (_.indexOf(typeToButtonMap[String(inEvent.type)], component.name) >= 0) {
          // in the show-me array, so show
          component.setShowing(true);
        } else {
          // not in the show-me array, so hide
          component.setShowing(false);
        }
      });

      this.$.errorPopup.render();
      this.$.errorPopup.show();
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

      window.open('/report?details={"recordType":"%@","id":%@}'.f(model.recordType, model.id), '_newtab');
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
     @todo Document the save method.
     */
    save: function (options) {
      if (!this._saveState) { this._saveState = SAVE_APPLY; }
      this.$.workspace.save(options);
    },
    /**
     @todo Document the saveAndClose method.
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
        this.$.printButton.setShowing(workspace.allowPrint);

        this.render();
        if (id || id === false) {
          workspace.fetch(id, options);
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
     @todo Document spinnerHide method.
     */
    spinnerHide: function () {
      this._popupDone = true;
      this.$.spinnerPopup.hide();
    },
    /**
     @todo Document spinnerShow method.
     */
    spinnerShow: function (message) {
      message = message || "_loading".loc() + '...';
      this._popupDone = false;
      this.$.spinnerMessage.setContent(message);
      this.$.spinnerPopup.show();
    },
    /**
     @todo Document statusChanged method.
     */
    statusChanged: function (inSender, inEvent) {
      var model = inEvent.model,
        K = XM.Model,
        status = inEvent.status,
        isNotReady = status !== K.READY_CLEAN && status !== K.READY_DIRTY,
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

      this.$.refreshButton.setDisabled(canNotSave);
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
