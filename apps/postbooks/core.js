// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

//....................................................
// MAKE SURE TO INCLUDE THE GLOBAL PACKAGE MANIFEST
//
{{@projectPackageManifest}}

/** @namespace

  @extends SC.Application
  @extends XT.SessionDelegate
*/
var Postbooks;
Postbooks = global.Postbooks = SC.Application.create(XT.SessionDelegate,
  /** @scope Postbooks.prototype */ {

  NAMESPACE: 'Postbooks',
  VERSION: '{{{POSTBOOKS_VERSION}}}',

  store: null,

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
  TYPEFACE: 'helvetica, arial',

  /**
    Standard row height for one row.
    
    @static
    @constant
    @type Number
    @default 30
  */
  HEIGHT_1_ROW: 30,

  /**
    Standard row height for two rows.
    
    @static
    @constant
    @type Number
    @default 50
  */
  HEIGHT_2_ROW: 50,

  /**
    Standard row height for three rows.
    
    @static
    @constant
    @type Number
    @default 70
  */
  HEIGHT_3_ROW: 70,
  
  /**
    Stndard spacing between widgets.
    
    @static
    @constant
    @type Number
    @default 4
  */
  SPACING: 4,

  /**
    Vertical spacing between logical widget groupings.
    
    @static
    @constant
    @type Number
    @default 12
  */
  VERT_SPACER: 12,

  // Session delegate
  /**
    Called before a request is made to the datasource to
    request a new session. The session hash can be modified
    to reflect any properties needed to be passed on.

    @method
    @param {Object} session A hash of the session's authentication
      credentials and flags.
  */
  willAcquireSession: function(session) {
    if (Postbooks.statechart && Postbooks.statechart.sendAction) {
      Postbooks.statechart.sendAction('willAcquireSession', session);
    }
  },

  /**
    Called once a valid session has been acquired.
    
    @method
    @param {Object} session A hash of the session's properties.
  */
  didAcquireSession: function(session) {
    if (Postbooks.statechart && Postbooks.statechart.sendAction) {
      Postbooks.statechart.sendAction('didAcquireSession', session);
    }
  },

  /**
    Called once a session request returns with a multiple
    sessions available code and requires either a selection
    from the available sessions or a flag to begin a new
    session is returned.

    If the delegate handles this request ensure that it returns
    a boolean true or the session handler will attempt to.

    @method
    @param {Array} available The available sessions to choose from.
    @param {Function} ack The ack method to be called by passing it an
      integer of the index of the chosen available session or the
      XT.SESSION_FORCE_NEW boolean flag if a new session is required.
    @returns {Boolean} true|false if the delegate handled the ack.
  */
  didReceiveMultipleSessions: function(available, ack) {
    if (Postbooks.statechart && Postbooks.statechart.sendAction) {
      Postbooks.statechart.sendAction('didReceiveMultipleSessions', available, ack);
    }
  },
  
  /**
    Called when a session was successfully logged out.

    @method
  */
  didLogoutSession: function() {
    if (Postbooks.statechart && Postbooks.statechart.sendAction) {
      Postbooks.statechart.sendAction('didLogoutSession');
    }
  }, 

  /**
    Called when the session is lost for any reason
    (even on successful logout). The reason code can
    be used to dictate further action based on what
    type of disconnect has been experienced.

    TODO: The reason should ultimately be a code?
    TODO: Is it even possible for a web app to determine
      network loss?

    Options:
      timeout
      network
      logout
      unknown

    @method
    @param {String} reason String indicator of what happened.
  */
  didLoseSession: function(reason) {
    if (Postbooks.statechart && Postbooks.statechart.sendAction) {
      Postbooks.statechart.sendAction('didLoseSession');
    }
  },

  /**
    Called when there has been a session related error.

    @method
    @param {String} message The error message.
    @param {Number} code The error code.
  */
  didError: function(message, code) {
    if (Postbooks.statechart && Postbooks.statechart.sendAction) {
      Postbooks.statechart.sendAction('sessionDidError', message, code);
    }
  }

});

XT.session.delegate = Postbooks;

SC.LabelLayer.prototype.font = "10pt "+Postbooks.TYPEFACE;
SC.TextLayer.prototype.font = "10pt "+Postbooks.TYPEFACE;

// Alias.
Postbooks.getStates = Postbooks.getState;

// Remotely record when exceptions occur.
// SC.ExceptionHandler.handleException = function(exception) {
//   SC.Logger.warn('Custom Exception');
// 
//   var state = "No States";
//   if (Postbooks.statechart && Postbooks.statechart.sendAction) {
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

Postbooks.RenderModelHierarchy = function() {
  var ui = document.getElementById('ui');

  document.body.removeAttribute('style');

  ui.style.color = 'black';
  document.body.style.backgroundColor = 'white';

  var handleChildAttribute, handleRecordAttribute, processRecordClass;

  var relationships = 0;

  handleChildAttribute = function(key, attribute, parentElement) {
    // console.log('handleChildAttribute', key);
    relationships++;

    var p = document.createElement('p'),
        ul = document.createElement('ul'),
        li = document.createElement('li'),
        typeClass = attribute.get('typeClass');

    p.innerText = "(%@, nested) %@:".fmt(attribute.isChildrenAttribute? 'to many' : 'to one', key);
    parentElement.appendChild(p);
    parentElement.appendChild(ul);

    ul.appendChild(li);
    processRecordClass(typeClass, li);
  };

  handleRecordAttribute = function(key, attribute, parentElement) {
    // console.log('handleRecordAttribute', key);

    var typeClass = attribute.get('typeClass');

    if (typeClass === String) typeClass = 'String';
    else if (typeClass === Number) typeClass = 'Number';
    else if (typeClass === Boolean) typeClass = 'Boolean';
    else if (typeClass === Array) typeClass = 'Array';
    else if (typeClass === Object) typeClass = 'Hash';

    parentElement.innerText = "%@: %@ (%@)".fmt(key, typeClass, attribute.get('isEditable')? 'editable' : 'not editable');
  };

  processRecordClass = function(klass, parentElement) {
    // console.log('processRecordClass', klass.prototype.className);

    var p = document.createElement('p'),
        ul = document.createElement('ul');

    p.innerText = klass.prototype.className;
    parentElement.appendChild(p);
    parentElement.appendChild(ul);
    
    var proto = klass.prototype;
    
    for (var key in proto) {
      var property = proto[key];
      if (property && property.isRecordAttribute) {
        var li = document.createElement('li');
        ul.appendChild(li);
    
        if (property.isChildrenAttribute) handleChildAttribute(key, property, li);
        else if (property.isChildAttribute) handleChildAttribute(key, property, li);
        else if (property.isRecordAttribute) handleRecordAttribute(key, property, li);
      }
    }
  };

  var ul = document.createElement('ul');

  var child; while (child = document.body.firstElementChild) document.body.removeChild(child);
  document.body.appendChild(ul);
  document.body.style.overflowY = 'scroll';

  // var classes = [];
  // for (var key in XM) {
  //   if (key.slice(0,1) === '_') continue;
  //   var klass = XM[key];
  //   if (klass && klass.isClass && klass.subclassOf(XM.Record)) classes.push(klass);
  // }

  var count = 0;
  for (var key in XM) {
    if (key.slice(0,1) === '_') continue;
    var klass = XM[key];
    if (klass && klass.isClass && klass.subclassOf(XM.Record)) count++;
  }
  console.log('XM has', count, 'non-generated XM.Record subclasses.');

  // TODO: Find out why CashReceipt and CreditMemo have permission errors.
  // var xtupleClasses = 'Account BankAccount CashReceipt CreditMemo Customer Incident Invoice LedgerAccount Opportunity Payable Payment Receivable ToDo Vendor Voucher Project'.w();
  var xtupleClasses = 'Account BankAccount Customer Incident Invoice Opportunity Receivable ToDo Project'.w();

  console.log("There are", xtupleClasses.length, "root classes in the 'xtuple' XBO:");
  xtupleClasses.forEach(function(className, idx) {
    var klass = XM[className];
    sc_assert(klass);
    sc_assert(klass.isClass);
    sc_assert(klass.subclassOf(XT.Record));

    var li = document.createElement('li');
    ul.appendChild(li);
    processRecordClass(klass, li);
    console.log(idx + 1, klass);
  });

  console.log("There are", relationships, "child relationships.");
};
