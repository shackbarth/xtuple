/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, Globalize:true*/

(function () {

  var ROWS_PER_FETCH = 50;
  var FETCH_TRIGGER = 100;

  /**
    @name XV.ListItem
    @class Represents a single row in a list of rows.<br />
    Related: list, {@link XV.List}; row, XV.ListItem; cell, {@link XV.ListColumn}; data, {@link XV.ListAttr}
   */
  enyo.kind(/** @lends XV.ListItem# */{
    name: "XV.ListItem",
    classes: "xv-list-item",
    ontap: "itemTap",
    events: {
      onListItemMenuTap: "",
      onActionSelected: ""
    },
    create: function () {
      this.inherited(arguments);
      this.createComponent({
        name: "actionIconButton",
        kind: "onyx.IconButton",
        classes: "xv-list-gear-icon-button",
        src: "/assets/menu-icon-gear.png",
        showing: false,
        ontap: "actionTapped"
      });
    },
    actionTapped: function (inSender, inEvent) {
      this.doListItemMenuTap(inEvent);
      return true;
    },
    getActionIconButton: function () {
      return this.$.actionIconButton;
    },
    setSelected: function (inSelected) {
      this.addRemoveClass("item-selected", inSelected);
    }
  });

  /**
    @name XV.ListColumn
    @class Represents a cell within a row of a list.<br />
    Related: list, {@link XV.List}; row, {@link XV.ListItem}; cell, XV.ListColumn; data, {@link XV.ListAttr}
   */
  enyo.kind(/** @lends XV.ListColumn# */{
    name: "XV.ListColumn",
    classes: "xv-list-column"
  });

  /**
    @name XV.ListAttr
    @class Holds the data within the cell of a row of a list.<br />
    Related: list, {@link XV.List}; row, {@link XV.ListItem}; cell {@link XV.ListColumn}; data, XV.ListAttr
   */
  enyo.kind(/** @lends XV.ListAttr# */{
    name: "XV.ListAttr",
    classes: "xv-list-attr",
    published: {
      attr: "",
      isKey: false
    }
  });


  /**
    @name XV.List
    @class Displays a scrolling list of rows.</br >
    Handles lazy loading. Passes in the first 50 items, and as one scrolls, passes more.<br />
    Use to display large lists, typically a collection of records retrieved from the database,
    for example a list of accounts, addresses, contacts, incidents, projects, and so forth.
	But can also be used to display lists stored elsewhere such as state or country abbreviations.<br />
    Related: list, XV.List; row, {@link XV.ListItem}; cell, {@link XV.ListColumn}; data, {@link XV.ListAttr}<br />
    Derived from <a href="http://enyojs.com/api/#enyo.List">enyo.List</a>.<br />
    Note: enyo.List includes a scroller; therefore, XV.List should not be placed inside a scroller.
    @extends enyo.List
   */
  enyo.kind(/** @lends XV.List# */{
    name: "XV.List",
    kind: "List",
    classes: "xv-list",
    /**
     * Published fields
     * @type {Object}
     *
     * @property {Boolean} canAddNew
     *
     * @property {Number} fetchCount
     *   Represents the number of times this list has been fetched on. Useful for
     *   correctly ordering asynchronous responses.
     * @property {Array} actions. Array of objects. What actions
     *   that we allow on the list item? Currently supported fields of the object are
       name {String} The name of the action
       label {String} Menu item label. Default ("_" + name).loc()
       notify {Boolean} Do we want to verify with the user? Default true.
       notifyMessage {String} Overrides default notify message. optional.
       prerequisite {String} the name of an editeable-model class method that will
        verify if the user
        can perform this action on this item. Asyncronous. First param is a callback
        function that must be called with true or false, even if syncronous. Leave
        this out if the user can always take the action.
       method {String} the name of an enyo method in XV.FooList, or a class method
        on the editable model.
       isViewMethod {Boolean}
     * @property {String} label
     */
    published: {
      label: "",
      collection: null,
      fetchCount: 0,
      filterDescription: "",
      actions: null,
      exportActions: null,
      navigatorActions: null,
      query: null,
      isFetching: false,
      isMore: true,
      parameterWidget: null,
      canAddNew: true,
      value: null,
      allowPrint: false
    },
    events: {
      onExportList: "",
      onItemTap: "",
      onPrintList: "",
      onWorkspace: ""
    },
    fixedHeight: true,
    handlers: {
      onActionSelected: "actionSelected",
      onModelChange: "modelChanged",
      onListItemMenuTap: "transformListAction",
      onSetupItem: "setupItem"
    },
    /**
      A list item has been selected. Delegate to the method cited
      in the action, and pass it an object with the relevant attributes.
    */
    actionSelected: function (inSender, inEvent) {
      this[inEvent.action.method](inEvent);
    },
    /**
     @todo Document the collectionChanged method.
     */
    collectionChanged: function () {
      var collection = this.getCollection(),
        Klass = collection ? XT.getObjectByName(collection) : false;

      if (Klass) {
        this.setValue(new Klass());
      } else {
        this.setValue(null);
      }
    },
    /**
     @todo Document the create method.
     */
    create: function () {
      var actions = this.getActions() || [],
        deleteAction = _.findWhere(actions, {"name": "delete"}),
        that = this,
        collection,
        Klass,
        method;
      this._actionPermissions = [];
      this._haveAllAnswers = [];
      this.inherited(arguments);
      this.collectionChanged();

      collection = this.getValue();
      Klass = collection ? collection.model : false;
      method = Klass && Klass.prototype.couldDestroy ? "couldDestroy" : "canDestroy";

      // add the delete action if it's not already there
      if (!deleteAction) {
        actions.push({
          name: "delete",
          prerequisite: method,
          notifyMessage: "_confirmDelete".loc() + " " + "_confirmAction".loc(),
          method: "deleteItem",
          isViewMethod: true
        });
      }
      this.setActions(actions);
    },
    /**
     @todo Document the getModel method.
     */
    getModel: function (index) {
      return this.getValue().models[index];
    },
    getExportActions: function () {
      var actions = this.exportActions || [],
        canExport = !XM.currentUser.get("disableExport"),
        exportAction =  canExport ? _.findWhere(actions, {"name": "export"}) : true,
        printAction = XT.reporting && this.getAllowPrint() && canExport ?
          _.findWhere(actions, {"name": "print"}) : true;

      // Handle default navigator actions
      if (!exportAction) {
        actions.push({name: "export"});
      }
      if (!printAction) {
        actions.push({name: "print"});
      }
      this.exportActions = actions;
      return actions;
    },
    deleteItem: function (inEvent) {
      var collection = this.getValue(),
        imodel = inEvent.model,
        model = imodel,
        fetchOptions = {},
        that = this,
        attrs = {},
        Klass;

      if (imodel instanceof XM.Info) {
        Klass = XT.getObjectByName(model.editableModel);
        attrs[Klass.prototype.idAttribute] = model.id;
        model = Klass.findOrCreate(attrs);
      }

      fetchOptions.success = function (result) {
        var destroyOptions = {};
        destroyOptions.success = function (result) {
          collection.remove(imodel);
          that.fetched();
          if (inEvent.done) {
            inEvent.done();
          }
        };
        destroyOptions.error = function (model, err, options) {
          XT.log("error destroying model from list", JSON.stringify(err));
        };
        model.destroy(destroyOptions);
      };
      model.fetch(fetchOptions);
    },
    /**
     @todo Document the getSearchableAttributes method.
     */
    getSearchableAttributes: function () {
      var model = this.getValue().model;
      return model.getSearchableAttributes ? model.getSearchableAttributes() : [];
    },
     /**
      @todo Document the getWorkspace method.
      */
    getWorkspace: function () {
      var collection = this.getCollection(),
        Klass = collection ? XT.getObjectByName(collection) : null,
        recordType = Klass ? Klass.prototype.model.prototype.recordType : null;
      return XV.getWorkspace(recordType);
    },
    export: function () {
      this.doExportList();
    },
    /**
     @todo Document the fetch method.
     */
    fetch: function (options) {
      var that = this,
        query = this.getQuery() || {},
        success,
        fetchIndex = this.getFetchCount() + 1;

      this.setFetchCount(fetchIndex);

      options = options ? _.clone(options) : {};
      options.showMore = _.isBoolean(options.showMore) ?
        options.showMore : false;
      success = options.success;

      // Lazy Loading
      if (options.showMore) {
        query.rowOffset += ROWS_PER_FETCH;
        options.update = true;
        options.add = true;
        options.remove = false;
      } else {
        query.rowOffset = 0;
        query.rowLimit = ROWS_PER_FETCH;
      }

      _.extend(options, {
        success: function (resp, status, xhr) {
          if (fetchIndex < that.getFetchCount()) {
            // this is an earlier query that's been running so long
            // that a more recent query has already been called. Do not
            // process or render.
            return;
          }
          that.fetched();
          if (success) { success(resp, status, xhr); }
        },
        query: query
      });
      this.getValue().fetch(options);
    },
    /**
     @todo Document the fetched method.
     */
    fetched: function () {
      var query = this.getQuery() || {},
        offset = query.rowOffset || 0,
        limit = query.rowLimit || 0,
        count = this.getValue().length,
        isMore = limit ?
          (offset + limit <= count) && (this.getCount() !== count) : false,
        rowsPerPage;
      this.isMore = isMore;
      this.fetching = false;

      // Reset the size of the list
      this.setCount(count);

      // Hack: Solves scroll problem for small number of rows
      // but doesn't seem quite right
      rowsPerPage = count && 50 > count ? count : 50;
      if (rowsPerPage !== this.rowsPerPage) {
        this.setRowsPerPage(rowsPerPage);
      }
      if (offset) {
        this.refresh();
      } else {
        this.reset();
      }
      this._maxTop = this.getScrollBounds().maxTop;
    },
    /**
      Returns whether all actions on the list have been determined
      to be available or not on a given index.

      @param {Number} index
      @returns {Boolean}
    */
    haveAllAnswers: function (index) {
      if (this._haveAllAnswers[index]) { return true; }
      var that = this,
        permissions = that._actionPermissions[index],
        ret;
      if (_.isEmpty(permissions)) { return false; }
      ret = _.reduce(this.getActions(), function (memo, action) {
        return memo && _.isBoolean(permissions[action.name]);
      }, true);
      if (ret) { this._haveAllAnswers[index] = true; }
      return ret;
    },
    /**
     @todo Document the itemTap method.
     */
    itemTap: function (inSender, inEvent) {
      if (!this.getToggleSelected() || inEvent.originator.isKey) {
        inEvent.list = this;
        this.doItemTap(inEvent);
      }
    },
    /**
      When a model changes, we are notified. We check the list to see if the
      model is of the same recordType. If so, we check to see if the newly
      changed model should still be on the list, and refresh appropriately.
     */
    modelChanged: function (inSender, inEvent) {
      var that = this,
        workspace = this.getWorkspace(),
        model,
        Klass = XT.getObjectByName(this.getCollection()),
        checkStatusCollection,
        checkStatusParameter,
        checkStatusQuery;

      // If the model that changed was related to and exists on this list
      // refresh the item. Remove the item if appropriate
      workspace = workspace ? XT.getObjectByName(workspace) : null;
      if (workspace && workspace.prototype.model === inEvent.model &&
          this.getValue() && typeof Klass === 'function') {
        model = this.getValue().get(inEvent.id);

        // cleverness: we're going to see if the model still belongs in the collection by
        // creating a new query that's the same as the current filter but with the addition
        // of filtering on the id. Any result means it still belongs. An empty result
        // means it doesn't.

        // clone the query so as not to change the real thing with this check.
        checkStatusQuery = JSON.parse(JSON.stringify(this.getQuery()));
        checkStatusParameter = { attribute: this.getValue().model.prototype.idAttribute, operator: "=", value: inEvent.id};
        if (checkStatusQuery.parameters) {
          checkStatusQuery.parameters.push(checkStatusParameter);
        } else {
          checkStatusQuery.parameters = [checkStatusParameter];
        }

        checkStatusCollection = new Klass();
        checkStatusCollection.fetch({
          query: checkStatusQuery,
          success: function (collection, response) {
            // remove the old model no matter the query result
            if (model) {
              that.getValue().remove(model);
            }

            if (response.length > 0) {
              // this model should still be in the collection. Refresh it.

              that.getValue().add(response[0], {silent: true});
            }
            if (that.getCount() !== that.getValue().length) {
              that.setCount(that.getValue().length);
            }
            that.refresh();
            if (inEvent.done) {
              inEvent.done();
            }
          },
          error: function (collection, error) {
            XT.log("Error checking model status in list");
          }
        });
      }
    },
    print: function () {
      this.doPrintList();
    },
    /**
      Makes sure the collection can handle the sort order
      defined in the query.
    */
    queryChanged: function () {
      var query = this.getQuery();
      if (this.getValue() && query.orderBy) {
        this.getValue().comparator = function (a, b) {
          var aval,
            bval,
            attr,
            numeric,
            descending,
            i;
          for (i = 0; i < query.orderBy.length; i++) {
            attr = query.orderBy[i].attribute;
            numeric = query.orderBy[i].numeric;
            descending = query.orderBy[i].descending;
            aval = query.orderBy[i].descending ? b.getValue(attr) : a.getValue(attr);
            bval = query.orderBy[i].descending ? a.getValue(attr) : b.getValue(attr);
            aval = numeric ? aval - 0 : aval;
            bval = numeric ? bval - 0 : bval;
            if (aval !== bval) {
              return aval > bval ? 1 : -1;
            }
          }
          return 0;
        };
      }
    },
    /**
      Reset actions on a give index so permission checks will be regenerated.

      @param {Number} Index
    */
    resetActions: function (index) {
      this._actionPermissions[index] = {};
      this._haveAllAnswers[index] = undefined;
    },
     /**
      Manages lazy loading of items in the list.
      */
    scroll: function (inSender, inEvent) {
      var r = this.inherited(arguments),
        options = {},
        max;
      if (!this._maxTop) { return r; }

      // Manage lazy loading
      max = this._maxTop - this.rowHeight * FETCH_TRIGGER;
      if (this.isMore && !this.fetching && this.getScrollPosition() > max) {
        this.fetching = true;
        options.showMore = true;
        this.fetch(options);
      }

      return r;
    },
     /**
      @todo Document the setupItem method.
      */
    setupItem: function (inSender, inEvent) {
      var index = inEvent.index,
        isSelected = inEvent.originator.isSelected(index),
        model = this.getValue().models[index],
				prev,
				next,
        isActive = model.getValue ? model.getValue('isActive') : true,
        isNotActive = _.isBoolean(isActive) ? !isActive : false,
        actionIconButton = this.$.listItem.getActionIconButton(),
        toggleSelected = this.getToggleSelected(),
        actions = this.getActions(),
        that = this,
        prop,
        obj,
        isPlaceholder,
        view,
        value,
        formatter,
        attr,
        classes,
        name,
        showd,

        // Callback to let us know if we can do an action. If we have
        // all the answers, enable the action icon.
        callback = function (response) {
          that._actionPermissions[index][name] = response;
          // Handle asynchronous result re-rendering
          if (that.haveAllAnswers(index)) {
            that.renderRow(index);
          }
        };

      // Loop through all attribute container children and set content
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop)) {
          obj = this.$[prop];
          if (obj.isKey) {
            classes = toggleSelected ? "bold hyperlink" : "bold";
            obj.addRemoveClass(classes, true);
          }
          if (obj.headerAttr) {
            attr = obj.headerAttr;
            prev = index ? this.getValue().models[index - 1] : false;
            showd = !prev || model.getValue(attr) !== prev.getValue(attr);
            this.$.header.canGenerate = showd;
          //Still need to do some work here to get the list lines and header to display/not display correctly
          //  this.$.header.applyStyle("border-top", showd ? "none" : null);
          }
          if (obj.footerAttr) {
            attr = obj.footerAttr;
            next = index ? this.getValue().models[index + 1] : false;
            showd = !next || model.getValue(attr) !== next.getValue(attr);
            this.$.footer.canGenerate = showd;
          }
          if (obj.headerAttr) {
            attr = this.$[prop].headerAttr;
            prev = index ? this.getValue().models[index - 1] : false;
            showd = !prev || model.getValue(attr) !== prev.getValue(attr);
            this.$.header.canGenerate = showd;
			//Still need to do some work here to get the list lines and header to display/not display correctly
            //  this.$.header.applyStyle("border-top", showd ? "none" : null);
          }
          if (obj.footerAttr) {
            attr = this.$[prop].footerAttr;
            next = index ? this.getValue().models[index + 1] : false;
            showd = !next || model.getValue(attr) !== next.getValue(attr);
            this.$.footer.canGenerate = showd;
          }
          if (obj.getAttr) {
            view = obj;
            isPlaceholder = false;
            attr = obj.getAttr();
            value = model.getValue ? model.getValue(attr) : model.get(attr);
            formatter = view.formatter;
            if (!value && view.placeholder) {
              value = view.placeholder;
              isPlaceholder = true;
            }
            view.addRemoveClass("placeholder", isPlaceholder);
            if (formatter) {
              value = this[formatter](value, view, model);
            }
            if (value && value instanceof Date) {
              value = XT.date.applyTimezoneOffset(value, true);
              value = Globalize.format(value, 'd');
            }
            view.setContent(value);
          }
        }
      }

      // Inactive
      this.$.listItem.addRemoveClass("inactive", isNotActive);

      // Selection
      if (toggleSelected) {
        this.$.listItem.addRemoveClass("item-selected", isSelected);

        // typically we want to show the action icon if it's selected and EITHER:
        // the record can be deleted
        // the list has other actions allowed on the action icon button
        if (!isSelected || !actions.length) {
          actionIconButton.applyStyle("display", "none");
          this.resetActions(index);
        } else if (this.haveAllAnswers(index)) {
          actionIconButton.applyStyle("opacity", "1");

        // Check availability of actions
        } else {
          actionIconButton.applyStyle("display", "inline-block"); // always show gear
          actionIconButton.applyStyle("opacity", ".6"); // default to a disabled appearance
          this.resetActions(index);
          _.each(actions, function (action) {
            var prerequisite = action.prerequisite;
            name = action.name;
            if (!prerequisite) {
              that._actionPermissions[index][name] = true;
              return;
            }

            if (model instanceof XM.Info && !model[prerequisite]) {
              XT.getObjectByName(model.editableModel)[prerequisite](model, callback);
            } else {
              model[prerequisite](callback);
            }
          });
        }
      }

      return true;
    },
     /**
      @todo Document the setQuery method.
      */
    setQuery: function () {
      var old = _.clone(this.query);
      this.inherited(arguments);
      // Standard call doesn't do deep comparison
      if (_.isEqual(old, this.query)) {
        this.queryChanged();
      }
    },
    /**
      Add information onto the inEvent object of the list item menu
      as it flies by
     */
    transformListAction: function (inSender, inEvent) {
      var index = inEvent.index,
        model = this.getValue().models[index];

      if (!this.haveAllAnswers(index)) {
        return true;
      }

      inEvent.model = model;
      inEvent.actions = this.actions;
      inEvent.actionPermissions = this._actionPermissions[index];
    }
  });

}());
