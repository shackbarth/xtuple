/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.SalesRep = XM.AccountDocument.extend({
    /** @scope XM.SalesRep.prototype */

    recordType: 'XM.SalesRep',

    defaults: {
      isActive: true,
      commission: 0
    }

  });

}());
