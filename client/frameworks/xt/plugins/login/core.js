
/*globals XT */

/** @namespace

  @extends XT.Plugin
*/
PLUGIN.Login = XT.Plugin.create(
  /** @scope PLUGIN.Login.prototype */ {

  /** @propery */
  name: "Login",
   
  /** @private */
  didLoad: function() {
    XT.Router.set("location", "login");
    sc_super();
  }
}) ;

