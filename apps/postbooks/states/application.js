// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.APPLICATION = SC.State.design({

  initialSubstate: 'DASHBOARD',

  enterState: function() {
    XT.dataSource = XT.DataSource.create({ name: 'XT.dataSource' });
    XT.store = XT.Store.create().from(XT.dataSource);
    XT.dataSource.getSession();

    // Use the new package system out of the box for now.
    XT.package = SC.Package.create();
    XT.run();

    SC.routes.add(':tab', Postbooks, Postbooks.routeHandler);
    if (!window.location.hash) {
      this.gotoState('DASHBOARD');
    } else SC.routes.trigger(); // ensures we will enter a substate

    // setTimeout(Postbooks.RenderModelHierarchy, 0);
    Postbooks.LoadDashboard();
  },

  exitState: function() {

  },

  // ACTIONS

  // SUBSTATES

  "DUMMY":          SC.State, // HACK: Prevent "missing initial state" error message from SC.
  "DASHBOARD":      SC.State.plugin('Postbooks.DASHBOARD'),
  "CRM":            SC.State.plugin('Postbooks.CRM'),
  "RECEIVABLES":    SC.State.plugin('Postbooks.RECEIVABLES'),
  "PAYABLES":       SC.State.plugin('Postbooks.PAYABLES'),
  "GENERAL_LEDGER": SC.State.plugin('Postbooks.GENERAL_LEDGER')

});
