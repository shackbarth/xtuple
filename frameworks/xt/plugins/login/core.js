
/*globals XT */

sc_require("pages/default");

/** @class

*/
Login = Plugin.Login = Plugin.Object.create(
  /** @scope Plugin.Login.prototype */ {

  /** @property */
  pluginName: "Login",

  /** @property */
  pluginIndex: 0,

  /** @property */
  page: Plugin.pages.login,

  /** @property */
  defaultView: Plugin.DEFAULT_VIEW

}) ;

