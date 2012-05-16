// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.DASHBOARD = SC.State.design({

  enterState: function() {
    SC.routes.set('location', '/dashboard');

    // setTimeout(Postbooks.RenderModelHierarchy, 0);
    Postbooks.LoadDashboard();
  },

  // ACTIONS

  showDashboard: function() {
    // Do nothing.
  }

});
