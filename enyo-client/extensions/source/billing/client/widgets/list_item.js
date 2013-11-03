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
      inCell.setContent(inModel.get('isPosted') ? 'POSTED' : 'NOT POSTED');
    },

    formatFundsType: function (inModel, inCell) {
      inCell.setContent(XM.FundsType[inModel.get('fundsType')]);
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
};
