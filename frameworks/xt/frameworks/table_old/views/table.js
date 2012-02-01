
sc_require("controllers/table_controller");
sc_require("mixins/binding_manager");
sc_require("mixins/helpers");
sc_require("delegates/table_delegate");
sc_require("mixins/c_scroll");

XT.Table = XT.View.extend(
  XT.BindingManager, XT.TableDelegate, XT.Helpers, CS.CScroll, SC.SelectionSupport, {

  //.............................................
  // Default Properties
  //

  /**
    The root responder is the statechart for the table. The table creates its
    own statechart at initialization so provide the prototype of the statechart
    class or set this to null (so it will default to self) and provide a statechart
    mixin or added methods as necessary.
  */
  defaultResponder: XT.TableStatechart,

  classNames: "xt-table-view-container".w(),

  /**
    The table, by default, will attempt to fix its size to the available space from
    its parent view's provided space.
  */
  layout: { top: 0, left: 0, right: 0, bottom: 0 },

  /**
    Columns should be an array of content from a bound array controller.
  */
  columns: null,

  allowsEmptyCollection: YES,
  allowsMultipleCollection: NO,
  allowsSelection: YES,



  /**
    Walk like a duck?
  */
  isTable: YES,

  /**
    The action that will be fired on the pane or the specified target responder.
  */
  actionOnSelect: null,

  /**
    The target responder. Default is the current pane.
  */
  target: null,

  /**
    Reference to the tableController for this table.
  */
  // tableController: XT.TableController,

  /** @private
    Bound dataset from controller.
  */
  content: null,

  /** @private */
  _xt_column_widths: 0,

  //..............................................
  // Computed Properties
  //

  /** @private */
  _xt_id: function() {
    return "xt-table-" + this.get("layerId");
  }.property("layerId").cacheable(),

  //..............................................
  // Context Menu Support Options
  //

  //..............................................
  // Selection Options
  //

  //..............................................
  // Methods
  //

  /** @private */
  init: function() {

    // do whatever the default is...yada yada
    arguments.callee.base.apply(this, arguments);

    // reference to self
    var self = this;

    //.................................
    // Statechart Initialization

    // create statechart
    var responder = this.get("defaultResponder").create({ owner: self, });

    // initialize statechart
    responder.initStatechart();

    // set it back...
    this.set("defaultResponder", responder);

    // for convenience (for `this.get("statechart")`)
    this.set("statechart", responder);

    //..................................

    //..................................
    // Controller Initialization
    
    // grab the prototype of the controller
    ///////// var controller = this.get("tableController").create({
    ///////// 
    /////////   // give it a reference to this table
    /////////   table: self,

    /////////   // give it a reference to the statechart
    /////////   // so they can communicate
    /////////   statechart: self.get("statechart"),
    /////////   
    /////////   // give it the record type assigned (if any)
    /////////   recordType: self.get("recordType"),
    ///////// });

    // set it back...
    //////this.set("tableController", controller);
     
    //..................................

    //..................................
    // Columns Initialization

    // grab the columns definition object
    var columns = this.get("columns");

    columns.create({
      table: self,
      statechart: responder,
    });

    //..................................

    // the table is done with its initialization routine, notify
    // the statechart so it can check us off
    // this.sendEvent("completed", "TABLE");
  },

  didCreateLayer: function() {
    this.msg("didCreateLayer", YES);

    // try to register now
    // this._cs_register("#" + this.get("_xt_id") + "-table-body");
    // var self = this;
    // setTimeout(function(){ self._cs_register(); console.log(self.get("scrollTarget")); }, 2000);
    this._cs_register();
  },

  didAppendToDocument: function() {
    this.msg("didAppendToDocument", YES);

    // attain original offset
    if(!this._cs_original_offset)
      this._cs_original_offset = this.offset();
  },

  /** @private */
  contentDidChange: function() {

    this.msg("rerendering (replaceLayer) due to content-length change", YES);
    
    // when the length changes, need to rerender
    this.replaceLayer();
  }.observes(".content.length"),

  //..............................................
  // Visual Computations
  //

  /** @private */
  viewDidResize: function() {},

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
  
    this.updateLayer();
    // var selection = this.selection();
    // if(selection.get("length") > 0) {
    //   console.log(selection.firstObject());
    // } else { console.log("no selection"); }
  }.observes("selection"),
  

});

