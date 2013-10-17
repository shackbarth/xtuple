(function () {
  /**
    @name XV.ListItem
    @class Represents a single row in a list of rows.<br />
    Related: list, {@link XV.List}; row, XV.ListItem; cell, {@link XV.ListColumn}; data, {@link XV.ListAttr}
   */
  enyo.kind(/** @lends XV.ListItem# */{
    name: 'XV.ListItem',
    modelView: 'EnyoView',
    classes: 'xv-list-item',
    ontap: 'itemTap',
    published: {
      model: null,
      selected: null
    },
    events: {
      onListItemMenuTap: '',
      onActionSelected: ''
    },
    handlers: {
      onSetupCell: 'setupCell',
      onListMenuReady: 'listMenuReady'
    },

    components: [
      {kind: 'XV.SimpleModelTable', name: 'table', classes: 'enyo-inline'},
      {kind: 'font.IconButton', icon: 'spinner', options: ['spin'],
        disabled: true, showing: false, ontap: 'gearTap',
        classes: 'xv-list-item-gear'},
    ],

    create: function () {
      this.inherited(arguments);

      this.view = new XM[this.modelView]({ el: this });
      this.$.table.setTemplate(this.view.item.template);
    },

    listMenuReady: function (inSender, inEvent) {
      this.$.iconButton.setIcon('cog');
      this.$.iconButton.setDisabled(false);
    },

    /**
     * @listens gearTap
     * Show menu
     */
    gearTap: function (inSender, inEvent) {
      this.inherited(arguments);
      this.doListItemMenuTap(inEvent);

      return true;
    },

    /**
     * @listens onModelChanged
     * Bind model via view, and setup table.
     */
    modelChanged: function () {
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
      inCell.setContent(this.model.get(inCell.attributes.attr));
    },

    /**
     * @listens selectedChanged
     */
    selectedChanged: function () {
      this.$.iconButton.setShowing(this.selected);
      this.addRemoveClass('item-selected', this.selected);
    },

    /**
     * @deprecated
     */
    getActionIconButton: function () {
      return this.$.iconButton;
    }
  });

  /**
    @name XV.ListColumn
    @class Represents a cell within a row of a list.<br />
    Related: list, {@link XV.List}; row, {@link XV.ListItem}; cell, XV.ListColumn; data, {@link XV.ListAttr}
   */
  enyo.kind(/** @lends XV.ListColumn# */{
    name: 'XV.ListColumn',
    classes: 'xv-list-column'
  });

  /**
    @name XV.ListAttr
    @class Holds the data within the cell of a row of a list.<br />
    Related: list, {@link XV.List}; row, {@link XV.ListItem}; cell {@link XV.ListColumn}; data, XV.ListAttr
   */
  enyo.kind(/** @lends XV.ListAttr# */{
    name: 'XV.ListAttr',
    classes: 'xv-list-attr',
    published: {
      attr: '',
      isKey: false
    }
  });
})();
