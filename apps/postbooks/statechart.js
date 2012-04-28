// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.TRACE = false; // Set to true to trace when not on localhost.

Postbooks.statechart = SC.Statechart.create({

  trace: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || Postbooks.TRACE),

  rootState: SC.State.design({

    initialSubstate: 'APPLICATION',

    enterState: function() {
      SC.userDefaults.set('appDomain', 'Postbooks');
    },

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

      // Wait for the surface to exit the viewport before removing it.
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
      if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.DASHBOARD)) return;
      else this.gotoState('DASHBOARD');
    },

    showCRM: function() {
      if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.CRM)) return;
      else this.gotoState('CRM');
    },

    showBilling: function() {
      if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.BILLING)) return;
      else this.gotoState('BILLING');
    },

    showPayments: function() {
      if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.PAYMENTS)) return;
      else this.gotoState('PAYMENTS');
    },

    showLedger: function() {
      if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.LEDGER)) return;
      else this.gotoState('LEDGER');
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
