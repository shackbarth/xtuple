
/*globals XT */

/** @namespace


*/
XT.PluginController = XT.ObjectController.create(
  /** @scope XT.PluginController.prototype */ {

  //...............................................
  // Public Methods
  //

  /**
    Plugins are activated and their content shown by calling
    their `focus` methods. In-turn they call this method
    passing themselves and additional properties as paramaters.
  */
  focus: function(plugin) {
    if(!plugin || SC.none(plugin) || !plugin.isPlugin) return NO;
    
    // @todo Needs to handle specific arguments
    var path = plugin.getPath("mainPage.defaultPane");
    var curr = this._currentPane;
    if(curr) curr.remove();
    path.append();
    this._currentPane = path; 
  },

  //...............................................
  // Private Properties
  //

  /** @private */
  _currentPane: null,
  
   

}) ;
