/*globals XM Xbo */

sc_require("runtime/common");

/** @class */
Xbo.Object = XM.Xbo = XM.Object.extend(
  /** @scope Xbo.Object.prototype */ {

  /** @property
    Walk like a duck?
  */
  isXbo: YES, 

  /** @property
    The name of the Xbo.
  */
  xboName: Xbo.DEFAULT_NAME,
  
  //..........................................
  // Calculated Properties
  //

  /** @property
    An array of Plugins that have patched
    this Xbo.
  */
  patchedBy: function() {}.property(),

  //........................................
  // Public Methods
  //
  
  /** @public
    Interface to patch the actual underlying model.
  */ 
  patch: function(patch) {},

  /** @public
    Test to see if this Xbo has been matched by a particular
    Plugin.
  */
  isPatchedBy: function(plugin) {},

  /** @public
    Retrieves and returns the underlying model (record class).
  */
  model: function() {}.property(),

  //........................................
  // Private Methods
  //

  /** @private */
  _didLoadXbo: function() {}

});
