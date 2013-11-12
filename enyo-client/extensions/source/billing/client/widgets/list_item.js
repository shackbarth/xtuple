XT.extensions.billing.initSalesCategoryListItem = function () {

  /**
   * Sales Category List Item Widget.
   * @author travis@xtuple.com
   */
  enyo.kind({
    name: 'XV.SalesCategoryListItem',
    kind: 'XV.ListItem',
    view: 'XM.SalesCategoryView'
  });

  /**
   * @mixin XV.CashReceiptFormatters
   */
  XV.CashReceiptFormatters = {

    formatIsPosted: function (inModel, inCell) {
      var posted = inModel.get('isPosted');
      inCell.setContent((posted ? '_isPosted' : '_isNotPosted').loc());
      inCell.addRemoveClass('isPosted', posted);
    },

    formatFundsType: function (inModel, inCell) {
      var fundsType = XM.fundsTypes.get(inModel.get('fundsType'));
      inCell.setContent(fundsType.get('label'));
    }
  };

  /**
   * @class XV.CashReceiptListItem
   */
  enyo.kind(
    enyo.mixin(XV.CashReceiptFormatters, {

      name: 'XV.CashReceiptListItem',
      kind: 'XV.ListItem',
      view: 'XM.CashReceiptView'

    })
  );

  /**
   * @class XV.CashReceiptLineListItem
   */
  enyo.kind(
    enyo.mixin(XV.CashReceiptFormatters, {

      name: 'XV.CashReceiptLineListItem',
      kind: 'XV.ListItem',
      view: 'XM.CashReceiptView'

    })
  );

  /**
   * @class XV.CashReceiptLinePendingListItem
   */
  enyo.kind(
    enyo.mixin(XV.CashReceiptFormatters, {

      name: 'XV.CashReceiptLinePendingListItem',
      kind: 'XV.ListItem',
      view: 'XM.CashReceiptView'

    })
  );
};
