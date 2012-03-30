// ==========================================================================
// Project:   XT.Request
// Copyright: Â©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

XT.Request = SC.Request.extend({

  //............................................
  // PROPERTIES
  //

  /**
    The current session hash from the datasource.

    @todo Use a one-way binding or other for more
      efficient retrieval
  */
  session: function() {
    return XT.dataSource.get('session');
  }.property(),

  //............................................
  // METHODS
  //

  /**
    Ensures that the request body contains the session information
    so that the node datasource knows what client it is communicating
    with and that they have an active session.

    @param {SC.Request} request The generated request object.
    @param {SC.Response} response The generated (empty) response object.
  */
  willSend: function(request, response) {
    SC.mixin(request.body, this.get('session'));
  },

  /**
    First opportunity to respond to errors sent back by the
    node datasource (either from the datasource or from the database).

    @todo Implement real error handling, this is merely helping
      know what happens when running Vows tests

    @param {SC.Request} request The generated request object.
    @param {SC.Response} response The generated (populated) response object.
  */
  didReceive: function(request, response) {
    var body = response.get('body');
    if(SC.typeOf(body) === SC.T_HASH) {
      if(body.error) {
        console.log("\n\n**** ERROR RESPONSE FROM SERVER: %@\n\n".fmt(
          body.message || "NO MESSAGE"));
      }
    }
  }

});
