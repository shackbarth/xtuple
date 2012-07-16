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
      classes: "onyx-menu-toolbar",
      components: [
        { kind: "onyx.Input", name: "nameField", onkeyup: "doInputChanged" },
        { kind: "Image", src: "images/gear-icon.gif", ontap: "doIconTapped" },
        {
          kind: "onyx.Popup",
          name: "gearPopup",
          modal: true,
          floating: true,
          centered: true,
          components: [
            { tag: "div", content: "TODO: this menu" }
          ]
        },
        /* XXX this menu implementation is a mess and I hope it improves for production!
        {
          kind: "onyx.MenuDecorator",
          components: [
            { content: "popup", components: [
              { kind: "Image", src: "images/gear-icon.gif" }
            ]},
            { kind: "onyx.Tooltip", content: "Tap to open..."},
            {
              kind: "onyx.Menu",
              name: "navigationMenu",
              components: [
                { content: "Dashboard" },
                { content: "CRM" },
                { content: "Billing" }
              ],
              ontap: "doNavigationSelected"
            }
          ]
        }
        */
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
      var type = this.getBaseObject().recordType;

      /**
       * Now is a good time to set the collection (a published value)
       * that we'll use on operations for this widget. There's no
       * way to get from model to collection except through the store.
       */
      //var col = new XT.Collection();
      var Klass = new XT.Collection().getObjectByName(type);
      this.setBaseCollection(new Klass());

      /**
       * Populate the input with the applicable field
       */
      this.$.nameField.setValue(this.getBaseObject().get(this.getTitleField()));
    },
    doInputChanged: function (inSender, inEvent) {
      var queryDesc = {
        query: {
          conditions: this.getTitleField() + " BEGINS_WITH {frag}",
          parameters: { frag: inSender.getValue() }
        }
      };
      this.getBaseCollection().fetch( /* queryDesc */ );
    },
    /**
     * Every object has a field that is the main one for display. These are kept in
     * the XV.RelationalWidgetTitleFields hash. This function gets the value of that
     * has with the key of this type of model.
     */
    getTitleField: function () {
      return XV.RelationalWidgetTitleFields[this.getBaseObject().recordType];
    },
    doIconTapped: function () {
      // TODO: icon tapped
      this.$.gearPopup.show();
    }
  });
}());
