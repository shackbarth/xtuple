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
  XM.Form = XM.Model.extend({
    /** @scope XM.Form.prototype */

    recordType: 'XM.Form',

    numberKey: 'name',

    // Add meta for Report and call function to return object.
    initialize: function (attributes, options) {
      var that = this,
        reports;
      XM.Model.prototype.initialize.apply(this, arguments);

      // Call function on server to get object. reports = 

      this.meta = new Backbone.Model(reports);

      this.meta.on("change", this.metaChanged());
    },

  });

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

  /**
    @class

    @extends XM.Collection
  */
  XM.FormCollection = XM.Collection.extend({
    /** @scope XM.FormCollection.prototype */

    model: XM.Form

  });

  XM.PrinterCollection = XM.Collection.extend({
    /** @scope XM.PrinterCollection.prototype */

    model: XM.Printer

  });

}());
