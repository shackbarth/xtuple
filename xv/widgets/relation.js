/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.RelationWidget",
    kind: enyo.Control,
    published: {
      value: null,
      collection: null,
      keyAttribute: "number",
      nameAttribute: "name",
      descripAttribute: ""
    },
    events: {
      onFieldChanged: ""
    },
    handlers: {
      onblur: "receiveBlur"
    },
    components: [
      {kind: "onyx.InputDecorator", style: "height: 27px", components: [
        {name: 'input', kind: "onyx.Input", onkeyup: "keyUp"},
        {kind: "onyx.MenuDecorator", components: [
          {kind: "onyx.IconButton", src: "images/menu-icon-search.png"},
          {name: 'popupMenu', kind: "onyx.Menu", ontap: "doOptionsSelected",
            components: [
            {content: "View"},
            {content: "Search"},
            {content: "Add"}
          ]}
        ]},
        {kind: "onyx.MenuDecorator", style: "left: -200px; top: 25px;",
          components: [
          {kind: "onyx.Menu", name: "autocompleteMenu", modal: false,
            ontap: "relationSelected"}
        ]}
      ]},
      {name: "name", content: ""},
      {name: "description", content: ""}
    ],
    create: function () {
      this.inherited(arguments);
      if (this.getCollection()) { this.collectionChanged(); }
    },
    collectionChanged: function () {
      var collection = this.getCollection(),
        Klass = XM.Model.getObjectByName(collection);
      this._collection = new Klass();
      this._model = new Klass.prototype.model();
    },
    keyUp: function (inSender, inEvent) {
      var query,
        key = this.getKeyAttribute(),
        attr = this.getValue() ? this.getValue().get(key) : "",
        value = inSender.getValue(),
        menu = this.$.autocompleteMenu;
      if (value && value !== attr) {
        query = {
          parameters: [{
            attribute: this.getKeyAttribute(),
            operator: "BEGINS_WITH",
            value: value
          }]
        };
        this._collection.fetch({
          success: enyo.bind(this, "_collectionFetchSuccess"),
          error: enyo.bind(this, "_collectionFetchError"),
          query: query
        });
      } else {
        menu.hide();
      }
      
      // Stop bubbling
      return true;
    },
    receiveBlur: function () {
      this.$.autocompleteMenu.hide();
    },
    relationSelected: function (inSender, inEvent) {
      console.log("HOLA");
      this.setValue(inEvent.originator.model);

      // XXX the container (i.e. the workspace) already catches a doFieldChanged event from this change,
      // but it gets processed before we set the model, above, and so it gets processed on the old
      // value. It's necessary to call the function again now that we've changed the value. We
      // should look at eliminating this redundancy.
      this.doFieldChanged(this, inEvent);
      this.$.autocompleteMenu.hide();
    },
    setValue: function (value) {
      var key = this.getKeyAttribute(),
        name = this.getNameAttribute(),
        descrip = this.getDescripAttribute(),
        keyValue = "",
        nameValue = "",
        descripValue = "";
      this.value = value;
      if (value && value.get) {
        keyValue = value.get(key) || "";
        nameValue = value.get(name) || "";
        descripValue = value.get(descrip) || "";
      }
      this.$.input.setValue(keyValue);
      this.$.name.setContent(nameValue);
      this.$.description.setContent(descripValue);
    },
    /** @private */
    _collectionFetchSuccess: function () {
      var key = this.getKeyAttribute(),
        menu = this.$.autocompleteMenu,
        model,
        i;
      menu.controls.length = 0;
      menu.children.length = 0;
      if (this._collection.length) {
        for (i = 0; i < this._collection.length; i++) {
          model = this._collection.models[i];
          menu.createComponent({
            content: model.get(key),
            model: model // for selection reference
          });
        }
        menu.reflow();
        menu.render();
        menu.show();
      } else {
        menu.hide();
      }
    },
    /** @private */
    _collectionFetchError: function () {
      this.log();
    }
    
  });
  
  // ..........................................................
  // ACCOUNT
  //
  
  enyo.kind({
    name: "XV.AccountRelation",
    kind: "XV.RelationWidget",
    published: {
      collection: "XM.AccountInfoCollection"
    }
  });
  
  // ..........................................................
  // ITEM
  //
  
  enyo.kind({
    name: "XV.ItemRelation",
    kind: "XV.RelationWidget",
    published: {
      collection: "XM.ItemInfoCollection",
      nameAttribute: "description1",
      descripAttribute: "description2"
    }
  });
  
  // ..........................................................
  // USER ACCOUNT
  //
  
  enyo.kind({
    name: "XV.UserAccountRelation",
    kind: "XV.RelationWidget",
    published: {
      collection: "XM.UserAccountInfoCollection",
      keyAttribute: "username",
      nameAttribute: "properName"
    }
  });
  
}());
