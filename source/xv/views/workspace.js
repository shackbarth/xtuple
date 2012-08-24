/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {
  var SAVE_APPLY = 1;
  var SAVE_CLOSE = 2;
  var SAVE_NEW = 3;
  
  enyo.kind({
    name: "XV.Workspace",
    kind: "FittableRows",
    published: {
      title: "_none".loc(),
      headerAttrs: null,
      model: "",
      callback: null
    },
    events: {
      onError: "",
      onHeaderChange: "",
      onModelChange: "",
      onStatusChange: "",
      onTitleChange: "",
      onHistoryChange: ""
    },
    handlers: {
      onValueChange: "valueChanged"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        fit: true, components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.InputWidget", name: "description"}
        ]}
      ]}
    ],
    /**
      Updates all child controls on the workspace where the name of
      the control matches the name of an attribute on the model.

      @param {XM.Model} model
      @param {Object} options
    */
    attributesChanged: function (model, options) {
      options = options || {};
      var that = this,
        attr,
        value,
        K = XM.Model,
        status = model.getStatus(),
        changes = options.changes,
        canNotUpdate = !model.canUpdate() || !(status & K.READY),
        control,
        isReadOnly,
        isRequired,
        findControl = function (attr) {
          return _.find(that.$, function (ctl) {
            return ctl.attr === attr;
          });
        };
      for (attr in changes) {
        if (changes.hasOwnProperty(attr)) {
          value = model.get(attr);
          isReadOnly = model.isReadOnly(attr);
          isRequired = model.isRequired(attr);
          control = findControl(attr);
          if (control) {
            if (control.setPlaceholder && isRequired &&
                !control.getPlaceholder()) {
              control.setPlaceholder("_required".loc());
            }
            if (control.setValue && !(status & K.BUSY)) {
              control.setValue(value, {silent: true});
            }
            if (control.setDisabled) {
              control.setDisabled(canNotUpdate || isReadOnly);
            }
          }
        }
      }
    },
    clear: function () {
      var attrs = this._model ? this._model.getAttributeNames() : [],
        attr,
        i;
      for (i = 0; i < attrs.length; i++) {
        attr = attrs[i];
        if (this.$[attr] && this.$[attr].clear) {
          this.$[attr].clear({silent: true});
        }
      }
    },
    create: function () {
      this.inherited(arguments);
      this.titleChanged();
      this.modelChanged();
    },
    destroy: function () {
      this.setModel(null);
      this.inherited(arguments);
    },
    error: function (model, error) {
      var inEvent = {
        originator: this,
        model: model,
        error: error
      };
      this.doError(inEvent);
    },
    fetch: function (id) {
      var options = {};
      options.id = id;
      if (!this._model) { return; }
      this._model.fetch(options);
    },
    headerValuesChanged: function () {
      var headerAttrs = this.getHeaderAttrs() || [],
        model = this._model,
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
    isDirty: function () {
      return this._model ? this._model.isDirty() : false;
    },
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
      if (this._model) {
        this._model.off();
        if (this._model.isNew()) { this._model.destroy(); }
        delete this._model;
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
      this._model = new Klass();
      this._model.on("change", this.attributesChanged, this);
      this._model.on("statusChange", this.statusChanged, this);
      this._model.on("error", this.error, this);
      if (headerAttrs.length) {
        for (i = 0; i < headerAttrs.length; i++) {
          attr = headerAttrs[i];
          if (_.contains(this._model.getAttributeNames(), attr)) {
            observers = observers ? observers + " change:" + attr : "change:" + attr;
          }
        }
        this._model.on(observers, this.headerValuesChanged, this);
      }
    },
    newRecord: function () {
      this.modelChanged();
      this._model.initialize(null, {isNew: true});
      this.clear();
    },
    requery: function () {
      this.fetch(this._model.id);
    },
    save: function (options) {
      options = options || {};
      var that = this,
        success = options.success,
        inEvent = {
          originator: this,
          model: this.getModel(),
          id: this._model.id
        };
      options.success = function (model, resp, options) {
        that.doModelChange(inEvent);
        if (that.callback) { that.callback(model); }
        if (success) { success(model, resp, options); }
      };
      this._model.save(null, options);
    },
    statusChanged: function (model, status, options) {
      options = options || {};
      var inEvent = {model: model},
        attrs = model.getAttributeNames(),
        changes = {},
        i;

      // Add to history if appropriate.
      if (model.id) {
        XT.addToHistory(this.kind, model);
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
    titleChanged: function () {
      var inEvent = { title: this.getTitle(), originator: this };
      this.doTitleChange(inEvent);
    },
    valueChanged: function (inSender, inEvent) {
      var attrs = {};
      attrs[inEvent.originator.attr] = inEvent.value;
      this._model.set(attrs);
    }
  });

  enyo.kind({
    name: "XV.WorkspaceContainer",
    kind: "Panels",
    arrangerKind: "CollapsingArranger",
    classes: "app enyo-unselectable",
    published: {
      menuItems: []
    },
    events: {
      onPrevious: ""
    },
    handlers: {
      onError: "errorNotify",
      onHeaderChange: "headerChanged",
      onModelChange: "modelChanged",
      onStatusChange: "statusChanged",
      onTitleChange: "titleChanged"
    },
    components: [
      {kind: "FittableRows", name: "navigationPanel", classes: "left", components: [
        {kind: "onyx.Toolbar", name: "menuToolbar", components: [
          {kind: "onyx.Button", name: "backButton",
            content: "_back".loc(), onclick: "close"}
        ]},
        {name: "menu", kind: "List", fit: true, touch: true,
           onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", name: "contentPanel", components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "title", style: "text-align: center;"},
          {kind: "onyx.Button", name: "saveButton",
            disabled: true, // TO DO: Get the affirmative style back into CSS
            style: "float: right; background-color: #35A8EE;",
            content: "_save".loc(), onclick: "saveAndClose"},
          {kind: "onyx.Button", name: "saveAndNewButton", disabled: true,
            style: "float: right;",
            content: "_saveAndNew".loc(), onclick: "saveAndNew"},
          {kind: "onyx.Button", name: "applyButton", disabled: true,
            style: "float: right;",
            content: "_apply".loc(), onclick: "save"},
          {kind: "onyx.Button", name: "refreshButton", disabled: true,
            content: "_refresh".loc(), onclick: "requery",
            style: "float: right;"}
        ]},
        {name: "header", classes: "xv-workspace-header"},
        {kind: "onyx.Popup", name: "unsavedPopup", centered: true,
          modal: true, floating: true, scrim: true, components: [
          {content: "_unsavedChanges".loc() },
          {tag: "br"},
          {kind: "onyx.Button", content: "_discard".loc(), ontap: "unsavedDiscard" },
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "unsavedCancel" },
          {kind: "onyx.Button", content: "_save".loc(), ontap: "unsavedSave",
            classes: "onyx-blue"}
        ]},
        {kind: "onyx.Popup", name: "errorPopup", centered: true,
          modal: true, floating: true, scrim: true, components: [
          {name: "errorMessage", content: "_error".loc()},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "errorOk",
            classes: "onyx-blue"}
        ]}
      ]}
    ],
    close: function (options) {
      options = options || {};
      if (!options.force) {
        if (this.$.workspace.isDirty()) {
          this.$.unsavedPopup.close = true;
          this.$.unsavedPopup.show();
          return;
        }
      }
      this.doPrevious();
    },
    destroyWorkspace: function () {
      var workspace = this.$.workspace;
      if (workspace) {
        this.removeComponent(workspace);
        workspace.destroy();
      }
    },
    errorNotify: function (inSender, inEvent) {
      var message = inEvent.error.message();
      this.$.errorMessage.setContent(message);
      this.$.errorPopup.render();
      this.$.errorPopup.show();
    },
    errorOk: function () {
      this.$.errorPopup.hide();
    },
    headerChanged: function (inSender, inEvent) {
      this.$.header.setContent(inEvent.header);
      return true;
    },
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
    },
    modelChanged: function () {
      if (this._saveState === SAVE_CLOSE) {
        this.close();
      } else if (this._saveState === SAVE_NEW) {
        this.newRecord();
      }
    },
    newRecord: function () {
      this.$.workspace.newRecord();
    },
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
    save: function (options) {
      if (!this._saveState) { this._saveState = SAVE_APPLY; }
      this.$.workspace.save(options);
    },
    saveAndClose: function () {
      this._saveState = SAVE_CLOSE;
      this.save();
    },
    saveAndNew: function () {
      this._saveState = SAVE_NEW;
      this.save();
    },
    // menu
    setupItem: function (inSender, inEvent) {
      var box = this.getMenuItems()[inEvent.index],
        defaultTitle =  "_menu".loc() + inEvent.index,
        title = box.getTitle ? box.getTitle() || defaultTitle :
          box.title ? box.title || defaultTitle : defaultTitle;
      this.$.item.setContent(title);
      this.$.item.box = box;
      this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));
    },
    setWorkspace: function (workspace, id, callback) {
      var menuItems = [],
        prop,
        headerAttrs;
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
        if (id) {
          workspace.fetch(id);
        } else {
          workspace.newRecord();
        }
        headerAttrs = workspace.getHeaderAttrs() || [];
        if (headerAttrs.length) {
          this.$.header.show();
        } else {
          this.$.header.hide();
        }
        this.render();
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
    statusChanged: function (inSender, inEvent) {
      var model = inEvent.model,
        K = XM.Model,
        status = model.getStatus(),
        isNotReady = (status !== K.READY_CLEAN && status !== K.READY_DIRTY),
        isEditable = (model.canUpdate() && !model.isReadOnly()),
        canNotSave = (!model.isDirty() || !isEditable);

      // Status dictates whether buttons are actionable
      this.$.refreshButton.setDisabled(isNotReady);
      this.$.applyButton.setDisabled(canNotSave);
      this.$.saveAndNewButton.setDisabled(canNotSave);
      this.$.saveButton.setDisabled(canNotSave);
    },
    titleChanged: function (inSender, inEvent) {
      var title = inEvent.title || "";
      this.$.title.setContent(title);
      return true;
    },
    unsavedCancel: function () {
      this.$.unsavedPopup.hide();
    },
    unsavedDiscard: function () {
      var options = {force: true};
      this.$.unsavedPopup.hide();
      this.close(options);
    },
    unsavedSave: function () {
      this.$.unsavedPopup.hide();
      if (this.$.unsavedPopup.close) {
        this.saveAndClose();
      } else {
        this.save();
      }
    }
  });

}());
