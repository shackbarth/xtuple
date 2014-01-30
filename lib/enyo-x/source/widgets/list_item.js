(function () {
  /**
    @name XV.ListItem
    @class Represents a single row in a list of rows.<br />
    Related: list, {@link XV.List}; row, XV.ListItem; cell, {@link XV.ListColumn}; data, {@link XV.ListAttr}
   */
  enyo.kind(/** @lends XV.ListItem# */ {
    name: 'XV.ListItem',
    classes: 'xv-list-item',
    ontap: 'itemTap',
    controlClasses: 'enyo-inline',
    published: {
      selected: null,

      /**
       * @see XM.View#item.template
       */
      template: null,

      /**
       * The backing model for this component.
       * @see XM.EnyoView#model
       */
      value: null
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
      {kind: 'XV.SimpleModelTable', name: 'table', classes: 'enyo-inline', showing: false},
      {kind: 'font.IconButton', icon: 'spinner', options: ['spin'],
        disabled: true, showing: false, ontap: 'gearTap',
        classes: 'xv-list-item-gear'},
    ],

    create: function () {
      this.inherited(arguments);

      XM.View.setPresenter(this, 'item');
    },

    /**
     * @listens templateChanged
     */
    templateChanged: function () {
      this.$.table.setTemplate(this.template);
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
     * Bind value (model) via view, and setup table.
     *
     * @listens valueChanged
     */
    valueChanged: function () {
      this.$.table.setup();
      this.$.table.setShowing(true);
    },

    /**
     * @listens onSetupCell
     * Populate cell with data from model. This is the default; it can be
     * overridden with custom behavior.
     */
    setupCell: function (inSender, inCell) {
      inCell.setContent(
        XV.ModelDecorator.getValue(inCell.attributes.attr, this.value)
      );
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
