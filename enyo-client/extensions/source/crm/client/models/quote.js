/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initQuoteModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.QuoteToDoRelation = XM.Info.extend(
      /** @scope XM.QuoteToDoRelation.prototype */ {

      recordType: 'XM.QuoteToDoRelation',
      
      editableModel: 'XM.ToDo'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.QuoteIncidentRelation = XM.Info.extend(
      /** @scope XM.QuoteIncidentRelation.prototype */ {

      recordType: 'XM.QuoteIncidentRelation',
      
      editableModel: 'XM.Incident'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.QuoteOpportunityRelation = XM.Info.extend(
      /** @scope XM.QuoteOpportunityRelation.prototype */ {

      recordType: 'XM.QuoteOpportunityRelation',
      
      editableModel: 'XM.Opportunity'

    });
  };

}());
