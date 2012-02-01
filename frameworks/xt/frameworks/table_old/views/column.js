
sc_require("delegates/column_delegate");
sc_require("mixins/helpers");

XT.Column = SC.Object.extend(
  XT.ColumnDelegate, XT.Helpers, {

  //.............................................
  // Default Properties
  //

  /**
    Walk like a duck?
  */
  isColumn: YES,

  /**
    Columns can be set to hidden.
  */
  isHidden: NO,

  /**
    The record keys object definitions.
  */
  keys: null,

  /**
    The title of the column.
  */
  title: null,

  /** @private */
  table: null,

  /** @private */
  statechart: null,

  /** @private */
  index: -1,

  //.............................................
  // Computed Properties
  //

  _xt_id: function() {
    return this.getPath("table._xt_id") + "-column";
  }.property("layerId", "table").cacheable(),

  /** @private */
  fields: function() {
    return this.keysFrom(this.get("keys"));
  }.property("keys").cacheable(),

  //.............................................
  // Observers
  //

  //.............................................
  // Methods
  //

  /** @private */
  init: function() {

    // do the default stuff...
    arguments.callee.base.apply(this, arguments);

    // grab the definition
    var def = this.get("definition");

    // set the title
    this.set("title", def.title);

    // set the keys object
    this.set("keys", def.keys);

    //
    this.set("classNames", def.classNames || "xt-default-column-class");

    // set the width
    this.set("width", def.width || 80);
  },

});
