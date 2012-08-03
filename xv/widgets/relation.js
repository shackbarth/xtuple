/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.RelationWidget",
    kind: enyo.Control,
    published: {
      value: null,
      model: null,
      collection: null,
      keyAttribute: "number",
      nameAttribute: "name",
      descripAttribute: ""
    },
    events: {
      onFieldChanged: ""
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
      if (this.getModel()) { this.modelChanged(); }
    },
    modelChanged: function () {
      var model = this.getModel(),
        collection = this.getCollection(),
        Klass;
      Klass = XM.Model.getObjectByName(model);
      this._model = new Klass();
      Klass = XM.Model.getObjectByName(collection);
      this._collection = new Klass();
    },
    keyUp: function (inSender, inEvent) {
      var query,
        value = inSender.getValue(),
        menu = this.$.autocompleteMenu;
      if (value) {
        query = {
          parameters: [{
            attribute: this.getKeyAttribute(),
            operator: "BEGINS_WITH",
            value: inSender.getValue()
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
      model: "XM.AccountInfo",
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
      model: "XM.ItemInfo",
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
      model: "XM.UserAccountInfo",
      collection: "XM.UserAccountInfoCollection",
      keyAttribute: "username",
      nameAttribute: "properName"
    }
  });
  
}());
