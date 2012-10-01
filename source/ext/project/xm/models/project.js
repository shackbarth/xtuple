/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.project.initProjectModels = function () {
  
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
  };

}());
