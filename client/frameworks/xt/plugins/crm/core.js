
/*globals XT */

/** @namespace

  @extends XT.Plugin
*/
Crm = PLUGIN.Crm = XT.Plugin.create(
  /** @scope PLUGIN.Crm.prototype */ {

  didLoad: function() {
    sc_super();
    this.focus(); 
  }
    
}) ;
