/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true, strict:false */
/*global XT:true, XV:true, XM:true, Backbone:true, enyo:true, _:true, X:true */

(function () {

  /**
    @name XV.RelationWidget
    @class A picker control that implements a dropdown list of items which can be selected.<br />
    Unlike the {@link XV.PickerWidget}, the collection is not stored local to the widget.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Control">enyo.Control</a>.
    @extends enyo.Control
   */
  enyo.kind(
    /** @lends XV.RelationWidget# */{
    name: "XV.RelationWidget",
    // TODO: needs to inherit from InputWidget
    kind: "enyo.Control",
    classes: "xv-input xv-relationwidget",
    published: {
      attr: null,
      label: "",
      placeholder: "",
      value: null,
      list: "",
      collection: null,
      disabled: false,
      /**
        This can be a string or an array. If an array, all attributes
        will be searched, the first will be the value used in the widget.
      */
      keyAttribute: "number",
      sidecarAttribute: "",
      nameAttribute: "name",
      descripAttribute: "",
      additionalAttribute: "",
      // some widgets do not want to filter the completer based on the text of the input
      skipCompleterFilter: false,
      query: null, // whatever the subkind wants it to be,
      keySearch: false // Attach a  misc special parameter that can used by the server
    },
    events: {
      onSearch: "",
      onValueChange: "",
      onWorkspace: ""
    },
    handlers: {
      onModelChange: "modelChanged",
      onSelect: "itemSelected"
    },
    components: [
      {controlClasses: 'enyo-inline', components: [
        {name: "label", classes: "xv-label"},
        {kind: "onyx.InputDecorator", name: "decorator", classes: "xv-icon-decorator", components: [
          {name: "input", kind: "onyx.Input",
            onkeyup: "keyUp", onkeydown: "keyDown", onblur: "receiveBlur",
            onfocus: "receiveFocus"},
          {kind: "onyx.MenuDecorator", components: [
            {kind: "onyx.IconButton", classes: "icon-folder-open-alt"},
            {kind: "onyx.Menu", name: 'popupMenu', floating: true, components: [
              {kind: "XV.MenuItem", name: "searchItem", content: "_search".loc()},
              {kind: "XV.MenuItem", name: "openItem", content: "_open".loc(), disabled: true},
              {kind: "XV.MenuItem", name: "newItem", content: "_new".loc(), disabled: true}
            ]}
          ]},
          {name: "completer", kind: "XV.Completer"}
        ]}
      ]},
      {name: 'descriptionContainer', classes: 'xv-invisible-wrapper'}
    ],
    descriptionComponents: [
      {controlClasses: 'enyo-inline', components: [
        {name: "name", classes: "xv-description"},
        {name: "description", classes: "xv-description"}
      ]}
    ],
    /**
      Add a parameter to the query object on the widget. Parameter conventions should
      follow those described in the documentation for `XM.Collection`.

      @seealso XM.Collection
      @param {Object} Parameter
      @param {Boolean} Editable - default false. If true user can edit parameter selection in search.
      @returns {Object} Receiver
    */
    addParameter: function (param, editable) {
      var query = this.getQuery() || {},
        attr = param.attribute;

      // Update the query with new parameter
      if (query.parameters) {
        query.parameters = _.filter(query.parameters, function (p) {
          return !_.isEqual(p.attribute, attr);
        });
      } else { query.parameters = []; }
      query.parameters.push(param);
      this.setQuery(query);

      // Keep track of editable parameters
      if (!editable) {
        this._editableParams = _.without(this._editableParams, attr);
      } else if (!_.contains(this._editableParams, attr)) {
        this._editableParams.push(attr);
      }
      return this;
    },
    /**
      Fill the value with the selected choice.
     */
    autocomplete: function (callback) {
      var key = this.getKeyAttribute(),
        value = this.getValue(),
        inputValue = this.$.input.getValue(),
        changed,
        attrs = [];
      if (_.isString(key)) {
        attrs = value ? value.get(key) : "";
        changed = inputValue !== attrs;
      } else {
        // key must be array. Handle it.
        _.each(key, function (str) {
          var attr = value ? value.get(str) : "";
          attrs.push(attr);
        });
        // if changed or inputValue doesn't match an attr
        changed = changed || !(_.find(attrs, function (attr) {return inputValue === attr; }));
      }

      if (inputValue && changed) {
        this.fetchCollection(inputValue, 1, "_fetchSuccess");
      } else if (!inputValue) {
        this.setValue(null);
      }
    },
    /**
      Empty out the widget
     */
    clear: function (options) {
      this.setValue(null, options);
    },
    create: function () {
      this.inherited(arguments);
      this._editableParams = [];
      this.listChanged();
      this.labelChanged();
      this.disabledChanged();

      // create description components
      _.each(this.descriptionComponents, function (component) {
        this.$.descriptionContainer.createComponent(component, {owner: this});
      }, this);
    },
    /**
     @todo Document the disabledChanged method.
     */
    disabledChanged: function () {
      var disabled = this.getDisabled();
      this.$.input.setDisabled(disabled);
      this.$.searchItem.setDisabled(disabled);
      this.$.newItem.setDisabled(_couldNotCreate.apply(this) || disabled);
      this.$.label.addRemoveClass("disabled", disabled);

      // _.each(this.$.descriptionContainer.$, function (component) {
      //   component.addRemoveClass("disabled", disabled);
      // }, this);
      this.$.descriptionContainer.addRemoveClass('disabled', disabled);
    },
    /**
      Query the database.
      Used by both autocomplete and keyup.
     */
    fetchCollection: function (value, rowLimit, callbackName) {
      var key = this.getKeyAttribute(),
        query = {},
        param = {
          attribute: key,
          operator: "BEGINS_WITH",
          value: value,
          keySearch: this.keySearch
        },
        orderBy = [];


      // selectively copy this.getQuery() into a new object. We can't
      // use a dumb deep copy because the models in there might explode
      if (this.getQuery()) {
        if (this.getQuery().orderBy) {
          query.orderBy = JSON.parse(JSON.stringify(this.getQuery().orderBy));
        }
        if (this.getQuery().parameters) {
          query.parameters = [];
          _.each(this.getQuery().parameters, function (param) {
            query.parameters.push(param);
          });
        }
      }

      if (_.isString(key)) {
        orderBy = [{attribute: key}];
      } else {
        // key must be array
        _.each(key, function (attr) {
          orderBy.push({attribute: attr});
        });
      }

      // Add key search to our query
      if (query.parameters) {
        query.parameters.push(param);
      } else {
        query.parameters = [param];
      }

      // Add sort to our query
      if (query.orderBy) {
        query.orderBy = query.orderby.concat(orderBy);
      } else {
        query.orderBy = orderBy;
      }

      query.rowLimit = rowLimit || 10;

      this._collection.fetch({
        success: enyo.bind(this, callbackName),
        query: query
      });
    },
    /**
     @todo Document the focus method.
     */
    focus: function () {
      this.$.input.focus();
    },
    getFirstKey: function () {
      var key = this.getKeyAttribute();
      return _.isString(key) ? key : key[0];
    },
    /**
     @todo Document the getValueToString method.
     */
    getValueToString: function () {
      return this.value.getValue(this.getFirstKey());
    },
    /**
     @todo Revisit or remove after ENYO-1104 is resolved.
     */
    keyDown: function (inSender, inEvent) {
      this.inherited(arguments);

      // If tabbed out...
      inEvent.activator = this.$.decorator;
      if (inEvent.keyCode === 9) {
        this.$.completer.waterfall("onRequestHideMenu", inEvent);
        this.autocomplete();
      }
    },
    /**
      We will typically want to query the database upon every keystroke
     */
    keyUp: function (inSender, inEvent) {
      var key = this.getFirstKey(),
        attr = this.getValue() ? this.getValue().get(key) : "",
        value = this.$.input.getValue(),
        completer = this.$.completer;

      inEvent.activator = this.$.decorator;

      // Look up if value changed
      if (value && value !== attr && inEvent.keyCode !== 9) {
        this.fetchCollection(value, 10, "_collectionFetchSuccess");
      } else {
        completer.waterfall("onRequestHideMenu", inEvent);
      }
    },
    /**
     @todo Document the itemSelected method.
     */
    itemSelected: function (inSender, inEvent) {
      if (inEvent.originator.kind === 'onyx.MenuItem') {
        this.relationSelected(inSender, inEvent);
      } else {
        this.menuItemSelected(inSender, inEvent);
      }
      return true;
    },
    /**
     @todo Document the labelChanged method.
     */
    labelChanged: function () {
      var label = (this.getLabel() || ("_" + this.attr || "").loc());
      this.$.label.setContent(label + ":");
    },
    /**
     @todo Document the listChanged method.
     */
    listChanged: function () {
      var list = this.getList(),
        Collection,
        workspace;
      delete this._List;
      delete this._Workspace;

      // Get List class
      if (!list) { return; }
      this._List = XT.getObjectByName(list);

      // Get Workspace class
      workspace = this._List.prototype.getWorkspace();
      this._Workspace = workspace ? XT.getObjectByName(workspace) : null;

      // Setup collection instance
      Collection = this.getCollection() ?
        XT.getObjectByName(this.getCollection()) : null;
      if (!Collection) { return; }
      this._collection = new Collection();
    },
    /**
     @todo Document the menuItemSelected method.
     */
    menuItemSelected: function (inSender, inEvent) {
      var that = this,
        menuItem = inEvent.originator,
        list = this.getList(),
        model = this.getValue(),
        id = model ? model.id : null,
        workspace = this._List ? this._List.prototype.getWorkspace() : null,
        query = this.getQuery() || {},
        params = [],
        callback,
        conditions = [];

      // Convert query to parameter widget friendly
      _.each(query.parameters, function (param) {
        // If attribute isn't explicitly set to `editable` then hide any matching control
        // and pass as fixed condition.
        if (!_.contains(that._editableParams, param.attribute)) {
          params.push({name: param.attribute, showing: false});
          conditions.push(param);
        // Otherwise user can change value so pass default
        } else {
          params.push({name: param.attribute, value: param.value});
        }
      });

      switch (menuItem.name)
      {
      case 'searchItem':
        callback = function (value) {
          that.setValue(value);
        };
        this.doSearch({
          list: list,
          callback: callback,
          parameterItemValues: params,
          conditions: conditions,
          query: this.getQuery()
        });
        break;
      case 'openItem':
        this.doWorkspace({
          workspace: workspace,
          id: id,
          allowNew: false
        });
        break;
      case 'newItem':
        // Callback options on commit of the workspace
        // Find the model with matching id, fetch and set it.
        callback = function (model) {
          if (!model) { return; }
          var Model = that._collection.model,
            attrs = {},
            value,
            options = {};
          options.success = function () {
            that.setValue(value);
          };
          attrs[Model.prototype.idAttribute] = model.id;
          value = Model.findOrCreate(attrs);
          value.fetch(options);
        };
        this.doWorkspace({
          workspace: workspace,
          callback: callback,
          allowNew: false
        });
        break;
      }
    },
    /**
     @todo Document the modelChanged method.
     */
    modelChanged: function (inSender, inEvent) {
      var that = this,
        List = this._List,
        workspace = List.prototype.getWorkspace(),
        Workspace = workspace ? XT.getObjectByName(workspace) : null,
        options = { };
      // If the model that changed was related to and exists on this widget
      // refresh the local model.
      if (!List || !Workspace || !this.value) {
        return;
      }
      if (Workspace.prototype.model === inEvent.model &&
        this.value.id === inEvent.id) {
        options.success = function () {
          that.setValue(this.value);
        };
        this.value.fetch(options);
      }
    },
    /**
      When we get a placeholder we want to actually display it.
     */
    placeholderChanged: function () {
      var placeholder = this.getPlaceholder();
      this.$.input.setPlaceholder(placeholder);
    },
    /**
     @todo Document the receiveBlur method.
     */
    receiveBlur: function (inSender, inEvent) {
      this.autocomplete();
      this._hasFocus = false;
    },
    /**
     @todo Document the receiveFocus method.
     */
    receiveFocus: function (inSender, inEvent) {
      this._hasFocus = true;
      this._relationSelected = false;
    },
    /**
     @todo Document the relationSelected method.
     */
    relationSelected: function (inSender, inEvent) {
      this._relationSelected = true;
      inEvent.activator = this.$.decorator;
      this.setValue(inEvent.originator.model);
      this.$.completer.waterfall("onRequestHideMenu", inEvent);
      return true;
    },
    /**
      Removes a query parameter by attribute name from the widget's query object.

      @param {String} Attribute
      @returns {Object} Receiver
    */
    removeParameter: function (attr) {
      var query = this.getQuery();
      if (query && query.parameters) {
        query.parameters = _.filter(query.parameters, function (param) {
          return param.attribute !== attr;
        });
      }
      this.setQuery(query);
      this._editableParams = _.without(this._editableParams, attr);
      return this;
    },

    /**
      Programatically sets the value of this widget. If an id is set then the
      correct model will be fetched and this function will be called again
      recursively with the model.

      *In case of "order" models, each order's workspace is different depending on the order type.
      This causes the Workspace var to be null so get the value from the getWorkspace
      defined on the relation.js sub-kind.

      @param {XM.Model|Number|String} Value; can be a model or the id of a model.
      @param {Object} options
     */
    setValue: function (value, options) {
      options = options || {};
      var that = this,
        newId = value ? value.id : null,
        oldId = this.value ? this.value.id : null,
        key = this.getFirstKey(),
        name = this.getNameAttribute(),
        descrip = this.getDescripAttribute(),
        additional = this.getAdditionalAttribute(),
        inEvent = { value: value, originator: this },
        keyValue = "",
        nameValue = "",
        descripValue = "",
        additionalValue = "",
        Workspace = this._Workspace || (newId ? this._List.prototype.getWorkspace(value) : null),
        Model = this._collection.model,
        id,
        newValue,
        listName = this.getList(),
        List,
        ListModel,
        CollectionName,
        Collection,
        setPrivileges = function () {
          if (value && newId) {
            if (value.couldRead) {
              that.$.openItem.setDisabled(!value.couldRead());
            } else {
              that.$.openItem.setDisabled(!value.getClass().canRead());
            }
          }
        };

      if (listName) {
        List = XT.getObjectByName(listName);
        CollectionName = List.prototype.collection;
        Collection = XT.getObjectByName(CollectionName);
        ListModel = Collection.prototype.model;
      }

      // Make sure we get are setting the right kind of object here.
      // If we're being sent a number or a string, or something that's not a model
      // then we assume that's the key, we fetch the model, and call this function
      // again and give it the model for real.
      // Of course, if the value is falsy, we don't want to fetch a model,
      // we just want to continue (which will empty out the relation widget)
      if (value && (_.isNumber(value) || _.isString(value) || !(value instanceof Model))) {
        if (this.value === value || oldId === value) { return; }

        // If we got here, but it is not the list's model type, we can't work with this
        if (!ListModel || (value instanceof XM.Model && !(value instanceof ListModel))) {
          throw "The type of model passed is incompatible with this widget";
        }

        id = _.isObject(value) ? value.id : value;

        newValue = new Model();
        options = {
          id: id,
          success: function () {
            that.setValue(newValue);
          },
          error: function () {
            XT.log("Error setting relational widget value");
          }
        };
        newValue.fetch(options);
        return;
      }

      this.value = value;
      if (value && value.getValue) {
        keyValue = value.getValue(key) || "";
        nameValue = value.getValue(name) || "";
        descripValue = value.getValue(descrip) || "";
        additionalValue = value.getValue(additional) || "";
      }
      this.$.input.setValue(keyValue);

      this.$.name.setShowing(nameValue);
      this.$.name.setContent(nameValue);
      this.$.description.setShowing(descripValue);
      this.$.description.setContent(descripValue);

      // Only notify if selection actually changed
      if (newId !== oldId && !options.silent) { this.doValueChange(inEvent); }

      // Handle menu actions
      that.$.openItem.setShowing(Workspace);
      that.$.newItem.setShowing(Workspace);
      that.$.openItem.setDisabled(true);
      that.$.newItem.setDisabled(_couldNotCreate.apply(this) || this.disabled);
      if (Model && Workspace) {
        if (XT.session) {
          setPrivileges();
        } else {
          XT.getStartupManager().registerCallback(setPrivileges);
        }
      }
    },

    /** @private */
    _collectionFetchSuccess: function () {
      if (!this._hasFocus) { return; }
      var key = this.getKeyAttribute(),
        sidecarKey = this.getSidecarAttribute(),
        value = this.$.input.getValue(),
        models = this._collection.models,
        inEvent = { activator: this.$.decorator };
      if (models.length) {
        this.$.completer.buildList(key, value, models, sidecarKey, this.skipCompleterFilter);
        if (!this.$.completer.showing) {
          this.$.completer.waterfall("onRequestShowMenu", inEvent);
        }
        this.$.completer.adjustPosition();
      } else {
        this.$.completer.waterfall("onRequestHideMenu", inEvent);
      }
    },

    /** @private */
    _fetchSuccess: function () {
      if (this._relationSelected) { return; }
      var value = this._collection.length ? this._collection.models[0] : null,
        target = enyo.dispatcher.captureTarget;
      this.setValue(value);
      enyo.dispatcher.captureTarget = target;
    }

  });

  /** @private */
  var _couldNotCreate = function () {
    var Workspace = this._Workspace,
      Model = this._collection.model,
      couldNotCreate = true;

    if (Model && Model.couldCreate) {
      // model is a list item or relation
      couldNotCreate = !Model.couldCreate();
    } else if (Model) {
      // model is a first-class model
      couldNotCreate = !Model.canCreate();
    }
    return couldNotCreate;
  };

}());
