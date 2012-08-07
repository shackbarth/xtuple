/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, Backbone:true, enyo:true, XT:true */

(function () {

  enyo.kind({
    name: "XV.Workspace",
    kind: "FittableRows",
    published: {
      title: "_opportunity".loc(),
      model: "XM.Opportunity"
    },
    events: {
      onStatusChange: ""
    },
    handlers: {
      onPanelChange: "fetch",
      onValueChange: "valueChanged"
    },
    components: [
      {kind: "Panels", name: "topPanel", arrangerKind: "CarouselArranger",
        classes: "xv-top-panel", components: [
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
          {kind: "XV.InputWidget", name: "number"},
          {kind: "XV.InputWidget", name: "name"},
          {kind: "XV.AccountWidget", name: "account"}
        ]},
        {kind: "onyx.Groupbox", classes: "xv-groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_status".loc()},
          {kind: "XV.OpportunityStageDropdown", name: "opportunityStage"},
          {kind: "XV.OpportunityTypeDropdown", name: "opportunityType"},
          {kind: "XV.OpportunitySourceDropdown", name: "opportunitySource"}
        ]}
      ]},
      {kind: "Panels", name: "bottomPanel", arrangerKind: "CarouselArranger", fit: true, components: [
        {content: "Bottom Panel 1"},
        {content: "Bottom Panel 2"},
        {content: "Bottom Panel 3"}
      ]}
    ],
    /**
      Updates all children widgets on the workspace where the name of
      the widget matches the name of an attribute on the model.
      
      By default updates only `changed` attributes on the model.
      if `all` option equals `true` then will update all attributes.
      
      @param {XM.Model} model
      @param {Object} options
    */
    attributesChanged: function (model, options) {
      options = options || {};
      var K = XM.Model,
        status = model.getStatus(),
        prop,
        attrs = options.all ? model.attributes : model.changedAttributes();
        
      // Only process if model is in `READY` status
      if (status & K.READY) {
        for (prop in attrs) {
          if (attrs.hasOwnProperty(prop)) {
            if (this.$[prop] && this.$[prop].setValue) {
              this.$[prop].setValue(attrs[prop], {silent: true});
            }
          }
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
    fetch: function (inSender, inEvent) {
      this._model.fetch({id: inEvent.id});
      return true;
    },
    modelChanged: function () {
      var model = this.getModel(),
        Klass = model ? XT.getObjectByName(model) : null,
        callback,
        that = this;

      // Remove old bindings
      if (this._model) {
        this._model.off();
        this._model = null;
      }
      if (!Klass) { return; }
      
      // If we don't a session yet then relations won't be available
      // so wait try again after start up tasks complete
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
    },
    newRecord: function () {
      this._model.initialize(null, {isNew: true});
    },
    requery: function () {
      var inEvent = {id: this._model.id};
      this.fetch(this, inEvent);
    },
    save: function () {
      this._model.save();
    },
    statusChanged: function (model, status, options) {
      var K = XM.Model,
        inEvent = {model: model};
      if (status === K.READY_CLEAN) {
        this.attributesChanged(model, {all: true});
      }
      this.doStatusChange(inEvent);
    },
    titleChanged: function () {
      var title = this.getTitle();
      this.parent.parent.$.title.setContent(title);
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
      module: "crm"
    },
    handlers: {
      onPanelChange: "changeWorkspace",
      onStatusChange: "statusChanged"
    },
    components: [
      {kind: "FittableRows", classes: "left", components: [
        {kind: "onyx.Toolbar", name: "menuToolbar", components: [
          {kind: "onyx.Button", name: "backButton",
            content: "_back".loc(), onclick: "close"}
        ]},
        {kind: "Repeater", fit: true, touch: true, onSetupItem: "setupItem", name: "menuItems",
          components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", components: [
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
        {kind: "XV.Workspace", name: "workspace", fit: true}
      ]}
    ],
    apply: function () {
      this.save();
    },
    changeWorkspace: function (inSender, inEvent) {
      // Change the workspace...
    },
    close: function () {
      var module = this.getModule();
      this.bubble(module, {eventName: module});
    },
    newRecord: function () {
      this.$.workspace.newRecord();
    },
    requery: function () {
      this.$.workspace.requery();
    },
    save: function () {
      this.$.workspace.save();
    },
    saveAndNew: function () {
      this.save();
      this.newRecord();
    },
    saveAndClose: function () {
      this.save();
      this.close();
    },
    statusChanged: function (inSender, inEvent) {
      var model = inEvent.model,
        K = XM.Model,
        status = model.getStatus(),
        isNotReady = !(status & K.READY),
        canNotSave = (!model.isDirty() || !model.canUpdate() ||
          model.isReadOnly());
          
      // Update buttons
      this.$.refreshButton.setDisabled(isNotReady);
      this.$.applyButton.setDisabled(canNotSave);
      this.$.saveAndNewButton.setDisabled(canNotSave);
      this.$.saveButton.setDisabled(canNotSave);
    }
    
  });

}());
