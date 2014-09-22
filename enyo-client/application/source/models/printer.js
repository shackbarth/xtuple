/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Model
  */
  XM.Printer = XM.Model.extend({
    /** @scope XM.Printer.prototype */

    recordType: 'XM.Printer',

    numberKey: 'code'

  });

  // ..........................................................
  // COLLECTIONS
  //

  XM.PrinterCollection = XM.Collection.extend({
    /** @scope XM.PrinterCollection.prototype */

    model: XM.Printer

  });

}());
