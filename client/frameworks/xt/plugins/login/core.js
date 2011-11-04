
/*globals XT */

/** @namespace

  @extends XT.Plugin
*/
Login = PLUGIN.Login = XT.Plugin.create(
  /** @scope PLUGIN.Login.prototype */ {

  /** @propery */
  name: "Login",
   
  /** @private */
  didLoad: function() {
    sc_super();
    this.focus();
  }
}) ;

