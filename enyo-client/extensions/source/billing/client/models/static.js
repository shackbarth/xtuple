XT.extensions.billing.initStaticModels = function () {
  'use strict';
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
   * Bi-directional mapping of Funds Types
   */
  XM.FundsTypeEnum = {
    CHECK:             'C',
    CERTIFIED_CHECK:   'T',
    CASH:              'K',
    MASTERCARD:        'M',
    VISA:              'V',
    AMERICAN_EXPRESS:  'A',
    DISCOVER:          'D',
    OTHER_CREDIT_CARD: 'R',
    WIRE_TRANSFER:     'W',
    OTHER:             'O'
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
      return _.contains([ 'M', 'V', 'A', 'D', 'R' ], this.get('code'));
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
    APPLY_BALANCE_TO_CREDIT_MEMO:      false,
    APPLY_BALANCE_TO_CUSTOMER_DEPOSIT: true
  };

  XM.cashReceiptApplyOptions = new XM.EnumMapCollection(
    XM.CashReceiptApplyOptionEnum
  );
};
