/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initAccountModels = function () {
    
    XM.Account.prototype.roleAttributes.push("customer");
    XM.Account.prototype.roleAttributes.push("prospect");
    
    /**
      @class

      @extends XM.Model
    */
    XM.AccountCustomer = XM.Model.extend(
      /** @scope XM.AccountCustomer.prototype */ {

      recordType: 'XM.AccountCustomer',

      isDocumentAssignment: true

    });

  };

}());
