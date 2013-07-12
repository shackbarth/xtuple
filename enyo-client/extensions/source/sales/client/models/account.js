/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.sales.initAccountModels = function () {
    
    var proto = XM.Account.prototype;
    proto.roleAttributes.push("customer");
    proto.roleAttributes.push("prospect");
    
    // Disable prospect if account is a customer.
    var fn = proto.initialize;
    proto.initialize = function () {
      fn.apply(this, arguments);
      this.on("change:customer", this.customerChanged);
    };

    proto.customerChanged = function () {
      var hasCustomer = this.get("customer") ? true : false;
      this.setReadOnly("prospect", hasCustomer);
    };

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
