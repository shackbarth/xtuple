
/*globals XT */

/** @class

*/
XT.StandardTable = XT.View.extend(
  SC.SelectionSupport,
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

