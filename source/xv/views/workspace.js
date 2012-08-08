/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, Backbone:true, enyo:true, XT:true */

(function () {

  enyo.kind({
    name: "XV.Workspace",
    kind: "FittableRows",
    published: {
      title: "_none".loc(),
      model: ""
    },
    events: {
      onStatusChange: "",
      onTitleChange: ""
    },
    handlers: {
      onValueChange: "valueChanged"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.InputWidget", name: "description"}
        ]}
      ]}
    ],
    /**
      Updates all children widgets on the workspace where the name of
      the widget matches the name of an attribute on the model.
      
      @param {XM.Model} model
      @param {Object} options
    */
    attributesChanged: function (model, options) {
      options = options || {};
      var attr,
        value,
        changes = options.changes;
      for (attr in changes) {
        if (changes.hasOwnProperty(attr)) {
          value = model.get(attr);
          if (this.$[attr] && this.$[attr].setValue) {
            this.$[attr].setValue(value, {silent: true});
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
      var prop;
      this.inherited(arguments);
      this.titleChanged();
      this.modelChanged();

      // Create a menu for every group box
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop)) {
          if (this.$[prop].kind === "onyx.GroupboxHeader") {
            // Do something
          }
        }
      }
    },
    destroy: function () {
      this.setModel(null);
      this.inherited(arguments);
    },
    fetch: function (id) {
      if (!this._model) { return; }
      this._model.fetch({id: id});
    },
    isDirty: function () {
      return this._model ? this._model.isDirty() : false;
    },
    modelChanged: function () {
      var model = this.getModel(),
        Klass = model ? XT.getObjectByName(model) : null,
        callback,
        that = this,
        attrs,
        attr,
        i,
        isReadOnly;

      // Remove old bindings
      if (this._model) {
        this._model.off();
        this._model = null;
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
      
      // Disable read-only attributes
      attrs = this._model ? this._model.getAttributeNames() : [];
      for (i = 0; i < attrs.length; i++) {
        attr = attrs[i];
        isReadOnly = this._model.isReadOnly(attr);
        if (this.$[attr] && this.$[attr].setDisabled) {
          this.$[attr].setDisabled(isReadOnly);
        }
      }
    },
    newRecord: function () {
      var model = this._model,
        attr,
        changes = {};
      if (!model) { return; }
      model.initialize(null, {isNew: true});
      this.clear();
      for (attr in model.attributes) {
        changes[attr] = true;
      }
      this.attributesChanged(model, {changes: changes});
    },
    requery: function () {
      this.fetch(this._model.id);
    },
    save: function (options) {
      this._model.save(null, options);
    },
    statusChanged: function (model, status, options) {
      options = options || {};
      var K = XM.Model,
        inEvent = {model: model},
        attr,
        changes = {};
      if (status === K.READY_CLEAN || status === K.READY_NEW) {
        for (attr in model.attributes) {
          changes[attr] = true;
        }
        options.changes = changes;
        this.attributesChanged(model, options);
      }
      this.doStatusChange(inEvent);
    },
    titleChanged: function () {
      var inEvent = { title: this.getTitle(), originator: this };
      this.doTitleChange(inEvent);
    },
    valueChanged: function (inSender, inEvent) {
      var attrs = {};
      attrs[inEvent.originator.name] = inEvent.value;
      this._model.set(attrs);
    }
  });

  enyo.kind({
    name: "XV.WorkspaceContainer",
    kind: "Panels",
    arrangerKind: "CollapsingArranger",
    classes: "app enyo-unselectable",
    published: {
      previous: ""
    },
    handlers: {
      onPanelChange: "changeWorkspace",
      onStatusChange: "statusChanged",
      onTitleChange: "titleChanged"
    },
    components: [
      {kind: "FittableRows", name: "navigationPanel", classes: "left", components: [
        {kind: "onyx.Toolbar", name: "menuToolbar", components: [
          {kind: "onyx.Button", name: "backButton",
            content: "_back".loc(), onclick: "close"}
        ]},
        {kind: "Repeater", fit: true, touch: true, onSetupItem: "setupItem", name: "menuItems",
          components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", name: "contentPanel", components: [
        {kind: "onyx.Toolbar", classes: "onyx-toolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {kind: "onyx.Button", name: "refreshButton", disabled: true,
            content: "_refresh".loc(), onclick: "requery"},
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
            content: "_apply".loc(), onclick: "apply"}
        ]},
        {kind: "onyx.Popup", name: "unsavedChangesPopup", centered: true,
          modal: true, floating: true, onShow: "popupShown",
          onHide: "popupHidden", components: [
          {content: "_unsavedChanges".loc() },
          {tag: "br"},
          {kind: "onyx.Button", content: "_discard".loc(), ontap: "unsavedDiscard" },
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "unsavedCancel" },
          {kind: "onyx.Button", content: "_save".loc(), ontap: "unsavedSave",
            classes: "onyx-blue"}
        ]}
      ]}
    ],
    apply: function () {
      this.save();
    },
    changeWorkspace: function (inSender, inEvent) {
      var workspace = this.$.workspace;
      if (inEvent.workspace) {
        this.destroyWorkspace();
        workspace = {
          name: "workspace",
          container: this.$.contentPanel,
          kind: inEvent.workspace,
          fit: true
        };
        workspace = this.createComponent(workspace);
        if (inEvent.id) {
          workspace.fetch(inEvent.id);
        } else {
          workspace.newRecord();
        }
        this.render();
      }
      this.setPrevious(inEvent.previous);
    },
    close: function (options) {
      options = options || {};
      if (!options.force) {
        if (this.$.workspace.isDirty()) {
          this.$.unsavedChangesPopup.show();
          return;
        }
      }
      var previous = this.getPrevious();
      this.bubble(previous, {eventName: previous});
      this.destroyWorkspace();
    },
    create: function () {
      this.inherited(arguments);
    },
    destroyWorkspace: function () {
      var workspace = this.$.workspace;
      if (workspace) {
        this.removeComponent(workspace);
        workspace.destroy();
      }
    },
    newRecord: function () {
      this.$.workspace.newRecord();
    },
    requery: function () {
      this.$.workspace.requery();
    },
    save: function (options) {
      this.$.workspace.save(options);
    },
    saveAndNew: function () {
      var that = this,
        options = {},
        success = function () {
          that.newRecord();
        };
      options.success = success;
      this.save(options);
    },
    saveAndClose: function () {
      var that = this,
        options = {},
        success = function () {
          that.close();
        };
      options.success = success;
      this.save(options);
    },
    statusChanged: function (inSender, inEvent) {
      var model = inEvent.model,
        K = XM.Model,
        status = model.getStatus(),
        isNotReady = (status !== K.READY_CLEAN && status !== K.READY_DIRTY),
        canNotSave = (!model.isDirty() || !model.canUpdate() ||
          model.isReadOnly());
          
      // Update buttons
      this.$.refreshButton.setDisabled(isNotReady);
      this.$.applyButton.setDisabled(canNotSave);
      this.$.saveAndNewButton.setDisabled(canNotSave);
      this.$.saveButton.setDisabled(canNotSave);
    },
    titleChanged: function (inSender, inEvent) {
      var title = inEvent.title || "";
      this.$.title.setContent(title);
    },
    unsavedCancel: function () {
      this.$.unsavedChangesPopup.hide();
    },
    unsavedDiscard: function () {
      var options = {force: true};
      this.$.unsavedChangesPopup.hide();
      this.close(options);
    },
    unsavedSave: function () {
      this.$.unsavedChangesPopup.hide();
      this.save();
    }
  });

}());
