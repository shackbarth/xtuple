(function () {

  enyo.kind(/** @lends XV.SimpleModelTable# */{
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
     * Return list of cells in this column.
     */
    column: function (j) {
      return _(this.getComponents()).where({ column: j });
    },

    /**
     * @listens templateChanged
     */
    templateChanged: function () {
      this._createTable();
    },


    // Create the table from template.
    /**
     * @private
     */
    _createTable: function () {
      this.createComponent({
        tag: 'table',
        name: 'table',
        classes: 'xv-table',
        components: _(this.template).map(this._createRow, this)
      });
    },

    // Create a row in the table
    /**
     * @private
     */
    _createRow: function (row, i) {
      return {
        tag: 'tr',
        name: this._rowName(i),
        classes: 'xv-row',
        components: _(row).map(function (cell, j) {
          return this._createCell(cell, i, j);
        }, this)
      };
    },

    // Create a cell in the row.
    /**
     * @private
     */
    _createCell: function (cell, i, j) {
      return {
        tag:  'td',
        name: this._cellName(i, j),
        column: j,
        classes: 'xv-cell',
        attributes: _(cell).omit('id'),
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
