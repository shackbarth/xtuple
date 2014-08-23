  /*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true, Globalize:true*/

(function () {
  var _events = "change readOnlyChange statusChange",
    _readOnlyHeight = 57;

  // TODO: picker onblur
  // http://forums.enyojs.com/discussion/1578/picker-onblur#latest

  /**
    @name XV.GridAttr
    @class Holds the data within the cell of a row of a grid.<br />
  */
  enyo.kind(/** @lends XV.GridAttr# */{
    name: "XV.GridAttr",
    classes: "xv-grid-attr",
    published: {
      attr: "",
      isKey: false,
      isLayout: false,
      placeholder: null
    }
  });

  /**
    @name XV.Column
    @class Represents a column within the read only section of a grid.
  */
  enyo.kind(/** @lends XV.Column# */{
    name: "XV.GridColumn",
    classes: "xv-grid-column"
  });

  /**
    @name XV.GridRow
    @class Represents a row within the read only section of a grid.

  */
  var readOnlyRow = enyo.mixin(/** @lends XV.GridRow# */{
    name: "XV.GridRow",
    classes: "xv-grid-row readonly",
    published: {
      value: null,
      columns: null
    },

    create: function () {
      this.inherited(arguments);
      this.columnsChanged();
    },

    columnsChanged: function () {
      this.inherited(arguments);
      var columns = this.getColumns() || [],
        that = this;
      _.each(columns, function (column) {
        var components = [];

        // Build component array
        _.each(column.rows, function (row) {
          components.push({
            kind: "XV.GridAttr",
            attr: row.readOnlyAttr || row.attr,
            formatter: row.formatter,
            placeholder: row.placeholder
          });
        });

        that.createComponent({
          kind: "XV.GridColumn",
          classes: column.classes || "grid-item",
          components: components
        });
      });
    },
    setValue: function (value) {
      this.value = value;
      this.valueChanged();
    },
    valueChanged: function () {
      var model = this.getValue(),
        that = this,
        views = _.filter(this.$, function (view) {
          return view.attr || view.formatter;
        }),
        handled = [];

      if (!model) { return; }

      // Loop through each view matched to an attribute and set the value
      _.each(views, function (view) {
        var prop = view.attr,
          attr = prop.indexOf(".") > -1 ? prop.prefix() : prop,
          isRequired = _.contains(model.requiredAttributes, attr),
          value = model.getValue(view.attr),
          type = model.getType(view.attr),
          isNothing = _.isUndefined(value) || _.isNull(value) || value === "",
          isError = isNothing && isRequired,
          isPlaceholder = false;

        // Set this first in case other formatting sets error
        view.addRemoveClass("error", isError);

        // Show "required" placeholder if necessary,
        // but only once per top level attribute
        if (isError) {
          if (!_.contains(handled, attr)) {
            value = _.contains(handled, attr) ? "" : "_required".loc();
            handled.push(attr);
          }

        // Handle formatting if applicable
        } else if (view.formatter) {
          value = that[view.formatter](value, view, model);

        // Handle placeholder if applicable
        } else if (isNothing) {
          value = view.placeholder || "";
          isPlaceholder = true;

        } else if (_.contains(that.formatted, type)) {
          value = that["format" + type](value, view, model);
        }
        view.setContent(value);
        view.addRemoveClass("placeholder", isPlaceholder);
      });

    }
  }, XV.FormattingMixin);

  enyo.kind(readOnlyRow);

  /**
    The editable row of a GridBox for grid entry.
    @see XV.RelationsEditorMixin.
  */
  var editor = enyo.mixin({}, XV.RelationsEditorMixin);
  editor = enyo.mixin(editor, /** @lends XV.GridEditor */{
    name: "XV.GridEditor",
    classes: "xv-grid-row selected",
    published: {
      columns: null,
      value: null
    },
    addButtonKeyup: function (inSender, inEvent) {
      inEvent.preventDefault();
    },
    create: function () {
      this.inherited(arguments);
      this.columnsChanged();
    },
    columnsChanged: function () {
      this.inherited(arguments);
      var that = this,
        columns = this.getColumns() || [],
        components = [];

      // Loop through each column and build rows
      _.each(columns, function (column) {

        // Create the column
        components.push({
          classes: "xv-grid-column " + (column.classes || "grid-item"),
          components: _.pluck(column.rows, "editor")
        });
      });

      // Create the controls
      components.push(
        {classes: "xv-grid-column grid-actions", components: [
          {components: [
            {kind: "enyo.Button",
              classes: "icon-plus xv-gridbox-button",
              name: "addGridRowButton",
              onkeypress: "addButtonKeyup",
            },
            {kind: "enyo.Button",
              classes: "icon-folder-open xv-gridbox-button",
              name: "expandGridRowButton" },
            {kind: "enyo.Button",
              classes: "icon-remove-sign xv-gridbox-button",
              name: "deleteGridRowButton" }
          ]}
        ]}
      );
      this.createComponents(components, {owner: this});
    },
    keyUp: function (inSender, inEvent) {
      if (inEvent.keyCode === XV.KEY_DOWN) {
        this.doMoveDown(inEvent);
        return true;
      } else if (inEvent.keyCode === XV.KEY_UP) {
        this.doMoveUp(inEvent);
        return true;
      } else if (inEvent.keyCode === XV.KEY_ENTER) {
        this.doEnterOut(inEvent);
        return true;
      }
    },
    /**
      The editor will select the first non-disabled widget it can.

      @param {Object} Widget
    */
    setFirstFocus: function () {
      var editors = [],
        first;

      _.each(this.children, function (column) {
        editors = editors.concat(column.children);
      });
      first = _.find(editors, function (editor) {
        return !editor.disabled && editor.focus;
      });

      if (first) { first.focus(); }
    }
  });
  _.extend(editor.events, {
      onMoveUp: "",
      onMoveDown: "",
      onEnterOut: ""
    });
  _.extend(editor.handlers, {
      onkeyup: "keyUp"
    });
  enyo.kind(editor);

  /**
    Input system for grid entry
    @extends XV.Groupbox
   */
  enyo.kind(
  /** @lends XV.GridBox# */{
    name: "XV.GridBox",
    kind: "XV.Groupbox",
    classes: "panel xv-grid-box",
    events: {
      onChildWorkspace: "",
      onExportAttr:     ""
    },
    handlers: {
      ontap: "buttonTapped",
      onEnterOut: "enterOut",
      onMoveUp: "moveUp",
      onMoveDown: "moveDown",
      onChildWorkspaceValueChange: "valueChanged"
    },
    published: {
      attr: null,
      disabled: null,
      value: null,
      editableIndex: null, // number
      title: "",
      columns: null,
      editorMixin: null,
      summary: null,
      workspace: null,
      parentKey: null,
      gridRowKind: "XV.GridRow",
      gridEditorKind: "XV.GridEditor",
      orderBy: null
    },
    bindCollection: function () {
      var that = this,
        collection = this.getValue();
      this.unbindCollection();
      collection.once("add remove", this.valueChanged, this);
      _.each(collection.models, function (model) {
        model.on("change status:DESTROYED_DIRTY", that.refreshLists, that);
      });
    },
    buildComponents: function () {
      var that = this,
        title = this.getTitle(),
        columns = this.getColumns() || [],
        header = [],
        readOnlyRow = [],
        summary = this.getSummary(),
        components = [],
        editorMixin = this.getEditorMixin() || {},
        editorCreate = editorMixin.create,
        editor,
        gridRowKind = this.getGridRowKind(),
        gridEditorKind = this.getGridEditorKind();

      editor = enyo.mixin({
        kind: gridEditorKind,
        name: "editableGridRow",
        showing: false,
        columns: columns
      }, editorMixin);

      // Hack: because unfortunately some mixins have implemented create
      // and it's too much work to untangle that right now
      if (editorCreate) {
        editor.create = function () {
          editorCreate.apply(this, arguments);
          this.columnsChanged();
        };
      }

      // View Header
      components.push({
        kind: "onyx.GroupboxHeader",
        content: title,
        classes: "xv-grid-groupbox-header"
      });

      // Row Header
      _.each(columns, function (column) {
        var contents = _.isArray(column.header) ? column.header : [column.header],
          components = [];

        _.each(contents, function (content) {
          components.push({
            //classes: "xv-grid-header " + (column.classes || "grid-item"),
            content: content
          });
        });

        header.push({kind: "FittableRows", components: components,
          classes: "xv-grid-header " + (column.classes || "grid-item")});
      });

      components.push({
        classes: "xv-grid-row",
        name: "gridHeader",
        components: header
      });

      // Row Definition
      components.push(
        {kind: "XV.Scroller", name: "mainGroup", horizontal: "hidden", fit: true, components: [
          {kind: "List", name: "aboveGridList", classes: "xv-above-grid-list",
              onSetupItem: "setupRowAbove", ontap: "gridRowTapAbove", components: [
            { kind: gridRowKind, name: "aboveGridRow", columns: columns}
          ]},
          editor,
          {kind: "List", name: "belowGridList", classes: "xv-below-grid-list",
              onSetupItem: "setupRowBelow", ontap: "gridRowTapBelow", components: [
            {kind: gridRowKind, name: "belowGridRow", columns: columns}
          ]}
        ]}
      );

      components.push({
        kind: "FittableColumns",
        name: "navigationButtonPanel",
        classes: "xv-buttons",
        components: [
          {kind: "onyx.Button", name: "newButton", ontap: "newItem", content: "_new".loc(),
            classes: "icon-plus text"},
          {kind: "onyx.Button", name: "exportButton", ontap: "exportAttr",
            classes: "icon-share text", content: "_export".loc()}
        ]
      });

      // Summary
      if (summary) {
        components.push({
          kind: summary,
          name: "summaryPanel"
        });
      }

      return components;
    },
    create: function () {
      this.inherited(arguments);
      this.createComponents(this.buildComponents());
    },
    allRowsSaved: function () {
      return _.every(this.getValue().models,
                     function (model) { return model.isReadyClean(); });
    },
    buttonTapped: function (inSender, inEvent) {
      var editor = this.$.editableGridRow,
        model,
        that = this,
        success;

      switch (inEvent.originator.name) {
      case "addGridRowButton":
        this.newItem();
        break;
      case "deleteGridRowButton":
        // note that can't remove the model from the middle of the collection w/o error
        // we just destroy the model and hide the row.
        model = inEvent.originator.parent.parent.parent.value; // XXX better ways to do this
        model.destroy({
          success: function () {
            that.setEditableIndex(null);
            that.$.editableGridRow.hide();
            that.valueChanged();
          }
        });
        break;
      case "expandGridRowButton":
        model = inEvent.originator.parent.parent.parent.value; // XXX better ways to do this
        this.unbindCollection();
        editor.value.off("notify", editor.notify, editor);
        this.doChildWorkspace({
          workspace: this.getWorkspace(),
          collection: this.getValue(),
          index: this.getValue().indexOf(model),
          callback: function () {
            editor.value.on("notify", editor.notify, editor);
            that.bindCollection();
          }
        });
        break;
      }
    },
    destroy: function () {
      var model = this.value[this.getParentKey()];
      model.off("status:READY_CLEAN", this.reset, this);
      this.unbindCollection();
      this.inherited(arguments);
    },
    /**
     Propagate down disability to widgets.
     */
    disabledChanged: function () {
      this.$.newButton.setDisabled(this.getDisabled());
    },
    /*
      When a user taps the grid row we open it up for editing
    */
    gridRowTapAbove: function (inSender, inEvent) {
      this.gridRowTapEither(inEvent.index, 0);
    },
    gridRowTapBelow: function (inSender, inEvent) {
      this.gridRowTapEither(inEvent.index, this.getEditableIndex() + 1);
    },
    gridRowTapEither: function (index, indexStart, firstFocus) {
      firstFocus = firstFocus !== false;
      var editableIndex = index + indexStart,
        belowListCount = this.getValue().length - editableIndex - 1,
        editor = this.$.editableGridRow;

      if (this.getDisabled()) {
        // read-only means read-only
        return;
      }
      if (index === undefined) {
        // tap somewhere other than a row item
        return;
      }
      this.setEditableIndex(editableIndex);
      this.$.aboveGridList.setCount(editableIndex);
      this.$.aboveGridList.render();
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.aboveGridList.$.port.applyStyle("height", (_readOnlyHeight * this.liveModels(editableIndex - 1).length) + "px");
      editor.setValue(this.getValue().at(editableIndex));
      if (!editor.showing) {
        editor.show();
        editor.render();
      }
      if (firstFocus) {
        editor.setFirstFocus();
      }
      this.$.belowGridList.setCount(belowListCount);
      this.$.belowGridList.render();
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.belowGridList.$.port.applyStyle("height", (_readOnlyHeight * belowListCount) + "px");
    },
    /**
      Get all the models that are not destroyed, up through optional maxIndex parameter
    */
    liveModels: function (maxIndex) {
      return _.compact(_.map(this.getValue().models, function (model, index) {
        if (maxIndex !== undefined && index > maxIndex) {
          return null;
        } else if (model.isDestroyed()) {
          return null;
        } else {
          return model;
        }
      }));
    },
    moveDown: function (inSender, inEvent) {
      var outIndex = this.getEditableIndex(),
        rowCount = this.getValue().length,
        wrap = inEvent.wrap === true,
        i;

      if (wrap && outIndex + 1 === rowCount) {
        this.newItem();
      } else {
        // go to the next live row, as if it had been tapped
        for (i = outIndex + 1; i < this.getValue().length; i++) {
          if (!this.getValue().at(i).isDestroyed()) {
            this.gridRowTapEither(i, 0, wrap);
            break;
          }
        }
      }
    },
    moveUp: function (inSender, inEvent) {
      var outIndex = this.getEditableIndex(),
        firstFocus = inEvent.firstFocus === true,
        i;

      if (outIndex >= 0) {
        // go to the next live row, as if it had been tapped
        for (i = outIndex - 1; i >= 0; i--) {
          if (!this.getValue().at(i).isDestroyed()) {
            this.gridRowTapEither(i, 0, firstFocus);
            break;
          }
        }
      }
    },
    /*
      Add a row to the grid
    */
    newItem: function () {
      var editableIndex = this.getValue().length,
        aboveListCount = this.liveModels(editableIndex - 1).length,
        Klass = this.getValue().model,
        model = new Klass(null, {isNew: true}),
        editor = this.$.editableGridRow;

      this.getValue().add(model, {status: XM.Model.READY_NEW});
      this.setEditableIndex(editableIndex);
      this.valueChanged();
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.aboveGridList.$.port.applyStyle("height", (_readOnlyHeight * aboveListCount) + "px");
      editor.setValue(model);
      editor.show();
      editor.render();
      editor.setFirstFocus();
    },
    exportAttr: function (inSender, inEvent) {
      var gridbox = this;
      this.doExportAttr({ attr: gridbox.attr });
    },
    refreshLists: function () {
      var collection = this.getValue();
      this.$.aboveGridList.refresh();
      this.$.belowGridList.refresh();
      this.$.exportButton.setDisabled(! this.allRowsSaved() ||
                                      ! collection.length);
    },
    reset: function () {
      this.setEditableIndex(null);
      this.valueChanged();
    },
    setupRowAbove: function (inSender, inEvent) {
      this.setupRowEither(inEvent.index, this.$.aboveGridRow, 0);
    },
    setupRowBelow: function (inSender, inEvent) {
      this.setupRowEither(inEvent.index, this.$.belowGridRow, this.getEditableIndex() + 1);
    },
    setupRowEither: function (index, gridRow, indexStart) {
      var that = this,
        model = this.getValue().at(indexStart + index);

      // set the contents of the row
      gridRow.setValue(model);
      gridRow.setShowing(model && !model.isDestroyed());

      return true;
    },
    enterOut: function (inSender, inEvent) {
      inEvent.wrap = true;
      this.moveDown(inSender, inEvent);
    },
    unbindCollection: function () {
      var collection = this.getValue(),
        that = this;

      collection.off("add remove", this.valueChanged, this);
      _.each(collection.models, function (model) {
        model.off("change status:DESTROYED_DIRTY", that.refreshLists, that);
      });
    },
    setValue: function (value) {
      var orderBy = this.getOrderBy(),
        collection;
      this._setProperty("value", value, "valueChanged");

      collection = value;
      if (this.getEditableIndex() !== null) {
        // do not try to sort while the user is entering data
        return;
      }

      if (orderBy && !collection.comparator) {
        collection.comparator = function (a, b) {
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
      if (orderBy) {
        collection.sort();
      }
    },
    valueChanged: function () {
      var that = this,
        collection = this.getValue(),
        model = this.value[this.getParentKey()];

      // Make sure lists refresh if data changes
      this.bindCollection();
      this.$.aboveGridList.setCount(this.getEditableIndex() !== null ? this.getEditableIndex() : this.getValue().length);
      // XXX hack. not sure why the port doesn't know to resize down
      this.$.aboveGridList.$.port.applyStyle("height", (_readOnlyHeight * this.liveModels().length) + "px");
      this.$.belowGridList.setCount(0);
      this.$.belowGridList.$.port.applyStyle("height", "0px");
      this.$.editableGridRow.setShowing(false);
      this.$.aboveGridList.render();
      this.$.editableGridRow.render();

      // Should the model get saved and the server changed something
      // come back here and reset things.
      model.once("status:READY_CLEAN", this.reset, this);

      // Update summary panel if applicable
      if (this.$.summaryPanel) {
        this.$.summaryPanel.setValue(model);
      }

      this.$.exportButton.setDisabled(! this.allRowsSaved() ||
                                      ! collection.length);
    }
  });
}());
