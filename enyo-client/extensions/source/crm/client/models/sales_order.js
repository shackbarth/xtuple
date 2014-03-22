/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initSalesOrderModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderToDoRelation = XM.Info.extend(
      /** @scope XM.SalesOrderToDoRelation.prototype */ {

      recordType: 'XM.SalesOrderToDoRelation',

      editableModel: 'XM.ToDo'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderIncidentRelation = XM.Info.extend(
      /** @scope XM.SalesOrderIncidentRelation.prototype */ {

      recordType: 'XM.SalesOrderIncidentRelation',

      editableModel: 'XM.Incident'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderOpportunityRelation = XM.Info.extend(
      /** @scope XM.SalesOrderOpportunityRelation.prototype */ {

      recordType: 'XM.SalesOrderOpportunityRelation',

      editableModel: 'XM.Opportunity'

    });
  };

}());
