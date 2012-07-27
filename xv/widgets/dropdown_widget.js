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
      modelType: null
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
     * A convenience function so that this object can be treated generally like an input
     */
    setValue: function (value) {

      for (var i = 0; i < this.$.dropdown.getComponents().length; i++) {
        if (this.$.dropdown.getComponents()[i].value === (value && value.id ? value.id : value)) {
        // TODO upon successful refactor of projectStatus as a real model then the next line will suffice
        //if (this.$.dropdown.getComponents()[i].value === value.id) {
          this.$.dropdown.setSelected(this.$.dropdown.getComponents()[i]);
          break;
        }
      }
    },
    setDisabled: function (isDisabled) {
      // XXX TODO
    },
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    getValue: function () {
      return this.$.dropdown.getSelected() ? this.$.dropdown.getSelected().value : undefined;
    },
    /**
     * render this object onto the name field
     */
    modelTypeChanged: function () {

      this.$.dropdown.createComponent({ idValue: "", content: "" });
      var collection = XT.getObjectByName(this.modelType);
      for (var i = 0; i < collection.models.length; i++) {
        // TODO: these won't necessarily be under the terms id and name.
        // once we come across such an example we need to write an
        // overriding metadata object, probably in foundation.js, to
        // specify what fields to use
        var id = collection.models[i].get("id");
        var name = collection.models[i].get("name");
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
