/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XM:true, XV:true, _:true */

(function () {

  enyo.kind({
    name: "XV.RepeaterBox",
    kind: "XV.Groupbox",
    classes: "panel",
    published: {
      attr: null,
      model: null,
      title: "",
      repeaterBoxItem: "",
      canOpen: false
    },
    handlers: {
      onDeleteItem: "deleteItem"
    },
    create: function () {
      var buttons;
      this.inherited(arguments);

      // Header
      this.createComponent({
        kind: "onyx.GroupboxHeader",
        content: this.getTitle()
      });
      
      // Repeater
      this.createComponent({
        kind: "XV.Scroller",
        horizontal: 'hidden',
        fit: true,
        components: [
          {kind: "Repeater", name: "repeater", count: 0, onSetupItem: "setupItem",
            classes: "xv-comment-box-repeater", components: [
            {kind: this.getRepeaterBoxItem(), name: "repeaterItem" }
          ]}
        ]
      });
      
      // Buttons
      buttons = {kind: 'FittableColumns', classes: "xv-groupbox-buttons",
        components: [
        {kind: "onyx.Button", name: "newButton", onclick: "newItem",
          content: "_new".loc(), classes: "xv-groupbox-button-single"}
      ]};
      if (this.getCanOpen()) {
        buttons.components[0].classes = "xv-groupbox-button-left";
        buttons.components.push(
          {kind: "onyx.Button", name: "openButton", onclick: "openRecord",
            content: "_open".loc(), classes: "xv-groupbox-button-right"}
        );
      }
      this.createComponent(buttons);
    },
    deleteItem: function (inSender, inEvent) {
      inEvent.originator.parent.getModel().destroy();
      this.$.repeater.setCount(this._collection.length);
    },
    newItem: function () {
      var Klass = XT.getObjectByName(this.getModel()),
        model = new Klass(null, { isNew: true });
      this._collection.add(model);
      this.$.repeater.setCount(this._collection.length);
    },
    setupItem: function (inSender, inEvent) {
      var row = inEvent.item.$.repeaterItem,
        model = this._collection.at(inEvent.index),
        status = model.getStatus(),
        K = XM.Model;
      row.setValue(model);
      if (status & K.DESTROYED) {
        row.setDeleted(true);
      }
    },
    setValue: function (value, options) {
      this._collection = value;
      this.$.repeater.setCount(this._collection.length);
      if (!this._collection.model.canCreate()) {
        this.$.newItemButton.setDisabled(true);
      }
    }
  });

  enyo.kind({
    name: "XV.RepeaterBoxItem",
    published: {
      columns: [],
      value: null
    },
    events: {
      onDeleteItem: ""
    },
    handlers: {
      onValueChange: "controlValueChanged"
    },
    valueChanged: function (inSender, inEvent) {
      var i,
        model = this.getValue(),
        controls = _.filter(this.$, function (obj) {
          return obj.attr || obj.formatter;
        }),
        control,
        label,
        attr,
        value;
      for (i = 0; i < controls.length; i++) {
        control = controls[i];
        attr = control.attr;
        label = ("_" + attr).loc();
        value = attr ? model.getValue(attr) : null;
        value = control.formatter ?
          this[control.formatter](value, control, model) : value;
        if (control.setValue) {
          control.setValue(value, {silent: true});
        } else {
          control.setContent(value);
        }
        if (model.isReadOnly() || !model.canUpdate()) {
          this.setDisabled(true);
        }
      }
    },
    /**
      Catch events from constituent widgets and update the model
    */
    controlValueChanged: function (inSender, inEvent) {
      var attr = inSender.getAttr(),
        value = inSender.getValue(),
        attributes = {},
        model = this.getValue();
      attributes[attr] = value;
      model.set(attributes);
      return true;
    },
    deleteItem: function (inSender, inEvent) {
      this.setStyle("background-color:purple");
      this.doDeleteItem(inEvent);
    },
    setDeleted: function (isDeleted) {
      var components = this.getComponents(),
        comp,
        style = isDeleted ?
          "text-decoration: line-through" : "text-decoration: none",
        i;

      for (i = 0; i < components.length; i++) {
        comp = components[i];
        if (comp.setInputStyle) {
          comp.setInputStyle(style);
        } else {
          XT.log("setInputStyle not supported on widget");
        }
      }
      this.setDisabled(isDeleted);
    },
    setDisabled: function (isDisabled) {
      var i,
        components = this.getComponents(),
        comp;

      for (i = 0; i < components.length; i++) {
        comp = components[i];
        if (comp.setDisabled) {
          comp.setDisabled(isDisabled);
        }
      }
    }
  });

}());
