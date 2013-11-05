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
      var posted = inModel.get('posted');
      inCell.setContent(posted ? 'POSTED' : 'NOT POSTED');
      inCell.addRemoveClass('isPosted', posted);
    },

    formatFundsType: function (inModel, inCell) {
      var fundsType = XM.FundsTypes[inModel.get('fundsType')];

      inCell.setContent(('_' + fundsType).loc());
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
