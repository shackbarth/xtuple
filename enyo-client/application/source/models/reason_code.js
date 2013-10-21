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
  XM.ReasonCode = XM.Document.extend({
    /** @scope XM.ReasonCode.prototype */

    recordType: 'XM.ReasonCode',

    documentKey: 'code',

    enforceUpperKey: false

  });

  _.extend(XM.ReasonCode, /** @lends XM.ReasonCode# */{

    // ..........................................................
    // CONSTANTS
    //

    /**
      @static
      @constant
      @type String
      @default "ARCM"
    */
    CREDIT_MEMO: "ARCM",

    /**
      @static
      @constant
      @type String
      @default "ARDM"
    */
    DEBIT_MEMO: "ARDM",

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.ReasonCodeCollection = XM.Collection.extend({
    /** @scope XM.ReasonCodeCollection.prototype */

    model: XM.ReasonCode

  });

}());