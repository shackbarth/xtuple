// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

/** @namespace

  @extends SC.Application
*/
var Postbooks;
Postbooks = global.Postbooks = SC.Application.create(
  /** @scope Postbooks.prototype */ {

  NAMESPACE: 'Postbooks',
  VERSION: '{{{POSTBOOKS_VERSION}}}',

  submoduleTitle: "(no title)",
  submoduleBackButtonTitle: "(unknown)",
  submoduleBackButtonAction: null,

  modalContexts: [],

  // Debugging
  getState: function() {
    return Postbooks.statechart.get('currentStates').map(function(s) { return s.get('fullPath'); });
  },

  // Forward to statechart.
  authorizationFailed: function() {
    Postbooks.statechart.sendEvent('authorizationFailed');
  },

  // API
  resetLoginInformation: function() {
    alert('Implement me');
  },

  routeHandler: function(route) {
    var tab = route.tab;

    switch (tab) {
      case 'crm':
        Postbooks.statechart.sendAction('showCRM');
        break;
      case 'billing':
        Postbooks.statechart.sendAction('showBilling');
        break;
      case 'payments':
        Postbooks.statechart.sendAction('showPayments');
        break;
      case 'ledger':
        Postbooks.statechart.sendAction('showLedger');
        break;
      // case 'dashboard':
      default:
        Postbooks.statechart.sendAction('showDashboard');
        break;
    }
  }

});

// Remotely record when exceptions occur.
// SC.ExceptionHandler.handleException = function(exception) {
//   SC.Logger.warn('Custom Exception');
// 
//   var state = "No States";
//   if (Postbooks.statechart) {
//     var statechart = Postbooks.statechart.get('currentStates');
//     if (statechart) {
//       state = statechart.map(
//       function(state) {
//         return state.get('fullPath');
//       }).join(', ');
//     }
//   }
// 
//   console.log(exception, exception.stack);
// 
//   XT.sendException(exception, state, Postbooks.deviceController.get('deviceID'));
// 
//   if (this.isShowingErrorDialog) return;
//   this._displayErrorDialog(exception);
// };
