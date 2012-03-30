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

  numberPolicy: XM.AUTO_NUMBER,

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    @type String
  */
  incidentStatus: SC.Record.attr(String, {
    defaultValue: 'N'
  }),
  
  /* @private */
  accountsLength: 0,
  
  /* @private */
  accountsLengthBinding: SC.Binding.from('*incidents.length').noDelay(),
  
  /* @private */
  incidentsLength: 0,
  
  /* @private */
  incidentsLengthBinding: SC.Binding.from('*incidents.length').noDelay(),

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
  
  /* @private */
  _xm_accountsDidChange: function() {
    var documents = this.get('documents'),
        accounts = this.get('accounts');

    documents.addEach(accounts);    
  }.observes('accountsLength'),
  
  /* @private */
  _xm_incidentsDidChange: function() {
    var documents = this.get('documents'),
        incidents = this.get('incidents');

    documents.addEach(incidents);    
  }.observes('incidentsLength')

});

XM.Incident.mixin( /** @scope XM.Incident */ {

/**
  New status.
  
  @static
  @constant
  @type String
  @default N
*/
  STATUS_NEW: 'N',

/**
  Feedback status.
  
  @static
  @constant
  @type String
  @default F
*/
  STATUS_FEEDBACK: 'F',

/**
  Confirmed Status.
  
  @static
  @constant
  @type String
  @default I
*/
  STATUS_CONFIRMED: 'C',

/**
  Assigned status.
  
  @static
  @constant
  @type String
  @default A
*/
  STATUS_ASSIGNED: 'A',
  
/**
  Resolved status.
  
  @static
  @constant
  @type String
  @default R
*/
  STATUS_RESOLVED: 'R',

/**
  Closed status.
  
  @static
  @constant
  @type String
  @default L
*/
  STATUS_CLOSED: 'L'

});
