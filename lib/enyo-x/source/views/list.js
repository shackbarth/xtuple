/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
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
      onConvertItem: "",
      onDeleteItem: ""
    },
    create: function () {
      this.inherited(arguments);
      this.createComponent({
        name: "gearIconButton",
        kind: "onyx.IconButton",
        classes: "xv-list-gear-icon-button",
        src: "/client/lib/enyo-x/assets/menu-icon-gear.png",
        showing: false,
        ontap: "gearTapped"
      });
    },
    gearTapped: function (inSender, inEvent) {
      this.doListItemMenuTap(inEvent);
      return true;
    },
    getGearIconButton: function () {
      return this.$.gearIconButton;
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
     * @property {Array} actions. Array of strings. What actions
     *   that we allow on the list item?
     * @property {String} label
     */
    published: {
      label: "",
      collection: null,
      fetchCount: 0,
      filterDescription: "",
      actions: [],
      query: null,
      isFetching: false,
      isMore: true,
      parameterWidget: null,
      canAddNew: true,
      value: null
    },
    events: {
      onItemTap: "",
      onWorkspace: ""
    },
    fixedHeight: true,
    handlers: {
      onDeleteItem: "deleteItem",
      onModelChange: "modelChanged",
      onListItemMenuTap: "transformListItemMenuEvent",
      onSetupItem: "setupItem"
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
      this.inherited(arguments);
      this.collectionChanged();
    },
    /**
     @todo Document the getModel method.
     */
    getModel: function (index) {
      return this.getValue().models[index];
    },
    deleteItem: function (inSender, inEvent) {
      var index = inEvent.index,
          collection = this.getValue(),
          imodel = collection.at(index),
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
          },
          error: function (collection, error) {
            XT.log("Error checking model status in list");
          }
        });
      }
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
        hasDeletePrivileges = model instanceof XM.Info ? model.couldDelete() : model.canDelete ? model.canDelete() : false,
        isActive = model.getValue ? model.getValue('isActive') : true,
        isNotActive = _.isBoolean(isActive) ? !isActive : false,
        gearIconButton = this.$.listItem.getGearIconButton(),
        toggleSelected = this.getToggleSelected(),
        that = this,
        options = {},
        prop,
        isPlaceholder,
        view,
        value,
        formatter,
        attr,
        classes;

      // Loop through all attribute container children and set content
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop)) {
          if (this.$[prop].isKey) {
            classes = toggleSelected ? "bold hyperlink" : "bold";
            this.$[prop].addRemoveClass(classes, true);
          }
          if (this.$[prop].getAttr) {
            view = this.$[prop];
            isPlaceholder = false;
            attr = this.$[prop].getAttr();
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
        // typically we want to show the gear icon if it's selected and EITHER:
        // the record can be deleted
        // the list has other actions allowed on the gear

        // Note that even if the list has other actions, we still need to check
        // (asynchronously) to see if the record is used, just so we know whether
        // to give the user a delete menu option if they click the gear.
        if (!gearIconButton || !isSelected) {
          gearIconButton.applyStyle("display", "none");

        } else if (gearIconButton && isSelected && hasDeletePrivileges) {
          // Need to find out if this record is "used" to determine whether to show the delete button
          // That's an async function, so re-render row and reprocess once we have data.
          if (!this._used) { this._used = {}; }
          if (!_.isBoolean(this._used[index])) {
            options.success = function (used) {
              that._used[index] = used;
              if (!used) {
                that.renderRow(index);
              }
            };
            // the static place we're going to check used does not have access to the model databaseType
            // so we have to put it in here.
            options.databaseType = model.databaseType;
            if (model instanceof XM.Info) {
              XT.getObjectByName(model.editableModel).used(model.id, options);
            } else {
              model.used(options);
            }
          }

          gearIconButton.applyStyle("display",
            that._used[index] === false || this.actions.length > 0 ? "inline-block" : "none");
          //this._used[index] = undefined; // Don't keep stale information

        } else {
          gearIconButton.applyStyle("display", this.actions.length > 0 ? "inline-block" : "none");
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
    transformListItemMenuEvent: function (inSender, inEvent) {
      var index = inEvent.index,
        model = this.getValue().models[index],
        hasDeletePrivileges = model instanceof XM.Info ? model.couldDelete() : model.canDelete ? model.canDelete() : false,
        isUsed = this._used[index];

      inEvent.allowDelete = hasDeletePrivileges && !isUsed;
      inEvent.actions = this.actions;
    }
  });

}());
