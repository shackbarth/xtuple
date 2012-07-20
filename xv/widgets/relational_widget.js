/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, XV:true, Backbone:true, enyo:true, _:true */
(function () {
  //"use strict";

  enyo.kind({
    name: "XV.RelationalWidget",
    kind: enyo.Control,
    published: {
      model: null,
      collection : null
    },
    events: {
      onModelUpdate: ""
    },
    components: [{
      kind: "onyx.InputDecorator",
      style: "height: 14px;",
      classes: "onyx-menu-toolbar",
      components: [


        {
          kind: "onyx.MenuDecorator",
          onSelect: "itemSelected",
          components: [
            //{content: "Split Popup menu", kind: "onyx.Button", style: "border-radius: 3px 0 0 3px;"},
            {
              kind: "onyx.Input",
              name: "nameField",
              onkeyup: "doInputChanged",
              style: "border: 0px;"
            },
            {
              kind: "onyx.Menu",
              name: "autocompleteMenu",
              components: [
                {content: ""}
              ],
              ontap: "doRelationSelected"
            }
          ]
        },
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
        // XXX this menu implementation is a mess and I hope it improves for production!
        /*
        {
          kind: "onyx.MenuDecorator",
          components: [
            { content: "popup", components: [
              { kind: "Image", src: "images/gear-icon.gif" }
            ]},
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
        },
        */
      ]
    }],
    doRelationSelected: function (inSender, inEvent) {
      // XXX hits xt1005 readonly error
      this.getModel().set(inEvent.originator.model);
      this.modelChanged(); // triggering this method will render the new model onscreen
      this.$.autocompleteMenu.hide();




      /**
       * Send up notice that there's been an update
       */
      this.doModelUpdate();

    },
    itemSelected: function (inSender, inEvent) {
      alert("Item selected");
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
     * render this object onto the name field
     */
    modelChanged: function () {

      // XXX: this was difficult. Can we live with my solution (4th try!)?

      /**
       * Now is a good time to set the collection (a published value)
       * that we'll use on operations for this widget.
       */

      // doesn't work: the collection from the store doesn't override the sync method
      //var try1 = Backbone.Relational.store.getCollection(this.getModel());

      // doesn't work: creates whole new collection, which fetch doesn't fill
      //var try2 = new XT.Collection(this.getModel());

      // does work, but how to unhardcode the type?
      //var try3 = new XM.ContactInfoCollection();

      /**
       * We only need to set the collection once, for the first time the model is
       * set, because any subsequent changes to the model (based on user input, say)
       * will keep the same modelType
       */
      if(!this.getCollection() ) {
        var recordType = this.getModel().recordType;
        // Well, this is magical, and I wish I knew a better way of doing this
        var collectionType = recordType.substring(3) + "Collection";
        this.setCollection(new XM[collectionType]());
      }
      /**
       * Populate the input with the applicable field
       */
      this.$.nameField.setValue(this.getModel().get(this.getTitleField()));
    },
    _collectionFetchSuccess: function () {
      this.log();
      var pocString = "";
      for (var i = 0; i < this.getCollection().length; i++) {
        var model = this.getCollection().models[i];
        pocString = pocString + model.get(this.getTitleField()) + ", ";
        // XXX I keep the model in the menuItem. This is a bit heavy, but it
        // allows us to easily update the base model when a menuItem is chosen.
        this.$.autocompleteMenu.createComponent( {
          content: model.get(this.getTitleField()),
          model: model
        });
      }
      this.$.autocompleteMenu.reflow();
      this.$.autocompleteMenu.render();
      console.log(pocString);
      this.$.autocompleteMenu.show();
    },
    _collectionFetchError: function () {
      this.log();
    },
    doInputChanged: function (inSender, inEvent) {
      console.log("input changed: " + inSender.getValue());

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
      return XV.util.getRelationalTitleFields[this.getModel().recordType];
    },
    doIconTapped: function () {
      // TODO: icon tapped
      this.$.gearPopup.show();
    }
  });
}());
