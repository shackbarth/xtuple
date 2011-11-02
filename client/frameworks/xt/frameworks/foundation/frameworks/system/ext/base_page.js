
/*globals XT */

sc_require("ext/main_pane");

/** @class

*/
XT.BasePage = SC.Page.extend(XT.Logging,
  /** @scope XT.BasePage.prototype */ {

  basePane: XT.MainPane.design()

}) ;
