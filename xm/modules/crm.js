/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XT.Model
  */
  XM.ProjectIncident = XT.Model.extend(
    /** @scope XM.ProjectIncident.prototype */ {

    recordType: 'XM.ProjectIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XT.Model
  */
  XM.ProjectOpportunity = XT.Model.extend(
    /** @scope XM.ProjectOpportunity.prototype */ {

    recordType: 'XM.ProjectOpportunity',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XT.Model
  */
  XM.ProjectToDo = XT.Model.extend(
    /** @scope XM.ProjectToDo.prototype */ {

    recordType: 'XM.ProjectToDo',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XT.Model
  */
  XM.ToDoIncident = XT.Model.extend(
    /** @scope XM.ToDoIncident.prototype */ {

    recordType: 'XM.ToDoIncident',

    isDocumentAssignment: true

  });

}());
