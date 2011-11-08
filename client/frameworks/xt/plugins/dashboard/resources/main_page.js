
/*globals Dashboard */

sc_require("panes/default");

/** @class

*/
Dashboard.mainPage = XT.BasePage.design(
  /** @scope Dashboard.mainPage.prototype */ {

  defaultPane: Dashboard.DefaultPane.design() 

}) ;
