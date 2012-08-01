/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */

(function () {
  "use strict";

  // XXX again I'm doing these widgets as wrappers instead of subclassing the kind
  // this is worth a conversation

  enyo.kind({
    name: "XV.DropdownWidget",
    kind: enyo.Control,
    events: {
      onFieldChanged: ""
    },
    published: {
      collection: null,
      idAttribute: "id",
      nameAttribute: "name"
    },
    handlers: {
      onSelect: "itemSelected"
    },
    components: [{
      kind: "onyx.InputDecorator",
      style: "height: 14px;",
      components: [
        {kind: "onyx.PickerDecorator", components: [
          {},
          { kind: "onyx.Picker", name: "dropdown" }
        ]}
      ]
    }],
    /**
      A convenience function so that this object can be treated generally like an input
    */
    setValue: function (value) {
      for (var i = 0; i < this.$.dropdown.getComponents().length; i++) {
        if (this.$.dropdown.getComponents()[i].value === (value.id ? value.id : value)) {
        // TODO upon successful refactor of projectStatus as a real model then the next line will suffice
        //if (this.$.dropdown.getComponents()[i].value === value.id) {
          this.$.dropdown.setSelected(this.$.dropdown.getComponents()[i]);
          break;
        }
      }
    },
    /**
      A convenience function so that this object can be treated generally like an input
    */
    getValue: function () {
      return this.$.dropdown.getSelected() ? this.$.dropdown.getSelected().value : undefined;
    },
    /**
      Render this object onto the name field
    */
    collectionChanged: function () {
      var idAttribute = this.getIdAttribute(),
        nameAttribute = this.getNameAttribute(),
        collection = XT.getObjectByName(this.getCollection()),
        i,
        id,
        name;
      this.$.dropdown.createComponent({ idValue: "", content: "" });
      for (i = 0; i < collection.models.length; i++) {
        id = collection.models[i].get(idAttribute);
        name = collection.models[i].get(nameAttribute);
        this.$.dropdown.createComponent({ value: id, content: name });
      }
      this.$.dropdown.render();
    },
    itemSelected: function (inSender, inEvent) {
      this.doFieldChanged(this, inEvent); // pass this up the stream
      return true;
    }
  });
}());
