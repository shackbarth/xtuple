// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_incident_info');
sc_require('mmodels/incident');

/**
  @class

  @extends XT.Record
*/
XM.IncidentInfo = XT.Record.extend(XM._IncidentInfo,
  /** @scope XM.IncidentInfo.prototype */ {

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

});

