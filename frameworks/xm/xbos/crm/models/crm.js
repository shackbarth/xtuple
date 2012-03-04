// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('mixins/settings');

/** @class

  (Document your Model here)

  @extends XM.Object
  @version 0.1
*/

XM.Crm = XM.Object.extend( XM.Settings,
/** @scope XM.Crm.prototype */ {

  className: 'XM.Crm',
  
  /**
    @type Number
  */
  nextCRMAccountNumberBinding: '*settings.NextCRMAccountNumber',

  /**
    @type Number
  */  
  nextIncidentNumberBinding: '*settings.NextIncidentNumber',

  /**
    @type String
  */  
  crmAccountNumberGenerationBinding: '*settings.CRMAccountNumberGeneration',
  
  /**
    @type Boolean
  */
  useProjectsBinding: '*settings.UseProjects',
 
  /**
    @type Boolean
  */ 
  autoCreateProjectsForOrdersBinding: '*settings.AutoCreateProjectsForOrders',
  
  /**
    @type Boolean
  */
  opportunityChangeLogBinding: '*settings.OpportunityChangeLog',
  
  /**
    @type String
  */
  defaultAddressCountryBinding: '*settings.DefaultAddressCountry',

  /**
    @type Boolean
  */
  strictAddressCountryBinding: '*settings.StrictAddressCountry',

  /**
    @type Boolean
  */  
  incidentsPublicPrivateBinding: '*settings.IncidentsPublicPrivate',

  /**
    @type Boolean
  */  
  incidentPublicDefaultBinding: '*settings.IncidentPublicDefault',

  /**
    @type String
  */  
  incidentNewColorBinding: '*settings.IncidentNewColor',
  
  /**
    @type String
  */
  incidentFeedbackColorBinding: '*settings.IncidentFeedbackColor',

  /**
    @type String
  */
  incidentConfirmedColorBinding: '*settings.IncidentConfirmedColor',

  /**
    @type String
  */
  incidentAssignedColorBinding: '*settings.IncidentAssignedColor',
  
  /**
    @type String
  */
  incidentResolvedColorBinding: '*settings.IncidentResolvedColor',
  
  /**
    @type String
  */
  incidentClosedColorBinding: '*settings.IncidentClosedColor'
  
}) ;

XM.crm = XM.Crm.create();


