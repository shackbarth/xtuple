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

