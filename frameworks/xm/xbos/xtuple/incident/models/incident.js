// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_incident');
sc_require('mixins/core_documents');
sc_require('mixins/document');

/**
  @class

  @extends XM._Incident
  @extends XM.CoreDocuments
  @extends XM.Document
*/
XM.Incident = XM._Incident.extend(XM.Document, XM.CoreDocuments,
  /** @scope XM.Incident.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    @type String
  */
  incidentStatus: SC.Record.attr(String, {
    defaultValue: 'N'
  }),
  
  /**
    @type XM.UserAccountInfo
  */
  owner: SC.Record.toOne('XM.UserAccountInfo', {
    isNested: true,
    defaultValue: function() {
      return XM.DataSource.session.userName;
    }
  }),
  
  /* @private */
  _accountsLength: 0,
  
  /* @private */
  _accountsLengthBinding: SC.Binding.from('.incidents.length').noDelay(),
  
  /* @private */
  _incidentsLength: 0,
  
  /* @private */
  _incidentsLengthBinding: SC.Binding.from('.incidents.length').noDelay(),

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  
  validate: function() {
    var account = this.get('account'),
        contact = this.get('contact'),
        errors = this.get('validateErrors'),
        accountErr = XM.errors.findProperty('code', 'xt1005'),
        contactErr = XM.errors.findProperty('code', 'xt1006');

    // Validate Account
    this.updateErrors(accountErr, !(account));
    
    // Validate Contact
    this.updateErrors(contactErr, !(contact));

    return errors;
  }.observes('account', 'contact'),
  
  /* @private */
  _assignedToDidChange: function() {
    var assignedTo = this.get('assignedTo'),
        status = this.get('status');
     
    if(status & SC.Record.READY && assignedTo) this.set('incidentStatus','A');
  }.observes('assignedTo'),
  
  /* @private */
  _accountsDidChange: function() {
    var documents = this.get('documents'),
        accounts = this.get('accounts');

    documents.addEach(accounts);    
  }.observes('accountsLength'),
  
  /* @private */
  _incidentsDidChange: function() {
    var documents = this.get('documents'),
        incidents = this.get('incidents');

    documents.addEach(incidents);    
  }.observes('incidentsLength'),

});
