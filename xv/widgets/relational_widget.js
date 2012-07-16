/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, Backbone:true, enyo:true, _:true */
(function () {
  "use strict";

  enyo.kind({
    name: "XV.RelationalWidget",
    kind: enyo.Control,
    published: {
      baseObject: null,
      baseCollection : null
    },
    components: [{
      kind: "onyx.InputDecorator",
      style: "height: 14px;",
      components: [
        { kind: "onyx.Input", name: "nameField", onchange: "doInputChanged" },
        { kind: "Image", src: "images/gear-icon.gif", ontap: "doIconTapped" },
        {
          kind: "onyx.Popup",
          name: "gearPopup",
          modal: true,
          floating: true,
          centered: true,
          components: [
            { tag: "div", content: "Gear popup is here" }
          ]
        }
      ]
    }],
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    setValue: function (object) {
      this.setBaseObject(object);
    },
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    getValue: function () {
      return this.getBaseObject();
    },
    /**
     * render this object onto the name field
     */
    baseObjectChanged: function () {
      var type = this.getBaseObject().get("type");

      /**
       * Now is a good time to set the collection (a published value)
       * that we'll use on operations for this widget. There's no
       * way to get from model to collection except through the store.
       */
      this.setBaseCollection(Backbone.Relational.store.getCollection(this.getBaseObject()));
      this.$.nameField.setValue(this.getBaseObject().get(this.getTitleField()));
    },
    doInputChanged: function (inSender, inEvent) {



      var queryDesc = {
        query: {
          conditions: this.getTitleField() + " BEGINS_WITH {frag}",
          parameters: { frag: inSender.getValue() }
        }
      };
      var temp = this.getBaseCollection().fetch(queryDesc);
      alert(temp);
    },
    /**
     * Every object has a field that is the main one for display. These are kept in
     * the XV.RelationalWidgetTitleFields hash. This function gets the value of that
     * has with the key of this type of model.
     */
    getTitleField: function () {
      return XV.RelationalWidgetTitleFields[this.getBaseObject().get("type")];
    },
    doIconTapped: function () {
      // TODO: icon tapped
      this.$.gearPopup.show();
    }
  });
}());
