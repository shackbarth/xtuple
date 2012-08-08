/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.RelationWidget",
    kind: enyo.Control,
    classes: "xv-inputwidget xv-relationwidget",
    published: {
      label: "",
      value: null,
      collection: null,
      keyAttribute: "number",
      nameAttribute: "name",
      descripAttribute: ""
    },
    events: {
      onValueChange: ""
    },
    components: [
      {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
        components: [
        {name: "label", content: "", classes: "xv-label"},
        {name: 'input', kind: "onyx.Input", onkeyup: "keyUp",
          onkeydown: "keyDown", onblur: "receiveBlur"},
        {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
          {kind: "onyx.IconButton", src: "assets/menu-icon-search.png"},
          {name: 'popupMenu', kind: "onyx.Menu",
            components: [
            {content: "_search".loc(), value: 'search'},
            {content: "_open".loc(), value: 'open'},
            {content: "_new".loc(), value: 'new'}
          ]}
        ]},
        {kind: "onyx.MenuDecorator", classes: "xv-relationwidget-completer",
          onSelect: "relationSelected", components: [
          {kind: "onyx.Menu", name: "autocompleteMenu", modal: false}
        ]}
      ]},
      {name: "name", classes: "xv-relationwidget-description"},
      {name: "description", classes: "xv-relationwidget-description"}
    ],
    autocomplete: function () {
      var key = this.getKeyAttribute(),
        attr = this.getValue() ? this.getValue().get(key) : "",
        value = this.$.input.getValue(),
        query;

      if (value && value !== attr) {
        query = {
          parameters: [{
            attribute: key,
            operator: "BEGINS_WITH",
            value: value,
            rowLimit: 1
          }],
          orderBy: [{
            attribute: key
          }]
        };
        this._collection.fetch({
          success: enyo.bind(this, "_fetchSuccess"),
          query: query
        });
      } else if (!value) {
        this.setValue(null);
      }
    },
    clear: function (options) {
      this.setValue(null, options);
    },
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();
      this.labelChanged();
    },
    collectionChanged: function () {
      var collection = this.getCollection(),
        Klass = collection ? XM.Model.getObjectByName(collection) : null;
      if (!Klass) { return; }
      this._collection = new Klass();
    },
    itemSelected: function (inSender, inEvent) {
      var action = inEvent.originator.value,
        model,
        listKind;
      switch (action)
      {
      case 'search':
        listKind = this.kind.replace("RelationWidget", "") + "InfoList";
        this.bubble("search", { eventName: "search", options: { listKind: listKind, source: this }});
        break;
      case 'open':
        model = this.getValue();
        this.bubble("workspace", {eventName: "workspace", options: model});
        break;
      case 'new':
        model = new this._collection.model();
        this.bubble("workspace", {eventName: "workspace", options: model});
        break;
      }
    },
    keyDown: function (inSender, inEvent) {
      // If tabbed out...
      if (inEvent.keyCode === 9) {
        this.$.autocompleteMenu.hide();
        this.autocomplete();
      }
    },
    keyUp: function (inSender, inEvent) {
      var query,
        key = this.getKeyAttribute(),
        attr = this.getValue() ? this.getValue().get(key) : "",
        value = this.$.input.getValue(),
        menu = this.$.autocompleteMenu;

      // Look up if value changed
      if (value && value !== attr &&
          inEvent.keyCode !== 9) {
        query = {
          parameters: [{
            attribute: key,
            operator: "BEGINS_WITH",
            value: value,
            rowLimit: 10
          }],
          orderBy: [{
            attribute: key
          }]
        };
        this._collection.fetch({
          success: enyo.bind(this, "_collectionFetchSuccess"),
          query: query
        });
      } else {
        menu.hide();
      }
    },
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.name).loc());
      this.$.label.setContent(label + ":");
      this.$.input.setPlaceholder(label);
    },
    receiveBlur: function (inSender, inEvent) {
      this.autocomplete();
    },
    relationSelected: function (inSender, inEvent) {
      this.setValue(inEvent.originator.model);
      this.$.autocompleteMenu.hide();
      return true;
    },
    setValue: function (value, options) {
      options = options || {};
      var newId = value ? value.id : null,
        oldId = this.value ? this.value.id : null,
        key = this.getKeyAttribute(),
        name = this.getNameAttribute(),
        descrip = this.getDescripAttribute(),
        keyValue = "",
        nameValue = "",
        descripValue = "",
        inEvent = { value: value, originator: this };
      this.value = value;
      if (value && value.get) {
        keyValue = value.get(key) || "";
        nameValue = value.get(name) || "";
        descripValue = value.get(descrip) || "";
      }
      this.$.input.setValue(keyValue);
      this.$.name.setContent(nameValue);
      this.$.description.setContent(descripValue);

      // Only notify if selection actually changed
      if (newId !== oldId && !options.silent) { this.doValueChange(inEvent); }
    },
    /** @private */
    _collectionFetchSuccess: function () {
      var key = this.getKeyAttribute(),
        menu = this.$.autocompleteMenu,
        model,
        i;
      menu.destroyComponents();
      menu.controls = [];
      menu.children = [];
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
    _fetchSuccess: function () {
      var value = this._collection.length ? this._collection.models[0] : null;
      this.setValue(value);
    }

  });
}());
