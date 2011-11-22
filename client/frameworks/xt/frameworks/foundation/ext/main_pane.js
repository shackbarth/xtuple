
/*globals XT */

sc_require("mixins/logging");

/** @class
  
*/
XT.MainPane = SC.MainPane.extend(XT.Logging,
  /** @scope XT.MainPane.prototype */ {

  classNames: "xt-main-pane".w(),

  init: function() {
    var ret = sc_super();
    XT.BASE_PANE = this;
    return ret;
  }

}) ;
