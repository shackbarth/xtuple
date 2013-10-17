XT.extensions.billing.initSalesCategoryView = function () {

  /**
   * View of a SalesCategory business object.
   * @author travis@xtuple.com
   */
  XM.SalesCategoryView = XM.EnyoView.extend({

    events: {
      'change:canDeactivate': 'onCanDeactivateChanged',
      'change:isActive': 'onIsActiveChanged'
    },

    item: {
      template: [
        [ {attr: 'name'}, {attr: 'description'} ]
      ],
      //actions:

    },

    list: {
      // query
      // TODO
    },

    workspace: {
      // TODO
    }

  });

};
