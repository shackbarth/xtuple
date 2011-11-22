
/*globals XT */

/** @namespace
  
  @extends SC.Object
*/
XT = SC.Object.create(
  /** @scope XT.prototype */ {
    
  NAMESPACE: "XT",
  VERSION: "4.0.0ALPHA",

  /** @property */
  logLevels: SC.Object.create({
    warn: YES,
    info: YES,
    error: YES
  })
  
}) ;

SC.ready(function() {
  Postbooks.getPath("mainPage.mainPane").append();
}) ;

XM = SC.Object.create(
  /** @scope XM.prototype */ {

  NAMESPACE: "XM",
  VERSION: "4.0.0ALPHA"

}) ;
