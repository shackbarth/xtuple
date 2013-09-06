/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initCustomerModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.CustomerContactRelation = XM.Info.extend(
      /** @scope XM.CustomerContactRelation.prototype */ {

      recordType: 'XM.CustomerContactRelation',
      
      editableModel: 'XM.Contact'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.CustomerToDoRelation = XM.Info.extend(
      /** @scope XM.CustomerToDoRelation.prototype */ {

      recordType: 'XM.CustomerToDoRelation',
      
      editableModel: 'XM.ToDo'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.CustomerIncidentRelation = XM.Info.extend(
      /** @scope XM.CustomerIncidentRelation.prototype */ {

      recordType: 'XM.CustomerIncidentRelation',
      
      editableModel: 'XM.Incident'

    });

    /**
      @class

      @extends XM.Model
    */
    XM.CustomerOpportunityRelation = XM.Info.extend(
      /** @scope XM.CustomerOpportunityRelation.prototype */ {

      recordType: 'XM.CustomerOpportunityRelation',
      
      editableModel: 'XM.Opportunity'

    });
  };

}());
