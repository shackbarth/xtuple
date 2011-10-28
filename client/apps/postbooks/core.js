
/*globals Postbooks */

/** @namespace
  
  @extends SC.Object
*/
Postbooks = SC.Application.create(
  /** @scope Postbooks.prototype */ {

  NAMESPACE: 'Postbooks',
  VERSION: '0.1.0',

  store: SC.Store.create().from(SC.Record.fixtures)
  
}) ;
