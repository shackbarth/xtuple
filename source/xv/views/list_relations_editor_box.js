/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true*/

(function () {
  
  /**
    Must include a component called `list`.
    List must be of sub-kind `XV.ListRelations`.
    The `value` must be set to a collection of `XM.Model`.
  */
  enyo.kind({
    name: "XV.ListRelationsEditorBox",
    kind: "XV.Groupbox",
    classes: "panel",
    published: {
      attr: null,
      value: null,
      title: "",
      parentKey: "",
      listRelations: "",
      editors: null
    },
    handlers: {
      onSelect: "selectionChanged",
      onDeselect: "selectionChanged"
    },
    attrChanged: function () {
      this.$.list.setAttr(this.attr);
    },
    /**
      Updates all child controls on the workspace where the name of
      the control matches the name of an attribute on the model.

      @param {XM.Model} model
      @param {Object} options
    */
    attributesChanged: XV.Workspace.prototype.attributesChanged,
    create: function () {
      this.inherited(arguments);
      var editors = this.getEditors() || [],
        panels,
        control;
      
      // Header
      this.createComponent({
        kind: "onyx.GroupboxHeader",
        content: this.getTitle()
      });
      
      // List
      panels = {
        kind: "Panels",
        fit: true,
        arrangerKind: "CollapsingArranger",
        components: _.clone(editors)
      };
      panels.components.push({
        kind: this.getListRelations(),
        name: "list",
        attr: this.getAttr(),
        fit: true
      });
      control = this.createComponent(panels);
      control.setIndex(editors.length);
      
      // Button
      this.createComponent({
        kind: "onyx.Button",
        name: "newButton",
        onclick: "newItem",
        content: "_new".loc(),
        classes: "xv-groupbox-button-single"
      });
    },
    newItem: function () {
      var list = this.$.list,
        parent = this.$.list.getParent(),
        id = parent ? parent.id : null,
        key = this.parentKey,
        attributes = {},
        callback = function (model) {
          var Model = list._collection.model,
            value = new Model({id: model.id}),
            options = {};
          options.success = function () {
            list._collection.add(value);
          };
          value.fetch(options);
        },
        inEvent;
      attributes[key] = id;
      inEvent = {
        originator: this,
        workspace: list.workspace,
        attributes: attributes,
        callback: callback
      };
      this.doWorkspace(inEvent);
    },
    selectionChanged: function (inSender, inEvent) {
      var index = this.$.list.getFirstSelected(),
        model = index ? this.$.list.getModel(index) : null,
        editors = this.getEditors() || [],
        changes = {},
        options = {},
        attrs,
        i;
      if (index) {
        // Update editor panel(s) completely
        attrs = model.getAttributeNames();
        for (i = 0; i < attrs.length; i++) {
          changes[attrs[i]] = true;
        }
        options.changes = changes;
        this.attributesChanged(model, options);
        this.$.panels.previous();
      } else {
        this.$.panels.setIndex(editors.length);
      }
    },
    valueChanged: function () {
      var value = this.getValue();
      this.$.list.setValue(value);
    }
  });

}());
