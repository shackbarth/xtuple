/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  var ROWS_PER_FETCH = 50;

  enyo.kind({
    name: "XV.ListItem",
    classes: "xv-list-item",
    ontap: "itemTap"
  });

  enyo.kind({
    name: "XV.ListColumn",
    classes: "xv-list-column"
  });

  enyo.kind({
    name: "XV.ListAttr",
    classes: "xv-list-attr",
    published: {
      attr: ""
    }
  });

  enyo.kind({
    name: "XV.List",
    kind: "List",
    classes: "xv-list",
    published: {
      label: "",
      collection: null,
      query: null,
      isFetching: false,
      isMore: true,
      parameterWidget: null,
      workspace: null
    },
    events: {
      onWorkspace: ""
    },
    fixedHeight: true,
    handlers: {
      onModelChange: "modelChanged",
      onSetupItem: "setupItem"
    },
    collectionChanged: function () {
      var collection = this.getCollection(),
        Klass = collection ? XT.getObjectByName(collection) : false;
      delete this._collection;
      if (!Klass) { return; }
      if (Klass) { this._collection = new Klass(); }
    },
    create: function () {
      this.inherited(arguments);
      this.collectionChanged();
    },
    getModel: function (index) {
      return this._collection.models[index];
    },
    getSearchableAttributes: function () {
      return this._collection.model.getSearchableAttributes();
    },
    fetch: function (options) {
      var that = this,
        query = this.getQuery(),
        success;
      options = options ? _.clone(options) : {};
      options.showMore = _.isBoolean(options.showMore) ?
        options.showMore : false;
      success = options.success;

      // Lazy Loading
      if (options.showMore) {
        query.rowOffset += ROWS_PER_FETCH;
        options.add = true;
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
      this._collection.fetch(options);
    },
    fetched: function () {
      var query = this.getQuery(),
        offset = query.rowOffset || 0,
        limit = query.rowLimit || 0,
        count = this._collection.length,
        isMore = limit ?
          (offset + limit <= count) && (this.getCount() !== count) : false;
      this.setIsMore(isMore);
      this.setIsFetching(false);

      // Reset the size of the list
      this.setCount(count);
      if (offset) {
        this.refresh();
      } else {
        this.reset();
      }
    },
    itemTap: function (inSender, inEvent) {
      var workspace = this.getWorkspace(),
        id = this.getModel(inEvent.index).id;

      // Bubble requset for workspace view, including the model id payload
      if (workspace) { this.doWorkspace({workspace: workspace, id: id}); }
    },
    modelChanged: function (inSender, inEvent) {
      var that = this,
        workspace = this.getWorkspace(),
        options = {},
        model;
      // If the model that changed was related to and exists on this list
      // refresh the item.
      workspace = workspace ? XT.getObjectByName(workspace) : null;
      if (workspace && workspace.prototype.model === inEvent.model &&
          this._collection) {
        model = this._collection.get(inEvent.id);
        if (model) {
          options.success = function () {
            that.refresh();
          };
          model.fetch(options);
        }
      }
    },
    setupItem: function (inSender, inEvent) {
      var model = this._collection.models[inEvent.index],
        prop,
        isPlaceholder,
        view,
        value,
        formatter;

      // Loop through all attribute container children and set content
      for (prop in this.$) {
        if (this.$.hasOwnProperty(prop) && this.$[prop].getAttr) {
          view = this.$[prop];
          isPlaceholder = false;
          value = model.getValue(this.$[prop].getAttr());
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
    }

  });

}());
