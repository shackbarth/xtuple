// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

/** @class

  (Document your Model here)

  @extends XT.Object
  @version 0.1
*/

XM.CrmSettings = XT.Object.extend(XM.Settings,
/** @scope XM.CrmSettings.prototype */ {
  
  className: 'XM.CrmSettings',
  
  privilege: 'ConfigureCRM',
  
  /**
    @type String
  */  
  accountNumberGeneration: null,
    
  /**
    @type Number
  */
  nextAccountNumber: null,

  /**
    @type Number
  */  
  nextIncidentNumber: null,
  
  /**
    @type Boolean
  */
  isUseProjects: null,
 
  /**
    @type Boolean
  */ 
  isAutoCreateProjectsForOrders: null,
  
  /**
    @type Boolean
  */
  isAutoCreateProjectsForOrdersEnabled: function() {
    return this.get('isUseProjects');
  }.property('isUseProjects').cacheable(),
  
  /**
    @type Boolean
  */
  isOpportunityChangeLog: null,

  /**
    @type Boolean
  */  
  isIncidentsPublicPrivate: null,

  /**
    @type Boolean
  */  
  isIncidentPublicDefault: null,

  /**
    @type String
  */  
  incidentNewColor: null,
  
  /**
    @type String
  */
  incidentFeedbackColor: null,

  /**
    @type String
  */
  incidentConfirmedColor: null,

  /**
    @type String
  */
  incidentAssignedColor: null,
  
  /**
    @type String
  */
  incidentResolvedColor: null,
  
  /**
    @type String
  */
  incidentClosedColor: null,
  
  /**
    @type String
  */
  isDefaultAddressCountry: null,

  /**
    @type Boolean
  */
  isStrictAddressCountry: null,
  
  /**
    @type Boolean
  */
  isStrictAddressCountryEnabled: function() {
    var isStrict = this.get('isStrictAddressCountry'),
        isChanged = XT.session.getPath('settings.changed').indexOf('StrictAddressCountry') > 0;
    
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
        isChanged = XT.session.getPath('settings.changed').indexOf('StrictAddressCountry') > 0;
    
    // strict setting is irreversible once turned on and committed
    if(isStrict && !isChanged) this.set('isStrictAddressCountry', true);
  }.observes('isStrictAddressCountry'),
  
  init: function() {
    arguments.callee.base.apply(this, arguments);

    // bind all the properties to settings
    var settings = this.get('settings');
    SC.Binding.from('*settings.CRMAccountNumberGeneration', XT.session).to('accountNumberGeneration', this).noDelay().connect();
    SC.Binding.from('*settings.NextCRMAccountNumber', XT.session).to('nextAccountNumber', this).noDelay().connect();
    SC.Binding.from('*settings.NextIncidentNumber', XT.session).to('nextIncidentNumber', this).noDelay().connect();
    SC.Binding.from('*settings.UseProjects', XT.session).to('isUseProjects', this).noDelay().connect();
    SC.Binding.from('*settings.AutoCreateProjectsForOrders', XT.session).to('isAutoCreateProjectsForOrders', this).noDelay().connect();
    SC.Binding.from('*settings.OpportunityChangeLog', XT.session).to('isOpportunityChangeLog', this).noDelay().connect();
    SC.Binding.from('*settings.IncidentsPublicPrivate', XT.session).to('isIncidentsPublicPrivate', this).noDelay().connect();
    SC.Binding.from('*settings.IncidentPublicDefault', XT.session).to('isIncidentPublicDefault', this).noDelay().connect();
    SC.Binding.from('*settings.IncidentNewColor', XT.session).to('incidentNewColor', this).noDelay().connect();
    SC.Binding.from('*settings.IncidentFeedbackColor', XT.session).to('incidentFeedbackColor', this).noDelay().connect();
    SC.Binding.from('*settings.IncidentConfirmedColor', XT.session).to('incidentConfirmedColor', this).noDelay().connect();
    SC.Binding.from('*settings.IncidentAssignedColor', XT.session).to('incidentAssignedColor', this).noDelay().connect();
    SC.Binding.from('*settings.IncidentResolvedColor', XT.session).to('incidentResolvedColor', this).noDelay().connect();
    SC.Binding.from('*settings.IncidentClosedColor', XT.session).to('incidentClosedColor', this).noDelay().connect();
    SC.Binding.from('*settings.DefaultAddressCountry', XT.session).to('isDefaultAddressCountry', this).noDelay().connect();
    SC.Binding.from('*settings.StrictAddressCountry', XT.session).to('isStrictAddressCountry', this).noDelay().connect();
  }
  
}) ;

XM.crmSettings = XM.CrmSettings.create();


