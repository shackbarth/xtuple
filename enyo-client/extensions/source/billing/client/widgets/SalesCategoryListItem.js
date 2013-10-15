XT.extensions.billing.initSalesCategoryListItem = function () {

  /**
   * Sales Category List Item Widget.
   * @author travis@xtuple.com
   */
  enyo.kind({
    name: 'XV.SalesCategoryListItem',
    kind: 'XV.ListItem',
    modelView: 'SalesCategoryView',

    /**
     * @see XM.SalesCategoryView
     * @listens XM.SalesCategoryView#events
     */
    handlers: {
      onCanDeactivateChange: 'canDeactivateChanged',
      onIsActiveChange:      'isActiveChanged',
    },

    /**
     * @listens onCanDeactivateChange
     */
    canDeactivateChanged: function (inModel, inValue) {
      this.log(arguments);
    },

    /**
     * @listens onIsActiveChange
     */
    isActiveChanged: function (inModel, inValue) {
      this.log(arguments);
    }

  });
};
