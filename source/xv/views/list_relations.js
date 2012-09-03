/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  var FIRST_FETCH = 20;
  var FETCH_TRIGGER = 5;
  
  /**
    @class

    List to attach to workspaces to present related data.

    @extends enyo.List
  */
  enyo.kind({
    name: "XV.ListRelations",
    kind: "List",
    classes: "xv-list",
    fixedHeight: true,
    toggleSelected: true,
    published: {
      attr: null,
      value: null,
      parentKey: "",
      orderBy: null,
      workspace: ""
    },
    handlers: {
      onSetupItem: "setupItem"
    },
    destroy: function () {
      // Clear all bindings
      var models = this._collection ? this._collection.models : null;
      if (models) {
        _.each(models, function (model) {
          model.off('statusChange', this.statusChanged, this);
        });
      }
      this._collection.off("add", this.modelAdded, this);
      this._collection.off("remove", this.lengthChanged, this);
      this.inherited(arguments);
    },
    getFirstSelected: function () {
      var selected = this.getSelection().selected,
        prop;
      for (prop in selected) {
        if (selected.hasOwnProperty(prop)) {
          return prop;
        }
      }
    },
    getModel: function (index) {
      return this.readyModels()[index];
    },
    getParent: function () {
      var key = this.getParentKey();
      return key && this._collection ? this._collection[key] : null;
    },
    fetchRelated: function (max) {
      var parent = this.getParent(),
        attr = this.getAttr(),
        options = { max: max || FIRST_FETCH };
      if (this.hasMore()) {
        parent.fetchRelated(attr, options);
      }
    },
    hasMore: function () {
      var parent = this.getParent(),
        count = this._collection ? this._collection.length : 0,
        attr = this.getAttr(),
        relation = parent && attr ? parent.getRelation(attr) : null,
        keyContents = relation && relation.keyContents ? relation.keyContents : [];
      return count < keyContents.length;
    },
    lengthChanged: function () {
      var count = this.readyModels().length,
        rowsPerPage;
      if (count === this.count) { return; }
        
      // Hack: Solves scroll problem for small number of rows
      // but doesn't seem quite right
      rowsPerPage = count && 50 > count ? count : 50;
      if (rowsPerPage !== this.rowsPerPage) {
        this.setRowsPerPage(rowsPerPage);
      }
      this._collection.sort();
      this.setCount(count);
      this.refresh();
    },
    modelAdded: function (model) {
      if (model.getStatus() === XM.Model.READY_CLEAN) {
        this.lengthChanged();
      } else {
        model.on('statusChange', this.statusChanged, this);
      }
    },
    orderByChanged: function () {
      var orderBy = this.getOrderBy() || [];
      if (this._collection && orderBy.length) {
        this._collection.comparator = function (a, b) {
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
    readyModels: function () {
      return _.filter(this._collection.models, function (model) {
        return model.getStatus() === XM.Model.READY_CLEAN;
      });
    },
    scroll: function (inSender, inEvent) {
      var r = this.inherited(arguments),
        bounds = this.getScrollBounds(),
        lastShowing = this._lastShowing || 0,
        totalRows = this._collection.length,
        rowsPerPage = bounds.clientHeight / this.rowHeight,
        showingRows = Math.floor(bounds.top / this.rowHeight + rowsPerPage),
        fetch =  showingRows > lastShowing && totalRows - showingRows - FETCH_TRIGGER < 0 && this.hasMore();
      // Manage lazy loading
      if (fetch) {
        this._lastShowing = showingRows;
        this.fetchRelated(1);
      }
      return r;
    },
    setupItem: function (inSender, inEvent) {
      var index = inEvent.index,
        isSelected = inEvent.originator.isSelected(index),
        model = this.readyModels()[index],
        isNotActive = model ? !model.getValue('isActive') || false : false,
        prop,
        isPlaceholder,
        view,
        attr,
        value,
        formatter;

      // Loop through all attribute container children and set content
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop) && this.$[prop].getAttr) {
          view = this.$[prop];
          isPlaceholder = false;
          attr = this.$[prop].getAttr();
          value = model.getValue(attr);
          formatter = view.formatter;
          if (!value && view.placeholder) {
            value = view.placeholder;
            isPlaceholder = true;
          }
          if (formatter) {
            value = this[formatter](value, view, model);
          }
          if (value && value instanceof Date) {
            value = Globalize.format(value, 'd');
          }
          view.setContent(value);
          view.addRemoveClass("placeholder", isPlaceholder);
        }
      }
      
      // Inactive
      this.$.listItem.addRemoveClass("inactive", isNotActive);
      
      // Selection
      this.$.listItem.addRemoveClass("item-selected", isSelected);
    },
    statusChanged: function (model) {
      if (model.getStatus() === XM.Model.READY_CLEAN) {
        model.off('statusChange', this.statusChanged, this);
        this.lengthChanged();
      }
    },
    valueChanged: function () {
      this._collection = this.value;
      this._collection.on("add", this.modelAdded, this);
      this._collection.on("remove", this.lengthChanged, this);
      this.orderByChanged();
      this.lengthChanged();
      this.fetchRelated();
    }

  });

}());
