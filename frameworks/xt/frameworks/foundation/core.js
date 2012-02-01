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
