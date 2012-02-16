// ==========================================================================
// Project:   XM.Request
// Copyright: Â©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

XM.Request = SC.Request.extend({

  willSend: function(request, response) {
    var session = XM.DataSource.get('session') || {};
    SC.mixin(request.body, session);
  },

  didReceive: function(request, response) {
    var body = response.get('body');
    if(SC.typeOf(body) === SC.T_HASH) {
      if(body.error) {
        console.log("\n\n**** ERROR RESPONSE FROM SERVER: %@\n\n".fmt(
          body.message || "NO MESSAGE"));
        response.cancel();
      }
    }
  }

});
