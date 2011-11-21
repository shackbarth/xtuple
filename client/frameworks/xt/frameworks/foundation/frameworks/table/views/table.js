
/*globals XT */

sc_require("delegates/table_delegate");

/** @class

*/
XT.Table = XT.View.extend(
  SC.SelectionSupport, XT.TableDelegate,
  /** @scope XT.Table.prototype */ {

  //...........................................
  // Configurable Properties
  //

  /** @property
    If the table allows for selection of content, and
    an action is given here, it will be executed within
    the context of target (@see target).
  */
  actionOnSelect: null,

  /** @property
    The target for the action to fired on/against or if
    actionOnSelect is a function the target will be set
    as the context (default is the table if none is provided).
  */
  target: null,

  /** @property
    If the table allows selections to be made, set this to YES.
  */
  allowsSelection: YES,

  /** @property
    The content the table is intended to read from, can also be
    set in the form of a default binding to an array controller
    via `contentBinding`.
  */
  content: null,

  /** @property
    The columns to be used for the table display. For the XT.Table class
    it does not use default/standard table columns. Instead it uses a series
    of definitions for unlabeled columns that have content templates and define
    which fields from the records get placed where (as well as many other
    callback features, styling, etc).
  */
  columns: [],

  //...........................................
  // Default Properties
  //

  /** @property
    Walk like a duck?
  */   
  isTable: YES,

  /** @property */
  classNames: "xt-table".w(),

  /** @property */
  layout: { top: 0, left: 0, right: 0, bottom: 0 },

  //............................................
  // Computed Properties
  //
  
  /** @property */
  tableId: function() {
    return "xt-table-" + this.get("layerId");
  }.property("layerId").cacheable(),

}) ;
