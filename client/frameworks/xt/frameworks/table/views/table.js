
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
    The query can be either a SC.Query object, a XM.Record class, or
    a string representing the XM.Record class to query on. If non-default
    controller is used, options should be set on it to handle the type that
    will be set here.
  */
  query: null,

  /** @property
    The columns to be used for the table display. For the XT.Table class
    it does not use default/standard table columns. Instead it uses a series
    of definitions for unlabeled columns that have content templates and define
    which fields from the records get placed where (as well as many other
    callback features, styling, etc).
  */
  columns: [],
  
  /** @property
    This needs to be set to a class of the type of controller the table
    should use for its content management. This controller MUST inherit from
    XT.TableController.
  */
  controllerClass: XT.TableController,
  
  /** @property
    Set this to YES if you want the table to auto-query as soon as it is created.
  */
  queryOnStart: YES,
  
  /** @property
    Set this to the name of the template to be used for the rows.
    
    @type {String}
  */
  rowTemplate: XT.DEFAULT_ROW_TEMPLATE,

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
  
  //............................................
  // Public Methods
  //
  
  /** @public
    Forwards the table's query request to the controller for
    updating content.
  */
  query: function() {
    var tc = this.get("controller");
    if(!tc) return this.warn("Could not query for table, no controller present!");
    tc.query();
  },

  //............................................
  // Private Properties
  //

  //............................................
  // Private Methods
  //
  
  /** @private */
  showMessage: function(which) {
    switch(which) {
      case "error":
        this.set("_message", XT.Table.ERROR_MESSAGE);
        break;
      case "loading":
        this.set("_message", XT.Table.LOADING_MESSAGE);
        break;
    }
    this.replaceLayer();
  },
  
  //............................................
  // Observers
  //
  
  /** @private */
  _contentStatus: function() {
    var s = this.getPath("content.status");
    this.log("Content status changed! => %@".fmt(s));
    if(s === SC.Record.READY_CLEAN) {
      this.replaceLayer();
    } else if(s === SC.Record.ERROR) {
      this.showMessage("error");
    } else { this.showMessage("loading"); }
  }.observes("*content.status"),
  
  /** @private */
  _contentLength: function() {
    
    // @todo This needs to use update for incremental loading
    //  but for now it is just rerendering the entire table
    this.replaceLayer();
  }.observes("*content.length"),

  
}) ;

XT.Table.LOADING_MESSAGE = "Loading content...";
XT.Table.ERROR_MESSAGE = "Error loading data.";