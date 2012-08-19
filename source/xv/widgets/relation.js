/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.RelationWidget",
    kind: enyo.Control,
    classes: "xv-inputwidget xv-relationwidget",
    published: {
      attr: null,
      label: "",
      placeholder: "",
      value: null,
      list: "",
      disabled: false,
      keyAttribute: "number",
      nameAttribute: "name",
      descripAttribute: ""
    },
    events: {
      onValueChange: "",
      onWorkspace: ""
    },
    handlers: {
      onModelChange: "modelChanged"
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-decorated-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {
            name: 'input',
            kind: "onyx.Input",
            classes: "xv-subinput",
            onkeyup: "keyUp",
            onkeydown: "keyDown",
            onblur: "receiveBlur"
          },
          {kind: "onyx.MenuDecorator", onSelect: "itemSelected", components: [
            {kind: "onyx.IconButton", src: "assets/relation-icon-search.png"},
            {name: 'popupMenu', kind: "onyx.Menu",
              components: [
              {kind: "XV.MenuItem", name: 'searchItem', content: "_search".loc()},
              {kind: "XV.MenuItem", name: 'openItem', content: "_open".loc(),
                disabled: true},
              {kind: "XV.MenuItem", name: 'newItem', content: "_new".loc(),
                disabled: true}
            ]}
          ]},
          {kind: "onyx.MenuDecorator", classes: "xv-relationwidget-completer",
            onSelect: "relationSelected", components: [
            {kind: "onyx.Menu", name: "autocompleteMenu", modal: false}
          ]}
        ]},
        {name: "name", classes: "xv-relationwidget-description"},
        {name: "description", classes: "xv-relationwidget-description"}
      ]}
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
            value: value
          }],
          rowLimit: 1,
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
      this.listChanged();
      this.labelChanged();
      this.disabledChanged();
    },
    disabledChanged: function () {
      var disabled = this.getDisabled();
      this.$.input.setDisabled(disabled);
    },
    itemSelected: function (inSender, inEvent) {
      var menuItem = inEvent.originator,
        List = this._List,
        model = this.getValue(),
        id = model ? model.id : null,
        workspace = List ? List.prototype.workspace : null,
        listKind;
      if (!List || !workspace) { return; }
      switch (menuItem.name)
      {
      case 'searchItem':
        listKind = this.kind.replace("RelationWidget", "") + "List";
        this.bubble("search", { eventName: "search", options: { listKind: listKind, source: this }});
        break;
      case 'openItem':
        this.doWorkspace({workspace: workspace, id: id});
        break;
      case 'newItem':
        this.doWorkspace({workspace: workspace});
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
            value: value
          }],
          rowLimit: 10,
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
      var label = (this.getLabel() || ("_" + this.attr || "").loc());
      this.$.label.setContent(label + ":");
    },
    listChanged: function () {
      var list = this.getList(),
        Collection;
      delete this._List;

      // Get List class
      if (!list) { return; }
      this._List = XT.getObjectByName(list);

      // Get Workspace class
      this._Workspace = this._List.prototype.workspace ?
        XT.getObjectByName(this._List.prototype.workspace) : null;

      // Setup collection instance
      Collection = this._List.prototype.collection ?
        XT.getObjectByName(this._List.prototype.collection) : null;
      if (!Collection) { return; }
      this._collection = new Collection();
    },
    modelChanged: function (inSender, inEvent) {
      var that = this,
        List = this._List,
        Workspace = List && List.prototype.workspace ?
          XT.getObjectByName(List.prototype.workspace) : null,
        options = {},
        model = this.getValue();
      // If the model that changed was related to and exists on this widget
      // refresh the local model.
      if (!List || !Workspace || !model) { return; }
      if (Workspace.prototype.model === inEvent.model &&
        model.id === inEvent.id) {
        options.success = function () {
          that.setValue(model);
        };
        model.fetch(options);
      }
    },
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.input.setPlaceholder(placeholder);
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
      var that = this,
        newId = value ? value.id : null,
        oldId = this.value ? this.value.id : null,
        key = this.getKeyAttribute(),
        name = this.getNameAttribute(),
        descrip = this.getDescripAttribute(),
        inEvent = { value: value, originator: this },
        keyValue = "",
        nameValue = "",
        descripValue = "",
        Workspace = this._Workspace,
        Model = Workspace && Workspace.prototype.model ?
          XT.getObjectByName(Workspace.prototype.model)  : null,
        recordType = Model ? Model.prototype.recordType : null,
        setPrivileges = function () {
          var options = {},
            params = {};
          // Need to request read priv. from the server
          if (newId) {
            options.success = function (resp) {
              that.$.openItem.setDisabled(!resp);
            };
            params.recordType = recordType;
            params.id = newId;
            XT.dataSource.dispatch('XM.Model', 'canRead', params, options);
            that.$.newItem.setDisabled(!Model.canCreate());
          }
        };
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

      // Handle privileges
      that.$.openItem.setDisabled(true);
      that.$.newItem.setDisabled(true);
      if (Model) {
        if (XT.session) {
          setPrivileges();
        } else {
          XT.getStartupManager().registerCallback(setPrivileges);
        }
      }
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
