
/*globals XT */

sc_require("delegates/table_delegate");

/** @class

*/
XT.Table = XT.AnimationView.extend(
  XT.TableDelegate, // CS.CScroll,
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
    Set this to the name of the template to be used for the rows or the class
    to use with a built-in templateName already.
    
    @type {String|Object}
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
  
  /** @property
    XT.Table only supports single selection. To use multiple selection
    you would have to use XT.StandardTable to do multi-row modifications
    or adjustments.
  */
  allowsMultipleSelection: NO,

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

  /** @property */
  displayProperties: "selection".w(),

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
  
  /** @private */
  select: function(row) {
    var c = this.get("controller"), cs;
    cs = c.getPath("selection.firstObject");
    if(cs) cs.set("isSelected", NO);
    c.selectObject(row);
    
    // @todo This needs to be revisited because it should
    //  be telling the update delegate exactly what changed
    //  since it should also be working on adding content
    //  in the future without rerendering the entire table
    this.updateLayer();
  },
  
  /** @private */
  xtWillAppend: function() {
    arguments.callee.base.apply(this, arguments);
  },
  
  /** @private */
  xtDidAppend: function() {
    if(isNaN(this._cs_original_offset))
      this._cs_original_offset = this.offset();
    this._registerForScrolling();
  },
  
  /** @private */
  xtDidRemove: function() {
    this._cs_unregister();
  },
  
  /** @private */
  didCreateLayer: function() {
    this._registerForScrolling();
  },
  
  /** @private */
  _registerForScrolling: function() {
    this._cs_register();
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