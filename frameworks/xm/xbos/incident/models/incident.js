// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('xbos/__generated__/_incident');

/**
  @class

  @extends XM._Incident
  @extends XM.CoreDocuments
*/
XM.Incident = XM._Incident.extend( XM.CoreDocuments,
  /** @scope XM.Incident.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  /**
  @field
  @type Boolean
  */
  isActive:  function() {
    var status = this.get('incidentStatus');
    if (status) { return status !== 'L'; }

    return NO;
  }.property('incidentStatus').cacheable()

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

  
  /* @private */
  _incidentsLength: 0,
  
  /* @private */
  _incidentsLengthBinding: '.incidents.length',
  
  /* @private */
  _incidentsDidChange: function() {
    var documents = this.get('documents'),
        incidents = this.get('incidents');

    documents.addEach(incidents);    
  }.observes('incidentsLength'),

});
