
/*globals XT */

/** @class

*/
XT.NestedImageView = SC.ImageView.extend(XT.Logging,
  /** @scope XT.NestedImageView.prototype */ {

  /** @private */
  init: function() {
    
    // need to register a reference to this image in the global
    // image status controllers registry
    XT.StatusImageController.addImage(this.get("value"), this.parentView);
    sc_super();
  },

  /** @private */
  destroy: function() {

    // remove any outside references that we know have been set
    // to ensure we aren't still hanging around unable to be
    // picked up by GC
    XT.StatusImageController.removeImage(this.get("value"));
    sc_super();
  }

}) ;
