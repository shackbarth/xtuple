/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */
(function () {
  "use strict";

  enyo.kind({
    name: "ObjectWidget",
    kind: enyo.Control,
    published: {
      baseObject: null
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
            // this is third party code that doesn't look great under the best of
            // conditions and needs some work to get even there.
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
      // TODO: right now the base object is just a string but it has to be more general
      this.$.nameField.setValue(this.getBaseObject());
    },
    doInputChanged: function () {
      // TODO: deal with user input
    },
    doIconTapped: function () {
      // TODO: icon tapped
      this.$.gearPopup.show();
    }
  });
}());
