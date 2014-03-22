/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  XT.extensions.billing.initStaticModels = function () {
    // These are hard coded collections that may be turned into tables at a later date
    var i, K;

    // Receivable Types
    K = XM.Receivable;
    var receivableTypeJson = [
      { id: K.INVOICE, name: "_invoice".loc() },
      { id: K.DEBIT_MEMO, name: "_debitMemo".loc() },
      { id: K.CREDIT_MEMO, name: "_creditMemo".loc() },
      { id: K.CUSTOMER_DEPOSIT, name: "_customerDeposit".loc() }
    ];
    XM.ReceivableTypeModel = Backbone.Model.extend({});
    XM.ReceivableTypeCollection = Backbone.Collection.extend({
      model: XM.ReceivableTypeModel
    });
    XM.receivableTypes = new XM.ReceivableTypeCollection();
    for (i = 0; i < receivableTypeJson.length; i++) {
      var receivableType = new XM.ReceivableTypeModel(receivableTypeJson[i]);
      XM.receivableTypes.add(receivableType);
    }

    /**
    * @enum
    * Funds Types
    */
    XM.FundsTypeEnum = {
      C: 'CHECK',
      T: 'CERTIFIED_CHECK',
      K: 'CASH',
      M: 'MASTERCARD',
      V: 'VISA',
      A: 'AMERICAN_EXPRESS',
      D: 'DISCOVER',
      R: 'OTHER_CREDIT_CARD',
      W: 'WIRE_TRANSFER',
      O: 'OTHER'
    };

    /**
    * @class XM.FundsType
    * @extends Backbone.Model
    */
    XM.FundsType = XM.StaticModel.extend({

      /**
       * Returns true if the given fundsType is a credit card type, false
       * otherwise.
       */
      isCreditCard: function () {
        return _.contains([ 'M', 'V', 'A', 'D', 'R' ], this.id);
      }
    });

    XM.fundsTypes = new XM.EnumMapCollection(
      XM.FundsTypeEnum, { model: XM.FundsType }
    );

    /**
     * @enum
     * Cash Receipt Balance Application Options.
     */
    XM.CashReceiptApplyOptionEnum = {
      0: 'APPLY_BALANCE_TO_CREDIT_MEMO',
      1: 'APPLY_BALANCE_TO_CUSTOMER_DEPOSIT'
    };

    XM.cashReceiptApplyOptions = new XM.EnumMapCollection(
      XM.CashReceiptApplyOptionEnum
    );
  };
}());
