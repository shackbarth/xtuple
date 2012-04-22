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
  },
  
  /**
    System typeface.
    
    @static
    @constant
    @type String
    @default 550
  */
  TYPEFACE: 'curier',
  
  /**
    List width considered portrait mode.
    
    @static
    @constant
    @type Number
    @default 550
  */
  PORTRAIT_LIST_WIDTH: 550,

  /**
    Stndard row height for three rows.
    
    @static
    @constant
    @type Number
    @default 30
  */
  HEIGHT_1_ROW: 30,

  /**
    Stndard row height for three rows.
    
    @static
    @constant
    @type Number
    @default 50
  */
  HEIGHT_2_ROW: 50,

  /**
    Stndard row height for three rows.
    
    @static
    @constant
    @type Number
    @default 70
  */
  HEIGHT_3_ROW: 70

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
