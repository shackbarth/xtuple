
sc_require("mixins/binding_manager");
sc_require("controllers/column_data_handler");
sc_require("mixins/helpers");

XT.TableController = SC.ArrayController.extend(
  XT.BindingManager, XT.Helpers, {
  
  //..........................................
  // Default Properties
  //

  /**
    Circular reference to owner/table.
  */
  table: null,

  /**
    The name of the record type to query on.
  */
  recordType: null,

  allowsEmptyCollection: YES,
  allowsMultipleCollection: NO,
  allowsSelection: YES,

  //..........................................
  // Computed Properties
  //

  /** @public
    Returns the current length of the contents array (number of records). 
  */
  length: function() {
    var content = this.get("content");
    return content ? content.get("length") : 0 ;
  }.property("content"),

  //..........................................
  // Observer Methods
  //

  _contentDidChange: function() {
    console.warn("%@: MY CONTENT CHANGED IT CHANGED IT CHANGED!!!! =>".fmt(this), this.get("content"));
  }.observes("content"),

  /** @private */
  columnsSetup: function(columns) {

    // 3 major but simple tasks
    // - set columns on self
    // - create binding for table
    // - create binding for handler
    this.set("columns", columns);

    // create binding on table
    this._xt_create_binding(
      "columns", this, "columns", this.get("table")
    ).oneWay().flushPendingChanges();

    // create binding on handler
    // this._xt_create_binding(
    //   "columns", this, "columns", this.get("dataHandler")
    // ).flushPendingChanges();

    this.msg("columns are done setting up", YES);

    // ok, controller is finally done
    this.sendEvent("completed", "CONTROLLER");
  },

  //..........................................
  // Methods
  //
  
  /** @private */
  init: function() {

    // always useful...
    var self = this;

    // local holder for content
    var content;

    // this.msg("hasSelectionSupport => %@".fmt(this.hasSelectionSupport), YES);

    //....................................
    // Contents Initialization

    ///////////// // need to determine the type so grab the value
    ///////////// var recordType = this.get("recordType"); 
    ///////////// 
    ///////////// // test to figure out what it is
    ///////////// if(SC.typeOf(recordType) === SC.T_STRING) {

    /////////////   this.msg("recordType was => SC.T_STRING (%@)".fmt(recordType), YES);

    /////////////   // since it is a string, we know it is a record type that
    /////////////   // needs to be found without extra "stuff"
    /////////////   content = XT.store.find(SC.objectForPropertyPath(recordType));

    ///////////// } else if(SC.kindOf(recordType, SC.Query) === YES) {

    /////////////   this.msg("recordType was => SC.Query", YES, recordType);

    /////////////   // an SC.Query object is assumed to not have been
    /////////////   // executed (thats why we have a query object instead
    /////////////   // of a record array) so we need to find whatever
    /////////////   // it returns
    /////////////   content = XT.store.find(recordType);
    ///////////// } else if(SC.kindOf(recordType, SC.RecordArray) === YES) {

    /////////////   this.msg("recordType was => SC.RecordArray", YES, recordType);

    /////////////   // if we somewho are handed a record array, just...use
    /////////////   // that...should work, right?
    /////////////   content = recordType;
    ///////////// } else { 

    /////////////   this.msg("what is this?", YES, recordType);

    /////////////   throw this.msg("cannot deal with whatever %@ is".fmt(recordType));

    ///////////// }

    ///////////// // regardless of whether or not we have any data, we can safely set the
    ///////////// // instance to our internal property and just monitor it
    ///////////// this.set("content", content);

    ///////////// // last but not least in terms of contents initialization
    ///////////// // create the binding to the table
    ///////////// this._xt_create_binding(
    /////////////   "content", this, "content", this.get("table")
    ///////////// ).sync().flushPendingChanges();

    // console.warn("%@: content => ".fmt(this), this.get("content"));
    // console.warn("%@: content => ".fmt(this.get("table")), this.getPath("table.content"));

    //....................................

    //....................................
    // Column Data Handler Setup

    // create the handler
    // var handler = XT.ColumnDataHandler.create({
    //   table: self.get("table"),
    //   statechart: self.getPath("table.statechart"),
    //   tableController: self,
    // });

    // bind our contents to his so it can monitor them
    // this._xt_create_binding(
    //   "content", this, "content", handler
    // ).oneWay().flushPendingChanges();

    // keep the reference
    // this.set("dataHandler", handler);

    //....................................

    // do the default stuff
    arguments.callee.base.apply(this, arguments);

    console.warn("%@: parentView of table view is => %@".fmt(this, this.getPath("table.parentView")));

    this._xt_create_binding(
      "content", this.get("table").parentView.controller, "content", this
    );

    this._xt_create_binding(
      "content", this, "content", this.get("table")
    );

    // @note The controller doesn't emit its completed event
    //  until its columnsSetup method is invoked by the initializing
    //  state of the statechart
  },



  //......................................
  // DO NOT CALL THE FOLLOWING DIRECTLY AS IT IS HANDLED
  // BY THE STATECHART!
  //

  recordFromStoreKey: function(storeKey) {
   return this.getPath("content.store").materializeRecord(storeKey);
  },

  /** @private
    Monitor selection changes to notify table.
  */
  selectionDidChange: function() {
    this.get("table").updateLayer();
    // var selection = this.selection();
    // if(selection.get("length") > 0) {
    //   console.log(selection.firstObject());
    // } else { console.log("no selection"); }
  }.observes("selection"),

 });
