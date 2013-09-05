/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.crm.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Crm = XM.Settings.extend(
      /** @scope XM.Crm.Settings.prototype */ {

      recordType: 'XM.Crm',
      
      privileges: 'ConfigureCRM',
      
      validate: function (attributes, options) {
        var params = { type: "_number".loc() };
        if (attributes.NextCRMAccountNumber !== undefined &&
            isNaN(attributes.NextCRMAccountNumber)) {
          params.attr = "_account".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        } else if (attributes.NextIncidentNumber &&
            isNaN(attributes.NextIncidentNumber)) {
          params.attr = "_incident".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        }
      }

    });
    
    XM.crm = new XM.Crm();

  };

}());
