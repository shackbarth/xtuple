// ==========================================================================
// Project:   XM.Request
// Copyright: Â©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

XM.Request = SC.Request.extend({

  willSend: function(request, response) {
    var session = XM.DataSource.get('session') || {};
    SC.mixin(request.body, session);
  }

});
