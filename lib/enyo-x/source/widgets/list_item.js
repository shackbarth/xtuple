  /**
    @name XV.ListItem
    @class Represents a single row in a list of rows.<br />
    Related: list, {@link XV.List}; row, XV.ListItem; cell, {@link XV.ListColumn}; data, {@link XV.ListAttr}
   */
  enyo.kind(/** @lends XV.ListItem# */{
    name: "XV.ListItem",
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
    components: [
      {name: "actionIconButton", kind: "onyx.IconButton",
        classes: "xv-list-gear-icon-button",
        src: "/assets/menu-icon-gear.png",
        showing: false,
        ontap: "actionTapped"
      }
    ],
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
