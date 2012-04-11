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
    var tab = route.tab,
        settings = route.settings === 'settings';

    switch (tab) {
      case 'track':
        Postbooks.statechart.sendAction('showTrack');
        break;
      case 'secure':
        Postbooks.statechart.sendAction('showSecure');
        break;
      case 'backups':
        if (settings) Postbooks.statechart.sendAction('showBackupsSettings');
        else Postbooks.statechart.sendAction('showBackups');
        break;
      case 'monitoring':
        if (settings) Postbooks.statechart.sendAction('showMonitoringSettings');
        else Postbooks.statechart.sendAction('showMonitoring');
        break;
      // case 'overview':
      default:
        Postbooks.statechart.sendAction('showOverview');
        break;
    }
  },
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
