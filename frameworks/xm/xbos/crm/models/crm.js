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
    @type String
  */  
  crmAccountNumberGenerationBinding: '*settings.CRMAccountNumberGeneration',
    
  /**
    @type Number
  */
  nextCRMAccountNumberBinding: '*settings.NextCRMAccountNumber',

  /**
    @type Number
  */  
  nextIncidentNumberBinding: '*settings.NextIncidentNumber',
  
  /**
    @type Boolean
  */
  isUseProjectsBinding: '*settings.UseProjects',
 
  /**
    @type Boolean
  */ 
  isAutoCreateProjectsForOrdersBinding: '*settings.AutoCreateProjectsForOrders',
  
  /**
    @type Boolean
  */
  isAutoCreateProjectsForOrdersEnabled: function() {
    return this.get('isUseProjects');
  }.property('isUseProjects').cacheable(),
  
  /**
    @type Boolean
  */
  isOpportunityChangeLogBinding: '*settings.OpportunityChangeLog',

  /**
    @type Boolean
  */  
  isIncidentsPublicPrivateBinding: '*settings.IncidentsPublicPrivate',

  /**
    @type Boolean
  */  
  isIncidentPublicDefaultBinding: '*settings.IncidentPublicDefault',

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
  
  /**
    @type String
  */
  isDefaultAddressCountryBinding: '*settings.DefaultAddressCountry',

  /**
    @type Boolean
  */
  isStrictAddressCountryBinding: '*settings.StrictAddressCountry',
  
  /**
    @type Boolean
  */
  isStrictAddressCountryEnabled: function() {
    var isStrict = this.get('isStrictAddressCountry'),
        isChanged = XM.session.getPath('settings.changed').indexOf('StrictAddressCountry') > 0;
    
    // strict setting is irreversible once turned on and committed
    return isStrict && !isChanged ? false : true;
  }.property('isStrictAddressCountry').cacheable(),
  
  // ..........................................................
  // OBSERVERS
  //
  
  /** @private */
  _useProjectsDidChange: function() {
    if(!this.get('isUseProjects')) this.set('isAutoCreateProjectsForOrders', false);
  }.observes('isUseProjects', 'isAutoCreateProjectsForOrders'),
  
  /** @private */
  _isStrictAddressCountryDidChange: function() {
    var isStrict = this.get('isStrictAddressCountry'),
        isChanged = XM.session.getPath('settings.changed').indexOf('StrictAddressCountry') > 0;
    
    // strict setting is irreversible once turned on and committed
    if(isStrict && !isChanged) this.set('isStrictAddressCountry', true);
  }.observes('isStrictAddressCountry')
  
}) ;

XM.crm = XM.Crm.create();


