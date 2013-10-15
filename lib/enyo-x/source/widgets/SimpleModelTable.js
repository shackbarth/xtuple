(function () {

  enyo.kind({
    name: 'XV.SimpleModelTable',
    published: {
      template: null
    },
    events: {
      onSetupCell: ''
    },

    /**
     * Fire setup events on each cell in order to populate and decorate the
     * table.
     */
    setup: function () {
      _(_(this.getComponents()).where({ tag: 'td' })).each(function (cell) {
        this.doSetupCell(cell);
      }, this);
    },

    /**
     * Return the cell control at [i, j]
     */
    cell: function (i, j) {
      return this.$[this._cellName(i, j)];
    },

    /**
     * Return the row control at index i.
     */
    row: function (i) {
      return this.$[this._rowName(i)];
    },

    /**
     * @listens templateChanged
     */
    templateChanged: function () {
      this._createTable();
    },

    /**
     * @private
     * Create the table from template.
     */
    _createTable: function () {
      this.createComponent({
        tag: 'table',
        name: 'table',
        components: _(this.template).map(this._createRow, this)
      });
    },

    /**
     * @private
     * Create a row in the table
     */
    _createRow: function (row, i) {
      return {
        tag: 'tr',
        name: this._rowName(i),
        components: _(row).map(function (cell, j) {
          return this._createCell(cell, i, j);
        }, this)
      };
    },

    /**
     * @private
     * Create a cell in the row.
     */
    _createCell: function (cell, i, j) {
      return {
        tag:  'td',
        name: this._cellName(i, j),
        attributes: _(cell).omit('name')
      };
    },

    /**
     * Generate the cell name from the i,j pair.
     */
    _cellName: function (i, j) {
      return 'cell-' + i + '-' + j;
    },

    /**
     * Generate the row name from the index.
     */
    _rowName: function (i) {
      return 'row-' + i;
    }

  });
})();
