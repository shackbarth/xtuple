
/*globals XT */

/** @namespace

*/
XT.Session = SC.Object.create(
  /** @scope XT.Session.prototype */ {
  
  start: function() {
    console.log("starting session");
    return YES;
  },

}) ;
