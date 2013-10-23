/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.BankAccount = XM.Document.extend({
    /** @scope XM.BankAccount.prototype */

    recordType: 'XM.BankAccount',

    documentKey: 'name',

    enforceUpperKey: false,

    defaults: function () {
      return {
        bankAccountType: XM.BankAccount.CASH,
        currency: XT.baseCurrency(),
        isUsedByBilling: false,
        isUsedByPayments: false
      };
    },

    bindEvents: function (attributes, options) {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('statusChange', this.statusDidChange);
    },

    /**
      The currency attribute should be read only when a bank account
      is loaded from the database for editing.
    */
    statusDidChange: function () {
      if (this.getStatus() === XM.Model.READY_CLEAN) {
        this.setReadOnly("currency");
      }
    }
  });

  /**
    @class

    @extends XM.Info
  */
  XM.BankAccountRelation = XM.Info.extend({
    /** @scope XM.BankAccountRelation.prototype */

    recordType: 'XM.BankAccountRelation',

    editableModel: 'XM.BankAccount'

  });

  _.extend(XM.BankAccount, /** @lends XM.BankAccount# */{

    // ..........................................................
    // CONSTANTS
    //

    /**
      @static
      @constant
      @type String
      @default "C"
    */
    CASH: 'C',

    /**
      @static
      @constant
      @type String
      @default "K"
    */
    CHECKING: 'K',

    /**
      @static
      @constant
      @type String
      @default "R"
    */
    CREDIT_CARD: 'R',

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

  /**
    @class

    @extends XM.Collection
  */
  XM.BankAccountRelationCollection = XM.Collection.extend({
    /** @scope XM.BankAccountRelationCollection.prototype */

    model: XM.BankAccountRelation

  });

}());