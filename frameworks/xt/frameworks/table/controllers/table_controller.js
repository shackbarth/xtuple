
/*globals XT */

/** @class

  @todo NEEDS PAGING!

*/
XT.TableController = XT.ArrayController.extend(
  /** @scope XT.TableController.prototype */ {

  //...............................................
  // Public Properties
  //

  /** @property
    The reference to the owner/table of this table controller
    is set at creation time by the table. You should not need
    to modify this property.
  */
  table: null,

  //...............................................
  // Public Methods
  //

  /** @public
    Allows the table to pass a query to the controller to have
    it auto-populate based on the query type.
  */
  query: function(query) {
    if(SC.none(query)) query = this.getPath("table.query");
    if(SC.typeOf(query) === SC.T_STRING)
      query = SC.objectForPropertyPath(query);
    if(!SC.kindOf(query, XM.Record) && !SC.kindOf(query, SC.Query)) {
      this.warn("Could not query because no query was available!");
      return NO;
    }
    var c = XT.Store.find(query);
    if(c) this.set("content", c);
    this._connectContentToTable();
  },

  //...............................................
  // Bindings
  //
  
  /** @private */
  _contentBindingToTable: null,

  //...............................................
  // Observers
  //

  /** @private */
  _contentStatus: function() {
    var s = this.getPath("content.status");
    this.log("Status of query changed => %@".fmt(s));
  }.observes("*content.status"),

  //...............................................
  // Private Methods
  //
  
  /** @private */
  _connectContentToTable: function() {
    var cb = this._contentBindingToTable;
    if(!cb) {
      var t = this.get("table");
      cb = SC.Binding
        .from("content", this)
        .to("content", t)
        .oneWay()
        .sync();
    }
    cb.connect().flushPendingChanges();
    this._contentBindingToTable = cb;
  },
  
  /** @private */
  destroy: function() {
    sc_super();
    this.table = null;
    if(this._contentBindingToTable)
      this._contentBindingToTable.disconnect();
    this._contentBindingToTable = null;
  },
  
  /** @private
    Selection support is a part of array controllers. If selectObject
    is called it will forward the request to selectObjects so this is
    a single place to intercept and add this additional tidbit of functionality.
  */
  selectObjects: function() {
    sc_super();
    this.getPath("selection.firstObject").set("isSelected", YES);
    return this;
  }

}) ;
