/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.Combobox",
    kind: "XV.Input",
    classes: "xv-combobox",
    published: {
      keyAttribute: "name",
      collection: "XM.countries"
    },
    events: {
      onSearch: ""
    },
    components: [
      {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
        components: [
        {name: 'input', kind: "onyx.Input", classes: "xv-subinput",
          onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur"
        },
        {kind: "onyx.IconButton", src: "assets/relation-icon-search.png",
          ontap: "showList"},
        {kind: "onyx.MenuDecorator", classes: "xv-relationwidget-completer",
          onSelect: "itemSelected", components: [
          {kind: "onyx.Menu", name: "autocompleteMenu", modal: false}
        ]}
      ]}
    ],
    autocomplete: function () {
      var key = this.getKeyAttribute(),
        value = this.$.input.getValue(),
        models = this._collection ? this._collection.models : null,
        regexp = value ? new RegExp("^" + value, "i") : null,
        res;

      if (models && models.length && regexp) {
        res = _.find(models, function (model) {
          var value = model.get(key) || "";
          return value.match(regexp);
        });
      }
      if (res) { this.setValue(res.get(key)); }
    },
    buildList: function () {
      var key = this.getKeyAttribute(),
        regexp = new RegExp("^" + this.$.input.getValue(), "i"),
        menu = this.$.autocompleteMenu,
        models = this._collection ? this._collection.models : null,
        model,
        list,
        i;
      menu.destroyComponents();
      menu.controls = [];
      menu.children = [];
      // filter here...
      if (models && models.length) {
        list = _.filter(models, function (model) {
          var value = model.get(key) || "";
          return value.match(regexp);
        });
        
        for (i = 0; i < list.length; i++) {
          model = list[i];
          menu.createComponent({
            content: model.get(key)
          });
        }
        menu.reflow();
        menu.render();
        menu.show();
      } else {
        menu.hide();
      }
    },
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();
    },
    keyDown: function (inSender, inEvent) {
      // If tabbed out...
      if (inEvent.keyCode === 9) {
        this.$.autocompleteMenu.hide();
        this.autocomplete();
      }
    },
    keyUp: function (inSender, inEvent) {
      this.buildList();
    },
    collectionChanged: function () {
      var that = this,
        callback;
      this._collection = XT.getObjectByName(this.collection);
      // If we don't have data yet, try again after start up tasks complete
      if (!this._collection) {
        callback = function () {
          that.collectionChanged();
        };
        XT.getStartupManager().registerCallback(callback);
        return;
      }
    },
    itemSelected: function (inSender, inEvent) {
      this.setValue(inEvent.originator.content);
      this.$.autocompleteMenu.hide();
      return true;
    },
    receiveBlur: function (inSender, inEvent) {
      this.autocomplete();
    },
    showList: function (inSender, inEvent) {
      if (this.$.autocompleteMenu.showing) {
        this.$.autocompleteMenu.hide();
      } else {
        this.buildList();
        this.$.autocompleteMenu.show();
      }
    }
    
  });
  
}());
