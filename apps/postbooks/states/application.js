// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.APPLICATION = SC.State.design({

  initialSubstate: 'DASHBOARD',

  enterState: function() {
    XT.dataSource = XT.DataSource.create({ name: 'XT.dataSource', logLocal: true });
    XT.store = XT.Store.create().from(XT.dataSource);
    Postbooks.set('store', XT.store);

    XT.package = XT.Package.create();
    XT.run();

    // the delegate needs to be set before the session has been
    // acquired, it is set on the XT.session object/controller

    // TEMPORARY HACK
    // THIS WAS MOVED TO onload.js from the socket package in xt
    // XT.session.acquireSession('admin', 'admin', '380postbooks');

    SC.routes.add(':tab', Postbooks, Postbooks.routeHandler);
    if (!window.location.hash) {
      this.gotoState('DASHBOARD');
    } else SC.routes.trigger(); // ensures we will enter a substate
  },

  exitState: function() {

  },

  // ACTIONS

  // SUBSTATES

  "DASHBOARD": SC.State.plugin('Postbooks.DASHBOARD'),
  "CRM":       SC.State.plugin('Postbooks.CRM'),
  "BILLING":   SC.State.plugin('Postbooks.BILLING'),
  "PAYMENTS":  SC.State.plugin('Postbooks.PAYMENTS'),
  "LEDGER":    SC.State.plugin('Postbooks.LEDGER')

});
