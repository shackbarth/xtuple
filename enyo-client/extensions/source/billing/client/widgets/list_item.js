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
      inCell.setContent((posted ? '_posted' : '_notPosted').loc());
      inCell.addRemoveClass('isPosted', posted);
    },

    formatFundsType: function (inModel, inCell) {
      var fundsType = XM.fundsTypes.get(inModel.get('fundsType'));
      inCell.setContent(('_' + fundsType).loc());
      inCell.setContent('hello');
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
};
