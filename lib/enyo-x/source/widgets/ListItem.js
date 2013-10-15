  /**
    @name XV.ListItem
    @class Represents a single row in a list of rows.<br />
    Related: list, {@link XV.List}; row, XV.ListItem; cell, {@link XV.ListColumn}; data, {@link XV.ListAttr}
   */
  enyo.kind(/** @lends XV.ListItem# */{
    name: "XV.ListItem",
    modelView: "EnyoView",
    classes: "xv-list-item",
    ontap: "itemTap",
    published: {
      model: null,
      selected: false
    },
    events: {
      onListItemMenuTap: "",
      onActionSelected: ""
    },
    handlers: {
      onSetupCell: 'setupCell'
    },
    components: [
      {kind: "XV.SimpleModelTable", name: "table"},

      // TODO {kind: "XV.ListItemGear"}
      {name: "actionIconButton", kind: "onyx.IconButton",
        classes: "xv-list-gear-icon-button",
        src: "/assets/menu-icon-gear.png",
        showing: false,
        ontap: "actionTapped"
      }
    ],

    create: function () {
      this.inherited(arguments);
      this.view = new XM[this.modelView]({ el: this });
      this.$.table.setTemplate(this.view.item.template);
    },

    /**
     * @listens onModelChanged
     * Bind model via view, and setup table.
     */
    modelChanged: function () {
      this.log(this.model);
      this.view.model = this.model;
      this.view.delegateEvents();
      this.$.table.setup();
    },

    /**
     * @listens onSetupCell
     * Populate cell with data from model. This is the default; it can be
     * overridden with custom behavior.
     */
    setupCell: function (inSender, inCell) {
      this.log(inCell);
      inCell.setContent(this.model.get(inCell.attributes.attr));
    },

    /**
     * @listens selectedChanged
     */
    selectedChanged: function () {
      this.addRemoveClass("item-selected", this.selected);
    },

    actionTapped: function (inSender, inEvent) {
      this.doListItemMenuTap(inEvent);
      return true;
    },

    /**
     * @deprecated
     */
    getActionIconButton: function () {
      return this.$.actionIconButton;
    },

    /**
     * @deprecated
     */
    setSelected: function (inSelected) {
      this.addRemoveClass("item-selected", inSelected);
    },
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
