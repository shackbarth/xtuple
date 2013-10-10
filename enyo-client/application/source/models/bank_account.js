/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.BankAccount = XM.Document.extend({
    /** @scope XM.BankAccount.prototype */

    recordType: 'XM.BankAccount',

    documentKey: 'code',

    enforceUpperKey: false

  });

  _.extend(XM.BankAccount, /** @lends XM.ReasonCode# */{

    // ..........................................................
    // CONSTANTS
    //

    /**
      @static
      @constant
      @type String
      @default ""
    */
    //: "",P

    /**
      @static
      @constant
      @type String
      @default ""
    */
    //: "",

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.BankAccountCollection = XM.Collection.extend({
    /** @scope XM.BankAccountCollection.prototype */

    model: XM.BankAccount

  });

}());