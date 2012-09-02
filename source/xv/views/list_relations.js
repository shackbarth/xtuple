/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

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
            aval = orderBy[i].descending ? b.get(attr) : a.get(attr);
            bval = orderBy[i].descending ? a.get(attr) : b.get(attr);
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
    setupItem: function (inSender, inEvent) {
      var index = inEvent.index,
        isSelected = inEvent.originator.isSelected(index),
        model = this.readyModels()[index],
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
    }

  });

}());
