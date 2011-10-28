
/*globals XT */

/** @class

  @extends SC.Object
*/
XT.Xbo = SC.Object.extend(
  /** @scope XT.Xbo.prototype */ {

  init: function() {
    sc_super();
    XT._xbo_manager.didLoad(this);
  },
    
  /**
    The associated model for this Xbo.
  */
  model: null,
  
  /**
    The primary view for this Xbo.
  */
  view: null,
  name: null,
}) ;