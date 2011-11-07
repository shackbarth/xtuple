
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
    XT.PostbooksStatechart.sendEvent("loginPluginLoaded");
  },

  /** @private
    This method will show the login fields in an animated fashion.
  */
  showLogin: function() {
    XT.MessageController.set("loadingStatus", "_need to login".loc());
    var mb = this.getPath("mainPage.defaultPane.mainBlock");
    mb.xtAnimate("showLogin");
  },

  showLoggingIn: function() {
    var lb = this.getPath("mainPage.defaultPane.mainBlock.messageBlock.loginBlock");
    lb.xtAnimate("loggingIn");
  }

}) ;

