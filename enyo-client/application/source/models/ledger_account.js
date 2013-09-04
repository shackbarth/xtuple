/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global Globalize:true, XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @namespace

    A mixin shared by ledger account models that share common account type
    functionality.
  */
  XM.LedgerAccountTypeMixin = {
    /** @scope XM.IncidentStatus */

    /**
    Returns accountType as a localized string.

    @returns {String}
    */
    getAccountTypeString: function () {
      var K = XM.LedgerAccount,
        accountType = this.get('accountType');
      if (accountType === K.ASSET) {
        return '_asset'.loc();
      }
      if (accountType === K.LIABILITY) {
        return '_liability'.loc();
      }
      if (accountType === K.REVENUE) {
        return '_revenue'.loc();
      }
      if (accountType === K.EXPENSE) {
        return '_expense'.loc();
      }
      if (accountType === K.EQUITY) {
        return '_equity'.loc();
      }
    }

  };

  /**
    @class

    @extends XM.Model
  */
  XM.LedgerAccount = XM.Model.extend({
    /** @scope XM.Incident.prototype */

    recordType: 'XM.LedgerAccount'

  });

  _.extend(XM.LedgerAccount, {
    /** @scope XM.LedgerAccount */

    /**
      Asset Account type.

      @static
      @constant
      @type String
      @default A
    */
    ASSET: 'A',

    /**
      Liability account type.

      @static
      @constant
      @type String
      @default L
    */
    LIABILITY: 'L',

    /**
      Revenue account type.

      @static
      @constant
      @type String
      @default R
    */
    REVENUE: 'R',

    /**
      Expense account type.

      @static
      @constant
      @type String
      @default E
    */
    EXPENSE: 'E',

    /**
      Equity account type.

      @static
      @constant
      @type String
      @default Q
    */
    EQUITY: 'Q'


  });

  // Ledger Account Type mixin
  XM.LedgerAccount = XM.LedgerAccount.extend(XM.LedgerAccountTypeMixin);

  /**
    @class

    @extends XM.Info
  */
  XM.LedgerAccountRelation = XM.Info.extend({
    /** @scope XM.LedgerAccountRelation.prototype */

    recordType: 'XM.LedgerAccountRelation',

    editableModel: 'XM.LedgerAccount'

  });

  // Ledger Account Type mixin
  XM.LedgerAccountRelation = XM.LedgerAccountRelation.extend(XM.LedgerAccountTypeMixin);

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.LedgerAccountRelationCollection = XM.Collection.extend({
    /** @scope XM.LedgerAccountRelationCollection.prototype */

    model: XM.LedgerAccountRelation

  });

}());

