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
  
  /**
    Returns the color of the incident corresponding with its status.
    
    @type String
  */
  color: function() {
    var incidentStatus = this.get('incidentStatus'),
        settings = XT.session.settings, ret,
        K = XM.Incident;
    switch (incidentStatus) {
      case K.NEW:
        ret = settings.get('IncidentNewColor');
        break;
      case K.FEEDBACK:
        ret = settings.get('IncidentFeedbackColor');
        break;
      case K.CONFIRMED:
        ret = settings.get('IncidentConfirmedColor');
        break;
      case K.ASSIGNED:
        ret = settings.get('IncidentAssignedColor');
        break;
      case K.RESOLVED:
        ret = settings.get('IncidentResolvedColor');
        break;
      case K.CLOSED:
        ret = settings.get('IncidentClosedColor');
        break;
      default:
        ret = 'white';
    }
    return ret;
  }.property('incidentStatus').cacheable(),
  
  /**
    Returns the status as a localized string.
    
    @type String
  */
  incidentStatusString: function() {
    var incidentStatus = this.get('incidentStatus'),
        K = XM.Incident, ret;
    switch (incidentStatus) {
      case K.NEW:
        ret = "_new".loc();
        break;
      case K.FEEDBACK:
        ret = "_feedback".loc();
        break;
      case K.CONFIRMED:
        ret = "_confirmed".loc();
        break;
      case K.ASSIGNED:
        ret = "_assigned".loc();
        break;
      case K.RESOLVED:
        ret = "_resolved".loc();
        break;
      case K.CLOSED:
        ret = "_closed".loc();
        break;
      default:
        ret = "_error".loc();
    }
    return ret;
  }.property('incidentStatus').cacheable(),
  
  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  validate: function() {
    var isErr, errors = arguments.callee.base.apply(this, arguments);
    
    // Validate assignee
    isErr = this.get('incidentStatus') === XM.Incident.STATUS_ASSIGNED &&
            !this.get('assignedTo');
    err = XT.errors.findProperty('code', 'xt1025');
    this.updateErrors(err, isErr);
    
    return errors;
  }.observes('assignedTo', 'incidentStatus'),
  
  /* @private */
  _xm_assignedToDidChange: function() {
    var assignedTo = this.get('assignedTo'),
        status = this.get('status');
     
    if(assignedTo &&
      (status == SC.Record.READY_DIRTY || status == SC.Record.READY_NEW))
      this.set('incidentStatus','A');
  }.observes('assignedTo'),

  notes: SC.Record.attr(String, {
    label: '_notes'.loc(),
    isVisibleInView: false
  }),

  /**
    Custom Views
  */
  customTileViews: [
    'XM.IncidentNotes'//,
//    'XM.IncidentStatus'
  ]
  
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
