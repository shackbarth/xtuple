// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.statechart = SC.Statechart.create({

  trace: YES,

  rootState: SC.State.design({

    enterState: function() {
      SC.userDefaults.set('appDomain', 'Postbooks');
    },

    initialSubstate: 'APPLICATION',

    // ACTIONS

    authorizationFailed: function() {
      Postbooks.resetLoginInformation();
      this.gotoState('LOGIN');
    },

    logout: function() { 
      Postbooks.resetLoginInformation();      
      window.location.reload();
    },

    // feedback: function() {
    //   window.open("http://www.xtuple.com/", "feedback"); // FIXME
    // },
    // 
    // help: function() {
    //   window.open("http://www.xtuple.com/", "help"); // FIXME
    // },

    showDashboard: function() {
      this.gotoState('DASHBOARD');
    },

    showCRM: function() {
      this.gotoState('CRM');
    },

    showReceivables: function() {
      this.gotoState('RECEIVABLES');
    },

    showPayables: function() {
      this.gotoState('PAYABLES');
    },

    showGeneralLedger: function() {
      this.gotoState('GENERAL_LEDGER');
    },

    // KEYBOARD SHORTCUTS

    ctrl_m: function() {
      // Do something!
    },

    // SUBSTATES

    // "ACCOUNT": SC.State.plugin('Postbooks.ACCOUNT'),
    // "LOGIN": SC.State.plugin('Postbooks.LOGIN'),
    "APPLICATION": SC.State.plugin('Postbooks.APPLICATION')

  })

});
