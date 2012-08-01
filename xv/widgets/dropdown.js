/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XV.DropdownWidget",
    kind: "enyo.Control",
    events: {
      onFieldChanged: ""
    },
    published: {
      collection: null,
      disabled: false,
      idAttribute: "id",
      nameAttribute: "name"
    },
    handlers: {
      onSelect: "itemSelected"
    },
    components: [
      {kind: "onyx.PickerDecorator", components: [
        {},
        {name: "picker", kind: "onyx.Picker"}
      ]}
    ],
    collectionChanged: function () {
      var idAttribute = this.getIdAttribute(),
        nameAttribute = this.getNameAttribute(),
        collection = XT.getObjectByName(this.getCollection()),
        i,
        id,
        name;
      this.$.picker.createComponent({ idValue: "", content: "" });
      for (i = 0; i < collection.models.length; i++) {
        id = collection.models[i].get(idAttribute);
        name = collection.models[i].get(nameAttribute);
        this.$.picker.createComponent({ value: id, content: name });
      }
      this.render();
    },
    disabledChange: function (inSender, inEvent) {
      this.addRemoveClass("onyx-disabled", inEvent.originator.disabled);
    },
    getValue: function () {
      return this.$.picker.getSelected() ? this.$.picker.getSelected().value : undefined;
    },
    itemSelected: function (inSender, inEvent) {
      this.doFieldChanged(this, inEvent); // pass this up the stream
      return true;
    },
    setValue: function (value) {
      var id = value && value.id ? value.id : value,
        component = _.find(this.$.picker.getComponents(), function (component) {
          return component.value === id;
        });
      if (component) { this.$.picker.setSelected(component); }
    }
  });
}());
