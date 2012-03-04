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
  
  privilege: 'ConfigureCRM',
  
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
  autoCreateProjectsForOrdersIsEnabled: function() {
    return this.get('useProjects');
  }.property('useProjects').cacheable(),
  
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
  strictAddressCountryIsEnabled: function() {
    var isStrict = this.get('strictAddressCountry'),
        isChanged = XM.session.getPath('settings.changed').indexOf('strictAddressCountry') > 0;
    
    // strict setting is irreversible once turned on and committed
    return isStrict && !isChanged ? false : true;
  }.property('strictAddressCountry').cacheable(),

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
  incidentClosedColorBinding: '*settings.IncidentClosedColor',
  
  // ..........................................................
  // OBSERVERS
  //
  
  useProjectsDidChange: function() {
    if(!this.get('useProjects')) this.set('autoCreateProjectsForOrders', false);
  }.observes('useProjects', 'autoCreateProjectsForOrders'),
  
  strictAddressCountryDidChange: function() {
    var isStrict = this.get('strictAddressCountry'),
        isChanged = XM.session.getPath('settings.changed').indexOf('strictAddressCountry') > 0;
    
    // strict setting is irreversible once turned on and committed
    if(isStrict && !isChanged) this.set('strictAddressCountry', true);
  }.observes('strictAddressCountry')
  
}) ;

XM.crm = XM.Crm.create();


