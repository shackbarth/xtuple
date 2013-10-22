/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initSettings = function () {
    /**
      @class

      @extends XM.Settings
    */
    XM.Manufacturing = XM.Settings.extend(/** @lends XM.Manufacturing.Settings.prototype */ {

      recordType: 'XM.Manufacturing',

      privileges: 'ConfigureWO',

      validate: function (attributes, options) {
        // XXX not sure if number widgets can fail in this way.
        var params = { type: "_number".loc() };
        if (attributes.NextWorkOrderNumber !== undefined &&
            isNaN(attributes.NextWorkOrderNumber)) {
          params.attr = "_workOrder".loc() + " " + "_number".loc();
          return XT.Error.clone('xt1003', { params: params });
        }
      }
    });

    XM.manufacturing = new XM.Manufacturing();

  };

}());
