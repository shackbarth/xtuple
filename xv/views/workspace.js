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
      onPanelChange: "fetch"
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
    attributesChanged: function (model, attributes, options) {
      var prop;
      for (prop in attributes) {
        if (attributes.hasOwnProperty(prop)) {
          if (this.$[prop] && this.$[prop].setValue) {
            this.$[prop].setValue(attributes[prop], {silent: true});
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
    fetch: function (inSender, inEvent) {
      this._model.fetch({id: inEvent.id});
      return true;
    },
    modelChanged: function () {
      var model = this.getModel(),
        Klass = model ? XT.getObjectByName(model) : null;

      // Remove old bindings
      if (this._model) {
        this._model.off();
        this._model = null;
      }
      if (!Klass) { return; }
      
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
        this.$.attributesChanged(model, model.attributes);
      }
      this.doStatusChange(inEvent);
    },
    titleChanged: function () {
      var title = this.getTitle();
      this.parent.parent.$.title.setContent(title);
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
        {kind: "onyx.Toolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {kind: "onyx.Button", name: "refreshButton", disabled: true,
            content: "_refresh".loc(), onclick: "requery"},
          {name: "title", style: "text-align: center;"},
          {kind: "onyx.Button", name: "saveButton",
            classes: "onyx-affirmative", disabled: true,
            style: "float: right;",
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
        isNotNew = (!model.isNew()),
        canNotSave = (!model.isDirty() || !model.canUpdate() ||
          model.isReadOnly());
          
      // Update buttons
      this.$.refreshButton.setDisabled(isNotNew);
      this.$.applyButton.setDisabled(canNotSave);
      this.$.saveAndNewButton.setDisabled(canNotSave);
      this.$.saveButton.setDisabled(canNotSave);
    }
    
  });

}());
