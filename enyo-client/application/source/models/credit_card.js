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
  XM.CreditCard = XM.Model.extend({
    /** @scope XM.CreditCard.prototype */

    recordType: 'XM.CreditCard',

    idAttribute: "uuid",

    defaults: {
      isActive: true
    },

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('statusChange', this.statusDidChange);
    },

    // clientType must not be editable once first saved.
    statusDidChange: function () {
      var that = this,
        uneditableAttributes = ["name", "address1", "address2", "city", "state",
          "zip", "country", "monthExpired", "yearExpired", "creditCardType", "number"];

      _.each(uneditableAttributes, function (attr) {
        that.setReadOnly(attr, that.getStatus() !== XM.Model.READY_NEW);
      });
    }
  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.CreditCardCollection = XM.Collection.extend({
    /** @scope XM.CreditCardCollection.prototype */

    model: XM.CreditCard

  });

}());

