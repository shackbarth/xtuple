/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, window: true*/

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
      isKey: false,
      isLayout: false
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
      allowPrint: false,
      // this property signifies that the list allows
      // searches via the input or parameter widget
      allowFilter: true,
      showDeleteAction: true
    },
    events: {
      onExportList: "",
      onItemTap: "",
      onPrintList: "",
      onSelectionChanged: "",
      onWorkspace: ""
    },
    fixedHeight: true,
    handlers: {
      onActionSelected: "actionSelected",
      onModelChange: "modelChanged",
      onListItemMenuTap: "transformListAction",
      onSelectionChanged: "selectionChanged",
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
      if (!deleteAction && this.getShowDeleteAction()) {
        actions.push({
          name: "delete",
          prerequisite: method,
          notifyMessage: "_confirmDelete".loc() + " " + "_confirmAction".loc(),
          method: "deleteItem",
          isViewMethod: true
        });
      }
      this.setActions(actions);

      this._selectedIndexes = [];
      this.createOverflowRow();
    },
    /**
      Creates an additional hidden row which
      can be used if more space is needed for
      columns added during layout changes.
    */
    createOverflowRow: function () {
      var columns = [],
        row = this.createComponent({
          kind: "XV.ListItem",
          name: "overflow",
          owner: this
        });

      // see how many columns are in the existing row
      // and create that number here
      _.each(this.$, function (col) {
        if (col.kind === "XV.ListColumn") {
          columns.push(
            {kind: "XV.ListColumn", classes: col.classes, components: [
              {kind: "XV.ListAttr", allowLayout: true, overflow: true,
                showPlaceholder: true}
            ]}
          );
        }
      });
      row.createComponents(columns, {owner: this});
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
        printAction = XT.session.config.biUrl && this.getAllowPrint() && canExport ?
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
    getSortActions: function () {
      var actions = this.sortActions || [],
        sortAction =  _.findWhere(actions, {"name": "sort"});

      // Handle default navigator actions
      if (!sortAction) {
        actions.push({name: "sort"});
      }
      this.sortActions = actions;
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

      fetchOptions.success = function () {
        var destroyOptions = {};
        destroyOptions.success = function () {
          collection.remove(imodel);
          that.fetched();
          if (inEvent.done) {
            inEvent.done();
          }
        };
        destroyOptions.error = function (model, err) {
          XT.log("error destroying model from list", JSON.stringify(err));
        };
        model.destroy(destroyOptions);
      };
      model.fetch(fetchOptions);
    },
    /**
     Returns an array of attributes from the model that can be used
      in a text-based search.
     */
    getSearchableAttributes: function () {
      var model = this.getValue().model;
      return model.getSearchableAttributes ? model.getSearchableAttributes() : [];
    },
    /**
      Returns a list of List Attribute kinds that are currently displayed
        in the list.
    */
    getCurrentListAttributes: function () {
      return _.map(_.filter(this.$, function (item) {
          return item.kind === "XV.ListAttr";
        }), function (item) {
          return item.attr;
        });
    },
    /**
      Returns a list of available attributes that can be used for sorting
        the list or adding as columns.
    */
    getDisplayAttributes: function () {
      var attributes,
        relations,
        model,
        relationModels;

      model = this.getValue().model;
      // strip out the ids
      attributes = _.without(model.getAttributeNames(), "id", "uuid") || [];
      // filter out characteristics and address because they have special
      // formatting concerns
      relations = _.filter(model.prototype.relations, function (relation) {
        return relation.key !== "characteristics" && relation.key !== "address";
      });

      // Return an array of the model names of the relation models
      relationModels =
        _.map(_.filter(relations, function (rel) {
          // Filter attributes for just relations
          return _.contains(attributes, rel.key);
        }), function (key) {
          var model = XT.getObjectByName(key.relatedModel);
          // For each related model, this removes the ids and formats the
          // attribute names in the relation.name format
          var mapping = _.map(_.without(model.getAttributeNames(), "id", "uuid"), function (name) {
            return key.key + "." + name;
          });
          return mapping;
        });

      attributes = _.difference(attributes, _.map(relations, function (rel) {
        return rel.key;
      }));

      // Loop through the relation models and concatenate the arrays of
      // attribute names.
      _.each(relationModels, function () {
        // combine the relation arrays
        attributes = attributes.concat(_.flatten(relationModels));
      });

      return _.uniq(attributes);
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
        success;

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
      If the attribute is equal to or exists as a child
      attribute, then it is returned.
    */
    findNameInAttr: function (attr, name) {
      return _.find(attr.split("."), function (s) {
        return s === name;
      });
    },
    /**
      Returns a placeholder translation string to be
      used as a placeholder if one is not specified.

      @param {String} attr
      @returns {String}
    */
    getPlaceholderForAttr: function (attr) {
      var attrs, str;
      if (attr.indexOf('.') !== -1) {
        attrs = attr.split(".");
        str = ("_" + attrs[0]).loc() + " " + ("_" + attrs[1]).loc();
      } else {
        str = ("_" + attr).loc();
      }
      return "_no".loc() + " " + str;
    },
    /**
      Returns whether all actions on the list have been determined
      to be available or not.

      @param {Number} index
      @returns {Boolean}
    */
    haveAllAnswers: function () {
      if (this._haveAllAnswers) { return true; }
      var that = this,
        permissions = that._actionPermissions,
        ret;
      if (_.isEmpty(permissions)) { return false; }
      ret = _.reduce(this.getActions(), function (memo, action) {
        return memo && _.isBoolean(permissions[action.name]);
      }, true);
      if (ret) { this._haveAllAnswers = true; }
      return ret;
    },
    /**
     @todo Document the itemTap method.
     */
    itemTap: function (inSender, inEvent) {
      if (!this.getToggleSelected() || inEvent.originator.isKey) {
        // If key tapped, make sure row is _deselected_
        // This tricks row into always being toggled on by subsequent
        // tap event
        if (inEvent.originator.isKey) {
          this.deselect(inEvent.index);
        }
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
      if (workspace && inEvent && workspace.prototype.model === inEvent.model &&
          this.getValue() && typeof Klass === "function") {
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
          error: function () {
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
            i;
          for (i = 0; i < query.orderBy.length; i++) {
            attr = query.orderBy[i].attribute;
            numeric = query.orderBy[i].numeric;
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
      Reset actions permission checks will be regenerated.

      @param {Number} Index
    */
    resetActions: function () {
      this._actionPermissions = {};
      this._haveAllAnswers = undefined;
    },
     /**
      Manages lazy loading of items in the list.
      */
    scroll: function () {
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
      Helper fuction that returns an array of indexes based on
      the current selection.

      @returns {Array}
    */
    selectedIndexes: function () {
      return _.keys(this.getSelection().selected);
    },
    /**
      Re-evaluates actions menu.
    */
    selectionChanged: function (inSender, inEvent) {
      var keys = this.selectedIndexes(),
        index = inEvent.index,
        collection = this.value,
        actions = this.actions,
        that = this;
      this.resetActions();

      // Loop through each action
      _.each(actions, function (action) {
        var prerequisite = action.prerequisite,
          permissions = that._actionPermissions,
          name = action.name,
          len = keys.length,
          counter = 0,
          model,
          idx,
          callback,
          i;

        // Callback to let us know if we can do an action. If we have
        // all the answers, enable the action icon.
        callback = function (response) {
          // If some other model failed, forget about it
          if (permissions[name] === false) { return; }

          // If even one selected model fails, then we can't do the action
          if (response) {
            counter++;

            // If we haven't heard back from all requests yet, wait for the next
            if (counter < len) {
              return;
            }
          }
          permissions[name] = response;

          // Handle asynchronous result re-rendering
          if (that.haveAllAnswers()) {
            that.renderRow(index);
          }
        };

        if (prerequisite) {
          // Loop through each selection model and check pre-requisite
          for (i = 0; i < keys.length; i++) {
            idx = keys[i] - 0;
            model = collection.at(idx);
            if (model instanceof XM.Info && !model[prerequisite]) {
              XT.getObjectByName(model.editableModel)[prerequisite](model, callback);
            } else {
              model[prerequisite](callback);
            }
          }
        } else {
          callback(true);
        }

      });
    },
     /**
      @todo Document the setupItem method.
      */
    setupItem: function (inSender, inEvent) {
      var index = inEvent.index,
        isSelected = inEvent.originator.isSelected(index),
        collection = this.value,
        model = collection.at(index),
        actionIconButton = this.$.listItem.getActionIconButton(),
        toggleSelected = this.getToggleSelected(),
        actions = this.getActions(),
        isActive,
        isNotActive,
        isItalic,
        isHyperlink,
        isBold,
        isPlaceholder,
        prev,
        next,
        prop,
        obj,
        view,
        value,
        formatter,
        attr,
        showd,
        ary;

      // It is possible in some cases where setupItem might
      // be called, but the inEvent index is not a model
      if (!model) {
        return true;
      }

      isActive = model.getValue ? model.getValue("isActive") : true;
      isNotActive = _.isBoolean(isActive) ? !isActive : false;

      // set the overflow row to be hidden by default
      this.$.overflow.setShowing(false);

      // Loop through all attribute container children and set content
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop)) {
          obj = this.$[prop];
          isItalic = obj.classes === "italic";
          isHyperlink = false;
          isBold = false;
          isPlaceholder = false;

          if (obj.isKey) {
            isBold = true;
            isHyperlink = toggleSelected;
          }
          if (obj.headerAttr) {
            attr = obj.headerAttr;
            prev = index ? this.getValue().models[index - 1] : false;
            showd = !prev || model.getValue(attr) !== prev.getValue(attr);
            this.$.header.canGenerate = showd;
            // Still need to do some work here to get the list lines and header to display correctly
            // this.$.header.applyStyle("border-top", showd ? "none" : null);
          }
          if (obj.footerAttr) {
            attr = obj.footerAttr;
            next = index ? this.getValue().models[index + 1] : false;
            showd = !next || model.getValue(attr) !== next.getValue(attr);
            this.$.footer.canGenerate = showd;
          }
          if (obj.overflow) {
            if (!_.isEmpty(obj.attr)) {
              this.$.overflow.setShowing(true);
            }
          }
          if (obj.getAttr) {
            view = obj;
            isPlaceholder = false;
            attr = obj.getAttr();
            value = model.getFormattedValue ? model.getFormattedValue(attr) : model.get(attr);
            formatter = view.formatter;
            if (!value) {
              // if the value is empty, and a placeholder is needed - show it
              if (attr && (view.placeholder || view.showPlaceholder)) {
                value = view.placeholder || this.getPlaceholderForAttr(attr);
                isPlaceholder = true;
              }
            } else if (this.findNameInAttr(attr, "name")) {
              isItalic = true;
            } else if (this.findNameInAttr(attr, "primaryEmail")) {
              isHyperlink = true;
              obj.ontap = "sendMail";
            } else if (this.findNameInAttr(attr, "phone")) {
              isHyperlink = true;
              obj.ontap = "callPhone";
            } else if (this.findNameInAttr(attr, "webAddress")) {
              isHyperlink = true;
              obj.ontap = "sendUrl";
            }
            // Add or remove classes as needed for formatting
            view.addRemoveClass("placeholder", isPlaceholder);
            view.addRemoveClass("italic", isItalic);
            view.addRemoveClass("hyperlink", isHyperlink);
            view.addRemoveClass("bold", isBold);

            // if this column has a formatter specified - use it
            if (formatter) {
              value = this[formatter](value, view, model);
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
        } else if (this.haveAllAnswers()) {
          actionIconButton.applyStyle("display", "inline-block");
          actionIconButton.applyStyle("opacity", "1");
        } else {
          actionIconButton.applyStyle("display", "inline-block"); // always show gear
          actionIconButton.applyStyle("opacity", ".6"); // default to a disabled appearance
        }
      }

      // Handle selection changed event
      ary = this.selectedIndexes();
      if (!_.isEqual(ary, this._selectedIndexes)) {
        this._selectedIndexes = ary;
        this.doSelectionChanged({
          index: index,
          selection: this.getSelection()
        });
      }
      return true;
    },
    /**
      If the device has phone capability, this will dial
      the phone number value.
    */
    callPhone: function (inSender, inEvent) {
      this.sendUrl(inSender, inEvent, "tel://");
      return true;
    },
    /**
      If the device has email capability, this bring up the
      default email client with the current address as the "to:"
      value.
    */
    sendMail: function (inSender, inEvent) {
      this.sendUrl(inSender, inEvent, "mailto:");
      return true;
    },
    /**
      Opens a new window with the url provided, appended
      with a prefix if provided.
    */
    sendUrl: function (inSender, inEvent, prefix) {
      var model = this.getModel(inEvent.index),
        url = model ? model.getValue(inSender.attr) : null,
        win;
      if (url) {
        if (prefix) {
          win = window.open(prefix + url);
          win.close();
        } else {
          win = window.open(url, "_blank");
        }
      }
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

      if (!this.haveAllAnswers()) {
        return true;
      }

      inEvent.model = model;
      inEvent.actions = this.actions;
      inEvent.actionPermissions = this._actionPermissions;
    }
  });

  /**
    Used by container views to handle list actions.
  */
  XV.ListMenuManagerMixin = /** @lends XV.ListMenuManagerMixin# */{
    listActionSelected: function (inSender, inEvent) {
      var list = this.$.contentPanels.getActive(),
        keys = _.keys(list.getSelection().selected),
        collection = list.getValue(),
        action = inEvent.originator.action,
        method = action.method,
        callback = function () {
          list.resetActions();
          _.each(keys, function (key) {
            list.renderRow(key);
          });
        },
        confirmed = function () {
          var Klass,
            model = collection.at(keys[0]);
          if (action.isViewMethod) {
            list.doActionSelected({
              model: model,
              action: action
            });

          // If the list item model doesn't have the function being asked for, try the editable version
          // Either way, loop through selected models and perform method
          } else if (model instanceof XM.Info && !model[method]) {
            Klass = XT.getObjectByName(model.editableModel);
            _.each(keys, function (key) {
              model = collection.at(key);
              Klass[method](model, callback);
            });
          } else {
            _.each(keys, function (key) {
              model = collection.at(key);
              model[method](callback);
            });
          }
        };

      if (action.notify !== false) { // default to true if not specified
        // if the action requires a user OK, ask the user
        this.doNotify({
          type: XM.Model.QUESTION,
          message: action.notifyMessage || "_confirmAction".loc(),
          callback: function (response) {
            if (response.answer) {
              confirmed();
            }
          }
        });

      } else {
        // if the action does not require a user OK, just do the event
        confirmed();
      }
      return true;
    },
    showListItemMenu: function (inSender, inEvent) {
      var menu = this.$.listItemMenu;

      // reset the menu based on the list specific to this request
      menu.destroyClientControls();

      // then add whatever actions are applicable
      _.each(inEvent.actions, function (action) {
        var name = action.name,
          isDisabled = !inEvent.actionPermissions[name],
          component = _.find(menu.$, function (value, key) {
            // see if the component has already been created
            return key === name;
          });
        if (component) {
          // if it's already been created just handle state
          component.setDisabled(isDisabled);

        } else {
          // otherwise if we have permissions, make it
          menu.createComponent({
            name: name,
            kind: XV.MenuItem,
            content: action.label || ("_" + name).loc(),
            action: action,
            disabled: isDisabled
          });
        } // else if it doesn't exist and we don't have permissions, do nothing

      });
      menu.render();

      // convoluted code to help us deceive the Menu into thinking
      // that it's part of a MenuDecorator which is inside the
      // list.
      if (!inEvent.originator.hasNode()) {
        inEvent.originator.node = inEvent.originator.eventNode;
      }
      inEvent.originator.generated = true;
      menu.requestMenuShow(this, {activator: inEvent.originator});
      menu.adjustPosition();
    }
  };

}());
