/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true,
strict: false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, Globalize:true*/

(function () {

  var FIRST_FETCH = 20;
  var FETCH_TRIGGER = 5;

  /**
    @name XV.ListRelations
    @class A control that displays a list of scrolling rows.<br />
    Use to attach to a workspace to present related data.<br />
    A superkind of {@link XV.DocumentListRelations}.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.List">enyo.List</a>.
    @extends enyo.List
  */
  var list = /** @lends XV.ListRelations# */{
    name: "XV.ListRelations",
    kind: "XV.ListBase",
    classes: "xv-list",
    fixedHeight: true,
    toggleSelected: true,
    published: {
      attr: null,
      value: null,
      parentKey: "",
      orderBy: null
    },
    events: {
      onParentStatusChange: ""
    },
    /**
      Clear all bindings.
     */
    destroy: function () {
      var value = this.getValue(),
        models = value ? value.models : null,
        that = this;
      if (models) {
        _.each(models, function (model) {
          model.off("statusChange", that.statusChanged, that);
        });
      }
      if (value) {
        value.off("add", this.modelAdded, this);
        value.off("remove reset", this.lengthChanged, this);
        if (value[this.getParentKey()]) {
          value[this.getParentKey()].off("statusChange", this.parentStatusChanged, this);
        }
      }
      this.inherited(arguments);
    },
    /**
      Returns the selected index as a string that looks like a number, e.g. "1"
     */
    getFirstSelected: function () {
      var selected = this.getSelection().selected,
        prop;
      for (prop in selected) {
        if (selected.hasOwnProperty(prop)) {
          return prop;
        }
      }
    },
    /**
     @todo Document the getModel method.
     */
    getModel: function (index) {
      return this.readyModels()[index];
    },
    /**
     @todo Document the getParent method.
     */
    getParent: function () {
      var key = this.getParentKey(),
        value = this.getValue();
      return key && value ? value[key] : null;
    },
    /**
     @todo Document the fetchRelated method.
     */
    fetchRelated: function (max) {
      var parent = this.getParent(),
        attr = this.getAttr().suffix(),
        options = { max: max || FIRST_FETCH };
      if (this.hasMore()) {
        parent.fetchRelated(attr, options);
      }
    },
    /**
     @todo Document the hasMore method.
     */
    hasMore: function () {
      var parent = this.getParent(),
        value = this.getValue(),
        count = value ? value.length : 0,
        attr = this.getAttr().suffix(),
        relation = parent && attr ? parent.getRelation(attr) : null,
        keyContents = relation && relation.keyContents ? relation.keyContents : [];
      return count < keyContents.length;
    },
    /**
      We want the count of the the list to be the number of READY models, so
      this function enforces that trimming. It needs to be called even when other
      kinds (e.g. childWorkspaces) affect the collection.
     */
    lengthChanged: function () {
      var count = this.readyModels().length,
        value = this.getValue(),
        rowsPerPage;

      // Hack: Solves scroll problem for small number of rows
      // but doesn't seem quite right
      rowsPerPage = count && 50 > count ? count : 50;
      if (rowsPerPage !== this.rowsPerPage) {
        this.setRowsPerPage(rowsPerPage);
      }
      if (value.comparator) { value.sort(); }
      this.setCount(count);
      this.refresh();
    },
    /**
     @todo Document the modelAdded method.
     */
    modelAdded: function (model) {
      var status = model.getStatus(),
        K = XM.Model;
      if (status === K.READY_CLEAN ||
          status === K.READY_NEW) {
        this.lengthChanged();
      } else {
        model.on("statusChange", this.statusChanged, this);
      }
    },
    /**
     @todo Document the orderByChanged method.
     */
    orderByChanged: function () {
      var orderBy = this.getOrderBy() || [],
        value = this.getValue();
      if (value && orderBy.length) {
        value.comparator = function (a, b) {
          var aval,
            bval,
            attr,
            i;
          for (i = 0; i < orderBy.length; i++) {
            attr = orderBy[i].attribute;
            aval = orderBy[i].descending ? b.getValue(attr) : a.getValue(attr);
            bval = orderBy[i].descending ? a.getValue(attr) : b.getValue(attr);
            aval = !isNaN(aval) ? aval - 0 : aval;
            bval = !isNaN(aval) ? bval - 0 : bval;
            if (aval !== bval) {
              return aval > bval ? 1 : -1;
            }
          }
          return 0;
        };
      }
    },
    /**
     @todo Document the parentStatusChanged method.
     */
    parentStatusChanged: function (model) {
      this.doParentStatusChange(model);
    },
    /**
      Returns an array of the models whose status is not destroyed.
     */
    readyModels: function () {
      // Used to return models in ready state, but problems arose in
      // "busy" states. Too late to change the api name, so just change
      // the logic.
      return _.filter(this.value.models, function (model) {
        var status = model.getStatus(),
          K = XM.Model;
        // Avoiding bitwise because performance matters here
        return (status !== K.DESTROYED_DIRTY &&
                status !== K.DESTRYED_CLEAN &&
                status !== K.EMPTY);
      });
    },
    /**
      This version of refresh model refreshes the entire model
      tree since it is likely child models are nested only and
      can not be fetched independently.
    */
    refreshModel: function (id, afterDone) {
      var collection = this.getValue(),
        model = collection.get(id),
        parent = model.getParent(true);

      parent.fetch({success: afterDone});
    },
    /**
     @todo Document the scroll method. How does it differ from the implementation for XV.List?
      XXX #refactor
     */
    scroll: function (inSender, inEvent) {
      var r = this.inherited(arguments),
        bounds = this.getScrollBounds(),
        lastShowing = this._lastShowing || 0,
        totalRows = this.value ? this.value.length : 0,
        rowsPerPage = bounds.clientHeight / this.rowHeight,
        showingRows = Math.floor(bounds.top / this.rowHeight + rowsPerPage),
        fetch =  showingRows > lastShowing &&
          totalRows - showingRows - FETCH_TRIGGER < 0 &&
          this.hasMore();

      // Manage lazy loading
      if (fetch) {
        this._lastShowing = showingRows;
        this.fetchRelated(1);
      }
      return r;
    },
    /**
      Render the list.

      Note that we render readyModels here. This assumes that all the models in the
      collection are ready, or that the length has been specially trimmed with
      the lengthChanged function. If the count of the list is greater than the length
      of readyModels then this will error.
     */
    setupItem: function (inSender, inEvent) {
      // Inheritence just handles menu toggle
      if (this.inherited(arguments)) { return true; }

      var index,
        isSelected,
        model,
        isActive,
        isNotActive,
        isNothing,
        prop,
        isPlaceholder,
        view,
        attr,
        value,
        formatter,
        type;

      index = inEvent.index;
      isSelected = this.getToggleSelected() && inEvent.originator.isSelected(index);
      model = this.readyModels()[index];
      if (!model) { return; }
      isActive = model.getValue("isActive");
      isNotActive = _.isBoolean(isActive) ? !isActive : false;

      // Loop through all attribute container children and set content
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop) && this.$[prop].getAttr) {
          view = this.$[prop];
          isPlaceholder = false;
          attr = this.$[prop].getAttr();
          value = model.getValue(attr);
          formatter = view.formatter;
          type = model.getType && model.getType(attr);
          isNothing = _.isNull(value) || _.isUndefined(value) || value === "";

          if (formatter) {
            value = this[formatter](value, view, model);
            isNothing = _.isNull(value) || _.isUndefined(value) || value === "";
          } else if (!isNothing && _.contains(this.formatted, type)) {
            value = this["format" + type](value, view, model);
          }

          if (isNothing && view.placeholder) {
            value = view.placeholder;
            isPlaceholder = true;
          }
          
          view.setContent(value);
          view.addRemoveClass("placeholder", isPlaceholder);
        }
      }

      // Inactive
      this.$.listItem.addRemoveClass("inactive", isNotActive);

      // Selection
      this.$.listItem.addRemoveClass("item-selected", isSelected);
      return true;
    },
    /**
     @todo Document the statusChanged method.
     */
    statusChanged: function (model) {
      if (model.getStatus() === XM.Model.READY_CLEAN) {
        model.off("statusChange", this.statusChanged, this);
        this.lengthChanged();
      }
    },
    /**
     @todo Document the valueChanged method.
     */
    valueChanged: function () {
      var value = this.getValue();
      if (value) {
        value.on("add", this.modelAdded, this);
        value.on("remove reset", this.lengthChanged, this);
        if (value[this.getParentKey()]) {
          value[this.getParentKey()].on("statusChange", this.parentStatusChanged, this);
        }
        this.orderByChanged();
        this.lengthChanged();
        this.fetchRelated();
      }
    }
  };

  enyo.mixin(list, XV.FormattingMixin);
  enyo.mixin(list, XV.ListMixin);
  enyo.kind(list);

}());
