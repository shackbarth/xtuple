/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.AccountToDo = XM.Model.extend(
    /** @scope XM.AccountToDo.prototype */ {

    recordType: 'XM.AccountToDo',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountIncident = XM.Model.extend(
    /** @scope XM.AccountIncident.prototype */ {

    recordType: 'XM.AccountIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountOpportunity = XM.Model.extend(
    /** @scope XM.AccountOpportunity.prototype */ {

    recordType: 'XM.AccountOpportunity',

    isDocumentAssignment: true

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.AccountProject = XM.Model.extend(
    /** @scope XM.AccountProject.prototype */ {

    recordType: 'XM.AccountProject',

    isDocumentAssignment: true

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.ContactToDo = XM.Model.extend(
    /** @scope XM.ContactToDo.prototype */ {

    recordType: 'XM.ContactToDo',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactIncident = XM.Model.extend(
    /** @scope XM.ContactIncident.prototype */ {

    recordType: 'XM.ContactIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactOpportunity = XM.Model.extend(
    /** @scope XM.AccountOpportunity.prototype */ {

    recordType: 'XM.ContactOpportunity',

    isDocumentAssignment: true

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.ContactProject = XM.Model.extend(
    /** @scope XM.ContactProject.prototype */ {

    recordType: 'XM.ContactProject',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentOpportunity = XM.Model.extend(
    /** @scope XM.IncidentOpportunity.prototype */ {

    recordType: 'XM.IncidentOpportunity',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentProject = XM.Model.extend(
    /** @scope XM.IncidentProject.prototype */ {

    recordType: 'XM.IncidentProject',

    isDocumentAssignment: true

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityIncident = XM.Model.extend(
    /** @scope XM.OpportunityIncident.prototype */ {

    recordType: 'XM.OpportunityIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityToDo = XM.Model.extend(
    /** @scope XM.OpportunityToDo.prototype */ {

    recordType: 'XM.OpportunityToDo',

    isDocumentAssignment: true

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.OpportunityProject = XM.Model.extend(
    /** @scope XM.OpportunityProject.prototype */ {

    recordType: 'XM.OpportunityProject',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.IncidentToDo = XM.Model.extend(
    /** @scope XM.IncidentToDo.prototype */ {

    recordType: 'XM.IncidentToDo',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectIncident = XM.Model.extend(
    /** @scope XM.ProjectIncident.prototype */ {

    recordType: 'XM.ProjectIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectOpportunity = XM.Model.extend(
    /** @scope XM.ProjectOpportunity.prototype */ {

    recordType: 'XM.ProjectOpportunity',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ProjectToDo = XM.Model.extend(
    /** @scope XM.ProjectToDo.prototype */ {

    recordType: 'XM.ProjectToDo',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ToDoIncident = XM.Model.extend(
    /** @scope XM.ToDoIncident.prototype */ {

    recordType: 'XM.ToDoIncident',

    isDocumentAssignment: true

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.ToDoOpportunity = XM.Model.extend(
    /** @scope XM.ToDoOpportunity.prototype */ {

    recordType: 'XM.ToDoOpportunity',

    isDocumentAssignment: true

  });
  
  /**
    @class

    @extends XM.Model
  */
  XM.ToDoProject = XM.Model.extend(
    /** @scope XM.ToDoProject.prototype */ {

    recordType: 'XM.ToDoProject',

    isDocumentAssignment: true

  });
  

}());
