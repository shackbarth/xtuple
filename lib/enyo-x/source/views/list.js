/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, window: true*/

(function () {

  var PAD_UNTIL = 50;
  var ROWS_PER_FETCH = 50;
  var FETCH_TRIGGER = ROWS_PER_FETCH * 2; // we get two chunks for free, then we have to fetch

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
    @extends XV.ListBase
   */
  enyo.kind(_.extend(/** @lends XV.List# */{
    name: "XV.List",
    kind: "XV.ListBase",
    classes: "xv-list",
    fixedHeight: true,
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
      exportActions: null,
      navigatorActions: null,
      isMore: true,
      parameterWidget: null,
      canAddNew: true,
      allowPrint: false,
      // this property signifies that the list allows
      // searches via the input or parameter widget
      allowFilter: true,
      showDeleteAction: true,
      newActions: null,

      /**
       * @see XM.View#list.query
       */
      query: null,

      /**
       * The backing model for this component.
       * @see XM.EnyoView#model
       */
      value: null,
      /**
        If a custom `filter` function is employed this property will contain
        a collection of the filtered result set, otherwise it is the
        regular collection backing the list.
      */
      filtered: null,
    },
    events: {
      onExportList: "",
      onItemTap: "",
      onPrintList: "",
      onPrintSelectList: "",
      onReportList: ""
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
      this.processExtensions();
      var actions = this.getActions() || [],
        deleteAction = _.findWhere(actions, {"name": "delete"}),
        privilege,
        collection,
        Klass,
        method,
        privs;

      XM.View.setPresenter(this, "list");

      this.collectionChanged();
      this.queryChanged();

      this.createOverflowRow();

      // All below adds the default delete action
      // TODO: Should this be in XV.ListBase? Can it be?
      collection = this.getValue();
      Klass = collection ? collection.model : false;

      // Find the function that determines if the select object could be deleted.
      method = Klass && Klass.prototype.couldDestroy ? "couldDestroy" : "canDestroy";

      // Find the privilege associated with deletion for this object.
      if (Klass.prototype.editableModel) {
        Klass = XT.getObjectByName(Klass.prototype.editableModel);
      }
      privs = Klass.prototype.privileges;
      privilege = privs && privs.all && privs.all.delete ? privs.all.delete : undefined;

      // add the delete action if it's not already there
      if (!deleteAction && this.getShowDeleteAction()) {
        actions.push({
          name: "delete",
          privilege: privilege,
          prerequisite: method,
          notifyMessage: "_confirmDelete".loc() + " " + "_confirmAction".loc(),
          method: "deleteItem",
          isViewMethod: true
        });
      }
      this.setActions(actions);
    },

    /**
      Creates an additional hidden row which
      can be used if more space is needed for
      columns added during layout changes.


      XXX yes, this is incompatible with View templates. so ListItems
      that want to use overflow rows cannot yet use View templates.
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
      Show the report in another tab and download pdf.
     */
    doDownload: function (options) {
      this.openReport(XT.getOrganizationPath() + options.model.getReportUrl("download"));
    },
    /**
      If email is available, email the report. Otherwise, show the report in
      another tab.
     */
    doEmail: function (options) {
      if (XT.session.config.emailAvailable) {
        // send it to be emailed silently by the server
        options.model.doEmail();
      } else {
        this.openReport(XT.getOrganizationPath() + options.model.getReportUrl());
      }
    },
    /**
      If a printer is available, print the report. Otherwise, show the report in
      another tab.
     */
    doPrint: function (options) {
      if (XT.session.config.printAvailable) {
        // send it to be printed silently by the server
        options.model.doPrint();
      } else {
        this.openReport(XT.getOrganizationPath() + options.model.getReportUrl());
      }
    },
    /**
      Open the report pdf in a new tab
     */
    openReport: function (path) {
      window.open(path, "_newtab");
    },
    /**
     @todo Document the getModel method.
     */
    getModel: function (index) {
      return this.getFiltered() && this.getFiltered().models[index];
    },
    getExportActions: function () {
      var actions = this.exportActions || [],
        canExport = !XM.currentUser.get("disableExport"),
        exportAction =  canExport ? _.findWhere(actions, {"name": "export"}) : true;

      // Handle default navigator actions
      if (!exportAction) {
        actions.push({name: "export"});
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
      var collection = this.getFiltered(),
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

      this.fetching = true;

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
        this._lastLength = 0;
        query.rowOffset = 0;
        query.rowLimit = ROWS_PER_FETCH;
      }

      _.extend(options, {
        success: function (collection, data, options) {
          that.fetched(collection, data, options);
          if (success) { success(collection, data, options); }
        },
        query: query
      });
      this.getValue().fetch(options);
    },
    /**
     @todo Document the fetched method.
     */
    fetched: function (collection, data, options) {
      if (this.destroyed) { return; } // Sorry, horse left the barn, dude.
      var query = this.getQuery() || {},
        offset = query.rowOffset || 0,
        limit = query.rowLimit || 0,
        len = this.getValue().length,
        isMore,
        count,
        rowsPerPage,
        quotient;

      // Reset the size of the list
      this.filter(collection, data, options);
      count = this.getFiltered().length;
      isMore = limit ?
        (offset + limit <= len) && (this._lastLength !== len) : false;
      this.fetching = false;
      this.isMore = isMore;
      this.setCount(count);

      this._lastLength = len;

      // Hack: Solves scroll problem for small number of rows
      // but doesn't seem quite right
      rowsPerPage = count && PAD_UNTIL > count ? count : PAD_UNTIL;
      if (rowsPerPage !== this.rowsPerPage) {
        this.setRowsPerPage(rowsPerPage);
      }

      if (offset) {
        this.refresh();
      } else {
        this.reset();
      }

      this._maxTop = this.getScrollBounds().maxTop;

      // If we have a locally filtered result run lazy load until the
      // list is filled or we have all the results available.
      if (count < len) { this.lazyLoad(); }
    },
    /**
      Filters the result set. Default behavior simply
      points the filtered collection to the list's
      regular underlying collection.

      Apply your custom filtering logic here.

      @param {Object} Collection
      @param {Object} Data
      @param {options} Options
      returns Receiver
    */
    filter: function (collection, data, options) {
      this.filtered = this.value;

      return this;
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
      if (attr.indexOf(".") !== -1) {
        attrs = attr.split(".");
        str = ("_" + attrs[0]).loc() + " " + ("_" + attrs[1]).loc();
      } else {
        str = ("_" + attr).loc();
      }
      return "_no".loc() + " " + str;
    },
    /**
     * @listens onItemTap
     * Open up a workspace if the key is tapped, or if 'toggleSelected' is off.
     * Propagate this event only if no workspace is opened.
     * @see XV.SearchContainer#itemTap
     * @see XV.Navigator#itemTap
     */
    itemTap: function (inSender, inEvent) {
      if (!this.getToggleSelected() || inEvent.originator.isKey) {
        this.doItemTap({ model: this.getModel(inEvent.index) });
        return true;
      }
    },
    /**
      Manage lazy loading
    */
    lazyLoad: function () {
      if (_.isUndefined(this._maxTop)) { return; }
      var max = this._maxTop - this.rowHeight * FETCH_TRIGGER;

      if (this.isMore && !this.fetching && this.getScrollPosition() > max) {
        this.fetch({showMore: true});
      }
    },

    reportList: function () {
      this.doReportList();
    },
    /**
      Makes sure the collection can handle the sort order
      defined in the query.
    */
    queryChanged: function () {
      var query = this.getQuery(),
        value = this.getValue();
      if (value && query && query.orderBy) {
        value.comparator = function (a, b) {
          var aval,
            bval,
            attr,
            numeric,
            i,
            get = a.getValue ? "getValue" : "get";
          for (i = 0; i < query.orderBy.length; i++) {
            attr = query.orderBy[i].attribute;
            numeric = query.orderBy[i].numeric;
            aval = query.orderBy[i].descending ? b[get](attr) : a[get](attr);
            bval = query.orderBy[i].descending ? a[get](attr) : b[get](attr);
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
    refreshModel: function (id, afterDone) {
      var that = this,
        value = this.getValue(),
        Klass = XT.getObjectByName(this.getCollection()),
        checkStatusCollection,
        checkStatusParameter,
        checkStatusQuery,
        model = this.getValue().get(id);

      // cleverness: we're going to see if the model still belongs in the collection by
      // creating a new query that's the same as the current filter but with the addition
      // of filtering on the id. Any result means it still belongs. An empty result
      // means it doesn't.

      // clone the query so as not to change the real thing with this check.
      checkStatusQuery = JSON.parse(JSON.stringify(this.getQuery()));
      checkStatusParameter = { attribute: this.getValue().model.prototype.idAttribute, operator: "=", value: id};
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
            value.remove(model);
          }

          if (collection.size() > 0) {
            // this model should still be in the collection. Refresh it.
            value.add(collection.at(0), {silent: true});
          }
          if (value.comparator) { value.sort(); }
          if (that.getCount() !== value.length) {
            that.setCount(value.length);
          }
          that.refresh();
          if (afterDone) {
            afterDone();
          }
        },
        error: function () {
          XT.log("Error checking model status in list");
        }
      });
    },
     /**
      Manages lazy loading of items in the list.
      */
    scroll: function () {
      var r = this.inherited(arguments);

      this.lazyLoad();

      return r;
    },
     /**
      @todo Document the etupItem method.
      */
    setupItem: function (inSender, inEvent) {
      // Inheritence just handles menu toggle
      if (this.inherited(arguments)) { return true; }

      var index = inEvent.index,
        isSelected = inEvent.originator.isSelected(index),
        collection = this.getFiltered(),
        model = this.getModel(index),
        actionIconButton = this.$.listItem.getActionIconButton(),
        toggleSelected = this.getToggleSelected(),
        actions = this.getActions(),
        isActive,
        isNotActive,
        isNothing,
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
        ary,
        type;

      // It is possible in some cases where setupItem might
      // be called, but the inEvent index is not a model
      if (!model) {
        return true;
      }

      // set the overflow row to be hidden by default
      this.$.overflow.setShowing(false);

      isActive = model.getValue ? model.getValue("isActive") : true;
      isNotActive = _.isBoolean(isActive) ? !isActive : false;

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
            prev = index ? collection.models[index - 1] : false;
            showd = !prev || model.getValue(attr) !== prev.getValue(attr);
            this.$.header.canGenerate = showd;
            // Still need to do some work here to get the list lines and header to display correctly
            // this.$.header.applyStyle("border-top", showd ? "none" : null);
          }
          if (obj.footerAttr) {
            attr = obj.footerAttr;
            next = index ? collection.models[index + 1] : false;
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
            value = model.getValue ? model.getValue(attr) : model.get(attr);
            isNothing = _.isNull(value) || _.isUndefined(value) || value === "";
            type = model.getType ? model.getType(attr) : "";
            formatter = view.formatter;

            if (value === undefined || value === null || value === "") {
              // If the value is empty, and a placeholder is needed - show it
              if (attr && (view.placeholder || view.showPlaceholder)) {
                value = view.placeholder || this.getPlaceholderForAttr(attr);
                isPlaceholder = true;
              }
            } else if (type === "Email") {
              isHyperlink = true;
              obj.ontap = "sendMail";
            } else if (type === "Phone") {
              isHyperlink = true;
              obj.ontap = "callPhone";
            } else if (type === "Url") {
              isHyperlink = true;
              obj.ontap = "sendUrl";
            }

            // Add or remove classes as needed for formatting
            view.addRemoveClass("placeholder", isPlaceholder);
            view.addRemoveClass("hyperlink", isHyperlink);
            view.addRemoveClass("bold", isBold);

            // If this column has a formatter specified - use it
            if (formatter) {
              value = this[formatter](value, view, model);

            // Use type based formatter if applicable
            } else if (!isPlaceholder && !isNothing &&
                _.contains(this.formatted, type)) {
              value = this["format" + type](value, view, model);
            }

            view.setContent(value);
          }
        }
      }

      // Inactive
      this.$.listItem.addRemoveClass("inactive", isNotActive);

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
    }
  }, XV.ExtensionsMixin));

}());
