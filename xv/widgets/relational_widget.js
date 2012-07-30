/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */
(function () {
  //"use strict";

  enyo.kind({
    name: "XV.RelationalWidget",
    kind: enyo.Control,
    published: {
      model: null,
      modelType: null,
      collection : null
    },
    events: {
      onFieldChanged: ""
    },
    components: [{
      kind: "onyx.InputDecorator",
      style: "height: 14px;",
      classes: "onyx-menu-toolbar",
      onchange: "doFieldLeft",
      components: [

        {
          kind: "onyx.MenuDecorator",
          components: [
            {
              kind: "onyx.Input",
              name: "nameField",
              onkeyup: "doKeyUp",
              style: "border: 0px;"
            },
            {
              kind: "onyx.Menu",
              name: "autocompleteMenu",
              // the menu must not be modal. If it is modal, then it
              // suppresses the capture of key events from the name field
              modal: false,
              components: [
                {content: ""}
              ],
              ontap: "doRelationSelected"
            }
          ]
        },
        {
          kind: "onyx.MenuDecorator",
          components: [
            { content: "popup", components: [
              { content: "V" }
            ]},
            {
              kind: "onyx.Menu",
              name: "optionsMenu",
              components: [
                { content: "View" },
                { content: "Search" },
                { content: "Add" }
              ],
              ontap: "doOptionsSelected"
            }
          ]
        }
      ]
    }],
    doRelationSelected: function (inSender, inEvent) {
      this.setModel(inEvent.originator.model);

      // XXX the container (i.e. the workspace) already catches a doFieldChanged event from this change,
      // but it gets processed before we set the model, above, and so it gets processed on the old
      // value. It's necessary to call the function again now that we've changed the value. We
      // should look at eliminating this redundancy.
      this.doFieldChanged(this, inEvent);
      this.$.autocompleteMenu.hide();

    },
    doFieldLeft: function (inSender, inEvent) {
      /*
      FIXME here's a curious bug: I want to monitor when the user leaves this widget
      so that we can (1) select the top menu option if it wasn't picked, or (2) clear
      out the field if there's no valid match. The problem is that if the user wants
      to select a value from the options, that fires this event first! And so the
      event of actually picking an option never happens.
      if (this.$.autocompleteMenu.children.length > 0) {
        this.$.nameField.setValue(this.$.autocompleteMenu.children[0].content);
        this.$.autocompleteMenu.children[0].doSelect();
      } else {
        this.$.nameField.setValue("");
      }
      this.$.autocompleteMenu.hide();
      this.render();
      */
    },
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    setValue: function (object) {
      this.setModel(object);
    },
    /**
     * A convenience function so that this object can be treated generally like an input
     */
    getValue: function () {
      return this.getModel();
    },
    /**
     * We're given the model type from the descriptor. Now's a good time to
     * set the collection object, because if the model is null there's
     * no other way to know that the collection type is.
     */
    modelTypeChanged: function () {
      // Well, this is magical, and I wish I knew a better way of doing this
      var collectionType = this.getModelType().substring(3) + "Collection";
      this.setCollection(new XM[collectionType]());
    },
    /**
     * render this object onto the name field
     */
    modelChanged: function () {
      /**
       * Populate the input with the applicable field. If there's no model chosen
       * just leave the field blank.
       */
      var displayValue = this.getModel() ? this.getModel().get(this.getTitleField()) : "";
      this.$.nameField.setValue(displayValue);
    },
    _collectionFetchSuccess: function () {
      this.log();
      /**
       * Start by clearing out the dropdown in case there's pre-existing elements
       */
      XV.util.removeAllChildren(this.$.autocompleteMenu);
      for (var i = 0; i < this.getCollection().length; i++) {
        var model = this.getCollection().models[i];
        /**
         *I keep the model in the menuItem. This is a bit heavy, but it
         * allows us to easily update the base model when a menuItem is chosen.
         */
        this.$.autocompleteMenu.createComponent({
          content: model.get(this.getTitleField()),
          model: model
        });
      }
      this.$.autocompleteMenu.reflow();
      this.$.autocompleteMenu.render();
      if (this.getCollection().length > 0) {
        this.$.autocompleteMenu.show();
      }
    },
    _collectionFetchError: function () {
      this.log();
    },

    doKeyUp: function (inSender, inEvent) {
      /**
       * Start by clearing out the dropdown in case there's pre-existing elements
       */
      XV.util.removeAllChildren(this.$.autocompleteMenu);

      var query = {
        parameters: [{
          attribute: this.getTitleField(),
          operator: "BEGINS_WITH",
          value: inSender.getValue()
        }]
      };
      this.getCollection().fetch({
        success: enyo.bind(this, "_collectionFetchSuccess"),
        error: enyo.bind(this, "_collectionFetchError"),
        query: query
      });

      // stop bubbling
      return true;
    },
    /**
     * Every object has a field that is the main one for display. These are kept in
     * the XV.RelationalWidgetTitleFields hash. This function gets the value of that
     * has with the key of this type of model.
     */
    getTitleField: function () {
      return XV.util.getRelationalTitleFields[this.getModelType()];
    },
    doOptionsSelected: function (inSender, inEvent) {
      var action = inEvent.originator.content.toLowerCase();
      if (action === 'add') {
        var modelType = this.getModelType();
        var emptyModel = new XM[XV.util.formatModelName(modelType)]();
        this.bubble("workspace", {eventName: "workspace", options: emptyModel });

      } else if (action === 'search') {
        alert("Not yet implemented");

      } else if (action === 'view') {
        if (this.getModel()) {
          this.bubble("workspace", {eventName: "workspace", options: this.getModel() });
        } else {
          alert("You must select a model");
        }
      }
    }
  });
}());
