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

    popModule: function() {
      var modalContexts = Postbooks.get('modalContexts');
      if (modalContexts.length === 0) return;
      var currentModal = modalContexts.popObject();
      var frame = currentModal.surface.get('frame');
      frame.x = SC.app.computeViewportSize().width;

      Postbooks.set('submoduleTitle', currentModal.submoduleTitle);
      Postbooks.set('submoduleBackButtonTitle', currentModal.submoduleBackButtonTitle);
      Postbooks.set('submoduleBackButtonAction', currentModal.submoduleBackButtonAction);

      setTimeout(function() {
        SC.RunLoop.begin();
        SC.app.removeSurface(currentModal.surface);
        SC.RunLoop.end();
      }, 250);
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
