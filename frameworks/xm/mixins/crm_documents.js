// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// =========================================================================
/*globals XM */

/** @mixin

  ** Note - Always use as a supplement to XM.CoreDocuments **

  Support for crm document assignments on models
  including incidents, projects, opportunities, and toDos.
  
*/

XM.CrmDocuments = {
  
  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
  A set of all the document assignments on this record
  
  @type SC.Set
  */
  documents: function(key, value) {
    if(value) { 
      this._documents = value;
    } else if(!this._documents) { 
      this._documents = SC.Set.create(); 
    }
    
    return this._documents;
  }.property().cacheable(),
  
  // ..........................................................
  // PRIVATE
  //
  
  /* @private */
  incidentsLength: 0,
  
  /* @private */
  incidentsLengthBinding: SC.Binding.from('.incidents.length').noDelay(),
  
  /* @private */
  projectsLength: 0,
  
  /* @private */
  projectsLengthBinding: SC.Binding.from('.projects.length').noDelay(),
  
  /* @private */
  opportunitiesLength: 0,
  
  /* @private */
  opportunitiesLengthBinding: SC.Binding.from('.opportunities.length').noDelay(),
  
  /* @private */
  toDosLength: 0,
  
  /* @private */
  toDosLengthBinding: SC.Binding.from('.toDos.length').noDelay(),
  
  //..................................................
  // OBSERVERS
  //
  
  /* @private */
  _xm_incidentsDidChange: function() {
    var documents = this.get('documents'),
        incidents = this.get('incidents');

    documents.addEach(incidents);    
  }.observes('incidentsLength'),
  
  /* @private */
  _xm_projectsDidChange: function() {
    var documents = this.get('documents'),
        projects = this.get('projects');

    documents.addEach(projects);  
  }.observes('projectsLength'),
  
  /* @private */
  _xm_opportunitiesDidChange: function() {
    var documents = this.get('documents'),
        opportunities = this.get('opportunities');

    documents.addEach(opportunities);  
  }.observes('opportunitiesLength'),
  
  /* @private */
  _xm_toDosDidChange: function() {
    var documents = this.get('documents'),
        toDos = this.get('toDos');

    documents.addEach(toDos);    
  }.observes('toDosLength')
  
};
