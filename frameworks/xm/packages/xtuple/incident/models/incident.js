// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_incident');

/**
  @class

  @extends XM.Document
  @extends XM.Documents
*/
XM.Incident = XM.Document.extend(XM._Incident, XM.Documents, 
  /** @scope XM.Incident.prototype */ {

  numberPolicy: XT.AUTO_NUMBER,

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  validate: function() {
    var isErr, errors = arguments.callee.base.apply(this, arguments),
        K = XM.Incident;
    
    // Validate assignee
    isErr = this.get('incidentStatus') === K.ASSIGNED &&
            !this.get('assignedTo');
    err = XT.errors.findProperty('code', 'xt1025');
    this.updateErrors(err, isErr);
    
    return errors;
  }.observes('assignedTo', 'incidentStatus'),
  
  /* @private */
  assignedToDidChange: function() {
    if (this.isNotDirty()) return;
    var assignedTo = this.get('assignedTo'),
        K = XM.Incident;
     
    if (assignedTo) this.set('incidentStatus', K.ASSIGNED);
  }.observes('assignedTo'),

  notes: SC.Record.attr(String, {
    label: '_notes'.loc(),
    isVisibleInView: false
  }),

});

XM.Incident.mixin( /** @scope XM.Incident */ {

/**
  New status.
  
  @static
  @constant
  @type String
  @default N
*/
  NEW: 'N',

/**
  Feedback status.
  
  @static
  @constant
  @type String
  @default F
*/
  FEEDBACK: 'F',

/**
  Confirmed Status.
  
  @static
  @constant
  @type String
  @default I
*/
  CONFIRMED: 'C',

/**
  Assigned status.
  
  @static
  @constant
  @type String
  @default A
*/
  ASSIGNED: 'A',
  
/**
  Resolved status.
  
  @static
  @constant
  @type String
  @default R
*/
  RESOLVED: 'R',

/**
  Closed status.
  
  @static
  @constant
  @type String
  @default L
*/
  CLOSED: 'L'

});

XM.Incident.statusItems = 'NEW FEEDBACK CONFIRMED ASSIGNED RESOLVED CLOSED'.w().map(function(key) {
  return {
    title: ('_'+key.toLowerCase()).loc(),
    value: XM.Incident[key]
  };
});
