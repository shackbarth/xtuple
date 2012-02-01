
sc_require("mixins/helpers");

/**
  The column data handler is designed "like" a controller without actually
  "being" one. It is more or less a data handler proxy for logically reshaping
  the row-oriented record data sets into columnar data sets for the view. It
  is also abstracted such that it will handle data translation, manipulation,
  bindings and optimizations for the columnar data and vice versa.
*/
XT.ColumnDataHandler = SC.Object.extend(
  XT.Helpers, {

  //..........................................
  // Default Properties
  //

  /** @private */
  table: null,

  /** @private */
  statechart: null,

  /** @private */
  tableController: null,

  /** @private */
  content: null,

  /** @private */
  columns: null,

  //..........................................
  // Methods
  //

  /** @private */
  init: function() {

    // do normal stuff
    arguments.callee.base.apply(this, arguments);

    this.sendEvent("completed", "DATAHANDLER");
  },

  //..........................................
  // Computations/Handlers
  //

  contentDidChange: function() {
    return; 
  }.observes(".content.length"),

});


/**
  Helper object to simplify and auto-execute some routines
  at initialization for columns to move from definition to
  column object with the appropriate references.
*/
XT.ColumnDefinitions = SC.Object.extend(
  XT.Helpers, {

  //...........................................
  // Default Properties
  //

  /**
    The column definitions as they would be any other way.
  */
  definitions: null,

  /** @private
    Automatically set by the table during its initialization.
  */
  table: null,

  /** @private
    Automatically set by the table during its initialization.
  */
  statechart: null,

  //...........................................
  // Methods
  //
  
  /** @private */
  init: function() {

    // always useful
    self = this;

    // grab the reference to the table and statechart
    var table = this.get("table"), statechart = this.get("statechart");

    // if there is no table, we have a serious problem
    if(!table) throw this.msg("no table reference was available");

    // if there is no statechart we have a serious problem
    if(!statechart) throw this.msg("no statechart reference was available");

    // grab the uninitialized columns
    var columns = this.get("definitions");

    // test to make sure there are definitions
    if(SC.typeOf(columns) !== SC.T_ARRAY || columns.length <= 0) {

      // report that there was an error
      this.sendEvent("_xttv_fatal", this.msg("No column definitions"));

      // nothing else to do...
      this.destroy(); return;
    }

    // we need to sum the total of the explicit widths
    // var sum = 0;

    // number of columns
    // var numberCols = columns.length;

    // should have column definitions now
    // so turn 'em into columns!
    columns = columns.map(function(def, idx, cols) {
      // if(idx !== 0) sum += def.width;
      return XT.Column.create({
        table: table,
        statechart: statechart,
        isFirstColumn: idx === 0 ? YES : NO,
        isLastColumn: idx === 4 || idx + 1 === cols.length ? YES : NO,
        index: idx + 1,
        definition: def,
      });
    });

    // set the sum on the table
    // table.set("_xttv_column_widths", sum);

    // this.msg("_xttv_column_widths => %@".fmt(sum), YES);

    // build the table header (it is separate and only need be
    // rendered once!)
    // var header = SC.RenderContext("div");

    // the outer header container is open so add the classes
    // header.setClass({
    //   "xttv-header-container": YES,
    //   "xttv-common": YES,
    // });

    // set the id
    // header.id(table.get("_xttv_id") + "-header");

    // push the table row for header cells
    // header.push(
    //   '<table cellpadding="0" cellspacing="0" border="0" class="xttv-header-table xttv-table xttv-common">',
    //     '<tr class="xttv-table-header-row xttv-common">'
    // );

    // header.push(
    //   '<td colspan="' + numberCols + '" class="xttv-table-header-label-cell xttv-table-header-cell">',
    //     '<span>Incident Table</span>',
    //   '</td>'
    // );

    // header.push(
    //   '</tr>'
    // );

    // header.push(
    //   '<tr class="xttv-table-header-row xttv-common">'
    // );

    // // render the header portion of each column
    // columns.forEach(function(column) {
    //   column.renderHeader(header);
    // });

    // // close the table header row
    // header.push(
    //     '</tr>',
    //   '</table>'
    // );

    // // get the string of the just built header container
    // header = header.join();

    // // @note This is because the elements are border-box so the margin
    // //  is calculated in the height so margin won't work here

    // // add a spacer row so the scrollbar will be completely visible
    // // header += '<div class="xttv-top-spacer">&nbsp;</div>';

    // // ok set this on the table so it can grab it (in string form)
    // table.set("_xttv_header", header);

    // throw the columns inited event
    // this.sendEvent("columnsInited", columns);

    table.set("columns", columns);

    // no use for this anymore
    this.destroy();
  }, 

});
