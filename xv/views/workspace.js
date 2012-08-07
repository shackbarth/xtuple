/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, Backbone:true, enyo:true, XT:true */

(function () {

  enyo.kind({
    name: "XV.WorkspaceContent",
    kind: "FittableRows",
    published: {
      title: "_opportunity".loc()
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
    create: function () {
      this.inherited(arguments);
      this.titleChanged();
      var prop;
      // Create a menu for every group box
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop)) {
          if (this.$[prop].kind === "onyx.GroupboxHeader") {
            // Do something
          }
        }
      }
    },
    titleChanged: function () {
      var title = this.getTitle();
      this.parent.parent.$.title.setContent(title);
    },
    update: function (attributes) {
      var prop;
      for (prop in attributes) {
        if (attributes.hasOwnProperty(prop)) {
          if (this.$[prop] && this.$[prop].setValue) {
            this.$[prop].setValue(attributes[prop]);
          }
        }
      }
    }
  });

  enyo.kind({
    name: "XV.Workspace",
    kind: "Panels",
    arrangerKind: "CollapsingArranger",
    classes: "app enyo-unselectable",
    published: {
      model: null,
      module: "crm"
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
          {kind: "onyx.Button", name: "refreshButton",
            content: "_refresh".loc(), onclick: "refresh"},
          {name: "title", style: "text-align: center;"},
          {kind: "onyx.Button", name: "saveButton",
            classes: "onyx-affirmative", disabled: true,
            style: "float: right;",
            content: "_save".loc(), onclick: "save"},
          {kind: "onyx.Button", name: "saveAndNewButton", disabled: true,
            style: "float: right;",
            content: "_saveAndNew".loc(), onclick: "apply"},
          {kind: "onyx.Button", name: "applyButton", disabled: true,
            style: "float: right;",
            content: "_apply".loc(), onclick: "apply"}
        ]},
        {kind: "XV.WorkspaceContent", name: "workspaceContent", fit: true}
      ]}
    ],
    close: function () {
      var module = this.getModule();
      this.bubble(module, {eventName: module});
    },
    create: function () {
      this.inherited(arguments);
      this.modelChanged();
    },
    attributesChanged: function (model, attributes, options) {
      this.$.workspaceContent.update(attributes);
    },
    modelChanged: function () {
      var model = this.getModel(),
        Klass = model ? XT.getObjectByName(model) : null;
      if (!Klass) { return; }
      this._model = new Klass();
      this._model.on("change", this.attributesChanged);
      this._model.on("statusChange", this.statusChanged);
    },
    save: function () {
      this._model.save();
    },
    saveAndClose: function () {
      this.save();
    },
    statusChanged: function (model, status, options) {
      var isNotDirty = (!model.isDirty());
      this.$.applyButton.setDisabled(isNotDirty);
      this.$.saveAndNewButton.setDisabled(isNotDirty);
      this.$.saveButton.setDisabled(isNotDirty);
      // Do something
    }
  });
    
}());
